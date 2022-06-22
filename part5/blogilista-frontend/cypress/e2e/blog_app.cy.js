describe('Blog app', function () {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'E2E Tester',
      username: 'e2etester',
      password: 'securePassword'
    }
    const anotherUser = {
      name: 'E2E Helper',
      username: 'e2ehelper',
      password: 'alsoSecurePassword'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', anotherUser)
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

    it('a blog can be deleted by logged in user.', function() {
      cy.get('#blogList').contains('Another Cypress Blog.')
      cy.contains('Another Cypress Blog.').get('#viewButton').click()

      cy.get('#removeButton').click()
      cy.get('.titleAndAuthor').should('not.exist')
    })

    it('a blog can not be deleted by user who did not create the blog', function() {
      cy.get('#logoutButton').click()
      cy.visit('http://localhost:3000')
      cy.login({ username: 'e2ehelper', password: 'alsoSecurePassword' })

      cy.get('#blogList').contains('Another Cypress Blog.')
      cy.contains('Another Cypress Blog.').get('#viewButton').click()
      cy.get('#removeButton').should('not.be.visible')
    })

    it('blogs are in descending order by number of likes.', function() {
      cy.createBlog({
        title: 'Creating from Cypress.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/creating'
      })
      cy.createBlog({
        title: 'Third Cypress Blog.',
        author: 'Mr. Cypress',
        url: 'http://mrcypress.com/third'
      })

      cy.contains('Creating from Cypress.').parent().find('button').as('firstButton')
      cy.get('@firstButton').click()
      cy.contains('Creating from Cypress.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('firstLikeButton')

      cy.contains('Another Cypress Blog.').parent().find('button').as('secondButton')
      cy.get('@secondButton').click()
      cy.contains('Another Cypress Blog.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('secondLikeButton')

      cy.contains('Third Cypress Blog.').parent().find('button').as('thirdButton')
      cy.get('@thirdButton').click()
      cy.contains('Third Cypress Blog.')
        .parent()
        .parent()
        .children()
        .contains('like')
        .as('thirdLikeButton')

      cy.get('@firstLikeButton').click()
      cy.wait(250)
      cy.get('@firstLikeButton').click()
      cy.wait(250)
      cy.get('@firstLikeButton').click()

      cy.get('@secondLikeButton').click()
      cy.wait(250)
      cy.get('@secondLikeButton').click()

      cy.get('@thirdLikeButton').click()

      cy.get('.blog').eq(0).contains('Creating from Cypress.')
      cy.get('.blog').eq(0).contains('likes 3')
      cy.get('.blog').eq(1).contains('Another Cypress Blog.')
      cy.get('.blog').eq(1).contains('likes 2')
      cy.get('.blog').eq(2).contains('Third Cypress Blog.')
      cy.get('.blog').eq(2).contains('likes 1')
    })
  })
})