<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{
      errorMessage
    }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter Name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Level" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          v-model="form.level"
          placeholder="Enter Difficulty Level"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Instruction" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.instruction"
          placeholder="Enter Instructions"
          required
        ></b-form-input>
      </b-form-group>
      <div class="add-button">
        <b-button type="submit" variant="primary">Add</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      form: {
        name: '',
        level: '',
        instruction: ''
      },
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        await Api.post('/exercises', {
          name: this.form.name,
          level: this.form.level,
          instruction: this.form.instruction
        })

        this.$router.push({ path: '/exercises' })
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong please try again later'
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.level = ''
      this.form.instruction = ''
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
