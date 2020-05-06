<template>
  <div>
    <div class="topTitle">报告列表</div>
    <scroll-view scroll-y="true" :style="'height:'+ myHeight + 'rpx'">
      <div v-for="(item,index) in list" :key="index"  @click="lookDetails" :data-url="item.thumbnailPath">
        <div class="tableList"> 
          <div class="filebox">
            <div>
              <span class="FilepatientName">{{item.patientName}}</span>  
              <span class="FileSerialNumber">({{item.pathologyNo}})</span>  
            </div>
            <div class="fileName">{{item.applyItemName}}</div>
          </div>    
          <icon type="search" color="#4b91f1"  size="20"/>
        </div>
      </div>
      <div class="bottom">
      </div>
    </scroll-view>
  </div>
</template>

<script>
import {GetBySampleInfoId} from '../../api/index'
export default {
  data () {
    return {
      baseImgUrl: '',
      uid: '',
      myHeight: 700,
      list: []
    }
  },
  methods: {
    lookDetails (e) {
      let path = e.mp.currentTarget.dataset.url
      wx.navigateTo({
        url: '/pages/ReportDetails/main?imgPath=' + path
      })
    },
    getList (params) {
      wx.showLoading({
        title: '加载中...'
      })
      GetBySampleInfoId(params).then(res => {
        if (res.data.length > 0) {
          this.list = res.data
          wx.hideLoading()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '暂无报告',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }

  },
  onLoad (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#4b91f1'
    })
    wx.getSystemInfo({
      success: (res) => {
        let clientHeight = res.windowHeight
        let clientWidth = res.windowWidth
        let ratio = 750 / clientWidth
        let height = clientHeight * ratio
        this.myHeight = height - 87
      }
    })
    if (options.infoId) {
      let id = options.infoId
      this.getList(id)
    } else {
      wx.showToast({
        title: '未获取到身份证号',
        icon: 'none'
      })
    }
  }

}
</script>

<style>
.topTitle{
  padding:20rpx;
  font-size: 43rpx;
  font-weight: 600;
  color: #fff;
  background: #4b91f1;
}
.tableList{
  display: flex;
  justify-content: space-between;
  padding: 20rpx 40rpx;
  margin: 20rpx 0;
  border-bottom: 1rpx solid #ddd;
  align-items: center;
}
.bottom{
  border-bottom: 1rpx solid #FFF;
  margin-bottom: 200rpx;
}
.FilepatientName{
  font-size: 30rpx;
  font-weight: 500;
}
.FileSerialNumber{
  padding-left:20rpx ;
  font-size: 28rpx;
  color: #aaa;
}
.fileName{
  margin-top:20rpx;
  font-size: 28rpx;
  color: #aaa;
}
</style>