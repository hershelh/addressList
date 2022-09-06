import { encodePhoneNumber } from '~/utils'

describe('地址管理', () => {
  beforeEach(() => {
    cy.task('db:seed')
    cy.loginByRequest()
    cy.intercept('/address/list').as('getList')
    cy.intercept('/address/delete*').as('deleteItem')
    cy.url().should('include', '/address/shipAddress')
  })

  it('展示地址列表', () => {
    cy.getByTest('address-item').should('have.length', 5)
  })

  it('地址列表为空时展示空状态', () => {
    cy.intercept('/address/list', {
      body: [],
    }).as('addressList')
    cy.wait('@addressList')
    cy.getByTest('address-list').should('not.be.visible')
    cy.getByTest('address-empty').should('be.visible')
  })

  it('长按并确认删除一个地址', () => {
    cy.getByTest('address-item').should('have.length.above', 0).then((list) => {
      const length = list.length
      cy.wrap(list[0]).trigger('mousedown')
      cy.wait(1000)
      cy.contains('确认删除？')
      cy.contains('button', '确认').click()
      cy.wrap(list).should('have.length', length - 1)
    })
  })

  it('长按并取消删除一个地址', () => {
    cy.getByTest('address-item').should('have.length.above', 0).then((list) => {
      const length = list.length
      cy.wrap(list[0]).trigger('mousedown')
      cy.wait(1000)
      cy.contains('确认删除？')
      cy.contains('button', '取消').click()
      cy.wrap(list).should('have.length', length)
    })
  })

  it('将地址全部删除后显示空状态', () => {
    cy.wait('@getList')
    let length = 0
    cy.getByTest('address-item').as('list').should('have.length.above', 0).its('length').then((num) => {
      length = num
    })
    cy.getByTest('address-item').each((item) => {
      cy.wrap(item)
        .trigger('mousedown')
      cy.wait(1000)
      cy.contains('确认删除？')
      cy.contains('button', '确认').click()
      cy.wait('@deleteItem')
      cy.get('@list').should('have.length', --length)
    })

    cy.getByTest('address-list').should('not.be.visible')
    cy.getByTest('address-empty').should('be.visible')
  })

  it('填写地址表单时未输入某一个表单项会提示错误', () => {
    cy.visit('/address/editAddress')
    cy.getByTest('address-form__name').find('input').clear().blur()
    cy.getByTest('address-form__name').children().contains('请填写收货人姓名')
    cy.getByTest('address-form__mobile-phone').find('input').clear().blur()
    cy.getByTest('address-form__mobile-phone').children().contains('请输入正确的手机号码')
    cy.getByTest('address-form__detail-address').find('textarea').clear().blur()
    cy.getByTest('address-form__detail-address').children().contains('请输入详细地址')
  })

  const address = {
    name: '测试阿黄',
    mobilePhone: '13511448877',
    detailAddress: '中山路希望小区23号',
  }

  describe('编辑地址', () => {
    it('更改地址的内容并提交', () => {
      cy.getByTest('address-item').eq(0).click()
      cy.url().should('include', '/address/editAddress')
      cy.getByTest('address-form__name').find('input').clear().type(address.name)
      cy.getByTest('address-form__mobile-phone').find('input').clear().type(address.mobilePhone)
      cy.getByTest('address-form__area').click()
      cy.contains('.van-popup button', '确认').click()
      cy.getByTest('address-form__detail-address').find('textarea').clear().type(address.detailAddress)
      cy.getByTest('address-form__tag').eq(1).click()
      cy.getByTest('address-form__default-flag').click()
      cy.getByTest('address-form__submit').click()

      cy.url().should('include', '/address/shipAddress')
      cy.wait('@getList')

      cy.getByTest('address-item').eq(0)
        .should((el) => {
          expect(el.text()).to.include(address.name)
          expect(el.text()).to.include(encodePhoneNumber(address.mobilePhone))
          expect(el.text()).to.include('北京市北京市东城区')
          expect(el.text()).to.include(address.detailAddress)
          expect(el.text()).to.include('家')
          expect(el.text()).to.not.include('默认')
        })
    })

    it('已有默认地址的情况下将另一个地址更改为默认地址会提示并保存失败', () => {
      cy.getByTest('address-item').eq(1).click()
      cy.url().should('include', '/address/editAddress')
      cy.getByTest('address-form__default-flag').click()
      cy.getByTest('address-form__submit').click()
      cy.contains('已有默认地址')
      cy.url().should('include', '/address/editAddress')
    })
  })

  describe('新增地址', () => {
    beforeEach(() => {
      cy.getByTest('address-item').its('length').as('length')
      cy.contains('新增地址').click()
      cy.url().should('include', '/address/editAddress')
    })

    it('填写表单内容并提交会显示添加成功', () => {
      cy.getByTest('address-form__name').type(address.name)
      cy.getByTest('address-form__mobile-phone').type(address.mobilePhone)
      cy.getByTest('address-form__area').click()
      cy.contains('.van-popup button', '确认').click()
      cy.getByTest('address-form__detail-address').find('textarea').type(address.detailAddress)
      cy.getByTest('address-form__tag').eq(1).click()
      cy.getByTest('address-form__submit').click()

      cy.url().should('include', '/address/shipAddress')
      cy.wait('@getList')

      cy.getByTest('address-item').eq(0)
        .should((el) => {
          expect(el.text()).to.include(address.name)
          expect(el.text()).to.include(encodePhoneNumber(address.mobilePhone))
          expect(el.text()).to.include('北京市北京市东城区')
          expect(el.text()).to.include(address.detailAddress)
          expect(el.text()).to.include('家')
          expect(el.text()).to.not.include('默认')
        })
    })

    it('已有默认地址的情况下新增一个默认地址会提示并保存失败', () => {
      cy.getByTest('address-form__name').type(address.name)
      cy.getByTest('address-form__mobile-phone').type(address.mobilePhone)
      cy.getByTest('address-form__area').click()
      cy.contains('.van-popup button', '确认').click()
      cy.getByTest('address-form__detail-address').find('textarea').type(address.detailAddress)
      cy.getByTest('address-form__tag').eq(1).click()
      cy.getByTest('address-form__default-flag').click()
      cy.getByTest('address-form__submit').click()
      cy.contains('已有默认地址')
      cy.url().should('include', '/address/editAddress')
    })
  })
})
