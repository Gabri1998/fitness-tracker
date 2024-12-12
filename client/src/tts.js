export function speakText(
  text,
  options = { rate: 1, pitch: 1, volume: 1, lang: 'en-US' }
) {
  if ('speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    if (voices.length === 0) {
      console.error('No voices available for Text-to-Speech.');
      alert('No voices available for Text-to-Speech.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang;
    utterance.rate = options.rate;
    utterance.pitch = options.pitch;
    utterance.volume = options.volume;

    // Select a voice matching the language
    utterance.voice =
      voices.find((voice) => voice.lang.startsWith(options.lang)) || voices[0];

    synth.cancel(); // Stop any ongoing speech
    synth.speak(utterance);
    console.log(`Speaking: "${text}" with voice: "${utterance.voice.name}"`);
  } else {
    console.error('Text-to-Speech is not supported in this browser.');
    alert('Sorry, your browser does not support Text-to-Speech.');
  }
}
