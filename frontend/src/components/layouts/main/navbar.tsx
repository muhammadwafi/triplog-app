import { NavbarItem } from '@/components/layouts/main/navbar-item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { mainMenu } from '@/config/menu';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-provider';
import { Show } from '@/lib/conditional-rendering';
import { cn } from '@/lib/utils';
import {
  CircleUserRoundIcon,
  LogOutIcon,
  Moon,
  Sun,
  UserRoundIcon,
} from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router';

export function Navbar({ className, ...props }: React.ComponentProps<'nav'>) {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const menuList = React.useMemo(() => mainMenu, []);

  return (
    <nav
      className={cn(
        'flex min-h-12 max-w-[calc(1024px_-_2.5rem)] items-center gap-4',
      )}
      {...props}
    >
      <div className="flex items-center">
        {React.Children.toArray(
          menuList.map((item) => <NavbarItem item={item} key={item.title} />),
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="size-8 rounded-full p-0 text-white/80 hover:bg-white/20 hover:text-white"
          onClick={() =>
            theme === 'dark' ? setTheme('light') : setTheme('dark')
          }
        >
          <Sun className="size-4.5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4.5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>

        <Show>
          <Show.When condition={isLoading}>
            <Skeleton className="h-8 w-17 rounded-lg bg-white/20" />
          </Show.When>
          <Show.When condition={!isLoading && !isAuthenticated && !user}>
            <Button asChild size="sm" className="rounded-lg">
              <Link to={'/auth/login'}>Sign in</Link>
            </Button>
          </Show.When>
          <Show.When condition={isAuthenticated}>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Avatar className="size-8 cursor-pointer rounded-lg">
                  <AvatarFallback className="rounded-lg bg-linear-to-tr from-neutral-600 from-30% to-neutral-400 text-white hover:ring-1 hover:ring-white/20 hover:ring-inset">
                    {user?.username?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-popover/80 mt-2 -mr-2 grid w-45 rounded-xl border-neutral-500/20 bg-neutral-900/80 backdrop-blur-sm"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg text-white focus:bg-white/10 focus:text-white"
                  >
                    <Link to={'/profile'}>
                      <CircleUserRoundIcon className="size-4 text-white/80" />
                      <div>Profile</div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg text-white focus:bg-white/10 focus:text-white"
                  >
                    <Link to={'/account'}>
                      <UserRoundIcon className="size-4 text-white/80" />
                      <div>Account</div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/15" />
                <DropdownMenuItem
                  onClick={async () => await logout()}
                  className="rounded-lg text-white focus:bg-white/10 focus:text-white"
                >
                  <LogOutIcon className="size-4 text-white/80" />
                  <div>Logout</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Show.When>
        </Show>
      </div>
    </nav>
  );
}
