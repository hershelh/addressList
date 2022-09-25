import type {
  AddAddress,
  AddAddressResponseData,
  EditAddress, GetAddressListResponseData,
} from '~/types/addressManagement'

export function addAddress(params: AddAddress): Promise<AddAddressResponseData> {
  return service.post('/address/add', params)
}

export function editAddress(params: EditAddress): Promise<any> {
  return service.post('/address/update', params)
}

export function getAddressList(): Promise<GetAddressListResponseData> {
  return service.get('/address/list')
}

export function deleteAddress(addressId: string): Promise<any> {
  return service.get(`/address/delete?addressId=${addressId}`)
}
