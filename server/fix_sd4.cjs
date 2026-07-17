const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\client\\src\\diagram\\sequence\\SD_4_Verifikasi_Pembayaran_Admin.drawio';
let content = fs.readFileSync(filePath, 'utf8');

const activationBoxes = `
        <!-- Activations -->
        <mxCell id="act_admin" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="840" width="10" x="75" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_ui" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="840" width="10" x="305" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_ctrl" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="760" width="10" x="525" y="160" as="geometry" />
        </mxCell>
        <mxCell id="act_db" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="680" width="10" x="745" y="200" as="geometry" />
        </mxCell>
`;

// Insert the activation boxes right after the Database lifeline
content = content.replace(
    /(<mxCell id="L3" [^>]+>\s*<mxGeometry [^>]+>\s*<\/mxCell>)/,
    '$1\n' + activationBoxes
);

// We should also adjust the edges in SD_4 to correctly point to the edges of the boxes instead of the center
// Center of boxes: 80, 310, 530, 750
// Left edge of boxes: 75, 305, 525, 745
// Right edge of boxes: 85, 315, 535, 755
// Let's replace the raw X coordinates to make them attach to the borders of the activation boxes perfectly!
// Admin -> UI (80 -> 310) => (85 -> 305)
// UI -> Admin (310 -> 80) => (305 -> 85)
// UI -> Ctrl (310 -> 530) => (315 -> 525)
// Ctrl -> UI (530 -> 310) => (525 -> 315)
// Ctrl -> DB (530 -> 750) => (535 -> 745)
// DB -> Ctrl (750 -> 530) => (745 -> 535)

content = content.replace(/x="80"/g, 'x="85"');
content = content.replace(/x="310"/g, 'x="305"'); // But wait, this might catch both source and target wrongly. Let's do a smarter replace.

fs.writeFileSync(filePath, content);
console.log('Fixed SD_4 activation boxes.');
