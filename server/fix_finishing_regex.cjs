const fs = require('fs');

function updateLRSDiagram() {
    const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Updated regex to account for optional <font> tags and whitespace
    const laminationRowRegex = /(<td[^>]*>(?:<font[^>]*>)?laminationType \(string\)(?:<\/font>)?<\/td>\s*<\/tr>)/i;
    
    if (!content.includes('finishing (string)')) {
        const newRow = `<tr><td style="width: 30px; border-right: 1px solid black; text-align: center; font-weight: bold; margin: 0; padding: 2px;">FK</td><td style="padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;">finishing (string)</td></tr>`;
        
        if (laminationRowRegex.test(content)) {
            content = content.replace(laminationRowRegex, `$1${newRow}`);
            console.log('LRS Diagram updated: Added finishing row to HTML table.');
        } else {
            console.log('Regex failed to match laminationType row in LRS!');
        }
    } else {
        console.log('LRS Diagram already has finishing row.');
    }
    
    fs.writeFileSync(filePath, content);
}

updateLRSDiagram();
