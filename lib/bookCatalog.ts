import { Product } from '../types';

// Book templates provided by the user
export const bookTemplates = [
  { title: "A Glossary", author: "DR. V. ABDUR RAHIM", price: 200, category: "English Books" },
  { title: "Al-Fathiha & Juz' Amma – English", author: "MULJANA SYED ABUL ALI, ...", price: 15, category: "English Books" },
  { title: "Ahadhith Sahleh", author: "DR. V. ABDUR RAHIM", price: 80, category: "Arabic Books" },
  { title: "Al Fathiha and Amma Juz (Urdu)", author: "MOLJA NA SYED ABUL ALI, ...", price: 15, category: "Urdu Books" },
  { title: "Al-Ajwaliah", author: "DR. V. ABDUR RAHIM", price: 50, category: "Arabic Books" },
  { title: "Ali-Fathiha & Juz' Amma – English", author: "MULJANA SYED ABUL ALI, ...", price: 15, category: "English Books" },
  { title: "Allah Tests Three Men (Islamic Moral Stories to...", author: "", price: 125, category: "English Books" },
  { title: "ARABIC ALPHABETS – 2", author: "DR. V. ABDUR RAHIM", price: 110, category: "Arabic Books" },
  { title: "ARABIC ALPHABETS – DR. V. ABDUR RAHIM", author: "DR. V. ABDUR RAHIM", price: 110, category: "Arabic Books" },
  { title: "Arabic Conversation Drills", author: "DR. V. ABDUR RAHIM", price: 150, category: "Arabic Books" },
  { title: "Arabic Reader For Children Vol – 1", author: "DR. V. ABDUR RAHIM", price: 230, category: "Arabic Books" },
  { title: "Arabic Reader For Children Vol – 2", author: "DR. V. ABDUR RAHIM", price: 290, category: "Arabic Books" },
  { title: "Arabic Reader Handouts (1,2,3)", author: "DR. V. ABDUR RAHIM", price: 200, category: "Arabic Books" },
  { title: "Arabic Reader Part I", author: "DR. V. ABDUR RAHIM", price: 120, category: "Arabic Books" },
  { title: "Arabic Reader Part II", author: "DR. V. ABDUR RAHIM", price: 200, category: "Arabic Books" },
  { title: "Arabic Reader Part III", author: "DR. V. ABDUR RAHIM", price: 250, category: "Arabic Books" },
  { title: "Arabic Words for Children", author: "Muslimi Faqil M.A. Mohammed...", price: 65, category: "Arabic Books" },
  { title: "At the Well of Madyan", author: "DR. V. ABDUR RAHIM", price: 120, category: "English Books" },
  { title: "At-Tibyan English", author: "DR. V. ABDUR RAHIM", price: 125, category: "English Books" },
  { title: "Both These Lights Emancate from the same...", author: "DR. V. ABDUR RAHIM", price: 110, category: "English Books" },
  { title: "Da'wa – What and How", author: "H. ABDUR RADEES", price: 30, category: "English Books" }
];

// Featured Books (Mocks 1-7) for compatibility
export const FEATURED_BOOKS: Product[] = [
  { id: '1', name: 'The Holy Qur\'an (Tamil Translation)', price: 450.00, category: 'Tamil Books', stock: 25, rating: 5.0, reviewCount: 120, description: 'Complete Tamil translation of the Holy Qur\'an with clear exegesis (Tafseer) published by IFT.', imageUrl: '/Asset/1.png' },
  { id: '2', name: 'Tafheem-ul-Qur\'an (6 Volumes Urdu)', price: 3200.00, category: 'Urdu Books', stock: 8, rating: 4.9, reviewCount: 88, description: 'Masterful exegesis of the Holy Qur\'an by Syed Abul A\'la Maududi in six beautiful hardcover volumes.', imageUrl: '/Asset/2.png' },
  { id: '3', name: 'Introduction to Islam (English)', price: 180.00, category: 'English Books', stock: 50, rating: 4.8, reviewCount: 42, description: 'A comprehensive introductory text for anyone seeking a clear understanding of the beliefs and practices of Islam.', imageUrl: '/Asset/3.png' },
  { id: '4', name: 'Riyadus Saliheen (Tamil Edition)', price: 650.00, category: 'Tamil Books', stock: 15, rating: 4.9, reviewCount: 64, description: 'The famous collection of Hadith by Imam Al-Nawawi, translated into clear, contemporary Tamil.', imageUrl: '/Asset/4.png' },
  { id: '5', name: 'Prophetic Biographies (Seerah - English)', price: 350.00, category: 'English Books', stock: 30, rating: 4.7, reviewCount: 29, description: 'A detailed account of the life and character of Prophet Muhammad (peace be upon him) for modern readers.', imageUrl: '/Asset/5.png' },
  { id: '6', name: 'Arabic Grammar for Beginners', price: 220.00, category: 'Arabic Books', stock: 40, rating: 4.6, reviewCount: 18, description: 'An easy-to-follow guide to learning basic Arabic grammar, specifically tailored for understanding Quranic texts.', imageUrl: '/Asset/6.png' },
  { id: '7', name: 'Islamic Akhlaq & Manners (Tamil)', price: 120.00, category: 'Tamil Books', stock: 100, rating: 4.8, reviewCount: 75, description: 'A guidebook on Islamic character development and daily social etiquette.', imageUrl: '/Asset/7.png' },
];

// Generate exactly 552 books
const generateAllBooks = (): Product[] => {
  const allBooks: Product[] = [];
  const categories = {
    tamil: 490, // Adjusted to make total exactly 552 (490 + 33 + 23 + 6 = 552)
    arabic: 33,
    english: 23,
    urdu: 6
  };
  
  let bookId = 1;
  
  // 1. Generate Tamil books (490 books)
  for (let i = 0; i < categories.tamil; i++) {
    // Generate deterministic values to ensure they do not change across mounts
    const seed = i;
    const price = 80 + ((seed * 17) % 35) * 10;
    const originalPrice = price + 50 + ((seed * 13) % 20) * 10;
    allBooks.push({
      id: `tamil-${bookId++}`,
      name: i < 50 ? `தமிழ் புத்தகம் - ${i + 1}` : 
             i < 100 ? `இஸ்லாமிய கல்வி - ${i + 1}` :
             i < 150 ? `குர்ஆன் கற்றல் - ${i + 1}` :
             i < 200 ? `நபிகள் வரலாறு - ${i + 1}` :
             i < 250 ? `இஸ்லாமிய சட்டங்கள் - ${i + 1}` :
             i < 300 ? `தொழுகை வழிகாட்டி - ${i + 1}` :
             i < 350 ? `தமிழ் குர்ஆன் விளக்கம் - ${i + 1}` :
             i < 400 ? `இஸ்லாமிய கட்டுரைகள் - ${i + 1}` :
             i < 450 ? `நபி வழி நெறிகள் - ${i + 1}` :
             `இஸ்லாமிய மரபுகள் - ${i + 1}`,
      author: i % 3 === 0 ? "டாக்டர் வி. அப்துர் ரஹிம்" : 
              i % 3 === 1 ? "மௌலானா முகம்மது" : 
              "ஷெய்க் அப்துல் ரஹ்மான்",
      price,
      originalPrice,
      category: "Tamil Books",
      stock: (seed % 12) + 4,
      rating: parseFloat((4.5 + ((seed % 5) * 0.1)).toFixed(1)),
      reviewCount: (seed % 35) + 12,
      description: "Islamic Foundation Trust (IFT) Chennai publication. An authentic Tamil book dealing with essential aspects of Islamic knowledge.",
      imageUrl: `/Asset/${(seed % 7) + 1}.png`
    });
  }
  
  // 2. Generate Arabic books (33 books)
  const arabicTemplates = bookTemplates.filter(t => t.category === "Arabic Books");
  for (let i = 0; i < categories.arabic; i++) {
    const seed = i;
    const template = arabicTemplates[seed % arabicTemplates.length];
    const name = i < 10 ? `كتاب العربية - ${i + 1}` : 
                 i < 20 ? `تعلم اللغة العربية - ${i + 1}` :
                 template.title;
    const author = i % 3 === 0 ? "د. في عبد الرحيم" : 
                   i % 3 === 1 ? "الشيخ محمد" : 
                   template.author;
    const price = template.price + ((seed % 5) * 10);
    const originalPrice = price * 2;
    allBooks.push({
      id: `arabic-${bookId++}`,
      name,
      author: author || "DR. V. ABDUR RAHIM",
      price,
      originalPrice,
      category: "Arabic Books",
      stock: (seed % 8) + 3,
      rating: parseFloat((4.6 + ((seed % 4) * 0.1)).toFixed(1)),
      reviewCount: (seed % 20) + 7,
      description: "A highly recommended Arabic publication by IFT Chennai to learn and master Arabic language and grammar.",
      imageUrl: `/Asset/${(seed % 7) + 1}.png`
    });
  }
  
  // 3. Generate English books (23 books)
  const englishTemplates = bookTemplates.filter(t => t.category === "English Books");
  for (let i = 0; i < categories.english; i++) {
    const seed = i;
    const template = englishTemplates[seed % englishTemplates.length];
    const price = template.price;
    const originalPrice = price * 2;
    allBooks.push({
      id: `english-${bookId++}`,
      name: template.title,
      author: template.author || "DR. V. ABDUR RAHIM",
      price,
      originalPrice,
      category: "English Books",
      stock: (seed % 10) + 5,
      rating: parseFloat((4.7 + ((seed % 3) * 0.1)).toFixed(1)),
      reviewCount: (seed % 30) + 10,
      description: "Authentic English translation and explanation published by Islamic Foundation Trust (IFT) Chennai.",
      imageUrl: `/Asset/${(seed % 7) + 1}.png`
    });
  }
  
  // 4. Generate Urdu books (6 books)
  const urduBooks = [
    "قرآن مجید", "حدیث کی کتابیں", "تفسیر ابن کثیر", "صحیح بخاری", "صحیح مسلم", "فقه اسلامی"
  ];
  for (let i = 0; i < categories.urdu; i++) {
    const seed = i;
    const price = 150 + (seed * 45);
    const originalPrice = price * 2;
    allBooks.push({
      id: `urdu-${bookId++}`,
      name: urduBooks[i],
      author: seed % 2 === 0 ? "ڈاکٹر عبدالرحیم" : "مولانا محمد",
      price,
      originalPrice,
      category: "Urdu Books",
      stock: seed + 3,
      rating: 4.8,
      reviewCount: seed + 15,
      description: "Authentic Urdu Islamic publication covering crucial studies. Published and distributed by IFT Chennai.",
      imageUrl: `/Asset/${(seed % 7) + 1}.png`
    });
  }
  
  return allBooks;
};

// Main centralized book catalog array
export const ALL_BOOKS = generateAllBooks();

// Resolve a book by ID (works for both featured books and dynamic catalog books)
export const getBookById = (id: string): Product | null => {
  const featured = FEATURED_BOOKS.find(b => b.id === id);
  if (featured) return featured;
  
  return ALL_BOOKS.find(b => b.id.toLowerCase() === id.toLowerCase()) || null;
};
