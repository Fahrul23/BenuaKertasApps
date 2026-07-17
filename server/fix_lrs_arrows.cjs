const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
let content = fs.readFileSync(filePath, 'utf8');

// Edge IDs that represent our relationships
const edgeIds = [
    'rel_users_orders',
    'uDtmU2JtukKAV0vTKXBA-1',
    'rel_orders_history',
    'uDtmU2JtukKAV0vTKXBA-17',
    'uDtmU2JtukKAV0vTKXBA-16',
    'uDtmU2JtukKAV0vTKXBA-11',
    'rel_plano_prices',
    'uDtmU2JtukKAV0vTKXBA-3',
    'uDtmU2JtukKAV0vTKXBA-15',
    'rel_finishing_orders'
];

for (const edgeId of edgeIds) {
    // 1. Remove all labels attached to this edge.
    // Labels are cells where parent="edgeId"
    let labelRegex = new RegExp(`<mxCell[^>]*parent="${edgeId}"[\\s\\S]*?<\\/mxCell>`, 'g');
    content = content.replace(labelRegex, '');
    
    // Also remove empty labels like value="1" if they are single line
    let labelRegex2 = new RegExp(`<mxCell[^>]*parent="${edgeId}"[^>]*\\/>`, 'g');
    content = content.replace(labelRegex2, '');

    // 2. Change the arrow style of the edge
    // Since source is Parent (PK) and target is Child (FK), 
    // and the LRS standard (from image) points FROM FK TO PK.
    // The arrow head should be at the source (Parent).
    // So startArrow=classic; endArrow=none;
    
    let edgeRegex = new RegExp(`(<mxCell id="${edgeId}"[^>]*style=")([^"]*)(")`, 'g');
    content = content.replace(edgeRegex, (match, p1, p2, p3) => {
        let style = p2;
        // Remove existing start/end arrow styles
        style = style.replace(/startArrow=[^;]*;/g, '')
                     .replace(/endArrow=[^;]*;/g, '')
                     .replace(/startFill=[^;]*;/g, '')
                     .replace(/endFill=[^;]*;/g, '')
                     .replace(/endSize=[^;]*;/g, '');
        
        // Add new arrow styles pointing to source (Parent/PK)
        // startArrow=classic; startFill=1; endArrow=none;
        style += 'startArrow=classic;startFill=1;endArrow=none;endFill=0;';
        
        return p1 + style + p3;
    });
}

// Clean up any stray labels that were not matched just in case (e.g. lbl_1000)
content = content.replace(/<mxCell id="lbl_[^>]*>[\\s\\S]*?<\/mxCell>/g, '');
content = content.replace(/<mxCell id="bwyao[^>]*>[\\s\\S]*?<\/mxCell>/g, '');

fs.writeFileSync(filePath, content);
console.log('Labels removed and arrow heads updated to point to PK.');
