import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueI18n from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';
import './assets/styles.css';
import { speakText } from './tts';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { stt } from './stt';


Vue.prototype.$speakText = speakText;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueI18n);

const messages = { en, es };
stt.initRecognition();
const i18n = new VueI18n({
  locale: 'en', // Default language
  fallbackLocale: 'en', // Fallback language
  messages // Translation messages
});

Vue.config.productionTip = false;

Vue.directive('tts', {
  bind(el, binding, vnode) {
    const label = binding.value || el.textContent.trim();
    el.setAttribute('aria-label', label);
    el.classList.add('hoverable');
  }
});


new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app');
