// use cy.visit to go to a url
describe('Basic ass tests', function() {
  it('Checks home page title', function() {
    cy.visit('http://localhost:3000')
    cy.contains('SMUSH')
  })
})
