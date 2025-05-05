export const stt = {
  recognition: null,
  isListening: false,
  recognitionCooldown: false, // Prevents immediate restart
  onResult: null, // Callback function for recognition results

  initRecognition(language = 'en-US') {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition is not supported in this browser.');
      return null;
    }

    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = language;
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    this.recognition.onstart = () => {
      console.log('[STT] Speech recognition started.');
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      console.log(`[STT] Recognized text: ${transcript}`);
      if (this.onResult) {
        this.onResult(transcript); // Invoke the provided callback
      } else {
        console.warn('[STT] No callback provided to handle recognition results.');
      }
    };

    this.recognition.onerror = (event) => {
      console.error('[STT] Speech recognition error:', event.error);
      this.stopRecognition();
    };

    this.recognition.onend = () => {
      console.log('[STT] Speech recognition stopped.');
      this.isListening = false;

      // Start cooldown after stopping
      this.recognitionCooldown = true;
      setTimeout(() => {
        this.recognitionCooldown = false;
        console.log('[STT] Cooldown ended. Recognition can restart.');
      }, 300); // Cooldown duration
    };

    return this.recognition;
  },

  async startRecognition({ onResult }) {
    if (!this.recognition) this.initRecognition();

    if (this.recognitionCooldown) {
      console.log('[STT] Recognition cooldown active. Please wait...');
      return;
    }

    if (this.isListening) {
      console.log('[STT] Recognition is already active. Stopping first...');
      this.stopRecognition();
      await this.delay(300); // Add a delay before restarting
    }

    this.onResult = onResult; // Assign the callback
    this.recognition.start();
    console.log('[STT] Starting recognition.');
  },

  stopRecognition() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onResult = null; // Clear the callback
      console.log('[STT] Recognition stopped manually.');
    }
  },

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
