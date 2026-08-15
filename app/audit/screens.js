(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  M.screens.auditList=(ctx)=>{
    // TODO BLOCKER B1: audit-service no expone API REST; datos mock basados en audit_record.
    const state=stateView(ctx,'eventos'); if(state)return `${C().pageHeader('Auditoría')}${state}`;
    let html=`${C().pageHeader('Auditoría','Registro de solo lectura de las acciones del sistema.')}${C().filters([{label:'Actor (UUID)',type:'text',placeholder:'UUID'},{label:'Tipo de entidad',type:'text',placeholder:'schedule'},{label:'Tipo de evento',type:'text',placeholder:'SCHEDULE_PUBLISHED'},{label:'Correlación',type:'text',placeholder:'correlation_id'},{label:'Servicio origen',options:['Todos','scheduling-service','iam-service','document-service']},{label:'Desde',type:'date'}],'Exportar')}${C().table([{label:'Recibido',key:'date'},{label:'Ocurrido en origen',key:'date'},{label:'Evento',key:'event'},{label:'Servicio origen',render:r=>C().status('INFO',r.service)},{label:'Actor',key:'actor'},{label:'Entidad',render:r=>`${r.entity} · ${r.entityId}`},{label:'Acción',render:()=>'<button class="btn btn-secondary btn-sm" data-open-modal="audit">Ver payload</button>'}],D().audit,{caption:'Eventos de auditoría',total:1200,start:1,end:4,pageSize:10,cursor:true})}<p class="panel-subtitle" style="margin:12px 0">Registro append-only · retención mínima 7 años · particionado mensual · datos de más de 2 años se archivan en frío.</p>`;
    if(ctx.query.get('modal')==='audit') html+=auditModal();
    return html;
  };
  function auditModal(){ const a=D().audit[0];return C().modal('Detalle de registro de auditoría',`<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><strong>${a.event}</strong><div style="margin-top:8px">${C().status('INFO',a.service)}</div></div><div>${C().details([['Recibido',a.date],['Ocurrido en origen',a.date]])}</div></div><h3>Identificación</h3>${C().details([['ID de evento',`${a.id} ${icon('copy')}`],['Correlación','corr-9f2a7c'],['Actor',a.actor],['Entidad',`${a.entity} · ${a.entityId}`]])}<h3>Payload</h3><pre class="code-view">{
  "event_id": "evt-01",
  "correlation_id": "corr-9f2a7c",
  "event_type": "SCHEDULE_PUBLISHED",
  "entity_type": "schedule",
  "entity_id": "sch-03",
  "actor": "María García",
  "changes": {
    "status": ["UNDER_REVIEW", "PUBLISHED"]
  }
}</pre><button class="btn btn-secondary" style="margin-top:12px">${icon('copy')}Copiar JSON</button>`,`<button class="btn btn-primary" data-close-modal>Cerrar</button>`,'modal-lg'); }
})();
