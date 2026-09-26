---
title: "Kamus Service AWS: Semua Service dan Kegunaannya, Tempat Ngafalin Sebelum Ujian"
description: "Kamus 150-an service AWS dari daftar resmi ujian CCP dan AI Practitioner plus semua yang dibahas di re/Start, dikelompokin per kategori, lengkap sama fungsi, kata kunci di soal, pasangan yang gampang ketuker, nama lama, dan 30 soal uji hafalan."
author: samsmon
date: 2026-09-27 20:30:00 +0700
categories: [AWS re/Start, Materi]
tags: [aws, kamus, service, ccp, ai practitioner, re-start, ujian]
pin: false
math: false
mermaid: false
published: true
---

Hampir sepertiga nilai ujian CCP (domain "Cloud Technology and Services", 34%) isinya satu skill doang: **denger nama service, langsung tau fungsinya**. Ujian AI Practitioner juga sama, apalagi buat service AI. Masalahnya, AWS punya ratusan service dan namanya mirip-mirip. Connect vs Direct Connect, Artifact vs CodeArtifact, Q vs Quick, SDK vs CDK.

Post ini kamusnya. Isinya semua service yang ada di **daftar in-scope resmi CLF-C02 dan AIF-C01**, ditambah semua service yang pernah dibahas di re/Start. Dikelompokin per kategori biar gampang diinget polanya.

Pasangannya: [rangkuman lengkap re/Start](/blog/rangkuman-aws-restart-ccp-ai-practitioner) buat konsep, [persiapan CCP](/blog/persiapan-lengkap-ujian-aws-cloud-practitioner-clf-c02) dan [persiapan AI Practitioner](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) buat checklist per domain ujian.

## Cara Pakai Kamus Ini

- **Nyari cepat**: Ctrl+F nama service-nya.
- **Nemu istilah yang asing** (AZ, serverless, HA, elastic, managed service, dan lainnya)? Cek [glosarium](/blog/rangkuman-aws-restart-ccp-ai-practitioner#glosarium-a-sampai-z), isinya 180-an istilah dari A sampai Z.
- **Kolom "Ujian"**: **CCP** artinya ada di daftar in-scope CLF-C02 atau disebut di task statement-nya. **AIF** artinya ada di daftar in-scope AIF-C01 atau disebut di objective-nya. **kelas** artinya dibahas di re/Start, tapi nggak ada di daftar in-scope terbaru dua ujian itu.
- **Kolom "Baca lagi"**: post detail di blog ini. Kalau isinya `-`, service itu belum pernah dibahas di kelas.
- **Cara ngafalin**: tutup kolom "Buat apa" pakai tangan, baca kata kuncinya, tebak service-nya. Atau langsung lompat ke [uji hafalan](#uji-hafalan-30-soal) di bagian bawah.
- **"Amazon" atau "AWS"?** Di soal ujian, nama service ditulis lengkap, misal "Amazon Simple Queue Service (Amazon SQS)" atau "AWS Key Management Service (AWS KMS)". Awalan Amazon atau AWS itu bagian dari nama resmi, bukan petunjuk jawaban.

## Nama Lama dan Nama Baru

AWS doyan ganti nama. Soal latihan lama masih sering pakai nama lama, jadi dua-duanya perlu dikenal.

| Nama lama | Nama sekarang |
|---|---|
| AWS Single Sign-On (SSO) | **AWS IAM Identity Center** |
| CloudWatch Events | **Amazon EventBridge** |
| Amazon Elasticsearch Service | **Amazon OpenSearch Service** |
| Amazon SageMaker | **Amazon SageMaker AI** |
| Amazon QuickSight | **Amazon Quick Sight**, sekarang bagian dari **Amazon Quick** |
| Amazon CodeWhisperer | **Amazon Q Developer** |
| Kinesis Data Firehose | **Amazon Data Firehose** |
| Personal Health Dashboard / Service Health Dashboard | **AWS Health Dashboard** |
| CloudEndure Disaster Recovery | **AWS Elastic Disaster Recovery** |
| CloudEndure Migration / Server Migration Service | **AWS Application Migration Service** |
| Amazon WorkSpaces Web | **Amazon WorkSpaces Secure Browser** |
| Support plan Developer, Business, Enterprise On-Ramp | **Business Support+**, **Enterprise**, **Unified Operations** (plan lama berhenti 1 Januari 2027) |
| AWS OpsWorks | **pensiun di 2024**, pengganti yang disaranin: Systems Manager |

## Compute

Tempat kode dan aplikasi jalan.

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon EC2** (Elastic Compute Cloud) | Sewa virtual machine, kontrol penuh dari OS ke atas. Instance type dikelompokin jadi general purpose, compute optimized (CPU berat), memory optimized (RAM gede), storage optimized (I/O disk tinggi), accelerated computing (GPU). | VM, kontrol OS, instance type, AMI | CCP, AIF | [EC2](/blog/ec2-billing-traps-launch-lab) |
| **Amazon EC2 Auto Scaling** | Nambah dan ngurangin instance EC2 otomatis sesuai beban, dalam batas min dan max. | elasticity, traffic naik-turun, scaling policy | CCP | [Auto Scaling](/blog/ec2-auto-scaling) |
| **AWS Auto Scaling** | Satu tempat buat ngatur scaling banyak jenis resource sekaligus (EC2, ECS, DynamoDB, Aurora). | scaling plan, banyak jenis resource | CCP | [prediction challenge](/blog/ec2-auto-scaling-prediction-challenge) |
| **AWS Elastic Beanstalk** | PaaS: upload kode (Java, Python, Node.js, PHP, Go, Docker, dll), AWS yang urus server, load balancer, dan scaling. Service-nya gratis, yang dibayar resource di baliknya. | upload kode, "tanpa ngurus infrastruktur", scalable | CCP | [Beanstalk](/blog/aws-elastic-beanstalk) |
| **Amazon Lightsail** | VPS sederhana dengan harga flat bulanan, sepaket sama storage, IP, dan transfer data. Buat website kecil, blog, atau aplikasi sederhana. | harga bulanan tetap, simpel, pemula | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Outposts** | Rak hardware AWS yang dipasang di data center sendiri, jalanin service AWS di on-premises. | latency super rendah ke sistem lokal, data wajib tetap di lokasi | CCP | [rangkuman konsep](/blog/persiapan-ujian-ccp-rangkuman-konsep) |
| **AWS Batch** | Jalanin ribuan job komputasi batch, AWS yang ngatur antrean job dan jumlah servernya. | batch job, HPC, antrean komputasi | CCP | - |

Jangan ketuker:

- **Elastic Beanstalk vs Lightsail**: dua-duanya gampang, tapi cuma Beanstalk yang auto scaling. Soal nyebut "scalable", jawabannya Beanstalk.
- **EC2 Auto Scaling vs AWS Auto Scaling**: yang pertama khusus EC2, yang kedua buat banyak jenis resource.
- **Outposts vs Direct Connect**: Outposts itu hardware AWS di tempat kita, Direct Connect itu kabel dari tempat kita ke AWS.

## Container

Container itu paket aplikasi plus dependensinya, lebih ringan dari VM.

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon ECS** (Elastic Container Service) | Orkestrasi container buatan AWS, paling gampang dipakai. | container, Docker, orkestrasi | CCP, AIF | [container](/blog/container-docker-ecs-eks-fargate) |
| **Amazon EKS** (Elastic Kubernetes Service) | Kubernetes managed. Cocok kalau udah pakai Kubernetes atau mau portabel lintas cloud. | Kubernetes, open source, portabel | CCP, AIF | [container](/blog/container-docker-ecs-eks-fargate) |
| **Amazon ECR** (Elastic Container Registry) | Registry privat buat nyimpen image container, mirip Docker Hub versi AWS. | image, registry | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Fargate** | Jalanin container tanpa ngurus server EC2 di baliknya, dipakai bareng ECS atau EKS. | serverless container, bayar per container | CCP | [container](/blog/container-docker-ecs-eks-fargate) |

Jangan ketuker:

- **ECS vs EKS**: ECS punya AWS sendiri dan simpel, EKS itu Kubernetes standar.
- **Fargate vs EC2 launch type**: Fargate nggak ngurus server, EC2 launch type servernya kita yang atur.
- **ECR vs ECS**: ECR itu gudang image, ECS itu yang jalanin container-nya.

## Serverless

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Lambda** | Jalanin kode tanpa server, dipicu event (upload ke S3, request API, jadwal). Bayar per request dan durasi eksekusi, maksimal 15 menit per eksekusi. | event-driven, "tanpa ngurus server", bayar per eksekusi | CCP, AIF | [Lambda](/blog/aws-lambda-serverless-computing), [lab](/blog/lambda-cafe-sales-report) |

Selain Lambda dan Fargate, banyak service lain yang juga serverless: S3, DynamoDB, API Gateway, Step Functions, SNS, SQS, Athena, Glue, Aurora Serverless, dan Bedrock. Kalau soal minta "tanpa ngurus server", kandidatnya dari kelompok ini.

## Storage

Tiga jenis: **object** (file utuh plus metadata, S3), **block** (kayak hard disk, EBS), **file** (folder yang di-share, EFS dan FSx).

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon S3** (Simple Storage Service) | Object storage tanpa batas kapasitas, durability 99,999999999% (11 angka 9), satu objek maksimal 5 TB. Buat file, backup, data lake, static website. | object, bucket, durability, static website | CCP, AIF | [S3 lanjutan](/blog/amazon-s3-storage-class-fundamentals-lanjutan), [static website](/blog/s3-static-website-hosting) |
| **Amazon S3 Glacier** | Kelas S3 buat arsip: Instant Retrieval (milidetik), Flexible Retrieval (menit sampai jam), Deep Archive (paling murah, sampai sekitar 2 hari). | arsip, retensi bertahun-tahun, murah | CCP, AIF | [Glacier](/blog/amazon-s3-glacier-cold-storage) |
| **Amazon EBS** (Elastic Block Store) | Disk persisten buat EC2, terikat satu AZ. Tipe: gp3 (umum), io2 (IOPS tinggi, database), st1 dan sc1 (HDD murah). Backup-nya snapshot incremental. | disk EC2, snapshot, IOPS | CCP | [EBS](/blog/amazon-ebs-volume-types-snapshot-dlm) |
| **EC2 instance store** | Disk sementara yang nempel fisik di host EC2. Super cepat, tapi datanya hilang pas instance stop atau terminate. | temporary, cache, buffer | CCP | [instance store](/blog/ec2-instance-store-temporary-storage) |
| **Amazon EFS** (Elastic File System) | File system NFS buat Linux, bisa di-mount banyak EC2 sekaligus lintas AZ, ukurannya elastis. | shared file system Linux, NFS | CCP | [EFS dan FSx](/blog/amazon-efs-fsx-file-storage) |
| **Amazon FSx** | File system managed: FSx for Windows File Server (SMB, Active Directory), Lustre (HPC dan ML), NetApp ONTAP, OpenZFS. | Windows file share, HPC, Lustre | CCP | [EFS dan FSx](/blog/amazon-efs-fsx-file-storage) |
| **AWS Storage Gateway** | Jembatan storage on-premises ke AWS: File Gateway (NFS/SMB ke S3), Volume Gateway (iSCSI, snapshot ke EBS), Tape Gateway (tape virtual ke Glacier). | hybrid storage, cache lokal, ganti tape backup | CCP | [Storage Gateway](/blog/aws-storage-gateway-hybrid) |
| **AWS Backup** | Backup terpusat banyak service (EBS, RDS, DynamoDB, EFS, dan lainnya) pakai satu kebijakan. | backup policy terpusat, lintas service | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Elastic Disaster Recovery** | Replikasi server terus-menerus ke AWS biar bisa dipulihin cepat pas bencana (RPO hitungan detik, RTO hitungan menit). | disaster recovery, downtime minimal | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon Data Lifecycle Manager** | Otomasi bikin dan hapus snapshot EBS dan AMI sesuai jadwal. Gratis. | retensi snapshot otomatis | kelas | [EBS](/blog/amazon-ebs-volume-types-snapshot-dlm) |

Jangan ketuker:

- **S3 vs EBS vs EFS**: S3 buat file lewat API/internet, EBS disk satu instance, EFS folder yang di-share banyak instance.
- **EBS vs instance store**: EBS persisten, instance store hilang pas stop.
- **AWS Backup vs Elastic Disaster Recovery**: Backup buat nyimpen salinan, Elastic Disaster Recovery buat pulih cepat dengan downtime minimal.
- **EFS vs FSx**: Linux (NFS) vs Windows (SMB) atau kebutuhan khusus (Lustre).

## Database

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon RDS** (Relational Database Service) | Database relasional managed: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2, plus Aurora. Backup, patch, dan Multi-AZ diurus AWS. Nggak ada akses ke OS. | managed relational, Multi-AZ, read replica | CCP, AIF | [RDS dan Aurora](/blog/rds-aurora-multi-az), [migrasi ke RDS](/blog/migrasi-database-ke-rds-via-cli) |
| **Amazon Aurora** | Engine relasional buatan AWS, kompatibel MySQL dan PostgreSQL, 6 salinan data di 3 AZ. Ada Aurora Serverless yang kapasitasnya naik-turun sendiri. | performa tinggi, kompatibel MySQL/PostgreSQL | CCP, AIF | [Aurora](/blog/aurora-lanjutan-acu-cluster-troubleshooting) |
| **Amazon DynamoDB** | NoSQL key-value serverless dengan latency milidetik di skala apapun. | NoSQL, key-value, serverless, skala masif | CCP, AIF | [DynamoDB](/blog/dynamodb-nosql-dasar) |
| **DynamoDB Accelerator (DAX)** | Cache in-memory khusus DynamoDB, latency turun jadi mikrodetik. | cache DynamoDB | kelas | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon ElastiCache** | Cache in-memory managed (Valkey, Redis OSS, Memcached) buat nyepetin aplikasi dan ngurangin beban database. | in-memory, cache, session store | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon DocumentDB** | Database dokumen (JSON) kompatibel MongoDB. | MongoDB, dokumen JSON | CCP, AIF | - |
| **Amazon Neptune** | Database graph buat data yang relasinya rumit. Bisa juga jadi vector store buat aplikasi AI. | graph, social network, fraud graph | CCP, AIF | - |

Redshift ada di bagian [Analytics](#analytics), DMS dan SCT di bagian [Migrasi dan Transfer](#migrasi-dan-transfer).

Jangan ketuker:

- **RDS vs database di EC2**: butuh akses OS atau engine yang nggak didukung, EC2. Mau yang minim urusan, RDS.
- **Multi-AZ vs read replica**: Multi-AZ buat ketersediaan (failover), read replica buat performa baca.
- **ElastiCache vs DAX**: DAX cuma buat DynamoDB, ElastiCache buat umum.
- **DynamoDB vs DocumentDB**: key-value vs dokumen MongoDB.

## Networking dan Content Delivery

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon VPC** (Virtual Private Cloud) | Jaringan privat virtual di satu region, bisa span beberapa AZ. | jaringan terisolasi, subnet | CCP, AIF | [VPC manual](/blog/vpc-manual-cidr-igw-nacl-security-group), [VPC lanjutan](/blog/amazon-vpc-fundamentals-lanjutan) |
| **Elastic Load Balancing** | Bagi traffic ke banyak target plus health check. Application Load Balancer (HTTP/HTTPS, layer 7, routing per path atau host), Network Load Balancer (TCP/UDP, layer 4, performa ekstrem), Gateway Load Balancer (appliance keamanan pihak ketiga). | distribute traffic, multi-AZ, health check | CCP | [ELB](/blog/elastic-load-balancing-elb), [ELB via CLI](/blog/elb-setup-cli-target-group-listener) |
| **Amazon Route 53** | DNS managed, daftar domain, health check, 8 routing policy (simple, weighted, latency, failover, geolocation, geoproximity, multivalue, IP-based). | DNS, domain, failover, routing global | CCP | [Route 53](/blog/amazon-route-53-dns-routing) |
| **Amazon CloudFront** | CDN yang nge-cache konten di edge location dekat user. | latency rendah global, cache, edge | CCP, AIF | [CloudFront](/blog/amazon-cloudfront-cdn) |
| **AWS Global Accelerator** | Arahin traffic user lewat jaringan global AWS pakai 2 IP statis anycast. Nggak nge-cache. | IP statis global, TCP/UDP, failover antar region | CCP | - |
| **Amazon API Gateway** | Bikin, publish, dan amanin API (REST, HTTP, WebSocket), lengkap sama throttling dan caching. | pintu depan API, throttling | CCP | [API Gateway](/blog/amazon-api-gateway) |
| **AWS Direct Connect** | Koneksi fisik khusus (fiber) dari data center ke AWS, nggak lewat internet. | bandwidth konsisten, privat, mahal, lama dipasang | CCP | [konektivitas VPC](/blog/vpc-connectivity-options) |
| **AWS Site-to-Site VPN** | Terowongan terenkripsi dari jaringan kantor ke VPC lewat internet. | cepat dipasang, murah, lewat internet | CCP | [konektivitas VPC](/blog/vpc-connectivity-options) |
| **AWS Client VPN** | VPN buat laptop atau user individu konek ke VPC. | karyawan remote | CCP | - |
| **AWS Transit Gateway** | Hub pusat yang nyambungin banyak VPC dan jaringan on-premises. | banyak VPC, hub-and-spoke | CCP | [konektivitas VPC](/blog/vpc-connectivity-options) |
| **AWS PrivateLink** | Akses service AWS atau service pihak lain secara privat dari VPC lewat interface endpoint. | tanpa internet publik, private connectivity | CCP, AIF | [konektivitas VPC](/blog/vpc-connectivity-options) |

Komponen di dalam VPC (bukan service terpisah, tapi wajib hafal):

| Komponen | Fungsi singkat |
|---|---|
| **Subnet** | potongan VPC, cuma di 1 AZ, 5 IP direserve AWS |
| **Internet gateway** | pintu VPC ke internet, buat public subnet |
| **NAT gateway** | jalan keluar ke internet buat private subnet, ditaruh di public subnet |
| **Route table** | aturan arah traffic |
| **Security group** | firewall level instance, stateful, cuma allow |
| **Network ACL** | firewall level subnet, stateless, allow dan deny |
| **Elastic IP** | IP publik statis, bayar walau nganggur |
| **ENI** | kartu jaringan virtual |
| **VPC endpoint** | akses service AWS tanpa internet: gateway endpoint (S3, DynamoDB) dan interface endpoint (PrivateLink) |
| **VPC peering** | koneksi 1-ke-1 antar VPC, nggak transitif |
| **VPC Flow Logs** | log traffic IP buat troubleshooting dan forensik |
| **Bastion host** | server perantara buat SSH ke private subnet |

Jangan ketuker:

- **CloudFront vs Global Accelerator**: CloudFront nge-cache konten, Global Accelerator cuma ngebut-in jalur dan ngasih IP statis.
- **Direct Connect vs Site-to-Site VPN**: kabel khusus yang konsisten vs lewat internet yang cepat dipasang.
- **Transit Gateway vs VPC peering vs PrivateLink**: hub banyak VPC vs 1-ke-1 vs akses satu service secara privat.
- **Route 53 failover vs ELB**: failover DNS antar lokasi vs bagi traffic antar instance.

## Security, Identity, dan Compliance

### Identity dan Akses

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS IAM** (Identity and Access Management) | Atur siapa (user, group, role) boleh ngapain (policy) di account. Global dan gratis. | least privilege, MFA, role, policy | CCP, AIF | [IAM](/blog/iam-policy-permission-role), [IAM praktik](/blog/iam-praktik-password-policy-user-group) |
| **IAM Access Analyzer** | Fitur IAM buat nemuin resource yang ke-share ke luar account dan permission yang nggak kepakai. | resource ke-share ke publik atau account lain | kelas | [latihan soal](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **AWS IAM Identity Center** | Login terpusat (SSO) ke banyak account dan aplikasi, bisa federasi sama identity provider perusahaan. Dulu namanya AWS SSO. | SSO, login multi-account, federasi | CCP | [latihan soal](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **Amazon Cognito** | Sign-up dan sign-in user buat aplikasi web dan mobile, termasuk login pakai Google atau Facebook. | user aplikasi, login sosial | CCP | - |
| **AWS Directory Service** | Microsoft Active Directory managed di AWS. | Active Directory, LDAP | CCP | [migrasi data center](/blog/transitioning-data-center-to-aws) |
| **AWS Resource Access Manager (RAM)** | Share resource (subnet, Transit Gateway, dan lainnya) ke account lain. | share resource antar account | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |

### Enkripsi dan Kredensial

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS KMS** (Key Management Service) | Bikin dan kelola kunci enkripsi, terintegrasi sama hampir semua service. Hardware-nya dikelola AWS. | encryption at rest, customer managed key | CCP, AIF | [KMS](/blog/kms-encrypt-decrypt-symmetric-key) |
| **AWS CloudHSM** | Hardware security module khusus (single-tenant), kuncinya sepenuhnya di tangan customer. | dedicated hardware, compliance ketat | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Secrets Manager** | Simpen password, API key, dan kredensial database, plus rotasi otomatis. | rotasi kredensial otomatis | CCP, AIF | - |
| **AWS Certificate Manager (ACM)** | Bikin dan perpanjang sertifikat SSL/TLS, gratis kalau dipasang di ELB, CloudFront, atau API Gateway. | HTTPS, encryption in transit | CCP | - |

### Deteksi dan Proteksi

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon GuardDuty** | Deteksi ancaman pakai ML dari CloudTrail, VPC Flow Logs, dan log DNS. | threat detection, aktivitas mencurigakan | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon Inspector** | Scan kerentanan (CVE) otomatis di EC2, image ECR, dan Lambda. | vulnerability scan, CVE | CCP, AIF | [Inspector](/blog/amazon-inspector-vulnerability-scanning) |
| **Amazon Detective** | Investigasi akar masalah insiden keamanan pakai visualisasi data log. | root cause, investigasi setelah kejadian | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon Macie** | Nemuin dan lindungin data sensitif (PII) di S3 pakai ML. | PII, data pribadi, S3 | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Security Hub** | Dashboard pusat yang ngumpulin temuan keamanan dari banyak service dan ngecek kepatuhan ke standar keamanan. | pusat temuan keamanan, security posture | CCP | - |
| **AWS Shield** | Perlindungan DDoS. Standard gratis dan otomatis, Advanced berbayar (tim respons DDoS, perlindungan biaya lonjakan). | DDoS | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS WAF** (Web Application Firewall) | Firewall aplikasi web layer 7 di depan CloudFront, ALB, atau API Gateway. | SQL injection, XSS, blok IP atau negara | CCP | [rangkuman konsep](/blog/persiapan-ujian-ccp-rangkuman-konsep) |
| **AWS Firewall Manager** | Atur aturan WAF, Shield Advanced, security group, dan Network Firewall lintas account dari satu tempat. | kebijakan firewall terpusat multi-account | CCP | - |
| **AWS Network Firewall** | Firewall managed di level VPC, rule stateless dan stateful (format Suricata). | filter traffic VPC, IPS | kelas | [Network Firewall](/blog/network-firewall-block-malware) |

### Compliance

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Artifact** | Portal download laporan compliance AWS (SOC, ISO, PCI) dan nerima agreement (misal BAA). | compliance report, audit | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |

Jangan ketuker:

- **KMS vs CloudHSM**: kunci dikelola AWS vs hardware khusus yang kuncinya kita pegang.
- **GuardDuty vs Inspector vs Detective vs Macie**: deteksi ancaman vs scan kerentanan vs investigasi setelah kejadian vs data sensitif di S3.
- **WAF vs Shield vs Network Firewall vs security group**: serangan aplikasi web vs DDoS vs filter traffic VPC vs firewall instance.
- **Secrets Manager vs Parameter Store**: dua-duanya nyimpen kredensial, tapi rotasi otomatis itu kekuatan Secrets Manager.
- **Artifact vs CodeArtifact**: laporan compliance vs repository package kode.
- **Cognito vs IAM Identity Center**: user aplikasi kita vs karyawan yang login ke AWS.

## Management dan Governance

### Monitoring dan Audit

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon CloudWatch** | Metric, alarm, log, dan dashboard buat resource dan aplikasi. Basic monitoring 5 menit gratis, detailed 1 menit berbayar. RAM dan disk butuh CloudWatch Agent. | monitoring, alarm, metric, log | CCP, AIF | [CloudWatch](/blog/amazon-cloudwatch-monitoring-overview), [alarm dan SNS](/blog/cloudwatch-alarm-sns-notification) |
| **AWS CloudTrail** | Rekam semua API call di account: siapa, ngapain, kapan, dari mana. Event history 90 hari gratis, simpan lebih lama pakai trail ke S3. | audit, "who did what" | CCP, AIF | [incident response](/blog/incident-response-cloudtrail-athena-hack) |
| **AWS Config** | Rekam histori konfigurasi resource dan cek apakah sesuai aturan (config rule). | compliance konfigurasi, perubahan konfigurasi | CCP, AIF | [lab monitoring](/blog/monitoring-infrastructure-cloudwatch-agent-config) |
| **AWS Health Dashboard** | Status gangguan dan jadwal maintenance AWS yang ngaruh ke account kita, ada juga versi API-nya (AWS Health API). | gangguan di sisi AWS | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Trusted Advisor** | Cek otomatis terhadap best practice: cost optimization, performance, security, fault tolerance, service limits, operational excellence. | rekomendasi, best practice, resource nganggur | CCP, AIF | [Trusted Advisor](/blog/aws-support-plans-trusted-advisor) |
| **AWS Compute Optimizer** | Rekomendasi ukuran resource (EC2, EBS, Lambda, ECS) pakai ML berdasarkan pemakaian nyata. | rightsizing, instance kegedean | CCP | - |
| **AWS Well-Architected Tool** | Review workload terhadap 6 pilar Well-Architected lewat kuesioner. | review arsitektur | CCP, AIF | [Well-Architected](/blog/aws-well-architected-framework) |

### Multi-Account dan Kontrol

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Organizations** | Kelola banyak account: OU, SCP, consolidated billing. | multi-account, member account, SCP | CCP | [Organizations](/blog/aws-organizations-scp) |
| **AWS Control Tower** | Setup landing zone multi-account yang aman secara otomatis, di atas Organizations, plus guardrail. | set up multi-account otomatis | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Service Catalog** | Katalog produk IT (template) yang udah disetujui perusahaan buat dipakai tim secara self-service. | self-service resource yang disetujui | CCP | - |
| **AWS License Manager** | Kelola dan lacak lisensi software (BYOL) di AWS dan on-premises. | lisensi, BYOL | CCP | - |
| **Service Quotas** | Lihat dan minta naikin batas (quota) tiap service. | limit, quota | CCP | - |

### Otomasi dan Operasi

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Systems Manager** | Kelola armada server: Run Command, Session Manager (akses tanpa SSH), Patch Manager, Parameter Store, State Manager, Inventory, Fleet Manager. | tanpa SSH, patch massal, parameter terpusat | CCP | [Systems Manager](/blog/aws-systems-manager), [Patch Manager](/blog/system-hardening-patch-manager-lanjutan) |
| **AWS CloudFormation** | Infrastructure as Code pakai template JSON/YAML, deploy jadi stack, ada change set dan drift detection. | IaC, template, stack | CCP | [CloudFormation](/blog/cloudformation-deploy-first-stack), [drift](/blog/troubleshooting-cloudformation-drift) |
| **AWS Management Console** | Antarmuka web buat ngatur AWS lewat klik. | GUI, belajar, sekali jalan | CCP | [console, CLI, SDK](/blog/aws-overview-service-categories-sdk-cli-console) |
| **AWS OpsWorks** | Chef dan Puppet managed. **Udah pensiun di 2024**, pengganti yang disaranin Systems Manager. | configuration management | kelas | [IaC dan OpsWorks](/blog/iac-cloudformation-opsworks) |

Jangan ketuker:

- **CloudWatch vs CloudTrail vs Config**: kondisi resource vs siapa ngapain vs konfigurasi sesuai aturan atau nggak.
- **Trusted Advisor vs Health Dashboard vs Compute Optimizer**: best practice di akun kita vs gangguan di sisi AWS vs rekomendasi ukuran resource.
- **Organizations vs Control Tower**: ngatur banyak account vs setup multi-account otomatis lengkap sama guardrail.
- **SCP vs IAM policy**: SCP itu batas maksimal di level account, IAM policy ngasih izin ke user/role.

## Developer Tools

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS CLI** | Command line buat ngatur AWS, cocok buat script dan otomasi. | otomasi, script, terminal | CCP | [CLI](/blog/aws-cli-query-filter-dry-run) |
| **AWS SDK** | Library buat akses AWS dari kode aplikasi (Python boto3, JavaScript, Java, dan lainnya). | dari kode aplikasi, programmatic | CCP | [IaC dan SDK](/blog/iac-cloudformation-opsworks) |
| **AWS CDK** (Cloud Development Kit) | IaC pakai bahasa pemrograman (TypeScript, Python, dan lainnya), hasil akhirnya template CloudFormation. | infrastruktur pakai bahasa pemrograman | kelas | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS CodeCommit** | Repository Git privat. | version control | kelas | [latihan soal](/blog/aws-restart-week5-hari-4-latihan-soal-ccp) |
| **AWS CodeBuild** | Compile, test, dan bikin artifact dari kode. | build, test, CI | CCP | [latihan soal](/blog/aws-restart-week5-hari-4-latihan-soal-ccp) |
| **AWS CodeDeploy** | Otomasi deploy ke EC2, Lambda, ECS, atau on-premises. | deployment, blue/green | kelas | [latihan soal](/blog/aws-restart-week5-hari-4-latihan-soal-ccp) |
| **AWS CodePipeline** | Pipeline CI/CD yang nyambungin source, build, test, sampe deploy. | CI/CD end-to-end | CCP | [latihan soal](/blog/aws-restart-week7-hari-2-latihan-soal-ccp) |
| **AWS X-Ray** | Tracing request lintas service buat nemuin bottleneck dan error. | tracing, debugging microservice | CCP | [API Gateway](/blog/amazon-api-gateway) |
| **Kiro** | IDE agentic dari AWS dengan spec-driven development: requirement, desain, dan task ditulis dulu sebelum kode. | IDE AI, spec | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| **Strands Agents** | SDK open source (Python dan TypeScript) buat bikin AI agent cukup dari prompt dan daftar tools. | SDK agent, open source | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |

Jangan ketuker:

- **SDK vs CDK**: beda satu huruf. SDK buat manggil AWS dari kode, CDK buat bikin infrastruktur pakai kode.
- **CodeBuild vs CodeDeploy vs CodePipeline**: build dan test vs deploy vs pipeline yang nyambungin semuanya.
- **X-Ray vs CloudWatch vs CloudTrail**: jejak satu request vs metric dan log vs API call ke AWS.

## Integrasi Aplikasi

Buat nyambungin komponen biar **loosely coupled**: satu rusak, yang lain tetep jalan.

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon SNS** (Simple Notification Service) | Pub/sub: satu pesan dikirim ke banyak subscriber (email, SMS, push, Lambda, SQS). Ada Standard dan FIFO. | notifikasi, fan-out, topic | CCP | [SNS](/blog/cloudwatch-alarm-sns-notification) |
| **Amazon SQS** (Simple Queue Service) | Antrean pesan buat decoupling. Standard (throughput tinggi) atau FIFO (urutan terjamin). | queue, decoupling, loosely coupled | CCP | [analogi kedai kopi](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **Amazon EventBridge** | Event bus: kalau kejadian X terjadi, jalanin target Y. Bisa jadwal cron dan nerima event dari aplikasi SaaS. Dulu CloudWatch Events. | event-driven, jadwal, integrasi SaaS | CCP | [EventBridge](/blog/cloudwatch-logs-events-eventbridge) |
| **AWS Step Functions** | Orkestrasi workflow banyak langkah dalam bentuk state machine visual. | workflow, state machine | CCP | [Step Functions](/blog/aws-step-functions) |
| **Amazon MQ** | Message broker managed buat Apache ActiveMQ dan RabbitMQ. | migrasi broker tanpa ubah kode | kelas | [analogi kedai kopi](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |

Jangan ketuker:

- **SNS vs SQS**: SNS "teriak" ke banyak penerima sekaligus, SQS "nampung" pesan buat diambil satu per satu.
- **SQS vs Amazon MQ**: aplikasi baru pakai SQS, aplikasi lama yang udah pakai RabbitMQ/ActiveMQ pakai Amazon MQ.
- **EventBridge vs Step Functions**: EventBridge micu aksi dari event, Step Functions ngatur urutan banyak langkah.

## Aplikasi Bisnis, End User, Web, dan IoT

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon Connect** | Contact center di cloud (telepon, chat) buat customer service. | call center, customer service | CCP | [rangkuman konsep](/blog/persiapan-ujian-ccp-rangkuman-konsep) |
| **Amazon SES** (Simple Email Service) | Kirim email transaksional dan marketing dalam jumlah besar. | email doang, reset password, newsletter | CCP | [SES vs SNS](/blog/amazon-cloudwatch-monitoring-overview) |
| **Amazon WorkSpaces** | Desktop virtual (Windows atau Linux) di cloud. | virtual desktop, kerja remote | CCP | [latihan soal](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **Amazon AppStream 2.0** | Streaming aplikasi desktop ke browser tanpa install. | streaming aplikasi | CCP | - |
| **Amazon WorkSpaces Secure Browser** | Browser aman yang jalan di cloud buat akses web dan aplikasi internal. Dulu WorkSpaces Web. | akses aplikasi internal lewat browser | CCP | - |
| **AWS Amplify** | Bikin, deploy, dan hosting aplikasi web dan mobile full stack dengan cepat. | frontend, mobile, full stack | CCP | [latihan soal](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **AWS AppSync** | API GraphQL managed. | GraphQL | kelas | [latihan soal](/blog/aws-restart-week7-hari-3-latihan-soal-ccp) |
| **AWS IoT Core** | Nyambungin, ngatur, dan nerima data dari perangkat IoT dalam jumlah besar. | IoT, sensor, device | CCP | - |

Jangan ketuker:

- **Amazon Connect vs AWS Direct Connect**: call center vs kabel jaringan. Ini jebakan klasik.
- **WorkSpaces vs AppStream 2.0**: satu desktop penuh vs satu aplikasi doang.
- **SES vs SNS**: email doang vs notifikasi banyak channel.

## Analytics

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon Athena** | Query data di S3 pakai SQL standar, serverless, bayar per data yang di-scan. | query S3, serverless SQL, analisa log | CCP | [Athena](/blog/amazon-athena-serverless-query) |
| **Amazon Redshift** | Data warehouse skala petabyte dengan penyimpanan per kolom, ada versi serverless. | data warehouse, OLAP, BI | CCP, AIF | [Redshift](/blog/amazon-redshift-data-warehouse) |
| **AWS Glue** | ETL serverless plus Data Catalog (katalog metadata semua data). | ETL serverless, data catalog, crawler | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Glue DataBrew** | Bersihin dan nyiapin data secara visual tanpa ngoding. | data prep tanpa kode | AIF | - |
| **Amazon EMR** | Cluster big data managed (Apache Spark, Hadoop, Hive). | big data, Spark, Hadoop | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon Kinesis** | Streaming data real-time: Kinesis Data Streams (nangkep stream), Amazon Data Firehose (kirim stream ke S3, Redshift, OpenSearch), Kinesis Video Streams (video). | real-time, clickstream, stream IoT | CCP | [journal minggu 7](/blog/aws-restart-week7-hari-1-service-ai-lab-sagemaker) |
| **Amazon MSK** (Managed Streaming for Apache Kafka) | Apache Kafka managed. | udah pakai Kafka | kelas | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **Amazon OpenSearch Service** | Search, analitik log, dan vector search (turunan dari Elasticsearch). | full-text search, log analytics, vector DB | CCP, AIF | [rangkuman konsep](/blog/persiapan-ujian-ccp-rangkuman-konsep) |
| **Amazon Quick Sight** | Dashboard BI interaktif, sekarang bagian dari Amazon Quick. | dashboard, visualisasi, BI | CCP, AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Lake Formation** | Bikin data lake di S3 dan ngatur izin akses datanya secara terpusat. | data lake, izin akses data | AIF | - |
| **AWS Data Exchange** | Cari dan subscribe dataset dari pihak ketiga. | data pihak ketiga | AIF | [journal minggu 7](/blog/aws-restart-week7-hari-1-service-ai-lab-sagemaker) |

Jangan ketuker:

- **Athena vs Redshift**: query langsung ke S3 sesekali vs data warehouse buat analitik rutin skala besar.
- **Glue vs EMR**: ETL serverless vs cluster big data yang masih diurus.
- **Kinesis vs MSK vs SQS**: streaming buatan AWS vs Kafka managed vs antrean pesan.
- **Quick Sight vs Athena**: bikin dashboard vs nge-query data.

## AI dan Machine Learning

### Generative AI

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon Bedrock** | Akses foundation model dari Amazon dan penyedia lain (misal Anthropic, Meta, Mistral) lewat satu API, serverless. | generative AI, foundation model, tanpa training | AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| Bedrock Knowledge Bases | RAG managed: dokumen dari S3 di-chunk, di-embedding, disimpan di vector database, dipakai buat jawab. | dokumen perusahaan, RAG | AIF | [RAG](/blog/vector-database-rag-embedding) |
| Bedrock Agents | Agent yang bisa ngerjain tugas banyak langkah dan manggil API. | tugas multi-step, tools | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| Bedrock Guardrails | Filter konten berbahaya, topik terlarang, PII, plus cek grounding buat nangkep halusinasi. | responsible AI, filter | AIF | [guardrail](/blog/responsible-ai-guardrails-prompt-injection) |
| Bedrock Model Evaluation | Evaluasi dan bandingin model (otomatis, pakai manusia, atau LLM as a judge). | milih model terbaik | AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| Bedrock Prompt Management | Simpen, kasih versi, dan pakai ulang prompt. | prompt versioning | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| Bedrock playground | Tempat nyobain model langsung di console (chat, teks, gambar) sebelum bikin aplikasi. | nyobain model | AIF | - |
| **Amazon Bedrock AgentCore** | Platform deploy dan operasi agent di produksi: runtime, memory, gateway ke tools (termasuk MCP), identity, observability. Bisa pakai framework dan model apa aja. | agent di produksi, aman | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| **Amazon Nova** | Keluarga foundation model buatan Amazon sendiri, tersedia di Bedrock. | model buatan Amazon | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| **Amazon Q** | Asisten generative AI: Q Developer buat developer (dulu CodeWhisperer), Q Business buat nanya data perusahaan. | asisten AI, coding assistant | CCP, AIF | - |
| **Amazon Quick** | Workspace AI buat kerjaan kantor: Quick Sight (BI), Quick Research (riset), Quick Flows dan Quick Automate (otomasi kerjaan), lewat satu chat. | workspace agentic buat bisnis | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| **AWS Transform** | Agentic AI buat migrasi dan modernisasi aplikasi lama (misal .NET, mainframe, VMware). | modernisasi aplikasi | AIF | - |

### ML dan Platform

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon SageMaker AI** | Platform ML end-to-end: siapin data, training, tuning, deploy, monitoring. | bikin model sendiri, ML lifecycle | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp), [lab](/blog/lab-sagemaker-training-xgboost) |
| **SageMaker JumpStart** | Hub model pre-trained dan foundation model, bisa deploy sekali klik. | model siap pakai di SageMaker | AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| SageMaker Ground Truth | Labeling data, bisa pakai tenaga manusia. | anotasi, data berlabel | AIF | [data labeling](/blog/data-labeling-object-detection-image-segmentation) |
| SageMaker Data Wrangler | EDA dan feature engineering secara visual. | nyiapin data ML | AIF | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| SageMaker Feature Store | Simpen dan share fitur buat training dan inference. | fitur dipakai ulang | AIF | - |
| SageMaker Clarify | Deteksi bias dan jelasin kenapa model ngasih prediksi tertentu. | bias, explainability | AIF | [persiapan AIF](/blog/persiapan-lengkap-ujian-aws-ai-practitioner-aif-c01) |
| SageMaker Model Monitor | Pantau kualitas dan drift model di produksi. | drift, performa model turun | AIF | - |
| SageMaker Model Cards | Dokumentasi model: tujuan, data, performa, risiko. | governance, transparansi | AIF | - |
| SageMaker Canvas | Bikin model ML tanpa ngoding. | no-code ML, analis bisnis | AIF | - |
| **AWS Trainium** | Chip AI buatan AWS buat training model. | training hemat biaya | kelas | [ukuran model](/blog/ukuran-model-vs-kepintaran-ai-spesialisasi) |
| **AWS Inferentia** | Chip AI buatan AWS buat inference. | inference hemat biaya | kelas | [ukuran model](/blog/ukuran-model-vs-kepintaran-ai-spesialisasi) |

### Service AI Siap Pakai

Kuncinya: hafalin **input → output**-nya.

| Service | Input → output | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **Amazon Comprehend** | teks → insight (sentimen, entitas, topik, PII) | analisa teks, sentimen review | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Lex** | teks/suara → percakapan | chatbot, voice bot | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Polly** | teks → suara | text to speech | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Transcribe** | suara → teks | speech to text, subtitle, transkrip call center | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Translate** | teks → teks bahasa lain | terjemahan, multibahasa | CCP, AIF | - |
| **Amazon Textract** | dokumen/gambar → teks, tabel, dan isian formulir | scan dokumen, struk, formulir | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Rekognition** | gambar/video → label, wajah, objek, konten nggak pantas | computer vision, deteksi wajah | CCP, AIF | [service AI](/blog/service-ai-aws-wajib-hafal-ccp) |
| **Amazon Personalize** | data interaksi user → rekomendasi | sistem rekomendasi, "produk yang mungkin kamu suka" | AIF | - |

Jangan ketuker:

- **Bedrock vs SageMaker AI**: pakai foundation model yang udah jadi vs bikin atau training model sendiri.
- **Textract vs Comprehend vs Rekognition**: ngambil teks dari dokumen vs ngerti isi teks vs ngenalin isi gambar.
- **Polly vs Transcribe**: ngomong (teks ke suara) vs nyatet (suara ke teks).
- **Lex vs Amazon Connect**: bot percakapan vs contact center. Keduanya sering dipakai bareng.
- **Amazon Q vs Amazon Quick vs Kiro**: asisten AI vs workspace AI buat bisnis vs IDE buat developer.

## Migrasi dan Transfer

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Application Discovery Service** | Kumpulin info server on-premises (spek, pemakaian, ketergantungan antar server) buat perencanaan migrasi. | inventaris server, dependency | CCP | - |
| **AWS Application Migration Service** | Lift-and-shift server ke EC2 dengan replikasi terus-menerus. | rehost, lift-and-shift | CCP | - |
| **Migration Evaluator** | Bikin business case dan perkiraan TCO sebelum migrasi. | TCO, business case | CCP | - |
| **AWS Migration Hub** | Pantau progres migrasi dari banyak tools di satu tempat. | tracking migrasi | CCP | - |
| **AWS DMS** (Database Migration Service) | Migrasi database dengan downtime minimal, source tetep jalan selama proses (CDC). | migrasi database, replikasi | CCP | [DMS dan SCT](/blog/aws-dms-sct-migrasi-database) |
| **AWS SCT** (Schema Conversion Tool) | Konversi skema dan kode database antar engine yang beda. | migrasi heterogen, Oracle ke PostgreSQL | CCP | [DMS dan SCT](/blog/aws-dms-sct-migrasi-database) |
| **AWS Snow Family** | Perangkat fisik (Snowball Edge) buat mindahin data raksasa tanpa internet, dikirim lewat kurir. **Sejak 7 November 2025 udah nggak bisa dipesan customer baru**, AWS nyaranin DataSync sebagai gantinya. | petabyte, offline, internet lambat | kelas | [Snow Family](/blog/aws-snow-family-offline-transfer) |
| **AWS DataSync** | Transfer dan sinkronisasi data otomatis secara online dari on-premises ke S3, EFS, atau FSx. | sinkron online, terjadwal | kelas | [DataSync](/blog/aws-transfer-family-datasync) |
| **AWS Transfer Family** | SFTP, FTPS, dan FTP managed yang nyimpen file ke S3 atau EFS. | partner kirim file via SFTP | kelas | [Transfer Family](/blog/aws-transfer-family-datasync) |

Jangan ketuker:

- **DMS vs SCT**: mindahin data vs ngonversi skema. Engine beda, pakai dua-duanya.
- **Application Migration Service vs DMS**: mindahin server vs mindahin database.
- **Migration Evaluator vs Pricing Calculator**: business case migrasi dari data on-premises vs estimasi biaya resource AWS.
- **DataSync vs Storage Gateway**: mindahin data vs akses storage hybrid terus-menerus.

## Billing dan Cost Management

| Service | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Pricing Calculator** | Estimasi biaya **sebelum** bikin resource. | estimasi, perkiraan biaya | CCP | [rightsizing](/blog/cost-optimization-rightsizing-instance) |
| **AWS Cost Explorer** | Visualisasi, analisa, dan forecast biaya yang **udah** jalan, plus rekomendasi RI dan Savings Plans. | analisa tagihan, tren biaya | CCP, AIF | [cost management](/blog/aws-cost-management-tools-budgets) |
| **AWS Budgets** | Alert kalau biaya atau pemakaian lewat batas, termasuk zero spend budget. Ada juga budget actions yang bisa pasang IAM policy atau SCP, atau stop EC2/RDS tertentu kalau di-setting. | alert biaya, batas anggaran | CCP, AIF | [cost management](/blog/aws-cost-management-tools-budgets) |
| **AWS Cost and Usage Reports** | Data tagihan paling detail (per jam, per resource), dikirim ke S3. | data billing paling detail | CCP | [cost management](/blog/aws-cost-management-tools-budgets) |
| **AWS Billing Conductor** | Bikin grup billing dan tarif custom, buat reseller atau pembagian biaya internal. | reseller, markup | kelas | [journal minggu 7](/blog/aws-restart-week7-hari-2-latihan-soal-ccp) |
| **Savings Plans** | Model harga: komit nominal per jam selama 1 atau 3 tahun, hemat sampai 72%. | komitmen fleksibel lintas instance | CCP | [rangkuman](/blog/rangkuman-aws-restart-ccp-ai-practitioner) |
| **Cost allocation tags** | Tag buat pecah biaya per tim atau proyek, harus diaktifin dulu di Billing console. | biaya per divisi | CCP | [tagging](/blog/aws-tagging-cost-management) |
| **Consolidated billing** | Fitur Organizations: satu tagihan, diskon volume digabung. | satu tagihan banyak account | CCP | [Organizations](/blog/aws-organizations-scp) |
| **AWS Marketplace** | Katalog software pihak ketiga yang bisa dibeli dan langsung dipasang di AWS. | software pihak ketiga | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |

Jangan ketuker:

- **Pricing Calculator vs Cost Explorer**: sebelum pakai vs setelah pakai.
- **Budgets vs Cost Explorer**: ngasih alert vs analisa.
- **Cost Explorer vs Cost and Usage Reports**: grafik dan ringkasan vs data mentah paling detail.

## Support dan Program AWS

| Nama | Buat apa | Kata kunci di soal | Ujian | Baca lagi |
|---|---|---|---|---|
| **AWS Support** | Support plan: Basic (gratis), Business Support+, Enterprise (TAM khusus), Unified Operations. | support plan, TAM, waktu respons | CCP | [support plan](/blog/aws-support-plans-trusted-advisor), [persiapan CCP](/blog/persiapan-lengkap-ujian-aws-cloud-practitioner-clf-c02) |
| **AWS re:Post** | Forum tanya-jawab komunitas resmi AWS. | komunitas | CCP | - |
| **AWS Knowledge Center** | Kumpulan jawaban buat pertanyaan dan masalah teknis yang sering muncul. | FAQ teknis | CCP | - |
| **AWS Prescriptive Guidance** | Panduan, pola, dan strategi terstruktur dari AWS dan partner (misal strategi migrasi). | best practice terstruktur | CCP | - |
| **AWS Professional Services** | Tim konsultan dari AWS buat bantu proyek customer. | konsultan resmi AWS | CCP | - |
| **AWS Partner Network** | Jaringan partner: ISV (vendor software) dan system integrator (konsultan implementasi). | partner, ISV, SI | CCP | [support plan](/blog/aws-support-plans-trusted-advisor) |
| **AWS Trust and Safety** | Tim buat lapor penyalahgunaan resource AWS (spam, serangan, konten ilegal). | lapor abuse | CCP | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Activate** | Program buat startup: kredit, training, dan support. | startup, kredit | kelas | [jebakan soal](/blog/jebakan-soal-ccp-mock-exam-week-7) |
| **AWS Skill Builder** | Platform belajar resmi AWS, termasuk AWS Cloud Quest dan latihan soal ujian. | belajar, persiapan ujian | kelas | [journal minggu 7](/blog/aws-restart-week7-hari-4-latihan-soal-ccp) |

## Bukan Service AWS (Tapi Sering Dikira)

Beberapa nama ini sering kedengeran bareng AWS, tapi bukan service AWS. Di soal ujian, biasanya dipakai buat nyari **padanannya** di AWS.

| Nama | Sebenernya apa | Padanan di AWS |
|---|---|---|
| **Snowflake** | Data warehouse cloud dari perusahaan Snowflake Inc. Bisa jalan di atas AWS dan dibeli lewat Marketplace. | **Redshift**. Kalau maksudnya perangkat buat mindahin data, itu **Snowball** (Snow Family) |
| **"AWS Playground"** | Bukan nama service. | **Playground di console Bedrock** buat nyobain model, atau **PartyRock**, app builder AI tanpa kode di atas Bedrock yang bisa dipakai tanpa account AWS. PartyRock sempet disebut di exam guide AIF versi 1.0, tapi udah dihapus di versi 1.1 |
| **Terraform** | IaC multi-cloud dari HashiCorp | CloudFormation, CDK |
| **Kubernetes** | Orkestrasi container open source | EKS |
| **Docker** | Tools bikin dan jalanin container | ECS, ECR, Fargate |
| **Elasticsearch** | Search engine dari Elastic | OpenSearch Service |
| **Apache Kafka** | Platform streaming open source | MSK, Kinesis |
| **RabbitMQ / ActiveMQ** | Message broker open source | Amazon MQ, SQS |
| **Redis / Memcached** | Cache in-memory | ElastiCache |
| **MongoDB** | Database dokumen | DocumentDB |
| **Jenkins / GitHub Actions** | Tools CI/CD | CodePipeline, CodeBuild |
| **Chef / Puppet / Ansible** | Configuration management | Systems Manager (OpsWorks udah pensiun) |
| **Grafana / Datadog** | Dashboard monitoring pihak ketiga | CloudWatch |
| **Hugging Face** | Hub model AI open source | SageMaker JumpStart, Bedrock |
| **Google Colab** | Notebook Python gratis dari Google | notebook SageMaker AI |

## Uji Hafalan: 30 Soal

Jawab dalam kepala dulu, baru buka jawabannya.

1. Nyimpen password database yang harus dirotasi otomatis tiap 30 hari.
2. Nyari data KTP dan nomor HP pelanggan yang nyasar di bucket S3.
3. Siapa yang nge-terminate instance production kemarin malam?
4. Mastiin semua EBS volume terenkripsi, dan dapet laporan kalau ada yang nggak.
5. Website diserang banjir traffic dari ribuan IP.
6. Blok request yang isinya SQL injection.
7. Kirim email reset password ke user.
8. Satu kejadian harus dikirim ke email admin, SMS, dan Lambda sekaligus.
9. Order masuk ditampung dulu biar backend nggak kewalahan pas promo.
10. Aplikasi lama pakai RabbitMQ, mau pindah ke AWS tanpa ubah kode.
11. Query log di S3 pakai SQL tanpa bikin server.
12. Bikin dashboard penjualan buat direksi.
13. Nangkep klik website secara real-time buat analisa.
14. ETL tanpa ngurus cluster.
15. Database yang kompatibel MongoDB.
16. Nyimpen relasi pertemanan jutaan user.
17. Cache khusus buat DynamoDB.
18. Ubah rekaman telepon call center jadi teks.
19. Ambil isi teks dan tabel dari foto struk belanja.
20. Tau review produk itu positif atau negatif.
21. Chatbot pemesanan tiket.
22. Rekomendasi "produk yang mungkin kamu suka" di e-commerce.
23. Pakai LLM tanpa training dan tanpa ngurus server.
24. Training model XGBoost pakai data sendiri.
25. Labeling ribuan gambar pakai tenaga manusia.
26. Cek apakah model persetujuan kredit bias terhadap gender tertentu.
27. Desktop virtual buat karyawan yang kerja dari rumah.
28. Koneksi privat dan konsisten dari data center ke AWS.
29. Nyambungin 50 VPC dan kantor pusat lewat satu hub.
30. Setup banyak account baru lengkap sama guardrail secara otomatis.

<details class="my-6 rounded-none border" style="border-color: var(--blog-border); background-color: var(--blog-code-bg);">
<summary class="cursor-pointer select-none px-4 py-3 font-mono text-[11px] uppercase tracking-wider" style="color: var(--blog-text-muted);">▸ Lihat jawaban</summary>

1. AWS Secrets Manager
2. Amazon Macie
3. AWS CloudTrail
4. AWS Config
5. AWS Shield
6. AWS WAF
7. Amazon SES
8. Amazon SNS
9. Amazon SQS
10. Amazon MQ
11. Amazon Athena
12. Amazon Quick Sight
13. Amazon Kinesis
14. AWS Glue
15. Amazon DocumentDB
16. Amazon Neptune
17. DynamoDB Accelerator (DAX)
18. Amazon Transcribe
19. Amazon Textract
20. Amazon Comprehend
21. Amazon Lex
22. Amazon Personalize
23. Amazon Bedrock
24. Amazon SageMaker AI
25. SageMaker Ground Truth
26. SageMaker Clarify
27. Amazon WorkSpaces
28. AWS Direct Connect
29. AWS Transit Gateway
30. AWS Control Tower

</details>

## Yang Perlu Diinget

- Hafalin polanya per kategori, bukan satu-satu. Kalau tau kategorinya (storage, security, analytics), pilihan jawabannya langsung menyempit.
- Pasangan yang paling sering ketuker: CloudWatch vs CloudTrail vs Config, KMS vs CloudHSM, GuardDuty vs Inspector vs Macie, SNS vs SQS, Connect vs Direct Connect, SDK vs CDK, Bedrock vs SageMaker AI.
- Kenalin juga nama lamanya, karena soal latihan lama masih pakai nama lama.
- Snowflake bukan service AWS, "AWS Playground" juga bukan. Yang ada Snowball dan PartyRock / playground Bedrock.
- Snow Family, DataSync, Transfer Family, Network Firewall, Amazon MQ, dan MSK dibahas di kelas tapi nggak ada di daftar in-scope terbaru. Tetep bagus dipahami, tapi prioritas hafalannya di bawah yang bertanda CCP atau AIF.

## Referensi Resmi

- [In-Scope AWS Services CLF-C02](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html)
- [In-Scope AWS Services AIF-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html)
- [Overview of Amazon Web Services (whitepaper)](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html)
- [AWS Products](https://aws.amazon.com/products/)
- [AWS Snowball Edge Availability Change](https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html)
- [Configuring AWS Budgets Actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html)
- [PartyRock](https://partyrock.aws/)
