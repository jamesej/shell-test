# Shell Test
The product is a Graph QL server which receives logs of visits by captains to ports from an internal system and provides query functionality on this data.

## Assumptions
- The server runs without stopping and therefore needs no file backup of its in-memory cache of logs.
- It is possible for the same captain to be the captain of different vessels over time: therefore it is necessary to specify the captain and the vessel when requesting a particular set of logs.
- Logs can arrive in non-chronogical order: if it was guaranteed they would arrive in chronological order the server could be simplified.

## Checking behaviour
The server's behaviour can be tested by running the supplied tests. Also it runs graphiql in a browser which is navigated to http://localhost:3200/graphql

## Architecture diagram
In the file arch-diagram.jpg in this repo.