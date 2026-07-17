const fs = require('fs');

function addJumps(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all edges (cells with edge="1")
    let edgeRegex = /(<mxCell[^>]+edge="1"[^>]+style=")([^"]*)(")/g;
    
    let modifications = 0;
    content = content.replace(edgeRegex, (match, p1, p2, p3) => {
        let style = p2;
        if (!style.includes('jumpStyle')) {
            style += 'jumpStyle=arc;jumpSize=15;';
            modifications++;
        }
        return p1 + style + p3;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}: Added jumps to ${modifications} edges.`);
}

addJumps('c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio');
addJumps('c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio');
