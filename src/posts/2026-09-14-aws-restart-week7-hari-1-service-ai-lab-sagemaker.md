---
title: "AWS re/Start Week 7 Hari 1: Review Service AI, Lab SageMaker Terakhir, dan Mulai Latihan Soal"
description: "Minggu terakhir re/Start dibuka pakai review service AI, lab terakhir training model XGBoost di SageMaker, terus langsung latihan soal CCP."
author: samsmon
date: 2026-09-14 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ai, sagemaker, ccp, latihan soal]
pin: false
math: false
mermaid: false
published: true
---

Minggu ketujuh, minggu terakhir. Instruktur ngebuka pakai kalimat "tinggal 5 kali pertemuan lagi, Jumat kita udah selesai". Agak nyesek dengernya.

Sesi pertama [review service AI yang wajib hafal](/blog/service-ai-aws-wajib-hafal-ccp) buat ujian: Lex, Textract, Rekognition, Polly, Transcribe, Comprehend, terus bedanya SageMaker AI sama Bedrock. Alasannya jelas, domain service di ujian bobotnya sekitar 34%, jadi mending hafal sekarang daripada ketuker nanti.

Abis itu lab terakhir re/Start: [training model XGBoost di SageMaker](/blog/lab-sagemaker-training-xgboost) buat deteksi kelainan tulang belakang. Split data 80/10/10 pakai stratify, upload ke S3, training job selesai sekitar 5 menit. Notebook instance di laptop instruktur lemot banget nggak mau kebuka, jadi demo-nya lebih banyak dijelasin sambil liat notebook yang udah jalan di laptop peserta lain. Di sela-selanya ada bahasan overfitting, underfitting, dan trade-off bias vs variance.

Sisa waktu langsung latihan soal CCP, sekitar 20-an soal pakai timer 90 detik per soal. Yang dibahas antara lain:

- **RDS vs EC2**: kalau aplikasi butuh akses ke **operating system** database-nya dan jalanin script pas boot, jawabannya EC2 plus user data, bukan RDS (RDS nggak ngasih akses OS).
- **Pisahin biaya per departemen**: pakai **tag** terus sortir di cost management. Bikin VPC per departemen itu nggak efisien, apalagi kuota default cuma 5 VPC per region.
- **CDK vs SDK**: beda satu huruf, beda arti. CDK itu bikin infrastruktur pakai bahasa pemrograman yang familiar.
- **Website dengan traffic naik turun**: ELB plus Auto Scaling.
- **Pilar Well-Architected**: multi-AZ deployment itu **reliability**. Instruktur yakin minimal satu soal pilar pasti keluar.
- **Data Exchange**: buat subscribe data dari pihak ketiga. **Kinesis vs MSK**: dua-duanya streaming, tapi kalau udah pakai Kafka, pilih MSK (Managed Streaming for Apache Kafka).
- **Arsitektur monolith ke microservice**: kata kuncinya **loosely coupled**, satu komponen rusak nggak nyeret yang lain.

Rangkuman jebakan soal dari 4 hari latihan ada di post [jebakan soal CCP minggu 7](/blog/jebakan-soal-ccp-mock-exam-week-7).

## Catatan Sampingan

- Pesan penting soal voucher ujian: **langsung ujian secepat mungkin** begitu dapet. Instruktur sendiri nggak dikasih tau kapan voucher-nya expired, dan ada peserta batch sebelumnya yang voucher-nya udah nggak bisa dipake pas mau ujian.
- Pas bahas AI yang bisa "tobat", instruktur iseng nyuruh model lokal jadi ustad yang ramah. Jawabannya langsung berubah jadi gaya dakwah. Intinya, perilaku model itu diatur lewat instruksi (system prompt).
- Banyak obrolan soal AI dan robot di China: robot polisi patroli, robot tarung MMA, kurir dan sortir paket pakai robot, sampe barista robot. Termasuk cerita Amazon Go (toko tanpa kasir) yang udah ada sejak 2017.
- Instruktur nyaranin Google Colab buat eksperimen ML gratis, sambil cerita lagi belajar QLoRA (fine-tuning yang ngorbanin sedikit presisi biar model 6,4 GB bisa dikecilin jadi sekitar 3,6 GB).
