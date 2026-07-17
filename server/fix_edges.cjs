const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/(<mxCell[^>]+edge="1"[^>]*?)value=""/g, '$1value="1...*"');
content = content.replace(/(<mxCell[^>]*?)value=""([^>]*?edge="1")/g, '$1value="1...*"$2');

fs.writeFileSync(filePath, content);
console.log('Fixed edge values in Class_Diagram_Fix.drawio');
