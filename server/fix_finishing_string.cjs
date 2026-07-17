const fs = require('fs');

function updateLRSDiagram() {
    const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('finishing (string)')) {
        const laminationIndex = content.indexOf('laminationType (string)');
        if (laminationIndex !== -1) {
            const trEndIndex = content.indexOf('</tr>', laminationIndex);
            if (trEndIndex !== -1) {
                const insertionPoint = trEndIndex + 5; // length of </tr>
                
                const newRow = `         <tr>           <td style="width: 30px; border-right: 1px solid black; text-align: center; font-weight: bold; margin: 0px; padding: 2px;"><font>FK</font></td>           <td style="padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;"><font>finishing (string)</font></td>         </tr>`;
                
                content = content.slice(0, insertionPoint) + newRow + content.slice(insertionPoint);
                fs.writeFileSync(filePath, content);
                console.log('Successfully inserted finishing row!');
            }
        } else {
            console.log('laminationType not found');
        }
    } else {
        console.log('Already contains finishing row');
    }
}

updateLRSDiagram();
