const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    /(<mxCell id="goA0pv4Z0V_NtRqpX0CK-21"[^>]*value=")([^"]+)(")/,
    '$1&lt;font style=&quot;font-size: 14px;&quot;&gt;&lt;b&gt;1....*&lt;/b&gt;&lt;/font&gt;$3'
);
content = content.replace(
    /(<mxCell id="goA0pv4Z0V_NtRqpX0CK-22"[^>]*value=")([^"]+)(")/,
    '$1&lt;font style=&quot;font-size: 14px;&quot;&gt;&lt;b&gt;1&lt;/b&gt;&lt;/font&gt;$3'
);

fs.writeFileSync(filePath, content);
console.log('Fixed flipped relation label on users to order_history');
