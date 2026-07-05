import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ExternalLink, Star, Lock, BookOpen, Clock, TrendingUp } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import type { Product, Course } from '../../data/products';

type CatalogItem = (Product | Course) & { kind: 'product' | 'course' };

interface HubCatalogCardProps {
  item: Product | Course;
  kind: 'product' | 'course';
  featured?: boolean;
}

function getProductRoute(url: string): string | null {
  if (url.startsWith('http')) return null;
  const map: Record<string, string> = {
    '#crm': '/products/crm',
    '#polaris': '/products/polaris',
    '#kapwa-response': '/products/kapwa-response',
    '#eventhub': '/products/eventhub',
    '#alfred': '/products/alfred',
    '#ai-startup-template': '/products/ai-startup-template',
  };
  return map[url] ?? null;
}

function getCourseRoute(url: string): string | null {
  if (url.startsWith('http')) return null;
  const map: Record<string, string> = {
    '#vibe-coding-course': '/courses/vibe-coding',
    '#rags-course': '/courses/building-rags',
    '#ai-agents-course': '/courses/ai-agents',
    '#fullstack-ai-course': '/courses/fullstack-ai',
  };
  return map[url] ?? null;
}

const levelBadge = (level: Course['level']) => {
  if (level === 'beginner') return 'hub-badge hub-badge-green';
  if (level === 'advanced') return 'hub-badge hub-badge-amber';
  return 'hub-badge hub-badge-blue';
};

const HubCatalogCard: React.FC<HubCatalogCardProps> = ({ item, kind, featured }) => {
  const navigate = useNavigate();
  const isProduct = kind === 'product';
  const product = isProduct ? (item as Product) : null;
  const course = !isProduct ? (item as Course) : null;
  const route = isProduct ? getProductRoute(item.url) : getCourseRoute(item.url);
  const external = item.url.startsWith('http');

  const handleClick = () => {
    if (route) navigate(route);
    else if (external) window.open(item.url, '_blank');
  };

  const priceLabel = () => {
    if (item.price === undefined) return null;
    if (item.price === 0) return 'Free';
    return `€${item.price}`;
  };

  return (
    <article className={`hub-catalog-card${featured ? ' is-featured' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="hub-icon-tile">
            {isProduct ? <ShoppingBag className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-text-primary text-base leading-snug">{item.name}</h3>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {product && (
                <span className="hub-badge hub-badge-blue">{product.category.replace('-', ' ')}</span>
              )}
              {course && (
                <>
                  <span className={levelBadge(course.level)}>
                    <TrendingUp className="w-3 h-3 inline mr-0.5" aria-hidden />
                    {course.level}
                  </span>
                  {course.duration && (
                    <span className="hub-badge hub-badge-muted">
                      <Clock className="w-3 h-3 inline mr-0.5" aria-hidden />
                      {course.duration}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        {item.isPremium && (
          <span className="hub-badge hub-badge-amber shrink-0">
            <Lock className="w-3 h-3 inline mr-0.5" aria-hidden />
            Pro
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary flex-grow mb-4 line-clamp-3">{item.description}</p>

      {item.features.length > 0 && (
        <ul className="space-y-1.5 mb-4">
          {item.features.slice(0, 3).map((f) => (
            <li key={f} className="text-xs text-text-secondary flex items-start gap-2">
              <Star className="w-3 h-3 text-accent-bright shrink-0 mt-0.5" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-3">
        {priceLabel() && (
          <div>
            <span className="text-lg font-bold text-text-primary">{priceLabel()}</span>
            {item.price !== 0 && (
              <span className="text-xs text-text-secondary ml-1">
                {isProduct ? 'once' : 'lifetime'}
              </span>
            )}
          </div>
        )}
        <PremiumButton variant={featured ? 'primary' : 'outline'} size="sm" onClick={handleClick}>
          {external ? (
            <>
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit
            </>
          ) : route ? (
            isProduct ? 'View sample' : 'Start course'
          ) : (
            'Soon'
          )}
        </PremiumButton>
      </div>
    </article>
  );
};

export default HubCatalogCard;
