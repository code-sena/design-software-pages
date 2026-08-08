(() => {
  const M=window.Mockup=window.Mockup||{};
  const root=document.getElementById('app');
  let currentContext=null;

  function parseHash(){
    const raw=(location.hash||'#/login').slice(1);
    const [pathPart,queryPart='']=raw.split('?');
    return {path:pathPart||'/',query:new URLSearchParams(queryPart)};
  }
  function matchRoute(path){
    for(const route of M.routeDefinitions){
      const m=path.match(route.pattern);
      if(m)return {route,params:m.slice(1)};
    }
    return null;
  }
  function role(){ return localStorage.getItem('sena-mockup-role')||'coordinator'; }
  function setRole(value){ if(value&&value!=='public')localStorage.setItem('sena-mockup-role',value); }
  function route(){
    const parsed=parseHash();
    if(parsed.query.get('as')) setRole(parsed.query.get('as'));
    const activeRole=role();
    const found=matchRoute(parsed.path);
    const ctx={path:parsed.path,query:parsed.query,params:found?.params||[],role:activeRole,state:parsed.query.get('state')||'normal',offline:parsed.query.get('offline')==='1',readonly:activeRole==='director'};
    currentContext=ctx;
    if(!found){ renderSystem(ctx,'404'); return; }
    if(!found.route.public && !found.route.roles.includes(activeRole)){ renderSystem(ctx,'403'); return; }
    const screen=M.screens[found.route.screen];
    if(!screen){ root.innerHTML='<main class="inventory-page"><h1>Pantalla no registrada</h1></main>';return; }
    const content=screen(ctx);
    root.innerHTML=found.route.public?content:M.renderShell(ctx,content);
    bindInteractions();
    if(parsed.query.get('overlay')==='notifications')document.querySelector('[data-notifications]')?.setAttribute('aria-expanded','true');
    document.title=`${screenTitle(found.route.screen)} | SENA — Gestión de Horarios`;
  }
  function renderSystem(ctx,variant){
    const content=`<section class="system-state"><div class="system-state-content"><div class="system-code">${variant}</div><h1>${variant==='403'?'No tienes permiso para ver esto.':'No encontramos esta página.'}</h1><p style="color:var(--color-text-muted)">${variant==='403'?'Tu rol no tiene acceso a esta sección.':'El recurso que buscas no existe o ya no está disponible.'}</p><a class="btn btn-primary" href="#${M.homeForRole(ctx.role)}">Volver al inicio</a></div></section>`;
    root.innerHTML=M.renderShell(ctx,content);bindInteractions();
  }
  function screenTitle(name){ return (M.inventory.find(x=>name.toLowerCase().includes(x.name.split(' ')[0].toLowerCase()))?.name)||'Mockup'; }
  function updateQuery(changes,remove=[]){
    const {path,query}=parseHash();
    remove.forEach(k=>query.delete(k));
    Object.entries(changes).forEach(([k,v])=>v==null?query.delete(k):query.set(k,v));
    location.hash=`#${path}${query.toString()?`?${query}`:''}`;
  }
  function bindInteractions(){
    document.querySelector('[data-collapse-nav]')?.addEventListener('click',()=>document.body.classList.toggle('nav-collapsed'));
    document.querySelector('[data-mobile-nav]')?.addEventListener('click',()=>document.body.classList.toggle('mobile-nav-open'));
    document.querySelector('[data-nav-backdrop]')?.addEventListener('click',()=>document.body.classList.remove('mobile-nav-open'));
    const userTrigger=document.querySelector('[data-user-trigger]'),userMenu=document.querySelector('[data-user-menu]');
    userTrigger?.addEventListener('click',e=>{e.stopPropagation();const open=userMenu.hidden;userMenu.hidden=!open;userTrigger.setAttribute('aria-expanded',String(open));});
    document.querySelectorAll('[data-switch-role]').forEach(btn=>btn.addEventListener('click',()=>{setRole(btn.dataset.switchRole);location.hash='#'+M.homeForRole(btn.dataset.switchRole);}));
    document.querySelector('[data-notifications]')?.addEventListener('click',()=>updateQuery({overlay:'notifications'}));
    document.querySelector('[data-close-notifications]')?.addEventListener('click',()=>updateQuery({},['overlay']));
    document.querySelectorAll('[data-open-modal]').forEach(btn=>btn.addEventListener('click',()=>updateQuery({modal:btn.dataset.openModal})));
    document.querySelectorAll('.tabs').forEach(bar=>{const scope=bar.closest('.panel')||bar.parentElement;bar.querySelectorAll('.tab[data-tab]').forEach(tab=>tab.addEventListener('click',()=>{const i=tab.dataset.tab;bar.querySelectorAll('.tab').forEach(t=>{const a=t===tab;t.classList.toggle('active',a);t.setAttribute('aria-selected',String(a));});const panels=scope.querySelectorAll('[data-tabpanel]');if(panels.length)panels.forEach(p=>{p.hidden=p.dataset.tabpanel!==i;});}));});
    document.querySelectorAll('[data-navigate]').forEach(btn=>btn.addEventListener('click',()=>{location.hash='#'+btn.dataset.navigate;}));
    document.querySelectorAll('[data-session-id]').forEach(btn=>btn.addEventListener('click',()=>updateQuery({panel:'session'})));
    document.querySelectorAll('[data-close-modal], [data-modal-backdrop]').forEach(el=>el.addEventListener('click',e=>{if(el.matches('[data-modal-backdrop]')&&e.target!==el)return;updateQuery({},['modal','panel','preview']);}));
    document.querySelectorAll('[data-password-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.getAttribute('aria-controls'));const show=input.type==='password';input.type=show?'text':'password';btn.innerHTML=M.icon(show?'eyeOff':'eye');btn.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña');}));
    document.querySelector('[data-login-form]')?.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('login-email')?.value||'';const selected=email.includes('instructor')?'instructor':email.includes('aprendiz')?'learner':email.includes('director')?'director':email.includes('soporte')?'support':'coordinator';setRole(selected);location.hash='#'+M.homeForRole(selected);});
    document.querySelectorAll('[data-review-role]').forEach(a=>a.addEventListener('click',()=>setRole(a.dataset.reviewRole)));
    document.addEventListener('click',outsideMenu,{once:true});
  }
  function outsideMenu(e){const wrap=document.querySelector('.user-menu-wrap');if(wrap&&!wrap.contains(e.target)){const menu=document.querySelector('[data-user-menu]');if(menu)menu.hidden=true;}}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('mobile-nav-open');const {path,query}=parseHash();if(query.has('modal')||query.has('panel')||query.has('preview')||query.has('overlay'))updateQuery({},['modal','panel','preview','overlay']);}});
  window.addEventListener('hashchange',route);
  window.addEventListener('DOMContentLoaded',route);
})();
