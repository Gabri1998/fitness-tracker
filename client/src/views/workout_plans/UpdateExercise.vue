<template>
  <div>
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="Name" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Level" label-for="input-2">
        <b-form-input
          id="input-2"
          type="number"
          v-model="form.level"
          placeholder="Enter level"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Instruction" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.instruction"
          placeholder="Enter instruction"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Upload File" label-for="input-4">
        <b-form-file
          id="input-4"
          v-model="form.file"
          accept="image/*,video/*"
          placeholder="Choose a file or drop it here..."
        ></b-form-file>
      </b-form-group>

      <div class="add-button">
        <b-button v-b-tooltip.hover type="submit" variant="primary">Update</b-button>
        <b-button v-b-tooltip.hover type="reset" variant="danger">Reset</b-button>
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
        file: null
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
      event.preventDefault()
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('level', this.form.level)
      formData.append('instruction', this.form.instruction)

      if (this.form.file) {
        formData.append('file', this.form.file) // Only include if selected
      }

      try {
        await Api.patch(`/exercises/${this.$route.params.exerciseid}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.$router.push({ path: '/exercises' })
      } catch (error) {
        this.errorMessage = "Sorry, couldn't update exercise, please try again later."
      }
    },
    onReset(event) {
      event.preventDefault()
      this.form.name = ''
      this.form.level = ''
      this.form.instruction = ''
      this.form.file = null
    },
    getExerciseDetails() {
      Api.get(`/exercises/${this.$route.params.exerciseid}`)
        .then((response) => {
          this.form.name = response.data.name
          this.form.level = response.data.level
          this.form.instruction = response.data.instruction
        })
        .catch(() => {
          this.errorMessage = "Sorry, couldn't retrieve exercise details, please try again later."
        })
    }
  }
}
</script>

<style>
.add-button {
  display: flex;
  gap: 5px;
}
</style>
