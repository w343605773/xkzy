const host = 'https://lipcloud.kindstar.com.cn/xiaokang/'
// const host = 'https://localhost:44358/'

// 请求封装
function request (url, method, data, header = 1) {
  let headers = [
    { 'content-type': 'application/json' },
    { 'content-type': 'application/json' },
    { 'content-type': 'application/x-www-form-urlencoded' }
  ]
  try {
    var value = wx.getStorageSync('MyToken')
    if (value) {
      headers[0]['Authorization'] = 'Bearer ' + value
    }
  } catch (e) {
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: headers[header],
      success: function (res) {
        resolve(res)
      },
      fail: function (error) {
        console.log(error, '.....请求失败')
        reject(error)
      },
      complete: function () {
      }
    })
  })
}

export function get (url, data, header) {
  return request(url, 'GET', data, header)
}

export function post (url, data, header) {
  return request(url, 'POST', data, header)
}

export function put (url, data) {
  return request(url, 'PUT', data).then(res => res)
}

export function del (url, data) {
  return request(url, 'DELETE', data)
}

// 识别身份证
export const GetCardInfo = params => {
  return post('https://api.ai.qq.com/fcgi-bin/ocr/ocr_idcardocr', params, 2).then(res => res)
}

// 获取openId
export const GetOpenId = params => {
  console.log(params)
  return get(`${host}api/WeToken/${params}`).then(res => res)
}

// 获取手机号
export const GetPhoneNumber = params => {
  return get(`${host}api/WeToken/Phone`, params).then(res => res)
}
// 获取二维码信息
export const GetmyCode = params => {
  return get(`${host}api/TjSample/get?openID=${params}`).then(res => res)
}
// 更新二维码信息
export const UpdateCodeINfo = params => {
  return post(`${host}api/TjSample/update`, params, 2).then(res => res)
}
// 插入二维码信息
export const PostCodeInfo = params => {
  return post(`${host}api/TjSample/create`, params, 2).then(res => res)
}
// 查询报告
export const GetBySampleInfoId = params => {
  return get(`${host}api/TjSample/GetBySampleInfoId?patientCardId=${params}`)
}
// 查看图片
export const GetTestReport = params => {
  return get(`${host}/api/TjSample/GetTestReport?filePath=${params}`)
}
