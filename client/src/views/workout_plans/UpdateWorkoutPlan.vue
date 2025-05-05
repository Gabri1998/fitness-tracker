<template>
  <div>
    <!-- Display Error Message -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Type Field -->
      <b-form-group id="input-group-1" label="Type" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.type"
          placeholder="Enter Type"
          :state="validateField('type')"
          aria-describedby="type-feedback"
          required
        ></b-form-input>
        <b-form-invalid-feedback id="type-feedback">
          Type is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Duration Field -->
      <b-form-group id="input-group-2" label="Duration" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.duration"
          placeholder="Enter Duration"
          :state="validateField('duration')"
          aria-describedby="duration-feedback"
          required
        ></b-form-input>
        <b-form-invalid-feedback id="duration-feedback">
          Duration is required and must be a valid string.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Buttons -->
      <div class="button-container">
        <b-button
          v-b-tooltip.hover
          title="Submit the changes"
          type="submit"
          variant="primary"
          class="accessible-button primary-button"
        >
          Update
        </b-button>
        <b-button
          v-b-tooltip.hover
          title="Clear all input fields"
          type="reset"
          variant="danger"
          class="accessible-button danger-button"
        >
          Reset
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      form: {
        type: '',
        duration: '' // Duration is now treated as a string
      },
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    }
    this.getWorkoutDetails()
  },
  methods: {
    validateField(field) {
      if (field === 'type') {
        return this.form.type.trim().length > 0
      }
      if (field === 'duration') {
        return this.form.duration.trim().length > 0 // Ensure the string is not empty
      }
      return true
    },
    async onSubmit(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      const isFormValid =
        this.validateField('type') && this.validateField('duration')

      if (!isFormValid) {
        this.errorMessage = 'Please fill out all required fields correctly.'
        return
      }

      try {
        await Api.patch(`/workoutplans/${this.$route.params.workoutid}`, {
          type: this.form.type,
          duration: this.form.duration // Pass duration as a string
        })
        this.$router.push({ path: '/workout-plans' })
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong please try again later'
      }
    },
    onReset(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      this.form.type = ''
      this.form.duration = ''
      this.errorMessage = ''
    },
    getWorkoutDetails() {
      Api.get(`/workoutplans/${this.$route.params.workoutid}`)
        .then((response) => {
          this.form.type = response.data.type
          this.form.duration = response.data.duration // Ensure duration is treated as a string
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong please try again later'
        })
    }
  }
}
</script>

<style>
/* Button Container Layout */
.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* General Button Styling */
.accessible-button {
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  text-transform: uppercase;
  padding: 10px 20px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.primary-button {
  background-color: var(--button-bg); /* Global button background color */
  color: var(--button-text); /* Global button text color */
  border: 2px solid var(--button-bg);
}

.primary-button:hover {
  background-color: var(--button-hover-bg); /* Global hover background */
  color: var(--background-color); /* Contrast text on hover */
  border-color: var(--button-hover-bg); /* Match hover background */
}

.danger-button {
  background-color: var(--secondary-color); /* Global secondary color */
  color: var(--background-color); /* Ensure contrast */
  border: 2px solid var(--secondary-color);
}

.danger-button:hover {
  background-color: #a71d2a; /* Use a darker red for hover */
  color: var(--background-color);
  border-color: #a71d2a;
}

/* Error Alert Styling */
.b-alert {
  text-align: center;
  font-size: 14px;
  margin-bottom: 1em;
}

/* Form Feedback Styling */
.b-form-invalid-feedback {
  color: var(--text-color); /* Use global text color for consistency */
  font-size: 12px;
  font-weight: bold;
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
