import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../Icon/Icon';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'dark';

const variantAliases: Record<string, 'primary' | 'secondary' | 'ghost'> = {
  dark: 'secondary',
  light: 'primary'
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({ variant, className, children, ...props }: ButtonProps) {
  const normalizedVariant = getVariant(variant);

  return (
    <button className={getClassName('button', 'button-' + normalizedVariant, className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string | undefined;
  variant?: ButtonVariant;
  children: ReactNode;
};

export function ButtonLink({ to, href, variant, className, children, ...props }: ButtonLinkProps) {
  const normalizedVariant = getVariant(variant);
  const linkClassName = getClassName('button', 'button-' + normalizedVariant, className);

  if (to) {
    return (
      <Link className={linkClassName} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={linkClassName} href={href || '#'} {...props}>
      {children}
    </a>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label?: string | undefined;
  iconClassName?: string | undefined;
};

export function IconButton({
  icon,
  label,
  'aria-label': ariaLabel,
  iconClassName,
  className,
  children,
  ...props
}: IconButtonProps) {
  const accessibleLabel = ariaLabel || label;

  if (!accessibleLabel) {
    throw new Error('IconButton requires an aria-label or visible label.');
  }

  return (
    <button className={getClassName('icon-button', className)} aria-label={ariaLabel} {...props}>
      <Icon name={icon} className={iconClassName} />
      {!ariaLabel && label ? <span className="sr-only">{label}</span> : null}
      {children}
    </button>
  );
}

type IconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string | undefined;
  icon: IconName;
  label?: string | undefined;
  iconClassName?: string | undefined;
};

export function IconLink({
  to,
  href,
  icon,
  label,
  'aria-label': ariaLabel,
  iconClassName,
  className,
  children,
  ...props
}: IconLinkProps) {
  const accessibleLabel = ariaLabel || label;

  if (!accessibleLabel) {
    throw new Error('IconLink requires an aria-label or visible label.');
  }

  const content = (
    <>
      <Icon name={icon} className={iconClassName} />
      {!ariaLabel && label ? <span className="sr-only">{label}</span> : null}
      {children}
    </>
  );

  if (to) {
    return (
      <Link className={getClassName('icon-button', className)} to={to} aria-label={ariaLabel} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <a className={getClassName('icon-button', className)} href={href || '#'} aria-label={ariaLabel} {...props}>
      {content}
    </a>
  );
}

function getVariant(variant: ButtonVariant | undefined): 'primary' | 'secondary' | 'ghost' {
  const normalizedVariant = variant ? variantAliases[variant] || variant : 'primary';

  if (
    normalizedVariant === 'primary' ||
    normalizedVariant === 'secondary' ||
    normalizedVariant === 'ghost'
  ) {
    return normalizedVariant;
  }

  return 'primary';
}

function getClassName(...classNames: Array<string | undefined>): string {
  return classNames.filter(Boolean).join(' ');
}
