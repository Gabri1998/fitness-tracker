<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{
      errorMessage
    }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Username" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.username"
          placeholder="Enter Username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Password" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          placeholder="Enter password"
          required
        ></b-form-input>
      </b-form-group>
      <div class="login-button">
        <b-button type="submit" variant="primary">Login</b-button>
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
        username: '',
        password: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        const response = await Api.post('/auth/login', {
          username: this.form.username,
          password: this.form.password
        })
        localStorage.setItem('token', response.data.token)

        // this.$router.push({ path: '/' })
        window.location.href = '/'
      } catch (error) {
        console.log('correct', error)
        const status = error.response.status
        if (status === 404) {
          this.errorMessage = 'Username or password not correct'
        } else {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        }
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.username = ''
      this.form.password = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style>
.login-button {
  display: flex;
  gap: 5px;
}
</style>
