'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/icons/Logo';
import SignOutButton from './SignOutButton';

import s from './Navbar.module.css';

interface Props {
  user: any;
}

export default async function Navbar({user}: Props) {
  const pathName = usePathname();
  if (pathName === '/bot/bot-chat') {
    return (<></>)
  }

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/" className={s.link}>
                Pricing
              </Link>
              {user && (
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              )}
              {user && (
                <Link href="/bot" className={s.link} prefetch={false}>
                  myBot
                </Link>
              )}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              <SignOutButton />
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
