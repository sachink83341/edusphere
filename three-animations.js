// Three.js animations for EduSphere
let scenes = {};
let renderers = {};
let cameras = {};
let animationFrames = {};

// Initialize all Three.js animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initSolarSystemAnimation();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});

// Hero section animation - Orbiting books around a globe
function initHeroAnimation() {
    const container = document.getElementById('three-container') || document.getElementById('hero-animation');
    
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js container or library not found for hero animation');
        return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scenes.hero = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameras.hero = camera;
    camera.position.set(0, 0, 8);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderers.hero = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create central globe
    const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x4f46e5,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);
    
    // Create wireframe overlay for globe
    const wireframeGeometry = new THREE.SphereGeometry(1.02, 16, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);
    
    // Create orbiting books
    const books = [];
    const bookCount = 8;
    
    for (let i = 0; i < bookCount; i++) {
        // Book geometry
        const bookGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.05);
        const bookColors = [0xe11d48, 0x059669, 0x7c3aed, 0xdc2626, 0x0891b2, 0xca8a04, 0x9333ea, 0x16a34a];
        const bookMaterial = new THREE.MeshPhongMaterial({ color: bookColors[i % bookColors.length] });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        
        // Position books in orbit
        const angle = (i / bookCount) * Math.PI * 2;
        const radius = 3;
        book.position.x = Math.cos(angle) * radius;
        book.position.y = Math.sin(angle) * radius * 0.5;
        book.position.z = Math.sin(angle) * radius * 0.3;
        
        // Random rotation
        book.rotation.x = Math.random() * Math.PI;
        book.rotation.y = Math.random() * Math.PI;
        book.rotation.z = Math.random() * Math.PI;
        
        books.push({
            mesh: book,
            originalAngle: angle,
            speed: 0.5 + Math.random() * 0.5,
            radius: radius,
            verticalOffset: Math.random() * 0.5 - 0.25
        });
        
        scene.add(book);
    }
    
    // Animation loop
    function animateHero() {
        animationFrames.hero = requestAnimationFrame(animateHero);
        
        const time = Date.now() * 0.001;
        
        // Rotate globe
        globe.rotation.y = time * 0.2;
        wireframe.rotation.y = time * 0.15;
        
        // Animate orbiting books
        books.forEach((bookData, index) => {
            const book = bookData.mesh;
            const angle = bookData.originalAngle + time * bookData.speed;
            
            book.position.x = Math.cos(angle) * bookData.radius;
            book.position.y = Math.sin(angle) * bookData.radius * 0.5 + bookData.verticalOffset;
            book.position.z = Math.sin(angle) * bookData.radius * 0.3;
            
            // Rotate books
            book.rotation.x += 0.01;
            book.rotation.y += 0.02;
        });
        
        // Camera gentle movement
        camera.position.x = Math.sin(time * 0.1) * 0.5;
        camera.position.y = Math.cos(time * 0.15) * 0.3;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animateHero();
}

// Solar system animation for science section
function initSolarSystemAnimation() {
    const container = document.getElementById('solar-system-container');
    
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js container or library not found for solar system');
        return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    scenes.solarSystem = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    cameras.solarSystem = camera;
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderers.solarSystem = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000011);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const sunLight = new THREE.PointLight(0xffffff, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    
    // Create sun
    const sunGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const sunMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xffaa00,
        emissive: 0xff6600,
        emissiveIntensity: 0.3
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
    
    // Planet data (simplified solar system)
    const planets = [
        { name: 'Mercury', radius: 0.1, distance: 2, speed: 0.8, color: 0x8c7853 },
        { name: 'Venus', radius: 0.15, distance: 2.7, speed: 0.6, color: 0xffc649 },
        { name: 'Earth', radius: 0.16, distance: 3.5, speed: 0.5, color: 0x6b93d6 },
        { name: 'Mars', radius: 0.12, distance: 4.2, speed: 0.4, color: 0xc1440e },
        { name: 'Jupiter', radius: 0.4, distance: 6, speed: 0.2, color: 0xd8ca9d },
        { name: 'Saturn', radius: 0.35, distance: 7.5, speed: 0.15, color: 0xfad5a5 }
    ];
    
    const planetMeshes = [];
    
    planets.forEach((planetData, index) => {
        // Create planet
        const planetGeometry = new THREE.SphereGeometry(planetData.radius, 16, 16);
        const planetMaterial = new THREE.MeshPhongMaterial({ color: planetData.color });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        // Create orbit line
        const orbitGeometry = new THREE.RingGeometry(planetData.distance - 0.02, planetData.distance + 0.02, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x444444, 
            transparent: true, 
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        
        // Add Saturn's rings
        if (planetData.name === 'Saturn') {
            const ringGeometry = new THREE.RingGeometry(planetData.radius * 1.2, planetData.radius * 1.8, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }
        
        planetMeshes.push({
            mesh: planet,
            data: planetData,
            angle: Math.random() * Math.PI * 2
        });
        
        scene.add(planet);
    });
    
    // Add stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    
    const starVertices = [];
    for (let i = 0; i < 200; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Animation loop
    function animateSolarSystem() {
        animationFrames.solarSystem = requestAnimationFrame(animateSolarSystem);
        
        const time = Date.now() * 0.001;
        
        // Rotate sun
        sun.rotation.y = time * 0.2;
        
        // Animate planets
        planetMeshes.forEach((planetObj) => {
            const planet = planetObj.mesh;
            const data = planetObj.data;
            
            planetObj.angle += data.speed * 0.01;
            
            planet.position.x = Math.cos(planetObj.angle) * data.distance;
            planet.position.z = Math.sin(planetObj.angle) * data.distance;
            
            // Rotate planet
            planet.rotation.y += 0.02;
        });
        
        // Rotate stars slowly
        stars.rotation.y += 0.0005;
        
        // Camera movement
        camera.position.x = Math.sin(time * 0.1) * 12;
        camera.position.z = Math.cos(time * 0.1) * 12;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animateSolarSystem();
}

// Handle window resize
function handleResize() {
    Object.keys(renderers).forEach(key => {
        const renderer = renderers[key];
        const camera = cameras[key];
        let container;
        
        switch(key) {
            case 'hero':
                container = document.getElementById('three-container') || document.getElementById('hero-animation');
                break;
            case 'solarSystem':
                container = document.getElementById('solar-system-container');
                break;
        }
        
        if (container && renderer && camera) {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        }
    });
}

// Clean up function to dispose of Three.js resources
function disposeThreeJS() {
    Object.keys(animationFrames).forEach(key => {
        if (animationFrames[key]) {
            cancelAnimationFrame(animationFrames[key]);
        }
    });
    
    Object.keys(renderers).forEach(key => {
        const renderer = renderers[key];
        if (renderer) {
            renderer.dispose();
        }
    });
    
    Object.keys(scenes).forEach(key => {
        const scene = scenes[key];
        if (scene) {
            scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
    });
}

// Initialize additional 3D visualizations for other subjects
function initSubjectCube() {
    const container = document.getElementById('subject-cube-container');
    
    if (!container || typeof THREE === 'undefined') {
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create cube with subject icons
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff6b6b }), // Math - Red
        new THREE.MeshBasicMaterial({ color: 0x4ecdc4 }), // Science - Teal
        new THREE.MeshBasicMaterial({ color: 0x45b7d1 }), // Physics - Blue
        new THREE.MeshBasicMaterial({ color: 0xf9ca24 }), // History - Yellow
        new THREE.MeshBasicMaterial({ color: 0x6c5ce7 }), // Computer - Purple
        new THREE.MeshBasicMaterial({ color: 0xa55eea })  // English - Pink
    ];
    
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    
    camera.position.z = 5;
    
    function animateCube() {
        requestAnimationFrame(animateCube);
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animateCube();
}

// Mathematical visualization helpers
function createMathVisualization(container, type) {
    if (!container || typeof THREE === 'undefined') {
        return;
    }
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    switch(type) {
        case 'function':
            createFunctionGraph(scene);
            break;
        case 'geometry':
            createGeometricShapes(scene);
            break;
    }
    
    camera.position.z = 10;
    
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    
    animate();
}

function createFunctionGraph(scene) {
    const points = [];
    for (let x = -10; x <= 10; x += 0.1) {
        const y = Math.sin(x);
        points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    
    scene.add(line);
}

function createGeometricShapes(scene) {
    // Create various geometric shapes for math visualization
    const shapes = [
        { geometry: new THREE.SphereGeometry(1, 32, 32), position: { x: -3, y: 0, z: 0 }, color: 0xff0000 },
        { geometry: new THREE.BoxGeometry(1.5, 1.5, 1.5), position: { x: 0, y: 0, z: 0 }, color: 0x00ff00 },
        { geometry: new THREE.ConeGeometry(1, 2, 32), position: { x: 3, y: 0, z: 0 }, color: 0x0000ff }
    ];
    
    shapes.forEach(shape => {
        const material = new THREE.MeshBasicMaterial({ color: shape.color, wireframe: true });
        const mesh = new THREE.Mesh(shape.geometry, material);
        mesh.position.set(shape.position.x, shape.position.y, shape.position.z);
        scene.add(mesh);
    });
}

// Cleanup on page unload
window.addEventListener('beforeunload', disposeThreeJS);

// Export for external use
window.ThreeAnimations = {
    initHeroAnimation,
    initSolarSystemAnimation,
    initSubjectCube,
    createMathVisualization,
    handleResize,
    disposeThreeJS
};
