const md5 = require('js-md5')
// appid 1117969
// app key 2135289214
export const getReqSign = function (params, appKey = 'Au0CKSHB6hp9OYCc') {
  // 1. 字典升序排序
  params = objKeySort(params)

  // 2. 拼按URL键值对
  let sign = ''

  Object.keys(params).forEach(function (key) {
    sign += key + '=' + encodeURIComponent(params[key]) + '&'
  })

  // 3. 拼接app_key
  sign += 'app_key' + '=' + appKey

  // 4. MD5运算+转换大写，得到请求签名
  sign = md5(sign).toUpperCase()

  return sign
}

const objKeySort = function (obj) {
  // 排序的函数
  var newkey = Object.keys(obj).sort()
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj = {}
  for (var i = 0; i < newkey.length; i++) {
    // 遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]// 向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj
}
var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export function generateMixed (n) {
  var res = ''
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35)
    res += chars[id]
  }
  return res
}
// let str = generateMixed(32)
// let params = {
//   app_id: 10101010,
//   time_stamp: 1223123123123,
//   nonce_str: '20e3408a79',
//   image: 'asdasdasdasdasdasdsadsa',
//   card_type: 0
// }
// let res = getReqSign(params)
// console.log(res)
// console.log(str, '....')
export default {
  getReqSign,
  generateMixed
}
