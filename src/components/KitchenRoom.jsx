import React from 'react';
import { ChefHat, Flame, Coffee, ShieldCheck } from 'lucide-react';
import Avatar from './Avatar';
import { COOKING_DISHES } from '../data/mockData';

export default function KitchenRoom({ staffList, onToggleStaffActive, onChangeDish }) {
  const activeStaff = staffList.find((s) => s.isActive) || staffList[0];
  const isCooking = activeStaff?.isActive;

  return (
    <div className="room kitchen-room compact-outpost-kitchen">
      {/* Compact Kitchen Banner */}
      <div className="room-banner kitchen-banner compact-kitchen-banner">
        <div className="room-title-wrap">
          <span className="room-emoji">🍳</span>
          <div>
            <h3>Outpost Kitchen</h3>
            <span className="room-desc">Cabin Chef Station</span>
          </div>
        </div>
        <div className="admin-badge-indicator compact-badge">
          <span>Staff</span>
        </div>
      </div>

      <div className="compact-kitchen-body">
        {/* Active Cooking Station (Wok & Chef) */}
        <div className="compact-stove-station">
          <div className="stove-header-bar">
            <span className="stove-tag"><Flame size={12} className="text-orange" /> RANGE</span>
            <span className="pan-dish-icon">{activeStaff?.dishIcon || '🥘'}</span>
          </div>

          {/* Sizzling Stove Appliance */}
          <div className="compact-burner-wrap">
            <div className="burner glowing">
              <div className="burner-fire">
                <span className="fire-flicker">🔥</span>
                <span className="fire-flicker delay">🔥</span>
              </div>

              <div className="frying-pan sizzling">
                <div className="pan-handle"></div>
                <div className="pan-bowl">
                  <div className="sizzling-food flipping">
                    {activeStaff?.dishIcon || '🥘'}
                  </div>
                  <div className="steam-cloud">
                    <span className="steam-puff s1">♨️</span>
                    <span className="steam-puff s2">✨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chef Profile Card */}
          <div className="compact-chef-profile">
            {isCooking && (
              <div className="chef-hat-floater">
                <ChefHat size={26} className="chef-hat-icon" />
              </div>
            )}

            {/* Dish Bubble */}
            <div
              className="compact-cooking-bubble"
              onClick={() => onChangeDish(activeStaff.id)}
              title="Click to cycle meal"
            >
              <span>{activeStaff.cookingDish}</span>
            </div>

            <div className="chef-avatar-wrapper compact-avatar-wrap">
              {activeStaff.isSpeaking && (
                <div className="speaking-wave-ring staff-ring"></div>
              )}
              <Avatar src={activeStaff.avatar} name={activeStaff.name} size={50} />

              {isCooking && (
                <div className="chef-spatula-hand">
                  <span className="spatula-emoji">🥄</span>
                </div>
              )}

              <span className="cooking-sizzle-badge">
                {isCooking ? 'Cooking :D' : 'On Break'}
              </span>
            </div>

            <div className="staff-info compact-staff-info">
              <span className="staff-name">{activeStaff.name}</span>
              <span className="staff-role-tag" style={{ color: activeStaff.roleColor }}>
                {activeStaff.role}
              </span>
            </div>

            <button
              className={`toggle-duty-btn compact-toggle-btn ${isCooking ? 'break-btn' : 'cook-btn'}`}
              onClick={() => onToggleStaffActive(activeStaff.id)}
            >
              {isCooking ? 'Take Coffee Break ☕' : 'Start Cooking! 🍳'}
            </button>
          </div>
        </div>

        {/* Coffee Bar Station below */}
        <div className="compact-coffee-station">
          <div className="coffee-bar-header">
            <Coffee size={14} className="text-amber" />
            <span>Cabin Espresso Bar</span>
          </div>

          <div className="compact-bar-body">
            <span className="coffee-pot">☕~</span>
            <span className="bar-subtext">Fresh mountain brew ready for guests</span>
          </div>
        </div>
      </div>
    </div>
  );
}
