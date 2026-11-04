// Client-side real-time synchronization service for connected Discord Activity players
class SyncService {
  constructor() {
    this.ws = null;
    this.instanceId = 'default-lounge';
    this.currentUser = null;
    this.layoutSeats = null;
    this.themeId = null;
    this.listeners = new Set();
    this.reconnectTimer = null;
    this.isConnected = false;
  }

  connect(instanceId, user, layoutSeats = null, themeId = null) {
    if (instanceId) this.instanceId = instanceId;
    if (user) this.currentUser = user;
    if (layoutSeats) this.layoutSeats = layoutSeats;
    if (themeId) this.themeId = themeId;

    if (typeof window === 'undefined') return;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (this.currentUser) {
        this.send({
          type: 'JOIN',
          instanceId: this.instanceId,
          payload: {
            user: this.currentUser,
            layoutSeats: this.layoutSeats,
            themeId: this.themeId
          }
        });
      }
      return;
    }

    try {
      const isHttps = window.location.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/sync-ws`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[SyncClient] Connected to multiplayer sync server');

        if (this.currentUser) {
          this.send({
            type: 'JOIN',
            instanceId: this.instanceId,
            payload: {
              user: this.currentUser,
              layoutSeats: this.layoutSeats,
              themeId: this.themeId
            }
          });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.notify(msg);
        } catch (e) {
          console.warn('[SyncClient] Error parsing message:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        // Reconnect after 2 seconds
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          this.connect(this.instanceId, this.currentUser, this.layoutSeats, this.themeId);
        }, 2000);
      };

      this.ws.onerror = (err) => {
        console.log('[SyncClient] WS connection note:', err);
      };
    } catch (err) {
      console.warn('[SyncClient] WebSocket setup error:', err);
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  claimSeat(seatId, user) {
    this.send({
      type: 'CLAIM_SEAT',
      instanceId: this.instanceId,
      payload: { seatId, user }
    });
  }

  moveSeat(fromSeatId, targetSeatId, user) {
    this.send({
      type: 'MOVE_SEAT',
      instanceId: this.instanceId,
      payload: { fromSeatId, targetSeatId, user }
    });
  }

  leaveSeat(seatId, userId) {
    this.send({
      type: 'LEAVE_SEAT',
      instanceId: this.instanceId,
      payload: { seatId, userId }
    });
  }

  updateStaff(staffList) {
    this.send({
      type: 'UPDATE_STAFF',
      instanceId: this.instanceId,
      payload: { staffList }
    });
  }

  updateSeatLayout(layoutSeats) {
    this.layoutSeats = layoutSeats;
    this.send({
      type: 'UPDATE_SEAT_LAYOUT',
      instanceId: this.instanceId,
      payload: { layoutSeats }
    });
  }

  updateTheme(themeId, layoutSeats = null) {
    this.themeId = themeId;
    if (layoutSeats) this.layoutSeats = layoutSeats;
    this.send({
      type: 'UPDATE_THEME',
      instanceId: this.instanceId,
      payload: { themeId, layoutSeats }
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(msg) {
    for (const listener of this.listeners) {
      try {
        listener(msg);
      } catch (err) {
        console.error('[SyncClient] Listener error:', err);
      }
    }
  }
}

export const syncService = new SyncService();
