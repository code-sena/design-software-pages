(() => {
  const M = window.Mockup = window.Mockup || {};
  const C = () => M.Components;
  const D = () => M.data;
  const icon = (...a) => M.icon(...a);
  const actionCell = (label, href='#') => `<a class="btn btn-secondary btn-sm" href="${href}">${label}</a>`;
  const stateView = (ctx, entity='registros') => ctx.state && ctx.state !== 'normal' ? C().state(ctx.state, entity) : null;

  function scheduleColumns(readonly=false) {
    const cols=[
      {label:'Día',key:'day'},{label:'Franja horaria',key:'slot'},{label:'Fecha',key:'date'},
      {label:'Competencia',key:'competency'},{label:'Instructor',key:'instructor'},{label:'Ambiente',key:'environment'},
      {label:'Estado',render:r=>C().status(r.status)}
    ];
    if(!readonly) cols.push({label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="session">Editar</button><button class="icon-btn" aria-label="Cancelar sesión">${icon('x')}</button><button class="icon-btn" aria-label="Eliminar sesión">${icon('trash')}</button></div>`});
    return cols;
  }

  M.screens = M.screens || {};
  M.screens.coordinatorDashboard = (ctx) => {
    const state = stateView(ctx,'datos del centro'); if(state) return state;
    const conflicts=D().conflicts.filter(x=>!x.resolved).slice(0,3);
    const drafts=D().schedules.filter(x=>x.status==='DRAFT').slice(0,3);
    return `${C().pageHeader('Inicio','', {label:'+ Nuevo horario',href:'/horarios/nuevo',icon:'plus'})}
      <div class="dashboard-layout">
        <section class="panel conflict-panel"><header class="panel-header"><div><h2 class="panel-title">${icon('warning')} Conflictos pendientes (4)</h2><p class="panel-subtitle">Requieren atención antes de publicar los horarios afectados.</p></div></header>
        <div>${conflicts.map(x=>`<article class="conflict-row"><span class="conflict-icon">${icon(x.type==='ENVIRONMENT_DOUBLE_BOOKED'?'building':x.type==='SESSIONS_OVERLAP'?'calendar':'users')}</span><div><h3>${x.title}</h3><p>${x.schedule}</p></div><time>${x.date}</time><a class="btn btn-link btn-sm" href="#/horarios/sch-02/conflictos">Ver panel ${icon('chevronRight')}</a></article>`).join('')}</div><footer class="panel-footer">Mostrando 3 de 4 · <a href="#/horarios/sch-02/conflictos">Ver todos</a></footer></section>
        <section class="kpi-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${C().kpi('Fichas activas','12','<a href="#/fichas">Ver todos</a>')}${C().kpi('Horarios en borrador','3','<a href="#/horarios">Ver todos</a>')}</section>
        <section class="panel"><header class="panel-header"><div><h2 class="panel-title">Horarios recientes en borrador</h2></div></header>
          ${C().table([
            {label:'Ficha',render:r=>`<strong>${r.ficha}</strong>`},{label:'Período',key:'period'},{label:'Nombre',key:'name'},{label:'Última edición',key:'updated'},
            {label:'Acción',render:r=>actionCell('Continuar edición',`#/horarios/${r.id}`)}
          ],drafts,{caption:'Horarios recientes',pagination:false})}
          <footer class="panel-footer">Mostrando 3 de 3 · <a href="#/horarios">Ver todos</a></footer>
        </section>
      </div>`;
  };

  M.screens.schedulesList = (ctx) => {
    const state=stateView(ctx,'horarios'); if(state) return `${C().pageHeader('Horarios','',ctx.readonly?null:{label:'+ Nuevo horario',href:'/horarios/nuevo'})}${state}`;
    const rows=D().schedules.slice(0,10);
    const cols=[
      {label:'Ficha',render:r=>`<strong>${r.ficha}</strong>`},{label:'Período',key:'period'},{label:'Nombre',key:'name'},
      {label:'Estado',render:r=>C().status(r.status)},{label:'Última edición',key:'updated'},
      {label:'Acción',render:r=>actionCell(r.status==='DRAFT'?'Continuar edición':'Ver detalle',`#/horarios/${r.id}`)}
    ];
    return `${C().pageHeader('Horarios','',ctx.readonly?null:{label:'+ Nuevo horario',href:'/horarios/nuevo'})}
      ${C().filters([{label:'Ficha',type:'search',placeholder:'Buscar ficha'},{label:'Instructor',options:['Todos','Juan Pérez','Carolina Rojas']},{label:'Ambiente',options:['Todos','Laboratorio A-204','Aula B-105']},{label:'Estado',options:['Todos','Borrador','En revisión','Publicado']},{label:'Rango de fechas',type:'date'}])}
      ${C().table(cols,rows,{caption:'Horarios del centro',total:24,start:1,end:10,pageSize:10})}`;
  };

  M.screens.scheduleResource = (ctx) => {
    const id=ctx.params[0]||'sch-01';
    const schedule=D().schedules.find(x=>x.id===id)||D().schedules[0];
    if(ctx.query.get('published')==='1') return M.screens.scheduleDetail({...ctx,schedule:{...schedule,status:'PUBLISHED'}});
    const editable=!ctx.readonly && schedule.status!=='PUBLISHED' && schedule.status!=='ARCHIVED';
    return editable ? M.screens.scheduleEditor({...ctx,schedule}) : M.screens.scheduleDetail({...ctx,schedule});
  };

  M.screens.scheduleDetail = (ctx) => {
    const state=stateView(ctx,'sesiones'); if(state) return `${C().pageHeader('Detalle de horario','',null,{label:'Volver a Horarios',href:'/horarios'})}${state}`;
    const s=ctx.schedule||D().schedules[2];
    return `${C().pageHeader(`Ficha ${s.ficha} — Período ${s.period}`,'Publicado el 15 ene 2026 por María García',null,{label:'Volver a Horarios',href:'/horarios'})}
      <section class="panel"><header class="panel-header"><div><h2 class="panel-title">${s.name}</h2><p class="panel-subtitle">Horario definitivo de solo lectura</p></div>${C().status('PUBLISHED')}</header>
      <div class="panel-body"><div class="page-actions" style="justify-content:flex-end"><a class="btn btn-secondary" href="#/horarios/${s.id}/conflictos">Ver conflictos (histórico)</a></div></div>
      ${C().table(scheduleColumns(true),D().sessions,{caption:'Sesiones del horario',total:32,start:1,end:5,pageSize:10})}</section>`;
  };

  M.screens.scheduleEditor = (ctx) => {
    const state=stateView(ctx,'sesiones'); if(state) return `${C().pageHeader('Crear / editar horario','',null,{label:'Volver a Horarios',href:'/horarios'})}${state}`;
    const s=ctx.schedule||D().schedules[0];
    const underReview=s.status==='UNDER_REVIEW' || ctx.query.get('review')==='1';
    const resolved=ctx.query.get('resolved')==='1';
    const hasConflicts=underReview && !resolved;
    const modal=ctx.query.get('modal');
    let html=`${C().pageHeader(ctx.path==='/horarios/nuevo'?'Nuevo horario':`Ficha ${s.ficha} — Período ${s.period}`,'',null,{label:'Volver a Horarios',href:'/horarios'})}
      ${hasConflicts?`<div class="alert alert-critical" style="margin-bottom:20px">${icon('warning')}<div><strong>Este horario tiene 2 conflictos sin resolver.</strong><br><a href="#/horarios/${s.id}/conflictos">Ir al Panel de conflictos</a></div></div>`:resolved?`<div class="alert alert-success" style="margin-bottom:20px">${icon('check')}<strong>Sin conflictos pendientes — listo para publicar.</strong></div>`:''}
      <section class="panel"><header class="panel-header"><div><h2 class="panel-title">Datos del horario</h2><p class="panel-subtitle">Completa la ficha, el período y el nombre.</p></div>${C().status(underReview?'UNDER_REVIEW':'DRAFT')}</header>
      <div class="panel-body"><div class="schedule-editor-header"><div class="form-field"><label>Ficha</label><select><option>2874412 — ADSO</option><option>3011550 — Contabilidad</option></select></div><div class="form-field"><label>Período</label><input value="2026-2"></div><div class="form-field"><label>Nombre</label><input value="ADSO — Trimestre III"></div></div></div></section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Sesiones</h2><p class="panel-subtitle">Día, franja, competencia, instructor y ambiente.</p></div>${!underReview?`<button class="btn btn-primary" data-open-modal="session">${icon('plus')}Agregar sesión</button>`:''}</header>
      ${C().table(scheduleColumns(underReview),D().sessions,{caption:'Sesiones',total:5,start:1,end:5,pageSize:10})}</section>
      <div class="sticky-actions"><button class="btn btn-secondary">Guardar</button><button class="btn btn-secondary" data-navigate="/horarios/sch-02?review=1">Validar</button><button class="btn btn-primary" data-open-modal="publish" ${hasConflicts?'disabled title="Resuelve los conflictos pendientes"':''}>${hasConflicts?icon('lock'):''}Publicar</button></div>`;
    if(modal==='session') html+=sessionModal();
    if(modal==='publish') html+=publishModal();
    return html;
  };

  function sessionModal() {
    return C().modal('Agregar sesión',`<div class="form-grid"><div class="form-field full"><label>Competencia</label><select><option>Desarrollar software según requerimientos</option></select></div><div class="form-field"><label>Instructor</label><select><option>Juan Pérez</option><option>Carolina Rojas</option></select><div class="field-error">${icon('warning')}Este instructor ya tiene una sesión en este horario.</div></div><div class="form-field"><label>Ambiente</label><select><option>Laboratorio A-204</option><option>Aula B-105</option></select></div><div class="form-field"><label>Franja horaria</label><select><option>07:00–10:00</option><option>10:00–13:00</option></select></div><div class="form-field"><label>Fecha</label><input type="date" value="2026-08-10"></div><div class="form-field full"><label>Notas</label><textarea placeholder="Observaciones opcionales"></textarea></div></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Agregar sesión</button>`);
  }
  function publishModal() {
    return C().modal('Publicar horario',`<div class="alert alert-success" style="margin-bottom:20px">${icon('check')}<div><strong>Sin conflictos pendientes — listo para publicar.</strong></div></div>${C().details([['Ficha','2874412'],['Período','2026-2'],['Nombre','ADSO — Trimestre III'],['Sesiones','5']])}<p style="color:var(--color-text-muted)">Al publicar, el horario será visible para instructores y aprendices y ya no admitirá cambios.</p>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary" data-navigate="/horarios/sch-02?published=1">Confirmar publicación</button>`);
  }

  M.screens.conflictsPanel = (ctx) => {
    const state=stateView(ctx,'conflictos'); if(state) return `${C().pageHeader('Panel de conflictos','',null,{label:'Volver al horario',href:'/horarios/sch-02'})}${state}`;
    const modal=ctx.query.get('modal');
    let html=`${C().pageHeader('Panel de conflictos','Resuelve los conflictos antes de publicar.',null,{label:'Volver al horario',href:'/horarios/sch-02'})}
      <section class="panel">${C().tabs(['Este horario','Todo mi centro'],0)}<div class="panel-body">${C().filters([{label:'Tipo',options:['Todos','Instructor doble-asignado','Ambiente doble-asignado','Sesiones solapadas']},{label:'Estado',options:['Pendiente','Resuelto']},{label:'Detectado desde',type:'date'}])}
      <div class="conflict-cards">${D().conflicts.map(x=>`<article class="conflict-card ${x.resolved?'resolved':''}"><span class="conflict-icon">${icon(x.type==='ENVIRONMENT_DOUBLE_BOOKED'?'building':x.type==='SESSIONS_OVERLAP'?'calendar':'users')}</span><div><h3 style="margin:0 0 5px;color:${x.resolved?'var(--color-text)':'var(--color-danger)'}">${x.title}</h3><p>${x.description}</p><small>${x.schedule} · Detectado el ${x.date}</small><div style="margin-top:10px">${C().status(x.resolved?'RESOLVED':'CONFLICT')}</div></div>${x.resolved?'':`<button class="btn btn-danger-subtle" data-open-modal="resolve">Marcar como resuelto</button>`}</article>`).join('')}</div></div>${C().pagination(4,1,4,1,10)}</section>`;
    if(modal==='resolve') html+=C().modal('Resolver conflicto',`<div style="text-align:center;margin-bottom:20px"><span class="state-icon" style="margin-inline:auto;background:var(--color-danger-surface);color:var(--color-danger)">${icon('users')}</span></div><p><strong>El instructor Juan Pérez tiene dos sesiones que se solapan el 10/08/2026 de 07:00 a 10:00.</strong></p>${C().details([['Sesión 1','Ficha 2874412 · Laboratorio A-204'],['Sesión 2','Ficha 3011550 · Aula B-105'],['Detectado','06/08/2026']])}<div class="alert alert-success" style="margin-top:20px">${icon('check')}Al resolverlo, este horario podrá publicarse.</div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary" data-navigate="/horarios/sch-02?modal=publish&resolved=1">Confirmar resolución</button>`);
    return html;
  };

  M.screens.instructorSchedule = (ctx) => {
    const state=stateView(ctx,'sesiones publicadas'); if(state) return `${C().pageHeader('Mi horario','Semana del 10 al 14 de agosto de 2026')}${state}`;
    const calendarSessions=[{id:'ses-01',dayIndex:0,slotIndex:0,title:'ADSO · Ficha 2874412',time:'07:00–10:00',environment:'Lab. A-204'},{id:'ses-02',dayIndex:1,slotIndex:1,title:'Bases de datos',time:'10:00–13:00',environment:'Aula B-105'},{id:'ses-03',dayIndex:2,slotIndex:2,title:'Servicios web',time:'13:00–16:00',environment:'Lab. A-204'},{id:'ses-04',dayIndex:3,slotIndex:0,title:'Calidad de software',time:'07:00–10:00',environment:'Aula C-208'}];
    let html=`${C().pageHeader('Mi horario','Semana del 10 al 14 de agosto de 2026')}<div class="page-actions" style="justify-content:space-between;margin-bottom:20px"><button class="btn btn-secondary">‹ Semana anterior</button><button class="btn btn-secondary">Semana siguiente ›</button></div><div class="data-table-wrap">${C().weekCalendar(calendarSessions)}</div>`;
    if(ctx.query.get('panel')==='session') html+=sessionDrawer('instructor');
    return html;
  };

  function sessionDrawer(mode='instructor') {
    return `<div class="modal-backdrop" data-modal-backdrop><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><header class="drawer-header"><h2 id="drawer-title">Detalle de sesión</h2><button class="icon-btn" data-close-modal>${icon('x')}</button></header><div class="drawer-body"><div class="alert alert-info" style="margin-bottom:20px">${icon('calendar')}Lunes 10 de agosto · 07:00–10:00</div>${C().details([['Ficha','2874412'],['Programa','Análisis y Desarrollo de Software'],['Competencia','Desarrollar software según requerimientos'],['Ambiente','Laboratorio A-204'],['Instructor','Juan Pérez'],['Estado','Activa']])}<h3>Notas</h3><p>Traer equipo portátil y acceso al repositorio del proyecto.</p>${mode==='learner'?'<a class="btn btn-secondary" href="#/mi-horario">Volver a Mi horario</a>':''}</div></aside></div>`;
  }

  M.screens.learnerSchedule = (ctx) => {
    // TODO GAP B2: SCH_VIEW_OWN no está cableado en scheduling.yaml; datos mock acotados a la ficha.
    const state=stateView(ctx,'clases publicadas'); if(state) return `${C().pageHeader('Mi horario','Ficha 2874412 · Semana del 10 al 14 de agosto')}${state}`;
    const days=[['Lunes 10','07:00–10:00','Desarrollo de software','Laboratorio A-204','Juan Pérez','ses-01'],['Martes 11','10:00–13:00','Modelado de bases de datos','Aula B-105','Carolina Rojas','ses-02'],['Miércoles 12','13:00–16:00','Servicios web','Laboratorio A-204','Juan Pérez','ses-03']];
    return `${C().pageHeader('Mi horario','Ficha 2874412 · Semana del 10 al 14 de agosto de 2026')}<div class="notifications-list">${days.map(d=>`<article class="card notification-card"><span class="conflict-icon" style="background:var(--color-brand-soft);color:var(--color-brand)">${icon('calendar')}</span><div><h3>${d[0]} · ${d[1]}</h3><p><strong>${d[2]}</strong></p><p>${d[3]} · ${d[4]}</p></div><a class="btn btn-secondary btn-sm" href="#/mi-horario/sesiones/${d[5]}">Ver detalle</a></article>`).join('')}</div>`;
  };

  M.screens.learnerClassDetail = (ctx) => {
    const state=stateView(ctx,'detalle de la clase'); if(state) return `${C().pageHeader('Detalle de clase','',null,{label:'Volver a Mi horario',href:'/mi-horario'})}${state}`;
    return `${C().pageHeader('Detalle de clase','Lunes 10 de agosto de 2026 · 07:00–10:00',null,{label:'Volver a Mi horario',href:'/mi-horario'})}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">Desarrollo de software</h2><p class="panel-subtitle">Ficha 2874412 — ADSO</p></div>${C().status('ACTIVE')}</header><div class="panel-body">${C().details([['Competencia','Desarrollar software según requerimientos'],['Instructor','Juan Pérez'],['Ambiente','Laboratorio A-204'],['Ubicación','Bloque A, piso 2'],['Fecha','10/08/2026'],['Franja','07:00–10:00']])}<h3>Notas de la sesión</h3><p>Traer equipo portátil y acceso al repositorio del proyecto.</p></div></section>`;
  };

  M.screens.paramTimeSlots = (ctx) => {
    const state=stateView(ctx,'franjas horarias'); if(state) return `${C().pageHeader('Parametrización — Jornadas')}${state}`;
    const shiftLabel={DAY:'Diurna',NIGTH:'Nocturna',MIXED:'Mixta'};
    const dayLabel={1:'Lunes',2:'Martes',3:'Miércoles',4:'Jueves',5:'Viernes',6:'Sábado',7:'Domingo'};
    const slots=[
      {name:'Mañana 1',day_of_week:1,start:'07:00',end:'10:00',shift:'DAY'},
      {name:'Mañana 2',day_of_week:1,start:'10:00',end:'13:00',shift:'DAY'},
      {name:'Tarde 1',day_of_week:1,start:'13:00',end:'16:00',shift:'DAY'},
      {name:'Tarde 2',day_of_week:2,start:'16:00',end:'18:00',shift:'DAY'},
      {name:'Noche 1',day_of_week:2,start:'18:00',end:'20:00',shift:'NIGTH'},
      {name:'Noche 2',day_of_week:3,start:'20:00',end:'22:00',shift:'NIGTH'},
      {name:'Mañana sabatina',day_of_week:6,start:'07:00',end:'12:00',shift:'MIXED'},
      {name:'Tarde sabatina',day_of_week:6,start:'12:00',end:'17:00',shift:'MIXED'},
      {name:'Mañana 3',day_of_week:4,start:'07:00',end:'10:00',shift:'DAY'},
      {name:'Tarde 3',day_of_week:5,start:'13:00',end:'16:00',shift:'DAY'}
    ];
    const cols=[
      {label:'Nombre',render:r=>`<strong>${r.name}</strong>`},
      {label:'Día',render:r=>dayLabel[r.day_of_week]},
      {label:'Inicio',render:r=>`${icon('clock')}${r.start}`},
      {label:'Fin',render:r=>r.end},
      {label:'Jornada',render:r=>shiftLabel[r.shift]},
      {label:'Estado',render:r=>C().status('ACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar franja">${icon('trash')}</button></div>`}
    ];
    let html=`${C().pageHeader('Parametrización — Jornadas / franjas horarias','Franjas que las sesiones de clase ocupan al construir un horario. Configúrelas por jornada (mañana/tarde/noche) antes de crear horarios.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel"><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Franjas horarias</h2><p class="panel-subtitle">Cada franja define día, hora de inicio, hora de fin y jornada.</p></div><button class="btn btn-primary" data-open-modal="edit">${icon('plus')}Nueva franja</button></div>${C().table(cols,slots,{caption:'Franjas horarias',total:12,start:1,end:slots.length,pageSize:10})}</section>`;
    if(ctx.query.get('modal')==='edit') html+=C().modal('Nueva / editar franja',
      `<div class="form-grid"><div class="form-field"><label>Nombre</label><input value="Mañana 1"></div><div class="form-field"><label>Día de la semana</label><select><option>Lunes</option><option>Martes</option><option>Miércoles</option><option>Jueves</option><option>Viernes</option><option>Sábado</option><option>Domingo</option></select></div><div class="form-field"><label>Jornada</label><select><option value="DAY">Diurna</option><option value="NIGTH">Nocturna</option><option value="MIXED">Mixta</option></select></div><div class="form-field"><label>Hora inicio</label><input type="time" value="07:00"></div><div class="form-field"><label>Hora fin</label><input type="time" value="10:00"></div><div class="form-field full"><div class="field-hint">${icon('warning')}La hora de inicio debe ser menor que la hora de fin.</div></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    return html;
  };
})();
