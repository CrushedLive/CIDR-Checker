import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './plugins/router'
import store from './plugins/store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
