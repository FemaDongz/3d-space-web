/**
 * Scene setup and management for the space portfolio
 */

class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = null;
    this.starField = null;
    this.planets = [];
    this.planetObjects = [];
    this.currentSection = 'home';
    this.orbitCenter = new THREE.Vector3(0, 0, 0);
    this.animate = this.animate.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    
    // Initialize everything
    this.init();
  }
  
  init() {
    // Setup loading manager
    this.setupLoadingManager();
    
    // Create texture loader
    this.textureLoader = createTextureLoader(this.loadingManager);
    
    // Setup renderer
    this.setupRenderer();
    
    // Setup scene
    this.setupScene();
    
    // Setup camera
    this.setupCamera();
    
    // Add event listeners
    window.addEventListener('resize', this.onWindowResize);
    
    // Setup lighting
    this.setupLighting();
    
    // Start animation loop
    this.animate();
  }
  
  setupLoadingManager() {
    // Track loading progress for the loading screen
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progressBar = document.querySelector('.progress-bar');
      const progress = (itemsLoaded / itemsTotal) * 100;
      progressBar.style.width = `${progress}%`;
    };
    
    this.loadingManager.onLoad = () => {
      setTimeout(() => {
        // Hide loading screen
        document.getElementById('loading-screen').style.opacity = '0';
        
        // Show landing page and animate elements
        const landingPage = document.getElementById('landing-page');
        landingPage.classList.add('active');
        
        // Animate welcome text
        gsap.to('.welcome-text', {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power3.out'
        });
        
        // Animate enter button
        gsap.to('.enter-button', {
          opacity: 1,
          y: 0,
          duration: 1.5,
          delay: 0.5,
          ease: 'power3.out'
        });
        
        // Remove loading screen after fade out
        setTimeout(() => {
          document.getElementById('loading-screen').style.display = 'none';
        }, 1000);
      }, 1000); // Small delay for dramatic effect
    };
    
    this.loadingManager.onError = (url) => {
      console.error('Error loading:', url);
    };
  }
  
  setupRenderer() {
    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    // Set size and pixel ratio
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadow mapping
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set tone mapping
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }
  
  setupScene() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Set background color
    this.scene.background = new THREE.Color(0x01020d);
    
    // Add fog for depth
    this.scene.fog = new THREE.FogExp2(0x01020d, 0.0025);
  }
  
  setupCamera() {
    // Create perspective camera
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;
    
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 8, 25);
    this.camera.lookAt(this.orbitCenter);
    
    // Add camera to scene
    this.scene.add(this.camera);
  }
  
  setupLighting() {
    // Ambient light for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // Directional light for shadows and directional lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    
    // Optimize shadow map
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.bias = -0.0001;
    
    this.scene.add(directionalLight);
    
    // Point light at center for planet illumination
    const centerLight = new THREE.PointLight(0xffffff, 1, 100);
    centerLight.position.set(0, 0, 0);
    this.scene.add(centerLight);
    
    // Add a few colored point lights for atmosphere
    const colors = [0x05d9e8, 0xff2a6d, 0x2d1b6b];
    const positions = [
      [15, 5, 10],
      [-15, -5, -10],
      [0, 10, -15]
    ];
    
    colors.forEach((color, index) => {
      const light = new THREE.PointLight(color, 0.5, 50);
      light.position.set(...positions[index]);
      this.scene.add(light);
    });
  }
  
  addPlanet(planet) {
    this.planets.push(planet);
    this.planetObjects.push(planet.planetGroup);
    this.scene.add(planet.planetGroup);
  }
  
  addStarField(starField) {
    this.starField = starField;
    this.scene.add(starField.particleSystem);
  }
  
  onWindowResize() {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  animateCamera(targetPosition, targetLookAt, duration = 2, onComplete = null) {
    // Store current camera position and target
    const startPosition = this.camera.position.clone();
    const startRotation = this.camera.quaternion.clone();
    
    // Create a temporary camera to compute the target rotation
    const tempCamera = this.camera.clone();
    tempCamera.position.copy(targetPosition);
    tempCamera.lookAt(targetLookAt);
    const targetRotation = tempCamera.quaternion.clone();
    
    // Animate with GSAP
    gsap.to({}, {
      duration: duration,
      onUpdate: function() {
        // Get animation progress
        const progress = this.progress();
        
        // Interpolate position
        const currentPosition = new THREE.Vector3().lerpVectors(
          startPosition,
          targetPosition,
          easeInOut(progress)
        );
        
        // Interpolate rotation (slerp)
        const currentRotation = startRotation.clone().slerp(targetRotation, easeInOut(progress));
        
        // Apply to camera
        sceneManager.camera.position.copy(currentPosition);
        sceneManager.camera.quaternion.copy(currentRotation);
      },
      onComplete: onComplete
    });
  }
  
  setCurrentSection(section) {
    this.currentSection = section;
    
    // Update camera position based on section
    switch(section) {
      case 'home':
        this.animateCamera(
          new THREE.Vector3(0, 8, 25),
          this.orbitCenter
        );
        break;
      case 'about':
        this.animateCamera(
          new THREE.Vector3(
