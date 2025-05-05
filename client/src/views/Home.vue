<template>
  <div>
    <h3>{{ $t('pageTitleHome') }}</h3>
    <b-table striped hover :items="users" :fields="fields"></b-table>

    <div class="summary-cards">
      <section class="workout-card">
        <img src="/workoutplans.jpg" alt="" />
        <div>
          <h1>{{ $t('totalworkoutPlans') }}</h1>
          <h1>{{ this.summary.workoutCount }}</h1>
        </div>
      </section>
      <section class="session-card">
        <img src="sessions.jpg" alt="" />
        <div>
          <h1>{{ $t('totalSessions') }}</h1>
          <h1>{{ this.summary.sessionCount }}</h1>
        </div>
      </section>
      <section class="exercise-card">
        <img src="/exercises.jpg" alt="" />
        <div>
          <h1>{{ $t('selectedExercises') }}</h1>
          <h1>{{ this.summary.exerciseCount }}</h1>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Api } from '@/Api'

export default {
  name: 'home',
  data() {
    return {
      users: [],
      fields: ['name', 'age', 'email'],
      errorMessage: '',
      summary: {
        workoutCount: 0,
        sessionCount: 0,
        exerciseCount: 0
      }
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getUsers()
      this.getUserSummary()
    }
  },
  methods: {
    getUsers() {
      Api.get('/users/me')
        .then((response) => {
          this.users = [response.data]
        })
        .catch(() => {
          this.errorMessage =
            'Sorry something went wrong please try again later'
        })
    },
    getUserSummary() {
      Api.get('/users/summary')
        .then((response) => {
          this.summary = response.data
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
/*simple mode*/
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

.summary-cards {
  display: flex;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 24px;
  flex-direction: column;
}
.summary-cards section {
  flex: 1;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  display: flex;
  position: relative;
}
.summary-cards section img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  object-position: center;
}
.summary-cards section div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 400px;
}
.workout-card {
  background: #e2caa1;
}
.session-card {
  background: #fff3b0;
  flex-direction: row-reverse;
}
.exercise-card {
  background: #d3d3d3;
}
.workout-card:hover,
.session-card:hover,
.exercise-card:hover {
  background-color: #87ceeb;
}
@media (max-width: 960px) {
  .summary-cards section img {
    width: 200px;
    height: 200px;
  }
  .summary-cards section div {
    height: 200px;
  }
}
@media (max-width: 480px) {
  .summary-cards section img {
    width: 100%;
    height: 200px;
    position: absolute;
    opacity: 0.2;
  }
  .summary-cards section div {
    height: 200px;
    z-index: 1;
  }
}
</style>
