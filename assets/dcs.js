/* DCS Lab + diagram ekstraksi/drain/bocoran unit 150 MW */
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("pltu:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("pltu:" + k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  };

  /* =======================================================================
     DIAGRAM 150 MW: ekstraksi, drain heater, bocoran gland & stem
     ======================================================================= */

  // Garis horizontal dengan "lompatan" (hop) di titik persilangan
  function hTo(x1, x2, y, hops) {
    const dir = x2 > x1 ? 1 : -1, r = 6;
    const hs = (hops || []).filter((h) => (h - x1) * dir > r && (x2 - h) * dir > r).sort((a, b) => (a - b) * dir);
    let d = "";
    hs.forEach((h) => { d += ` H${h - r * dir} a${r} ${r} 0 0 ${dir > 0 ? 1 : 0} ${2 * r * dir} 0`; });
    return d + ` H${x2}`;
  }

  function diagram150Svg() {
    const ext = [["E1", 230, 146, 415], ["E2", 340, 134, 415], ["E3", 445, 149, 422], ["E4", 520, 165, 415], ["E5", 580, 171, 415], ["E6", 640, 176, 415], ["E7", 700, 182, 415]];
    const heater = (k, cx, label) => `<g class="node hit" data-k="${k}"><rect class="shape" x="${cx - 20}" y="415" width="40" height="50" rx="8"/><text x="${cx}" y="444" text-anchor="middle" font-size="11" font-weight="700">${label}</text></g>`;
    return `
<svg class="diagram d150" viewBox="0 0 960 600" role="img" aria-label="Diagram ekstraksi, drain, dan bocoran uap unit 150 MW">
  <line class="shaft" x1="128" y1="110" x2="846" y2="110"/>

  <g class="L-main">
    <path class="pipe steam" d="M110 80 H165 V86"/>
    <path class="pipe reheat" d="M262 70 V34 H95 V40"/>
    <path class="pipe steam" d="M80 40 V18 H310 V95 H330"/>
    <path class="pipe steam" d="M745 186 V225${hTo(745, 860, 225, [770, 782])} V250"/>
    <path class="pipe water" d="M860 320 V424"/>
    <path class="pipe water" d="M844 440 H65 V340"/>
    <text x="168" y="74" class="lbl-s">Main steam</text>
    <text x="150" y="29" class="lbl-s">Cold reheat</text>
    <text x="200" y="13" class="lbl-s">Hot reheat</text>
    <text x="70" y="362" class="lbl-s">ke economizer</text>
    <text x="800" y="218" class="lbl-s">LP exhaust</text>
  </g>

  <g class="L-ext">
    ${ext.map(([k, x, y1, y2]) => `<path class="pipe ext" d="M${x} ${y1} V${y2}"/>`).join("")}
  </g>

  <g class="L-drain">
    <path class="pipe drain" d="M236 465 V488 H334 V465"/>
    <path class="pipe drain" d="M346 465 V505 H440 V458"/>
    <path class="pipe drain" d="M526 465 V488 H574 V465"/>
    <path class="pipe drain" d="M586 465 V505${hTo(586, 634, 505, [610])} V465"/>
    <path class="pipe drain" d="M646 465 V532 H620"/>
    <path class="pipe drain" d="M610 522 V440"/>
    <path class="pipe drain" d="M706 465 V548 H905 V320"/>
    <g class="node hit" data-k="DP"><circle class="shape" cx="610" cy="532" r="10"/><text x="610" y="560" text-anchor="middle" class="lbl-s">Pompa drain LP</text></g>
    <text x="262" y="500" class="lbl-s">drain</text>
    <text x="730" y="542" class="lbl-s">drain LPH7 → kondensor</text>
  </g>

  <g class="L-leak">
    <path class="pipe leak" d="M125 86 V250"/>
    <path class="pipe leak" d="M134 117 V160 H175 V250"/>
    <path class="pipe leak" d="M273 117 V267${hTo(273, 208, 267, [230])}"/>
    <path class="pipe leak" d="M279 117 V200${hTo(279, 460, 200, [322, 340, 445])} V422"/>
    <path class="pipe leak" d="M160 284 V345${hTo(160, 770, 345, [230, 340, 445, 460, 520, 580, 640, 700])} V117"/>
    <path class="pipe leak" d="M322 345 V117"/>
    <path class="pipe leak" d="M782 117 V425"/>
    <path class="pipe leak" d="M140 318 V284"/>
    <path class="pipe leak" d="M800 425 V400 H838"/>
    <text x="352" y="216" class="lbl-s">bocoran HP → deaerator</text>
    <text x="520" y="339" class="lbl-s">uap seal → gland IP/LP</text>
    <text x="790" y="384" class="lbl-s">gland → GSC</text>
    <text x="844" y="404" class="lbl-s">fan → atm</text>
    <g class="node hit" data-k="AUX"><text x="146" y="318" class="lbl-s">↑ Aux steam</text></g>
  </g>

  <!-- Node -->
  <g class="node"><rect class="shape" x="20" y="40" width="90" height="300" rx="8"/>
    <text x="65" y="70" text-anchor="middle" font-weight="700">BOILER</text>
    <text x="65" y="100" text-anchor="middle" class="lbl-s">SH</text>
    <text x="65" y="130" text-anchor="middle" class="lbl-s">RH</text>
    <text x="65" y="200" text-anchor="middle" font-size="24">🔥</text>
    <text x="65" y="320" text-anchor="middle" class="lbl-s">ECO</text></g>
  <g class="node hit" data-k="STEM"><polygon class="shape" points="119,74 131,86 131,74 119,86"/></g>
  <g class="node"><polygon class="shape" points="140,88 270,68 270,152 140,132"/><text x="205" y="115" text-anchor="middle" font-weight="700">HP</text></g>
  <g class="node"><polygon class="shape" points="330,88 450,70 450,150 330,132"/><text x="390" y="115" text-anchor="middle" font-weight="700">IP</text></g>
  <g class="node"><polygon class="shape" points="450,62 760,32 760,188 450,158"/><text x="605" y="115" text-anchor="middle" font-weight="700">LP</text></g>
  <text x="560" y="26" class="lbl-s">casing IP–LP (gabung)</text>
  <g class="node"><circle class="shape" cx="880" cy="110" r="34"/><text x="880" y="115" text-anchor="middle" font-weight="700">GEN</text></g>

  <g class="L-leak">
    <g class="node hit" data-k="GLAND"><rect class="shape gland" x="129" y="103" width="8" height="14"/><rect class="shape gland" x="270" y="103" width="12" height="14"/></g>
    <g class="node hit" data-k="HDR"><rect class="shape gland" x="317" y="103" width="10" height="14"/><rect class="shape gland" x="764" y="103" width="24" height="14"/></g>
    <g class="node hit" data-k="HDR"><rect class="shape" x="118" y="250" width="90" height="34" rx="6"/><text x="163" y="266" text-anchor="middle" font-size="11" font-weight="700">均压箱</text><text x="163" y="279" text-anchor="middle" class="lbl-s">header gland</text></g>
  </g>

  <g class="node hit" data-k="COND"><rect class="shape" x="790" y="250" width="150" height="70" rx="8"/><text x="865" y="282" text-anchor="middle" font-weight="700">Kondensor</text><text x="865" y="300" text-anchor="middle" class="lbl-s">−95 kPa</text></g>
  ${heater("HPH1", 230, "HPH1")}
  ${heater("HPH2", 340, "HPH2")}
  <g class="node hit" data-k="BFP"><circle class="shape" cx="385" cy="440" r="15"/><text x="385" y="444" text-anchor="middle" font-size="9" font-weight="700">BFP</text></g>
  <g class="node hit" data-k="DA"><rect class="shape" x="405" y="422" width="80" height="36" rx="18"/><text x="445" y="444" text-anchor="middle" font-size="11" font-weight="700">DA</text></g>
  ${heater("LPH4", 520, "LPH4")}
  ${heater("LPH5", 580, "LPH5")}
  ${heater("LPH6", 640, "LPH6")}
  ${heater("LPH7", 700, "LPH7")}
  <g class="node hit" data-k="GSC"><rect class="shape" x="760" y="425" width="44" height="30" rx="6"/><text x="782" y="444" text-anchor="middle" font-size="11" font-weight="700">GSC</text></g>
  <g class="node hit" data-k="CEP"><circle class="shape" cx="860" cy="440" r="16"/><text x="860" y="444" text-anchor="middle" font-size="9" font-weight="700">CEP</text></g>

  <g class="L-ext">
    ${ext.map(([k, x, y1]) => `<g class="node hit badge" data-k="${k}"><rect x="${x - 13}" y="${y1 + 24}" width="26" height="16" rx="8"/><text x="${x}" y="${y1 + 36}" text-anchor="middle">${k}</text></g>`).join("")}
  </g>
</svg>`;
  }

  function mountDiagram150(root) {
    root.innerHTML = `
      <div class="chips" id="d150layers" style="margin-bottom:10px">
        <button class="chip on" data-l="ext">Ekstraksi E1–E7</button>
        <button class="chip on" data-l="drain">Drain heater</button>
        <button class="chip on" data-l="leak">Bocoran gland & stem</button>
      </div>
      <div class="legend">
        <span><i style="background:var(--steam)"></i>Uap utama / reheat</span>
        <span><i style="background:var(--water)"></i>Kondensat / feedwater</span>
        <span><i style="background:var(--ext)"></i>Ekstraksi</span>
        <span><i style="background:var(--drain)"></i>Drain heater</span>
        <span><i style="background:var(--leak)"></i>Bocoran & uap seal</span>
      </div>
      <div class="diagram-wrap">${diagram150Svg()}</div>
      <div class="step-detail" id="d150info"><p class="muted">Klik E1–E7, heater, header gland, GSC, atau valve utama buat lihat penjelasan + nilai dari DCS lo.</p></div>`;
    const svg = root.querySelector("svg");
    root.querySelector("#d150layers").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      c.classList.toggle("on");
      svg.classList.toggle("no-" + c.dataset.l, !c.classList.contains("on"));
    });
    svg.addEventListener("click", (e) => {
      const g = e.target.closest(".hit"); if (!g) return;
      const k = g.dataset.k, inf = INFO_150[k]; if (!inf) return;
      svg.querySelectorAll(".hit").forEach((n) => n.classList.toggle("active", n.dataset.k === k));
      root.querySelector("#d150info").innerHTML = `<h3>${esc(inf.judul)}</h3><p>${esc(inf.isi)}</p>${inf.dcs !== "—" ? `<p class="muted"><b>Di DCS lo (±64 MW):</b> ${esc(inf.dcs)}</p>` : ""}`;
    });
  }

  /* =======================================================================
     DCS LAB
     ======================================================================= */
  const L = (cn, id) => `<span class="cn">${esc(cn)}</span><span class="idn">${esc(id)}</span>`;

  function renderLab(app, param, setCleanup) {
    const tab = ["sim", "layar", "kamus"].includes(param) ? param : "sim";
    app.innerHTML = `
      <div class="section-head">
        <div>
          <h1>DCS Lab — Turbin 150 MW</h1>
          <p class="muted" style="margin:0">Latihan baca & operasi DCS turbin, dibuat dari layar DCS unit lo (#2, beban ±64 MW).</p>
        </div>
      </div>
      <div class="chips" style="margin-bottom:16px">
        <a class="chip ${tab === "sim" ? "on" : ""}" href="#dcs-sim">🎮 Simulator gangguan</a>
        <a class="chip ${tab === "layar" ? "on" : ""}" href="#dcs-layar">🗺️ Peta layar & cara baca</a>
        <a class="chip ${tab === "kamus" ? "on" : ""}" href="#dcs-kamus">📖 Kamus istilah</a>
        <a class="chip" href="#kuis-dcs">🧠 Kuis DCS</a>
      </div>
      <div id="dcsBody"></div>`;
    const body = app.querySelector("#dcsBody");
    if (tab === "sim") setCleanup(renderSim(body));
    if (tab === "layar") renderLayar(body);
    if (tab === "kamus") renderKamus(body);
  }

  /* ---------------- Peta layar ---------------- */
  function renderLayar(body) {
    body.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <h2>Cara baca simbol di DCS lo</h2>
        <div class="grid grid-2">
          <ul>
            <li><span class="dot red"></span><b>Merah = running / terbuka</b>, <span class="dot green"></span><b>hijau = stop / tertutup</b>. Ini konvensi DCS buatan Tiongkok, kebalikan dari kebiasaan barat. Contoh: BFP B merah (2183 rpm), BFP A hijau (standby).</li>
            <li>Kotak hijau <b>联锁</b> di pompa standby = interlock aktif (siap auto-start). Tulisan <b>解锁</b> = interlock dilepas.</li>
            <li>Angka hijau di kotak hitam = nilai proses live. Di jalur pipa, tekanan banyak ditulis biru muda (MPa) dan suhu putih (°C).</li>
          </ul>
          <ul>
            <li>Bar level dengan lampu <b>HHH / HH / LL</b> = batas level (high-high-high biasanya proteksi/trip).</li>
            <li>Tombol <b>PARA</b> / <b>PID</b> membuka faceplate parameter / controller. Tombol <b>?</b> umumnya menampilkan keterangan logika. Cek sendiri di unit lo.</li>
            <li>Baris atas = parameter utama yang selalu tampil + pesan alarm terbaru (mis. soot blower 半伸缩吹灰器). Baris bawah = tombol pindah layar.</li>
          </ul>
        </div>
      </div>
      <div class="grid grid-2">
        ${LAYAR_DCS.map((s) => `
          <div class="card">
            <div class="layar-cn">${esc(s.cn)}</div>
            <h3>${esc(s.id)}</h3>
            <p>${esc(s.isi)}</p>
            <b style="font-size:.9rem">Yang dipantau:</b>
            <ul>${s.pantau.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
            ${s.nilai ? `<div class="muted" style="font-size:.88rem">${s.nilai.map((n) => `${esc(n[0])}: <b>${esc(n[1])}</b>`).join(" · ")}</div>` : ""}
          </div>`).join("")}
      </div>`;
  }

  /* ---------------- Kamus ---------------- */
  function renderKamus(body) {
    const grups = [...new Set(KAMUS_DCS.map((k) => k.g))];
    let g = "Semua", q = "";
    body.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <div class="row" style="justify-content:space-between">
          <input id="kq" class="input" placeholder="Cari istilah (中文 atau Indonesia)…" />
          <button class="btn primary" id="flashBtn">Mode flashcard</button>
        </div>
        <div class="chips" id="kg" style="margin-top:12px">${["Semua", ...grups].map((x) => `<button class="chip ${x === g ? "on" : ""}" data-g="${esc(x)}">${esc(x)}</button>`).join("")}</div>
      </div>
      <div id="flash"></div>
      <div class="card table-wrap"><table><thead><tr><th>中文</th><th>Arti</th><th>Grup</th></tr></thead><tbody id="kt"></tbody></table></div>`;
    const draw = () => {
      const rows = KAMUS_DCS.filter((k) => (g === "Semua" || k.g === g) && (!q || (k.cn + k.arti).toLowerCase().includes(q)));
      body.querySelector("#kt").innerHTML = rows.map((k) => `<tr><td class="kcn">${esc(k.cn)}</td><td>${esc(k.arti)}</td><td class="muted">${esc(k.g)}</td></tr>`).join("") || `<tr><td colspan="3" class="muted">Tidak ketemu.</td></tr>`;
    };
    body.querySelector("#kq").addEventListener("input", (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
    body.querySelector("#kg").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      g = c.dataset.g; body.querySelectorAll("#kg .chip").forEach((x) => x.classList.toggle("on", x === c)); draw();
    });
    body.querySelector("#flashBtn").onclick = () => flashcards(body.querySelector("#flash"), g === "Semua" ? KAMUS_DCS : KAMUS_DCS.filter((k) => k.g === g));
    draw();
  }

  function flashcards(el, list) {
    const deck = list.slice().sort(() => Math.random() - 0.5);
    let i = 0, tahu = 0, open = false;
    const draw = () => {
      if (i >= deck.length) {
        el.innerHTML = `<div class="card flash-done"><h3>Selesai! ${tahu}/${deck.length} istilah lo tahu.</h3><button class="btn" id="fcAgain">Ulang</button> <button class="btn" id="fcClose">Tutup</button></div>`;
        el.querySelector("#fcAgain").onclick = () => flashcards(el, list);
        el.querySelector("#fcClose").onclick = () => { el.innerHTML = ""; };
        return;
      }
      const k = deck[i];
      el.innerHTML = `
        <div class="card flashcard" style="margin-bottom:16px">
          <div class="muted" style="font-size:.85rem">${i + 1}/${deck.length} · ${esc(k.g)}</div>
          <div class="fc-face" id="fcFace">
            <div class="fc-cn">${esc(k.cn)}</div>
            ${open ? `<div class="fc-arti">${esc(k.arti)}</div>` : `<div class="muted">Tebak artinya, lalu klik untuk membalik</div>`}
          </div>
          ${open ? `<div class="row" style="justify-content:center"><button class="btn" id="fcNo">Belum hafal</button><button class="btn primary" id="fcYes">Tahu ✓</button></div>` : ""}
        </div>`;
      el.querySelector("#fcFace").onclick = () => { open = true; draw(); };
      if (open) {
        el.querySelector("#fcYes").onclick = () => { tahu++; i++; open = false; draw(); };
        el.querySelector("#fcNo").onclick = () => { deck.push(k); i++; open = false; draw(); };
      }
    };
    draw();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------- Simulator ---------------- */
  const EQ_DEF = {
    cepA: { cn: "凝结水泵A", id: "CEP A", amp: 41.8 },
    cepB: { cn: "凝结水泵B", id: "CEP B", amp: 41.8, run: true },
    bfpA: { cn: "给水泵A", id: "BFP A", amp: 208, delay: 5 },
    bfpB: { cn: "给水泵B", id: "BFP B", amp: 208, delay: 5, run: true },
    vpA: { cn: "A真空泵", id: "Vacuum pump A", amp: 44.6 },
    vpB: { cn: "B真空泵", id: "Vacuum pump B", amp: 44.6, run: true },
    cw2: { cn: "2#循环水泵", id: "Pompa CW 2#", amp: 152, run: true },
    cw3: { cn: "3#循环水泵(备用)", id: "Pompa CW 3# (standby)", amp: 152, delay: 3 },
    acA: { cn: "交流油泵(主)", id: "Pompa oli AC (主)", amp: 41.4 },
    acB: { cn: "交流油泵(备)", id: "Pompa oli AC (备)", amp: 41.4, run: true },
    dc: { cn: "直流油泵", id: "Pompa oli DC", amp: 35 },
    ehA: { cn: "A EH主泵", id: "Pompa EH A", amp: 22.3 },
    ehB: { cn: "B EH主泵", id: "Pompa EH B", amp: 22.3, run: true },
    ccwA: { cn: "A闭式循环水泵", id: "Pompa CCW A", amp: 13.5, run: true },
    ccwB: { cn: "B闭式循环水泵", id: "Pompa CCW B", amp: 13.5 },
  };
  const PAIR = { cepA: "cepB", cepB: "cepA", bfpA: "bfpB", bfpB: "bfpA", vpA: "vpB", vpB: "vpA", cw2: "cw3", cw3: "cw2", acA: "acB", acB: "acA", ehA: "ehB", ehB: "ehA", ccwA: "ccwB", ccwB: "ccwA" };

  const PANELS = [
    { cn: "凝结水系统", id: "Kondensat", vals: [["hwL", "热井水位", "Level hotwell", "mm", 0], ["condP", "凝结水压力", "Tekanan kondensat", "MPa", 2], ["daL", "除氧器水位", "Level deaerator", "mm", 0]], eq: ["cepA", "cepB"] },
    { cn: "给水系统", id: "Feedwater", vals: [["fwF", "给水流量", "Aliran feedwater", "t/h", 1], ["fwP", "给水压力", "Tekanan feedwater", "MPa", 2], ["drum", "汽包水位", "Level drum (DCS boiler)", "mm", 0], ["fwT", "给水温度", "Suhu feedwater", "°C", 1]], eq: ["bfpA", "bfpB"] },
    { cn: "高压加热器", id: "HP heater", vals: [["hph1L", "1号高加水位", "Level HPH1", "mm", 1]], eq: [], extra: "hph" },
    { cn: "真空/循环水", id: "Vakum & CW", vals: [["vac", "真空", "Vakum", "kPa", 2]], eq: ["vpA", "vpB", "cw2", "cw3"] },
    { cn: "润滑油系统", id: "Lube oil", vals: [["loP", "润滑油压", "Tekanan oli", "MPa", 3], ["loT", "润滑油温", "Suhu oli", "°C", 1]], eq: ["acA", "acB", "dc"] },
    { cn: "EH油系统", id: "EH oil", vals: [["ehP", "EH油压", "Tekanan EH", "MPa", 2], ["ehT", "EH油温", "Suhu EH", "°C", 1]], eq: ["ehA", "ehB"] },
    { cn: "闭式循环水", id: "Closed cooling water", vals: [["ccwP", "闭式水压力", "Tekanan CCW", "MPa", 2], ["ccwT", "闭式水温度", "Suhu CCW", "°C", 1]], eq: ["ccwA", "ccwB"] },
    { cn: "DEH / 负荷", id: "DEH & beban", vals: [["load", "负荷", "Beban", "MW", 2], ["speed", "汽机转速", "Putaran", "r/min", 1], ["loadSP", "目标功率", "Target beban", "MW", 1]], eq: [], extra: "deh" },
  ];
  const HEADER = [
    ["load", "负荷", "Beban", "MW", 2], ["speed", "汽机转速", "Putaran", "r", 1], ["msP", "主蒸汽压力", "Tek. main steam", "MPa", 2], ["msF", "主蒸汽流量", "Aliran MS", "t/h", 1],
    ["msT", "主蒸汽温度", "Suhu MS", "°C", 1], ["vac", "真空", "Vakum", "kPa", 2], ["rhP", "再热器压力", "Tek. reheat", "MPa", 2], ["rhT", "再热器温度", "Suhu reheat", "°C", 1],
    ["fwP", "给水压力", "Tek. feedwater", "MPa", 2], ["fwF", "给水流量", "Aliran FW", "t/h", 1], ["loP", "润滑油压", "Tek. oli", "MPa", 2], ["loT", "润滑油温", "Suhu oli", "°C", 1],
    ["ehP", "EH油压", "Tek. EH", "MPa", 2], ["ehT", "EH油温", "Suhu EH", "°C", 1], ["ccwP", "闭式水压力", "Tek. CCW", "MPa", 2], ["daL", "除氧器水位", "Level DA", "mm", 1],
  ];

  function initState() {
    return {
      t: 0, load: 64, loadSP: 64, speed: 2998, msP: 10.75, msT: 529.5, msF: 197, rhP: 1.38, rhT: 516, vac: -95.36,
      fwP: 12.13, fwF: 208, fwT: 200, drum: 0, loP: 0.13, loT: 40.3, ehP: 14.13, ehT: 52.7, ccwP: 0.57, ccwT: 33.5,
      daL: 1760, hwL: 874, condP: 1.79, hph1L: -56, hphIn: true, hphLeak: false, tripped: false, firstOut: null,
    };
  }
  function initEq() {
    const e = {};
    Object.entries(EQ_DEF).forEach(([k, d]) => { e[k] = { ...d, run: !!d.run, il: !d.run, fault: false, starting: 0 }; });
    e.cw3.il = true; e.dc.il = true;
    return e;
  }

  function renderSim(body) {
    let lang = store.get("dcsLang", "both");
    let s = initState(), E = initEq();
    let scen = null, running = false, paused = false, timer = null;
    let alarms = [], active = new Set(), resolveAt = null, stable = 0, penalties = [], ended = false, dcUsed = false;

    body.innerHTML = `
      <div class="card" style="margin-bottom:16px">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div style="flex:1;min-width:240px">
            <label class="field-label" style="margin-top:0">Pilih skenario</label>
            <select id="scSel" class="input">
              <option value="free">Mode bebas (coba-coba operasi)</option>
              <option value="random">🎲 Acak</option>
              ${SKENARIO.map((x) => `<option value="${x.id}">${esc(x.judul)}</option>`).join("")}
            </select>
          </div>
          <div class="row" style="margin-top:28px">
            <button class="btn primary" id="scStart">Mulai</button>
            <button class="btn" id="scPause">Jeda</button>
            <button class="btn" id="scReset">Reset</button>
          </div>
        </div>
        <div class="row" style="margin-top:12px">
          <span class="muted" style="font-size:.88rem">Bahasa label:</span>
          <div class="chips" id="langSel">
            <button class="chip" data-l="both">中文 + ID</button><button class="chip" data-l="cn">中文 saja</button><button class="chip" data-l="id">ID saja</button>
          </div>
        </div>
        <div id="brief" class="brief"></div>
      </div>

      <div class="dcs lang-${lang}" id="dcs">
        <div class="dcs-head">${HEADER.map(([k, cn, id, u, d]) => `<div class="hv"><div class="hl">${L(cn, id)}</div><div class="vbox" data-v="${k}" data-d="${d}"></div><span class="hu">${u}</span></div>`).join("")}</div>
        <div class="dcs-title">#2 汽机 · <span class="idn">Simulator turbin</span> <span class="dcs-clock" id="clk">T+0s</span></div>
        <div class="dcs-grid">
          ${PANELS.map((p) => `
            <div class="dpanel">
              <div class="dp-title">${L(p.cn, p.id)}</div>
              ${p.vals.map(([k, cn, id, u, d]) => `<div class="dp-row"><span class="dp-l">${L(cn, id)}</span><span class="vbox" data-v="${k}" data-d="${d}"></span><span class="hu">${u}</span></div>`).join("")}
              ${p.eq.length ? `<div class="pumps">${p.eq.map((k) => `<button class="pump" data-eq="${k}"><span class="pico">➜</span><span class="pname">${L(E[k].cn, E[k].id)}</span><span class="pamp" data-amp="${k}"></span><span class="pil" data-il="${k}"></span></button>`).join("")}</div>` : ""}
              ${p.extra === "hph" ? `<div class="dp-row"><span class="dp-l">${L("状态", "Status")}</span><span class="tagbox" id="hphState"></span></div><button class="dbtn" id="hphBtn">${L("高加手动解列", "Isolasi HPH manual")}</button>` : ""}
              ${p.extra === "deh" ? `<div class="row" style="gap:6px;margin-top:6px"><button class="dbtn" data-load="-10">${L("减负荷", "Beban −10")}</button><button class="dbtn" data-load="10">${L("增负荷", "Beban +10")}</button><button class="dbtn danger" id="tripBtn">${L("打闸", "Trip manual")}</button></div>` : ""}
            </div>`).join("")}
        </div>
        <div class="dcs-alarm">
          <div class="row" style="justify-content:space-between"><b>${L("报警", "Alarm")}</b><button class="dbtn" id="ackBtn">${L("确认", "Acknowledge")}</button></div>
          <div id="alist" class="alist"></div>
        </div>
        <div class="faceplate" id="fp" hidden></div>
        <div class="tripbox" id="tripbox" hidden></div>
      </div>`;

    const $ = (sel) => body.querySelector(sel);
    const dcs = $("#dcs");

    function setLang(l) {
      lang = l; store.set("dcsLang", l);
      dcs.className = "dcs lang-" + l;
      body.querySelectorAll("#langSel .chip").forEach((c) => c.classList.toggle("on", c.dataset.l === l));
    }
    $("#langSel").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) setLang(c.dataset.l); });
    setLang(lang);

    /* ---- alarm ---- */
    function alarm(key, cn, id, lvl) {
      if (active.has(key)) return;
      active.add(key);
      alarms.unshift({ t: s.t, cn, id, lvl: lvl || "a", ack: false });
      alarms = alarms.slice(0, 40);
    }
    function clear(key) { active.delete(key); }
    function cond(key, on, cn, id, lvl) { if (on) alarm(key, cn, id, lvl); else clear(key); }

    /* ---- peralatan ---- */
    function startEq(k, auto) {
      const q = E[k];
      if (q.fault || q.run || q.starting || s.tripped) return;
      q.starting = q.delay || 1;
      if (auto) alarm("as-" + k + s.t, q.cn + " 联启", q.id + " auto-start (联锁)", "i");
      if (k === "dc") dcUsed = true;
    }
    function stopEq(k) { const q = E[k]; q.run = false; q.starting = 0; }
    function tripEq(k) {
      const q = E[k]; q.run = false; q.fault = true; q.starting = 0;
      alarm("trip-" + k, q.cn + " 跳闸", q.id + " TRIP", "t");
      const p = PAIR[k];
      if (p && E[p].il && !E[p].run) startEq(p, true);
    }
    function turbineTrip(cn, id) {
      if (s.tripped) return;
      s.tripped = true; s.firstOut = { cn, id };
      alarm("ttrip", "汽机跳闸 首出: " + cn, "TURBIN TRIP — first-out: " + id, "t");
    }

    /* ---- model proses (1 tick = 1 detik simulasi) ---- */
    const toward = (v, target, rate) => (Math.abs(target - v) <= rate ? target : v + Math.sign(target - v) * rate);
    function step() {
      s.t++;
      if (scen && s.t === 3) {
        if (scen.fault.trip) tripEq(scen.fault.trip);
        if (scen.fault.hphLeak) s.hphLeak = true;
      }
      Object.entries(E).forEach(([k, q]) => { if (q.starting) { q.starting--; if (!q.starting && !q.fault) q.run = true; } });
      const n = (k) => (E[k].run ? 1 : 0);
      const lf = Math.max(0.3, s.load / 64);

      // beban & turbin
      if (s.tripped) { s.load = toward(s.load, 0, 8); s.speed = toward(s.speed, 0, 45); }
      else { s.load = toward(s.load, s.loadSP, 1); s.speed = 2998 + (Math.random() - 0.5) * 3; }
      s.msF = 197 * s.load / 64; s.msP = s.tripped ? s.msP : 10.75 - (64 - s.load) * 0.02;

      // kondensat & deaerator
      if (n("cepA") + n("cepB")) { s.daL = toward(s.daL, 1760, 8); s.hwL = toward(s.hwL, 874, 4); s.condP = toward(s.condP, 1.79, 0.4); }
      else { s.daL -= 7 * lf; s.hwL += 5 * lf; s.condP = toward(s.condP, 0.15, 0.5); }
      if (s.daL <= 1400 && (E.bfpA.run || E.bfpB.run)) { stopEq("bfpA"); stopEq("bfpB"); alarm("dall", "除氧器水位低低 给水泵跳闸", "Level DA low-low → BFP trip", "t"); }

      // feedwater & drum
      if (n("bfpA") + n("bfpB")) { s.fwF = toward(s.fwF, 208 * s.load / 64, 40); s.fwP = toward(s.fwP, 12.13, 3); s.drum = toward(s.drum, 0, 4); }
      else { s.fwF = toward(s.fwF, 0, 60); s.fwP = toward(s.fwP, 0.6, 3); if (!s.tripped) s.drum -= 6 * lf; }
      if (s.drum <= -300) turbineTrip("锅炉MFT 汽包水位低低", "Boiler MFT — level drum low-low");

      // vakum
      const cw = n("cw2") + n("cw3"), vp = n("vpA") + n("vpB");
      if (s.tripped) s.vac = toward(s.vac, -95.36, 0.2);
      else if (!cw) s.vac += 0.55 * lf;
      else if (!vp) s.vac += 0.18 * lf;
      else s.vac = toward(s.vac, -95.36, 0.35);
      if (s.vac >= -88 && !vp) ["vpA", "vpB"].forEach((k) => { if (E[k].il) startEq(k, true); });
      if (s.vac >= -81) turbineTrip("低真空保护", "Low vacuum trip");

      // lube oil
      const ac = n("acA") + n("acB"), dc = n("dc");
      const loTarget = ac ? 0.13 : dc ? 0.10 : 0;
      s.loP = toward(s.loP, loTarget, loTarget > s.loP ? 0.02 : (ac || dc ? 0.02 : 0.008));
      if (s.loP <= 0.08) ["acA", "acB"].forEach((k) => { if (E[k].il) startEq(k, true); });
      if (s.loP <= 0.06 && E.dc.il) startEq("dc", true);
      if (s.loP <= 0.04) turbineTrip("润滑油压低低", "Tekanan oli pelumas low-low");

      // EH
      if (n("ehA") + n("ehB")) s.ehP = toward(s.ehP, 14.13, 0.8); else s.ehP -= 0.32;
      if (s.ehP <= 11.2) ["ehA", "ehB"].forEach((k) => { if (E[k].il) startEq(k, true); });
      if (s.ehP <= 9.8) turbineTrip("EH油压低低", "Tekanan EH low-low");

      // CCW
      if (n("ccwA") + n("ccwB")) { s.ccwP = toward(s.ccwP, 0.57, 0.1); s.ccwT = toward(s.ccwT, 33.5, 0.15); }
      else { s.ccwP = toward(s.ccwP, 0.05, 0.1); s.ccwT += 0.22; }
      if (s.ccwP <= 0.35) ["ccwA", "ccwB"].forEach((k) => { if (E[k].il) startEq(k, true); });
      s.loT = 40.3 + Math.max(0, s.ccwT - 33.5) * 1.15;
      s.ehT = 52.7 + Math.max(0, s.ccwT - 33.5) * 0.6;
      if (s.loT >= 55) turbineTrip("轴承温度高", "Suhu bearing tinggi (pendingin hilang)");

      // HPH
      if (s.hphIn) { if (s.hphLeak) s.hph1L += 3.5; s.fwT = toward(s.fwT, 200, 0.8); }
      else { s.hph1L = toward(s.hph1L, -56, 3); s.fwT = toward(s.fwT, 157.2, 0.8); }
      if (s.hph1L >= 138) turbineTrip("高加水位高高", "Level HPH1 high-high (risiko water induction)");

      // alarm proses
      cond("dal", s.daL < 1600, "除氧器水位低", "Level deaerator low");
      cond("hwh", s.hwL > 1000, "热井水位高", "Level hotwell high");
      cond("cpl", s.condP < 1.0, "凝结水压力低", "Tekanan kondensat low");
      cond("fwl", s.fwF < 100 && !s.tripped, "给水流量低", "Aliran feedwater low");
      cond("drl", s.drum < -75, "汽包水位低", "Level drum low");
      cond("vac", s.vac > -88, "真空低报警", "Vakum low");
      cond("lop", s.loP < 0.08, "润滑油压低", "Tekanan oli low");
      cond("ehp", s.ehP < 11.2, "EH油压低", "Tekanan EH low");
      cond("ccp", s.ccwP < 0.35, "闭式水压力低", "Tekanan CCW low");
      cond("lot", s.loT > 45, "润滑油温高", "Suhu oli tinggi");
      cond("hh1", s.hph1L > 38, "1号高加水位高", "Level HPH1 high");
      cond("hh2", s.hph1L > 88, "1号高加水位高二值 保护拒动", "Level HPH1 HH — proteksi tidak bekerja!", "t");

      checkGoal();
    }

    /* ---- skenario ---- */
    function checkGoal() {
      if (ended) return;
      if (s.tripped) return finish(false);
      if (!scen) return;
      if (scen.goal(s, E)) { stable++; if (stable >= 4) finish(true); } else stable = 0;
    }
    function finish(ok) {
      ended = true; running = false; clearInterval(timer);
      const t = s.t;
      let score = 0;
      if (ok) {
        score = Math.round(Math.max(40, 100 - Math.max(0, t - 15) * 0.9));
        if (scen.id === "lo" && dcUsed) { score -= 10; penalties.push("Pompa DC sempat start (tekanan oli sudah turun ke 0.06 MPa)."); }
        const unack = alarms.filter((a) => !a.ack).length;
        if (unack) { score -= 5; penalties.push(`${unack} alarm belum di-acknowledge (确认).`); }
        score = Math.max(0, score);
        const best = store.get("dcsBest", {}); best[scen.id] = Math.max(best[scen.id] || 0, score); store.set("dcsBest", best);
      }
      const tb = $("#tripbox");
      tb.hidden = false;
      tb.innerHTML = `
        <div class="tb-inner ${ok ? "ok" : "bad"}">
          <div class="tb-title">${ok ? "✅ Gangguan teratasi" : "⛔ " + (s.firstOut ? "汽机跳闸 — Turbin trip" : "Gagal")}</div>
          ${s.firstOut ? `<div>首出 / first-out: <b>${esc(s.firstOut.cn)}</b> — ${esc(s.firstOut.id)}</div>` : ""}
          ${ok ? `<div class="tb-score">${score}<small>/100</small></div><div>Waktu: ${t} detik</div>` : ""}
          ${penalties.length ? `<ul>${penalties.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
          <p><b>Pembahasan:</b> ${esc(scen ? scen.debrief : "Mode bebas: baca first-out di atas, lalu cari parameter mana yang menyebabkan proteksi bekerja. Tekan Reset untuk mulai lagi.")}</p>
          <div class="row" style="justify-content:center"><button class="btn primary" id="again">Coba lagi</button><button class="btn" id="close">Lihat layar</button></div>
        </div>`;
      $("#again").onclick = () => start();
      if (!scen) $("#again").textContent = "Mulai ulang";
      $("#close").onclick = () => { tb.hidden = true; };
      draw();
    }

    function reset() {
      clearInterval(timer);
      s = initState(); E = initEq(); alarms = []; active = new Set(); stable = 0; penalties = []; ended = false; dcUsed = false; scen = null; running = false; paused = false;
      $("#tripbox").hidden = true; $("#fp").hidden = true; $("#brief").innerHTML = "";
      $("#scPause").textContent = "Jeda";
      draw();
    }

    function start() {
      reset();
      let id = $("#scSel").value;
      if (id === "random") id = SKENARIO[Math.floor(Math.random() * SKENARIO.length)].id;
      scen = SKENARIO.find((x) => x.id === id) || null;
      if (scen) {
        (scen.fault.unlock || []).forEach((k) => { E[k].il = false; });
        $("#brief").innerHTML = `<div class="brief-box"><b>${esc(scen.judul)}</b><p>${esc(scen.brief)}</p><p class="muted"><b>Target:</b> ${esc(scen.goalText)}</p><details><summary>Butuh petunjuk?</summary><p>Lihat alarm dan cari panel yang nilainya bergerak. Klik pompa untuk membuka faceplate, lalu start/stop atau 联锁 dengan konfirmasi 确认.</p></details></div>`;
      } else {
        $("#brief").innerHTML = `<div class="brief-box"><b>Mode bebas</b><p>Unit stabil di ±64 MW. Coba stop/start pompa, lepas interlock, atau turunkan beban, lalu lihat apa yang terjadi. Nggak ada skor di sini.</p></div>`;
      }
      running = true;
      timer = setInterval(() => { if (!paused) { step(); draw(); } }, 1000);
      draw();
    }

    /* ---- tampilan ---- */
    function fmt(v, d) { return Number(v).toFixed(d); }
    function draw() {
      body.querySelectorAll("[data-v]").forEach((el) => {
        const k = el.dataset.v; let v = s[k];
        if (["load", "msP", "vac", "loP", "ehP", "fwF", "msF"].includes(k) && running && !s.tripped) v += (Math.random() - 0.5) * (k === "fwF" || k === "msF" ? 0.8 : k === "load" ? 0.15 : 0.01);
        el.textContent = fmt(v, +el.dataset.d);
      });
      const warn = { daL: s.daL < 1600, vac: s.vac > -88, loP: s.loP < 0.08, ehP: s.ehP < 11.2, ccwP: s.ccwP < 0.35, loT: s.loT > 45, drum: s.drum < -75, hph1L: s.hph1L > 38, condP: s.condP < 1, fwF: s.fwF < 100, hwL: s.hwL > 1000 };
      body.querySelectorAll("[data-v]").forEach((el) => el.classList.toggle("warn", !!warn[el.dataset.v]));
      Object.entries(E).forEach(([k, q]) => {
        const b = body.querySelector(`.pump[data-eq="${k}"]`); if (!b) return;
        b.classList.toggle("run", q.run); b.classList.toggle("fault", q.fault); b.classList.toggle("starting", !!q.starting);
        body.querySelector(`[data-amp="${k}"]`).textContent = (q.run ? q.amp + (Math.random() - 0.5) * 0.4 : 0).toFixed(1) + "A";
        const il = body.querySelector(`[data-il="${k}"]`);
        il.textContent = q.fault ? "故障" : q.il ? "联锁" : "解锁";
        il.className = "pil " + (q.fault ? "f" : q.il ? "on" : "off");
      });
      $("#hphState").innerHTML = s.hphIn ? L("投入", "In service") : L("已解列", "Diisolasi");
      $("#hphState").className = "tagbox " + (s.hphIn ? "on" : "off");
      $("#clk").textContent = (running || ended ? "T+" + s.t + "s" : "siap") + (paused ? " ⏸" : "");
      $("#alist").innerHTML = alarms.length
        ? alarms.map((a) => `<div class="al ${a.lvl} ${a.ack ? "ack" : ""}"><span class="at">T+${a.t}s</span><span>${L(a.cn, a.id)}</span></div>`).join("")
        : `<div class="al ack">${L("无报警", "Tidak ada alarm")}</div>`;
      $("#ackBtn").classList.toggle("blink", alarms.some((a) => !a.ack));
    }

    /* ---- faceplate ---- */
    function openFp(k) {
      const q = E[k], fp = $("#fp");
      let pending = null;
      const drawFp = () => {
        fp.hidden = false;
        fp.innerHTML = `
          <div class="fp-inner">
            <div class="fp-head">${L(q.cn, q.id)}<button class="fp-x" id="fpX">✕</button></div>
            <div class="dp-row"><span>${L("状态", "Status")}</span><b class="${q.run ? "st-run" : "st-stop"}">${q.fault ? L("故障", "Fault") : q.starting ? L("启动中", "Starting…") : q.run ? L("运行", "Running") : L("停止", "Stop")}</b></div>
            <div class="dp-row"><span>${L("电流", "Arus")}</span><b>${q.run ? q.amp.toFixed(1) : "0.0"} A</b></div>
            <div class="dp-row"><span>${L("联锁", "Interlock")}</span><b>${q.il ? L("投入", "Aktif") : L("解除", "Lepas")}</b></div>
            ${pending ? `
              <div class="fp-confirm">${L("确认执行?", "Yakin jalankan perintah?")} <b>${esc(pending.label)}</b>
                <div class="row" style="margin-top:8px"><button class="dbtn ok" id="fpOk">${L("确认", "OK")}</button><button class="dbtn" id="fpCancel">${L("取消", "Batal")}</button></div></div>` : `
              <div class="fp-btns">
                <button class="dbtn" data-a="start" ${q.run || q.fault || q.starting || s.tripped ? "disabled" : ""}>${L("启动", "Start")}</button>
                <button class="dbtn" data-a="stop" ${!q.run && !q.starting ? "disabled" : ""}>${L("停止", "Stop")}</button>
                <button class="dbtn" data-a="il">${q.il ? L("联锁解除", "Lepas interlock") : L("联锁投入", "Aktifkan interlock")}</button>
              </div>`}
          </div>`;
        fp.querySelector("#fpX").onclick = () => { fp.hidden = true; };
        fp.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => {
          const a = b.dataset.a;
          pending = { a, label: a === "start" ? "启动 Start" : a === "stop" ? "停止 Stop" : q.il ? "联锁解除" : "联锁投入" };
          drawFp();
        });
        const ok = fp.querySelector("#fpOk");
        if (ok) {
          ok.onclick = () => {
            if (pending.a === "start") startEq(k);
            if (pending.a === "stop") {
              if (q.run && scen && !E[PAIR[k]]?.run && k !== "dc") penalties.push(`${q.id} distop padahal pasangannya tidak running.`);
              stopEq(k);
            }
            if (pending.a === "il") q.il = !q.il;
            pending = null; fp.hidden = true; draw();
          };
          fp.querySelector("#fpCancel").onclick = () => { pending = null; drawFp(); };
        }
      };
      drawFp();
    }

    body.querySelectorAll(".pump").forEach((b) => b.addEventListener("click", () => openFp(b.dataset.eq)));
    $("#ackBtn").onclick = () => { alarms.forEach((a) => { a.ack = true; }); draw(); };
    $("#hphBtn").onclick = () => {
      if (s.tripped) return;
      if (s.hphIn) { s.hphIn = false; alarm("hphiso" + s.t, "高加解列", "HPH diisolasi manual", "i"); }
      else if (!s.hphLeak) { s.hphIn = true; alarm("hphin" + s.t, "高加投入", "HPH dimasukkan", "i"); }
      draw();
    };
    body.querySelectorAll("[data-load]").forEach((b) => b.onclick = () => {
      if (s.tripped) return;
      s.loadSP = Math.min(100, Math.max(30, s.loadSP + +b.dataset.load)); draw();
    });
    $("#tripBtn").onclick = () => {
      if (s.tripped) return;
      const b = $("#tripBtn");
      if (!b.dataset.armed) {
        b.dataset.armed = "1"; b.innerHTML = L("确认打闸?", "Klik lagi untuk trip");
        setTimeout(() => { delete b.dataset.armed; b.innerHTML = L("打闸", "Trip manual"); }, 3000);
        return;
      }
      delete b.dataset.armed; b.innerHTML = L("打闸", "Trip manual");
      turbineTrip("手动打闸", "Trip manual operator"); if (!ended) finish(false); draw();
    };
    $("#scStart").onclick = start;
    $("#scReset").onclick = reset;
    $("#scPause").onclick = () => { if (!running) return; paused = !paused; $("#scPause").textContent = paused ? "Lanjut" : "Jeda"; draw(); };

    draw();
    return () => clearInterval(timer);
  }

  window.DCS = { renderLab, mountDiagram150 };
})();
