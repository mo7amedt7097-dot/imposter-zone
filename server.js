// IMPOSTER Realtime Multi-Device Room Server (ES Module)
// Runs on port 5175 using Node.js built-in HTTP module with Server-Sent Events (SSE).
// Allows instant room synchronization across different devices, phones, browsers, and incognito tabs!

import http from 'http';

const PORT = 5175;

// In-memory room store: { [roomCode]: roomState }
const rooms = {};

// SSE connections per room: { [roomCode]: [res1, res2, ...] }
const clients = {};

function corsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
}

const server = http.createServer((req, res) => {
  corsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlParts = req.url.split('?')[0].split('/').filter(Boolean);

  // Endpoint: GET /api/rooms/:code
  if (req.method === 'GET' && urlParts[0] === 'api' && urlParts[1] === 'rooms' && urlParts[2] && urlParts[3] !== 'stream') {
    const code = urlParts[2].toUpperCase();
    const room = rooms[code] || null;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, room }));
    return;
  }

  // Endpoint: POST /api/rooms/publish
  if (req.method === 'POST' && urlParts[0] === 'api' && urlParts[1] === 'rooms' && urlParts[2] === 'publish') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const code = (payload.code || payload.roomCode || '').toUpperCase();
        if (code) {
          rooms[code] = payload;

          // Broadcast SSE to all connected client devices for this room
          if (clients[code]) {
            const data = `data: ${JSON.stringify(payload)}\n\n`;
            clients[code].forEach(clientRes => clientRes.write(data));
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, code }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Endpoint: GET /api/rooms/:code/stream (SSE stream)
  if (req.method === 'GET' && urlParts[0] === 'api' && urlParts[1] === 'rooms' && urlParts[2] && urlParts[3] === 'stream') {
    const code = urlParts[2].toUpperCase();
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    if (!clients[code]) {
      clients[code] = [];
    }
    clients[code].push(res);

    // Send initial state immediately if exists
    if (rooms[code]) {
      res.write(`data: ${JSON.stringify(rooms[code])}\n\n`);
    }

    req.on('close', () => {
      if (clients[code]) {
        clients[code] = clients[code].filter(c => c !== res);
      }
    });
    return;
  }

  // Endpoint: DELETE /api/rooms/:code
  if (req.method === 'DELETE' && urlParts[0] === 'api' && urlParts[1] === 'rooms' && urlParts[2]) {
    const code = urlParts[2].toUpperCase();
    delete rooms[code];
    if (clients[code]) {
      clients[code].forEach(c => c.write(`data: ${JSON.stringify(null)}\n\n`));
      delete clients[code];
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`IMPOSTER Realtime Room Sync Server running on http://localhost:${PORT}`);
});
