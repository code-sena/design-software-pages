const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
global.window = global;

const files = [
  'assets/icons.js',
  'data/mock-data.js',
  'assets/components.js',
  'shell/routes.js',
  'iam/screens.js',
  'scheduling/screens.js',
  'environment/screens.js',
  'academic/screens.js',
  'actors/screens.js',
  'monitoring/screens.js',
  'reference/screens.js',
  'document/screens.js',
  'audit/screens.js',
  'shell/screens.js',
  'shell/shell.js'
];

for (const file of files) {
  vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
}

const mockup = global.Mockup;
if (!mockup || mockup.inventory.length !== 53) {
  throw new Error(`Inventario inválido: ${mockup?.inventory?.length ?? 0}/53`);
}

let failures = 0;
for (const item of mockup.inventory) {
  const [routePath, query = ''] = item.route.split('?');
  const definition = mockup.routeDefinitions.find(candidate => candidate.pattern.test(routePath));
  if (!definition) {
    console.error(`${item.n}: ruta no registrada: ${item.route}`);
    failures += 1;
    continue;
  }

  const match = routePath.match(definition.pattern);
  const role = item.role === 'public' ? 'coordinator' : item.role;
  const context = {
    path: routePath,
    query: new URLSearchParams(query),
    params: match.slice(1),
    role,
    state: 'normal',
    offline: false,
    readonly: role === 'director'
  };

  const renderer = mockup.screens[definition.screen];
  if (typeof renderer !== 'function') {
    console.error(`${item.n}: renderer ausente: ${definition.screen}`);
    failures += 1;
    continue;
  }

  try {
    const content = renderer(context);
    const html = definition.public ? content : mockup.renderShell(context, content);
    if (typeof html !== 'string' || html.length < 20) throw new Error('HTML vacío');
    console.log(`${String(item.n).padStart(2, '0')} OK · ${item.name}`);
  } catch (error) {
    console.error(`${item.n}: ${item.name}: ${error.message}`);
    failures += 1;
  }
}

if (failures > 0) process.exit(1);
console.log('\n53/53 pantallas y modales renderizados correctamente.');
