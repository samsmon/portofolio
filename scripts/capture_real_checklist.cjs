const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const checklistPublic = 'C:\\Users\\Sam\\Documents\\GitHub\\group-checklist\\public';

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml'
};

const mockProjects = [
  {
    id: 'p1',
    name: 'Sprint 24 · Production HA Deployment',
    slug: 'sprint24',
    visibility: 'public',
    item_count: 7,
    completed_count: 5,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    last_activity_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'p2',
    name: 'Homelab Proxmox Migration',
    slug: 'homelab-migration',
    visibility: 'private',
    item_count: 12,
    completed_count: 9,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    last_activity_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'p3',
    name: 'Cloudflare Zero Trust Ingress',
    slug: 'cloudflare-zt',
    visibility: 'public',
    item_count: 4,
    completed_count: 4,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    last_activity_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

const mockItems = [
  {
    id: 'sec-1',
    item_type: 'section',
    title: 'Infrastructure & Cloud Provisioning',
    position: 1
  },
  {
    id: 'it-1',
    item_type: 'task',
    title: 'Provision Multi-AZ VPC with Public & Private Subnets',
    description: '10.0.0.0/16 CIDR with redundant NAT Gateways across us-east-1a and 1b',
    actor_name: 'Bakti',
    pic_name: 'Bakti',
    completion: {
      done_by_name: 'Bakti',
      done_at: new Date(Date.now() - 7200000).toISOString()
    },
    position: 2
  },
  {
    id: 'it-2',
    item_type: 'task',
    title: 'Deploy Application Load Balancer (ALB) & SSL Wildcard',
    description: 'Configure ACM certificates and health check probes on /health',
    actor_name: 'Sarah',
    pic_name: 'Sarah',
    completion: {
      done_by_name: 'Sarah',
      done_at: new Date(Date.now() - 5400000).toISOString()
    },
    position: 3
  },
  {
    id: 'it-3',
    item_type: 'task',
    title: 'Configure EC2 Auto-Scaling Group & Target Tracking',
    description: 'Min 2, Max 6 instances with target CPU 70%',
    actor_name: 'Bakti',
    pic_name: 'Bakti',
    completion: {
      done_by_name: 'Bakti',
      done_at: new Date(Date.now() - 3600000).toISOString()
    },
    position: 4
  },
  {
    id: 'sec-2',
    item_type: 'section',
    title: 'Database & Storage Tier',
    position: 5
  },
  {
    id: 'it-4',
    item_type: 'task',
    title: 'Setup Amazon RDS MySQL Replica & Binary Logging',
    description: 'Cross-AZ read replica with automated daily snapshot window',
    actor_name: 'Bakti',
    pic_name: 'Bakti',
    completion: {
      done_by_name: 'Bakti',
      done_at: new Date(Date.now() - 2400000).toISOString()
    },
    position: 6
  },
  {
    id: 'it-5',
    item_type: 'task',
    title: 'Stream Object Storage to S3 with Lifecycle Rules',
    description: 'Transition blobs older than 90 days to Glacier Flexible Retrieval',
    actor_name: 'Sarah',
    pic_name: 'Sarah',
    completion: {
      done_by_name: 'Sarah',
      done_at: new Date(Date.now() - 1200000).toISOString()
    },
    position: 7
  },
  {
    id: 'it-6',
    item_type: 'task',
    title: 'Run Stress Benchmark & Failover Verification (k6)',
    description: 'Simulate 5,000 req/sec peak with simulated AZ disruption',
    actor_name: 'Bakti',
    pic_name: 'Bakti',
    completion: null,
    position: 8
  },
  {
    id: 'it-7',
    item_type: 'task',
    title: 'Final Production Traffic Cutover & Route 53 DNS Switch',
    description: 'Lower TTL to 60s, switch apex record to ALB alias',
    actor_name: 'Bakti',
    pic_name: 'Bakti',
    completion: null,
    position: 9
  }
];

const mockMessages = [
  {
    id: 'msg-1',
    username: 'Sarah',
    body: 'ALB health check endpoint responded 200 OK across both AZs.',
    created_at: new Date(Date.now() - 5400000).toISOString()
  },
  {
    id: 'msg-2',
    username: 'Bakti',
    body: 'Replication lag on RDS replica is under 12ms. S3 policy synced.',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'msg-3',
    username: 'Sarah',
    body: 'Running the k6 test suite now with 3,000 virtual users.',
    created_at: new Date(Date.now() - 900000).toISOString()
  }
];

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // API Mocks
  if (url === '/api/auth/me') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ id: 'u1', username: 'Bakti' }));
  }

  if (url === '/api/projects') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(mockProjects));
  }

  if (url === '/api/projects/sprint24') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      ...mockProjects[0],
      is_owner: true,
      items: mockItems
    }));
  }

  if (url === '/api/projects/sprint24/messages') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ messages: mockMessages }));
  }

  if (url.startsWith('/api/projects/sprint24/logs')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      logs: [
        { id: 'l1', actor_name: 'Bakti', action: 'item.completed', created_at: new Date(Date.now() - 2400000).toISOString() },
        { id: 'l2', actor_name: 'Sarah', action: 'item.completed', created_at: new Date(Date.now() - 1200000).toISOString() }
      ]
    }));
  }

  // Static files from group-checklist/public
  let reqPath = url === '/' ? '/index.html' : url;
  const safePath = path.normalize(decodeURI(reqPath)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(checklistPublic, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA fallback
    const fallbackPath = path.join(checklistPublic, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(fallbackPath).pipe(res);
  }
});

server.listen(8770, async () => {
  console.log('Group-checklist real server running on port 8770');

  try {
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 850, deviceScaleFactor: 2 });

    // Set dark theme preference in localStorage for consistent tactical aesthetic
    await page.goto('http://127.0.0.1:8770', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('sidebarOpen', 'true');
    });

    // 1. Capture Active Project View (Task list + real sections + real completion + chat)
    await page.goto('http://127.0.0.1:8770/#/p/sprint24', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200)); // Allow Alpine transitions and data fetch

    const dest1 = path.resolve(__dirname, '../static/projects/realtime-group-checklist-1.png');
    await page.screenshot({ path: dest1, clip: { x: 0, y: 0, width: 1366, height: 850 } });
    console.log('Saved realtime-group-checklist-1.png:', fs.statSync(dest1).size, 'bytes');

    // 2. Capture Dashboard View (Cards grid + stats row + welcome banner)
    await page.goto('http://127.0.0.1:8770/#/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const dest2 = path.resolve(__dirname, '../static/projects/realtime-group-checklist-2.png');
    await page.screenshot({ path: dest2, clip: { x: 0, y: 0, width: 1366, height: 850 } });
    console.log('Saved realtime-group-checklist-2.png:', fs.statSync(dest2).size, 'bytes');

    await browser.close();
    server.close();
    console.log('Done group checklist capture from REAL project code!');
  } catch (err) {
    console.error('Error during capture:', err);
    server.close();
  }
});
