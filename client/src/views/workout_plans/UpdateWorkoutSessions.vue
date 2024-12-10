<template>
  <div>
    <!-- Error Alert -->
    <b-alert variant="danger" :show="!!errorMessage" class="alert-message">
      {{ errorMessage }}
    </b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Name Field -->
      <b-form-group id="input-group-1" label="Session Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter session name"
          :state="validateField('name')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('name')">
          Session name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Duration Field -->
      <b-form-group id="input-group-2" label="Duration (in minutes)" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.duration"
          placeholder="Enter duration"
          :state="validateField('duration')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('duration')">
          Duration is required and must be a valid string.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Date Field -->
      <b-form-group id="input-group-3" label="Session Date" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.date"
          type="date"
          placeholder="yyyy-mm-dd"
          :state="validateField('date')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('date')">
          Please provide a valid date.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Exercises Selection -->
      <b-form-group id="checkbox-group-1" label="Select Exercises">
        <b-form-checkbox-group
          v-model="form.selectedExercises"
          :options="exercises"
          :state="validateField('selectedExercises')"
          name="exercises"
        ></b-form-checkbox-group>
        <b-form-invalid-feedback v-if="!validateField('selectedExercises')">
          Please select at least one exercise.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Action Buttons -->
      <div class="add-button">
        <b-button
          v-b-tooltip.hover
          title="Submit the session"
          type="submit"
          variant="success"
          class="btn-submit"
        >
          💾 Update
        </b-button>
        <b-button
          v-b-tooltip.hover
          title="Clear the form fields"
          type="reset"
          variant="danger"
          class="btn-reset"
        >
          🗑 Reset
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
        name: '',
        duration: '',
        date: '',
        selectedExercises: []
      },
      exercises: [],
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getAllExercises()
      this.getSessionDetails()
    }
  },
  methods: {
    // Validate fields
    validateField(field) {
      if (field === 'name') {
        return this.form.name.trim().length > 0
      }
      if (field === 'duration') {
        return this.form.duration.trim().length > 0
      }
      if (field === 'date') {
        return this.form.date.trim().length > 0
      }
      if (field === 'selectedExercises') {
        return this.form.selectedExercises.length > 0
      }
      return true
    },

    // Handle form submission
    async onSubmit(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      // Validate form
      const isFormValid =
        this.validateField('name') &&
        this.validateField('duration') &&
        this.validateField('date') &&
        this.validateField('selectedExercises')

      if (!isFormValid) {
        this.errorMessage = 'Please fill out all required fields correctly.'
        return
      }

      try {
        await Api.put(`/sessions/${this.$route.params.sessionid}`, {
          name: this.form.name,
          duration: this.form.duration,
          date: this.form.date,
          workoutplan: this.$route.params.workoutid,
          exercises: this.form.selectedExercises
        })
        this.$router.push({
          path: `/workout-plans/${this.$route.params.workoutid}/sessions`
        })
      } catch (error) {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      }
    },

    // Reset form fields
    onReset(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      this.form.name = ''
      this.form.duration = ''
      this.form.date = ''
      this.form.selectedExercises = []
      this.errorMessage = ''
    },

    // Fetch session details
    getSessionDetails() {
      Api.get(`/sessions/${this.$route.params.sessionid}`)
        .then((response) => {
          this.form.name = response.data.name
          this.form.duration = response.data.duration
          this.form.date = this.formatDate(response.data.date)
          this.form.selectedExercises = response.data.exercises
        })
        .catch(() => {
          this.errorMessage = 'Sorry, something went wrong. Please try again later.'
        })
    },

    // Format date
    formatDate(date) {
      date = new Date(date)
      const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`
      const month = `${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}`
      const year = date.getFullYear()
      return `${year}-${month}-${day}`
    },

    // Fetch all exercises
    async getAllExercises() {
      try {
        const response = await Api.get('/exercises')
        this.exercises = response.data.map((ex) => ({
          text: `${ex.name} (${ex.instruction})`,
          value: ex._id
        }))
      } catch (error) {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      }
    }
  }
}
</script>

<style>
/* Form Buttons Layout */
.add-button {
  display: flex;
  gap: 10px; /* Add spacing between buttons */
}

/* Alert Styling */
.alert-message {
  text-align: center;
  font-size: 14px;
  margin-bottom: 1em;
}

/* Tooltip Styling */
[role='tooltip'] {
  font-size: 14px;
}

/* Dynamic Button Styling */
.btn-submit {
  background-color: var(--button-bg); /* Use global primary button background */
  border: none;
  color: var(--button-text); /* Use global button text color */
  font-size: 16px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-submit:hover {
  background-color: var(--button-hover-bg); /* Use global hover background color */
  color: var(--background-color); /* Ensure contrast on hover */
}

/* Reset Button Styling */
.btn-reset {
  background-color: var(--secondary-color); /* Use global secondary color */
  border: none;
  color: var(--background-color); /* Use global background color for text contrast */
  font-size: 16px;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-reset:hover {
  background-color: #c82333; /* Darker red (for error-like buttons) */
  color: var(--background-color);
}
</style>

