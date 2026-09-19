import type { MealType } from "./store-types";

export const PHOTOS = {
  teishoku:
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1100&q=70",
  salmonBoard:
    "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1100&q=70",
  ramen:
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1100&q=70",
  sushiBoat:
    "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1100&q=70",
  sushiDark:
    "https://images.unsplash.com/photo-1607301405390-d831c242f59b?auto=format&fit=crop&w=1100&q=70",
  bowl:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1100&q=70",
  breakfast:
    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1100&q=70",
  fuji:
    "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1100&q=70",
} as const;

export type Recipe = {
  slug: string;
  name: string;
  summary: string;
  image: string;
  mealType: MealType;
  mealLabel: string;
  minutes: number;
  difficulty: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  tags: string[];
  focus: ("tinggi-protein" | "rendah-karbo" | "kaya-serat" | "fermentasi")[];
  ingredients: string[];
  steps: string[];
};

export const RECIPES: Recipe[] = [
  {
    slug: "salmon-teriyaki-quinoa-bowl",
    name: "Salmon Teriyaki Quinoa Bowl",
    summary:
      "Kombinasi asam lemak omega-3 alami dan serat karbohidrat kompleks rendah cerna untuk energi tahan lama.",
    image: PHOTOS.teishoku,
    mealType: "siang",
    mealLabel: "Makan Siang",
    minutes: 25,
    difficulty: "Mudah",
    kcal: 520,
    protein: 38,
    carbs: 48,
    fat: 14,
    fiber: 6,
    tags: ["Favorit Komunitas", "Hara Hachi Bu"],
    focus: ["tinggi-protein", "kaya-serat"],
    ingredients: [
      "150 g fillet salmon segar",
      "100 g quinoa merah, rebus",
      "60 g edamame kukus",
      "1 sdm kecap asin rendah sodium",
      "1 sdt madu murni",
      "1 sdt minyak wijen",
      "Irisan daun bawang & wijen sangrai",
    ],
    steps: [
      "Rebus quinoa dengan air 1:2 selama 15 menit, biarkan mengembang tertutup 5 menit.",
      "Campur kecap asin, madu, dan minyak wijen menjadi saus teriyaki ringan.",
      "Panggang salmon di wajan anti lengket 3 menit per sisi, olesi saus di menit terakhir.",
      "Tata quinoa, salmon, dan edamame dalam mangkuk; taburi daun bawang dan wijen.",
    ],
  },
  {
    slug: "sup-bening-jamur-shimeji",
    name: "Sup Bening Jamur Shimeji & Tofu Sutra",
    summary:
      "Kaldu dashi rumput laut katsuo yang menenangkan lambung di malam hari, ramah pencernaan saat rehat.",
    image: PHOTOS.ramen,
    mealType: "malam",
    mealLabel: "Makan Malam",
    minutes: 15,
    difficulty: "Sangat Mudah",
    kcal: 180,
    protein: 14,
    carbs: 12,
    fat: 5,
    fiber: 7,
    tags: ["Rendah Kalori"],
    focus: ["rendah-karbo", "fermentasi"],
    ingredients: [
      "500 ml air kaldu dashi",
      "100 g jamur shimeji",
      "150 g tahu sutra",
      "1 lembar wakame kering",
      "1 sdt shiro miso",
      "Daun bawang secukupnya",
    ],
    steps: [
      "Didihkan kaldu dashi, masukkan jamur shimeji selama 3 menit.",
      "Tambahkan tahu sutra yang dipotong dadu dan wakame yang sudah direndam.",
      "Matikan api, larutkan miso dengan sedikit kuah lalu tuang kembali agar kultur hidupnya terjaga.",
      "Sajikan hangat dengan taburan daun bawang.",
    ],
  },
  {
    slug: "gado-gado-tempe-kukus",
    name: "Gado-Gado Tempe Kukus Saus Kacang Mete",
    summary:
      "Harmonisasi superfood Nusantara tempe kukus dengan sayuran hijau dan saus mete berlemak tak jenuh.",
    image: PHOTOS.bowl,
    mealType: "siang",
    mealLabel: "Makan Siang",
    minutes: 20,
    difficulty: "Mudah",
    kcal: 440,
    protein: 22,
    carbs: 36,
    fat: 18,
    fiber: 9,
    tags: ["Kaya Serat Lokal", "Probiotik Fermentasi"],
    focus: ["kaya-serat", "fermentasi"],
    ingredients: [
      "150 g tempe, kukus 10 menit",
      "100 g kacang panjang & kol rebus",
      "1 butir telur rebus",
      "40 g kacang mete sangrai",
      "1 siung bawang putih",
      "Air asam jawa & sedikit gula aren",
    ],
    steps: [
      "Haluskan kacang mete, bawang putih, air asam, dan gula aren hingga menjadi saus kental.",
      "Kukus tempe agar teksturnya lembut tanpa minyak goreng.",
      "Rebus sayuran sebentar agar warna dan nutrisinya terjaga.",
      "Tata semua bahan, siram saus mete, sajikan dengan telur rebus.",
    ],
  },
  {
    slug: "overnight-oats-chia-matcha",
    name: "Overnight Oats Chia Seed & Matcha Latte",
    summary:
      "Kandungan L-theanine dari matcha Uji murni berpadu dengan chia seed untuk fokus kognitif tanpa jitter.",
    image: PHOTOS.breakfast,
    mealType: "sarapan",
    mealLabel: "Sarapan",
    minutes: 10,
    difficulty: "Praktis",
    kcal: 310,
    protein: 16,
    carbs: 42,
    fat: 8,
    fiber: 10,
    tags: ["Energi Stabil", "Bebas Gula Tambahan"],
    focus: ["kaya-serat"],
    ingredients: [
      "50 g oat utuh",
      "1 sdm chia seed",
      "200 ml susu almond tanpa gula",
      "1 sdt bubuk matcha Uji",
      "Buah beri segar secukupnya",
    ],
    steps: [
      "Campur oat, chia seed, dan susu almond dalam toples kaca.",
      "Larutkan matcha dengan sedikit air hangat, aduk rata ke dalam campuran.",
      "Diamkan dalam lemari pendingin minimal 6 jam atau semalaman.",
      "Sajikan dingin dengan buah beri segar di atasnya.",
    ],
  },
  {
    slug: "dada-ayam-panggang-miso",
    name: "Dada Ayam Panggang Miso & Brokoli Rebus",
    summary:
      "Marinasi shiro miso alami melunakkan serat daging tanpa perlu minyak berlebih, menunjang sintesis otot.",
    image: PHOTOS.sushiBoat,
    mealType: "siang",
    mealLabel: "Makan Siang",
    minutes: 25,
    difficulty: "Sedang",
    kcal: 460,
    protein: 45,
    carbs: 24,
    fat: 12,
    fiber: 5,
    tags: ["Tinggi Protein"],
    focus: ["tinggi-protein", "fermentasi"],
    ingredients: [
      "200 g dada ayam tanpa kulit",
      "1 sdm shiro miso",
      "1 sdt minyak zaitun",
      "1 sdt perasan jeruk nipis",
      "150 g brokoli",
    ],
    steps: [
      "Lumuri dada ayam dengan miso, minyak zaitun, dan jeruk nipis; diamkan 20 menit.",
      "Panggang dalam oven 200°C selama 18 menit hingga bagian luar kecokelatan.",
      "Rebus brokoli 3 menit lalu siram air dingin agar warnanya tetap hijau.",
      "Iris ayam melintang serat dan sajikan bersama brokoli.",
    ],
  },
  {
    slug: "salad-soba-dingin-edamame",
    name: "Salad Soba Dingin dengan Edamame & Wijen",
    summary:
      "Gandum soba 100% tinggi rutin dan polifenol, ramah untuk gula darah dan mencegah kantuk pasca makan.",
    image: PHOTOS.salmonBoard,
    mealType: "camilan",
    mealLabel: "Makan Siang / Camilan",
    minutes: 15,
    difficulty: "Cepat",
    kcal: 380,
    protein: 18,
    carbs: 54,
    fat: 9,
    fiber: 8,
    tags: ["Indeks Glikemik Rendah"],
    focus: ["kaya-serat"],
    ingredients: [
      "120 g mi soba kering",
      "80 g edamame kukus",
      "1 buah timun jepang",
      "1 sdm saus wijen",
      "1 sdt wijen sangrai",
    ],
    steps: [
      "Rebus soba sesuai anjuran kemasan, bilas dengan air dingin hingga kenyal.",
      "Iris timun tipis memanjang.",
      "Aduk soba dengan saus wijen hingga merata.",
      "Tata bersama edamame dan timun, taburi wijen sangrai.",
    ],
  },
];

export type SampleScan = {
  id: string;
  name: string;
  detail: string;
  image: string;
  confidence: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodiumMg: number;
  components: { label: string; match: number }[];
  micros: string[];
  note: string;
};

export const SAMPLE_SCANS: SampleScan[] = [
  {
    id: "salmon-poke-bowl",
    name: "Salmon Quinoa Poke Bowl",
    detail: "dengan Edamame Segar, Alpukat & Wijen Panggang",
    image: PHOTOS.teishoku,
    confidence: 98,
    kcal: 540,
    protein: 36,
    carbs: 48,
    fat: 22,
    fiber: 8,
    sodiumMg: 420,
    components: [
      { label: "Fresh Salmon (120g)", match: 99.4 },
      { label: "Edamame", match: 98 },
      { label: "Alpukat Mentega", match: 97.1 },
      { label: "Quinoa Merah", match: 96.2 },
      { label: "Wijen Panggang", match: 94.8 },
    ],
    micros: ["Kalium 680mg", "Vitamin D (70%)", "Lemak Tak Jenuh"],
    note: "Pilihan makan siang sangat seimbang! Kaya Omega-3 dari salmon dan serat quinoa membantu menjaga kestabilan insulin sepanjang siang. Tidak menimbulkan lonjakan gula berlebih.",
  },
  {
    id: "gado-gado-spesial",
    name: "Gado-Gado Spesial",
    detail: "Sayur rebus, tempe kukus & saus kacang encer",
    image: PHOTOS.bowl,
    confidence: 96,
    kcal: 480,
    protein: 22,
    carbs: 42,
    fat: 20,
    fiber: 11,
    sodiumMg: 510,
    components: [
      { label: "Tempe Kukus", match: 97.8 },
      { label: "Kacang Panjang & Kol", match: 95.4 },
      { label: "Telur Rebus", match: 94.1 },
      { label: "Saus Kacang", match: 92.6 },
    ],
    micros: ["Folat 190mcg", "Probiotik Alami", "Serat Larut"],
    note: "Serat sayur rebusnya tinggi sekali. Jaga porsi saus kacang agar lemak jenuh tetap terkendali, dan lengkapi dengan air mineral setelah makan.",
  },
  {
    id: "avocado-toast-egg",
    name: "Avocado Toast with Egg",
    detail: "Roti gandum utuh, alpukat lumat & telur mata sapi",
    image: PHOTOS.breakfast,
    confidence: 97,
    kcal: 390,
    protein: 16,
    carbs: 32,
    fat: 21,
    fiber: 9,
    sodiumMg: 380,
    components: [
      { label: "Roti Gandum Utuh", match: 98.2 },
      { label: "Alpukat", match: 97.5 },
      { label: "Telur Ayam", match: 96.9 },
    ],
    micros: ["Kolin 210mg", "Vitamin E", "Lemak Tak Jenuh Tunggal"],
    note: "Sarapan padat energi dengan lemak sehat. Tambahkan segenggam sayur hijau agar rasio serat harian tercapai lebih awal.",
  },
  {
    id: "ayam-panggang-salad",
    name: "Ayam Panggang Salad",
    detail: "Dada ayam panggang, selada romaine & dressing wijen",
    image: PHOTOS.sushiBoat,
    confidence: 95,
    kcal: 420,
    protein: 42,
    carbs: 14,
    fat: 18,
    fiber: 6,
    sodiumMg: 430,
    components: [
      { label: "Dada Ayam Panggang", match: 98.7 },
      { label: "Selada Romaine", match: 95.2 },
      { label: "Tomat Ceri", match: 93.5 },
      { label: "Dressing Wijen", match: 91.8 },
    ],
    micros: ["Zat Besi 3.2mg", "Niasin (B3)", "Protein Lengkap"],
    note: "Sangat tinggi protein dan rendah karbohidrat. Cocok untuk makan malam ringan; tambahkan ubi kukus bila Anda berlatih sore hari.",
  },
];

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readMinutes: number;
  author: string;
  topic: string;
  image: string;
  featured?: boolean;
  body: string[];
};

export const ARTICLE_CATEGORIES = [
  "Semua Artikel",
  "Mindful Eating & Filosofi",
  "Keseimbangan Makronutrien",
  "Hidrasi & Metabolisme",
  "Kearifan Hara Hachi Bu",
  "Resep & Bahan Alami",
] as const;

export const ARTICLES: Article[] = [
  {
    slug: "mengenal-hara-hachi-bu",
    title: "Mengenal Hara Hachi Bu: Seni Menghargai Rasa Kenyang Delapan Puluh Persen",
    category: "Kearifan Hara Hachi Bu",
    excerpt:
      "Mengapa memberi jeda 20 menit pada reseptor lambung terbukti secara klinis memperpanjang usia seluler, menstabilkan lonjakan glukosa darah, dan melenyapkan keletihan letih pascamakan.",
    readMinutes: 7,
    author: "dr. Kenji Pramana, Sp.GK",
    topic: "Mindful Eating",
    image: PHOTOS.teishoku,
    featured: true,
    body: [
      "Hara hachi bu (腹八分目) adalah ajaran Konfusian yang dipraktikkan turun-temurun di Okinawa: berhenti makan ketika perut terasa delapan puluh persen penuh. Praktik ini bukan bentuk pembatasan, melainkan latihan mendengarkan tubuh.",
      "Sinyal kenyang dari lambung membutuhkan waktu sekitar dua puluh menit untuk sampai ke hipotalamus. Ketika kita makan tergesa, kita melewati jendela waktu tersebut dan baru menyadari kekenyangan setelah porsi berlebih terlanjur masuk.",
      "Secara metabolik, menyisakan dua puluh persen ruang lambung menurunkan beban glikemik satu santapan, mengurangi lonjakan insulin, dan menjaga kewaspadaan mental di jam-jam setelah makan.",
      "Di Raifu, prinsip ini diterjemahkan menjadi tiga kebiasaan sederhana: makan tanpa layar, meletakkan sumpit atau sendok di antara suapan, dan memberi jeda sebelum memutuskan tambah porsi.",
    ],
  },
  {
    slug: "defisit-kalori-tanpa-cemas",
    title: "Panduan Praktis Defisit Kalori Tanpa Rasa Cemas & Kelaparan Ekstrem",
    category: "Keseimbangan Makronutrien",
    excerpt:
      "Mengikis mitos restriksi ekstrem. Pelajari cara menyesuaikan asupan harian dengan densitas volumetrik tinggi agar metabolisme tidak melambat.",
    readMinutes: 5,
    author: "Tim Nutrisi Raifu",
    topic: "Metabolisme Tubuh",
    image: PHOTOS.bowl,
    body: [
      "Defisit kalori yang berkelanjutan berada di kisaran 10–20% dari kebutuhan harian. Lebih dalam dari itu, tubuh menurunkan pengeluaran energi basal dan rasa lapar menjadi sulit dikendalikan.",
      "Kuncinya adalah densitas volumetrik: memilih makanan dengan volume besar namun kalori rendah, seperti sayur rebus, sup bening, jamur, dan buah utuh berserat.",
      "Protein dipertahankan tinggi (sekitar 1,6 g per kg berat badan) untuk menjaga massa otot selama proses penurunan berat badan.",
      "Pantau tren mingguan, bukan angka harian. Fluktuasi air dan glikogen dapat menutupi kemajuan sesungguhnya selama beberapa hari.",
    ],
  },
  {
    slug: "kekuatan-fermentasi-miso-tempe",
    title: "Kekuatan Fermentasi: Bagaimana Miso & Tempe Memperbaiki Mikrobioma Usus",
    category: "Resep & Bahan Alami",
    excerpt:
      "Menelusuri sinergi probiotik alami tradisional dalam memperkuat poros usus-otak (gut-brain axis) serta menstimulasi produksi hormon serotonin alami.",
    readMinutes: 6,
    author: "Rei Takahashi",
    topic: "Kesehatan Usus",
    image: PHOTOS.sushiDark,
    body: [
      "Miso dan tempe sama-sama lahir dari fermentasi kedelai, namun dengan kultur berbeda: koji (Aspergillus oryzae) pada miso, dan Rhizopus oligosporus pada tempe.",
      "Proses fermentasi memecah antinutrien seperti asam fitat sehingga mineral zat besi dan seng lebih mudah diserap tubuh.",
      "Konsumsi rutin pangan fermentasi dikaitkan dengan keragaman mikrobioma yang lebih tinggi — penanda kesehatan usus yang kuat.",
      "Satu catatan penting: tambahkan miso setelah kaldu turun dari didih agar kultur hidupnya tidak rusak oleh panas berlebih.",
    ],
  },
  {
    slug: "ritme-hidrasi-sadar",
    title: "Ritme Hidrasi Sadar: Waktu Terbaik Minum Air Sepanjang Hari",
    category: "Hidrasi & Metabolisme",
    excerpt:
      "Bukan sekadar mengejar target kuantitas 2 liter per hari. Temukan ritme penyerapan seluler optimal dari fajar hingga senja untuk mencegah edema.",
    readMinutes: 4,
    author: "Tim Nutrisi Raifu",
    topic: "Sirkadian Hidrasi",
    image: PHOTOS.fuji,
    body: [
      "Tubuh menyerap air paling efisien ketika diminum bertahap, sekitar 200–250 ml setiap dua jam, dibanding satu liter sekaligus.",
      "Segelas air hangat setelah bangun tidur membantu memulihkan cairan yang hilang selama tidur dan merangsang gerak peristaltik usus.",
      "Hindari minum dalam jumlah besar tepat saat makan agar enzim pencernaan tidak terlalu encer; beri jeda sekitar tiga puluh menit.",
      "Kurangi asupan cairan dua jam menjelang tidur untuk menjaga kualitas istirahat tanpa terbangun di tengah malam.",
    ],
  },
  {
    slug: "protein-nabati-dan-hewani",
    title: "Protein Berkualitas Tinggi: Memadukan Protein Nabati & Hewani Secara Selaras",
    category: "Keseimbangan Makronutrien",
    excerpt:
      "Profil asam amino esensial lengkap dan teknik memadukannya dalam satu santapan agar regenerasi jaringan otot tercapai optimal tanpa membebani ginjal.",
    readMinutes: 8,
    author: "dr. Kenji Pramana, Sp.GK",
    topic: "Sintesis Protein",
    image: PHOTOS.salmonBoard,
    body: [
      "Protein hewani umumnya lengkap secara asam amino, sementara protein nabati sering kekurangan satu atau dua asam amino pembatas.",
      "Memadukan biji-bijian dengan kacang-kacangan dalam satu hari sudah cukup untuk melengkapi profil asam amino — tidak harus dalam satu piring.",
      "Leusin adalah pemicu utama sintesis protein otot; sekitar 2,5 g leusin per santapan menjadi ambang yang efektif.",
      "Bagi orang sehat, asupan protein tinggi tidak merusak ginjal. Yang perlu diperhatikan adalah kecukupan cairan sehari-hari.",
    ],
  },
  {
    slug: "menimbang-berat-badan-harian",
    title: "Mengapa Menimbang Berat Badan Setiap Hari Seringkali Menipu Pikiran Anda",
    category: "Mindful Eating & Filosofi",
    excerpt:
      "Fluktuasi retensi air, glikogen otot, dan hormon kortisol bukan refleksi hilangnya massa lemak. Kenali indikator vital non-timbangan yang sesungguhnya.",
    readMinutes: 5,
    author: "Tim Nutrisi Raifu",
    topic: "Psikologi Makan",
    image: PHOTOS.breakfast,
    body: [
      "Setiap gram glikogen mengikat sekitar tiga gram air. Satu hari tinggi karbohidrat dapat menaikkan angka timbangan satu kilogram tanpa penambahan lemak sama sekali.",
      "Indikator non-timbangan lebih jujur: lingkar pinggang, kualitas tidur, stabilitas energi sore hari, dan kemampuan menyelesaikan latihan.",
      "Jika ingin tetap menimbang, lakukan di waktu yang sama setiap pagi dan baca rata-rata tujuh harinya, bukan angka hariannya.",
      "Tujuan Raifu bukan angka yang mengecil, melainkan relasi yang tenang dengan makanan.",
    ],
  },
];

export type FaqReply = {
  keywords: string[];
  answer: string;
  steps?: { title: string; detail: string }[];
  chips?: string[];
};

export const SUGGESTED_PROMPTS = [
  "Ide makan malam rendah kalori tapi mengenyangkan?",
  "Bagaimana menerapkan prinsip Hara Hachi Bu di restoran?",
  "Camilan sehat untuk mengatasi rasa kantuk sore?",
  "Berapa kebutuhan protein harian saya?",
];

export const BOT_REPLIES: FaqReply[] = [
  {
    keywords: ["ngemil", "manis", "malam", "craving", "gula"],
    answer:
      "Keinginan ngemil manis larut malam sering kali bukan sinyal rasa lapar biologis sejati, melainkan penurunan dopamin akibat kelelahan mental, atau dehidrasi terselubung setelah seharian beraktivitas.",
    steps: [
      {
        title: "Seduh secangkir hojicha atau teh chamomile hangat",
        detail:
          "Kandungan L-theanine pada teh sangrai menenangkan sistem saraf pusat tanpa kafein berlebih.",
      },
      {
        title: "Beri jeda dua puluh menit sebelum memutuskan",
        detail:
          "Sebagian besar dorongan ngemil mereda sendiri ketika Anda menunda tanpa melawannya.",
      },
      {
        title: "Jika masih lapar, pilih camilan berprotein",
        detail:
          "Greek yogurt tanpa gula, edamame kukus, atau segenggam almond memberi rasa kenyang stabil.",
      },
    ],
    chips: ["Pendekatan Holistik", "Tanpa Rasa Bersalah"],
  },
  {
    keywords: ["makan malam", "dinner", "rendah kalori", "mengenyangkan"],
    answer:
      "Untuk makan malam rendah kalori yang tetap mengenyangkan, andalkan volume tinggi dan protein cukup: sup bening jamur shimeji dengan tofu sutra (180 kkal), salad soba dingin dengan edamame (380 kkal), atau dada ayam panggang miso dengan brokoli rebus (460 kkal).",
    steps: [
      {
        title: "Isi setengah piring dengan sayur",
        detail: "Volume besar dengan kalori rendah membuat lambung terisi lebih awal.",
      },
      {
        title: "Tambahkan satu sumber protein utama",
        detail: "Ikan, tahu, tempe, atau telur menjaga rasa kenyang hingga pagi.",
      },
    ],
    chips: ["Ichiju Sansai", "Rendah Glikemik"],
  },
  {
    keywords: ["hara hachi bu", "restoran", "porsi", "80%"],
    answer:
      "Menerapkan Hara Hachi Bu di restoran bisa dimulai dari keputusan sebelum makanan datang. Pesan satu porsi lebih sedikit dari biasanya, minta piring kecil, dan letakkan alat makan setiap beberapa suapan.",
    steps: [
      {
        title: "Mulai dari sup atau sayur",
        detail: "Urutan makan memengaruhi respons glukosa dan rasa kenyang.",
      },
      {
        title: "Berhenti saat rasa 'ingin sedikit lagi' muncul",
        detail: "Titik itulah delapan puluh persen kapasitas Anda yang sesungguhnya.",
      },
    ],
    chips: ["Hara Hachi Bu", "Mindful Eating"],
  },
  {
    keywords: ["protein", "otot", "kebutuhan"],
    answer:
      "Kebutuhan protein harian Anda dihitung dari berat badan dan tingkat aktivitas. Untuk pemeliharaan kebugaran, kisaran 1,4–1,6 g per kg berat badan sudah memadai; sebarkan ke dalam tiga hingga empat santapan agar sintesis protein otot terstimulasi merata.",
    chips: ["Protein Alami", "Sintesis Otot"],
  },
  {
    keywords: ["air", "hidrasi", "minum"],
    answer:
      "Target hidrasi Anda sekitar 35 ml per kg berat badan per hari. Minum bertahap 200–250 ml setiap dua jam jauh lebih efektif diserap dibanding sekaligus dalam jumlah besar, dan kurangi asupan dua jam sebelum tidur agar istirahat tidak terganggu.",
    chips: ["Sirkadian Hidrasi"],
  },
  {
    keywords: ["kantuk", "sore", "energi", "lemas"],
    answer:
      "Kantuk sore biasanya muncul akibat lonjakan glukosa saat makan siang. Pilih karbohidrat kompleks seperti nasi merah atau soba, dahulukan sayur dan protein sebelum karbohidrat, lalu berjalan ringan sepuluh menit setelah makan.",
    steps: [
      {
        title: "Camilan penstabil energi",
        detail: "Edamame kukus garam laut (120 kkal, 11 g protein) atau greek yogurt tanpa gula.",
      },
    ],
    chips: ["Energi Stabil"],
  },
  {
    keywords: ["streak", "freeze", "lupa", "absen"],
    answer:
      "Streak Anda terlindungi oleh satu jatah Streak Freeze per bulan kalender. Saat Anda berhalangan mencatat dalam sehari, freeze aktif otomatis sehingga rantai kebiasaan tetap utuh. Hidup tidak linier — jeda bukan kegagalan.",
    chips: ["Streak Freeze"],
  },
];

export const FALLBACK_REPLY =
  "Terima kasih sudah bertanya. Saya adalah asisten edukasi gizi berbasis template, jadi jawaban saya paling akurat untuk topik seputar porsi makan, makronutrien, hidrasi, camilan sehat, dan penerapan Hara Hachi Bu. Coba ajukan pertanyaan seputar topik tersebut, atau pilih salah satu rekomendasi prompt di atas.";

export function findBotReply(message: string) {
  const text = message.toLowerCase();
  const scored = BOT_REPLIES.map((reply) => ({
    reply,
    score: reply.keywords.filter((keyword) => text.includes(keyword)).length,
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) return null;
  return best.reply;
}

export const RELATED_TOPICS = [
  {
    title: "Kombinasi Karbohidrat Kompleks Pasca Olahraga",
    meta: "Kemarin · Analisis Ubi Cilembu & Nasi Merah",
  },
  {
    title: "Manfaat Asam Amino Fermentasi Miso & Natto",
    meta: "3 Hari Lalu · Optimasi Mikrobioma Usus",
  },
  {
    title: "Strategi Puasa Berkala (Intermittent Fasting 16:8)",
    meta: "5 Hari Lalu · Ritme Sirkadian & Waktu Tidur",
  },
];
