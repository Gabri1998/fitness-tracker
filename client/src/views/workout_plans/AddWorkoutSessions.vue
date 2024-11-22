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
          Duration is required and must be a valid number.
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
          ➕ Add
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
    }
  },
  methods: {
    // Validate fields
    validateField(field) {
      if (field === 'name') {
        return this.form.name.trim().length > 0
      }
      if (field === 'duration') {
        return !isNaN(this.form.duration) && this.form.duration > 0
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
        await Api.post(
          `/workoutplans/${this.$route.params.workoutid}/sessions`,
          {
            name: this.form.name,
            duration: this.form.duration,
            date: this.form.date,
            exercises: this.form.selectedExercises
          }
        )
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
      this.form.name = ''
      this.form.duration = ''
      this.form.date = ''
      this.form.selectedExercises = []
      this.errorMessage = ''
    },

    // Fetch exercises
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

<style scoped>
/* General Styling */
.add-button {
  display: flex;
  gap: 10px;
}

/* Submit Button Styling */
.btn-submit {
  background-color: #28a745; /* Green */
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 4px;
  font-weight: bold;
}

.btn-submit:hover {
  background-color: #218838; /* Darker green */
}

/* Reset Button Styling */
.btn-reset {
  background-color: #dc3545; /* Red */
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 4px;
  font-weight: bold;
}

.btn-reset:hover {
  background-color: #c82333; /* Darker red */
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
</style>
