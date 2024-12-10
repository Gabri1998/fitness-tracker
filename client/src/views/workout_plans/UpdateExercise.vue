<template>
  <div>
    <!-- Display error message for submission errors -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset">
      <!-- Name Field -->
      <b-form-group id="input-group-1" label="Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          :state="!!form.name.trim()"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!form.name.trim()">
          <span class="error-icon">⚠</span> Name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Level Field -->
      <b-form-group id="input-group-2" label="Level" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          v-model="form.level"
          placeholder="Enter level"
          :state="form.level > 0"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!(form.level > 0)">
          <span class="error-icon">⚠</span> Level must be a positive number.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Instruction Field -->
      <b-form-group id="input-group-3" label="Instruction" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.instruction"
          placeholder="Enter instruction"
          :state="!!form.instruction.trim()"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!form.instruction.trim()">
          <span class="error-icon">⚠</span> Instruction is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- File Upload Field -->
      <b-form-group id="input-group-4" label="Upload File (Optional)" label-for="input-4">
        <b-form-file
          id="input-4"
          v-model="form.file"
          accept="image/*,video/*"
          placeholder="Choose a file or drop it here..."
          class="file-upload"
        ></b-form-file>
      </b-form-group>

      <!-- Buttons -->
      <div class="add-button">
        <b-button type="submit" variant="primary" class="btn-primary" v-b-tooltip.hover title="Update exercise">
          Update
        </b-button>
        <b-button type="reset" variant="danger" class="btn-danger" v-b-tooltip.hover title="Reset form fields">
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
        name: '',
        level: '',
        instruction: '',
        file: null // Optional field
      },
      errorMessage: ''
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    }
    this.getExerciseDetails()
  },
  methods: {
    async onSubmit(event) {
      event.preventDefault();
      if (navigator.vibrate) navigator.vibrate(50);

      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('level', this.form.level);
      formData.append('instruction', this.form.instruction);

      if (this.form.file) {
        formData.append('file', this.form.file);
      }

      try {
        await Api.patch(`/exercises/${this.$route.params.exerciseid}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.$router.push({ path: '/exercises' });
      } catch (error) {
        this.errorMessage = "Sorry, couldn't update exercise. Please try again later.";
      }
    },
    onReset(event) {
      event.preventDefault();
      if (navigator.vibrate) navigator.vibrate(50);

      this.form.name = '';
      this.form.level = '';
      this.form.instruction = '';
      this.form.file = null;
    },
    getExerciseDetails() {
      Api.get(`/exercises/${this.$route.params.exerciseid}`)
        .then((response) => {
          this.form.name = response.data.name;
          this.form.level = response.data.level;
          this.form.instruction = response.data.instruction;
        })
        .catch(() => {
          this.errorMessage = "Sorry, couldn't retrieve exercise details. Please try again later.";
        });
    }
  }
}
</script>

<style>
/* Add contrast to input borders */
.form-input {
  border: 2px solid var(--secondary-color);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Style the file upload field */
.file-upload {
  border: 2px dashed var(--secondary-color);
  border-radius: 4px;
  padding: 10px;
  background-color: var(--background-color);
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.file-upload:hover {
  border-color: var(--primary-color);
  background-color: var(--secondary-color);
}

/* Improve error message visibility */
.error-icon {
  color: var(--primary-color);
  margin-right: 5px;
}

/* Button styles */
.btn-primary {
  background-color: var(--primary-color);
  color: var(--background-color);
}

.btn-primary:hover {
  background-color: var(--secondary-color);
}

.btn-danger {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.btn-danger:hover {
  background-color: #a71d2a; /* Optional darker hover for danger */
}

/* Add-button container */
.add-button {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
