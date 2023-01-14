export declare type DaikinResponse = {
    ret: string;
    [key: string]: any;
};

export declare type DaikinGetBasicInfoResponse = {
    ret: string;
    type: string;
    reg: string;
    dst: number;
    ver: number;
    rev: number;
    pow: number;
    err: number;
    location: number;
    name: string;
    icon: number;
    method: string;
    port: number;
    id: string;
    pw: string;
    lwp_flag: number;
    apd_kind: number;
    pv: number;
    cpv: number;
    cpv_minor: number;
    led: number;
    en_setzone: number;
    mac: string;
    adp_mode: string;
    an_hol: number;
    ssid1: string;
    radio1: number;
    ssid: string;
    grp_name: string;
    en_grp: number;
};

export declare type DaikinGetRemoteMethodResponse = {
    ret: string;
    method: string;
    notice_ip_int: number;
    notice_sync_int: number;
};

export declare type DaikinGetNotifyResponse = {
    ret: string;
    auto_off_flg: number;
    auto_off_tm: string;
};

export declare type DaikinRebootResponse = {
    ret: string;
};

export type DaikinGetModelInfoResponse = {
    ret: string;
    model: number;
    type: string;
    pv: number;
    cpv: number;
    cpv_minor: number;
    mid: string;
    humd: number;
    s_humd: number;
    acled: number;
    land: number;
    elec: number;
    temp: number;
    temp_rng: number;
    m_dtct: number;
    ac_dst: string;
    disp_dry: number;
    dmnd: number;
    en_scdltmr: number;
    en_frate: number;
    en_fdir: number;
    s_fdir: number;
    en_rtemp_a: number;
    en_spmode: number;
    en_ipw_sep: number;
    en_mompow: number;
    hmlmt_l: number;
}

export declare type DaikinGetControlInfoResponse = {
    ret: string;
    pow: number;
    mode: number;
    adv: string;
    stemp: number;
    shum: number;
    dt1: number;
    dt2: string;
    dt3: number;
    dt4: number;
    dt5: number;
    dt7: number;
    dh1: string;
    dh2: number;
    dh3: number;
    dh4: number;
    dh5: number;
    dh7: string;
    dhh: number;
    b_mode: number;
    b_stemp: number;
    b_shum: number;
    alert: number;
    f_rate: string;
    f_dir: number;
    b_f_rate: string;
    b_f_dir: number;
    dfr1: number;
    dfr2: number;
    dfr3: number;
    dfr4: string;
    dfr5: string;
    dfr6: number;
    dfr7: number;
    dfrh: number;
    dfd1: number;
    dfd2: number;
    dfd3: number;
    dfd4: number;
    dfd5: number;
    dfd6: number;
    dfd7: number;
    dfdh: number;
    dmnd_run: number;
    en_demand: number;
};

export declare type DaikinGetSensorInfoResponse = {
    ret: string;
    htemp: number;
    hhum: number | undefined;
    otemp: number;
    err: number;
    cmpfreq: number;
    mompow: number;
};

export declare type DaikinGetPriceResponse = {
    ret: string;
    price_int: number;
    price_dec: number;
};

export declare type DaikinGetTargetResponse = {
    ret: string;
    target: number;
};

export declare type DaikinGetWeekPowerResponse = {
    ret: string;
    today_runtime: number;
    datas: number;
};

export declare type DaikinGetYearPowerResponse = {
    ret: string;
    previous_year: number;
    this_year: number;
};
