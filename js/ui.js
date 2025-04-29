/**
 * UI management for the space portfolio
 */

class UIManager {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.currentSection = 'home';
    this.sections = ['home', 'about', 'projects', 'contact'];
    this.navLinks = document.querySelectorAll('.nav-link');
    this.projectDetails = document.getElementById('project-details');
    this.enterButton = document.querySelector('.enter-button');
    this.landingPage = document.getElementById('landing-page');
    this.universeContainer = document.getElementById('universe-container');
    this.contactForm = document.getElementById('contact-form');
    this.lastHoveredPlanet = null;
    
    // Initialize event listeners
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        this.showSection(section);
        playSound('click');
      });
      
      // Add hover sound effect
      link.addEventListener('mouseenter', () => {
        playSound('hover');
      });
    });
    
    // Enter button
    this.enterButton.addEventListener('click', () => {
      this.enterUniverse();
      playSound('warp');
    });
    
    // Handle mouse move for planet hover
    this.sceneManager.canvas.addEventListener('mousemove', (e) => {
      this.handleMouseMove(e);
    });
    
    // Handle clicks on planets
    this.sceneManager.canvas.addEventListener('click', (e) => {
      this.handleClick(e);
    });
    
    // Close project details button
    document.querySelector('.close-project').addEventListener('click', () => {
      this.hideProjectDetails();
      playSound('click');
    });
    
    // Submit contact form
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }
  
  enterUniverse() {
    // Hide landing page
    gsap.to(this.landingPage, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        this.landingPage.classList.remove('active');
        this.landingPage.classList.add('hidden');
        
        // Show universe container
        this.universeContainer.classList.remove('hidden');
        
        // Start background music
        if (audioManager) {
          audioManager.playBackgroundMusic();
        }
        
        // Add subtle zoom effect to camera
        gsap.fromTo(
          this.sceneManager.camera.position,
          { z: 50 },
          { z: 25, duration: 2, ease: 'power2.out' }
        );
      }
    });
  }
  
  showSection(section) {
    // Don't do anything if already on this section
    if (this.currentSection === section) return;
    
    // Update current section
    this.currentSection = section;
    
    // Update active nav link
    this.navLinks.forEach(link => {
      if (link.getAttribute('data-section') === section) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => {
      el.classList.remove('active');
    });
    
    // Show current section
    document.getElementById(section).classList.add('active');
    
    // Hide project details if open
    if (this.projectDetails && !this.projectDetails.classList.contains('hidden')) {
      this.hideProjectDetails();
    }
    
    // Update camera position in scene
    this.sceneManager.setCurrentSection(section);
  }
  
  showProjectDetails(projectId) {
    // Find project data
    const project = PROJECTS.find(p => p.id === projectId);
    
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }
    
    // Update project details
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-image').style.backgroundImage = `url('${project.image}')`;
    document.getElementById('project-description').textContent = project.description;
    document.getElementById('project-link').href = project.link;
    document.getElementById('project-github').href = project.github;
    
    // Show project details with animation
    this.projectDetails.classList.remove('hidden');
    gsap.fromTo(
      this.projectDetails,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }
  
  hideProjectDetails() {
    // Hide project details with animation
    gsap.to(this.projectDetails, {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        this.projectDetails.classList.add('hidden');
      }
    });
  }
  
  handleMouseMove(event) {
    if (this.currentSection !== 'projects') return;
    
    // Get normalized device coordinates
    const coords = getNormalizedDeviceCoordinates(event, this.sceneManager.canvas);
    
    // Check for planet intersections
    const planetId = this.sceneManager.checkPlanetIntersection(coords.x, coords.y);
    
    // Update cursor style
    if (planetId) {
      this.sceneManager.canvas.style.cursor = 'pointer';
    } else {
      this.sceneManager.canvas.style.cursor = 'default';
    }
    
    // Handle planet hover states
    if (planetId !== this.lastHoveredPlanet) {
      // Unhover previous planet if exists
      if (this.lastHoveredPlanet) {
        const lastPlanet = this.sceneManager.planets.find(p => p.id === this.lastHoveredPlanet);
        if (lastPlanet) {
          lastPlanet.setHovered(false);
        }
      }
      
      // Hover new planet if exists
      if (planetId) {
        const planet = this.sceneManager.planets.find(p => p.id === planetId);
        if (planet) {
          planet.setHovered(true);
          playSound('hover');
        }
      }
      
      //
