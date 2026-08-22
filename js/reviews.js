/* ========================================================================
   ADIP RMX — Sistem Ulasan Interaktif (Reviews Widget)
   Dark Glassmorphism · Supabase Backend · Moderasi Pending/Approved
   ========================================================================
   Membutuhkan (di-load SEBELUM file ini, lihat index.html):
     - https://unpkg.com/@supabase/supabase-js@2 (CDN, global `supabase`)
     - js/reviews-config.js
   ======================================================================== */

(function () {
    'use strict';

    if (typeof window.supabase === 'undefined') {
        console.error('[Reviews] Supabase SDK belum ter-load. Cek urutan <script> di index.html.');
        return;
    }

    var sb = window.supabase.createClient(REVIEWS_SUPABASE_URL, REVIEWS_SUPABASE_ANON_KEY);

    // ------------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------------
    var state = {
        all: [],            // semua review approved (flat, sudah termasuk reply)
        tree: [],           // review utama + nested replies tersusun
        filter: 'all',      // all | 5 | 4 | 3 | 2 | 1 | media
        visibleCount: REVIEWS_PAGE_SIZE,
        clientId: getClientId()
    };

    function getClientId() {
        var k = 'adip_reviews_client_id';
        var v = localStorage.getItem(k);
        if (!v) {
            v = 'c_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
            localStorage.setItem(k, v);
        }
        return v;
    }

    // ------------------------------------------------------------------
    // BADWORDS FILTER
    // ------------------------------------------------------------------
    function censorText(text) {
        if (!text) return text;
        var out = text;
        REVIEWS_BADWORDS.forEach(function (word) {
            var escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var re = new RegExp('\\b' + escaped + '\\b', 'gi');
            out = out.replace(re, function (match) {
                return REVIEWS_BADWORD_MASK_CHAR.repeat(match.length);
            });
        });
        return out;
    }

    // ------------------------------------------------------------------
    // INIT — dipanggil setelah DOM siap
    // ------------------------------------------------------------------
    function init() {
        var mount = document.getElementById('testimonialsGrid');
        if (!mount) return;

        renderShell(mount);
        bindFormEvents();
        bindFilterEvents();
        bindLightbox();
        bindAudioPlayers();
        loadReviews();
        startRelativeTimeTicker();
        bindRealtimeSync();
    }

    // ------------------------------------------------------------------
    // SHELL / MARKUP AWAL
    // ------------------------------------------------------------------
    function renderShell(mount) {
        mount.outerHTML = ''
            + '<div class="reviews-app" id="reviewsApp">'
            + '  <div class="reviews-write glass-card" id="reviewsWrite">'
            + '    <svg class="rv-eq-svg" id="rvEqSvg" viewBox="0 0 60 28" aria-hidden="true">'
            + '      <rect class="rv-eq-bar" x="0"  y="10" width="5" height="18" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="8"  y="4"  width="5" height="24" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="16" y="12" width="5" height="16" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="24" y="0"  width="5" height="28" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="32" y="8"  width="5" height="20" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="40" y="14" width="5" height="14" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="48" y="6"  width="5" height="22" rx="1.5"></rect>'
            + '      <rect class="rv-eq-bar" x="56" y="11" width="4" height="17" rx="1.5"></rect>'
            + '    </svg>'
            + '    <h3><i class="fas fa-pen-nib"></i> Tulis Ulasan Kamu</h3>'
            + '    <p class="rv-write-note">Ulasan akan tampil setelah disetujui admin.</p>'
            + '    <form id="reviewForm" class="rv-form">'
            + '      <div class="rv-star-input" id="rvStarInput" data-value="0">'
            + '        <i class="far fa-star" data-star="1"></i><i class="far fa-star" data-star="2"></i>'
            + '        <i class="far fa-star" data-star="3"></i><i class="far fa-star" data-star="4"></i>'
            + '        <i class="far fa-star" data-star="5"></i>'
            + '      </div>'
            + '      <div class="rv-form-row">'
            + '        <input type="text" id="rvName" placeholder="Nama kamu" required maxlength="60">'
            + '        <input type="text" id="rvContact" placeholder="Email / No. WhatsApp (untuk cek Verified Buyer, tidak ditampilkan publik)" maxlength="80">'
            + '      </div>'
            + '      <textarea id="rvMessage" placeholder="Ceritakan pengalamanmu..." required maxlength="600" rows="3"></textarea>'
            + '      <div class="rv-upload-row">'
            + '        <label class="rv-upload-btn"><i class="fas fa-image"></i> Foto<input type="file" id="rvImageInput" accept="image/*" hidden></label>'
            + '        <label class="rv-upload-btn"><i class="fas fa-microphone"></i> Audio<input type="file" id="rvAudioInput" accept="audio/*" hidden></label>'
            + '        <div class="rv-upload-preview" id="rvUploadPreview"></div>'
            + '      </div>'
            + '      <div class="rv-form-footer">'
            + '        <div class="rv-form-msg" id="rvFormMsg"></div>'
            + '        <button type="submit" class="rv-submit-btn" id="rvSubmitBtn"><i class="fas fa-paper-plane"></i> Kirim Ulasan</button>'
            + '      </div>'
            + '    </form>'
            + '  </div>'
            + '  <div class="reviews-filters-wrap">'
            + '    <div class="reviews-filters" id="reviewsFilters">'
            + '      <button class="rv-filter-btn active" data-filter="all">Semua</button>'
            + '      <button class="rv-filter-btn" data-filter="5">★ 5</button>'
            + '      <button class="rv-filter-btn" data-filter="4">★ 4</button>'
            + '      <button class="rv-filter-btn" data-filter="3">★ 3</button>'
            + '      <button class="rv-filter-btn" data-filter="2">★ 2</button>'
            + '      <button class="rv-filter-btn" data-filter="1">★ 1</button>'
            + '      <button class="rv-filter-btn" data-filter="media"><i class="fas fa-image"></i> Dengan Media</button>'
            + '    </div>'
            + '  </div>'
            + '  <div class="reviews-list" id="reviewsList">' + skeletonHtml() + '</div>'
            + '  <div class="reviews-loadmore-wrap"><button id="reviewsLoadMore" class="rv-loadmore hidden">Muat Lebih Banyak</button></div>'
            + '</div>';
    }

    // ------------------------------------------------------------------
    // LOAD REVIEWS DARI SUPABASE
    // ------------------------------------------------------------------
    function loadReviews() {
        sb.from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .then(function (res) {
                if (res.error) throw res.error;
                state.all = res.data || [];
                state.tree = buildTree(state.all);
                renderList();
                loadReactionCounts();
            })
            .catch(function (err) {
                console.error('[Reviews] Gagal memuat ulasan:', err);
                var list = document.getElementById('reviewsList');
                if (list) list.innerHTML = emptyStateHtml('Belum Ada Ulasan', 'Jadilah yang pertama menceritakan pengalamanmu di testi ini');
            });
    }

    function buildTree(flat) {
        var byId = {};
        flat.forEach(function (r) { byId[r.id] = Object.assign({}, r, { replies: [] }); });
        var roots = [];
        flat.forEach(function (r) {
            if (r.parent_id && byId[r.parent_id]) {
                byId[r.parent_id].replies.push(byId[r.id]);
            } else if (!r.parent_id) {
                roots.push(byId[r.id]);
            }
        });
        return roots;
    }

    // ------------------------------------------------------------------
    // REALTIME SYNC (Supabase postgres_changes) — TANPA RELOAD HALAMAN
    // Ulasan/balasan baru yang sudah di-approve, perubahan status
    // (pending -> approved/rejected), dan update reactions langsung
    // tersinkron ke semua pengunjung yang sedang membuka halaman ini
    // dalam hitungan detik.
    // ------------------------------------------------------------------
    function bindRealtimeSync() {
        sb.channel('reviews-public-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, function (payload) {
                handleRealtimeReviewChange(payload);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'review_reactions' }, function () {
                // Reaction count sudah disimpan juga di kolom reviews.reactions,
                // jadi cukup refresh ringan data reviews saat ada perubahan reaksi.
                refreshReviewsQuiet();
            })
            .subscribe();
    }

    function handleRealtimeReviewChange(payload) {
        var row = payload.new && Object.keys(payload.new).length ? payload.new : payload.old;
        if (!row) return;

        if (payload.eventType === 'DELETE') {
            state.all = state.all.filter(function (r) { return r.id !== row.id; });
            state.tree = buildTree(state.all);
            renderList();
            return;
        }

        // Hanya ulasan berstatus approved yang boleh tampil publik.
        var idx = state.all.findIndex(function (r) { return r.id === row.id; });
        var isApproved = row.status === 'approved';

        var freshId = null;

        if (isApproved) {
            if (idx > -1) {
                state.all[idx] = row;
            } else {
                state.all.unshift(row);
                freshId = row.parent_id || row.id;
                showToast((row.parent_id ? 'Balasan baru' : 'Ulasan baru') + ' baru saja masuk!');
            }
        } else if (idx > -1) {
            // Sebelumnya approved lalu diubah jadi pending/rejected -> hapus dari tampilan
            state.all.splice(idx, 1);
        }

        state.tree = buildTree(state.all);
        renderList();
        if (freshId) animateCardEntrance(freshId);
    }

    // Fade-in + slide-up halus untuk kartu ulasan yang baru masuk secara realtime.
    function animateCardEntrance(reviewId) {
        requestAnimationFrame(function () {
            var el = document.querySelector('.rv-card[data-review-id="' + reviewId + '"]');
            if (!el) return;
            el.classList.add('rv-card-enter');
            el.addEventListener('animationend', function () {
                el.classList.remove('rv-card-enter');
            }, { once: true });
        });
    }

    // Ambil ulang data terbaru dari server tanpa memunculkan indikator loading,
    // dipakai saat ada perubahan reaction supaya angka reaction ikut update.
    function refreshReviewsQuiet() {
        sb.from('reviews')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false })
            .then(function (res) {
                if (res.error) return;
                state.all = res.data || [];
                state.tree = buildTree(state.all);
                renderList();
            });
    }

    // ------------------------------------------------------------------
    // FILTER
    // ------------------------------------------------------------------
    function bindFilterEvents() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.rv-filter-btn');
            if (!btn) return;
            document.querySelectorAll('.rv-filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.filter = btn.getAttribute('data-filter');
            state.visibleCount = REVIEWS_PAGE_SIZE;
            renderList();
        });

        document.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'reviewsLoadMore') {
                state.visibleCount += REVIEWS_PAGE_SIZE;
                renderList();
            }
        });
    }

    function filteredRoots() {
        return state.tree.filter(function (r) {
            if (state.filter === 'all') return true;
            if (state.filter === 'media') return Array.isArray(r.media) && r.media.length > 0;
            return String(r.rating) === state.filter;
        });
    }

    // ------------------------------------------------------------------
    // RENDER LIST
    // ------------------------------------------------------------------
    function renderList() {
        var list = document.getElementById('reviewsList');
        var loadMoreBtn = document.getElementById('reviewsLoadMore');
        if (!list) return;

        var roots = filteredRoots();
        if (roots.length === 0) {
            list.innerHTML = emptyStateHtml('No Audio Reviews Yet', 'Belum ada ulasan pada channel filter ini. Coba pilih filter lain.');
            loadMoreBtn.classList.add('hidden');
            return;
        }

        var visible = roots.slice(0, state.visibleCount);
        list.innerHTML = visible.map(renderCard).join('');

        if (visible.length < roots.length) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    // Skeleton loader shimmer monokrom — dipakai saat pertama kali memuat dari Supabase.
    function skeletonHtml() {
        var card = ''
            + '<div class="rv-skeleton-card">'
            + '  <div class="rv-skeleton-head">'
            + '    <div class="rv-skeleton rv-skeleton-avatar"></div>'
            + '    <div class="rv-skeleton-lines">'
            + '      <div class="rv-skeleton rv-skeleton-line rv-skeleton-line-sm"></div>'
            + '      <div class="rv-skeleton rv-skeleton-line rv-skeleton-line-xs"></div>'
            + '    </div>'
            + '  </div>'
            + '  <div class="rv-skeleton rv-skeleton-line"></div>'
            + '  <div class="rv-skeleton rv-skeleton-line rv-skeleton-line-w80"></div>'
            + '  <div class="rv-skeleton rv-skeleton-line rv-skeleton-line-w60"></div>'
            + '</div>';
        return '<div class="rv-skeleton-wrap">' + card + card + card + '</div>';
    }

    // Empty state ala interface audio plugin ("No Audio Reviews Yet").
    function emptyStateHtml(title, subtitle) {
        return ''
            + '<div class="rv-empty">'
            + '  <div class="rv-empty-waveform" aria-hidden="true">'
            + '    <span></span><span></span><span></span><span></span><span></span>'
            + '    <span></span><span></span><span></span><span></span><span></span>'
            + '  </div>'
            + '  <div class="rv-empty-icon"><i class="fas fa-wave-square"></i></div>'
            + '  <h4 class="rv-empty-title">' + escapeHtml(title) + '</h4>'
            + '  <p class="rv-empty-sub">' + escapeHtml(subtitle) + '</p>'
            + '</div>';
    }

    function starsHtml(rating) {
        var out = '';
        for (var i = 1; i <= 5; i++) {
            out += '<i class="' + (i <= rating ? 'fas' : 'far') + ' fa-star"></i>';
        }
        return out;
    }

    function initials(name) {
        return (name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    }

    // Bar waveform statis dekoratif (seed dari url biar konsisten tiap render, bukan acak ulang)
    function waveformBarsHtml(seedStr) {
        var seed = 0;
        for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
        var bars = '';
        for (var b = 0; b < 40; b++) {
            seed = (seed * 1103515245 + 12345) >>> 0;
            var h = 20 + (seed % 100) * 0.65;
            bars += '<span style="height:' + h.toFixed(1) + '%"></span>';
        }
        return bars;
    }

    function mediaHtml(media) {
        if (!media || !media.length) return '';
        return '<div class="rv-media-grid">' + media.map(function (m) {
            if (m.type === 'image') {
                return '<div class="rv-media-item rv-media-image" data-lightbox-src="' + escapeAttr(m.url) + '"><img src="' + escapeAttr(m.url) + '" loading="lazy" alt="Media ulasan"></div>';
            }
            return ''
                + '<div class="rv-media-item rv-media-audio rv-audio-player" data-audio-src="' + escapeAttr(m.url) + '">'
                + '  <audio class="rv-audio-el" preload="metadata" src="' + escapeAttr(m.url) + '"></audio>'
                + '  <button type="button" class="rv-audio-toggle" aria-label="Putar audio"><i class="fas fa-play"></i></button>'
                + '  <div class="rv-audio-waveform">' + waveformBarsHtml(m.url || 'a') + '<div class="rv-audio-progress"></div></div>'
                + '  <span class="rv-audio-time">0:00</span>'
                + '</div>';
        }).join('') + '</div>';
    }

    function reactionsHtml(review) {
        var counts = review.reactions || {};
        return '<div class="rv-reactions" data-review-id="' + review.id + '">' +
            REVIEWS_REACTIONS.map(function (emoji) {
                var c = counts[emoji] || 0;
                return '<button class="rv-reaction-btn" data-emoji="' + emoji + '" data-review-id="' + review.id + '">' +
                    emoji + (c > 0 ? '<span class="rv-reaction-count">' + c + '</span>' : '') + '</button>';
            }).join('') + '</div>';
    }

    function renderCard(review) {
        var repliesHtml = (review.replies || []).map(function (rep) {
            return '' +
                '<div class="rv-reply-card">' +
                '  <div class="rv-card-head">' +
                '    <div class="rv-avatar rv-avatar-sm">' + initials(rep.name) + '</div>' +
                '    <div class="rv-card-headinfo">' +
                '      <span class="rv-name">' + escapeHtml(rep.name) + (rep.is_verified ? ' <span class="rv-badge-verified"><i class="fas fa-circle-check"></i> Verified Buyer</span>' : '') + '</span>' +
                '      <span class="rv-date" data-rv-timestamp="' + escapeAttr(rep.created_at) + '" title="' + escapeAttr(formatFullDateWIB(rep.created_at)) + '">' + formatRelativeTime(rep.created_at) + '</span>' +
                '    </div>' +
                '  </div>' +
                '  <p class="rv-text">' + escapeHtml(rep.message) + '</p>' +
                mediaHtml(rep.media) +
                reactionsHtml(rep) +
                '</div>';
        }).join('');

        return '' +
            '<div class="rv-card glass-card" data-review-id="' + review.id + '">' +
            '  <div class="rv-card-head">' +
            '    <div class="rv-avatar">' + initials(review.name) + '</div>' +
            '    <div class="rv-card-headinfo">' +
            '      <span class="rv-name">' + escapeHtml(review.name) + (review.is_verified ? ' <span class="rv-badge-verified"><i class="fas fa-circle-check"></i> Verified Buyer</span>' : '') + '</span>' +
            '      <div class="rv-stars">' + starsHtml(review.rating || 0) + '</div>' +
            '    </div>' +
            '    <span class="rv-date" data-rv-timestamp="' + escapeAttr(review.created_at) + '" title="' + escapeAttr(formatFullDateWIB(review.created_at)) + '">' + formatRelativeTime(review.created_at) + '</span>' +
            '  </div>' +
            (review.product_tag ? '<span class="rv-product-tag">' + escapeHtml(review.product_tag) + '</span>' : '') +
            '  <p class="rv-text">' + escapeHtml(review.message) + '</p>' +
            mediaHtml(review.media) +
            reactionsHtml(review) +
            '  <div class="rv-actions">' +
            '    <button class="rv-reply-toggle" data-review-id="' + review.id + '"><i class="fas fa-reply"></i> Balas</button>' +
            '  </div>' +
            '  <div class="rv-reply-form-wrap hidden" id="rv-reply-form-' + review.id + '">' +
            '    <input type="text" class="rv-reply-name" placeholder="Nama kamu" maxlength="60">' +
            '    <textarea class="rv-reply-text" placeholder="Tulis balasan..." maxlength="400" rows="2"></textarea>' +
            '    <button class="rv-reply-submit" data-review-id="' + review.id + '"><i class="fas fa-paper-plane"></i> Kirim Balasan</button>' +
            '  </div>' +
            '  <div class="rv-replies">' + repliesHtml + '</div>' +
            '</div>';
    }

    function formatDate(iso) {
        try {
            var d = new Date(iso);
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) { return ''; }
    }

    // Tooltip lengkap: DD/MM/YYYY - HH:mm:ss WIB
    function formatFullDateWIB(iso) {
        try {
            var d = new Date(iso);
            var parts = new Intl.DateTimeFormat('id-ID', {
                timeZone: 'Asia/Jakarta',
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            }).formatToParts(d);
            var map = {};
            parts.forEach(function (p) { map[p.type] = p.value; });
            return map.day + '/' + map.month + '/' + map.year + ' - ' + map.hour + ':' + map.minute + ':' + map.second + ' WIB';
        } catch (e) { return ''; }
    }

    // "Baru saja" / "10 detik yang lalu" / "5 menit yang lalu" / dst.
    function formatRelativeTime(iso) {
        var then = new Date(iso).getTime();
        if (isNaN(then)) return '';
        var diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));

        if (diffSec < 10) return 'Baru saja';
        if (diffSec < 60) return diffSec + ' detik yang lalu';
        var diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return diffMin + ' menit yang lalu';
        var diffHour = Math.floor(diffMin / 60);
        if (diffHour < 24) return diffHour + ' jam yang lalu';
        var diffDay = Math.floor(diffHour / 24);
        if (diffDay < 7) return diffDay + ' hari yang lalu';
        var diffWeek = Math.floor(diffDay / 7);
        if (diffDay < 30) return diffWeek + ' minggu yang lalu';
        var diffMonth = Math.floor(diffDay / 30);
        if (diffDay < 365) return diffMonth + ' bulan yang lalu';
        var diffYear = Math.floor(diffDay / 365);
        return diffYear + ' tahun yang lalu';
    }

    // Ticker global: update semua elemen [data-rv-timestamp] tiap 1 detik,
    // tanpa reload / re-render ulang seluruh list (hemat & mulus).
    var relativeTimeTicker = null;
    function startRelativeTimeTicker() {
        if (relativeTimeTicker) return;
        relativeTimeTicker = setInterval(function () {
            document.querySelectorAll('[data-rv-timestamp]').forEach(function (el) {
                var iso = el.getAttribute('data-rv-timestamp');
                el.textContent = formatRelativeTime(iso);
            });
        }, 1000);
    }

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function escapeAttr(str) { return escapeHtml(str); }

    // ------------------------------------------------------------------
    // REPLY (nested) — event delegation
    // ------------------------------------------------------------------
    document.addEventListener('click', function (e) {
        var toggle = e.target.closest('.rv-reply-toggle');
        if (toggle) {
            var id = toggle.getAttribute('data-review-id');
            var wrap = document.getElementById('rv-reply-form-' + id);
            if (wrap) wrap.classList.toggle('hidden');
            return;
        }

        var submitBtn = e.target.closest('.rv-reply-submit');
        if (submitBtn) {
            var reviewId = submitBtn.getAttribute('data-review-id');
            var wrap2 = document.getElementById('rv-reply-form-' + reviewId);
            var nameInput = wrap2.querySelector('.rv-reply-name');
            var textInput = wrap2.querySelector('.rv-reply-text');
            var name = (nameInput.value || 'Anonim').trim();
            var text = (textInput.value || '').trim();
            if (!text) return;

            submitBtn.disabled = true;
            sb.from('reviews').insert({
                parent_id: reviewId,
                name: name || 'Anonim',
                message: censorText(text),
                rating: null
            }).then(function (res) {
                submitBtn.disabled = false;
                if (res.error) {
                    alert('Gagal mengirim balasan. Coba lagi.');
                    console.error(res.error);
                    return;
                }
                nameInput.value = '';
                textInput.value = '';
                wrap2.classList.add('hidden');
                showToast('Balasan terkirim! Menunggu persetujuan admin.');
            });
        }
    });

    // ------------------------------------------------------------------
    // REACTIONS (emoji)
    // ------------------------------------------------------------------
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.rv-reaction-btn');
        if (!btn) return;
        var reviewId = btn.getAttribute('data-review-id');
        var emoji = btn.getAttribute('data-emoji');

        sb.from('review_reactions').insert({
            review_id: reviewId,
            client_id: state.clientId,
            emoji: emoji
        }).then(function (res) {
            if (res.error) {
                if (res.error.code === '23505') {
                    showToast('Kamu sudah memberi reaksi ini.');
                } else {
                    console.error(res.error);
                }
                return;
            }
            bumpReactionCount(reviewId, emoji, btn);
            incrementStoredReactionCount(reviewId, emoji);
        });
    });

    function bumpReactionCount(reviewId, emoji, btn) {
        var countEl = btn.querySelector('.rv-reaction-count');
        var current = countEl ? parseInt(countEl.textContent, 10) : 0;
        var next = current + 1;
        if (countEl) {
            countEl.textContent = next;
        } else {
            btn.insertAdjacentHTML('beforeend', '<span class="rv-reaction-count">' + next + '</span>');
        }
        btn.classList.add('rv-reacted');
    }

    function incrementStoredReactionCount(reviewId, emoji) {
        sb.from('reviews').select('reactions').eq('id', reviewId).single().then(function (res) {
            if (res.error || !res.data) return;
            var reactions = res.data.reactions || {};
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            sb.from('reviews').update({ reactions: reactions }).eq('id', reviewId);
        });
    }

    function loadReactionCounts() {
        // Reaction counts sudah ikut terbaca dari kolom `reactions` saat loadReviews().
        // Fungsi ini tersedia sebagai hook jika ingin sinkronisasi realtime tambahan.
    }

    // ------------------------------------------------------------------
    // LIGHTBOX (preview gambar)
    // ------------------------------------------------------------------
    function bindLightbox() {
        var overlay = document.createElement('div');
        overlay.className = 'rv-lightbox hidden';
        overlay.id = 'rvLightbox';
        overlay.innerHTML = ''
            + '<div class="rv-lightbox-frame">'
            + '  <span class="rv-lightbox-close">&times;</span>'
            + '  <img id="rvLightboxImg" src="" alt="Preview">'
            + '</div>';
        document.body.appendChild(overlay);

        document.addEventListener('click', function (e) {
            var item = e.target.closest('[data-lightbox-src]');
            if (item) {
                document.getElementById('rvLightboxImg').src = item.getAttribute('data-lightbox-src');
                overlay.classList.remove('hidden');
                requestAnimationFrame(function () { overlay.classList.add('rv-lightbox-show'); });
                return;
            }
            if (e.target === overlay || e.target.classList.contains('rv-lightbox-close')) {
                overlay.classList.remove('rv-lightbox-show');
                setTimeout(function () { overlay.classList.add('hidden'); }, 200);
            }
        });
    }

    // ------------------------------------------------------------------
    // AUDIO PLAYER — Waveform Track Controller monokrom (event delegation)
    // ------------------------------------------------------------------
    function bindAudioPlayers() {
        function formatTime(sec) {
            if (!isFinite(sec) || isNaN(sec)) return '0:00';
            var m = Math.floor(sec / 60);
            var s = Math.floor(sec % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        document.addEventListener('click', function (e) {
            var toggleBtn = e.target.closest('.rv-audio-toggle');
            if (toggleBtn) {
                var wrap = toggleBtn.closest('.rv-audio-player');
                var audio = wrap.querySelector('.rv-audio-el');
                var icon = toggleBtn.querySelector('i');

                document.querySelectorAll('.rv-audio-el').forEach(function (other) {
                    if (other !== audio && !other.paused) {
                        other.pause();
                        var otherWrap = other.closest('.rv-audio-player');
                        otherWrap.classList.remove('rv-audio-playing');
                        var otherIcon = otherWrap.querySelector('.rv-audio-toggle i');
                        if (otherIcon) { otherIcon.className = 'fas fa-play'; }
                    }
                });

                if (audio.paused) {
                    audio.play().catch(function () {});
                    wrap.classList.add('rv-audio-playing');
                    icon.className = 'fas fa-pause';
                } else {
                    audio.pause();
                    wrap.classList.remove('rv-audio-playing');
                    icon.className = 'fas fa-play';
                }
                return;
            }

            var waveform = e.target.closest('.rv-audio-waveform');
            if (waveform) {
                var wf = waveform.closest('.rv-audio-player');
                var a = wf.querySelector('.rv-audio-el');
                if (!a.duration) return;
                var rect = waveform.getBoundingClientRect();
                var ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                a.currentTime = ratio * a.duration;
            }
        });

        document.addEventListener('timeupdate', function (e) {
            if (!e.target.classList || !e.target.classList.contains('rv-audio-el')) return;
            var wrap = e.target.closest('.rv-audio-player');
            if (!wrap) return;
            var progress = wrap.querySelector('.rv-audio-progress');
            var timeEl = wrap.querySelector('.rv-audio-time');
            var pct = e.target.duration ? (e.target.currentTime / e.target.duration) * 100 : 0;
            if (progress) progress.style.width = pct + '%';
            if (timeEl) timeEl.textContent = formatTime(e.target.duration ? e.target.duration - e.target.currentTime : e.target.currentTime);
        }, true);

        document.addEventListener('ended', function (e) {
            if (!e.target.classList || !e.target.classList.contains('rv-audio-el')) return;
            var wrap = e.target.closest('.rv-audio-player');
            if (!wrap) return;
            wrap.classList.remove('rv-audio-playing');
            var icon = wrap.querySelector('.rv-audio-toggle i');
            if (icon) icon.className = 'fas fa-play';
            var progress = wrap.querySelector('.rv-audio-progress');
            if (progress) progress.style.width = '0%';
        }, true);
    }

    // ------------------------------------------------------------------
    // FORM UTAMA (tulis ulasan baru)
    // ------------------------------------------------------------------
    var pendingUploads = { image: null, audio: null };

    function bindFormEvents() {
        document.addEventListener('click', function (e) {
            var star = e.target.closest('#rvStarInput i');
            if (star) {
                var val = parseInt(star.getAttribute('data-star'), 10);
                var container = document.getElementById('rvStarInput');
                container.setAttribute('data-value', val);
                container.querySelectorAll('i').forEach(function (s) {
                    var sv = parseInt(s.getAttribute('data-star'), 10);
                    s.className = sv <= val ? 'fas fa-star' : 'far fa-star';
                    if (sv <= val) {
                        s.classList.remove('rv-star-pop');
                        void s.offsetWidth; // restart animasi
                        s.classList.add('rv-star-pop');
                    }
                });
            }
        });

        document.addEventListener('mouseover', function (e) {
            var star = e.target.closest('#rvStarInput i');
            if (!star) return;
            var hoverVal = parseInt(star.getAttribute('data-star'), 10);
            var container = document.getElementById('rvStarInput');
            container.querySelectorAll('i').forEach(function (s) {
                var sv = parseInt(s.getAttribute('data-star'), 10);
                s.classList.toggle('fas', sv <= hoverVal);
                s.classList.toggle('far', sv > hoverVal);
            });
        });

        document.addEventListener('mouseout', function (e) {
            var container = document.getElementById('rvStarInput');
            if (!container || !e.target.closest('#rvStarInput')) return;
            if (container.contains(e.relatedTarget)) return;
            var val = parseInt(container.getAttribute('data-value'), 10) || 0;
            container.querySelectorAll('i').forEach(function (s) {
                var sv = parseInt(s.getAttribute('data-star'), 10);
                s.classList.toggle('fas', sv <= val);
                s.classList.toggle('far', sv > val);
            });
        });

        document.addEventListener('change', function (e) {
            if (e.target.id === 'rvImageInput') handleFileSelect(e.target.files[0], 'image');
            if (e.target.id === 'rvAudioInput') handleFileSelect(e.target.files[0], 'audio');
        });

        document.addEventListener('submit', function (e) {
            if (e.target.id !== 'reviewForm') return;
            e.preventDefault();
            submitReview();
        });

        // ---- Pulse glow neon pada border saat mengetik ----
        var typingTimers = {};
        document.addEventListener('input', function (e) {
            var field = e.target.closest('#reviewForm input[type="text"], #reviewForm textarea');
            if (!field) return;
            field.classList.add('rv-typing');
            clearTimeout(typingTimers[field.id]);
            typingTimers[field.id] = setTimeout(function () {
                field.classList.remove('rv-typing');
            }, 500);
        });

        // ---- Audio Equalizer SVG bergerak saat user mengetik pesan ulasan ----
        var eqActiveTimer = null;
        document.addEventListener('input', function (e) {
            if (e.target.id !== 'rvMessage') return;
            var eq = document.getElementById('rvEqSvg');
            if (!eq) return;
            eq.classList.add('rv-eq-active');
            clearTimeout(eqActiveTimer);
            eqActiveTimer = setTimeout(function () {
                eq.classList.remove('rv-eq-active');
            }, 900);
        });

        // ---- Ripple halus (haptic visual) saat klik bintang rating ----
        document.addEventListener('click', function (e) {
            var star = e.target.closest('#rvStarInput i');
            if (!star) return;
            var starRipple = document.createElement('span');
            starRipple.className = 'rv-star-ripple';
            star.appendChild(starRipple);
            starRipple.addEventListener('animationend', function () { starRipple.remove(); });
        });

        // ---- Ripple wave pada tombol kirim ----
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('#rvSubmitBtn');
            if (!btn) return;
            var rect = btn.getBoundingClientRect();
            var ripple = document.createElement('span');
            var size = Math.max(rect.width, rect.height) * 1.4;
            ripple.className = 'rv-ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', function () { ripple.remove(); });
        });
    }

    function handleFileSelect(file, type) {
        if (!file) return;
        var maxMb = type === 'image' ? REVIEWS_MAX_IMAGE_MB : REVIEWS_MAX_AUDIO_MB;
        if (file.size > maxMb * 1024 * 1024) {
            alert('Ukuran file maksimal ' + maxMb + ' MB.');
            return;
        }
        pendingUploads[type] = file;
        renderUploadPreview();
    }

    function renderUploadPreview() {
        var box = document.getElementById('rvUploadPreview');
        var parts = [];
        if (pendingUploads.image) parts.push('<span class="rv-upload-chip"><i class="fas fa-image"></i> ' + escapeHtml(pendingUploads.image.name) + ' <a href="#" data-remove="image">&times;</a></span>');
        if (pendingUploads.audio) parts.push('<span class="rv-upload-chip"><i class="fas fa-microphone"></i> ' + escapeHtml(pendingUploads.audio.name) + ' <a href="#" data-remove="audio">&times;</a></span>');
        box.innerHTML = parts.join('');
    }

    document.addEventListener('click', function (e) {
        var rem = e.target.closest('[data-remove]');
        if (!rem) return;
        e.preventDefault();
        var type = rem.getAttribute('data-remove');
        pendingUploads[type] = null;
        renderUploadPreview();
    });

    function uploadFile(file, type) {
        var ext = file.name.split('.').pop();
        var path = type + '/' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.' + ext;
        return sb.storage.from(REVIEWS_STORAGE_BUCKET).upload(path, file).then(function (res) {
            if (res.error) throw res.error;
            var pub = sb.storage.from(REVIEWS_STORAGE_BUCKET).getPublicUrl(path);
            return { type: type, url: pub.data.publicUrl, path: path };
        });
    }

    function submitReview() {
        var msgEl = document.getElementById('rvFormMsg');
        var name = document.getElementById('rvName').value.trim();
        var contact = document.getElementById('rvContact').value.trim();
        var message = document.getElementById('rvMessage').value.trim();
        var rating = parseInt(document.getElementById('rvStarInput').getAttribute('data-value'), 10);
        var btn = document.getElementById('rvSubmitBtn');

        if (!name || !message || !rating) {
            msgEl.textContent = 'Mohon isi nama, ulasan, dan beri rating bintang.';
            msgEl.className = 'rv-form-msg error';
            return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

        var uploadPromises = [];
        if (pendingUploads.image) uploadPromises.push(uploadFile(pendingUploads.image, 'image'));
        if (pendingUploads.audio) uploadPromises.push(uploadFile(pendingUploads.audio, 'audio'));

        Promise.all(uploadPromises)
            .then(function (mediaResults) {
                return checkVerifiedBuyer(contact).then(function (isVerified) {
                    return sb.from('reviews').insert({
                        name: name,
                        email: contact.indexOf('@') > -1 ? contact : null,
                        whatsapp: contact.indexOf('@') === -1 ? contact : null,
                        rating: rating,
                        message: censorText(message),
                        media: mediaResults,
                        is_verified: isVerified
                    });
                });
            })
            .then(function (res) {
                if (res.error) throw res.error;
                msgEl.textContent = 'Terima kasih! Ulasan kamu terkirim dan menunggu persetujuan admin.';
                msgEl.className = 'rv-form-msg success';
                document.getElementById('reviewForm').reset();
                document.getElementById('rvStarInput').setAttribute('data-value', '0');
                document.querySelectorAll('#rvStarInput i').forEach(function (s) { s.className = 'far fa-star'; });
                pendingUploads = { image: null, audio: null };
                renderUploadPreview();
            })
            .catch(function (err) {
                console.error('[Reviews] Gagal submit:', err);
                msgEl.textContent = 'Terjadi kesalahan saat mengirim ulasan. Coba lagi.';
                msgEl.className = 'rv-form-msg error';
            })
            .finally(function () {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Ulasan';
            });
    }

    function checkVerifiedBuyer(contact) {
        if (!REVIEWS_VERIFIED_CHECK_ENABLED || !contact) return Promise.resolve(false);
        var isEmail = contact.indexOf('@') > -1;
        var query = sb.from('transactions').select('id').limit(1);
        query = isEmail ? query.eq('buyer_email', contact) : query.eq('buyer_whatsapp', contact);
        return query.then(function (res) {
            return !res.error && res.data && res.data.length > 0;
        }).catch(function () { return false; });
    }

    // ------------------------------------------------------------------
    // TOAST kecil
    // ------------------------------------------------------------------
    function showToast(text) {
        var t = document.createElement('div');
        t.className = 'rv-toast';
        t.textContent = text;
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('show'); }, 10);
        setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 3000);
    }

    // ------------------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
