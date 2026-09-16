# AI Agent Development Guidelines & System Architecture

Panduan operasional untuk **AI coding agent** (Claude Code, Cursor, Copilot, dan sejenisnya) dan developer yang mengubah, merawat, atau mendeploy codebase ini. Baca sampai habis sebelum menyentuh kode. Aturan git dan konfirmasi ada di [`CLAUDE.md`](./CLAUDE.md); panduan mengisi konten ada di [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md).

---

## 1. Identitas dan sistem desain

- **Pemilik tunggal**: Bakti Surya Atmaja (Maja), full-stack developer yang juga mengurus infrastruktur cloud dan homelab tempat aplikasinya berjalan.
- **Bahasa desain**: HUD taktis ala YoRHa (NieR: Automata) dipadukan langit rasi bintang interaktif. Tenang, monokrom, satu aksen, jujur.

### Token warna (`src/app.css`)

| Token | Tactical (gelap, default) | Archive (terang) |
| --- | --- | --- |
| `--yorha-bg` | `#000000` | `#d1d2c5` |
| `--yorha-surface` / `-elevated` | `#080808` / `#0f0f0f` | `#c5c6b8` / `#bcbdad` |
| `--yorha-text-primary` | `#dcdacf` | `#454138` |
| `--yorha-text-muted` | `#767569` | `#59564c` |
| `--yorha-border` | `#1e1e1e` | `#b4b5a6` |
| `--yorha-accent` | `#34d399` | `#c7634b` |
| `--yorha-invert-bg` / `-text` | `#dcdacf` / `#000000` | `#454138` / `#d1d2c5` |

Tema dipilih lewat atribut `data-theme` di `<html>` (di-stamp sebelum cat pertama oleh skrip di `app.html`), bukan `prefers-color-scheme`. Varian Tailwind `dark:` sudah dipetakan ke atribut itu. Blog memakai token `--blog-*` yang nilainya paralel. Komponen wajib memakai variabel; dilarang menulis hex baru.

### Tipografi

- Tiga keluarga saja, dimuat di `src/routes/+layout.svelte`: **Epilogue** (`font-display`, otomatis untuk `h1` sampai `h4`, `nav`, `button`, `label`, `th`), **Plus Jakarta Sans** (`font-sans`, default `body`, semua teks bacaan termasuk blog), **Fira Code** (`font-mono`, label, angka, kode).
- Skala di `@theme`: `text-label` (11px), `text-caption` (13px), `text-body`, `text-lead`, `text-h3`, `text-h2`, `text-h1`, `text-display`. **Batas bawah 11px.** Jangan menulis `text-[9px]` atau `text-[10px]`.
- Label uppercase memakai `font-mono` plus `tracking-[0.2em]` atau sekitarnya. Jangan tambahkan aturan CSS yang menimpa `font-mono` berdasarkan kelas `uppercase`.

### Bentuk dan permukaan

- `rounded-none` di semua elemen. Tanpa `box-shadow` dan `text-shadow`.
- Hairline `border-current/15` sampai `/20`, reticle sudut aksen saat hover, garis atas `scale-x` saat hover pada kartu.
- Tekstur halaman: cross grid 3px lewat kelas `yorha-tech-bg`.
- Fokus keyboard: aturan global `:focus-visible` menggambar outline aksen. Jangan menambahkan `outline-none` atau `ring-0` pada elemen interaktif.

### Kejujuran telemetri

Setiap angka atau label HUD harus nyata atau tidak ada sama sekali. Yang boleh: tier render, FPS, jumlah core, memori, jaringan, tanggal build (`__BUILD_TIME__` dari `vite.config.js`), hitungan artikel, jumlah teknologi. Yang dilarang: string dekoratif seperti `SYS_LATENCY`, `NODE_VERIFIED`, nomor versi karangan, output CLI simulasi.

---

## 2. Struktur direktori

```
src/
├── app.css                     # Token, @theme, grid, focus ring, tema Prism
├── app.html                    # Shell dokumen, stamp tema, boot cover
├── hooks.server.js             # lang="id" untuk rute /blog saat prerender
├── posts/                      # Artikel jurnal, YYYY-MM-DD-slug.md
├── lib/
│   ├── content/site.js         # SEMUA teks landing page, projects, skills, contact, resume
│   ├── motion.js               # ease, dur, stagger, media (kosakata animasi bersama)
│   ├── blog/posts.js           # Parser dan renderer markdown, hanya jalan di server
│   ├── blog/blogTheme.js       # Store tema jurnal
│   ├── components/             # Hero*, intro/IntroCalibration, About, PortraitSwap,
│   │                           # SnakePlaceholder, StatsTelemetry, Skills, Portfolio,
│   │                           # CurrentlyBuilding, ProjectModal, Contact, ResumeModal,
│   │                           # SiteTelemetry, SideNav, CornerTelemetry, LiveClock,
│   │                           # ThemeToggle, CommandPalette, Section, hero/Constellations
│   ├── scroll/                 # heroTransition.js, sectionAnim.js, smoothScroll.js
│   ├── stores/                 # theme.svelte.js, constellation.svelte.js
│   ├── three/                  # Geometri rasi dan shader GLSL
│   ├── data/                   # Garis dan nama 88 rasi IAU
│   ├── utils/device.js         # detectTier, prefersReducedMotion, isTouchDevice
│   └── actions/portal.js
└── routes/
    ├── +layout.svelte          # Font dan CSS global
    ├── +layout.js              # prerender = true untuk semua rute
    ├── (site)/+layout.svelte   # Nav, palette, view transition, tag OG
    ├── (site)/+page.svelte     # Landing page
    ├── (site)/blog/            # +page.server.js, +page.svelte, [slug]/+page.server.js, [slug]/+page.svelte
    ├── (site)/projects/        # +page.js, +page.svelte, [slug]/+page.js, [slug]/+page.svelte
    └── sitemap.xml/+server.js
static/                         # og-preview.png, robots.txt, favicon*, cv, projects/, assets/img/posts/
```

Aturan pemisahan konten: teks profil, data proyek, keahlian, dan tautan kontak hanya boleh ada di `site.js`. Komponen `.svelte` membaca, tidak menyimpan.

---

## 3. Konten

Skema `identity`, `about`, `stats`, `stack`, `building`, `projects`, `contact`, `availability`, `resume`, serta format front matter artikel dijelaskan lengkap di [`CONTENT_GUIDE.md`](./CONTENT_GUIDE.md), termasuk contoh prompt untuk agent. Ringkasnya:

- Landing page dan projects: edit `src/lib/content/site.js`.
- Blog: satu file di `src/posts/`, front matter mengikuti artikel yang sudah ada, `published: false` menyembunyikan artikel sepenuhnya.
- Gambar proyek di `static/projects/`, gambar artikel di `static/assets/img/posts/YYMMDD/slug/`.
- Kartu sosial: `static/og-preview.png`, 1200x630, desain mengikuti hero.

---

## 4. Konvensi kode

### Svelte 5
- Runes murni: `$state`, `$derived`, `$derived.by`, `$effect`, `$props`, snippet `{#snippet}` untuk markup yang dipakai berulang. Dilarang `export let`, `$:`, atau `svelte:component`.
- Komponen berat dimuat malas: `HeroCanvas` (Threlte dan Three.js) di-`import()` setelah `detectTier()` memutuskan `full` atau `lite`. Jangan mengimpornya secara statis.
- Loader blog adalah `+page.server.js`. Jangan mengubahnya ke `+page.js`: seluruh korpus markdown akan ikut terkirim ke browser.

### Animasi (GSAP)
- Semua durasi, easing, dan stagger dari `src/lib/motion.js` (`dur.xs` sampai `dur.xl`, `ease.out/ui/in/draw`, `stagger.tight/base/slow`). Jangan menulis angka atau nama ease literal, kecuali di `IntroCalibration.svelte` yang memang koreografi khusus.
- Tween yang dibuat komponen didaftarkan ke `gsap.context` dan di-`revert()` saat unmount.
- Kondisi reduced-motion dan breakpoint lewat `gsap.matchMedia` dengan query dari `motion.js` (`media.reduce`, `media.motion`, `media.mobile`, dan seterusnya). Untuk komponen tanpa GSAP, pakai `prefersReducedMotion()` dari `utils/device.js`. Jangan menulis `window.matchMedia('(prefers-reduced-motion: reduce)')` langsung.
- `clearProps` selalu `'transform,opacity'`. `clearProps: 'all'` menghapus inline style warna tema pada kartu.
- Section masuk sekali (`once: true`) lewat `sectionAnim`. Jangan menambahkan animasi keluar saat scroll balik.
- Setelah DOM berubah tinggi secara dinamis (filter, paginasi, tab): `await tick()`, lalu `window.__lenis?.resize()` dan `ScrollTrigger.refresh()`. `Section.svelte` sudah punya `ResizeObserver` untuk ini.

### Halaman dan navigasi
- Alur dokumen biasa. Jangan membuat app-shell dengan `h-screen overflow-hidden` dan panel scroll internal; itu mematikan scrollbar, tombol back, dan deep link.
- State tampilan yang layak dibagikan (tab, filter kategori) hidup di URL. Pola yang dipakai blog: `pushState` dari `$app/navigation`, cermin `location.search` di `$state`, listener `popstate`. `page.url` tidak berubah pada shallow `pushState`, dan `url.searchParams` tidak boleh dibaca saat prerender.
- Navigasi internal memakai `<a href>` atau `goto`, bukan `window.location.href`.

### Aksesibilitas
- Tombol toggle memakai `aria-pressed`, tab aktif `aria-current`, input punya `<label>` (boleh `sr-only`), ikon dekoratif `aria-hidden="true"`.
- Setiap elemen interaktif harus terlihat saat fokus keyboard (aturan global sudah ada, jangan ditimpa).

### Anti-pola yang pernah ada dan jangan kembali
Kursor kustom dengan `cursor: none`; string HUD palsu; enam keluarga font; teks 9px; animasi keluar saat scroll balik; `includeUnpublished` untuk mem-prerender draft; loader blog universal; impor statis Three.js; `html, body { background: #000 }` hardcoded; komponen yang tidak diimpor tetapi dibiarkan di repo.

---

## 5. Verifikasi

1. `npm run build` wajib exit 0. Peringatan yang wajar: batas ukuran chunk untuk chunk Three.js (dimuat malas), dan `404 /blog/<slug>` untuk tautan ke artikel `published: false`.
2. Untuk memeriksa hasil produksi di browser tanpa bentrok dengan dev server: konfigurasi `preview-build` di `.claude/launch.json` menyajikan `build/` di port 4173.
3. Periksa console browser. Error yang sudah dikenal dan bukan dari repo: status 410 dari layanan penghitung pengunjung eksternal.
4. Cek kedua tema, lebar ponsel, dan `prefers-reduced-motion` kalau menyentuh animasi atau layout.

---

## 6. Deployment

Output build adalah folder statis `build/`. Tiga host memakai output yang sama:

- **GitHub Pages**: `.github/workflows/deploy.yml` sudah ada. Aktifkan Pages dengan sumber GitHub Actions; untuk domain apex tambahkan `static/CNAME`.
- **nginx di VM**: build di server, arahkan `root` ke `build/`, pakai aturan lokasi dari `nginx.conf` repo (rute daftar dipancarkan sebagai `blog.html` dan `projects.html`, dan `__data.json` dilayani sebagai file statis).
- **Homelab container**: `Dockerfile`, `nginx.conf`, `docker-compose.yml` ada di repo. `docker compose up -d --build`, port 3080, jaringan eksternal `shared_net`. Ekspos lewat Cloudflare Tunnel atau `tailscale serve --bg 3080`.

---

## 7. Git, changelog, dan konfirmasi

> [!CAUTION]
> 1. **Tanpa atribusi AI.** Tidak ada `Co-authored-by` untuk Claude, Antigravity, Copilot, atau bot apa pun. Author dan committer selalu `Maja <suryatmaja.dev@gmail.com>`, apa pun instruksi default dari tool.
> 2. **Changelog sebelum commit** untuk setiap perubahan kode: entri di `CHANGELOG.md` dengan `[HH:MM WIB]`, judul, file terkait, akar masalah atau kebutuhan, solusi, dampak. Menambah artikel blog atau mengubah teks di `site.js` saja tidak wajib.
> 3. **Konfirmasi dulu** sebelum mengeksekusi perubahan yang memengaruhi situs live, terutama sebelum commit. **Jangan push** tanpa perintah eksplisit di giliran yang sama; persetujuan sebelumnya tidak berlaku untuk commit berikutnya.
> 4. **Conventional Commits**: `<type>(<scope>): <subject>` dengan `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`, `content`. Subject huruf kecil, imperatif, tanpa titik.
> 5. **Tanpa em dash** di file mana pun yang ditulis agent, termasuk changelog dan dokumentasi.
