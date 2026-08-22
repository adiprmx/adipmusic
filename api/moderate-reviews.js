// ============================================================================
// ADIP RMX — API: MODERASI ULASAN (Sistem Reviews)
// Lokasi di repo GitHub:  api/moderate-reviews.js
// ----------------------------------------------------------------------------
// Vercel Serverless Function.
// Dipakai oleh admin.html (Panel "Moderasi Ulasan") untuk approve / reject /
// hapus / tandai Verified Buyer pada ulasan yang tersimpan di Supabase.
//
// Kenapa lewat server (bukan langsung dari browser admin ke Supabase)?
// Supaya SUPABASE_SERVICE_ROLE_KEY (yang bisa melewati semua Row Level
// Security) TIDAK PERNAH terekspos ke browser siapa pun, termasuk admin.
//
// AUTH: sama seperti api/save-promo.js — memverifikasi Firebase ID Token
// milik akun Google admin yang sedang login.
//
// Body JSON yang diterima:
//   { idToken, action: 'approve' | 'reject' | 'delete' | 'verify', reviewId }
//
// Env yang dibutuhkan (Vercel > Settings > Environment Variables):
//   ADMIN_EMAILS               = sama seperti api/save-promo.js
//   FIREBASE_SERVICE_ACCOUNT   = sama seperti api/save-promo.js
//   SUPABASE_URL                = https://YOUR-PROJECT-REF.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   = Service Role Key (Supabase > Settings > API)
// ============================================================================

const admin = require('firebase-admin');
const { createClient } = require('@supabase/supabase-js');

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function initFirebaseAdmin() {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  return admin;
}

async function verifyAdmin(idToken) {
  if (!idToken || typeof idToken !== 'string') return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (decoded.email && adminEmails.indexOf(decoded.email.toLowerCase()) !== -1) {
      return decoded;
    }
    return null;
  } catch (err) {
    return null;
  }
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FIREBASE_SERVICE_ACCOUNT } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !FIREBASE_SERVICE_ACCOUNT) {
    return res.status(500).json({ success: false, message: 'Environment Variables belum lengkap.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (e) {
    return res.status(400).json({ success: false, message: 'Body bukan JSON valid.' });
  }

  initFirebaseAdmin();
  const decoded = await verifyAdmin(body.idToken);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Akses Ditolak: Akun ini bukan Administrator' });
  }

  const { action, reviewId } = body;
  if (!action) {
    return res.status(400).json({ success: false, message: 'action wajib diisi.' });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 'list' tidak butuh reviewId — mengambil SEMUA ulasan (semua status),
  // dipakai admin panel untuk menampilkan tab Pending/Approved/Rejected.
  if (action === 'list') {
    const { data, error } = await sb.from('reviews').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, reviews: data });
  }

  if (!reviewId) {
    return res.status(400).json({ success: false, message: 'reviewId wajib diisi untuk action ini.' });
  }

  if (action === 'approve') {
    const { error } = await sb.from('reviews').update({ status: 'approved' }).eq('id', reviewId);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: 'Ulasan disetujui.' });
  }

  if (action === 'reject') {
    const { error } = await sb.from('reviews').update({ status: 'rejected' }).eq('id', reviewId);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: 'Ulasan ditolak.' });
  }

  if (action === 'delete') {
    const { error } = await sb.from('reviews').delete().eq('id', reviewId);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: 'Ulasan dihapus.' });
  }

  if (action === 'verify') {
    const { error } = await sb.from('reviews').update({ is_verified: true }).eq('id', reviewId);
    if (error) return res.status(500).json({ success: false, message: error.message });
    return res.status(200).json({ success: true, message: 'Ditandai sebagai Verified Buyer.' });
  }

  return res.status(400).json({ success: false, message: 'action tidak dikenali.' });
};
