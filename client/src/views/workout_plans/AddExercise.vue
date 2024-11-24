<template>
  <div>
    <!-- Display error message for overall submission errors -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Name Field -->
      <b-form-group id="input-group-1" label="Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter Name"
          :state="validateField('name')"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('name')">
          <span class="error-icon">⚠</span> Name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Level Field -->
      <b-form-group id="input-group-2" label="Difficulty Level" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          v-model="form.level"
          placeholder="Enter Difficulty Level"
          :state="validateField('level')"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('level')">
          <span class="error-icon">⚠</span> Difficulty Level must be a number greater than 0.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Instruction Field -->
      <b-form-group id="input-group-3" label="Instruction" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.instruction"
          placeholder="Enter Instructions"
          :state="validateField('instruction')"
          required
          class="form-input"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!validateField('instruction')">
          <span class="error-icon">⚠</span> Instructions are required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- File Upload Field (Optional) -->
      <b-form-group id="input-group-4" label="Upload File (Optional)" label-for="input-4">
        <b-form-file
          id="input-4"
          v-model="form.file"
          accept="image/*,video/*"
          placeholder="Choose a file..."
          drop-placeholder="Drop file here..."
          class="file-upload"
        ></b-form-file>
        <!-- No validation feedback for optional field -->
      </b-form-group>

      <!-- Buttons -->
      <div class="add-button">
        <b-button v-b-tooltip.hover title="Submit the exercise" type="submit" variant="primary" class="btn-primary">
          Add
        </b-button>
        <b-button v-b-tooltip.hover title="Clear the form fields" type="reset" variant="danger" class="btn-danger">
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
  methods: {
    // Validate individual fields in real-time
    validateField(field) {
      if (field === 'name') {
        return this.form.name.trim().length > 0;
      }
      if (field === 'level') {
        return this.form.level > 0;
      }
      if (field === 'instruction') {
        return this.form.instruction.trim().length > 0;
      }
      // File field is optional, so always return true
      if (field === 'file') {
        return true;
      }
      return true;
    },

    // Handle form submission
    async onSubmit(event) {
      event.preventDefault();
      if (navigator.vibrate) navigator.vibrate(50);
      // Check if the form is valid before submitting
      const isFormValid =
        this.validateField('name') &&
        this.validateField('level') &&
        this.validateField('instruction');

      if (!isFormValid) {
        this.errorMessage = 'Please fill out all required fields correctly.';
        return;
      }

      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('level', this.form.level);
      formData.append('instruction', this.form.instruction);
      if (this.form.file) {
        formData.append('file', this.form.file); // Append file only if it exists
      }

      try {
        await Api.post('/exercises', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.$router.push({ path: '/exercises' });
      } catch (error) {
        this.errorMessage = 'Sorry, could not create exercise. Please try again later.';
      }
    },

    // Reset form fields
    onReset(event) {
      event.preventDefault();
      if (navigator.vibrate) navigator.vibrate(50);
      this.form.name = '';
      this.form.level = '';
      this.form.instruction = '';
      this.form.file = null; // Reset optional field
      this.errorMessage = '';
    }
  }
}
</script>

<style>
/* Add contrast to input borders */
.form-input {
  border: 2px solid #ced4da;
  border-radius: 4px;
}

.form-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Style the file upload field */
.file-upload {
  border: 2px dashed #ced4da;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
}

.file-upload:hover {
  border-color: #007bff;
  background-color: #e9ecef;
}

/* Improve error message visibility */
.error-icon {
  color: #ff4d4f;
  margin-right: 5px;
}

/* Button styles */
.btn-primary {
  background-color: #007bff;
  border: none;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  border: none;
  color: white;
}

.btn-danger:hover {
  background-color: #a71d2a;
}

.add-button {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
