# 🌴 The Jungle Cabin Lounge & Outpost Kitchen • Discord Activity

An animated server hangout frontend designed to run directly inside Discord as an **Embedded Activity** (via Discord Embedded App SDK) or as a standalone web application.

---

## ✨ Features

- **🌴 The Jungle Cabin Lounge:**
  - High-resolution 2.5D panoramic background with sunlit rainforest canopy windows.
  - Handcrafted live-edge wooden tables with seating spots mapped directly onto chairs & cushions.
  - Interactive entrance door with smooth 3D swing animation.
  - Avatars show live voice-speaking pulse rings, status indicators, and mood bubbles.
  - **Animated Entrance & Exit:** Guests walk in through the door to take empty seats, and walk back out through the door when leaving.

- **🍳 Integrated Outpost Kitchen:**
  - Rustic stove station on the right side of the cabin.
  - **Active Chef Mode (`:D`)**:
    - When staff/admins are active, they appear behind the stove with a bouncing Chef's Hat 🧑‍🍳, animated stirring spatula, rising steam, and a recipe thought bubble.
    - Click on the dish bubble to cycle recipes (*Campfire Skillet Stew, Grilled Jungle Salmon, Tropical Coconut Curry, Wild Berry Pancakes*).
  - **Idle Coffee Mode**:
    - Toggle to coffee break moves the chef to the cabin bar stool sipping fresh brew ☕.

- **🔊 Built-in Jungle Ambiance:**
  - Ambient procedural cafe/rain audio generated via Web Audio API.

- **🧪 Interactive Sandbox Toolbar:**
  - **Add Guest (Walk In)**: Spawns a visitor at the door and walks them to the next free chair.
  - **Toggle Cooking :D**: Puts staff on/off active cooking duty.
  - **Simulate Voice**: Triggers green speaking wave rings around avatars.

---

## 🚀 Quick Start (Local Preview)

### 1. Start the Vite Dev Server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Expose Port for Discord Activity (Tunneling)

Discord requires an **HTTPS** URL to load your local dev server inside the Discord client iframe.

### Option A: Cloudflare Tunnel (Recommended - No warning pages)

In a separate terminal window, run:

```bash
npx cloudflared tunnel --url http://localhost:5173
```

This will generate a free public HTTPS URL such as:
```text
https://random-words.trycloudflare.com
```

> **Why Cloudflare Tunnel?** Unlike Microsoft DevTunnels or Localtunnel, Cloudflare Tunnel has **no interstitial warning screens**, so Discord's proxy can connect directly without getting `"refused to connect"`.

### Option B: Alternative Port Forwarding Commands

```bash
# Using localtunnel
npx localtunnel --port 5173

# Using ngrok
ngrok http 5173
```

*(If using VS Code Port Forwarding, make sure to right-click port 5173 in the **Ports** tab and set **Port Visibility ➜ Public**).*

---

## 🎮 How to Hook This to Your Discord Server

### Step 1: Create a Discord Application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** and name it (e.g. *Jungle Cabin Lounge*).

### Step 2: Configure Embedded Activity & URL Mapping
1. In the sidebar, select **Embedded App**.
2. Toggle on **Enable Embedded Activities**.
3. Under **Supported Platforms**, enable **Desktop** and **Web**.
4. Under **URL Mappings**, click **Add Mapping**:
   - **Prefix:** `/`
   - **Target:** Paste your tunnel domain without `https://` (e.g., `random-words.trycloudflare.com`).
5. Click **Save Changes**.

### Step 3: Add Client ID
Copy your **Application ID** from the **General Information** tab and paste it into `src/services/discordSdk.js`:
```js
const DEFAULT_CLIENT_ID = 'YOUR_APPLICATION_ID_HERE';
```

### Step 4: Install and Launch in Discord
1. Go to **Installation** in the Developer Portal, enable **Guild Install**, check `applications.commands`, and use the install link to authorize it to your server.
2. Join any voice channel in your server, click the **Activities (Rocket 🚀)** button, and launch **Jungle Cabin Lounge**!


npx cloudflared tunnel --url http://localhost:5173