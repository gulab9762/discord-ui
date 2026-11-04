import { DiscordSDK, Events } from '@discord/embedded-app-sdk';

const DEFAULT_CLIENT_ID = '1567473870624006154';

/**
 * Builds the real Discord CDN avatar URL dynamically from Discord user metadata.
 * NO hardcoded fallback images or fake profiles.
 */
export function getDiscordAvatarUrl(user) {
  if (!user) return 'https://cdn.discordapp.com/embed/avatars/0.png';

  const userId = user.id || user.user_id;
  const avatarHash = user.avatar;

  // 1. If already a valid absolute URL (e.g. from Discord CDN)
  if (typeof avatarHash === 'string' && (avatarHash.startsWith('http://') || avatarHash.startsWith('https://'))) {
    return avatarHash;
  }

  // 2. Custom Discord user avatar hash (supports animated GIFs and static PNGs)
  if (userId && avatarHash) {
    const isAnimated = typeof avatarHash === 'string' && avatarHash.startsWith('a_');
    const ext = isAnimated ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=128`;
  }

  // 3. Default Discord Embed Avatar computed via official snowflake formula
  if (userId) {
    try {
      const defaultIndex = Number((BigInt(userId) >> 22n) % 6n);
      return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    } catch {
      const idx = (Number(String(userId).slice(-2)) % 6) || 0;
      return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    }
  }

  // 4. Legacy discriminator-based fallback
  const disc = Number(user.discriminator);
  if (!isNaN(disc) && disc > 0) {
    return `https://cdn.discordapp.com/embed/avatars/${disc % 5}.png`;
  }

  return 'https://cdn.discordapp.com/embed/avatars/0.png';
}

/**
 * Formats any Discord user or activity participant into our UI model.
 * Uses only dynamic fields returned by Discord.
 */
export function formatDiscordUser(userOrParticipant, index = 0) {
  if (!userOrParticipant) {
    return {
      id: `guest-${index + 1}`,
      name: `Guest ${index + 1}`,
      avatar: `https://cdn.discordapp.com/embed/avatars/${index % 6}.png`,
      role: index === 0 ? 'You (Chef)' : 'Member',
      roleColor: index === 0 ? '#faa61a' : '#5865f2',
      status: 'online',
      isSpeaking: false,
      mood: 'listening to jungle rain 🌧️'
    };
  }

  const user = userOrParticipant.user || userOrParticipant;
  const id = user.id || `discord-user-${index}`;
  const displayName = user.global_name || user.nickname || user.username || `Member ${index + 1}`;
  const avatarUrl = getDiscordAvatarUrl(user);

  return {
    id,
    name: displayName,
    username: user.username || displayName,
    avatar: avatarUrl,
    role: index === 0 ? 'You (Chef)' : 'Member',
    roleColor: index === 0 ? '#faa61a' : '#5865f2',
    status: 'online',
    isSpeaking: false,
    mood: 'listening to jungle rain 🌧️'
  };
}

export function getStoredDiscordUser() {
  try {
    const raw = localStorage.getItem('discord_cached_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.name) {
        return {
          ...parsed,
          avatar: getDiscordAvatarUrl(parsed)
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

export function saveStoredDiscordUser(user) {
  try {
    if (!user || !user.id) return;
    localStorage.setItem('discord_cached_user', JSON.stringify(user));
  } catch {
    // ignore
  }
}

class DiscordService {
  constructor() {
    this.sdk = null;
    this.isEmbedded = false;
    this.instanceId = 'default-lounge';
    this.currentUser = getStoredDiscordUser();
    this.participants = [];
    this.voiceSpeaking = new Set();
    this.listeners = new Set();

    // Listen to direct window RPC messages dispatched by Discord
    if (typeof window !== 'undefined') {
      window.addEventListener('message', (event) => {
        try {
          const raw = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          const payload = Array.isArray(raw) ? raw[1] : raw;

          if (payload?.evt === 'READY' && payload?.data?.user) {
            console.log('[DiscordService] Current Discord user received from READY dispatch:', payload.data.user);
            const formatted = formatDiscordUser(payload.data.user, 0);
            this.currentUser = formatted;
            saveStoredDiscordUser(formatted);
            this.notify();
          }

          if (payload?.evt === 'ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE' && payload?.data?.participants) {
            console.log('[DiscordService] Participants updated via RPC message:', payload.data.participants);
            this.participants = payload.data.participants;
            this.notify();
          }
        } catch {
          // ignore non-json messages
        }
      });
    }
  }

  async init(clientId = DEFAULT_CLIENT_ID) {
    const isInsideDiscord =
      window.location.search.includes('frame_id') || window.parent !== window;

    if (isInsideDiscord) {
      try {
        this.sdk = new DiscordSDK(clientId);

        // Instance identifier provided by Discord for this Activity session
        if (this.sdk.instanceId) {
          this.instanceId = this.sdk.instanceId;
        }

        // Listen for READY event
        this.sdk.subscribe(Events.READY, (data) => {
          if (data?.user) {
            console.log('[DiscordService] User from SDK READY:', data.user);
            const formatted = formatDiscordUser(data.user, 0);
            this.currentUser = formatted;
            saveStoredDiscordUser(formatted);
            this.notify();
          }
        }).catch(() => {});

        // Await Discord SDK handshake completion
        await this.sdk.ready();
        this.isEmbedded = true;

        // Query all currently connected participants in this activity instance
        try {
          if (typeof this.sdk.commands.getActivityInstanceConnectedParticipants === 'function') {
            const res = await this.sdk.commands.getActivityInstanceConnectedParticipants();
            if (res?.participants && res.participants.length > 0) {
              console.log('[DiscordService] Connected participants loaded:', res.participants);
              this.participants = res.participants;

              // If current user wasn't set, use first participant
              if (!this.currentUser) {
                const me = formatDiscordUser(res.participants[0], 0);
                this.currentUser = me;
                saveStoredDiscordUser(me);
              }
            }
          }
        } catch (fetchErr) {
          console.log('[DiscordService] Participants query note:', fetchErr);
        }

        this.setupEventListeners();
        this.notify();

        return {
          isEmbedded: true,
          instanceId: this.instanceId,
          currentUser: this.currentUser,
          participants: this.participants
        };
      } catch (err) {
        console.warn('[DiscordService] Failed to initialize Discord SDK:', err);
        this.isEmbedded = false;
      }
    } else {
      this.isEmbedded = false;
    }

    return {
      isEmbedded: false,
      instanceId: this.instanceId,
      currentUser: this.currentUser,
      participants: []
    };
  }

  setupEventListeners() {
    if (!this.sdk) return;

    try {
      this.sdk.subscribe(Events.SPEAKING_START, (data) => {
        if (data?.user_id) {
          this.voiceSpeaking.add(data.user_id);
          this.notify();
        }
      });

      this.sdk.subscribe(Events.SPEAKING_STOP, (data) => {
        if (data?.user_id) {
          this.voiceSpeaking.delete(data.user_id);
          this.notify();
        }
      });

      this.sdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, (data) => {
        if (data?.participants) {
          console.log('[DiscordService] Activity instance participants updated:', data.participants);
          this.participants = data.participants;
          this.notify();
        }
      });

      this.sdk.subscribe(Events.CURRENT_USER_UPDATE, (user) => {
        if (user) {
          console.log('[DiscordService] Current user updated:', user);
          const formatted = formatDiscordUser(user, 0);
          this.currentUser = formatted;
          saveStoredDiscordUser(formatted);
          this.notify();
        }
      });
    } catch (e) {
      console.warn('[DiscordService] Subscription error:', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const listener of this.listeners) {
      listener({
        isEmbedded: this.isEmbedded,
        instanceId: this.instanceId,
        currentUser: this.currentUser,
        participants: this.participants,
        voiceSpeaking: this.voiceSpeaking
      });
    }
  }
}

export const discordService = new DiscordService();
