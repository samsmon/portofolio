---
title: "AWS re/Start Week 7 Hari 3: Mock Exam Lagi, Analogi Kedai Kopi Buat Message Broker"
description: "Hari ketiga latihan soal CCP, dari billing per detik, Control Tower, GuardDuty vs Detective, Transit Gateway, sampe analogi kasir dan barista buat ngerti SQS dan Amazon MQ."
author: samsmon
date: 2026-09-16 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ccp, latihan soal, ujian]
pin: false
math: false
mermaid: false
published: true
---

Latihan soal hari kedua (tes ketiga). Hasil akhirnya pas-pasan di sekitar 70%, dan dari hasil tes kelihatan masih lemah di governance dan networking.

Yang paling kepake dari hari ini:

- **Billing EC2**: nggak ada pembulatan ke bawah. Linux dihitung **per detik**. Instruktur bilang Windows masih per jam, tapi setahuku dokumentasi AWS sekarang juga udah per detik buat Windows, jadi dicek ulang sebelum ujian.
- **Trade fixed expense for variable expense**: benefit cloud, jangan kejebak opsi "ngorbanin security demi elastis".
- **Nyari resource yang ke-share ke luar**: banyak yang kejebak milih database karena ada kata "search". Nama opsi jawabannya nggak kedengeran jelas di rekaman, tapi fitur AWS buat ini setahuku **IAM Access Analyzer**.
- **Control Tower** ada di atas Organizations: kalau mau bikin dan ngatur multi-account secara otomatis.
- **Multi-account ≠ multi-user**: ngatur banyak account itu Organizations, bukan IAM.
- **Resource-based policy**: policy yang nempel ke resource, bukan ke identity.
- **ELB plus Auto Scaling**: best practice-nya **design for failure**. Kalau servernya cuma satu dan traffic-nya gede, ya tumbang.
- **Direct Connect**: kalau butuh bandwidth dan performa konsisten, colok fisik. VPN lewat internet nggak konsisten.
- **Decoupling**: pisahin komponen biar satu rusak nggak nyeret yang lain. Ini dasar microservice (lawan dari monolith yang tightly coupled).
- **Amplify**: bikin aplikasi full stack end-to-end (frontend sampai backend) dengan cepat. Soalnya juga nyinggung GraphQL, dan setahuku service GraphQL di AWS itu AppSync.
- **Yang bisa di-reserve**: EC2, RDS, **DynamoDB**, **Redshift**. CloudWatch, S3, Lambda nggak bisa di-reserve.
- **EventBridge**: ada event berubah, trigger workflow Step Functions.
- **SCP**: kalau soalnya nyebut "member account", itu Organizations.
- **Elastic Beanstalk** di belakang layarnya pakai CloudFormation. Beanstalk itu kayak pembungkus.
- **IAM Identity Center** (dulu AWS SSO): login pakai akun Google, Facebook, dll.
- **Harga EC2**: Spot paling murah tapi bisa di-interrupt kapan aja, jadi nggak cocok buat yang harus jalan setahun penuh. RI Standard diskonnya sampe 72% tapi spek nggak bisa diubah, Convertible sampe 66% tapi spek bisa diubah.
- **WorkSpaces**: sewa desktop di cloud, mirip konsep cloud gaming (main game berat di laptop kentang lewat browser).
- **GuardDuty vs Detective**: GuardDuty **ngedeteksi** ancaman (pencegahan), Detective **investigasi** setelah kejadian, nyari akar masalahnya.
- **Transit Gateway vs PrivateLink**: PrivateLink cuma dalam satu region dan lebih ke service. Konek banyak VPC lintas region dan on-premises lewat satu hub, itu Transit Gateway.
- **Infrastructure as Code** masuk pilar **operational excellence**.
- **Shield** bisa ditaruh di depan CloudFront, nggak cuma di ELB.
- **Pricing Calculator vs Cost Explorer**: forecast sebelum pakai itu Pricing Calculator, Cost Explorer buat liat tagihan yang udah jalan.
- **Blok IP tertentu**: pakai **NACL**, karena security group itu **allow-only** (cuma bisa whitelist, nggak bisa deny).

Detail jebakannya dikumpulin di post [jebakan soal CCP minggu 7](/blog/jebakan-soal-ccp-mock-exam-week-7).

## Catatan Sampingan

- **Analogi kedai kopi buat message broker**: kasir itu web server, struk pesanan itu pesan di antrean, barista itu backend. Kenapa kasir nggak ngomong langsung ke barista? Karena kalau lagi promo dan pesanannya aneh-aneh, kasir nggak bakal inget semua. Pakai struk, barista ngerjain berurutan, dan kalau barista-nya ditambah jadi dua, mereka nggak rebutan pesanan. Load balancer itu posisinya di depan kasir, bagi antrean ke beberapa kasir.
- **SQS vs Amazon MQ**: kalau udah pakai RabbitMQ atau ActiveMQ dan mau pindah ke AWS tanpa nulis ulang kode, pakai Amazon MQ. Pindah ke SQS berarti ganti platform, kodenya banyak yang harus diubah.
- **Stamina ujian**: grafik stamina turun terus seiring waktu. Tipsnya: soal select 2 atau select 3 di-flag dan skip dulu, izin ke toilet atau minum buat reset konsentrasi, terus balik lagi. Kopi taruh di loker sebelum ujian.
- **Alur setelah lulus program**: selesaikan semua KC dan lab, tunggu email **graduate**, nanti dapet badge di Credly dan voucher ujian CCP. Lab masih bisa dipake buat belajar ulang selama belum ditutup.
- Ada tempat ujian yang minta biaya administrasi sendiri (contohnya satu tempat di Medan minta Rp250 ribu), padahal ujiannya gratis pakai voucher. Instruktur nyaranin siapin dana cadangan.
