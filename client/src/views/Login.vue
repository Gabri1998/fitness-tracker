<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Username Field -->
      <b-form-group id="input-group-1" label="Username" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.username"
          :state="validateField('username')"
          placeholder="Enter Username"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('username')">
          Username is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password Field -->
      <b-form-group id="input-group-2" label="Password" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          :state="validateField('password')"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('password')">
          Password is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Login and Reset Buttons -->
      <div class="login-button">
        <b-button v-b-tooltip.hover title="Submit your credentials" type="submit" variant="primary">
          {{ $t('login') }}
        </b-button>
        <b-button v-b-tooltip.hover title="Clear all fields" type="reset" variant="danger">
          {{ $t('reset') }}
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { Api } from '../Api';

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    // Validation method
    validateField(field) {
      if (field === 'username') {
        return this.form.username.trim().length > 0;
      }
      if (field === 'password') {
        return this.form.password.trim().length > 0;
      }
      return true;
    },

    // Handle form submission
    async onSubmit(event) {
      event.preventDefault();
      try {
        if (navigator.vibrate) navigator.vibrate(50);
        const response = await Api.post('/auth/login', {
          username: this.form.username,
          password: this.form.password
        });
        localStorage.setItem('token', response.data.token);
        window.location.href = '/';
      } catch (error) {
        console.log('Error during login:', error);
        const status = error.response?.status;
        if (status === 404) {
          this.errorMessage = 'Username or password not correct';
        } else {
          this.errorMessage = 'Sorry, something went wrong. Please try again later.';
        }
      }
    },

    // Reset the form
    onReset(event) {
      event.preventDefault();
      if (navigator.vibrate) navigator.vibrate(50);
      this.form.username = '';
      this.form.password = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style>
.login-button {
  display: flex;
  gap: 5px;
}
</style>
