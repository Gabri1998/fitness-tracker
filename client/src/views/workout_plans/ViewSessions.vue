<template>
  <div>
    <div class="header-container">
      <h1 class="header-title">
        <span class="workout-type">{{ workoutDetails.type }}</span> &rarr; Sessions
      </h1>
    </div>

    <b-alert variant="danger" :show="!!errorMessage" class="alert-message">
      {{ errorMessage }}
    </b-alert>

    <div class="btn_container">
      <b-button
        @click="deleteWorkoutPlan"
        variant="outline-danger"
        class="btn-danger"
        v-b-tooltip.hover
        title="Delete this workout plan"
      >
        🗑 Delete Workout Plan
      </b-button>
    </div>

    <b-table striped hover :items="sessions" :fields="fields" class="session-table">
      <template #cell(name)="data">
        <div class="clickable-session">
          <span class="session-icon">▶️</span>
          <router-link
            :to="`/workout-plans/${$route.params.workoutid}/view-session/${data.item._id}`"
            class="session-link"
          >
            {{ data.item.name }}
          </router-link>
        </div>
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
          class="link-update"
        >
          ✏️ Update
        </router-link>
        <b-button
          @click="deleteSession(data.item._id)"
          variant="link"
          class="text-danger btn-delete"
        >
          🗑 Delete
        </b-button>
      </template>
    </b-table>

    <router-link
      :to="`/workout-plans/${$route.params.workoutid}/add-session`"
      class="btn-add"
      v-b-tooltip.hover
      title="Add a new session"
    >
      ➕ Add Session
    </router-link>
  </div>
</template>



<script>
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
    }
  },
  methods: {
    getSessions() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}/sessions`)
        .then((response) => {
          this.sessions = response.data
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong. Please try again later.'
        })
    },
    getWorkoutDetails() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}`)
        .then((response) => {
          this.workoutDetails = response.data
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong. Please try again later.'
        })
    },
    deleteWorkoutPlan() {
      Api.delete(
        this.workoutDetails.links.find((li) => li.method === 'DELETE').href
      )
        .then(() => {
          this.$router.push('/workout-plans')
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong. Please try again later.'
        })
    },
    deleteSession(sessionid) {
      Api.delete(`/sessions/${sessionid}`)
        .then(() => {
          this.getSessions()
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong. Please try again later.'
        })
    }
  }
}
</script>
<style scoped>
/* General Header Styling */
.header-container {
  margin-bottom: 1em;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.workout-type {
  color: #007bff; /* Distinguishable blue */
  font-weight: bold;
}

/* Alert Styling */
.alert-message {
  text-align: center;
  font-size: 14px;
  margin-bottom: 1em;
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
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
}

.btn-danger:hover {
  background-color: #d9363e; /* Darker red on hover */
}

.btn-add {
  display: inline-block;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 1em;
}

.btn-add:hover {
  background-color: #0056b3;
}

/* Table Styling */
.session-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1em;
}

.session-table tbody tr:hover {
  background-color: #f5f5f5;
}

/* Clickable Session Styling */
.clickable-session {
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icon and text */
}

.session-icon {
  color: #007bff; /* Blue for icon */
  font-size: 16px;
}

.session-link {
  color: #0056b3; /* Blue link */
  font-weight: bold;
  text-decoration: none;
}

.session-link:hover {
  color: #003d80; /* Darker blue */
  text-decoration: underline;
}

/* Update Link Styling */
.link-update {
  color: #28a745;
}

.link-update:hover {
  text-decoration: underline;
}

/* Delete Button Styling */
.btn-delete {
  color: #dc3545;
}

.btn-delete:hover {
  color: #a71d2a;
}

/* Tooltip Styling */
[role='tooltip'] {
  font-size: 14px;
}
</style>
