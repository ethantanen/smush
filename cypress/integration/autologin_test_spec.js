
describe('auto login?this is broken still lololasdhkjdkh??', function() {
  it('logs in without using the ui...?', function() {
    cy.visit('/')
    cy.request('POST', '/user/authenticate', {
      username: Cypress.config('test_admin_username'),
      password: Cypress.config('test_admin_username')
      }
    )
    cy.visit('/home')
    cy.visit('/user/profile')

  })
})
