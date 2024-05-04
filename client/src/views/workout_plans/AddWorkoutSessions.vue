<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{
      errorMessage
    }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
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
      <b-form-group id="input-group-3" label="Date" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.date"
          type="date"
          placeholder="yyyy-mm-dd"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-checkbox-group
        id="checkbox-group-1"
        v-model="form.selectedExercises"
        :options="exercises"
        :aria-describedby="ariaDescribedby"
        name="flavour-1"
      ></b-form-checkbox-group>
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
        duration: '',
        date: '',
        selectedExercises: []
      },
      exercises: [],
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getAllExercises()
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        await Api.post(
          `/workoutplans/${this.$route.params.workoutid}/sessions`,
          {
            name: this.form.name,
            duration: this.form.duration,
            date: this.form.date,
            exercises: this.form.selectedExercises
          }
        )

        this.$router.push({
          path: `/workout-plans/${this.$route.params.workoutid}/sessions`
        })
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong please try again later'
      }
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.name = ''
      this.form.duration = ''
      this.form.date = ''
      this.form.selectedExercises = []
      this.errorMessage = ''
    },
    async getAllExercises() {
      try {
        const response = await Api.get('/exercises')
        this.exercises = response.data.map((ex) => {
          return { text: ex.name, value: ex._id }
        })
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong please try again later'
      }
    }
  }
}
</script>

<style>
.add-button {
  display: flex;
  gap: 5px;
}
</style>
