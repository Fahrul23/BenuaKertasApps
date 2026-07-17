const fs = require('fs');

function updateClassDiagram() {
    const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
    let content = fs.readFileSync(filePath, 'utf8');

    // Add finishing field after laminationType
    if (!content.includes('- finishing: String')) {
        content = content.replace(/- laminationType: String&#xa;/g, '- laminationType: String&#xa;- finishing: String&#xa;');
        fs.writeFileSync(filePath, content);
        console.log('Class Diagram updated: Added finishing field.');
    } else {
        console.log('Class Diagram already has finishing field.');
    }
}

function updateLRSDiagram() {
    const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
    let content = fs.readFileSync(filePath, 'utf8');

    // Add finishing row after laminationType in the HTML table
    const laminationRowRegex = /(<td style="[^"]*">laminationType \(string\)<\/td>\s*<\/tr>)/;
    if (!content.includes('finishing (string)')) {
        const newRow = `
        <tr>
          <td style="width: 30px; border-right: 1px solid black; text-align: center; font-weight: bold; margin: 0; padding: 2px;">FK</td>
          <td style="padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;">finishing (string)</td>
        </tr>`;

        content = content.replace(laminationRowRegex, `$1${newRow}`);
        console.log('LRS Diagram updated: Added finishing row to HTML table.');
    } else {
        console.log('LRS Diagram already has finishing row.');
    }

    // Update entryY for rel_finishing_orders
    // Previous was entryY=0.0438, new is 0.255
    const edgeRegex = /(<mxCell id="rel_finishing_orders"[^>]*style="[^"]*entryY=)[^;]+(;"[^>]*>)/;
    if (edgeRegex.test(content)) {
        content = content.replace(edgeRegex, '$10.255$2');
        console.log('LRS Diagram updated: Adjusted entryY for finishing_options edge.');
    }

    fs.writeFileSync(filePath, content);
}

updateClassDiagram();
updateLRSDiagram();
