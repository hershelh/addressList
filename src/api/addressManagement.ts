import { service } from '../network'
import type {
  AddAddress,
  AddAddressResponseData,
  EditAddress, GetAddressListResponseData,
} from '../types/addressManagement'

/**
 * @description 新增地址
 * @author 黄烁恒
 * @date 2022-02-05
 */
export function addAddress(params: AddAddress): Promise<AddAddressResponseData> {
  return service.post('/address/add', params)
}

/**
 * @description 编辑地址
 * @author 黄烁恒
 * @date 2022-02-05
 */
export function editAddress(params: EditAddress): Promise<any> {
  return service.post('/address/update', params)
}

/**
 * @description 获取地址列表
 * @author 黄烁恒
 * @date 2022-02-05
 */
export function getAddressList(): Promise<GetAddressListResponseData> {
  return service.get('/address/list')
}

/**
 * @description 删除地址
 * @author 黄烁恒
 * @date 2022-02-08
 */
export function deleteAddress(addressId: string): Promise<any> {
  return service.get(`/address/delete?addressId=${addressId}`)
}
