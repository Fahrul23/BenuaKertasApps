const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
let content = fs.readFileSync(filePath, 'utf8');

// Fix fields
content = content.replace(/value="([^"]+___________________________[^"]+)"/g, (match, inner) => {
    let lines = inner.split('&#xa;');
    let isMethodSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.includes('___________________________')) {
            isMethodSection = true;
            continue;
        }
        
        if (!isMethodSection) {
            // Remove DB constraints
            line = line.replace(/\[PK\]\s*/g, '');
            line = line.replace(/\[FK\]\s*/g, '');
            line = line.replace(/\[UK\]\s*/g, '');
            
            // Remove question marks (optional types)
            line = line.replace(/\?/g, '');
            
            // Add private marker if it doesn't have one and is not empty
            line = line.trim();
            if (line.length > 0 && !line.startsWith('-') && !line.startsWith('+') && !line.startsWith('#')) {
                line = '- ' + line;
            }
            
            lines[i] = line;
        }
    }
    
    return `value="${lines.join('&#xa;')}"`;
});

// Fix relation labels
content = content.replace(/value="1 : N"/g, 'value="1...*"');
content = content.replace(/value="1 : N \(logical\)"/g, 'value="1...*"');
content = content.replace(/value="verifiedBy"/g, 'value="1...*"');
content = content.replace(/value="changedBy"/g, 'value="1...*"');

fs.writeFileSync(filePath, content);
console.log('Server Class diagram fixed.');
