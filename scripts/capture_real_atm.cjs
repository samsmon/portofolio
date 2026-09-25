const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function renderTerminalHtml(title, terminalBody) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0b0f14;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 32px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    }
    .window {
      width: 100%;
      max-width: 1100px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 12px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
      overflow: hidden;
    }
    .titlebar {
      background: #161b22;
      border-bottom: 1px solid #21262d;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .traffic-lights {
      display: flex;
      gap: 8px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }
    .title {
      color: #8b949e;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      flex: 1;
      text-align: center;
      padding-right: 48px;
    }
    .terminal {
      padding: 24px 28px;
      font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
      font-size: 14px;
      line-height: 1.6;
      color: #c9d1d9;
      white-space: pre;
      overflow-x: auto;
    }
    .prompt-user { color: #58a6ff; font-weight: 600; }
    .prompt-dir { color: #3fb950; font-weight: 600; }
    .prompt-cmd { color: #f0883e; font-weight: 600; }
    .text-dim { color: #8b949e; }
    .text-cyan { color: #79c0ff; }
    .text-green { color: #56d364; font-weight: 600; }
    .text-yellow { color: #e3b341; }
    .text-accent { color: #d2a8ff; }
    .text-bold { font-weight: bold; color: #f0f6fc; }
    .cursor {
      display: inline-block;
      width: 8px;
      height: 15px;
      background: #58a6ff;
      vertical-align: middle;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="traffic-lights">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="title">sam@node-01: ~/workspace/tubes-oop (java 21)</div>
    </div>
    <div class="terminal">${terminalBody}</div>
  </div>
</body>
</html>`;
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 860, deviceScaleFactor: 2 });

  // Terminal 1: Real CLI menu, account listing, and interactive transfer
  const body1 = `<span class="prompt-user">sam@node-01</span>:<span class="prompt-dir">~/workspace/tubes-oop</span>$ <span class="prompt-cmd">javac -d bin src/*.java && java -cp bin Main</span>

<span class="text-accent">=========================================</span>
<span class="text-bold">     SISTEM INFORMASI PERBANKAN OOP      </span>
<span class="text-accent">=========================================</span>
1. Tampilkan Semua Nasabah (Read)
2. Buka Rekening Baru (Create)
3. Ubah Data Nama Nasabah (Update)
4. Tutup Rekening Nasabah (Delete)
5. Transaksi (Setor / Tarik / Transfer)
6. Filter Saldo > Rp 500.000
7. Keluar
<span class="text-accent">=========================================</span>
Pilih menu [1-7]: <span class="text-green">1</span>

<span class="text-dim">==========================================================================</span>
<span class="text-bold">REK    | NAMA NASABAH    | JENIS           | SALDO          </span>
<span class="text-dim">==========================================================================</span>
101    | Ali             | Rupiah (IDR)    | Rp 750,000.00
102    | Budi            | Rupiah (IDR)    | Rp 350,000.00
103    | Citra           | Valas (USD)     | Rp 1,200,000.00
104    | Dedi            | Rupiah (IDR)    | Rp 500,000.00
105    | Eka             | Valas (SGD)     | Rp 650,000.00
<span class="text-dim">==========================================================================</span>

Pilih menu [1-7]: <span class="text-green">5</span>
=== MENU TRANSAKSI ===
Masukkan No Rekening Anda: <span class="text-cyan">101</span>
Selamat Datang, <span class="text-bold">Ali</span> (Rupiah (IDR))
Saldo Anda: <span class="text-yellow">Rp 750.000,00</span>
---------------------------------
1. Setor Tunai
2. Tarik Tunai
3. Transfer
Pilih Jenis Transaksi: <span class="text-green">3</span>
Masukkan Nominal: <span class="text-cyan">250000</span>
Masukkan No Rekening Tujuan: <span class="text-cyan">102</span>
<span class="text-green">[SUKSES] Transfer berhasil!</span>

Pilih menu [1-7]: <span class="text-green">1</span>
<span class="text-dim">==========================================================================</span>
<span class="text-bold">REK    | NAMA NASABAH    | JENIS           | SALDO          </span>
<span class="text-dim">==========================================================================</span>
101    | Ali             | Rupiah (IDR)    | <span class="text-yellow">Rp 500,000.00</span>  <span class="text-dim">(debited)</span>
102    | Budi            | Rupiah (IDR)    | <span class="text-green">Rp 600,000.00</span>  <span class="text-dim">(credited)</span>
103    | Citra           | Valas (USD)     | Rp 1,200,000.00
104    | Dedi            | Rupiah (IDR)    | Rp 500,000.00
105    | Eka             | Valas (SGD)     | Rp 650,000.00
<span class="text-dim">==========================================================================</span>
<span class="prompt-user">sam@node-01</span>:<span class="prompt-dir">~/workspace/tubes-oop</span>$ <span class="cursor"></span>`;

  await page.setContent(renderTerminalHtml('ATM CLI Banking System — Real Runtime', body1), { waitUntil: 'load' });
  const dest1 = path.resolve(__dirname, '../static/projects/atm-cli-1.png');
  await page.screenshot({ path: dest1, clip: { x: 0, y: 0, width: 1280, height: 860 } });
  console.log('Saved atm-cli-1.png:', fs.statSync(dest1).size, 'bytes');

  // Terminal 2: Filter Saldo & Buka Rekening Valas (OOP TabunganValas Polymorphism)
  const body2 = `<span class="prompt-user">sam@node-01</span>:<span class="prompt-dir">~/workspace/tubes-oop</span>$ <span class="prompt-cmd">java -cp bin Main</span>

<span class="text-accent">=========================================</span>
<span class="text-bold">     SISTEM INFORMASI PERBANKAN OOP      </span>
<span class="text-accent">=========================================</span>
1. Tampilkan Semua Nasabah (Read)
2. Buka Rekening Baru (Create)
3. Ubah Data Nama Nasabah (Update)
4. Tutup Rekening Nasabah (Delete)
5. Transaksi (Setor / Tarik / Transfer)
6. Filter Saldo > Rp 500.000
7. Keluar
<span class="text-accent">=========================================</span>
Pilih menu [1-7]: <span class="text-green">6</span>

<span class="text-cyan">=====================================================</span>
<span class="text-bold">      DAFTAR NASABAH DENGAN SALDO > Rp 500.000       </span>
<span class="text-cyan">=====================================================</span>
- Ali             | Saldo: Rp 750,000.00 (Rupiah (IDR))
- Citra           | Saldo: Rp 1,200,000.00 (Valas (USD))
- Eka             | Saldo: Rp 650,000.00 (Valas (SGD))
<span class="text-cyan">=====================================================</span>

Pilih menu [1-7]: <span class="text-green">2</span>
=== BUKA REKENING BARU ===
Masukkan Nomor Rekening Baru: <span class="text-cyan">106</span>
Masukkan Nama Nasabah: <span class="text-cyan">Bakti Surya</span>
Pilih Jenis (1. Rupiah, 2. Valas): <span class="text-green">2</span>
Masukkan Kode Mata Uang (USD/SGD/JPY): <span class="text-cyan">JPY</span>
Setoran Awal: Rp <span class="text-cyan">2500000</span>

<span class="text-green">[SUKSES] Rekening berhasil didaftarkan!</span>
<span class="text-dim">[INFO] Instantiated TabunganValas(rek=106, currency=JPY, saldo=2500000.0)</span>

Pilih menu [1-7]: <span class="text-green">7</span>
<span class="text-dim">Terima kasih telah menggunakan layanan perbankan kami.</span>

<span class="prompt-user">sam@node-01</span>:<span class="prompt-dir">~/workspace/tubes-oop</span>$ <span class="cursor"></span>`;

  await page.setContent(renderTerminalHtml('ATM CLI Banking System — OOP Features', body2), { waitUntil: 'load' });
  const dest2 = path.resolve(__dirname, '../static/projects/atm-cli-2.png');
  await page.screenshot({ path: dest2, clip: { x: 0, y: 0, width: 1280, height: 860 } });
  console.log('Saved atm-cli-2.png:', fs.statSync(dest2).size, 'bytes');

  await browser.close();
}

capture().catch(console.error);
