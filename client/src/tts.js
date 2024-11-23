export function speakText(text) {
  console.log('speakText function called with:', text); // Debugging log

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language
    speechSynthesis.speak(utterance);
    console.log('Text is being spoken:', text);
  } else {
    console.error('Text-to-Speech is not supported in this browser.');
    alert('Sorry, your browser does not support Text-to-Speech.');
  }
}
