import {app} from "./server";
import supertest from "supertest";
import assert from 'assert';

const request = supertest(app);

describe('captain visits', async () => {
    it('logs visits', async () => {
        let query = `
            mutation LogArrival($arrival: ArrivalInput) {
                logArrival(arrival: $arrival) {
                    captain
                }
            }
        `;
        let variables = {
            arrival: {
                vessel: "x",
                port: "y",
                arrivedWhen:"2020-01-03T14:29:00Z",
                captain: "bob"
            }
        }
        const resp = await request.post('/graphql')
            .send({ query, variables })
            .expect(200);
    });
}); 