const fs = require('fs');

const filePaths = [
    'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio'
];

const methodsMapping = {
    'fields_users': ['+ register()', '+ login()', '+ updateProfile()', '+ resetPassword()'],
    'fields_orders': ['+ createOrder()', '+ calculatePricing()', '+ updateStatus()', '+ cancelOrder()'],
    'fields_order_history': ['+ addHistory()', '+ getHistoryByOrder()'],
    'fields_payments': ['+ uploadProof()', '+ verifyPayment()', '+ rejectPayment()'],
    'fields_finishing_options': ['+ create()', '+ update()', '+ delete()'],
    'fields_plano_types': ['+ create()', '+ update()', '+ delete()'],
    'uDtmU2JtukKAV0vTKXBA-6': ['+ create()', '+ update()', '+ delete()'], // materials
    'uDtmU2JtukKAV0vTKXBA-10': ['+ setPrice()', '+ getPrice()', '+ updatePrice()'], // material_prices
    'uDtmU2JtukKAV0vTKXBA-14': ['+ create()', '+ update()', '+ delete()'] // box_models
};

filePaths.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        Object.keys(methodsMapping).forEach(id => {
            const methods = methodsMapping[id];
            const methodsStr = `___________________________&#xa;${methods.join('&#xa;')}`;
            
            // We find the <mxCell id="..."> ... value="...&#xa;" ...
            // And inject the methodsStr right before the closing quote of value="..."
            
            const regex = new RegExp(`(<mxCell id="${id}"[^>]*value="[^"]*?)(&#xa;)?"( [^>]*>)`);
            
            if (regex.test(content)) {
                // Ensure there is a trailing &#xa; before appending
                content = content.replace(regex, (match, p1, p2, p3) => {
                    const separator = p2 ? '' : '&#xa;';
                    return `${p1}${separator}${methodsStr}"${p3}`;
                });
                console.log(`Updated ${id}`);
            } else {
                console.log(`Failed to match ${id}`);
            }
        });
        
        fs.writeFileSync(filePath, content);
        console.log(`Successfully updated ${filePath}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});
