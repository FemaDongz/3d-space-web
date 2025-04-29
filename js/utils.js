/**
 * Utility functions for the space portfolio
 */

// Generate a random number between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Convert degrees to radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Clamp value between min and max
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Linear interpolation
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

// Distance between two 3D points
function distance3D(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) + 
    Math.pow(y2 - y1, 2) + 
    Math.pow(z2 - z1, 2)
  );
}

// Get a point on a sphere
function getPointOnSphere(radius, lat, long) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return {x, y, z};
}

// Ease in-out function
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Check if device is mobile
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

// Create texture loader with loading manager
function createTextureLoader(loadingManager) {
  return new THREE.TextureLoader(loadingManager);
}

// Preload all textures
function preloadTextures(textureLoader, textureURLs) {
  const textures = {};
  textureURLs.forEach(item => {
    textures[item.name] = textureLoader.load(item.url);
  });
  return textures;
}

// Convert hex color to THREE.Color
function hexToThreeColor(hex) {
  return new THREE.Color(hex);
}

// Generate random star field positions
function generateStarPositions(count, radius) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Use spherical distribution for more natural look
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random()); // Cube root for better distribution
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    positions.push(x, y, z);
  }
  return positions;
}

// Generate random star sizes (for point stars)
function generateStarSizes(count, minSize, maxSize) {
  const sizes = [];
  for (let i = 0; i < count; i++) {
    sizes.push(random(minSize, maxSize));
  }
  return sizes;
}

// Debounce function for event handlers
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if WebGL is supported
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

// Get normalized device coordinates from mouse/touch position
function getNormalizedDeviceCoordinates(event, element) {
  const rect = element.getBoundingClientRect();
  let clientX, clientY;
  
  // Handle both mouse and touch events
  if (event.type.includes('touch')) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  
  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: -((clientY - rect.top) / rect.height) * 2 + 1
  };
}

// Add event listener with automatic cleanup
function addEventListenerWithCleanup(element, event, handler, options) {
  element.addEventListener(event, handler, options);
  return () => {
    element.removeEventListener(event, handler, options);
  };
}
