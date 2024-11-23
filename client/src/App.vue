<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <!-- Navbar Brand -->
        <b-navbar-brand href="/">Fitness Tracker</b-navbar-brand>

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
              <router-link to="/">Home</router-link>
            </b-nav-item>
            <b-nav-item v-if="isLoggedIn">
              <router-link to="/workout-plans">Workout Plans</router-link>
            </b-nav-item>
            <b-nav-item v-if="isLoggedIn">
              <router-link to="/exercises">Exercises-list</router-link>
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
              <b-icon icon="volume-up"></b-icon> Read Welcome
            </b-nav-item>

            <!-- User Authentication Links -->
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/login">Log in</router-link>
            </b-nav-item>
            <b-nav-item v-if="!isLoggedIn">
              <router-link to="/signup">Sign up</router-link>
            </b-nav-item>
            <b-nav-item-dropdown
              v-if="isLoggedIn"
              text="Profile"
              right
              toggle-class="profile-dropdown-toggle"
              menu-class="dropdown-menu-custom"
            >
              <b-dropdown-item @click="deleteAccount" class="dropdown-item-delete">
                ❌ Delete Account
              </b-dropdown-item>
              <b-dropdown-item @click="logout" class="dropdown-item-logout">
                🚪 Logout
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
import { speakText } from '@/tts'; // Import Text-to-Speech utility

export default {
  data() {
    return {
      isLoggedIn: localStorage.getItem('token') != null,
      isSimpleMode: false // State for Simple Mode
    };
  },
  computed: {
    // Dynamically update the label for Simple Mode toggle
    simpleModeLabel() {
      return this.isSimpleMode ? 'Disable Simple Mode' : 'Enable Simple Mode';
    }
  },
  methods: {
    toggleSimpleMode() {
      this.isSimpleMode = !this.isSimpleMode;
      document.body.classList.toggle('simple-mode', this.isSimpleMode);
    },
    speakText(message) {
      console.log('Vue speakText method called with:', message); // Debugging log
      try {
        speakText(message);
      } catch (error) {
        console.error('Error in Text-to-Speech:', error);
        alert('An error occurred while trying to read the text.');
      }
    },
    handleSuccess() {
      playFeedbackSound('success'); // Play success sound
      console.log('Success action triggered!');
    },
    handleError() {
      playFeedbackSound('error'); // Play error sound
      console.error('Error action triggered!');
    },
    deleteAccount() {
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
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
};
</script>

<style scoped>
/* Navbar Background and Text */
.b-navbar {
  background-color: #002752; /* Deep navy blue for high contrast */
  border-bottom: 3px solid #004085; /* Slightly lighter for distinction */
  display: flex;
  justify-content: space-between; /* Ensures left, center, and right sections are spaced out */
  align-items: center;
}

/* Navbar Brand */
.b-navbar-brand {
  color: #ffffff !important; /* Pure white for maximum visibility */
  font-weight: bold;
}

.b-navbar-brand:hover {
  color: #ffc107 !important; /* Gold hover effect for brand */
}

/* Centered Navbar Links */
.navbar-collapse-custom {
  width: 100%; /* Ensures full width for proper alignment */
  display: flex;
  justify-content: space-between; /* Separate left, center, and right areas */
  align-items: center;
}

.nav-center {
  display: flex;
  justify-content: center; /* Ensures links are centered horizontally */
  flex: 1; /* Takes up all available space */
  text-align: center;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
}

/* Navbar Links */
.b-navbar-nav a {
  color: #ffffff !important; /* Brighter white for high contrast */
  font-weight: bold; /* Emphasize text for visibility */
  text-transform: uppercase; /* Uppercase for better readability */
  letter-spacing: 0.5px; /* Slightly spaced for clarity */
  font-size: 1.1rem; /* Slightly larger font for readability */
  margin: 0 10px; /* Adds spacing between items */
}

.simple-mode h1,
.simple-mode p {
  font-size: 1.5rem;
}

.simple-mode button {
  font-size: 1.2rem;
  padding: 0.8rem 1.5rem;
}

.b-navbar-nav a:hover {
  color: #ffc107 !important; /* Gold color for strong hover contrast */
  text-decoration: underline; /* Non-color indicator for hover */
  background-color: rgba(255, 193, 7, 0.1); /* Light gold background hover effect */
}

.b-navbar-nav a:focus {
  color: #ffffff !important; /* Maintain white text on focus */
  background-color: #004085; /* Slightly lighter blue for focus background */
  outline: 2px solid #ffc107; /* Gold focus ring for accessibility */
  outline-offset: 2px;
}

/* Profile Dropdown Toggle */
.profile-dropdown-toggle {
  font-weight: bold;
  color: #ffffff !important; /* Brighter white for dropdown toggle */
}

.profile-dropdown-toggle:hover {
  text-decoration: underline;
  color: #ffc107 !important; /* Matches hover state with links */
}

.dropdown-menu-custom {
  background-color: #1a1a1a; /* Dark background for contrast */
  border: 1px solid #444; /* Distinct border for definition */
  color: #ffffff !important; /* Ensure dropdown content is white */
  padding: 10px;
  border-radius: 5px;
}

/* Dropdown Items */
.dropdown-item-delete,
.dropdown-item-logout {
  font-weight: bold;
  color: #ffffff !important; /* White text for dropdown items */
}

.dropdown-item-delete:hover {
  background-color: #ffe5e5; /* Light red hover effect */
  color: #cc0000 !important; /* Dark red for hover state */
}

.dropdown-item-logout:hover {
  background-color: #d4f1f9; /* Light teal for hover */
  color: #0d6efd !important; /* Blue for hover state */
}

/* Fix for disappearing text on hover (specific to buttons) */
button:hover,
button:focus {
  color: #ffffff !important; /* Ensure text stays visible */
}

/* Mobile and Small Screens Adjustments */
@media (max-width: 768px) {
  .b-navbar {
    background-color: #003366; /* Slightly brighter navy for smaller screens */
  }
  .b-navbar-nav a {
    font-size: 1.2rem; /* Slightly larger font for better readability */
  }

  .dropdown-menu-custom {
    max-width: 200px; /* Adjust width for smaller screens */
    padding: 5px;
  }
}
</style>
