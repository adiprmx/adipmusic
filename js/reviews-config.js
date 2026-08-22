/* ========================================================================
   ADIP RMX — Konfigurasi Sistem Ulasan (Reviews)
   Backend: Supabase (Postgres + Storage)
   ------------------------------------------------------------------------
   GANTI dua nilai di bawah ini dengan milik project Supabase kamu sendiri.
   Ambil dari: Supabase Dashboard > Project Settings > API
   ======================================================================== */

const REVIEWS_SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const REVIEWS_SUPABASE_ANON_KEY = 'YOUR-SUPABASE-ANON-PUBLIC-KEY';

/* Nama bucket Storage tempat menyimpan media ulasan (gambar/audio).
   Buat bucket ini di Supabase Dashboard > Storage, set sebagai Public. */
const REVIEWS_STORAGE_BUCKET = 'review-media';

/* Daftar produk/ID transaksi yang dianggap valid untuk mengecek badge
   "Verified Buyer". Sistem mencocokkan ke tabel `transactions` Supabase
   (lihat supabase/schema.sql) berdasarkan email/nomor WA yang diinput user
   saat menulis ulasan. Kosongkan array ini bila belum ingin memakai fitur
   pengecekan otomatis — admin tetap bisa menandai Verified Buyer manual
   dari Admin Panel. */
const REVIEWS_VERIFIED_CHECK_ENABLED = true;

/* ----------------------------------------------------------------------
   BADWORDS FILTER — kustomisasi bebas.
   Semua kata di bawah (dan variasi huruf besar/kecil, spasi berlebih)
   akan otomatis disensor jadi tanda bintang (****) sebelum ulasan
   dikirim, dan juga disensor ulang saat ditampilkan sebagai lapisan
   pertahanan kedua. Tambah/kurangi kata sesuai kebutuhan.
   ---------------------------------------------------------------------- */
const REVIEWS_BADWORDS = [
    'anjing', 'anjir', 'anjrit', 'asu', 'babi', 'bangsat', 'bego', 'bejat',
    'bodoh', 'brengsek', 'goblok', 'idiot', 'jancok', 'jancuk', 'kampret',
    'kntl', 'kontol', 'lonte', 'memek', 'ngentot', 'pantek', 'pepek',
    'perek', 'sialan', 'tai', 'tolol', 'kampang', 'kimak', 'setan',
    'monyet', 'anjrot', 'cok', 'jembut', 'coeg', 'cuk', 'fuck', 'shit',
    'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'bangke', 'bangkai'
];

/* Karakter pengganti untuk kata yang tersensor */
const REVIEWS_BADWORD_MASK_CHAR = '*';

/* Emoji reaction yang tersedia di bawah tiap ulasan */
const REVIEWS_REACTIONS = ['❤️', '🔥', '👏', '😍', '😂', '👍'];

/* Jumlah ulasan yang ditampilkan per halaman (pagination "Muat Lebih") */
const REVIEWS_PAGE_SIZE = 6;

/* Ukuran maksimal file media yang boleh diunggah (dalam MB) */
const REVIEWS_MAX_IMAGE_MB = 5;
const REVIEWS_MAX_AUDIO_MB = 8;
