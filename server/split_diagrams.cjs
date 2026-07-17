const fs = require('fs');
const path = require('path');

const dir = 'c:\\Kuliah\\Project\\BenuaKertasApps\\client\\src\\diagram\\sequence';

function generateCustomerDiagram(id, name, type, filename) {
    const isDP = type === 'DP';
    const clickLabel = isDP ? 'klik bayar pesanan (DP)' : 'klik bayar pelunasan';
    const formLabel = 'tampilkan form upload bukti bayar';
    const uploadLabel = 'upload bukti bayar &amp; klik submit';

    const xml = `<mxfile host="app.diagrams.net" agent="Mozilla/5.0">
  <diagram id="${id}" name="${name}">
    <mxGraphModel dx="1131" dy="1428" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="L1" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Customer" vertex="1">
          <mxGeometry height="660" width="60" x="70" y="-30" as="geometry" />
        </mxCell>
        <mxCell id="L2" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Pesanan Saya" vertex="1">
          <mxGeometry height="667" width="95" x="287.5" y="-37" as="geometry" />
        </mxCell>
        <mxCell id="L_Controller" parent="1" style="shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="OrderController" vertex="1">
          <mxGeometry height="670" width="80" x="500" y="-40" as="geometry" />
        </mxCell>
        <mxCell id="L3" parent="1" style="shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="Database" vertex="1">
          <mxGeometry height="670" width="80" x="750" y="-40" as="geometry" />
        </mxCell>
        
        <mxCell id="act_c" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="470" width="10" x="95" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_s" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="470" width="10" x="330" y="120" as="geometry" />
        </mxCell>
        <mxCell id="act_ctrl" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="270" width="10" x="535" y="270" as="geometry" />
        </mxCell>
        <mxCell id="act_d" parent="1" style="html=1;points=[];perimeter=orthogonalPerimeter;fillColor=#ffffff;strokeColor=#000000;" value="" vertex="1">
          <mxGeometry height="190" width="10" x="785" y="310" as="geometry" />
        </mxCell>

        <mxCell id="e1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${clickLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="105" y="140" as="sourcePoint" />
            <mxPoint x="330" y="140" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${formLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="330" y="200" as="sourcePoint" />
            <mxPoint x="105" y="200" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e3" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="${uploadLabel}">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="105" y="260" as="sourcePoint" />
            <mxPoint x="330" y="260" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e_ctr_1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="uploadPaymentProof(id, data)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="340" y="290" as="sourcePoint" />
            <mxPoint x="535" y="290" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e7" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" target="L3" value="simpan data pembayaran baru">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="720" y="330" />
              <mxPoint x="720" y="330" />
            </Array>
            <mxPoint x="545" y="330" as="sourcePoint" />
            <mxPoint x="735" y="330" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e8" edge="1" parent="1" source="act_d" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0.24;exitY=0.373;exitDx=0;exitDy=0;exitPerimeter=0;" value="pembayaran tersimpan (status PENDING)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="735" y="380" as="sourcePoint" />
            <mxPoint x="545" y="380" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e9" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;entryX=0.56;entryY=0.638;entryDx=0;entryDy=0;entryPerimeter=0;" target="act_d" value="update paymentStatus pesanan&amp;nbsp;&lt;div&gt;(&#39;PENDING&#39;)&lt;/div&gt;">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="545" y="430" as="sourcePoint" />
            <mxPoint x="735" y="430" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e10" edge="1" parent="1" source="act_d" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;exitX=0.4;exitY=0.891;exitDx=0;exitDy=0;exitPerimeter=0;" value="status pesanan terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="735" y="480" as="sourcePoint" />
            <mxPoint x="545" y="480" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e_ctr_2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kembalikan response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="535" y="520" as="sourcePoint" />
            <mxPoint x="340" y="520" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e_ctr_3" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi menunggu verifikasi">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="330" y="560" as="sourcePoint" />
            <mxPoint x="105" y="560" as="targetPoint" />
          </mxGeometry>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    fs.writeFileSync(path.join(dir, filename), xml);
    console.log(`Generated ${filename}`);
}

function generateAdminDiagram() {
    const xml = `<mxfile host="app.diagrams.net" agent="Mozilla/5.0">
  <diagram id="sd_verifikasi_pembayaran" name="SD - Verifikasi Pembayaran (Admin)">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1000" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Lifelines -->
        <mxCell id="L1" parent="1" style="shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=36;outlineConnect=0;fontStyle=1;" value="Admin" vertex="1">
          <mxGeometry height="950" width="60" x="50" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L2" parent="1" style="shape=umlLifeline;participant=umlBoundary;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;size=40;" value="Halaman Management Order" vertex="1">
          <mxGeometry height="950" width="120" x="250" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L_Controller" parent="1" style="shape=umlLifeline;participant=umlControl;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="OrderController" vertex="1">
          <mxGeometry height="950" width="100" x="480" y="40" as="geometry" />
        </mxCell>
        <mxCell id="L3" parent="1" style="shape=umlLifeline;participant=umlEntity;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=40;outlineConnect=0;fontStyle=1;" value="Database" vertex="1">
          <mxGeometry height="950" width="100" x="700" y="40" as="geometry" />
        </mxCell>

        <!-- Get Data Flow -->
        <mxCell id="e1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="akses halaman management order">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="80" y="140" as="sourcePoint" />
            <mxPoint x="310" y="140" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="getAdminOrders()">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="180" as="sourcePoint" />
            <mxPoint x="530" y="180" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e3" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="query pesanan (paymentStatus=PENDING)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="220" as="sourcePoint" />
            <mxPoint x="750" y="220" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e4" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="data pesanan dan pembayaran">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="260" as="sourcePoint" />
            <mxPoint x="530" y="260" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e5" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan daftar pesanan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="300" as="sourcePoint" />
            <mxPoint x="310" y="300" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e6" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan antarmuka management order">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="340" as="sourcePoint" />
            <mxPoint x="80" y="340" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- ALT FRAME -->
        <mxCell id="frame_alt" parent="1" style="shape=umlFrame;whiteSpace=wrap;html=1;width=40;height=30;boundedLbl=1;verticalAlign=middle;align=center;spacingLeft=5;fontStyle=1;" value="alt" vertex="1">
          <mxGeometry height="520" width="840" x="40" y="380" as="geometry" />
        </mxCell>
        <mxCell id="lbl_valid" parent="1" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;" value="[Bukti Valid]" vertex="1">
          <mxGeometry height="20" width="100" x="90" y="390" as="geometry" />
        </mxCell>

        <!-- Valid Flow -->
        <mxCell id="e12" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik verifikasi (Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="80" y="440" as="sourcePoint" />
            <mxPoint x="310" y="440" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e13" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="updateStatus(id, { paymentStatus: &#39;VERIFIED&#39; })">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="480" as="sourcePoint" />
            <mxPoint x="530" y="480" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e14" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="update paymentStatus(&#39;VERIFIED&#39;) &amp;amp; orderStatus">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="520" as="sourcePoint" />
            <mxPoint x="750" y="520" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e15" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="560" as="sourcePoint" />
            <mxPoint x="530" y="560" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e16" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kembalikan response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="600" as="sourcePoint" />
            <mxPoint x="310" y="600" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e17" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi verifikasi berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="640" as="sourcePoint" />
            <mxPoint x="80" y="640" as="targetPoint" />
          </mxGeometry>
        </mxCell>

        <!-- Separator -->
        <mxCell id="sep1" parent="1" style="shape=line;html=1;strokeWidth=1;strokeColor=#000000;dashed=1;" value="" vertex="1">
          <mxGeometry height="10" width="840" x="40" y="680" as="geometry" />
        </mxCell>
        <mxCell id="lbl_invalid" parent="1" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;" value="[Bukti Tidak Valid]" vertex="1">
          <mxGeometry height="20" width="120" x="90" y="690" as="geometry" />
        </mxCell>

        <!-- Invalid Flow -->
        <mxCell id="e18" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="klik tolak (Tidak Valid)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="80" y="740" as="sourcePoint" />
            <mxPoint x="310" y="740" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e19" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="updateStatus(id, { paymentStatus: &#39;REJECTED&#39; })">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="780" as="sourcePoint" />
            <mxPoint x="530" y="780" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e20" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="update paymentStatus(&#39;REJECTED&#39;)">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="820" as="sourcePoint" />
            <mxPoint x="750" y="820" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e21" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="status terupdate">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="750" y="860" as="sourcePoint" />
            <mxPoint x="530" y="860" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e22" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="kembalikan response berhasil">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="530" y="900" as="sourcePoint" />
            <mxPoint x="310" y="900" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="e23" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;edgeStyle=orthogonalEdgeStyle;rounded=0;" value="tampilkan notifikasi penolakan">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="310" y="940" as="sourcePoint" />
            <mxPoint x="80" y="940" as="targetPoint" />
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

    fs.writeFileSync(path.join(dir, 'SD_4_Verifikasi_Pembayaran_Admin.drawio'), xml);
    console.log('Generated SD_4_Verifikasi_Pembayaran_Admin.drawio');
}

generateCustomerDiagram('sd_pembayaran_dp', 'SD - Pembayaran DP', 'DP', 'SD_2_Pembayaran_DP.drawio');
generateCustomerDiagram('sd_pembayaran_pelunasan', 'SD - Pembayaran Pelunasan', 'Pelunasan', 'SD_3_Pembayaran_Pelunasan.drawio');
generateAdminDiagram();
