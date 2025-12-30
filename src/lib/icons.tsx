import {
  type LucideIcon,
  UtensilsCrossed,
  Car,
  Home,
  Ticket,
  ShoppingCart,
  HeartPulse,
  Landmark,
  BookOpen,
  Briefcase,
  Gift,
  MoreHorizontal,
  Copy,
} from 'lucide-react';

export const categoryIcons: { [key: string]: LucideIcon } = {
  'Food & Dining': UtensilsCrossed,
  Transportation: Car,
  'Housing & Utilities': Home,
  Entertainment: Ticket,
  Shopping: ShoppingCart,
  'Health & Wellness': HeartPulse,
  'Bills & Fees': Landmark,
  Education: BookOpen,
  Work: Briefcase,
  Gifts: Gift,
  Other: MoreHorizontal,
};

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || MoreHorizontal;
};
