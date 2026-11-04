import React, { useState } from 'react';
import { Volume2, VolumeX, UserPlus, Flame, Mic, HelpCircle, Trees, CloudRain } from 'lucide-react';
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

  const userTooltip = currentUserName
    ? `Logged in: ${currentUserName} • Misty Rainforest Retreat`
    : isEmbedded
    ? 'Connected via Discord Activity'
    : 'Preview Mode • Rainforest Retreat';

  return (
    <header className="header-bar jungle-header-bar">
      {/* Brand & User Icon */}
      <div className="header-left">
        <div 
          className="logo-icon-wrap jungle-logo-wrap"
          data-tooltip="The Jungle Cabin Lounge"
          data-tooltip-align="left"
        >
          <Trees className="logo-icon" size={20} />
        </div>

        {/* User indicator icon */}
        <div 
          className="user-indicator-badge"
          data-tooltip={userTooltip}
          data-tooltip-align="left"
        >
          <span className="dot user-online-dot"></span>
        </div>
      </div>

      {/* Stats Icons */}
      <div className="header-stats">
        <div 
          className="stat-icon-pill lounge-stat"
          data-tooltip={`Lounge: ${membersCount} seated`}
        >
          <span className="dot lounge-dot"></span>
          <span className="stat-count">{membersCount}</span>
        </div>

        <div 
          className="stat-icon-pill kitchen-stat"
          data-tooltip={`Kitchen: ${staffCount} staff active`}
        >
          <span className="dot kitchen-dot"></span>
          <span className="stat-count">{staffCount}</span>
        </div>

        <div 
          className="stat-icon-pill weather-stat"
          data-tooltip="24°C Rainforest Canopy • Gentle Rain 🌧️"
        >
          <CloudRain size={16} className="weather-icon" />
        </div>
      </div>

      {/* Action Buttons (Icons Only) */}
      <div className="header-actions">
        <button 
          className={`icon-btn sound-btn ${soundEnabled ? 'active' : ''}`}
          onClick={handleSoundToggle}
          data-tooltip={soundEnabled ? 'Mute Rainforest Audio' : 'Play Rainforest Audio'}
          data-tooltip-align="right"
          aria-label="Toggle Audio"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button 
          className="icon-btn guest-btn"
          onClick={onAddMember}
          data-tooltip="Add Guest (Walk In via Door)"
          data-tooltip-align="right"
          aria-label="Add Guest"
        >
          <UserPlus size={18} />
        </button>

        <button 
          className="icon-btn cook-btn"
          onClick={onToggleCooking}
          data-tooltip="Toggle Chef Cooking at Stove"
          data-tooltip-align="right"
          aria-label="Toggle Cooking"
        >
          <Flame size={18} />
        </button>

        <button 
          className="icon-btn mic-btn"
          onClick={onToggleSpeaking}
          data-tooltip="Simulate Voice Speaking Ring"
          data-tooltip-align="right"
          aria-label="Simulate Voice"
        >
          <Mic size={18} />
        </button>

        <button 
          className="icon-btn help-btn"
          onClick={onOpenGuide}
          data-tooltip="Discord Activity Setup Guide"
          data-tooltip-align="right"
          aria-label="Setup Guide"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
