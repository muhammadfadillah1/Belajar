/* Belajar PLTU — single page app tanpa framework */
(function () {
  "use strict";

  const app = document.getElementById("app");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sistemById = Object.fromEntries(SISTEM.map((s) => [s.id, s]));
  const alatById = Object.fromEntries(PERALATAN.map((a) => [a.id, a]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem("pltu:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("pltu:" + k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /* ---------------- Tema ---------------- */
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = store.get("theme", null);
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);
  themeBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("theme", next);
  });

  /* ---------------- Router ---------------- */
  const routes = { beranda: renderHome, siklus: renderSiklus, peralatan: renderPeralatan, unit: renderUnit, sop: renderSop, kuis: renderKuis, dcs: renderDcs };
  function renderDcs(param) { window.DCS.renderLab(app, param, (fn) => { cleanup = fn; }); }
  let cleanup = null;

  function router() {
    const m = location.hash.slice(1).match(/^([a-z]+)(?:-(.+))?$/) || [];
    const name = m[1] || "beranda", param = m[2];
    const fn = routes[name] || renderHome;
    if (cleanup) { cleanup(); cleanup = null; }
    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === (routes[name] ? name : "beranda")));
    fn(param ? decodeURIComponent(param) : null);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", router);

  /* ---------------- Beranda ---------------- */
  function renderHome() {
    const best = store.get("best", null);
    app.innerHTML = `
      <section class="card hero">
        <h1>Belajar PLTU dari nol sampai paham gangguan</h1>
        <p>Slide peralatan utama, siklus air-uap, perbandingan unit 150 MW & 380 MW, ringkasan SOP, dan kuis "alat ini fungsinya apa, kalau rusak gimana".</p>
        <div class="row">
          <a class="btn primary" href="#peralatan">Mulai dari peralatan →</a>
          <a class="btn" href="#kuis">Langsung kuis</a>
        </div>
        <div class="stat-row">
          <div class="stat"><b>${PERALATAN.length}</b><span class="muted">peralatan</span></div>
          <div class="stat"><b>${SOAL.length + SOAL_DCS.length + PERALATAN.length * 3 + KAMUS_DCS.length}+</b><span class="muted">soal kuis</span></div>
          <div class="stat"><b>${SOP.length}</b><span class="muted">ringkasan SOP</span></div>
          ${best ? `<div class="stat"><b>${best}%</b><span class="muted">skor terbaik lo</span></div>` : ""}
        </div>
      </section>

      <h2 style="margin-top:28px">Mau belajar apa?</h2>
      <div class="grid grid-3">
        ${feature("#siklus", "🔄", "Siklus Utama", "Diagram interaktif aliran air-uap (Rankine + reheat), plus siklus batubara, udara-gas, air pendingin, dan abu.")}
        ${feature("#peralatan", "🧰", "Slide Peralatan", "Fungsi, cara kerja, parameter yang dipantau, serta gangguan umum & penanganannya.")}
        ${feature("#unit", "⚖️", "Unit 150 vs 380 MW", "Beda tekanan, aliran uap, konfigurasi BFP, pendinginan generator, dan fokus operasinya.")}
        ${feature("#sop", "📋", "SOP Umum", "Start-up, shutdown, MFT, blackout, tube leak, vakum turun, turbine trip.")}
        ${feature("#dcs", "🖥️", "DCS Lab (Turbin 150 MW)", "Simulator gangguan ala layar DCS, peta layar, dan kamus istilah 中文 → Indonesia dari DCS unit lo.")}
        ${feature("#kuis", "🧠", "Kuis", "Fungsi alat, troubleshooting, siklus, unit, dan SOP. Ada pembahasan tiap soal.")}
      </div>

      <div class="note" style="margin-top:24px">
        <b>Catatan penting:</b> materi di sini adalah pengetahuan umum PLTU batubara subkritis, bukan SOP resmi unit mana pun.
        Angka (tekanan, suhu, setpoint trip) adalah nilai tipikal. Untuk kerja nyata, selalu pakai SOP, manual OEM, dan instruksi dari unit lo.
        Datanya bisa diganti di <code>assets/data.js</code>.
      </div>`;
  }
  function feature(href, ico, title, desc) {
    return `<a class="card feature" href="${href}"><div class="ico">${ico}</div><h3>${title}</h3><p class="muted" style="margin:0">${desc}</p></a>`;
  }

  /* ---------------- Siklus ---------------- */
  function cycleSvg() {
    return `
    <svg class="diagram" viewBox="0 0 880 500" role="img" aria-label="Diagram siklus air-uap PLTU">
      <!-- pipes (digambar dulu supaya di bawah node) -->
      <path class="pipe steam" d="M220 70 H265 V100 H290" />
      <path class="pipe reheat" d="M372 138 V220 H232 V146" />
      <path class="pipe steam" d="M220 124 H246 V190 H402 V116 H420" />
      <path class="pipe steam" d="M600 172 V230" />
      <path class="pipe water" d="M610 312 V356" />
      <path class="pipe water" d="M588 380 H532" />
      <path class="pipe water" d="M468 380 H442" />
      <path class="pipe water" d="M350 384 V440 H314" />
      <path class="pipe water" d="M266 440 H232" />
      <path class="pipe water" d="M160 440 H120 V372" />
      <path class="pipe cool" d="M760 252 H682" />
      <path class="pipe cool" d="M682 292 H760" />
      <path class="pipe ext" d="M480 138 V250 H395 V342" />
      <line class="shaft" x1="370" y1="105" x2="705" y2="105" />
      <line class="shaft" x1="795" y1="105" x2="850" y2="105" />

      <text x="268" y="62" class="lbl-s">Main steam</text>
      <text x="250" y="236" class="lbl-s">Cold reheat</text>
      <text x="252" y="184" class="lbl-s">Hot reheat</text>
      <text x="408" y="268" class="lbl-s">Ekstraksi</text>
      <text x="768" y="256" class="lbl-s">Air laut masuk</text>
      <text x="768" y="296" class="lbl-s">Air laut keluar</text>
      <text x="822" y="96" class="lbl-s">Grid</text>

      <!-- Boiler -->
      <g class="node" data-node="boiler">
        <rect class="shape" x="40" y="40" width="180" height="332" rx="10" />
        <text x="130" y="30" text-anchor="middle" font-weight="700">BOILER</text>
        <text x="130" y="76" text-anchor="middle">Superheater</text>
        <text x="130" y="210" text-anchor="middle" font-size="28">🔥</text>
        <text x="130" y="240" text-anchor="middle" class="lbl-s">Ruang bakar / waterwall</text>
        <text x="130" y="350" text-anchor="middle">Economizer</text>
      </g>
      <g class="node" data-node="rh">
        <rect class="shape" x="62" y="108" width="136" height="40" rx="6" />
        <text x="130" y="133" text-anchor="middle">Reheater</text>
      </g>

      <!-- Turbin -->
      <g class="node" data-node="hp">
        <polygon class="shape" points="290,88 370,68 370,142 290,122" />
        <text x="330" y="110" text-anchor="middle" font-weight="700">HP</text>
      </g>
      <g class="node" data-node="iplp">
        <polygon class="shape" points="420,88 510,66 510,144 420,122" />
        <text x="465" y="110" text-anchor="middle" font-weight="700">IP</text>
        <polygon class="shape" points="530,70 670,34 670,176 530,140" />
        <text x="600" y="110" text-anchor="middle" font-weight="700">LP</text>
      </g>

      <!-- Generator -->
      <g class="node" data-node="gen">
        <circle class="shape" cx="750" cy="105" r="45" />
        <text x="750" y="110" text-anchor="middle" font-weight="700">GEN</text>
      </g>

      <!-- Kondensor -->
      <g class="node" data-node="cond">
        <rect class="shape" x="540" y="232" width="142" height="80" rx="8" />
        <text x="611" y="268" text-anchor="middle" font-weight="700">Kondensor</text>
        <text x="611" y="290" text-anchor="middle" class="lbl-s">vakum</text>
      </g>

      <!-- CEP + LPH -->
      <g class="node" data-node="cep">
        <circle class="shape" cx="610" cy="380" r="22" />
        <text x="610" y="385" text-anchor="middle" font-size="12" font-weight="700">CEP</text>
        <rect class="shape" x="470" y="364" width="62" height="32" rx="6" />
        <text x="501" y="385" text-anchor="middle" font-size="12">LPH</text>
      </g>

      <!-- Deaerator -->
      <g class="node" data-node="da">
        <rect class="shape" x="300" y="344" width="142" height="40" rx="20" />
        <text x="371" y="369" text-anchor="middle" font-size="12" font-weight="700">Deaerator</text>
      </g>

      <!-- BFP + HPH -->
      <g class="node" data-node="bfp">
        <circle class="shape" cx="290" cy="440" r="24" />
        <text x="290" y="445" text-anchor="middle" font-size="12" font-weight="700">BFP</text>
        <rect class="shape" x="160" y="424" width="72" height="32" rx="6" />
        <text x="196" y="445" text-anchor="middle" font-size="12">HPH</text>
      </g>
    </svg>`;
  }

  function renderSiklus(param) {
    let idx = Math.max(0, SIKLUS_AIR_UAP.findIndex((s) => s.node === param));
    app.innerHTML = `
      <div class="section-head">
        <div>
          <h1>Siklus Utama PLTU</h1>
          <p class="muted" style="margin:0">Klik bagian diagram atau nomor langkah. Garis merah = uap, oranye = cold reheat, biru = air, hijau = air pendingin.</p>
        </div>
      </div>
      <div class="card">
        <div class="legend">
          <span><i style="background:var(--steam)"></i>Uap (main steam / hot reheat)</span>
          <span><i style="background:var(--reheat)"></i>Cold reheat</span>
          <span><i style="background:var(--water)"></i>Kondensat / air pengisi</span>
          <span><i style="background:var(--cool)"></i>Air pendingin</span>
          <span><i style="background:var(--muted)"></i>Ekstraksi & poros</span>
        </div>
        <div class="diagram-wrap">${cycleSvg()}</div>
        <div class="steps" id="steps">
          ${SIKLUS_AIR_UAP.map((s, i) => `<button class="step-btn" data-i="${i}">${i + 1}</button>`).join("")}
        </div>
        <div class="step-detail" id="stepDetail"></div>
        <div class="row" style="justify-content:space-between">
          <button class="btn" id="prevStep">← Sebelumnya</button>
          <button class="btn primary" id="nextStep">Berikutnya →</button>
        </div>
      </div>

      <h2 style="margin-top:28px">Ekstraksi, drain & bocoran uap — unit 150 MW lo</h2>
      <p class="muted">Disusun dari layar DCS 抽汽系统, 疏水排放系统, dan 轴封/门杆漏汽系统. Nyalakan/matikan layer pakai tombol di bawah.</p>
      <div class="card" id="d150"></div>

      <h2 style="margin-top:28px">Siklus pendukung</h2>
      <p class="muted">Pilih siklus, lalu klik langkah atau bagian diagram.</p>
      <div id="spWrap"></div>`;

    function show(i) {
      idx = (i + SIKLUS_AIR_UAP.length) % SIKLUS_AIR_UAP.length;
      const s = SIKLUS_AIR_UAP[idx];
      $$(".diagram .node").forEach((n) => n.classList.toggle("active", n.dataset.node === s.node));
      $$("#steps .step-btn").forEach((b, j) => b.classList.toggle("on", j === idx));
      $("#stepDetail").innerHTML = `
        <h3>${esc(s.judul)}</h3>
        <p>${esc(s.isi)}</p>
        <div class="muted" style="font-size:.88rem">Pelajari alatnya:</div>
        <div class="linklist">${s.alat.map((id) => `<a href="#peralatan-${id}">${alatById[id].icon} ${esc(alatById[id].nama)}</a>`).join("")}</div>`;
    }
    $$(".diagram .node").forEach((n) => n.addEventListener("click", () => {
      const i = SIKLUS_AIR_UAP.findIndex((s) => s.node === n.dataset.node);
      if (i >= 0) show(i);
    }));
    $("#steps").addEventListener("click", (e) => { const b = e.target.closest(".step-btn"); if (b) show(+b.dataset.i); });
    window.DCS.mountDiagram150($("#d150"));
    window.SiklusPendukung.mount($("#spWrap"), alatById);
    $("#prevStep").onclick = () => show(idx - 1);
    $("#nextStep").onclick = () => show(idx + 1);
    show(idx);
  }

  /* ---------------- Peralatan (slides) ---------------- */
  function renderPeralatan(param) {
    let filter = store.get("filterSistem", "all");
    let list = [];
    let idx = 0;

    app.innerHTML = `
      <div class="section-head">
        <div>
          <h1>Slide Peralatan</h1>
          <p class="muted" style="margin:0">Pakai tombol ← → di keyboard atau geser (swipe) di HP.</p>
        </div>
        <button class="btn" id="toggleList">Lihat semua alat</button>
      </div>
      <div class="chips" id="filters" style="margin-bottom:16px">
        <button class="chip" data-f="all">Semua</button>
        ${SISTEM.map((s) => `<button class="chip" data-f="${s.id}">${esc(s.nama)}</button>`).join("")}
      </div>
      <div class="card" id="thumbsCard" hidden style="margin-bottom:16px"><div class="thumbs" id="thumbs"></div></div>
      <article class="card slide" id="slide"></article>
      <div class="slide-nav">
        <button class="btn" id="prev">← Prev</button>
        <div class="progress"><div id="bar"></div></div>
        <span class="muted" id="counter" style="min-width:56px;text-align:center"></span>
        <button class="btn primary" id="next">Next →</button>
      </div>`;

    function applyFilter(f, keepId) {
      filter = f;
      store.set("filterSistem", f);
      list = f === "all" ? PERALATAN : PERALATAN.filter((a) => a.sistem === f);
      $$("#filters .chip").forEach((c) => c.classList.toggle("on", c.dataset.f === f));
      const k = keepId ? list.findIndex((a) => a.id === keepId) : -1;
      idx = k >= 0 ? k : 0;
      $("#thumbs").innerHTML = list.map((a, i) => `<button class="thumb" data-i="${i}"><span>${a.icon}</span><span>${esc(a.nama)}</span></button>`).join("");
      show(idx);
    }

    function show(i) {
      if (!list.length) return;
      idx = (i + list.length) % list.length;
      const a = list[idx];
      const s = sistemById[a.sistem];
      $("#slide").innerHTML = `
        <div class="slide-head">
          <div class="slide-ico">${a.icon}</div>
          <div>
            <span class="tag" style="background:${s.warna}">${esc(s.nama)}</span>
            <h2>${esc(a.nama)}</h2>
            <div class="alias">${esc(a.alias)}</div>
          </div>
        </div>
        <div class="fungsi"><b>Fungsi:</b> ${esc(a.fungsiSingkat)}</div>
        <div class="cols">
          <div>
            <h3>Cara kerja</h3>
            <p>${esc(a.caraKerja)}</p>
            <h3>Parameter yang dipantau</h3>
            <ul>${a.parameter.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          </div>
          <div>
            <h3>Gangguan umum & penanganan</h3>
            ${a.gangguan.map((g, j) => `
              <details class="trouble" ${j === 0 ? "open" : ""}>
                <summary>${esc(g.masalah)}</summary>
                <div><b>Penyebab:</b> ${esc(g.penyebab)}<br><b>Tindakan:</b> ${esc(g.tindakan)}</div>
              </details>`).join("")}
          </div>
        </div>`;
      $("#counter").textContent = `${idx + 1}/${list.length}`;
      $("#bar").style.width = `${((idx + 1) / list.length) * 100}%`;
      $$("#thumbs .thumb").forEach((t, j) => t.classList.toggle("on", j === idx));
      history.replaceState(null, "", `#peralatan-${a.id}`);
    }

    $("#filters").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (c) applyFilter(c.dataset.f); });
    $("#thumbs").addEventListener("click", (e) => {
      const t = e.target.closest(".thumb");
      if (t) { show(+t.dataset.i); $("#thumbsCard").hidden = true; $("#slide").scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    $("#toggleList").onclick = () => { $("#thumbsCard").hidden = !$("#thumbsCard").hidden; };
    $("#prev").onclick = () => show(idx - 1);
    $("#next").onclick = () => show(idx + 1);

    const onKey = (e) => {
      if (e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    };
    let x0 = null;
    const slideEl = $("#slide");
    const ts = (e) => { x0 = e.touches[0].clientX; };
    const te = (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    };
    document.addEventListener("keydown", onKey);
    slideEl.addEventListener("touchstart", ts, { passive: true });
    slideEl.addEventListener("touchend", te);
    cleanup = () => document.removeEventListener("keydown", onKey);

    // Jika dibuka lewat link alat tertentu, pastikan filter memuat alat tsb.
    if (param && alatById[param] && filter !== "all" && alatById[param].sistem !== filter) filter = "all";
    applyFilter(filter, param);
  }

  /* ---------------- Unit 150 vs 380 ---------------- */
  function renderUnit() {
    app.innerHTML = `
      <h1>Unit 150 MW vs 380 MW</h1>
      <div class="note" style="margin-bottom:16px">${esc(UNIT.catatan)}</div>
      <div class="card table-wrap">
        <table>
          <thead><tr><th>Parameter</th><th>Unit 150 MW</th><th>Unit 380 MW</th></tr></thead>
          <tbody>${UNIT.baris.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <h2 style="margin-top:28px">Fokus operasi</h2>
      <div class="grid grid-2">
        ${UNIT.fokus.map((f) => `<div class="card"><h3>Unit ${esc(f.unit)}</h3><ul>${f.poin.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
      </div>
      <div class="row" style="margin-top:20px"><a class="btn primary" href="#kuis-unit">Kuis seputar unit →</a></div>`;
  }

  /* ---------------- SOP ---------------- */
  function renderSop() {
    app.innerHTML = `
      <h1>Ringkasan SOP Umum</h1>
      <div class="note" style="margin-bottom:16px">
        Ini ringkasan untuk belajar alur pikir operasi, <b>bukan</b> SOP resmi. Urutan, setpoint, dan interlock tiap unit bisa beda.
        Prosedur yang berlaku tetap SOP/IK dari unit lo.
      </div>
      ${SOP.map((s, i) => `
        <details class="card sop" ${i === 0 ? "open" : ""}>
          <summary><span class="tag badge-${s.tipe}">${s.tipe === "darurat" ? "Darurat" : "Normal"}</span>${esc(s.judul)}</summary>
          <ol>${s.langkah.map((l) => `<li>${esc(l)}</li>`).join("")}</ol>
        </details>`).join("")}
      <div class="row" style="margin-top:20px"><a class="btn primary" href="#kuis-sop">Kuis SOP →</a></div>`;
  }

  /* ---------------- Kuis ---------------- */
  const KATEGORI = [
    { id: "fungsi", nama: "Fungsi alat" },
    { id: "gangguan", nama: "Gangguan & penanganan" },
    { id: "siklus", nama: "Siklus" },
    { id: "unit", nama: "Unit 150 vs 380" },
    { id: "sop", nama: "SOP & keselamatan" },
    { id: "dcs", nama: "Istilah & layar DCS" },
  ];

  function buildAutoQuestions() {
    const qs = [];
    const others = (a, key) => shuffle(PERALATAN.filter((b) => b.id !== a.id)).slice(0, 3).map(key);
    PERALATAN.forEach((a) => {
      // Fungsi alat
      qs.push(mk("fungsi", `Apa fungsi utama ${a.nama}?`, a.fungsiSingkat, others(a, (b) => b.fungsiSingkat), `${a.nama}: ${a.fungsiSingkat}.`));
      // Alat dari fungsi
      qs.push(mk("fungsi", `Alat yang berfungsi "${a.fungsiSingkat.toLowerCase()}" adalah…`, a.nama, others(a, (b) => b.nama), `Jawabannya ${a.nama}.`));
      // Gangguan: tindakan yang benar
      const g = a.gangguan[Math.floor(Math.random() * a.gangguan.length)];
      const wrong = shuffle(PERALATAN.filter((b) => b.id !== a.id).flatMap((b) => b.gangguan.map((x) => x.tindakan))).slice(0, 3);
      qs.push(mk("gangguan", `Pada ${a.nama} terjadi "${g.masalah}". Tindakan yang paling tepat?`, g.tindakan, wrong, `Penyebab umum: ${g.penyebab}.`));
    });
    // Istilah DCS: 中文 → arti
    shuffle(KAMUS_DCS).slice(0, 30).forEach((t) => {
      const lain = KAMUS_DCS.filter((x) => x.cn !== t.cn);
      const sama = shuffle(lain.filter((x) => x.g === t.g));
      const salah = [...sama, ...shuffle(lain)].map((x) => x.arti).filter((a, i, arr) => a !== t.arti && arr.indexOf(a) === i).slice(0, 3);
      qs.push(mk("dcs", `Di layar DCS, istilah "${t.cn}" artinya…`, t.arti, salah, `${t.cn} = ${t.arti}.`));
    });
    return qs;
  }
  function mk(k, q, benar, salah, e) {
    const opts = shuffle([benar, ...salah]);
    return { k, q, p: opts, a: opts.indexOf(benar), e, auto: true };
  }
  function prepManual(s) {
    const order = shuffle(s.p.map((_, i) => i));
    return { ...s, p: order.map((i) => s.p[i]), a: order.indexOf(s.a) };
  }

  function renderKuis(param) {
    const preset = KATEGORI.some((k) => k.id === param) ? [param] : null;
    let pilihKat = preset || store.get("kuisKat", KATEGORI.map((k) => k.id));
    let jumlah = store.get("kuisJumlah", 10);
    const best = store.get("best", null);

    app.innerHTML = `
      <div class="card quiz-card">
        <h1>Kuis PLTU</h1>
        <p class="muted">Pilih topik dan jumlah soal. Setiap jawaban langsung ada pembahasannya.</p>
        <span class="field-label">Topik</span>
        <div class="chips" id="katChips">${KATEGORI.map((k) => `<button class="chip" data-k="${k.id}">${k.nama}</button>`).join("")}</div>
        <span class="field-label">Jumlah soal</span>
        <div class="chips" id="jmlChips">${[10, 20, 30, 0].map((n) => `<button class="chip" data-n="${n}">${n || "Semua"}</button>`).join("")}</div>
        <div class="row" style="margin-top:24px">
          <button class="btn primary" id="mulai">Mulai kuis</button>
          <span class="muted" id="infoJml"></span>
        </div>
        ${best ? `<p class="muted" style="margin:16px 0 0">Skor terbaik: <b>${best}%</b></p>` : ""}
      </div>`;

    function pool() {
      const all = [...SOAL.map(prepManual), ...SOAL_DCS.map(prepManual), ...buildAutoQuestions()];
      return all.filter((s) => pilihKat.includes(s.k));
    }
    function refresh() {
      $$("#katChips .chip").forEach((c) => c.classList.toggle("on", pilihKat.includes(c.dataset.k)));
      $$("#jmlChips .chip").forEach((c) => c.classList.toggle("on", +c.dataset.n === jumlah));
      const n = pool().length;
      $("#infoJml").textContent = `${n} soal tersedia`;
      $("#mulai").disabled = n === 0;
    }
    $("#katChips").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      const k = c.dataset.k;
      pilihKat = pilihKat.includes(k) ? pilihKat.filter((x) => x !== k) : [...pilihKat, k];
      store.set("kuisKat", pilihKat); refresh();
    });
    $("#jmlChips").addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      jumlah = +c.dataset.n; store.set("kuisJumlah", jumlah); refresh();
    });
    $("#mulai").onclick = () => {
      let qs = shuffle(pool());
      if (jumlah) qs = qs.slice(0, jumlah);
      runQuiz(qs);
    };
    refresh();
  }

  function runQuiz(qs) {
    let i = 0;
    const answers = [];
    const katNama = Object.fromEntries(KATEGORI.map((k) => [k.id, k.nama]));

    function showQ() {
      const q = qs[i];
      app.innerHTML = `
        <div class="card quiz-card">
          <div class="q-meta"><span>Soal ${i + 1} dari ${qs.length}</span><span>${esc(katNama[q.k])}</span></div>
          <div class="progress" style="margin-bottom:16px"><div style="width:${(i / qs.length) * 100}%"></div></div>
          <div class="q-text">${esc(q.q)}</div>
          <div class="opts">${q.p.map((p, j) => `<button class="opt" data-j="${j}"><span class="key">${"ABCD"[j]}</span><span>${esc(p)}</span></button>`).join("")}</div>
          <div id="explain"></div>
          <div class="row" style="justify-content:space-between;margin-top:16px">
            <button class="btn" id="stop">Selesai</button>
            <button class="btn primary" id="lanjut" hidden>${i + 1 === qs.length ? "Lihat hasil" : "Soal berikutnya →"}</button>
          </div>
        </div>`;
      $(".opts").addEventListener("click", (e) => {
        const b = e.target.closest(".opt"); if (!b || b.disabled) return;
        pick(+b.dataset.j);
      });
      $("#lanjut").onclick = next;
      $("#stop").onclick = () => finish();
    }

    function pick(j) {
      const q = qs[i];
      if (answers[i] != null) return;
      answers[i] = j;
      const ok = j === q.a;
      $$(".opt").forEach((b, k) => {
        b.disabled = true;
        if (k === q.a) b.classList.add("correct");
        else if (k === j) b.classList.add("wrong");
      });
      $("#explain").innerHTML = `<div class="explain ${ok ? "ok" : "no"}"><b>${ok ? "✅ Benar!" : "❌ Kurang tepat."}</b> ${esc(q.e || "")}</div>`;
      $("#lanjut").hidden = false;
      $("#lanjut").focus();
    }

    function next() { i++; if (i >= qs.length) finish(); else showQ(); }

    const onKey = (e) => {
      if (!$(".opts")) return;
      const map = { a: 0, b: 1, c: 2, d: 3, 1: 0, 2: 1, 3: 2, 4: 3 };
      const k = e.key.toLowerCase();
      if (k in map && answers[i] == null && map[k] < qs[i].p.length) pick(map[k]);
      else if (e.key === "Enter" && answers[i] != null && document.activeElement !== $("#lanjut")) next();
    };
    document.addEventListener("keydown", onKey);
    cleanup = () => document.removeEventListener("keydown", onKey);

    function finish() {
      document.removeEventListener("keydown", onKey);
      const dijawab = answers.filter((x) => x != null).length;
      const benar = qs.filter((q, k) => answers[k] === q.a).length;
      const total = dijawab || 1;
      const pct = Math.round((benar / total) * 100);
      if (dijawab >= 5) store.set("best", Math.max(store.get("best", 0), pct));
      const salah = qs.map((q, k) => ({ q, k })).filter(({ q, k }) => answers[k] != null && answers[k] !== q.a);
      const pesan = pct >= 85 ? "Mantap, siap jadi operator andalan! 🔥" : pct >= 60 ? "Lumayan! Ulangi materi yang masih salah ya." : "Santai, baca lagi slide peralatannya terus coba lagi 💪";
      app.innerHTML = `
        <div class="card quiz-card">
          <h1>Hasil Kuis</h1>
          <div class="score-big">${pct}%</div>
          <p class="muted">${benar} benar dari ${dijawab} soal dijawab. ${pesan}</p>
          <div class="row">
            <button class="btn primary" id="ulang">Kuis lagi</button>
            ${salah.length ? `<button class="btn" id="ulangSalah">Ulangi yang salah (${salah.length})</button>` : ""}
            <a class="btn" href="#peralatan">Baca materi</a>
          </div>
          ${salah.length ? `<h2 style="margin-top:24px">Pembahasan yang salah</h2>
            ${salah.map(({ q, k }) => `
              <div class="review-item">
                <b>${esc(q.q)}</b><br>
                <span style="color:var(--bad)">Jawaban lo: ${esc(q.p[answers[k]])}</span><br>
                <span style="color:var(--ok)">Benar: ${esc(q.p[q.a])}</span><br>
                <span class="muted">${esc(q.e || "")}</span>
              </div>`).join("")}` : ""}
        </div>`;
      $("#ulang").onclick = () => renderKuis();
      const us = $("#ulangSalah");
      if (us) us.onclick = () => runQuiz(shuffle(salah.map(({ q }) => q)));
    }

    showQ();
  }

  router();
})();
