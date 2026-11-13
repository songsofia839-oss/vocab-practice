// Anonymous aggregate usage stats for the vocabulary site.
// Cloudflare Worker + D1. Stores counters only: no vocabulary, no answers, no raw IPs.
const BOT = /bot|crawl|spider|headless|lighthouse|curl|wget|python/i;
const MAX_SESSION_MS = 3 * 60 * 60 * 1000;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (url.pathname === "/stats" && req.method === "GET") return stats(env, cors);
    if (url.pathname === "/collect" && req.method === "POST") {
      const origin = req.headers.get("Origin") || "";
      if (allowed !== "*" && origin !== allowed) return new Response(null, { status: 403, headers: cors });
      return collect(req, env, cors);
    }
    return new Response("Not found", { status: 404, headers: cors });
  },
};

async function collect(req, env, cors) {
  const reply = (status) => new Response(null, { status, headers: cors });
  if (!env.SALT) return reply(500);
  const ua = req.headers.get("User-Agent") || "";
  if (!ua || BOT.test(ua)) return reply(204); // ignore automated traffic silently

  let e;
  try { e = JSON.parse(await req.text()); } catch { return reply(400); }
  if (!e || typeof e.eid !== "string" || !/^[0-9a-f]{16}$/.test(e.eid)) return reply(400);

  const now = Date.now();
  // Duplicate-event guard: each event id is accepted once.
  const seen = await env.DB.prepare("INSERT OR IGNORE INTO events(id, ts) VALUES(?, ?)").bind(e.eid, now).run();
  if (!seen.meta.changes) return reply(204);

  let sql, args;
  switch (e.type) {
    case "visit": {
      // Unique visitors: salted one-way hash of IP + user agent. The raw IP is never stored.
      const h = await sha256(env.SALT + "|" + (req.headers.get("CF-Connecting-IP") || "") + "|" + ua);
      const v = await env.DB.prepare("INSERT OR IGNORE INTO visitors(h) VALUES(?)").bind(h).run();
      await env.DB.prepare("DELETE FROM events WHERE ts < ?").bind(now - 86400000).run();
      sql = "UPDATE stats SET visits = visits + 1, unique_visitors = unique_visitors + ?, updated_at = ? WHERE id = 1";
      args = [v.meta.changes, now];
      break;
    }
    case "session_start":
      sql = "UPDATE stats SET sessions = sessions + 1, updated_at = ? WHERE id = 1"; args = [now]; break;
    case "attempt":
      sql = "UPDATE stats SET attempted = attempted + 1, updated_at = ? WHERE id = 1"; args = [now]; break;
    case "mastered":
      sql = "UPDATE stats SET mastered = mastered + 1, updated_at = ? WHERE id = 1"; args = [now]; break;
    case "session_end": {
      const ms = Math.round(Number(e.ms));
      if (!(ms >= 1000 && ms <= MAX_SESSION_MS)) return reply(400);
      sql = "UPDATE stats SET ended_sessions = ended_sessions + 1, total_ms = total_ms + ?, longest_ms = MAX(longest_ms, ?), updated_at = ? WHERE id = 1";
      args = [ms, ms, now];
      break;
    }
    default: return reply(400);
  }
  await env.DB.prepare(sql).bind(...args).run();
  return reply(204);
}

async function stats(env, cors) {
  const s = await env.DB.prepare("SELECT * FROM stats WHERE id = 1").first();
  const body = {
    visits: s.visits,
    uniqueVisitors: s.unique_visitors,
    sessions: s.sessions,
    attempted: s.attempted,
    mastered: s.mastered,
    avgMs: s.ended_sessions ? Math.round(s.total_ms / s.ended_sessions) : null,
    longestMs: s.longest_ms || null,
    updatedAt: s.updated_at ? new Date(s.updated_at).toISOString() : null,
  };
  return new Response(JSON.stringify(body), {
    headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "public, max-age=30" },
  });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
