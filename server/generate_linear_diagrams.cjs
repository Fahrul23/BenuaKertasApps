const fs = require('fs');
const path = require('path');

const dir = 'c:\\Kuliah\\Project\\BenuaKertasApps\\client\\src\\diagram\\sequence';

function generateLinearDiagram(id, name, type, filename) {
    const isDP = type === 'DP';
    const clickLabel = isDP ? 'klik bayar pesanan (DP)' : 'klik bayar pelunasan';
    const formLabel = isDP ? 'tampilkan form upload bukti DP' : 'tampilkan form upload pelunasan';

    const xml = `<mxfile host="app.diagrams.net" agent="Mozilla/5.0">
  <diagram id="${id}" name="${name}">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1300" pageHeight="1000" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Lifelines -->
        <mxCell id="L1" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Customer" vertex="1">
          <mxGeometry height="900" width="60" x="50" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L2" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Pesanan Saya" vertex="1">
          <mxGeometry height="900" width="120" x="250" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L_Controller" parent="1" style="shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="PaymentController" vertex="1">
          <mxGeometry height="900" width="100" x="480" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L3" parent="1" style="shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="Database" vertex="1">
          <mxGeometry height="900" width="100" x="700" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L4" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Admin" vertex="1">
          <mxGeometry height="900" width="100" x="920" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L5" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Admin" vertex="1">
          <mxGeometry height="900" width="60" x="1150" y="40" as="geometry" />
        </mxCell>

        <!-- Activations: Customer Flow -->
        <mxCell id="act_c_1" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="320" width="10" x="75" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_b_1" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="320" width="10" x="305" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_ctrl_1" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="160" width="10" x="525" y="240" as="geometry" />
        </mxCell>
        <mxCell id="act_db_1" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="80" width="10" x="745" y="280" as="geometry" />
        </mxCell>

        <!-- Edges: Customer Flow -->
        <mxCell id="e1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${clickLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="85" y="140" as="sourcePoint" />
            <mxPoint x="305" y="140" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${formLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="305" y="180" as="sourcePoint" />
            <mxPoint x="85" y="180" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e3" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="upload bukti bayar &amp;amp; klik submit">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="85" y="220" as="sourcePoint" />
            <mxPoint x="305" y="220" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e4" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="submitPembayaran(data)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="315" y="260" as="sourcePoint" />
            <mxPoint x="525" y="260" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e5" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="simpan &amp;amp; updateStatus(&#39;PENDING&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="535" y="300" as="sourcePoint" />
            <mxPoint x="745" y="300" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e6" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tersimpan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="745" y="340" as="sourcePoint" />
            <mxPoint x="535" y="340" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e7" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="525" y="380" as="sourcePoint" />
            <mxPoint x="315" y="380" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e8" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi menunggu verifikasi">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="305" y="420" as="sourcePoint" />
            <mxPoint x="85" y="420" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- Activations: Admin Flow -->
        <mxCell id="act_a_1" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="320" width="10" x="1175" y="500" as="geometry" />
        </mxCell>
        <mxCell id="act_b_2" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="320" width="10" x="965" y="500" as="geometry" />
        </mxCell>
        <mxCell id="act_ctrl_2" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="160" width="10" x="525" y="620" as="geometry" />
        </mxCell>
        <mxCell id="act_db_2" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="80" width="10" x="745" y="660" as="geometry" />
        </mxCell>

        <!-- Edges: Admin Flow -->
        <mxCell id="e9" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="akses menu kelola pembayaran">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1175" y="520" as="sourcePoint" />
            <mxPoint x="975" y="520" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e10" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan daftar pembayaran pending">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="975" y="560" as="sourcePoint" />
            <mxPoint x="1175" y="560" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e11" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik verifikasi (Asumsi Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1175" y="600" as="sourcePoint" />
            <mxPoint x="975" y="600" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e12" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="verifikasiPembayaran(id)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="965" y="640" as="sourcePoint" />
            <mxPoint x="535" y="640" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e13" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="update paymentStatus(&#39;VERIFIED&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="535" y="680" as="sourcePoint" />
            <mxPoint x="745" y="680" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e14" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="745" y="720" as="sourcePoint" />
            <mxPoint x="535" y="720" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e15" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kembalikan response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="525" y="760" as="sourcePoint" />
            <mxPoint x="965" y="760" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e16" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="975" y="800" as="sourcePoint" />
            <mxPoint x="1175" y="800" as="targetPoint" />
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    fs.writeFileSync(path.join(dir, filename), xml);
    console.log(`Generated ${filename}`);
}

generateLinearDiagram('sd_pembayaran_dp', 'SD - Pembayaran DP', 'DP', 'SD_2_Pembayaran_DP.drawio');
generateLinearDiagram('sd_pembayaran_pelunasan', 'SD - Pembayaran Pelunasan', 'Pelunasan', 'SD_3_Pembayaran_Pelunasan.drawio');
