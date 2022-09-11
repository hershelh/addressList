describe('用户认证管理', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.getByTest('login__nav-bar').should('exist')
      .and('contain', '登录')
  })

  it('输入正确的用户名和密码可以登录，并进入收货地址页面', () => {
    cy.getByTest('login__username-input').type('jeanmay')
    cy.getByTest('login__password-input').type('password123456')
    cy.getByTest('login__submit-button').click()
    cy.url().should('include', '/address/shipAddress')
  })

  it('输入错误的用户名和密码时登录失败并进行提示', () => {
    cy.getByTest('login__username-input').type('wrongusername')
    cy.getByTest('login__password-input').type('wrongpassword')
    cy.getByTest('login__submit-button').click()
    cy.contains('用户名或密码错误')
    cy.url().should('not.include', '/address/shipAddress')
  })

  it('未输入用户名或密码时显示错误且无法登录', () => {
    cy.getByTest('login__username-input').find('input').focus().blur()
    cy.contains('请填写用户名')
    cy.getByTest('login__password-input').find('input').focus().blur()
    cy.contains('请填写密码')
    cy.getByTest('login__submit-button').click()
    cy.url().should('not.include', '/address/shipAddress')
  })

  it('二次登录时自动登录', () => {
    cy.getByTest('login__username-input').type('jeanmay')
    cy.getByTest('login__password-input').type('password123456')
    cy.getByTest('login__submit-button').click()
    cy.url().should('include', '/address/shipAddress')

    cy.visit('/')
    cy.contains('自动登录中')
    cy.url().should('include', '/address/shipAddress')
  })

  it('未登录时访问地址页面并发起请求时提示未登录并重定向到登录页面', () => {
    cy.visit('/address/shipAddress')
    cy.contains('未携带用户凭证')
    cy.url().should('include', '/')
  })

  it('退出登录', () => {
    cy.loginByRequest()
    cy.visit('/address/shipAddress')

    cy.contains('退出登录').click()
    cy.contains('button', '确认').click()
    cy.contains('正在退出登录')
    cy.url().should('include', '/')
  })
})
