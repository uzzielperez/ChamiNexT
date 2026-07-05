import React from 'react';
import HubCatalogCard from '../hub/HubCatalogCard';
import type { Course } from '../../data/products';

interface CourseCardProps {
  course: Course;
  featured?: boolean;
}

/** @deprecated Prefer HubCatalogCard — kept for imports */
const CourseCard: React.FC<CourseCardProps> = ({ course, featured }) => (
  <HubCatalogCard item={course} kind="course" featured={featured} />
);

export default CourseCard;
