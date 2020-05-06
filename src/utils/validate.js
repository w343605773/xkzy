// 验证姓名格式
export function isName (name) {
  return /^([\u4e00-\u9fa5]){2,10}$/.test(name)
}
// 验证手机号码格式
export function isMobile (s) {
  return /^1[3456789]\d{9}$/.test(s)
}

// 身份证
export function isCode (code) {
  return /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(code)
}

export function isBarcode (code) {
  return /^Y\d{11}$/.test(code)
}
