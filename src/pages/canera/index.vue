<template>
  <div>
      <div class="background"></div>
      <div class="topTitle">请拍摄身份证正面信息</div>
      <camera class="Mycamera" device-position="back" flash="off" binderror="error"></camera>
      <div class="PhotoBtnList">
        <button  @click="getCardInfo"  size="small">识别</button>
      </div>
  </div>
</template>

<script>
import common from '../../utils/common'
import {GetCardInfo} from '../../api/index'
import bus from '../../utils/bus'
export default {
  data () {
    return {

    }
  },
  methods: {
    showToast (title, icon) {
      wx.showToast({
        title,
        icon,
        mask: true
      })
    },
    getCardInfo () {
      wx.showLoading({
        title: '识别中...'
      })
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          const file = wx.getFileSystemManager()
          const base64 = file.readFileSync(res.tempImagePath, 'base64')
          let str = common.generateMixed(32)
          let params = {
            app_id: 2135493791,
            time_stamp: Math.ceil(new Date().getTime() / 1000),
            nonce_str: str,
            image: base64,
            card_type: 0
          }
          params.sign = common.getReqSign(params)
          GetCardInfo(params).then(res => {
            if (res.data.ret === 0) {
              let info = res.data.data
              bus.$emit('getCardInfo', info)
              wx.hideLoading()
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.hideLoading()
              this.showToast('识别失败', 'none')
            }
            console.log(res, '返回值')
            this.getPhoto = false
          })
        },
        error (e) {
          console.log(e)
          wx.hideLoading()
          this.showToast('识别失败', 'none')
        }
      })
    }
  },
  mounted () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#4b91f1'
    })
  }
}
</script>

<style>
.background{
  height: 100%;
  width: 750rpx;
  background: #4b91f1;
  position: absolute;
  top: 0;
  z-index: -2;
}
.topTitle{
  line-height: 80rpx;
  font-size: 28rpx;
  color: #fff;
  margin: 20rpx;
  text-align: center;
  letter-spacing:4rpx;
}
.Mycamera{
  margin: 0 auto;
  width: 80%; 
  height: 500rpx;
}
.PhotoBtnList{
  margin: 50rpx auto;
  width: 200rpx;
  letter-spacing:4rpx;
}
</style>