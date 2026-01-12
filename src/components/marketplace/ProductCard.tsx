import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ExternalLink, Star, Lock } from 'lucide-react';
import Button from '../common/Button';
import { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const categoryColors = {
    'health-tech': 'text-green-400 bg-green-400/10 border-green-400/20',
    'wellness': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'crm': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'development': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'ai': 'text-red-400 bg-red-400/10 border-red-400/20'
  };

  const categoryColor = categoryColors[product.category] || categoryColors['development'];

  // Map product URLs to routes
  const getProductRoute = (url: string): string | null => {
    if (url.startsWith('http')) return null; // External link
    if (url === '#crm') return '/products/crm';
    if (url === '#polaris') return '/products/polaris';
    return null;
  };

  const handleClick = () => {
    const route = getProductRoute(product.url);
    if (route) {
      navigate(route);
    } else if (product.url.startsWith('http')) {
      window.open(product.url, '_blank');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col border border-gray-700 hover:border-gold-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <ShoppingBag className="w-8 h-8 mr-3 text-gold-400" />
          <div>
            <h3 className="text-xl font-bold text-white">{product.name}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${categoryColor} mt-1`}>
              {product.category.replace('-', ' ')}
            </div>
          </div>
        </div>
        
        {product.isPremium && (
          <div className="flex items-center space-x-1">
            <Lock className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-gold-400 font-medium">PREMIUM</span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-4 flex-grow">{product.description}</p>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {product.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="text-xs text-gray-400 flex items-center">
                <Star className="w-3 h-3 mr-2 text-gold-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
            {product.features.length > 3 && (
              <li className="text-xs text-gray-500">
                +{product.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Price and Action */}
      <div className="mt-auto">
        {product.price && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-gold-400">${product.price}</span>
            <span className="text-sm text-gray-400">one-time</span>
          </div>
        )}
        
        <Button
          onClick={handleClick}
          fullWidth
          className={product.isPremium ? 'bg-gold-600 hover:bg-gold-700' : ''}
        >
          {product.url.startsWith('http') ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Product
            </>
          ) : getProductRoute(product.url) ? (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Sample
            </>
          ) : (
            'Coming Soon'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
