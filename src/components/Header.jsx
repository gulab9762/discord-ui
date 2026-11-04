import React, { useState } from 'react';
import { Volume2, VolumeX, UserPlus, Flame, Mic, HelpCircle, Trees } from 'lucide-react';
import { ambientAudio } from '../services/ambientAudio';

export default function Header({
  membersCount,
  staffCount,
  onAddMember,
  onToggleCooking,
  onToggleSpeaking,
  onOpenGuide,
  isEmbedded,
  currentUserName
}) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleSoundToggle = () => {
    const active = ambientAudio.toggle();
    setSoundEnabled(active);
  };

  return (
    <header className="header-bar jungle-header-bar">
      <div className="header-left">
        <div className="logo-group">
          <div className="logo-icon-wrap jungle-logo-wrap">
            <Trees className="logo-icon" size={22} />
          </div>
          <div>
            <h1 className="header-title">🌿 The Jungle Cabin Lounge</h1>
            <p className="header-subtitle">
              {currentUserName ? (
                <span>🟢 Logged in as: <strong style={{ color: '#fff' }}>{currentUserName}</strong> • Misty Rainforest Retreat</span>
              ) : isEmbedded ? (
                '🟢 Connected via Discord Activity • Rainforest Retreat'
              ) : (
                '🟡 Sandbox Preview Mode • Rainforest Retreat'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="header-stats">
        <div className="stat-pill lounge-pill">
          <span className="dot lounge-dot"></span>
          <span>Lounge: <strong>{membersCount} seated</strong></span>
        </div>
        <div className="stat-pill kitchen-pill">
          <span className="dot kitchen-dot"></span>
          <span>Kitchen: <strong>{staffCount} staff</strong></span>
        </div>
      </div>

      <div className="header-actions">
        <button 
          className={`btn-control sound-btn ${soundEnabled ? 'active' : ''}`}
          onClick={handleSoundToggle}
          title={soundEnabled ? 'Mute jungle rain sound' : 'Play jungle cafe sound'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundEnabled ? 'Rain Sound On' : 'Jungle Audio'}</span>
        </button>

        <button 
          className="btn-control action-btn jungle-guest-btn"
          onClick={onAddMember}
          title="Add a visitor to walk in through the door"
        >
          <UserPlus size={16} />
          <span>Add Guest (Walk In)</span>
        </button>

        <button 
          className="btn-control action-btn cook-toggle-btn"
          onClick={onToggleCooking}
          title="Toggle Chef cooking mode"
        >
          <Flame size={16} />
          <span>Toggle Cooking :D</span>
        </button>

        <button 
          className="btn-control action-btn"
          onClick={onToggleSpeaking}
          title="Simulate Voice Speaking Ring"
        >
          <Mic size={16} />
          <span>Simulate Voice</span>
        </button>

        <button 
          className="btn-control help-btn"
          onClick={onOpenGuide}
          title="Discord Setup Guide"
        >
          <HelpCircle size={16} />
          <span>Setup</span>
        </button>
      </div>
    </header>
  );
}
