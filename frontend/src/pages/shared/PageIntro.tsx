import { ButtonLink } from '../../shared/components/Button/Button';

type PageAction = {
  to?: string;
  href?: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'light' | 'dark';
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

type PageIntroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  actions?: PageAction[];
};

export function PageIntro({ eyebrow, title, copy, actions = [] }: PageIntroProps) {
  return (
    <section className="page-section page-intro-section">
      <div className="page-panel glass-panel">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        {actions.length ? (
          <div className="page-actions">
            {actions.map((action) => (
              <ButtonLink
                key={action.label}
                to={action.to}
                href={action.href}
                variant={action.variant || 'ghost'}
                target={action.target}
                rel={action.rel}
                aria-label={action.ariaLabel}
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
