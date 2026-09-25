// Central content model. Edit copy here, not in the components.

export const identity = {
  name: 'Bakti Surya Atmaja',
  display: ['Surya', 'Atmaja'], // hero headline — two stacked lines
  // Hero role, under the name. Two lines so it says the whole picture — not
  // just an app dev, but the cloud + self-hosted infra it runs on.
  role: ['Full-stack developer', 'Cloud infrastructure & automation'],
  // The constellation lines, set small on the right of the hero like a margin
  // note. One entry per line so the wrap is deliberate, not ragged.
  trivia: [
    'Every point of light is nothing on its own.',
    "It's the lines between them that make a shape worth naming."
  ],
  title: 'Surya Atmaja - Full stack Developer', // browser tab
  tagline: 'Full-stack developer. I build web apps and run the infrastructure they scale on.',
  // Canonical origin. Used for absolute Open Graph image URLs, the sitemap and
  // robots.txt. Change this if the site ever moves.
  url: 'https://suryatmaja.dev'
};

// Section headings. The nav labels stay literal (About / Skills / Portfolio /
// Contact); these first-person lines are what shows at the top of each section.
export const headings = {
  about: 'Get to know me',
  skills: 'Tech stack',
  portfolio: 'Things I have built',
  contact: "Let's talk"
};

export const about = {
  intro:
    "Greetings, I'm Maja — a full-stack developer who also runs the infrastructure the apps sit on.",
  body: [
    'Most of what I build runs on my own homelab. I reach for AWS when a project needs it (managed databases, email, object storage at scale), not by default.',
    'I like systems that stay small and boring to run, and automating anything that would otherwise be done by hand.'
  ],
  location: 'Bandung, West Java',
  status: 'Node 01: Staging & Lab Assembly',
  // Portrait pair for the About section. `primary` is what visitors see first
  // (the formal photo); `secondary` wipes in on hover or tap (the illustrated
  // one). Drop both files in static/ and keep the paths absolute. If a file
  // is missing the component falls back to the auto-playing snake placeholder.
  portrait: {
    primary: '/portrait-formal.jpg',
    secondary: '/portrait-illustrated.jpg',
    alt: 'Bakti Surya Atmaja'
  }
};

export const availability = {
  status: 'Open for opportunities',
  type: 'Full-time / Contract',
  location: 'Remote / Hybrid (Bandung, West Java)',
  roles: ['Full-stack Developer', 'Backend Engineer', 'Cloud & DevOps']
};

export const stats = [
  { value: '4+', label: 'Years in Code' },
  { value: '15+', label: 'Homelab Services' },
  { value: '12+', label: 'Shipped Systems' },
  { value: '99.9%', label: 'Target Uptime' }
];

// Currently Building spotlight on the landing page. Set to null when nothing
// is actively in progress; the section hides itself instead of showing stale
// or empty state.
export const building = null;

export const engineTrivia = {
  title: 'Engine Architecture & Safety Nets',
  overview:
    'This portfolio runs an adaptive rendering pipeline designed to never freeze or crash on low-power devices.',
  items: [
    {
      label: 'Zero WebGL Waste (Tiering)',
      desc: 'Hardware capability (GPU, CPU cores, RAM, network type, and reduced-motion preference) is evaluated before Three.js is downloaded. Weak hardware drops straight to a CSS-only starfield.'
    },
    {
      label: 'FPS Watchdog (< 30 FPS)',
      desc: 'A rolling 1-second frame timer monitors render times. If frame rates drop under 30 FPS, it first strips particle twinkle and downscales DPR, then falls back to static CSS if needed.'
    },
    {
      label: 'WebGL Context Loss Guard',
      desc: 'Mobile browsers frequently kill WebGL contexts under memory pressure. A webglcontextlost listener catches this instantly and swaps to static rendering without a blank canvas or page reload.'
    }
  ]
};

// Tactical Skills Matrix — Classified by Operational Domain.
// Each technology contains full telemetry metadata for the System Pod Inspector.
export const stack = [
  {
    layer: 'cloud & automation',
    code: '01',
    items: [
      {
        id: 'INF-01',
        name: 'Terraform',
        badge: 'CORE',
        readiness: 95,
        detail: 'Declarative multi-tier provisioning, immutable state management, CI/CD execution.',
        role: 'Infrastructure as Code (IaC) for AWS and self-hosted Proxmox nodes. Zero manual resource drift.',
        deployedAt: 'Yado ecosystem infra, Homelab virtualization, Automated VPC topologies',
        command: '$ terraform plan -out=tfplan.binary\n[EXEC] Plan: 6 to add, 0 to change, 0 to destroy. State locked.'
      },
      {
        id: 'CLD-01',
        name: 'AWS EC2 & VPC',
        badge: 'PROD',
        readiness: 92,
        detail: 'Compute instances, custom multi-AZ VPC layout, security group isolation, and ALBs.',
        role: 'Production workloads running behind Application Load Balancers with strict security group peering.',
        deployedAt: 'High-availability web applications, staging environments, distributed API relays',
        command: '$ aws ec2 describe-instances --query "Reservations[*].Instances[*].State.Name"\n[ "running", "running", "running" ]'
      },
      {
        id: 'CLD-02',
        name: 'Amazon S3 & MinIO',
        badge: 'PROD',
        readiness: 94,
        detail: 'Object storage, presigned URLs, S3-compatible self-hosted buckets, and offsite backups.',
        role: 'Blob and media archival with lifecycle policies, bucket versioning, and client-side encryption.',
        deployedAt: 'Malas cover storage, homelab backup repositories',
        command: '$ mc admin info myminio\nUptime: 48d | Standard Storage: 1.8 TB | Health: GREEN [100% OK]'
      },
      {
        id: 'CLD-03',
        name: 'Amazon RDS & Aurora',
        badge: 'PROD',
        readiness: 90,
        detail: 'Managed PostgreSQL/MySQL, automated replication snapshots, and multi-AZ failover.',
        role: 'Relational data tier with automated backups, point-in-time recovery, and connection pooling.',
        deployedAt: 'Client production backends, mission-critical relational stores',
        command: '$ aws rds describe-db-instances --db-instance-identifier prod-db\nStatus: available | Engine: postgres-16.4 | Storage: 100GB gp3'
      },
      {
        id: 'INF-02',
        name: 'GitHub Actions',
        badge: 'DAILY',
        readiness: 96,
        detail: 'Automated CI/CD pipelines, container build & multi-arch push, zero-downtime SSH deploy.',
        role: 'Every push triggers static analysis, automated test suites, container builds, and canary deploys.',
        deployedAt: 'All active repositories, homelab GitOps workflows',
        command: '$ gh run watch\n✓ Lint & Unit Tests (22s)\n✓ Build Docker Multi-Arch (41s)\n✓ Deploy Target: Production (12s)'
      }
    ]
  },
  {
    layer: 'systems & virtualization',
    code: '02',
    items: [
      {
        id: 'SYS-01',
        name: 'Proxmox VE',
        badge: 'HOMELAB',
        readiness: 96,
        detail: 'Bare-metal Type-1 hypervisor, LXC unprivileged containers, QEMU KVM VMs, ZFS pool management.',
        role: 'Self-hosted compute cluster running 24/7. Hosts media nodes, staging APIs, and isolated lab networks.',
        deployedAt: 'Primary Homelab Node (Intel i5-7500 / 32GB RAM, 35+ containers)',
        command: '$ pvesh get /cluster/status\nNode: pve | State: Online | LXC: 3 hosts | Memory: 22.1%'
      },
      {
        id: 'SYS-02',
        name: 'Docker & Compose',
        badge: 'CORE',
        readiness: 98,
        detail: 'Multi-stage containerization, service orchestration, internal bridge networks, volume mounts.',
        role: 'Standardized runtime isolation for microservices, background queues, and ephemeral development environments.',
        deployedAt: 'Production VPS, local development, staging servers, edge runners',
        command: '$ docker compose ps\nNAME            IMAGE          STATUS         PORTS\nweb-gateway     nginx:alpine   Up 24 days     0.0.0.0:80->80, 0.0.0.0:443->443\napi-core        app:v2.4.0     Up 24 days     0.0.0.0:8080->8080'
      },
      {
        id: 'SYS-03',
        name: 'Linux (Debian / Alpine)',
        badge: 'DAILY',
        readiness: 95,
        detail: 'Systemd units, ufw / iptables, kernel tuning, logrotate, minimal footprint OCI bases.',
        role: 'Rock-solid OS foundation for all servers, VPS, and containers with automated security patching.',
        deployedAt: 'All bare-metal hosts, virtual machines, and container images',
        command: '$ uname -srm && uptime -p\nLinux 6.8.12-amd64 x86_64\nup 38 weeks, 4 days, 11 hours'
      },
      {
        id: 'SYS-04',
        name: 'Nginx & Reverse Proxy',
        badge: 'PROD',
        readiness: 92,
        detail: 'TLS termination, HTTP/2 & WebSocket proxying, upstream load balancing, security rate limiting.',
        role: 'Unified gateway handling SSL certificates, rate-limiting malicious traffic, and routing to backends.',
        deployedAt: 'Edge ingress for all web applications and homelab services',
        command: '$ nginx -t && systemctl status nginx\nnginx: syntax is ok, test is successful | Active: active (running)'
      }
    ]
  },
  {
    layer: 'networking & routing',
    code: '03',
    items: [
      {
        id: 'NET-01',
        name: 'WireGuard & Tailscale',
        badge: 'DAILY',
        readiness: 96,
        detail: 'Modern mesh VPN, split tunneling, site-to-site tunnels, zero-trust homelab subnet routing.',
        role: 'Encrypted overlay networking connecting remote dev laptops, mobile devices, and servers securely.',
        deployedAt: 'All personal workstations, mobile endpoints, and homelab gateway nodes',
        command: '$ wg show\ninterface: wg0 [listening port: 51820]\npeer: 9kL7x... [latest handshake: 12 seconds ago] [tx: 14.8 GB, rx: 98.4 GB]'
      },
      {
        id: 'NET-02',
        name: 'Cloudflare & Zero Trust',
        badge: 'PROD',
        readiness: 95,
        detail: 'Cloudflare Tunnels (cloudflared), edge proxy, DNSSEC, geo-routing, WAF security rules.',
        role: 'Zero public port forwarding. Ingress traffic is strictly authenticated via Cloudflare Access.',
        deployedAt: 'Personal domains, homelab management dashboards, public staging',
        command: '$ cloudflared tunnel run homelab-mesh\nConnector ID: a84f901c [Route: tunnel active, 4 connections healthy]'
      },
      {
        id: 'NET-03',
        name: 'DNS & Reverse Proxy Gateway',
        badge: 'CORE',
        readiness: 93,
        detail: 'Local split-horizon DNS, SSL wildcard termination, container host routing, automated cert renewal.',
        role: 'Internal domain resolution and ingress routing ensuring homelab services resolve seamlessly over mesh or LAN.',
        deployedAt: 'Nginx Proxy Manager, Homelab internal DNS resolvers',
        command: '$ dig +short yado.internal @127.0.0.1\n192.168.1.100\n$ certbot certificates\nFound certificate: *.suryatmaja.dev (VALID: 88 days)'
      }
    ]
  },
  {
    layer: 'application runtime & services',
    code: '04',
    items: [
      {
        id: 'APP-01',
        name: 'Go (Golang)',
        badge: 'CORE',
        readiness: 94,
        detail: 'High-concurrency backend services, lightweight goroutine workers, Cloudflare WARP proxy integration, streaming HTTP.',
        role: 'Concurrent backend engine for high-throughput downloads, worker pools, anti-throttle IP rotation, and memory-safe system daemons.',
        deployedAt: 'GDDL (Google Drive & CDN Downloader), concurrent download workers, WARP proxy controller',
        command: '$ go test -race -v ./...\n=== RUN   TestConcurrentWorkerPool\n--- PASS: TestConcurrentWorkerPool (0.42s)\nPASS\nok      github.com/samsmon/gddl/backend 0.451s'
      },
      {
        id: 'APP-02',
        name: 'SvelteKit & Svelte 5',
        badge: 'DAILY',
        readiness: 96,
        detail: 'Ultra-fast reactive frontends, Runes state primitives ($state, $derived), SSR/SSG, zero-bundle overhead.',
        role: 'Primary frontend framework. Delivers desktop-grade web interfaces, snappy dashboards, and fluid interactions.',
        deployedAt: 'GDDL Desktop Web, Yado Launcher, Malas Library, Homelab Dashboard, This Portfolio',
        command: '$ npm run build\n✓ built in 14.2s | adapter-auto: output verified, exit code 0'
      },
      {
        id: 'APP-03',
        name: 'Laravel & PHP',
        badge: 'CORE',
        readiness: 95,
        detail: 'Robust enterprise backends, background queue workers, Eloquent ORM, Sanctum auth, double-entry accounting.',
        role: 'Enterprise web applications, business logic processing, relational data models, and RESTful APIs.',
        deployedAt: 'Laravel POS Accounting, HA Web Server AWS backend, custom SaaS platforms',
        command: '$ php artisan queue:work redis --tries=3\n[2026-09-09 11:45:01] Processing: App\\Jobs\\ProcessMediaArchive\n[2026-09-09 11:45:03] Processed:  App\\Jobs\\ProcessMediaArchive (2.18s)'
      },
      {
        id: 'APP-04',
        name: 'PostgreSQL',
        badge: 'PROD',
        readiness: 93,
        detail: 'Advanced relational schema design, indexes, CTEs, JSONB storage, WAL replication, ACID compliance.',
        role: 'Primary relational database for persistent catalogue data, OAuth2 session storage, and relational integrity.',
        deployedAt: 'Malas Manga/LN Manager, SSO Yado Identity Provider, homelab databases',
        command: '$ psql -U postgres -d production_db -c "SELECT version();"\nPostgreSQL 16.4 on x86_64-pc-linux-gnu, compiled by gcc'
      },
      {
        id: 'APP-05',
        name: 'Bun & Hono',
        badge: 'DAILY',
        readiness: 91,
        detail: 'Ultra-fast TypeScript runtime, lightweight edge API routes, WebSockets, sub-millisecond cold starts.',
        role: 'High-performance microservices, real-time WebSocket room coordination, and fast automation scripts.',
        deployedAt: 'Realtime Group Checklist, internal telemetry relays, WebSocket handlers',
        command: '$ bun run server.ts\n[Ready] Hono API running at http://0.0.0.0:3000 (1.4ms boot time)'
      },
      {
        id: 'APP-06',
        name: 'Redis',
        badge: 'PROD',
        readiness: 90,
        detail: 'In-memory caching, pub/sub event broadcasting, session stores, distributed rate limiting.',
        role: 'Sub-millisecond data retrieval layer and queue broker for background job processing.',
        deployedAt: 'Cache and queue backend for Laravel, WebSocket relays, and microservices',
        command: '$ redis-cli PING && redis-cli INFO stats | grep total_commands\nPONG\ntotal_commands_processed: 1849204'
      }
    ]
  }
];

// Each project opens a detail modal. `images` show as a gallery, so swap the
// placeholder SVGs in static/projects/ for real screenshots (any ratio, they
// get object-fit: cover). `detail` is an array of paragraphs.
export const projects = [
  {
    slug: 'gddl',
    title: 'GDDL · Google Drive & CDN Downloader',
    kind: 'Desktop Web App',
    year: '2026',
    summary:
      'High-performance self-hosted download manager for Google Drive & Discord CDN with native qBittorrent & IDM layout, Cloudflare WARP anti-throttle auto-bypass, and chunked transfers.',
    detail: [
      'A desktop download manager and daemon built with a concurrent Go backend and Svelte 5 (Runes) frontend, featuring a native qBittorrent and Internet Download Manager (IDM) interface with categorized queues (Unfinished, Finished, Sources).',
      'Supports high-throughput multi-worker downloads for Google Drive and Discord CDN attachments with rate-limit protection, adaptive exponential backoff, request jitter pacing, and automatic link expiration detection.',
      'Features intelligent Anti-Throttle & Cloudflare WARP auto-bypass: automatically detects ISP/CDN throttling or HTTP 429 rate limits, transparently activates a local WireGuard/WARP SOCKS5 proxy or custom proxy pool, and rotates egress IPs while reconnecting active chunk streams at the exact byte offset.',
      'Includes virus-scan prompt bypass for large files (>100MB), smart folder downloads with on-the-fly ZIP compression, conflict resolution, Google session cookie pool, Jellyfin-style storage browser, and secure Web UI authentication.'
    ],
    stack: ['Go', 'Svelte 5', 'Cloudflare WARP', 'Vite', 'Docker', 'REST API', 'Goroutines', 'SSE'],
    images: ['/projects/gddl-1.png', '/projects/gddl-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/gddl' }]
  },
  {
    slug: 'yado',
    title: 'Yado',
    kind: 'Platform',
    year: '2026',
    summary:
      'The entry point to every self-hosted service running on my homelab: one launcher, single sign-on, and a live status page.',
    detail: [
      '宿 (yado) means "a place to stay." It is the front door to my homelab: a launcher with search, drag-and-drop shortcut groups, and a room directory listing every service currently running (production, staging, or in development).',
      'Every room behind it is gated by the same SSO identity provider, so signing into Yado signs you into the whole network. A public status page shows 90-day uptime and incident history sourced from real health probes, not a static badge.',
      'Replaces what used to be White Archive as the project I spend the most homelab time on. It grew out of needing one honest front page for services that used to just be a list of bookmarks.'
    ],
    stack: ['SvelteKit', 'OAuth2', 'Docker', 'Tailscale', 'Nginx Proxy Manager'],
    images: ['/projects/yado-1.png', '/projects/yado-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/yado' }]
  },
  {
    slug: 'malas',
    title: 'Malas',
    kind: 'Web app',
    year: '2026',
    summary:
      'A personal manga and light novel library manager: catalogue, collection tracking, wishlist, and loan status in one place.',
    detail: [
      'Tracks a real physical and digital collection: which volumes are owned, reading progress per series, an overdue-aware loan tracker for lent-out volumes, and a wishlist separate from the owned catalogue.',
      'The catalogue supports manga, light novels, one-shots, doujinshi, manhwa, and manhua, each filterable by genre, status, and type, with a genre-taste breakdown built from the collection itself.',
      'Sits behind the Yado SSO gateway, and its search and cover-heavy grid views are the part I iterated on the most: fast filtering over 100+ series without feeling like a spreadsheet.'
    ],
    stack: ['SvelteKit', 'PostgreSQL', 'OAuth2', 'Docker'],
    images: ['/projects/malas-1.png', '/projects/malas-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/malas' }]
  },
  {
    slug: 'homelab-dashboard',
    title: 'Homelab Dashboard',
    kind: 'Web app',
    year: '2026',
    summary:
      'The command center for my homelab: live fleet, network, storage, and backup telemetry, plus AI agent usage tracking, in one dashboard.',
    detail: [
      'Owner-POV overview of the whole node: CPU/RAM load, Tailscale mesh peers, SSL certificate renewal countdowns, and a disaster-recovery panel, all refreshed from live telemetry rather than a cron job that updates a static page.',
      'Drills into every Docker host and its containers (start, stop, restart, open a shell, follow logs), and a storage tab with SMART health, read/write throughput, and a disconnect watchdog for the external DAS enclosures.',
      'Also tracks usage for the AI coding agents running on the box itself: turns per day, 5-hour rolling quota windows, and a 7-day burn-rate chart per agent, since that turned out to be worth watching as closely as CPU.'
    ],
    stack: ['SvelteKit', 'Docker Engine API', 'Proxmox API', 'Tailscale', 'WebSocket'],
    images: ['/projects/homelab-dashboard-1.png', '/projects/homelab-dashboard-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/homelab-dashboard' }]
  },
  {
    slug: 'homelab',
    title: 'Homelab',
    kind: 'Infrastructure',
    year: 'Since 2024',
    summary:
      'A single-node Proxmox homelab running 35+ containers behind a Tailscale mesh, with DAS storage, nightly backups, and its own monitoring dashboard.',
    detail: [
      'Physical node: an Intel Core i5-7500 mini-PC/SFF box with 32GB RAM running Proxmox VE as the hypervisor. Split into three Docker hosts by role (a main docker-host for general services, a dedicated host for the Yado family of apps, and a small dev-host for scratch work), plus an apps-host LXC, for 35+ containers total.',
      'Network: a Tailscale mesh ties the node, my machines, and a couple of always-on peers together, with SSL termination and auto-renewing Let’s Encrypt certificates handled by Nginx Proxy Manager in front of everything.',
      'Storage: the Proxmox root SSD plus three external DAS enclosures (media, cloud, and music volumes) add up to about 3.8TB, with live SMART health checks and a canary watchdog that flags a drive the moment it disconnects. Nightly vzdump snapshots land on a dedicated backup volume.',
      'This is the box that everything else on this page, Yado, SSO, Malas, and White Archive before it, actually runs on. No public repo for the infrastructure config itself since it is tightly coupled to this specific hardware, but the Homelab Dashboard project above is the tool I built to watch it.'
    ],
    stack: ['Proxmox VE', 'Docker', 'Tailscale', 'Nginx Proxy Manager', 'vzdump'],
    images: ['/projects/homelab-1.png', '/projects/homelab-2.png'],
    links: []
  },
  {
    slug: 'sso-yado',
    title: 'SSO · Yado',
    kind: 'Platform',
    year: '2026',
    summary:
      'Centralized OAuth2 identity provider securing every service in the Yado network with a single login.',
    detail: [
      'A standalone identity provider implementing the OAuth2 Authorization Code flow with PKCE (S256), so client apps never see or store passwords.',
      'Handles user accounts, active session management, two-factor security, and per-application client registration from one admin dashboard. Every other service (Yado, Malas, and anything added later) authenticates against it instead of rolling its own auth.',
      'Built to be boring on purpose: fewer places where login state can drift out of sync, fewer secrets to rotate.'
    ],
    stack: ['OAuth2', 'PKCE', 'Node.js', 'PostgreSQL', 'Docker'],
    images: ['/projects/sso-yado-1.png', '/projects/sso-yado-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/sso.yado' }]
  },
  {
    slug: 'pore-js',
    title: 'Pore.js',
    kind: 'Library',
    year: '2026',
    summary:
      'A source-agnostic web reader for manga, comics, and books, built from scratch with its own pagination engine and no backend.',
    detail: [
      'Opens EPUB, PDF, CBZ/ZIP, or a raw folder of images entirely client-side. Nothing is uploaded anywhere: the file stays in the browser for the whole session.',
      'One reader, many reading modes: right-to-left double-page manga spreads, continuous-scroll webtoon, reflowable EPUB with adjustable typography, vertical Japanese (tategaki), right-to-left Arabic prose, pre-paginated fixed-layout EPUB, and PDF rendering with a searchable text layer.',
      'The reading engine that powers Malas under the hood. The hardest part turned out to be pagination math for mixed aspect-ratio scans, getting double-page spreads to split cleanly regardless of source resolution.'
    ],
    stack: ['JavaScript', 'Canvas API', 'EPUB.js', 'PDF.js'],
    images: ['/projects/pore-js-1.png', '/projects/pore-js-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/pore-js' }]
  },
  {
    slug: 'ha-web-server-aws',
    title: 'HA Web Server AWS',
    kind: 'Infrastructure',
    year: '2026',
    summary:
      'High-availability web architecture on AWS Free Tier: multi-AZ EC2, database replication on instance to RDS, S3 storage, and ALB.',
    detail: [
      'Two EC2 web servers distributed across two Availability Zones behind an Application Load Balancer with round-robin traffic routing and automated health checking.',
      'Primary MySQL database hosted on an EC2 instance with real-time binary log replication to Amazon RDS MySQL replica for zero data loss and read fallback.',
      'Stateless media uploads configured to stream directly to an Amazon S3 bucket with least-privilege IAM policies and multi-tier security groups.'
    ],
    stack: ['AWS EC2', 'Amazon RDS', 'Amazon S3', 'ALB', 'PHP', 'MySQL', 'Apache'],
    images: ['/projects/ha-web-server-1.png', '/projects/ha-web-server-2.png'],
    links: [
      { label: 'Repo', href: 'https://github.com/samsmon/ha-webserver' },
      { label: 'Case Study', href: '/projects/ha-web-server-aws' }
    ]
  },
  {
    slug: 'realtime-group-checklist',
    title: 'Realtime Group Checklist',
    kind: 'Web app',
    year: '2026',
    summary:
      'A collaborative checklist application with realtime WebSocket synchronization, JWT authentication, and Cloudflare Tunnel deployment.',
    detail: [
      'Engineered with Bun runtime and Hono framework for ultra-low latency request handling and WebSocket room coordination.',
      'Lightweight reactive frontend built using Alpine.js without heavy framework overhead, delivering instant client updates.',
      'Deployed on an AWS EC2 instance connected through a secure Cloudflare Tunnel without opening public ingress ports.'
    ],
    stack: ['Bun', 'Hono', 'Alpine.js', 'WebSocket', 'AWS EC2', 'Cloudflare Tunnel'],
    images: ['/projects/realtime-group-checklist-1.png', '/projects/realtime-group-checklist-2.png'],
    links: [
      { label: 'Case Study', href: '/projects/realtime-group-checklist' },
      { label: 'GitHub', href: 'https://github.com/samsmon/group-checklist' }
    ]
  },
  {
    slug: 'laravel-pos-accounting',
    title: 'Laravel POS Accounting',
    kind: 'Web app',
    year: '2024',
    summary:
      'Point of Sale system integrated with automated double-entry general ledger, journal recording, and financial reporting.',
    detail: [
      'Full point-of-sale workflow handling daily cashier sales, stock monitoring, and customer transaction receipts.',
      'Automated double-entry accounting engine creating general journal entries, ledger accounts, and balance sheet reports on transaction commit.'
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap 5'],
    images: ['/projects/laravel-pos-1.png', '/projects/laravel-pos-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/laravel-pos-accounting' }]
  },
  {
    slug: 'atm-cli-banking-system',
    title: 'ATM CLI Banking System',
    kind: 'System',
    year: '2026',
    summary:
      'CLI-based automated banking system in Java demonstrating core OOP design principles and transaction safety.',
    detail: [
      'Built in Java utilizing encapsulation, inheritance, and polymorphism patterns for strict account isolation and transaction handling.',
      'Supports balance inquiry, cash withdrawal, account deposit, and inter-account fund transfers with credential authentication.'
    ],
    stack: ['Java', 'OOP', 'CLI Architecture'],
    images: ['/projects/atm-cli-1.png', '/projects/atm-cli-2.png'],
    links: [{ label: 'Repo', href: 'https://github.com/samsmon/oop-banking-cli' }]
  }
];

export const contact = {
  body: 'Open to full-stack and infrastructure work. Email is the fastest way to reach me.',
  email: 'contact@suryatmaja.dev',
  links: [
    { label: 'Blog', href: '/blog' },
    { label: 'GitHub', href: 'https://github.com/samsmon' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suryatmaja/' },
    { label: 'Instagram', href: 'https://www.instagram.com/symjaaa/' },
    { label: 'Email', href: 'mailto:contact@suryatmaja.dev' }
  ]
};

export const resume = {
  url: '/cv-suryatmaja.pdf',
  title: 'Bakti Surya Atmaja — Curriculum Vitae',
  filename: 'Bakti_Surya_Atmaja_CV.pdf',
  lastUpdated: '2026'
};

