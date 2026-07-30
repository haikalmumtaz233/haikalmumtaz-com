# Rencana Peningkatan Desain — haikalmumtaz.com

Dokumen saran desain & teknis untuk `D:\Self Project\web-portofolio`
Basis audit: branch `development` @ `37f09f9`, v1.2.5
Tanggal: 30 Juli 2026

> Catatan branch: `git diff main development` kosong. Kedua branch identik saat ini,
> jadi semua temuan di bawah berlaku untuk `main` juga.

---

## 0. Ringkasan

Situs ini **eksekusinya rapi tapi arah desainnya generik.** Kode React-nya bersih,
struktur data terpisah, komponen ter-memo, ada lazy image, ada Turnstile + honeypot +
DOMPurify di form. Itu di atas rata-rata portfolio developer.

Masalahnya ada di tiga tempat:

1. **Identitas visual = template.** Background near-black + tiga orb neon blur +
   noise overlay + kartu glassmorphism + typing effect role + marquee tools. Ini
   persis kombinasi yang dipakai ribuan portfolio dev sejak 2022. Tidak ada satu pun
   pilihan yang hanya masuk akal untuk *Haikal*, bukan untuk developer lain mana pun.
2. **Cuma ada satu ide gerak.** Kurva `cubic-bezier(0.43, 0.13, 0.23, 0.96)` dengan
   `y: 100% -> 0%` diulang **15 kali di 11 file**. Setiap section masuk dengan cara
   yang sama, jadi tidak ada satu momen pun yang terasa spesial.
3. **Konten terlalu dangkal untuk isi CV-nya.** Kamu punya BNI Core Banking COE,
   Bangkit ML cohort, TensorFlow Developer Certificate, 3 tahun asisten lab dengan
   200+ mahasiswa, dan game ritme Roblox. Situsnya meratakan semua itu jadi
   satu baris deskripsi per proyek dan role cycler yang mengetik sendiri.

Ada juga **beberapa bug nyata** (bukan preferensi) yang saya temukan sambil baca —
lihat bagian 2. Satu di antaranya bikin animasi reveal di Experience tidak pernah
jalan, satu lagi bikin parallax starfield tidak ter-smoothing.

Struktur dokumen:

| Bagian | Isi |
|---|---|
| 1 | Apa yang sudah bagus (jangan diubah) |
| 2 | Temuan teknis: bug, perf, a11y, SEO |
| 3 | Arah desain yang saya rekomendasikan (token lengkap) |
| 4 | Perbaikan per-section + spec animasi |
| 5 | Animasi modern & 3D — mana yang layak, mana yang buang-buang |
| 6 | Konten & section baru |
| 7 | Roadmap prioritas |
| 8 | Risiko & catatan lisensi |

---

## 1. Yang sudah bagus — pertahankan

- **Pemisahan data/presentasi.** `src/data/*.ts` dengan interface bertipe. Bagus,
  gampang jadi CMS nanti.
- **Keamanan form** (`Contact.tsx`). Turnstile + honeypot + DOMPurify + validasi
  panjang + regex. Ini jarang ada di portfolio.
- **`OptimizedImage`** dengan IntersectionObserver + placeholder fade. Solid.
- **`ScrollManager`** (`App.tsx:12`) yang menyimpan posisi scroll saat balik dari
  `/projects`. Detail yang matang.
- **`ProjectModal`** pakai `createPortal` + lock Lenis + Escape handler.
- **Aset gambar sudah `.webp`** semua. Font Monument sudah kecil (34 KB/file),
  kemungkinan sudah di-subset.
- **`layoutId="projectsActiveFilter"`** di `ProjectsGrid.tsx:81`. Ini satu-satunya
  animasi di situs yang bukan fade-up — dan itu yang paling enak dilihat.
  Pola inilah yang harus diperbanyak, bukan fade-up.

---

## 2. Temuan teknis

### 2a. Bug (bukan preferensi)

| # | Lokasi | Masalah |
|---|---|---|
| B1 | `home/Experience.tsx:37-41` | `initial="hidden" animate="visible"` dikombinasi `viewport={{once:true, margin:"-100px"}}`. Prop `viewport` **hanya berlaku untuk `whileInView`**, bukan `animate`. Judul "Professional Experience" jadi beranimasi saat mount (di luar layar), dan saat user scroll ke sana animasinya sudah habis. Fix: ganti `animate` -> `whileInView`. |
| B2 | `Background.tsx:155-162` | Lerp mouse & scroll (`mouseX += (targetMouseX - mouseX) * 0.05`) ditulis **di dalam `Star.update()`**, yang dipanggil sekali per bintang per frame. Di 1080p itu ~259 bintang, jadi smoothing dijalankan 259x per frame — efeknya konvergen instan, smoothing-nya hilang, dan `scrollVelocity` terakumulasi berlebihan. Fix: pindahkan ke dalam `animate()` sebelum loop `forEach`. |
| B3 | `home/Tools.tsx:60-120` | Dua track marquee dua-duanya `initial={{x:"-100%"}} animate={{x:"0%"}}` dengan durasi identik — jadi bergerak **serempak**, bukan offset. Marquee tak berjalan mulus, akan ada celah/lompatan di ujung. Fix: track kedua harus offset setengah siklus, atau pakai satu track dengan `x: ["0%", "-50%"]` pada array yang sudah diduplikasi. |
| B4 | `pages/Home.tsx:16` + `home/FeaturedProjects.tsx:57` | `id="projects"` muncul **dua kali** di DOM (wrapper div dan section di dalamnya). `document.querySelector('#projects')` ambigu; navigasi anchor dari Navbar/Footer bisa lompat ke elemen yang salah. |
| B5 | `home/Hero.tsx:88, 111, 129` | Ada **tiga `<h1>`** aktif bersamaan selama 2.5 detik pertama (HAIKAL, MUMTAZ, dan h1 hero). Buruk untuk struktur heading & screen reader. Intro harus pakai `<span aria-hidden="true">`. |
| B6 | `home/FavoriteMoments.tsx:25-26,94` | `h-[400vh]` dan geser `-78%`/`-88%` di-hardcode. Begitu kamu tambah moment ke-10, kartu terakhir kepotong. Fix: ukur `scrollWidth` track dengan ResizeObserver dan hitung offset-nya. |
| B7 | `vercel.json` | Tidak ada `rewrites`. Preset Vite di Vercel biasanya menambahkan SPA fallback otomatis, tapi **verifikasi**: buka `https://haikalmumtaz.com/projects` lalu hard-refresh. Kalau 404, tambahkan `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}`. |

### 2b. Performa

| # | Lokasi | Masalah | Dampak |
|---|---|---|---|
| P1 | `projects/ProjectsBackground.tsx:73-92` | `connectParticles()` O(n²) dengan `Math.sqrt`. Di 1080p: 138 partikel -> **9.453 pasangan per frame**, plus redraw grid 60px full-screen tiap frame. | Halaman `/projects` panas & boros baterai di laptop/HP |
| P2 | `home/Hero.tsx:40-64` | Typing effect memicu `setState` **per karakter**, selamanya. ~10-20 re-render/detik terus-menerus, barengan rAF starfield + Lenis RAF. | Main thread tidak pernah idle di viewport pertama |
| P3 | `package.json` | GSAP + ScrollTrigger + `@gsap/react` (~70 KB gz) **hanya dipakai untuk 3 tween orb** di `Background.tsx`. Framer Motion `useScroll`/`useTransform` sudah ada dan bisa melakukan hal yang sama. | Bisa hapus 1 dependency besar |
| P4 | `src/index.css:1` | `@import url('https://fonts.googleapis.com/...')` di dalam CSS = **render-blocking berantai** (CSS harus di-parse dulu baru font di-request). Plus 7 weight Plus Jakarta Sans di-request. | LCP mundur ~200-400 ms |
| P5 | `vite.config.ts` | Tidak ada `build.rollupOptions.output.manualChunks`. framer-motion + gsap + lenis + router semua di satu chunk vendor. | Bundle awal lebih besar dari perlunya |
| P6 | `data/techStack.ts`, `data/tools.ts` | ~45 logo di-fetch dari `cdn.simpleicons.org` saat runtime. 45 request pihak ketiga, tanpa kontrol cache, dan situs jadi bergantung pada uptime CDN eksternal. | Layout shift + titik kegagalan eksternal |

### 2c. Aksesibilitas

| # | Lokasi | Masalah |
|---|---|---|
| A1 | **Seluruh situs** | `prefers-reduced-motion` tidak dihormati **sama sekali**. Ini situs yang sangat berat gerak (curtain intro, parallax, horizontal scroll hijack 400vh, marquee, smooth-scroll Lenis). Untuk user dengan vestibular disorder ini menyakitkan secara harfiah. Wajib: `useReducedMotion()` dari framer-motion, matikan Lenis, matikan marquee & horizontal-scroll. |
| A2 | `src/index.css` | Tidak ada style `:focus-visible` global. Navigasi keyboard tidak terlihat di mana pun. |
| A3 | `projects/ProjectCard.tsx:17`, `home/FeaturedCard.tsx:15`, `home/Certifications.tsx:116` | `<article onClick>` tanpa `role="button"`, `tabIndex={0}`, atau handler `onKeyDown`. Semua kartu proyek & sertifikat **tidak bisa dibuka dari keyboard**. |
| A4 | `projects/ProjectModal.tsx`, `home/CertificationModal.tsx` | Tidak ada `role="dialog"`, `aria-modal="true"`, focus trap, atau pengembalian fokus ke trigger saat ditutup. |
| A5 | `home/Contact.tsx:299,312,328,341,355` | `<label>` tidak terhubung ke input (tanpa `htmlFor`/`id`). Klik label tidak fokus ke field, screen reader tidak membacakan label. |
| A6 | `home/Contact.tsx:210` | Container toast tidak punya `role="status"` / `aria-live="polite"`. Sukses & error kirim pesan tidak diumumkan. |
| A7 | `home/Certifications.tsx:88` | Slider drag-only. Tidak ada tombol prev/next dan tidak bisa di-scroll keyboard. |
| A8 | `Navbar.tsx:55` | Tombol menu tidak punya `aria-expanded` / `aria-controls`; panel tidak punya `role="dialog"` dan tidak trap fokus. |
| A9 | Kontras | `text-slate-500` (`#64748b`) di atas `#0a0a0a` = rasio **4.1:1**. Di bawah WCAG AA (4.5:1) untuk teks kecil. Dipakai di subtitle hero, deskripsi section, tanggal, footer. |

### 2d. SEO & metadata

- `index.html:17` — `og:image` relatif (`/logo.webp`). Crawler butuh **URL absolut**. Saat ini preview link di WhatsApp/LinkedIn/Slack tidak muncul gambar.
- `og:image` berupa logo, bukan kartu 1200x630. Buat OG card khusus.
- Tidak ada `twitter:card`, `og:site_name`, `og:locale`, `theme-color`.
- Tidak ada **JSON-LD `Person`** schema. Ini yang bikin Google menampilkan knowledge panel untuk nama kamu. Sangat berharga untuk portfolio pribadi.
- Tidak ada `robots.txt`, `sitemap.xml`, `site.webmanifest` di `public/`.
- `/projects` tidak punya `<title>`/meta sendiri (SPA tanpa manajemen head).
- Tidak ada halaman 404.

### 2e. Kode mati

Tidak pernah di-import di mana pun — hapus atau hidupkan:

- `src/App.css` — boilerplate Vite bawaan (logo spin, `.read-the-docs`). Hapus.
- `src/components/CustomCursor.tsx` — sudah ditulis, tidak pernah di-mount.
- `src/components/home/Identity.tsx` — marquee skew-on-velocity. **Ini sebenarnya komponen terbaik yang kamu tulis** dan tidak dipakai. Lihat bagian 4.
- `src/components/home/CategoryFilter.tsx` — digantikan filter inline di `ProjectsGrid`.

### 2f. Inkonsistensi desain

- Warna background beda antar halaman: `#0a0a0a` (`Background.tsx:209`) vs `#0d0a12` (`ProjectsBackground.tsx:95`). Terlihat saat transisi rute.
- `tailwind.config.js` hanya meng-extend `fontFamily`. **Tidak ada satu pun design token.** Warna ditulis langsung sebagai `purple-500`, `cyan-400`, `fuchsia-500`, `#0a0a0a`, `white/[0.03]`, `white/10` tersebar di 20+ file.
- `font-mono` dipakai puluhan kali tapi **tidak pernah didefinisikan** di Tailwind config. Artinya jatuh ke font mono default OS — Courier New di sebagian Windows, SF Mono di macOS. Karakter "engineering" situs ini bertumpu pada font mono, dan font-nya berbeda di setiap komputer pengunjung.
- Intro curtain pakai `font-sans` (`Hero.tsx:88`), hero pakai `font-monument`. Nama yang sama, dua typeface berbeda, berjarak 1 detik.
- Aksen warna acak per proyek (`accentColor`: ungu, oranye, pink, hijau, biru, teal, cyan) tanpa sistem. Kartu terlihat seperti pelangi, bukan satu keluarga.

---

## 3. Arah desain yang saya rekomendasikan

### 3.1 Thesis

Hal paling khas tentang kamu bukan "fullstack developer". Yang khas adalah
**rentangnya**: Core Banking COE di BNI pada siang hari, game ritme Roblox dan
Valorant kompetitif pada malam hari, sertifikasi TensorFlow di tengahnya, dan
tiga tahun mengajar 200+ mahasiswa di Yogyakarta sebelum pindah ke Jakarta.

Situs sekarang mencoba menyampaikan itu lewat cara paling malas yang ada:
role cycler yang mengetik lima label bergantian. Ganti label yang berganti-ganti
dengan **struktur yang benar-benar menunjukkan rentang itu**.

Arahnya: **instrumen presisi, dihangatkan oleh Yogyakarta.**
Tata letak dan tipografi setegas panel instrumen perbankan — grid, garis rambut,
angka tabular, monospace. Paletnya diambil dari batik Yogya (soga, nila, gading),
bukan dari neon default. Ketegangan antara dua hal itu — kehangatan Jawa x presisi
enterprise — *itulah* desainnya, dan itu tidak bisa dihasilkan template mana pun.

### 3.2 Token warna

Ganti seluruh purple/cyan/fuchsia. Ini masuk ke `tailwind.config.js` sebagai token,
bukan ditulis langsung di komponen.

| Token | Hex | Peran |
|---|---|---|
| `ink` | `#0B0E13` | Background dasar (biru-hitam, bukan netral hitam — lebih terbaca sebagai panel instrumen daripada luar angkasa) |
| `panel` | `#131A21` | Permukaan kartu, ganti `bg-white/[0.03]` |
| `rule` | `#22303B` | Garis rambut, border, ganti `border-white/10` |
| `gading` | `#EDE6D9` | Teks display & heading — **bukan putih murni**. Gading (ivory batik) di atas biru-hitam terasa jauh lebih mahal dan mengurangi kelelahan mata |
| `sogan` | `#C9762B` | Aksen utama tunggal (soga batik). Dipakai hemat: state aktif, hover, garis progres |
| `nila` | `#3A5F94` | Aksen struktural (indigo batik). Grid, garis diagram, chart |
| `jade` | `#7ED0C4` | **Hanya** untuk status "hidup": titik available, toast sukses, indikator online |
| `mute` | `#8A97A3` | Teks sekunder — perhatikan ini menggantikan `slate-500` dan **lolos WCAG AA** (7.2:1), sedangkan yang sekarang tidak |

Aturan: satu aksen dominan (`sogan`), satu struktural (`nila`), satu status (`jade`).
Buang `accentColor` acak per proyek — ganti jadi **kategori**: Fullstack = `sogan`,
Frontend = `nila`, Game = `jade`. Warna jadi mengandung informasi, bukan dekorasi.

### 3.3 Token tipografi

Sistem sekarang: Monument Extended (display) + Plus Jakarta Sans (body) + mono tak terdefinisi.

**Display — ganti Monument Extended dengan Archivo Variable.**
Alasan:
- Monument Extended sudah jadi *the* typeface portfolio Awwwards 2021-2023. Sama
  templated-nya dengan orb neon.
- Monument itu **font komersial Pangram Pangram**, dan kamu meng-host `.otf`-nya
  publik di `/public/fonts/`. Cek lisensinya (lihat bagian 8).
- Archivo variable punya **sumbu `wdth` (62-125) dan `wght` (100-900)**, gratis,
  woff2, subset-able. Kamu dapat tampilan extended yang sama — plus kemampuan
  **menganimasikan lebar huruf**, yang tidak bisa dilakukan Monument.

**Body — pertahankan Plus Jakarta Sans, tapi turunkan ke variable + 3 weight.**
Ini bukan pilihan default: Plus Jakarta Sans dibuat atas permintaan Pemprov DKI
Jakarta. Kamu kerja di Jakarta. Itu alasan yang nyata, bukan kebetulan.
Sekarang kamu load 7 weight — cukup 400/500/700 via variable woff2.

**Mono — definisikan. Rekomendasi: IBM Plex Mono.**
Register-nya "instrumen enterprise", cocok dengan tema core banking, dan punya
karakter (bukan sekadar netral seperti JetBrains Mono). Wajib ditambahkan ke
`tailwind.config.js` — saat ini `font-mono` berbeda di setiap mesin pengunjung.

Skala tipe (bukan sekadar `text-2xl sm:text-3xl md:text-4xl lg:text-5xl...`
yang sekarang ditulis manual di setiap heading):

```
display-xl   clamp(3rem, 12vw, 11rem)   Archivo  wght 800  wdth 125  tracking -0.03em
display-l    clamp(2rem, 6vw, 4.5rem)   Archivo  wght 800  wdth 110  tracking -0.02em
title        clamp(1.5rem, 3vw, 2.5rem) Archivo  wght 700  wdth 100
body-l       1.125rem / 1.7             Jakarta  wght 400
body         0.9375rem / 1.65           Jakarta  wght 400
label        0.6875rem  tracking 0.18em Plex Mono wght 500 uppercase
data         0.8125rem  tabular-nums    Plex Mono wght 400
```

`tabular-nums` penting — semua tahun, tanggal, dan durasi harus rata kolom.
Itulah yang membuat ledger terbaca sebagai ledger.

### 3.4 Layout

Ganti "tumpukan section yang semuanya center-aligned" (kondisi sekarang: Hero center,
TechStack center, Tools center, Certifications center) dengan **satu grid 12 kolom
dengan rel kiri yang persisten**.

Rel kiri (48-72px, sticky, full-height) berisi metadata monospace: indeks section,
progres scroll, jumlah item, rentang tahun. **Rel itu sekaligus navigasinya** —
menggantikan hamburger mengambang yang sekarang.

Ini menyelesaikan tiga hal sekaligus: navigasi selalu terlihat (sekarang harus klik
hamburger dulu), halaman punya sumbu vertikal yang konsisten, dan metadata punya
rumah permanen alih-alih ditempel di tiap section.

### 3.5 Signature: nameplate yang memuai

**Satu elemen yang membuat situs ini diingat.**

Saat load, `HAIKAL MUMTAZ` dirender di Archivo Variable pada `wdth: 62` — sempit,
tinggi, rapat. Selama 1.1 detik, sumbu `wdth` beranimasi ke nilai yang membuat
teks **persis memenuhi lebar viewport**, apa pun ukuran layarnya. Hurufnya tidak
digeser atau di-scale — hurufnya *melebar*, tiap glyph berubah bentuk.

Saat user scroll, transformasi itu berbalik: nama memampat kembali ke `wdth: 62`
dan **berlabuh sebagai wordmark setinggi 40px di rel kiri**, tetap terlihat
sepanjang halaman. Satu transformasi tipografis yang kontinu dan reversibel,
yang sekaligus jadi jangkar navigasi.

Kenapa ini pilihan yang benar:
- Tidak bisa disalin dari template — butuh variable font dan pemetaan lebar yang dihitung.
- Bukan efek yang ditempel; ia mengerjakan pekerjaan nyata (jadi wordmark navigasi).
- Menggantikan **dua** elemen paling templated yang ada sekarang sekaligus:
  curtain intro putih 2.5 detik dan typing role cycler.
- Murah. Tidak butuh WebGL, tidak butuh library baru.
- Hormat pada `prefers-reduced-motion`: langsung render di lebar akhir.

Wireframe hero:

```
┌────┬─────────────────────────────────────────────────────────────┐
│ ▮  │  ID · EN                                          MENU      │
│    │                                                             │
│ 01 │                                                             │
│ ▯  │   H A I K A L   M U M T A Z                                 │
│    │   ─────────────────────────────────────────────────────     │
│ 02 │   Application Developer · Core Banking COE                  │
│ ▯  │   BNI (Persero) Tbk. via Mitra Integrasi Informatika        │
│    │                                                             │
│ 03 │   JAKARTA        ● tersedia       2022—2026 · 6 peran       │
│ ▯  │                                                    ↓ SCROLL │
└────┴─────────────────────────────────────────────────────────────┘
  ↑                              ↑
  rel: indeks section,           wdth: 62 → memenuhi viewport (1.1s)
  progres, wordmark              lalu balik & berlabuh di rel
  saat scroll
```

Perhatikan baris `2022—2026 · 6 peran` itu monospace, kecil, satu baris —
bukan tiga kotak besar "6+ TAHUN / 200+ MAHASISWA / 9 SERTIFIKAT" dengan
gradien. Angka besar + label kecil + aksen gradien adalah jawaban template.
Angka yang sama, disajikan sebagai baris ledger, jauh lebih percaya diri.

### 3.6 Perangkat struktural: ledger, bukan penomoran

`ProjectCard.tsx:64` sekarang menaruh nomor besar `01`, `02`, `03` di pojok kartu.
Nomor urut hanya bermakna kalau kontennya **memang** urutan. Daftar proyek yang
bisa difilter bukan urutan — nomornya berubah setiap kali filter diganti.
Itu dekorasi yang menyamar sebagai informasi.

Yang **memang** membawa informasi di data kamu: **tanggal**. Rentang 2022→2026,
6 peran, 9 sertifikat, semuanya bertanggal dan berurut. Jadi ganti penomoran
dengan **baris rekam bertanggal** dalam monospace tabular:

```
2026 ┃ MITRA INTEGRASI INFORMATIKA      App Developer Jr.       FEB 2026 — kini
2025 ┃ RUANG MEDIA SOLUSI               Fullstack Developer     NOV 2025 — FEB 2026
2025 ┃ HORUS TECHNOLOGY                 Fullstack Intern        OKT 2025 — NOV 2025
2023 ┃ IT CLUB UPNVY                    Deputy Head, Web Dev    JUL 2023 — AGU 2024
2023 ┃ BANGKIT ACADEMY                  ML Cohort               AGU 2023 — JAN 2024
2022 ┃ LAB INFORMATIKA UPNVY            Laboratory Assistant    AGU 2022 — JUL 2025
```

Perangkat yang sama dipakai ulang di Sertifikasi dan Momen. Itu yang membuat situs
terasa seperti satu sistem, bukan tujuh section yang kebetulan bertetangga.

### 3.7 Alternatif kalau arah di atas terlalu berani

Kalau kamu ingin tetap di ranah gelap-neon (misalnya karena sudah cocok dengan
audiens rekruter tech), **Direction B** — pertahankan palet, perbaiki semuanya:

- Ganti **tiga** orb jadi **satu** sumber cahaya terarah. Tiga blob neon adalah
  penanda "AI-generated" nomor satu saat ini.
- Kunci ke satu aksen (ungu) + satu status (hijau). Buang cyan dan fuchsia.
- Tetap wajib: design token, `font-mono` didefinisikan, `prefers-reduced-motion`,
  focus ring, ledger menggantikan penomoran, typing effect dihapus.
- Signature-nya tetap nameplate yang memuai — itu berfungsi di palet mana pun.

Direction B mendapat sekitar 60% peningkatannya dengan sekitar 30% kerjanya.
Tapi ia tetap tidak akan terlihat berbeda dari portfolio dev lain.

---

## 4. Perbaikan per-section

### Hero (`home/Hero.tsx`)

| Buang | Ganti dengan |
|---|---|
| Curtain putih 2.5 detik (`Hero.tsx:68-118`) — memblokir konten **setiap kunjungan**, tanpa guard `sessionStorage`, dan pakai typeface yang berbeda dari hero di baliknya | Nameplate yang memuai (3.5). Kalau curtain tetap diinginkan: simpan flag di `sessionStorage`, tampilkan hanya sekali per sesi, dan pakai typeface display yang sama |
| Typing role cycler (`Hero.tsx:40-64`) | Satu baris statis yang spesifik: `Application Developer · Core Banking COE · BNI via MII`. "Fullstack / ML / Data Scientist / Game Dev" yang berganti-ganti membuatmu terdengar tidak fokus. Rentang itu ditunjukkan lebih baik oleh section Proyek dan Pengalaman |
| Tombol "Business Inquiries" (`Hero.tsx:186`) | `Hubungi saya` atau `Mari bicara`. "Business Inquiries" adalah bahasa perusahaan; kamu adalah satu orang. Aksi harus memakai nama yang sama sepanjang alur — tombol ini, judul section Kontak, dan tombol submit form saat ini menyebut hal yang sama dengan tiga nama berbeda |
| Indikator scroll `hidden lg:flex` | Tampilkan juga di mobile. Di mobile, hero-nya `h-screen` tanpa petunjuk apa pun bahwa ada isi di bawahnya |

### Identity (`home/Identity.tsx`) — hidupkan kembali

Komponen ini menganimasikan `skewX` berdasarkan **kecepatan scroll** (`useVelocity`).
Ini satu-satunya gerakan di seluruh codebase yang merespons *bagaimana* user scroll,
bukan sekadar *seberapa jauh*. Jauh lebih hidup daripada 15 fade-up itu, dan
komponennya tidak pernah kamu pasang.

Hidupkan sebagai pembatas antara Hero dan Featured Work, tapi:
- Ganti background putih -> `ink` (background putih akan merusak arah baru).
- Ganti isinya. Jangan lagi lima label peran (`Fullstack Developer`, `Gamer`, ...) —
  itu mengulang typing effect yang baru saja dibuang. Isi dengan **artefak nyata**:
  `SPRING SECURITY · YOLO · LEAFLET · NATS · ROBLOX LUA · TENSORFLOW · KUBERNETES · PINIA`.
  Kosakata yang konkret jauh lebih menunjukkan rentang daripada jabatan.

### Featured Work (`home/FeaturedProjects.tsx`)

- Carousel `rotateY: 45deg` + `perspective: 1200px` sudah bagus. **Tambahkan drag/swipe** —
  di mobile user harus menekan panah kecil, padahal `Certifications` di halaman yang
  sama sudah bisa di-drag. Perilaku tidak konsisten.
- Tambah keyboard: panah kiri/kanan saat carousel ter-fokus.
- Tinggi tetap `h-[280px] md:h-[240px]` — **mobile lebih tinggi dari desktop**. Cek ulang.
- Ganti gradien acak per proyek dengan warna kategori (3.2).

### Experience (`home/Experience.tsx`)

- Perbaiki B1 (reveal tidak pernah jalan).
- `min-h-[60vh]` per item x 6 item = user harus scroll ~4 layar penuh untuk melewati
  bagian ini. Terlalu panjang. Padatkan jadi ledger (3.6); biarkan **satu** entri
  yang sedang di-hover memuai jadi detail penuh.
- Efek dim-on-hover (`opacity: 0.2`) bagus tapi hanya mouse. Tambahkan `:focus-within`.

### Tech Stack (`home/TechStack.tsx`)

- Sudah dirapikan jadi kategori di commit terakhir — bagus, ini perbaikan nyata.
- **Self-host 45 logo itu.** Sekarang semuanya dari `cdn.simpleicons.org` saat runtime.
  Download, jadikan satu SVG sprite, inline-kan. Menghemat 45 request eksternal dan
  menghilangkan ketergantungan uptime.
- 45 chip dengan bobot visual seragam tidak memberi tahu apa pun tentang **kedalaman**.
  Tambahkan satu sumbu: tebal/tipis, opasitas, atau satu titik `sogan` untuk stack
  inti (Java/Spring, Vue, Go, React) vs yang pernah dipakai. Rekruter mencari tahu
  apa yang benar-benar kamu kuasai — saat ini Thymeleaf terlihat sama pentingnya
  dengan Spring Boot.

### Tools (`home/Tools.tsx`)

- Perbaiki B3 (marquee serempak).
- Jujur saja: section ini nilainya paling rendah di halaman. "Saya pakai VS Code,
  Git, Figma" tidak membedakan siapa pun. Pertimbangkan gabungkan ke Tech Stack
  sebagai satu baris kategori `Tooling`, dan pakai ruang yang dihemat untuk
  section About yang sekarang tidak ada.

### Certifications (`home/Certifications.tsx`)

- Tambah tombol prev/next + keyboard (A7).
- Tambah `credentialLink` sebagai tombol nyata — saat ini hanya TensorFlow yang
  punya link dan itu pun tidak muncul di kartu.
- Badge `cyan-500/10 + cyan-400` (`Certifications.tsx:147`) — cyan-nya tidak dipakai
  di tempat lain. Jadikan token kategori.

### Favorite Moments (`home/FavoriteMoments.tsx`)

- Perbaiki B6 (offset hardcoded).
- **Wajib disable saat `prefers-reduced-motion`** — horizontal scroll-hijack sepanjang
  400vh adalah pemicu vestibular paling kuat di situs ini. Fallback: grid vertikal.
- Tambahkan konteks di tiap momen. `Top 4 Yogyakomtek` / `2024` saja tidak berarti
  apa-apa bagi orang di luar Yogyakarta. Satu baris: kompetisi apa, dari berapa tim.

### Contact (`home/Contact.tsx`)

- Perbaiki A5 (label) dan A6 (aria-live).
- Salin: "Have a project in mind or just want to say hi?" adalah kalimat template.
  Tulis apa yang sebenarnya kamu cari: peran seperti apa, seberapa cepat kamu balas,
  zona waktu kamu. Spesifik selalu lebih baik daripada ramah.
- Toast pakai `red-500`/`green-500` mentah — token-kan.
- Pesan error: `"Failed to send message. Please try again."` tidak memberi tahu
  apa yang salah atau apa yang harus dilakukan. Beri jalan keluar: cantumkan
  alamat email langsung di dalam toast error.

### Projects page (`pages/Projects.tsx`)

- Satukan background dengan halaman Home (sekarang `#0d0a12` vs `#0a0a0a`, dan
  sistem partikelnya beda total). Satu `<Background />` untuk seluruh situs.
- Perbaiki P1 (O(n²)).
- Tambah `<title>` dan meta per rute.

---

## 5. Animasi modern & 3D

Kamu minta saran animasi modern dan 3D. Ini penilaian jujurnya, diurutkan dari
rasio dampak-terhadap-biaya terbaik.

### Layak dikerjakan

**1. View Transitions API — untuk transisi rute Home -> Projects.**
Kartu proyek yang diklik **berubah bentuk** (morph) menjadi hero di halaman detail.
Ini efek "mahal" yang paling terasa, native browser, ~0 KB, dan degradasi-nya aman
(browser lama cukup melakukan cut biasa). Kamu sudah punya struktur yang tepat:
kartu -> modal dan rute -> rute.

**2. Shared-element transition kartu -> modal via `layoutId`.**
Kamu sudah pakai `layoutId` untuk pil filter, dan itu bagian yang paling enak
dilihat di situs. Perluas: `layoutId={`project-${id}`}` di kartu dan di modal.
Modal jadi tumbuh dari kartu yang diklik, bukan muncul mendadak di tengah. Beberapa
baris kode, peningkatan persepsi kualitas yang besar.

**3. Animasi sumbu variable-font.**
Nameplate yang memuai (3.5), plus judul section yang naik `wght` 400->800 saat masuk
viewport, bukan `y: 100% -> 0%` untuk ke-16 kalinya. Ini gerakan yang tidak bisa
dilakukan situs dengan font statis — instan terbaca sebagai dikerjakan dengan
sengaja, dan hanya butuh CSS `font-variation-settings`.

**4. CSS scroll-driven animation (`animation-timeline: view()`).**
Menggantikan sebagian besar `whileInView` framer-motion. Berjalan di compositor
thread, bukan main thread — artinya reveal tetap 60fps sementara starfield rAF
dan Lenis berjalan. Chrome/Edge/Opera mendukung, Safari/Firefox fallback ke
tampil langsung. Ini yang paling "2026" dari semua saran di daftar ini.

**5. Hover magnetik + `CustomCursor.tsx` yang sudah kamu tulis.**
Sudah ada di repo, tinggal di-mount (dengan guard: hanya pointer halus,
hanya kalau motion tidak dikurangi). Tambahkan pull magnetik ke tombol CTA.

**6. Kedalaman 3D tanpa WebGL.**
`transform-style: preserve-3d` + `perspective` yang digerakkan pointer akan
memberi 80% dari "rasa 3D" dengan biaya ~0 KB. Kamu sudah melakukannya di
carousel Featured Work — perluas ke kartu grid proyek (tilt) dan ke rel kiri
(parallax lapis).

### Pikirkan dua kali

**7. three.js / react-three-fiber.**
`three` + `@react-three/fiber` + `@react-three/drei` ≈ 160-220 KB gzip, di atas
framer-motion (~50 KB) + GSAP (~70 KB) + Lenis yang sudah ada. Untuk **blob ambient
di background, ini tidak sepadan** — canvas 2D yang sudah kamu punya menghasilkan
efek yang sama dengan biaya sepersepuluh.

Kalau tetap mau WebGL, pakai untuk **satu** momen yang tidak bisa dicapai cara lain,
dan pastikan momennya spesifik untukmu. Yang paling menarik dari data kamu:

> **Beat lane.** Street Beats adalah proyek paling khas milikmu dan sekarang
> disajikan sebagai satu file `.webp` statis. Buat satu section di mana not-not
> meluncur ke arah judgment line, dan posisinya digerakkan oleh **posisi scroll**
> alih-alih waktu. Scroll jadi terasa seperti memainkan lagu. Ini spesifik,
> memorable, dan langsung tersambung ke proyek nyata.

Bahkan itu pun bisa dibuat dengan canvas 2D dengan seperlima biaya three.js.
Saya akan memilih canvas 2D.

### Jangan

**8. Menambah lebih banyak blob gradien blur.** Sudah ada tiga. Tiga blob neon blur
di atas near-black saat ini adalah penanda visual paling kuat untuk "situs ini
dihasilkan AI". Kurangi jadi satu, atau hilangkan sama sekali dan biarkan tipografi
bekerja.

**9. Menambah efek reveal di section yang belum punya.** Situs ini tidak kekurangan
animasi — ia kelebihan animasi yang *sama*. Satu momen yang terorkestrasi mengalahkan
lima belas fade-up. Kurangi dulu, baru tambah.

Nasihat Chanel berlaku di sini: sebelum keluar rumah, lihat cermin dan lepas satu
aksesori. Situs ini butuh melepas tiga.

### Yang harus mengiringi semua animasi

```ts
const shouldReduceMotion = useReducedMotion();
```

Setiap saran di bagian ini harus punya jalur `prefers-reduced-motion`. Ini bukan
tambahan opsional — untuk situs sepadat gerak ini, ini syarat kelayakan rilis.

---

## 6. Konten & section baru

Diurutkan berdasarkan dampak untuk posisimu saat ini (developer awal karier di
perbankan enterprise, kemungkinan besar juga sedang mempertimbangkan peluang lain).

### Prioritas tinggi

**1. Section About / asal-usul — sekarang tidak ada sama sekali.**
Ini kekurangan konten terbesar. Situsnya menampilkan *apa* yang kamu kerjakan tapi
tidak pernah *siapa* kamu. Ceritanya sudah ada di datamu: Yogyakarta -> asisten lab
mengajar 200+ mahasiswa selama tiga tahun -> terpilih di Bangkit (program Google) ->
pindah ke Jakarta mengerjakan core banking. Tiga paragraf, ditulis sebagai manusia,
akan lebih berpengaruh terhadap keputusan perekrutan daripada 45 chip tech stack.

**2. Satu studi kasus mendalam.**
Setiap proyek sekarang punya satu kalimat. Untuk tahap karier kamu, **satu**
studi kasus penuh mengalahkan delapan kartu. Ambil TixNow atau SIMASET dan tulis:
masalahnya apa, batasannya apa, arsitektur apa yang dipilih dan kenapa, apa yang
gagal, hasilnya apa. Rute `/projects/tixnow`. Ini yang membedakan "punya portfolio"
dari "bisa berpikir".

**3. Unduh CV (PDF).**
Tidak ada. Setiap rekruter mencarinya. Satu tombol di rel kiri, permanen.

**4. Aksen kategori pada proyek + hasil terukur.**
`stack: ['Vue 3', 'Pinia', ...]` memberi tahu teknologi tapi bukan dampak.
Tambahkan satu baris hasil per proyek: berapa pengguna, berapa modul, berapa lama,
sendiri atau tim berapa orang. SIMASET adalah sistem aset pemerintah daerah —
skala itu mengesankan dan sekarang tidak terlihat sama sekali.

### Prioritas menengah

**5. Toggle bahasa ID / EN.**
Kamu melamar di pasar Indonesia sekaligus punya sertifikat internasional. Saat ini
100% Inggris. Toggle ID/EN adalah pembeda nyata dan menunjukkan kepedulian pada
audiens. Taruh di rel kiri atas.

**6. Strip "Sedang dikerjakan".**
Tiga baris bertanggal tentang apa yang sedang kamu bangun/pelajari bulan ini.
Murah dirawat, dan memberi sinyal bahwa situs ini hidup — kebanyakan portfolio
terlihat ditinggalkan.

**7. Rekomendasi / testimoni.**
Kamu punya tiga tahun hubungan dengan dosen lab dan lead di tiga perusahaan.
Dua kutipan pendek dengan nama dan jabatan bernilai lebih dari section Tools.

**8. Street Beats yang bisa dilihat.**
Proyek paling khas milikmu disajikan sebagai screenshot diam. Sematkan loop
gameplay (webm, 3-5 detik, autoplay muted) atau embed Roblox-nya.

### Prioritas rendah tapi murah

**9. Halaman `/uses`.** Setup, editor, terminal, hardware. Developer suka ini, dan
memberi rumah yang lebih baik untuk isi section Tools sekarang.
**10. Halaman 404** dengan karakter, bukan halaman kosong.
**11. Tiga tulisan pendek.** Bahkan tiga catatan tentang Spring Security atau apa
yang kamu pelajari di core banking akan sangat membedakan. Ini bidang di mana
hampir tidak ada portfolio junior yang bermain.
**12. Jam Jakarta + status ketersediaan langsung** di hero — kecil, manusiawi, benar.

---

## 7. Roadmap prioritas

### Fase 0 — perbaikan, tanpa perubahan desain (~1 hari)

Kerjakan ini duluan apa pun arah desain yang dipilih.

| Item | Ref |
|---|---|
| Perbaiki reveal Experience yang tidak pernah jalan | B1 |
| Perbaiki lerp di dalam loop Star | B2 |
| Perbaiki marquee Tools yang serempak | B3 |
| Hapus `id="projects"` duplikat | B4 |
| Turunkan h1 intro jadi span + aria-hidden | B5 |
| `prefers-reduced-motion` di seluruh situs (termasuk Lenis) | A1 |
| Ring `:focus-visible` global | A2 |
| Kartu bisa keyboard (`role`, `tabIndex`, `onKeyDown`) | A3 |
| `role="dialog"` + focus trap di kedua modal | A4 |
| `htmlFor`/`id` di semua field form | A5 |
| `aria-live` untuk toast | A6 |
| Naikkan kontras teks sekunder ke AA | A9 |
| Hapus `App.css`, `CategoryFilter.tsx` | 2e |
| `og:image` absolut + OG card 1200x630 + JSON-LD Person | 2d |
| `robots.txt`, `sitemap.xml`, `webmanifest`, halaman 404 | 2d |
| Verifikasi SPA fallback `/projects` di Vercel | B7 |

### Fase 1 — fondasi sistem (~1-2 hari)

| Item | Ref |
|---|---|
| Token warna + spacing + motion di `tailwind.config.js` | 3.2 |
| **Definisikan `fontFamily.mono`** (sekarang berbeda di tiap mesin) | 2f |
| Self-host font, woff2 variable, preload, hapus `@import` | P4 |
| Self-host 45 logo simpleicons sebagai sprite | P6 |
| Satukan Background Home & Projects, perbaiki O(n²) | P1, 2f |
| Hapus GSAP, pindahkan parallax orb ke framer-motion | P3 |
| `manualChunks` di vite config | P5 |

### Fase 2 — arah desain (~3-5 hari)

| Item | Ref |
|---|---|
| Nameplate yang memuai + hapus curtain & typing effect | 3.5 |
| Rel kiri sebagai navigasi + wordmark yang berlabuh | 3.4 |
| Palet + skala tipe baru diterapkan ke semua section | 3.2, 3.3 |
| Ledger menggantikan penomoran (Experience, Certs, Moments) | 3.6 |
| Aksen kategori menggantikan `accentColor` acak | 3.2 |
| Hidupkan Identity sebagai marquee artefak | 4 |
| Shared-element `layoutId` kartu -> modal | 5.2 |
| View Transitions untuk perpindahan rute | 5.1 |

### Fase 3 — konten (berkelanjutan)

Section About -> satu studi kasus mendalam -> unduh CV -> hasil terukur per proyek ->
toggle ID/EN -> testimoni -> loop Street Beats -> tulisan.

**Kalau cuma sempat mengerjakan tiga hal:** Fase 0 (a11y + bug), section About,
dan satu studi kasus mendalam. Ketiganya mengubah hasil perekrutan lebih dari
perubahan visual mana pun di dokumen ini.

---

## 8. Risiko & catatan lisensi

1. **Monument Extended.** Font komersial dari Pangram Pangram. Kamu menyajikan
   `MonumentExtended-Regular.otf` dan `-Ultrabold.otf` dari `/public/fonts/`,
   artinya siapa pun bisa mengunduh berkas font-nya langsung. Verifikasi kamu
   punya lisensi webfont. Kalau tidak, pindah ke Archivo Variable menyelesaikan
   masalah desain **dan** masalah lisensi sekaligus.

2. **Aset simpleicons dari CDN.** Selain masalah performa, logo-logo itu adalah
   merek dagang. Penggunaan untuk menunjukkan keahlian umumnya aman, tapi
   self-hosting memberimu kontrol kalau ada yang keberatan.

3. **Foto momen.** `moments/` berisi foto acara dengan orang lain di dalamnya.
   Pastikan kamu nyaman menampilkannya secara publik dan permanen.

4. **Direction A punya risiko nyata.** Palet gading/soga/nila akan terlihat lebih
   hangat dan kurang "tech" dibanding neon sekarang. Kalau target utamamu rekruter
   startup yang mengharapkan estetika gelap-neon, ini mungkin bekerja melawanmu.
   Saya pikir itu risiko yang layak diambil — situs neon tidak diingat siapa pun —
   tapi itu keputusanmu. Direction B (3.7) adalah jalur aman yang tetap
   memperbaiki semua masalah struktural.

5. **Jangan kerjakan Fase 2 sebelum Fase 0 selesai.** Situs cantik yang tidak bisa
   dinavigasi keyboard dan menyakiti orang dengan gangguan vestibular adalah
   kemunduran, bukan kemajuan.

---

*Dibuat dari audit kode langsung: 34 berkas sumber, 3.956 baris di `src/`, branch
`development` @ `37f09f9`. Semua rujukan `file:baris` sudah diverifikasi terhadap
kondisi kode saat dokumen ini ditulis.*
