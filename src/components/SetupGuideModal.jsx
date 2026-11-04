import React from 'react';
import { X, ExternalLink, Rocket, CheckCircle, Terminal, Key } from 'lucide-react';

export default function SetupGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Rocket className="text-purple" size={24} />
            <h2>How to Connect This to Your Discord Server</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="guide-card alert-banner">
            <p>
              <strong>💡 Discord Activities (Embedded App SDK)</strong> allow custom interactive web applications to run directly inside your server's voice and text channels without requiring members to install any client plugins or mods.
            </p>
          </div>

          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-details">
                <h4>Create a Discord Developer Application</h4>
                <p>
                  Visit the <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer">Discord Developer Portal <ExternalLink size={14} className="inline-icon" /></a> and click <strong>New Application</strong>.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-details">
                <h4>Enable Embedded Activities</h4>
                <p>
                  Navigate to <strong>Embedded App</strong> in your application settings:
                </p>
                <ul>
                  <li>Toggle on <strong>Embedded Activities</strong>.</li>
                  <li>In <strong>URL Mappings</strong>, set the mapping prefix to <code>/</code> pointing to your hosted web frontend URL (e.g., your Vercel/Cloudflare Pages URL or Cloudflare Tunnel/ngrok during testing).</li>
                </ul>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-details">
                <h4>Set your Client ID</h4>
                <p>
                  Copy your <strong>Application ID</strong> from the <em>General Information</em> tab and pass it into <code>src/services/discordSdk.js</code>.
                </p>
                <div className="code-snippet">
                  <code>const CLIENT_ID = 'YOUR_APPLICATION_ID_HERE';</code>
                </div>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-details">
                <h4>Launch in any Voice Channel!</h4>
                <p>
                  Join any voice channel in your Discord server, click the <strong>Activities (🚀 Rocket icon)</strong> at the bottom of the voice panel, and select your custom Lounge!
                </p>
              </div>
            </div>
          </div>

          <div className="guide-card local-test-card">
            <h4><Terminal size={18} className="inline-icon" /> Testing Right Now Locally</h4>
            <p>
              You can test the entire lounge, chair-taking animations, staff cooking states, and sound effects right here in your browser using the top sandbox toolbar!
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Got it, Let's Hang Out!
          </button>
        </div>
      </div>
    </div>
  );
}

