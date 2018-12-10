describe('The SMUSH Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/') // loads base url from cypress.json config
    cy.contains('SMUSH')
  })
})


describe('Admin access', function() {
  it('visits login page', function() {
    cy.visit('/')
    cy.contains('Login or Signup').click()
    cy.url().should('include', '/user/login')

    // Get an input, type into it and verify that the value has been updated
    //c.get to selet an element based on css class
    // .type() to enter text into the selected input
    // ..should() verify input reflects tex that was typed


    })

describe('Filling out login info', function() {
  it('successfully logs in as an admin', function() {
    cy.get('input[name=username]')
      .type(Cypress.config('test_admin_username'))
      .should('have.value', Cypress.config('test_admin_username'))

    cy.get('input[name=password]')
      .type(Cypress.config('test_admin_password'))

    //click the login button
    cy.get('button[type=submit]').click()
    cy.url().should('include', '/home')

    //test it is an admin
    })
  })
})
