const fs = require('fs');

const filePath = 'c:\\Kuliah\\Project\\BenuaKertasApps\\server\\diagram\\Class_Diagram_Fix.drawio';
let content = fs.readFileSync(filePath, 'utf8');

// The original edge snippet is:
/*
        <mxCell id="uDtmU2JtukKAV0vTKXBA-15" edge="1" parent="1" style="endArrow=block;endFill=0;endSize=10;edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;strokeWidth=2;startArrow=oval;startFill=1;strokeColor=#000000;fontColor=#000000;fontStyle=1;" value="">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="369.44" y="440" />
              <mxPoint x="369.44" y="250" />
            </Array>
            <mxPoint x="369.44" y="440" as="sourcePoint" />
            <mxPoint x="369" y="220" as="targetPoint" />
          </mxGeometry>
        </mxCell>
*/

const originalEdge = `<mxCell id="uDtmU2JtukKAV0vTKXBA-15" edge="1" parent="1" style="endArrow=block;endFill=0;endSize=10;edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;strokeWidth=2;startArrow=oval;startFill=1;strokeColor=#000000;fontColor=#000000;fontStyle=1;" value="">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="369.44" y="440" />
              <mxPoint x="369.44" y="250" />
            </Array>
            <mxPoint x="369.44" y="440" as="sourcePoint" />
            <mxPoint x="369" y="220" as="targetPoint" />
          </mxGeometry>
        </mxCell>`;

const newEdge = `<mxCell id="uDtmU2JtukKAV0vTKXBA-15" edge="1" parent="1" style="endArrow=block;endFill=0;endSize=10;edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;strokeWidth=2;startArrow=oval;startFill=1;strokeColor=#000000;fontColor=#000000;fontStyle=1;" value="">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="369.44" y="250" />
              <mxPoint x="369.44" y="440" />
            </Array>
            <mxPoint x="369" y="220" as="sourcePoint" />
            <mxPoint x="369.44" y="440" as="targetPoint" />
          </mxGeometry>
        </mxCell>`;

if (content.includes(originalEdge)) {
    content = content.replace(originalEdge, newEdge);
    fs.writeFileSync(filePath, content);
    console.log('Fixed arrow direction for order_history -> users');
} else {
    // Maybe it was modified slightly, let's just do a regex replace on the sourcePoint and targetPoint of that specific cell
    let cellRegex = /(<mxCell id="uDtmU2JtukKAV0vTKXBA-15"[\s\S]*?)<mxPoint x="369\.44" y="440" as="sourcePoint" \/>\s*<mxPoint x="369" y="220" as="targetPoint" \/>/m;
    if (cellRegex.test(content)) {
        content = content.replace(cellRegex, '$1<mxPoint x="369" y="220" as="sourcePoint" />\n            <mxPoint x="369.44" y="440" as="targetPoint" />');
        // also fix array points
        content = content.replace(
            /(<mxCell id="uDtmU2JtukKAV0vTKXBA-15"[\s\S]*?<Array as="points">\s*)<mxPoint x="369\.44" y="440" \/>\s*<mxPoint x="369\.44" y="250" \/>/,
            '$1<mxPoint x="369.44" y="250" />\n              <mxPoint x="369.44" y="440" />'
        );
        fs.writeFileSync(filePath, content);
        console.log('Fixed arrow direction for order_history -> users via regex');
    } else {
        console.log('Could not find the edge to replace.');
    }
}
