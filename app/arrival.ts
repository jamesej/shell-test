export interface Arrival {
    vessel: string;
    arrivedWhen: Date;
    port: string;
    captain: string;
}

export interface Visit {
    arrivedWhen: Date;
    port: string;
}

export interface CaptainVesselVisits {
    captain: string;
    vessel: string;
    visits: Visit[];
}