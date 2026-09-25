const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tubesPublic = 'C:\\Users\\Sam\\Documents\\GitHub\\framework-tubes\\public';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(tubesPublic, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

function getTubesLayout(contentHtml, activeMenu = 'penjualan') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pecel Lele Mas Bakti — Laravel Accounting</title>
  <link rel="stylesheet" href="http://127.0.0.1:8785/css/styles.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f4f6fa; }
    table.dataTable thead tr { background-color: LightGray; }
    table.dataTable tfoot tr { background-color: LightGray; }
    .left-sidebar { width: 270px; background: #fff; border-right: 1px solid #e5eaef; position: fixed; top: 0; bottom: 0; z-index: 10; }
    .brand-logo { padding: 20px 24px 10px; }
    .brand-logo img { max-width: 170px; height: auto; border-radius: 6px; }
    .sidebar-nav { padding: 12px 18px; }
    .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
    .nav-small-cap { font-size: 11px; font-weight: 700; color: #5a6a85; text-transform: uppercase; letter-spacing: 0.8px; margin: 16px 0 6px 6px; }
    .sidebar-item { margin-bottom: 2px; }
    .sidebar-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 7px; color: #2a3547; text-decoration: none; font-size: 14px; font-weight: 500; transition: all .15s; }
    .sidebar-link:hover { background: #f0f5ff; color: #5d87ff; }
    .sidebar-link.active { background: #5d87ff; color: #fff !important; }
    .sidebar-link.active i { color: #fff !important; }
    .sidebar-link i { font-size: 18px; color: #5a6a85; }
    .body-wrapper { margin-left: 270px; min-height: 100vh; display: flex; flex-direction: column; }
    .app-header { background: #fff; border-bottom: 1px solid #e5eaef; padding: 14px 28px; }
    .container-fluid { padding: 28px; }
    .btn-icon-split { display: inline-flex; align-items: center; overflow: hidden; padding: 0; }
    .btn-icon-split .icon { padding: 8px 12px; background: rgba(0,0,0,0.15); }
    .btn-icon-split .text { padding: 8px 14px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full">
    <!-- Sidebar Start -->
    <aside class="left-sidebar">
      <div>
        <div class="brand-logo d-flex align-items-center justify-content-between">
          <a href="#" class="text-nowrap logo-img">
            <img src="http://127.0.0.1:8785/images/logos/pecellelelogo.jpg" alt="Pecel Lele" />
          </a>
        </div>
        <!-- Sidebar navigation-->
        <nav class="sidebar-nav">
          <ul id="sidebarnav">
            <li class="nav-small-cap">
              <span class="hide-menu">Home</span>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'dashboard' ? 'active' : ''}" href="#">
                <span><i class="ti ti-layout-dashboard"></i></span>
                <span class="hide-menu">Dashboard</span>
              </a>
            </li>
            <li class="nav-small-cap">
              <span class="hide-menu">Masterdata</span>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'coa' ? 'active' : ''}" href="#">
                <span><i class="ti ti-clipboard"></i></span>
                <span class="hide-menu">Coa</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'jabatan' ? 'active' : ''}" href="#">
                <span><i class="ti ti-briefcase"></i></span>
                <span class="hide-menu">Jabatan</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'pegawai' ? 'active' : ''}" href="#">
                <span><i class="ti ti-user"></i></span>
                <span class="hide-menu">Pegawai</span>
              </a>
            </li>
            <li class="nav-small-cap">
              <span class="hide-menu">Transaksi</span>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'pembelian' ? 'active' : ''}" href="#">
                <span><i class="ti ti-basket"></i></span>
                <span class="hide-menu">Pembelian Bahan Baku</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'produksi' ? 'active' : ''}" href="#">
                <span><i class="ti ti-building-factory-2"></i></span>
                <span class="hide-menu">Produksi</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'penjualan' ? 'active' : ''}" href="#">
                <span><i class="ti ti-shopping-cart"></i></span>
                <span class="hide-menu">Penjualan</span>
              </a>
            </li>
            <li class="nav-small-cap">
              <span class="hide-menu">Laporan</span>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'jurnal' ? 'active' : ''}" href="#">
                <span><i class="ti ti-file-analytics"></i></span>
                <span class="hide-menu">Jurnal Umum</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'bukubesar' ? 'active' : ''}" href="#">
                <span><i class="ti ti-book"></i></span>
                <span class="hide-menu">Buku Besar</span>
              </a>
            </li>
            <li class="sidebar-item">
              <a class="sidebar-link ${activeMenu === 'grafik' ? 'active' : ''}" href="#">
                <span><i class="ti ti-chart-bar"></i></span>
                <span class="hide-menu">Grafik</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
    <!-- Sidebar End -->

    <!-- Main wrapper -->
    <div class="body-wrapper">
      <!-- Header Start -->
      <header class="app-header">
        <nav class="navbar navbar-expand-lg navbar-light d-flex justify-content-between p-0">
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-light text-primary font-monospace fw-semibold px-2 py-1">FRAMEWORK TUBES · POS ACCOUNTING</span>
          </div>
          <div class="d-flex align-items-center gap-3">
            <span class="text-dark fw-semibold fs-3">Bakti Surya Atmaja</span>
            <img src="http://127.0.0.1:8785/images/profile/user-1.jpg" alt="" width="36" height="36" class="rounded-circle border">
          </div>
        </nav>
      </header>
      <!-- Header End -->

      ${contentHtml}

      <!-- Footer Start -->
      <div class="py-4 px-6 text-center text-muted" style="margin-top: auto; font-size: 13px;">
        <p class="mb-0">Pecel Lele Mas Bakti · Sistem Informasi Akuntansi & Point of Sales (Laravel & MySQL)</p>
      </div>
      <!-- Footer End -->
    </div>
  </div>
</body>
</html>`;
}

// 1. Exact structure from framework-tubes/resources/views/penjualan/view.blade.php
const posViewContent = `
<div class="container-fluid">
  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div class="row">
        <div class="d-sm-flex align-items-center justify-content-between mb-4">
          <h5 class="card-title fw-semibold mb-0" style="font-size: 1.25rem;">Penjualan</h5>
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-dark btn-icon-split shadow-sm">
              <span class="icon text-white-50"><i class="ti ti-clock"></i></span>
              <span class="text">Lihat Status Pemesanan</span>
            </a>
            <a href="#" class="btn btn-success btn-icon-split shadow-sm">
              <span class="icon text-white-50"><i class="ti ti-shopping-cart"></i></span>
              <span class="text">Lihat Keranjang (3)</span>
            </a>
          </div>
        </div>

        <!-- List Data Produk yang dijual -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm border">
            <div class="card-header py-3 bg-light border-bottom">
              <h6 class="m-0 font-weight-bold text-primary">Lele Goreng Crispy</h6>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-5">
                  <img width="150" height="150" style="object-fit:cover; border-radius:8px;" src="http://127.0.0.1:8785/fotoproduk/lelegoreng.jpg" alt="Lele Goreng">
                </div>
                <div class="col-7">
                  <div class="mb-2"><i class="ti ti-package text-muted"></i>&nbsp;&nbsp;produk_stok: <b class="text-dark">45 porsi</b></div>
                  <div class="mb-3"><i class="ti ti-credit-card text-muted"></i>&nbsp;&nbsp;<b class="fs-4 text-success">Rp 18.000</b></div>
                  <a href="#" class="btn btn-primary btn-icon-split shadow-sm">
                    <span class="icon text-white-50"><i class="ti ti-shopping-cart"></i></span>
                    <span class="text">Tambah</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm border">
            <div class="card-header py-3 bg-light border-bottom">
              <h6 class="m-0 font-weight-bold text-primary">Bebek Goreng Sambal Korek</h6>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-5">
                  <img width="150" height="150" style="object-fit:cover; border-radius:8px;" src="http://127.0.0.1:8785/fotoproduk/bebekgoreng.jpg" alt="Bebek Goreng">
                </div>
                <div class="col-7">
                  <div class="mb-2"><i class="ti ti-package text-muted"></i>&nbsp;&nbsp;produk_stok: <b class="text-dark">28 porsi</b></div>
                  <div class="mb-3"><i class="ti ti-credit-card text-muted"></i>&nbsp;&nbsp;<b class="fs-4 text-success">Rp 32.000</b></div>
                  <a href="#" class="btn btn-primary btn-icon-split shadow-sm">
                    <span class="icon text-white-50"><i class="ti ti-shopping-cart"></i></span>
                    <span class="text">Tambah</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm border">
            <div class="card-header py-3 bg-light border-bottom">
              <h6 class="m-0 font-weight-bold text-primary">Ayam Goreng Lengkuas</h6>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-5">
                  <img width="150" height="150" style="object-fit:cover; border-radius:8px;" src="http://127.0.0.1:8785/fotoproduk/ayamgoreng.jpg" alt="Ayam Goreng">
                </div>
                <div class="col-7">
                  <div class="mb-2"><i class="ti ti-package text-muted"></i>&nbsp;&nbsp;produk_stok: <b class="text-dark">36 porsi</b></div>
                  <div class="mb-3"><i class="ti ti-credit-card text-muted"></i>&nbsp;&nbsp;<b class="fs-4 text-success">Rp 24.000</b></div>
                  <a href="#" class="btn btn-primary btn-icon-split shadow-sm">
                    <span class="icon text-white-50"><i class="ti ti-shopping-cart"></i></span>
                    <span class="text">Tambah</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6 mb-4">
          <div class="card shadow-sm border">
            <div class="card-header py-3 bg-light border-bottom">
              <h6 class="m-0 font-weight-bold text-primary">Es Jeruk Peras Segar</h6>
            </div>
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-5">
                  <img width="150" height="150" style="object-fit:cover; border-radius:8px;" src="http://127.0.0.1:8785/fotoproduk/esjeruk.jpg" alt="Es Jeruk">
                </div>
                <div class="col-7">
                  <div class="mb-2"><i class="ti ti-package text-muted"></i>&nbsp;&nbsp;produk_stok: <b class="text-dark">50 porsi</b></div>
                  <div class="mb-3"><i class="ti ti-credit-card text-muted"></i>&nbsp;&nbsp;<b class="fs-4 text-success">Rp 7.000</b></div>
                  <a href="#" class="btn btn-primary btn-icon-split shadow-sm">
                    <span class="icon text-white-50"><i class="ti ti-shopping-cart"></i></span>
                    <span class="text">Tambah</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
`;

// 2. Exact structure from framework-tubes/resources/views/laporan/jurnalumum.blade.php
const journalViewContent = `
<div class="container-fluid">
  <div class="card shadow-sm border-0">
    <div class="card-body p-4">
      <div class="row">
        <div class="col-md-12">
          <h5 class="card-title fw-semibold mb-4" style="font-size: 1.25rem;">Jurnal Umum</h5>

          <!-- Filter Periode Jurnal -->
          <div class="card border shadow-sm mb-4">
            <div class="card-body py-3">
              <div class="row align-items-center">
                <div class="col-sm-3 fw-bold text-dark">Pilih Periode</div>
                <div class="col-sm-6">
                  <input type="month" class="form-control" name="periode" id="periode" value="2026-09">
                </div>
              </div>
            </div>
          </div>

          <!-- Tabel Jurnal -->
          <div class="card border shadow-sm">
            <div class="card-body">
              <div class="text-center mb-4">
                <div class="fs-5 fw-bold text-dark">Pecel Lele Mas Bakti</div>
                <div class="fs-4 fw-bold text-primary">Jurnal Umum</div>
                <div class="text-muted fw-semibold">Periode September 2026</div>
              </div>

              <div class="table-responsive">
                <table id="report" class="table table-bordered table-striped nowrap align-middle">
                  <thead>
                    <tr style="background-color: #dbd7d7;">
                      <th class="text-center" style="width: 140px;">ID Jurnal</th>
                      <th class="text-center" style="width: 130px;">Tanggal</th>
                      <th>Akun</th>
                      <th class="text-center" style="width: 90px;">Reff</th>
                      <th class="text-center" style="width: 170px;">Debet</th>
                      <th class="text-center" style="width: 170px;">Kredit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center font-monospace">JR-1021</td>
                      <td class="text-center">2026-09-01</td>
                      <td class="fw-semibold text-dark">Kas Toko</td>
                      <td class="text-center font-monospace">111</td>
                      <td class="text-end fw-bold text-dark">Rp 1.540.000</td>
                      <td class="text-end"></td>
                    </tr>
                    <tr>
                      <td class="text-center font-monospace">JR-1021</td>
                      <td class="text-center">2026-09-01</td>
                      <td style="padding-left: 2rem;">&nbsp;&nbsp;&nbsp;&nbsp;Pendapatan Penjualan</td>
                      <td class="text-center font-monospace">411</td>
                      <td class="text-end"></td>
                      <td class="text-end fw-bold text-dark">Rp 1.540.000</td>
                    </tr>
                    <tr>
                      <td class="text-center font-monospace">JR-1022</td>
                      <td class="text-center">2026-09-01</td>
                      <td class="fw-semibold text-dark">Harga Pokok Penjualan (HPP)</td>
                      <td class="text-center font-monospace">511</td>
                      <td class="text-end fw-bold text-dark">Rp 820.000</td>
                      <td class="text-end"></td>
                    </tr>
                    <tr>
                      <td class="text-center font-monospace">JR-1022</td>
                      <td class="text-center">2026-09-01</td>
                      <td style="padding-left: 2rem;">&nbsp;&nbsp;&nbsp;&nbsp;Persediaan Bahan Baku</td>
                      <td class="text-center font-monospace">114</td>
                      <td class="text-end"></td>
                      <td class="text-end fw-bold text-dark">Rp 820.000</td>
                    </tr>
                    <tr>
                      <td class="text-center font-monospace">JR-1023</td>
                      <td class="text-center">2026-09-02</td>
                      <td class="fw-semibold text-dark">Beban Gaji Karyawan</td>
                      <td class="text-center font-monospace">512</td>
                      <td class="text-end fw-bold text-dark">Rp 450.000</td>
                      <td class="text-end"></td>
                    </tr>
                    <tr>
                      <td class="text-center font-monospace">JR-1023</td>
                      <td class="text-center">2026-09-02</td>
                      <td style="padding-left: 2rem;">&nbsp;&nbsp;&nbsp;&nbsp;Kas Toko</td>
                      <td class="text-center font-monospace">111</td>
                      <td class="text-end"></td>
                      <td class="text-end fw-bold text-dark">Rp 450.000</td>
                    </tr>
                    <tr style="background-color: #dbd7d7;">
                      <th class="text-center fw-bold" colspan="4">Total</th>
                      <th class="text-end fw-bold text-primary">Rp 2.810.000</th>
                      <th class="text-end fw-bold text-primary">Rp 2.810.000</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>
`;

server.listen(8785, async () => {
  console.log('Tubes real server running on port 8785');

  try {
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 850, deviceScaleFactor: 2 });

    // 1. Capture Penjualan (POS)
    const fullPosHtml = getTubesLayout(posViewContent, 'penjualan');
    await page.setContent(fullPosHtml, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));

    const dest1 = path.resolve(__dirname, '../static/projects/laravel-pos-1.png');
    await page.screenshot({ path: dest1, clip: { x: 0, y: 0, width: 1366, height: 850 } });
    console.log('Saved real laravel-pos-1.png:', fs.statSync(dest1).size, 'bytes');

    // 2. Capture Jurnal Umum
    const fullJournalHtml = getTubesLayout(journalViewContent, 'jurnal');
    await page.setContent(fullJournalHtml, { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));

    const dest2 = path.resolve(__dirname, '../static/projects/laravel-pos-2.png');
    await page.screenshot({ path: dest2, clip: { x: 0, y: 0, width: 1366, height: 850 } });
    console.log('Saved real laravel-pos-2.png:', fs.statSync(dest2).size, 'bytes');

    await browser.close();
    server.close();
    console.log('Done framework-tubes capture from REAL project views!');
  } catch (err) {
    console.error('Error during capture:', err);
    server.close();
  }
});
