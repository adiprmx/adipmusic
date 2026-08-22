// ========================================
// Adip Lowkey - Data Katalog Arsip Remix
// ========================================
// CARA CUSTOM:
// - title  : judul remix kamu
// - artist : nama artis asli / featuring
// - year   : tahun rilis
// - genre  : genre remix
// - duration : durasi track (teks, contoh "3:24")
// - cover  : path / link cover art. Contoh path: "images/covers/cover-01.jpg"
//            Contoh link: "https://i.imgur.com/xxxx.jpg"
// - audio  : path / link file audio (mp3). Contoh path: "audio/remix-01.mp3"
//            Contoh link: "https://domain.com/track.mp3"
// - Tambah track baru? Cukup tambah blok { ... } baru di dalam array.
// ========================================

// Audio demo sementara (ganti dengan file/link audio kamu sendiri)
const archiveDemoAudios = [
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787105938/goyangnasipadang-adiprmx_hztbbb.mp3', //0
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106593/EMANG_MANTUL_ADIP_ENAFF_kuo3bf.mp3', //1
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106686/SAKITNYA_LUAR_DALAM_REVISI_3_-_ADIP_RMX_tddqch.mp3', //2
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106234/DIMANA_KAMU_THAILAND_EDIT_LONG_STYLE_-_ADIP_LOWKEY_a5v6tn.mp3', //3
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106678/RINDU_SEMALAM_-_ADIP_RMX_y8srj2.mp3', //4
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106271/KARNA_ADA_KO_THAILAND_EDIT_-_ADIP_RMX_vv4ygu.mp3', //5
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106627/JANGAN_LUPA_BAHAGIA_-_ADIP_RMX_i0rtvq.mp3', //6
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106704/TELAHAPE_JOS_JIS_STYLE_-_ADIP_RMX_bjjqjs.mp3', //7
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106326/TANTE_CULIK_AKU_DONG_BOOTLEG_-_ADIP_RMX_c9fm4d.mp3', //8
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106225/BUKAN_CINTA_1_ATAU_2_THAILAND_EDIT_-_ADIP_RMX_lgasdq.mp3', //9
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106361/DJ_UNTIL_I_FOUND_YOU_-_ADIP_RMX_rr3k9r.wav', //10
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106243/DJ_DALINDA_SUPERR_KENCENGGG_-_ADIP_RMX_cdazdb.mp3', //11
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //12
    'https://res.cloudinary.com/drlb0d6vq/video/upload/v1787106613/JANGAN_BILANG_SAYANG_-_ADIP_RMX_rdw1sk.mp3', //13
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //14
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //15
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //16
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //17
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //18
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //19
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //20
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //21
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //22
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //23
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //24
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //25
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //26
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //27
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //28
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //29
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //30
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //31
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //32
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //33
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //34
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //35
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //36
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //37
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //38
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //39
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //40
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //41
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //42
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //43
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //44
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //45
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //46
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //47
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //48
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //49
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //50
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //51
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //52
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //53
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //54
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //55
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //56
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //57
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //58
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', //59
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //60
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', //61
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3', //62
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_5f5f6c71c6.mp3', //63
    'https://cdn.pixabay.com/download/audio/2021/09/06/audio_278c4c59c1.mp3' //64
];

const archiveTracks = [
    { id: 'rmx-001', title: 'Goyang Nasi Padang (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Enaff', duration: '2:59', cover: 'https://i.ibb.co.com/G4p9t7hV/COVER-IMAGE-3989-A56.png', audio: archiveDemoAudios[0] },
    { id: 'rmx-002', title: 'EMANG MANTUL ADIP ENAFF', artist: 'ADIP RMX', year: 2026, genre: 'Enaff', duration: '3:23', cover: 'https://i.ibb.co.com/gbdKkKfQ/emangmantul-adiprmx.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-003', title: 'Sakitnya Luar Dalam (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Plat KT', duration: '2:48', cover: 'https://i.ibb.co.com/q36DsDM9/COVER-IMAGE-Copy-28-16-FE366.png', audio: archiveDemoAudios[2] },
    { id: 'rmx-004', title: 'Dimana Kamu', artist: 'ADIP RMX', year: 2026, genre: 'Thailand', duration: '2:40', cover: 'https://i.ibb.co.com/GvNYrPw3/COVER-IMAGE-Copy-43-Copy-2-2961-CA1.png', audio: archiveDemoAudios[3] },
    { id: 'rmx-005', title: 'Rindu Semalam (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Tante V2', duration: '3:15', cover: 'https://i.ibb.co.com/cS3307nQ/COVER-IMAGE-Copy-8-3-F039-E7.png', audio: archiveDemoAudios[4] },
    { id: 'rmx-006', title: 'Karna Ada Ko (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Thailand', duration: '4:48', cover: 'https://i.ibb.co.com/wNRzsdFt/COVER-IMAGE-Copy-45-1-D17-F2-C.png', audio: archiveDemoAudios[5] },
    { id: 'rmx-007', title: 'Jangan Lupa Bahagia (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Enaff', duration: '3:19', cover: 'https://i.ibb.co.com/7tZs2Jvz/1001897546.png', audio: archiveDemoAudios[6] },
    { id: 'rmx-008', title: 'TELAHAPE', artist: 'ADIP RMX', year: 2026, genre: 'JosJis', duration: '3:35', cover: 'https://i.ibb.co.com/sJFp4VDt/COVER-IMAGE-Copy-24-1-E996-FF.png', audio: archiveDemoAudios[7] },
    { id: 'rmx-009', title: 'Tante Culik Aku Dong (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Bootleg', duration: '4:05', cover: 'https://i.ibb.co.com/Tq8MXLYg/COVER-IMAGE-47-E67-D3-A6.png', audio: archiveDemoAudios[8] },
    { id: 'rmx-010', title: 'Bukan Cinta 1 Atau 2 (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Thailand', duration: '3:14', cover: 'https://i.ibb.co.com/Mx6MMYw6/COVER-FLM-F541-E08.png', audio: archiveDemoAudios[9] },
    { id: 'rmx-011', title: 'Until I Found You (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Maman Fvndy', duration: '3:14', cover: 'https://i.ibb.co.com/Mx6MMYw6/COVER-FLM-F541-E08.png', audio: archiveDemoAudios[10] },
    { id: 'rmx-012', title: 'Dalinda (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Breakbeat', duration: '5:06', cover: 'https://i.ibb.co.com/Mx6MMYw6/COVER-FLM-F541-E08.png', audio: archiveDemoAudios[11] },
    { id: 'rmx-013', title: 'Havana Funky Edit', artist: 'ADIP RMX', year: 2024, genre: 'Latin House', duration: '3:09', cover: 'images/covers/cover-13.jpg', audio: archiveDemoAudios[12] },
    { id: 'rmx-014', title: 'Jangan Bilang Sayang (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Tante V2', duration: '3:15', cover: 'images/covers/cover-14.jpg', audio: archiveDemoAudios[13] },
    { id: 'rmx-015', title: 'Surat Cinta Untuk Starla (Remix)', artist: 'ADIP RMX', year: 2024, genre: 'Chill Remix', duration: '3:28', cover: 'images/covers/cover-15.jpg', audio: archiveDemoAudios[14] },
    { id: 'rmx-016', title: 'Asal Kau Bahagia (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Future House', duration: '3:11', cover: 'images/covers/cover-16.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-017', title: 'Pamer Bojo (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Dutch House', duration: '2:58', cover: 'images/covers/cover-17.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-018', title: 'Korban Janji (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Melbourne Bounce', duration: '3:04', cover: 'images/covers/cover-18.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-019', title: 'Welas Hang Ring Kene (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Breakbeat', duration: '3:19', cover: 'images/covers/cover-19.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-020', title: 'Sial (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Funky House', duration: '3:02', cover: 'images/covers/cover-20.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-021', title: 'Komang (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Chill Remix', duration: '3:26', cover: 'images/covers/cover-21.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-022', title: 'Ojo Dibandingke (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Dangdut House', duration: '3:08', cover: 'images/covers/cover-22.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-023', title: 'Rungkad (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Breakbeat', duration: '2:52', cover: 'images/covers/cover-23.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-024', title: 'Satru 2 (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Dutch House', duration: '3:14', cover: 'images/covers/cover-24.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-025', title: 'Karena Kamu (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Future Bass', duration: '3:21', cover: 'images/covers/cover-25.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-026', title: 'Melamarmu (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Tropical House', duration: '3:06', cover: 'images/covers/cover-26.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-027', title: 'Temenan Biasa (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Funky House', duration: '2:57', cover: 'images/covers/cover-27.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-028', title: 'Iri Bilang Bos (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Big Room', duration: '3:13', cover: 'images/covers/cover-28.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-029', title: 'Jangan Rubah Takdirku (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Mashup', duration: '3:31', cover: 'images/covers/cover-29.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-030', title: 'Sepine Wengi (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Chill Remix', duration: '3:25', cover: 'images/covers/cover-30.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-031', title: 'Tak Gendong (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Dangdut House', duration: '3:03', cover: 'images/covers/cover-31.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-032', title: 'Ngawi Nagih Janji (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Breakbeat', duration: '2:55', cover: 'images/covers/cover-32.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-033', title: 'Cidro 2 (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Melbourne Bounce', duration: '3:17', cover: 'images/covers/cover-33.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-034', title: 'Salah Tompo (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Dutch House', duration: '3:09', cover: 'images/covers/cover-34.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-035', title: 'Angin Dalu (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Chill Remix', duration: '3:29', cover: 'images/covers/cover-35.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-036', title: 'Lelaki Cadangan (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Future House', duration: '3:05', cover: 'images/covers/cover-36.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-037', title: 'Stecu Stecu (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Funky House', duration: '2:49', cover: 'images/covers/cover-37.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-038', title: 'Rungkad Ente (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Breakbeat', duration: '3:16', cover: 'images/covers/cover-38.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-039', title: 'Sambel Terasi (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Electro House', duration: '2:58', cover: 'images/covers/cover-39.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-040', title: 'Cinta Terlarang (Remix)', artist: 'ADIP RMX', year: 2025, genre: 'Mashup', duration: '3:24', cover: 'images/covers/cover-40.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-041', title: 'Malam Ini (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Tech House', duration: '3:08', cover: 'images/covers/cover-41.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-042', title: 'Janji Putih (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Future Bass', duration: '3:19', cover: 'images/covers/cover-42.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-043', title: 'Bukan Jodohnya (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Chill Remix', duration: '3:27', cover: 'images/covers/cover-43.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-044', title: 'Terpaksa Ku Lepaskan (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Melbourne Bounce', duration: '3:12', cover: 'images/covers/cover-44.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-045', title: 'Sisa Rasa (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Tropical House', duration: '3:04', cover: 'images/covers/cover-45.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-046', title: 'Kasmaran (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Funky House', duration: '2:53', cover: 'images/covers/cover-46.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-047', title: 'Sugeng Dalu (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Dangdut House', duration: '3:21', cover: 'images/covers/cover-47.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-048', title: 'Los Dol (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Breakbeat', duration: '3:06', cover: 'images/covers/cover-48.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-049', title: 'Lintang Ati (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Dutch House', duration: '3:15', cover: 'images/covers/cover-49.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-050', title: 'Pupus (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Future House', duration: '3:10', cover: 'images/covers/cover-50.jpg', audio: archiveDemoAudios[4] },
    { id: 'rmx-051', title: 'Dalan Liyane (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Chill Remix', duration: '3:30', cover: 'images/covers/cover-51.jpg', audio: archiveDemoAudios[0] },
    { id: 'rmx-052', title: 'Banyu Moto (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Tropical House', duration: '3:02', cover: 'images/covers/cover-52.jpg', audio: archiveDemoAudios[1] },
    { id: 'rmx-053', title: 'Kependem Tresno (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Funky House', duration: '3:18', cover: 'images/covers/cover-53.jpg', audio: archiveDemoAudios[2] },
    { id: 'rmx-054', title: 'Widodari (Remix)', artist: 'ADIP RMX', year: 2026, genre: 'Melbourne Bounce', duration: '3:07', cover: 'images/covers/cover-54.jpg', audio: archiveDemoAudios[3] },
    { id: 'rmx-055', title: 'Lowkey Anthem (Original Mix)', artist: 'Adip Lowkey', year: 2026, genre: 'Big Room', duration: '3:33', cover: 'images/covers/cover-55.jpg', audio: archiveDemoAudios[4] }
];
