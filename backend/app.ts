import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import expess from 'express'
import { JSONFile, Low } from 'lowdb'
import cors from 'cors'
import bodyParser from 'body-parser'
import type { Request } from 'express'
import type { AddressForm, AddressInfo } from '../src/types/addressManagement'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Data {
  user: {
    username: string
    password: string
    token: string
  }
  address: AddressInfo[]
}

const file = join(__dirname, 'db.json')
const adapter = new JSONFile<Data>(file)
const db = new Low(adapter)

await db.read()

const app = expess()

app.use(cors()).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: false }))

const generateResponseData = (data: unknown = null, code = 200, msg = '成功') => {
  return JSON.stringify({
    code,
    data,
    msg,
  })
}

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/user/login', (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  const { username, password, token } = db.data!.user
  if (req.body.username === username && req.body.password === password)
    res.end(generateResponseData({ token }))
  else
    res.end(generateResponseData(null, 400, '用户名或密码错误'))
})

app.get('/address/list', (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  const { token } = db.data!.user
  if (req.headers.authorization === `Bearer ${token}`) {
    const addressList = db.data!.address
    res.end(generateResponseData(addressList, 200, '成功'))
  }
  else {
    res.end(generateResponseData(null, 401, '未携带用户凭证！'))
  }
})

app.post('/address/add', async (req: Request<null, null, AddressForm>, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  const { token } = db.data!.user
  if (req.headers.authorization === `Bearer ${token}`) {
    const { defaultFlag, ...addressBody } = req.body
    const addressList = db.data!.address
    if (defaultFlag && addressList.some(({ defaultFlag: val }) => val)) {
      res.end(generateResponseData(null, 400, '已有默认地址'))
    }
    else {
      const newId = `${parseInt(addressList[addressList.length - 1]?.addressId || '0') + 1}`
      addressList.push({
        defaultFlag,
        ...addressBody,
        addressId: newId,
      })
      await db.write()
      res.end(generateResponseData({
        addressId: newId,
      }, 200, '添加地址成功'))
    }
  }
  else {
    res.end(generateResponseData(null, 401, '未携带用户凭证！'))
  }
})

app.post('/address/update', async (req: Request<null, null, AddressInfo>, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  const { token } = db.data!.user
  if (req.headers.authorization === `Bearer ${token}`) {
    const { addressId, defaultFlag, ...addressBody } = req.body
    const addressList = db.data!.address
    const index = addressList.findIndex(({ addressId: id }) => addressId === id)
    if (defaultFlag && addressList.some(({ defaultFlag: val }, i) => val && i !== index)) {
      res.end(generateResponseData(null, 400, '已有默认地址'))
    }
    else {
      addressList.splice(index, 1, {
        addressId,
        defaultFlag,
        ...addressBody,
      })
      await db.write()
      res.end(generateResponseData(null, 200, '更新地址成功'))
    }
  }
  else {
    res.end(generateResponseData(null, 401, '未携带用户凭证！'))
  }
})

app.get('/address/delete', async (req, res) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8')
  const { token } = db.data!.user
  if (req.headers.authorization === `Bearer ${token}`) {
    const addressId = req.query.addressId as string
    const addressList = db.data!.address
    const index = addressList.findIndex(({ addressId: id }) => id === addressId)
    addressList.splice(index, 1)
    await db.write()
    res.end(generateResponseData(null, 200, '删除地址成功'))
  }
  else {
    res.end(generateResponseData(null, 401, '未携带用户凭证！'))
  }
})

app.post('/test/seed', async (req, res) => {
  const file = join(__dirname, 'db-seed.json')
  const adapter = new JSONFile<Data>(file)
  const seedDb = new Low(adapter)
  await seedDb.read()
  db.data = seedDb.data
  await db.write()
  res.end(generateResponseData(null, 200))
})

app.listen(5001, () => {
  // eslint-disable-next-line no-console
  console.log('5001 端口已监听')
})
