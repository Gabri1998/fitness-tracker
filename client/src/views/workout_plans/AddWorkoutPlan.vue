<template>
  <div>
    <!-- Error Message -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form Wrapper -->
    <div>
      <b-form @submit="onSubmit" @reset="onReset" novalidate>
        <!-- Type Field -->
        <b-form-group id="input-group-1" label="Workout Type" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.type"
            placeholder="Enter Workout Type or Dictate Here"
            @focus="startRecognitionFor('type')"
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
            placeholder="Enter Duration or Dictate Here"
            @focus="startRecognitionFor('duration')"
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
          <button @click="toggleSpeechRecognition">
            {{ isListening ? 'Stop Listening' : 'Start Listening' }}
          </button>
        </div>
      </b-form>
    </div>
  </div>
</template>


<script>
import { Api } from '@/Api';
import { stt } from '@/stt';

export default {
  data() {
    return {
      form: {
        type: '',
        duration: ''
      },
      activeField: null, // Tracks the active field for STT
      errorMessage: ''
    };
  },
  computed: {
    recognizedText() {
      return stt.getRecognizedText();
    },
    isListening() {
      return stt.isRecognitionActive();
    }
  },
  methods: {
    toggleSpeechRecognition() {
      if (stt.isRecognitionActive()) {
        stt.stopRecognition();
        this.activeField = null; // Clear active field when stopping STT
      } else {
        stt.startRecognition();
      }
    },
    startRecognitionFor(field) {
      this.activeField = field;
      stt.recognizedText = ''; // Clear previous recognized text
      if (!stt.isRecognitionActive()) {
        stt.startRecognition();
      }
    },
    validateField(field) {
      const fieldValue = this.form[field].trim();
      const recognizedValue = this.activeField === field ? this.recognizedText.trim() : '';
      return fieldValue.length > 0 || recognizedValue.length > 0;
    },
    async onSubmit(event) {
      event.preventDefault();

      // Combine manually entered and recognized text for submission
      const type =
        this.activeField === 'type' && this.recognizedText.trim()
          ? this.recognizedText
          : this.form.type;
      const duration =
        this.activeField === 'duration' && this.recognizedText.trim()
          ? this.recognizedText
          : this.form.duration;

      if (!type.trim() || !duration.trim()) {
        this.errorMessage = 'Please fill out all required fields correctly.';
        return;
      }

      try {
        await Api.post('/workoutplans', { type: type.trim(), duration: duration.trim() });
        this.$router.push({ path: '/workout-plans' });
      } catch (error) {
        this.errorMessage = 'Sorry, something went wrong. Please try again later.';
      }
    },
    onReset(event) {
      event.preventDefault();
      this.form.type = '';
      this.form.duration = '';
      this.errorMessage = '';
      stt.recognizedText = ''; // Clear STT text
    }
  },
  watch: {
    recognizedText(newValue) {
      // Update the active field with recognized text in real time
      if (this.activeField) {
        this.form[this.activeField] = newValue;
      }
    }
  }
};
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

