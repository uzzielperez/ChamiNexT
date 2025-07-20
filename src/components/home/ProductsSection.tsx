import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  sales: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  category,
  image,
  author,
  rating,
  sales,
}) => (
  <Card className="h-full transition-all duration-300 hover:border-purple-500/50" hoverable>
    <div className="relative overflow-hidden h-48">
      <img 
        src={image}
        alt={title}
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute top-4 left-4">
        <Badge variant="primary">{category}</Badge>
      </div>
    </div>
    <Card.Body>
      <div className="flex items-center gap-2 mb-3">
        <img 
          src={author.avatar}
          alt={author.name}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm text-gray-400">{author.name}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-400 mt-1 text-sm line-clamp-2">{description}</p>
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <div className="flex items-center mr-3">
            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
            <span className="text-sm text-gray-300">{rating}</span>
          </div>
          <span className="text-sm text-gray-400">{sales} sales</span>
        </div>
        <span className="font-semibold text-white">${price}</span>
      </div>
    </Card.Body>
    <Card.Footer className="flex justify-between items-center">
      <Button variant="outline" size="sm">
        <Eye size={16} className="mr-2" />
        Preview
      </Button>
      <Button variant="primary" size="sm">
        <ShoppingCart size={16} className="mr-2" />
        Add to Cart
      </Button>
    </Card.Footer>
  </Card>
);

const ProductsSection: React.FC = () => {
  const products = [
    {
      title: "React UI Component Library",
      description: "A comprehensive library of customizable UI components built with React and Tailwind CSS.",
      price: 49,
      category: "UI Kit",
      image: "https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: {
        name: "Alex Morgan",
        avatar: "https://via.placeholder.com/40"
      },
      rating: 4.8,
      sales: 1234
    },
    {
      title: "DevOps Automation Scripts",
      description: "A collection of scripts to automate CI/CD pipelines, infrastructure setup, and more.",
      price: 79,
      category: "DevOps",
      image: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: {
        name: "Samantha Lee",
        avatar: "https://via.placeholder.com/40"
      },
      rating: 4.7,
      sales: 876
    },
    {
      title: "Full-Stack E-commerce Template",
      description: "Ready-to-use e-commerce template with Next.js, Stripe integration, and admin dashboard.",
      price: 129,
      category: "Template",
      image: "https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: {
        name: "David Chen",
        avatar: "https://via.placeholder.com/40"
      },
      rating: 4.9,
      sales: 1543
    }
  ];

  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Top-selling digital products
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Premium code, templates, and tools created by expert developers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg">
            Browse Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;