<template>
  <div>
    {{ form.name }}
    <hr />

    <b-form-checkbox-group
      id="checkbox-group-1"
      v-model="form.selectedExercises"
      :options="exercises"
      :aria-describedby="ariaDescribedby"
      name="flavour-1"
      stacked
      disabled
    ></b-form-checkbox-group>
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
      this.getSessionDetails()
    }
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault()
      try {
        await Api.put(`/sessions/${this.$route.params.sessionid}`, {
          name: this.form.name,
          duration: this.form.duration,
          date: this.form.date,
          workoutplan: this.$route.params.workoutid,
          exercises: this.form.selectedExercises
        })

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
    formatDate(date) {
      date = new Date(date)
      const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`
      const month = `${date.getMonth() + 1 < 10 ? '0' : ''}${
        date.getMonth() + 1
      }`
      const year = date.getFullYear()
      return `${year}-${month}-${day}`
    },
    getSessionDetails() {
      Api.get(`/sessions/${this.$route.params.sessionid}`)
        .then((response) => {
          this.form.name = response.data.name
          this.form.duration = response.data.duration
          this.form.date = this.formatDate(response.data.date)
          this.form.selectedExercises = response.data.exercises
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },

    async getAllExercises() {
      try {
        const response = await Api.get('/exercises')
        this.exercises = response.data.map((ex) => {
          return {
            text: `${ex.name}   -   - ${ex.instruction}`,
            value: ex._id,
            instruction: ex.instruction
          }
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
