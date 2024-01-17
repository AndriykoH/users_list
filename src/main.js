import Vue from 'vue'
import App from './App.vue'
import vuetify from '@/plugins/vuetify'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueMask);

new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')
