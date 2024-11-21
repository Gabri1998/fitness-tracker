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
/* General Button Styling */
.accessible-button {
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  text-transform: uppercase;
  padding: 10px 20px;
}

.primary-button {
  background-color: #007bff;
  color: #ffffff;
  border: 2px solid #007bff;
}

.primary-button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.danger-button {
  background-color: #dc3545;
  color: #ffffff;
  border: 2px solid #dc3545;
}

.danger-button:hover {
  background-color: #a71d2a;
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
  color: #e3342f;
  font-size: 12px;
  font-weight: bold;
}

/* Button Container */
.button-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
