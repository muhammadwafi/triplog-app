import { env } from '@/config/constants';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="text-muted-foreground mt-8 mb-10 text-center text-xs">
      &copy; {new Date().getFullYear()} {env.APP_NAME} by{' '}
      <Link to={'https://muhammadwafi.vercel.app'} target="_blank">
        Muhammad Wafi
      </Link>
    </footer>
  );
}
