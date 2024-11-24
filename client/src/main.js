import Vue from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import './assets/styles.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.use(VueI18n);

const messages = { en, es };

const i18n = new VueI18n({
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language
  messages // Translation messages
});

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app');
