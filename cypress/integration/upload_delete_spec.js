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
  it('is able to upload music', function() {
    cy.visit('/archive/admin')
    cy.contains('Upload Score')

    cy.fixture('testscore.jpeg').as('image')
    cy.get('#imageupload').then(($input) => {

      // convert the logo base64 string to a blob
      return Cypress.Blob.base64StringToBlob(this.image, 'image/jpeg')
        .then((blob) => {

          // pass the blob to the fileupload jQuery plugin
          // used in your application's code
          // which initiates a programmatic upload
          $input.fileupload('add', { files: blob })
      })
    })

  })
})
