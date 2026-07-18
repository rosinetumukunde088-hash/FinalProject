const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PRODUCT_IMAGES = {
  agaseke: [
    'https://images.unsplash.com/photo-1595231712325-9e23b8b3c146?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=400&fit=crop',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=400&fit=crop',
  ],
  tea: [
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
  ],
  oil: [
    'https://images.unsplash.com/photo-1474979266404-7f28e98fb785?w=600&h=400&fit=crop',
  ],
  rice: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop',
  ],
  flour: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
  ],
  beans: [
    'https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=600&h=400&fit=crop',
  ],
  honey: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&h=400&fit=crop',
  ],
  tshirt: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop',
  ],
  umushanana: [
    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=600&h=400&fit=crop',
  ],
  kitenge: [
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=600&h=400&fit=crop',
  ],
  sandals: [
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop',
  ],
  soap: [
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=400&fit=crop',
  ],
  detergent: [
    'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&h=400&fit=crop',
  ],
  samsung: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop',
  ],
  charger: [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop',
  ],
  radio: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
  ],
  shea: [
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=400&fit=crop',
  ],
  coconut: [
    'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=400&fit=crop',
  ],
  baby: [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&h=400&fit=crop',
  ],
};

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kiramart.rw' },
    update: {},
    create: {
      name: 'tumukunde rosine',
      email: 'rosinetumukunde08@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+250788300001',
    },
  });

  const users = [
    { name: 'Jean Baptiste Habimana', email: 'habimana@kiramart.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123456' },
    { name: 'Beatha Mukamana', email: 'mukamana@kiramart.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123457' },
    { name: 'Emmanuel Niyonzima', email: 'niyonzima@kiramart.rw', password: userPassword, role: 'USER', category: 'INTERMEDIATE', phone: '+250788123458' },
    { name: 'Chantal Uwase', email: 'uwase@kiramart.rw', password: userPassword, role: 'USER', category: 'ADVANCED', phone: '+250788123459' },
    { name: 'Pierre Mugisha', email: 'mugisha@kiramart.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123460' },
    { name: 'Grace Imanishimwe', email: 'imanishimwe@kiramart.rw', password: userPassword, role: 'USER', category: 'INTERMEDIATE', phone: '+250788123461' },
    { name: 'David Hakizimana', email: 'hakizimana@kiramart.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123462' },
    { name: 'Jeanne d\'Arc Uwimana', email: 'jeanne@kiramart.rw', password: userPassword, role: 'USER', category: 'ADVANCED', phone: '+250788123463' },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 12);
      await prisma.user.create({ data: { ...u, password: hashed } });
    }
  }

  const products = [
    {
      name: 'Agaseke - Traditional Woven Basket',
      nameRw: 'Agaseke',
      nameSw: 'Agaseke - Kikapu Jadi la Mwamba',
      description: 'Traditional Rwandan hand-woven basket by artisans from Nyabugogo, ideal for decoration and storage',
      descriptionRw: 'Agaseke gakozwe n\'intoki nabanyarwanda bo muri Nyabugogo, kiza mw itongo no kubikamo ibintu',
      descriptionSw: 'Kikapu jadi la Rwanda lililofumwa kwa mkono na mafundi wa Nyababugo, linafaa kwa mapambo na kuhifadhi',
      price: 25000, category: 'Art & Crafts', stock: 45,
      images: PRODUCT_IMAGES.agaseke,
    },
    {
      name: 'Rwanda Mountain Coffee 1kg',
      nameRw: 'Ikawa ya Rwanda 1kg',
      nameSw: 'Kahawa ya Mlima wa Rwanda 1kg',
      description: '100% Arabica coffee grown on the hills of Rwanda, Fair Trade certified, fruity and chocolatey flavor',
      descriptionRw: 'Ikawa ya Arabica 100% ihingwa ku misozi y\'u Rwanda, ifite uburyohe bw\'imbuto na shokola',
      descriptionSw: 'Kahawa ya Arabica 100% inayolimwa kwenye milima ya Rwanda, iliyothibitishwa Biashara ya Haki',
      price: 15000, category: 'Food & Drinks', stock: 200,
      images: PRODUCT_IMAGES.coffee,
    },
    {
      name: 'Rwanda Black Tea 500g',
      nameRw: 'Icyayi cya Rwanda 500g',
      nameSw: 'Chai Nyeusi ya Rwanda 500g',
      description: 'High quality black tea from the plantations of Mulindi and Gisovu, rich and bold flavor',
      descriptionRw: 'Icyayi cyiza cyo mu biraro bya Mulindi na Gisovu, gifite uburyohe bwiza',
      descriptionSw: 'Chai nyeusi ya ubora wa juu kutoka kwenye mashamba ya Mulindi na Gisovu',
      price: 8000, category: 'Food & Drinks', stock: 150,
      images: PRODUCT_IMAGES.tea,
    },
    {
      name: 'Pure Cooking Oil 5L',
      nameRw: 'Amavuta yo guteka 5L',
      nameSw: 'Mafuta ya kupikia Safi 5L',
      description: '100% pure vegetable oil, ideal for daily cooking',
      descriptionRw: 'Amavuta y\'imboga asukuye 100%, meza yo guteka buri munsi',
      descriptionSw: 'Mafuta ya mboga 100% safi, yanafaa kwa kupikia kila siku',
      price: 8500, category: 'Food & Drinks', stock: 300,
      images: PRODUCT_IMAGES.oil,
    },
    {
      name: 'Kigori Premium Rice 10kg',
      nameRw: 'Umuceri wa Kigori 10kg',
      nameSw: 'Wali wa Kigori wa Ubora wa Juu 10kg',
      description: 'Premium quality rice grown in the marshlands of Kigori, Gatsibo district',
      descriptionRw: 'Umuceri wintangaribwa uhingwa mu bishanga bya Kigori, akarere ka Gatsibo',
      descriptionSw: 'Wali wa ubora wa juu unaoelimwa kwenye mashamba ya Kigori, wilaya ya Gatsibo',
      price: 12500, category: 'Food & Drinks', stock: 180,
      images: PRODUCT_IMAGES.rice,
    },
    {
      name: 'Fortified Corn Flour 5kg',
      nameRw: 'Ifu y\'Ibigori 5kg',
      nameSw: 'Uncesco wa Mahindi Ulioboreshwa 5kg',
      description: 'Corn flour enriched with vitamins and minerals, produced by MINIMEX Rwanda',
      descriptionRw: 'Ifu y\'ibigori yongerewe intungamubiri, yakozwe na MINIMEX Rwanda',
      descriptionSw: 'Uncesco wa mahindi ulioimarishwa kwa vitamini na madini, utengenezwa na MINIMEX Rwanda',
      price: 4500, category: 'Food & Drinks', stock: 250,
      images: PRODUCT_IMAGES.flour,
    },
    {
      name: 'Red Beans 5kg',
      nameRw: 'Ibishyimbo 5kg',
      nameSw: 'Maharage Meekundu 5kg',
      description: 'Dried red beans grown in Rulindo district, export quality',
      descriptionRw: 'Ibishyimbo byumye bihingwa mu karere ka Rulindo, ubwiza bwoherezwa mu mahanga',
      descriptionSw: 'Maharage meekundu yaliyoka yanayolimwa katika wilaya ya Rulindo, ubora wa kuuza nje',
      price: 6000, category: 'Food & Drinks', stock: 120,
      images: PRODUCT_IMAGES.beans,
    },
    {
      name: 'Natural Rwanda Honey 500ml',
      nameRw: 'Ubuki bw\'ikinyarwanda 500ml',
      nameSw: 'Asali ya Asili ya Rwanda 500ml',
      description: 'Pure natural honey harvested in Nyungwe National Park',
      descriptionRw: 'Ubuki busukuye bukusanywa mu Pariki ya Nyungwe',
      descriptionSw: 'Asali safi ya asili inayokusanywa katika Hifadhi ya Taifa ya Nyungwe',
      price: 12000, category: 'Food & Drinks', stock: 80,
      images: PRODUCT_IMAGES.honey,
    },
    {
      name: '"I am Rwandan" T-Shirt',
      nameRw: 'T-shirt «Ndi Umunyarwanda»',
      nameSw: 'T-Shirt "Mimi ni Mw Rwanda"',
      description: 'Organic cotton t-shirt, national pride, available in sizes S/M/L/XL',
      descriptionRw: 'T-shirt ikozwe mu pamba nziza, yerekana ko uri umunyarwanda, ingano S/M/L/XL',
      descriptionSw: 'T-Shirt ya pamba ya asili, kiburi cha kitaifa, inapatikana kwa ukubwa S/M/L/XL',
      price: 8000, category: 'Clothing', stock: 300,
      images: PRODUCT_IMAGES.tshirt,
    },
    {
      name: 'Traditional Umushanana Dress',
      nameRw: 'Umushanana',
      nameSw: 'Gauni la Jadi la Umushanana',
      description: 'Traditional Rwandan dress made with vitenge fabric, perfect for ceremonies and cultural events',
      descriptionRw: 'Umushanana nyarwanda ukozwe mu gitambaro cya vitenge, kiza mu birori n\'imihango',
      descriptionSw: 'Gauni la jadi la Rwanda lililofumwa kwa kitenge, bora kwa sherehe na matukio ya kitamaduni',
      price: 35000, category: 'Clothing', stock: 60,
      images: PRODUCT_IMAGES.umushanana,
    },
    {
      name: 'Kitenge Wax Fabric 6 yards',
      nameRw: 'Kitenge Wax 6 yards',
      nameSw: 'Kitenge Wax 6 yards',
      description: 'High quality African wax fabric, traditional Rwandan patterns, 6 yards',
      descriptionRw: 'Igitambaro cya kitenge cyiza, gifite imishari y\'ikinyarwanda, 6 yards',
      descriptionSw: 'Kitenge ya ubora wa juu ya Afrika, mitindo ya jadi ya Rwanda, 6 yards',
      price: 18000, category: 'Clothing', stock: 100,
      images: PRODUCT_IMAGES.kitenge,
    },
    {
      name: 'Rwanda Leather Sandals',
      nameRw: 'Inkweto z\'impu',
      nameSw: 'Viatu vya ngozi vya Rwanda',
      description: 'Handmade genuine leather sandals crafted by artisans in Kigali',
      descriptionRw: 'Inkweto zakozwe n\'intoki mu mpu nziza nabanyarwanda bo muri Kigali',
      descriptionSw: 'Viatu vya ngozi vilivyotengenezwa kwa mkono na mafundi wa Kigali',
      price: 15000, category: 'Clothing', stock: 75,
      images: PRODUCT_IMAGES.sandals,
    },
    {
      name: 'Camphor Leaf Antiseptic Soap 1L',
      nameRw: 'Isabune y\'amazi 1L',
      nameSw: 'Sabuni ya Antiseptic ya Jani la Camphor 1L',
      description: 'Liquid antiseptic soap with camphor leaf, made in Rwanda',
      descriptionRw: 'Isabune y\'amazi irwanya udukoko yakozwe mu Rwanda',
      descriptionSw: 'Sabuni ya maji inayopinga vijidudu iliyojengwa kwa jani la camphor, Rwanda',
      price: 3500, category: 'Home', stock: 500,
      images: PRODUCT_IMAGES.soap,
    },
    {
      name: 'Powder Detergent 2kg',
      nameRw: 'Detergent y\'ubushoboje 2kg',
      nameSw: 'Detergent ya Nafaka 2kg',
      description: 'Powder laundry detergent, powerful cleaning, made by SULFO Rwanda',
      descriptionRw: 'Detergent y\'ubushoboje ikozwe na SULFO Rwanda',
      descriptionSw: 'Detergent ya nafaka ya kuosha nguo, usafi mkubwa, iliyotengenezwa na SULFO Rwanda',
      price: 5500, category: 'Home', stock: 400,
      images: PRODUCT_IMAGES.detergent,
    },
    {
      name: 'Samsung Galaxy A14 Smartphone',
      nameRw: 'Samsung Galaxy A14',
      nameSw: 'Samsung Galaxy A14 Simu',
      description: 'Samsung Galaxy A14 6.6 inches, 128GB, 4GB RAM, dual SIM, 1 year warranty in Rwanda',
      descriptionRw: 'Samsung Galaxy A14 pousi 6.6, 128GB, 4GB RAM, SIM ebyiri',
      descriptionSw: 'Samsung Galaxy A14 inchi 6.6, 128GB, 4GB RAM, SIM mbili, dhamana ya mwaka 1 Rwanda',
      price: 145000, category: 'Electronics', stock: 35,
      images: PRODUCT_IMAGES.samsung,
    },
    {
      name: 'Universal USB Charger',
      nameRw: 'Chaje ya USB',
      nameSw: 'Chaji ya USB ya Wote',
      description: 'Universal charger with EU/Rwanda adapter, 2 USB ports, fast charge 3A',
      descriptionRw: 'Chaje ikora buri simu, ifite adaptateur y\'i Rwanda, USB 2, ihita yuzuza',
      descriptionSw: 'Chaji ya wote yenye adapter ya EU/Rwanda, sehemu 2 za USB, chaji ya haraka 3A',
      price: 5000, category: 'Electronics', stock: 200,
      images: PRODUCT_IMAGES.charger,
    },
    {
      name: 'Solar Radio Rwanda',
      nameRw: 'Radiyo y\'izuba',
      nameSw: 'Redio ya Jua ya Rwanda',
      description: 'AM/FM solar radio with LED lamp and USB port, perfect for rural areas',
      descriptionRw: 'Radiyo ikoresha imirasire y\'izuba, ifite urumuri rwa LED na USB, meza mu cyaro',
      descriptionSw: 'Redio ya AM/FM ya jua yenye taa ya LED na kitinga USB, bora kwa maeneo ya vijijini',
      price: 12000, category: 'Electronics', stock: 60,
      images: PRODUCT_IMAGES.radio,
    },
    {
      name: 'Natural Shea Butter 250g',
      nameRw: 'Makutsi ya Karite 250g',
      nameSw: 'Siagi ya Asili ya Shea 250g',
      description: '100% pure shea butter from East Africa, moisturizing for skin and hair',
      descriptionRw: 'Makutsi ya karite 100% y\'ikinyarwanda, yorosya uruhu n\'umusatsi',
      descriptionSw: 'Siagi ya asili ya shea 100% kutoka Afrika Mashariki, inalainisha ngo na nywele',
      price: 7000, category: 'Beauty', stock: 90,
      images: PRODUCT_IMAGES.shea,
    },
    {
      name: 'Organic Coconut Oil 500ml',
      nameRw: 'Amavuta ya Cocos 500ml',
      nameSw: 'Mafuta ya Nazi ya Asili 500ml',
      description: 'Organic virgin coconut oil, for natural cooking and body care',
      descriptionRw: 'Amavuta ya coco nzima, meza muuteka no kwitunganya umubiri',
      descriptionSw: 'Mafuta ya nazi safi ya asili, ya kupikia asili na kujikinga mwili',
      price: 9000, category: 'Beauty', stock: 70,
      images: PRODUCT_IMAGES.coconut,
    },
    {
      name: 'Baby Care Kit Rwanda',
      nameRw: 'Ibikoresho by\'Umwana',
      nameSw: 'Vifaa vya Mtoto vya Rwanda',
      description: 'Complete baby care kit: gentle soap, lotion, oil and wipes',
      descriptionRw: 'Ibikoresho byose byo kwitaho umwana: isabune yoroshye, lotion, amavuta',
      descriptionSw: 'Vifaa kamili vya mtoto: sabuni laini, losheni, mafuta na vitafuta',
      price: 15000, category: 'Baby', stock: 40,
      images: PRODUCT_IMAGES.baby,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: product.name,
          nameRw: product.nameRw,
          nameSw: product.nameSw,
          description: product.description,
          descriptionRw: product.descriptionRw,
          descriptionSw: product.descriptionSw,
          price: product.price,
          category: product.category,
          imageUrl: product.images[0],
          images: product.images,
          stock: product.stock,
        },
      });
    }
  }

  const translations = [
    { sourceText: 'Welcome to Kiramart', kinyarwandaText: 'Murakaza neza kuri Kiramart', context: 'homepage' },
    { sourceText: 'Search products', kinyarwandaText: 'Shakisha ibicuruzwa', context: 'search' },
    { sourceText: 'Add to cart', kinyarwandaText: 'Ongera mu gikapu', context: 'product' },
    { sourceText: 'Buy now', kinyarwandaText: 'Gura nonaha', context: 'checkout' },
    { sourceText: 'My account', kinyarwandaText: 'Konti yanjye', context: 'profile' },
    { sourceText: 'Popular products', kinyarwandaText: 'Ibicuruzwa bikunzwe', context: 'homepage' },
    { sourceText: 'New arrivals', kinyarwandaText: 'Ibishya', context: 'homepage' },
    { sourceText: 'Special offers', kinyarwandaText: 'Amahirwe adasanzwe', context: 'homepage' },
    { sourceText: 'Hello', kinyarwandaText: 'Muraho', context: 'general' },
    { sourceText: 'Price', kinyarwandaText: 'Igiciro', context: 'product' },
    { sourceText: 'Quantity', kinyarwandaText: 'Umubare', context: 'product' },
    { sourceText: 'Total', kinyarwandaText: 'Igiteranyo', context: 'checkout' },
    { sourceText: 'Payment', kinyarwandaText: 'Ubwishyu', context: 'checkout' },
    { sourceText: 'Order', kinyarwandaText: 'Itegeko', context: 'checkout' },
    { sourceText: 'Settings', kinyarwandaText: 'Igenamiterere', context: 'profile' },
    { sourceText: 'Language', kinyarwandaText: 'Ururimi', context: 'settings' },
    { sourceText: 'Delivery', kinyarwandaText: 'Kugeza', context: 'checkout' },
    { sourceText: 'Free delivery', kinyarwandaText: 'Kugeza ku bushake', context: 'checkout' },
    { sourceText: 'Continue shopping', kinyarwandaText: 'Komeza ugure', context: 'cart' },
    { sourceText: 'Remove from cart', kinyarwandaText: 'Kura mu gikapu', context: 'cart' },
    { sourceText: 'Wishlist', kinyarwandaText: 'Ibyifuzo', context: 'profile' },
    { sourceText: 'Contact us', kinyarwandaText: 'Twandikire', context: 'footer' },
    { sourceText: 'FAQ', kinyarwandaText: 'Ibibazo bikunze kubazwa', context: 'help' },
    { sourceText: 'About us', kinyarwandaText: 'Ibyerekeye', context: 'footer' },
    { sourceText: 'Terms and conditions', kinyarwandaText: 'Amategeko n\'amabwiriza', context: 'footer' },
    { sourceText: 'Privacy policy', kinyarwandaText: 'Ibanga', context: 'footer' },
  ];

  for (const t of translations) {
    const existing = await prisma.translation.findFirst({ where: { sourceText: t.sourceText } });
    if (!existing) {
      await prisma.translation.create({ data: t });
    }
  }

  const behaviorEntries = [
    { email: 'habimana@kiramart.rw', latency: 5200, wrong: 4, time: 60000, repeated: 6, page: '/products' },
    { email: 'habimana@kiramart.rw', latency: 4800, wrong: 3, time: 45000, repeated: 5, page: '/products/art-crafts' },
    { email: 'habimana@kiramart.rw', latency: 6100, wrong: 5, time: 55000, repeated: 8, page: '/checkout' },
    { email: 'niyonzima@kiramart.rw', latency: 2500, wrong: 1, time: 30000, repeated: 3, page: '/products' },
    { email: 'niyonzima@kiramart.rw', latency: 2800, wrong: 2, time: 25000, repeated: 2, page: '/products/electronics' },
    { email: 'uwase@kiramart.rw', latency: 1200, wrong: 0, time: 15000, repeated: 1, page: '/products' },
    { email: 'uwase@kiramart.rw', latency: 800, wrong: 0, time: 10000, repeated: 0, page: '/checkout' },
    { email: 'mugisha@kiramart.rw', latency: 5500, wrong: 6, time: 70000, repeated: 10, page: '/products' },
    { email: 'mugisha@kiramart.rw', latency: 7000, wrong: 4, time: 65000, repeated: 7, page: '/register' },
    { email: 'hakizimana@kiramart.rw', latency: 8000, wrong: 7, time: 90000, repeated: 12, page: '/products/home' },
  ];

  for (const entry of behaviorEntries) {
    const user = await prisma.user.findUnique({ where: { email: entry.email } });
    if (user) {
      await prisma.userBehavior.create({
        data: {
          userId: user.id,
          clickLatency: entry.latency,
          wrongClicks: entry.wrong,
          timeSpent: entry.time,
          repeatedActions: entry.repeated,
          page: entry.page,
          navigationPattern: 'home > ' + entry.page,
          deviceInfo: 'Mozilla/5.0 (Linux; Android 13; Samsung Galaxy A23)',
        },
      });
    }
  }

  console.log('Seed data created successfully with English content!');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Admin:     admin@kiramart.rw / admin123');
  console.log('  Beginner:  habimana@kiramart.rw / user123');
  console.log('  Beginner:  mukamana@kiramart.rw / user123');
  console.log('  Intermed:  niyonzima@kiramart.rw / user123');
  console.log('  Intermed:  imanishimwe@kiramart.rw / user123');
  console.log('  Advanced:  uwase@kiramart.rw / user123');
  console.log('  Beginner:  mugisha@kiramart.rw / user123');
  console.log('  Beginner:  hakizimana@kiramart.rw / user123');
  console.log('  Advanced:  jeanne@kiramart.rw / user123');
  console.log('');
  console.log('Products: 20 (Art & Crafts, Food & Drinks, Clothing, Home, Electronics, Beauty, Baby)');
  console.log('Translations: 26 English-Kinyarwanda pairs');
  console.log('Behavior Data: 10 recorded sessions across users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
