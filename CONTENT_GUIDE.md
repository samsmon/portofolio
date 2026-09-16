# Panduan Konten: Section Portofolio, Page Projects, dan Page Blog

Panduan praktis untuk memperbarui isi situs, baik secara manual maupun lewat AI agent (Claude Code, Cursor, Copilot, dan sejenisnya). Tidak ada CMS. Semua konten adalah file di repo, situs di-prerender menjadi HTML statis saat `npm run build`.

Tiga sumber konten:

| Bagian situs | Sumber | Catatan |
| --- | --- | --- |
| Landing page (`/`): hero, about, skills, portfolio, contact | `src/lib/content/site.js` | Satu file, satu sumber kebenaran. Jangan hardcode teks di `.svelte`. |
| Page projects (`/projects`, `/projects/[slug]`) | `src/lib/content/site.js` (`projects`) plus gambar di `static/projects/` | Halaman detail dibuat otomatis dari `slug`. |
| Page blog (`/blog`, `/blog/[slug]`) | `src/posts/*.md` plus gambar di `static/assets/img/posts/` | Satu file markdown per artikel. |

---

## 0. Alur kerja dasar (berlaku untuk semua bagian)

```bash
npm install          # sekali saja
npm run dev          # http://localhost:5173, hot reload
npm run build        # wajib exit 0 sebelum commit; ini juga memvalidasi link internal
npm run preview      # cek hasil build persis seperti produksi
```

Setelah build lolos:

1. Untuk perubahan kode atau struktur, tambahkan entri di `CHANGELOG.md` (format: `[HH:MM WIB]`, judul, file terkait, alasan, solusi, dampak). Menambah artikel blog atau mengubah teks di `site.js` saja tidak wajib masuk changelog.
2. Commit dengan format Conventional Commits (`feat:`, `fix:`, `docs:`, `content:` untuk teks, `chore:`), atas nama pemilik repo, tanpa atribusi AI.
3. Push ke `main`. GitHub Pages ter-deploy otomatis lewat `.github/workflows/deploy.yml`; homelab menarik ulang image lewat `docker compose` (lihat README bagian Deployment).

Peringatan build yang wajar: `404 /blog/<slug>` berarti ada tautan ke artikel yang `published: false`. Perbaiki tautannya atau terbitkan artikelnya.

---

## 1. Section portofolio di landing page

Semua teks dipetakan ke export di `src/lib/content/site.js`:

| Section | Export yang dipakai | Yang perlu diketahui |
| --- | --- | --- |
| Hero | `identity.display` (dua baris nama), `identity.role` (dua baris peran), `identity.trivia` (dua kalimat kecil), `identity.title` (judul tab), `identity.tagline` (meta description), `identity.url` (origin untuk OG dan sitemap) | Baris nama sebaiknya maksimal 7 huruf per baris agar tidak pecah di ponsel. |
| Judul section | `headings.about`, `headings.skills`, `headings.portfolio`, `headings.contact` | Label nav tetap literal (About, Skills, dan seterusnya). |
| About | `about.intro`, `about.body[]`, `about.status`, `about.location`, `about.portrait` | `portrait` berisi `primary` (ilustrasi, tampil default), `secondary` (foto formal, muncul saat hover atau tap), `alt`. Kedua file diletakkan di `static/` dengan rasio 3:4. Set `portrait: null` untuk memakai placeholder snake. |
| Statistik | `stats[]` (4 kartu: `value`, `label`) | Angka apa adanya, jangan angka yang tidak bisa dipertanggungjawabkan. |
| Skills | `stack[]` per layer: `layer`, `code`, `items[]` | Item: `id`, `name`, `badge` (`CORE`, `PROD`, `DAILY`, `LAB`), `readiness` (0 sampai 100, ditampilkan sebagai proficiency self-assessed), `role`, `deployedAt`. Field `detail` dan `command` tidak dirender. Tidak ada hitungan yang perlu disinkronkan manual. |
| Currently building | `building` (`project`, `tagline`, `status`, `stack[]`) | Kartu sorotan di atas grid portfolio. |
| Portfolio | 4 item pertama dari `projects[]` | Urutan array menentukan yang tampil. Klik kartu membuka modal ringkas; tombol arsip menuju `/projects`. |
| Contact | `contact.body`, `contact.email`, `contact.links[]`, `availability` (`status`, `type`, `location`, `roles[]`), `resume` (`url`, `filename`, `lastUpdated`) | Tombol View resume membuka modal yang menautkan `resume.url`. Pastikan `static/cv-suryatmaja.pdf` adalah PDF sungguhan. |

Contoh: mengganti kalimat pembuka About dan menambah satu statistik.

```js
// src/lib/content/site.js
export const about = {
  intro: 'Halo, saya Maja. Full-stack developer yang juga mengurus infrastruktur tempat aplikasinya berjalan.',
  body: ['Paragraf 1', 'Paragraf 2'],
  location: 'Bandung, West Java',
  status: 'Node 01: Staging & Lab Assembly',
  portrait: { primary: '/portrait-illustrated.jpg', secondary: '/portrait-formal.jpg', alt: 'Bakti Surya Atmaja' }
};

export const stats = [
  { value: '4+', label: 'Years in Code' },
  { value: '15+', label: 'Homelab Services' },
  { value: '12+', label: 'Shipped Systems' },
  { value: '2', label: 'AWS Certifications' }
];
```

Aset visual lain yang menyertai landing page:

- `static/og-preview.png`: kartu sosial 1200x630 yang muncul saat tautan dibagikan. Desain mengikuti hero (Epilogue Black, Fira Code, hitam dan krem, aksen hijau).
- `static/favicon*.svg`: ikon tab untuk tema gelap dan terang.

---

## 2. Page projects

Data: `export const projects` di `site.js`. Setiap objek:

```js
{
  slug: 'homelab',                 // menjadi /projects/homelab; huruf kecil, tanda hubung
  title: 'Homelab',
  kind: 'Infrastructure',          // teks bebas; menjadi tombol filter di /projects
  year: 'Since 2024',              // string, boleh rentang
  summary: 'Satu atau dua kalimat untuk kartu.',
  detail: ['Paragraf 1', 'Paragraf 2', 'Paragraf 3'],   // halaman detail
  stack: ['Proxmox VE', 'Docker', 'Terraform'],
  images: ['/projects/homelab-1.svg', '/projects/homelab-2.svg'],  // file di static/projects/
  links: [{ label: 'Repo', href: 'https://github.com/srytmj/...' }]
}
```

Aturan yang berlaku otomatis:

- Pencarian mencocokkan `title`, `summary`, dan `stack`. Filter kategori dibangun dari nilai `kind` yang ada.
- Halaman `/projects` menampilkan 6 proyek per halaman.
- Halaman detail `/projects/[slug]` dan entri `sitemap.xml` dibuat dari `slug` saat build. Mengganti `slug` berarti mengganti URL; tambahkan tautan baru di artikel blog yang merujuknya.
- Tautan dengan `href: '#'` tetap tampil sebagai tombol mati. Isi dengan URL nyata atau hapus dari array.
- Gambar: letakkan di `static/projects/`, rasio 16:10, ukuran di bawah 300 KB, format SVG atau PNG. Diagram arsitektur lebih bernilai daripada tangkapan layar UI.

Langkah menambah proyek: tambah objek di akhir `projects` (atau di posisi atas jika ingin tampil di landing page), taruh gambar, `npm run dev`, cek `/projects` dan `/projects/<slug>`, `npm run build`.

---

## 3. Page blog

### File dan URL

File di `src/posts/` dengan nama `YYYY-MM-DD-slug-artikel.md`. Slug adalah nama file tanpa tanggal, dan menjadi URL `/blog/slug-artikel`. Slug harus unik.

### Front matter

Sesuaikan persis dengan artikel yang sudah ada:

```yaml
---
title: "Judul Artikel"
description: "Satu kalimat ringkasan, dipakai di kartu dan meta description."
author: srytmj
date: 2026-09-10 00:00:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, ai, rag]
pin: false
math: false
mermaid: true
published: true
---
```

- `categories`: maksimal dua level. Level pertama menjadi kategori utama, level kedua menjadi subgrup di tab Categories.
- `tags`: huruf kecil, dipakai untuk tab Tags dan pill filter di beranda blog.
- `published: false` menyembunyikan artikel sepenuhnya, tidak ikut di-prerender. Tautan ke artikel tersembunyi akan 404.
- `mermaid: true` cukup dinyalakan jika artikel memuat diagram; jika lupa, parser tetap mendeteksi blok `mermaid`.
- `media_subpath` (opsional): prefix untuk gambar dengan path relatif.

### Isi artikel

- Heading `##` dan `###` menjadi Table of Contents di sisi kanan reader.
- Blok kode dengan nama bahasa (`bash`, `javascript`, `typescript`, `json`, `yaml`, `python`, `sql`, `docker`, `nginx`, `ini`, `markdown`, `html`, `css`). Tambahkan `{: file='nama-file.ext'}` di baris pertama blok untuk menampilkan nama file di header blok kode.
- Diagram: blok kode `mermaid`, dirender di browser mengikuti tema aktif.
- Kotak catatan gaya Chirpy:

  ```markdown
  > Isi catatan.
  {: .prompt-tip }
  ```

  Tipe yang tersedia: `prompt-tip`, `prompt-info`, `prompt-warning`, `prompt-danger`. Sintaks `> [!NOTE]` ala GitHub tidak dirender khusus.
- Gambar: simpan di `static/assets/img/posts/YYMMDD/slug-artikel/`, rujuk dengan path absolut `/assets/img/posts/YYMMDD/slug-artikel/nama.png`. Untuk animasi, pakai video MP4 atau WebM, bukan GIF berukuran besar.
- Tautan antar artikel: `/blog/slug-lain`. Tautan gaya Jekyll `/posts/slug/` ikut ditulis ulang otomatis.
- Tautan eksternal otomatis dibuka di tab baru.
- Jangan pakai em dash. Aturan gaya penulisan untuk seri AWS re/Start ada di `CLAUDE.md`.

### Di mana artikel muncul

Beranda blog (terbaru dulu, 10 per halaman), tab Categories, tab Tags, tab Archive (per tahun dan bulan), `sitemap.xml`, dan kartu Open Graph per artikel. Semua tab punya URL sendiri (`/blog?tab=archive`, `/blog?category=AWS%20re%2FStart`, `/blog?tag=aws`) sehingga bisa dibagikan langsung.

---

## 4. Memakai AI agent

Agent yang bekerja di repo ini otomatis membaca `CLAUDE.md` (aturan git dan konfirmasi) dan wajib mengikuti `AI_GUIDELINES.md` (aturan desain dan kode). Yang perlu Anda lakukan hanyalah memberi konteks yang cukup dan menyebut bagian mana yang disentuh.

Prinsip yang berlaku untuk agent apa pun:

1. Konten diedit di `site.js` atau `src/posts/`, bukan di komponen `.svelte`.
2. Agent harus menjalankan `npm run build` dan melaporkan hasilnya.
3. Perubahan kode dicatat di `CHANGELOG.md`. Commit atas nama pemilik repo, tanpa co-author AI.
4. Agent mengonfirmasi sebelum commit, dan tidak pernah push tanpa perintah eksplisit di giliran yang sama.

### Contoh prompt: section portofolio

```
Update section About di landing page. Ganti about.intro jadi "<teks>", tambah satu paragraf di about.body:
"<teks>". Ganti stats keempat jadi { value: '2', label: 'AWS Certifications' }.
Edit hanya src/lib/content/site.js, jalankan npm run build, lalu tunjukkan diff sebelum commit.
```

### Contoh prompt: page projects

```
Tambahkan proyek baru ke projects di src/lib/content/site.js:
slug "lab-monitoring", title "Lab Monitoring Stack", kind "Infrastructure", year "2026",
summary "<satu kalimat>", detail tiga paragraf dari catatan berikut: <catatan>.
Stack: Prometheus, Grafana, Loki, Docker. Gambar sudah ada di static/projects/lab-monitoring-1.svg.
Link: Repo -> https://github.com/srytmj/lab-monitoring. Taruh di urutan ke-3 supaya tampil di landing page.
Cek /projects dan /projects/lab-monitoring lewat npm run build, lalu minta konfirmasi sebelum commit.
```

### Contoh prompt: page blog

```
Jadi Author. Buat artikel Journal dan Materi dari transkrip berikut untuk tanggal 2026-09-18
(Week 7 Hari 4). Ikuti format front matter dan gaya penulisan di CLAUDE.md, simpan di src/posts/,
pakai kategori [AWS re/Start, Journal] dan [AWS re/Start, Materi], jangan pakai em dash,
lalu jalankan npm run build dan laporkan judul, file, dan ada tidaknya koreksi tanggal.
<transkrip>
```

### Yang harus ada di laporan agent

- Daftar file yang berubah dan alasan singkatnya.
- Hasil `npm run build` (exit 0) beserta peringatan 404 yang tersisa, kalau ada.
- Entri changelog yang ditambahkan, untuk perubahan kode.
- Pertanyaan konfirmasi sebelum commit.

---

## 5. Checklist sebelum commit

- [ ] `npm run build` exit 0.
- [ ] Tidak ada tautan mati baru di output build.
- [ ] Teks baru tidak mengandung em dash.
- [ ] Gambar baru sudah dioptimalkan (PNG atau WebP untuk foto, SVG untuk diagram, MP4 untuk animasi).
- [ ] Perubahan kode tercatat di `CHANGELOG.md`.
- [ ] Pesan commit mengikuti Conventional Commits, tanpa atribusi AI.
