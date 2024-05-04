<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{
      errorMessage
    }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Type" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.type"
          placeholder="Enter Type"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Duration" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.duration"
          placeholder="Enter Duration"
          required
        ></b-form-input>
      </b-form-group>
      <div class="add-button">
        <b-button type="submit" variant="primary">Update</b-button>
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
        type: '',
        duration: ''
      },
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    }
    this.getWorkoutDetails()
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        await Api.patch(`/workoutplans/${this.$route.params.workoutid}`, {
          type: this.form.type,
          duration: this.form.duration
        })

        this.$router.push({ path: '/workout-plans' })
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong please try again later'
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.type = ''
      this.form.duration = ''
      this.errorMessage = ''
    },
    getWorkoutDetails() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}`)
        .then((response) => {
          this.form.type = response.data.type
          this.form.duration = response.data.duration
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
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
