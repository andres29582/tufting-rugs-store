import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

type AppShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

export function AppShell({ children, mainClassName }: AppShellProps) {
  return (
    <>
      <Header />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
