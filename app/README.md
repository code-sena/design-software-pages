# SENA — Gestión de Horarios · Mockup navegable

Prototipo estático de revisión UX/UI. No corresponde al frontend productivo y no consume backend.
La implementación vive exclusivamente en `docs/design-software-docs/12-ux-ui/mockup-ddd/mockups/app/`.

## Abrir el prototipo

### Opción recomendada

Desde esta carpeta:

```bash
python3 -m http.server 8080
```

Abrir:

```text
http://localhost:8080/#/inventory
```

### Apertura directa

También puede abrirse `index.html` directamente en el navegador. Para entrar al índice maestro use
`review.html` o agregue `#/inventory` al final de la URL.

## Usuarios de demostración

El formulario de login determina el rol a partir del correo. La contraseña es simulada y no se valida.

| Rol | Correo de prueba | Inicio |
|---|---|---|
| Coordinador Académico | `coordinador@sena.edu.co` | `#/` |
| Instructor | `instructor@sena.edu.co` | `#/instructor/mi-horario` |
| Aprendiz | `aprendiz@soy.sena.edu.co` | `#/mi-horario` |
| Director de Centro | `director@sena.edu.co` | `#/admin/indicadores` |
| Administrador de Soporte | `soporte@sena.edu.co` | `#/backoffice/documentos` |

En modo revisión, el menú superior permite cambiar de rol sin volver al login.

## Arquitectura del prototipo

```text
app/
├── index.html
├── review.html
├── README.md
├── VALIDATION.md
├── assets/
│   ├── tokens.css
│   ├── components.css
│   ├── app.css
│   ├── icons.js
│   └── components.js
├── data/
│   └── mock-data.js
├── shell/
│   ├── app.js
│   ├── routes.js
│   ├── screens.js
│   └── shell.js
├── iam/
├── scheduling/
├── academic/
├── environment/
├── actors/
├── document/
├── monitoring/
├── audit/
└── reference/
```

- `assets/tokens.css`: único set de tokens compartidos.
- `assets/components.js`: componentes reutilizables: estados, tablas, paginación, filtros, KPI, modales, tabs y estados de carga/vacío/error.
- `shell/app.js`: router hash, interacciones y guards RBAC.
- `shell/routes.js`: rutas, navegación por rol e inventario maestro.
- Cada carpeta de dominio registra únicamente sus vistas; no redefine el design-system.

## Estados de revisión

Los estados se activan dentro del fragmento de URL:

```text
#/horarios?state=loading&as=coordinator
#/horarios?state=empty&as=coordinator
#/horarios?state=error&as=coordinator
#/horarios?offline=1&as=coordinator
```

Otros ejemplos:

```text
#/review/app-shell?overlay=notifications&as=coordinator
#/system-states?variant=403&as=coordinator
#/system-states?variant=404&as=coordinator
#/system-states?variant=500&as=coordinator
#/system-states?variant=session&as=coordinator
```

El acceso directo con un rol no autorizado muestra `403`. Ejemplo:

```text
#/backoffice/auditoria?as=learner
```

## Flujos navegables principales

1. Coordinador: Inicio → Horarios → Crear/editar → Validar → Conflictos → Resolver → Publicar → Detalle de solo lectura.
2. Coordinador: Disponibilidad → Detalle de ambiente.
3. Coordinador: Fichas → Detalle de ficha → Horarios relacionados.
4. Instructor: Mi horario → Detalle de sesión; Mi disponibilidad → Crear excepción; Seguimiento → Registrar seguimiento.
5. Aprendiz: Mi horario → Detalle de clase; Notificaciones → Detalle de notificación.
6. Director: Indicadores → Drill-down; Usuarios → Detalle/roles; Datos de referencia.
7. Back-office: Documentos → Detalle/versiones; Plantillas → Editor/preview; Auditoría → Payload; Parametrización → CRUD.
8. Auth: Login → recuperación → nueva contraseña → experiencia por rol.

## Gaps del contrato conservados como TODO

No se inventaron endpoints para los gaps documentados:

- `B1`: auditoría sin API REST expuesta.
- `B2`: permiso `SCH_VIEW_OWN` no cableado para la consulta del aprendiz.
- `B3`: seguimiento del instructor requiere un permiso superior en el contrato actual.
- `G2`: no existe endpoint consolidado de instructores disponibles.

Las vistas relacionadas usan datos mock limitados y mantienen comentarios `TODO` en el código.

## Mapa de las 53 pantallas y modales

El índice interactivo está disponible en `review.html` y en `#/inventory`.

Las 90 capturas de referencia están documentadas en [`screenshots/README.md`](screenshots/README.md): 45 desktop y 45 móviles. **Nota:** las 8 nuevas pantallas de parametrización (46–53) aún no tienen captura; quedan pendientes de captura (desktop y móvil).

| # | Grupo | Pantalla / modal | Rol | MFE | Ruta de revisión |
|---:|---|---|---|---|---|
| 1 | Auth y shell | Login | public | iam | `index.html#/login?as=public` |
| 2 | Auth y shell | Recuperar contraseña | public | iam | `index.html#/forgot-password?as=public` |
| 3 | Auth y shell | Nueva contraseña | public | iam | `index.html#/reset-password?as=public` |
| 4 | Auth y shell | App Shell por rol | coordinator | shell | `index.html#/review/app-shell?as=coordinator` |
| 5 | Auth y shell | Panel de notificaciones | coordinator | shell | `index.html#/review/app-shell?overlay=notifications&as=coordinator` |
| 6 | Auth y shell | Estados globales | coordinator | shell | `index.html#/system-states?as=coordinator` |
| 7 | Coordinador | Dashboard / Inicio | coordinator | shell + scheduling + academic | `index.html#/?as=coordinator` |
| 8 | Coordinador | Horarios — lista | coordinator | scheduling | `index.html#/horarios?as=coordinator` |
| 9 | Coordinador | Detalle de horario | coordinator | scheduling | `index.html#/horarios/sch-03?as=coordinator` |
| 10 | Coordinador | Crear / editar horario | coordinator | scheduling | `index.html#/horarios/nuevo?as=coordinator` |
| 11 | Coordinador | Modal agregar / editar sesión | coordinator | scheduling | `index.html#/horarios/sch-01?modal=session&as=coordinator` |
| 12 | Coordinador | Modal confirmar publicación | coordinator | scheduling | `index.html#/horarios/sch-02?modal=publish&as=coordinator` |
| 13 | Coordinador | Panel de conflictos | coordinator | scheduling | `index.html#/horarios/sch-02/conflictos?as=coordinator` |
| 14 | Coordinador | Modal resolver conflicto | coordinator | scheduling | `index.html#/horarios/sch-02/conflictos?modal=resolve&as=coordinator` |
| 15 | Coordinador | Disponibilidad | coordinator | environment + actors | `index.html#/disponibilidad?as=coordinator` |
| 16 | Coordinador | Detalle de ambiente | coordinator | environment | `index.html#/disponibilidad/ambientes/env-01?as=coordinator` |
| 17 | Coordinador | Fichas — lista | coordinator | academic | `index.html#/fichas?as=coordinator` |
| 18 | Coordinador | Detalle de ficha | coordinator | academic | `index.html#/fichas/fic-01?as=coordinator` |
| 19 | Instructor | Mi horario — semana | instructor | scheduling | `index.html#/instructor/mi-horario?as=instructor` |
| 20 | Instructor | Detalle de sesión | instructor | scheduling | `index.html#/instructor/mi-horario?panel=session&as=instructor` |
| 21 | Instructor | Mi disponibilidad | instructor | actors | `index.html#/instructor/mi-disponibilidad?as=instructor` |
| 22 | Instructor | Modal crear excepción | instructor | actors | `index.html#/instructor/mi-disponibilidad?modal=exception&as=instructor` |
| 23 | Instructor | Seguimiento de ficha | instructor | monitoring | `index.html#/instructor/seguimiento?as=instructor` |
| 24 | Instructor | Registrar seguimiento | instructor | monitoring | `index.html#/instructor/seguimiento?modal=tracking&as=instructor` |
| 25 | Aprendiz | Mi horario — semana | learner | scheduling | `index.html#/mi-horario?as=learner` |
| 26 | Aprendiz | Notificaciones | learner | monitoring | `index.html#/notificaciones?as=learner` |
| 27 | Aprendiz | Detalle de clase | learner | scheduling | `index.html#/mi-horario/sesiones/ses-01?as=learner` |
| 28 | Aprendiz | Detalle de notificación | learner | monitoring | `index.html#/notificaciones/not-01?as=learner` |
| 29 | Administrador | Panel de indicadores | director | monitoring | `index.html#/admin/indicadores?as=director` |
| 30 | Administrador | Drill-down de KPI | director | monitoring | `index.html#/admin/indicadores/track-01/attendance?as=director` |
| 31 | Administrador | Usuarios — lista | director | iam | `index.html#/admin/usuarios?as=director` |
| 32 | Administrador | Crear / editar usuario | director | iam | `index.html#/admin/usuarios?modal=user&as=director` |
| 33 | Administrador | Detalle de usuario | director | iam | `index.html#/admin/usuarios/usr-02?as=director` |
| 34 | Administrador | Modal asignar / revocar rol | director | iam | `index.html#/admin/usuarios/usr-02?modal=role&as=director` |
| 35 | Administrador | Datos de referencia | director | reference | `index.html#/admin/datos-referencia?as=director` |
| 36 | Administrador | Editar catálogo / valor / parámetro | director | reference | `index.html#/admin/datos-referencia?modal=reference&as=director` |
| 37 | Back-office | Documentos — lista | support | document | `index.html#/backoffice/documentos?as=support` |
| 38 | Back-office | Plantillas de documento | support | document | `index.html#/backoffice/documentos/plantillas?as=support` |
| 39 | Back-office | Auditoría | support | audit | `index.html#/backoffice/auditoria?as=support` |
| 40 | Back-office | Parametrización / catálogos | support | reference | `index.html#/backoffice/parametrizacion?as=support` |
| 41 | Back-office | Detalle de documento + versiones | support | document | `index.html#/backoffice/documentos/doc-01?as=support` |
| 42 | Back-office | Modal generar documento | support | document | `index.html#/backoffice/documentos?modal=generate&as=support` |
| 43 | Back-office | Editor / preview de plantilla | support | document | `index.html#/backoffice/documentos/plantillas/tpl-01/editar?as=support` |
| 44 | Back-office | Modal detalle de auditoría | support | audit | `index.html#/backoffice/auditoria?modal=audit&as=support` |
| 45 | Back-office | CRUD catálogo / valor / parámetro | support | reference | `index.html#/backoffice/parametrizacion?modal=crud&as=support` |
| 46 | Parametrización | Hub de parametrización | director + support | reference | `index.html#/admin/parametrizacion?as=director` |
| 47 | Parametrización | Currículo académico | director + support | academic | `index.html#/admin/parametrizacion/curriculo?as=director` |
| 48 | Parametrización | Jornadas / franjas horarias | director + support | scheduling | `index.html#/admin/parametrizacion/jornadas?as=director` |
| 49 | Parametrización | Tipos de ambiente e inventario | director + support | environment | `index.html#/admin/parametrizacion/ambientes?as=director` |
| 50 | Parametrización | Catálogos de monitoreo (KPI/alertas) | director + support | monitoring | `index.html#/admin/parametrizacion/monitoreo?as=director` |
| 51 | Parametrización | Estados de actores | director + support | actors | `index.html#/admin/parametrizacion/estados?as=director` |
| 52 | Parametrización | Geografía institucional | director + support | reference | `index.html#/admin/parametrizacion/geografia?as=director` |
| 53 | Parametrización | RBAC — roles y permisos | director + support | iam | `index.html#/admin/parametrizacion/rbac?as=director` |

## Restricciones del prototipo

- Las acciones modifican navegación/estado visual, pero no persisten datos fuera de `localStorage` del rol activo.
- No existe autenticación real, integración API, generación de archivos ni descarga firmada.
- Los datos son mock coherentes con el dominio y fechas de 2026.
