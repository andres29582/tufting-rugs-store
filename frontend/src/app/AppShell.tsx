import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header, type HeaderToolsControls } from '../components/Header';

type AppShellProps = {
  children: ReactNode;
  mainClassName?: string;
  renderHeaderTools?: (controls: HeaderToolsControls) => ReactNode;
};

export function AppShell({ children, mainClassName, renderHeaderTools }: AppShellProps) {
  return (
    <>
      <Header renderTools={renderHeaderTools} />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
