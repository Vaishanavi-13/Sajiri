import { getProductImage } from './src/utils/productImages.js';

const samples = [
  { name: 'Classic White Cotton T-Shirt', category: 'Women', subCategory: 'Tops', mainImage: 'https://via.placeholder.com/400x400?text=White+T-Shirt+Women' },
  { name: 'Blue Denim Jeans', category: 'Women', subCategory: 'Bottoms', mainImage: '' },
  { name: 'Floral Summer Dress', category: 'Women', subCategory: 'Dresses' },
  { name: 'Classic Black T-Shirt', category: 'Men', subCategory: 'Tops' },
  { name: 'Gray Sports Shorts', category: 'Men', subCategory: 'Activewear' },
  { name: 'Pink Cute Dress', category: 'Kids', subCategory: 'Dresses' },
];

for (const product of samples) {
  console.log(product.name, '=>', getProductImage(product));
}
