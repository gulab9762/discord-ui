import React, { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';
import { ChefHat } from 'lucide-react';
import { DoorSprite } from './sprites/FurnitureSprites';

export default function LoungeRoom({
  seats,
  members,
  onSeatClick,
  onMemberClick,
  enteringGuest,
  onGuestArrived,
  leavingGuest,
  onGuestDeparted,
  staffList,
  onToggleStaffActive,
  onChangeDish
}) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [enteringPos, setEnteringPos] = useState(null);
  const [isEnteringWalking, setIsEnteringWalking] = useState(false);

  const [leavingPos, setLeavingPos] = useState(null);
  const [isLeavingWalking, setIsLeavingWalking] = useState(false);

  const roomRef = useRef(null);
  const doorRef = useRef(null);

  const activeStaff = staffList?.find((s) => s.isActive) || staffList?.[0];
  const isCooking = activeStaff?.isActive;

  // 1. ENTERING ANIMATION: Door (6%, 36%) ➜ Seat (x%, y%)
  useEffect(() => {
    if (!enteringGuest || !roomRef.current) return;

    const targetSeat = seats.find((s) => s.id === enteringGuest.targetSeatId);
    if (!targetSeat) {
      if (onGuestArrived) onGuestArrived(enteringGuest);
      return;
    }

    const roomRect = roomRef.current.getBoundingClientRect();
    const startX = (roomRect.width * 0.07);
    const startY = (roomRect.height * 0.38);

    const targetX = (roomRect.width * (targetSeat.x / 100)) - 24;
    const targetY = (roomRect.height * (targetSeat.y / 100)) - 24;

    setDoorOpen(true);
    setEnteringPos({ x: startX, y: startY });
    setIsEnteringWalking(false);

    const walkTimer = setTimeout(() => {
      setIsEnteringWalking(true);
      setEnteringPos({ x: targetX, y: targetY });
    }, 200);

    const arriveTimer = setTimeout(() => {
      setDoorOpen(false);
      setIsEnteringWalking(false);
      setEnteringPos(null);
      if (onGuestArrived) {
        onGuestArrived(enteringGuest);
      }
    }, 1500);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(arriveTimer);
    };
  }, [enteringGuest]);

  // 2. LEAVING ANIMATION: Seat (x%, y%) ➜ Door (6%, 36%) ➜ Exit
  useEffect(() => {
    if (!leavingGuest || !roomRef.current) return;

    const fromSeat = seats.find((s) => s.id === leavingGuest.fromSeatId);
    const roomRect = roomRef.current.getBoundingClientRect();

    const startX = fromSeat
      ? (roomRect.width * (fromSeat.x / 100)) - 24
      : (roomRect.width * 0.4);
    const startY = fromSeat
      ? (roomRect.height * (fromSeat.y / 100)) - 24
      : (roomRect.height * 0.6);

    const targetX = (roomRect.width * 0.07);
    const targetY = (roomRect.height * 0.38);

    setLeavingPos({ x: startX, y: startY });
    setIsLeavingWalking(false);

    const walkTimer = setTimeout(() => {
      setIsLeavingWalking(true);
      setLeavingPos({ x: targetX, y: targetY });
    }, 150);

    const doorOpenTimer = setTimeout(() => {
      setDoorOpen(true);
    }, 600);

    const exitTimer = setTimeout(() => {
      setDoorOpen(false);
      setIsLeavingWalking(false);
      setLeavingPos(null);
      if (onGuestDeparted) {
        onGuestDeparted(leavingGuest);
      }
    }, 1500);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(doorOpenTimer);
      clearTimeout(exitTimer);
    };
  }, [leavingGuest]);

  return (
    <div className="room jungle-cabin-full-room">
      {/* The Single Panoramic Jungle Cabin Scene (Full Height, No Cluttering Sub-Banner) */}
      <div ref={roomRef} className="jungle-unified-canvas">
        {/* 1. ENTRANCE DOOR (Top-Left Hotspot) */}
        <div
          ref={doorRef}
          className="door-hotspot"
          style={{ left: '6%', top: '24%' }}
          onClick={() => setDoorOpen(!doorOpen)}
          data-tooltip={doorOpen ? 'Entrance Door (Open)' : 'Entrance Door (Click to toggle)'}
        >
          <DoorSprite isOpen={doorOpen} />
        </div>

        {/* 2. WALKING GUEST OVERLAYS */}
        {enteringGuest && enteringPos && (
          <div
            className={`walking-guest-sprite ${isEnteringWalking ? 'in-motion' : 'at-door'}`}
            style={{
              transform: `translate3d(${enteringPos.x}px, ${enteringPos.y}px, 0)`
            }}
            data-tooltip={`${enteringGuest.name} entering`}
            data-tooltip-pos="top"
          >
            <div className="walker-avatar-body">
              <Avatar src={enteringGuest.avatar} name={enteringGuest.name} size={48} />
              <div className="walking-shadow"></div>
            </div>
            <div className="walker-name-tag">
              <span>{enteringGuest.name}</span>
            </div>
          </div>
        )}

        {leavingGuest && leavingPos && (
          <div
            className={`walking-guest-sprite leaving-sprite ${isLeavingWalking ? 'in-motion' : 'at-chair'}`}
            style={{
              transform: `translate3d(${leavingPos.x}px, ${leavingPos.y}px, 0)`
            }}
            data-tooltip={`${leavingGuest.name} leaving`}
            data-tooltip-pos="top"
          >
            <div className="walker-avatar-body">
              <Avatar src={leavingGuest.avatar} name={leavingGuest.name} size={48} />
              <div className="walking-shadow"></div>
            </div>
            <div className="walker-name-tag">
              <span>{leavingGuest.name}</span>
            </div>
          </div>
        )}

        {/* 3. SEATING SPOTS MAPPED DIRECTLY TO THE WOODEN TABLES */}
        {seats.map((seat) => {
          const occupant = members.find((m) => m.seatId === seat.id);
          const isOccupied = !!occupant;

          return (
            <div
              key={seat.id}
              className={`table-seat-pinpoint ${isOccupied ? 'occupied' : 'vacant'}`}
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`
              }}
              onClick={() => {
                if (occupant) {
                  onMemberClick(occupant);
                } else {
                  onSeatClick(seat);
                }
              }}
              data-tooltip={
                occupant
                  ? `${occupant.name} (${occupant.role})${occupant.mood ? ` • ${occupant.mood}` : ''} • Click to stand up`
                  : `Sit at ${seat.name}`
              }
              data-tooltip-pos="top"
            >
              {occupant ? (
                <div className="occupant-wrap pinpoint-occupant">
                  <div className="avatar-frame">
                    {occupant.isSpeaking && <div className="speaking-wave-ring"></div>}
                    <Avatar src={occupant.avatar} name={occupant.name} size={46} />
                    <span className={`status-indicator ${occupant.status || 'online'}`}></span>
                  </div>
                  {/* Preserved Username Badge */}
                  <div className="member-name">
                    <span>{occupant.name}</span>
                  </div>
                </div>
              ) : (
                <div className="vacant-seat-marker">
                  <span className="plus-icon">+</span>
                </div>
              )}
            </div>
          );
        })}

        {/* 4. INTEGRATED KITCHEN / CHEF CORNER (Far-Right of the Cabin) */}
        {activeStaff && (
          <div
            className={`chef-station-hotspot ${isCooking ? 'cooking-mode' : 'break-mode'}`}
            style={{
              left: '88%',
              top: isCooking ? '48%' : '72%'
            }}
          >
            {/* Chef Hat when cooking */}
            {isCooking && (
              <div className="chef-hat-floater" data-tooltip="Head Chef on duty" data-tooltip-pos="top">
                <ChefHat size={28} className="chef-hat-icon" />
              </div>
            )}

            {/* Cooking Dish Bubble: Icon Only, text on hover */}
            {isCooking && (
              <div
                className="integrated-dish-bubble"
                onClick={() => onChangeDish(activeStaff.id)}
                data-tooltip={`Cooking: ${activeStaff.cookingDish} (Click to change dish)`}
                data-tooltip-pos="top"
              >
                <span className="dish-icon-only">{activeStaff.dishIcon || '🥘'}</span>
              </div>
            )}

            {/* Chef Avatar with Tooltip & Toggle on Click */}
            <div 
              className="chef-avatar-wrapper"
              onClick={() => onToggleStaffActive(activeStaff.id)}
              data-tooltip={`${activeStaff.name} (Chef) • ${isCooking ? 'Cooking at stove' : 'On break'} (Click to toggle)`}
              data-tooltip-pos="top"
            >
              {activeStaff.isSpeaking && (
                <div className="speaking-wave-ring staff-ring"></div>
              )}
              <Avatar src={activeStaff.avatar} name={activeStaff.name} size={50} />

              {isCooking && (
                <div className="chef-spatula-hand">
                  <span className="spatula-emoji">🥄</span>
                </div>
              )}
            </div>

            {/* Preserved Chef Username Badge */}
            <div className="chef-name-tag">
              <span>{activeStaff.name}</span>
            </div>
          </div>
        )}

        {/* Ambient Warm Golden Overlay */}
        <div className="jungle-vignette-overlay"></div>
      </div>
    </div>
  );
}
