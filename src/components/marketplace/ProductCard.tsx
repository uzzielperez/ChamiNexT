import React from 'react';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

interface Product {
  name: string;
  description: string;
  url: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
      <div className="flex items-center mb-4">
        <ShoppingBag className="w-8 h-8 mr-4 text-gold-400" />
        <h3 className="text-xl font-bold">{product.name}</h3>
      </div>
      <p className="text-gray-400 mb-4">{product.description}</p>
      <div className="mt-auto">
        <Button
          onClick={() => window.open(product.url, '_blank')}
          fullWidth
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          View Product
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
