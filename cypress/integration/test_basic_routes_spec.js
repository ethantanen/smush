describe('Testing various routes', function() {
  it('contact page access', function() {
      cy.visit("/contact")
      cy.visit("email")
  })

  it('about page access', function() {
      cy.visit("/about")
      cy.contains("SMUSH")
  })
  it('archive page access', function() {
      cy.visit("/archive")
      cy.contains("Something went wrong.")
  })

})
