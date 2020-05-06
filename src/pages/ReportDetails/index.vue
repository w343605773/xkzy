<template>
  <div>
    <div class="tips">温馨提示：点击可查看大图</div>
    <div class="imageBox">
      <image @click="showBig" :style="'height:'+ myHeight+'rpx'"  :src="baseImgUrl"></image>
    </div>
  </div>
</template>

<script>
import {GetTestReport} from '../../api/index'
export default {
  data () {
    return {
      baseImgUrl: '',
      myHeight: 800
    }
  },
  methods: {
    getBase64ImageUrl (data) {
      wx.showLoading({
        title: '加载中'
      })
      // 获取到base64Data
      var base64Data = data
      /// 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data))
      /// 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      const base64ImgUrl = 'data:image/png;base64,' + base64Data
      /// 刷新数据
      // console.log(base64ImgUrl)
      this.baseImgUrl = base64ImgUrl
      wx.hideLoading()
    },
    getImagePath (params) {
      GetTestReport(params).then(res => {
        if (res.data) {
          // this.base64ImgUrl = res.data
          this.getBase64ImageUrl(res.data)
        }
      })
    },
    showBig (e) {
      console.log(e)
      wx.previewImage({
        current: this.baseImgUrl, // 当前显示图片的url
        urls: [this.baseImgUrl] // 需要预览的图片url列表 ， 至少包含一条
      })
    }
  },
  onLoad (options) {
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight
        let clientWidth = res.windowWidth
        let ratio = 750 / clientWidth
        let height = clientHeight * ratio
        this.myHeight = height - 200
      }
    })
    if (options.imgPath) {
      let path = options.imgPath
      this.getImagePath(path)
    }
  }
}
</script>

<style>
.tips{
  text-align: center;
  font-size: 28rpx;
  color: #aaa;
}
.imageBox{
  text-align: center;
}
</style>