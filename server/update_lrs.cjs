const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
let content = fs.readFileSync(filePath, 'utf8');

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function unescapeDrawio(safe) {
    return safe
         .replace(/&#xa;/g, "\n")
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
         .replace(/&quot;/g, "\"")
         .replace(/&amp;/g, "&");
}

function processValue(text) {
    // Text from drawio might have &#xa; for newlines
    let lines = text.split('&#xa;');
    
    // We construct the HTML
    let html = `<table style="width: 100%; border-collapse: collapse; font-size: 14px; font-family: Helvetica;"><tbody>`;
    
    for (let line of lines) {
        if (!line.trim()) continue;
        
        let leftCol = '';
        let bottomBorder = false;
        
        // Handle markers
        if (line.includes('[PK]')) {
            leftCol = 'PK';
            line = line.replace(/\[PK\]\s*/g, '');
            bottomBorder = true; // Horizontal line under PK
        } else if (line.includes('[FK]')) {
            leftCol = 'FK';
            line = line.replace(/\[FK\]\s*/g, '');
        } else if (line.includes('[UK]')) {
            leftCol = 'UK';
            line = line.replace(/\[UK\]\s*/g, '');
        }
        
        // Parse type
        let parts = line.split(':');
        let rightCol = line.trim();
        if (parts.length >= 2) {
            let fieldName = parts[0].trim();
            let typeInfo = parts.slice(1).join(':').trim();
            typeInfo = typeInfo.replace(/\?/g, '');
            
            // Normalizations
            if (typeInfo.toLowerCase().startsWith('enum')) {
                 typeInfo = 'string';
            } else if (typeInfo.toLowerCase() === 'datetime') {
                 typeInfo = 'timestamp';
            } else if (typeInfo.toLowerCase() === 'decimal' || typeInfo.toLowerCase() === 'float') {
                 typeInfo = 'float';
            } else {
                 typeInfo = typeInfo.toLowerCase();
            }
            
            rightCol = `${fieldName} (${typeInfo})`;
        }
        
        let borderStyle = bottomBorder ? 'border-bottom: 1px solid black; ' : '';
        let leftBorder = 'border-right: 1px solid black; ';
        
        html += `
        <tr>
          <td style="width: 30px; ${leftBorder}${borderStyle}text-align: center; font-weight: bold; margin: 0; padding: 2px;">${leftCol}</td>
          <td style="${borderStyle}padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;">${rightCol}</td>
        </tr>`;
    }
    
    html += `</tbody></table>`;
    
    return escapeHtml(html);
}

// Match all text elements that contain [PK]
let modifications = 0;
content = content.replace(/(<mxCell[^>]+style=")([^"]*text[^"]*)(" value=")([^"]*\[PK\][^"]*)(" vertex="1">)/g, (match, p1, p2, p3, p4, p5) => {
    let style = p2;
    if (!style.includes('html=1;')) style += 'html=1;';
    if (!style.includes('whiteSpace=wrap;')) style += 'whiteSpace=wrap;';
    
    let newValue = processValue(p4);
    modifications++;
    return p1 + style + p3 + newValue + p5;
});

fs.writeFileSync(filePath, content);
console.log(`LRS diagram format updated. Modified ${modifications} tables.`);
