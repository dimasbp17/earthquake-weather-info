// Proxy feed Peringatan Dini Cuaca BMKG (tidak menyediakan header CORS).
// Dipakai sebagai Vercel Function dan middleware dev server Vite (lihat vite.config.js).
// GET /api/bmkg-alerts?file=rss.xml            -> daftar peringatan (RSS)
// GET /api/bmkg-alerts?file=CYG..._alert.xml    -> detail peringatan (CAP)

const BMKG_NOWCAST_URL = 'https://www.bmkg.go.id/alerts/nowcast/id';

// Hanya nama file feed BMKG yang diizinkan, mencegah proxy dipakai ke URL lain.
const ALLOWED_FILE = /^(rss\.xml|[A-Za-z0-9]+_alert\.xml)$/;

export default async function handler(req, res) {
  const file = new URL(req.url, 'http://localhost').searchParams.get('file');

  if (!file || !ALLOWED_FILE.test(file)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Parameter file tidak valid' }));
    return;
  }

  try {
    const upstream = await fetch(`${BMKG_NOWCAST_URL}/${file}`);
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.end(await upstream.text());
  } catch {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Gagal menghubungi BMKG' }));
  }
}
