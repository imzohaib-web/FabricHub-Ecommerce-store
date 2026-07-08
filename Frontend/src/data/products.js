import ready1 from "../assets/images/Ready to wear.webp";
import ready2 from "../assets/images/Ready to wear2.jpg";
import ready3 from "../assets/images/Ready to wear3.webp";
import ready4 from "../assets/images/Ready to wear4.webp";
import ready5 from "../assets/images/Ready to wear5.webp";
import ready6 from "../assets/images/Ready to wear6.avif";
import ready7 from "../assets/images/Ready to wear7.avif";
import ready8 from "../assets/images/Ready to wear8.webp";

import mono1 from "../assets/images/monochrome1.webp";
import mono2 from "../assets/images/monochrome2.webp";
import mono3 from "../assets/images/monochrome trouser3.webp";
import mono5 from "../assets/images/monochrome5.webp";
import mono6 from "../assets/images/monochrome6.webp";
import mono7 from "../assets/images/monochrome7.webp";

import newIn1 from "../assets/images/new in.webp";
import newIn2 from "../assets/images/new in2.webp";
import newIn3 from "../assets/images/new in3.webp";
import newIn4 from "../assets/images/new in4.webp";
import newIn5 from "../assets/images/new in5.webp";
import newIn6 from "../assets/images/new in6.webp";
import newIn7 from "../assets/images/new in7.webp";
import newIn8 from "../assets/images/new in8.webp";

import sale1 from "../assets/images/sale1.webp";
import sale2 from "../assets/images/sale2.webp";
import sale3 from "../assets/images/sale3.webp";
import sale4 from "../assets/images/sale4.webp";
import sale5 from "../assets/images/sale5.webp";
import sale6 from "../assets/images/sale6.webp";
import sale7 from "../assets/images/sale7.webp";
import sale8 from "../assets/images/sale8.webp";

import shawl1 from "../assets/images/shawl1.webp";
import shawl2 from "../assets/images/shawl2.webp";
import shawl3 from "../assets/images/shawl3.webp";
import shawl4 from "../assets/images/shwal4.webp";

import unst1 from "../assets/images/unstitched.webp";
import unst3 from "../assets/images/unstitched3.webp";
import unst_typo1 from "../assets/images/unstichted.webp";
import unst4 from "../assets/images/unstichted4.webp";
import unst5 from "../assets/images/unstichted5.webp";
import unst6 from "../assets/images/unstichted6.webp";

import photo1 from "../assets/images/photo-1702468506996-bebd08c2e52c.avif";
import photo2 from "../assets/images/photo-1702974777184-a128dcb8dd76.avif";
import photo3 from "../assets/images/photo-1702974981208-3652839e5f6e.avif";
import image2 from "../assets/images/image2.jpg";

export const products = [
  {
    id: "p1",
    name: "Ethereal Ivory Lawn Suit",
    price: 4500,
    category: "lawn-collection",
    image: unst1,
    images: [unst1, unst3],
    description: "An elegant unstitched 3-piece suit featuring a self-jacquard lawn shirt, embroidered organza borders, and a printed cambric dupatta.",
    rating: 4.8,
    reviewsCount: 24,
    stock: 15,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ivory", value: "#FFFFF0" },
      { name: "Soft Cream", value: "#FFFDD0" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "Shirt: 3m Self-Jacquard Lawn",
      "Trouser: 2.5m Dyed Cambric Cotton",
      "Dupatta: 2.5m Printed Chiffon Dupatta",
      "Intricate floral embroidery border on organza"
    ]
  },
  {
    id: "p2",
    name: "Crimson Rose Unstitched",
    price: 3850,
    category: "unstitched",
    image: unst3,
    images: [unst3, unst1],
    description: "Indulge in rich crimson tones with this beautiful unstitched 3-piece cotton ensemble. Beautifully detailed with threadwork panels and a soft net dupatta.",
    rating: 4.7,
    reviewsCount: 18,
    stock: 12,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Crimson Red", value: "#990000" },
      { name: "Burgundy", value: "#800020" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Shirt: 3.2m Embroidered Cotton",
      "Trouser: 2.5m Dyed Cotton Trouser",
      "Dupatta: 2.5m Embroidered Net Dupatta",
      "Includes embroidered neck and sleeve patches"
    ]
  },
  {
    id: "p3",
    name: "Mustard Fusion Kurta",
    price: 2990,
    category: "ready-to-wear",
    image: ready1,
    images: [ready1, ready3],
    description: "Brighten up your days with this structured digital print fusion kurta, showcasing a modern round hem and lace inserts along the sleeves.",
    rating: 4.5,
    reviewsCount: 32,
    stock: 20,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mustard Gold", value: "#E1AD01" },
      { name: "Ochre", value: "#CC7722" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "100% Premium Khaddar Fabric",
      "Band collar with beaded placket",
      "Fringe lace borders on sleeves and hem",
      "Wash inside out, tumble dry low"
    ]
  },
  {
    id: "p4",
    name: "Midnight Velvet Kaftan",
    price: 14500,
    category: "formal",
    image: photo2,
    images: [photo2, photo1],
    description: "An absolute showstopper. Woven from luxurious silk micro-velvet, this formal kaftan features heavy hand-crafted gold zari tilla work along the neckline and borders.",
    rating: 4.9,
    reviewsCount: 14,
    stock: 8,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Obsidian Black", value: "#0B0B0C" },
      { name: "Midnight Navy", value: "#191970" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "100% Premium Silk Velvet",
      "Intricate hand-embellished zari neckline",
      "Relaxed flowy fit with inner waist tie",
      "Dry clean only"
    ]
  },
  {
    id: "p5",
    name: "Classic Pashmina Shawl",
    price: 7800,
    category: "shawl",
    image: shawl1,
    images: [shawl1, shawl2],
    description: "Keep warm in unmatched elegance. Woven from ultra-fine Kashmiri pashmina wool, this shawl features traditional floral tilla-work borders.",
    rating: 4.9,
    reviewsCount: 22,
    stock: 10,
    inStock: true,
    sizes: ["OS"],
    colors: [
      { name: "Dark Walnut", value: "#42281D" },
      { name: "Charcoal Grey", value: "#3A3A3A" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "100% Fine Pashmina Wool",
      "Traditional hand-look tilla embroidery",
      "Dimension: 100cm x 200cm",
      "Dry clean only"
    ]
  },
  {
    id: "p6",
    name: "Charcoal Monochrome Kurta",
    price: 3490,
    category: "monochrome",
    image: mono1,
    images: [mono1, mono2],
    description: "Modern minimalism at its finest. This classic cotton silk kurta shows a striking monochrome panel design, finished with dark horn buttons.",
    rating: 4.6,
    reviewsCount: 15,
    stock: 25,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mono Charcoal", value: "#2C2C2C" },
      { name: "Noir", value: "#121212" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Cotton Silk Blend",
      "Asymmetric monochrome block print",
      "Comfortable casual fit",
      "Machine wash gentle"
    ]
  },
  {
    id: "p7",
    name: "Summer Breeze Lawn (On Sale)",
    price: 2490,
    category: "sale",
    image: sale1,
    images: [sale1, sale2],
    description: "Celebrate summer with this lightweight printed 2-piece lawn suit. Reduced from original retail price, it is a perfect everyday pick for hot weather.",
    rating: 4.4,
    reviewsCount: 40,
    stock: 30,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Soft Mint", value: "#98FF98" },
      { name: "Aqua Blue", value: "#E0FFFF" }
    ],
    isFeatured: false,
    isBestSeller: true,
    details: [
      "Shirt: 2.7m Printed Premium Lawn",
      "Trouser: 2.3m Dyed Lawn Trouser",
      "Vibrant breathable cotton fibers",
      "Wash with cold water"
    ]
  },
  {
    id: "p8",
    name: "Embellished Wedding Trousseau",
    price: 38000,
    category: "wedding-wear",
    image: photo1,
    images: [photo1, photo2],
    description: "Exquisite handcraftsmanship for your big moments. This wedding suit features heavy dabka, zardozi, and sequence handwork on raw silk.",
    rating: 5.0,
    reviewsCount: 9,
    stock: 4,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Teal Gold", value: "#008080" },
      { name: "Rich Crimson", value: "#B22222" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "Shirt: Premium Raw Silk (dyed)",
      "Lehenga/Sharara: 4m raw silk fabric",
      "Dupatta: 2.7m pure organza dupatta with border",
      "Custom hand embroidery with dabka, naqshi and kora"
    ]
  },
  {
    id: "p9",
    name: "Emerald Luxury Pret",
    price: 9500,
    category: "luxury-pret",
    image: ready2,
    images: [ready2, ready4],
    description: "Designed for premium soirées. A tailored raw silk shirt detailed with delicate cutwork sleeves, paired with straight-fit silk trousers.",
    rating: 4.8,
    reviewsCount: 16,
    stock: 7,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Emerald Green", value: "#046307" },
      { name: "Forest Green", value: "#1F3A22" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "100% High-grade Raw Silk",
      "Shirt and trouser included",
      "Laser cutwork detailing along cuffs",
      "Dry clean recommended"
    ]
  },
  {
    id: "p10",
    name: "Royal Indigo Silk",
    price: 12500,
    category: "silk-collection",
    image: photo3,
    images: [photo3, photo1],
    description: "Indulge in pure luxury with our digital print silk suit. This beautiful indigo 3-piece features a pure crepe silk kameez and silk trouser.",
    rating: 4.9,
    reviewsCount: 11,
    stock: 6,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Royal Indigo", value: "#4B0082" },
      { name: "Navy Blue", value: "#000080" }
    ],
    isFeatured: false,
    isBestSeller: true,
    details: [
      "100% Pure Silk Crepe shirt",
      "Draped printed silk dupatta",
      "Dyed raw silk trousers",
      "Dry clean only"
    ]
  },
  {
    id: "p11",
    name: "Zari Embroidered Organza",
    price: 5850,
    category: "embroidered",
    image: unst5,
    images: [unst5, unst6],
    description: "A gorgeous semi-formal unstitched suit with floral resham embroidery on sheer organza fabric, matched with satin borders.",
    rating: 4.6,
    reviewsCount: 19,
    stock: 9,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Rose Gold", value: "#B76E79" },
      { name: "Blush Pink", value: "#FFD1DC" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Shirt: 3m sheer organza paneling",
      "Includes inner lining fabric (2.5m lawn)",
      "Trouser: 2.5m dyed viscose satin",
      "Dupatta: 2.5m organza dupatta with tilla bootis"
    ]
  },
  {
    id: "p12",
    name: "Winter Velvet Shawl",
    price: 15500,
    category: "winter-collection",
    image: shawl4,
    images: [shawl4, shawl3],
    description: "Add a layer of royal comfort. This luxurious velvet shawl is heavily embroidered with antique gold tilla and zardozi borders.",
    rating: 5.0,
    reviewsCount: 13,
    stock: 5,
    inStock: true,
    sizes: ["OS"],
    colors: [
      { name: "Plum Maroon", value: "#4A0E17" },
      { name: "Forest Green", value: "#173C27" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "Plush Velvet Fabric",
      "Heavy four-sided embroidery",
      "Handmade silk tassels",
      "Dry clean only"
    ]
  },
  {
    id: "p13",
    name: "Mint Chiffon Dupatta Suit",
    price: 4990,
    category: "unstitched",
    image: unst6,
    images: [unst6, unst1],
    description: "An elegant unstitched cambric shirt showcasing delicate chicken-kari style front embroideries, paired with a crinkled chiffon dupatta.",
    rating: 4.7,
    reviewsCount: 22,
    stock: 14,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Mint Green", value: "#AAF0D1" },
      { name: "Pastel Sage", value: "#8FBC8F" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Shirt: 3m Embroidered Cambric Cotton",
      "Dupatta: 2.5m Pure Crinkle Chiffon",
      "Trouser: 2.5m Dyed Cambric Trouser",
      "Delicate lace trimmings included"
    ]
  },
  {
    id: "p14",
    name: "Pastel Garden Lawn",
    price: 3990,
    category: "lawn-collection",
    image: unst4,
    images: [unst4, unst3],
    description: "Make a refreshing style statement with this beautifully printed pastel lawn suit, highlighted by floral digital prints and cutwork borders.",
    rating: 4.8,
    reviewsCount: 30,
    stock: 18,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Peach Coral", value: "#F08080" },
      { name: "Soft Butter", value: "#FFF8DC" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "Shirt: 3m Premium Printed Lawn",
      "Dupatta: 2.5m Digital Print Voile Dupatta",
      "Trouser: 2.5m dyed cotton trousers",
      "Laser cut embroidered lace border patch"
    ]
  },
  {
    id: "p15",
    name: "Cobalt Ready-to-Wear",
    price: 3290,
    category: "ready-to-wear",
    image: ready3,
    images: [ready3, ready5],
    description: "A tailored A-line cotton shirt featuring contrast piping details and pleated panels, perfect for casual smart wear.",
    rating: 4.6,
    reviewsCount: 27,
    stock: 11,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cobalt Blue", value: "#0047AB" },
      { name: "Royal Blue", value: "#4169E1" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "100% Breathable Slub Cotton",
      "Round keyhole neck with buttons",
      "Dual side pockets for convenience",
      "Wash with dark colors separately"
    ]
  },
  {
    id: "p16",
    name: "Teal Velvet Collection Suit",
    price: 18500,
    category: "winter-collection",
    image: ready7,
    images: [ready7, ready6],
    description: "Crafted from plush, heavy silk velvet, this elegant traditional kameez suit contours the body beautifully. Features detailed gold zari work on borders.",
    rating: 4.9,
    reviewsCount: 16,
    stock: 6,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Deep Teal", value: "#005F5F" },
      { name: "Midnight Noir", value: "#1A1A1A" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "Plush silk-blend micro-velvet",
      "Cowl neckline, detailed zari patterns",
      "Concealed back zip closure",
      "Dry clean only"
    ]
  },
  {
    id: "p17",
    name: "Onyx Embroidered Kurta",
    price: 4495,
    category: "embroidered",
    image: mono5,
    images: [mono5, mono6],
    description: "An elegant black cotton shirt finished with dense white silk thread embroidery on the neckline, cuffs, and hem. Clean, minimalist, and striking.",
    rating: 4.7,
    reviewsCount: 21,
    stock: 15,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Onyx Black", value: "#1C1C1C" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "100% Premium Egyptian Slub Cotton",
      "Intricate silk-thread embroidery motifs",
      "Relaxed A-line silhouette",
      "Hand wash cold"
    ]
  },
  {
    id: "p18",
    name: "Bridal Crimson Lehenga",
    price: 48500,
    category: "wedding-wear",
    image: image2,
    images: [image2, photo1],
    description: "A heirloom masterpiece. This heavily embellished raw silk lehenga showcases traditional block prints, gold tilla handwork, and kora dabka detailing.",
    rating: 5.0,
    reviewsCount: 7,
    stock: 2,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Crimson Red", value: "#9A0E17" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "Fabric: Pure Raw Silk shirt and lehenga skirt",
      "Heavy antique gold zardozi panel panels",
      "Dupatta: Pure tissue silk with heavy border work",
      "Made to order, dry clean only"
    ]
  },
  {
    id: "p19",
    name: "Rose Gold Luxury Pret",
    price: 11500,
    category: "luxury-pret",
    image: ready4,
    images: [ready4, ready6],
    description: "Effortless shimmer. Crafted from metallic blended silk, this shirt features a draped collar and delicate pearl bead fringes along the sleeve hems.",
    rating: 4.8,
    reviewsCount: 19,
    stock: 8,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Rose Gold", value: "#B76E79" },
      { name: "Champagne", value: "#F5EFEB" }
    ],
    isFeatured: false,
    isBestSeller: true,
    details: [
      "Lustrous tissue-silk blend fabric",
      "Draped neckline with pearl drop accents",
      "Straight silk pants included",
      "Dry clean recommended"
    ]
  },
  {
    id: "p20",
    name: "Monochrome Linen Co-ord",
    price: 5200,
    category: "monochrome",
    image: mono2,
    images: [mono2, mono7],
    description: "A tailored monochrome co-ord set made from high-grade Irish linen. Features geometric embroidery patterns and a chic structural collar.",
    rating: 4.6,
    reviewsCount: 14,
    stock: 12,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Black-White", value: "#000000" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "100% Belgian Linen fibers",
      "High-contrast color-blocked paneling",
      "Comes with matching linen trousers",
      "Gentle cycle cold wash"
    ]
  },
  {
    id: "p21",
    name: "Classic Kashmiri Shawl",
    price: 6800,
    category: "shawl",
    image: shawl2,
    images: [shawl2, shawl3],
    description: "Add a touch of heritage styling with this lightweight wool shawl, featuring traditional paisley block motifs and hand-knotted tassels.",
    rating: 4.7,
    reviewsCount: 31,
    stock: 17,
    inStock: true,
    sizes: ["OS"],
    colors: [
      { name: "Soft Beige", value: "#F2E8DF" },
      { name: "Rust", value: "#B7410E" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "100% Fine Highland Wool",
      "Traditional paisley woodblock print art",
      "Dimension: 110cm x 220cm",
      "Dry clean only"
    ]
  },
  {
    id: "p22",
    name: "Sunshine Festive Kurta (On Sale)",
    price: 2890,
    category: "sale",
    image: sale3,
    images: [sale3, sale4],
    description: "Inject some brightness into your wardrobe with this cotton silk kurta, featuring a gold zari stripe print.",
    rating: 4.5,
    reviewsCount: 22,
    stock: 0,
    inStock: false,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sunshine Yellow", value: "#FFD700" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Cotton Silk zari blend fabric",
      "Includes matching raw silk trousers",
      "Comfortable wide-neck style",
      "Hand wash recommended"
    ]
  },
  {
    id: "p23",
    name: "Opal Silk Dress",
    price: 13800,
    category: "silk-collection",
    image: photo2,
    images: [photo2, photo3],
    description: "An elegant pure silk slip dress designed for luxury layering, showing high luster, fluid movement, and clean minimalist finish.",
    rating: 4.9,
    reviewsCount: 25,
    stock: 9,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Opal White", value: "#FAF5EF" },
      { name: "Midnight Black", value: "#1A1A1A" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "100% Organic Mulberry Silk Crepe",
      "Double lined with soft modal backing",
      "Asymmetric low back detail",
      "Dry clean only"
    ]
  },
  {
    id: "p24",
    name: "Spring Meadow Lawn",
    price: 4950,
    category: "new-arrivals",
    image: newIn1,
    images: [newIn1, newIn2],
    description: "Part of our new seasonal collection, this 3-piece lawn suit has a beautiful mint base printed with fresh meadow blooms and styled with organza border patches.",
    rating: 4.8,
    reviewsCount: 8,
    stock: 14,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Spring Mint", value: "#E0F8E0" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "3m Premium combed cotton lawn shirt",
      "2.5m chiffon dupatta with print borders",
      "2.5m cotton trousers with lace patches",
      "Machine wash gentle"
    ]
  },
  {
    id: "p25",
    name: "Peach Blossom Pret",
    price: 3890,
    category: "new-arrivals",
    image: newIn2,
    images: [newIn2, newIn3],
    description: "An easy-going ready-to-wear kurta, decorated with floral thread-embroidery along the sleeves and finished with matching buttons.",
    rating: 4.7,
    reviewsCount: 12,
    stock: 15,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Peach Puff", value: "#FFDAB9" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "100% Premium Cambric Cotton",
      "Lightweight and breathable texture",
      "Includes plain cotton straight pants",
      "Wash inside out"
    ]
  },
  {
    id: "p26",
    name: "Sapphire Linen Suit",
    price: 5490,
    category: "new-arrivals",
    image: newIn3,
    images: [newIn3, newIn4],
    description: "Stay warm in style with this deep sapphire blue unstitched 3-piece linen suit, featuring heavy white wool threadwork panels.",
    rating: 4.7,
    reviewsCount: 6,
    stock: 11,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Sapphire Blue", value: "#0F52BA" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Shirt: 3m Embroidered Slub Linen",
      "Trouser: 2.5m dyed warm linen trouser",
      "Dupatta: 2.5m heavy wool embroidered shawl",
      "Dry clean recommended"
    ]
  },
  {
    id: "p27",
    name: "Coral Festiva Silk",
    price: 12990,
    category: "new-arrivals",
    image: newIn4,
    images: [newIn4, newIn5],
    description: "A vibrant luxury pret selection. Coral red raw silk shirt detailed with gold tilla patterns, paired with wide silk culottes.",
    rating: 4.8,
    reviewsCount: 15,
    stock: 9,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Festive Coral", value: "#FF7F50" }
    ],
    isFeatured: true,
    isBestSeller: true,
    details: [
      "100% Heavy Silk fabric base",
      "Detailed golden zari embroidery along collar",
      "Comes with matching raw silk trousers",
      "Dry clean only"
    ]
  },
  {
    id: "p28",
    name: "Amethyst Velvet Stole",
    price: 4200,
    category: "winter-collection",
    image: shawl3,
    images: [shawl3, shawl4],
    description: "A compact velvet stole woven in a deep amethyst purple tone, decorated with fine silver tilla floral booti work across the surface.",
    rating: 4.6,
    reviewsCount: 10,
    stock: 22,
    inStock: true,
    sizes: ["OS"],
    colors: [
      { name: "Amethyst Purple", value: "#9966CC" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "Luxury micro-velvet fabric base",
      "Four sided fine silver lace detailing",
      "Dimension: 60cm x 180cm",
      "Dry clean only"
    ]
  },
  {
    id: "p29",
    name: "Ivory Pearl Kurti",
    price: 2995,
    category: "ready-to-wear",
    image: ready5,
    images: [ready5, ready6],
    description: "An elegant off-white slub lawn kurta styled with neat pleats and delicate pearl bead ornaments on the sleeve ends.",
    rating: 4.5,
    reviewsCount: 18,
    stock: 14,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ivory Pearl", value: "#FFFFF0" }
    ],
    isFeatured: false,
    isBestSeller: false,
    details: [
      "100% Premium combed lawn cotton",
      "Pearl detailing along sleeve slits",
      "Straight, slightly oversized silhouette",
      "Wash with care"
    ]
  },
  {
    id: "p30",
    name: "Aqua Silk Kaftan",
    price: 16500,
    category: "luxury-pret",
    image: ready8,
    images: [ready8, ready7],
    description: "Elevate your look with this flowy aqua-green silk kaftan, styled with a refined boat collar and detailed silver tilla borders.",
    rating: 4.9,
    reviewsCount: 12,
    stock: 8,
    inStock: true,
    sizes: ["OS"],
    colors: [
      { name: "Aqua Marine", value: "#7FFFD4" }
    ],
    isFeatured: true,
    isBestSeller: false,
    details: [
      "Premium Silk Chiffon base fabric",
      "Adjustable inner belt for custom fits",
      "Handmade silver piping borders",
      "Dry clean only"
    ]
  }
];
