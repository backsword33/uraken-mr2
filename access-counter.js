(() => {
  const element = document.querySelector('[data-access-counter]');
  if (!element) return;
  const category = element.dataset.accessCounter;
  const host = location.hostname;
  const scope = host === 'backsword33.github.io' ? 'github-' + category : host === 'backsword-racing.fumitoyamamori.chatgpt.site' && category === 'team' ? 'chatgpt-team' : null;
  if (!scope) { element.textContent = '—'; return; }
  const endpoint = 'https://backsword-racing.fumitoyamamori.chatgpt.site/api/public-counter?site=' + scope;
  const key = 'backsword-counter-v1-' + scope;
  let visit;
  try { visit = JSON.parse(sessionStorage.getItem(key)); } catch {}
  if (!visit || typeof visit.nonce !== 'string' || !Number.isFinite(visit.created) || Date.now() - visit.created > 30 * 60 * 1000) {
    visit = {nonce:crypto.randomUUID(),created:Date.now()};
    try { sessionStorage.setItem(key,JSON.stringify(visit)); } catch {}
  }
  async function load() {
    try {
      const response = await fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',headers:{'Content-Type':'text/plain'},body:JSON.stringify({nonce:visit.nonce}),signal:AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error('Counter unavailable');
      const data = await response.json();
      if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error('Invalid count');
      element.textContent = String(data.count).padStart(6,'0');
      element.setAttribute('aria-label',data.count.toLocaleString('ja-JP') + 'アクセス');
    } catch {
      element.textContent = '—';
      element.title = '現在、アクセス数を取得できません';
    }
  }
  if (document.visibilityState === 'visible') load();
  else document.addEventListener('visibilitychange',function ready(){ if(document.visibilityState === 'visible'){document.removeEventListener('visibilitychange',ready);load();} });
})();
