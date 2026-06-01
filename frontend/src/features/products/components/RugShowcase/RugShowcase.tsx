import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';
import { formatPrice } from '../../../../utils/money';
import { localizeProduct } from '../../model/productLocalization';
import { RugGlassInfoCard } from '../RugGlassInfoCard/RugGlassInfoCard';
import { RugVisualMockup } from '../RugVisualMockup/RugVisualMockup';

type RugVars = CSSProperties & {
  '--rug-a': string;
  '--rug-b': string;
  '--rug-c': string;
  '--rug-deep': string;
};

type RugShowcaseProps = {
  rug: Product;
  hero?: boolean;
  index?: number;
  onAction?: () => void;
};

type RugShowcaseCarouselProps = {
  rugs: Product[];
  onAction?: (() => void) | undefined;
};

export function applyShowcaseTheme(rug: Product): void {
  const documentRoot = document.documentElement;
  documentRoot.style.setProperty('--active-a', rug.colors[0]);
  documentRoot.style.setProperty('--active-b', rug.colors[1]);
  documentRoot.style.setProperty('--active-c', rug.colors[2]);
}

export function RugShowcase({ rug, hero = false, index = 0, onAction }: RugShowcaseProps) {
  const { language } = useTranslation();
  const displayRug = localizeProduct(rug, language);
  const sectionStyle: RugVars = {
    '--rug-a': rug.colors[0],
    '--rug-b': rug.colors[1],
    '--rug-c': rug.colors[2],
    '--rug-deep': rug.colors[0]
  };
  const innerClassName =
    index % 2 === 1 && !hero ? 'showcase-inner showcase-inner-reverse' : 'showcase-inner';

  return (
    <section
      className="showcase-section snap-section"
      id={hero ? 'inicio' : rug.slug}
      data-rug-slug={rug.slug}
      data-rug-colors={rug.colors.join(',')}
      aria-labelledby={'showcase-title-' + rug.slug}
      style={sectionStyle}
    >
      <div className={innerClassName}>
        <RugGlassInfoCard rug={rug} hero={hero} onAction={onAction} />
        <div className="showcase-visual">
          <RugVisualMockup rug={displayRug} />
          <FloatingSpec rug={rug} />
        </div>
      </div>
      {hero ? <ScrollHint /> : null}
    </section>
  );
}

export function RugShowcaseCarousel({ rugs, onAction }: RugShowcaseCarouselProps) {
  const { language, t } = useTranslation();
  const showcaseItems = rugs.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const firstRug = showcaseItems[0];
  const activeRug = showcaseItems[activeIndex] || firstRug;

  useEffect(() => {
    if (activeIndex < showcaseItems.length) {
      return;
    }

    setActiveIndex(0);
  }, [activeIndex, showcaseItems.length]);

  useEffect(() => {
    if (!activeRug) {
      return;
    }

    applyShowcaseTheme(activeRug);
  }, [activeRug]);

  useEffect(() => {
    if (isPaused || showcaseItems.length < 2 || shouldReduceMotion()) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % showcaseItems.length);
    }, 5000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [isPaused, showcaseItems.length]);

  if (!activeRug) {
    return null;
  }

  const displayRug = localizeProduct(activeRug, language);
  const sectionStyle: RugVars = {
    '--rug-a': activeRug.colors[0],
    '--rug-b': activeRug.colors[1],
    '--rug-c': activeRug.colors[2],
    '--rug-deep': activeRug.colors[0]
  };

  return (
    <section
      className="showcase-flow"
      id="inicio"
      aria-label={t('product.featuredAria')}
      style={sectionStyle}
      onMouseEnter={() => {
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
      onFocus={() => {
        setIsPaused(true);
      }}
      onBlur={() => {
        setIsPaused(false);
      }}
    >
      <div className="showcase-flow__background" aria-hidden="true" />
      <div className="showcase-flow__content">
        <article className="showcase-flow__text-card" key={'copy-' + activeRug.id} aria-live="polite">
          <p className="eyebrow">{t('product.handmadeEyebrow', { category: displayRug.category })}</p>
          <h1 className="showcase-flow__title">{displayRug.name}</h1>
          <p className="showcase-flow__description">{displayRug.description}</p>
          <ul className="showcase-flow__features">
            {displayRug.features.slice(0, 4).map((feature) => (
              <li key={feature}>
                <span aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="showcase-flow__price-box">
            <span>{t('product.from')}</span>
            <strong>{formatPrice(activeRug.priceFrom)}</strong>
            <small>{displayRug.size}</small>
          </div>
          <div className="showcase-flow__actions">
            <ButtonLink to={'/producto/' + encodeURIComponent(activeRug.slug)} variant="secondary">
              {t('product.details')}
            </ButtonLink>
            {onAction ? (
              <button
                className="button button-light"
                type="button"
                data-action="customize"
                data-rug-slug={activeRug.slug}
                onClick={onAction}
              >
                {t('product.customize')}
              </button>
            ) : null}
          </div>
        </article>

        <div className="showcase-flow__rug-area" key={'visual-' + activeRug.id}>
          <RugVisualMockup rug={displayRug} />
        </div>

        <aside className="showcase-flow__info-card" key={'info-' + activeRug.id}>
          <div>
            <span>{t('product.design')}</span>
            <strong>{displayRug.name}</strong>
          </div>
          <div>
            <span>{t('product.size')}</span>
            <strong>{displayRug.size}</strong>
          </div>
          <div>
            <span>{t('product.colors')}</span>
            <div className="showcase-flow__colors" aria-label={t('product.colorsAria')}>
              {activeRug.colors.map((color) => (
                <i
                  style={{ '--swatch-color': color } as CSSProperties}
                  aria-label={color}
                  key={color}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className="showcase-flow__mobile-summary" key={'mobile-' + activeRug.id}>
          <div className="showcase-flow__mobile-price">
            <span>{t('product.from')}</span>
            <strong>{formatPrice(activeRug.priceFrom)}</strong>
            <small>{displayRug.size}</small>
          </div>
          <div className="showcase-flow__mobile-actions">
            <ButtonLink to={'/producto/' + encodeURIComponent(activeRug.slug)} variant="secondary">
              {t('product.details')}
            </ButtonLink>
            {onAction ? (
              <button
                className="button button-light"
                type="button"
                data-action="customize"
                data-rug-slug={activeRug.slug}
                onClick={onAction}
              >
                {t('product.customize')}
              </button>
            ) : null}
          </div>
          <div className="showcase-flow__mobile-details" aria-label={t('product.mobileDetailsAria')}>
            <div>
              <span>{t('product.design')}</span>
              <strong>{displayRug.name}</strong>
            </div>
            <div>
              <span>{t('product.size')}</span>
              <strong>{displayRug.size}</strong>
            </div>
            <div>
              <span>{t('product.colors')}</span>
              <div className="showcase-flow__colors" aria-label={t('product.colorsAria')}>
                {activeRug.colors.map((color) => (
                  <i
                    style={{ '--swatch-color': color } as CSSProperties}
                    aria-label={color}
                    key={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase-flow__pagination" aria-label={t('product.paginationAria')}>
        {showcaseItems.map((rug, index) => {
          const displayItem = localizeProduct(rug, language);

          return (
            <button
              className={
                index === activeIndex
                  ? 'showcase-flow__indicator is-active'
                  : 'showcase-flow__indicator'
              }
              type="button"
              aria-label={t('product.paginationItem', { index: index + 1, name: displayItem.name })}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => {
                setActiveIndex(index);
              }}
              key={rug.id}
            />
          );
        })}
      </div>
    </section>
  );
}

function FloatingSpec({ rug }: { rug: Product }) {
  const { language, t } = useTranslation();
  const displayRug = localizeProduct(rug, language);

  return (
    <aside className="floating-spec glass-panel" aria-label={t('product.quickSpec', { name: displayRug.name })}>
      <span>{t('product.design')}</span>
      <strong>{displayRug.name}</strong>
      <span>{t('product.size')}</span>
      <strong>{displayRug.size}</strong>
      <span>{t('product.category')}</span>
      <strong>{displayRug.category}</strong>
    </aside>
  );
}

function ScrollHint() {
  return (
    <div className="scroll-hint" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
