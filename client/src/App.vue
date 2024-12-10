<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <!-- Navbar Brand -->
        <b-navbar-brand href="/">{{ $t('welcome') }}</b-navbar-brand>

        <!-- Navbar Toggle Button -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- Navbar Items -->
        <b-collapse id="nav-collapse" is-nav class="navbar-collapse-custom">
          <b-navbar-nav class="nav-left">
            <!-- Left-aligned items (empty for now) -->
          </b-navbar-nav>

          <!-- Centered Links -->
          <b-navbar-nav class="mx-auto nav-center">
            <b-nav-item v-if="isLoggedIn">
              <router-link to="/">{{ $t('home') }}</router-link>
            </b-nav-item>
            <b-nav-item v-if="isLoggedIn">
              <router-link to="/workout-plans">{{ $t('workoutPlans') }}</router-link>
            </b-nav-item>
            <b-nav-item v-if="isLoggedIn">
              <router-link to="/exercises">{{ $t('exercisesList') }}</router-link>
            </b-nav-item>
          </b-navbar-nav>

          <!-- Right-aligned Items -->
          <b-navbar-nav class="nav-right">
            <!-- Simple Mode Toggle -->
            <b-nav-item @click="toggleSimpleMode">
              <b-icon icon="eye"></b-icon> {{ simpleModeLabel }}
            </b-nav-item>
            <!-- TTS Welcome Message -->
            <b-nav-item @click="speakText('Welcome to Fitness Tracker!')">
              <b-icon icon="volume-up"></b-icon> {{ $t('readWelcome') }}
            </b-nav-item>
            <!-- Color Mode -->
            <b-nav-item-dropdown
            text="Color Mode"
            right
            menu-class="dropdown-menu-custom"
             >
            <b-dropdown-item @click="setColorMode('normal')">Normal Mode</b-dropdown-item>
            <b-dropdown-item @click="setColorMode('protanopia')">Protanopia</b-dropdown-item>
            <b-dropdown-item @click="setColorMode('deuteranopia')">Deuteranopia</b-dropdown-item>
            <b-dropdown-item @click="setColorMode('tritanopia')">Tritanopia</b-dropdown-item>
             </b-nav-item-dropdown>


            <!-- User Authentication Links -->
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/login">{{ $t('login') }}</router-link>
            </b-nav-item>
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/signup">{{ $t('signup') }}</router-link>
            </b-nav-item>

            <!-- Profile Dropdown -->
            <b-nav-item-dropdown
              v-if="isLoggedIn"
              :text="$t('profile')"
              right
              toggle-class="profile-dropdown-toggle"
              menu-class="dropdown-menu-custom"
            >

              <b-dropdown-item @click="changeLanguage(getAlternativeLanguage)">
                🌐 {{ languageButtonText }}
              </b-dropdown-item>
              <b-dropdown-item @click="deleteAccount" class="dropdown-item-delete">
                ❌ {{ $t('deleteAccount') }}
              </b-dropdown-item>
              <b-dropdown-item @click="logout" class="dropdown-item-logout">
                🚪 {{ $t('logout') }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <b-container class="container_layout">
      <router-view />
    </b-container>
  </div>
</template>

<script>
import { Api } from '@/Api';
import { playFeedbackSound } from '@/feedback';
import { speakText } from '@/tts';

export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('token') != null,
      isSimpleMode: false, // State for Simple Mode
      currentColorMode: 'normal', // Default mode
      colorModes: {
        normal: {
          '--primary-color': '#007bff',
          '--secondary-color': '#6c757d',
          '--background-color': '#ffffff',
          '--text-color': '#212529'
        },
        protanopia: {
          '--primary-color': '#ffa500',
          '--secondary-color': '#008080',
          '--background-color': '#f5f5f5',
          '--text-color': '#1c1c1c'
        },
        deuteranopia: {
          '--primary-color': '#ffd700',
          '--secondary-color': '#20b2aa',
          '--background-color': '#fafafa',
          '--text-color': '#121212'
        },
        tritanopia: {
          '--primary-color': '#ffa500',
          '--secondary-color': '#ff00ff',
          '--background-color': '#fdfdfd',
          '--text-color': '#101010'
        }
      }
    };
  },
  computed: {
    // Dynamically update the label for Simple Mode toggle
    simpleModeLabel() {
      return this.isSimpleMode ? this.$t('simpleModeDisable') : this.$t('simpleModeEnable');
    },
    // Display button text for the alternative language
    languageButtonText() {
      return this.$i18n.locale === 'en' ? this.$t('languageSpanish') : this.$t('languageEnglish');
    },
    // Get the alternative language code
    getAlternativeLanguage() {
      return this.$i18n.locale === 'en' ? 'es' : 'en';
    }
  },
  methods: {
    setColorMode(mode) {
      this.currentColorMode = mode;
      const root = document.documentElement;
      const colors = this.colorModes[mode];
      for (const [key, value] of Object.entries(colors)) {
        root.style.setProperty(key, value);
      }
      localStorage.setItem('colorMode', mode); // Save the mode
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
    },
    toggleSimpleMode() {
      this.isSimpleMode = !this.isSimpleMode; // Toggle the state
      console.log('Simple Mode:', this.isSimpleMode); // Debugging log
      const appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.classList.toggle('simple-mode', this.isSimpleMode);
      }
    },
    speakText(message) {
      if (navigator.vibrate) navigator.vibrate(50);
      console.log('Vue speakText method called with:', message);
      try {
        speakText(message);
      } catch (error) {
        console.error('Error in Text-to-Speech:', error);
        alert('An error occurred while trying to read the text.');
      }
    },
    handleSuccess() {
      if (navigator.vibrate) navigator.vibrate(50);
      playFeedbackSound('success');
      console.log('Success action triggered!');
    },
    handleError() {
      if (navigator.vibrate) navigator.vibrate(50);
      playFeedbackSound('error');
      console.error('Error action triggered!');
    },
    deleteAccount() {
      if (navigator.vibrate) navigator.vibrate(50);
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        const token = localStorage.getItem('token');
        let userId;
        try {
          userId = this.decodeUserIdFromToken(token);
        } catch (err) {
          alert('Invalid user session. Please log in again.');
          this.logout();
          return;
        }
        Api.delete(`/users/${userId}`, {
          headers: { Authorization: token }
        })
          .then(() => {
            localStorage.removeItem('token');
            alert('Your account has been successfully deleted.');
            window.location.href = '/signup';
          })
          .catch(() => {
            alert('Failed to delete account. Please try again later.');
          });
      }
    },
    decodeUserIdFromToken(token) {
      if (!token) {
        throw new Error('Token is missing or invalid.');
      }
      const [encryptedUserId] = token.split(':');
      return encryptedUserId;
    },
    logout() {
      if (navigator.vibrate) navigator.vibrate(50);
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  },
  mounted() {
    const savedMode = localStorage.getItem('colorMode') || 'normal';
    this.setColorMode(savedMode);
  }
};
</script>
<style>
/* Navbar Background and Text */
.b-navbar {
  background-color: #f57c00; /* Warm orange for high contrast */
  border-bottom: 3px solid #e65100; /* Slightly darker orange for separation */
  display: flex;
  justify-content: space-between; /* Ensures left, center, and right sections are spaced out */
  align-items: center;
}

/* Navbar Brand */
.b-navbar-brand {
  color: #ffffff !important; /* Bright white for maximum visibility */
  font-weight: bold;
}

.b-navbar-brand:hover {
  color: #ffeb3b !important; /* Bright yellow hover effect for brand */
}

/* Centered Navbar Links */
.nav-center .b-nav-item {
  margin: 0 10px;
}

.b-navbar-nav a {
  color: #ffffff !important; /* Bright white for strong contrast */
  font-weight: bold; /* Emphasize text for visibility */
  text-transform: uppercase; /* Uppercase for readability */
  font-size: 1.1rem; /* Slightly larger font size */
  letter-spacing: 0.5px; /* Slightly spaced for clarity */
}

.b-navbar-nav a:hover {
  color: #ffeb3b !important; /* Bright yellow on hover for clear feedback */
  background-color: rgba(255, 255, 255, 0.1); /* Subtle white background hover */
  text-decoration: underline; /* Non-color indicator for hover */
}

.b-navbar-nav a:focus {
  color: #ffffff !important; /* Retain white text on focus */
  background-color: #e65100; /* Slightly darker orange for focus background */
  outline: 2px solid #ffd54f; /* Yellow focus ring for accessibility */
  outline-offset: 2px;
}

/* Right-aligned Items */
.nav-right .b-nav-item {
  margin: 0 10px;
}

/* Profile Dropdown Toggle */
.profile-dropdown-toggle {
  font-weight: bold;
  color: #ffffff !important;
}

.profile-dropdown-toggle:hover {
  text-decoration: underline; /* Visual indicator for hover */
  color: #ffeb3b !important; /* Bright yellow hover effect */
}

/* Profile Dropdown Menu */
.dropdown-menu-custom {
  background-color: #1a1a1a; /* Dark background for contrast */
  border: 1px solid #444; /* Slightly visible border */
  color: #ffffff !important; /* Ensure dropdown content is white */
  padding: 10px;
  border-radius: 5px;
}

/* Dropdown Items */
.dropdown-item-delete,
.dropdown-item-logout {
  font-weight: bold;
  color: #ffffff !important; /* White text */
}

.dropdown-item-delete:hover {
  background-color: #ffe5e5; /* Light red hover effect */
  color: #cc0000 !important; /* Dark red text for hover */
}

.dropdown-item-logout:hover {
  background-color: #d4f1f9; /* Light blue hover effect */
  color: #0d6efd !important; /* Bright blue text for hover */
}

/* Adjustments for Mobile Screens */
@media (max-width: 768px) {
  .b-navbar {
    background-color: #ff9800; /* Slightly brighter orange for small screens */
  }

  .b-navbar-nav a {
    font-size: 1rem; /* Slightly smaller font size for better spacing */
  }

  .dropdown-menu-custom {
    padding: 8px; /* Slightly reduced padding for mobile */
  }
}

/* Page-wide Typography */
body {
  font-family: 'Roboto', sans-serif;
  color: #333; /* Default text color */
  background-color: #f9f9f9; /* Default background */
  margin: 0;
  padding: 0;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: bold;
  line-height: 1.2;
}

/* General Button Styles */
button {
  font-family: inherit; /* Match button font to the document */
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #0069d9;
  color: white;
  transform: scale(1.05);
}

/* Accessibility Enhancements */
.color-blind-friendly {
  background-color: #d9e6f2; /* Soft blue */
  border: 2px solid #0057b8; /* Strong blue for contrast */
}

.btn.color-blind-friendly {
  background-color: #007bff; /* Accessible blue */
  color: white;
  border: 2px solid #0056b3; /* High-contrast border */
}

.btn.color-blind-friendly:hover {
  background-color: #0056b3; /* Darker blue on hover */
  border-color: #003d80;
}

/* Cards */
.card {
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

th,
td {
  text-align: left;
  padding: 8px;
}

th {
  background-color: #007bff;
  color: white;
}

td {
  border-bottom: 1px solid #ddd;
}

/* High Contrast Mode */
.high-contrast {
  background-color: #333333; /* Dark background */
  color: white; /* High contrast text */
}

/* Forms */
input,
textarea,
select {
  font-family: inherit;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

/* General Alerts */
.alert {
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* General Links */
a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  text-decoration: underline;
  color: #0056b3;
}

/* Flexbox Utilities */
.flex {
  display: flex;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
  align-items: center;
}

/* Global Modal Styles */
.modal {
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Tooltip Styling */
.tooltip-inner {
  background-color: #333;
  color: white;
}

.tooltip-arrow {
  border-top-color: #333;
}

/* Simple Mode Adjustments */
.simple-mode h1,
.simple-mode h2,
.simple-mode h3,
.simple-mode p {
  font-size: 1.5rem;
  line-height: 1.8;
}

.simple-mode button {
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
}

.simple-mode b-table {
  font-size: 1.2rem;
}

/* Summary Cards */
.summary-cards {
  display: flex;
  padding-top: 24px;
  padding-bottom: 24px;
  gap: 24px;
  flex-direction: column;
}

.summary-cards section {
  flex: 1;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  display: flex;
  position: relative;
}

.summary-cards section img {
  width: 400px;
  height: 400px;
  object-fit: cover;
  object-position: center;
}

.summary-cards section div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 400px;
}

.workout-card {
  background: #e2caa1;
}

.session-card {
  background: #fff3b0;
  flex-direction: row-reverse;
}

.exercise-card {
  background: #d3d3d3;
}

.workout-card:hover {
  background-color: #87ceeb;
}

.session-card:hover {
  background-color: #87ceeb;
}

.exercise-card:hover {
  background-color: #87ceeb;
}

/* Responsive Adjustments */
@media (max-width: 960px) {
  .summary-cards section img {
    width: 200px;
    height: 200px;
  }
  .summary-cards section div {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .summary-cards section img {
    width: 100%;
    height: 200px;
    position: absolute;
    opacity: 0.2;
  }
  .summary-cards section div {
    height: 200px;
    z-index: 1;
  }
}
</style>
