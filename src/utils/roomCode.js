// Room Code Utility
// Generates unique 4-character uppercase alphanumeric codes (e.g. X7K9)

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars like I, O, 0, 1
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatRoomCode(code) {
  return (code || '').toUpperCase().trim();
}
