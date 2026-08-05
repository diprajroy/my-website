/**
 * google-sheets-sync.js
 * Syncs 3 Google Sheet tabs to the website:
 *   1. BlogPosts    (gid=0)
 *   2. YouTubeVideos (gid=1055552736)
 *   3. EcoExplorers  (gid=1671820481)
 *
 * All tabs are published as CSV from the same spreadsheet.
 */

const SHEET_BASE =
  "https://docs.google.com/spreadsheets/d/e/" +
  "2PACX-1vSafr6IJhrW_h4Xhj-0Wtr0QmEfavS6fW2xMZ5dHTJfcpxwwWlKHF7q_LjeKJWZnDJxBzI3cEBeBQvh" +
  "/pub?output=csv";

const GID = {
  blogPosts:    "0",
  youtubeVideos:"1055552736",
  ecoExplorers: "1671820481"
};

// ─── CSV UTILITIES ───────────────────────────────────────────────────────────

/**
 * Minimal CSV parser that handles quoted fields correctly.
 * Returns an array of objects keyed by the header row.
 */
function parseCSV(text) {
  const rows = [];
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return rows;

  const header = splitCSVLine(lines[0]);

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    // Skip completely blank rows
    if (cols.every(c => c === "")) continue;
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = (cols[idx] || "").trim();
    });
    rows.push(obj);
  }
  return rows;
}

/** Split a single CSV line respecting quoted fields. */
function splitCSVLine(line) {
  const result = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

/** Fetch CSV text for a given tab GID. */
async function fetchTab(gid) {
  const url = `${SHEET_BASE}&gid=${gid}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch GID ${gid}: ${resp.status}`);
  return resp.text();
}

// ─── YOUTUBE HELPERS ─────────────────────────────────────────────────────────

/**
 * Convert any YouTube URL / short URL to an embed URL.
 * Handles: https://youtu.be/ID, https://www.youtube.com/watch?v=ID,
 *          https://www.youtube.com/embed/ID
 */
function toEmbedUrl(url) {
  url = url.trim();
  // Already embed
  if (url.includes("/embed/")) return url;
  // Short URL  youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Standard watch URL
  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return "";
}

// ─── RENDERERS ───────────────────────────────────────────────────────────────

/** Render YouTube videos into #youtube-container */
function renderYouTube(videos) {
  const container = document.getElementById("youtube-container");
  if (!container) return;

  container.innerHTML = "";

  if (!videos.length) {
    container.innerHTML = "<p class='muted'>No videos yet. Check back soon!</p>";
    return;
  }

  videos.forEach(v => {
    const embedUrl = toEmbedUrl(v.VideoURL);
    if (!embedUrl) return;

    const card = document.createElement("div");
    card.className = "yt-card";
    card.style.cssText =
      "background:rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;" +
      "box-shadow:0 8px 32px rgba(0,0,0,0.3);backdrop-filter:blur(8px);";

    card.innerHTML = `
      <div class="yt-iframe-wrap" style="position:relative;padding-top:56.25%;overflow:hidden;">
        <iframe
          src="${embedUrl}"
          title="${v.VideoTitle}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:0;"></iframe>
      </div>
      <div style="padding:1rem;">
        <h3 style="margin:0 0 0.4rem;font-size:1rem;line-height:1.4;">${v.VideoTitle}</h3>
        <p style="margin:0;font-size:0.85rem;opacity:0.7;">${v.PublishDate}</p>
      </div>`;

    container.appendChild(card);
  });
}

/** Render blog posts into #blog-container */
function renderBlog(posts) {
  const container = document.getElementById("blog-container");
  if (!container) return;

  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML =
      "<p class='muted' style='padding:1rem 0;'>Blog posts coming soon!</p>";
    return;
  }

  posts.forEach(p => {
    const card = document.createElement("article");
    card.className = "card-2026";

    const img = p.ImageURL
      ? `<img src="${p.ImageURL}" alt="${p.Title}"
             style="width:100%;border-radius:8px;margin-bottom:0.8rem;aspect-ratio:16/9;object-fit:cover;">`
      : "";

    card.innerHTML = `
      ${img}
      <span class="badge" style="font-size:0.75rem;">${p.Category || "Blog"}</span>
      <h3 style="margin:0.5rem 0;">${p.Title}</h3>
      <p class="muted" style="font-size:0.85rem;">${p.PublishedDate}</p>
      <p>${p.Excerpt}</p>
      <a class="btn-2026 ghost" href="${p.URL}" target="_blank" rel="noopener">Read more</a>`;

    container.appendChild(card);
  });
}

/** Render Eco Explorers team into #eco-team (on eco-explorers.html) */
function renderEcoTeam(members) {
  const container = document.getElementById("eco-team");
  if (!container) return;

  container.innerHTML = "";

  if (!members.length) return; // Static HTML fallback already in the page

  const grid = document.createElement("div");
  grid.style.cssText =
    "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem;";

  members.forEach(m => {
    const card = document.createElement("div");
    card.className = "member-card";
    card.style.cssText =
      "background:rgba(255,255,255,0.1);backdrop-filter:blur(8px);" +
      "border-radius:14px;padding:1.5rem;text-align:center;";

    const photo = m.PhotoURL
      ? `<img src="${m.PhotoURL}" alt="${m.Name}"
             style="width:90px;height:90px;border-radius:50%;object-fit:cover;margin-bottom:0.8rem;">`
      : `<div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#00bfff44,#007bff66);
              margin:0 auto 0.8rem;display:flex;align-items:center;justify-content:center;font-size:2rem;">
              ${m.Name ? m.Name[0] : "?"}
         </div>`;

    const linkedin = m.LinkedIn
      ? `<a href="${m.LinkedIn}" target="_blank" rel="noopener"
            style="display:inline-block;margin-top:0.5rem;color:#aaddff;font-size:0.85rem;">LinkedIn</a>`
      : "";

    card.innerHTML = `
      ${photo}
      <h3 style="margin:0 0 0.2rem;">${m.Name}</h3>
      ${m.Role ? `<p style="margin:0 0 0.4rem;opacity:0.75;font-size:0.9rem;">${m.Role}</p>` : ""}
      ${m.Bio  ? `<p style="font-size:0.85rem;opacity:0.8;">${m.Bio}</p>` : ""}
      ${linkedin}`;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // 1. YouTube Videos (always fetch – data is present)
  if (document.getElementById("youtube-container") || document.getElementById("youtube-feed")) {
    fetchTab(GID.youtubeVideos)
      .then(csv => renderYouTube(parseCSV(csv)))
      .catch(err => {
        console.error("YouTube feed error:", err);
        const el = document.getElementById("youtube-feed");
        if (el) el.innerHTML = "<p class='muted'>Could not load videos.</p>";
      });
  }

  // 2. Blog Posts
  if (document.getElementById("blog-feed")) {
    fetchTab(GID.blogPosts)
      .then(csv => renderBlog(parseCSV(csv)))
      .catch(err => {
        console.error("Blog feed error:", err);
        const el = document.getElementById("blog-feed");
        if (el) el.innerHTML = "<p class='muted'>Could not load blog posts.</p>";
      });
  }

  // 3. Eco Explorers team (on eco-explorers.html)
  if (document.getElementById("eco-team")) {
    fetchTab(GID.ecoExplorers)
      .then(csv => renderEcoTeam(parseCSV(csv)))
      .catch(err => {
        console.error("Eco Explorers feed error:", err);
      });
  }

});
