# MPS-Project

<img src='https://github.com/ethantanen/MPS-Project/blob/master/static/logo.png' width="50%" height='50%'/>

To setup the SMUSH system, first obtain https credentials and place them in a directory titled https in the config directory. The certificate should be named server.crt and the key should be labeled server.key. Next copy and paste the content of the file title app_env_template into a file titled app_env and place that file in the config directory. Obtain the credentials described in the file and update the fields in the app_env file. Optionally, you may store your credentials in a Vault and provide the address and token of the vault in the app_env file as well as update the file titled setup_app_env.js with the keys for the information stored in the vault. To run from a vault instance replace ```console npm run start``` with ```console npm run vault```:

```console
  npm install && npm run start
```

To run Smush using an http server run:

```console
  source config/app_env && node app.js http
 ```

Directory Structure (does not include testing suite or views):

```bash
.
├── README.md
├── app.js
├── config
│   ├── app_env
│   ├── auth.js
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

  - app.js - this file setups the application and routes calls to specific endpoints
  - config - contains files related to the apps configuration such as https credentials and setting up passport.js strategies
  - models - contains utility files for our models. One model for user information and another for the music archive
  - routes - contains the routers that the app.js file routes to. One for endpoints related to the archive, one for - -endpoints related to users and another for endpoints related to contacting users with email
  - start.js - RUN THIS FILE TO START THE APPLICATION. This file communicates with the Vault to get the necessary credentials to run the application and initializes the application (using the app.js file)
  - utilities - this directory contains helpful utility files such as for authorizing access to endpoints

  * to successfully begin the program you will need to obtain a fair number of credentials! Please contact me if you want temporary access to a set of credentials or help configuring your environment. T
