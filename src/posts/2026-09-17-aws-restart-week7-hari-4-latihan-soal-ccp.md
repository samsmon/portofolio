---
title: "AWS re/Start Week 7 Hari 4: Mock Exam Terakhir, Cloud Quest, dan Tips Hari H Ujian"
description: "Latihan soal CCP terakhir sebelum program ditutup, plus rekomendasi belajar lanjutan lewat Skill Builder dan Cloud Quest, dan cerita tempat-tempat ujian di Jakarta."
author: samsmon
date: 2026-09-17 00:00:00 +0700
categories: [AWS re/Start, Journal]
tags: [aws, re-start, ccp, latihan soal, ujian]
pin: false
math: false
mermaid: false
published: true
---

Hari keempat minggu terakhir, latihan soal CCP lagi (tes keempat), tapi dibuka dulu pakai rekomendasi belajar setelah program selesai.

## Belajar Setelah re/Start: Skill Builder dan Cloud Quest

Begitu program selesai, LMS re/Start bakal ditutup. Instruktur nyaranin pindah ke **AWS Skill Builder**, yang aksesnya permanen. Di dalamnya ada **AWS Cloud Quest**, belajar hands-on dalam bentuk game (bikin kota, dapet avatar, ada kuis). Versi gratisnya lebih sederhana, tapi kalau nyelesaiin sekitar 12 lab bakal dapet badge. Versi premium-nya sekitar $30 per bulan (sekitar Rp500 ribu), dan menurut instruktur worth it buat latihan hands-on tanpa takut billing akun sendiri.

Materi tambahan yang dibagiin: latihan soal AI Practitioner gratis (20 soal), kursus Cloud Essentials buat CCP (sekitar 22 jam), dan materi no-code machine learning.

## Soal-Soal yang Dibahas

- **Disaster recovery dengan downtime minimal**: **AWS Elastic Disaster Recovery**, bukan AWS Backup (Backup itu bukan spesialis DR).
- **Restore RDS ke titik waktu tertentu**: **point-in-time recovery**, bisa sampe sekitar 5 menit terakhir. Snapshot biasanya harian.
- **Subnet** itu cuma di **satu AZ**, nggak bisa nyebar ke semua AZ.
- **Lambda vs EC2**: EC2 bayar selama nyala dipake atau nggak, Lambda cuma bayar pas di-trigger.
- **Caching** ada di 3 level: CDN, aplikasi, database. Buat DynamoDB ada **DAX** (DynamoDB Accelerator), in-memory cache di depan DynamoDB.
- **WAF** itu layer 7, **Network Firewall** di level VPC.
- **Internet gateway** itu buat instance di **public subnet**, bukan private subnet. Jebakannya sepele.
- **Edge location**: server cache di dekat user (termasuk di daerah yang aksesnya susah), terus diterusin ke server asal.
- **Elastic IP** cuma bisa di-remap di dalam **satu region** (beda AZ nggak masalah).
- **Upload zip, AWS urus sampai deploy**: Elastic Beanstalk.
- **AWS Resource Access Manager**: share resource antar account.
- **TCO**: yang dihitung itu jumlah server fisik atau VM on-premises plus info CPU dan RAM, bukan storage doang.
- **Dedicated Host vs Dedicated Instance**: Host itu nyewa **server fisiknya**, kontrol sampe level BIOS, cocok buat lisensi yang terikat ke CPU fisik. Dedicated Instance itu cuma VM-nya yang dedicated. On-demand biasa bisa pindah server pas stop/start, dedicated instance tetap di server yang sama.
- **Kurangin latency global**: CloudFront plus S3, atau cache in-memory (ElastiCache). ECS itu container, nggak ada hubungannya sama latency.
- **S3 Standard**: nggak ada biaya retrieval. Data masuk ke AWS gratis, data keluar bayar.
- **Konek on-premises ke VPC pakai private connection**: Direct Connect.
- **Developer support plan**: cuma email, jam kerja. Telepon 24 jam itu Business ke atas.
- **Route 53 health check** buat monitor health aplikasi (kayak lab failover routing dulu).
- **FSx** ada 4 pilihan: NetApp ONTAP, OpenZFS, Windows File Server, dan Lustre (buat HPC, ML, video processing).
- **AWS Health Dashboard**: kalau yang bermasalah AWS-nya. Trusted Advisor itu kalau infrastruktur kita yang nggak sesuai best practice.
- **Satu EC2 instance cuma bisa punya satu IAM role**. Instruktur langsung buktiin di console.
- **EBS** bisa dienkripsi, root volume maupun bukan.
- **ECR**: registry buat Docker image, mirip Docker Hub.
- **ELB** nyebarin traffic ke instance di **beda AZ**, bukan beda region. Kata "across" di soal itu sering jadi jebakan.
- **Patch minor version RDS** paling efisien pakai fitur **auto minor version upgrade** di RDS. Systems Manager Patch Manager itu buat EC2, bukan RDS.
- **S3 cross-region replication** bisa di account yang sama maupun beda account.
- **DynamoDB** nyimpan **item** berbasis key-value, bukan object.

Rangkuman semua jebakan dari 4 hari ada di post [jebakan soal CCP minggu 7](/blog/jebakan-soal-ccp-mock-exam-week-7).

## Catatan Sampingan

- Ujian CCP: **65 soal**, 90 menit, ditambah 30 menit jadi 2 jam (tambahan ini akomodasi buat yang bahasa Inggrisnya bukan bahasa ibu, dan setahuku harus diajuin dulu sebelum booking). Lulus di **700 dari 1.000**. Hitungan kasar instruktur: salah sampai sekitar 17 soal masih aman. Aslinya nilai CCP pakai scaled score dan ada soal yang nggak dinilai, jadi angka 17 ini cuma patokan kasar.
- Dari hasil tes hari ini, bagian yang masih perlu diperbaiki: support, networking dan content delivery, storage, database, cost management, arsitektur, dan security.
- Instruktur ngasih gambaran soal AI Practitioner (kasus evaluasi model klasifikasi pakai confusion matrix: TP, FP, FN, TN), tapi nyaranin fokus CCP dulu.
- **Health Dashboard** sempet dibuka buat nunjukin gangguan beberapa service AWS di region Timur Tengah (UAE dan Bahrain) yang katanya gara-gara situasi perang. Region Jakarta aman.
- **Tips hari H ujian offline**: bawa KTP dan email bukti booking (HP buat nunjukin), datang 30 menit lebih awal buat check-in (foto, tanda tangan). HP ditaruh di loker, buka loker buat cek HP langsung diskualifikasi. Instruktur cerita beberapa tempat ujian di Jakarta, ada yang ruangannya lega dan boleh pilih kursi, ada yang sempit dan harus angkat tangan dulu buat izin ke toilet.
- Ujian online lebih ribet: kamera, mic, internet, dan ruangan harus steril, proktor bisa nyuruh muter-muter ngecek ruangan.
- Akses LMS katanya masih bisa sampai sekitar 25 September, tapi instruktur sendiri nggak dapet info pasti. Link materi tambahan udah dibagi di grup WhatsApp.
- Besok (18 September) hari terakhir program.
