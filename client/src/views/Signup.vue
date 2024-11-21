<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <b-form-group id="input-group-name" label="Your Name" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Enter name"
          :state="validateField('name')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Name is required and must be at least 3 characters.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-email" label="Email address" label-for="input-email">
        <b-form-input
          id="input-email"
          v-model="form.email"
          placeholder="Enter email"
          :state="validateField('email')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Enter a valid email address.</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group id="input-group-password" label="Password" label-for="input-password">
        <b-form-input
          id="input-password"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          :state="validateField('password')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Password must be at least 6 characters long.</b-form-invalid-feedback>
      </b-form-group>

      <div class="signup-button">
        <b-button v-b-tooltip.hover type="submit" variant="primary">Sign Up</b-button>
        <b-button v-b-tooltip.hover type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    validateField(field) {
      switch (field) {
        case 'name':
          return this.form.name.length >= 3;
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email);
        case 'password':
          return this.form.password.length >= 6;
        default:
          return true;
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      if (
        !this.validateField('name') ||
        !this.validateField('email') ||
        !this.validateField('password')
      ) {
        this.errorMessage = 'Please fix the errors before submitting.';
        return;
      }

      try {
        // API call for signup
        this.$router.push('/login');
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    },
    onReset(event) {
      event.preventDefault();
      this.form.name = '';
      this.form.email = '';
      this.form.password = '';
      this.errorMessage = '';
    }
  }
};
</script>

<style>
.signup-button {
  display: flex;
  gap: 5px;
}
</style>
