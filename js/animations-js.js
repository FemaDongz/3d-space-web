/**
 * Animations for the space portfolio
 */

class AnimationManager {
  constructor() {
    this.isLoaded = false;
    this.initLoadingAnimation();
    this.initLandingPageAnimations();
    this.initGlitchAnimations();
  }
  
  initLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.progress-bar');
    const loadingText = document.querySelector('.loading-text');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Update text
        loadingText.textContent = 'Ready for launch!';
        
        // Complete loading after a short delay
        setTimeout(() => {
          this.completeLoading();
        }, 500);
      }
      
      // Update progress bar
      progressBar.style.width = `${progress}%`;
    }, 200);
  }
  
  completeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const landingPage = document.getElementById('landing-page');
    
    // Fade out loading screen
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        loadingScreen.style.display = 'none';
        this.isLoaded = true;
        
        // Animate the landing page elements
        this.animateLandingElements();
      }
    });
  }
  
  initLandingPageAnimations() {
    // Initially hide the welcome text and enter button
    gsap.set('.welcome-text', { opacity: 0, y: 20 });
    gsap.set('.enter-button', { opacity: 0, y: 20 });
  }
  
  animateLandingElements() {
    // Animate the welcome text
    gsap.to('.welcome-text', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'back.out',
      delay: 0.5
    });
    
    // Animate the enter button
    gsap.to('.enter-button', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'back.out',
      delay: 1
    });
  }
  
  initGlitchAnimations() {
    // Add glitch effect to text elements with glitch-text class
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
      // Store original text for data attribute
      const originalText = text.textContent;
      text.setAttribute('data-text', originalText);
      
      // Create occasional glitch effect
      setInterval(() => {
        // Only glitch sometimes (20% chance)
        if (Math.random() > 0.8) {
          this.glitchText(text, originalText);
        }
      }, 3000);
    });
  }
  
  glitchText(element, originalText) {
    // Create glitched version of text
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?:"{}|';
    let glitchedText = '';
    
    // Choose random positions to glitch
    const positions = new Set();
    const numGlitches = Math.floor(originalText.length * 0.1); // Glitch about 10% of characters
    
    for (let i = 0; i < numGlitches; i++) {
      positions.add(Math.floor(Math.random() * originalText.length));
    }
    
    // Create glitched text
    for (let i = 0; i < originalText.length; i++) {
      if (positions.has(i)) {
        glitchedText += characters.charAt(Math.floor(Math.random() * characters.length));
      } else {
        glitchedText += originalText.charAt(i);
      }
    }
    
    // Apply glitched text
    element.textContent = glitchedText;
    
    // Revert back to original after a short delay
    setTimeout(() => {
      element.textContent = originalText;
    }, 200);
  }
  
  // Method for adding floating animation to elements
  addFloatAnimation(element, options = {}) {
    const defaults = {
      yAmount: 15,
      duration: 3,
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    gsap.to(element, {
      y: config.yAmount,
      duration: config.duration,
      delay: config.delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  // Method for adding pulse glow animation to elements
  addPulseGlowAnimation(element, options = {}) {
    const defaults = {
      shadowColor: 'rgba(5, 217, 232, 0.6)',
      duration: 2,
      delay: 0
    };
    
    const config = { ...defaults, ...options };
    
    gsap.to(element, {
      boxShadow: `0 0 20px ${config.shadowColor}`,
      duration: config.duration,
      delay: config.delay,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}
