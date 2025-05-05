<template>
  <div>
    <!-- Error Message -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form Wrapper -->
    <div>
      <b-form @submit="onSubmit" @reset="onReset" novalidate>
        <!-- Type Field -->
        <b-form-group id="input-group-1" label="Workout Type" label-for="input-1">
          <div class="input-with-microphone">
            <!-- Lamp Indicator -->
            <div class="lamp" :class="{ active: activeField === 'type' && isListening }"></div>
            <b-form-input
              ref="type"
              id="input-1"
              v-model="form.type"
              placeholder="Enter Workout Type or Dictate Here"
              :state="validateField('type')"
              required
            ></b-form-input>
            <b-icon
              icon="mic-fill"
              class="microphone-icon"
              @click="toggleRecognition('type')"
              :class="{ active: activeField === 'type' && isListening }"
            />
          </div>
          <b-form-invalid-feedback v-if="!validateField('type')">
            Type is required.
          </b-form-invalid-feedback>
        </b-form-group>

        <!-- Duration Field -->
        <b-form-group id="input-group-2" label="Duration (e.g., '30 days')" label-for="input-2">
          <div class="input-with-microphone">
            <!-- Lamp Indicator -->
            <div class="lamp" :class="{ active: activeField === 'duration' && isListening }"></div>
            <b-form-input
              ref="duration"
              id="input-2"
              v-model="form.duration"
              placeholder="Enter Duration or Dictate Here"
              :state="validateField('duration')"
              required
            ></b-form-input>
            <b-icon
              icon="mic-fill"
              class="microphone-icon"
              @click="toggleRecognition('duration')"
              :class="{ active: activeField === 'duration' && isListening }"
            />
          </div>
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
      errorMessage: '',
      isListening: false, // Indicates if recognition is active
      recognitionTimer: null, // Timer for auto-stopping recognition
      maxRecognitionTime: 10000 // Maximum recognition time in milliseconds (10 seconds)
    };
  },
  methods: {
    async toggleRecognition(field) {
      try {
        if (this.activeField === field && this.isListening) {
          await this.stopRecognition();
        } else {
          if (this.isListening) {
            await this.stopRecognition();
          }

          this.activeField = field; // Track the active field
          this.isListening = true;
          console.log(`[STT] Starting recognition for field: ${field}`);

          // Start speech recognition
          await stt.startRecognition({
            onResult: (text) => {
              if (field === 'duration') {
                this.form[field] = text.trim(); // Replace content for duration
              } else {
                this.form[field] = text.trim(); // Replace content for other fields
              }
              console.log(`[STT] Updated field "${field}" with text: "${text}"`);
            }
          });

          // Set timer for auto-stopping recognition
          this.clearTimer();
          this.recognitionTimer = setTimeout(async () => {
            console.log(`[STT] Auto-stopping recognition for field: ${field}`);
            await this.stopRecognition();
          }, this.maxRecognitionTime);
        }
      } catch (error) {
        console.error('[STT] Error toggling recognition:', error);
        this.errorMessage = 'Speech recognition error. Please try again.';
      }
    },
    async stopRecognition() {
      try {
        await stt.stopRecognition();
        this.isListening = false;
        this.activeField = null;
        this.clearTimer();
        console.log('[STT] Recognition stopped.');
      } catch (error) {
        console.error('[STT] Error stopping recognition:', error);
      }
    },
    clearTimer() {
      if (this.recognitionTimer) {
        clearTimeout(this.recognitionTimer);
        this.recognitionTimer = null;
      }
    },
    validateField(field) {
      const fieldValue = this.form[field]?.trim();
      return fieldValue && fieldValue.length > 0;
    },
    async onSubmit(event) {
      event.preventDefault();

      if (!this.validateField('type') || !this.validateField('duration')) {
        this.errorMessage = 'Please fill out all required fields correctly.';
        return;
      }

      try {
        await Api.post('/workoutplans', this.form);
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
      this.stopRecognition();
    }
  }
};
</script>



<style>

/* Lamp Indicator Styles */
.lamp {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: red;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}
.lamp.active {
  background-color: blue;
}
/* General Styling */
body {
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* Input with Microphone Styling */
.input-with-microphone {
  display: flex;
  align-items: center;
  gap: 8px;
}

.microphone-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.microphone-icon.active {
  color: #007bff;
}

.microphone-icon:hover {
  color: #0056b3;
}

/* Buttons Layout */
.add-button {
  display: flex;
  gap: 10px;
}

/* Submit Button Styling */
.btn-submit {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 2px solid var(--button-bg);
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-submit:hover {
  background-color: var(--button-hover-bg);
  color: var(--background-color);
  border-color: var(--button-hover-bg);
}

/* Reset Button Styling */
.btn-reset {
  background-color: var(--secondary-color);
  color: var(--background-color);
  border: 2px solid var(--secondary-color);
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-reset:hover {
  background-color: #a71d2a;
  color: var(--background-color);
  border-color: #a71d2a;
}

/* Form Feedback */
.b-form-invalid-feedback {
  color: var(--invalid-feedback-color);
}

.b-form-valid-feedback {
  color: var(--valid-feedback-color);
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

/* Responsive Adjustments */
@media (max-width: 768px) {
  .add-button {
    flex-direction: column;
    gap: 15px;
  }

  .btn-submit,
  .btn-reset {
    width: 100%;
    text-align: center;
  }
}
</style>
