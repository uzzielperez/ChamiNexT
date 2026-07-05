import React from 'react';
import HubCatalogCard from '../hub/HubCatalogCard';
import type { Product } from '../../data/products';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

/** @deprecated Prefer HubCatalogCard — kept for imports */
const ProductCard: React.FC<ProductCardProps> = ({ product, featured }) => (
  <HubCatalogCard item={product} kind="product" featured={featured} />
);

export default ProductCard;
