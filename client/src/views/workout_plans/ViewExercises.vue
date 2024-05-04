<template>
  <div>
    <h3>Exercises</h3>
    <div class="btn_container">
      <b-button @click="deleteAllExercise()" variant="outline-danger"
        >Delete All</b-button
      >
    </div>
    <b-table striped hover :items="exercises" :fields="fields">
      <template #cell(actions)="data">
        <router-link :to="`/exercises/${data.item._id}/update`">
          Update
        </router-link>
        <b-button
          @click="deleteExercise(data.item._id)"
          variant="link"
          class="text-danger"
          >Delete</b-button
        >
      </template></b-table
    >
    <router-link to="/exercises/add">Add</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  data() {
    return {
      exercises: [],
      fields: ['name', 'instruction', 'level', 'actions'],
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getExercises()
    }
  },
  methods: {
    getExercises() {
      Api.get('/exercises')
        .then((response) => {
          this.exercises = response.data
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    deleteAllExercise() {
      Api.delete('/exercises')
        .then(() => {
          this.exercises = []
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    deleteExercise(exerciseid) {
      Api.delete(`/exercises/${exerciseid}`)
        .then(() => {
          this.getExercises()
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
.btn_message {
  margin-bottom: 1em;
}
.btn_container {
  display: flex;
  justify-content: end;
  margin-bottom: 1em;
}
</style>
