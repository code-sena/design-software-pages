(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  // G3 · workflow de excepción: status (PENDING/APPROVED/REJECTED/CANCELLED) + soporte documental + revisor.
  const exceptions=[
    {type:'Incapacidad médica',range:'12–14 de agosto de 2026 · 08:00–17:00',description:'Incapacidad certificada por EPS.',icon:'activity',status:'APPROVED',support:'incapacidad-eps-4471.pdf',reviewedBy:'María García',reviewedAt:'11/08/2026',decision:'Aprobada; se reprogramaron 2 sesiones afectadas.'},
    {type:'Capacitación',range:'21 de agosto de 2026 · 07:00–13:00',description:'Actualización pedagógica institucional.',icon:'student',status:'PENDING',support:'convocatoria-capacitacion.pdf',reviewedBy:null,reviewedAt:null,decision:null},
    {type:'Comisión',range:'25–26 de agosto de 2026 · 08:00–16:00',description:'Visita técnica a sede alterna.',icon:'building',status:'REJECTED',support:null,reviewedBy:'María García',reviewedAt:'10/08/2026',decision:'Rechazada; falta adjuntar el soporte de la comisión.'}
  ];
  const exStatus=s=>({APPROVED:['status-success','Aprobada','check'],PENDING:['status-warning','Pendiente de revisión','clock'],REJECTED:['status-danger','Rechazada','warning'],CANCELLED:['status-neutral','Anulada','x']}[s]||['status-neutral',s,'info']);
  const exBadge=s=>{const [cls,label,ico]=exStatus(s);return `<span class="status-badge ${cls}">${icon(ico)}${label}</span>`;};
  M.screens.instructorAvailability=(ctx)=>{
    const state=stateView(ctx,'excepciones registradas'); if(state)return `${C().pageHeader('Mi disponibilidad','', {label:'+ Nueva excepción',href:'/instructor/mi-disponibilidad?modal=exception'})}${state}`;
    const modal=ctx.query.get('modal');
    let html=`${C().pageHeader('Mi disponibilidad','Registra bloqueos puntuales para que el motor de horarios los tenga en cuenta.',{label:'+ Nueva excepción',href:'/instructor/mi-disponibilidad?modal=exception'})}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">Excepciones vigentes y futuras</h2><p class="panel-subtitle">Ordenadas cronológicamente.</p></div></header><div>${exceptions.map(x=>`<article class="notification-card" style="border-bottom:1px solid var(--color-border)"><span class="conflict-icon" style="background:var(--color-warning-surface);color:var(--color-warning)">${icon(x.icon)}</span><div><h3>${x.type}</h3><p><strong>${x.range}</strong></p><p>${x.description}</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${exBadge(x.status)}${x.support?`<span class="status-badge status-neutral">${icon('file')}${x.support}</span>`:`<span class="status-badge status-danger">${icon('warning')}Sin soporte</span>`}</div>${x.reviewedBy?`<small style="display:block;margin-top:6px;color:var(--color-text-muted)">Revisado por ${x.reviewedBy} · ${x.reviewedAt}${x.decision?` — ${x.decision}`:''}</small>`:`<small style="display:block;margin-top:6px;color:var(--color-text-muted)">En espera de revisión de coordinación</small>`}</div><button class="btn btn-danger-subtle btn-sm" ${x.status==='APPROVED'?'disabled title="Una excepción aprobada requiere solicitud de anulación a coordinación"':''}>${icon('trash')}${x.status==='PENDING'?'Anular solicitud':'Eliminar'}</button></article>`).join('')}</div>${C().pagination(34,1,3,1,10)}</section>`;
    if(modal==='exception') html+=C().modal('Nueva excepción de disponibilidad',`<div class="form-grid"><div class="form-field full"><label>Tipo de excepción</label><select><option>Incapacidad médica</option><option>Vacaciones</option><option>Comisión</option><option>Permiso personal</option><option>Capacitación</option><option>Otro</option></select></div><div class="form-field"><label>Inicio</label><input type="datetime-local" value="2026-08-12T08:00"></div><div class="form-field"><label>Fin</label><input type="datetime-local" value="2026-08-11T17:00"><div class="field-error">${icon('warning')}La fecha de fin debe ser posterior al inicio.</div></div><div class="form-field full"><label>Descripción (opcional)</label><textarea placeholder="Ej. Cita médica especialista"></textarea></div><div class="form-field full"><label>Documento de soporte</label><input type="file"><div class="field-hint">${icon('info')}Obligatorio para incapacidad, comisión y capacitación. Queda adjunto para revisión de coordinación.</div></div></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('upload')}Enviar a revisión</button>`);
    return html;
  };
  M.screens.paramActorStatus=(ctx)=>{
    const state=stateView(ctx,'estados de actores'); if(state)return `${C().pageHeader('Parametrización — Estados de actores')}${state}`;
    const entityLabel={INSTRUCTOR:'Instructor',LEARNER:'Aprendiz',COMPANY:'Empresa',PRODUCTIVE_STAGE:'Etapa productiva'};
    const categories=[
      {code:'INSTRUCTOR_STATUS',name:'Estado de instructor',description:'Ciclo de vida del instructor frente a la programación académica.',applies_to_entity:'INSTRUCTOR',is_active:true},
      {code:'LEARNER_STATUS',name:'Estado de aprendiz',description:'Ciclo de vida del aprendiz dentro de la ficha de formación.',applies_to_entity:'LEARNER',is_active:true},
      {code:'COMPANY_STATUS',name:'Estado de empresa',description:'Estado de la empresa patrocinadora para etapa productiva.',applies_to_entity:'COMPANY',is_active:true},
      {code:'PRODUCTIVE_STAGE_STATUS',name:'Estado de etapa productiva',description:'Avance del aprendiz durante la etapa productiva.',applies_to_entity:'PRODUCTIVE_STAGE',is_active:true}
    ];
    const statuses=[
      {category:'Estado de instructor',code:'INSTR_ACTIVE',name:'Activo',is_initial:true,is_terminal:false,display_order:1,color_hex:'#16A34A',is_active:true},
      {category:'Estado de instructor',code:'INSTR_ON_LEAVE',name:'En comisión',is_initial:false,is_terminal:false,display_order:2,color_hex:'#F59E0B',is_active:true},
      {category:'Estado de instructor',code:'INSTR_INACTIVE',name:'Inactivo',is_initial:false,is_terminal:true,display_order:3,color_hex:'#6B7280',is_active:true},
      {category:'Estado de aprendiz',code:'LRN_IN_TRAINING',name:'En formación',is_initial:true,is_terminal:false,display_order:1,color_hex:'#2563EB',is_active:true},
      {category:'Estado de aprendiz',code:'LRN_PRODUCTIVE',name:'En etapa productiva',is_initial:false,is_terminal:false,display_order:2,color_hex:'#F59E0B',is_active:true},
      {category:'Estado de aprendiz',code:'LRN_CERTIFIED',name:'Certificado',is_initial:false,is_terminal:true,display_order:3,color_hex:'#16A34A',is_active:true},
      {category:'Estado de aprendiz',code:'LRN_WITHDRAWN',name:'Retirado',is_initial:false,is_terminal:true,display_order:4,color_hex:'#DC2626',is_active:true},
      {category:'Estado de empresa',code:'CMP_APPROVED',name:'Aprobada',is_initial:true,is_terminal:false,display_order:1,color_hex:'#16A34A',is_active:true},
      {category:'Estado de empresa',code:'CMP_SUSPENDED',name:'Suspendida',is_initial:false,is_terminal:false,display_order:2,color_hex:'#F59E0B',is_active:true},
      {category:'Estado de etapa productiva',code:'PS_STARTED',name:'Iniciada',is_initial:true,is_terminal:false,display_order:1,color_hex:'#2563EB',is_active:true},
      {category:'Estado de etapa productiva',code:'PS_FOLLOW_UP',name:'En seguimiento',is_initial:false,is_terminal:false,display_order:2,color_hex:'#F59E0B',is_active:true},
      {category:'Estado de etapa productiva',code:'PS_FINISHED',name:'Finalizada',is_initial:false,is_terminal:true,display_order:3,color_hex:'#16A34A',is_active:true}
    ];
    const transitions=[
      {category:'Estado de aprendiz',from_status:'En formación',to_status:'En etapa productiva',required_feature_code:'PRODUCTIVE_STAGE_ASSIGN',is_active:true},
      {category:'Estado de aprendiz',from_status:'En etapa productiva',to_status:'Certificado',required_feature_code:'LEARNER_CERTIFY',is_active:true},
      {category:'Estado de aprendiz',from_status:'En formación',to_status:'Retirado',required_feature_code:'LEARNER_WITHDRAW',is_active:true},
      {category:'Estado de instructor',from_status:'Activo',to_status:'En comisión',required_feature_code:null,is_active:true},
      {category:'Estado de instructor',from_status:'En comisión',to_status:'Activo',required_feature_code:null,is_active:true},
      {category:'Estado de instructor',from_status:'Activo',to_status:'Inactivo',required_feature_code:'INSTRUCTOR_DEACTIVATE',is_active:true},
      {category:'Estado de empresa',from_status:'Aprobada',to_status:'Suspendida',required_feature_code:'COMPANY_SUSPEND',is_active:true},
      {category:'Estado de etapa productiva',from_status:'Iniciada',to_status:'En seguimiento',required_feature_code:null,is_active:true},
      {category:'Estado de etapa productiva',from_status:'En seguimiento',to_status:'Finalizada',required_feature_code:'PRODUCTIVE_STAGE_CLOSE',is_active:true}
    ];
    const boolBadge=(v,yes,no)=>v?`<span class="status-badge status-info">${icon('check')}${yes}</span>`:`<span class="status-badge status-neutral">${no}</span>`;
    const swatch=(hex,name)=>`<span style="display:inline-flex;align-items:center;gap:8px"><span aria-hidden="true" style="width:12px;height:12px;border-radius:3px;display:inline-block;background:${hex}"></span>${name}</span>`;
    const catCols=[
      {label:'Categoría',render:r=>`<strong>${r.name}</strong>`},
      {label:'Código',render:r=>`<code>${r.code}</code>`},
      {label:'Aplica a',render:r=>entityLabel[r.applies_to_entity]||r.applies_to_entity},
      {label:'Descripción',render:r=>r.description},
      {label:'Estado',render:r=>C().status(r.is_active?'ACTIVE':'INACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit-category">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar categoría">${icon('trash')}</button></div>`}
    ];
    const statusCols=[
      {label:'Categoría',render:r=>r.category},
      {label:'Estado',render:r=>swatch(r.color_hex,`<strong>${r.name}</strong>`)},
      {label:'Código',render:r=>`<code>${r.code}</code>`},
      {label:'Orden',render:r=>r.display_order},
      {label:'Inicial',render:r=>boolBadge(r.is_initial,'Inicial','—')},
      {label:'Terminal',render:r=>boolBadge(r.is_terminal,'Terminal','—')},
      {label:'Estado',render:r=>C().status(r.is_active?'ACTIVE':'INACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar estado">${icon('trash')}</button></div>`}
    ];
    const transitionCols=[
      {label:'Categoría',render:r=>r.category},
      {label:'Desde',render:r=>`<span class="status-badge status-neutral">${r.from_status}</span>`},
      {label:'',render:r=>`<span aria-hidden="true">${icon('chevronRight')}</span>`},
      {label:'Hacia',render:r=>`<span class="status-badge status-info">${r.to_status}</span>`},
      {label:'Permiso requerido',render:r=>r.required_feature_code?`${icon('lock')}<code>${r.required_feature_code}</code>`:'<span class="status-badge status-neutral">Libre</span>'},
      {label:'Estado',render:r=>C().status(r.is_active?'ACTIVE':'INACTIVE')},
      {label:'Acción',render:r=>`<div class="table-actions"><button class="btn btn-secondary btn-sm" data-open-modal="edit-transition">${icon('edit')}Editar</button><button class="icon-btn" aria-label="Eliminar transición">${icon('trash')}</button></div>`}
    ];
    let html=`${C().pageHeader('Parametrización — Estados de actores','Máquina de estados (categorías, estados y transiciones permitidas) para instructores, aprendices, empresas y etapas productivas.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Categorías','Estados','Transiciones'],1)}
        <div class="tabpanel" data-tabpanel="0" hidden><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Categorías de estado</h2><p class="panel-subtitle">Cada categoría agrupa los estados de una entidad (instructor, aprendiz, empresa o etapa productiva).</p></div><button class="btn btn-primary" data-open-modal="edit-category">${icon('plus')}Nueva categoría</button></div>${C().table(catCols,categories,{caption:'Categorías de estado',total:categories.length,start:1,end:categories.length,pageSize:10})}</div>
        <div class="tabpanel" data-tabpanel="1"><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Estados</h2><p class="panel-subtitle">Cada estado pertenece a una categoría y define si es inicial, terminal, su orden y color.</p></div><button class="btn btn-primary" data-open-modal="edit">${icon('plus')}Nuevo estado</button></div>${C().table(statusCols,statuses,{caption:'Estados',total:18,start:1,end:statuses.length,pageSize:10})}</div>
        <div class="tabpanel" data-tabpanel="2" hidden><div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Transiciones permitidas</h2><p class="panel-subtitle">Define qué cambios de estado son válidos y qué permiso los habilita.</p></div><button class="btn btn-primary" data-open-modal="edit-transition">${icon('plus')}Nueva transición</button></div>${C().table(transitionCols,transitions,{caption:'Transiciones permitidas',total:transitions.length,start:1,end:transitions.length,pageSize:10})}</div></section>`;
    if(ctx.query.get('modal')==='edit') html+=C().modal('Nuevo / editar estado',
      `<div class="form-grid"><div class="form-field"><label>Categoría</label><select>${categories.map(c=>`<option>${c.name}</option>`).join('')}</select></div><div class="form-field"><label>Nombre</label><input value="En formación"></div><div class="form-field"><label>Código</label><input value="LRN_IN_TRAINING"></div><div class="form-field"><label>Orden de visualización</label><input type="number" value="1" min="1"></div><div class="form-field"><label>Color</label><input type="color" value="#2563EB"></div><div class="form-field"><label>Marcadores</label><div class="checkbox-row"><label><input type="checkbox" checked> Estado inicial</label><label><input type="checkbox"> Estado terminal</label></div></div><div class="form-field full"><label>Descripción</label><textarea placeholder="Ej. Aprendiz cursando la etapa lectiva del programa"></textarea></div><div class="form-field full"><label><input type="checkbox" checked> Activo</label></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    if(ctx.query.get('modal')==='edit-category') html+=C().modal('Nueva / editar categoría',
      `<div class="form-grid"><div class="form-field"><label>Nombre</label><input value="Estado de aprendiz"></div><div class="form-field"><label>Código</label><input value="LEARNER_STATUS"></div><div class="form-field"><label>Aplica a la entidad</label><select><option value="INSTRUCTOR">Instructor</option><option value="LEARNER" selected>Aprendiz</option><option value="COMPANY">Empresa</option><option value="PRODUCTIVE_STAGE">Etapa productiva</option></select></div><div class="form-field"><label>Estado</label><label style="font-weight:400"><input type="checkbox" checked> Activo</label></div><div class="form-field full"><label>Descripción</label><textarea placeholder="Ej. Ciclo de vida del aprendiz dentro de la ficha de formación"></textarea></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    if(ctx.query.get('modal')==='edit-transition') html+=C().modal('Nueva / editar transición',
      `<div class="form-grid"><div class="form-field full"><label>Categoría</label><select>${categories.map(c=>`<option>${c.name}</option>`).join('')}</select></div><div class="form-field"><label>Estado origen</label><select><option>En formación</option><option>En etapa productiva</option><option>Certificado</option><option>Retirado</option></select></div><div class="form-field"><label>Estado destino</label><select><option>En etapa productiva</option><option>Certificado</option><option>Retirado</option><option>En formación</option></select></div><div class="form-field full"><label>Permiso requerido (opcional)</label><input value="PRODUCTIVE_STAGE_ASSIGN" placeholder="Código de feature que habilita la transición"><div class="field-hint">${icon('warning')}El origen y el destino deben pertenecer a la misma categoría.</div></div><div class="form-field full"><label><input type="checkbox" checked> Activa</label></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">${icon('check')}Guardar</button>`);
    return html;
  };
})();
