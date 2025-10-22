import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { motion } from 'motion/react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';

interface NavbarItemProps {
  item: NavItem;
  className?: string;
}

export const NavbarItem = ({ item, className, ...props }: NavbarItemProps) => {
  let location = useLocation();

  const [hoveredPath, setHoveredPath] = useState<string | null>(
    location.pathname,
  );

  return (
    <NavLink
      key={item.href}
      className={cn(
        'relative z-1 flex h-8 items-center rounded-md px-3 text-sm font-medium text-white/80 no-underline transition-transform duration-300 ease-in hover:text-white',
        {
          'text-white': location.pathname === item.href,
          'before:bg-primary before:absolute before:right-3 before:bottom-[-8px] before:left-3 before:h-0.5':
            location.pathname === item.href,
          'select-none after:pointer-events-none after:absolute after:-inset-x-6 after:-bottom-2 after:-z-[1] after:h-6 after:bg-radial-[at_50%_125%] after:from-orange-500/70 after:via-transparent after:to-transparent after:to-90%':
            location.pathname === item.href,
        },
        className,
      )}
      to={item.href}
      onMouseOver={() => setHoveredPath(item.href)}
      onMouseLeave={() => setHoveredPath(location.pathname)}
      {...props}
    >
      <span className="hidden sm:block">{item.title}</span>
      {item.icon && (
        <span className="block sm:hidden">
          <item.icon className="size-4.5" />
        </span>
      )}
      {item.href === hoveredPath && (
        <motion.div
          className="absolute bottom-0 left-0 -z-10 h-full rounded-lg bg-white/20 dark:bg-white/15"
          layoutId="navbar"
          aria-hidden="true"
          style={{
            width: '100%',
          }}
          transition={{
            type: 'tween',
            ease: 'easeOut',
            duration: 0.15,
          }}
        />
      )}
    </NavLink>
  );
};
