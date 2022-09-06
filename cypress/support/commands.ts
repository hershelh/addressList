Cypress.Commands.add('getByTest', (selector: string, ...args) => {
  return cy.get(`[data-test=${selector}`, ...args)
})

Cypress.Commands.add('loginByRequest', () => {
  cy.request('POST', `${Cypress.env('apiUrl')}user/login`, Cypress.env('user'))
    .then(({ body }) => {
      expect(body.data.token).to.be.a('string')
      localStorage.setItem('token', body.data.token)
      cy.visit('/address/shipAddress')
    })
})
