import * as request from "request";
import {
    DaikinResponse
} from "./daikinResponseTypes";

export class BaseDaikinDevice {
    private config: DaikinDeviceConfig;
    private cache: {
        [endpoint: string]: undefined | {
            cachedAt: Date,
            response: DaikinResponse,
        }
    } = {};

    public constructor(config: DaikinDeviceConfig) {
        if (config.cacheEnabled === undefined) config.cacheEnabled = true;
        if (config.cacheTimeToLive === undefined) config.cacheTimeToLive = 2000;

        this.config = config;
    }

    public async performRequest(endpoint: string): Promise<DaikinResponse> {
        if (!this.config.cacheEnabled) {
            return this.performNonCachedRequest(endpoint);
        }

        const now = new Date();
        const cached = this.cache[endpoint];
        if (cached === undefined || now.getTime() - cached.cachedAt.getTime() > this.config.cacheTimeToLive) {
            const response = await this.performNonCachedRequest(endpoint);
            this.cache[endpoint] = {
                cachedAt: now,
                response: response,
            };
        }

        const response = this.cache[endpoint]?.response;
        if (response === undefined) {
            throw new Error(`Cache for endpoint ${endpoint} is empty, even after re-requesting it.`);
        }

        return response;
    }

    public async performNonCachedRequest(endpoint: string): Promise<DaikinResponse> {
        return this.performRawRequest(endpoint)
            .then(response => this.parseResponse(response));
    }

    private async performRawRequest(endpoint: string): Promise<string> {
        if (endpoint.charAt(0) !== '/') {
            throw new Error('Expected the endpoint to start with a slash.');
        }

        return new Promise((resolve, reject) => {
            request.get(
                `http://${this.config.address}${endpoint}`,
                {
                    headers: {
                        'Host': this.config.address,
                    },
                },
                (err, res) => {
                    if (err || res.statusCode !== 200) {
                        reject(err || new Error(`Received non-200 status code: ${res.statusCode}`));
                    } else {
                        resolve(res.body as string);
                    }
                },
            );
        });
    }

    private parseResponse(response: string): DaikinResponse {
        const res: any = {};

        response.split(',').forEach(entry => {
            const parts = entry.split('=');
            const key = parts[0];
            const value = parts[1];

            if (value === '-') {
                res[key] = undefined;
            } else if (!isNaN(parseFloat(value))) {
                res[key] = parseFloat(value);
            } else {
                res[key] = value;
            }
        });

        if (res.ret === undefined) {
            throw new Error(`Expected ret attribute to be present, but there was no ret attribute in the response. response=${response}`);
        }

        return res as DaikinResponse;
    }
}

export declare type DaikinDeviceConfig = {
    address: string;
    cacheEnabled?: boolean;
    cacheTimeToLive?: number;
};
