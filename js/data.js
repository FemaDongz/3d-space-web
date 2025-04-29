/**
 * Project data
 * Contains information about portfolio projects
 */

const PROJECTS = [
  {
    id: 'planet-1',
    title: 'Cosmic Explorer',
    description: 'Interactive web application for exploring the universe. Built with Three.js and WebGL, this project allows users to navigate through a virtual solar system with realistic physics and detailed planet information.',
    image: 'images/projects/project1.jpg',
    link: 'https://example.com/project1',
    github: 'https://github.com/username/cosmic-explorer',
    planetColor: 0x3498db, // Blue
    planetTexture: 'images/textures/planet1.jpg',
    ringColor: 0x2980b9,
    hasRings: true,
    size: 1.2,
    orbitRadius: 6,
    orbitSpeed: 0.001,
    rotationSpeed: 0.005
  },
  {
    id: 'planet-2',
    title: 'Neural Network Visualizer',
    description: 'A visual representation of neural networks in action. This project uses WebGL to create a 3D visualization of how neural networks process data, making machine learning concepts more accessible through interactive demonstrations.',
    image: 'images/projects/project2.jpg',
    link: 'https://example.com/project2',
    github: 'https://github.com/username/neural-vis',
    planetColor: 0xe74c3c, // Red
    planetTexture: 'images/textures/planet2.jpg',
    ringColor: null,
    hasRings: false,
    size: 0.9,
    orbitRadius: 9,
    orbitSpeed: 0.0015,
    rotationSpeed: 0.003
  },
  {
    id: 'planet-3',
    title: 'Space Weather Dashboard',
    description: 'Real-time dashboard displaying space weather conditions. Fetching data from NASA APIs, this application visualizes solar flares, geomagnetic storms, and other space weather phenomena with beautiful, interactive charts.',
    image: 'images/projects/project3.jpg',
    link: 'https://example.com/project3',
    github: 'https://github.com/username/space-weather',
    planetColor: 0x2ecc71, // Green
    planetTexture: 'images/textures/planet3.jpg',
    ringColor: null,
    hasRings: false,
    size: 1.1,
    orbitRadius: 12,
    orbitSpeed: 0.0008,
    rotationSpeed: 0.004
  },
  {
    id: 'planet-4',
    title: 'Quantum Computing Simulator',
    description: 'An educational tool that simulates basic quantum computing operations. This web application helps users understand quantum gates, qubits, and simple quantum algorithms through visual representations and interactive exercises.',
    image: 'images/projects/project4.jpg',
    link: 'https://example.com/project4',
    github: 'https://github.com/username/quantum-sim',
    planetColor: 0x9b59b6, // Purple
    planetTexture: 'images/textures/planet4.jpg',
    ringColor: 0x8e44ad,
    hasRings: true,
    size: 1.3,
    orbitRadius: 15,
    orbitSpeed: 0.0005,
    rotationSpeed: 0.002
  },
  {
    id: 'planet-5',
    title: 'AI Art Generator',
    description: 'A creative tool that uses machine learning to generate unique digital artwork. Users can adjust various parameters to influence the generation process and create stunning abstract visuals based on different artistic styles.',
    image: 'images/projects/project5.jpg',
    link: 'https://example.com/project5',
    github: 'https://github.com/username/ai-art',
    planetColor: 0xf39c12, // Orange
    planetTexture: 'images/textures/planet5.jpg',
    ringColor: null,
    hasRings: false,
    size: 1,
    orbitRadius: 18,
    orbitSpeed: 0.0012,
    rotationSpeed: 0.006
  }
];
