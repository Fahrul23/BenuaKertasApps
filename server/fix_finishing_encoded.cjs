const fs = require('fs');

function updateLRSDiagram() {
    const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Insert finishing row
    const targetString = '&lt;td style=&quot;padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;&quot;&gt;&lt;font&gt;laminationType (string)&lt;/font&gt;&lt;/td&gt;         &lt;/tr&gt;';
    
    const newRowEncoded = '         &lt;tr&gt;           &lt;td style=&quot;width: 30px; border-right: 1px solid black; text-align: center; font-weight: bold; margin: 0px; padding: 2px;&quot;&gt;&lt;font&gt;FK&lt;/font&gt;&lt;/td&gt;           &lt;td style=&quot;padding-left: 6px; margin: 0; padding-top: 2px; padding-bottom: 2px;&quot;&gt;&lt;font&gt;finishing (string)&lt;/font&gt;&lt;/td&gt;         &lt;/tr&gt;';
    
    if (content.includes(targetString)) {
        content = content.replace(targetString, targetString + newRowEncoded);
        console.log('Inserted finishing row successfully.');
    } else {
        console.log('Could not find laminationType row.');
    }
    
    // 2. Adjust entryY
    const targetEdge = 'id="rel_finishing_orders"';
    if (content.includes(targetEdge)) {
        content = content.replace(/entryY=0\.0438;/g, 'entryY=0.255;');
        console.log('Adjusted entryY successfully.');
    }
    
    fs.writeFileSync(filePath, content);
}

updateLRSDiagram();
