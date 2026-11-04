import { WebSocketServer } from 'ws';

export function setupSyncServer(httpServer) {
  if (!httpServer) return;

  const wss = new WebSocketServer({ noServer: true });

  // Map of instanceId -> { instanceId, themeId, layoutSeats, seats: {}, staffList: [], clients: Set<WebSocket> }
  const rooms = new Map();

  function getOrCreateRoom(instanceId = 'default-lounge') {
    if (!rooms.has(instanceId)) {
      rooms.set(instanceId, {
        instanceId,
        themeId: 'jungle-cabin',
        layoutSeats: null, // stores custom dragged seat placements
        seats: {}, // seatId -> user
        staffList: [
          {
            id: 'chef-station',
            name: 'Cabin Chef',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
            role: 'Head Chef',
            roleColor: '#faa61a',
            isActive: true,
            isSpeaking: false,
            cookingDish: 'Campfire Skillet Stew 🥘',
            dishIcon: '🥘',
            status: 'online'
          }
        ],
        clients: new Set()
      });
    }
    return rooms.get(instanceId);
  }

  function broadcastToRoom(room, message, senderWs = null) {
    const payload = JSON.stringify(message);
    for (const client of room.clients) {
      if (client !== senderWs && client.readyState === 1 /* OPEN */) {
        try {
          client.send(payload);
        } catch {
          // ignore send error
        }
      }
    }
  }

  httpServer.on('upgrade', (request, socket, head) => {
    try {
      const host = request.headers.host || 'localhost';
      const url = new URL(request.url, `http://${host}`);

      if (url.pathname === '/sync-ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
    } catch (err) {
      console.error('[SyncServer] Upgrade error:', err);
    }
  });

  wss.on('connection', (ws, req) => {
    let currentInstanceId = 'default-lounge';
    let currentUser = null;

    ws.on('message', (dataRaw) => {
      try {
        const msg = JSON.parse(dataRaw.toString());
        const { type, instanceId, payload } = msg;

        if (type === 'JOIN') {
          currentInstanceId = instanceId || 'default-lounge';
          currentUser = payload?.user;

          const room = getOrCreateRoom(currentInstanceId);
          room.clients.add(ws);

          // If joining client has custom layout seats or theme, sync if room doesn't have it yet
          if (payload?.layoutSeats && !room.layoutSeats) {
            room.layoutSeats = payload.layoutSeats;
          }
          if (payload?.themeId && room.themeId === 'jungle-cabin') {
            room.themeId = payload.themeId;
          }

          // If this is the first real user joining and chef is generic, assign them as chef
          if (currentUser && room.clients.size === 1) {
            room.staffList[0] = {
              ...room.staffList[0],
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              role: 'You (Chef)'
            };
          }

          // Automatically auto-seat user at next available chair if they don't have one
          const alreadySeated = Object.values(room.seats).some((u) => u.id === currentUser?.id);
          if (!alreadySeated && currentUser) {
            for (let i = 1; i <= 10; i++) {
              const seatId = `seat-${i}`;
              if (!room.seats[seatId]) {
                room.seats[seatId] = {
                  ...currentUser,
                  seatId
                };
                break;
              }
            }
          }

          // Send current full state back to joining client
          ws.send(JSON.stringify({
            type: 'INIT_STATE',
            payload: {
              seats: room.seats,
              staffList: room.staffList,
              layoutSeats: room.layoutSeats,
              themeId: room.themeId
            }
          }));

          // Notify other clients about the joined player & updated seats
          broadcastToRoom(room, {
            type: 'STATE_UPDATE',
            payload: {
              seats: room.seats,
              staffList: room.staffList
            }
          }, ws);

          broadcastToRoom(room, {
            type: 'PLAYER_JOINED',
            payload: { user: currentUser }
          }, ws);
        }

        // 1. UPDATE SEAT LAYOUT (Synchronizes dragged chair coordinates in real time)
        if (type === 'UPDATE_SEAT_LAYOUT') {
          const room = getOrCreateRoom(currentInstanceId);
          if (payload?.layoutSeats) {
            room.layoutSeats = payload.layoutSeats;
            broadcastToRoom(room, {
              type: 'SEAT_LAYOUT_UPDATE',
              payload: { layoutSeats: room.layoutSeats }
            });
          }
        }

        // 2. UPDATE THEME (Synchronizes active theme across joined players)
        if (type === 'UPDATE_THEME') {
          const room = getOrCreateRoom(currentInstanceId);
          if (payload?.themeId) {
            room.themeId = payload.themeId;
            if (payload?.layoutSeats) {
              room.layoutSeats = payload.layoutSeats;
            }
            broadcastToRoom(room, {
              type: 'THEME_UPDATE',
              payload: {
                themeId: room.themeId,
                layoutSeats: room.layoutSeats
              }
            });
          }
        }

        if (type === 'CLAIM_SEAT') {
          const room = getOrCreateRoom(currentInstanceId);
          const { seatId, user } = payload;

          if (user && seatId) {
            // Free any previous seat for this user
            for (const [sId, sUser] of Object.entries(room.seats)) {
              if (sUser.id === user.id) {
                delete room.seats[sId];
              }
            }

            // Assign new seat
            room.seats[seatId] = {
              ...user,
              seatId
            };

            broadcastToRoom(room, {
              type: 'STATE_UPDATE',
              payload: { seats: room.seats }
            });
          }
        }

        if (type === 'LEAVE_SEAT') {
          const room = getOrCreateRoom(currentInstanceId);
          const { seatId, userId } = payload;

          let changed = false;
          if (seatId && room.seats[seatId]) {
            delete room.seats[seatId];
            changed = true;
          } else if (userId) {
            for (const [sId, sUser] of Object.entries(room.seats)) {
              if (sUser.id === userId) {
                delete room.seats[sId];
                changed = true;
              }
            }
          }

          if (changed) {
            broadcastToRoom(room, {
              type: 'STATE_UPDATE',
              payload: { seats: room.seats }
            });
          }
        }

        if (type === 'UPDATE_STAFF') {
          const room = getOrCreateRoom(currentInstanceId);
          if (payload?.staffList) {
            room.staffList = payload.staffList;
            broadcastToRoom(room, {
              type: 'STAFF_UPDATE',
              payload: { staffList: room.staffList }
            });
          }
        }
      } catch (err) {
        console.error('[SyncServer] Error processing message:', err);
      }
    });

    ws.on('close', () => {
      if (currentInstanceId && rooms.has(currentInstanceId)) {
        const room = rooms.get(currentInstanceId);
        room.clients.delete(ws);

        if (currentUser) {
          // Free their seat on disconnect
          let changed = false;
          for (const [sId, sUser] of Object.entries(room.seats)) {
            if (sUser.id === currentUser.id) {
              delete room.seats[sId];
              changed = true;
            }
          }

          if (changed) {
            broadcastToRoom(room, {
              type: 'STATE_UPDATE',
              payload: { seats: room.seats }
            });
          }

          broadcastToRoom(room, {
            type: 'PLAYER_LEFT',
            payload: { user: currentUser }
          });
        }

        if (room.clients.size === 0) {
          // Clean up empty rooms after 5 minutes
          setTimeout(() => {
            if (room.clients.size === 0) {
              rooms.delete(currentInstanceId);
            }
          }, 300000);
        }
      }
    });
  });

  console.log('[SyncServer] Real-time multiplayer synchronization WebSocket active on /sync-ws');
}
