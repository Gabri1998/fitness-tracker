<template>
  <div>
    <h3>Workout plan: {{ workoutDetails.type }} => Sessions</h3>

    <div class="btn_container">
      <b-button @click="deleteWorkoutPlan()" variant="outline-danger"
        >Delete Workout Plan</b-button
      >
    </div>
    <b-table striped hover :items="sessions" :fields="fields"
      ><template #cell(name)="data">
        <router-link
          :to="`/workout-plans/${$route.params.workoutid}/view-session/${data.item._id}`"
          >{{ data.item.name }}</router-link
        >
      </template>
      <template #cell(date)="data">
        {{
          data.item.date
            ? new Intl.DateTimeFormat('en-UK').format(new Date(data.item.date))
            : '-'
        }}
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="`/workout-plans/${$route.params.workoutid}/update-session/${data.item._id}`"
        >
          Update
        </router-link>
        <b-button
          @click="deleteSession(data.item._id)"
          variant="link"
          class="text-danger"
          >Delete</b-button
        >
      </template></b-table
    >
    <router-link :to="`/workout-plans/${$route.params.workoutid}/add-session`">
      Add Session
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  data() {
    return {
      workoutDetails: {},
      sessions: [],
      fields: ['name', 'date', 'duration', 'actions'],
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getSessions()
      this.getWorkoutDetails()
      this.getAllExercises()
    }
  },
  methods: {
    getSessions() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}/sessions`)
        .then((response) => {
          this.sessions = response.data
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    getWorkoutDetails() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}`)
        .then((response) => {
          this.workoutDetails = response.data
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    // Hateos
    deleteWorkoutPlan() {
      Api.delete(
        this.workoutDetails.links.find((li) => li.method === 'DELETE').href
      )
        .then(() => {
          this.$router.push('/workout-plans')
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    deleteSession(sessionid) {
      Api.delete(`/sessions/${sessionid}`)
        .then(() => {
          this.getSessions()
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    async getAllExercises() {
      try {
        const response = await Api.get('/exercises}')
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
.btn_message {
  margin-bottom: 1em;
}
</style>
