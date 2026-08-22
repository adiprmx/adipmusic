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
const REVIEWS_BADWORDS = ['agaklaen', 'ajg', 'ajgg', 'anj', 'anjiang', 'anjeg', 'anjeng', 'anjing', 'anjingg', 'anjingnynya',
  'anjink', 'anjir', 'anjj', 'anjr', 'anjro', 'anjrot', 'anjs', 'anjy', 'anjzzz', 'aseng',
  'ashole', 'ass', 'asshole', 'asw', 'asul', 'babi', 'babiang', 'babiii', 'baco', 'bagong',
  'bahlul', 'bangkai', 'bangkang', 'bangke', 'bangsat', 'bastard', 'bathukmu', 'bcod', 'bcodd', 'bcot',
  'bdg', 'bdek', 'bdeg', 'bdk', 'bdoh', 'bego', 'begok', 'bejat', 'begu', 'belut',
  'beungeut', 'bgan', 'bgi', 'bgsaai', 'bgsd', 'bgst', 'bgstt', 'bitch', 'bitchs', 'bkod',
  'bkot', 'blok', 'bngsad', 'bngsat', 'bngsd', 'bodat', 'bodoh', 'bojog', 'bokep', 'bollo',
  'brengsek', 'bs', 'budeg', 'budek', 'bugil', 'bullshit', 'bungul', 'burung', 'cai', 'celeng',
  'choke', 'cingkahak', 'cock', 'cocot', 'coeg', 'cok', 'cokkk', 'coli', 'colik', 'crap',
  'crazy', 'cuk', 'cumpal', 'cunt', 'damn', 'dancok', 'dancuk', 'denai', 'dick', 'diot',
  'dngo', 'dog', 'dongo', 'dongok', 'douchebag', 'ee', 'eek', 'ewe', 'ewean', 'ewik',
  'faggot', 'fck', 'fk', 'fuck', 'fuckin', 'fucking', 'gajelas', 'garong', 'gatel', 'gblg',
  'gblk', 'gblog', 'geuleuh', 'gila', 'goblok', 'goblog', 'goblogg', 'goblokk', 'hoe', 'idiot',
  'itil', 'itilnya', 'jablay', 'jackass', 'janco', 'jancok', 'jancuk', 'jembot', 'jembut', 'jembuts',
  'jncok', 'jncuk', 'jubur', 'jurig', 'kadada', 'kampang', 'kamparet', 'kampret', 'kaparat', 'kappala',
  'karas', 'kaskado', 'kehed', 'kiciek', 'kimak', 'kimakk', 'klepon', 'kmprt', 'kmpret', 'kntlll',
  'kntol', 'kntl', 'kntr', 'kodi', 'kontl', 'kontol', 'kontoll', 'kontolll', 'kontos', 'koyok',
  'lacur', 'lajang', 'lambe', 'leak', 'letuh', 'lnt', 'lnteh', 'lnth', 'loka', 'lonte',
  'lonteee', 'lonteh', 'lote', 'mace', 'mai', 'matamu', 'mayat', 'mbokmu', 'memek', 'memekkk',
  'mesum', 'mf', 'mfucker', 'mmek', 'mmk', 'mnyet', 'mnyt', 'modar', 'monyet', 'monyetnya',
  'moron', 'motherfucker', 'muka', 'nasak', 'ndasmu', 'ngentod', 'ngentot', 'ngentotl', 'ngewe', 'ngntd',
  'ngotak', 'ngtd', 'ngtod', 'nigga', 'nigger', 'otakmiring', 'otakna', 'pace', 'paja', 'pantek',
  'pantekk', 'pantekkk', 'pekok', 'pelacur', 'peler', 'peler3', 'penthil', 'peok', 'pepek', 'perek',
  'picek', 'picekk', 'piras', 'piss', 'pler', 'pntek', 'pntk', 'prick', 'puckimak', 'puki',
  'pukima', 'pukimaak', 'pukimai', 'pukimak', 'pussy', 'raimu', 'retard', 'sange', 'sangean', 'sangange',
  'sangkal', 'sarap', 'seks', 'setan', 'shit', 'sia', 'siah', 'sial', 'sialan', 'silit',
  'singidan', 'sinting', 'slut', 'sodomi', 'somplak', 'stfu', 'stupid', 'su', 'suba', 'sundala',
  't4i', 'tae', 'taek', 'tahi', 'tai', 'taik', 'tambuk', 'tatutu', 'telaso', 'tete',
  'titid', 'titit', 'tlol', 'tod', 'toket', 'tolol', 'tololl', 'tot', 'tte', 'ttid',
  'ttit', 'turuk', 'twat', 'waluh', 'wedus', 'whore', 'wtf'
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
