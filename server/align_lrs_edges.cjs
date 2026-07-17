const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\LRS.drawio';
let content = fs.readFileSync(filePath, 'utf8');

const mapping = {
    'rel_users_orders': { src: 't_users', tgt: 't_orders', exitX: 1, exitY: 0.0986, entryX: 0, entryY: 0.0907 },
    'uDtmU2JtukKAV0vTKXBA-1': { src: 't_orders', tgt: 't_payments', exitX: 1, exitY: 0.0438, entryX: 1, entryY: 0.1329 }, // orders.id to payments.orderId
    'rel_orders_history': { src: 't_orders', tgt: 't_order_history', exitX: 0, exitY: 0.0438, entryX: 1, entryY: 0.227 }, // orders.id to order_history.orderId
    'uDtmU2JtukKAV0vTKXBA-17': { src: 'uDtmU2JtukKAV0vTKXBA-13', tgt: 't_orders', exitX: 0, exitY: 0.1075, entryX: 1, entryY: 0.1141 }, // box_models to orders.boxModel
    'uDtmU2JtukKAV0vTKXBA-16': { src: 'uDtmU2JtukKAV0vTKXBA-5', tgt: 't_orders', exitX: 0, exitY: 0.1145, entryX: 1, entryY: 0.1376 }, // materials to orders.material
    'uDtmU2JtukKAV0vTKXBA-11': { src: 'uDtmU2JtukKAV0vTKXBA-5', tgt: 'uDtmU2JtukKAV0vTKXBA-9', exitX: 0, exitY: 0.1145, entryX: 0, entryY: 0.229 }, // materials to material_prices
    'rel_plano_prices': { src: 't_plano_types', tgt: 'uDtmU2JtukKAV0vTKXBA-9', exitX: 1, exitY: 0.1365, entryX: 1, entryY: 0.170 }, // plano to material_prices
    'uDtmU2JtukKAV0vTKXBA-3': { src: 't_users', tgt: 't_payments', exitX: 1, exitY: 0.0986, entryX: 0, entryY: 0.1792 }, // users.id to payments.verifiedBy
    'uDtmU2JtukKAV0vTKXBA-15': { src: 't_users', tgt: 't_order_history', exitX: 0, exitY: 0.0986, entryX: 0, entryY: 0.306 }, // users.id to order_history.changedBy
    'rel_finishing_orders': { src: 't_finishing_options', tgt: 't_orders', exitX: 0, exitY: 0.1365, entryX: 0, entryY: 0.0438 } // finishing to orders
};

for (const [id, config] of Object.entries(mapping)) {
    let regex = new RegExp(`(<mxCell id="${id}"[^>]*?)>`);
    let match = content.match(regex);
    if (match) {
        let cellAttr = match[1];
        
        cellAttr = cellAttr.replace(/\s*source="[^"]*"/, '');
        cellAttr = cellAttr.replace(/\s*target="[^"]*"/, '');
        
        let styleMatch = cellAttr.match(/style="([^"]*)"/);
        if (styleMatch) {
            let style = styleMatch[1];
            style = style.replace(/exit[XY]=[^;]*;/g, '');
            style = style.replace(/entry[XY]=[^;]*;/g, '');
            style = style.replace(/exitDx=[^;]*;/g, '');
            style = style.replace(/exitDy=[^;]*;/g, '');
            style = style.replace(/entryDx=[^;]*;/g, '');
            style = style.replace(/entryDy=[^;]*;/g, '');
            style = style.replace(/entryPerimeter=[^;]*;/g, '');
            style = style.replace(/exitPerimeter=[^;]*;/g, '');
            
            style += `exitX=${config.exitX};exitY=${config.exitY};entryX=${config.entryX};entryY=${config.entryY};`;
            
            cellAttr = cellAttr.replace(/style="([^"]*)"/, `style="${style}"`);
        }
        
        cellAttr += ` source="${config.src}" target="${config.tgt}"`;
        content = content.replace(regex, cellAttr + '>');
        
        // Remove Array points so Drawio auto-routes cleanly
        let arrayRegex = new RegExp(`(<mxCell id="${id}"[\\s\\S]*?<mxGeometry[^>]*>)\\s*<Array as="points">[\\s\\S]*?</Array>`, 'm');
        content = content.replace(arrayRegex, '$1');
        
        // Also remove sourcePoint and targetPoint inside mxGeometry as they override relative routing
        let ptRegex = new RegExp(`(<mxCell id="${id}"[\\s\\S]*?<mxGeometry[^>]*>)([\\s\\S]*?)(</mxGeometry>)`, 'm');
        content = content.replace(ptRegex, (m, g1, g2, g3) => {
             let cleaned = g2.replace(/<mxPoint [^>]*as="sourcePoint"[^>]*\/>\s*/g, '')
                             .replace(/<mxPoint [^>]*as="targetPoint"[^>]*\/>\s*/g, '');
             return g1 + cleaned + g3;
        });
    }
}

fs.writeFileSync(filePath, content);
console.log('LRS edges updated to attach to specific rows.');
