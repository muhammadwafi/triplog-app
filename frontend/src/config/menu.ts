import type { NavItem } from '@/types';
import { CircleHelpIcon, MapPinIcon } from 'lucide-react';

export const mainMenu: NavItem[] = [
  {
    title: 'Trip',
    href: '/trip',
    icon: MapPinIcon,
  },
  {
    title: 'About',
    href: '/about',
    icon: CircleHelpIcon,
  },
];
