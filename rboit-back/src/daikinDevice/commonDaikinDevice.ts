import {
    DaikinGetBasicInfoResponse, DaikinGetNotifyResponse,
    DaikinGetRemoteMethodResponse, DaikinRebootResponse
} from "./daikinResponseTypes";
import {BaseDaikinDevice, DaikinDeviceConfig} from "./baseDaikinDevice";

export class CommonDaikinDevice extends BaseDaikinDevice {
    public constructor(config: DaikinDeviceConfig) {
        super(config);
    }

    public async getCompleteState(): Promise<CommonDaikinDeviceState> {
        return {
            basicInfo: await this.getBasicInfo(),
            remoteMethod: await this.getRemoteMethod(),
            notify: await this.getNotify(),
        };
    }

    public async getBasicInfo(): Promise<DaikinGetBasicInfoResponse> {
        return this.performRequest('/common/basic_info')
            .then(r => r as DaikinGetBasicInfoResponse);
    }

    public async getRemoteMethod(): Promise<DaikinGetRemoteMethodResponse> {
        return this.performRequest('/common/get_remote_method')
            .then(r => r as DaikinGetRemoteMethodResponse);
    }

    public async getNotify(): Promise<DaikinGetNotifyResponse> {
        return this.performRequest('/common/get_notify')
            .then(r => r as DaikinGetNotifyResponse);
    }

    public async reboot(): Promise<DaikinRebootResponse> {
        return this.performRequest('/common/reboot')
            .then(r => r as DaikinRebootResponse);
    }
}

export declare type CommonDaikinDeviceState = {
    basicInfo: DaikinGetBasicInfoResponse;
    remoteMethod: DaikinGetRemoteMethodResponse;
    notify: DaikinGetNotifyResponse;
};
