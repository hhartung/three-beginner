# Three.js Rolling Ball

A 3D interactive scene featuring a rolling red ball on a checkerboard ground plane with orbital camera controls.

## Features

- 3D scene with a red ball on a checkerboard ground plane
- Orbital camera controls for navigating the scene
- Ball rolling physics with rotation
- **Click-to-move**: Click anywhere on the ground to send the ball rolling to that position
- Interactive HTML controls:
  - **Start Roll**: Begin ball movement
  - **Stop**: Stop the ball
  - **Reset**: Return ball to starting position
  - **+ Accelerate**: Increase ball speed
  - **- Decelerate**: Decrease ball speed
- Real-time speed display
- Ball bounces off boundaries
- Smooth shadows and lighting
- Smart deceleration as ball approaches target position

## Setup

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start a development server. Open your browser to the URL shown in the console (usually http://localhost:5173).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Controls

### Mouse Controls
- **Left Click**: Click on the ground plane to set a target position - the ball will roll to that location
- **Left Click + Drag**: Rotate camera around the scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

### Button Controls
- **Start Roll**: Initiates ball movement with default speed
- **Stop**: Stops the ball rolling
- **Reset**: Returns the ball to the center position (0, 0)
- **+ Accelerate**: Increases ball speed (max speed limit applied)
- **- Decelerate**: Decreases ball speed (min speed limit applied)

## Technical Details

- Built with Three.js v0.160.0
- Uses Vite for development and building
- OrbitControls for camera manipulation
- Raycasting for converting 2D mouse clicks to 3D world coordinates
- Custom checkerboard texture generated via Canvas API
- Physics-based ball rotation that corresponds to rolling motion
- Boundary detection with bounce effect
- Dynamic speed adjustment with smooth deceleration near targets

## Project Structure

```
three-beginner/
├── index.html          # Main HTML file with UI controls
├── main.js            # Three.js scene and game logic
├── package.json       # Project dependencies and scripts
└── README.md          # This file
```

## How It Works

The ball can be controlled in two ways:

1. **Click-to-Move**: Click anywhere on the checkerboard ground, and the ball will automatically roll to that position. Each new click sets a new target, and the ball smoothly decelerates as it approaches the destination to prevent overshooting.

2. **Manual Controls**: Use the button controls to start, stop, accelerate, or decelerate the ball's movement in its current direction.

When the ball hits the boundaries of the ground plane, it bounces back and cancels any active target. The camera can be freely moved around the scene using mouse controls, allowing you to view the ball from any angle.

The ball uses physics-based rotation that accurately corresponds to its rolling motion, creating a realistic rolling effect.
