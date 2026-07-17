const fs = require('fs');
const path = require('path');

const dir = 'c:\\Kuliah\\Project\\BenuaKertasApps\\client\\src\\diagram\\sequence';

function generateDiagram(id, name, type, filename) {
    const isDP = type === 'DP';
    const firstEdgeLabel = isDP ? 'upload bukti DP &amp; klik submit' : 'upload bukti pelunasan &amp; klik submit';
    const statusValidOrder = isDP ? 'IN_PRODUCTION' : 'READY_TO_SHIP';

    const xml = `<mxfile host="app.diagrams.net" agent="Mozilla/5.0">
  <diagram id="${id}" name="${name}">
    <mxGraphModel dx="1471" dy="780" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1500" pageHeight="1400" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Lifelines -->
        <mxCell id="L1" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Customer" vertex="1">
          <mxGeometry height="1200" width="60" x="50" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L2" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Pesanan Saya" vertex="1">
          <mxGeometry height="1200" width="120" x="250" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L_Controller" parent="1" style="shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="PaymentController" vertex="1">
          <mxGeometry height="1200" width="100" x="480" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L3" parent="1" style="shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="Database" vertex="1">
          <mxGeometry height="1200" width="100" x="700" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L4" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Admin" vertex="1">
          <mxGeometry height="1200" width="100" x="920" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L5" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Admin" vertex="1">
          <mxGeometry height="1200" width="60" x="1150" y="40" as="geometry" />
        </mxCell>

        <!-- Edges: Upload Bukti -->
        <mxCell id="e1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${firstEdgeLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="80" y="140" as="sourcePoint" />
            <mxPoint x="310" y="140" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="submitPembayaran(data)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="180" as="sourcePoint" />
            <mxPoint x="530" y="180" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e3" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="simpanBukti &amp;amp; updateStatus(&#39;PENDING&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="220" as="sourcePoint" />
            <mxPoint x="750" y="220" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e4" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tersimpan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="260" as="sourcePoint" />
            <mxPoint x="530" y="260" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e5" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="300" as="sourcePoint" />
            <mxPoint x="310" y="300" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e6" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi menunggu verifikasi">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="340" as="sourcePoint" />
            <mxPoint x="80" y="340" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- Edges: Admin Cek -->
        <mxCell id="e7" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="cek daftar pembayaran pending">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1180" y="420" as="sourcePoint" />
            <mxPoint x="970" y="420" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e8" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="getDaftarPembayaran()">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="970" y="460" as="sourcePoint" />
            <mxPoint x="530" y="460" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e9" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="query pembayaran">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="500" as="sourcePoint" />
            <mxPoint x="750" y="500" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e10" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="data pembayaran">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="540" as="sourcePoint" />
            <mxPoint x="530" y="540" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e11" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan daftar">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="580" as="sourcePoint" />
            <mxPoint x="970" y="580" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- ALT FRAME -->
        <mxCell id="frame_alt" parent="1" style="shape=umlFrame;whiteSpace=wrap;html=1;width=40;height=30;boundedLbl=1;verticalAlign=middle;align=center;spacingLeft=5;fontStyle=1;" value="alt" vertex="1">
          <mxGeometry height="580" width="1180" x="40" y="620" as="geometry" />
        </mxCell>
        <mxCell id="lbl_valid" parent="1" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;" value="[Bukti Valid]" vertex="1">
          <mxGeometry height="20" width="100" x="90" y="630" as="geometry" />
        </mxCell>

        <!-- Valid Flow -->
        <mxCell id="e12" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik verifikasi (Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1180" y="680" as="sourcePoint" />
            <mxPoint x="970" y="680" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e13" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="verifikasiPembayaran(id, &#39;VERIFIED&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="970" y="720" as="sourcePoint" />
            <mxPoint x="530" y="720" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e14" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="updateStatus(&#39;VERIFIED&#39;, &#39;${statusValidOrder}&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="760" as="sourcePoint" />
            <mxPoint x="750" y="760" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e15" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="800" as="sourcePoint" />
            <mxPoint x="530" y="800" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e16" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kirim notifikasi status (Pembayaran Diterima)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="840" as="sourcePoint" />
            <mxPoint x="310" y="840" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e17" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan status pesanan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="880" as="sourcePoint" />
            <mxPoint x="80" y="880" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- Separator -->
        <mxCell id="sep1" parent="1" style="shape=line;html=1;strokeWidth=1;strokeColor=#000000;dashed=1;" value="" vertex="1">
          <mxGeometry height="10" width="1180" x="40" y="920" as="geometry" />
        </mxCell>
        <mxCell id="lbl_invalid" parent="1" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;" value="[Bukti Tidak Valid]" vertex="1">
          <mxGeometry height="20" width="120" x="90" y="930" as="geometry" />
        </mxCell>

        <!-- Invalid Flow -->
        <mxCell id="e18" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik tolak (Tidak Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="1180" y="980" as="sourcePoint" />
            <mxPoint x="970" y="980" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e19" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tolakPembayaran(id, alasan)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="970" y="1020" as="sourcePoint" />
            <mxPoint x="530" y="1020" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e20" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="updateStatus(&#39;REJECTED&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="1060" as="sourcePoint" />
            <mxPoint x="750" y="1060" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e21" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="1100" as="sourcePoint" />
            <mxPoint x="530" y="1100" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e22" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kirim notifikasi status (Pembayaran Ditolak)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="1140" as="sourcePoint" />
            <mxPoint x="310" y="1140" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e23" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan alasan penolakan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="1180" as="sourcePoint" />
            <mxPoint x="80" y="1180" as="targetPoint" />
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    fs.writeFileSync(path.join(dir, filename), xml);
    console.log(`Generated ${filename}`);
}

generateDiagram('sd_pembayaran_dp', 'SD - Pembayaran DP', 'DP', 'SD_2_Pembayaran_DP.drawio');
generateDiagram('sd_pembayaran_pelunasan', 'SD - Pembayaran Pelunasan', 'Pelunasan', 'SD_3_Pembayaran_Pelunasan.drawio');
