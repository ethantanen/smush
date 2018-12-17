describe('Can a non admin access admin pages?', function() {
  it('nonadmin can not access admin archive page', function() {
    cy.visit('/archive/admin') // loads base url from cypress.json config
    //checks the popup message for the error
    cy.get('#myModal').contains('You must be logged in')

  })

  it('non signed in user access user profile', function() {
    cy.visit('/user/profile')
    cy.get('#myModal').contains('You must be logged in')
  })

})
