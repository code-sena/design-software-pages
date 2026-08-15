(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  const sites=[{name:'Sede Centro',type:'Sede principal',active:true},{name:'Sede Prado Alto',type:'Unidad académica',active:true},{name:'Sede Rivera',type:'Ambiente externo',active:false}];
  const catalogs=[{code:'TRAINING_MODALITY',name:'Modalidad de formación'},{code:'TRAINING_SHIFT',name:'Jornada de formación'},{code:'ENVIRONMENT_TYPE',name:'Tipo de ambiente'}];
  const catalogValues=[{code:'PRESENTIAL',label:'Presencial',order:1,active:true},{code:'VIRTUAL',label:'Virtual',order:2,active:true},{code:'HYBRID',label:'Híbrida',order:3,active:true}];
  const params=[{key:'MAX_HOURS_PER_WEEK',value:'48',type:'integer',description:'Máximo de horas semanales por instructor.'},{key:'SCHEDULE_LOCK_MINUTES',value:'15',type:'integer',description:'Tiempo de bloqueo optimista para edición.'},{key:'NOTIFICATION_RETRY_COUNT',value:'3',type:'integer',description:'Cantidad máxima de reintentos de envío.'}];

  M.screens.adminReference=(ctx)=>{
    const state=stateView(ctx,'datos de referencia'); if(state)return `${C().pageHeader('Administración — Datos de referencia')}${state}`;
    let html=`${C().pageHeader('Administración — Datos de referencia','Consulta y mantenimiento de la información institucional del centro.')}
      <section class="panel">${C().tabs(['Mi centro','Catálogos','Parámetros'],0)}<div class="panel-body"><h2>Mi centro</h2><div class="form-grid"><div class="form-field"><label>Código del centro</label><input value="9226" readonly title="Campo de solo lectura"></div><div class="form-field"><label>Nombre</label><input value="Centro de la Industria, la Empresa y los Servicios"></div><div class="form-field"><label>Dirección</label><input value="Carrera 5 No. 16-20, Neiva"></div><div class="form-field"><label>Teléfono</label><input value="(608) 875 7224"></div></div><div class="form-actions"><button class="btn btn-primary">Guardar</button></div></div>
      <header class="panel-header"><div><h2 class="panel-title">Sedes y unidades institucionales</h2></div><button class="btn btn-primary" ${ctx.role==='director'?'':'disabled'}>${icon('plus')}Nueva sede</button></header>${C().table([{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Tipo',key:'type'},{label:'Estado',render:r=>C().status(r.active?'ACTIVE':'INACTIVE')},{label:'Acción',render:r=>ctx.role==='director'?'<button class="btn btn-secondary btn-sm">Editar</button>':'—'}],sites,{caption:'Sedes',total:23,start:1,end:3,pageSize:10})}</section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Catálogos</h2><p class="panel-subtitle">Vista de consulta para Director de Centro.</p></div></header><div class="panel-body"><div class="alert alert-warning">${icon('lock')}Solo ADMIN_STAFF/SYSTEM_ADMIN pueden editar catálogos.</div></div>${C().table([{label:'Código',key:'code'},{label:'Nombre',key:'name'}],catalogs,{caption:'Catálogos',total:18,start:1,end:3,pageSize:10})}</section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Parámetros</h2></div></header><div class="panel-body"><div class="alert alert-warning">${icon('lock')}Solo SYSTEM_ADMIN puede configurar parámetros del sistema.</div></div>${C().table([{label:'Clave',key:'key'},{label:'Valor',key:'value'},{label:'Tipo',key:'type'},{label:'Descripción',key:'description'}],params,{caption:'Parámetros',total:14,start:1,end:3,pageSize:10})}</section>`;
    if(ctx.query.get('modal')==='reference') html+=referenceModal(true);
    return html;
  };

  M.screens.parametersList=(ctx)=>{
    const state=stateView(ctx,'catálogos'); if(state)return `${C().pageHeader('Parametrización / catálogos')}${state}`;
    let html=`${C().pageHeader('Parametrización / catálogos','Administración de catálogos, valores y parámetros del sistema.')}
      <section class="panel">${C().tabs(['Catálogos','Parámetros del sistema'],0)}<div class="panel-body"><div style="display:grid;grid-template-columns:minmax(240px,.7fr) minmax(0,1.5fr);gap:20px"><aside><div class="form-field"><label>Buscar catálogo</label><input placeholder="Código o nombre"></div><button class="btn btn-primary" style="width:100%;margin:16px 0" data-open-modal="crud">${icon('plus')}Nuevo catálogo</button><div class="notifications-list">${catalogs.map((c,i)=>`<button class="card dropdown-item" style="display:block;text-align:left;border-color:${i===0?'#abefc6':'var(--color-border)'}"><strong>${c.code}</strong><br><small>${c.name}</small></button>`).join('')}</div>${C().pagination(18,1,3,1,10)}</aside><section><div class="panel-header" style="padding:0 0 16px"><div><h2 class="panel-title">Modalidad de formación</h2><p class="panel-subtitle">TRAINING_MODALITY</p></div><button class="btn btn-primary" data-open-modal="crud">Agregar valor</button></div>${C().table([{label:'Código',key:'code'},{label:'Etiqueta',key:'label'},{label:'Orden',key:'order'},{label:'Activo',render:r=>C().status(r.active?'ACTIVE':'INACTIVE')},{label:'Acción',render:()=>'<button class="btn btn-secondary btn-sm">Editar</button>'}],catalogValues,{caption:'Valores del catálogo',total:3,start:1,end:3,pageSize:10})}</section></div></div></section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Parámetros del sistema</h2></div><button class="btn btn-primary" data-open-modal="crud">Nuevo parámetro</button></header>${C().table([{label:'Clave',key:'key'},{label:'Valor',key:'value'},{label:'Tipo',key:'type'},{label:'Descripción',key:'description'},{label:'Acción',render:()=>'<button class="btn btn-secondary btn-sm">Editar</button>'}],params,{caption:'Parámetros',total:14,start:1,end:3,pageSize:10})}</section>`;
    if(ctx.query.get('modal')==='crud') html+=referenceModal(false);
    return html;
  };

  function referenceModal(readOnlyRole){
    return C().modal(readOnlyRole?'Editar parámetro — MAX_HOURS_PER_WEEK':'Nuevo valor de catálogo',`<div class="form-grid">${readOnlyRole?`<div class="alert alert-warning full">${icon('lock')}Esta composición está documentada para ADMIN_STAFF/SYSTEM_ADMIN. El Director mantiene esta vista en solo lectura.</div>`:''}<div class="form-field full"><label>${readOnlyRole?'Clave':'Catálogo padre'}</label><input value="${readOnlyRole?'MAX_HOURS_PER_WEEK':'TRAINING_MODALITY — Modalidad'}" readonly></div><div class="form-field"><label>${readOnlyRole?'Valor':'Código'}</label><input value="${readOnlyRole?'48':'PRESENTIAL'}"></div><div class="form-field"><label>${readOnlyRole?'Tipo':'Etiqueta'}</label>${readOnlyRole?'<select><option>integer</option><option>string</option><option>boolean</option><option>json</option></select>':'<input value="Presencial">'}</div><div class="form-field full"><label>${readOnlyRole?'Descripción':'Orden'}</label>${readOnlyRole?'<textarea>Máximo de horas semanales por instructor.</textarea>':'<input type="number" value="1">'}</div><div class="field-error full">${icon('warning')}Este código ya existe en este catálogo.</div></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary" ${readOnlyRole?'disabled':''}>${readOnlyRole?'Actualizar valor':'Guardar'}</button>`);
  }

  M.screens.paramHub=(ctx)=>{
    const areas=[
      ['Currículo académico','/admin/parametrizacion/curriculo','student','Líneas, redes, programas, competencias y resultados de aprendizaje. Requisito de las fichas.'],
      ['Jornadas / franjas','/admin/parametrizacion/jornadas','clock','Franjas horarias que las sesiones ocupan al construir un horario.'],
      ['Tipos de ambiente e inventario','/admin/parametrizacion/ambientes','building','Tipos de ambiente, tipos de inventario y reglas de disponibilidad.'],
      ['Catálogos de monitoreo','/admin/parametrizacion/monitoreo','chart','Tipos y estados de KPI, niveles de riesgo y tipos de alerta.'],
      ['Estados de actores','/admin/parametrizacion/estados','activity','Categorías, estados y transiciones de instructores, aprendices, empresas y etapas.'],
      ['Geografía institucional','/admin/parametrizacion/geografia','folder','Macroregión → microregión → departamento → municipio → centro → unidad.'],
      ['RBAC — roles y permisos','/admin/parametrizacion/rbac','key','Roles, módulos, permisos (features) y su asignación.'],
      ['Catálogos y parámetros','/backoffice/parametrizacion','settings','Catálogos genéricos, valores y parámetros del sistema.'],
      ['Datos de referencia (mi centro)','/admin/datos-referencia','file','Información institucional del centro, sedes y unidades.']
    ];
    return `${C().pageHeader('Parametrización','Configure los catálogos y datos maestros que los flujos operativos requieren como prerrequisito.')}
      <div class="alert alert-info">${icon('info')}Complete la parametrización antes de operar: crear fichas requiere <strong>currículo</strong>; construir horarios requiere <strong>jornadas</strong>; registrar ambientes requiere sus <strong>tipos</strong>; el seguimiento requiere <strong>catálogos de KPI</strong>.</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:20px">${areas.map(([t,h,ic,d])=>`<a class="card" href="#${h}" style="display:block;padding:20px;text-decoration:none"><div style="display:flex;align-items:center;gap:10px;color:var(--color-brand);margin-bottom:8px">${icon(ic)}<strong style="color:var(--color-text)">${t}</strong></div><p style="margin:0;color:var(--color-text-muted);font-size:14px;line-height:1.5">${d}</p></a>`).join('')}</div>`;
  };

  M.screens.paramGeography=(ctx)=>{
    const state=stateView(ctx,'geografía institucional'); if(state)return `${C().pageHeader('Parametrización — Geografía institucional')}${state}`;
    const st=r=>C().status(r.active?'ACTIVE':'INACTIVE'), act=k=>`<button class="btn btn-ghost btn-icon" data-open-modal="${k}" aria-label="Editar">${icon('edit')}</button>`;
    const macros=[{name:'Suroccidente',code:'SUR',active:true},{name:'Centro Oriente',code:'CEN',active:true}];
    const micros=[{name:'Alto Magdalena',code:'AM',macro:'Suroccidente',active:true},{name:'Norte del Huila',code:'NH',macro:'Suroccidente',active:true}];
    const deptos=[{name:'Huila',dane:'41',active:true},{name:'Tolima',dane:'73',active:true},{name:'Caquetá',dane:'18',active:false}];
    const munis=[{name:'Neiva',dane:'41001',depto:'Huila',active:true},{name:'Garzón',dane:'41298',depto:'Huila',active:true},{name:'Pitalito',dane:'41551',depto:'Huila',active:true}];
    const centers=[{code:'9226',name:'Centro de la Industria, la Empresa y los Servicios',municipality:'Neiva',address:'Carrera 5 No. 16-20',phone:'(608) 875 7224',active:true},{code:'9301',name:'Centro Agroempresarial y Desarrollo Pecuario del Huila',municipality:'Garzón',address:'Km 1 vía Garzón-Gigante',phone:'(608) 833 2020',active:true},{code:'9302',name:'Centro de Formación Agroindustrial La Angostura',municipality:'Campoalegre',address:'Km 38 vía Neiva-Campoalegre',phone:'(608) 838 1010',active:false}];
    const units=[{name:'Sede Centro',type:'Sede principal',center:'9226',active:true},{name:'Sede Prado Alto',type:'Unidad académica',center:'9226',active:true},{name:'Ambiente Rivera',type:'Ambiente externo',center:'9226',active:false}];
    const panel=(idx,key,title,sub,btn,cols,rows,total)=>`<div class="tabpanel" data-tabpanel="${idx}"${idx===4?'':' hidden'}><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">${title}</h2>${sub?`<p class="panel-subtitle">${sub}</p>`:''}</div><button class="btn btn-primary" data-open-modal="${key}">${icon('plus')}${btn}</button></div>${C().table([...cols,{label:'',render:()=>act(key)}],rows,{caption:title,total,start:1,end:rows.length,pageSize:10})}</div>`;
    let html=`${C().pageHeader('Parametrización — Geografía institucional','Jerarquía territorial y organizacional donde se ubican los centros y ambientes.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Macroregiones','Microregiones','Departamentos','Municipios','Centros de formación','Unidades'],4)}
      ${panel(0,'geo-macro','Macroregiones','',' Nueva macroregión',[{label:'Código',key:'code'},{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Estado',render:st}],macros,2)}
      ${panel(1,'geo-micro','Microregiones','',' Nueva microregión',[{label:'Código',key:'code'},{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Macroregión',key:'macro'},{label:'Estado',render:st}],micros,5)}
      ${panel(2,'geo-depto','Departamentos','',' Nuevo departamento',[{label:'DANE',key:'dane'},{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Estado',render:st}],deptos,33)}
      ${panel(3,'geo-muni','Municipios','',' Nuevo municipio',[{label:'DANE',key:'dane'},{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Departamento',key:'depto'},{label:'Estado',render:st}],munis,120)}
      ${panel(4,'geo-center','Centros de formación','Cada centro se ubica en un municipio y agrupa sedes/unidades y ambientes.',' Nuevo centro',[{label:'Código',key:'code'},{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Municipio',key:'municipality'},{label:'Dirección',key:'address'},{label:'Teléfono',key:'phone'},{label:'Estado',render:st}],centers,33)}
      ${panel(5,'geo-unit','Unidades institucionales','',' Nueva unidad',[{label:'Nombre',render:r=>`<strong>${r.name}</strong>`},{label:'Tipo',key:'type'},{label:'Centro',key:'center'},{label:'Estado',render:st}],units,7)}
      </section>`;
    const F=(t,b)=>C().modal(t,`<div class="form-grid">${b}</div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    const fld=(l,v,full)=>`<label class="field${full?' full':''}"><span>${l}</span><input value="${v}"></label>`, sel=(l,o)=>`<label class="field"><span>${l}</span><select>${o.map(x=>`<option>${x}</option>`).join('')}</select></label>`;
    const m=ctx.query.get('modal');
    if(m==='geo-macro') html+=F('Nueva / editar macroregión',fld('Código','SUR')+fld('Nombre','Suroccidente')+sel('Estado',['Activo','Inactivo']));
    if(m==='geo-micro') html+=F('Nueva / editar microregión',fld('Código','AM')+fld('Nombre','Alto Magdalena')+sel('Macroregión (padre)',['Suroccidente','Centro Oriente'])+sel('Estado',['Activo','Inactivo']));
    if(m==='geo-depto') html+=F('Nuevo / editar departamento',fld('Código DANE','41')+fld('Nombre','Huila')+sel('Microregión (padre)',['Alto Magdalena','Norte del Huila'])+sel('Estado',['Activo','Inactivo']));
    if(m==='geo-muni') html+=F('Nuevo / editar municipio',fld('Código DANE','41001')+fld('Nombre','Neiva')+sel('Departamento (padre)',['Huila','Tolima','Caquetá'])+sel('Estado',['Activo','Inactivo']));
    if(m==='geo-center') html+=F('Nuevo / editar centro de formación',fld('Código','9226')+fld('Nombre','Centro de la Industria, la Empresa y los Servicios')+sel('Municipio (padre)',['Neiva','Garzón','Pitalito'])+fld('Teléfono','(608) 875 7224')+fld('Dirección','Carrera 5 No. 16-20, Neiva',true)+sel('Estado',['Activo','Inactivo']));
    if(m==='geo-unit') html+=F('Nueva / editar unidad institucional',fld('Nombre','Sede Centro')+sel('Tipo de unidad',['Sede principal','Unidad académica','Ambiente externo'])+sel('Centro de formación (padre)',['9226 · Centro de la Industria, la Empresa y los Servicios'])+sel('Estado',['Activo','Inactivo']));
    return html;
  };
})();
