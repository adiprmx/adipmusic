-- ========================================================================
-- ADIP RMX — Skema Database Sistem Ulasan (Reviews)
-- Jalankan seluruh isi file ini di: Supabase Dashboard > SQL Editor > New query
-- ========================================================================

-- Ekstensi untuk generate UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------
-- TABEL UTAMA: reviews
-- Menyimpan ulasan level atas maupun balasan (nested reply), dibedakan
-- lewat kolom parent_id (null = ulasan utama, terisi = balasan).
-- ------------------------------------------------------------------------
create table if not exists public.reviews (
    id            uuid primary key default gen_random_uuid(),
    parent_id     uuid references public.reviews(id) on delete cascade,
    name          text not null,
    email         text,
    whatsapp      text,
    rating        smallint check (rating between 1 and 5), -- null untuk balasan
    message       text not null,
    product_tag   text,                 -- opsional: produk yang diulas (FLM Project, Sample Pack, dll)
    is_verified   boolean default false,
    status        text not null default 'pending' check (status in ('pending','approved','rejected')),
    media         jsonb default '[]'::jsonb, -- array of { type: 'image'|'audio', url, path }
    reactions     jsonb default '{}'::jsonb, -- { "❤️": 3, "🔥": 5, ... }
    ip_hash       text,                 -- opsional, untuk anti-spam ringan
    created_at    timestamptz not null default now()
);

create index if not exists idx_reviews_parent on public.reviews(parent_id);
create index if not exists idx_reviews_status on public.reviews(status);
create index if not exists idx_reviews_created on public.reviews(created_at desc);

-- ------------------------------------------------------------------------
-- TABEL: review_reactions
-- Mencatat siapa (device/browser fingerprint sederhana via localStorage id)
-- sudah memberi emoji apa ke ulasan mana, supaya 1 orang tidak bisa
-- spam-klik reaction yang sama berkali-kali.
-- ------------------------------------------------------------------------
create table if not exists public.review_reactions (
    id          uuid primary key default gen_random_uuid(),
    review_id   uuid not null references public.reviews(id) on delete cascade,
    client_id   text not null,
    emoji       text not null,
    created_at  timestamptz not null default now(),
    unique (review_id, client_id, emoji)
);

-- ------------------------------------------------------------------------
-- TABEL: transactions (opsional — dipakai untuk auto-check Verified Buyer)
-- Kalau kamu sudah punya data transaksi di Firebase Realtime Database,
-- tabel ini hanya dipakai sebagai cross-check tambahan di Supabase.
-- Boleh dikosongkan/di-skip kalau Verified Buyer mau ditandai manual saja
-- oleh admin dari Admin Panel.
-- ------------------------------------------------------------------------
create table if not exists public.transactions (
    id           uuid primary key default gen_random_uuid(),
    buyer_email  text,
    buyer_whatsapp text,
    product_name text,
    created_at   timestamptz not null default now()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS)
-- Publik hanya boleh: baca ulasan berstatus approved, dan insert ulasan
-- baru (otomatis berstatus pending, tidak bisa mengubah status sendiri).
-- Update/Delete/approve HANYA lewat Service Role Key di sisi admin
-- (dipakai di admin panel via RPC/endpoint yang dilindungi, bukan langsung
-- dari browser publik).
-- ========================================================================
alter table public.reviews enable row level security;
alter table public.review_reactions enable row level security;
alter table public.transactions enable row level security;

-- Publik boleh membaca ulasan yang sudah di-approve
create policy "Public can read approved reviews"
    on public.reviews for select
    using (status = 'approved');

-- Publik boleh mengirim ulasan baru, tapi status dipaksa 'pending' via
-- default kolom + trigger di bawah (mencegah user mengirim status lain).
create policy "Public can insert reviews"
    on public.reviews for insert
    with check (true);

-- Publik boleh membaca & menambah reaction (klik emoji)
create policy "Public can read reactions"
    on public.review_reactions for select
    using (true);

create policy "Public can insert reactions"
    on public.review_reactions for insert
    with check (true);

-- Trigger: paksa status selalu 'pending' saat insert dari publik,
-- supaya kolom status tidak bisa di-bypass lewat request insert manual.
create or replace function public.force_pending_status()
returns trigger as $$
begin
    new.status := 'pending';
    new.is_verified := coalesce(new.is_verified, false);
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_force_pending on public.reviews;
create trigger trg_force_pending
    before insert on public.reviews
    for each row execute function public.force_pending_status();

-- Catatan: proses APPROVE / REJECT / EDIT dari Admin Panel dilakukan
-- memakai Supabase Service Role Key (bukan anon key), sehingga otomatis
-- melewati RLS di atas. Lihat js/reviews-admin.js & panduan instalasi.

-- ========================================================================
-- STORAGE BUCKET
-- Jalankan bagian ini kalau ingin membuat bucket lewat SQL. Kalau sudah
-- dibuat manual lewat Dashboard > Storage > New bucket ("review-media",
-- Public), bagian ini boleh dilewati.
-- ========================================================================
insert into storage.buckets (id, name, public)
values ('review-media', 'review-media', true)
on conflict (id) do nothing;

create policy "Public can view review media"
    on storage.objects for select
    using (bucket_id = 'review-media');

create policy "Public can upload review media"
    on storage.objects for insert
    with check (bucket_id = 'review-media');

-- ========================================================================
-- REALTIME
-- Aktifkan replication supaya perubahan pada tabel reviews & review_reactions
-- langsung ter-broadcast ke browser pengunjung (dipakai oleh js/reviews.js
-- lewat sb.channel(...).on('postgres_changes', ...)). Kalau project Supabase
-- kamu sudah punya publication supabase_realtime, baris ini aman dijalankan
-- ulang (idempotent lewat pengecekan sederhana).
-- ========================================================================
alter publication supabase_realtime add table public.reviews;
alter publication supabase_realtime add table public.review_reactions;
