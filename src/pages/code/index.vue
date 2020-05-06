<template>
<div class="body"> 
  <div class="top"></div>
    <div class="topInfo">
      <div class="topInfoName">
        <div class="titleColor">姓名</div>
        <div class="topInfoColor" v-if="showMyInfo">{{name}}</div>
        <div class="topInfoColor" v-else>{{Sname}}</div>
      </div>
      <div class="topInfoCode">
        <div class="titleColor">身份证号</div>
        <div class="topInfoColor" v-if="showMyInfo">{{code}}</div>
        <div class="topInfoColor" v-else>{{Scode}}</div>
      </div>
      <div>
        <i-icon  @click="showInfo" :type="showMyInfo?'browse_fill':'browse'" size="28" color="#FFF" />
      </div>
    </div>
    <div class="codeBox">
        <div class="newTime">更新于：{{Time}}</div>
        <canvas  class="twoDCode" style="width: 200px; height: 200px;" canvas-id="myQrcode"></canvas>
        <div class="btnList">
          <div  @click="RedrawImg">编辑信息  </div>
          <div> | </div>
          <div  @click="searchReport"> 查询报告</div>
          <div> | </div>
          <div  @click="helpOther"> 切换录入人</div>

        </div>
    </div>
      <div class="tips">
        <div>温馨提示 : 请在采集样本之前出示二维码</div>
      </div>
      <div class="bottomMark"> Copyright © {{copyTime}} Kindstar.All Rights Reserved.</div>
</div>
	
</template>
<script>
import drawQrcode from '../../utils/weapp.qrcode.esm'
import {GetmyCode, GetOpenId} from '../../api/index'
import {formatTime} from '../../utils/index'
export default{
  data () {
    return {
      name: '',
      code: '',
      Sname: '',
      Scode: '',
      showMyInfo: false,
      Time: '',
      codeText: '',
      copyTime: ''
    }
  },
  methods: {
    // 绘制二维码
    drawImg () {
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        // ctx: wx.createCanvasContext('myQrcode'),
        text: this.codeText || '二维码信息丢失',
        foreground: '#1D4E89',
        image: {
          imageResource: '../../static/images/logo.png',
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
        }
      })
      wx.showLoading({
        mask: true
      })

      wx.hideLoading()
    },
    // 编辑信息
    RedrawImg () {
      try {
        let MyInfo = wx.getStorageSync('info')
        if (MyInfo) {
          wx.navigateTo({
            url: '/pages/index/main?info=' + JSON.stringify(MyInfo)
          })
        } else {
          wx.navigateTo({
            url: '/pages/index/main'
          })
        }
      } catch (e) {
      }
    },
    // 帮他人录入
    helpOther () {
      wx.showModal({
        title: '提示',
        content: '替他人生成后，该手机将绑定他人信息，是否继续操作？',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/helpOther/main'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 显示隐藏信息
    showInfo () {
      this.showMyInfo = !this.showMyInfo
    },
    // 查询报告
    searchReport () {
      wx.navigateTo({
        url: '/pages/searchReport/main'
      })
    }
  },
  onShow () {
    this.Time = formatTime(new Date())
    this.copyTime = new Date().getFullYear()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#4b91f1'
    })
    wx.showLoading({
      mask: true
    })
    wx.login({
      success: async res => {
        if (res.code) {
          let openId = await GetOpenId(res.code)
          try {
            wx.setStorageSync('openId', openId.data.openid)
            GetmyCode(openId.data.openid).then(res => {
              if (res.data.id) {
                try {
                  this.info = res.data
                  wx.setStorageSync('info', res.data)
                  wx.setStorageSync('state', res.data.state)
                  try {
                    var value = wx.getStorageSync('info')
                    if (value) {
                      console.log(value, '....')
                      this.name = value.patientName
                      this.code = value.patientCardID
                      this.Sname = '*' + value.patientName.substr(1)
                      this.Scode = value.patientCardID.replace(/^(.{4})(?:\w+)(.{4})$/, '$1****$2')
                      let params = {
                        id: value.id,
                        patientName: value.patientName,
                        patientPhone: value.patientPhone,
                        sexName: value.sexName,
                        serialNumber: value.serialNumber,
                        patientCardID: value.patientCardID,
                        ageYear: value.ageYear
                      }
                      this.codeText = JSON.stringify(params)
                      wx.hideLoading()
                      this.drawImg()
                    } else {
                      this.codeText = ''
                      wx.showToast({
                        title: '未获取到二维码信息',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  } catch (e) {
                    // Do something when catch error
                  }
                } catch (e) {
                }
              } else if (res.data === 0) {
                wx.hideLoading()
                wx.showModal({
                  title: '温馨提示',
                  content: '你还未录入二维码信息，是否前往录入？',
                  success (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/index/main'
                      })
                    } else if (res.cancel) {
                      wx.showToast({
                        title: '您也可点击编辑信息，前往录入页面',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  }
                })
              }
            })
          } catch (e) {
          }
        }
      }
    })
  }
}
</script>
<style scoped>
.top{
  height: 300rpx;
  width: 750rpx;
  background: #4b91f1;
  position: absolute;
  top: 0;
  z-index: -1;
}
.topInfo{
  width: 700rpx;
  margin: 10rpx auto;
  display: flex;
}
.titleColor{
  color: #ccc;
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 30rpx;
}
.topInfoName{
  width: 30%;
}
.topInfoCode{
  width: 60%;
}
.topInfoColor{
  color: #eee;
  font-size: 36rpx;
  font-weight: 500;
  margin-bottom: 40rpx;
}
.codeBox{
  width: 700rpx;
  height: 700rpx;
  margin: 20rpx auto;
  background: #fff;
  border-radius: 20rpx;
  text-align: center;
  box-shadow: #466faa 1rpx 1rpx 1px;
}
.newTime{
  line-height: 120rpx;
  color: #aaa;
  font-size: 30rpx;
  font-weight: 500;
}
.twoDCode{
  margin: 0 auto;
}
.btnList{
  display: flex;
  width: 600rpx;
  /* width: 400rpx; */
  justify-content: space-around;
  margin: 50rpx auto;
  font-size: 30rpx;
  font-weight: 600;
  color: #3d6daf;
  letter-spacing: 2rpx;
  align-items: center;
}
.tips{
  margin-top:50rpx;
  font-size: 28rpx;
  text-align: center;
  color: #aaa;
}
.bottomMark{
  position: fixed;
  bottom: 30rpx;
  width: 750rpx;
  font-weight: 500;
  color: #aaa;
  font-size:25rpx;
  text-align: center;
}
</style>