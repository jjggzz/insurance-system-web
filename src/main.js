import Vue from 'vue'
import store from "./store/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'

import axios from 'axios'
Vue.prototype.$axios=axios;
axios.defaults.baseURL = '/api';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;



//全局过滤器，进行时间的格式化
//所谓的全局过滤器即使所有的vue实例都共享的
Vue.filter('dateFormat' ,function(dateStr, pattern=""){
//根据给定的时间字符串，得到特定的时间
  var dt = new Date(dateStr);
  //yyy---mm-dd
  var y = dt.getFullYear(); //得到年份
  var m = dt.getMonth() + 1; //得到月份
  var d = dt.getDate(); //得到日期
  // return y + '-' + m + '-' + d

  if(pattern.toLowerCase() ==="yyyy-mm-dd"){
    return `${y}-${m}-${d}`
  }
  else {
    var hh = dt.getHours();//得到时
    var mm = dt.getMinutes(); //得到分
    var ss = dt.getSeconds();//得到秒
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
});


Vue.use(ElementUI);
Vue.config.productionTip = false;


Vue.prototype.checkAuthority = function (list) {
  const rule = this.$store.getters.rule;
  for (let i = 0 ; i < list.length; i++) {
    if (list[i] == rule) {
      return true
    }
  }
  return false;
};

new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app');
