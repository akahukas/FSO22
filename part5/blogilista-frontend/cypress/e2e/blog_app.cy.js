describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'E2E Tester',
      username: 'e2etester',
      password: 'securePassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown.', function() {
    cy.contains('Blogs-application')
    cy.contains('Log in to application:')
  })

  describe('Login', function() {
    it('succeeds with correct credentials.', function() {
      cy.get('#username').type('e2etester')
      cy.get('#password').type('securePassword')
      cy.get('#loginButton').click()

      cy.contains('Logged in as E2E Tester.')
    })

    it('fails with wrong credentials.', function() {
      cy.get('#username').type('e2etester')
      cy.get('#password').type('thisIsNotCorrect')
      cy.get('#loginButton').click()

      cy.get('.errorNotification').contains('Wrong username or password.')
      cy.get('.errorNotification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})