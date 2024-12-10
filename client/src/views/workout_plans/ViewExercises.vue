<template>
  <div>
    <h3>{{ $t('pageTitleExercisesList') }}</h3>
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
      class="btn add-link"
      v-b-tooltip.hover
      title="Add a new exercise"
    >
      Add Exercise
    </router-link>

    <!-- File preview modal -->
    <b-modal v-model="showModal" :title="modalTitle" :size="modalSize" hide-footer>
      <div v-if="previewFileContent">
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
      showModal: false,
      previewFileContent: null,
      previewFileType: '',
      modalSize: 'md',
      modalTitle: 'File Preview'
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
      if (navigator.vibrate) navigator.vibrate(50);
      Api.delete('/exercises')
        .then(() => {
          this.exercises = []
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong, please try again later'
        })
    },
    deleteExercise(exerciseid) {
      if (navigator.vibrate) navigator.vibrate(50);
      Api.delete(`/exercises/${exerciseid}`)
        .then(() => {
          this.getExercises()
        })
        .catch(() => {
          this.errorMessage = 'Sorry something went wrong, please try again later'
        })
    },
    showFilePreview(exercise) {
      if (navigator.vibrate) navigator.vibrate(50);
      this.previewFileContent = exercise.fileContent
      this.previewFileType = exercise.fileType
      this.showModal = true

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
.btn-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1em;
}

.action-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.action-button:hover {
  background-color: var(--secondary-color);
  color: var(--background-color);
}

.add-link {
  display: inline-block;
  margin-top: 1em;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: var(--background-color);
}

.add-link:hover {
  background-color: var(--secondary-color);
}

.img-preview,
.video-preview {
  width: 100%;
  height: auto;
}

.tooltip-inner {
  background-color: var(--text-color);
  color: var(--background-color);
}

.tooltip-arrow {
  border-top-color: var(--text-color);
}
</style>
