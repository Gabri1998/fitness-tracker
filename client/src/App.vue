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
            <b-nav-item-dropdown text="Color Mode" right menu-class="dropdown-menu-custom">
              <b-dropdown-item @click="setColorMode('normal')">
                Normal Mode <span v-if="currentColorMode === 'normal'">✓</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setColorMode('protanopia')">
                Protanopia <span v-if="currentColorMode === 'protanopia'">✓</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setColorMode('deuteranopia')">
                Deuteranopia <span v-if="currentColorMode === 'deuteranopia'">✓</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setColorMode('tritanopia')">
                Tritanopia <span v-if="currentColorMode === 'tritanopia'">✓</span>
              </b-dropdown-item>
              <b-dropdown-item @click="setColorMode('achromatopsia')">
                Achromatopsia <span v-if="currentColorMode === 'achromatopsia'">✓</span>
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <!-- User Authentication Links -->
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/login">{{ $t('login') }}</router-link>
            </b-nav-item>
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/signup">{{ $t('signup') }}</router-link>
            </b-nav-item>

            <!-- Profile Dropdown -->
            <b-nav-item-dropdown v-if="isLoggedIn" :text="$t('profile')" right toggle-class="profile-dropdown-toggle" menu-class="dropdown-menu-custom">
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
import { speakText } from '@/tts';

export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('token') != null,
      isSimpleMode: false,
      currentColorMode: 'normal',
      colorModes: {
        normal: {
          '--primary-color': '#007bff',
          '--secondary-color': '#6c757d',
          '--background-color': '#ffffff',
          '--text-color': '#212529'
        },
        protanopia: {
          '--primary-color': '#ff8c00',
          '--secondary-color': '#006d77',
          '--background-color': '#fff7e6',
          '--text-color': '#1d3557'
        },
        deuteranopia: {
          '--primary-color': '#ffb300',
          '--secondary-color': '#8b4513',
          '--background-color': '#faf3dd',
          '--text-color': '#2e2e2e'
        },
        tritanopia: {
          '--primary-color': '#006d2c',
          '--secondary-color': '#cc8400',
          '--background-color': '#e8f5e9',
          '--text-color': '#0d3b66'
        },
        achromatopsia: {
          '--primary-color': '#666666',
          '--secondary-color': '#999999',
          '--background-color': '#f7f7f7',
          '--text-color': '#000000'
        }
      }
    };
  },
  computed: {
    simpleModeLabel() {
      return this.isSimpleMode ? this.$t('simpleModeDisable') : this.$t('simpleModeEnable');
    },
    languageButtonText() {
      return this.$i18n.locale === 'en' ? this.$t('languageSpanish') : this.$t('languageEnglish');
    },
    getAlternativeLanguage() {
      return this.$i18n.locale === 'en' ? 'es' : 'en';
    }
  },
  methods: {
    setColorMode(mode) {
      if (this.colorModes[mode]) {
        const colors = this.colorModes[mode];
        Object.entries(colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
        this.currentColorMode = mode;
        document.body.className = mode;
        localStorage.setItem('colorMode', mode);
      }
    },
    toggleSimpleMode() {
      this.isSimpleMode = !this.isSimpleMode;
      document.getElementById('app').classList.toggle('simple-mode', this.isSimpleMode);
    },
    speakText(message) {
      speakText(message);
    },
    changeLanguage(lang) {
      this.$i18n.locale = lang;
    },
    logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
    deleteAccount() {
      const token = localStorage.getItem('token');
      Api.delete('/users', { headers: { Authorization: token } })
        .then(() => {
          localStorage.removeItem('token');
          alert('Your account has been deleted.');
          window.location.href = '/signup';
        })
        .catch(() => alert('Account deletion failed.'));
    }
  },
  mounted() {
    const savedMode = localStorage.getItem('colorMode') || 'normal';
    this.setColorMode(savedMode);
  }
};
</script>
<style>
/* General Styling */
body {
  transition: background-color 0.5s ease, color 0.5s ease;
}

/* Background Adjustments for Modes */
body.protanopia {
  background: linear-gradient(to bottom, #f5f5f5, #e6e6e6);
}

body.deuteranopia {
  background: linear-gradient(to right, #fafafa, #f0f0f0);
}

body.tritanopia {
  background: repeating-linear-gradient(45deg, #fdfdfd, #f0f0f0 10px, #e0e0e0 10px, #fdfdfd 20px);
}

body.achromatopsia {
  background: #d9d9d9;
}

/* Navbar Styles */
.b-navbar {
  background-color: var(--primary-color) !important;
}

.b-navbar-nav a {
  color: var(--text-color) !important;
  transition: color 0.3s ease;
}

.b-navbar-nav a:hover {
  color: var(--secondary-color) !important;
}

/* Dropdown Menu */
.dropdown-menu-custom {
  background-color: var(--background-color) !important;
  color: var(--text-color) !important;
  border: 1px solid var(--secondary-color);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dropdown Item */
.dropdown-menu-custom .dropdown-item {
  padding: 10px;
  font-size: 1rem;
  color: var(--text-color) !important; /* Match mode text color */
  background-color: transparent !important; /* Transparent background */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-menu-custom .dropdown-item:hover,
.dropdown-menu-custom .dropdown-item:focus {
  background-color: var(--secondary-color) !important;
  color: var(--background-color) !important;
}

.dropdown-menu-custom .dropdown-item.active {
  background-color: var(--secondary-color) !important;
  color: var(--background-color) !important;
  font-weight: bold;
}

.dropdown-menu-custom .dropdown-item:disabled {
  color: var(--secondary-color) !important;
  background-color: var(--background-color) !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Dropdown Toggle Arrow */
.dropdown-menu-custom .dropdown-toggle::after {
  color: var(--text-color) !important;
  transition: color 0.3s ease;
}

/* Buttons*/
button, .btn {
  background-color: var(--button-bg);
  color: var(--button-text);
  border: 2px solid var(--secondary-color);
  border-radius: 4px;
  padding: 10px 20px;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
}

button:hover, .btn:hover {
  background-color: var(--button-hover-bg);
  color: var(--background-color);
  transform: scale(1.05);
}

button:disabled, .btn:disabled {
  background-color: var(--secondary-color);
  color: var(--text-color);
  opacity: 0.6;
  cursor: not-allowed;
}

/* Special Buttons */
.btn-primary {
  background-color: var(--primary-color);
  color: var(--button-text);
}

.btn-primary:hover {
  background-color: var(--button-hover-bg);
  color: var(--background-color);
}

.btn-danger {
  background-color: var(--secondary-color);
  color: var(--background-color);
}

.btn-danger:hover {
  background-color: #a71d2a;
  color: var(--background-color);
}

/* Form Feedback */
.b-form-invalid-feedback {
  color: var(--invalid-feedback-color);
}

.b-form-valid-feedback {
  color: var(--valid-feedback-color);
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: var(--table-header-bg);
  color: var(--table-header-text);
  padding: 10px;
  text-align: left;
}

td {
  border-bottom: 1px solid var(--secondary-color);
  padding: 10px;
}

tr:hover {
  background-color: var(--secondary-color);
  color: var(--background-color);
}

/* Tooltip */
.tooltip-inner {
  background-color: var(--text-color);
  color: var(--background-color);
}

.tooltip-arrow {
  border-top-color: var(--text-color);
}

/* Modal Content */
.img-preview, .video-preview {
  max-width: 100%;
  height: auto;
}
</style>

