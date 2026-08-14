(() => {
  const M = window.Mockup = window.Mockup || {};
  const icon = (...args) => M.icon(...args);
  const statusConfig = {
    DRAFT:['Borrador','status-draft','circle'], UNDER_REVIEW:['En revisión','status-review','warning'], PUBLISHED:['Publicado','status-published','check'], ARCHIVED:['Archivado','status-neutral','lock'], OBSOLETE:['Obsoleta','status-neutral','lock'],
    CONFLICT:['Pendiente','status-conflict','warning'], RESOLVED:['Resuelto','status-success','check'], ACTIVE:['Activo','status-success','check'], INACTIVE:['Inactivo','status-neutral','lock'],
    AVAILABLE:['Disponible','status-success','check'], UNAVAILABLE:['No disponible','status-danger','lock'], EXCEPTION:['Con excepción','status-warning','warning'], CANCELLED:['Cancelada','status-neutral','x'],
    INDUCTION:['Inducción','status-info','info'], EXECUTION:['Ejecución','status-success','check'], PRODUCTIVE_STAGE:['Etapa productiva','status-warning','clock'], COMPLETED:['Finalizada','status-neutral','check'],
    GENERATING:['Generando…','status-info','refresh'], GENERATION_FAILED:['Error de generación','status-danger','warning'], EXPIRED:['Expirado','status-warning','clock'],
    PENDING:['Enviando…','status-warning','clock'], SENT:['Enviado','status-success','check'], FAILED:['No se pudo entregar','status-danger','warning'],
    ON_TRACK:['En seguimiento','status-success','check'], AT_RISK:['En riesgo','status-warning','warning'], CRITICAL:['Crítico','status-danger','warning'],
    SUCCESS:['Exitoso','status-success','check'], INFO:['Información','status-info','info']
  };
  M.Components = {
    status(value, labelOverride) {
      const [label, cls, ico] = statusConfig[value] || [labelOverride || value,'status-neutral','info'];
      return `<span class="status-badge ${cls}">${icon(ico)}${labelOverride || label}</span>`;
    },
    // G2 · badges de notificación accionable: no-leída + prioridad + categoría.
    notifBadges(n) {
      const pr = {HIGH:['status-danger','Alta'],NORMAL:['status-info','Normal'],LOW:['status-neutral','Baja']}[n.priority] || ['status-neutral', n.priority||'—'];
      const cat = {SCHEDULE_PUBLISHED:'Horario publicado',SCHEDULE_CHANGED:'Cambio de horario',CONFLICT:'Conflicto',INSTRUCTOR_EXCEPTION:'Novedad instructor',GENERAL:'General'}[n.category] || n.category || 'General';
      const nueva = n.isRead ? '' : `<span class="status-badge status-info">${icon('circle')}Nueva</span>`;
      return `${nueva}<span class="status-badge ${pr[0]}">${icon('warning')}Prioridad: ${pr[1]}</span><span class="status-badge status-neutral">${icon('bell')}${cat}</span>`;
    },
    pageHeader(title, subtitle='', primary=null, back=null) {
      return `${back ? `<a class="back-link" href="#${back.href}">${icon('arrowLeft')}${back.label}</a>` : ''}
      <header class="page-header"><div><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>${primary?`<div class="page-actions"><a class="btn btn-primary" href="#${primary.href}" ${primary.attrs||''}>${icon(primary.icon||'plus')}${primary.label}</a></div>`:''}</header>`;
    },
    pagination(total=24, start=1, end=10, page=1, pageSize=10, cursor=false) {
      if (cursor) return `<div class="table-footer"><span>Mostrando ${end} registros</span><button class="btn btn-secondary btn-sm" type="button">Cargar más</button><label class="page-size"><select><option>10</option><option>20</option><option>50</option></select><span>por carga</span></label></div>`;
      return `<div class="table-footer"><span>Mostrando ${start}–${end} de ${total}</span><nav class="pagination" aria-label="Paginación"><button class="btn btn-secondary btn-sm" ${page===1?'disabled':''}>‹ Anterior</button><button class="page-btn ${page===1?'active':''}">1</button><button class="page-btn ${page===2?'active':''}">2</button><button class="page-btn ${page===3?'active':''}">3</button><button class="btn btn-secondary btn-sm">Siguiente ›</button></nav><label class="page-size"><select><option ${pageSize===10?'selected':''}>10</option><option ${pageSize===20?'selected':''}>20</option><option ${pageSize===50?'selected':''}>50</option></select><span>por página</span></label></div>`;
    },
    table(columns, rows, opts={}) {
      const head = columns.map(c=>`<th scope="col">${c.label}</th>`).join('');
      const body = rows.map(r=>`<tr>${columns.map(c=>`<td data-label="${c.label}">${typeof c.render==='function'?c.render(r):(r[c.key]??'—')}</td>`).join('')}</tr>`).join('');
      return `<div class="panel"><div class="data-table-wrap"><table class="data-table"><caption class="sr-only">${opts.caption||'Listado'}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>${opts.pagination===false?'':this.pagination(opts.total||rows.length,opts.start||1,opts.end||rows.length,opts.page||1,opts.pageSize||10,opts.cursor)}</div>`;
    },
    filters(fields, actionLabel='Limpiar filtros') {
      return `<form class="card filters" data-filter-form>${fields.map(f=>{
        if(f.type==='search') return `<div class="form-field"><label>${f.label}</label><div class="search-input">${icon('search')}<input type="search" placeholder="${f.placeholder||''}"></div></div>`;
        if(f.type==='date') return `<div class="form-field"><label>${f.label}</label><input type="date" value="${f.value||'2026-08-06'}"></div>`;
        if(f.type==='text') return `<div class="form-field"><label>${f.label}</label><input type="text" value="${f.value||''}" placeholder="${f.placeholder||''}"></div>`;
        return `<div class="form-field"><label>${f.label}</label><select>${(f.options||['Todos']).map(o=>`<option>${o}</option>`).join('')}</select></div>`;
      }).join('')}<button class="btn btn-secondary" type="reset">${icon('filter')}${actionLabel}</button></form>`;
    },
    details(items) {
      return `<dl class="detail-grid">${items.map(([k,v])=>`<div class="detail-item"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
    },
    kpi(label, value, meta='', status='') {
      return `<article class="card kpi-card ${status==='critical'?'kpi-critical':''}"><div class="kpi-label">${icon(status==='critical'?'warning':'chart')}${label}</div><p class="kpi-value">${value}</p><div class="kpi-footer"><span>${meta}</span></div></article>`;
    },
    state(kind, entity='datos') {
      if(kind==='loading') return `<section class="panel loading-state" aria-label="Cargando"><div style="width:100%"><div class="skeleton" style="height:28px;width:35%;margin-bottom:20px"></div>${Array.from({length:7},()=>'<div class="skeleton skeleton-row"></div>').join('')}</div></section>`;
      if(kind==='error') return `<section class="panel error-state"><div><span class="state-icon">${icon('warning')}</span><h2>Algo salió mal de nuestro lado.</h2><p>Ocurrió un error inesperado. Intenta de nuevo en unos minutos.</p><button class="btn btn-primary" data-retry>${icon('refresh')}Reintentar</button></div></section>`;
      return `<section class="panel empty-state"><div><span class="state-icon">${icon('search')}</span><h2>No hay ${entity} que coincidan con los filtros.</h2><p>Prueba con otros criterios o limpia los filtros para consultar nuevamente.</p><button class="btn btn-secondary" type="button">Limpiar filtros</button></div></section>`;
    },
    modal(title, body, footer, cls='') {
      return `<div class="modal-backdrop" data-modal-backdrop><section class="modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><h2 id="modal-title">${title}</h2><button class="icon-btn" type="button" data-close-modal aria-label="Cerrar">${icon('x')}</button></header><div class="modal-body">${body}</div><footer class="modal-footer">${footer}</footer></section></div>`;
    },
    toast(message) { return `<div class="toast" role="status">${icon('check')}${message}</div>`; },
    tabs(labels, active=0) { return `<div class="tabs" role="tablist">${labels.map((l,i)=>`<button class="tab ${i===active?'active':''}" data-tab="${i}" type="button" role="tab" aria-selected="${i===active}">${l}</button>`).join('')}</div>`; },
    weekCalendar(sessions) {
      const days=['Lunes 10','Martes 11','Miércoles 12','Jueves 13','Viernes 14'];
      const slots=['07:00','10:00','13:00','16:00'];
      let html='<div class="week-calendar"><div class="calendar-head"></div>'+days.map(d=>`<div class="calendar-head">${d}<br><small>ago 2026</small></div>`).join('');
      slots.forEach((slot,si)=>{
        html+=`<div class="calendar-time">${slot}</div>`;
        days.forEach((_,di)=>{
          const ses=sessions.find(s=>s.dayIndex===di&&s.slotIndex===si);
          html+=`<div class="calendar-cell">${ses?`<button class="session-card" data-session-id="${ses.id}" type="button"><strong>${ses.title}</strong><span>${ses.time}</span><span>${ses.environment}</span></button>`:'<span class="calendar-empty"></span>'}</div>`;
        });
      });
      return html+'</div>';
    }
  };
})();
