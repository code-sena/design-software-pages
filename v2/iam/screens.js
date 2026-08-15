(() => {
  const M=window.Mockup=window.Mockup||{}, C=()=>M.Components, D=()=>M.data, icon=(...a)=>M.icon(...a);
  const authBrand=()=>`<a class="brand auth-brand" href="#/login"><span class="brand-mark">SENA</span><span class="brand-copy"><strong>SENA — Gestión de Horarios</strong><span>Plataforma académica</span></span></a>`;
  const stateView=(ctx,e)=>ctx.state&&ctx.state!=='normal'?C().state(ctx.state,e):null;
  M.screens=M.screens||{};
  M.screens.login=(ctx)=>`<main class="auth-page"><div class="auth-shell">${authBrand()}<section class="card auth-card"><h1>Ingresar</h1><p>Accede con tu cuenta institucional.</p>${ctx.state==='error'?`<div class="alert alert-critical" style="margin-bottom:20px">${icon('warning')}Correo o contraseña incorrectos.</div>`:''}<form data-login-form><div class="form-field"><label for="login-email">Correo</label><input id="login-email" type="email" placeholder="ej. juan@sena.edu.co" autocomplete="username" required></div><div class="form-field" style="margin-top:16px"><label for="login-password">Contraseña</label><div class="password-wrap"><input id="login-password" type="password" placeholder="••••••••" autocomplete="current-password" required><button class="icon-btn" type="button" data-password-toggle aria-controls="login-password" aria-label="Mostrar contraseña">${icon('eye')}</button></div></div><div style="display:flex;justify-content:flex-end;margin:8px 0"><a class="btn btn-link" href="#/forgot-password">¿Olvidó su contraseña?</a></div><button class="btn btn-primary" style="width:100%" type="submit">Ingresar</button></form><p class="auth-note">Uso exclusivo de personal y comunidad académica autorizada.</p></section></div></main>`;
  M.screens.forgotPassword=(ctx)=>`<main class="auth-page"><div class="auth-shell">${authBrand()}<section class="card auth-card"><h1>Recuperar contraseña</h1><p>Ingresa tu correo institucional. Si existe una cuenta, enviaremos instrucciones.</p>${ctx.query.get('sent')==='1'?`<div class="alert alert-success" style="margin-bottom:20px">${icon('check')}Si el correo existe, enviaremos instrucciones para restablecer la contraseña.</div>`:''}<form><div class="form-field"><label>Correo</label><input type="email" placeholder="nombre@sena.edu.co"></div><div class="form-actions"><a class="btn btn-secondary" href="#/login">Volver a ingresar</a><a class="btn btn-primary" href="#/forgot-password?sent=1">Enviar enlace</a></div></form></section></div></main>`;
  M.screens.resetPassword=(ctx)=>`<main class="auth-page"><div class="auth-shell">${authBrand()}<section class="card auth-card"><h1>Definir nueva contraseña</h1><p>La contraseña debe tener mínimo 8 caracteres.</p>${ctx.state==='error'?`<div class="alert alert-critical" style="margin-bottom:20px">${icon('warning')}El enlace expiró o ya fue usado. <a href="#/forgot-password">Solicitar uno nuevo</a></div>`:''}<form><div class="form-field"><label>Nueva contraseña</label><input type="password" value="Nueva2026!"><div class="field-help">Fortaleza: alta</div></div><div class="form-field" style="margin-top:16px"><label>Confirmar contraseña</label><input type="password" value="Nueva2026!"></div><div class="form-actions"><a class="btn btn-primary" href="#/login">Guardar</a></div></form></section></div></main>`;

  M.screens.usersList=(ctx)=>{
    const state=stateView(ctx,'usuarios'); if(state)return `${C().pageHeader('Administración — Usuarios','', {label:'+ Nuevo usuario',href:'/admin/usuarios?modal=user'})}${state}`;
    const modal=ctx.query.get('modal');
    let html=`${C().pageHeader('Administración — Usuarios','Gestiona las cuentas del centro de formación.',{label:'+ Nuevo usuario',href:'/admin/usuarios?modal=user'})}${C().filters([{label:'Rol',options:['Todos','Coordinador Académico','Instructor','Aprendiz','Director de Centro']},{label:'Estado',options:['Todos','Activo','Inactivo']},{label:'Buscar',type:'search',placeholder:'Nombre o correo'}])}${C().table([{label:'Nombre completo',render:r=>`<a href="#/admin/usuarios/${r.id}"><strong>${r.name}</strong></a>`},{label:'Correo',key:'email'},{label:'Tipo de actor',render:r=>C().status('INFO',r.actor)},{label:'Estado',render:r=>C().status(r.active?'ACTIVE':'INACTIVE')},{label:'Último acceso',key:'lastAccess'}],D().users,{caption:'Usuarios',total:84,start:1,end:5,pageSize:10})}`;
    if(modal==='user') html+=userFormModal();
    return html;
  };
  function userFormModal(){ return C().modal('Nuevo usuario',`<div class="form-grid"><div class="form-field full"><label>Correo</label><input type="email" value="nuevo.usuario@sena.edu.co"><div class="field-error">${icon('warning')}Este correo ya está registrado.</div></div><div class="form-field"><label>Nombre</label><input value="Laura"></div><div class="form-field"><label>Apellido</label><input value="Ramírez"></div><div class="form-field"><label>Tipo de actor</label><select><option>Usuario</option><option>Instructor</option><option>Aprendiz</option></select></div><div class="form-field"><label>Actor vinculado (opcional)</label><input placeholder="Buscar actor"></div><div class="form-field"><label>Rol inicial</label><select><option>Instructor</option><option>Coordinador Académico</option></select></div><div class="form-field"><label>Centro de formación (opcional)</label><select><option>Centro de la Industria, la Empresa y los Servicios</option></select></div></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Crear</button>`); }
  M.screens.userDetail=(ctx)=>{
    const state=stateView(ctx,'usuario'); if(state)return `${C().pageHeader('Detalle de usuario','',null,{label:'Volver a Usuarios',href:'/admin/usuarios'})}${state}`;
    const u=D().users.find(x=>x.id===ctx.params[0])||D().users[1];
    let html=`${C().pageHeader('Detalle de usuario','',null,{label:'Volver a Usuarios',href:'/admin/usuarios'})}<section class="panel"><header class="panel-header"><div><h2 class="panel-title">${u.name}</h2><p class="panel-subtitle">${u.email}</p></div>${C().status(u.active?'ACTIVE':'INACTIVE')}</header>${C().tabs(['Perfil','Roles','Sesiones'],0)}<div class="panel-body">${C().details([['Nombre','Juan'],['Apellido','Pérez'],['Tipo de actor',u.actor],['Estado',u.active?'Activo':'Inactivo'],['Último acceso',u.lastAccess]])}<div class="form-actions"><button class="btn btn-secondary">Editar</button><button class="btn btn-danger-subtle">Desactivar</button><a class="btn btn-primary" href="#/admin/usuarios/${u.id}?modal=role">Asignar rol</a></div><h3>Roles asignados en esta sesión de trabajo</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="status-badge status-info">Instructor <button class="icon-btn" style="width:28px;height:28px;min-height:28px" aria-label="Revocar rol">${icon('x')}</button></span></div><h3>Sesiones activas</h3>${C().table([{label:'Dispositivo',render:()=>'<strong>Chrome · Windows 11</strong>'},{label:'IP',render:()=> '190.84.18.22'},{label:'Creada',render:()=> '06/08/2026, 07:48'},{label:'Expira',render:()=> '06/08/2026, 19:48'},{label:'Acción',render:()=>'<button class="btn btn-danger-subtle btn-sm">Revocar</button>'}],[{}],{caption:'Sesiones activas',pagination:false})}</div></section>`;
    if(ctx.query.get('modal')==='role') html+=C().modal('Asignar rol a Juan Pérez',`<div class="form-grid"><div class="form-field full"><label>Rol</label><select><option>Instructor</option><option>Coordinador Académico</option><option>Director de Centro</option></select><div class="field-error">${icon('warning')}Este usuario ya tiene este rol asignado.</div></div><div class="form-field full"><label>Centro de formación (opcional)</label><select><option value="">Vacío = rol global</option><option>Centro de la Industria, la Empresa y los Servicios</option></select></div><div class="form-field full"><label>Expira el (opcional)</label><input type="date"></div><div class="form-field full"><label>Motivo de la asignación</label><input placeholder="Ej. Refuerzo de coordinación durante el trimestre"><div class="field-hint">${icon('info')}Queda auditado: quién asigna, cuándo y por qué (historial de rol).</div></div></div>`,`<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Asignar</button>`);
    return html;
  };

  M.screens.paramRbac=(ctx)=>{
    const state=stateView(ctx,'roles y permisos'); if(state)return `${C().pageHeader('Parametrización — RBAC (roles y permisos)','',null,{href:'/admin/parametrizacion',label:'Parametrización'})}${state}`;
    // Roles reales (rbac.role). #Permisos = features asignadas en 001_seed_rbac.sql (rbac.role_feature).
    const roles=[
      {name:'SYSTEM_ADMIN',desc:'Gestión técnica del sistema',count:45,system:true},
      {name:'CENTER_DIRECTOR',desc:'Subdirector de Centro — máxima autoridad operativa',count:36,system:true},
      {name:'COORDINATOR',desc:'Coordinador Académico — fichas, instructores y horarios',count:33,system:true},
      {name:'AREA_LEADER',desc:'Líder de Área Tecnológica — coordina instructores de un área',count:0,system:true},
      {name:'INSTRUCTOR',desc:'Ve su horario; registra seguimiento',count:17,system:true},
      {name:'LEARNER',desc:'Ve el horario y estado de su ficha',count:5,system:true},
      {name:'ADMIN_STAFF',desc:'Funcionario Administrativo — catálogos y parámetros',count:7,system:true}
    ];
    // Módulos reales (rbac_catalog.module) con features (rbac_catalog.feature). total = 62 features.
    const features=[
      {code:'IDENTITY_USER_VIEW',name:'Ver usuarios',mod:'MOD_IDENTITY',level:'READ',roles:2},
      {code:'IDENTITY_USER_MANAGE',name:'Gestionar usuarios',mod:'MOD_IDENTITY',level:'WRITE',roles:2},
      {code:'IDENTITY_ROLE_MANAGE',name:'Gestionar roles',mod:'MOD_IDENTITY',level:'WRITE',roles:1},
      {code:'IDENTITY_ROLE_ASSIGN',name:'Asignar roles a usuarios',mod:'MOD_IDENTITY',level:'WRITE',roles:2},
      {code:'ACADEMIC_FICHA_MANAGE',name:'Gestionar fichas',mod:'MOD_ACADEMIC',level:'WRITE',roles:3},
      {code:'ENV_MANAGE',name:'CRUD de ambientes',mod:'MOD_ENVIRONMENT',level:'WRITE',roles:3},
      {code:'SCH_CREATE',name:'Crear borrador',mod:'MOD_SCHEDULING',level:'WRITE',roles:2},
      {code:'SCH_PUBLISH',name:'Publicar horario',mod:'MOD_SCHEDULING',level:'PUBLISH',roles:3},
      {code:'DOC_VIEW',name:'Ver documentos',mod:'MOD_DOCUMENTS',level:'READ',roles:0},
      {code:'MON_KPI_VIEW',name:'Ver KPIs',mod:'MOD_MONITORING',level:'READ',roles:4}
    ];
    const yn=v=>v?`<span class="status-badge status-success">${icon('check')}</span>`:'<span style="color:var(--color-text-muted)">—</span>';
    // Matriz rol↔permiso (extracto). true = feature asignada al rol en el seed.
    const matrix=[
      {code:'IDENTITY_USER_MANAGE',sys:true,dir:true,coord:false,area:false,instr:false,learn:false,staff:false},
      {code:'REF_CATALOG_MANAGE',sys:true,dir:false,coord:false,area:false,instr:false,learn:false,staff:true},
      {code:'ACADEMIC_FICHA_MANAGE',sys:true,dir:true,coord:true,area:false,instr:false,learn:false,staff:false},
      {code:'ENV_MANAGE',sys:true,dir:true,coord:true,area:false,instr:false,learn:false,staff:false},
      {code:'SCH_CREATE',sys:true,dir:false,coord:true,area:false,instr:false,learn:false,staff:false},
      {code:'SCH_PUBLISH',sys:true,dir:true,coord:true,area:false,instr:false,learn:false,staff:false},
      {code:'MON_KPI_VIEW',sys:true,dir:true,coord:true,area:false,instr:true,learn:false,staff:false},
      {code:'SCH_VIEW_OWN',sys:true,dir:true,coord:true,area:false,instr:true,learn:true,staff:false}
    ];
    let html=`${C().pageHeader('Parametrización — RBAC (roles y permisos)','Roles, módulos, permisos (features) y su asignación. Define el x-required-feature que gobierna cada endpoint/pantalla.',null,{href:'/admin/parametrizacion',label:'Parametrización'})}
      <section class="panel">${C().tabs(['Roles','Módulos y permisos','Asignación rol↔permiso'],0)}
        <div class="tabpanel" data-tabpanel="0">
          <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">${icon('users')}Roles</h2><p class="panel-subtitle">7 roles del sistema (rbac.role). Los roles del sistema no se eliminan; se ajustan sus permisos.</p></div><button class="btn btn-primary" data-open-modal="role">${icon('plus')}Nuevo rol</button></div>
          ${C().table([
            {label:'Rol',render:r=>`<strong>${r.name}</strong>`},
            {label:'Descripción',key:'desc'},
            {label:'Permisos',render:r=>r.count>0?`<span class="status-badge status-info">${icon('key')}${r.count}</span>`:`<span class="status-badge status-neutral">${icon('lock')}0</span>`},
            {label:'Tipo',render:()=>C().status('INFO','Rol de sistema')},
            {label:'Estado',render:()=>C().status('ACTIVE')},
            {label:'Acción',render:()=>'<button class="btn btn-secondary btn-sm" data-open-modal="role">Editar</button>'}
          ], roles, {caption:'Roles',total:7,start:1,end:roles.length,pageSize:10})}
        </div>
        <div class="tabpanel" data-tabpanel="1" hidden>
          <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">${icon('settings')}Módulos y permisos (features)</h2><p class="panel-subtitle">10 módulos · 62 features. El <code>code</code> es el x-required-feature exigido por cada endpoint/pantalla.</p></div><button class="btn btn-primary" data-open-modal="feature">${icon('plus')}Nuevo permiso</button></div>
          ${C().filters([{label:'Módulo',options:['Todos','MOD_IDENTITY','MOD_REFERENCE','MOD_ACADEMIC','MOD_ENVIRONMENT','MOD_SCHEDULING','MOD_ACTORS','MOD_DOCUMENTS','MOD_MONITORING','MOD_AUDIT','MOD_DASHBOARD']},{label:'Nivel',options:['Todos','READ','WRITE','DELETE','PUBLISH']},{label:'Buscar',type:'search',placeholder:'Código o nombre de feature'}])}
          ${C().table([
            {label:'Feature (code)',render:r=>`<strong><code>${r.code}</code></strong>`},
            {label:'Nombre',key:'name'},
            {label:'Módulo',render:r=>C().status('INFO',r.mod)},
            {label:'Nivel',render:r=>C().status(r.level==='READ'?'INFO':r.level==='PUBLISH'?'SUCCESS':'AT_RISK',r.level)},
            {label:'Roles',render:r=>`${icon('users')}${r.roles}`},
            {label:'Acción',render:()=>`<button class="btn btn-ghost btn-icon" data-open-modal="feature" aria-label="Editar">${icon('edit')}</button>`}
          ], features, {caption:'Features por módulo',total:62,start:1,end:features.length,pageSize:10})}
        </div>
        <div class="tabpanel" data-tabpanel="2" hidden>
          <div class="panel-header" style="padding:16px 20px"><div><h2 class="panel-title">${icon('lock')}Asignación rol ↔ permiso</h2><p class="panel-subtitle">Matriz rbac.role_feature (extracto). Marca ✓ = la feature está asignada al rol, con su scope (GLOBAL / TRAINING_CENTER / OWN_*).</p></div><button class="btn btn-primary" data-open-modal="assign">${icon('plus')}Nueva asignación</button></div>
          ${C().table([
            {label:'Feature',render:r=>`<strong><code>${r.code}</code></strong>`},
            {label:'SYSTEM_ADMIN',render:r=>yn(r.sys)},
            {label:'CENTER_DIRECTOR',render:r=>yn(r.dir)},
            {label:'COORDINATOR',render:r=>yn(r.coord)},
            {label:'AREA_LEADER',render:r=>yn(r.area)},
            {label:'INSTRUCTOR',render:r=>yn(r.instr)},
            {label:'LEARNER',render:r=>yn(r.learn)},
            {label:'ADMIN_STAFF',render:r=>yn(r.staff)},
            {label:'Acción',render:()=>`<button class="btn btn-ghost btn-icon" data-open-modal="assign" aria-label="Editar">${icon('edit')}</button>`}
          ], matrix, {caption:'Matriz rol ↔ permiso',total:62,start:1,end:matrix.length,pageSize:10})}
        </div>
      </section>`;
    if(ctx.query.get('modal')==='role') html+=paramRbacModal();
    if(ctx.query.get('modal')==='feature') html+=paramRbacFeatureModal();
    if(ctx.query.get('modal')==='assign') html+=paramRbacAssignModal();
    return html;
  };

  function paramRbacModal(){
    // Features del módulo pre-marcadas según la asignación de COORDINATOR en el seed.
    const mods=[
      {mod:'MOD_ACADEMIC',feats:[['ACADEMIC_FICHA_VIEW',true],['ACADEMIC_FICHA_MANAGE',true],['ACADEMIC_FICHA_STATUS',true],['ACADEMIC_PROGRAM_MANAGE',false]]},
      {mod:'MOD_SCHEDULING',feats:[['SCH_CREATE',true],['SCH_EDIT',true],['SCH_PUBLISH',true],['SCH_CONFLICT_RESOLVE',true],['SCH_ARCHIVE',true]]},
      {mod:'MOD_ENVIRONMENT',feats:[['ENV_VIEW',true],['ENV_MANAGE',true],['ENV_MAINTENANCE_MANAGE',true]]},
      {mod:'MOD_MONITORING',feats:[['MON_KPI_VIEW',true],['MON_ALERT_RESOLVE',true],['MON_IMPROVEMENT_PLAN_MANAGE',true],['MON_NOTIFICATION_SEND',false]]},
      {mod:'MOD_IDENTITY',feats:[['IDENTITY_USER_MANAGE',false],['IDENTITY_ROLE_MANAGE',false]]}
    ];
    const groups=mods.map(g=>`<fieldset style="border:1px solid var(--color-border);border-radius:8px;padding:12px 14px;margin:0"><legend style="padding:0 6px"><strong>${g.mod}</strong></legend><div style="display:grid;gap:8px">${g.feats.map(([code,on])=>`<label style="display:flex;align-items:center;gap:8px;font-weight:400"><input type="checkbox" ${on?'checked':''}><code>${code}</code></label>`).join('')}</div></fieldset>`).join('');
    return C().modal('Rol y sus permisos — COORDINATOR',
      `<div class="form-grid"><div class="form-field"><label>Nombre del rol</label><input value="COORDINATOR"></div><div class="form-field"><label>Descripción</label><input value="Coordinador Académico"></div><div class="form-field full"><label>Scope por defecto</label><select><option>TRAINING_CENTER</option><option>GLOBAL</option><option>OWN_FICHAS</option></select></div><div class="form-field full"><label>Permisos asignados</label><div class="alert alert-info">${icon('info')}Marque los features (por módulo) que este rol puede ejecutar. Cada feature es el <code>x-required-feature</code> que gobierna el endpoint/pantalla asociado.</div></div><div class="form-field full" style="display:grid;gap:12px">${groups}</div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
  }

  function paramRbacFeatureModal(){
    // Módulos reales (rbac_catalog.module) para el select.
    const modOpts=['MOD_IDENTITY','MOD_REFERENCE','MOD_ACADEMIC','MOD_ENVIRONMENT','MOD_SCHEDULING','MOD_ACTORS','MOD_DOCUMENTS','MOD_MONITORING','MOD_AUDIT','MOD_DASHBOARD']
      .map(m=>`<option ${m==='MOD_SCHEDULING'?'selected':''}>${m}</option>`).join('');
    return C().modal('Permiso (feature) — MOD_SCHEDULING',
      `<div class="form-grid"><div class="form-field"><label>Código del feature</label><input value="SCH_CREATE"><div class="field-help">x-required-feature que gobierna el endpoint/pantalla.</div></div><div class="form-field"><label>Nombre</label><input value="Crear borrador"></div><div class="form-field"><label>Módulo</label><select>${modOpts}</select></div><div class="form-field"><label>Nivel de acción</label><select><option>READ</option><option selected>WRITE</option><option>DELETE</option><option>PUBLISH</option></select></div><div class="form-field full"><label>Estado</label><select><option>Activo</option><option>Inactivo</option></select></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
  }

  function paramRbacAssignModal(){
    // Roles reales (rbac.role) y algunos features reales (rbac_catalog.feature) para los selects.
    const roleOpts=['SYSTEM_ADMIN','CENTER_DIRECTOR','COORDINATOR','AREA_LEADER','INSTRUCTOR','LEARNER','ADMIN_STAFF']
      .map(r=>`<option ${r==='COORDINATOR'?'selected':''}>${r}</option>`).join('');
    const featOpts=['IDENTITY_USER_MANAGE','ACADEMIC_FICHA_MANAGE','ENV_MANAGE','SCH_CREATE','SCH_PUBLISH','MON_KPI_VIEW','SCH_VIEW_OWN']
      .map(f=>`<option ${f==='SCH_CREATE'?'selected':''}>${f}</option>`).join('');
    return C().modal('Asignación rol ↔ permiso',
      `<div class="form-grid"><div class="form-field"><label>Rol</label><select>${roleOpts}</select></div><div class="form-field"><label>Permiso/feature</label><select>${featOpts}</select></div><div class="form-field"><label>Scope</label><select><option>GLOBAL</option><option selected>TRAINING_CENTER</option><option>OWN_FICHAS</option><option>OWN_FICHA_AS_LEARNER</option></select></div><div class="form-field"><label>Estado</label><select><option>Activo</option><option>Inactivo</option></select></div></div>`,
      `<button class="btn btn-secondary" data-close-modal>Cancelar</button><button class="btn btn-primary">Guardar</button>`);
  }
})();
