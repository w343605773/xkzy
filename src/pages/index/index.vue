<template>
  <div>
    <div class="bodyTop">
        <div class="topTitle">基本信息</div>  
        <!-- <div @click="openCamera" class="openCameraTips">拍摄身份证输入</div> -->
        <div class="openCameraTips">
          <button class="openCameraBtn"  @click="openCamera">拍摄身份证输入</button>
        </div>
    </div>
        <!-- <div v-if="getPhoto" > 
        <div class="PhotoBtnList">
          <i-button  @click="getCardInfo" inline type="primary" size="small">识别</i-button>
          <i-button  @click="getPhoto = false" inline type="primary" size="small">关闭</i-button>
        </div>
        <camera device-position="back" flash="off" binderror="error" style="width: 100%; height: 300px;"></camera>
      </div> -->
      <div>
        <div class="inputLable">
          <span class="Redcolor">* </span>
          <span class="InputTitle">姓名</span>
        </div>
        <div class="inputText">
          <input v-model="name" placeholder="请输入姓名" type="text">
        </div>
      </div>
      <div>
        <div class="inputLable">
          <span class="Redcolor"> </span>
          <span class="InputTitle"> 年龄</span>
        </div>
        <div class="inputText">
          <input v-model="age" type="number" maxlength="2" placeholder="请输入年龄">
        </div>
      </div>
      <div>
        <div class="inputLable">
          <span class="Redcolor"></span>
          <span class="InputTitle"> 性别</span>
        </div>
        <div class="inputText">
          <input v-model="sex" @click="selectSex" disabled  placeholder="请选择性别">
        </div>
      </div>
      <div class="inputBox">
        <div class="inputLable">
          <span class="Redcolor">* </span>
          <span class="InputTitle">联系电话</span>
        </div>
        <div class="phoneBox">
          <input class="inputText" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" >
          <button class="getPhoneBtn" open-type="getPhoneNumber"  @getphonenumber="getMyPhoneNum">获取手机号</button>
        </div>
      </div>
      <div class="inputBox">
        <div class="inputLable">
          <span class="Redcolor">* </span>
          <span class="InputTitle">身份证号</span>
        </div>
        <div class="inputText">
          <input v-model="code" type="idcard" maxlength="18" placeholder="请输入身份证号" >
        </div>
      </div>
      <div class="bodyTop">
          <div class="topTitle">
            试管编码
          </div>  
          <!-- <div @click="addBarcode" class="openCameraTips">扫码添加</div> -->
          <div class="openCameraTips">
           <button class="scanCode"  @click="addBarcode">扫码添加</button>
          </div>
      </div>
      <div v-for="(item,index) in tubeList" :key="index">
        <div class="tubeList">
          <div>{{item.SerialNumber}}</div>
           <icon @click="deleteCode" type="cancel" size="20"/>
        </div>
      </div>
      <button class="markCode" :disabled="makeBtnState"  @click="makeCode">生成二维码</button>
  </div>
</template>

<script>

import getAge from '../../utils/parseCode'
import {isCode, isMobile, isName, isBarcode} from '../../utils/validate'
import {PostCodeInfo, UpdateCodeINfo, GetmyCode, GetPhoneNumber, GetOpenId} from '../../api/index'
// import common from '../../utils/common'
import bus from '../../utils/bus'
export default {
  data () {
    return {
      name: '',
      phone: '',
      code: '',
      sex: '',
      age: '',
      OpenID: '',
      tubeList: [],
      info: '',
      getPhoto: false,
      makeBtnState: false,
      hasCode: false
    }
  },
  watch: {
    code (value) {
      if (value.length === 18) {
        let codeParse = getAge.analyzeIDCard(value)
        this.age = codeParse.age[0]
        this.sex = codeParse.sexName
      }
    }
  },
  methods: {
    showToast (title, icon) {
      wx.showToast({
        title,
        icon
      })
    },
    // 生成二维码
    async makeCode () {
      if (!isName(this.name)) {
        this.showToast('姓名格式错误', 'none')
        return
      }
      if (!isMobile(this.phone)) {
        this.showToast('手机号格式错误', 'none')
        return
      }
      if (!isCode(this.code)) {
        this.showToast('身份证格式错误', 'none')
        return
      }
      if (this.tubeList.length === 0) {
        this.showToast('请添加试管码', 'none')
        return
      }
      if (!isBarcode(this.tubeList[0].SerialNumber)) {
        this.showToast('非法试管码', 'none')
        return
      }
      wx.showLoading({ title: '生成中...', mask: true })
      let codeParse = getAge.analyzeIDCard(this.code)
      try {
        var value = wx.getStorageSync('openId')
        if (value) {
          let info = {
            PatientName: this.name,
            Sex: codeParse.sex,
            SexName: codeParse.sexName,
            SerialNumber: this.tubeList[0].SerialNumber,
            ageYear: codeParse.age[0],
            ageMonth: codeParse.age[1],
            ageDay: codeParse.age[2],
            PatientPhone: this.phone,
            PatientCardID: this.code,
            OpenID: value,
            State: 0
          }
          if (!this.makeBtnState && !this.hasCode) {
            PostCodeInfo(info).then(res => {
              if (res.data === 0) {
                this.showToast('录入失败', 'none')
              } else if (res.data.id === -1) {
                this.showToast('录入失败,管码重复', 'none')
              } else {
                try {
                  wx.setStorageSync('info', res.data)
                  wx.navigateBack({
                    delta: 1
                  })
                } catch (e) { }
              }
            })
            wx.hideLoading()
          } else {
            try {
              let myInfo = wx.getStorageSync('info')
              let params = {
                ID: myInfo.id,
                Barcode: myInfo.barcode,
                PatientName: this.name,
                Sex: codeParse.sex,
                SexName: codeParse.sexName,
                BirthAge: myInfo.birthAge,
                AgeYear: codeParse.age[0],
                AgeMonth: codeParse.age[1],
                AgeDay: codeParse.age[2],
                PatientPhone: this.phone,
                Area: myInfo.area,
                HospitalCode: myInfo.hospitalCode,
                HospitalName: myInfo.hospitalName,
                SerialNumber: myInfo.serialNumber,
                State: myInfo.state,
                PatientCardID: this.code,
                OpenID: myInfo.openID,
                CreatedDate: myInfo.createdDate,
                CollectDate: myInfo.collectDate,
                Collector: myInfo.collector
              }
              UpdateCodeINfo(params).then(res => {
                if (res.data !== 0) {
                  try {
                    wx.setStorageSync('info', res.data)
                    wx.navigateBack({
                      delta: 1
                    })
                  } catch (e) { }
                } else {
                  this.showToast('更新失败', 'none')
                }
              })
            } catch (e) { }

            wx.hideLoading()
          }
        } else {
          this.showToast('获取openid失败', 'none')
        }
      } catch (e) {
        // Do something when catch error
      }
    },
    // 获取手机号
    getMyPhoneNum (e) {
      console.log(e.mp.detail, '....')
      if (e.mp.detail.errMsg === 'getPhoneNumber:ok') {
        try {
          wx.login({
            success: async res => {
              console.log(res, '....')
              if (res.code) {
                let params = {
                  code: res.code,
                  aesIv: e.mp.detail.iv,
                  encryptedData: e.mp.detail.encryptedData
                }
                console.log(params, '...')
                console.log(11111111111)
                let result = await GetPhoneNumber(params)
                if (result.data.phoneNumber) {
                  this.phone = result.data.phoneNumber
                } else {
                  console.log('失败！')
                }
                console.log(result)
                console.log(11111111)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        } catch (err) {}
      }
    },
    // 跳转拍照
    openCamera () {
      // this.getPhoto = !this.getPhoto
      wx.navigateTo({
        url: '/pages/canera/main'
      })
    },
    // 添加试管编码
    addBarcode () {
      if (this.tubeList.length >= 1) {
        wx.showToast({
          title: '只能有一条管码',
          icon: 'none',
          duration: 2000
        })
        return
      }
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          this.tubeList.push({SerialNumber: res.result})
        }
      })
    },
    // 删除条码
    deleteCode () {
      this.tubeList = []
    },
    // 选择性别
    selectSex (num) {
      wx.showActionSheet({
        itemList: ['男', '女'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this.sex = '男'
          } else {
            this.sex = '女'
          }
          console.log(res.tapIndex)
        },
        fail (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  onShow () {
    wx.showLoading({
      mask: true
    })
    wx.login({
      success: async res => {
        if (res.code) {
          let openId = await GetOpenId(res.code)
          try {
            wx.setStorageSync('openId', openId.data.openid)
          } catch (e) { }
          try {
            if (openId.data.openid) {
              GetmyCode(openId.data.openid).then(res => {
                if (res.data.id) {
                  try {
                    this.info = res.data
                    this.makeBtnState = res.data.state
                    this.hasCode = true
                    wx.setStorageSync('info', res.data)
                    wx.hideLoading()
                  } catch (e) {
                  }
                } else {
                  try {
                    let MyInfo = wx.getStorageSync('info')
                    if (!MyInfo) {
                      this.hasCode = false
                    } else {
                      this.hasCode = true
                    }
                  } catch (e) {
                  }
                  wx.hideLoading()
                }
              })
            } else {
            }
          } catch (e) {
            // Do something when catch error
          }
          wx.hideLoading()
        }
      }
    })
  },
  onLoad (options) {
    if (options.info) {
      let myInfo = JSON.parse(options.info)
      this.name = myInfo.patientName
      this.phone = myInfo.patientPhone
      this.code = myInfo.patientCardID
      this.tubeList = [{SerialNumber: myInfo.serialNumber}]
      this.sex = myInfo.sexName
      this.age = myInfo.ageYear
    }
  },
  mounted () {
    bus.$on('getCardInfo', res => {
      this.name = res.name
      this.code = res.id
    })
  }
}
</script>

<style scoped>
.bodyTop{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx 0;
  background: #eee;
}
.topTitle{
  padding:20rpx;
  font-size: 43rpx;
  font-weight: 600;
}
.inputLable{
  padding-left:10rpx;
}
.inputText{
  padding:20rpx 0 20rpx 25rpx;
  width: 700rpx;
  margin: 0 auto;
  border-bottom: 1rpx solid #eee;
}
.phoneBox{
  display: flex;
  align-items: center;
}
.getPhoneBtn{
  width: 50%;
  font-size: 28rpx;
  color: blue;
  margin-right:10rpx;
}
.openCameraTips{
  width: 35%;
  padding-right:20rpx ;
}
.openCameraBtn, .scanCode{
  font-size: 28rpx;
  color: blue;
}

.markCode{
  position: fixed;
  bottom: 0;
  line-height: 120rpx;
  text-align: center;
  width: 100%;
  font-size: 35rpx;
  font-weight: 500;
  letter-spacing:6rpx;
  background: #4b91f1;
  color: #fff;
  z-index: 1;
}
.tubeList{
  display: flex;
  justify-content: space-between;
  padding: 20rpx 25rpx;
}
.iconDelete{
  font-size: 25rpx;
}
.inputBox{
  margin: 30rpx 0;
}
.Redcolor{
  color: red;
}
</style>