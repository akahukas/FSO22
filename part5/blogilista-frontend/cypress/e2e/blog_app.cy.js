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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'e2etester', password: 'securePassword' })
    })

    it('a blog can be created.', function() {
      cy.get('#togglableButton').click()

      cy.get('#title').type('Creating from Cypress.')
      cy.get('#author').type('Mr. Cypress')
      cy.get('#url').type('http://mrcypress.com/creating')
      cy.get('#createButton').click()

      cy.get('#blogList').contains('Creating from Cypress.')
      cy.get('.successNotification').contains(
        'Added a new blog Creating from Cypress. by Mr. Cypress.'
      )
      cy.get('.successNotification').should('have.css', 'color', 'rgb(0, 128, 0)')
    })

    afterEach(function() {
      cy.get('#logoutButton').click()
    })
  })

  describe('and blogs exist', function() {
    beforeEach(function() {
      cy.login({ username: 'e2etester', password: 'securePassword' })
      cy.createBlog({
        title: 'Another Cypress Blog.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/another'
      })
    })
    it('a like can be added to one of the blogs.', function() {

      cy.contains('Another Cypress Blog.').get('#viewButton').click()

      cy.get('#likes').contains(0)
      cy.get('#likeButton').click()
      cy.get('#likes').contains(1)
    })
  })
})