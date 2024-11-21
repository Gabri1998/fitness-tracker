<template>
  <div>
    <h3>Exercises</h3>
    <div class="btn-container">
      <b-button
        @click="deleteAllExercise()"
        variant="warning"
        class="action-button"
        v-b-tooltip.hover
        title="Delete all exercises"
      >
        Delete All
      </b-button>
    </div>

    <b-table striped hover :items="exercises" :fields="fields">
      <!-- Display file preview option -->
      <template #cell(file)="data">
        <div v-if="data.item.fileContent">
          <b-button
            @click="showFilePreview(data.item)"
            variant="secondary"
            class="action-button"
            v-b-tooltip.hover
            title="View file"
          >
            View File
          </b-button>
        </div>
        <div v-else>No File</div>
      </template>
      <template #cell(actions)="data">
        <router-link
          :to="`/exercises/${data.item._id}/update`"
          class="btn-link action-link"
          v-b-tooltip.hover
          title="Update exercise"
        >
          Update
        </router-link>
        <b-button
          @click="deleteExercise(data.item._id)"
          variant="danger"
          class="action-button text-white"
          v-b-tooltip.hover
          title="Delete exercise"
        >
          Delete
        </b-button>
      </template>
    </b-table>

    <router-link
      to="/exercises/add"
      class="btn btn-primary add-link"
      v-b-tooltip.hover
      title="Add a new exercise"
    >
      Add Exercise
    </router-link>

    <!-- Modal for file preview with dynamic sizing -->
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
      exercises: [],
      fields: ['name', 'instruction', 'level', 'file', 'actions'],
      errorMessage: '',
      showModal: false, // Modal visibility
      previewFileContent: null, // Content to display in modal
      previewFileType: '', // Type of file for conditional display
      modalSize: 'md', // Default modal size
      modalTitle: 'File Preview' // Title for the modal
    }
  },
  mounted() {
    this.getExercises()
  },
  methods: {
    getExercises() {
      Api.get('/exercises')
        .then((response) => {
          this.exercises = response.data
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong, please try again later'
        })
    },
    deleteAllExercise() {
      Api.delete('/exercises')
        .then(() => {
          this.exercises = []
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong, please try again later'
        })
    },
    deleteExercise(exerciseid) {
      Api.delete(`/exercises/${exerciseid}`)
        .then(() => {
          this.getExercises()
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong, please try again later'
        })
    },
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
/* Enhanced button container styling */
.btn-container {
  display: flex;
  justify-content: end;
  margin-bottom: 1em;
}

/* Action buttons with hover and focus effects */
.action-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.action-button:hover,
.action-button:focus {
  transform: scale(1.05);
  outline: none;
}

/* Add button with consistent styling */
.add-link {
  display: inline-block;
  margin-top: 1em;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0.375rem;
  color: white;
  background-color: #007bff;
}

.add-link:hover,
.add-link:focus {
  background-color: #0056b3;
  transform: scale(1.05);
  text-decoration: none;
  outline: none;
}

/* Styling for modal content */
.img-preview {
  max-width: 100%;
  height: auto;
}

.video-preview {
  width: 100%;
  height: 300px; /* Adjust height as needed for a smaller view */
}

/* Tooltip colors for better visibility */
.tooltip-inner {
  background-color: #333; /* Darker background */
  color: #fff; /* White text for contrast */
}
.tooltip-arrow {
  border-top-color: #333;
}
</style>
