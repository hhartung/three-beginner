# Three.js Rolling Ball

A 3D interactive scene featuring a rolling red ball on a checkerboard ground plane with orbital camera controls.

## Features

- 3D scene with a red ball on a checkerboard ground plane
- Orbital camera controls for navigating the scene
- Ball rolling physics with rotation
- Interactive HTML controls:
  - **Start Roll**: Begin ball movement
  - **Stop**: Stop the ball
  - **+ Accelerate**: Increase ball speed
  - **- Decelerate**: Decrease ball speed
- Real-time speed display
- Ball bounces off boundaries
- Smooth shadows and lighting

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
- **Left Click + Drag**: Rotate camera around the scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out

### Button Controls
- **Start Roll**: Initiates ball movement with default speed
- **Stop**: Stops the ball rolling
- **+ Accelerate**: Increases ball speed (max speed limit applied)
- **- Decelerate**: Decreases ball speed (min speed limit applied)

## Technical Details

- Built with Three.js v0.160.0
- Uses Vite for development and building
- OrbitControls for camera manipulation
- Custom checkerboard texture generated via Canvas API
- Physics-based ball rotation that corresponds to rolling motion
- Boundary detection with bounce effect

## Project Structure

```
three-beginner/
├── index.html          # Main HTML file with UI controls
├── main.js            # Three.js scene and game logic
├── package.json       # Project dependencies and scripts
└── README.md          # This file
```

## How It Works

The ball rolls in a straight line with physics-based rotation. When it hits the boundaries of the ground plane, it bounces back. The speed can be controlled using the accelerate and decelerate buttons, and the rolling can be started or stopped at any time.

The camera can be freely moved around the scene using mouse controls, allowing you to view the ball from any angle.
