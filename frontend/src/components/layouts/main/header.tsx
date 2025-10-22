import { AppLogo } from '@/components/app-logo';
import { RoundedElement } from '@/components/rounded-element';
import { Link } from 'react-router';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header className="dark:bg-background/70 fixed inset-x-4 top-0 z-50 mx-auto flex min-h-12 max-w-md justify-between rounded-b-xl bg-neutral-900/80 px-2 shadow-lg ring-1 ring-neutral-500/20 backdrop-blur-md dark:ring-white/15">
      <Link
        to={'/'}
        className="relative flex h-12 items-center gap-1 p-2 leading-tight font-bold text-white"
      >
        <AppLogo className="text-primary size-5" />
        TripLog
      </Link>
      <Navbar />
      <RoundedElement
        className="absolute top-0 -right-5 w-5 text-neutral-900/78 backdrop-blur-md"
        pathClassName="stroke-neutral-500/20 dark:stroke-white/20"
      />
      <RoundedElement
        className="absolute top-0 -left-5 w-5 rotate-90 text-neutral-900/78 backdrop-blur-md"
        pathClassName="stroke-neutral-500/20 dark:stroke-white/20"
      />
    </header>
  );
}
