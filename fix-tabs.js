const fs = require('fs');

const files = [
  "components/blueprint/tabs/dashboard-tab.tsx",
  "components/blueprint/tabs/bpmn-tab.tsx",
  "components/blueprint/tabs/db-tab.tsx",
  "components/blueprint/tabs/wireframe-tab.tsx",
  "components/blueprint/tabs/roadmap-tab.tsx"
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"use client"[\s;]*\n?/g, '');
  content = content.replace(/'use client'[\s;]*\n?/g, '');
  content = '"use client";\n' + content;
  fs.writeFileSync(file, content, 'utf8');
});
