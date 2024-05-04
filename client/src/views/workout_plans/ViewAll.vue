<template>
  <div>
    <h3>Workout Plans</h3>
    <div class="btn_container">
      <b-button @click="deleteWorkoutPlans()" variant="outline-danger"
        >Delete All</b-button
      >
    </div>
    <b-table striped hover :items="workoutPlans" :fields="fields">
      <template #cell(type)="data">
        <router-link :to="`/workout-plans/${data.item._id}/sessions`">{{
          data.item.type
        }}</router-link> </template
      ><template #cell(dateCreated)="data">
        {{
          data.item.dateCreated
            ? new Intl.DateTimeFormat('en-UK').format(
                new Date(data.item.dateCreated)
              )
            : '-'
        }}
      </template>
      <template #cell(actions)="data">
        <router-link :to="`/workout-plans/${data.item._id}/update`">
          Update Workout
        </router-link>
      </template></b-table
    >
    <router-link to="/workout-plans/add">Add</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  data() {
    return {
      workoutPlans: [],
      fields: ['type', 'dateCreated', 'duration', 'actions'],
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getWorkoutPlans()
    }
  },
  methods: {
    getWorkoutPlans() {
      Api.get('/workoutplans')
        .then((response) => {
          this.workoutPlans = response.data
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    deleteWorkoutPlans() {
      Api.delete('/workoutplans')
        .then(() => {
          this.workoutPlans = []
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
