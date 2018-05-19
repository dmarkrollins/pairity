# Pairity

## What is Pairity

Pairity is a pair management tool.

If you don't know what pairing is read [this](https://content.pivotal.io/blog/pair-programming-considered-extremely-beneficial).

Unlike other tools we've used to manage pair rotations, Pairity extends the concept of team-based pairing to include:

- Cross-team pair management/rotation
- Active cross team pair-matching based on needed role and technology competency
- Include roles other than just engineering
- Cross role pairing (engineering/product, product/design, design/engineering)

## Core Features

- Same team paring
- Cross team pairing
- Cross role pairing
- Team management and inter/intra team pairing metrics

# Required Environment Variables

- MONGO_URL - points to your hosted mongo instance: _mongodb://[username:password@]host1[:port1]_
- MAIL_URL - points to your smtp provider: _smtp://USERNAME:PASSWORD@HOST:PORT_
- ROOT_URL - for example: _https://www.pairity-app.com_

## How can you help

Glad you asked. We're always looking for contributions.

- Read our [Contributor Guide](https://github.com/dmarkrollins/pairity/wiki/Contributor-Guide) to get started.

- You'll want to install [Meteor](https://www.meteor.com) if you don't already have it installed.

- Pull the code, npm install and you should be good to go.

- To run the app run `npm run start` from the application root folder.

- To run tests use `npm run test' from the application root folder.
