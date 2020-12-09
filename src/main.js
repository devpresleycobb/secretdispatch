import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import 'vuetify/dist/vuetify.min.css';
import './assets/css/style.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
