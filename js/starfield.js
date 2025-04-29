/**
 * Starfield background creation and management
 */

class StarField {
  constructor(radius = 500, starCount = 20000) {
    this.radius = radius;
    this.starCount = starCount;
    this.particleSystem = null;
    this.starMaterial = null;
    
    // Create star field
    this.create();
  }
  
  create() {
    // Create geometry with star positions
    const positions = generateStarPositions(this.starCount, this.radius);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    // Generate random sizes for stars
    const sizes = generateStarSizes(this.starCount, 0.5, 2.5);
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    
    // Create star material with custom shader for better looking stars
    this.starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float pixelRatio;
        
        varying vec3 vColor;
        
        void main() {
          // Position
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Generate color based on position - creates subtle color variation
          float r = 0.8 + 0.2 * sin(position.x * 0.05 + time * 0.1);
          float g = 0.8 + 0.2 * sin(position.y * 0.05 + time * 0.2);
          float b = 0.8 + 0.2 * sin(position.z * 0.05 + time * 0.3);
          vColor = vec3(r, g, b);
          
          // Size based on distance (closer stars appear larger)
          float distance = length(mvPosition.xyz);
          float sizeMod = 1.0 - (distance / 500.0);
          sizeMod = max(0.2, sizeMod);
          
          // Set point size with pixel ratio adjustment
          gl_PointSize = size * sizeMod * pixelRatio;
          
          // Output position
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular point
          vec2 coords = gl_PointCoord * 2.0 - 1.0;
          float distance = length(coords);
          float alpha = 1.0 - smoothstep(0.8, 1.0, distance);
          
          // Apply color and alpha
          gl_FragColor = vec4(vColor, alpha);
          
          // Discard pixels outside of circle
          if (distance > 1.0) {
            discard;
          }
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    
    // Create particle system
    this.particleSystem = new THREE.Points(geometry, this.starMaterial);
  }
  
  update(delta, elapsedTime) {
    // Update time uniform for subtle star twinkling
    if (this.starMaterial) {
      this.starMaterial.uniforms.time.value = elapsedTime;
    }
    
    // Slowly rotate star field for subtle movement
    if (this.particleSystem) {
      this.particleSystem.rotation.y += delta * 0.01;
      this.particleSystem.rotation.x += delta * 0.005;
    }
  }
}

function createStarField(sceneManager) {
  const starField = new StarField(500, 20000);
  sceneManager.addStarField(starField);
}
