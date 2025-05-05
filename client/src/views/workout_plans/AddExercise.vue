<template>
  <div>
    <!-- Display error message for submission errors -->
    <b-alert variant="danger" :show="!!errorMessage">{{ errorMessage }}</b-alert>

    <!-- Form -->
    <b-form @submit="onSubmit" @reset="onReset" novalidate>
      <!-- Name Field -->
      <b-form-group id="input-group-1" label="Name" label-for="input-1">
        <div class="input-with-microphone">
          <div class="lamp" :class="{ active: activeField === 'name' && isListening }"></div>
          <b-form-input
            ref="name"
            id="input-1"
            v-model="form.name"
            placeholder="Enter Name"
            :state="validateField('name')"
            required
            class="form-input"
          ></b-form-input>
          <b-icon
            icon="mic-fill"
            class="microphone-icon"
            @click="toggleRecognition('name')"
            :class="{ active: activeField === 'name' && isListening }"
          />
        </div>
        <b-form-invalid-feedback v-if="!validateField('name')">
          <span class="error-icon">⚠</span> Name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Level Field -->
      <b-form-group id="input-group-2" label="Difficulty Level" label-for="input-2">
        <div class="input-with-microphone">
          <div class="lamp" :class="{ active: activeField === 'level' && isListening }"></div>
          <b-form-input
            ref="level"
            id="input-2"
            type="number"
            :value="form.level"
            @input="handleLevelInput"
            placeholder="Enter Difficulty Level"
            :state="validateField('level')"
            required
            class="form-input"
          ></b-form-input>
          <b-icon
            icon="mic-fill"
            class="microphone-icon"
            @click="toggleRecognition('level')"
            :class="{ active: activeField === 'level' && isListening }"
          />
        </div>
        <b-form-invalid-feedback v-if="!validateField('level')">
          <span class="error-icon">⚠</span> Difficulty Level must be a number greater than 0.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Instruction Field -->
      <b-form-group id="input-group-3" label="Instruction" label-for="input-3">
        <div class="input-with-microphone">
          <div class="lamp" :class="{ active: activeField === 'instruction' && isListening }"></div>
          <b-form-input
            ref="instruction"
            id="input-3"
            v-model="form.instruction"
            placeholder="Enter Instructions"
            :state="validateField('instruction')"
            required
            class="form-input"
          ></b-form-input>
          <b-icon
            icon="mic-fill"
            class="microphone-icon"
            @click="toggleRecognition('instruction')"
            :class="{ active: activeField === 'instruction' && isListening }"
          />
        </div>
        <b-form-invalid-feedback v-if="!validateField('instruction')">
          <span class="error-icon">⚠</span> Instructions are required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- File Upload Field -->
      <b-form-group id="input-group-4" label="Upload Media" label-for="input-4">
        <input
          id="input-4"
          type="file"
          accept="image/*,video/*"
          class="file-upload"
          @change="handleFileUpload"
        />
      </b-form-group>

      <!-- Media Capture Section -->
      <b-form-group id="input-group-5" label="Capture Media">
        <div class="capture-buttons">
          <b-button
            variant="primary"
            class="btn-capture"
            v-b-tooltip.hover
            title="Open Camera to Capture Media"
            @click="startCamera"
          >
            🎥 Open Camera
          </b-button>
          <b-button
            variant="danger"
            class="btn-capture"
            v-b-tooltip.hover
            title="Stop Camera"
            @click="stopCamera"
            v-if="isCameraActive"
          >
            🛑 Stop Camera
          </b-button>
        </div>
        <video ref="camera" autoplay muted class="camera-view" v-if="isCameraActive"></video>
        <div class="record-buttons" v-if="isCameraActive">
          <b-button
            variant="success"
            class="btn-capture"
            v-b-tooltip.hover
            title="Capture Image"
            @click="captureImage"
          >
            📸 Capture Image
          </b-button>
          <b-button
            variant="info"
            class="btn-capture"
            v-b-tooltip.hover
            title="Start Recording Video"
            @click="startRecording"
            v-if="!isRecording"
          >
            🎬 Start Recording
          </b-button>
          <b-button
            variant="warning"
            class="btn-capture"
            v-b-tooltip.hover
            title="Stop Recording Video"
            @click="stopRecording"
            v-if="isRecording"
          >
            🛑 Stop Recording
          </b-button>
        </div>
      </b-form-group>

      <!-- Media Preview Section -->
      <b-form-group id="input-group-6" label="Media Preview">
        <div class="media-preview-container">
          <div v-if="form.capturedImageUrl" class="media-box">
            <img
              :src="form.capturedImageUrl"
              alt="Captured Image"
              class="media-thumbnail"
              @click="viewMedia(form.capturedImageUrl, 'image')"
            />
          </div>
          <div v-if="form.capturedVideoUrl" class="media-box">
            <video
              :src="form.capturedVideoUrl"
              controls
              class="media-thumbnail"
              @click="viewMedia(form.capturedVideoUrl, 'video')"
            ></video>
          </div>
        </div>
        <b-modal v-model="isMediaModalVisible" title="Captured Media">
          <img v-if="modalMediaType === 'image'" :src="modalMediaUrl" alt="Enlarged Image" class="enlarged-media" />
          <video v-if="modalMediaType === 'video'" :src="modalMediaUrl" controls class="enlarged-media"></video>
        </b-modal>
      </b-form-group>

      <!-- Buttons -->
      <div class="add-button">
        <b-button type="submit" variant="primary" class="btn-primary" v-b-tooltip.hover title="Submit the exercise">
          Add
        </b-button>
        <b-button type="reset" variant="danger" class="btn-danger" v-b-tooltip.hover title="Clear the form fields">
          Reset
        </b-button>
      </div>
    </b-form>
  </div>
</template>


<script>
import { Api } from '@/Api';
import { stt } from '@/stt';

export default {
  data() {
    return {
      form: {
        name: '',
        level: '',
        instruction: '',
        file: null,
        capturedImage: null,
        capturedVideo: null,
        capturedImageUrl: null,
        capturedVideoUrl: null
      },
      isCameraActive: false,
      cameraStream: null,
      recorder: null,
      recordedChunks: [],
      activeField: null,
      isListening: false,
      recognitionTimer: null,
      maxRecognitionTime: 8000,
      errorMessage: '',
      isRecording: false,
      modalMediaUrl: null,
      modalMediaType: null,
      isMediaModalVisible: false
    };
  },
  methods: {
    // Speech-to-Text Toggle
    async toggleRecognition(field) {
      try {
        if (this.activeField === field && this.isListening) {
          await this.stopRecognition();
        } else {
          if (this.isListening) {
            await this.stopRecognition();
          }

          this.activeField = field;
          this.isListening = true;
          console.log(`[STT] Starting recognition for field: ${field}`);

          await stt.startRecognition({
            onResult: (text) => {
              this.form[field] = text.trim();
              console.log(`[STT] Updated field "${field}" with text: "${text}"`);
            }
          });

          this.clearTimer();
          this.recognitionTimer = setTimeout(async () => {
            console.log(`[STT] Auto-stopping recognition for field: ${field}`);
            await this.stopRecognition();
          }, this.maxRecognitionTime);
        }
      } catch (error) {
        console.error('[STT] Error toggling recognition:', error);
        this.errorMessage = 'Speech recognition error. Please try again.';
      }
    },
    async stopRecognition() {
      try {
        await stt.stopRecognition();
        this.isListening = false;
        this.activeField = null;
        this.clearTimer();
        console.log('[STT] Recognition stopped.');
      } catch (error) {
        console.error('[STT] Error stopping recognition:', error);
      }
    },
    clearTimer() {
      if (this.recognitionTimer) {
        clearTimeout(this.recognitionTimer);
        this.recognitionTimer = null;
      }
    },

    // Camera Functions
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        this.cameraStream = stream;
        this.isCameraActive = true;
        this.$nextTick(() => {
          if (this.$refs.camera) {
            this.$refs.camera.srcObject = stream;
          } else {
            console.error('Camera reference not found');
          }
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
        this.errorMessage = 'Unable to access the camera. Please check your permissions.';
      }
    },
    stopCamera() {
      if (this.cameraStream) {
        const tracks = this.cameraStream.getTracks();
        tracks.forEach((track) => track.stop());
        this.cameraStream = null;
      }
      this.isCameraActive = false;
    },
    captureImage() {
      const video = this.$refs.camera;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        this.form.capturedImage = blob;
        this.form.capturedImageUrl = URL.createObjectURL(blob);
        console.log('Captured image as Blob:', blob);
      });
    },
    startRecording() {
      if (!this.cameraStream) {
        console.error('Camera is not active.');
        return;
      }
      this.recorder = new MediaRecorder(this.cameraStream, { mimeType: 'video/webm' });
      this.recordedChunks = [];
      this.isRecording = true;
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      this.recorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.form.capturedVideo = blob;
        this.form.capturedVideoUrl = URL.createObjectURL(blob);
        this.isRecording = false;
        console.log('Captured video as Blob:', blob);
      };
      this.recorder.start();
    },
    stopRecording() {
      if (this.recorder && this.recorder.state === 'recording') {
        this.recorder.stop();
      }
    },

    // File Upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.file = file;
        console.log('File selected:', file.name);
      }
    },

    // Input Validation for Level Field
    handleLevelInput(event) {
      const value = event.target.value;
      const numberValue = parseFloat(value);
      this.form.level = !isNaN(numberValue) && numberValue > 0 ? numberValue : '';
    },

    // Media Preview
    viewMedia(url, type) {
      this.modalMediaUrl = url;
      this.modalMediaType = type;
      this.isMediaModalVisible = true;
    },

    // Form Validation
    validateField(field) {
      if (field === 'name') return this.form.name.trim().length > 0;
      if (field === 'level') return this.form.level > 0;
      if (field === 'instruction') return this.form.instruction.trim().length > 0;
      if (field === 'file') return !!this.form.file || !!this.form.capturedImage || !!this.form.capturedVideo;
      return true;
    },

    // Form Submission
    async onSubmit(event) {
      event.preventDefault();
      if (!this.validateField('name') || !this.validateField('level') || !this.validateField('instruction')) {
        this.errorMessage = 'Please fill out all required fields correctly.';
        return;
      }
      const formData = new FormData();
      formData.append('name', this.form.name);
      formData.append('level', this.form.level);
      formData.append('instruction', this.form.instruction);
      if (this.form.file) formData.append('file', this.form.file);
      if (this.form.capturedImage) formData.append('file', this.form.capturedImage, 'captured_image.png');
      if (this.form.capturedVideo) formData.append('file', this.form.capturedVideo, 'captured_video.webm');
      try {
        await Api.post('/exercises', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.$router.push({ path: '/exercises' });
      } catch (error) {
        this.errorMessage = 'Sorry, could not create exercise. Please try again later.';
      }
    },

    // Reset Form
    onReset(event) {
      event.preventDefault();
      this.form.name = '';
      this.form.level = '';
      this.form.instruction = '';
      this.form.file = null;
      this.form.capturedImage = null;
      this.form.capturedVideo = null;
      this.form.capturedImageUrl = null;
      this.form.capturedVideoUrl = null;
      this.stopCamera();
    }
  }
};
</script>





<style>
.media-preview-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.media-box {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 2px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.media-box:hover {
  transform: scale(1.05);
  border-color: #007bff;
}

.media-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.enlarged-media {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}
.camera-view {
  width: 100%;
  height: auto;
  margin-top: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
}

.capture-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-capture {
  font-size: 1rem;
  padding: 5px 10px;
}
/* Lamp Indicator Styles */
.lamp {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: red;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}
.lamp.active {
  background-color: blue;
}

/* Add styles for microphone icons and active states */
.input-with-microphone {
  display: flex;
  align-items: center;
  gap: 8px;
}

.microphone-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: #6c757d;
  transition: color 0.3s ease;
}

.microphone-icon.active {
  color: #007bff;
}

.microphone-icon:hover {
  color: #0056b3;
}

/* Existing styles */
.form-input {
  border: 2px solid var(--secondary-color);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* File Upload Field Styles */
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

/* Error Icon Styles */
.error-icon {
  color: var(--primary-color);
  margin-right: 5px;
}

/* Button Styles */
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

.add-button {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>
