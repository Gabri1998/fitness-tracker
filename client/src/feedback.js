export function playFeedbackSound(type) {
  // Debugging log
  console.log('Playing feedback sound:', type);

  // Define the paths for different sounds
  const sounds = {
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3'
  };

  // Select the correct sound file
  const audioPath = sounds[type];
  if (!audioPath) {
    console.error(`Invalid sound type: ${type}`);
    return;
  }

  // Play the sound
  const audio = new Audio(audioPath);
  audio.play().catch((err) => console.error('Error playing sound:', err));
}
