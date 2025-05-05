<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Name Field -->
      <b-form-group id="input-group-name" label="Name" label-for="input-name">
        <b-form-input
          id="input-name"
          v-model="form.name"
          placeholder="Enter name"
          :state="validateField('name')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Name is required and must be at least 3 characters.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Username Field -->
      <b-form-group id="input-group-username" label="Username" label-for="input-username">
        <b-form-input
          id="input-username"
          v-model="form.username"
          placeholder="Enter username"
          :state="validateField('username')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Username is required and must be unique.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Email Field -->
      <b-form-group id="input-group-email" label="Email" label-for="input-email">
        <b-form-input
          id="input-email"
          v-model="form.email"
          placeholder="Enter email"
          :state="validateField('email')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Enter a valid email address.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Age Field -->
      <b-form-group id="input-group-age" label="Age" label-for="input-age">
        <b-form-input
          id="input-age"
          v-model="form.age"
          type="number"
          placeholder="Enter age"
          :state="validateField('age')"
          required
        ></b-form-input>
        <b-form-invalid-feedback>Age is required and must be a number greater than 0.</b-form-invalid-feedback>
      </b-form-group>

      <!-- Password Field -->
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

      <!-- Signup and Reset Buttons -->
      <div class="signup-button">
        <b-button v-b-tooltip.hover type="submit" variant="primary">Sign Up</b-button>
        <b-button v-b-tooltip.hover type="reset" variant="danger">Reset</b-button>
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
        name: '',
        username: '',
        email: '',
        age: '',
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
        case 'username':
          return this.form.username.trim().length > 0 || this.form.email.trim().length > 0;
        case 'email':
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email);
        case 'age':
          return Number(this.form.age) > 0;
        case 'password':
          return this.form.password.length >= 6;
        default:
          return true;
      }
    },
    async onSubmit(event) {
      event.preventDefault();
      console.log('Start submission');

      // Validate all fields
      if (
        !this.validateField('name') ||
        !(this.validateField('username') || this.validateField('email')) ||
        !this.validateField('age') ||
        !this.validateField('password')
      ) {
        this.errorMessage = 'Please fix the errors before submitting.';
        return; // Stops execution if validation fails
      }
      console.log('Validation successful');
      console.log('Form Data:', this.form);

      try {
        // Step 1: Register the user traditionally
        const registerResponse = await Api.post('/auth/register', {
          name: this.form.name,
          username: this.form.username,
          email: this.form.email,
          age: this.form.age,
          password: this.form.password
        });

        const user = registerResponse.data;
        console.log('User registered:', user);

        // Show success message or navigate to the login page
        alert('Signup successful! Redirecting...');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during signup:', error);
        this.errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      }
    },
    onReset(event) {
      event.preventDefault();
      this.form = { name: '', username: '', email: '', age: '', password: '' };
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
