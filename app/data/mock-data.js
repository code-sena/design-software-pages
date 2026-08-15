(() => {
  window.Mockup = window.Mockup || {};
  window.Mockup.data = {
    userByRole: {
      coordinator: { name: 'María García', initials: 'MG', label: 'Coordinador Académico' },
      instructor: { name: 'Juan Pérez', initials: 'JP', label: 'Instructor' },
      learner: { name: 'Laura Martínez', initials: 'LM', label: 'Aprendiz' },
      director: { name: 'Carlos Ramírez', initials: 'CR', label: 'Director de Centro' },
      support: { name: 'Ana Torres', initials: 'AT', label: 'Administrador de Soporte' }
    },
    schedules: [
      { id:'sch-01', ficha:'2874412', period:'2026-2', name:'ADSO — Trimestre III', status:'DRAFT', updated:'Hoy, 08:14' },
      { id:'sch-02', ficha:'3011550', period:'2026-2', name:'Contabilidad básica', status:'UNDER_REVIEW', updated:'Ayer, 16:42' },
      { id:'sch-03', ficha:'2987701', period:'2026-2', name:'Electricidad industrial', status:'PUBLISHED', updated:'04/08/2026, 11:05' },
      { id:'sch-04', ficha:'3124508', period:'2026-2', name:'Gestión administrativa', status:'DRAFT', updated:'03/08/2026, 09:30' },
      { id:'sch-05', ficha:'2763450', period:'2026-2', name:'Mantenimiento de equipos', status:'UNDER_REVIEW', updated:'02/08/2026, 14:22' },
      { id:'sch-06', ficha:'2891132', period:'2026-2', name:'Gestión documental', status:'PUBLISHED', updated:'01/08/2026, 10:18' },
      { id:'sch-07', ficha:'3054401', period:'2026-2', name:'Análisis de datos', status:'PUBLISHED', updated:'31/07/2026, 17:45' },
      { id:'sch-08', ficha:'2940054', period:'2026-2', name:'Soldadura básica', status:'DRAFT', updated:'31/07/2026, 09:12' },
      { id:'sch-09', ficha:'3108823', period:'2026-2', name:'Mecánica automotriz', status:'UNDER_REVIEW', updated:'30/07/2026, 15:50' },
      { id:'sch-10', ficha:'2997410', period:'2026-2', name:'Nómina y prestaciones', status:'PUBLISHED', updated:'29/07/2026, 13:37' },
      { id:'sch-11', ficha:'3145002', period:'2026-2', name:'Operaciones logísticas', status:'PUBLISHED', updated:'28/07/2026, 08:20' },
      { id:'sch-12', ficha:'3026608', period:'2026-2', name:'Programación web', status:'UNDER_REVIEW', updated:'27/07/2026, 12:00' },
      { id:'sch-13', ficha:'2978800', period:'2026-1', name:'Emprendimiento digital', status:'DRAFT', updated:'26/07/2026, 11:24' },
      { id:'sch-14', ficha:'2888019', period:'2026-1', name:'Procesos contables', status:'PUBLISHED', updated:'25/07/2026, 09:16' },
      { id:'sch-15', ficha:'3099981', period:'2026-1', name:'Seguridad ocupacional', status:'UNDER_REVIEW', updated:'24/07/2026, 15:02' },
      { id:'sch-16', ficha:'2866321', period:'2026-1', name:'Electrónica básica', status:'PUBLISHED', updated:'23/07/2026, 10:50' },
      { id:'sch-17', ficha:'3047760', period:'2026-1', name:'Atención al cliente', status:'DRAFT', updated:'22/07/2026, 14:08' },
      { id:'sch-18', ficha:'2955117', period:'2026-1', name:'Marketing digital', status:'PUBLISHED', updated:'21/07/2026, 16:10' },
      { id:'sch-19', ficha:'3132004', period:'2026-1', name:'Talento humano', status:'UNDER_REVIEW', updated:'20/07/2026, 09:47' },
      { id:'sch-20', ficha:'2964406', period:'2026-1', name:'Producción multimedia', status:'PUBLISHED', updated:'19/07/2026, 11:30' },
      { id:'sch-21', ficha:'3071120', period:'2026-1', name:'Automatización industrial', status:'PUBLISHED', updated:'18/07/2026, 08:40' },
      { id:'sch-22', ficha:'2910042', period:'2026-1', name:'Diseño de bases de datos', status:'DRAFT', updated:'17/07/2026, 15:33' },
      { id:'sch-23', ficha:'3088816', period:'2026-1', name:'Gestión de proyectos', status:'PUBLISHED', updated:'16/07/2026, 13:11' },
      { id:'sch-24', ficha:'2907705', period:'2026-1', name:'Comunicación empresarial', status:'UNDER_REVIEW', updated:'15/07/2026, 10:05' }
    ],
    sessions: [
      { id:'ses-01', day:'Lunes', slot:'07:00–10:00', date:'10/08/2026', competency:'Desarrollar software según requerimientos', instructor:'Juan Pérez', environment:'Laboratorio A-204', status:'ACTIVE' },
      { id:'ses-02', day:'Martes', slot:'10:00–13:00', date:'11/08/2026', competency:'Modelar bases de datos', instructor:'Carolina Rojas', environment:'Aula B-105', status:'ACTIVE' },
      { id:'ses-03', day:'Miércoles', slot:'13:00–16:00', date:'12/08/2026', competency:'Implementar servicios web', instructor:'Juan Pérez', environment:'Laboratorio A-204', status:'ACTIVE' },
      { id:'ses-04', day:'Jueves', slot:'07:00–10:00', date:'13/08/2026', competency:'Aplicar prácticas de calidad', instructor:'Diego Castro', environment:'Aula C-208', status:'ACTIVE' },
      { id:'ses-05', day:'Viernes', slot:'10:00–13:00', date:'14/08/2026', competency:'Gestionar código fuente', instructor:'Carolina Rojas', environment:'Laboratorio A-204', status:'CANCELLED' }
    ],
    // G1 · ciclo de vida del conflicto: severity + isBlocking (is_blocking_publication) + auditoría de resolución.
    // 5 tipos canónicos (functional.md/HU-09). 4 pendientes + 1 resuelto (mantiene coherencia con el dashboard).
    conflicts: [
      { id:'conf-01', type:'INSTRUCTOR_DOUBLE_BOOKED', title:'Instructor doble-asignado', schedule:'ADSO 2874412 · Jornada mañana', date:'06/08/2026', description:'Juan Pérez tiene dos sesiones que se solapan el 10/08/2026 de 07:00 a 10:00.', severity:'HIGH', isBlocking:true, resolved:false },
      { id:'conf-02', type:'ENVIRONMENT_DOUBLE_BOOKED', title:'Ambiente doble-asignado', schedule:'Ficha 3011550 · Ambiente A-204', date:'05/08/2026', description:'El ambiente A-204 está reservado para dos sesiones en la misma franja.', severity:'HIGH', isBlocking:true, resolved:false },
      { id:'conf-03', type:'SESSIONS_OVERLAP', title:'Sesiones solapadas', schedule:'EME 2987701 · Bloque 10:00–12:00', date:'05/08/2026', description:'Dos sesiones de la misma ficha se solapan parcialmente.', severity:'MEDIUM', isBlocking:true, resolved:false },
      { id:'conf-05', type:'ENVIRONMENT_MAINTENANCE', title:'Ambiente en mantenimiento', schedule:'Ficha 3124508 · Taller T-301', date:'04/08/2026', description:'El taller T-301 tiene un mantenimiento programado que solapa la sesión del jueves.', severity:'MEDIUM', isBlocking:false, resolved:false },
      { id:'conf-06', type:'INSTRUCTOR_TRAVEL_CONFLICT', title:'Traslado entre sedes insuficiente', schedule:'Ficha 2874412 · Sede Norte → Sede Sur', date:'03/08/2026', description:'Carlos Mesa tiene 15 min entre sesiones en sedes distintas; el traslado requiere 30 min.', severity:'HIGH', isBlocking:true, resolved:false },
      { id:'conf-04', type:'INSTRUCTOR_UNAVAILABLE', title:'Instructor no disponible', schedule:'Ficha 2763450 · Jornada tarde', date:'04/08/2026', description:'Laura Gómez registró una excepción de disponibilidad (capacitación) que choca con una sesión.', severity:'HIGH', isBlocking:true, resolved:true, resolvedBy:'María García', resolvedAt:'04/08/2026, 12:18', resolutionReason:'Se reprogramó la sesión al viernes y se notificó a la ficha.' }
    ],
    environments: [
      { id:'env-01', name:'Laboratorio A-204', type:'Laboratorio', capacity:30, location:'Bloque A, piso 2', available:true },
      { id:'env-02', name:'Aula B-105', type:'Aula', capacity:35, location:'Bloque B, piso 1', available:true },
      { id:'env-03', name:'Taller T-301', type:'Taller', capacity:24, location:'Bloque Técnico', available:false },
      { id:'env-04', name:'Laboratorio Lab-02', type:'Laboratorio', capacity:28, location:'Bloque C, piso 1', available:true },
      { id:'env-05', name:'Aula C-208', type:'Aula', capacity:32, location:'Bloque C, piso 2', available:false },
      { id:'env-06', name:'Taller de soldadura', type:'Taller', capacity:20, location:'Zona industrial', available:true }
    ],
    instructors: [
      { id:'ins-01', name:'Juan Pérez', document:'1.075.421.336', area:'Software', maxHours:40, available:false },
      { id:'ins-02', name:'Carolina Rojas', document:'1.010.338.224', area:'Bases de datos', maxHours:40, available:true },
      { id:'ins-03', name:'Diego Castro', document:'79.521.440', area:'Calidad', maxHours:36, available:true },
      { id:'ins-04', name:'Laura Gómez', document:'1.083.662.110', area:'Electricidad', maxHours:40, available:false },
      { id:'ins-05', name:'Mónica Peña', document:'55.116.982', area:'Administración', maxHours:36, available:true }
    ],
    fichas: [
      { id:'fic-01', number:'2874412', program:'233104 — Análisis y Desarrollo de Software', status:'EXECUTION', shift:'Diurna', modality:'Presencial', capacity:30, start:'15/01/2026' },
      { id:'fic-02', number:'3011550', program:'134401 — Contabilización de operaciones', status:'EXECUTION', shift:'Nocturna', modality:'Presencial', capacity:28, start:'03/02/2026' },
      { id:'fic-03', number:'2987701', program:'832221 — Electricidad industrial', status:'PRODUCTIVE_STAGE', shift:'Diurna', modality:'Presencial', capacity:25, start:'20/01/2026' },
      { id:'fic-04', number:'3124508', program:'122115 — Gestión administrativa', status:'INDUCTION', shift:'Mixta', modality:'Híbrida', capacity:32, start:'04/08/2026' },
      { id:'fic-05', number:'2763450', program:'821609 — Mantenimiento de equipos', status:'COMPLETED', shift:'Diurna', modality:'Presencial', capacity:24, start:'10/02/2025' }
    ],
    // G2 · notificación accionable: isRead (estado de lectura, distinto de status=send_status) + priority + category + deepLink.
    // 3 no leídas (not-01/02/03) → coincide con el badge "3" de la barra superior.
    notifications: [
      { id:'not-01', subject:'Cambio de ambiente', summary:'La sesión del miércoles fue trasladada al Laboratorio A-204.', date:'Hace 12 min', status:'SENT', scheduleId:'sch-03', isRead:false, priority:'HIGH', category:'SCHEDULE_CHANGED', deepLink:'/mi-horario/sesiones/ses-03' },
      { id:'not-02', subject:'Horario publicado', summary:'El horario de la ficha 2874412 ya está disponible.', date:'Hoy, 07:30', status:'SENT', scheduleId:'sch-01', isRead:false, priority:'NORMAL', category:'SCHEDULE_PUBLISHED', deepLink:'/mi-horario' },
      { id:'not-03', subject:'Sesión cancelada', summary:'La sesión del viernes 14 de agosto fue cancelada.', date:'Ayer, 16:10', status:'SENT', scheduleId:'sch-01', isRead:false, priority:'HIGH', category:'SCHEDULE_CHANGED', deepLink:'/mi-horario/sesiones/ses-05' },
      { id:'not-04', subject:'Seguimiento académico', summary:'Se registró una alerta de asistencia para la ficha 3011550.', date:'04/08/2026', status:'PENDING', scheduleId:null, isRead:true, priority:'NORMAL', category:'GENERAL', deepLink:'/notificaciones/not-04' },
      { id:'not-05', subject:'Actualización de horario', summary:'Se ajustó la franja de la competencia Modelar bases de datos.', date:'03/08/2026', status:'FAILED', scheduleId:'sch-02', isRead:true, priority:'NORMAL', category:'SCHEDULE_CHANGED', deepLink:'/mi-horario' }
    ],
    users: [
      { id:'usr-01', email:'maria.garcia@sena.edu.co', name:'María García', actor:'Coordinador', role:'COORDINATOR', active:true, lastAccess:'Hoy, 08:03' },
      { id:'usr-02', email:'juan.perez@sena.edu.co', name:'Juan Pérez', actor:'Instructor', role:'INSTRUCTOR', active:true, lastAccess:'Ayer, 18:41' },
      { id:'usr-03', email:'laura.martinez@soy.sena.edu.co', name:'Laura Martínez', actor:'Aprendiz', role:'LEARNER', active:true, lastAccess:'Hoy, 06:54' },
      { id:'usr-04', email:'carlos.ramirez@sena.edu.co', name:'Carlos Ramírez', actor:'Director', role:'CENTER_DIRECTOR', active:true, lastAccess:'05/08/2026' },
      { id:'usr-05', email:'ana.torres@sena.edu.co', name:'Ana Torres', actor:'Soporte', role:'ADMIN_STAFF', active:false, lastAccess:'31/07/2026' }
    ],
    documents: [
      { id:'doc-01', title:'Constancia de horario — Ficha 2874412', template:'CONSTANCIA_HORARIO', domain:'scheduling', owner:'sch-01', status:'AVAILABLE', version:3, created:'06/08/2026, 09:20' },
      { id:'doc-02', title:'Reporte de conflictos — Agosto 2026', template:'REPORTE_CONFLICTOS', domain:'scheduling', owner:'sch-02', status:'GENERATING', version:1, created:'06/08/2026, 08:12' },
      { id:'doc-03', title:'Seguimiento académico — Ficha 3011550', template:'SEGUIMIENTO_FICHA', domain:'monitoring', owner:'track-01', status:'GENERATION_FAILED', version:1, created:'05/08/2026, 15:31' },
      { id:'doc-04', title:'Constancia de matrícula — Ficha 2987701', template:'CONSTANCIA_MATRICULA', domain:'academic', owner:'fic-03', status:'AVAILABLE', version:2, created:'04/08/2026, 11:16' }
    ],
    templates: [
      { id:'tpl-01', code:'CONSTANCIA_HORARIO', name:'Constancia de horario', output:'PDF', version:3, versionStatus:'PUBLISHED', active:true, updated:'05/08/2026' },
      { id:'tpl-02', code:'REPORTE_CONFLICTOS', name:'Reporte de conflictos', output:'PDF', version:2, versionStatus:'PUBLISHED', active:true, updated:'01/08/2026' },
      { id:'tpl-03', code:'SEGUIMIENTO_FICHA', name:'Seguimiento de ficha', output:'PDF', version:5, versionStatus:'UNDER_REVIEW', active:true, updated:'30/07/2026' },
      { id:'tpl-04', code:'CONSTANCIA_MATRICULA', name:'Constancia de matrícula', output:'PDF', version:2, versionStatus:'OBSOLETE', active:false, updated:'22/07/2026' }
    ],
    audit: [
      { id:'evt-01', event:'SCHEDULE_PUBLISHED', entity:'schedule', entityId:'sch-03', actor:'María García', service:'scheduling-service', date:'06/08/2026, 08:45', outcome:'SUCCESS' },
      { id:'evt-02', event:'USER_ROLE_ASSIGNED', entity:'user', entityId:'usr-02', actor:'Carlos Ramírez', service:'iam-service', date:'05/08/2026, 16:02', outcome:'SUCCESS' },
      { id:'evt-03', event:'DOCUMENT_GENERATION_FAILED', entity:'document', entityId:'doc-03', actor:'Sistema', service:'document-service', date:'05/08/2026, 15:32', outcome:'FAILED' },
      { id:'evt-04', event:'CONFLICT_RESOLVED', entity:'scheduling_conflict', entityId:'conf-04', actor:'María García', service:'scheduling-service', date:'04/08/2026, 12:18', outcome:'SUCCESS' }
    ]
  };
})();
