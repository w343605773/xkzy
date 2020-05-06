function analyzeIDCard (IDCard) {
  var codeParse = {}
  // 获取用户身份证号码
  var userCard = IDCard
  // 如果身份证号码为undefind则返回空
  if (!userCard) {
    return codeParse
  }
  // 获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 === 1) {
    codeParse.sexName = '男'
  } else {
    codeParse.sexName = '女'
  }
  // 获取出生年月日
  var yearBirth = userCard.substring(6, 10)
  var monthBirth = userCard.substring(10, 12)
  var dayBirth = userCard.substring(12, 14)
  // 获取当前年月日并计算年龄
  let str = yearBirth + '-' + monthBirth + '-' + dayBirth
  let myage = calculationTime(str)

  // 得到年龄
  codeParse.age = myage
  codeParse.sex = codeParse.sexName === '男' ? 1 : 2
  // 返回性别和年龄
  return codeParse
}

// 获取年龄
function calculationTime (startTime) {
  var s1 = new Date(startTime.replace(/-/g, '/'))
  var s2 = new Date()
  var runTime = parseInt((s2.getTime() - s1.getTime()) / 1000)
  var year = Math.floor(runTime / 86400 / 365)
  runTime = runTime % (86400 * 365)
  var month = Math.floor(runTime / 86400 / 30)
  runTime = runTime % (86400 * 30)
  var day = Math.floor(runTime / 86400)
  runTime = runTime % 86400
  var hour = Math.floor(runTime / 3600)
  runTime = runTime % 3600
  var minute = Math.floor(runTime / 60)
  runTime = runTime % 60
  var second = runTime
  return [year, month, day]
}
export default {
  analyzeIDCard
}
