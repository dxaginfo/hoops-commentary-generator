# Hoops Commentary Generator

A web application that creates AI-powered commentary for basketball play videos.

## Overview

The Hoops Commentary Generator is a creative tool that allows users to upload short basketball play videos and receive customized, AI-generated commentary that brings their highlights to life. Whether you're a coach wanting to add professional-sounding commentary to your team's plays or a player wanting to share your highlights with added excitement, this tool makes it easy to create engaging, shareable content.

## Features

- **Video Upload**: Upload short video clips of basketball plays
- **Commentary Styles**: Choose from different commentary styles (Excitable, Analytical, Old School)
- **Customization**: Add keywords to influence the commentary tone and focus
- **AI-Generated Audio**: Convert text commentary into realistic speech
- **Download & Share**: Download the final video with commentary overlay

## Technologies

- React.js for the frontend
- Node.js and Express for the backend
- TensorFlow.js for computer vision (play detection)
- Web Speech API and/or cloud-based TTS for voice generation
- WebAssembly for video processing

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the development server with `npm start`
4. Visit `http://localhost:3000` in your browser

## How It Works

1. Upload a basketball play video (10-15 seconds recommended)
2. Select a commentary style and add relevant keywords
3. Our AI analyzes the video content and generates appropriate commentary
4. The commentary is converted to speech and synchronized with the video
5. Download the final video with commentary

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.