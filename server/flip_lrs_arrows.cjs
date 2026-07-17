const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
let content = fs.readFileSync(filePath, 'utf8');

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
    let edgeRegex = new RegExp(`(<mxCell id="${edgeId}"[^>]*style=")([^"]*)(")`, 'g');
    content = content.replace(edgeRegex, (match, p1, p2, p3) => {
        let style = p2;
        
        // Remove existing start/end arrow styles
        style = style.replace(/startArrow=[^;]*;/g, '')
                     .replace(/endArrow=[^;]*;/g, '')
                     .replace(/startFill=[^;]*;/g, '')
                     .replace(/endFill=[^;]*;/g, '')
                     .replace(/endSize=[^;]*;/g, '');
        
        // Add new arrow styles pointing to target (Child/FK)
        // startArrow=none; endArrow=classic; endFill=1;
        style += 'startArrow=none;startFill=0;endArrow=classic;endFill=1;';
        
        return p1 + style + p3;
    });
}

fs.writeFileSync(filePath, content);
console.log('Arrow directions inverted. Now pointing from Parent (PK) to Child (FK).');
