import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { Arrival } from './arrival';
import { dataStore } from './dataStore';

const schema = buildSchema(`
    scalar DateTime

    type Query {
        captainVisits(captain: String, vessel: String): CaptainVesselVisits
        allVisits: [CaptainVesselVisits]
    }
    type Mutation {
        logArrival(arrival: ArrivalInput): Arrival
    }
    type Arrival {
        vessel: String!,
        arrivedWhen: DateTime!,
        port: String!,
        captain: String!
    }
    type Visit {
        arrivedWhen: DateTime!,
        port: String!
    }
    type CaptainVesselVisits {
        captain: String!,
        vessel: String!,
        visits: [Visit!]
    }
    input ArrivalInput {
        vessel: String!,
        arrivedWhen: DateTime!,
        port: String!,
        captain: String!
    }
`);
Object.assign(schema['_typeMap'].DateTime, GraphQLDateTime);

const root = {
    captainVisits: ({ captain, vessel }) => dataStore.captainVisits(captain, vessel),
    allVisits: () => dataStore.allVisits(),
    logArrival: ({ arrival }) => {
        dataStore.addArrival(arrival);
        return arrival;
    }
};

export const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(3200, () => console.log('GraphQL on localhost:3200/graphql'));