(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  M.screens=M.screens||{};
  M.screens.inventory=()=>{
    const groups=[...new Set(M.inventory.map(x=>x.group))];
    return `<main class="inventory-page"><div class="inventory-shell"><header class="inventory-header"><div><h1>Índice navegable del mockup</h1><p>45 pantallas y modales del sistema <strong>SENA — Gestión de Horarios</strong>. Cada enlace activa automáticamente el rol requerido en modo revisión. El acceso manual a una ruta no permitida mantiene el guard RBAC y muestra 403.</p></div><a class="btn btn-primary" href="#/login">Abrir Login</a></header><div class="alert alert-info">${icon('info')}Prototipo estático. Los datos son mock y las acciones no persisten en backend.</div>${groups.map(g=>`<section class="inventory-group"><h2>${g}</h2><div class="inventory-grid">${M.inventory.filter(x=>x.group===g).map(x=>`<a class="card inventory-card" href="#${x.route}${x.route.includes('?')?'&':'?'}as=${x.role}" data-review-role="${x.role}"><span class="inventory-number">${x.n}</span><div><h3>${x.name}</h3><p>${x.mfe} · Rol: ${x.role}</p></div></a>`).join('')}</div></section>`).join('')}</div></main>`;
  };
  M.screens.appShellReview=(ctx)=>`${C().pageHeader('App Shell','Marco compartido para todas las experiencias por rol.')}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">Composición activa</h2><p class="panel-subtitle">TopBar + SideNav por rol + área de contenido + estados globales.</p></div>${C().status('ACTIVE')}</header><div class="panel-body">${C().details([['Rol activo',D().userByRole[ctx.role].label],['Navegación',`${M.navByRole[ctx.role].length} módulos visibles`],['Responsive','Drawer en móvil (< 768px)'],['Accesibilidad','WCAG 2.1 AA · objetivos táctiles ≥44px'],['Design-system','Un único set de tokens compartidos'],['Router','Hash routing con guards RBAC']])}<div class="alert alert-info" style="margin-top:20px">${icon('info')}Use el menú de usuario para cambiar de rol en modo revisión. Las rutas no autorizadas muestran la variante 403.</div></div></section>`;
  M.screens.systemStates=(ctx)=>{
    const variant=ctx.query.get('variant')||'403';
    const states={
      '403':['403','No tienes permiso para ver esto.','Tu rol no tiene acceso a esta sección.','Volver al inicio'],
      '404':['404','No encontramos esta página.','El recurso que buscas no existe o ya no está disponible.','Volver al inicio'],
      '500':['500','Algo salió mal de nuestro lado.','Ocurrió un error inesperado. Intenta de nuevo en unos minutos.','Reintentar'],
      'session':['','Tu sesión expiró.','Por seguridad, cerramos tu sesión. Ingresa de nuevo para continuar.','Ir a iniciar sesión']
    };
    const s=states[variant]||states['403'];
    return `<section class="system-state"><div class="system-state-content">${s[0]?`<div class="system-code">${s[0]}</div>`:`<span class="state-icon" style="margin-inline:auto">${icon('lock')}</span>`}<h1>${s[1]}</h1><p style="color:var(--color-text-muted)">${s[2]}</p><div class="page-actions" style="justify-content:center"><a class="btn btn-primary" href="${variant==='session'?'#/login':'#'+M.homeForRole(ctx.role)}">${s[3]}</a></div><div class="tabs" style="margin-top:28px;justify-content:center"><a class="tab ${variant==='403'?'active':''}" href="#/system-states?variant=403">403</a><a class="tab ${variant==='404'?'active':''}" href="#/system-states?variant=404">404</a><a class="tab ${variant==='500'?'active':''}" href="#/system-states?variant=500">500</a><a class="tab ${variant==='session'?'active':''}" href="#/system-states?variant=session">Sesión</a></div></div></section>`;
  };
})();
