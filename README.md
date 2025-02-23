# ElevenLabs Test Project

## Purpose
This is a minimal test project to isolate and debug ElevenLabs voice assistant integration issues. The main goal is to establish a working voice connection with ElevenLabs' conversational AI before integrating it into our larger ticketing platform project.

## What We're Testing
- ElevenLabs API connectivity
- WebSocket voice streaming
- Agent initialization and configuration
- Real-time voice interaction
- Error handling and debugging

## Current Focus
We're specifically trying to resolve the "Failed to fetch" error when attempting to connect to ElevenLabs' voice API. This test project provides detailed logging and error reporting to help identify where in the connection process issues are occurring.

## Features
- Step-by-step connection logging
- Detailed error reporting
- Visual connection status
- Microphone permission handling
- WebSocket state management

## Setup
1. Clone the repository
```bash
git clone https://github.com/stat-guy/elevenlabs-test.git
cd elevenlabs-test
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

## Testing Steps
1. Click "Connect" to start the connection process
2. Allow microphone access when prompted
3. Watch the logs for detailed information about:
   - Agent verification
   - API responses
   - WebSocket connection status
   - Any errors that occur

## Connection Process
1. Verify agent exists and configuration
2. Request microphone permissions
3. Get signed WebSocket URL
4. Establish WebSocket connection
5. Begin voice streaming

## Current Configuration
- Agent ID: XWyiK3VL2S6Ym75BWPxy
- Voice API Version: v1
- CORS enabled for all origins
- Full logging enabled

## Next Steps
Once we establish a working voice connection:
1. Test basic voice interactions
2. Verify audio quality and latency
3. Document working configuration
4. Integrate into main ticketing project

## Related Projects
- [Tickety Voice Assistant](https://github.com/stat-guy/tickettalk-voice-assistant) - Main ticketing platform where this voice capability will be integrated