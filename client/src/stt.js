export const stt = {
  recognition: null,
  isListening: false,
  recognizedText: '',

  initRecognition(language = 'en-US') {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser.');
      console.error('Speech Recognition is not supported in this browser.');
      return null;
    }

    // Initialize recognition
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = language;
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    // Event listeners
    this.recognition.onstart = () => {
      console.log('Speech recognition started.');
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.recognizedText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      console.log('Recognized text:', this.recognizedText);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);

      // Specific error handling
      switch (event.error) {
        case 'not-allowed':
          alert('Microphone access denied. Please allow microphone access and try again.');
          break;
        case 'no-speech':
          alert('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          alert('No microphone found. Please check your audio settings.');
          break;
        case 'network':
          alert('Network error. Please check your internet connection.');
          break;
        default:
          alert('Speech recognition error. Please try again.');
      }

      // Stop recognition on error
      this.stopRecognition();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition stopped.');
      this.isListening = false;
    };

    return this.recognition;
  },

  startRecognition() {
    if (!this.recognition) this.initRecognition();
    if (this.recognition) {
      this.recognition.start();
      console.log('Recognition started manually.');
    } else {
      console.error('Speech recognition initialization failed.');
    }
  },

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Recognition stopped manually.');
    } else {
      console.error('Cannot stop recognition as it is not initialized.');
    }
  },

  getRecognizedText() {
    return this.recognizedText;
  },

  isRecognitionActive() {
    return this.isListening;
  },

  processCommand(command) {
    const normalizedCommand = command.toLowerCase();

    // Command handling logic
    if (normalizedCommand.includes('logout')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (normalizedCommand.includes('home')) {
      window.location.href = '/';
    } else if (normalizedCommand.includes('refresh')) {
      window.location.reload();
    } else {
      console.log(`Unknown command: ${command}`);
    }
  }
};
