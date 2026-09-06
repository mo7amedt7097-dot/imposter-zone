// IMPOSTER Realtime Synchronization Engine
// Dual Mode: Node.js (port 5175) + PHP Relay (api.php) for InfinityFree / static PHP web hosting.

const NODE_SERVER_URL = 'http://localhost:5175';
const PHP_API_URL = typeof window !== 'undefined' ? `${window.location.origin}/api.php` : './api.php';

class RealtimeSyncEngine {
  constructor() {
    this.channels = {};
    this.usePhpApi = false;
    this.checkBackend();
  }

  async checkBackend() {
    if (typeof window === 'undefined') return;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      this.usePhpApi = true;
      return;
    }
    try {
      const res = await fetch(`${NODE_SERVER_URL}/api/rooms/TEST`, {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!res.ok) this.usePhpApi = true;
    } catch (e) {
      this.usePhpApi = true;
    }
  }

  getChannel(roomCode) {
    if (!roomCode) return null;
    const cleanCode = roomCode.toUpperCase().trim();
    if (!this.channels[cleanCode] && typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channels[cleanCode] = new BroadcastChannel(`imposter_room_${cleanCode}`);
    }
    return this.channels[cleanCode];
  }

  async publishRoomState(roomCode, stateData) {
    if (!roomCode) return;
    const cleanCode = roomCode.toUpperCase().trim();

    // 1. LocalStorage & BroadcastChannel
    try {
      window.localStorage.setItem(`imposter_room_state_${cleanCode}`, JSON.stringify(stateData));
    } catch (e) {}

    const channel = this.getChannel(cleanCode);
    if (channel) {
      channel.postMessage({ type: 'ROOM_UPDATE', roomCode: cleanCode, payload: stateData });
    }

    // 2. Dual HTTP Relay (Concurrently publish to Node server & PHP api.php for 100% reliability)
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };
    const body = JSON.stringify(stateData);

    try {
      await Promise.allSettled([
        fetch(`${NODE_SERVER_URL}/api/rooms/publish`, { method: 'POST', headers, body }),
        fetch(`${PHP_API_URL}?action=publish`, { method: 'POST', headers, body })
      ]);
    } catch (err) {}
  }

  async fetchRoomState(roomCode) {
    if (!roomCode) return null;
    const cleanCode = roomCode.toUpperCase().trim();
    const headers = { 'X-Requested-With': 'XMLHttpRequest' };

    // 1. Try Node Server first
    try {
      const resNode = await fetch(`${NODE_SERVER_URL}/api/rooms/${cleanCode}`, { headers });
      if (resNode.ok) {
        const text = await resNode.text();
        const trimmed = text ? text.trim() : '';
        if (trimmed.startsWith('{')) {
          const data = JSON.parse(trimmed);
          const roomData = (data && data.room) ? data.room : ((data && data.code) ? data : null);
          if (roomData) {
            try {
              window.localStorage.setItem(`imposter_room_state_${cleanCode}`, JSON.stringify(roomData));
            } catch (e) {}
            return roomData;
          }
        }
      }
    } catch (err) {}

    // 2. Try PHP API Relay fallback
    try {
      const resPhp = await fetch(`${PHP_API_URL}?action=get&code=${cleanCode}`, { headers });
      if (resPhp.ok) {
        const text = await resPhp.text();
        const trimmed = text ? text.trim() : '';
        if (trimmed.startsWith('{')) {
          const data = JSON.parse(trimmed);
          const roomData = (data && data.room) ? data.room : ((data && data.code) ? data : null);
          if (roomData) {
            try {
              window.localStorage.setItem(`imposter_room_state_${cleanCode}`, JSON.stringify(roomData));
            } catch (e) {}
            return roomData;
          }
        }
      }
    } catch (err) {}

    // 3. LocalStorage Fallback
    return this.getRoomState(cleanCode);
  }

  getRoomState(roomCode) {
    if (!roomCode) return null;
    const cleanCode = roomCode.toUpperCase().trim();
    try {
      const raw = window.localStorage.getItem(`imposter_room_state_${cleanCode}`);
      if (raw) return JSON.parse(raw);

      const savedRaw = window.localStorage.getItem('imposter_saved_groups');
      if (savedRaw) {
        const savedList = JSON.parse(savedRaw);
        const found = savedList.find(g => g && g.code === cleanCode);
        if (found) return found;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  subscribeRoomState(roomCode, callback) {
    if (!roomCode) return () => {};
    const cleanCode = roomCode.toUpperCase().trim();
    let lastSeenStateStr = '';

    const handleNewState = (newState) => {
      if (!newState) return;
      const str = JSON.stringify(newState);
      if (str !== lastSeenStateStr) {
        lastSeenStateStr = str;
        try {
          window.localStorage.setItem(`imposter_room_state_${cleanCode}`, str);
        } catch (e) {}
        callback(newState);
      }
    };

    // 1. SSE Stream if using Node.js
    let eventSource = null;
    if (!this.usePhpApi && typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        eventSource = new EventSource(`${NODE_SERVER_URL}/api/rooms/${cleanCode}/stream`);
        eventSource.onmessage = (event) => {
          if (event.data) {
            try {
              const parsed = JSON.parse(event.data);
              handleNewState(parsed);
            } catch (err) {}
          }
        };
      } catch (err) {}
    }

    // 2. BroadcastChannel Listener
    const channel = this.getChannel(cleanCode);
    const bcHandler = (event) => {
      if (event.data && event.data.type === 'ROOM_UPDATE' && event.data.roomCode === cleanCode) {
        handleNewState(event.data.payload);
      }
    };
    if (channel) {
      channel.addEventListener('message', bcHandler);
    }

    // 3. Storage Event Listener
    const storageHandler = (e) => {
      if (e.key === `imposter_room_state_${cleanCode}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleNewState(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', storageHandler);

    // 4. Fast Heartbeat Interval (500ms) for instant 100% sync across all devices
    const pollInterval = setInterval(() => {
      this.fetchRoomState(cleanCode).then((room) => {
        if (room) handleNewState(room);
      });
    }, 500);

    // Initial check
    this.fetchRoomState(cleanCode).then((room) => {
      if (room) handleNewState(room);
    });

    return () => {
      clearInterval(pollInterval);
      if (eventSource) {
        eventSource.close();
      }
      if (channel) {
        channel.removeEventListener('message', bcHandler);
      }
      window.removeEventListener('storage', storageHandler);
    };
  }

  async deleteRoomFromRegistry(roomCode) {
    if (!roomCode) return;
    const cleanCode = roomCode.toUpperCase().trim();
    try {
      window.localStorage.removeItem(`imposter_room_state_${cleanCode}`);
      if (this.usePhpApi) {
        await fetch(`${PHP_API_URL}?action=delete&code=${cleanCode}`, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
      } else {
        await fetch(`${NODE_SERVER_URL}/api/rooms/${cleanCode}`, { method: 'DELETE' });
      }
    } catch (e) {}
  }
}

export const syncEngine = new RealtimeSyncEngine();
