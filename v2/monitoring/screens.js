(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};

  const trackingRows=[
    {date:'10/07/2026',type:'Académico',attendance:'18/20 · 90%',progress:'65%',follow:'Sí'},
    {date:'10/06/2026',type:'Proyecto',attendance:'19/20 · 95%',progress:'52%',follow:'No'},
    {date:'10/05/2026',type:'Bienestar',attendance:'17/20 · 85%',progress:'41%',follow:'Sí'},
    {date:'10/04/2026',type:'Académico',attendance:'20/20 · 100%',progress:'30%',follow:'No'}
  ];
  M.screens.tracking=(ctx)=>{
    // TODO GAP B3: GET /ficha-trackings exige MON_DASHBOARD_FULL; se usan datos mock del instructor.
    const state=stateView(ctx,'registros de seguimiento'); if(state)return `${C().pageHeader('Seguimiento de ficha','', {label:'+ Registrar seguimiento',href:'/instructor/seguimiento?modal=tracking'})}${state}`;
    const modal=ctx.query.get('modal');
    let html=`${C().pageHeader('Seguimiento de ficha','Registra mediciones periódicas de asistencia y avance curricular.',{label:'+ Registrar seguimiento',href:'/instructor/seguimiento?modal=tracking'})}
      <section class="card filters" style="grid-template-columns:minmax(260px,1fr) repeat(3,minmax(160px,.6fr))"><div class="form-field"><label>Ficha</label><select><option>2874412 — Análisis y Desarrollo de Software</option></select></div><div class="detail-item"><dt>Estado</dt><dd>${C().status('AT_RISK')}</dd></div><div class="detail-item"><dt>Último seguimiento</dt><dd>10 jul 2026</dd></div><div class="detail-item"><dt>Próximo</dt><dd>10 ago 2026</dd></div></section>
      ${C().table([{label:'Fecha',key:'date'},{label:'Tipo',key:'type'},{label:'Asistencia',key:'attendance'},{label:'Avance curricular',render:r=>`<div>${r.progress}</div><progress max="100" value="${parseInt(r.progress)}" style="width:100%"></progress>`},{label:'Requiere seguimiento',render:r=>C().status(r.follow==='Sí'?'AT_RISK':'ON_TRACK',r.follow)}],trackingRows,{caption:'Seguimientos de ficha',total:27,start:1,end:4,pageSize:10})}`;
    if(modal==='tracking') html+=C().modal('Registrar seguimiento',`<div class="form-grid"><div class="form-field full"><label>Tipo de sesión</label><select><option>Académico</option><option>Bienestar</option><option>Proyecto</option><option>Etapa productiva</option></select></div><div class="form-field full"><label>Fecha</label><input type="date" value="2026-08-06"></div><div class="form-field"><label>Asistentes</label><input type="number" value="21"><div class="field-error">${icon('warning')}Los asistentes no pueden superar el total de aprendices.</div></div><div class="form-field"><label>Total de aprendices</label><input type="number" value="20"><div class="field-help">→ 105% de asistencia</div></div><div class="form-field full"><label>Avance curricular (%)</label><input type="number" value="65"></div><div class="form-field full"><label>Observaciones</label><textarea placeholder="Ej. Se avanzó en la unidad 3, dos aprendices en riesgo de deserción"></textarea></div><label class="form-field full" style="display:flex;grid-template-columns:auto 1fr;align-items:center"><input type="checkbox" style="width:20px;min-height:20px">Requiere seguimiento adicional</label></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    return html;
  };

  M.screens.notificationsList=(ctx)=>{
    const state=stateView(ctx,'notificaciones'); if(state)return `${C().pageHeader('Notificaciones')}${state}`;
    return `${C().pageHeader('Notificaciones','Avisos enviados a tu usuario.')}<section class="notifications-list">${D().notifications.map(n=>`<a class="card notification-card" href="#${n.deepLink||('/notificaciones/'+n.id)}" style="text-decoration:none;color:inherit;${n.isRead?'opacity:.62':''}"><span class="conflict-icon" style="background:var(--color-brand-soft);color:var(--color-brand)">${icon('bell')}</span><div><h3>${n.subject}</h3><p title="${n.summary}">${n.summary}</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">${C().notifBadges(n)}</div><time>${n.date}</time></div>${C().status(n.status)}</a>`).join('')}</section>${C().pagination(18,1,5,1,10)}`;
  };
  M.screens.notificationDetail=(ctx)=>{
    const state=stateView(ctx,'notificación'); if(state)return `${C().pageHeader('Detalle de notificación','',null,{label:'Volver a Notificaciones',href:'/notificaciones'})}${state}`;
    const n=D().notifications.find(x=>x.id===ctx.params[0])||D().notifications[0];
    return `${C().pageHeader(n.subject,n.date,null,{label:'Volver a Notificaciones',href:'/notificaciones'})}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">${n.subject}</h2><p class="panel-subtitle">Notificación del sistema de horarios</p></div>${C().status(n.status)}</header><div class="panel-body"><p>${n.summary}</p><p>Este aviso corresponde a información vigente del centro de formación y se presenta únicamente para consulta.</p>${n.scheduleId?`<a class="btn btn-primary" href="#/mi-horario">Ir al horario</a>`:''}</div></section>`;
  };

  const kpiRows=[
    {ficha:'2874412',kpi:'Asistencia',value:'76%',threshold:'80%',status:'AT_RISK',period:'Ago 2026',measured:'05/08/2026'},
    {ficha:'3011550',kpi:'Avance curricular',value:'42%',threshold:'50%',status:'CRITICAL',period:'Ago 2026',measured:'04/08/2026'},
    {ficha:'2987701',kpi:'Asistencia',value:'92%',threshold:'80%',status:'ON_TRACK',period:'Ago 2026',measured:'03/08/2026'},
    {ficha:'3124508',kpi:'Riesgo de deserción',value:'18%',threshold:'20%',status:'ON_TRACK',period:'Ago 2026',measured:'02/08/2026'},
    {ficha:'2763450',kpi:'Etapa productiva',value:'61%',threshold:'70%',status:'AT_RISK',period:'Jul 2026',measured:'31/07/2026'}
  ];
  M.screens.kpiDashboard=(ctx)=>{
    const state=stateView(ctx,'fichas en seguimiento'); if(state)return `${C().pageHeader('Panel de indicadores')}${state}`;
    return `${C().pageHeader('Panel de indicadores','Estado de seguimiento de las fichas del centro.')}${C().filters([{label:'Tipo de KPI',options:['Todos','Asistencia','Avance curricular','Riesgo de deserción','Avance etapa productiva']},{label:'Estado',options:['Todos','En seguimiento','En riesgo','Crítico']},{label:'Desde',type:'date'},{label:'Hasta',type:'date'}],'Actualizar')}
      <section class="kpi-grid">${C().kpi('En seguimiento','31','Alertas activas promedio: 0,4')}${C().kpi('En riesgo','12','Requieren revisión')}${C().kpi('Crítico','4','Acción inmediata','critical')}</section>
      <section class="panel"><header class="panel-header"><div><h2 class="panel-title">Distribución por nivel de riesgo</h2></div></header><div class="panel-body"><div class="chart"><div class="chart-bar" style="height:82%;background:var(--color-success)"><span>Seguimiento</span></div><div class="chart-bar" style="height:42%;background:var(--color-warning)"><span>Riesgo</span></div><div class="chart-bar" style="height:18%;background:var(--color-danger)"><span>Crítico</span></div></div></div></section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Indicadores por ficha</h2><p class="panel-subtitle">Top 5 de 47 registros</p></div></header>${C().table([{label:'Ficha',render:r=>`<a href="#/admin/indicadores/track-01/attendance"><strong>${r.ficha}</strong></a>`},{label:'KPI',key:'kpi'},{label:'Valor actual',key:'value'},{label:'Umbral',key:'threshold'},{label:'Estado',render:r=>C().status(r.status)},{label:'Período',key:'period'},{label:'Medido',key:'measured'}],kpiRows,{caption:'Indicadores por ficha',pagination:false})}<footer class="panel-footer">Mostrando 5 de 47 · <a href="#/admin/indicadores/track-01/attendance">Ver todos</a></footer></section>`;
  };
  M.screens.kpiDrilldown=(ctx)=>{
    const state=stateView(ctx,'mediciones'); if(state)return `${C().pageHeader('Detalle de indicador','',null,{label:'Volver al panel',href:'/admin/indicadores'})}${state}`;
    const measurements=[{period:'Mar 2026',measured:'10/03/2026',value:'88%',threshold:'80%',status:'ON_TRACK'},{period:'Abr 2026',measured:'10/04/2026',value:'84%',threshold:'80%',status:'ON_TRACK'},{period:'May 2026',measured:'10/05/2026',value:'79%',threshold:'80%',status:'AT_RISK'},{period:'Jun 2026',measured:'10/06/2026',value:'78%',threshold:'80%',status:'AT_RISK'},{period:'Jul 2026',measured:'10/07/2026',value:'76%',threshold:'80%',status:'AT_RISK'}];
    return `${C().pageHeader('Ficha 2874412 — Asistencia','Valor actual: 76% · Umbral vigente: 80%',null,{label:'Volver al panel',href:'/admin/indicadores'})}<section class="kpi-grid" style="grid-template-columns:repeat(2,minmax(0,300px))">${C().kpi('Valor actual','76%','Última medición: 05/08/2026')}${C().kpi('Umbral','80%','Configuración vigente')}</section><section class="panel"><header class="panel-header"><div><h2 class="panel-title">Evolución temporal</h2></div><div class="form-field"><label>Rango</label><input type="date" value="2026-03-01"></div></header><div class="panel-body"><div class="chart">${[88,84,79,78,76].map((v,i)=>`<div class="chart-bar" style="height:${v}%;background:${v<80?'var(--color-danger)':'var(--color-brand)'}"><span>${['Mar','Abr','May','Jun','Jul'][i]}</span></div>`).join('')}</div></div></section><section style="margin-top:20px">${C().table([{label:'Período',key:'period'},{label:'Medido',key:'measured'},{label:'Valor',key:'value'},{label:'Umbral',key:'threshold'},{label:'Estado',render:r=>C().status(r.status)}],measurements,{caption:'Mediciones del KPI',total:18,start:1,end:5,pageSize:10,cursor:true})}</section>`;
  };

  M.screens.paramMonitoring=(ctx)=>{
    const state=stateView(ctx,'catálogos de monitoreo'); if(state)return `${C().pageHeader('Parametrización — Monitoreo','',null,{href:'/admin/parametrizacion',label:'Parametrización'})}${state}`;
    // kpi_type: code, name, description, unit, is_active
    const kpiTypes=[
      {code:'ASIST',name:'Asistencia',description:'Porcentaje de asistencia de los aprendices de la ficha.',unit:'%',is_active:'ACTIVE'},
      {code:'AVANCE_CURR',name:'Avance curricular',description:'Progreso de ejecución del programa frente a lo planeado.',unit:'%',is_active:'ACTIVE'},
      {code:'RIESGO_DES',name:'Riesgo de deserción',description:'Índice estimado de aprendices en riesgo de abandono.',unit:'%',is_active:'ACTIVE'},
      {code:'ETAPA_PROD',name:'Avance etapa productiva',description:'Avance de la etapa productiva de la ficha.',unit:'%',is_active:'ACTIVE'},
      {code:'DESERCION',name:'Aprendices desertados',description:'Cantidad acumulada de aprendices retirados.',unit:'aprendices',is_active:'ACTIVE'},
      {code:'DIAS_SIN_SEG',name:'Días sin seguimiento',description:'Días transcurridos desde el último seguimiento registrado.',unit:'días',is_active:'INACTIVE'}
    ];
    // kpi_status: code, description, risk_level (via risk_level_id)
    const kpiStatuses=[
      {code:'ON_TRACK',description:'El indicador cumple el umbral configurado; no requiere acción.',risk:'Bajo'},
      {code:'AT_RISK',description:'El indicador se acerca al umbral; requiere revisión del instructor.',risk:'Medio'},
      {code:'CRITICAL',description:'El indicador incumple el umbral; requiere acción inmediata.',risk:'Alto'}
    ];
    // risk_level: code, label, color_hex, priority_order
    const riskLevels=[
      {code:'LOW',label:'Bajo',color_hex:'#1B9E4B',priority_order:1},
      {code:'MEDIUM',label:'Medio',color_hex:'#E8A33D',priority_order:2},
      {code:'HIGH',label:'Alto',color_hex:'#D64545',priority_order:3}
    ];
    // alert_type: code, name, description, default_threshold, threshold_unit, affects_ficha_status, is_active
    const alertTypes=[
      {code:'BAJA_ASIST',name:'Asistencia por debajo del umbral',description:'Se genera cuando la asistencia de la ficha cae bajo el mínimo.',default_threshold:'80,0000',threshold_unit:'PERCENTAGE',affects:'ACTIVE',is_active:'ACTIVE'},
      {code:'AVANCE_BAJO',name:'Avance curricular insuficiente',description:'Se genera cuando el avance es menor al esperado para el período.',default_threshold:'50,0000',threshold_unit:'PERCENTAGE',affects:'ACTIVE',is_active:'ACTIVE'},
      {code:'RIESGO_DES',name:'Riesgo de deserción alto',description:'Se genera cuando el índice de riesgo supera el máximo tolerado.',default_threshold:'20,0000',threshold_unit:'PERCENTAGE',affects:'ACTIVE',is_active:'ACTIVE'},
      {code:'SIN_SEG',name:'Ficha sin seguimiento',description:'Se genera cuando pasan demasiados días sin registrar seguimiento.',default_threshold:'30,0000',threshold_unit:'DAYS',affects:'INACTIVE',is_active:'ACTIVE'},
      {code:'MULT_RETIROS',name:'Retiros múltiples',description:'Se genera cuando se acumulan varios retiros en un período corto.',default_threshold:'3,0000',threshold_unit:'COUNT',affects:'INACTIVE',is_active:'INACTIVE'}
    ];
    let html=`${C().pageHeader('Parametrización — Catálogos de monitoreo','Tipos de KPI, estados, niveles de riesgo y tipos de alerta que usan indicadores, alertas y seguimiento.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Tipos de KPI','Estados de KPI','Niveles de riesgo','Tipos de alerta'],0)}
      <div class="tabpanel" data-tabpanel="0">
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Tipos de KPI</h2><p class="panel-subtitle">Definen qué mide cada indicador; los usa el panel de indicadores y el seguimiento de ficha.</p></div><button class="btn btn-primary" data-open-modal="edit">${icon('plus')}Nuevo tipo de KPI</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},
        {label:'Nombre',render:r=>`<span style="display:inline-flex;align-items:center;gap:6px">${icon('chart')}${r.name}</span>`},
        {label:'Descripción',key:'description'},
        {label:'Unidad',key:'unit'},
        {label:'Estado',render:r=>C().status(r.is_active)},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="edit">${icon('edit')}</button>`}
      ],kpiTypes,{caption:'Tipos de KPI',total:8,start:1,end:kpiTypes.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="1" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Estados de KPI</h2><p class="panel-subtitle">Clasifican cada medición y se asocian a un nivel de riesgo.</p></div><button class="btn btn-secondary" data-open-modal="status">${icon('plus')}Nuevo estado</button></div>
      ${C().table([
        {label:'Código',render:r=>C().status(r.code)},
        {label:'Descripción',key:'description'},
        {label:'Nivel de riesgo',key:'risk'},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="status">${icon('edit')}</button>`}
      ],kpiStatuses,{caption:'Estados de KPI',total:3,start:1,end:kpiStatuses.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="2" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Niveles de riesgo</h2><p class="panel-subtitle">Prioridad y color con que se resaltan estados y alertas en toda la app.</p></div><button class="btn btn-secondary" data-open-modal="risk">${icon('plus')}Nuevo nivel</button></div>
      ${C().table([
        {label:'Orden',render:r=>`<strong>${r.priority_order}</strong>`},
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},
        {label:'Etiqueta',key:'label'},
        {label:'Color',render:r=>`<span style="display:inline-flex;align-items:center;gap:8px"><span aria-hidden="true" style="width:14px;height:14px;border-radius:4px;border:1px solid var(--color-border);background:${r.color_hex}"></span>${r.color_hex}</span>`},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="risk">${icon('edit')}</button>`}
      ],riskLevels,{caption:'Niveles de riesgo',total:3,start:1,end:riskLevels.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="3" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Tipos de alerta</h2><p class="panel-subtitle">Reglas que disparan alertas; su umbral por defecto puede afectar el estado de la ficha.</p></div><button class="btn btn-secondary" data-open-modal="alert">${icon('plus')}Nuevo tipo de alerta</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},
        {label:'Nombre',render:r=>`<span style="display:inline-flex;align-items:center;gap:6px">${icon('warning')}${r.name}</span>`},
        {label:'Descripción',key:'description'},
        {label:'Umbral',key:'default_threshold'},
        {label:'Unidad',key:'threshold_unit'},
        {label:'Afecta estado de ficha',render:r=>C().status(r.affects,r.affects==='ACTIVE'?'Sí':'No')},
        {label:'Estado',render:r=>C().status(r.is_active)},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="alert">${icon('edit')}</button>`}
      ],alertTypes,{caption:'Tipos de alerta',total:12,start:1,end:alertTypes.length,pageSize:10})}
      </div>
      </section>`;
    const modal=ctx.query.get('modal');
    if(modal==='edit') html+=C().modal('Nuevo / editar tipo de KPI',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="ASIST" placeholder="Ej. ASIST"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Asistencia" placeholder="Nombre del KPI"></label>
        <label class="field"><span>Unidad</span><input type="text" value="%" placeholder="Ej. %, días, aprendices"></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
        <label class="field full"><span>Descripción</span><textarea placeholder="Qué mide este indicador">Porcentaje de asistencia de los aprendices de la ficha.</textarea></label>
      </div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    if(modal==='status') html+=C().modal('Nuevo / editar estado de KPI',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="AT_RISK" placeholder="Ej. AT_RISK"></label>
        <label class="field"><span>Nivel de riesgo</span><select><option>Medio</option><option>Bajo</option><option>Alto</option></select></label>
        <label class="field full"><span>Descripción</span><textarea placeholder="Cuándo aplica este estado">El indicador se acerca al umbral; requiere revisión del instructor.</textarea></label>
      </div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    if(modal==='risk') html+=C().modal('Nuevo / editar nivel de riesgo',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="MEDIUM" placeholder="Ej. MEDIUM"></label>
        <label class="field"><span>Etiqueta</span><input type="text" value="Medio" placeholder="Ej. Medio"></label>
        <label class="field"><span>Color (hex)</span><input type="color" value="#E8A33D"></label>
        <label class="field"><span>Orden de prioridad</span><input type="number" value="2" placeholder="Ej. 2"></label>
      </div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    if(modal==='alert') html+=C().modal('Nuevo / editar tipo de alerta',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="BAJA_ASIST" placeholder="Ej. BAJA_ASIST"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Asistencia por debajo del umbral" placeholder="Nombre de la alerta"></label>
        <label class="field"><span>Umbral por defecto</span><input type="number" step="0.0001" value="80" placeholder="Ej. 80"></label>
        <label class="field"><span>Unidad del umbral</span><select><option>PERCENTAGE</option><option>COUNT</option><option>DAYS</option><option>HOURS</option></select></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
        <label class="field" style="display:flex;align-items:center;gap:8px"><input type="checkbox" style="width:20px;min-height:20px" checked><span>Afecta el estado de la ficha</span></label>
        <label class="field full"><span>Descripción</span><textarea placeholder="Cuándo se dispara la alerta">Se genera cuando la asistencia de la ficha cae bajo el mínimo.</textarea></label>
      </div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
    return html;
  };
})();
