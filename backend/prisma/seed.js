const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@kikuu.rw' },
    update: {},
    create: {
      name: 'Alice Uwimana',
      email: 'admin@kikuu.rw',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+250788300001',
    },
  });

  const users = [
    { name: 'Jean Baptiste Habimana', email: 'habimana@kikuu.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123456' },
    { name: 'Beatha Mukamana', email: 'mukamana@kikuu.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123457' },
    { name: 'Emmanuel Niyonzima', email: 'niyonzima@kikuu.rw', password: userPassword, role: 'USER', category: 'INTERMEDIATE', phone: '+250788123458' },
    { name: 'Chantal Uwase', email: 'uwase@kikuu.rw', password: userPassword, role: 'USER', category: 'ADVANCED', phone: '+250788123459' },
    { name: 'Pierre Mugisha', email: 'mugisha@kikuu.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123460' },
    { name: 'Grace Imanishimwe', email: 'imanishimwe@kikuu.rw', password: userPassword, role: 'USER', category: 'INTERMEDIATE', phone: '+250788123461' },
    { name: 'David Hakizimana', email: 'hakizimana@kikuu.rw', password: userPassword, role: 'USER', category: 'BEGINNER', phone: '+250788123462' },
    { name: 'Jeanne d\'Arc Uwimana', email: 'jeanne@kikuu.rw', password: userPassword, role: 'USER', category: 'ADVANCED', phone: '+250788123463' },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 12);
      await prisma.user.create({ data: { ...u, password: hashed } });
    }
  }

  const products = [
    { name: 'Agaseke - Panier Traditionnel', nameRw: 'Agaseke', description: 'Panier traditionnel rwandais tissé à la main par des artisanes de Nyabugogo, idéal pour la décoration et le rangement', descriptionRw: 'Agaseke gakozwe n\'intoki nabanyarwanda bo muri Nyabugogo, kiza mw itongo no kubikamo ibintu', price: 25000, category: 'Artisanat', stock: 45 },
    { name: 'Café Rwanda Mountain 1kg', nameRw: 'Ikawa ya Rwanda 1kg', description: 'Café 100% Arabica cultivé sur les collines du Rwanda, certifié commerce équitable, saveur fruitée et chocolatée', descriptionRw: 'Ikawa ya Arabica 100% ihingwa ku misozi y\'u Rwanda, ifite uburyohe bw\'imbuto na shokola', price: 15000, category: 'Alimentation', stock: 200 },
    { name: 'Thé Noir Rwanda 500g', nameRw: 'Icyayi cya Rwanda 500g', description: 'Thé noir de haute qualité des plantations de Mulindi et Gisovu, saveur riche et corsée', descriptionRw: 'Icyayi cyiza cyo mu biraro bya Mulindi na Gisovu, gifite uburyohe bwiza', price: 8000, category: 'Alimentation', stock: 150 },
    { name: 'Huile de cuisson Pure 5L', nameRw: 'Amavuta yo guteka 5L', description: 'Huile végétale 100% pure, idéale pour la cuisine quotidienne', descriptionRw: 'Amavuta y\'imboga asukuye 100%, meza yo guteka buri munsi', price: 8500, category: 'Alimentation', stock: 300 },
    { name: 'Riz Kigori 10kg', nameRw: 'Umuceri wa Kigori 10kg', description: 'Riz de qualité supérieure cultivé dans les marais de Kigori, secteur de Gatsibo', descriptionRw: 'Umuceri wintangaribwa uhingwa mu bishanga bya Kigori, akarere ka Gatsibo', price: 12500, category: 'Alimentation', stock: 180 },
    { name: 'Farine de Maïs Fortifiée 5kg', nameRw: 'Ifu y\'Ibigori 5kg', description: 'Farine de maïs enrichie en vitamines et minéraux, produite par MINIMEX Rwanda', descriptionRw: 'Ifu y\'ibigori yongerewe intungamubiri, yakozwe na MINIMEX Rwanda', price: 4500, category: 'Alimentation', stock: 250 },
    { name: 'Haricots Rouges 5kg', nameRw: 'Ibishyimbo 5kg', description: 'Haricots rouges secs cultivés dans le district de Rulindo, qualité export', descriptionRw: 'Ibishyimbo byumye bihingwa mu karere ka Rulindo, ubwiza bwoherezwa mu mahanga', price: 6000, category: 'Alimentation', stock: 120 },
    { name: 'Miel Naturel Rwanda 500ml', nameRw: 'Ubuki bw\'ikinyarwanda 500ml', description: 'Miel pur naturel récolté dans le Parc National de Nyungwe', descriptionRw: 'Ubuki busukuye bukusanywa mu Pariki ya Nyungwe', price: 12000, category: 'Alimentation', stock: 80 },
    { name: 'T-shirt «I am Rwandan»', nameRw: 'T-shirt «Ndi Umunyarwanda»', description: 'T-shirt en coton biologique, fierté nationale, disponible en tailles S/M/L/XL', descriptionRw: 'T-shirt ikozwe mu pamba nziza, yerekana ko uri umunyarwanda, ingano S/M/L/XL', price: 8000, category: 'Vêtements', stock: 300 },
    { name: 'Umushanana Traditionnel', nameRw: 'Umushanana', description: 'Robe traditionnelle rwandaise en tissu vitenge, parfaite pour les cérémonies et événements culturels', descriptionRw: 'Umushanana nyarwanda ukozwe mu gitambaro cya vitenge, kiza mu birori n\'imihango', price: 35000, category: 'Vêtements', stock: 60 },
    { name: 'Kitenge Wax 6 yards', nameRw: 'Kitenge Wax 6 yards', description: 'Tissu wax africain de haute qualité, motifs traditionnels rwandais, 6 yards', descriptionRw: 'Igitambaro cya kitenge cyiza, gifite imishari y\'ikinyarwanda, 6 yards', price: 18000, category: 'Vêtements', stock: 100 },
    { name: 'Sandales en Cuir Rwanda', nameRw: 'Inkweto z\'impu', description: 'Sandales fabriquées à la main en cuir véritable par des artisans de Kigali', descriptionRw: 'Inkweto zakozwe n\'intoki mu mpu nziza nabanyarwanda bo muri Kigali', price: 15000, category: 'Vêtements', stock: 75 },
    { name: 'Savon Feuille de Camphre 1L', nameRw: 'Isabune y\'amazi 1L', description: 'Savon liquide antiseptique à la feuille de camphre, fabriqué au Rwanda', descriptionRw: 'Isabune y\'amazi irwanya udukoko yakozwe mu Rwanda', price: 3500, category: 'Maison', stock: 500 },
    { name: 'Détergent en Poudre 2kg', nameRw: 'Detergent y\'ubushoboje 2kg', description: 'Lessive en poudre pour linge, nettoyage puissant, fabriqué par SULFO Rwanda', descriptionRw: 'Detergent y\'ubushoboje ikozwe na SULFO Rwanda', price: 5500, category: 'Maison', stock: 400 },
    { name: 'Smartphone Samsung Galaxy A14', nameRw: 'Smartphone Samsung Galaxy A14', description: 'Samsung Galaxy A14 6.6 pouces, 128GB, 4GB RAM, double SIM, garantie 1 an Rwanda', descriptionRw: 'Samsung Galaxy A14 pousi 6.6, 128GB, 4GB RAM, SIM ebyiri', price: 145000, category: 'Electronique', stock: 35 },
    { name: 'Chargeur Universel USB', nameRw: 'Chaje ya USB', description: 'Chargeur universel avec adaptateur EU/Rwanda, 2 ports USB, charge rapide 3A', descriptionRw: 'Chaje ikora buri simu, ifite adaptateur y\'i Rwanda, USB 2, ihita yuzuza', price: 5000, category: 'Electronique', stock: 200 },
    { name: 'Radio Solaire Rwanda', nameRw: 'Radiyo y\'izuba', description: 'Radio AM/FM solaire avec lampe LED et port USB, parfaite pour zones rurales', descriptionRw: 'Radiyo ikoresha imirasire y\'izuba, ifite urumuri rwa LED na USB, meza mu cyaro', price: 12000, category: 'Electronique', stock: 60 },
    { name: 'Beurre de Karité Naturel 250g', nameRw: 'Makutsi ya Karite 250g', description: 'Beurre de karité 100% pur venant d\'Afrique de l\'Est, hydratant pour la peau et les cheveux', descriptionRw: 'Makutsi ya karite 100% y\'ikinyarwanda, yorosya uruhu n\'umusatsi', price: 7000, category: 'Beauté', stock: 90 },
    { name: 'Huile de Noix de Cocos 500ml', nameRw: 'Amavuta ya Cocos 500ml', description: 'Huile de noix de coco vierge biologique, pour la cuisine naturelle et les soins corporels', descriptionRw: 'Amavuta ya coco nzima, meza mu guteka no kwitunganya umubiri', price: 9000, category: 'Beauté', stock: 70 },
    { name: 'Produits pour Bébé Kit Rwanda', nameRw: 'Ibikoresho by\'Umwana', description: 'Kit complet de soins pour bébé: savon doux, lotion, huile et lingettes', descriptionRw: 'Ibikoresho byose byo kwitaho umwana: isabune yoroshye, lotion, amavuta', price: 15000, category: 'Bébé', stock: 40 },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  const translations = [
    { sourceText: 'Welcome to KiKUU', kinyarwandaText: 'Murakaza neza kuri KiKUU', context: 'homepage' },
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
    { email: 'habimana@kikuu.rw', latency: 5200, wrong: 4, time: 60000, repeated: 6, page: '/products' },
    { email: 'habimana@kikuu.rw', latency: 4800, wrong: 3, time: 45000, repeated: 5, page: '/products/artisanat' },
    { email: 'habimana@kikuu.rw', latency: 6100, wrong: 5, time: 55000, repeated: 8, page: '/checkout' },
    { email: 'niyonzima@kikuu.rw', latency: 2500, wrong: 1, time: 30000, repeated: 3, page: '/products' },
    { email: 'niyonzima@kikuu.rw', latency: 2800, wrong: 2, time: 25000, repeated: 2, page: '/products/electronique' },
    { email: 'uwase@kikuu.rw', latency: 1200, wrong: 0, time: 15000, repeated: 1, page: '/products' },
    { email: 'uwase@kikuu.rw', latency: 800, wrong: 0, time: 10000, repeated: 0, page: '/checkout' },
    { email: 'mugisha@kikuu.rw', latency: 5500, wrong: 6, time: 70000, repeated: 10, page: '/products' },
    { email: 'mugisha@kikuu.rw', latency: 7000, wrong: 4, time: 65000, repeated: 7, page: '/register' },
    { email: 'hakizimana@kikuu.rw', latency: 8000, wrong: 7, time: 90000, repeated: 12, page: '/products/maison' },
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

  console.log('Seed data created successfully with Rwandan content!');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Admin:     admin@kikuu.rw / admin123');
  console.log('  Beginner:  habimana@kikuu.rw / user123');
  console.log('  Beginner:  mukamana@kikuu.rw / user123');
  console.log('  Intermed:  niyonzima@kikuu.rw / user123');
  console.log('  Intermed:  imanishimwe@kikuu.rw / user123');
  console.log('  Advanced:  uwase@kikuu.rw / user123');
  console.log('  Beginner:  mugisha@kikuu.rw / user123');
  console.log('  Beginner:  hakizimana@kikuu.rw / user123');
  console.log('  Advanced:  jeanne@kikuu.rw / user123');
  console.log('');
  console.log('Products: 20 (Artisanat, Alimentation, Vêtements, Maison, Electronique, Beauté, Bébé)');
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
