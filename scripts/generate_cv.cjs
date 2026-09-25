const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function buildCV() {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 38, bottom: 38, left: 42, right: 42 },
    info: {
      Title: 'Bakti Surya Atmaja — Curriculum Vitae',
      Author: 'Bakti Surya Atmaja',
      Subject: 'DevOps & Cloud Platform Engineer | Full-Stack Infrastructure Resume',
      Keywords: 'DevOps, CloudOps, Platform Engineer, AWS, Terraform, Proxmox, Docker, Linux, Go, SvelteKit, Kubernetes, CI/CD'
    }
  });

  const outputPath = path.resolve(__dirname, '../static/cv-suryatmaja.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  let pageCount = 1;
  doc.on('pageAdded', () => {
    pageCount++;
  });

  // Palette: Clean professional monochrome with subtle emerald accent
  const primaryColor = '#0F172A';   // Slate-900
  const secondaryColor = '#334155'; // Slate-700
  const accentColor = '#059669';    // Emerald-600
  const lightMuted = '#64748B';     // Slate-500
  const dividerColor = '#CBD5E1';   // Slate-300

  const pageWidth = doc.page.width - 84; // 511.28 pt

  // Helper: Section Header
  function sectionHeader(title) {
    doc.moveDown(0.7);
    const y = doc.y;
    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(primaryColor)
      .text(title.toUpperCase(), 42, y, { characterSpacing: 1 });

    const titleWidth = doc.widthOfString(title.toUpperCase(), { characterSpacing: 1 });
    
    // Emerald underline for the title
    doc
      .strokeColor(accentColor)
      .lineWidth(1.5)
      .moveTo(42, y + 13)
      .lineTo(42 + titleWidth, y + 13)
      .stroke();

    // Hairline rule extending across the page
    doc
      .strokeColor(dividerColor)
      .lineWidth(0.5)
      .moveTo(46 + titleWidth, y + 13)
      .lineTo(42 + pageWidth, y + 13)
      .stroke();

    doc.moveDown(0.45);
  }

  // Helper: Job / Project Entry Title
  function itemHeader(leftTitle, rightMeta, subTitle = '') {
    const y = doc.y;
    doc
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .fillColor(primaryColor)
      .text(leftTitle, 42, y, { width: pageWidth - 160, lineBreak: false });

    doc
      .font('Helvetica-Bold')
      .fontSize(8.5)
      .fillColor(secondaryColor)
      .text(rightMeta, 42 + pageWidth - 160, y, { width: 160, align: 'right' });

    if (subTitle) {
      doc.moveDown(0.18);
      doc
        .font('Helvetica-Oblique')
        .fontSize(8.2)
        .fillColor(lightMuted)
        .text(subTitle, 42);
    }
    doc.moveDown(0.2);
  }

  // Helper: Bullet point
  function bullet(text, boldLead = '') {
    const y = doc.y;
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(accentColor)
      .text('•', 46, y);

    if (boldLead) {
      doc
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .fillColor(primaryColor)
        .text(boldLead + ' ', 56, y, { continued: true });
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(secondaryColor)
        .text(text, { width: pageWidth - 14, lineGap: 1.8 });
    } else {
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(secondaryColor)
        .text(text, 56, y, { width: pageWidth - 14, lineGap: 1.8 });
    }
    doc.moveDown(0.2);
  }

  // ==========================================
  // PAGE 1: HEADER, SUMMARY, SKILLS, 2 FLAGSHIP PROJECTS
  // ==========================================

  // --- HEADER ---
  doc
    .font('Helvetica-Bold')
    .fontSize(19)
    .fillColor(primaryColor)
    .text('BAKTI SURYA ATMAJA', 42, 38, { characterSpacing: 0.5 });

  doc
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(accentColor)
    .text('DEVOPS / CLOUD PLATFORM ENGINEER · FULL-STACK INFRASTRUCTURE', 42, doc.y + 2, { characterSpacing: 0.5 });

  const contactText = 'Bandung, West Java, ID  |  contact@suryatmaja.dev  |  https://suryatmaja.dev  |  github.com/samsmon  |  linkedin.com/in/suryatmaja';
  doc
    .font('Helvetica')
    .fontSize(8.2)
    .fillColor(lightMuted)
    .text(contactText, 42, doc.y + 4);

  // Separator below header
  doc
    .strokeColor(dividerColor)
    .lineWidth(0.75)
    .moveTo(42, doc.y + 6)
    .lineTo(42 + pageWidth, doc.y + 6)
    .stroke();

  doc.moveDown(0.35);

  // --- PROFESSIONAL SUMMARY ---
  sectionHeader('Professional Summary');
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(secondaryColor)
    .text(
      'Results-driven DevOps and Cloud Platform Engineer specializing in Infrastructure as Code (IaC), container orchestration, and high-availability distributed systems. Proven track record managing 24/7 bare-metal hypervisors (Proxmox VE), multi-AZ AWS production cloud architectures (VPC, ALB, EC2, RDS, S3), automated CI/CD pipelines, and high-concurrency backend services in Go, Svelte 5, and TypeScript. Experienced in edge proxy routing, zero-trust overlay mesh networks (Tailscale/WireGuard), and building telemetry and observability pipelines for distributed services and AI coding agents.',
      42,
      doc.y,
      { width: pageWidth, lineGap: 2.2, align: 'justify' }
    );

  // --- CORE TECHNICAL COMPETENCIES ---
  sectionHeader('Core Technical Competencies');

  function skillRow(category, items) {
    const y = doc.y;
    doc
      .font('Helvetica-Bold')
      .fontSize(8.4)
      .fillColor(primaryColor)
      .text(category + ':', 42, y, { width: 145 });

    doc
      .font('Helvetica')
      .fontSize(8.4)
      .fillColor(secondaryColor)
      .text(items, 190, y, { width: pageWidth - 148, lineGap: 1.6 });

    doc.moveDown(0.18);
  }

  skillRow('Cloud & Automation (IaC)', 'Terraform, AWS (VPC, EC2, ALB, RDS Aurora, S3, IAM, CloudWatch, Route 53), GitHub Actions CI/CD');
  skillRow('Virtualization & Systems', 'Proxmox VE (KVM / LXC), Linux (Debian, Ubuntu, Alpine), Systemd, Bash Scripting, ZFS Pools, vzdump');
  skillRow('Containers & Orchestration', 'Docker, Docker Compose, Multi-Arch Container Builds, Docker Engine API, Microservices Isolation');
  skillRow('Networking & Security', 'WireGuard & Tailscale Mesh VPN, Cloudflare Zero Trust & Tunnels, Nginx Reverse Proxy, Let\'s Encrypt SSL');
  skillRow('Runtimes & Frameworks', 'Go (Golang), Python, Svelte 5 / SvelteKit, Bun / Node.js, Laravel / PHP, RESTful APIs, WebSockets');
  skillRow('Databases & Caching', 'PostgreSQL, Amazon RDS / Aurora, MySQL, Redis (Pub/Sub & Caching), MinIO S3 Object Storage');
  skillRow('Observability & AIOps', 'Hardware SMART Telemetry, Watchdogs, Rolling Quota & Burn-Rate Analytics for AI Agents');

  // --- FEATURED PROJECTS PART 1 ---
  sectionHeader('Featured Engineering & Infrastructure Projects');

  // Project 1: GDDL
  itemHeader('GDDL — High-Throughput Concurrent Downloader & Daemon', 'Go · Svelte 5 · WARP · Docker', 'Flagship Concurrent Download Engine with Anti-Throttle IP Rotation');
  bullet('Engineered a high-concurrency desktop daemon in Go and desktop Web UI in Svelte 5 (Runes) with native qBittorrent and IDM workflow queues.', 'Concurrent Architecture:');
  bullet('Designed multi-worker download pools featuring adaptive exponential backoff, request jitter pacing, and streaming chunked HTTP data transfers.', 'High Throughput:');
  bullet('Built automated IP rotation using local WireGuard/WARP SOCKS5 proxy pools to seamlessly bypass ISP/CDN rate limits (HTTP 429) at exact byte offsets.', 'Anti-Throttle Subsystem:');

  doc.moveDown(0.3);

  // Project 2: HA Web Server AWS
  itemHeader('High-Availability Web Server Architecture on AWS', 'AWS EC2 · ALB · RDS · S3 · VPC', 'Fault-Tolerant Multi-AZ Production Infrastructure');
  bullet('Designed and deployed a dual-instance web tier distributed across multiple Availability Zones behind an Application Load Balancer with round-robin balancing.', 'Multi-AZ Availability:');
  bullet('Configured MySQL binary log asynchronous replication from primary EC2 host to Amazon RDS MySQL replica for automated failover and read scaling.', 'Database Replication:');
  bullet('Implemented least-privilege IAM policies, isolated private database subnets, and streaming media asset storage directly to Amazon S3 buckets.', 'Security & Storage:');

  // Force break to Page 2 cleanly
  doc.addPage();

  // ==========================================
  // PAGE 2: PROJECTS CONT., HOMELAB, CERTS, EDUCATION
  // ==========================================

  // Mini Top Bar for Page 2
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(primaryColor)
    .text('BAKTI SURYA ATMAJA', 42, 38, { continued: true })
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(lightMuted)
    .text('  —  Curriculum Vitae (Continued)', { align: 'left' });

  doc
    .strokeColor(dividerColor)
    .lineWidth(0.5)
    .moveTo(42, doc.y + 4)
    .lineTo(42 + pageWidth, doc.y + 4)
    .stroke();

  doc.moveDown(0.4);

  sectionHeader('Featured Engineering Projects (Continued)');

  // Project 3: Homelab
  itemHeader('24/7 Homelab Cluster & Autonomous Private Cloud', 'Proxmox VE · Docker · Tailscale · vzdump', 'Self-Hosted Bare-Metal Virtualization & Compute Fleet');
  bullet('Engineered a bare-metal Type-1 Proxmox VE hypervisor running 35+ containerized microservices across isolated LXC and Docker host tiers.', 'Infrastructure Cluster:');
  bullet('Enforced zero-trust ingress using Cloudflare Tunnels (cloudflared) and encrypted WireGuard/Tailscale mesh, eliminating exposed public port forwards.', 'Mesh Networking:');
  bullet('Configured automated nightly vzdump snapshots, multi-terabyte DAS storage pools, and hardware SMART health canary watchdogs.', 'Resilience & Backups:');

  doc.moveDown(0.3);

  // Project 4: Yado & SSO
  itemHeader('Yado Network & SSO Centralized Identity Provider', 'SvelteKit · OAuth2 · PKCE · PostgreSQL', 'Enterprise-Grade Authentication Gateway & Service Launcher');
  bullet('Implemented standard OAuth2 Authorization Code flow with PKCE (S256) to secure all private homelab web applications with single sign-on.', 'Zero-Trust Identity:');
  bullet('Built an active uptime telemetry engine tracking 90-day incident histories and container status via live health probes.', 'Service Telemetry:');

  doc.moveDown(0.3);

  // Project 5: Malas & Pore.js
  itemHeader('Malas Library & Pore.js Core Engine', 'SvelteKit · PostgreSQL · Canvas · Webtoon', 'High-Performance Media Catalogue & Zero-Backend Reader Engine');
  bullet('Developed a full-featured personal manga and novel catalogue managing 100+ titles with PostgreSQL JSONB indexing and collection tracking.', 'Media Platform:');
  bullet('Built Pore.js from scratch: a zero-backend browser reading engine with canvas-based pagination, supporting EPUB, PDF, and CBZ/ZIP formats.', 'Client-Side Engine:');

  // --- CERTIFICATIONS & PRACTICAL LABS ---
  sectionHeader('Certifications & Practical Labs');
  itemHeader('AWS re/Start Program Graduate', 'AWS Cloud & Operations', 'Hands-On Cloud Architecture & Systems Operations Specialization');
  bullet('Completed intensive practical training in enterprise cloud computing, Linux system administration, and infrastructure automation.');
  bullet('Architected multi-tier VPC topologies with public/private subnet routing, NAT gateways, and automated Elastic Load Balancing (ALB).');
  bullet('Configured Auto Scaling Groups with step scaling policies and lifecycle hooks for zero-downtime traffic spikes.');
  bullet('Conducted configuration management and remote fleet execution using AWS Systems Manager (SSM) and Session Manager.');

  // --- EDUCATION ---
  sectionHeader('Education & Academic Background');
  itemHeader('Bachelor of Science / Diploma in Computer Science / Information Technology', 'Indonesia', 'Specialization in Cloud Computing, Network Engineering & Distributed Systems');
  bullet('Core Coursework: Operating Systems, Computer Networks, Distributed Systems, Database Management Systems, Object-Oriented Software Engineering.');
  bullet('Hands-on laboratory research focusing on containerized virtualization, high-availability architecture, and automated cloud workflows.');

  // --- AIOps & Open Source Highlights ---
  sectionHeader('AIOps & Technical Highlights');
  bullet('Maintains 99.9% target uptime across 15+ self-hosted production homelab services with proactive alerting and automated self-healing.', 'High Availability:');
  bullet('Implemented AI coding agent usage telemetry: tracks turns/day, 5-hour rolling quotas, and 7-day token burn-rate analytics on bare-metal.', 'AIOps Observability:');
  bullet('Active open-source contributor with 10+ public engineering repositories spanning Go, SvelteKit, and cloud automation.', 'Open Source:');

  doc.end();

  stream.on('finish', () => {
    console.log(`CV generated successfully at: ${outputPath}`);
    console.log(`Total Pages: ${pageCount}`);
    console.log(`File size: ${fs.statSync(outputPath).size} bytes`);
  });
}

buildCV();
