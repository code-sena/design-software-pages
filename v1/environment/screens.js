(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  M.screens.availability=(ctx)=>{
    const state=stateView(ctx,'ambientes o instructores'); if(state)return `${C().pageHeader('Disponibilidad','Consulta por fecha y franja horaria.')}${state}`;
    const env=D().environments;
    return `${C().pageHeader('Disponibilidad','Consulta ambientes e instructores disponibles para una sesión.')}
      <section class="card filters" style="grid-template-columns:repeat(3,minmax(0,1fr)) auto"><div class="form-field"><label>Fecha</label><input type="date" value="2026-08-10"></div><div class="form-field"><label>Hora inicio</label><input type="time" value="07:00"></div><div class="form-field"><label>Hora fin</label><input type="time" value="10:00"></div><button class="btn btn-primary">Consultar</button></section>
      <section class="panel">${C().tabs(['Ambientes','Instructores'],0)}<div class="panel-body"><div class="availability-grid">${env.map(x=>`<article class="card availability-card"><div style="display:flex;justify-content:space-between;gap:12px"><span class="conflict-icon" style="background:var(--color-brand-soft);color:var(--color-brand)">${icon('building')}</span>${C().status(x.available?'AVAILABLE':'UNAVAILABLE')}</div><div><h3 style="margin:0 0 4px">${x.name}</h3><p style="margin:0;color:var(--color-text-muted)">${x.type} · ${x.capacity} personas</p><p>${x.location}</p></div><a href="#/disponibilidad/ambientes/${x.id}" class="btn btn-secondary">Ver detalle</a></article>`).join('')}</div></div>${C().pagination(34,1,6,1,10)}</section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Instructores</h2><p class="panel-subtitle">Disponibilidad compuesta a partir de instructores y excepciones registradas.</p></div><button class="btn btn-secondary">Ver reporte de carga</button></header>${C().table([
        {label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Documento',key:'document'},{label:'Área',key:'area'},{label:'Horas máx./semana',key:'maxHours'},{label:'Disponibilidad',render:r=>C().status(r.available?'AVAILABLE':'EXCEPTION')}
      ],D().instructors,{caption:'Disponibilidad de instructores',total:41,start:1,end:5,pageSize:10})}</section>
      <!-- TODO GAP G2: no existe GET /instructors/available; esta vista usa datos mock compuestos de GET /instructors + availability-exceptions. -->`;
  };
  M.screens.environmentDetail=(ctx)=>{
    const state=stateView(ctx,'disponibilidad del ambiente'); if(state)return `${C().pageHeader('Detalle de ambiente','',null,{label:'Volver a Disponibilidad',href:'/disponibilidad'})}${state}`;
    const env=D().environments.find(x=>x.id===ctx.params[0])||D().environments[0];
    const cells=['Libre','Ocupada','Libre','Mantenimiento','Libre','Ocupada','Libre','Libre','Ocupada','Libre','Libre','Ocupada','Mantenimiento','Libre','Libre'];
    return `${C().pageHeader(env.name,`${env.type} · ${env.capacity} personas · ${env.location}`,null,{label:'Volver a Disponibilidad',href:'/disponibilidad'})}
      <div class="page-actions" style="margin-bottom:20px"><div class="form-field"><label>Rango de fechas</label><input type="date" value="2026-08-10"></div>${C().status('ACTIVE')}</div>
      <section class="kpi-grid" style="grid-template-columns:minmax(260px,420px)">${C().kpi('Ocupación en el rango','68%','17 de 25 franjas')}</section>
      <section class="panel"><header class="panel-header"><div><h2 class="panel-title">Ocupación por franja</h2><p class="panel-subtitle">Lunes a viernes, semana seleccionada.</p></div></header><div class="panel-body data-table-wrap"><div class="occupancy-grid"><div></div>${['Lunes','Martes','Miércoles','Jueves','Viernes'].map(d=>`<div><strong>${d}</strong></div>`).join('')}${['07:00–10:00','10:00–13:00','13:00–16:00'].map((slot,ri)=>`<div><strong>${slot}</strong></div>${cells.slice(ri*5,ri*5+5).map(v=>`<div>${C().status(v==='Libre'?'AVAILABLE':v==='Ocupada'?'CONFLICT':'ARCHIVED',v)}</div>`).join('')}`).join('')}</div></div><footer class="panel-footer"><a href="#/disponibilidad/ambientes/${env.id}?report=utilization">Ver reporte de utilización (horas)</a></footer></section>`;
  };
  M.screens.paramEnvironmentTypes=(ctx)=>{
    const state=stateView(ctx,'tipos de ambiente'); if(state)return `${C().pageHeader('Parametrización — Ambientes')}${state}`;
    const dayLabel={1:'Lunes',2:'Martes',3:'Miércoles',4:'Jueves',5:'Viernes',6:'Sábado',7:'Domingo'};
    // training_environment.environment_type (id, name, description, created_at)
    const envTypes=[
      {name:'Aula de clase',description:'Ambiente teórico estándar con tablero y sillas universitarias.',created_at:'2026-01-15'},
      {name:'Laboratorio de cómputo',description:'Ambiente con equipos de escritorio y red cableada para prácticas.',created_at:'2026-01-15'},
      {name:'Taller de mecánica',description:'Ambiente dotado con bancos de trabajo y herramienta especializada.',created_at:'2026-01-18'},
      {name:'Auditorio',description:'Ambiente amplio para inducciones, socializaciones y eventos.',created_at:'2026-01-20'},
      {name:'Laboratorio de idiomas',description:'Ambiente con cabinas y audio para bilingüismo.',created_at:'2026-02-02'},
      {name:'Ambiente polivalente',description:'Espacio flexible reconfigurable para varias fichas.',created_at:'2026-02-10'},
      {name:'Sala de dibujo técnico',description:'Ambiente con restiradores y mesas de dibujo.',created_at:'2026-02-14'},
      {name:'Biblioteca',description:'Ambiente de consulta y estudio autónomo.',created_at:'2026-02-21'},
      {name:'Gimnasio / polideportivo',description:'Ambiente para cultura física y bienestar.',created_at:'2026-03-01'}
    ];
    const envCols=[
      {label:'Nombre',render:r=>`<span class="cell-lead">${icon('building')}<strong>${r.name}</strong></span>`},
      {label:'Descripción',render:r=>`<span class="cell-muted">${r.description}</span>`},
      {label:'Creado',render:r=>r.created_at},
      {label:'Estado',render:r=>C().status('ACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit-type">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar tipo de ambiente">${icon('trash')}</button></div>`}
    ];
    // training_environment.item_type (id, name, category, created_at)
    const itemTypes=[
      {name:'Computador de escritorio',category:'Cómputo',created_at:'2026-01-15'},
      {name:'Portátil',category:'Cómputo',created_at:'2026-01-15'},
      {name:'Videobeam',category:'Audiovisual',created_at:'2026-01-16'},
      {name:'Tablero digital',category:'Audiovisual',created_at:'2026-01-16'},
      {name:'Silla ergonómica',category:'Mobiliario',created_at:'2026-01-18'},
      {name:'Mesa de trabajo',category:'Mobiliario',created_at:'2026-01-18'},
      {name:'Router / switch',category:'Redes',created_at:'2026-01-22'},
      {name:'Multímetro',category:'Herramienta',created_at:'2026-01-25'},
      {name:'Impresora 3D',category:'Cómputo',created_at:'2026-02-05'}
    ];
    const itemCols=[
      {label:'Nombre',render:r=>`<span class="cell-lead">${icon('folder')}<strong>${r.name}</strong></span>`},
      {label:'Categoría',render:r=>`<span class="chip">${r.category}</span>`},
      {label:'Creado',render:r=>r.created_at},
      {label:'Estado',render:r=>C().status('ACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit-item">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar tipo de inventario">${icon('trash')}</button></div>`}
    ];
    // training_environment.availability_rule (id, environment_id, day_of_week, start_time, end_time, created_at)
    const rules=[
      {environment:'Laboratorio de cómputo 201',day_of_week:1,start_time:'07:00',end_time:'13:00'},
      {environment:'Laboratorio de cómputo 201',day_of_week:3,start_time:'13:00',end_time:'18:00'},
      {environment:'Aula 105',day_of_week:2,start_time:'07:00',end_time:'12:00'},
      {environment:'Aula 105',day_of_week:4,start_time:'13:00',end_time:'17:00'},
      {environment:'Taller de mecánica A',day_of_week:1,start_time:'08:00',end_time:'16:00'},
      {environment:'Taller de mecánica A',day_of_week:5,start_time:'08:00',end_time:'12:00'},
      {environment:'Auditorio principal',day_of_week:6,start_time:'07:00',end_time:'12:00'},
      {environment:'Laboratorio de idiomas',day_of_week:2,start_time:'16:00',end_time:'20:00'},
      {environment:'Ambiente polivalente 3',day_of_week:4,start_time:'18:00',end_time:'22:00'}
    ];
    const ruleCols=[
      {label:'Ambiente',render:r=>`<span class="cell-lead">${icon('building')}<strong>${r.environment}</strong></span>`},
      {label:'Día',render:r=>dayLabel[r.day_of_week]},
      {label:'Inicio',render:r=>`${icon('clock')}${r.start_time}`},
      {label:'Fin',render:r=>r.end_time},
      {label:'Estado',render:r=>C().status('AVAILABLE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit-rule">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar regla de disponibilidad">${icon('trash')}</button></div>`}
    ];
    let html=`${C().pageHeader('Parametrización — Tipos de ambiente e inventario','Catálogos que los ambientes y su disponibilidad requieren. Configúrelos antes de registrar ambientes o construir horarios.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Tipos de ambiente','Tipos de inventario','Reglas de disponibilidad'],0)}
        <div class="tabpanel" data-tabpanel="0"><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Tipos de ambiente</h2><p class="panel-subtitle">Categorías de ambiente de formación (aula, laboratorio, taller…).</p></div><button class="btn btn-primary" data-open-modal="edit-type">${icon('plus')}Nuevo tipo</button></div>
        ${C().table(envCols,envTypes,{caption:'Tipos de ambiente',total:9,start:1,end:envTypes.length,pageSize:10})}</div>
        <div class="tabpanel" data-tabpanel="1" hidden><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Tipos de inventario</h2><p class="panel-subtitle">Categorías de objeto del dominio inventario que dotan cada ambiente.</p></div><button class="btn btn-primary" data-open-modal="edit-item">${icon('plus')}Nuevo tipo de inventario</button></div>
        ${C().table(itemCols,itemTypes,{caption:'Tipos de inventario',total:9,start:1,end:itemTypes.length,pageSize:10})}</div>
        <div class="tabpanel" data-tabpanel="2" hidden><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Reglas de disponibilidad</h2><p class="panel-subtitle">Franjas recurrentes semanales en que cada ambiente queda disponible.</p></div><button class="btn btn-primary" data-open-modal="edit-rule">${icon('plus')}Nueva regla</button></div>
        ${C().table(ruleCols,rules,{caption:'Reglas de disponibilidad',total:9,start:1,end:rules.length,pageSize:10})}</div></section>`;
    if(ctx.query.get('modal')==='edit-type') html+=C().modal('Nuevo / editar tipo de ambiente',
      `<div class="form-grid"><div class="form-field"><label>Nombre</label><input value="Laboratorio de cómputo" maxlength="100"></div><div class="form-field full"><label>Descripción</label><textarea rows="3" maxlength="255">Ambiente con equipos de escritorio y red cableada para prácticas.</textarea></div><div class="form-field full"><div class="field-hint">${icon('warning')}El nombre debe ser único en el catálogo (máx. 100 caracteres).</div></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    if(ctx.query.get('modal')==='edit-item') html+=C().modal('Nuevo / editar tipo de inventario',
      `<div class="form-grid"><div class="form-field"><label>Nombre</label><input value="Videobeam" maxlength="100"></div><div class="form-field"><label>Categoría</label><select><option>Cómputo</option><option selected>Audiovisual</option><option>Mobiliario</option><option>Redes</option><option>Herramienta</option></select></div><div class="form-field full"><div class="field-hint">${icon('warning')}El nombre debe ser único (máx. 100 caracteres); la categoría es opcional (máx. 50).</div></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    if(ctx.query.get('modal')==='edit-rule') html+=C().modal('Nueva / editar regla de disponibilidad',
      `<div class="form-grid"><div class="form-field full"><label>Ambiente</label><select><option>Laboratorio de cómputo 201</option><option>Aula 105</option><option>Taller de mecánica A</option><option>Auditorio principal</option><option>Laboratorio de idiomas</option></select></div><div class="form-field"><label>Día de la semana</label><select><option value="1">Lunes</option><option value="2">Martes</option><option value="3">Miércoles</option><option value="4">Jueves</option><option value="5">Viernes</option><option value="6">Sábado</option><option value="7">Domingo</option></select></div><div class="form-field"><label>Hora inicio</label><input type="time" value="07:00"></div><div class="form-field"><label>Hora fin</label><input type="time" value="13:00"></div><div class="form-field full"><div class="field-hint">${icon('clock')}La hora de fin debe ser mayor que la de inicio; el día debe estar entre lunes y domingo.</div></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    return html;
  };
})();
