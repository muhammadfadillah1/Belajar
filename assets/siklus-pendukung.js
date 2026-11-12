/* Siklus pendukung: diagram interaktif berbasis data
   node: [id, x, y, w, h, label, sub]
   edge: [kelas, path]  kelas: coal | air | gas | ash | oil | ret | cool | water
   Angka "DCS lo" diambil dari foto layar DCS turbin unit #2 (beban ±64 MW). */
(function () {
  "use strict";

  const SIKLUS_PENDUKUNG = [
    {
      id: "batubara", judul: "Batubara & Pembakaran", vb: "0 0 800 330",
      legend: [["coal", "Batubara / serbuk"], ["air", "Udara primer"]],
      nodes: [
        ["kapal", 20, 40, 120, 50, "Kapal/Tongkang", "ship unloader"],
        ["yard", 190, 40, 120, 50, "Stockpile", "stacker-reclaimer"],
        ["crusher", 360, 40, 120, 50, "Crusher", "+ magnetic separator"],
        ["bunker", 530, 40, 120, 50, "Coal bunker", "diisi tripper"],
        ["feeder", 530, 150, 120, 50, "Coal feeder", "gravimetric (t/h)"],
        ["mill", 360, 150, 120, 50, "Pulverizer", "giling + keringkan"],
        ["pa", 190, 150, 120, 50, "PA fan + APH", "udara primer panas"],
        ["burner", 360, 260, 120, 50, "Burner", "+ oil gun start-up"],
        ["furnace", 600, 250, 170, 70, "Ruang bakar", "boiler"],
      ],
      edges: [
        ["coal", "M140 65 H190"], ["coal", "M310 65 H360"], ["coal", "M480 65 H530"],
        ["coal", "M590 90 V150"], ["coal", "M530 175 H480"], ["air", "M310 175 H360"],
        ["coal", "M420 200 V260"], ["coal", "M480 285 H600"],
      ],
      labels: [[488, 240, "serbuk + udara primer"], [500, 278, "api"]],
      steps: [
        { judul: "Bongkar dari kapal", node: ["kapal"], isi: "Batubara dari tongkang/kapal dibongkar ship unloader atau grab, lalu dibawa belt conveyor ke stockpile. Sampel diambil untuk analisis kalori, kadar air, sulfur, dan abu.", alat: ["coal-handling"] },
        { judul: "Stockpile", node: ["yard"], isi: "Stacker menumpuk batubara, reclaimer mengambilnya kembali. Terapkan FIFO, compaction, dan pantau suhu karena batubara kalori rendah mudah self-heating.", alat: ["coal-handling"] },
        { judul: "Crusher & separator", node: ["crusher"], isi: "Magnetic separator membuang besi, lalu crusher memperkecil ukuran batubara (umumnya < 30–50 mm) supaya beban mill ringan.", alat: ["coal-handling"] },
        { judul: "Coal bunker", node: ["bunker"], isi: "Tripper membagi batubara ke tiap bunker mill. Bunker menampung stok untuk beberapa jam operasi. Batubara basah bisa hang-up (rat-holing).", alat: ["coal-feeder"] },
        { judul: "Coal feeder", node: ["feeder"], isi: "Gravimetric feeder mengatur laju batubara (t/h) ke mill sesuai permintaan bahan bakar dari CCS.", alat: ["coal-feeder"] },
        { judul: "Pulverizer", node: ["mill", "pa"], isi: "Batubara digiling jadi serbuk dan dikeringkan oleh udara primer panas dari PA fan lewat APH. Classifier hanya meloloskan partikel halus. Suhu outlet mill dijaga sekitar 60–80 °C.", alat: ["pulverizer", "pa-fan"] },
        { judul: "Burner & ruang bakar", node: ["burner", "furnace"], isi: "Serbuk batubara + udara primer masuk burner, dicampur udara sekunder dari windbox, lalu terbakar di ruang bakar. Oil gun dipakai saat start-up dan untuk stabilisasi api.", alat: ["burner", "waterwall"] },
      ],
    },
    {
      id: "udara", judul: "Udara & Gas Buang", vb: "0 0 760 340",
      legend: [["air", "Udara"], ["coal", "Serbuk + udara primer"], ["gas", "Gas buang"]],
      nodes: [
        ["fd", 20, 40, 100, 46, "FD fan", "udara sekunder"],
        ["pa", 20, 120, 100, 46, "PA fan", "udara primer"],
        ["aph", 200, 40, 110, 140, "Air preheater", "rotary regeneratif"],
        ["windbox", 380, 40, 100, 46, "Windbox", "udara sekunder"],
        ["mill", 380, 130, 100, 46, "Pulverizer", ""],
        ["furnace", 560, 30, 170, 170, "Ruang bakar", "SH · RH · ECO"],
        ["esp", 210, 260, 100, 50, "ESP", "tangkap fly ash"],
        ["id", 95, 260, 90, 50, "ID fan", "hisap gas"],
        ["stack", 20, 210, 50, 110, "Stack", ""],
      ],
      edges: [
        ["air", "M120 63 H200"], ["air", "M120 143 H200"], ["air", "M310 63 H380"], ["air", "M310 153 H380"],
        ["air", "M480 63 H560"], ["coal", "M480 153 H560"],
        ["gas", "M645 200 V230 H290 V180"], ["gas", "M230 180 V260"], ["gas", "M210 285 H185"], ["gas", "M95 285 H70"],
      ],
      labels: [[400, 224, "gas ±350 °C → APH"], [322, 55, "SA panas"], [322, 145, "PA panas"], [238, 236, "gas ±130 °C"]],
      steps: [
        { judul: "FD fan → APH → windbox", node: ["fd", "aph", "windbox"], isi: "FD fan (di DCS lo disebut 二次风机 / secondary air fan) mendorong udara lewat APH supaya panas, lalu ke windbox burner sebagai udara pembakaran utama.", alat: ["fd-fan", "aph"], dcs: "O₂ gas buang sisi A ±3.4 %, sisi B ±4.9 %" },
        { judul: "PA fan → APH → mill", node: ["pa", "aph", "mill"], isi: "PA fan (一次风机) memberi udara primer. Sebagian dipanaskan di APH, sebagian tetap dingin (cold PA). Campurannya mengatur suhu outlet mill sekaligus mengangkut serbuk batubara ke burner.", alat: ["pa-fan", "pulverizer"] },
        { judul: "Pembakaran & perpindahan panas", node: ["furnace"], isi: "Gas panas memberi panas radiasi ke waterwall, lalu konveksi ke superheater, reheater, dan economizer sepanjang jalur gas.", alat: ["waterwall", "superheater", "reheater", "economizer"] },
        { judul: "Gas → APH", node: ["aph"], isi: "Sisa panas gas buang diserap elemen APH lalu dilepas ke udara masuk. Suhu gas turun drastis, efisiensi boiler naik.", alat: ["aph"] },
        { judul: "ESP", node: ["esp"], isi: "Fly ash ditangkap secara elektrostatik (efisiensi > 99 %) dan jatuh ke hopper untuk diangkut sistem abu.", alat: ["esp"] },
        { judul: "ID fan", node: ["id"], isi: "ID fan menghisap gas sehingga tekanan furnace sedikit negatif. Di DCS lo, ID fan disebut 引风机.", alat: ["id-fan"] },
        { judul: "Cerobong & CEMS", node: ["stack"], isi: "Gas dibuang lewat cerobong. CEMS memantau SO₂, NOx, debu, dan O₂ secara kontinu.", alat: ["stack-cems"] },
      ],
    },
    {
      id: "cw", judul: "Air Pendingin Utama", vb: "0 0 820 330",
      legend: [["cool", "Air laut / air pendingin"], ["water", "Air demin"]],
      nodes: [
        ["laut", 20, 40, 100, 60, "Laut", "kanal intake"],
        ["screen", 160, 40, 120, 60, "Screen", "trash rack + band"],
        ["cwp", 320, 40, 120, 60, "Pompa CW", "7 pompa, bersama"],
        ["cond", 500, 30, 140, 80, "Kondensor", "+ ball cleaning"],
        ["outfall", 690, 40, 110, 60, "Outfall", "kembali ke laut"],
        ["ocw", 500, 190, 140, 56, "Open CW pump", "A/B + filter otomatis"],
        ["phe", 320, 190, 120, 56, "PHE A/B", "dinginkan air CCW"],
        ["vpc", 320, 270, 120, 50, "Cooler vac. pump", ""],
        ["desal", 20, 190, 130, 56, "Desal → demin", "makeup siklus"],
      ],
      edges: [
        ["cool", "M120 70 H160"], ["cool", "M280 70 H320"], ["cool", "M440 70 H500"], ["cool", "M640 70 H690"],
        ["cool", "M470 70 V150 H570 V190"], ["cool", "M500 218 H440"], ["cool", "M570 246 V295 H440"],
        ["cool", "M70 100 V190"], ["water", "M150 218 H200"],
      ],
      labels: [[478, 132, "header CW"], [160, 212, "→ siklus"]],
      steps: [
        { judul: "Intake & screen", node: ["laut", "screen"], isi: "Air laut masuk kanal intake (引水明渠), disaring trash rack dan traveling screen. Beda level sebelum dan sesudah screen jadi indikasi screen tersumbat (sampah, ubur-ubur).", alat: ["cw-pump"], dcs: "Level intake ±7.61 / 7.58 m (sebelum / sesudah screen)" },
        { judul: "Pompa CW", node: ["cwp"], isi: "Rumah pompa CW di unit lo berisi 7 pompa yang menyuplai kondensor beberapa unit. Pompa 3# berstatus cadangan (备用).", alat: ["cw-pump"], dcs: "Pompa 2# running, header ±0.17 MPa" },
        { judul: "Kondensor", node: ["cond"], isi: "Air laut lewat tube kondensor dan menyerap panas uap exhaust. Ball cleaning (胶球清洗) A/B menjaga tube tetap bersih.", alat: ["kondensor"], dcs: "Masuk ±30.1–30.4 °C, keluar ±33.8–33.9 °C (ΔT ±3.5 °C)" },
        { judul: "Outfall", node: ["outfall"], isi: "Air yang sudah hangat dibuang kembali ke laut lewat saluran outfall. Suhu buangan dibatasi aturan lingkungan.", alat: ["cw-pump"] },
        { judul: "Open cooling water", node: ["ocw", "phe", "vpc"], isi: "Sebagian air dari header CW dipompa open CW pump (开式循环水泵) lewat filter otomatis ke PHE (mendinginkan air CCW) dan cooler vacuum pump.", alat: ["ccw", "vacuum-pump"], dcs: "Tekanan open CW ±0.21 MPa" },
        { judul: "Desalinasi & demin", node: ["desal"], isi: "Air laut juga jadi bahan baku air demin: desalinasi/RO lalu demineralizer, dipakai untuk makeup siklus air-uap (化学补水) dan CCW.", alat: ["wtp"] },
      ],
    },
    {
      id: "ccw", judul: "Closed Cooling Water", vb: "0 0 900 320",
      legend: [["cool", "Supply dingin"], ["ret", "Return hangat"]],
      nodes: [
        ["tank", 20, 40, 110, 80, "Buffer tank", "makeup demin"],
        ["pumps", 190, 50, 120, 60, "Pompa CCW", "A/B"],
        ["phe", 370, 50, 120, 60, "PHE A/B", "panas → open CW"],
        ["c1", 40, 200, 150, 50, "Fan PA / SA / ID", "cooler bearing"],
        ["c2", 220, 200, 150, 50, "Oli turbin & EH", "冷油器 · EH冷却器"],
        ["c3", 400, 200, 150, 50, "BFP A/B", "oli & bearing"],
        ["c4", 580, 200, 150, 50, "Air cooler gen.", "发电机空气冷却器"],
        ["c5", 760, 200, 120, 50, "Bearing pompa", "CEP & drain LP"],
      ],
      edges: [
        ["cool", "M130 80 H190"], ["cool", "M310 80 H370"], ["cool", "M490 80 H850 V170 H115"],
        ["cool", "M115 170 V200"], ["cool", "M295 170 V200"], ["cool", "M475 170 V200"], ["cool", "M655 170 V200"], ["cool", "M820 170 V200"],
        ["ret", "M115 250 V290"], ["ret", "M295 250 V290"], ["ret", "M475 250 V290"], ["ret", "M655 250 V290"],
        ["ret", "M820 250 V290 H75 V120"],
      ],
      labels: [[600, 72, "supply ±33 °C"], [600, 164, "header supply"], [600, 306, "header return"]],
      steps: [
        { judul: "Buffer tank", node: ["tank"], isi: "Tangki ekspansi CCW berisi air demin. Level turun terus berarti ada kebocoran di salah satu cooler.", alat: ["ccw"], dcs: "Level buffer tank ±793 mm" },
        { judul: "Pompa CCW", node: ["pumps"], isi: "Satu pompa running, satu standby 联锁. Auto-start pompa standby saat tekanan header turun.", alat: ["ccw"], dcs: "Pompa A running 13.5 A, B 联锁; tekanan 0.57 MPa" },
        { judul: "PHE", node: ["phe"], isi: "Plate heat exchanger membuang panas air CCW ke open cooling water (air laut), jadi air laut tidak pernah masuk ke cooler peralatan.", alat: ["ccw"] },
        { judul: "Konsumen", node: ["c1", "c2", "c3", "c4", "c5"], isi: "Air CCW mendinginkan bearing fan PA/SA/ID, cooler oli pelumas & EH, BFP, air cooler generator (generator lo berpendingin udara), serta bearing CEP & pompa drain LP.", alat: ["lube-oil", "bfp", "generator", "fd-fan"], dcs: "Outlet konsumen ±32–36 °C, cooler oli ±42 °C" },
        { judul: "Return", node: ["tank", "pumps"], isi: "Air hangat kembali ke suction pompa dan buffer tank, lalu didinginkan lagi di PHE. Loop tertutup, jadi kualitas air (pH, konduktivitas) mudah dijaga.", alat: ["ccw"] },
      ],
    },
    {
      id: "abu", judul: "Abu", vb: "0 0 880 300",
      legend: [["ash", "Abu"], ["air", "Udara conveying"]],
      nodes: [
        ["furnace", 20, 30, 140, 120, "Ruang bakar", ""],
        ["ssc", 20, 210, 140, 56, "SSC", "bottom ash, seal air"],
        ["bunker", 210, 210, 130, 56, "Bunker BA", "bottom ash"],
        ["eco", 210, 40, 130, 50, "Hopper ECO/APH", ""],
        ["esp", 390, 40, 130, 50, "Hopper ESP", ""],
        ["comp", 570, 160, 130, 50, "Kompresor", "udara kering"],
        ["silo", 740, 60, 120, 90, "Fly ash silo", ""],
        ["out", 740, 210, 120, 56, "Truk / FABA", "pemanfaatan"],
      ],
      edges: [
        ["ash", "M90 150 V210"], ["ash", "M160 238 H210"], ["ash", "M340 248 H740"],
        ["ash", "M275 90 V115 H740"], ["ash", "M455 90 V115"], ["air", "M635 160 V115"], ["ash", "M800 150 V210"],
      ],
      labels: [[520, 108, "pneumatic conveying (dense phase)"], [470, 242, "truk"]],
      steps: [
        { judul: "Bottom ash", node: ["furnace", "ssc"], isi: "Abu berat dan clinker jatuh dari dasar furnace ke submerged scraper conveyor (SSC). Air di SSC sekaligus jadi seal furnace, jadi levelnya harus dijaga.", alat: ["ash-handling"] },
        { judul: "Bunker bottom ash", node: ["bunker", "out"], isi: "SSC membawa bottom ash ke bunker, lalu diangkut truk ke ash yard atau dimanfaatkan.", alat: ["ash-handling"] },
        { judul: "Hopper fly ash", node: ["eco", "esp"], isi: "Fly ash terkumpul di hopper economizer, APH, dan terutama ESP. Hopper yang penuh bisa menyebabkan short di elektroda ESP.", alat: ["esp"] },
        { judul: "Pneumatic conveying", node: ["comp"], isi: "Fly ash ditiup udara kering bertekanan (dense phase) lewat pipa ke silo. Udara harus kering karena abu lembab bikin pipa buntu.", alat: ["ash-handling", "aux"] },
        { judul: "Silo & pemanfaatan", node: ["silo", "out"], isi: "Dari silo, fly ash dimuat ke truk untuk dimanfaatkan (FABA: semen, beton, paving) atau dibuang ke ash disposal.", alat: ["ash-handling"] },
      ],
    },
    {
      id: "oli", judul: "Oli Pelumas Turbin", vb: "0 0 900 350",
      legend: [["oil", "Oli supply"], ["ret", "Oli return"]],
      nodes: [
        ["tank", 20, 150, 150, 80, "Tangki oli", "+ fan uap oli A/B"],
        ["acp", 230, 110, 130, 46, "Pompa AC", "主 / 备"],
        ["dcp", 230, 200, 130, 46, "Pompa DC", "emergency"],
        ["cooler", 420, 150, 110, 56, "Cooler oli", "didinginkan CCW"],
        ["filter", 590, 150, 110, 56, "Filter", ""],
        ["header", 740, 150, 110, 56, "Header oli", "ke bearing"],
        ["bearings", 300, 20, 560, 56, "Bearing #1 – #5", "turbin + generator"],
        ["jop", 230, 290, 130, 46, "Jacking oil", "pompa A/B"],
        ["tg", 420, 290, 130, 46, "Turning gear", "盘车装置"],
      ],
      edges: [
        ["oil", "M170 175 H200 V133 H230"], ["oil", "M200 175 V223 H230"],
        ["oil", "M360 133 H390 V178 H420"], ["oil", "M360 223 H390 V178"],
        ["oil", "M530 178 H590"], ["oil", "M700 178 H740"], ["oil", "M795 150 V76"],
        ["ret", "M300 48 H95 V150"], ["oil", "M95 230 V313 H230"], ["oil", "M360 300 H400 V270 H875 V48 H860"],
      ],
      labels: [[140, 40, "oli balik"], [600, 264, "jacking oil ±2 MPa → angkat poros"]],
      steps: [
        { judul: "Tangki oli", node: ["tank"], isi: "Tangki oli dilengkapi fan uap oli (排烟风机) supaya tangki sedikit vakum dan uap oli tidak bocor ke luar.", alat: ["lube-oil"], dcs: "Level ±1522 mm, suhu tangki ±51 °C" },
        { judul: "Pompa AC & DC", node: ["acp", "dcp"], isi: "Pompa AC 主/备: satu running, satu 联锁. Pompa DC dari baterai adalah lapisan terakhir. Logika umum: tekanan turun → AC standby start → DC start → turbin trip.", alat: ["lube-oil"], dcs: "Pompa AC (备) running 41.4 A, AC (主) & DC 联锁" },
        { judul: "Cooler & filter", node: ["cooler", "filter"], isi: "Oli didinginkan di cooler (air CCW) lalu disaring. Ada dua cooler dan dua filter supaya bisa dipindah tanpa stop unit.", alat: ["lube-oil", "ccw"], dcs: "Sebelum cooler ±52.5 °C, sesudah ±40.3 °C" },
        { judul: "Header & bearing", node: ["header", "bearings"], isi: "Oli bertekanan rendah masuk ke bearing #1–#5 (HP, IP-LP, generator) untuk melumasi dan membawa panas.", alat: ["lube-oil", "turbin"], dcs: "Header ±0.13 MPa, oli balik ±47–48 °C, metal bearing ±54–72 °C" },
        { judul: "Return ke tangki", node: ["bearings", "tank"], isi: "Oli kembali ke tangki secara gravitasi lewat pipa return. Suhu oli balik tiap bearing jadi indikasi kondisi bearing.", alat: ["lube-oil"] },
        { judul: "Jacking oil & turning gear", node: ["jop", "tg"], isi: "Saat putaran rendah, jacking oil bertekanan tinggi mengangkat poros supaya tidak gesek kering. Turning gear memutar poros pelan setelah turbin stop agar rotor tidak melengkung.", alat: ["lube-oil"], dcs: "Jacking oil ±2.04 MPa" },
      ],
    },
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem("pltu:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("pltu:" + k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  };

  function svgFor(c) {
    const nodes = c.nodes.map(([id, x, y, w, h, label, sub]) => {
      const cx = x + w / 2, cy = y + h / 2;
      return `<g class="node" data-node="${id}"><rect class="shape" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>
        <text x="${cx}" y="${sub ? cy - 2 : cy + 4}" text-anchor="middle" font-weight="700" font-size="12">${esc(label)}</text>
        ${sub ? `<text x="${cx}" y="${cy + 13}" text-anchor="middle" class="lbl-s">${esc(sub)}</text>` : ""}</g>`;
    }).join("");
    const edges = c.edges.map(([k, d]) => `<path class="pipe ${k}" d="${d}"/>`).join("");
    const labels = (c.labels || []).map(([x, y, t]) => `<text x="${x}" y="${y}" class="lbl-s halo">${esc(t)}</text>`).join("");
    const [, , w] = c.vb.split(" ").map(Number);
    return `<svg class="diagram sp" viewBox="${c.vb}" style="min-width:${Math.min(640, w)}px" role="img" aria-label="Diagram ${esc(c.judul)}">${edges}${labels}${nodes}</svg>`;
  }

  function mount(root, alatById) {
    let ci = Math.min(store.get("spIdx", 0), SIKLUS_PENDUKUNG.length - 1), si = 0;
    root.innerHTML = `
      <div class="chips" id="spTabs" style="margin-bottom:12px">
        ${SIKLUS_PENDUKUNG.map((c, i) => `<button class="chip" data-i="${i}">${esc(c.judul)}</button>`).join("")}
      </div>
      <div class="card" id="spCard"></div>`;
    const card = root.querySelector("#spCard");

    function drawCycle() {
      const c = SIKLUS_PENDUKUNG[ci];
      root.querySelectorAll("#spTabs .chip").forEach((b, i) => b.classList.toggle("on", i === ci));
      card.innerHTML = `
        <div class="legend">${c.legend.map(([k, t]) => `<span><i class="lg-${k}"></i>${esc(t)}</span>`).join("")}</div>
        <div class="diagram-wrap">${svgFor(c)}</div>
        <div class="steps" id="spSteps">${c.steps.map((s, i) => `<button class="step-btn" data-i="${i}">${i + 1}. ${esc(s.judul)}</button>`).join("")}</div>
        <div class="step-detail" id="spDetail"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn" id="spPrev">← Sebelumnya</button>
          <button class="btn primary" id="spNext">Berikutnya →</button>
        </div>`;
      card.querySelector("#spSteps").addEventListener("click", (e) => { const b = e.target.closest(".step-btn"); if (b) drawStep(+b.dataset.i); });
      card.querySelectorAll(".sp .node").forEach((n) => n.addEventListener("click", () => {
        const i = c.steps.findIndex((s) => s.node.includes(n.dataset.node));
        if (i >= 0) drawStep(i);
      }));
      card.querySelector("#spPrev").onclick = () => drawStep(si - 1);
      card.querySelector("#spNext").onclick = () => drawStep(si + 1);
      drawStep(0);
    }

    function drawStep(i) {
      const c = SIKLUS_PENDUKUNG[ci];
      si = (i + c.steps.length) % c.steps.length;
      const s = c.steps[si];
      card.querySelectorAll(".sp .node").forEach((n) => n.classList.toggle("active", s.node.includes(n.dataset.node)));
      card.querySelectorAll("#spSteps .step-btn").forEach((b, j) => b.classList.toggle("on", j === si));
      card.querySelector("#spDetail").innerHTML = `
        <h3>${si + 1}. ${esc(s.judul)}</h3>
        <p>${esc(s.isi)}</p>
        ${s.dcs ? `<p class="muted"><b>Di DCS lo (±64 MW):</b> ${esc(s.dcs)}</p>` : ""}
        <div class="muted" style="font-size:.88rem">Pelajari alatnya:</div>
        <div class="linklist">${s.alat.filter((id) => alatById[id]).map((id) => `<a href="#peralatan-${id}">${alatById[id].icon} ${esc(alatById[id].nama)}</a>`).join("")}</div>`;
    }

    root.querySelector("#spTabs").addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      ci = +b.dataset.i; store.set("spIdx", ci); drawCycle();
    });
    drawCycle();
  }

  window.SiklusPendukung = { mount, data: SIKLUS_PENDUKUNG };
})();
