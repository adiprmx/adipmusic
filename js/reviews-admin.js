/* ========================================================================
   ADIP RMX — Panel Admin: Moderasi Ulasan
   Membutuhkan: js/reviews-config.js, dan admin.html sudah memuat Firebase
   Auth (js/auth-engine.js + js/admin.js) sebelum file ini.
   Semua aksi (approve/reject/delete/verify) dikirim ke api/moderate-reviews.js
   yang memakai Supabase Service Role Key di sisi server — tidak pernah
   terekspos ke browser.
   ======================================================================== */

(function () {
    'use strict';

    var currentTab = 'pending';
    var allReviews = [];

    // Chaining ke window.initAdminDashboard yang sudah didefinisikan oleh
    // inline script admin.html, supaya kedua init function tetap jalan.
    var previousInit = window.initAdminDashboard;
    window.initAdminDashboard = function () {
        if (typeof previousInit === 'function') previousInit();
        initReviewModeration();
    };

    function initReviewModeration() {
        bindTabs();
        loadReviews();
    }

    function bindTabs() {
        var tabs = document.getElementById('reviewTabs');
        if (!tabs || tabs.dataset.bound) return;
        tabs.dataset.bound = '1';
        tabs.addEventListener('click', function (e) {
            var btn = e.target.closest('.txn-tab');
            if (!btn) return;
            tabs.querySelectorAll('.txn-tab').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-review-status');
            renderReviewList();
        });
    }

    function getIdToken() {
        var user = firebase.auth().currentUser;
        if (!user) return Promise.reject(new Error('Belum login.'));
        return user.getIdToken();
    }

    function callModerationApi(payload) {
        return getIdToken().then(function (idToken) {
            return fetch('/api/moderate-reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.assign({ idToken: idToken }, payload))
            }).then(function (r) { return r.json(); });
        });
    }

    function loadReviews() {
        var wrap = document.getElementById('reviewModerationList');
        if (wrap) wrap.innerHTML = '<p class="hint">Memuat ulasan...</p>';
        callModerationApi({ action: 'list' }).then(function (res) {
            if (!res.success) {
                if (wrap) wrap.innerHTML = '<p class="hint">Gagal memuat: ' + escapeHtml(res.message || '') + '</p>';
                return;
            }
            allReviews = res.reviews || [];
            renderReviewList();
        }).catch(function (err) {
            if (wrap) wrap.innerHTML = '<p class="hint">Gagal memuat ulasan. Cek koneksi/API.</p>';
            console.error(err);
        });
    }

    function renderReviewList() {
        var wrap = document.getElementById('reviewModerationList');
        if (!wrap) return;

        var filtered = allReviews.filter(function (r) {
            return currentTab === 'all' ? true : r.status === currentTab;
        });

        if (filtered.length === 0) {
            wrap.innerHTML = '<p class="hint">Tidak ada ulasan di kategori ini.</p>';
            return;
        }

        wrap.innerHTML = filtered.map(renderReviewRow).join('');
    }

    function renderReviewRow(r) {
        var kind = r.parent_id ? 'Balasan' : 'Ulasan';
        var stars = r.rating ? '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) : '-';
        var mediaCount = (r.media || []).length;
        return '' +
            '<div class="review-mod-row" style="border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:10px;">' +
            '  <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">' +
            '    <div>' +
            '      <b>' + escapeHtml(r.name) + '</b> ' +
            '      <span style="opacity:.6;font-size:.8em;">(' + kind + (r.is_verified ? ', Verified Buyer' : '') + ')</span><br>' +
            '      <span style="color:#ffb703;">' + stars + '</span>' +
            (mediaCount ? ' &nbsp;<i class="fas fa-paperclip"></i> ' + mediaCount + ' media' : '') +
            '      <p style="margin-top:6px;">' + escapeHtml(r.message) + '</p>' +
            '      <span style="font-size:.75em;opacity:.6;">' + new Date(r.created_at).toLocaleString('id-ID') + ' — status: ' + r.status + '</span>' +
            '    </div>' +
            '    <div style="display:flex;flex-direction:column;gap:6px;min-width:130px;">' +
            (r.status !== 'approved' ? '<button type="button" class="secondary" data-action="approve" data-id="' + r.id + '"><i class="fas fa-check"></i> Setujui</button>' : '') +
            (r.status !== 'rejected' ? '<button type="button" class="secondary" data-action="reject" data-id="' + r.id + '"><i class="fas fa-ban"></i> Tolak</button>' : '') +
            (!r.is_verified ? '<button type="button" class="secondary" data-action="verify" data-id="' + r.id + '"><i class="fas fa-circle-check"></i> Verified Buyer</button>' : '') +
            '      <button type="button" class="secondary" data-action="delete" data-id="' + r.id + '"><i class="fas fa-trash"></i> Hapus</button>' +
            '    </div>' +
            '  </div>' +
            '</div>';
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action][data-id]');
        if (!btn || !btn.closest('#reviewModerationList')) return;
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');

        if (action === 'delete' && !confirm('Yakin hapus ulasan ini secara permanen?')) return;

        btn.disabled = true;
        callModerationApi({ action: action, reviewId: id }).then(function (res) {
            if (!res.success) {
                alert('Gagal: ' + (res.message || 'Terjadi kesalahan.'));
                btn.disabled = false;
                return;
            }
            loadReviews();
        }).catch(function (err) {
            alert('Gagal menghubungi server.');
            console.error(err);
            btn.disabled = false;
        });
    });

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
})();
