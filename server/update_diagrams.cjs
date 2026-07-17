const fs = require('fs');
const path = require('path');

const dir = 'c:\\Kuliah\\Project\\BenuaKertasApps\\client\\src\\diagram\\sequence';
const files = ['SD_2_Pembayaran_DP.drawio', 'SD_3_Pembayaran_Pelunasan.drawio'];

const newLifelines = `
        <mxCell id="L4" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Admin" vertex="1">
          <mxGeometry height="1100" width="95" x="950" y="-37" as="geometry" />
        </mxCell>
        <mxCell id="L5" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Admin" vertex="1">
          <mxGeometry height="1100" width="60" x="1150" y="-30" as="geometry" />
        </mxCell>
        <mxCell id="act_admin_page" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="360" width="10" x="992" y="620" as="geometry" />
        </mxCell>
        <mxCell id="act_admin" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="360" width="10" x="1175" y="620" as="geometry" />
        </mxCell>
        <mxCell id="act_ctrl_2" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="180" width="10" x="535" y="770" as="geometry" />
        </mxCell>
        <mxCell id="act_d_2" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="80" width="10" x="785" y="810" as="geometry" />
        </mxCell>
        
        <mxCell id="e11" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="akses menu kelola pembayaran">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1175" y="640" as="sourcePoint" />
            <mxPoint x="1002" y="640" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e12" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan daftar pembayaran pending">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="992" y="680" as="sourcePoint" />
            <mxPoint x="1175" y="680" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e13" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik verifikasi (Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1175" y="740" as="sourcePoint" />
            <mxPoint x="1002" y="740" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e_ctr_4" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="verifikasiPembayaran()">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="992" y="790" as="sourcePoint" />
            <mxPoint x="545" y="790" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e14" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" target="L3" value="update status pembayaran (VERIFIED)">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="720" y="830" />
              <mxPoint x="720" y="830" />
            </Array>
            <mxPoint x="545" y="830" as="sourcePoint" />
            <mxPoint x="785" y="830" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e15" edge="1" parent="1" source="act_d_2" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0.24;exitY=0.373;exitDx=0;exitDy=0;exitPerimeter=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="785" y="870" as="sourcePoint" />
            <mxPoint x="545" y="870" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e_ctr_5" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kembalikan response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="545" y="920" as="sourcePoint" />
            <mxPoint x="992" y="920" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e16" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1002" y="960" as="sourcePoint" />
            <mxPoint x="1175" y="960" as="targetPoint" />
          </mxGeometry>
        </mxCell>
`;

for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Increase lifeline heights
    content = content.replace(/height="660"/g, 'height="1100"');
    content = content.replace(/height="667"/g, 'height="1100"');
    content = content.replace(/height="670"/g, 'height="1100"');

    // Increase canvas size
    content = content.replace(/pageWidth="1169"/g, 'pageWidth="1500"');
    content = content.replace(/pageHeight="827"/g, 'pageHeight="1200"');

    // Insert new elements before </root>
    content = content.replace('      </root>', newLifelines + '\n      </root>');

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
}
