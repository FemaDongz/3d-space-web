/**
 * Main application file for the space portfolio
 * This file initializes all components and manages the application lifecycle
 */

// Global variables
let sceneManager;
let uiManager;
let animationManager;

// Constants for the application
const APP_CONFIG = {
  cameraStartPosition: { x: 0, y: 0, z: 25 },
  cameraHomePosition: { x: 0, y: 0, z: 25 },
  cameraAboutPosition: { x: -15, y: 5, z: 20 },
  cameraProjectsPosition: { x: 15, y: -5, z: 20 },
  cameraContactPosition: { x: 0, y: -10, z: 20 },
  starfieldCount: 1500,
  planetRotationSpeed: 0.001,
  loadingDuration: 3000 // ms
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
});

/**
 * Initialize the application
 */
function init() {
  // Create animation manager first for loading animations
  animationManager = new AnimationManager();
  
  // Initialize scene after a small delay to allow loading screen to display
  setTimeout(() => {
    initializeScene();
    initializeUI();
    
    // Start the animation loop
    animate();
    
    // Add resize event listener
    window.addEventListener('resize', onWindowResize);
    
    // Debug log
    console.log('Space portfolio initialized');
  }, 500);
}

/**
 * Initialize the Three.js scene
 */
function initializeScene() {
  // Get the canvas element
  const canvas = document.getElementById('universe-canvas');
  
  // Create scene manager
  sceneManager = new SceneManager(canvas, APP_CONFIG);
  
  // Setup camera
  sceneManager.setupCamera(
    APP_CONFIG.cameraStartPosition.x,
    APP_CONFIG.cameraStartPosition.y,
    APP_CONFIG.cameraStartPosition.z
  );
  
  // Create starfield
  sceneManager.createStarfield(APP_CONFIG.starfieldCount);
  
  // Create planets from data
  sceneManager.createPlanets(PROJECTS);
}

/**
 * Initialize UI elements and event handlers
 */
function initializeUI() {
  // Create UI manager
  uiManager = new UIManager(sceneManager);
  
  // Set up section camera positions
  sceneManager.setSectionCameraPositions({
    home: APP_CONFIG.cameraHomePosition,
    about: APP_CONFIG.cameraAboutPosition,
    projects: APP_CONFIG.cameraProjectsPosition,
    contact: APP_CONFIG.cameraContactPosition
  });
}

/**
 * Animation loop
 */
function animate() {
  requestAnimationFrame(animate);
  
  // Update scene
  if (sceneManager) {
    sceneManager.update();
  }
  
  // Render scene
  if (sceneManager && sceneManager.renderer) {
    sceneManager.render();
  }
}

/**
 * Handle window resize
 */
function onWindowResize() {
  if (sceneManager) {
    sceneManager.onWindowResize();
  }
}

/**
 * Utility function to get normalized device coordinates
 * @param {MouseEvent} event - Mouse event
 * @param {HTMLElement} element - Element to use for coordinate calculation
 * @returns {Object} - Normalized coordinates between -1 and 1
 */
function getNormalizedDeviceCoordinates(event, element) {
  const rect = element.getBoundingClientRect();
  
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  return { x, y };
}

/**
 * Create a dummy data file if data.js is missing
 * In a real application, this would be a separate file
 */
if (typeof PROJECTS === 'undefined') {
  console.warn('Project data not found, using placeholder data');
  
  const PROJECTS = [
    {
      id: 'planet1',
      title: 'Cosmic Voyager',
      description: 'An interactive WebGL space exploration game that allows users to discover procedurally generated galaxies and planetary systems.',
      image: 'images/projects/project1.jpg',
      link: 'https://example.com/cosmic-voyager',
      github: 'https://github.com/username/cosmic-voyager',
      position: { x: 8, y: 3, z: -5 },
      size: 2,
      color: 0x05d9e8,
      orbitSpeed: 0.02
    },
    {
      id: 'planet2',
      title: 'Neural Nexus',
      description: 'An AI-powered platform that uses machine learning to generate unique artwork based on text prompts and user preferences.',
      image: 'images/projects/project2.jpg',
      link: 'https://example.com/neural-nexus',
      github: 'https://github.com/username/neural-nexus',
      position: { x: -10, y: -2, z: -8 },
      size: 1.5,
      color: 0xff2a6d,
      orbitSpeed: 0.015
    },
    {
      id: 'planet3',
      title: 'Quantum Dashboard',
      description: 'A real-time data visualization dashboard for monitoring system metrics with advanced filtering and alert capabilities.',
      image: 'images/projects/project3.jpg',
      link: 'https://example.com/quantum-dashboard',
      github: 'https://github.com/username/quantum-dashboard',
      position: { x: 5, y: -5, z: -2 },
      size: 1.8,
      color: 0x41ead4,
      orbitSpeed: 0.01
    }
  ];
  
  window.PROJECTS = PROJECTS;
}
