import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
// "tabBar": {
//   "color": "#999",
//   "backgroundColor": "#fafafa",
//   "selectedColor": "#333",
//   "borderStyle": "white",
//   "list": [
//     {
//     "pagePath": "pages/index/main",
//     "iconPath": "static/tabs/no_info.png",
//     "selectedIconPath": "static/tabs/info.png",
//     "text": "录入"
//   },
//   {
//     "pagePath": "pages/code/main",
//     "iconPath": "static/tabs/no_person.png",
//     "selectedIconPath": "static/tabs/person.png",
//     "text": "我的"
//   }
//   ]}
