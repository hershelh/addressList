export interface AddressInfo {
  addressId: string
  name: string
  mobilePhone: string
  detailAddress: string
  area: string
  tag: number // 0 无，1 家，2 公司，3 学校
  defaultFlag: boolean
}

export interface AddressForm {
  name: string
  mobilePhone: string
  detailAddress: string
  area: string
  tag: number
  defaultFlag: boolean
}

export interface AddAddress extends AddressForm {
}

export interface EditAddress extends AddressInfo {
}

export interface AddAddressResponseData extends AddressInfo {
  addressId: string
}

export type GetAddressListResponseData = AddressInfo[]
