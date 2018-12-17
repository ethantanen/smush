# MPS-Project

![Alt text](./static/logo.png){:height="50%" width="50%"}

To setup the Smush system simply run:

```console
  npm install && npm run start
```

Directory Structure (does not include testing suite or views):

```bash
.
├── README.md
├── app.js
├── config
│   ├── app_env
│   ├── auth.js
│   ├── server.crt
│   ├── server.key
│   └── setup_app_env.js
├── models
│   ├── music.js
│   └── users.js
├── package-lock.json
├── package.json
├── routes
│   ├── archive.js
│   ├── contact.js
│   └── user.js
├── start.js
└── utilities
    └── checkAuth.js
```

Description of Directory Structure:

  app.js - this file setups the application and routes calls to specific endpoints
  config - contains files related to the apps configuration such as https credentials and setting up passport.js strategies
  models - contains utility files for our models. One model for user information and another for the music archive
  routes - contains the routers that the app.js file routes to. One for endpoints related to the archive, one for endpoints related to users and another for endpoints related to contacting users with email
  start.js - RUN THIS FILE TO START THE APPLICATION. This file communicates with the Vault to get the necessary credentials to run the application and initializes the application (using the app.js file)
  utilities - this directory contains helpful utility files such as for authorizing access to endpoints
