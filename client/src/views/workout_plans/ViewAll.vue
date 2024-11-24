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
/* General Styling */
h3 {
  color: #333;
  margin-bottom: 1em;
  text-align: center;
}

/* Button Styles */
.btn_container {
  display: flex;
  justify-content: end;
  margin-bottom: 1em;
}

.btn-danger {
  background-color: #ff4d4f; /* Red background */
  border: none;
  color: white; /* Ensures text is always white */
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold; /* Makes the text stand out more */
  border-radius: 4px;
}

.btn-danger:hover {
  background-color: #d9363e; /* Darker red on hover */
}

.btn-outline-danger {
  background-color: transparent; /* Transparent background */
  border: 2px solid #ff4d4f; /* Red border */
  color: #ff4d4f; /* Red text */
  font-size: 14px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
}

.btn-outline-danger:hover {
  background-color: #ff4d4f; /* Red background on hover */
  color: white; /* White text on hover */
}
.btn-add {
  display: inline-block;
  background-color: #007bff; /* Default blue background */
  color: white; /* White text for high contrast */
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 1em;
  font-weight: bold; /* Make the text more prominent */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
}

.btn-add:hover {
  background-color: #0056b3; /* Darker blue on hover */
  color: white !important; /* Ensure text remains white on hover */
  text-decoration: none; /* Prevent underline on hover */
}

/* Table Styles */
.workout-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1em;
}

.workout-table tbody tr:hover {
  background-color: #f5f5f5;
}

.link {
  color: #007bff;
  text-decoration: none;
}

/* Distinct Clickable Type Styling */
.clickable-type {
  font-weight: bold; /* Makes it bold */
  color: #0056b3; /* Slightly darker blue */
}

.clickable-type:hover {
  color: #003d80; /* Even darker blue on hover */
  text-decoration: underline;
  cursor: pointer;
}

/* Update Link Styling */
.link-update {
  color: #28a745;
}

.link-update:hover {
  text-decoration: underline;
}

/* Alert Styling */
.b-alert {
  text-align: center;
  font-size: 14px;
  margin-bottom: 1em;
}
</style>
