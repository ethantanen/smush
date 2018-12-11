describe('The SMUSH Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/') // loads base url from cypress.json config
    cy.contains('SMUSH')
  })
})


describe('Admin access', function() {
  beforeEach(function () {
    //before each tst make sure we log in to the admin account
    cy.visit('/user/login')
    cy.get('input[name=username]')
      .type(Cypress.config('test_admin_username'))
      .should('have.value', Cypress.config('test_admin_username'))

    cy.get('input[name=password]')
      .type(Cypress.config('test_admin_password'))

    //click the login button
    cy.get('button[type=submit]').click()
    //check we are on the home page and successfully logged in
    cy.url().should('include', '/home')
    cy.contains('Profile')
    cy.contains('Admin')

  })
  it('is able to access the admin page', function() {
    cy.visit('/archive/admin')
    cy.contains('Upload Score')
  })

  it('successfully logs out as admin', function() {
    cy.contains('Logout').click()
    cy.url().should('include', '/user/logout')
  })
})
