with open(r'd:\My website\css\theme-2026.css', 'a', encoding='utf-8') as f:
    f.write('''

/* LIGHT THEME */
[data-theme="light"] {
  --bg: #f8fafc;
  --bg-gradient: radial-gradient(circle at 15% 50%, rgba(6, 182, 212, 0.1), transparent 40%),
                 radial-gradient(circle at 85% 30%, rgba(168, 85, 247, 0.1), transparent 45%);
  --card-bg: rgba(0, 0, 0, 0.02);
  --card-border: rgba(0, 0, 0, 0.08);
  --card-hover: rgba(0, 0, 0, 0.04);
  --text: #0f172a;
  --muted: #475569;
  --line: rgba(0, 0, 0, 0.1);
  --shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  --glow: 0 0 20px rgba(6, 182, 212, 0.3);
}

[data-theme="light"] .card-2026 h3, 
[data-theme="light"] .card-title, 
[data-theme="light"] .tl-top strong {
  color: #0f172a;
}

[data-theme="light"] .nav-2026 {
  background: rgba(248, 250, 252, 0.75);
}

[data-theme="light"] .card-2026, 
[data-theme="light"] .chip,
[data-theme="light"] .video-placeholder {
  background: linear-gradient(145deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4));
}

[data-theme="light"] #contact .profile-links a, 
[data-theme="light"] #contact .card-2026 a {
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.3);
  background: rgba(168, 85, 247, 0.05);
}

[data-theme="light"] #contact .profile-links a:hover, 
[data-theme="light"] #contact .card-2026 a:hover {
  background: var(--brand-2);
  color: #fff;
}

/* THEME TOGGLE BUTTON */
.theme-toggle-btn {
  background: transparent;
  border: none;
  color: var(--text);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  margin-left: 8px;
}

.theme-toggle-btn:hover {
  background: rgba(128, 128, 128, 0.2);
}

.theme-toggle-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
''')
