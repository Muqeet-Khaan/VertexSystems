document.addEventListener('DOMContentLoaded', function () {
  const imgs = Array.from(document.querySelectorAll('img'));
  imgs.forEach(img => {
    const src = img.getAttribute('src') || '';
    if (!/Images\//.test(src)) return;
    // attach error handler
    img.addEventListener('error', function onErr() {
      // avoid infinite loop
      if (img.dataset.fallbacked) return;
      img.dataset.fallbacked = '1';
      try {
        const parts = src.split('/');
        let name = parts[parts.length - 1] || 'img';
        name = name.replace(/\.[^.]+$/, '');
        const seed = encodeURIComponent(name.replace(/[^a-z0-9_-]/gi, '-')) || 'placeholder';
        const fallback = `https://picsum.photos/seed/${seed}/1200/600`;
        img.src = fallback;
      } catch (e) {
        img.src = 'https://picsum.photos/1200/600';
      }
      img.removeEventListener('error', onErr);
    });
    // also handle cases where image 404 may already have occurred before handler attached
    // Try to force a reload if naturalWidth is zero
    if (img.complete && img.naturalWidth === 0 && !img.dataset.fallbacked) {
      const ev = new Event('error');
      img.dispatchEvent(ev);
    }
  });
});
