/**
 * Audio management for the space portfolio
 */

class AudioManager {
  constructor() {
    this.backgroundMusic = document.getElementById('ambient-music');
    this.clickSound = document.getElementById('click-sound');
    this.hoverSound = document.getElementById('hover-sound');
    this.warpSound = document.getElementById('warp-sound');
    
    this.isMuted = false;
    this.isPlaying = false;
    
    // Set volume levels
    this.backgroundMusic.volume = 0.3;
    this.clickSound.volume = 0.2;
    this.hoverSound.volume = 0.1;
    this.warpSound.volume = 0.4;
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  initEventListeners() {
    const musicToggle = document.getElementById('music-toggle');
    const soundOn = musicToggle.querySelector('.sound-on');
    const soundOff = musicToggle.querySelector('.sound-off');
    
    musicToggle.addEventListener('click', () => {
      this.toggleMute();
      
      if (this.isMuted) {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
      } else {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
        
        // If we're unmuting and music wasn't playing, start it
        if (!this.isPlaying) {
          this.playBackgroundMusic();
        }
      }
    });
  }
  
  playBackgroundMusic() {
    if (this.isMuted) return;
    
    // Try to play the music
    const playPromise = this.backgroundMusic.play();
    
    // Handle autoplay policy
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
        })
        .catch(error => {
          console.error('Audio play failed:', error);
          // We'll try again when user interacts with the page
        });
    }
  }
  
  playSound(type) {
    if (this.isMuted) return;
    
    let sound;
    switch (type) {
      case 'click':
        sound = this.clickSound;
        break;
      case 'hover':
        sound = this.hoverSound;
        break;
      case 'warp':
        sound = this.warpSound;
        break;
      default:
        return;
    }
    
    // Reset sound to start
    sound.currentTime = 0;
    
    // Play the sound
    const playPromise = sound.play();
    
    // Handle autoplay policy
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`${type} sound play failed:`, error);
      });
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.backgroundMusic.pause();
      this.isPlaying = false;
    } else {
      this.playBackgroundMusic();
    }
  }
}

// Create a global instance for easy access
let audioManager = new AudioManager();

// Global function to play sounds
function playSound(type) {
  audioManager.playSound(type);
}
