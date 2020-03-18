import { Arrival, CaptainVesselVisits } from "./arrival";

export interface DataStore {
    addArrival(arrival: Arrival): void;
    captainVisits(captain: string, vessel: string): CaptainVesselVisits;
    allVisits(): CaptainVesselVisits[];
}

class MemoryDataStore implements DataStore {
    arrivals: Arrival[] = [];

    addArrival(arrival: Arrival): void {
        let insertPos = 0;
        while (insertPos < this.arrivals.length && this.arrivals[insertPos].arrivedWhen < arrival.arrivedWhen) {
            insertPos++;
        }
        this.arrivals.splice(insertPos, 0, arrival);
    }

    captainVisits(captain: string, vessel: string): CaptainVesselVisits {
        const cvVisits = {
            captain,
            vessel,
            visits: this.arrivals
                .filter(arrival => arrival.captain === captain && arrival.vessel === vessel)
                .map(({ arrivedWhen, port }) => ({ arrivedWhen, port }))
        };
        return cvVisits;
    }

    allVisits(): CaptainVesselVisits[] {
        type CaptainVesselDict = { [ captainVessel: string ]: CaptainVesselVisits };

        const dict = this.arrivals.reduce((dict, { captain, vessel, arrivedWhen, port }) => {
            const captainVessel = `${captain}|${vessel}`;
            if (dict[captainVessel]) {
                dict[captainVessel].visits.push({ arrivedWhen, port });
            } else {
                dict[captainVessel] = { captain, vessel, visits: [ { arrivedWhen, port } ] };
            };
            return dict;
        }, {} as CaptainVesselDict);

        return Object.values(dict);
    }
}

export const dataStore: DataStore = new MemoryDataStore();