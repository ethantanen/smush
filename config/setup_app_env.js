// setup app environemtn by retrieving credentials from vault
async function setup () {

  options = {
    apiVersion: 'v1',
    endpoints: process.env.VAULT_ADDR
  }

  // configure vault and set access token
  const vault = require('node-vault')(options)
  vault.token = process.env.ROOT_TOKEN

  // list of keys whose values are necessary for operating SMUSH
  items = ['FACEBOOK_CLIENTID', 'FACEBOOK_CLIENTSECRET', 'TWITTER_CONSUMERKEY',
    'TWITTER_CONSUMERSECRET']

  try {

    // retrieve credentials from vault
    res = await vault.read('secret/credentials')
    key_value = res.data

    // set environment variables w/ key-value pair
    for ( key in items ) {
      process.env[items[key]] = key_value[items[key]]
      console.log('[INFO] environemnt variable set: ', items[key])
    }

  } catch (e) {
    console.log(e, '\n\n Is your token variable set? Are you querying the \
    correct directory?')
  }

}

module.exports = {
  setup: setup,
}
