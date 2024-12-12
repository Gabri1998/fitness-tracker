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
      if (navigator.vibrate) navigator.vibrate(50);
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
      if (navigator.vibrate) navigator.vibrate(50);
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
<style>
/* Header Styling */
.header-container {
  margin-bottom: 1em;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.workout-type {
  color: var(--primary-color); /* Use global variable for color */
}

/* Alert Styling */
.alert-message {
  text-align: center;
  margin-bottom: 1em;
}

/* Button Container */
.btn_container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

/* Session Table */
.session-table {
  margin-bottom: 1em;
}

/* Clickable Session */
.clickable-session {
  display: flex;
  align-items: center;
  gap: 8px;
}

.session-icon {
  color: var(--primary-color); /* Use global variable for icon color */
  font-size: 16px;
}

.session-link {
  font-weight: bold;
  text-decoration: none;
}

.session-link:hover {
  text-decoration: underline;
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
