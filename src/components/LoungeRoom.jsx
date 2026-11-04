import React, { useState, useEffect, useRef } from 'react';
import Avatar from './Avatar';
import { ChefHat, Move, Copy, RotateCcw, Check } from 'lucide-react';
import { DoorSprite } from './sprites/FurnitureSprites';

/**
 * Common, theme-agnostic 2.5D Lounge Canvas component.
 * Supports interactive real-time Drag & Drop seat placement positioning!
 */
export default function LoungeRoom({
  theme,
  seats,
  chefStation,
  onUpdateChefPos,
  members,
  onSeatClick,
  onMemberClick,
  enteringGuest,
  onGuestArrived,
  leavingGuest,
  onGuestDeparted,
  movingGuest,
  onGuestMoved,
  staffList,
  onToggleStaffActive,
  onChangeDish,
  isEditMode,
  onToggleEditMode,
  onUpdateSeatPos,
  onResetSeats,
  onNotify
}) {
  const [doorOpen, setDoorOpen] = useState(false);
  const [enteringPos, setEnteringPos] = useState(null);
  const [isEnteringWalking, setIsEnteringWalking] = useState(false);

  const [leavingPos, setLeavingPos] = useState(null);
  const [isLeavingWalking, setIsLeavingWalking] = useState(false);

  const [movingPos, setMovingPos] = useState(null);
  const [isMovingWalking, setIsMovingWalking] = useState(false);

  const roomRef = useRef(null);
  const doorRef = useRef(null);

  // Dynamic theme layout definitions
  const layout = theme.layout;
  const doorConfig = layout.door;
  const currentChef = chefStation || layout.chefStation;
  const currentSeats = seats || layout.seats;

  const activeStaff = staffList?.find((s) => s.isActive) || staffList?.[0];
  const isCooking = activeStaff?.isActive;

  // 1. DYNAMIC ENTERING ANIMATION: Door (spawnX, spawnY) ➜ Seat (x%, y%)
  useEffect(() => {
    if (!enteringGuest || !roomRef.current) return;

    const targetSeat = currentSeats.find((s) => s.id === enteringGuest.targetSeatId);
    if (!targetSeat) {
      if (onGuestArrived) onGuestArrived(enteringGuest);
      return;
    }

    const roomRect = roomRef.current.getBoundingClientRect();
    const startX = roomRect.width * (doorConfig.spawnOffsetX / 100);
    const startY = roomRect.height * (doorConfig.spawnOffsetY / 100);

    const targetX = roomRect.width * (targetSeat.x / 100) - 24;
    const targetY = roomRect.height * (targetSeat.y / 100) - 24;

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
  }, [enteringGuest, currentSeats, doorConfig]);

  // 2. DYNAMIC LEAVING ANIMATION: Seat (x%, y%) ➜ Door (spawnX, spawnY) ➜ Exit
  useEffect(() => {
    if (!leavingGuest || !roomRef.current) return;

    const fromSeat = currentSeats.find((s) => s.id === leavingGuest.fromSeatId);
    const roomRect = roomRef.current.getBoundingClientRect();

    const startX = fromSeat
      ? roomRect.width * (fromSeat.x / 100) - 24
      : roomRect.width * 0.4;
    const startY = fromSeat
      ? roomRect.height * (fromSeat.y / 100) - 24
      : roomRect.height * 0.6;

    const targetX = roomRect.width * (doorConfig.spawnOffsetX / 100);
    const targetY = roomRect.height * (doorConfig.spawnOffsetY / 100);

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
  }, [leavingGuest, currentSeats, doorConfig]);

  // 3. DYNAMIC SEAT-TO-SEAT MOVE ANIMATION: FromSeat (x%, y%) ➜ TargetSeat (x%, y%)
  useEffect(() => {
    if (!movingGuest || !roomRef.current) return;

    const fromSeat = currentSeats.find((s) => s.id === movingGuest.fromSeatId);
    const targetSeat = currentSeats.find((s) => s.id === movingGuest.targetSeatId);

    if (!targetSeat || !fromSeat) {
      if (onGuestMoved) onGuestMoved(movingGuest);
      return;
    }

    const roomRect = roomRef.current.getBoundingClientRect();
    const startX = roomRect.width * (fromSeat.x / 100) - 24;
    const startY = roomRect.height * (fromSeat.y / 100) - 24;

    const targetX = roomRect.width * (targetSeat.x / 100) - 24;
    const targetY = roomRect.height * (targetSeat.y / 100) - 24;

    // Place instantly at origin seat first (without motion)
    setMovingPos({ x: startX, y: startY });
    setIsMovingWalking(false);

    // After brief paint, start walking directly toward target seat
    const walkTimer = setTimeout(() => {
      setIsMovingWalking(true);
      setMovingPos({ x: targetX, y: targetY });
    }, 60);

    const arriveTimer = setTimeout(() => {
      setIsMovingWalking(false);
      setMovingPos(null);
      if (onGuestMoved) {
        onGuestMoved(movingGuest);
      }
    }, 1400);

    return () => {
      clearTimeout(walkTimer);
      clearTimeout(arriveTimer);
    };
  }, [movingGuest, currentSeats]);

  // 4. INTERACTIVE DRAG & DROP FOR SEAT POSITIONS
  const handleSeatMouseDown = (e, seat) => {
    if (!isEditMode || !onUpdateSeatPos) return;
    e.preventDefault();
    e.stopPropagation();

    const roomEl = roomRef.current;
    if (!roomEl) return;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const rect = roomEl.getBoundingClientRect();

      const newX = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
      const newY = Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100));

      onUpdateSeatPos(seat.id, Number(newX.toFixed(1)), Number(newY.toFixed(1)));
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  };

  // 5. INTERACTIVE DRAG & DROP FOR CHEF / COOK POSITION
  const handleChefMouseDown = (e) => {
    if (!isEditMode || !onUpdateChefPos) return;
    e.preventDefault();
    e.stopPropagation();

    const roomEl = roomRef.current;
    if (!roomEl) return;

    const onMove = (moveEvent) => {
      const clientX = moveEvent.touches ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const clientY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY;
      const rect = roomEl.getBoundingClientRect();

      const newX = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
      const newY = Math.max(2, Math.min(98, ((clientY - rect.top) / rect.height) * 100));

      onUpdateChefPos(Number(newX.toFixed(1)), Number(newY.toFixed(1)), isCooking);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  };

  const handleCopyLayoutJson = () => {
    const formatted = JSON.stringify({
      chefStation: currentChef,
      seats: currentSeats
    }, null, 2);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formatted);
      if (onNotify) onNotify('📋 Copied theme layout JSON (seats & cook) to clipboard!');
    }
  };

  return (
    <div className={`room jungle-cabin-full-room ${isEditMode ? 'edit-mode-active' : ''}`}>
      {/* Theme Background Canvas with Dynamic Image */}
      <div 
        ref={roomRef} 
        className="jungle-unified-canvas"
        style={{
          backgroundImage: `url('${theme.background}')`
        }}
      >
        {/* 1. ENTRANCE DOOR (Positioned from active theme) */}
        <div
          ref={doorRef}
          className="door-hotspot"
          style={{
            left: `${doorConfig.x}%`,
            top: `${doorConfig.y}%`
          }}
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

        {/* Seat-to-Seat Moving Guest Overlay */}
        {movingGuest && movingPos && (
          <div
            className={`walking-guest-sprite seat-changer-sprite ${isMovingWalking ? 'in-motion' : 'at-chair'}`}
            style={{
              transform: `translate3d(${movingPos.x}px, ${movingPos.y}px, 0)`
            }}
            data-tooltip={`${movingGuest.name} changing seats`}
            data-tooltip-pos="top"
          >
            <div className="walker-avatar-body">
              <Avatar src={movingGuest.avatar} name={movingGuest.name} size={48} />
              <div className="walking-shadow"></div>
            </div>
            <div className="walker-name-tag">
              <span>{movingGuest.name}</span>
            </div>
          </div>
        )}

        {/* 3. DYNAMIC SEATING SPOTS MAPPED TO THE THEME (DRAGGABLE IN EDIT MODE) */}
        {currentSeats.map((seat) => {
          // Prevent showing duplicate stationary avatars during entry or seat-to-seat movement
          const isTargetOfEntry = enteringGuest && enteringGuest.targetSeatId === seat.id;
          const isTargetOfMove = movingGuest && movingGuest.targetSeatId === seat.id;
          const isSourceOfMove = movingGuest && movingGuest.fromSeatId === seat.id;

          let occupant = members.find((m) => m.seatId === seat.id);
          if (isTargetOfEntry || isTargetOfMove || isSourceOfMove) {
            occupant = null;
          }
          const isOccupied = !!occupant;

          return (
            <div
              key={seat.id}
              className={`table-seat-pinpoint ${isOccupied ? 'occupied' : 'vacant'} ${isEditMode ? 'draggable-seat-active' : ''}`}
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                zIndex: isEditMode ? 500 : Math.round(seat.y)
              }}
              onMouseDown={(e) => isEditMode && handleSeatMouseDown(e, seat)}
              onTouchStart={(e) => isEditMode && handleSeatMouseDown(e, seat)}
              onClick={() => {
                if (isEditMode) return;
                if (occupant) {
                  onMemberClick(occupant);
                } else {
                  onSeatClick(seat);
                }
              }}
              data-tooltip={
                isEditMode
                  ? `Drag ${seat.name} (${seat.x}%, ${seat.y}%)`
                  : occupant
                  ? `${occupant.name} (${occupant.role})${occupant.mood ? ` • ${occupant.mood}` : ''} • Click to stand up`
                  : `Sit at ${seat.name}`
              }
              data-tooltip-pos="top"
            >
              {/* Coordinate Chip visible during Edit Mode */}
              {isEditMode && (
                <div className="drag-coords-badge">
                  <Move size={10} className="drag-icon-micro" />
                  <span>{seat.x}%, {seat.y}%</span>
                </div>
              )}

              {occupant ? (
                <div className="occupant-wrap pinpoint-occupant">
                  <div className="avatar-frame">
                    {occupant.isSpeaking && <div className="speaking-wave-ring"></div>}
                    <Avatar src={occupant.avatar} name={occupant.name} size={46} />
                    <span className={`status-indicator ${occupant.status || 'online'}`}></span>
                  </div>
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

        {/* 4. DYNAMIC CHEF CORNER (Positioned from active theme, draggable in edit mode) */}
        {activeStaff && (
          <div
            className={`chef-station-hotspot ${isCooking ? 'cooking-mode' : 'break-mode'} ${isEditMode ? 'draggable-chef-active' : ''}`}
            style={{
              left: `${isCooking ? currentChef.cooking.x : currentChef.break.x}%`,
              top: `${isCooking ? currentChef.cooking.y : currentChef.break.y}%`,
              zIndex: isEditMode ? 510 : 70
            }}
            onMouseDown={(e) => isEditMode && handleChefMouseDown(e)}
            onTouchStart={(e) => isEditMode && handleChefMouseDown(e)}
            data-tooltip={
              isEditMode
                ? `Drag Cook (${isCooking ? currentChef.cooking.x : currentChef.break.x}%, ${isCooking ? currentChef.cooking.y : currentChef.break.y}%)`
                : `${activeStaff.name} (Chef) • ${isCooking ? 'Cooking at stove' : 'On break'} (Click to toggle)`
            }
            data-tooltip-pos="top"
          >
            {/* Coordinate Chip visible during Edit Mode */}
            {isEditMode && (
              <div className="drag-coords-badge chef-coords-badge">
                <Move size={10} className="drag-icon-micro" />
                <span>Cook {isCooking ? currentChef.cooking.x : currentChef.break.x}%, {isCooking ? currentChef.cooking.y : currentChef.break.y}%</span>
              </div>
            )}

            {/* Chef Hat when cooking */}
            {isCooking && (
              <div className="chef-hat-floater" data-tooltip="Head Chef on duty" data-tooltip-pos="top">
                <ChefHat size={28} className="chef-hat-icon" />
              </div>
            )}

            {/* Cooking Dish Bubble */}
            {isCooking && (
              <div
                className="integrated-dish-bubble"
                onClick={() => onChangeDish(activeStaff.id)}
                data-tooltip={`Cooking: ${activeStaff.cookingDish} (Click to change dish)`}
                data-tooltip-pos="top"
              >
                <span className="dish-icon-only">{activeStaff.dishIcon || '🍳'}</span>
              </div>
            )}

            {/* Chef Avatar with Toggle */}
            <div 
              className="chef-avatar-wrapper"
              onClick={() => {
                if (isEditMode) return;
                onToggleStaffActive(activeStaff.id);
              }}
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

            <div className="chef-name-tag">
              <span>{activeStaff.name}</span>
            </div>
          </div>
        )}

        {/* 5. FLOATING POSITIONING TOOLBAR (In Edit Mode) */}
        {isEditMode && (
          <div className="layout-editor-toolbar">
            <div className="editor-status-text">
              <Move size={15} className="editor-pulse-icon" />
              <span>Drag any seat or cook to reposition</span>
            </div>
            <div className="editor-actions">
              <button 
                className="editor-btn copy-btn"
                onClick={handleCopyLayoutJson}
                title="Copy coordinates JSON to clipboard"
              >
                <Copy size={13} />
                <span>Copy JSON</span>
              </button>
              <button 
                className="editor-btn reset-btn"
                onClick={onResetSeats}
                title="Reset coordinates to theme defaults"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
              <button 
                className="editor-btn done-btn"
                onClick={() => onToggleEditMode(false)}
                title="Save & Exit Positioning Mode"
              >
                <Check size={13} />
                <span>Done</span>
              </button>
            </div>
          </div>
        )}

        {/* Ambient Overlay with Theme Vignette */}
        <div className="jungle-vignette-overlay"></div>
      </div>
    </div>
  );
}
