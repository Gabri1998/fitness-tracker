<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{
      errorMessage
    }}</b-alert>

    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-" label="Your Name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Username:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.username"
          placeholder="Enter Username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="Email address:"
        label-for="input-3"
      >
        <b-form-input
          id="input-3"
          v-model="form.email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Age" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="form.age"
          type="number"
          placeholder="Enter age"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Password" label-for="input-5">
        <b-form-input
          id="input-5"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>

      <div class="signup-button">
        <b-button type="submit" variant="primary">Sigup</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>
<script>
import { Api } from '../Api'

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
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        const response = await Api.post('/auth/register', {
          name: this.form.name,
          username: this.form.username,
          email: this.form.email,
          age: this.form.age,
          password: this.form.password
        })
        localStorage.setItem('token', response.data.token)
        this.$router.push({ path: '/login' })
      } catch (error) {
        console.log('correct', error)
        const status = error.response.status
        if (status === 404 || status === 400) {
          this.errorMessage = 'Username or Email already exists'
        } else {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        }
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.username = ''
      this.form.email = ''
      this.form.age = ''
      this.form.password = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style>
.signup-button {
  display: flex;
  gap: 5px;
}
</style>
