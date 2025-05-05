import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import AllWorkoutPlans from './views/workout_plans/ViewAll.vue'
import AddWorkoutPlan from './views/workout_plans/AddWorkoutPlan.vue'
import ViewWorkoutSessions from './views/workout_plans/ViewSessions.vue'
import AddWorkoutSessions from './views/workout_plans/AddWorkoutSessions.vue'
import UpdateWorkoutSessions from './views/workout_plans/UpdateWorkoutSessions.vue'
import UpdateWorkoutPlan from './views/workout_plans/UpdateWorkoutPlan.vue'
import AllExercises from './views/workout_plans/ViewExercises.vue'
import AddExercise from './views/workout_plans/AddExercise.vue'
import UpdateExercise from './views/workout_plans/UpdateExercise.vue'
import ViewSessionExercises from './views/workout_plans/ViewSessionExercises.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/workout-plans',
      name: 'workout-plans',
      component: AllWorkoutPlans
    },
    {
      path: '/workout-plans/add',
      name: 'workout-plans/add',
      component: AddWorkoutPlan
    },
    {
      path: '/workout-plans/:workoutid/update',
      name: 'workout-plans/:workoutid/update',
      component: UpdateWorkoutPlan
    },
    {
      path: '/workout-plans/:workoutid/sessions',
      name: 'workout-plans/:workoutid/sessions',
      component: ViewWorkoutSessions
    },
    {
      path: '/workout-plans/:workoutid/add-session',
      name: 'workout-plans/:workoutid/add-session',
      component: AddWorkoutSessions
    },
    {
      path: '/workout-plans/:workoutid/update-session/:sessionid',
      name: 'workout-plans/:workoutid/update-session/:sessionid',
      component: UpdateWorkoutSessions
    },
    {
      path: '/workout-plans/:workoutid/view-session/:sessionid',
      name: 'workout-plans/:workoutid/view-session/:sessionid',
      component: ViewSessionExercises
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: AllExercises
    },
    {
      path: '/exercises/add',
      name: 'exercises/add',
      component: AddExercise
    },
    {
      path: '/exercises/:exerciseid/update',
      name: 'exercises/:exerciseid/update',
      component: UpdateExercise
    }
  ]
})
