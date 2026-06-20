const CATEGORY_IMAGE_MAP = {
  Women: {
    default: 'https://images.unsplash.com/photo-1520975912220-a8c1f01a94c4?auto=format&fit=crop&w=400&h=500&q=80',
    saree: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=400&h=500&q=80',
    lehenga: 'https://images.unsplash.com/photo-1551022374-593bc3511385?auto=format&fit=crop&w=400&h=500&q=80',
    kurti: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&h=500&q=80',
    dress: 'https://images.unsplash.com/photo-1520975912220-a8c1f01a94c4?auto=format&fit=crop&w=400&h=500&q=80',
    'ethnic wear': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    ethnic: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    shirt: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=500&q=80',
    't-shirt': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=500&q=80',
    tshirt: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=500&q=80',
    tops: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=500&q=80',
    bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    activewear: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    jeans: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    leggings: 'https://images.unsplash.com/photo-1556909216-1d254d7f6340?auto=format&fit=crop&w=400&h=500&q=80',
    pants: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=500&q=80',
    hoodie: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&h=500&q=80',
    jacket: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=400&h=500&q=80',
  },
  Men: {
    default: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&h=500&q=80',
    shirt: 'https://images.unsplash.com/photo-1551028708-60a30eb57637?auto=format&fit=crop&w=400&h=500&q=80',
    'formal shirt': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    't-shirt': 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    tshirt: 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    tops: 'https://images.unsplash.com/photo-1551028708-60a30eb57637?auto=format&fit=crop&w=400&h=500&q=80',
    bottoms: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d5?auto=format&fit=crop&w=400&h=500&q=80',
    activewear: 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    kurta: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=500&q=80',
    jacket: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d5?auto=format&fit=crop&w=400&h=500&q=80',
    jeans: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5d5?auto=format&fit=crop&w=400&h=500&q=80',
    trousers: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=500&q=80',
    chinos: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&h=500&q=80',
    'track pants': 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    shorts: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&h=500&q=80',
  },
  Kids: {
    default: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=500&q=80',
    'kids wear': 'https://images.unsplash.com/photo-1520975699013-79f59f062c6a?auto=format&fit=crop&w=400&h=500&q=80',
    'kids t-shirt': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=500&q=80',
    't-shirt': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=500&q=80',
    tshirt: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=500&q=80',
    tops: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=400&h=500&q=80',
    bottoms: 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    activewear: 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    frock: 'https://images.unsplash.com/photo-1557950360-3e3304a9d8b5?auto=format&fit=crop&w=400&h=500&q=80',
    dress: 'https://images.unsplash.com/photo-1557950360-3e3304a9d8b5?auto=format&fit=crop&w=400&h=500&q=80',
    'track pants': 'https://images.unsplash.com/photo-1518893067206-c9ecf0d48df7?auto=format&fit=crop&w=400&h=500&q=80',
    hoodie: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=400&h=500&q=80',
    shorts: 'https://images.unsplash.com/photo-1519455953755-af066f52f1a3?auto=format&fit=crop&w=400&h=500&q=80',
    jeans: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&h=500&q=80',
  },
};

const PLACEHOLDER_PATTERNS = [
  'placeholder',
  'via.placeholder',
  'placehold.co',
  'placehold.it',
  'placeimg',
  'dummyimage',
  'no-image',
  'no_image',
  'default-image',
  'imgur.com/default',
];

export function isPlaceholderImage(url) {
  if (!url) return true;
  const lowerUrl = String(url).toLowerCase();
  return PLACEHOLDER_PATTERNS.some((pattern) => lowerUrl.includes(pattern));
}

function inferCategory(category = '', productName = '', subCategory = '') {
  const categoryValue = String(category || '').trim().toLowerCase();
  if (categoryValue) {
    const directMatch = Object.keys(CATEGORY_IMAGE_MAP).find(
      (key) => key.toLowerCase() === categoryValue,
    );
    if (directMatch) return directMatch;
  }

  const searchText = `${productName || ''} ${subCategory || ''}`.toLowerCase();
  if (searchText.includes('kids') || searchText.includes("kid") || searchText.includes('girls') || searchText.includes('boys')) {
    return 'Kids';
  }
  if (searchText.includes('men') || searchText.includes('gent') || searchText.includes('formal shirt') || searchText.includes('chinos') || searchText.includes('trousers')) {
    return 'Men';
  }
  if (searchText.includes('women') || searchText.includes('ladies') || searchText.includes('dress') || searchText.includes('saree') || searchText.includes('lehenga') || searchText.includes('kurti') || searchText.includes('ethnic')) {
    return 'Women';
  }

  return 'Women';
}

function getMappedImage(category = 'Women', productName = '', subCategory = '') {
  const normalizedCategory = inferCategory(category, productName, subCategory);
  const imageMap = CATEGORY_IMAGE_MAP[normalizedCategory];
  const searchText = `${productName || ''} ${subCategory || ''}`.toLowerCase();

  const matchKeys = Object.keys(imageMap)
    .filter((key) => key !== 'default')
    .sort((a, b) => b.length - a.length);

  for (const key of matchKeys) {
    if (searchText.includes(key.toLowerCase())) {
      return imageMap[key];
    }
  }

  return imageMap.default;
}

export function getProductImage(product = {}) {
  if (!product) return CATEGORY_IMAGE_MAP.Women.default;

  const mainImage = product.mainImage || '';
  if (mainImage && !isPlaceholderImage(mainImage)) {
    return mainImage;
  }

  const fallbackImage = product.image || '';
  if (fallbackImage && !isPlaceholderImage(fallbackImage)) {
    return fallbackImage;
  }

  const images = Array.isArray(product.images) ? product.images : [];
  if (images.length > 0) {
    const first = images[0];
    if (typeof first === 'string' && first && !isPlaceholderImage(first)) {
      return first;
    }
    if (first && typeof first === 'object') {
      const url = first.url || first.path || first.location || first.image;
      if (url && !isPlaceholderImage(url)) {
        return url;
      }
    }
  }

  return getMappedImage(product.category, product.name, product.subCategory);
}
