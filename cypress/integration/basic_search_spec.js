describe('The SMUSH Home Page', function() {
  it('successfully loads', function() {
    cy.visit('/') // loads base url from cypress.json config
    cy.contains('SMUSH')
  })
})

describe('Basic Searching', function() {
  it('searches with the search bar for an empty space', function() {
    cy.get('input[name=search]')
      .type(' ')
      .should('have.value', ' ')
    cy.get('button[type=submit]').click()
    cy.get('#searchnum').contains('0')
  })

  it('searches for test and stuff should appear', function() {
    cy.visit('/')
    cy.get('input[name=search]')
      .type('test')
      .should('have.value', 'test')
    cy.get('button[type=submit]').click()
    cy.get('#row').should('exist')
  })
})
