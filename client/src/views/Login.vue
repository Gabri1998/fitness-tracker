<template>
  <div>
    <!-- Success Toast -->
    <b-toast
      id="success-toast"
      :visible="!!successMessage"
      variant="success"
      solid
      auto-hide-delay="3000"
    >
      {{ successMessage }}
    </b-toast>

    <!-- Error Toast -->
    <b-toast
      id="error-toast"
      :visible="!!errorMessage"
      variant="danger"
      solid
      auto-hide-delay="3000"
    >
      {{ errorMessage }}
    </b-toast>

    <div class="toggle-buttons">
      <b-button
        variant="primary"
        :disabled="activeForm === 'password'"
        @click="activeForm = 'password'"
      >
        Use Password
      </b-button>
      <b-button
        variant="info"
        :disabled="activeForm === 'fingerprint'"
        @click="activeForm = 'fingerprint'"
      >
        Use Fingerprint
      </b-button>
    </div>

    <!-- Password Login Form -->
    <b-form
      v-if="activeForm === 'password'"
      @submit.prevent="onPasswordSubmit"
      novalidate
    >
      <b-form-group label="Email" label-for="password-email">
        <b-form-input
          id="password-email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Password" label-for="password-password">
        <b-form-input
          id="password-password"
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>

    <!-- Fingerprint Login Form -->
    <b-form
      v-if="activeForm === 'fingerprint'"
      @submit.prevent="authenticateWithFingerprint"
      novalidate
    >
      <b-form-group label="Email" label-for="fingerprint-email">
        <b-form-input
          id="fingerprint-email"
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="info">Authenticate</b-button>
    </b-form>
  </div>
</template>

<script>
import { Api } from '../Api';

export default {
  data() {
    return {
      activeForm: 'password', // Default to traditional password login
      form: {
        email: '',
        password: ''
      },
      errorMessage: '',
      successMessage: '' // Success notifications
    };
  },
  methods: {
    // Traditional Login Handler
    async onPasswordSubmit() {
      try {
        console.log('Submitting login request...');
        const response = await Api.post('/auth/login', {
          email: this.form.email,
          password: this.form.password
        });

        // Store token and redirect
        localStorage.setItem('token', response.data.token);
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch (error) {
        console.error('Error during password login:', error.response?.data || error.message);
        this.errorMessage =
          error.response?.data.message || 'Login failed. Please try again.';
      }
    },

    // Fingerprint Authentication Handler
    async authenticateWithFingerprint() {
      try {
        // Step 1: Validate email
        const emailCheckResponse = await Api.post('/webauthn/login', {
          email: this.form.email
        });

        if (!emailCheckResponse.data.success) {
          this.errorMessage = 'Invalid email. Please provide the correct email.';
          return;
        }

        console.log('Email validated. Proceeding to fingerprint authentication...');

        // Convert challenge from base64 to Uint8Array
        const challenge = Uint8Array.from(
          atob(emailCheckResponse.data.challenge),
          (char) => char.charCodeAt(0)
        );

        // Step 2: Trigger fingerprint scanner
        const credential = await navigator.credentials.get({
          publicKey: {
            rpId: window.location.hostname,
            userVerification: 'preferred',
            authenticatorSelection: { authenticatorAttachment: 'platform' },
            challenge
          }
        });

        if (!credential) {
          throw new Error('Fingerprint authentication canceled or failed.');
        }

        console.log('Fingerprint scanner response:', credential);

        // Step 3: Verify with the backend
        const verifyResponse = await Api.post('/webauthn/login/verify', {
          email: this.form.email,
          response: {
            verified: true, // For simplicity
            id: credential.id,
            rawId: Array.from(new Uint8Array(credential.rawId)),
            response: {
              clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
              authenticatorData: Array.from(new Uint8Array(credential.response.authenticatorData)),
              signature: Array.from(new Uint8Array(credential.response.signature))
            },
            type: credential.type
          }
        });

        if (verifyResponse.data.success) {
          localStorage.setItem('token', verifyResponse.data.token);
          this.successMessage = 'Authentication successful! Redirecting...';
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          this.errorMessage = 'Fingerprint authentication failed.';
        }
      } catch (error) {
        console.error('Error during fingerprint authentication:', error);
        this.errorMessage = 'Authentication process failed.';
      }
    }
  }
};
</script>

<style>
/* Optional styles for form layout */
.toggle-buttons {
  margin-bottom: 20px;
}
</style>
