<template>
	<div id="twodcode">
        <image class="twoDCode" :src="qrcodeURL"></image>
    </div>
</template>
<script>
const QR = require('@/utils/weapp-qrcode.js') // 引入二维码的weapp-qrcode.js
export default{
  data () {
    return {
      qrcodeURL: '',
      codeText: '蜻蜓在阳光下逡巡 \n树叶在微风中摇摆 \n一阵突来的山风 \n卷走了你张开的手帕 \n手帕在温暖的注视中\n 飘成了云彩'
      // 这里是需要转为二维码的文字内容
    }
  },
  methods: {
    drawImg () {
      var imgData = QR.drawImg(this.codeText, {
        typeNumber: 4,
        errorCorrectLevel: 'M',
        size: 500
        // 这里照着写就是，如果要彻底弄懂请看weapp-qrcode.js
      })
      this.qrcodeURL = imgData
    }
  },
  mounted () {
    this.drawImg()
  }
}
</script>
<style scoped>
.twoDCode{
		width: 200px;
		height: 200px;
		margin:20% 0 0 0;
	}
</style>