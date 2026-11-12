/* =========================================================================
   DATA MATERI BELAJAR PLTU
   -------------------------------------------------------------------------
   Semua konten ada di file ini supaya gampang diedit.
   PENTING: angka & langkah di sini adalah nilai TIPIKAL / UMUM untuk PLTU
   batubara subkritis. Sesuaikan dengan data sheet, manual OEM, dan SOP
   resmi unit masing-masing sebelum dipakai sebagai acuan kerja.
   ========================================================================= */

const SISTEM = [
  { id: "bb", nama: "Batubara & Pembakaran", warna: "#b45309" },
  { id: "boiler", nama: "Boiler", warna: "#dc2626" },
  { id: "udara", nama: "Udara & Gas Buang", warna: "#7c3aed" },
  { id: "turbin", nama: "Turbin & Generator", warna: "#2563eb" },
  { id: "air", nama: "Kondensat & Air Pengisi", warna: "#0891b2" },
  { id: "cw", nama: "Air Pendingin & Kimia Air", warna: "#059669" },
  { id: "ling", nama: "Abu & Lingkungan", warna: "#64748b" },
  { id: "kontrol", nama: "Kontrol & Proteksi", warna: "#db2777" },
];

/* -------------------------------------------------------------------------
   PERALATAN
   fungsiSingkat dipakai juga untuk soal kuis otomatis "Apa fungsi alat X?"
   ------------------------------------------------------------------------- */
const PERALATAN = [
  {
    id: "coal-handling",
    nama: "Coal Handling System",
    alias: "Stacker-reclaimer, belt conveyor, crusher",
    sistem: "bb",
    icon: "🚚",
    fungsiSingkat: "Menerima, menyimpan, dan menyalurkan batubara dari jetty/stockpile ke coal bunker",
    caraKerja:
      "Batubara dari kapal/tongkang dibongkar ship unloader, dibawa belt conveyor ke stockpile (coal yard) oleh stacker. Saat dibutuhkan, reclaimer mengambil batubara, melewati magnetic separator & crusher (memperkecil ukuran), lalu didistribusikan tripper ke tiap coal bunker.",
    parameter: ["Laju aliran (t/h) di belt scale", "Level bunker", "Arus motor conveyor", "Suhu stockpile (potensi self-heating)"],
    gangguan: [
      { masalah: "Belt conveyor miring / slip", penyebab: "Idler macet, tension kurang, material menumpuk di pulley", tindakan: "Stop via pull cord, atur belt tracking & take-up, bersihkan pulley, cek belt sway switch." },
      { masalah: "Chute buntu (plugging)", penyebab: "Batubara basah/lengket, benda asing", tindakan: "Stop conveyor hulu, bersihkan chute sesuai prosedur LOTO, cek plugged chute switch." },
      { masalah: "Self-heating / api di stockpile", penyebab: "Batubara kalori rendah tersimpan lama, oksidasi", tindakan: "Pantau suhu, terapkan FIFO, compaction, bongkar titik panas & salurkan ke bunker, semprot air seperlunya." },
    ],
  },
  {
    id: "coal-feeder",
    nama: "Coal Bunker & Coal Feeder",
    alias: "Gravimetric feeder",
    sistem: "bb",
    icon: "⚖️",
    fungsiSingkat: "Menampung batubara dan mengatur laju (t/h) batubara yang masuk ke pulverizer",
    caraKerja:
      "Bunker menampung batubara untuk beberapa jam operasi. Gravimetric feeder memakai belt dengan load cell sehingga laju batubara (massa per waktu) bisa diatur presisi sesuai demand pembakaran dari DCS.",
    parameter: ["Feeder rate (t/h)", "Level bunker", "Status no-coal-on-belt", "Kecepatan belt feeder"],
    gangguan: [
      { masalah: "No coal flow / bunker hang-up (rat-holing)", penyebab: "Batubara basah/lengket membentuk 'jembatan' di bunker", tindakan: "Operasikan air blaster/vibrator/poking, siapkan mill lain atau oil gun bila flame tidak stabil, turunkan beban bila perlu." },
      { masalah: "Feeder trip", penyebab: "Belt putus/slip, motor overload, benda asing", tindakan: "Pastikan mill terkait aman (purge/cooling), naikkan feeder lain dalam batas, cek runback beban." },
      { masalah: "Pembacaan feeder tidak akurat", penyebab: "Load cell perlu kalibrasi", tindakan: "Kalibrasi berkala dengan test weight / chain." },
    ],
  },
  {
    id: "pulverizer",
    nama: "Pulverizer (Coal Mill)",
    alias: "Vertical roller mill / bowl mill",
    sistem: "bb",
    icon: "⚙️",
    fungsiSingkat: "Menggiling batubara menjadi serbuk halus sekaligus mengeringkannya dengan udara primer panas",
    caraKerja:
      "Batubara digiling di antara roller dan bowl/table yang berputar. Udara primer panas dari air heater mengeringkan serbuk dan membawanya ke classifier; partikel halus (umumnya ±70–80% lolos 200 mesh) diteruskan ke burner, yang kasar jatuh kembali untuk digiling ulang. Material keras (pyrite/batu) dibuang lewat pyrite reject.",
    parameter: ["Suhu outlet mill (umumnya ±60–80 °C, tergantung jenis batubara)", "Differential pressure mill", "Arus motor mill", "Aliran udara primer", "Vibrasi"],
    gangguan: [
      { masalah: "Mill choking (tersedak)", penyebab: "Feed batubara terlalu banyak dibanding udara primer, batubara basah", tindakan: "Kurangi feeder rate, naikkan PA flow/suhu, pantau DP & arus motor sampai normal." },
      { masalah: "Mill fire / suhu outlet naik cepat", penyebab: "Batubara terakumulasi & teroksidasi, suhu inlet terlalu tinggi", tindakan: "Tutup hot air damper, buka cold air, lakukan inerting (steam/CO₂/N₂) sesuai SOP, JANGAN buka pintu inspeksi sebelum dingin." },
      { masalah: "Vibrasi tinggi", penyebab: "Mill kosong (roller beradu langsung), benda asing, tekanan roller tidak sesuai", tindakan: "Cek feed batubara, atur loading, stop mill bila melewati batas trip." },
    ],
  },
  {
    id: "burner",
    nama: "Burner, Igniter & Oil Gun",
    alias: "Burner batubara, oil gun HSD/MFO, flame scanner",
    sistem: "bb",
    icon: "🔥",
    fungsiSingkat: "Mencampur bahan bakar dan udara lalu menyalakannya di ruang bakar; oil gun dipakai saat start-up dan stabilisasi api",
    caraKerja:
      "Saat start-up, ruang bakar di-purge, lalu igniter menyalakan oil gun (HSD/MFO). Setelah suhu cukup, burner batubara dimasukkan bertahap. Flame scanner memantau keberadaan api; bila api hilang, proteksi memicu trip.",
    parameter: ["Status flame scanner", "Tekanan bahan bakar minyak", "Tekanan atomizing (steam/udara)", "Sudut burner tilt (tangential firing)"],
    gangguan: [
      { masalah: "Flame failure / loss of flame", penyebab: "Batubara kualitas buruk, mill trip, udara berlebih, scanner kotor", tindakan: "Masukkan oil gun untuk stabilisasi; bila proteksi 'loss of all flame' aktif → MFT. Wajib purge sebelum relight." },
      { masalah: "Oil gun tidak menyala", penyebab: "Nozzle buntu, igniter rusak, atomizing kurang", tindakan: "Tarik & bersihkan nozzle, cek igniter dan tekanan atomizing." },
    ],
  },
  {
    id: "steam-drum",
    nama: "Steam Drum",
    alias: "Drum uap",
    sistem: "boiler",
    icon: "🛢️",
    fungsiSingkat: "Memisahkan uap jenuh dari air dan menjadi penampung air untuk sirkulasi boiler",
    caraKerja:
      "Campuran air-uap dari riser (waterwall) masuk ke drum. Cyclone separator dan scrubber/dryer memisahkan uap jenuh yang kering untuk dikirim ke superheater; air kembali turun melalui downcomer. Drum juga tempat injeksi kimia (fosfat) dan continuous blowdown.",
    parameter: ["Level drum (dikontrol 3-element: level, steam flow, feedwater flow)", "Tekanan drum", "Beda suhu metal atas-bawah drum (saat start-up)", "Silika & konduktivitas air boiler"],
    gangguan: [
      { masalah: "Level drum terlalu tinggi", penyebab: "Kontrol feedwater gagal, swelling saat beban/tekanan turun mendadak", tindakan: "Kontrol feedwater manual, buka emergency drain; level high-high → MFT/turbine trip untuk mencegah water carry-over ke turbin." },
      { masalah: "Level drum terlalu rendah", penyebab: "BFP trip, tube bocor besar, shrinking", tindakan: "Start BFP standby, kurangi beban; level low-low → MFT untuk mencegah tube overheat. Jangan isi air dingin ke drum yang sudah kering tanpa evaluasi." },
      { masalah: "Indikasi level tidak sama", penyebab: "Transmitter/impulse line bermasalah", tindakan: "Bandingkan gauge glass, level elektroda (hydrastep), dan DP transmitter; blowdown gauge glass." },
    ],
  },
  {
    id: "waterwall",
    nama: "Waterwall & Downcomer",
    alias: "Furnace wall tube, riser",
    sistem: "boiler",
    icon: "🧱",
    fungsiSingkat: "Dinding ruang bakar berupa pipa berisi air yang menyerap panas radiasi api untuk menguapkan air",
    caraKerja:
      "Air dari drum turun lewat downcomer (tidak dipanaskan) ke header bawah, lalu naik di tube waterwall yang menyerap panas radiasi. Beda densitas air (downcomer) dan campuran air-uap (riser) menciptakan sirkulasi alami.",
    parameter: ["Suhu metal tube", "Tekanan furnace", "Makeup water (indikasi kebocoran)", "Laporan slagging"],
    gangguan: [
      { masalah: "Tube leak (bocor)", penyebab: "Overheat, erosi abu/soot blower, korosi, hydrogen damage", tindakan: "Konfirmasi (suara, acoustic leak detector, makeup naik, ID fan load naik), turunkan beban, rencanakan shutdown terkendali; bila parah dan level drum tak terkejar → trip." },
      { masalah: "Slagging berat", penyebab: "Batubara dengan ash fusion temperature rendah, excess air rendah", tindakan: "Wall blowing (soot blower), atur pola pembakaran & excess air." },
    ],
  },
  {
    id: "superheater",
    nama: "Superheater & Attemperator",
    alias: "Primary/secondary/final SH, desuperheater spray",
    sistem: "boiler",
    icon: "🌡️",
    fungsiSingkat: "Memanaskan uap jenuh dari drum menjadi uap panas lanjut (superheated) sebelum masuk turbin HP",
    caraKerja:
      "Uap jenuh melewati beberapa tingkat superheater (konveksi & radiasi). Suhu uap utama dikontrol dengan attemperator (spray air dari discharge BFP) di antara tingkat superheater, plus burner tilt/pola pembakaran.",
    parameter: ["Suhu & tekanan main steam", "Suhu metal tube SH", "Laju spray attemperator"],
    gangguan: [
      { masalah: "Suhu main steam terlalu tinggi", penyebab: "Spray tidak cukup, slagging di furnace, excess air tinggi", tindakan: "Tambah spray, turunkan burner tilt, atur excess air, soot blowing furnace." },
      { masalah: "Suhu main steam turun drastis", penyebab: "Spray berlebih/valve bocor, level drum tinggi (carry-over)", tindakan: "Tutup spray, cek level drum, kurangi beban; ikuti batas penurunan suhu turbin (risiko water induction)." },
    ],
  },
  {
    id: "reheater",
    nama: "Reheater",
    alias: "Cold reheat → hot reheat",
    sistem: "boiler",
    icon: "♨️",
    fungsiSingkat: "Memanaskan ulang uap bekas dari turbin HP sebelum masuk turbin IP untuk menaikkan efisiensi",
    caraKerja:
      "Uap keluar turbin HP (cold reheat) dikirim kembali ke boiler, dipanaskan lagi hingga suhu mendekati main steam (hot reheat), lalu masuk turbin IP. Suhu RH utamanya diatur dengan burner tilt/gas damper; spray RH dipakai darurat karena menurunkan efisiensi.",
    parameter: ["Suhu & tekanan hot reheat", "Suhu metal tube RH", "Laju spray RH"],
    gangguan: [
      { masalah: "Tube RH overheat saat start-up", penyebab: "Belum ada aliran uap di RH sementara api sudah besar", tindakan: "Batasi suhu furnace exit gas (sesuai manual OEM) sampai bypass/turbin mengalirkan uap ke RH." },
      { masalah: "Suhu hot reheat rendah", penyebab: "Burner tilt terlalu rendah, fouling", tindakan: "Atur burner tilt, soot blowing area konveksi." },
    ],
  },
  {
    id: "economizer",
    nama: "Economizer",
    alias: "Eco",
    sistem: "boiler",
    icon: "🔁",
    fungsiSingkat: "Memanaskan air pengisi (feedwater) memakai sisa panas gas buang sebelum masuk drum",
    caraKerja:
      "Terletak di jalur gas buang setelah superheater/reheater. Air dari HP heater lewat tube economizer menyerap panas gas buang sehingga efisiensi boiler naik.",
    parameter: ["Suhu feedwater inlet/outlet", "Suhu gas outlet economizer", "DP sisi gas"],
    gangguan: [
      { masalah: "Tube bocor", penyebab: "Erosi fly ash, korosi oksigen (feedwater O₂ tinggi)", tindakan: "Konfirmasi via makeup & acoustic, turunkan beban, shutdown terencana." },
      { masalah: "Steaming di economizer saat start-up", penyebab: "Aliran air terlalu kecil", tindakan: "Buka economizer recirculation sampai ada feed flow kontinu." },
    ],
  },
  {
    id: "aph",
    nama: "Air Preheater (APH)",
    alias: "Rotary regenerative / Ljungström",
    sistem: "udara",
    icon: "🌀",
    fungsiSingkat: "Memanaskan udara primer dan sekunder memakai panas gas buang sebelum gas keluar ke ESP",
    caraKerja:
      "Rotor berisi elemen pemanas berputar pelan (±1–3 rpm). Elemen menyerap panas saat melewati sisi gas, lalu melepas panas saat berputar ke sisi udara. Dilengkapi sealing untuk menekan kebocoran udara ke sisi gas.",
    parameter: ["Suhu gas inlet/outlet", "Suhu udara outlet", "Arus motor APH", "DP sisi gas & udara", "Fire detection"],
    gangguan: [
      { masalah: "APH trip / rotor berhenti", penyebab: "Motor utama trip, gearbox/bearing bermasalah", tindakan: "Pastikan motor cadangan/air motor start otomatis. Bila rotor tetap berhenti → isolasi damper & runback/trip sesuai interlock (elemen bisa rusak/terbakar)." },
      { masalah: "APH fire", penyebab: "Endapan oli/unburned carbon menyala (sering saat start-up dengan oil firing)", tindakan: "Konfirmasi lonjakan suhu outlet, trip unit, isolasi APH, operasikan sistem pemadam (water deluge), jaga rotor tetap berputar bila memungkinkan." },
      { masalah: "DP tinggi / fouling", penyebab: "Endapan abu, ammonium bisulfate, low-end corrosion", tindakan: "Soot blowing APH lebih sering, water washing saat shutdown, jaga suhu cold-end (steam coil air heater)." },
    ],
  },
  {
    id: "fd-fan",
    nama: "Forced Draft Fan (FD Fan)",
    alias: "Fan udara sekunder",
    sistem: "udara",
    icon: "💨",
    fungsiSingkat: "Menyuplai udara sekunder (udara pembakaran) ke ruang bakar melalui air preheater",
    caraKerja:
      "Fan menghembuskan udara atmosfer melalui APH ke windbox burner. Aliran diatur blade pitch/inlet vane/VSD sesuai kebutuhan oksigen (excess air) pembakaran.",
    parameter: ["Aliran udara total", "O₂ di gas buang", "Vibrasi & suhu bearing", "Arus motor", "Posisi blade/vane"],
    gangguan: [
      { masalah: "FD fan trip (1 dari 2)", penyebab: "Proteksi vibrasi/bearing, listrik", tindakan: "Runback beban ±50%, cross-tie damper, pastikan fan lain tidak overload & O₂ aman." },
      { masalah: "Stall / surge", penyebab: "Operasi dua fan tidak seimbang", tindakan: "Seimbangkan beban kedua fan, turunkan blade pitch fan yang stall." },
    ],
  },
  {
    id: "pa-fan",
    nama: "Primary Air Fan (PA Fan)",
    alias: "Fan udara primer",
    sistem: "udara",
    icon: "🌬️",
    fungsiSingkat: "Menyuplai udara primer untuk mengeringkan batubara di mill dan mengangkut serbuk batubara ke burner",
    caraKerja:
      "Sebagian udara primer dipanaskan di APH (hot PA), sebagian dibiarkan dingin (cold PA). Campuran keduanya diatur untuk mencapai suhu outlet mill yang ditargetkan dan tekanan header PA yang cukup.",
    parameter: ["Tekanan header PA", "Aliran PA per mill", "Vibrasi & suhu bearing"],
    gangguan: [
      { masalah: "PA fan trip", penyebab: "Proteksi mekanis/listrik", tindakan: "Mill trip sebagian sesuai interlock, runback beban, stabilkan api dengan oil gun bila perlu." },
      { masalah: "Tekanan header PA rendah", penyebab: "Kebocoran duct, damper bermasalah", tindakan: "Kurangi jumlah mill operasi, cek damper & duct." },
    ],
  },
  {
    id: "id-fan",
    nama: "Induced Draft Fan (ID Fan)",
    alias: "Fan penghisap gas buang",
    sistem: "udara",
    icon: "🌪️",
    fungsiSingkat: "Menghisap gas buang dari ruang bakar ke cerobong dan menjaga tekanan furnace sedikit negatif",
    caraKerja:
      "Terletak setelah ESP. Menghisap gas buang sehingga tekanan furnace dijaga sedikit di bawah atmosfer (tipikal sekitar −50 s.d. −150 Pa) agar gas panas & abu tidak keluar dari celah boiler.",
    parameter: ["Tekanan furnace", "Arus motor", "Vibrasi & suhu bearing", "Suhu gas inlet"],
    gangguan: [
      { masalah: "Tekanan furnace positif", penyebab: "ID fan kurang hisap, tube leak besar, mill puff", tindakan: "Naikkan hisapan ID fan, cek tube leak; furnace pressure high-high → MFT." },
      { masalah: "ID fan trip (1 dari 2)", penyebab: "Proteksi vibrasi/bearing, listrik", tindakan: "Runback beban, FD fan pasangannya ikut trip sesuai interlock, jaga furnace pressure." },
      { masalah: "Implosion (tekanan sangat negatif)", penyebab: "MFT saat ID fan masih menghisap kuat", tindakan: "Proteksi furnace pressure low-low; logic kontrol harus membatasi hisapan setelah MFT." },
    ],
  },
  {
    id: "esp",
    nama: "Electrostatic Precipitator (ESP)",
    alias: "Penangkap abu terbang",
    sistem: "ling",
    icon: "⚡",
    fungsiSingkat: "Menangkap abu terbang (fly ash) dari gas buang secara elektrostatik sebelum gas keluar cerobong",
    caraKerja:
      "Discharge electrode bertegangan DC tinggi (puluhan kV) mengionisasi gas sehingga partikel abu bermuatan dan menempel di collecting plate. Rapper mengetuk plate sehingga abu jatuh ke hopper, lalu diangkut sistem fly ash. Efisiensi umumnya >99%.",
    parameter: ["Tegangan & arus tiap field (T/R set)", "Spark rate", "Opasitas/debu di CEMS", "Level hopper"],
    gangguan: [
      { masalah: "Emisi debu naik", penyebab: "Field trip, rapper gagal, hopper penuh", tindakan: "Cek T/R set, normalkan rapper, kosongkan hopper." },
      { masalah: "Hopper level tinggi", penyebab: "Sistem fly ash handling gangguan", tindakan: "Segera evakuasi hopper; abu menumpuk bisa menyebabkan short pada elektroda." },
    ],
  },
  {
    id: "ash-handling",
    nama: "Ash Handling System",
    alias: "Bottom ash (SSC) & fly ash conveying",
    sistem: "ling",
    icon: "🪨",
    fungsiSingkat: "Mengangkut dan membuang abu dasar (bottom ash) dan abu terbang (fly ash) ke silo/ash yard",
    caraKerja:
      "Bottom ash jatuh ke submerged scraper conveyor (SSC) berisi air yang juga menjadi seal furnace, lalu dibawa ke bunker. Fly ash dari hopper ESP/economizer diangkut secara pneumatik (dense phase) ke fly ash silo.",
    parameter: ["Level air SSC (seal furnace)", "Tekanan conveying line", "Level silo"],
    gangguan: [
      { masalah: "SSC trip / rantai putus", penyebab: "Clinker besar, overload", tindakan: "Pertahankan level air seal, pecah clinker, perbaiki; bottom ash bisa ditahan sementara di hopper." },
      { masalah: "Pipa fly ash buntu", penyebab: "Abu lembab, tekanan udara conveying kurang", tindakan: "Purge line, cek kualitas udara kering (dryer kompresor)." },
    ],
  },
  {
    id: "soot-blower",
    nama: "Soot Blower",
    alias: "Wall blower, long retractable, APH blower",
    sistem: "boiler",
    icon: "🧹",
    fungsiSingkat: "Membersihkan endapan abu dan slag dari permukaan tube boiler dan APH dengan semburan uap",
    caraKerja:
      "Lance dimasukkan ke dalam boiler dan menyemburkan uap bertekanan untuk merontokkan endapan. Urutan blowing diatur berdasarkan suhu gas/metal dan efisiensi perpindahan panas.",
    parameter: ["Tekanan uap soot blowing", "Status lance (in/out)", "Suhu gas exit furnace"],
    gangguan: [
      { masalah: "Lance macet di dalam boiler", penyebab: "Motor/gearbox gagal", tindakan: "Tarik manual secepatnya, pertahankan uap pendingin agar lance tidak melengkung/terbakar." },
      { masalah: "Erosi tube", penyebab: "Uap basah (drain kurang), tekanan berlebih", tindakan: "Pastikan warm-up & drain sebelum blowing, setting tekanan sesuai manual." },
    ],
  },
  {
    id: "stack-cems",
    nama: "Cerobong (Stack) & CEMS",
    alias: "Continuous Emission Monitoring System",
    sistem: "ling",
    icon: "🏭",
    fungsiSingkat: "Membuang gas buang ke atmosfer pada ketinggian aman dan memantau emisi (SO₂, NOx, debu) secara kontinu",
    caraKerja:
      "Gas buang dari ID fan (dan FGD bila ada) dilepas lewat cerobong. CEMS mengukur konsentrasi SO₂, NOx, partikulat, O₂, dan flow, lalu datanya dilaporkan ke regulator.",
    parameter: ["SO₂, NOx, partikulat (mg/Nm³)", "O₂", "Opasitas"],
    gangguan: [
      { masalah: "Emisi melebihi baku mutu", penyebab: "ESP/FGD bermasalah, pembakaran tidak sempurna", tindakan: "Identifikasi sumber, perbaiki pembakaran/ESP, laporkan sesuai aturan lingkungan." },
    ],
  },
  {
    id: "turbin",
    nama: "Turbin Uap (HP, IP, LP)",
    alias: "Steam turbine",
    sistem: "turbin",
    icon: "🌀",
    fungsiSingkat: "Mengubah energi panas uap menjadi energi mekanik putaran (3000 rpm) untuk memutar generator",
    caraKerja:
      "Uap utama masuk turbin HP lewat main stop valve & control valve, berekspansi melalui sudu, keluar sebagai cold reheat. Setelah dipanaskan ulang, uap masuk IP lalu LP turbine dan dibuang ke kondensor. Beberapa titik ekstraksi diambil untuk feedwater heater.",
    parameter: ["Putaran (3000 rpm untuk 50 Hz)", "Vibrasi bearing/shaft", "Eksentrisitas", "Axial displacement", "Differential expansion", "Suhu metal bearing & exhaust LP"],
    gangguan: [
      { masalah: "Vibrasi tinggi", penyebab: "Rubbing, unbalance, misalignment, water induction, oli bermasalah", tindakan: "Turunkan beban, cek parameter oli & suhu; vibrasi mencapai batas trip → trip turbin." },
      { masalah: "Water induction", penyebab: "Carry-over dari drum, heater bocor, drain tidak bekerja", tindakan: "Trip turbin, buka semua drain turbin, setelah berhenti pantau eksentrisitas di turning gear." },
      { masalah: "Overspeed", penyebab: "Load rejection dengan governor/valve gagal menutup", tindakan: "Proteksi overspeed trip (umumnya ±110% = ±3300 rpm). Uji overspeed & valve test rutin." },
    ],
  },
  {
    id: "lube-oil",
    nama: "Lube Oil, Jacking Oil & Turning Gear",
    alias: "MOP, AOP, EOP (DC), JOP",
    sistem: "turbin",
    icon: "🛢",
    fungsiSingkat: "Melumasi dan mendinginkan bearing turbin-generator serta memutar poros pelan saat turbin berhenti",
    caraKerja:
      "Saat operasi normal oli dipasok main oil pump/AOP. Bila tekanan turun, AOP (AC) lalu EOP (DC, dari baterai) start otomatis. Jacking oil mengangkat poros saat putaran rendah. Turning gear memutar poros pelan setelah turbin berhenti agar rotor tidak melengkung (bowing) karena pendinginan tidak merata.",
    parameter: ["Tekanan oli header bearing", "Suhu oli & metal bearing", "Level tangki oli", "Status AOP/EOP/JOP", "Eksentrisitas saat turning gear"],
    gangguan: [
      { masalah: "Tekanan oli pelumas rendah", penyebab: "Pompa gagal, filter buntu, kebocoran", tindakan: "AOP/EOP harus start otomatis; tekanan low-low → turbin trip. Jangan matikan EOP sampai poros berhenti & aman." },
      { masalah: "Blackout saat coast-down", penyebab: "Hilang suplai AC", tindakan: "Pastikan EOP DC jalan, setelah poros berhenti lakukan turning gear (manual bila perlu) sesuai SOP." },
    ],
  },
  {
    id: "governor",
    nama: "Main Stop Valve, Control Valve & EHC",
    alias: "Governor / Electro-Hydraulic Control",
    sistem: "turbin",
    icon: "🎛️",
    fungsiSingkat: "Mengatur dan memutus aliran uap ke turbin untuk mengontrol putaran/beban dan melindungi turbin",
    caraKerja:
      "Main stop valve (MSV) dan reheat stop valve berfungsi sebagai katup pengaman (buka penuh/tutup cepat). Governor/control valve mengatur aliran uap sesuai setpoint putaran atau beban. Digerakkan aktuator hidrolik EH oil bertekanan tinggi.",
    parameter: ["Posisi valve", "Tekanan EH oil", "Load setpoint vs aktual", "Frekuensi grid"],
    gangguan: [
      { masalah: "Valve macet / hunting", penyebab: "Servo valve kotor, kualitas EH oil buruk", tindakan: "Jaga kebersihan EH oil (filter, analisis), lakukan valve test rutin." },
      { masalah: "Tekanan EH oil rendah", penyebab: "Pompa EH gagal, akumulator bermasalah, bocor", tindakan: "Pompa standby start; low-low → turbin trip." },
    ],
  },
  {
    id: "generator",
    nama: "Generator",
    alias: "Turbo generator sinkron",
    sistem: "turbin",
    icon: "🔌",
    fungsiSingkat: "Mengubah energi mekanik putaran turbin menjadi energi listrik",
    caraKerja:
      "Rotor diberi arus eksitasi DC sehingga menjadi elektromagnet. Saat diputar 3000 rpm, medan magnetnya menginduksi tegangan di belitan stator. Pendinginan bisa udara atau hidrogen (dengan seal oil), dan unit besar umumnya juga memakai pendingin air stator.",
    parameter: ["MW, MVAR, tegangan, arus, frekuensi", "Suhu belitan stator", "Kemurnian & tekanan H₂ (bila H₂-cooled)", "Seal oil DP"],
    gangguan: [
      { masalah: "Kemurnian H₂ turun", penyebab: "Udara masuk lewat seal, seal oil bermasalah", tindakan: "Scavenging/purity improvement, cek seal oil. Ingat bahaya ledakan campuran H₂-udara." },
      { masalah: "Loss of excitation", penyebab: "AVR/exciter gagal", tindakan: "Proteksi loss-of-field men-trip generator; unit menyerap VAR besar dari grid." },
      { masalah: "Reverse power (motoring)", penyebab: "Turbin trip tapi generator masih tersambung", tindakan: "Proteksi reverse power membuka CB generator (urutan normal trip: turbin trip → reverse power → generator trip)." },
    ],
  },
  {
    id: "exciter",
    nama: "Exciter & AVR",
    alias: "Static/brushless excitation",
    sistem: "turbin",
    icon: "🧲",
    fungsiSingkat: "Memberi arus DC ke rotor generator dan mengatur tegangan/daya reaktif keluaran generator",
    caraKerja:
      "AVR membaca tegangan terminal dan mengatur arus eksitasi. Static exciter mengambil daya dari terminal generator lewat trafo eksitasi + thyristor; brushless memakai exciter AC + rotating diode.",
    parameter: ["Arus & tegangan field", "MVAR", "Mode AVR (auto/manual)"],
    gangguan: [
      { masalah: "AVR pindah ke manual", penyebab: "Gangguan sensor/kanal AVR", tindakan: "Operator mengatur tegangan manual hati-hati, koordinasi dengan dispatcher." },
      { masalah: "Over-excitation / V/Hz tinggi", penyebab: "Tegangan tinggi saat frekuensi rendah", tindakan: "Kurangi eksitasi; proteksi V/Hz akan trip bila berlanjut." },
    ],
  },
  {
    id: "trafo",
    nama: "Transformator (GT, UAT, SST)",
    alias: "Generator transformer, unit auxiliary transformer, station service transformer",
    sistem: "turbin",
    icon: "🔋",
    fungsiSingkat: "Menaikkan tegangan generator ke tegangan transmisi dan menyediakan listrik untuk peralatan bantu (pemakaian sendiri)",
    caraKerja:
      "Generator transformer menaikkan tegangan generator (belasan–20an kV) ke 150 kV/500 kV. UAT mengambil daya dari terminal generator untuk beban bantu saat unit operasi; SST/start-up transformer dari grid saat start-up/shutdown.",
    parameter: ["Suhu oli & belitan", "Analisis gas terlarut (DGA)", "Level oli konservator", "Status Buchholz relay"],
    gangguan: [
      { masalah: "Buchholz alarm/trip", penyebab: "Gas akibat gangguan internal, udara di oli", tindakan: "Alarm → ambil sampel gas & DGA; trip → trafo jangan dienergize ulang sebelum investigasi." },
      { masalah: "Suhu tinggi", penyebab: "Kipas/pompa pendingin trip, overload", tindakan: "Cek sistem pendingin, kurangi beban bila perlu." },
    ],
  },
  {
    id: "kondensor",
    nama: "Kondensor",
    alias: "Surface condenser",
    sistem: "air",
    icon: "❄️",
    fungsiSingkat: "Mengembunkan uap bekas turbin LP menjadi air dan menciptakan vakum agar turbin bekerja efisien",
    caraKerja:
      "Uap dari exhaust LP mengalir di luar tube yang di dalamnya dilewati air pendingin (umumnya air laut). Uap mengembun dan berkumpul di hotwell. Karena volume uap jauh lebih besar dari air, pengembunan menciptakan vakum; gas tak terkondensasi dibuang vacuum pump/ejector.",
    parameter: ["Vakum / tekanan absolut kondensor", "Suhu exhaust LP", "Level hotwell", "ΔT air pendingin inlet-outlet", "Konduktivitas kondensat"],
    gangguan: [
      { masalah: "Vakum turun", penyebab: "CW pump trip/aliran kurang, tube kotor, air ingress, vacuum pump trip, gland steam rendah, hotwell level terlalu tinggi", tindakan: "Start vacuum pump standby, cek gland steam & CW, cari kebocoran udara, turunkan beban; low-low vacuum → turbin trip." },
      { masalah: "Kebocoran tube (air laut masuk)", penyebab: "Korosi/erosi tube", tindakan: "Konduktivitas & sodium naik → identifikasi water box yang bocor, isolasi & plugging; bila parah turunkan beban/shutdown untuk lindungi boiler." },
    ],
  },
  {
    id: "vacuum-pump",
    nama: "Vacuum Pump / Steam Ejector",
    alias: "Liquid ring vacuum pump",
    sistem: "air",
    icon: "🫧",
    fungsiSingkat: "Membuang udara dan gas tak terkondensasi dari kondensor untuk membentuk dan menjaga vakum",
    caraKerja:
      "Saat start-up semua vacuum pump dijalankan untuk 'hogging' (menarik vakum awal). Saat operasi normal cukup sebagian untuk membuang gas yang terakumulasi.",
    parameter: ["Vakum kondensor", "Suhu air seal pompa", "Arus motor"],
    gangguan: [
      { masalah: "Kapasitas turun", penyebab: "Air seal terlalu panas (pendingin seal kurang)", tindakan: "Cek heat exchanger air seal & suplai pendingin." },
    ],
  },
  {
    id: "gland-steam",
    nama: "Gland Steam System",
    alias: "Turbine gland sealing & gland steam condenser",
    sistem: "turbin",
    icon: "🔒",
    fungsiSingkat: "Menyegel celah poros turbin dengan uap agar udara tidak masuk ke kondensor dan uap tidak bocor keluar",
    caraKerja:
      "Uap bertekanan rendah dialirkan ke labirin seal poros. Uap campuran udara yang keluar dihisap ke gland steam condenser (didinginkan kondensat) dengan exhauster fan. Pada beban tinggi, turbin bisa self-sealing.",
    parameter: ["Tekanan header gland steam", "Suhu gland steam", "Vakum gland steam condenser"],
    gangguan: [
      { masalah: "Tekanan gland steam rendah", penyebab: "Kontrol valve gagal, suplai kurang", tindakan: "Udara masuk → vakum turun; normalkan suplai/bypass manual." },
      { masalah: "Uap bocor dari gland", penyebab: "Tekanan terlalu tinggi, exhauster fan trip", tindakan: "Turunkan tekanan, start exhauster standby; uap bocor bisa mengontaminasi oli bearing (air di oli)." },
    ],
  },
  {
    id: "cep",
    nama: "Condensate Extraction Pump (CEP)",
    alias: "Pompa kondensat",
    sistem: "air",
    icon: "⬆️",
    fungsiSingkat: "Memompa kondensat dari hotwell kondensor melewati LP heater menuju deaerator",
    caraKerja:
      "Pompa vertikal multi-stage yang menghisap dari hotwell bertekanan vakum (NPSH rendah, maka dipasang jauh di bawah hotwell). Kondensat dialirkan melalui condensate polishing (bila ada), gland steam condenser, dan LP heater ke deaerator.",
    parameter: ["Tekanan discharge", "Aliran kondensat", "Level hotwell", "Vibrasi"],
    gangguan: [
      { masalah: "Kavitasi", penyebab: "Level hotwell terlalu rendah, udara masuk via seal", tindakan: "Atur level hotwell, cek seal water; buka recirculation untuk minimum flow." },
      { masalah: "CEP trip", penyebab: "Proteksi motor/vibrasi", tindakan: "CEP standby harus autostart; bila gagal, level deaerator turun → siapkan runback." },
    ],
  },
  {
    id: "lph",
    nama: "Low Pressure Heater (LPH)",
    alias: "Pemanas air tekanan rendah",
    sistem: "air",
    icon: "🔥",
    fungsiSingkat: "Memanaskan kondensat memakai uap ekstraksi turbin IP/LP sebelum masuk deaerator",
    caraKerja:
      "Heat exchanger shell & tube: kondensat di dalam tube, uap ekstraksi di shell mengembun dan melepas panas. Drain heater mengalir bertingkat (cascade) ke heater tekanan lebih rendah atau ke kondensor.",
    parameter: ["Suhu inlet/outlet kondensat", "Level drain heater", "Terminal temperature difference (TTD)"],
    gangguan: [
      { masalah: "Level heater tinggi", penyebab: "Tube bocor, drain valve gagal", tindakan: "Buka emergency drain; high-high → isolasi heater (bypass sisi air, tutup ekstraksi & NRV) untuk mencegah air balik ke turbin." },
    ],
  },
  {
    id: "deaerator",
    nama: "Deaerator",
    alias: "Pemanas terbuka + storage tank",
    sistem: "air",
    icon: "🫗",
    fungsiSingkat: "Membuang gas terlarut (O₂, CO₂) dari air pengisi secara termal dan menampung air untuk suction BFP",
    caraKerja:
      "Kondensat disemprot/dikontakkan langsung dengan uap ekstraksi sehingga mencapai suhu jenuh dan gas terlarut terlepas lewat vent. Air terdeaerasi ditampung di storage tank yang posisinya tinggi untuk memberi NPSH ke BFP.",
    parameter: ["Level storage tank", "Tekanan & suhu deaerator", "O₂ terlarut outlet (target sangat rendah, ppb)"],
    gangguan: [
      { masalah: "Level deaerator rendah", penyebab: "CEP trip, kontrol level gagal, makeup kurang", tindakan: "Normalkan suplai kondensat/makeup; low-low → BFP trip (proteksi kavitasi)." },
      { masalah: "Tekanan turun mendadak (load rejection)", penyebab: "Suplai ekstraksi hilang", tindakan: "Pegging steam dari aux steam; waspadai flashing & kavitasi BFP." },
    ],
  },
  {
    id: "bfp",
    nama: "Boiler Feed Pump (BFP)",
    alias: "MDBFP / TDBFP",
    sistem: "air",
    icon: "💪",
    fungsiSingkat: "Menaikkan tekanan air pengisi dari deaerator agar bisa masuk ke boiler yang bertekanan tinggi",
    caraKerja:
      "Pompa multi-stage berkecepatan tinggi, digerakkan motor (dengan hydraulic coupling/VSD) atau turbin uap kecil (TDBFP). Dilengkapi booster pump, minimum flow recirculation valve, dan balance leak-off. Discharge juga menyuplai spray attemperator.",
    parameter: ["Tekanan suction & discharge", "Aliran feedwater", "Vibrasi & suhu bearing", "Posisi scoop/kecepatan", "Status min-flow valve"],
    gangguan: [
      { masalah: "BFP trip", penyebab: "Suction pressure rendah, vibrasi, lube oil, listrik", tindakan: "BFP standby autostart; bila tidak cukup → runback beban sesuai kapasitas pompa yang tersisa." },
      { masalah: "Kavitasi", penyebab: "Level/tekanan deaerator turun, suction strainer buntu", tindakan: "Normalkan deaerator, cek DP strainer." },
      { masalah: "Pompa overheat pada aliran kecil", penyebab: "Min-flow valve tidak membuka", tindakan: "Pastikan recirculation valve buka otomatis di bawah aliran minimum." },
    ],
  },
  {
    id: "hph",
    nama: "High Pressure Heater (HPH)",
    alias: "Pemanas air tekanan tinggi",
    sistem: "air",
    icon: "🔥",
    fungsiSingkat: "Memanaskan air pengisi setelah BFP memakai uap ekstraksi turbin HP/IP sebelum masuk economizer",
    caraKerja:
      "Mirip LPH tetapi sisi airnya menahan tekanan discharge BFP. Biasanya memiliki zona desuperheating, condensing, dan drain cooling. Drain mengalir cascade ke deaerator.",
    parameter: ["Suhu feedwater akhir", "Level drain", "TTD & DCA"],
    gangguan: [
      { masalah: "HPH out of service (bypass)", penyebab: "Tube bocor, level high-high", tindakan: "Suhu feedwater turun → batasi beban sesuai manual (risiko overfiring & suhu SH/RH naik), atur spray." },
    ],
  },
  {
    id: "cw-pump",
    nama: "Circulating Water Pump (CWP)",
    alias: "Pompa air pendingin utama + intake",
    sistem: "cw",
    icon: "🌊",
    fungsiSingkat: "Memompa air pendingin (umumnya air laut) dalam jumlah besar melewati tube kondensor",
    caraKerja:
      "Air laut masuk ke intake, disaring bar screen & traveling band/drum screen, lalu dipompa CWP ke kondensor dan dibuang ke outfall. Debris filter dan sistem ball cleaning (taprogge) menjaga tube tetap bersih. Chlorination mencegah biofouling.",
    parameter: ["Tekanan discharge CWP", "DP screen", "ΔT kondensor", "Arus motor"],
    gangguan: [
      { masalah: "Screen tersumbat (sampah, ubur-ubur, rumput laut)", penyebab: "Musim/arus laut", tindakan: "Operasikan screen kecepatan tinggi & spray wash, pantau DP, turunkan beban bila aliran CW turun." },
      { masalah: "CWP trip", penyebab: "Proteksi motor, level intake rendah", tindakan: "Vakum turun cepat → runback; jika semua CWP hilang → turbin trip (vacuum low)." },
    ],
  },
  {
    id: "ccw",
    nama: "Closed Cooling Water (CCW)",
    alias: "Sistem air pendingin tertutup peralatan bantu",
    sistem: "cw",
    icon: "🔄",
    fungsiSingkat: "Mendinginkan peralatan bantu (oil cooler, bearing, generator) dengan air demin dalam loop tertutup",
    caraKerja:
      "Air demin bersirkulasi ke berbagai cooler, lalu panasnya dibuang ke air laut melalui plate heat exchanger. Loop tertutup mencegah korosi & fouling di peralatan.",
    parameter: ["Tekanan & suhu header", "Level expansion tank", "Kualitas air"],
    gangguan: [
      { masalah: "Suhu CCW naik", penyebab: "PHE kotor, CCW/booster pump trip", tindakan: "Start pompa standby, bersihkan PHE; pantau suhu bearing & oli peralatan." },
    ],
  },
  {
    id: "wtp",
    nama: "Water Treatment & Kimia Air",
    alias: "Desalination (RO), demineralizer, chemical dosing",
    sistem: "cw",
    icon: "🧪",
    fungsiSingkat: "Memproduksi air demin untuk makeup siklus dan menjaga kimia air-uap agar tidak terjadi korosi & kerak",
    caraKerja:
      "Air laut/baku diolah (pretreatment → RO/desalinasi → demineralizer/mixed bed) menjadi air demin untuk makeup. Di siklus dilakukan dosing amonia/hidrazin (atau oxygenated/AVT sesuai desain) untuk pH & oksigen, serta fosfat di drum.",
    parameter: ["Konduktivitas & cation conductivity", "pH feedwater", "O₂ terlarut", "Silika & sodium uap", "Fosfat air boiler"],
    gangguan: [
      { masalah: "Konduktivitas kondensat naik", penyebab: "Kebocoran tube kondensor, kualitas makeup buruk", tindakan: "Cek sodium & cation conductivity, cari sumber, isolasi; naikkan blowdown; ikuti action level kimia (bisa sampai shutdown)." },
      { masalah: "Silika uap tinggi", penyebab: "Kualitas air boiler, carry-over", tindakan: "Naikkan blowdown, batasi tekanan/beban sesuai kurva silika." },
    ],
  },
  {
    id: "dcs",
    nama: "DCS & Sistem Proteksi (MFT, Turbine Trip)",
    alias: "Distributed Control System, BMS, interlock",
    sistem: "kontrol",
    icon: "🖥️",
    fungsiSingkat: "Mengontrol, memantau, dan melindungi seluruh unit secara otomatis termasuk logika trip (MFT/turbine trip)",
    caraKerja:
      "DCS menjalankan loop kontrol (CCS: koordinasi boiler-turbin, kontrol level, suhu, tekanan furnace). Burner Management System menangani purge & MFT. Interlock trip antar sistem: MFT → turbine trip → generator trip (dan sebaliknya sesuai desain).",
    parameter: ["Alarm list & first-out trip", "Status redundansi controller", "Mode kontrol (coordinated/boiler follow/turbine follow)"],
    gangguan: [
      { masalah: "Controller/HMI fail", penyebab: "Hardware, jaringan, power supply", tindakan: "Pindah ke controller redundant, siapkan operasi lokal, jangan ubah setpoint besar tanpa visibilitas." },
      { masalah: "Unit trip", penyebab: "Berbagai proteksi", tindakan: "Baca first-out alarm untuk penyebab awal, amankan unit (lube oil, turning gear, level), investigasi sebelum start ulang." },
    ],
  },
  {
    id: "aux",
    nama: "Kompresor Udara, Aux Boiler & Emergency Diesel",
    alias: "Instrument/service air, auxiliary steam, EDG, UPS/baterai",
    sistem: "kontrol",
    icon: "🛠️",
    fungsiSingkat: "Menyediakan udara instrumen, uap bantu untuk start-up, dan listrik darurat saat blackout",
    caraKerja:
      "Instrument air (kering & bebas oli) menggerakkan control valve pneumatik. Aux boiler atau uap dari unit lain menyuplai aux steam untuk start-up (gland steam, deaerator pegging). Emergency diesel generator & baterai menjamin beban esensial (EOP, turning gear, lampu darurat, DCS) saat blackout.",
    parameter: ["Tekanan & dew point instrument air", "Tekanan header aux steam", "Status EDG & baterai/UPS"],
    gangguan: [
      { masalah: "Tekanan instrument air turun", penyebab: "Kompresor trip, kebocoran besar", tindakan: "Start kompresor standby, isolasi service air; valve pneumatik akan ke posisi fail-safe." },
      { masalah: "EDG gagal start saat blackout", penyebab: "Baterai starter lemah, bahan bakar", tindakan: "Start manual lokal; uji beban EDG rutin." },
    ],
  },
];

/* -------------------------------------------------------------------------
   SIKLUS UTAMA (Rankine dengan reheat & regenerative feedwater heating)
   node = id elemen pada diagram SVG
   ------------------------------------------------------------------------- */
const SIKLUS_AIR_UAP = [
  { node: "boiler", judul: "1. Boiler: air jadi uap", isi: "Air pengisi dipanaskan di economizer, menguap di waterwall, dipisahkan di steam drum, lalu dipanaskan lanjut di superheater menjadi main steam bertekanan & bersuhu tinggi.", alat: ["economizer", "waterwall", "steam-drum", "superheater"] },
  { node: "hp", judul: "2. Turbin HP", isi: "Main steam berekspansi di turbin tekanan tinggi. Tekanan & suhu turun, keluar sebagai cold reheat.", alat: ["governor", "turbin"] },
  { node: "rh", judul: "3. Reheater", isi: "Cold reheat dikembalikan ke boiler dan dipanaskan ulang menjadi hot reheat. Tujuannya menaikkan efisiensi dan mengurangi kelembapan uap di sudu LP.", alat: ["reheater"] },
  { node: "iplp", judul: "4. Turbin IP & LP", isi: "Hot reheat berekspansi di turbin IP lalu LP. Sebagian uap diekstraksi untuk memanaskan air pengisi (di unit 150 MW lo ada 7 titik: E1→HPH1, E2→HPH2, E3→deaerator, E4–E7→LPH4–7). Poros turbin memutar generator. Detailnya ada di diagram ekstraksi di bawah.", alat: ["turbin", "gland-steam"] },
  { node: "gen", judul: "5. Generator → Trafo → Grid", isi: "Generator menghasilkan listrik, tegangan dinaikkan generator transformer lalu dikirim ke jaringan transmisi (switchyard).", alat: ["generator", "exciter", "trafo"] },
  { node: "cond", judul: "6. Kondensor", isi: "Uap bekas LP diembunkan oleh air pendingin (air laut) menjadi kondensat. Pengembunan menciptakan vakum.", alat: ["kondensor", "vacuum-pump", "cw-pump"] },
  { node: "cep", judul: "7. CEP & LP Heater", isi: "Kondensat dipompa CEP melewati gland steam condenser dan LP heater (dipanaskan uap ekstraksi LP).", alat: ["cep", "lph"] },
  { node: "da", judul: "8. Deaerator", isi: "Gas terlarut dibuang, air dipanaskan hingga jenuh dan ditampung sebagai suction BFP.", alat: ["deaerator"] },
  { node: "bfp", judul: "9. BFP & HP Heater", isi: "BFP menaikkan tekanan air melebihi tekanan boiler; HP heater memanaskan lagi dengan uap ekstraksi HP/IP. Air kembali ke economizer — siklus berulang.", alat: ["bfp", "hph"] },
];

const SIKLUS_LAIN = [
  {
    judul: "Siklus Batubara & Pembakaran",
    langkah: [
      "Kapal/tongkang → ship unloader → belt conveyor",
      "Stockpile (stacker) → reclaimer → crusher",
      "Tripper → coal bunker",
      "Coal feeder (atur t/h) → pulverizer (giling & keringkan)",
      "Serbuk batubara dibawa udara primer → burner → ruang bakar",
    ],
  },
  {
    judul: "Siklus Udara & Gas Buang",
    langkah: [
      "FD fan → APH (udara sekunder dipanaskan) → windbox burner",
      "PA fan → APH (udara primer panas) + cold PA → mill",
      "Gas panas hasil pembakaran → SH, RH, economizer",
      "Gas → APH (melepas panas ke udara) → ESP (tangkap fly ash)",
      "ID fan → (FGD bila ada) → cerobong",
    ],
  },
  {
    judul: "Siklus Air Pendingin",
    langkah: [
      "Air laut → intake → bar screen & traveling screen",
      "CW pump → debris filter → tube kondensor",
      "Air hangat → outfall/seal pit → laut",
      "Sebagian air laut → desalinasi → demin → makeup siklus",
    ],
  },
  {
    judul: "Siklus Abu",
    langkah: [
      "Bottom ash → submerged scraper conveyor → bunker/truck",
      "Fly ash di hopper economizer/APH/ESP → pneumatic conveying",
      "Fly ash silo → truk/pemanfaatan (FABA) atau ash disposal",
    ],
  },
];

/* -------------------------------------------------------------------------
   PERBANDINGAN UNIT 150 MW vs 380 MW (nilai TIPIKAL subkritis)
   >>> Ganti dengan data sheet unit lo <<<
   ------------------------------------------------------------------------- */
const UNIT = {
  catatan:
    "Angka di bawah adalah kisaran tipikal PLTU batubara subkritis di Indonesia, bukan data unit tertentu. Ganti di assets/data.js sesuai design data / commissioning record unit tempat lo kerja.",
  baris: [
    ["Kapasitas gross", "150 MW", "380 MW"],
    ["Tipe boiler", "Subkritis, drum, sirkulasi alami (sebagian unit 150 MW memakai CFB)", "Subkritis, drum, sirkulasi alami/assisted (pulverized coal)"],
    ["Tekanan main steam", "± 12,5–13,8 MPa", "± 16,5–17,5 MPa"],
    ["Suhu main steam / hot reheat", "± 535–540 °C / 535–540 °C", "± 538–541 °C / 538–541 °C"],
    ["Aliran uap utama (MCR)", "± 450–500 t/h", "± 1.100–1.200 t/h"],
    ["Konsumsi batubara (± 4.200 kcal/kg)", "± 85–100 t/h", "± 190–230 t/h"],
    ["Jumlah pulverizer", "4–5 (1 standby)", "5–6 (1 standby)"],
    ["Konfigurasi BFP", "2 BFP motor-driven + hydraulic coupling, 1 operasi & 1 standby 联锁 (sesuai DCS unit lo)", "2 × 50% turbine-driven + 1 motor-driven untuk start-up/standby (tipikal)"],
    ["Feedwater heater", "2 HPH + deaerator + 4 LPH = 7 ekstraksi (sesuai DCS unit lo)", "± 4 LPH + deaerator + 3 HPH"],
    ["Konfigurasi turbin", "Casing HP + casing IP-LP gabung, 5 bearing (sesuai DCS unit lo)", "HP-IP combined/terpisah + 1–2 LP (double flow)"],
    ["Pendinginan generator", "Udara, air cooler didinginkan closed cooling water (sesuai DCS unit lo)", "Hidrogen + air stator"],
    ["Tegangan generator", "± 13,8–15,75 kV", "± 20–22 kV"],
    ["Tegangan transmisi", "150 kV", "150 kV atau 500 kV"],
    ["Snapshot DCS unit lo (±64 MW)", "MS 10.75 MPa / 529.5 °C · RH 1.38 MPa / 516 °C · 197 t/h · vakum −95.4 kPa · FW 12.13 MPa / 208 t/h", "—"],
    ["Fan utama", "2 × FD, 2 × ID, 2 × PA", "2 × FD, 2 × ID, 2 × PA (kapasitas lebih besar, sering axial)"],
  ],
  fokus: [
    {
      unit: "150 MW",
      poin: [
        "Respons level drum relatif lebih cepat karena volume drum lebih kecil — perhatikan swell/shrink saat perubahan beban.",
        "Bila memakai BFP motor-driven, satu BFP trip biasanya langsung digantikan BFP standby (cek autostart & runback).",
        "Bila unit memakai CFB: fokus ke bed temperature, bed pressure, cyclone & loop seal, dan sistem limestone.",
        "Margin runback lebih sempit untuk fan tunggal — kenali logika runback unit lo.",
        "Di DCS lo warna MERAH = running/terbuka, HIJAU = stop/tertutup. Jangan kebalik waktu baca status pompa!",
      ],
    },
    {
      unit: "380 MW",
      poin: [
        "TDBFP butuh uap ekstraksi/aux steam: saat start-up dan beban rendah gunakan MDBFP, transfer ke TDBFP mengikuti SOP.",
        "Generator berpendingin H₂ + air stator: wajib paham seal oil, H₂ purity, dan stator cooling water conductivity.",
        "Lebih banyak heater & ekstraksi → proteksi water induction (extraction NRV, drain) lebih kompleks.",
        "Koordinasi dengan dispatcher (AGC, ramp rate) lebih ketat karena dampak ke grid lebih besar.",
      ],
    },
  ],
};

/* -------------------------------------------------------------------------
   SOP UMUM (ringkasan pembelajaran, BUKAN SOP resmi)
   ------------------------------------------------------------------------- */
const SOP = [
  {
    judul: "Cold Start-up (ringkasan urutan)",
    tipe: "normal",
    langkah: [
      "Persiapan: izin kerja (PTW) ditutup, LOTO dilepas, line-up valve sesuai checklist, sistem listrik bantu (SST) energized.",
      "Sistem pendukung: instrument air, CCW, CW pump, lube oil + turning gear turbin (cek eksentrisitas), seal oil & H₂ generator (bila ada).",
      "Isi air: makeup demin → kondensor/hotwell → CEP → deaerator (pemanasan dengan aux steam) → BFP isi boiler sampai level start-up drum.",
      "Tarik vakum: gland steam masuk, vacuum pump hogging.",
      "Air & gas: start APH → ID fan → FD fan; atur airflow ≥ purge flow (tipikal 25–40%).",
      "Purge furnace (tipikal ≥ 5 menit / 5 kali volume), reset MFT.",
      "Light-up oil gun, naikkan tekanan & suhu mengikuti kurva start-up (batasi laju kenaikan suhu drum/metal).",
      "Buka vent & drain SH/RH, operasikan HP-LP bypass untuk aliran uap & kontrol tekanan.",
      "Start PA fan & pulverizer pertama ketika syarat (suhu udara, beban, flame stabil) terpenuhi.",
      "Rolling turbin: cek parameter uap (superheat cukup), naikkan putaran bertahap, tahan di critical speed seperlunya (lewati cepat), sampai 3000 rpm.",
      "Eksitasi & sinkron: AVR on, sinkronisasi (tegangan, frekuensi, sudut fase cocok), tutup CB generator, ambil beban minimum.",
      "Naikkan beban: pindah suplai bantu ke UAT, tambah mill, masukkan HP heater, tarik oil gun bila pembakaran stabil, masuk mode coordinated/AGC.",
    ],
  },
  {
    judul: "Normal Shutdown (ringkasan)",
    tipe: "normal",
    langkah: [
      "Koordinasi dengan dispatcher, turunkan beban sesuai ramp rate.",
      "Masukkan oil gun untuk stabilisasi saat mill dikurangi; stop mill satu per satu (purge/kosongkan mill sebelum stop).",
      "Pindah suplai bantu ke SST, keluarkan HP heater bila diperlukan.",
      "Beban minimum → buka CB generator → trip turbin (atau sebaliknya sesuai SOP unit), pastikan reverse power/urutan benar.",
      "Turbin coast-down: pastikan AOP/JOP jalan, catat waktu coast-down, turning gear masuk saat poros berhenti.",
      "Matikan api (MFT/normal stop), purge furnace, stop fan sesuai prosedur pendinginan boiler.",
      "Pertahankan lube oil & turning gear sampai suhu metal turbin di bawah batas (bisa berhari-hari).",
    ],
  },
  {
    judul: "Master Fuel Trip (MFT)",
    tipe: "darurat",
    langkah: [
      "Pahami penyebab umum: loss of all flame, furnace pressure high-high/low-low, drum level high-high/low-low, ID/FD fan semua trip, airflow < minimum, turbin trip (bila tanpa bypass penuh), manual MFT.",
      "Konfirmasi otomatis: semua bahan bakar terputus (feeder, mill, oil valve tertutup), turbin & generator trip sesuai interlock.",
      "Jaga fan tetap jalan (bila tidak ikut trip) untuk post-purge; kontrol furnace pressure.",
      "Amankan level drum (BFP), suhu & tekanan; buka drain turbin, pastikan lube oil & turning gear.",
      "Baca first-out alarm, catat kronologi, laporkan ke supervisor/dispatcher.",
      "Investigasi & perbaiki penyebab SEBELUM purge & light-up ulang.",
    ],
  },
  {
    judul: "Blackout / Loss of AC Power",
    tipe: "darurat",
    langkah: [
      "Pastikan unit trip aman (MFT, turbine trip, generator CB open).",
      "Cek EOP (DC) jalan untuk pelumasan turbin, emergency seal oil (bila H₂-cooled) jalan.",
      "Pastikan EDG start & menyuplai bus esensial; bila tidak, start manual lokal.",
      "Pastikan UPS/baterai menyuplai DCS & proteksi; pantau tegangan baterai.",
      "Setelah poros berhenti, turning gear (elektrik setelah suplai pulih, manual bila tidak) untuk mencegah rotor bowing.",
      "Tutup valve-valve kritis bila perlu (MSV sudah tertutup, cek extraction NRV, drain).",
      "Koordinasi black start/pemulihan dengan dispatcher sesuai prosedur.",
    ],
  },
  {
    judul: "Boiler Tube Leak",
    tipe: "darurat",
    langkah: [
      "Indikasi: makeup water naik, suara bocor/acoustic leak detector, arus ID fan naik, furnace pressure tidak stabil, suhu gas turun lokal, uap terlihat dari peephole.",
      "Konfirmasi lokasi (waterwall, SH, RH, economizer) dengan cek lapangan aman (jangan berdiri di depan pintu/peephole).",
      "Laporkan, turunkan beban untuk memperlambat kerusakan tube sebelahnya.",
      "Bila level drum tidak dapat dipertahankan atau kebocoran membesar → shutdown/trip.",
      "Setelah shutdown: pendinginan sesuai prosedur, inspeksi, analisis akar masalah (RCA).",
    ],
  },
  {
    judul: "Penurunan Vakum Kondensor",
    tipe: "darurat",
    langkah: [
      "Cek tren: vakum, suhu exhaust LP, ΔT CW, level hotwell.",
      "Start vacuum pump standby; cek gland steam pressure & exhauster.",
      "Cek CW pump & DP screen/debris filter; jalankan ball cleaning.",
      "Cari air ingress (valve drain/vent terbuka, flange, rupture disc), cek level hotwell tidak menutupi tube.",
      "Turunkan beban untuk menahan suhu exhaust; nyalakan exhaust hood spray bila suhu tinggi.",
      "Vakum mencapai low-low → turbin trip (proteksi).",
    ],
  },
  {
    judul: "Turbine Trip / Load Rejection",
    tipe: "darurat",
    langkah: [
      "Konfirmasi semua stop valve & control valve tertutup, extraction NRV tertutup, putaran turun.",
      "Generator CB terbuka lewat reverse power/proteksi.",
      "Boiler: MFT atau runback ke bypass sesuai desain; kontrol level drum (swell/shrink besar!).",
      "Pastikan AOP/JOP start saat putaran turun, pantau vibrasi & eksentrisitas, turning gear masuk.",
      "Kontrol deaerator (pegging aux steam) dan suplai bantu (transfer ke SST).",
      "Baca first-out, perbaiki penyebab, lakukan restart sesuai prosedur hot/warm start.",
    ],
  },
];

/* -------------------------------------------------------------------------
   BANK SOAL KUIS (tulis manual) — jawaban = index pilihan yang benar
   kategori: gangguan | siklus | unit | sop | fungsi
   ------------------------------------------------------------------------- */
const SOAL = [
  // ---- Gangguan & penanganan
  { k: "gangguan", q: "Vakum kondensor turun perlahan, suhu exhaust LP naik, CW pump normal. Langkah pertama yang paling tepat?", p: ["Langsung trip turbin", "Start vacuum pump standby dan cek tekanan gland steam", "Tutup semua drain kondensor", "Naikkan beban agar aliran uap stabil"], a: 1, e: "Penurunan bertahap biasanya karena air ingress atau kapasitas pembuangan udara kurang. Tambah vacuum pump & cek gland steam; trip hanya bila mencapai batas low-low." },
  { k: "gangguan", q: "Suhu outlet pulverizer naik cepat jauh di atas normal. Kemungkinan & tindakan?", p: ["Mill choking — tambah feeder", "Mill fire — tutup hot air, buka cold air, lakukan inerting", "Normal saat beban tinggi", "PA fan trip — start PA fan lain"], a: 1, e: "Kenaikan suhu outlet yang cepat adalah indikasi kebakaran di mill. Putus suplai udara panas dan inerting sesuai SOP. Jangan buka pintu inspeksi sebelum dingin." },
  { k: "gangguan", q: "DP mill dan arus motor mill naik, sementara aliran batubara keluar ke burner berkurang. Ini indikasi?", p: ["Mill fire", "Mill choking (tersedak)", "Feeder trip", "Classifier terlalu kasar"], a: 1, e: "Choking: terlalu banyak batubara dibanding kemampuan udara primer mengangkut. Kurangi feeder & naikkan PA flow." },
  { k: "gangguan", q: "Makeup water naik terus, arus ID fan naik, terdengar suara mendesis di area boiler. Dugaan utama?", p: ["Kebocoran tube boiler", "Kondensor bocor", "Level deaerator tinggi", "APH fire"], a: 0, e: "Kombinasi makeup naik + ID fan load naik + suara adalah gejala klasik boiler tube leak." },
  { k: "gangguan", q: "Konduktivitas & sodium kondensat naik mendadak di PLTU berpendingin air laut. Penyebab paling mungkin?", p: ["Dosing amonia berlebih", "Kebocoran tube kondensor (air laut masuk)", "Deaerator vent tertutup", "BFP kavitasi"], a: 1, e: "Air laut kaya sodium & klorida. Kebocoran tube kondensor langsung terlihat di sodium/cation conductivity. Cari water box yang bocor dan isolasi." },
  { k: "gangguan", q: "Suhu gas outlet APH naik mendadak dan terus naik setelah start-up dengan oil firing. Kemungkinan?", p: ["APH fire", "ID fan trip", "Soot blower bekerja", "Udara terlalu banyak"], a: 0, e: "Endapan oli/unburned carbon di elemen APH bisa menyala, sering terjadi saat start-up dengan bahan bakar minyak." },
  { k: "gangguan", q: "Satu dari dua ID fan trip pada beban penuh. Respons otomatis yang diharapkan?", p: ["MFT langsung", "Runback beban ke ±50% dan FD fan pasangannya ikut trip sesuai interlock", "Tidak ada aksi", "Turbin trip"], a: 1, e: "Dengan satu fan tersisa, kapasitas tinggal ±50%. Runback menurunkan bahan bakar sehingga unit tetap beroperasi." },
  { k: "gangguan", q: "Tekanan furnace naik ke positif tinggi dan mencapai high-high. Apa yang terjadi?", p: ["Turbin runback saja", "MFT (Master Fuel Trip)", "Soot blower start", "Tidak apa-apa"], a: 1, e: "Furnace pressure high-high adalah salah satu kondisi MFT untuk melindungi struktur boiler & personel." },
  { k: "gangguan", q: "Level LP heater naik terus hingga high-high. Tindakan proteksi otomatis yang benar?", p: ["Naikkan beban", "Isolasi heater: bypass sisi air dan tutup extraction valve/NRV", "Matikan CEP", "Buka vent kondensor"], a: 1, e: "Tujuannya mencegah air masuk balik ke turbin (water induction) melalui pipa ekstraksi." },
  { k: "gangguan", q: "BFP operasi pada aliran sangat kecil saat start-up. Apa yang mencegah pompa overheat?", p: ["Balance leak-off", "Minimum flow recirculation valve", "Suction strainer", "Hydraulic coupling"], a: 1, e: "Min-flow valve mengembalikan sebagian air ke deaerator agar selalu ada aliran minimum yang mendinginkan pompa." },
  { k: "gangguan", q: "Kemurnian hidrogen generator turun perlahan. Fokus pengecekan pertama?", p: ["Sistem seal oil", "Eksitasi", "Trafo utama", "Lube oil turbin"], a: 0, e: "Seal oil mencegah H₂ keluar dan udara masuk di poros generator. Gangguan seal oil adalah penyebab umum purity turun." },
  { k: "gangguan", q: "Turbin trip lalu tekanan oli pelumas turun dan AOP gagal start. Yang harus otomatis mengambil alih?", p: ["Jacking oil pump", "Emergency oil pump (DC)", "EH oil pump", "Seal oil pump"], a: 1, e: "EOP disuplai baterai DC sebagai lapisan terakhir agar bearing tetap terlumasi saat coast-down." },
  { k: "gangguan", q: "Traveling screen intake tersumbat ubur-ubur dan DP screen terus naik. Dampak berikutnya yang harus diwaspadai?", p: ["Level drum tinggi", "Aliran CW turun → vakum kondensor turun", "Kemurnian H₂ turun", "Suhu main steam naik"], a: 1, e: "Screen tersumbat menurunkan aliran air pendingin ke kondensor sehingga vakum memburuk. Turunkan beban bila perlu." },
  { k: "gangguan", q: "Level deaerator mencapai low-low. Proteksi yang umumnya aktif?", p: ["CEP trip", "BFP trip untuk mencegah kavitasi", "MFT langsung", "Vacuum pump stop"], a: 1, e: "BFP butuh NPSH dari level & tekanan deaerator. Low-low level melindungi BFP dari kavitasi/dry running." },
  { k: "gangguan", q: "Rotor APH berhenti karena motor utama trip. Apa yang seharusnya terjadi?", p: ["Biarkan saja, APH tidak penting", "Motor cadangan/air motor start otomatis; jika gagal, isolasi & runback/trip", "Naikkan beban", "Matikan ESP"], a: 1, e: "Rotor yang berhenti di aliran gas panas bisa melengkung atau terbakar, serta udara pembakaran tidak terpanaskan." },
  { k: "gangguan", q: "Suhu main steam turun drastis dan level drum tinggi. Risiko terbesar?", p: ["Water induction / carry-over ke turbin", "Vakum naik", "APH fire", "Kemurnian H₂ turun"], a: 0, e: "Air terbawa ke turbin dapat merusak sudu & menyebabkan distorsi casing. Inilah alasan proteksi drum level high-high dan suhu MS rendah." },

  // ---- Siklus
  { k: "siklus", q: "Urutan aliran air-uap yang benar setelah kondensor adalah…", p: ["Kondensor → BFP → deaerator → CEP", "Kondensor → CEP → LP heater → deaerator → BFP → HP heater → economizer", "Kondensor → HP heater → CEP → boiler", "Kondensor → economizer → deaerator → BFP"], a: 1, e: "CEP memompa ke LPH dan deaerator; BFP menaikkan tekanan, HPH memanaskan, lalu economizer." },
  { k: "siklus", q: "Uap yang keluar dari turbin HP dan menuju reheater disebut…", p: ["Main steam", "Cold reheat", "Hot reheat", "Extraction steam"], a: 1, e: "Cold reheat = keluaran HP; hot reheat = keluaran reheater menuju IP turbine." },
  { k: "siklus", q: "Siklus termodinamika dasar PLTU adalah siklus…", p: ["Otto", "Brayton", "Rankine", "Diesel"], a: 2, e: "PLTU memakai siklus Rankine (dengan modifikasi reheat dan regenerative feedwater heating)." },
  { k: "siklus", q: "Mengapa air pengisi dipanaskan dengan uap ekstraksi turbin (feedwater heater)?", p: ["Agar turbin berputar lebih cepat", "Menaikkan efisiensi siklus (regeneratif)", "Mengurangi vakum", "Mendinginkan generator"], a: 1, e: "Pemanasan regeneratif mengurangi panas yang harus diberikan boiler sehingga efisiensi siklus naik." },
  { k: "siklus", q: "Gas buang setelah economizer mengalir ke…", p: ["Cerobong langsung", "APH → ESP → ID fan → cerobong", "Kondensor", "Pulverizer"], a: 1, e: "APH memanfaatkan sisa panas, ESP menangkap abu, ID fan menghisap ke cerobong." },
  { k: "siklus", q: "Fungsi udara primer dalam siklus batubara adalah…", p: ["Menyediakan oksigen utama di windbox", "Mengeringkan dan mengangkut serbuk batubara dari mill ke burner", "Mendinginkan APH", "Menyegel furnace"], a: 1, e: "Udara sekunder dari FD fan yang menyediakan sebagian besar oksigen pembakaran." },
  { k: "siklus", q: "Kenapa kondensor bisa vakum?", p: ["Karena dipompa udara masuk", "Karena uap mengembun menjadi air yang volumenya jauh lebih kecil", "Karena ID fan menghisap", "Karena BFP menghisap"], a: 1, e: "Volume spesifik uap tekanan rendah ribuan kali volume air. Saat mengembun, tekanan turun drastis; vacuum pump membuang gas yang tidak bisa mengembun." },
  { k: "siklus", q: "Sumber panas pada air preheater berasal dari…", p: ["Uap ekstraksi", "Gas buang", "Listrik", "Air laut"], a: 1, e: "APH regeneratif menyerap panas gas buang dan memindahkannya ke udara pembakaran." },

  // ---- Unit 150 vs 380
  { k: "unit", q: "Secara umum, dibanding unit 150 MW, unit 380 MW subkritis memiliki tekanan main steam…", p: ["Lebih rendah", "Lebih tinggi (±16–17 MPa vs ±13 MPa)", "Sama persis", "Tidak memakai tekanan"], a: 1, e: "Unit lebih besar umumnya didesain pada tekanan subkritis lebih tinggi untuk efisiensi lebih baik." },
  { k: "unit", q: "Konfigurasi BFP yang umum di unit ±350–400 MW adalah…", p: ["1 × 100% motor", "2 × 50% turbine-driven + 1 motor-driven untuk start-up", "Tidak ada BFP", "4 × 25% diesel"], a: 1, e: "Daya BFP unit besar signifikan, sehingga digerakkan turbin uap (TDBFP) untuk menghemat pemakaian listrik sendiri. MDBFP dipakai saat start-up/standby." },
  { k: "unit", q: "Saat start-up unit dengan TDBFP, mengapa memakai MDBFP terlebih dahulu?", p: ["TDBFP butuh uap untuk menggerakkannya, yang belum tersedia cukup saat start-up", "MDBFP lebih bertekanan", "TDBFP hanya untuk shutdown", "Agar CEP tidak trip"], a: 0, e: "Sebelum ada uap ekstraksi/aux steam yang cukup, TDBFP tidak bisa diputar, sehingga MDBFP digunakan." },
  { k: "unit", q: "Pendinginan generator yang umum untuk unit 380 MW adalah…", p: ["Udara terbuka", "Hidrogen + air pendingin stator", "Oli", "Tidak perlu pendingin"], a: 1, e: "Kerugian panas besar sehingga dipakai H₂ (konduktivitas termal tinggi) dan air demin di konduktor stator." },
  { k: "unit", q: "Pada unit 150 MW tipe CFB, parameter yang khas dipantau dan tidak ada di boiler PC adalah…", p: ["Bed temperature & bed pressure", "Vakum kondensor", "Level drum", "Suhu main steam"], a: 0, e: "Boiler CFB membakar batubara dalam bed fluidisasi bersama pasir/limestone, sehingga bed temperature & pressure jadi parameter utama." },
  { k: "unit", q: "Kebutuhan batubara unit 380 MW dibanding 150 MW kira-kira…", p: ["Sama", "Sekitar 2–2,5 kali", "10 kali", "Setengahnya"], a: 1, e: "Sebanding dengan daya dan heat rate; unit besar biasanya sedikit lebih efisien sehingga rasionya sedikit di bawah 380/150." },

  // ---- SOP
  { k: "sop", q: "Sebelum light-up (menyalakan) burner setelah MFT, apa yang WAJIB dilakukan?", p: ["Langsung nyalakan oil gun", "Purge furnace dengan aliran udara minimum selama waktu yang ditentukan", "Start pulverizer dulu", "Matikan ID fan"], a: 1, e: "Purge membuang sisa bahan bakar/gas mudah terbakar di furnace untuk mencegah ledakan." },
  { k: "sop", q: "Setelah turbin berhenti berputar (shutdown), apa yang harus segera dilakukan?", p: ["Matikan lube oil", "Masukkan turning gear", "Buka casing turbin", "Stop seal oil"], a: 1, e: "Rotor panas yang diam akan melengkung (bowing) karena pendinginan tidak merata. Turning gear memutar poros perlahan." },
  { k: "sop", q: "Saat terjadi trip unit, informasi apa yang pertama dibaca untuk mengetahui penyebab awal?", p: ["Tren suhu ruangan", "First-out alarm", "Laporan harian", "Grafik beban kemarin"], a: 1, e: "First-out menunjukkan proteksi mana yang pertama aktif sehingga penyebab awal bisa dibedakan dari trip ikutan." },
  { k: "sop", q: "Urutan trip yang umum dan aman untuk menghindari overspeed adalah…", p: ["Buka CB generator dulu baru turbin trip", "Turbin trip → reverse power → CB generator terbuka", "MFT tidak perlu", "Turunkan eksitasi dulu"], a: 1, e: "Membuka CB saat uap masih masuk bisa membuat turbin overspeed. Dengan turbine trip dulu, generator menjadi motor sebentar lalu proteksi reverse power membuka CB (sequential trip)." },
  { k: "sop", q: "Syarat sinkronisasi generator ke grid adalah kecocokan…", p: ["Tegangan, frekuensi, sudut fase (dan urutan fase)", "Hanya MW", "Hanya suhu", "Hanya tekanan uap"], a: 0, e: "Sinkronisasi tidak sesuai menimbulkan arus & torsi kejut besar yang bisa merusak generator dan poros." },
  { k: "sop", q: "Saat blackout total, beban mana yang paling kritis untuk turbin-generator?", p: ["Lampu kantor", "EOP DC & emergency seal oil", "Conveyor batubara", "Kompresor service air"], a: 1, e: "Tanpa pelumasan bearing saat coast-down, bearing turbin bisa rusak berat (wiping)." },
  { k: "sop", q: "Saat cold start-up, mengapa laju kenaikan suhu/tekanan boiler dibatasi?", p: ["Menghemat batubara", "Mencegah tegangan termal berlebih pada drum dan header tebal", "Agar vakum turun", "Supaya ESP bekerja"], a: 1, e: "Komponen berdinding tebal memanas tidak merata; kenaikan terlalu cepat menimbulkan thermal stress & retak." },
  { k: "sop", q: "Sebelum masuk ke dalam peralatan (mis. mill, boiler) untuk perbaikan, prosedur keselamatan wajib adalah…", p: ["Cukup lapor lisan", "PTW (izin kerja), LOTO, pengukuran gas/confined space", "Matikan lampu", "Tunggu 1 menit"], a: 1, e: "Izin kerja, isolasi energi (lock out tag out), dan uji atmosfer ruang terbatas mencegah kecelakaan fatal." },
];
