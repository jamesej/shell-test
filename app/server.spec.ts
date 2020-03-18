import {app} from "./server";
import supertest from "supertest";
import assert from 'assert';

const request = supertest(app);

describe('captain visits', async () => {
    const doVisit = async (captain: string, vessel: string, port: string, arrivedWhen: string) => {
        let query = `
            mutation LogArrival($arrival: ArrivalInput) {
                logArrival(arrival: $arrival) {
                    captain
                }
            }
        `;
        let variables = {
            arrival: { captain, vessel, port, arrivedWhen }
        }
        await request.post('/graphql')
            .send({ query, variables })
            .expect(200);
    }

    it('logs visits', async () => {
        await doVisit("Bob", "The Beagle", "Algiers", "2020-01-21T14:29:00Z");
        await doVisit("Karl", "Titanic", "Liverpool", "2019-02-09T09:15:00Z");
        await doVisit("Karl", "Titanic", "Bristol", "2019-02-12T04:26:00Z");
        await doVisit("Bob", "The Beagle", "Gibraltar", "2020-01-20T19:02:00Z");
        await doVisit("Karl", "The Lifeboat", "Reykyavik", "2019-02-21T10:48:00Z");
    });

    it('gets captain visits', async () => {
        let query = `
            query CaptainVisits($captain: String, $vessel: String) {
                captainVisits(captain: $captain, vessel: $vessel) {
                    captain
                    vessel
                    visits {
                        arrivedWhen
                        port
                    }
                }
            }
        `;
        let variables = {
            captain: "Bob",
            vessel: "The Beagle"
        };
        const resp = await request.post('/graphql')
                        .send({ query, variables });
        const val = resp.body.data.captainVisits;
        assert.deepEqual(val, {
            captain: "Bob",
            vessel: "The Beagle",
            visits: [
                {
                    port: "Gibraltar",
                    arrivedWhen: "2020-01-20T19:02:00.000Z"
                },
                {
                    port: "Algiers",
                    arrivedWhen: "2020-01-21T14:29:00.000Z"
                }
            ]
        });
    });

    it('gets all visits', async () => {
        let query = `
            query AllVisits {
                allVisits {
                    captain
                    vessel
                    visits {
                        arrivedWhen
                        port
                    }
                }
            }
        `;
        const resp = await request.post('/graphql')
                        .send({ query });
        const val = resp.body.data.allVisits;
        assert.equal(val.length, 3);
        assert.equal(val[0].vessel, "Titanic");
        assert.equal(val[1].vessel, "The Lifeboat");
        assert.equal(val[2].vessel, "The Beagle");
        assert.equal(val[0].visits.length, 2);
        assert.equal(val[1].visits.length, 1);
        assert.equal(val[2].visits.length, 2);
    });
}); 