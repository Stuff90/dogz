# Install

`$ npm install`

In `apps/api/src/environments/environment.ts`

Add the correct AWS setup variables.

Start the server:

`$ npm run nx -- serve api`

On an other terminal, start the app

`$ npm run nx -- serve dogz`

Go to you favorite browser: `http://localhost:4200/`

# Tests

There is 2 apps & 1 library in the repository. The library is only shared file between FE & BE.

Test runner: Jest

Tests on the front end app:

`$ npm test -- dogz`

Tests on the library:

`$ npm test -- dogz-entity`

Tests on the node app (no test written at the moment though):

`$ npm test -- api`
