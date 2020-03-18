import express from 'express';
import express_graphql from 'express-graphql';
import { buildSchema } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

interface Arrival {
    vessel: string;
    arrivedWhen: Date;
    port: string;
    captain: string;
}

const schema = buildSchema(`
    scalar DateTime

    type Query {
        captainVisits: String
    }
    type Mutation {
        logArrival(arrival: ArrivalInput): Arrival
    }
    type Arrival {
        vessel: String,
        arrivedWhen: DateTime,
        port: String,
        captain: String
    }
    input ArrivalInput {
        vessel: String,
        arrivedWhen: DateTime,
        port: String,
        captain: String
    }
`);
Object.assign(schema['_typeMap'].DateTime, GraphQLDateTime);

const root = {
    captainVisits: () => 'Hello World!',
    logArrival: (arrival: Arrival) => {
        console.log(arrival);
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