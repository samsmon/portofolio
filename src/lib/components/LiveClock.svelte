<script>
  import { onMount } from 'svelte';

  let timeString = $state('');

  function updateTime() {
    const now = new Date();
    // Format to Asia/Jakarta time (WIB, UTC+7) with seconds
    timeString = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
  }

  onMount(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });
</script>

<div class="clock-container inline-flex items-center gap-3 font-mono select-none">
  <!-- Jam (HH:mm:ss) -->
  <span class="clock-time text-sm sm:text-base font-light tracking-wider tabular-nums">
    {timeString || '--:--:--'}
  </span>

  <!-- Sisi kanan: UTC+7 di atas, WIB di bawah -->
  <div class="flex flex-col text-label leading-tight tracking-[0.16em] uppercase">
    <span class="clock-utc">UTC+7</span>
    <span class="clock-wib font-medium">WIB</span>
  </div>

  <span class="text-xs opacity-30" aria-hidden="true" style="color: var(--tactical-border);">|</span>

  <!-- Homelab Node Live Beacon -->
  <div class="flex items-center gap-1.5 text-label tracking-[0.14em] uppercase" title="Homelab Cluster: Intel i5-7500 / 32GB RAM / 35+ containers">
    <span class="relative flex h-1.5 w-1.5">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
    </span>
    <span class="clock-utc">NODE-01</span>
    <span class="font-semibold text-emerald-400">ONLINE</span>
  </div>
</div>

<style>
  .clock-container {
    text-shadow: none;
  }
  .clock-time {
    color: var(--tactical-text-primary, var(--blog-text-primary));
  }
  .clock-utc {
    color: var(--tactical-text-muted, var(--blog-text-muted));
  }
  .clock-wib {
    color: var(--tactical-accent, var(--blog-accent));
  }
</style>
