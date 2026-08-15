(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  M.screens.fichasList=(ctx)=>{
    const state=stateView(ctx,'fichas'); if(state)return `${C().pageHeader('Fichas')}${state}`;
    return `${C().pageHeader('Fichas')}${C().filters([{label:'Programa',type:'search',placeholder:'Buscar programa'},{label:'Estado',options:['Todos','Inducción','Ejecución','Etapa productiva','Finalizada','Cancelada']},{label:'Inicio desde',type:'date'}])}${C().table([
      {label:'Ficha',render:r=>`<a href="#/fichas/${r.id}"><strong>${r.number}</strong></a>`},{label:'Programa',key:'program'},{label:'Estado',render:r=>C().status(r.status)},{label:'Jornada',key:'shift'},{label:'Modalidad',key:'modality'},{label:'Cupo máximo',key:'capacity'},{label:'Fecha de inicio',key:'start'}
    ],D().fichas,{caption:'Fichas del centro',total:56,start:1,end:5,pageSize:10})}`;
  };
  M.screens.fichaDetail=(ctx)=>{
    const state=stateView(ctx,'detalle de la ficha'); if(state)return `${C().pageHeader('Detalle de ficha','',null,{label:'Volver a Fichas',href:'/fichas'})}${state}`;
    const f=D().fichas.find(x=>x.id===ctx.params[0])||D().fichas[0];
    const schedules=D().schedules.filter(x=>x.ficha===f.number).slice(0,3);
    return `${C().pageHeader(`Ficha ${f.number}`,'',null,{label:'Volver a Fichas',href:'/fichas'})}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">${f.program}</h2><p class="panel-subtitle">Nivel: Tecnólogo · 2.440 horas · Versión cursada: 3</p></div>${C().status(f.status)}</header><div class="panel-body"><h3>Programa</h3>${C().details([['Código','233104'],['Nombre','Análisis y Desarrollo de Software'],['Nivel','Tecnólogo'],['Horas totales','2.440'],['Versión cursada','3']])}<h3 style="margin-top:24px">Datos de la ficha</h3>${C().details([['Centro de formación','Centro de la Industria, la Empresa y los Servicios'],['Jornada',f.shift],['Modalidad',f.modality],['Cupo máximo',f.capacity],['Fecha de inicio',f.start],['Fecha esperada de cierre','15/12/2027'],['Fecha real de cierre','No aplica'],['Última actualización','06/08/2026']])}</div></section>
      <section class="panel" style="margin-top:20px"><header class="panel-header"><div><h2 class="panel-title">Horarios de esta ficha</h2></div></header>${C().table([{label:'Período',key:'period'},{label:'Nombre',key:'name'},{label:'Estado',render:r=>C().status(r.status)},{label:'Última actualización',key:'updated'}],schedules.length?schedules:[D().schedules[0]],{caption:'Horarios de la ficha',pagination:false})}<footer class="panel-footer">Mostrando ${Math.max(1,schedules.length)} de ${Math.max(1,schedules.length)} · <a href="#/horarios">Ver todos en Horarios</a></footer></section>`;
  };
  M.screens.paramCurriculum=(ctx)=>{
    const state=stateView(ctx,'currículo'); if(state)return `${C().pageHeader('Parametrización — Currículo académico')}${state}`;
    const techLines=[
      {code:'LT-TIC',name:'Tecnologías de la Información y las Comunicaciones',is_active:'ACTIVE',updated:'02/08/2026'},
      {code:'LT-IND',name:'Industria y Manufactura',is_active:'ACTIVE',updated:'21/07/2026'},
      {code:'LT-AGR',name:'Actividad Física, Recreación y Deporte',is_active:'INACTIVE',updated:'10/06/2026'}
    ];
    const techNetworks=[
      {code:'RT-SW',line:'LT-TIC',name:'Desarrollo de Software',is_active:'ACTIVE',updated:'02/08/2026'},
      {code:'RT-INF',line:'LT-TIC',name:'Infraestructura y Redes',is_active:'ACTIVE',updated:'19/07/2026'},
      {code:'RT-DAT',line:'LT-TIC',name:'Ciencia y Analítica de Datos',is_active:'ACTIVE',updated:'28/07/2026'}
    ];
    const knowledgeNetworks=[
      {code:'RC-PROG',network:'RT-SW',name:'Programación y Bases de Datos',is_active:'ACTIVE',updated:'04/08/2026'},
      {code:'RC-WEB',network:'RT-SW',name:'Desarrollo Web y Móvil',is_active:'ACTIVE',updated:'01/08/2026'},
      {code:'RC-CLD',network:'RT-INF',name:'Servicios en la Nube',is_active:'INACTIVE',updated:'22/06/2026'}
    ];
    const programs=[
      {program_code:'228106',name:'Análisis y Desarrollo de Software (ADSO)',training_level:'TECNÓLOGO',total_hours:'2.640',version:'104',is_active:'ACTIVE',knowledge:'RC-PROG'},
      {program_code:'233104',name:'Análisis y Desarrollo de Sistemas de Información',training_level:'TECNÓLOGO',total_hours:'2.440',version:'3',is_active:'ACTIVE',knowledge:'RC-PROG'},
      {program_code:'624201',name:'Programación de Software',training_level:'TÉCNICO',total_hours:'1.760',version:'2',is_active:'ACTIVE',knowledge:'RC-PROG'},
      {program_code:'228120',name:'Desarrollo Web y de Aplicaciones Móviles',training_level:'TECNÓLOGO',total_hours:'2.640',version:'1',is_active:'ACTIVE',knowledge:'RC-WEB'},
      {program_code:'137100',name:'Diseño e Integración de Multimedia',training_level:'TECNÓLOGO',total_hours:'2.200',version:'2',is_active:'ACTIVE',knowledge:'RC-WEB'},
      {program_code:'822202',name:'Implementación de Servicios en la Nube',training_level:'TÉCNICO',total_hours:'1.540',version:'1',is_active:'INACTIVE',knowledge:'RC-CLD'}
    ];
    const competencies=[
      {sena_code:'220501046',name:'Analizar requisitos del cliente de acuerdo con la metodología de desarrollo',hours:'240',is_active:'ACTIVE',program:'228106'},
      {sena_code:'220501092',name:'Construir el sistema que cumpla con los requisitos de la solución informática',hours:'480',is_active:'ACTIVE',program:'228106'},
      {sena_code:'220501093',name:'Codificar módulos de software cumpliendo estándares de calidad',hours:'360',is_active:'ACTIVE',program:'228106'},
      {sena_code:'240201530',name:'Aplicar buenas prácticas de bases de datos según el modelo de negocio',hours:'220',is_active:'ACTIVE',program:'233104'},
      {sena_code:'220501094',name:'Desplegar la solución de software en el entorno productivo',hours:'180',is_active:'INACTIVE',program:'228120'}
    ];
    const outcomes=[
      {code:'RA-01',description:'Especificar los requerimientos funcionales y no funcionales de la solución.',is_active:'ACTIVE',competency:'220501046'},
      {code:'RA-02',description:'Diseñar el modelo entidad-relación conforme a las reglas del negocio.',is_active:'ACTIVE',competency:'220501046'},
      {code:'RA-03',description:'Implementar la lógica de negocio aplicando patrones de diseño.',is_active:'ACTIVE',competency:'220501092'},
      {code:'RA-04',description:'Realizar pruebas unitarias y de integración sobre los módulos construidos.',is_active:'ACTIVE',competency:'220501092'}
    ];
    let html=`${C().pageHeader('Parametrización — Currículo académico','Jerarquía curricular: línea → red tecnológica → red de conocimiento → programa → competencia → resultado de aprendizaje.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Líneas','Redes tecnológicas','Redes de conocimiento','Programas','Competencias','Resultados'],3)}

      <div class="tabpanel" data-tabpanel="0" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Líneas tecnológicas</h2><p class="panel-subtitle">Primer nivel de la jerarquía; agrupan las redes tecnológicas del centro.</p></div><button class="btn btn-primary" data-open-modal="line">${icon('plus')}Nueva línea</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},{label:'Línea tecnológica',key:'name'},{label:'Estado',render:r=>C().status(r.is_active)},{label:'Actualizado',key:'updated'},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="line" aria-label="Editar">${icon('edit')}</button>`}
      ],techLines,{caption:'Líneas tecnológicas',total:6,start:1,end:techLines.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="1" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Redes tecnológicas</h2><p class="panel-subtitle">Segundo nivel; cada red tecnológica pertenece a una línea tecnológica.</p></div><button class="btn btn-primary" data-open-modal="network">${icon('plus')}Nueva red tecnológica</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},{label:'Red tecnológica',key:'name'},{label:'Línea',key:'line'},{label:'Estado',render:r=>C().status(r.is_active)},{label:'Actualizado',key:'updated'},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="network" aria-label="Editar">${icon('edit')}</button>`}
      ],techNetworks,{caption:'Redes tecnológicas',total:9,start:1,end:techNetworks.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="2" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Redes de conocimiento</h2><p class="panel-subtitle">Tercer nivel; cada red de conocimiento pertenece a una red tecnológica.</p></div><button class="btn btn-primary" data-open-modal="knowledge">${icon('plus')}Nueva red de conocimiento</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},{label:'Red de conocimiento',key:'name'},{label:'Red tecnológica',key:'network'},{label:'Estado',render:r=>C().status(r.is_active)},{label:'Actualizado',key:'updated'},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="knowledge" aria-label="Editar">${icon('edit')}</button>`}
      ],knowledgeNetworks,{caption:'Redes de conocimiento',total:15,start:1,end:knowledgeNetworks.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="3">
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Programas de formación</h2><p class="panel-subtitle">Los programas se asocian a competencias y son requisito de las fichas.</p></div><button class="btn btn-primary" data-open-modal="program">${icon('plus')}Nuevo programa</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.program_code}</strong>`},
        {label:'Nombre',key:'name'},
        {label:'Nivel',key:'training_level'},
        {label:'Horas',key:'total_hours'},
        {label:'Versión',key:'version'},
        {label:'Red de conocimiento',key:'knowledge'},
        {label:'Estado',render:r=>C().status(r.is_active)},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="program" aria-label="Editar">${icon('edit')}</button>`}
      ],programs,{caption:'Programas de formación',total:42,start:1,end:programs.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="4" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Competencias del programa</h2><p class="panel-subtitle">Unidades de competencia asociadas al programa seleccionado (ADSO 228106).</p></div><button class="btn btn-secondary" data-open-modal="competency">${icon('plus')}Nueva competencia</button></div>
      ${C().table([
        {label:'Código SENA',render:r=>`<strong>${r.sena_code}</strong>`},
        {label:'Nombre',key:'name'},
        {label:'Horas',key:'hours'},
        {label:'Programa',key:'program'},
        {label:'Estado',render:r=>C().status(r.is_active)},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="competency" aria-label="Editar">${icon('edit')}</button>`}
      ],competencies,{caption:'Competencias',total:18,start:1,end:competencies.length,pageSize:10})}
      </div>

      <div class="tabpanel" data-tabpanel="5" hidden>
      <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">Resultados de aprendizaje</h2><p class="panel-subtitle">Resultados esperados por competencia, base para la planeación de horarios.</p></div><button class="btn btn-primary" data-open-modal="outcome">${icon('plus')}Nuevo resultado</button></div>
      ${C().table([
        {label:'Código',render:r=>`<strong>${r.code}</strong>`},
        {label:'Descripción',key:'description'},
        {label:'Competencia',key:'competency'},
        {label:'Estado',render:r=>C().status(r.is_active)},
        {label:'',render:r=>`<button class="btn btn-ghost btn-icon" data-open-modal="outcome" aria-label="Editar">${icon('edit')}</button>`}
      ],outcomes,{caption:'Resultados de aprendizaje',total:64,start:1,end:outcomes.length,pageSize:10})}
      </div></section>`;
    const footer=`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`;
    if(ctx.query.get('modal')==='line') html+=C().modal('Nueva / editar línea tecnológica',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="LT-TIC" placeholder="Ej. LT-TIC"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Tecnologías de la Información y las Comunicaciones" placeholder="Nombre de la línea"></label>
        <label class="field full"><span>Descripción</span><textarea rows="3" placeholder="Descripción de la línea tecnológica">Agrupa las redes tecnológicas del área TIC del centro.</textarea></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    if(ctx.query.get('modal')==='network') html+=C().modal('Nueva / editar red tecnológica',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="RT-SW" placeholder="Ej. RT-SW"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Desarrollo de Software" placeholder="Nombre de la red tecnológica"></label>
        <label class="field"><span>Línea tecnológica</span><select><option>LT-TIC · Tecnologías de la Información y las Comunicaciones</option><option>LT-IND · Industria y Manufactura</option><option>LT-AGR · Actividad Física, Recreación y Deporte</option></select></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    if(ctx.query.get('modal')==='knowledge') html+=C().modal('Nueva / editar red de conocimiento',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="RC-PROG" placeholder="Ej. RC-PROG"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Programación y Bases de Datos" placeholder="Nombre de la red de conocimiento"></label>
        <label class="field"><span>Red tecnológica</span><select><option>RT-SW · Desarrollo de Software</option><option>RT-INF · Infraestructura y Redes</option><option>RT-DAT · Ciencia y Analítica de Datos</option></select></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    if(ctx.query.get('modal')==='program'){
      const progComps=[
        {label:'220501046 · Analizar requisitos del cliente',on:true},
        {label:'220501092 · Construir el sistema informático',on:true},
        {label:'220501093 · Codificar módulos de software',on:false},
        {label:'240201530 · Aplicar buenas prácticas de bases de datos',on:false}
      ];
      html+=C().modal('Nuevo / editar programa',
      `<div class="form-grid">
        <label class="field"><span>Código del programa</span><input type="text" value="228106" placeholder="Ej. 228106"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Análisis y Desarrollo de Software (ADSO)" placeholder="Nombre del programa"></label>
        <label class="field"><span>Nivel de formación</span><select><option>TECNÓLOGO</option><option>TÉCNICO</option><option>ESPECIALIZACIÓN TECNOLÓGICA</option><option>OPERARIO</option></select></label>
        <label class="field"><span>Horas totales</span><input type="number" value="2640" placeholder="Ej. 2640"></label>
        <label class="field"><span>Versión</span><input type="number" value="104" placeholder="Ej. 1"></label>
        <label class="field full"><span>Red de conocimiento (padre)</span><select><option>RC-PROG · Programación y Bases de Datos</option><option>RC-WEB · Desarrollo Web y Móvil</option><option>RC-CLD · Servicios en la Nube</option></select><small class="field-help">Padre directo del programa (taxonomía SENA). La línea tecnológica no se asigna aquí: se hereda por la cadena red de conocimiento → red tecnológica → línea.</small></label>
        <label class="field full"><span>Competencias asociadas</span><div class="check-list">${progComps.map(x=>`<label class="check-row"><input type="checkbox" ${x.on?'checked':''}> ${x.label}</label>`).join('')}</div></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    }
    if(ctx.query.get('modal')==='competency'){
      const compOutcomes=[
        {label:'RA-01 · Especificar los requerimientos funcionales y no funcionales',on:true},
        {label:'RA-02 · Diseñar el modelo entidad-relación',on:true},
        {label:'RA-03 · Implementar la lógica de negocio con patrones de diseño',on:false},
        {label:'RA-04 · Realizar pruebas unitarias y de integración',on:false}
      ];
      html+=C().modal('Nueva / editar competencia',
      `<div class="form-grid">
        <label class="field"><span>Código SENA</span><input type="text" value="220501046" placeholder="Ej. 220501046"></label>
        <label class="field"><span>Nombre</span><input type="text" value="Analizar requisitos del cliente de acuerdo con la metodología de desarrollo" placeholder="Nombre de la competencia"></label>
        <label class="field"><span>Horas</span><input type="number" value="240" placeholder="Ej. 240"></label>
        <label class="field"><span>Programa</span><select><option>228106 · Análisis y Desarrollo de Software (ADSO)</option><option>233104 · Análisis y Desarrollo de Sistemas de Información</option><option>624201 · Programación de Software</option><option>228120 · Desarrollo Web y de Aplicaciones Móviles</option></select></label>
        <label class="field full"><span>Resultados de aprendizaje asociados</span><div class="check-list">${compOutcomes.map(x=>`<label class="check-row"><input type="checkbox" ${x.on?'checked':''}> ${x.label}</label>`).join('')}</div></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    }
    if(ctx.query.get('modal')==='outcome') html+=C().modal('Nuevo / editar resultado de aprendizaje',
      `<div class="form-grid">
        <label class="field"><span>Código</span><input type="text" value="RA-01" placeholder="Ej. RA-01"></label>
        <label class="field full"><span>Descripción</span><textarea rows="3" placeholder="Descripción del resultado de aprendizaje">Especificar los requerimientos funcionales y no funcionales de la solución.</textarea></label>
        <label class="field"><span>Competencia</span><select><option>220501046 · Analizar requisitos del cliente</option><option>220501092 · Construir el sistema informático</option><option>220501093 · Codificar módulos de software</option><option>240201530 · Aplicar buenas prácticas de bases de datos</option></select></label>
        <label class="field"><span>Estado</span><select><option>Activo</option><option>Inactivo</option></select></label>
      </div>`,footer);
    return html;
  };
})();
