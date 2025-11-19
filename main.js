import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue background

// Camera setup
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Orbital controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Create checkerboard ground plane
const groundSize = 20;
const checkerSize = 1;
const checkerCount = groundSize / checkerSize;

const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
});

// Create checkerboard texture using canvas
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');

const squareSize = canvas.width / checkerCount;
for (let i = 0; i < checkerCount; i++) {
    for (let j = 0; j < checkerCount; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#ffffff' : '#333333';
        ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    }
}

const checkerTexture = new THREE.CanvasTexture(canvas);
checkerTexture.wrapS = THREE.RepeatWrapping;
checkerTexture.wrapT = THREE.RepeatWrapping;
groundMaterial.map = checkerTexture;

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Create red ball
const ballRadius = 0.5;
const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.3,
    roughness: 0.4
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, ballRadius, 0);
ball.castShadow = true;
scene.add(ball);

// Ball physics state
const ballState = {
    velocity: new THREE.Vector3(0, 0, 0),
    speed: 0,
    isRolling: false,
    direction: new THREE.Vector3(1, 0, 0), // Initial direction
    rotation: new THREE.Euler(0, 0, 0),
    angularVelocity: new THREE.Vector3(0, 0, 0),
    targetPosition: null, // Target position for click-to-move
    hasTarget: false
};

// Constants
const ACCELERATION = 0.05;
const DECELERATION = 0.03;
const MAX_SPEED = 0.5;
const MIN_SPEED = 0;
const FRICTION = 0.98;
const TARGET_SPEED = 0.3; // Speed when rolling to target
const TARGET_THRESHOLD = 0.1; // Distance threshold to consider target reached

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Ball control functions
function startRoll() {
    ballState.isRolling = true;
    if (ballState.speed === 0) {
        ballState.speed = 0.05; // Initial speed
    }
}

function stopRoll() {
    ballState.isRolling = false;
}

function resetRoll() {
    ballState.speed = 0;
    ballState.isRolling = false;
    ball.position.set(0, ballRadius, 0);
    ball.rotation.set(0, 0, 0);
    ballState.direction.set(1, 0, 0);
}

function accelerate() {
    ballState.speed = Math.min(ballState.speed + ACCELERATION, MAX_SPEED);
    if (!ballState.isRolling) {
        ballState.isRolling = true;
    }
}

function decelerate() {
    ballState.speed = Math.max(ballState.speed - DECELERATION, MIN_SPEED);
    if (ballState.speed === 0) {
        ballState.isRolling = false;
    }
}

// Update ball physics
function updateBall(deltaTime) {
    // Handle click-to-move behavior
    if (ballState.hasTarget && ballState.targetPosition) {
        const currentPos = new THREE.Vector2(ball.position.x, ball.position.z);
        const targetPos = new THREE.Vector2(ballState.targetPosition.x, ballState.targetPosition.z);
        const distance = currentPos.distanceTo(targetPos);

        // Check if we've reached the target
        if (distance < TARGET_THRESHOLD) {
            // Snap to exact position and stop
            ball.position.x = ballState.targetPosition.x;
            ball.position.z = ballState.targetPosition.z;
            ballState.hasTarget = false;
            ballState.isRolling = false;
            ballState.speed = 0;
            ballState.velocity.set(0, 0, 0);
        } else {
            // Calculate direction to target
            const directionToTarget = new THREE.Vector3(
                ballState.targetPosition.x - ball.position.x,
                0,
                ballState.targetPosition.z - ball.position.z
            ).normalize();

            // Update direction and ensure ball is rolling
            ballState.direction.copy(directionToTarget);
            ballState.isRolling = true;

            // Slow down as we approach the target to prevent overshooting
            const slowdownDistance = 1.0; // Start slowing down at this distance
            if (distance < slowdownDistance) {
                ballState.speed = TARGET_SPEED * (distance / slowdownDistance);
                // Ensure minimum speed so it doesn't get stuck
                ballState.speed = Math.max(ballState.speed, 0.05);
            } else {
                ballState.speed = TARGET_SPEED;
            }
        }
    }

    if (ballState.isRolling && ballState.speed > 0) {
        // Calculate velocity based on direction and speed
        ballState.velocity.copy(ballState.direction).multiplyScalar(ballState.speed);

        // Update position
        ball.position.add(ballState.velocity);

        // Calculate rotation based on movement
        // The ball should rotate perpendicular to its direction of movement
        const rotationAxis = new THREE.Vector3()
            .crossVectors(ballState.direction, new THREE.Vector3(0, 1, 0))
            .normalize();

        const rotationSpeed = ballState.speed / ballRadius;
        ball.rotateOnWorldAxis(rotationAxis, rotationSpeed);

        // Keep ball on ground
        ball.position.y = ballRadius;

        // Boundary check - bounce off edges
        const boundary = groundSize / 2 - ballRadius;
        if (Math.abs(ball.position.x) > boundary) {
            ball.position.x = Math.sign(ball.position.x) * boundary;
            ballState.direction.x *= -1;
            // Cancel target if we hit boundary
            ballState.hasTarget = false;
        }
        if (Math.abs(ball.position.z) > boundary) {
            ball.position.z = Math.sign(ball.position.z) * boundary;
            ballState.direction.z *= -1;
            // Cancel target if we hit boundary
            ballState.hasTarget = false;
        }
    } else if (!ballState.isRolling && !ballState.hasTarget) {
        // Apply friction when not actively rolling
        ballState.speed *= FRICTION;
        if (ballState.speed < 0.001) {
            ballState.speed = 0;
            ballState.velocity.set(0, 0, 0);
        }
    }

    // Update speed display
    updateSpeedDisplay();
}

// Update speed display
function updateSpeedDisplay() {
    const speedDisplay = document.getElementById('speedDisplay');
    speedDisplay.textContent = `Speed: ${ballState.speed.toFixed(2)}`;
}

// Click-to-move: Convert mouse click to 3D position and set as target
function onCanvasClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Cast ray from camera through mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check intersection with ground plane
    const intersects = raycaster.intersectObject(ground);

    if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;

        // Set the target position (keep y at ball radius to stay on ground)
        ballState.targetPosition = new THREE.Vector3(
            intersectionPoint.x,
            ballRadius,
            intersectionPoint.z
        );
        ballState.hasTarget = true;
    }
}

// Button event listeners
document.getElementById('startBtn').addEventListener('click', startRoll);
document.getElementById('stopBtn').addEventListener('click', stopRoll);
document.getElementById('resetBtn').addEventListener('click', resetRoll);
document.getElementById('accelerateBtn').addEventListener('click', accelerate);
document.getElementById('decelerateBtn').addEventListener('click', decelerate);

// Canvas click listener for click-to-move
renderer.domElement.addEventListener('click', onCanvasClick);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Update controls
    controls.update();

    // Update ball physics
    updateBall(deltaTime);

    // Render scene
    renderer.render(scene, camera);
}

// Start animation
animate();
