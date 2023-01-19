import {
    DaikinGetModelInfoResponse, DaikinGetControlInfoResponse,
    DaikinGetSensorInfoResponse, DaikinGetPriceResponse,
    DaikinGetTargetResponse, DaikinGetWeekPowerResponse,
    DaikinGetYearPowerResponse, DaikinGetDayPowerEx, DaikinGetWeekPowerEx, DaikinGetYearPowerEx
} from "./daikinResponseTypes";
import {CommonDaikinDevice, CommonDaikinDeviceState} from "./commonDaikinDevice";
import {DaikinDeviceConfig} from "./baseDaikinDevice";

export class AirconditionerDaikinDevice extends CommonDaikinDevice {
    public constructor(config: DaikinDeviceConfig) {
        super(config);
    }

    async getCompleteState(): Promise<AirconditionerDaikinDeviceState> {
        const superState = await super.getCompleteState();
        const thisState = {
            modelInfo: await this.getModelInfo(),
            controlInfo: await this.getControlInfo(),
            sensorInfo: await this.getSensorInfo(),
            price: await this.getPrice(),
            target: await this.getTarget(),
            weekPower: await this.getWeekPower(),
            yearPower: await this.getYearPower(),
        };

        return {...superState, ...thisState};
    }

    public async getModelInfo(): Promise<DaikinGetModelInfoResponse> {
        return this.performRequest('/aircon/get_model_info')
            .then(r => r as DaikinGetModelInfoResponse);
    }

    public async getControlInfo(): Promise<DaikinGetControlInfoResponse> {
        return this.performRequest('/aircon/get_control_info')
            .then(r => r as DaikinGetControlInfoResponse);
    }

    public async getSensorInfo(): Promise<DaikinGetSensorInfoResponse> {
        return this.performRequest('/aircon/get_sensor_info')
            .then(r => r as DaikinGetSensorInfoResponse);
    }

    public async getPrice(): Promise<DaikinGetPriceResponse> {
        return this.performRequest('/aircon/get_price')
            .then(r => r as DaikinGetPriceResponse);
    }

    public async getTarget(): Promise<DaikinGetTargetResponse> {
        return this.performRequest('/aircon/get_target')
            .then(r => r as DaikinGetTargetResponse);
    }

    public async getWeekPower(): Promise<DaikinGetWeekPowerResponse> {
        return this.performRequest('/aircon/get_week_power')
            .then(r => r as DaikinGetWeekPowerResponse);
    }

    public async getYearPower(): Promise<DaikinGetYearPowerResponse> {
        return this.performRequest('/aircon/get_year_power')
            .then(r => r as DaikinGetYearPowerResponse);
    }

    public async getDayPowerEx(): Promise<DaikinGetDayPowerEx> {
        return this.performRequest('/aircon/get_day_power_ex')
            .then(r => r as DaikinGetDayPowerEx);
    }

    public async getWeekPowerEx(): Promise<DaikinGetWeekPowerEx> {
        return this.performRequest('/aircon/get_week_power_ex')
            .then(r => r as DaikinGetWeekPowerEx);
    }

    public async getYearPowerEx(): Promise<DaikinGetYearPowerEx> {
        return this.performRequest('/aircon/get_year_power_ex')
            .then(r => r as DaikinGetYearPowerEx);
    }
}

export declare type AirconditionerDaikinDeviceState = CommonDaikinDeviceState & {
    modelInfo: DaikinGetModelInfoResponse;
    controlInfo: DaikinGetControlInfoResponse;
    sensorInfo: DaikinGetSensorInfoResponse;
    price: DaikinGetPriceResponse;
    target: DaikinGetTargetResponse;
    weekPower: DaikinGetWeekPowerResponse;
    yearPower: DaikinGetYearPowerResponse;
};
