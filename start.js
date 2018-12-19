/**
  Run this file to configure Smush's app environemnt and start the applicatoin!
**/
const setup_app_env = require('./config/setup_app_env')
setup_app_env.setup()
  .then(() => {
    require('./app')
  })
  .catch(console.log)
