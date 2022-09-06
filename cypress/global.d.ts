declare namespace Cypress {
  interface Chainable {
    getByTest(dataTestAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

    loginByRequest(): void
  }
}
