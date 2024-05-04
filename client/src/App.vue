<template>
  <div id="app">
   
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="/">Fitness Tracker</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="isLoggedIn"
              ><router-link to="/">Home</router-link></b-nav-item
            >
            <b-nav-item v-if="isLoggedIn"
              ><router-link to="/workout-plans"
                >Workout Plans</router-link
              ></b-nav-item
            >
            <b-nav-item v-if="isLoggedIn"
              ><router-link to="/exercises">Exercises</router-link></b-nav-item
            >
            <b-nav-item v-if="!isLoggedIn"
              ><router-link to="/login">Log in</router-link>
            </b-nav-item>
            <b-nav-item v-if="!isLoggedIn"
              ><router-link to="/Signup">Sign up</router-link></b-nav-item
            >
            <b-nav-item v-if="isLoggedIn">
              <a href="#" @click="logout">Log out</a></b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <!-- Render the content of the current page view -->
    <b-container class="container_layout">
      <router-view />
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('token') != null
    }
  },

  methods: {
    logout(e) {
      e.preventDefault()
      localStorage.removeItem('token')
      // this.$router.push({ path: '/login' })
      window.location.href = '/login'
    }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav-collapse a {
  color: white;
}
.container_layout {
  padding-top: 16px;
  padding-bottom: 16px;
}
</style>
