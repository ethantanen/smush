describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(true)
  })
})

describe('My First Test', function() {
  it('Does not do much!', function() {
    expect(true).to.equal(false)
  })
})


// use cy.visit to go to a url
describe('My First Test', function() {
  it('Visits the Kitchen Sink', function() {
    cy.visit('https://example.cypress.io')
    cy.contains('type').click()
    cy.url().should('include', '/commands/actions')

    // Get an input, type into it and verify that the value has been updated
    //c.get to selet an element based on css class
    // .type() to enter text into the selected input
    // ..should() verify input reflects tex that was typed
    cy.get('.action-email')
    .type('fake@email.com')
    .should('have.value', 'fake@email.com')
//         Visit: https://example.cypress.io
//         Find the element with content: type
//         Click on it
//         Get the URL
//         Assert it includes: /commands/actions
//         Get the input with the .actions-email class
//         Type `fake@email.com` into the input
//         Assert the input reflects the new value
//
// Or in the Given, When, Then syntax:
//
//         Given a user visits https://example.cypress.io
//         When they click the link labeled type
//         And they type “fake@email.com“ into the .actions-email input
//         Then the URL should include /commands/actions
//         And the .actions-email input has “fake@email.com“ as its value


  })
})
