/**
 * Planet creation and management for the space portfolio
 */

class Planet {
  constructor(data, textureLoader) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.size = data.size || 1;
    this.orbitRadius = data.orbitRadius || 10;
    this.orbitSpeed = data.orbitSpeed || 0.001;
    this.rotationSpeed = data.rotationSpeed || 0.005;
    this.planetColor = data.planetColor || 0xffffff;
    this.ringColor = data.ringColor;
    this.hasRings = data.hasRings || false;
    this.textureLoader = textureLoader;
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.planetGroup = new THREE.Group();
    this.planet = null;
    this.rings = null;
    this.hovered = false;
    
    // Create planet mesh
    this.createPlanet(data.planetTexture);

    // Create rings if needed
    if (this.hasRings) {
      this.createRings();
    }
    
    // Position planet group at initial orbit position
    this.updateOrbitPosition();
  }
  
  createPlanet(textureUrl) {
    // Create geometry
    const geometry = new THREE.SphereGeometry(this.size, 32, 32);
    
    // Create material
    let material;
    
    if (textureUrl) {
      // Use texture if available
      try {
        const texture = this.textureLoader.load(textureUrl);
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.2
        });
      } catch (e) {
        console.warn(`Failed to load texture for planet ${this.id}, falling back to color`, e);
        material = this.createFallbackMaterial();
      }
    } else {
      material = this.createFallbackMaterial();
    }
    
    // Create mesh
    this.planet = new THREE.Mesh(geometry, material);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;
    
    // Add to group
    this.planetGroup.add(this.planet);
    
    // Add atmosphere for visual effect
    this.createAtmosphere();
  }
  
  createFallbackMaterial() {
    return new THREE.MeshStandardMaterial({
      color: this.planetColor,
      roughness: 0.7,
      metalness: 0.3
    });
  }
  
  createAtmosphere() {
    // Create slightly larger sphere for glow effect
    const geometry = new THREE.SphereGeometry(this.size * 1.1, 32, 32);
    
    // Use custom shader material for glow effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(this.planetColor) },
        intensityFactor: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensityFactor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, intensity * intensityFactor);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const atmosphere = new THREE.Mesh(geometry, material);
    this.planetGroup.add(atmosphere);
  }
  
  createRings() {
    // Create ring geometry
    const innerRadius = this.size * 1.4;
    const outerRadius = this.size * 2.2;
    const thetaSegments = 64;
    
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
    
    // Adjust vertices to create proper 3D ring
    const pos = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.position.setXYZ(i, v3.x, v3.y, v3.z);
    }
    
    // Create ring material
    const material = new THREE.MeshStandardMaterial({
      color: this.ringColor || 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Create mesh and rotate it
    this.rings = new THREE.Mesh(geometry, material);
    this.rings.rotation.x = Math.PI / 2;
    this.rings.castShadow = true;
    this.rings.receiveShadow = true;
    
    // Add to planet group
    this.planetGroup.add(this.rings);
  }
  
  updateOrbitPosition() {
    // Calculate position on orbit
    const x = Math.cos(this.orbitAngle) * this.orbitRadius;
    const z = Math.sin(this.orbitAngle) * this.orbitRadius;
    
    // Set planet group position
    this.planetGroup.position.set(x, 0, z);
  }
  
  setHovered(isHovered) {
    // Track hover state
    this.hovered = isHovered;
    
    // Scale the planet slightly when hovered
    const scale = isHovered ? 1.1 : 1;
    
    // Animate scale change
    gsap.to(this.planetGroup.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    // Add glow effect when hovered
    if (this.planet.material.emissive) {
      const emissiveIntensity = isHovered ? 0.3 : 0;
      const emissiveColor = isHovered ? new THREE.Color(0x05d9e8) : new THREE.Color(0x000000);
      
      gsap.to(this.planet.material, {
        emissiveIntensity: emissiveIntensity,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (isHovered) {
            this.planet.material.emissive = emissiveColor;
          }
          this.planet.material.needsUpdate = true;
        }
      });
    }
  }
  
  update(delta, elapsedTime) {
    // Update orbit angle
    this.orbitAngle += this.orbitSpeed * delta;
    
    // Update position on orbit
    this.updateOrbitPosition();
    
    // Rotate planet
    if (this.planet) {
      this.planet.rotation.y += this.rotationSpeed * delta;
    }
    
    // Add some vertical bobbing to the planet
    const bobAmount = this.hovered ? 0.1 : 0.05;
    const bobSpeed = this.hovered ? 2 : 1;
    this.planetGroup.position.y = Math.sin(elapsedTime * bobSpeed) * bobAmount;
  }
}

function createPlanets(sceneManager) {
  // Create planets from project data
  PROJECTS.forEach(projectData => {
    const planet = new Planet(projectData, sceneManager.textureLoader);
    sceneManager.addPlanet(planet);
  });
}
