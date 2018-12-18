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

  it('can edit a song music in db', function() {
    cy.visit('/archive/admin')
    cy.get('#dbdisplaydata').contains('Mozart').click()
    cy.get('#artistName').clear().type('Not mozart anymore')
      .should('have.value', 'Not mozart anymore')
    cy.get('#editsubmission').click()
  })
  it('checks the edit in db on Mozart', function() {
    cy.visit('/')
    cy.get('input[name=search]')
      .type('Not mozart anymore')
    cy.get('button[type=submit]').click()
    cy.get('#row').should('exist')
    cy.contains('Not mozart anymore')
  })
  it('undoes the edit back to original', function() {
    cy.visit('/archive/admin')
    cy.get('#dbdisplaydata').contains('Not mozart anymore').click()
    cy.get('#artistName').clear().type('Mozart')
      .should('have.value', 'Mozart')
    cy.get('#editsubmission').click()
  })

  it('successfully logs out as admin', function() {
    cy.contains('Logout').click()
    cy.url().should('include', '/user/logout')
  })

})
