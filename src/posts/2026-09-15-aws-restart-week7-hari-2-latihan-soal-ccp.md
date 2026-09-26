---
title: "AWS re/Start Week 7 Hari 2: Mock Exam CCP Pertama Kali Full Serius"
description: "Hari kedua minggu terakhir, full latihan soal CCP gaya ujian beneran, dibahas satu-satu dari IAM role vs policy, KMS vs CloudHSM, sampe Lightsail vs Elastic Beanstalk."
author: samsmon
date: 2026-09-15 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ccp, latihan soal, ujian]
pin: false
math: false
mermaid: false
published: true
---

Hari ini full latihan soal, formatnya kayak simulasi ujian: soal dijawab dulu sampe timer habis, baru dibahas. Rencananya 3 hari latihan soal CCP, dan Jumat 1 hari latihan soal AI Practitioner buat yang mau lanjut. Udah lewat 2 jam baru nyampe sekitar 35 soal, dan salahnya udah numpuk. Instruktur sampe bilang agak ragu bisa lulus kalau ujiannya kayak gini.

Soal-soal yang paling banyak jebakannya:

- **EC2 akses S3 tanpa long-term credential**: pakai **IAM role lewat instance profile**. Nge-inject access key permanen lewat `aws configure` itu bukan best practice.
- **KMS vs CloudHSM**: dua-duanya enkripsi. KMS kuncinya dikelola AWS (kita tinggal minta), CloudHSM itu **hardware khusus (dedicated)** dan kuncinya kita pegang sendiri, lebih aman tapi jauh lebih mahal. Kata kunci "dedicated hardware appliance" = CloudHSM.
- **Snowball Edge**: selain buat migrasi data, bisa **jalanin EC2 instance** di dalamnya.
- **GuardDuty**: threat detection pakai machine learning (anomaly detection), nggak gratis.
- **AWS Billing Conductor**: service yang instruktur sendiri baru tau. Buat bikin billing group dan custom pricing (markup, diskon), cocok buat reseller AWS.
- **SES vs SNS**: kalau cuma email (konfirmasi order, reset password), pakai SES, lebih murah. Kalau ada SMS atau push notification, pakai SNS.
- **Shared responsibility**: update OS itu tanggung jawab customer, **kecuali** servicenya managed. Update OS di **RDS** itu tanggung jawab AWS. Kuncinya: tau mana managed service mana bukan.
- **IAM role vs policy vs SCP**: role itu **sementara** (bisa di-set sampe maksimal 12 jam) dan wajib punya trust relationship, bisa nempel ke resource. Policy biasa nempel ke user dan group, permanen. SCP itu buat **Organizations**, kerjanya kayak permission boundary tapi di level account.
- **IP AWS dipakai buat serang port orang lain**: lapor ke **AWS Trust and Safety team**.
- **AWS Activate**: program buat startup, dapet kredit, training, dan support. Instruktur pernah dapet kredit $1.000.
- **Amazon Macie**: lindungin data sensitif (PII) di S3.
- **IAM best practice**: bikin user, masukin ke group. Jangan embed access key di kode, jangan kasih privilege maksimum.
- **AWS IQ**: nyari freelancer bersertifikat AWS buat proyek pendek. Menurut instruktur sekarang udah dipindah ke APN marketplace professional services.
- **AWS Budgets**: alert kalau biaya lewat batas. Sempet demo bikin zero spend budget, gratis.
- **CodePipeline**: CI/CD lengkap dari commit, build (hasilnya artifact), sampe deploy.
- **RI**: Standard bisa dijual di RI Marketplace, Convertible bisa ganti spek tapi nggak bisa dijual.
- **AWS Artifact** buat compliance report (beda sama CodeArtifact), **Personal Health Dashboard** buat notif kalau AWS-nya yang bermasalah.
- **Lightsail vs Elastic Beanstalk**: dua-duanya gampang, tapi Lightsail **nggak punya auto scaling**. Kalau soalnya nyebut "scalable", jawabannya Beanstalk.
- **Glue vs EMR**: dua-duanya bisa ETL, tapi Glue itu serverless, EMR masih ngurus cluster. **QuickSight** buat BI dashboard, Redshift itu data warehouse.
- **Storage Gateway vs Direct Connect**: hybrid storage yang seamless itu Storage Gateway. Direct Connect itu kabel fiber dedicated, mahal dan lama dipasangnya.
- **Pay-as-you-go** ngeganti fixed upfront expense (bukan economies of scale).
- **Console access yang aman**: password policy kuat plus MFA.

Konsep-konsep ini aku kumpulin juga di post [jebakan soal CCP minggu 7](/blog/jebakan-soal-ccp-mock-exam-week-7).

## Catatan Sampingan

- Instruktur ngingetin aturan hitung soal "select 2" dan "select 3": benar satu salah satu tetap dianggap **salah total**. Strateginya: flag, skip, balik lagi belakangan.
- Katanya dari materi 7 minggu ini, bekal buat ujian Solutions Architect Associate (SAA) udah sekitar 60%. Sisanya tinggal fokus ke EC2, S3, konsep VPC, API Gateway, migrasi, dan high availability.
- Ujian level Professional (misal SAP) bayarnya sekitar $300, 75 soal, harus lulus 75%, soalnya panjang-panjang, ada soal cocok-cocokan dan ngurutin langkah. Instruktur butuh 5 sampe 6 menit per soal dan harus coret-coret gambar.
- Harga ujian CCP sekitar $100 plus pajak 11%, kurang lebih Rp2 juta.
