
// same code for advanced search on home page and results Page
//since we use a partial, testing from here should suffice
describe('Advanced search options from home page', function() {
  beforeEach(function() {
    cy.visit('/')  //goto the home page
    cy.get('#advsearch_button').click()  //open the advanced search menu
  })

  it('searches by artist name', function() {
    cy.get('input[name=artistName]')
      .type('Mozart')
      .should('have.value', 'Mozart')
    cy.get('input[id=advancedquery]').click()
    cy.get('#tableartistName').contains('Mozart')
  })

  it('searches by track name', function() {
    cy.get('input[name=trackName]')
      .type('Requiem')
      .should('have.value', 'Requiem')
    cy.get('input[id=advancedquery]').click()
    cy.get('#tabletrackName').contains('Requiem')
  })

  it('searches by key', function() {
    cy.get('input[name=key]')
      .type('A minor')
      .should('have.value', 'A minor')
    cy.get('input[id=advancedquery]').click()
    cy.get('#tablekey').contains('A minor')
  })
  it('searches by tempo', function() {
    cy.get('input[name=tempo]')
      .type('Larghetto')
      .should('have.value', 'Larghetto')
    cy.get('input[id=advancedquery]').click()
    cy.get('#tabletempo').contains('Larghetto')
  })
})
