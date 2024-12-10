<template>
  <div>
    <!-- Session Name -->
    <h3>{{ $t('session') }} : {{ form.name }}</h3>
    <hr />

    <!-- Exercises Table -->
    <b-table
      striped
      hover
      :items="exercises"
      :fields="['name', 'instruction', 'level', 'file']"
      class="exercises-table"
    >
      <!-- Name -->
      <template #cell(name)="data">
        {{ data.item.name }}
      </template>

      <!-- Instruction -->
      <template #cell(instruction)="data">
        {{ data.item.instruction }}
      </template>

      <!-- Level -->
      <template #cell(level)="data">
        {{ data.item.level }}
      </template>

      <!-- File Preview -->
      <template #cell(file)="data">
        <div v-if="data.item.fileContent">
          <b-button
            @click="showFilePreview(data.item)"
            variant="link"
            class="file-preview-btn"
          >
            View File
          </b-button>
        </div>
        <div v-else>No File</div>
      </template>
    </b-table>

    <!-- File Modal -->
    <b-modal v-model="showModal" :title="modalTitle" :size="modalSize" hide-footer>
      <div v-if="previewFileContent">
        <!-- Conditional rendering based on file type -->
        <img
          v-if="previewFileType.startsWith('image')"
          :src="previewFileContent"
          alt="File Preview"
          class="img-preview"
        />
        <video
          v-else-if="previewFileType.startsWith('video')"
          :src="previewFileContent"
          controls
          class="video-preview"
        ></video>
        <iframe
          v-else
          :src="previewFileContent"
          style="width: 100%; height: 300px;"
          frameborder="0"
        ></iframe>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { Api } from '@/Api'

export default {
  data() {
    return {
      form: {
        name: '',
        duration: '',
        date: '',
        selectedExercises: [] // Exercise IDs linked to the session
      },
      exercises: [], // Detailed exercise data for the session
      errorMessage: '',
      // Modal for file preview
      showModal: false,
      previewFileContent: null,
      previewFileType: '',
      modalTitle: '',
      modalSize: 'md'
    }
  },
  mounted() {
    const notLoggedIn = localStorage.getItem('token') == null
    if (notLoggedIn) {
      this.$router.push('/login')
    } else {
      this.getSessionDetails()
    }
  },
  methods: {
    formatDate(date) {
      date = new Date(date)
      const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`
      const month = `${date.getMonth() + 1 < 10 ? '0' : ''}${
        date.getMonth() + 1
      }`
      const year = date.getFullYear()
      return `${year}-${month}-${day}`
    },

    // Fetch session details and its associated exercises
    async getSessionDetails() {
      try {
        const response = await Api.get(`/sessions/${this.$route.params.sessionid}`)
        this.form.name = response.data.name
        this.form.duration = response.data.duration
        this.form.date = this.formatDate(response.data.date)
        this.form.selectedExercises = response.data.exercises

        // Fetch full exercise details for the session
        this.getExercisesForSession(this.form.selectedExercises)
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong, please try again later'
      }
    },

    // Fetch detailed exercise data for the session
    async getExercisesForSession(exerciseIds) {
      try {
        const response = await Api.get('/exercises')
        // Filter exercises to include only the ones in `selectedExercises`
        this.exercises = response.data.filter((ex) =>
          exerciseIds.includes(ex._id)
        )
      } catch (error) {
        this.errorMessage = 'Sorry something went wrong, please try again later'
      }
    },

    // Show file in a modal
    showFilePreview(exercise) {
      this.previewFileContent = exercise.fileContent
      this.previewFileType = exercise.fileType
      this.showModal = true

      // Set modal size and title based on file type
      if (exercise.fileType.startsWith('image')) {
        this.modalSize = 'sm'
        this.modalTitle = 'Image Preview'
      } else if (exercise.fileType.startsWith('video')) {
        this.modalSize = 'lg'
        this.modalTitle = 'Video Preview'
      } else {
        this.modalSize = 'md'
        this.modalTitle = 'File Preview'
      }
    }
  }
}
</script>

<style>
/* Header Styling */
h3 {
  text-align: center;
  margin-bottom: 1em;
  color: var(--text-color); /* Use global text color */
  font-weight: bold;
}

/* Table Styling */
.exercises-table {
  margin-top: 1em;
}

/* File Preview Button */
.file-preview-btn {
  color: var(--primary-color); /* Use global variable for color */
  text-decoration: none;
}

.file-preview-btn:hover {
  text-decoration: underline;
}

/* Modal Styling */
.img-preview {
  max-width: 100%;
  height: auto;
}

.video-preview {
  width: 100%;
  height: 300px;
}

/* Error Message */
.b-alert {
  text-align: center;
  margin-bottom: 1em;
}
</style>
