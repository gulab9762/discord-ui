import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LoungeRoom from './components/LoungeRoom';
import SetupGuideModal from './components/SetupGuideModal';
import { INITIAL_MEMBERS, INITIAL_STAFF } from './data/mockData';
import { discordService, formatDiscordUser, getStoredDiscordUser, saveStoredDiscordUser } from './services/discordSdk';
import { syncService } from './services/syncService';
import { THEME_LIST, getTheme, DEFAULT_THEME_ID } from './themes';
import './App.css';

export default function App() {
  // Active Theme Selection
  const [themeId, setThemeId] = useState(() => {
    try {
      return localStorage.getItem('discord_active_theme') || DEFAULT_THEME_ID;
    } catch {
      return DEFAULT_THEME_ID;
    }
  });

  const theme = getTheme(themeId);
  const seats = theme.layout.seats;

  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Active current user (retrieved dynamically from Discord)
  const [currentUser, setCurrentUser] = useState(getStoredDiscordUser());
  const [enteringGuest, setEnteringGuest] = useState(null);
  const [leavingGuest, setLeavingGuest] = useState(null);
  const [notification, setNotification] = useState(`Welcome to the ${theme.name}! 🌴`);

  const voiceSpeakingRef = useRef(new Set());

  // Apply theme CSS custom properties to document root dynamically
  useEffect(() => {
    const root = document.documentElement;
    if (theme.themeVars) {
      Object.entries(theme.themeVars).forEach(([prop, val]) => {
        root.style.setProperty(prop, val);
      });
    }
  }, [theme]);

  // Cycle to next available theme
  const handleSwitchTheme = () => {
    const currentIndex = THEME_LIST.findIndex((t) => t.id === themeId);
    const nextIndex = (currentIndex + 1) % THEME_LIST.length;
    const nextTheme = THEME_LIST[nextIndex];
    setThemeId(nextTheme.id);
    try {
      localStorage.setItem('discord_active_theme', nextTheme.id);
    } catch {
      // ignore
    }
    showNotification(`Switched theme to ${nextTheme.name} ${nextTheme.icon}! ✨`);
  };

  // 1. Initialize Discord SDK & Multiplayer Sync
  useEffect(() => {
    discordService.init().then((res) => {
      setIsEmbedded(res.isEmbedded);

      const activeUser = res.currentUser || currentUser;
      if (activeUser) {
        applyDiscordUser(activeUser);
      }

      // Connect to real-time sync server using Discord's instanceId
      syncService.connect(res.instanceId || 'cabin-lounge', activeUser);
    });

    // Subscribe to Discord live events (voice speaking, participants update)
    const unsubscribeDiscord = discordService.subscribe((state) => {
      setIsEmbedded(state.isEmbedded);
      voiceSpeakingRef.current = state.voiceSpeaking || new Set();

      if (state.currentUser) {
        applyDiscordUser(state.currentUser);
        syncService.connect(state.instanceId || 'cabin-lounge', state.currentUser);
      }

      // If Discord reports participants, sync their live voice speaking state & avatars
      if (state.participants && state.participants.length > 0) {
        const discordUsers = state.participants.map((p, idx) => formatDiscordUser(p, idx));

        // Update speaking status across all seated members
        setMembers((prev) =>
          prev.map((m) => {
            const isSpeaking = voiceSpeakingRef.current.has(m.id);
            const foundDiscord = discordUsers.find((d) => d.id === m.id);
            if (foundDiscord) {
              return {
                ...m,
                name: foundDiscord.name,
                avatar: foundDiscord.avatar,
                isSpeaking
              };
            }
            return { ...m, isSpeaking };
          })
        );

        // Update chef speaking status
        setStaffList((prev) =>
          prev.map((s) => ({
            ...s,
            isSpeaking: voiceSpeakingRef.current.has(s.id)
          }))
        );
      }
    });

    // 2. Subscribe to Real-Time Multiplayer Sync Server
    const unsubscribeSync = syncService.subscribe((msg) => {
      const { type, payload } = msg;

      if (type === 'INIT_STATE') {
        if (payload?.seats) {
          const seatedList = Object.values(payload.seats).map((u) => ({
            ...u,
            isSpeaking: voiceSpeakingRef.current.has(u.id)
          }));
          setMembers(seatedList);
        }
        if (payload?.staffList && payload.staffList.length > 0) {
          setStaffList(payload.staffList);
        }
      }

      if (type === 'STATE_UPDATE') {
        if (payload?.seats) {
          const seatedList = Object.values(payload.seats).map((u) => ({
            ...u,
            isSpeaking: voiceSpeakingRef.current.has(u.id)
          }));
          setMembers(seatedList);
        }
      }

      if (type === 'STAFF_UPDATE') {
        if (payload?.staffList) {
          setStaffList(payload.staffList);
        }
      }

      if (type === 'PLAYER_JOINED') {
        const player = payload?.user;
        if (player && player.id !== currentUser?.id) {
          showNotification(`🚪 Door opened! ${player.name} entered the lounge! ✨`);
        }
      }

      if (type === 'PLAYER_LEFT') {
        const player = payload?.user;
        if (player && player.id !== currentUser?.id) {
          showNotification(`${player.name} left through the door. 👋`);
        }
      }
    });

    return () => {
      unsubscribeDiscord();
      unsubscribeSync();
    };
  }, []);

  const applyDiscordUser = (rawUser) => {
    const formatted = formatDiscordUser(rawUser, 0);
    setCurrentUser(formatted);
    saveStoredDiscordUser(formatted);

    // Update chef station with real user profile
    setStaffList((prev) =>
      prev.map((s, idx) => {
        if (idx === 0) {
          return {
            ...s,
            id: formatted.id,
            name: formatted.name,
            avatar: formatted.avatar,
            role: 'You (Chef)',
            roleColor: '#faa61a'
          };
        }
        return s;
      })
    );
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Seating interactions (synchronized across all joined players)
  const handleSeatClick = (seat) => {
    const vacantSeatId = seat.id;
    const seatedOccupant = members.find((m) => m.seatId === vacantSeatId);

    if (!seatedOccupant) {
      const userToSeat = currentUser || {
        id: `local-${Date.now()}`,
        name: 'Guest Traveler',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        role: 'You',
        roleColor: '#faa61a'
      };

      const seatedMember = {
        ...userToSeat,
        seatId: vacantSeatId,
        targetSeatId: vacantSeatId,
        role: userToSeat.id === currentUser?.id ? 'You' : 'Member',
        roleColor: '#faa61a',
        status: 'online',
        isSpeaking: voiceSpeakingRef.current.has(userToSeat.id)
      };

      // Trigger entrance animation from door to table
      setEnteringGuest(seatedMember);
      showNotification(`${userToSeat.name} is walking to ${seat.name}... 🪑`);

      // Broadcast seat claim to all players
      syncService.claimSeat(vacantSeatId, seatedMember);
    }
  };

  // When a member is clicked to stand up and walk out the door
  const handleMemberClick = (member) => {
    if (leavingGuest || enteringGuest) return;

    // Remove from local and broadcast
    syncService.leaveSeat(member.seatId, member.id);

    showNotification(`${member.name} stood up from the table and is walking to the door... 👋`);
    setLeavingGuest({
      ...member,
      fromSeatId: member.seatId
    });
  };

  const handleGuestDeparted = (departedGuest) => {
    setLeavingGuest(null);
    showNotification(`${departedGuest.name} exited through the door. 🚪✨`);
  };

  const handleGuestArrived = (guest) => {
    setEnteringGuest(null);
    showNotification(`${guest.name} took a seat at ${seats.find((s) => s.id === guest.seatId)?.name || 'the table'}! 🪑✨`);
  };

  // When a new test guest enters through the door
  const handleAddMember = () => {
    if (enteringGuest || leavingGuest) return;

    const vacantSeats = seats.filter((s) => !members.some((m) => m.seatId === s.id));
    if (vacantSeats.length === 0) {
      showNotification('All seats around the tables are taken!');
      return;
    }

    const nextSeat = vacantSeats[0];
    const names = ['Cosmo', 'Neko', 'StarGazer', 'PixelPanda', 'CyberBoba', 'LofiGhost', 'Mochi', 'BobaCat'];
    const moods = ['relaxing in the ambiance 🌿', 'sipping a warm brew ☕', 'resting on cushions ✨', 'listening to music 🎧'];
    const roles = ['VIP', 'Booster', 'Member'];
    const colors = ['#f47fff', '#f47b67', '#3ba55d'];

    const chosenName = names[Math.floor(Math.random() * names.length)];
    const chosenRoleIdx = Math.floor(Math.random() * roles.length);
    const defaultAvatarIdx = Math.floor(Math.random() * 6);

    const newMember = {
      id: `guest-${Date.now()}`,
      name: chosenName,
      avatar: `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIdx}.png`,
      role: roles[chosenRoleIdx],
      roleColor: colors[chosenRoleIdx],
      status: 'online',
      isSpeaking: false,
      seatId: nextSeat.id,
      targetSeatId: nextSeat.id,
      mood: moods[Math.floor(Math.random() * moods.length)]
    };

    setEnteringGuest(newMember);
    showNotification(`🚪 Door opened! ${newMember.name} entered and is walking to ${nextSeat.name}...`);
    syncService.claimSeat(nextSeat.id, newMember);
  };

  // Staff cooking interactions (synchronized across players)
  const handleToggleStaffActive = (staffId) => {
    const updated = staffList.map((s) => {
      if (s.id === staffId) {
        const nextActive = !s.isActive;
        showNotification(
          nextActive
            ? `${s.name} stepped up to the stove to cook ${s.cookingDish}! 🍳`
            : `${s.name} sat down at the counter for a break ☕`
        );
        return { ...s, isActive: nextActive };
      }
      return s;
    });

    setStaffList(updated);
    syncService.updateStaff(updated);
  };

  const handleGlobalToggleCooking = () => {
    const anyActive = staffList.some((s) => s.isActive);
    const nextActive = !anyActive;
    showNotification(
      nextActive
        ? 'Chef started cooking at the stove! 🥘🔥'
        : 'Chef paused cooking and sat down for coffee ☕'
    );

    const updated = staffList.map((s) => ({ ...s, isActive: nextActive }));
    setStaffList(updated);
    syncService.updateStaff(updated);
  };

  const handleChangeDish = (staffId) => {
    const dishes = theme.dishes;
    const updated = staffList.map((s) => {
      if (s.id === staffId) {
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        showNotification(`${s.name} is now cooking ${randomDish.name} ${randomDish.icon}!`);
        return { ...s, cookingDish: randomDish.name, dishIcon: randomDish.icon };
      }
      return s;
    });

    setStaffList(updated);
    syncService.updateStaff(updated);
  };

  const handleToggleSpeaking = () => {
    const myId = currentUser?.id;
    if (myId) {
      if (voiceSpeakingRef.current.has(myId)) {
        voiceSpeakingRef.current.delete(myId);
      } else {
        voiceSpeakingRef.current.add(myId);
      }
    }

    setMembers((prev) =>
      prev.map((m) => ({ ...m, isSpeaking: voiceSpeakingRef.current.has(m.id) }))
    );
    setStaffList((prev) =>
      prev.map((s) => ({ ...s, isSpeaking: voiceSpeakingRef.current.has(s.id) }))
    );
    showNotification('Voice speaking status toggled! 🎙️');
  };

  return (
    <div className="app-container">
      {/* Ambient floating dust/sparkle particles in background */}
      <div className="ambient-particles">
        <span className="particle part-1">✨</span>
        <span className="particle part-2">✦</span>
        <span className="particle part-3">✨</span>
        <span className="particle part-4">✦</span>
        <span className="particle part-5">✨</span>
      </div>

      {/* Top Navigation & Controls */}
      <Header
        theme={theme}
        onSwitchTheme={handleSwitchTheme}
        membersCount={members.filter((m) => m.seatId).length}
        staffCount={staffList.length}
        onAddMember={handleAddMember}
        onToggleCooking={handleGlobalToggleCooking}
        onToggleSpeaking={handleToggleSpeaking}
        onOpenGuide={() => setIsGuideOpen(true)}
        isEmbedded={isEmbedded}
        currentUserName={currentUser?.name}
      />

      {/* Live notification toaster */}
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
      )}

      {/* Dynamic 2.5D Lounge Canvas mapped to active theme */}
      <main className="server-stage-unified">
        <LoungeRoom
          theme={theme}
          members={members}
          onSeatClick={handleSeatClick}
          onMemberClick={handleMemberClick}
          enteringGuest={enteringGuest}
          onGuestArrived={handleGuestArrived}
          leavingGuest={leavingGuest}
          onGuestDeparted={handleGuestDeparted}
          staffList={staffList}
          onToggleStaffActive={handleToggleStaffActive}
          onChangeDish={handleChangeDish}
        />
      </main>

      {/* Discord Integration Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
