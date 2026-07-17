const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/value="1\.\.\.\*"/g, 'value="1 -&gt; 1...*"');

fs.writeFileSync(filePath, content);
console.log('Fixed edge values to 1 -> 1...*');
