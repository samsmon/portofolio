<script>
  import { onMount } from 'svelte';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    // Hydration is done and any opening-sequence overlay is already painted:
    // lift the first-paint cover (see app.html).
    const bc = document.getElementById('boot-cover');
    if (bc) {
      bc.style.opacity = '0';
      setTimeout(() => bc.remove(), 350);
    }
  });
</script>

<svelte:head>
  <!-- Three families for the whole site, landing and blog alike:
       Epilogue for display and UI, Plus Jakarta Sans for reading,
       Fira Code for labels and code. -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400..900&family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400&family=Fira+Code:wght@400;500&display=swap"
  />
</svelte:head>

{@render children()}
