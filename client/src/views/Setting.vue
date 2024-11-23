<template>
    <div>
      <h2>Accessibility Settings</h2>
      <b-form-checkbox v-model="settings.isSimpleMode" @change="applySettings">
        Enable Simple Mode
      </b-form-checkbox>
      <b-form-checkbox v-model="settings.enableSound" @change="applySettings">
        Enable Sound Feedback
      </b-form-checkbox>
      <b-form-checkbox v-model="settings.enableHaptics" @change="applySettings">
        Enable Haptic Feedback
      </b-form-checkbox>
    </div>
  </template>

<script>
export default {
  data() {
    return {
      settings: {
        isSimpleMode: false,
        enableSound: true,
        enableHaptics: true
      }
    };
  },
  methods: {
    applySettings() {
      localStorage.setItem('settings', JSON.stringify(this.settings));
      document.body.classList.toggle('simple-mode', this.settings.isSimpleMode);
    }
  },
  mounted() {
    const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};
    this.settings = { ...this.settings, ...savedSettings };
    document.body.classList.toggle('simple-mode', this.settings.isSimpleMode);
  }
};
</script>
