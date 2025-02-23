import { useEffect, useState } from 'react';
import { useConversation } from '@11labs/react';

const ELEVENLABS_API_KEY = 'sk_732088e718c98f9c5eb01c2ab4a4ab896e690ff544d2c5f7';
const ELEVENLABS_AGENT_ID = 'XWyiK3VL2S6Ym75BWPxy';

function App() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);
    console.log(msg); // Also log to console for debugging
  };

  const conversation = useConversation({
    onConnect: () => {
      addLog('Connected!');
      setIsConnecting(false);
    },
    onDisconnect: () => {
      addLog('Disconnected');
      setIsConnecting(false);
    },
    onError: (err) => {
      addLog(`Error: ${err.message || 'Unknown error'}`);
      setError(err.message || 'Unknown error');
      setIsConnecting(false);
    },
    onMessage: (msg) => {
      addLog(`Message received: ${JSON.stringify(msg)}`);
    }
  });

  const verifyAgent = async () => {
    try {
      addLog('Verifying agent configuration...');
      const response = await fetch(
        `https://api.elevenlabs.io/v1/assistants/${ELEVENLABS_AGENT_ID}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          }
        }
      );

      const data = await response.json();
      addLog(`Agent config: ${JSON.stringify(data)}`);

      if (!response.ok) {
        throw new Error(`Failed to verify agent: ${response.status}`);
      }

      return data;
    } catch (err) {
      addLog(`Agent verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  const connect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      addLog('Starting connection process...');
      
      // Step 1: Request microphone access
      addLog('Requesting microphone permission...');
      await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog('Microphone permission granted');

      // Step 2: Verify agent
      await verifyAgent();

      // Step 3: Get signed URL
      addLog('Getting signed URL...');
      const response = await fetch(
        `https://api.elevenlabs.io/v1/conversation-agent/signing-url?agent_id=${ELEVENLABS_AGENT_ID}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.status}`);
      }

      const data = await response.json();
      addLog(`Got signed URL: ${data.url}`);

      // Step 4: Start WebSocket session
      addLog('Starting WebSocket session...');
      await conversation.startSession({
        url: data.url
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect';
      setError(message);
      addLog(`Error: ${message}`);
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await conversation.endSession();
      addLog('Disconnected');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect';
      setError(message);
      addLog(`Error: ${message}`);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      conversation.endSession().catch(console.error);
    };
  }, [conversation]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>ElevenLabs Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={connect} 
          disabled={isConnecting}
          style={{ 
            padding: '10px 20px',
            marginRight: '10px',
            opacity: isConnecting ? 0.5 : 1
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </button>

        <button 
          onClick={disconnect}
          style={{ padding: '10px 20px' }}
        >
          Disconnect
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee',
          color: '#c62828',
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5',
        height: '400px',
        overflow: 'auto'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;