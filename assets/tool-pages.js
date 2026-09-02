(() => {
  'use strict';
  const key = document.body.dataset.toolKey;
  if (!key) return;

  const start = () => {
    const area = document.getElementById('calcArea');
    if (!area) return;
    try {
      if (typeof window.openTool !== 'function') throw new Error('Calculator unavailable');
      // Opening a dedicated page should not jump past its heading and breadcrumb.
      const scroll = area.scrollIntoView;
      area.scrollIntoView = () => {};
      try { window.openTool(key); } finally { area.scrollIntoView = scroll; }
      const close = area.querySelector('.close');
      if (close) {
        const link = document.createElement('a');
        link.className = 'close';
        link.href = '/tools';
        link.textContent = '← All tools';
        close.replaceWith(link);
      }
    } catch (error) {
      console.error('Unable to open calculator:', error);
      area.innerHTML = '<p role="alert">The interactive calculator could not load. Reload the page or <a href="/tools">return to all tools</a>. The formula and example below are still available.</p>';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
