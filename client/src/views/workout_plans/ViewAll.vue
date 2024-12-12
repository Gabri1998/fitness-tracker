<template>
  <div>
    <h3>{{ $t('pageTitleWorkoutPlans') }}</h3>

    <!-- Display Error Message -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Buttons -->
    <div class="btn_container">
  <b-button
    @click="deleteWorkoutPlans"
    variant="outline-danger"
    class="btn-outline-danger"
    v-b-tooltip.hover
    title="Delete all workout plans"
  >
    🗑 Delete All
  </b-button>
</div>

    <!-- Table -->
    <b-table striped hover :items="workoutPlans" :fields="fields" class="workout-table">
      <template #cell(type)="data">
        <router-link
          :to="`/workout-plans/${data.item._id}/sessions`"
          class="link clickable-type"
        >
          ▶️ {{ data.item.type }}
        </router-link>
      </template>
      <template #cell(dateCreated)="data">
        {{
          data.item.dateCreated
            ? new Intl.DateTimeFormat('en-UK').format(new Date(data.item.dateCreated))
            : '-'
        }}
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="`/workout-plans/${data.item._id}/update`"
          class="link-update"
        >
          ✏️ Update Workout
        </router-link>
      </template>
    </b-table>

    <!-- Add Button -->
    <router-link
      to="/workout-plans/add"
      class="btn-add"
      v-b-tooltip.hover
      title="Add a new workout plan"
    >
      ➕ Add Workout Plan
    </router-link>
  </div>
</template>

<script>
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
      if (navigator.vibrate) navigator.vibrate(50);
      Api.get('/workoutplans')
        .then((response) => {
          this.workoutPlans = response.data
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong please try again later'
        })
    },
    deleteWorkoutPlans() {
      if (navigator.vibrate) navigator.vibrate(50);
      Api.delete('/workoutplans')
        .then(() => {
          this.workoutPlans = []
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong please try again later'
        })
    }
  }
}
</script>

<style>
/* General Header Styling */
h3 {
  text-align: center;
  margin-bottom: 1em;
  color: var(--text-color); /* Use global text color */
  font-weight: bold;
}

/* Button Container */
.btn_container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

/* Add Button */
.btn-add {
  display: inline-block;
  margin-top: 1em;
  font-weight: bold; /* Highlight button text */
}

/* Table Styling */
.workout-table {
  margin-bottom: 1em;
}

/* Clickable Link */
.clickable-type {
  font-weight: bold; /* Highlight workout types */
  cursor: pointer;
}

/* Tooltip Styling */
[role='tooltip'] {
  font-size: 14px;
}

/* simple mode */
.simple-mode h1,
.simple-mode p {
  font-size: 1.5rem;
}

.simple-mode h3{
  font-size: 2rem;
}

.simple-mode button {
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
}
</style>
