const fs = require('fs');

const filePaths = [
    'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio'
];

filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the generic methods and the separator line
        // We match: ___________________________&#xa;+ create()&#xa;+ update()&#xa;+ delete()
        // Sometimes it might not have the separator if it was added manually differently, 
        // so we can use regex to remove anything after ____________
        
        const methodRegex = /_{5,}&#xa;\+\s*create\(\)&#xa;\+\s*update\(\)&#xa;\+\s*delete\(\)/g;
        
        if (methodRegex.test(content)) {
            content = content.replace(methodRegex, '');
            fs.writeFileSync(filePath, content);
            console.log(`Successfully removed methods from ${filePath}`);
        } else {
            console.log(`No methods found to remove in ${filePath}`);
        }
    } else {
        console.log(`File not found: ${filePath}`);
    }
});
