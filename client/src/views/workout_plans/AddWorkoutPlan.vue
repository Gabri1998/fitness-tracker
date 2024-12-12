<template>
  <div>
    <!-- Error Message -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Type Field -->
      <b-form-group id="input-group-1" label="Workout Type" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.type"
          placeholder="Enter Workout Type"
          :state="validateField('type')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('type')">
          Type is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Duration Field -->
      <b-form-group id="input-group-2" label="Duration (e.g., '30 days')" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.duration"
          placeholder="Enter Duration"
          :state="validateField('duration')"
          required
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('duration')">
          Duration is required and must be a valid string.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Buttons -->
      <div class="add-button">
        <b-button
          v-b-tooltip.hover
          title="Submit the workout plan"
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
        type: '',
        duration: '' // Treating duration as a string
      },
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    }
  },
  methods: {
    // Real-time validation for fields
    validateField(field) {
      if (field === 'type') {
        return this.form.type.trim().length > 0
      }
      if (field === 'duration') {
        return this.form.duration.trim().length > 0 // Validate as non-empty string
      }
      return true
    },

    // Submit form
    async onSubmit(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      // Validate form before submission
      const isFormValid = this.validateField('type') && this.validateField('duration')
      if (!isFormValid) {
        this.errorMessage = 'Please fill out all required fields correctly.'
        return
      }

      try {
        await Api.post('/workoutplans', {
          type: this.form.type,
          duration: this.form.duration // Sending duration as a string
        })
        this.$router.push({ path: '/workout-plans' })
      } catch (error) {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.'
      }
    },

    // Reset form fields
    onReset(event) {
      event.preventDefault()
      if (navigator.vibrate) navigator.vibrate(50);
      this.form.type = ''
      this.form.duration = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style>
/* Button Layout */
.add-button {
  display: flex;
  gap: 10px;
}

/* Submit Button Styling */
.btn-submit {
  background-color: var(--button-bg); /* Use global button background */
  color: var(--button-text); /* Use global button text color */
  border: 2px solid var(--button-bg); /* Ensure consistent border */
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-submit:hover {
  background-color: var(--button-hover-bg); /* Global hover background */
  color: var(--background-color); /* Ensure contrast on hover */
  border-color: var(--button-hover-bg);
}

/* Reset Button Styling */
.btn-reset {
  background-color: var(--secondary-color); /* Global secondary color */
  color: var(--background-color); /* Ensure text contrast */
  border: 2px solid var(--secondary-color);
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-reset:hover {
  background-color: #a71d2a; /* Darker red for hover */
  color: var(--background-color); /* Ensure text contrast */
  border-color: #a71d2a;
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

