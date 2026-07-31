# Rencana: Scroll sebagai Perjalanan

Dokumen perencanaan untuk mengubah scroll dari Hero sampai Contact menjadi satu perjalanan yang menyatu, bukan tumpukan section yang berdiri sendiri.

Status: **rancangan, belum ada kode yang ditulis.**

---

## 1. Batasan yang dipegang

Tiga hal ini tidak disentuh sama sekali. Semua usulan di bawah hanya menambah **gerak** dan **struktur**, tidak menyentuh isi:

| Aspek | Status | Keterangan |
|---|---|---|
| Copy / deskripsi | **Tidak berubah** | "FEATURED WORK", "Let's work together", "Favorite Moments", deskripsi project, semua teks Experience — tetap apa adanya |
| Warna utama | **Tidak berubah** | Base `#0a0a0a`, aksen `purple-600` / `cyan-500` / `fuchsia-500`, token `palette` di `src/design/tokens.js` tetap |
| Font | **Tidak berubah** | `font-monument` (Monument Extended) untuk display, Plus Jakarta Sans untuk body, `font-mono` untuk data |

Satu klarifikasi soal warna: di Fase 3 ada usulan mengatur **urutan dominasi** tiga orb yang sudah ada (ungu → cyan → fuchsia mengikuti kedalaman scroll). Itu hanya mengubah `opacity` elemen yang sudah ada, bukan menambah atau mengganti warna. Kalau ini terasa melewati batas, Fase 3 bisa dibuang tanpa merusak Fase 1 dan 2.

---

## 2. Kondisi sekarang

Yang sudah ada dan bagus, jadi fondasi rencana ini:

- `Background.tsx` — canvas starfield fixed, bintang bergerak ke atas, parallax ikut scroll, 3 orb blur, vignette, noise
- `Nameplate.tsx` — teks "HAIKAL MUMTAZ" auto-fit lebar, entrance `scaleX 0.62 → 1`, lalu collapse `1 → 0.62` + fade saat discroll
- `Hero.tsx` — sudah `h-screen`
- Lenis smooth scroll (`lerp: 0.1`), tapi hanya aktif kalau user tidak minta reduced motion
- `usePrefersReducedMotion` dipakai konsisten di 10 file — kualitas dasarnya sudah terjaga
- Semua heading display pakai DNA tipografi yang sama: `font-monument font-black uppercase tracking-tight`

Masalahnya: tiap section punya `useScroll` sendiri-sendiri dan reveal-nya `whileInView`. Efeknya seperti **slideshow** — tiap blok muncul sendiri saat masuk layar. Tidak ada yang menghubungkan Hero ke Contact sebagai satu gerakan.

---

## 3. Konsep: "Approach"

Metafora yang dipilih bukan "turun level" atau "waypoint bernomor", tapi **mendekat**.

Alasannya ada di kontennya sendiri. Urutan section bergerak dari hasil kerja ke orangnya:

```
Projects → Experience → Tech Stack → Tools → Certifications → Moments → Contact
   apa yang dibuat  →  di mana  →  pakai apa  →  pencapaian  →  siapa  →  sapa
```

Itu perjalanan dari **artefak menuju orangnya**. Jadi perjalanannya: kamu mulai jauh di kejauhan, cuma lihat nama melintang di kegelapan (Hero), lalu bergerak mendekat terus, dan berakhir di Contact — titik di mana kamu benar-benar bisa bicara dengannya.

Konsekuensi desainnya jelas:
- Hero = paling jauh, paling dingin, bintang paling jarang
- Contact = paling dekat, bintang melambat hampir berhenti, karena kamu sudah sampai
- "Warp" cuma terjadi **sekali**, di batas Hero → Projects, karena itu momen kamu memutuskan berangkat

> **Kenapa bukan penomoran 01 / 02 / 03?**
> Karena section-nya bukan urutan. Tools bukan "langkah setelah" Tech Stack. Menomori mereka jadi dekorasi yang berpura-pura jadi informasi. Yang benar-benar kontinu di halaman ini cuma satu: posisi scroll itu sendiri. Jadi itu yang dipakai sebagai penggerak, bukan angka yang ditempel.

---

## 4. Signature: "The Handoff"

Ini elemen yang bikin halaman ini diingat, dan ini datang dari sesuatu yang **sudah kamu punya dan sudah kamu suka**.

Nameplate punya satu gerakan khas: huruf memampat ke `scaleX 0.62` lalu melepas ke `1`. Gerakan itu tidak berhenti di Hero — dia **dioper** ke section berikutnya seperti tongkat estafet:

```
HERO                          PROJECTS
"HAIKAL MUMTAZ"               "FEATURED WORK"
scaleX 1 ──────► 0.62   ══►   scaleX 0.62 ──────► 1
opacity 1 ─────► 0            opacity 0 ────────► 1
        (berangkat)                   (tiba)
```

Nameplate memampat saat pergi. Judul Projects datang dengan gerakan yang sama persis, dibalik. Situs ini jadi punya **satu kata kerja tipografi** yang dipakai di setiap perpindahan, bukan tujuh efek berbeda yang kebetulan ditempel di tujuh section.

Ini juga yang persis kamu minta: "animasi kaya nameplate itu yang nantinya memunculkan elemen kedua yaitu projects."

Yang membuatnya terasa seperti perjalanan, bukan animasi: gerakan ini **di-scrub**, terikat ke posisi scroll, bukan di-trigger sekali saat masuk viewport. Kamu scroll balik, dia mundur. Kamu berhenti di tengah, dia berhenti di tengah. Kamu yang memegang kendali.

---

## 5. Signature kedua: bintang yang meregang

Elemen kedua yang bikin ini hidup, dan ini bagian yang menurutku paling layak dikerjakan duluan.

`Background.tsx` sekarang menggambar bintang pakai `ctx.arc()` — titik. Diubah jadi: kalau kecepatan scroll melewati ambang, bintang digambar sebagai **garis**, panjangnya mengikuti kecepatan scroll dan kedalaman bintang.

```
scroll diam       ·  ·   ·  ·      titik
scroll pelan      ·  ¦   ·  ¦      mulai meregang
scroll cepat      ¦  |   ¦  |      streak
warp (Hero exit)  |  |   |  |      penuh
```

Kenapa ini bagus:

1. **Benar secara fisik.** Bintang memang meregang kalau kamu bergerak cepat. Ini bukan efek tempelan, ini konsekuensi dari gerakan.
2. **Merespons niat user.** Panjang streak digerakkan oleh *kecepatan scroll*, bukan posisi. Scroll pelan-pelan, dia cuma bernapas. Scroll kasar, dia warp. Efeknya beda tiap orang, dan itu yang bikin diingat.
3. **Nol dependency.** Cuma ganti `ctx.arc()` jadi `ctx.moveTo/lineTo` di canvas yang sudah ada.
4. **Menyatukan seluruh halaman.** Satu lapisan yang sama menemani kamu dari Hero sampai Contact.

Perkiraan perubahan: ~25 baris di `Background.tsx`.

---

## 6. Referensi React Bits — apa yang diambil, apa yang ditinggal

Aku sudah cek katalog lengkapnya langsung dari repo `DavidHDev/react-bits` (bukan dari situsnya, karena reactbits.dev itu SPA dan isinya tidak terbaca oleh fetcher). Ini hasil review dependency aslinya:

| Komponen | Dependency asli | Ongkos | Putusan |
|---|---|---|---|
| **Hyperspeed** | `three` + `postprocessing` | ~150 kB gzip+ | **Ambil idenya, jangan install.** Ini referensi visual terbaik untuk warp, tapi menambah engine 3D penuh demi satu momen transisi tidak sepadan. Efek streak-nya bisa ditiru di canvas 2D yang sudah ada. |
| **Galaxy** | `ogl` | ~13 kB gzip | **Lewati.** Bagus, tapi tumpang tindih dengan starfield yang sudah kamu punya. Dua lapisan bintang malah saling meredam. |
| **ScrollFloat** / **ScrollReveal** | `gsap` + `ScrollTrigger` | ~45 kB gzip | **Ambil idenya, jangan install.** Konsep reveal per-karakter yang di-scrub itu tepat. Tapi kamu sudah punya `framer-motion` (45 kB) — memuat dua engine animasi untuk pekerjaan yang sama itu pemborosan. `useScroll` + `useTransform` sudah bisa. |
| **GradualBlur** | **tidak ada** (React + CSS murni) | ~0 kB | **Satu-satunya kandidat yang layak di-port.** Blur bertingkat di tepi bawah viewport menjual kesan kedalaman atmosfer. Tapi taruh di Fase 3 dan **uji di HP dulu** — `backdrop-filter` bertumpuk bisa berat dan bisa bikin teks di bawahnya keruh. |
| **AnimatedContent** / **FadeContent** | `gsap` | ~40 kB gzip | **Lewati.** `fadeUpVariants` di `src/lib/motion.ts` sudah melakukan hal yang persis sama. |

**Kesimpulan: nol dependency baru.**

Aku sadar kamu secara khusus minta cari referensi React Bits, jadi biar jelas — jawaban jujurnya bukan "tidak ada yang berguna", tapi: React Bits itu **katalog ide yang bagus**, dan ide yang kamu butuhkan (streak-on-acceleration dari Hyperspeed, scrubbed reveal dari ScrollFloat) bisa dibangun di stack yang sudah kamu punya dengan biaya jauh lebih kecil daripada memasang komponennya. Yang benar-benar layak disalin apa adanya cuma GradualBlur, dan itu memang tidak punya dependency.

Ini juga pelajaran dari percobaan Lightfall kemarin: komponen itu bagus, tapi `ogl` + shader fullscreen ternyata bertabrakan dengan stacking context `relative z-10` di `Home.tsx` dan starfield yang sudah ada. Menambah lapisan baru di atas lapisan yang sudah penuh itu ongkosnya lebih mahal dari kelihatannya.

---

## 7. Empat babak perjalanan

```
┌─────────────────────────────────────────────────┐
│  BABAK 1 — GERBANG            scroll 0 → 0.7vh  │
│                                                 │
│         MUHAMMAD RADITYA                        │
│      ██ HAIKAL  MUMTAZ ██        bintang: titik │
│      > Fullstack Developer       drift: pelan   │
│                                                 │
├─────────────────────────────────────────────────┤
│  BABAK 2 — LOMPATAN         scroll 0.7 → 1.3vh  │
│                                                 │
│      █ H A I K A L █  ← memampat, buram         │
│      |  |  |  |  |    ← bintang jadi streak     │
│      FEATURED WORK    ← melepas, jernih         │
│                                                 │
├─────────────────────────────────────────────────┤
│  BABAK 3 — JELAJAH        Projects → Moments    │
│                                                 │
│  tiap judul mewarisi gerakan yang sama          │
│  streak merespons kecepatan scroll              │
│  kartu & list: fade-up biasa (tetap seperti     │
│  sekarang, tidak diubah)                        │
│                                                 │
├─────────────────────────────────────────────────┤
│  BABAK 4 — TIBA                       Contact   │
│                                                 │
│  bintang melambat ke 0.3x                       │
│  "Let's work together"                          │
│  perjalanan selesai, kamu sudah sampai          │
└─────────────────────────────────────────────────┘
```

---

## 8. Spesifikasi gerak

### 8.1 Gerakan warp (dipakai ulang di semua perpindahan)

| Properti | Berangkat | Tiba | Catatan |
|---|---|---|---|
| `scaleX` | `1 → 0.62` | `0.62 → 1` | Angka `0.62` diambil dari `CONDENSED_SCALE` yang sudah ada di `Nameplate.tsx` — jangan bikin konstanta baru |
| `opacity` | `1 → 0` | `0 → 1` | |
| `y` | `0 → -40px` | `40px → 0` | |
| `filter: blur` | `0 → 6px` | — | **Hanya untuk Nameplate.** Lihat catatan di bawah |
| Easing | `easingCurves.smooth` | `easingCurves.entrance` | Sudah ada di `src/design/tokens.js` |

> **Pengekangan yang disengaja:** `blur` cuma dipakai di Nameplate, satu elemen saja. Blur pada teks selama scrub itu mahal di GPU, dan kalau dipasang di tujuh judul sekaligus halaman ini akan tersendat di HP kelas menengah. Judul section cukup `scaleX` + `opacity` + `y` — ketiganya composited, gratis. Ini "melepas satu aksesoris".

### 8.2 Streak bintang

| Parameter | Nilai | Alasan |
|---|---|---|
| Sumber kecepatan | `useVelocity(scrollY)` dari framer-motion | Jalan di jalur Lenis maupun non-Lenis |
| Perataan | `smooth += (raw - smooth) * 0.08` | Mencegah kedutan |
| Panjang streak | `clamp(|v| / 1400, 0, 1) * depth * 55px` | Bintang jauh meregang lebih pendek |
| Ambang aktif | `> 0.5px` | Di bawah itu tetap gambar titik |
| Batas HP | `28px` | Setengah dari desktop |
| Bonus warp | `× 1.6` di rentang Hero exit | Lompatan terasa lebih tegas dari scroll biasa |

### 8.3 Scrub vs trigger

Pembagian yang penting supaya tidak berlebihan:

| Elemen | Metode | Alasan |
|---|---|---|
| Nameplate, judul section | **Scrub** (`useScroll` + `useTransform`) | Terasa seperti perjalanan, reversibel, user yang pegang kendali |
| Kartu project, list experience, grid tools | **Trigger** (`whileInView`, seperti sekarang) | Lebih murah, dan konten yang harus dibaca tidak boleh bergerak-gerak mengikuti scroll |

---

## 9. Arsitektur

### 9.1 Masalah yang harus diselesaikan duluan

Kalau tiap komponen bikin `useScroll` dan `useVelocity` sendiri, akan ada belasan listener scroll dengan state kecepatan yang tidak sinkron — canvas bisa menganggap sedang warp sementara judulnya menganggap tidak. Perlu **satu sumber kebenaran**.

### 9.2 File baru

```
src/journey/JourneyProvider.tsx    pemilik MotionValue progress + velocity + warp
src/journey/useJourney.ts          hook consumer
```

### 9.3 Aliran data

```
                    framer-motion useScroll + useVelocity
                                 │
                    ┌────────────▼─────────────┐
                    │     JourneyProvider      │
                    │  progress  0 → 1         │
                    │  velocity  −1 → 1        │
                    │  warp      0 → 1         │
                    └────────────┬─────────────┘
                                 │  (MotionValue, bukan state)
         ┌───────────────┬───────┴───────┬──────────────────┐
         ▼               ▼               ▼                  ▼
   Background.tsx   Nameplate.tsx   judul section      SiteRail
   baca .get()      berangkat       tiba               (opsional)
   di dalam rAF
```

### 9.4 Tiga keputusan teknis

**Pakai `useVelocity` dari framer-motion, bukan `lenis.velocity`.**
`App.tsx` cuma memasang `ReactLenis` kalau user tidak minta reduced motion. Kalau provider bergantung ke Lenis, dia mati di jalur satunya. `useVelocity(scrollY)` jalan di dua-duanya, dan tidak menambah dependency.

**MotionValue, bukan React state.**
MotionValue tidak memicu re-render. Kecepatan scroll berubah tiap frame — kalau itu masuk `useState`, seluruh pohon komponen re-render 60× per detik dan halaman ini akan mati. Canvas membaca `.get()` di dalam rAF yang **sudah ada** di `Background.tsx`, jadi tidak ada listener tambahan sama sekali.

**Jangan pakai scroll-snap untuk "Hero jadi satu halaman".**
Kamu minta Hero terasa seperti satu halaman utuh dulu. Rekomendasiku: **jangan** pakai CSS scroll-snap atau scroll-jacking.

Alasannya: Lenis dan scroll-snap saling berebut kendali scroll dan hasilnya tersendat; snap juga merusak navigasi keyboard dan screen reader, dan di HP terasa seperti halaman yang menolak digerakkan.

Rasa "gerbang" itu tetap didapat tanpa snap — karena gerakan warp memakan ~100vh scroll pertama sebelum Projects benar-benar selesai tiba. Hero sudah `h-screen`, jadi secara visual dia memang satu layar penuh. Yang kurang selama ini cuma **transisi keluarnya**, bukan tinggi halamannya.

Kalau nanti kamu tetap mau snap, jalur paling aman: `scroll-snap-type: y proximity` (bukan `mandatory`) cuma di breakpoint desktop. Tapi saranku dicoba dulu tanpa itu.

### 9.5 Sentuhan ke file lama

| File | Perubahan | Risiko |
|---|---|---|
| `App.tsx` | Bungkus `AppShell` dengan `JourneyProvider` | Rendah |
| `Background.tsx` | `drawStar` gambar garis saat cepat; kecepatan drift ikut progress | Sedang — ini jantung efeknya, uji FPS |
| `Nameplate.tsx` | Tambah `blur` + `y` ke transform yang sudah ada | Rendah |
| `Hero.tsx` | Teruskan rentang scroll warp | Rendah |
| `FeaturedProjects.tsx` | Judul "FEATURED WORK" pakai gerakan tiba | Rendah — **teksnya tidak disentuh** |
| `lib/motion.ts` | Tambah helper gerakan warp | Rendah |
| 5 judul section sisanya | Gerakan yang sama (Fase 2) | Rendah |

Catatan untuk Fase 2: heading di 7 section markup-nya berbeda-beda (`FavoriteMoments` pakai dua `<h2>` terpisah, `Experience` sudah punya `wordVariants` sendiri). Jadi jangan paksa satu komponen `SectionHeading` untuk semuanya di awal — bungkus per kasus dulu, ekstrak jadi komponen bersama hanya kalau polanya benar-benar sama. Kalau diekstrak, teks dan className harus disalin persis.

---

## 10. Lantai kualitas

| Aspek | Penanganan |
|---|---|
| **Reduced motion** | Streak mati total, gerakan warp jadi fade statis, drift bintang berhenti. `usePrefersReducedMotion` sudah terpasang di semua file terkait |
| **Mobile** | Panjang streak dibatasi 28px, blur Nameplate dimatikan di bawah `md`, `GradualBlur` tidak dipasang sama sekali |
| **Keyboard** | Tidak ada scroll-jacking, jadi Tab dan Page Down tetap normal. Fokus ring tidak disentuh |
| **Tanpa JS / gagal canvas** | Background sudah punya base `bg-[#0a0a0a]`, teks tetap terbaca |
| **Performa** | Target 60fps di mid-tier. Ukur `Background.tsx` sebelum dan sesudah pakai Performance tab. Kalau turun, kurangi `STAR_DENSITY` dari 8000 |

---

## 11. Tahapan

**Fase 1 — inti perjalanan** (paling berdampak, kerjakan ini dulu)
1. `JourneyProvider` + `useJourney`
2. Streak bintang di `Background.tsx`
3. Nameplate berangkat
4. "FEATURED WORK" tiba dengan gerakan yang sama

Setelah Fase 1 selesai, efek utamanya sudah terasa dan bisa dinilai. Berhenti di sini juga sudah jadi peningkatan yang nyata.

**Fase 2 — sebarkan gerakannya**

5. 5 judul section sisanya
6. Sinkronkan indikator `SiteRail` dengan progress
7. Perlambatan bintang di Contact

**Fase 3 — opsional, evaluasi ulang setelah Fase 1–2 jalan**

8. Urutan dominasi orb mengikuti kedalaman
9. Port `GradualBlur` — **uji di HP dulu sebelum diputuskan**

---

## 12. Yang perlu kamu putuskan

1. **Fase 3 soal orb** — mengurutkan dominasi ungu → cyan → fuchsia itu masih dalam batas "tidak mengubah warna utama" menurutmu, atau lebih baik dibuang?
2. **Intensitas warp** — mau yang tegas dan sinematik, atau halus dan hampir tidak sadar? Ini menggeser angka di 8.2. Saranku mulai dari halus, naikkan setelah lihat aslinya.
3. **Hero sebagai gerbang** — setuju tanpa scroll-snap seperti di 9.4, atau tetap mau dicoba snap-nya?

---

## Sumber

- [React Bits](https://reactbits.dev/) — katalog komponen
- [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) — sumber yang dipakai untuk verifikasi dependency
- [Hyperspeed](https://reactbits.dev/backgrounds/hyperspeed) — referensi visual warp
- [Scroll Float](https://reactbits.dev/text-animations/scroll-float) — referensi scrubbed text reveal
- [Galaxy](https://reactbits.dev/backgrounds/galaxy) — ditinjau, tidak dipakai
