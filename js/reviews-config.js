/* ========================================================================
   ADIP RMX — Konfigurasi Sistem Ulasan (Reviews)
   Backend: Supabase (Postgres + Storage)
   ------------------------------------------------------------------------
   GANTI dua nilai di bawah ini dengan milik project Supabase kamu sendiri.
   Ambil dari: Supabase Dashboard > Project Settings > API
   ======================================================================== */

const REVIEWS_SUPABASE_URL = 'https://jebafddwupyqpwevhsqn.supabase.co';
const REVIEWS_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplYmFmZGR3dXB5cXB3ZXZoc3FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTA4ODIsImV4cCI6MjEwMjg2Njg4Mn0.FV11WzcVJv2GlFHpzLztFMCik1nmDucA7hZwov8090E';

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
    'bitch', 'asshole', 'bastard', 'dick', 'pussy', 'bangke', 'Anjing', 'kontol', 'Kontol', 'Kntl', 'kntl', 'memek', 'mmk', 'mmek', 'bangsat', 'tai', 'bego', 'goblok', 'dongo', 'idiot', 'Fuck', 'fuck', 'asu', 'anjing', 'kntl', 'mmek', 'bgst', 't4i', 'bgo', 'gblk', 'dngo', 'Diot', 'diot', 'fck', 'asw', 'anjeng', 'ajg,', 'ajg', 'bgsd', 'bngsd', 'taek', 'taik', 'mmk', 'kntol', 'ngentod', 'ngtd', 'ngntd', 'ngtod', 'tod', 'blok', 'tlol', 'tolol', 'bngsat', 'bngsad', 'gblok', 'ee', 'eek', 'stupid', 'bodoh', 'bdoh', 'jancok', 'janco', 'jncok', 'kampret', 'kmpret', 'kmprt', 'sialan', 'wedus', 'ngewe', 'ewe', 'ewean', 'jancuk', 'jncuk', 'pantek', 'pntk', 'tete', 'jembut', 'jembot', 'pntek', 'Raimu', 'raimu', 'picek', 'Picek', 'budeg', 'bdg', 'bdk', 'bdeg', 'budek', 'bdek', 'goblog', 'gblg', 'gblog', 'su', 'Su', 'sia', 'Sia', 'Anjiang', 'anjiang', 'Letuh', 'letuh,', 'Lonte', 'lonteh', 'Lonteh', 'lnth', 'lnteh', 'lnt', 'bcot', 'bacot', 'Bcot', 'Bacot', 'bcod', 'bacod', 'Pukimak', 'pukimak', 'mnyt', 'mnyet', 'tod', 'Tod', 'Monyet', 'Mnyet', 'ngotak', 'Ngotak', 'bitch', 'Bitch', 'moron', 'moron', 'fucking', 'Fucking', 'Bugil', 'bugil', 'tete', 'tte', 'Shit', 'sial', 'Sialan', 'Damn', 'damn', 'Ass', 'ass', 'koyok', 'Koyok', 'Anjink', 'anjink', 'ttid', 'titid', 'tot', 'Tod', 'tot', 'tod', 'Titid', 'Titit', 'Ttid', 'Ttit', 'titit', 'su', 'Su', 'ngontol', 'Ngontol', 'dog', 'Dog', 'Pler', 'pler', 'peler', 'Peler', 'pelacur', 'Pelacur', 'Tod', 'Stupid', 'crazy', 'Crazy', 'bangkai'
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
