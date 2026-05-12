import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Product } from '../../../../shared/types';
import { ButtonLink, IconButton } from '../../../../shared/components/Button/Button';
import { formatPrice } from '../../../../utils/money';
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
          <RugVisualMockup rug={rug} />
          <FloatingSpec rug={rug} />
        </div>
      </div>
      {hero ? <ScrollHint /> : null}
    </section>
  );
}

export function RugShowcaseCarousel({ rugs, onAction }: RugShowcaseCarouselProps) {
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
      aria-label="Alfombras destacadas"
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
          <p className="eyebrow">{activeRug.category} · Tufting hecho a mano</p>
          <h1 className="showcase-flow__title">{activeRug.name}</h1>
          <p className="showcase-flow__description">{activeRug.description}</p>
          <ul className="showcase-flow__features">
            {activeRug.features.slice(0, 4).map((feature) => (
              <li key={feature}>
                <span aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="showcase-flow__price-box">
            <span>Desde</span>
            <strong>{formatPrice(activeRug.priceFrom)}</strong>
            <small>{activeRug.size}</small>
          </div>
          <div className="showcase-flow__actions">
            <ButtonLink to={'/producto/' + encodeURIComponent(activeRug.slug)} variant="secondary">
              Ver detalles
            </ButtonLink>
            <button
              className="button button-light"
              type="button"
              data-action="customize"
              data-rug-slug={activeRug.slug}
              onClick={onAction}
            >
              Personalizar
            </button>
          </div>
        </article>

        <div className="showcase-flow__rug-area" key={'visual-' + activeRug.id}>
          <RugVisualMockup rug={activeRug} />
        </div>

        <aside className="showcase-flow__info-card" key={'info-' + activeRug.id}>
          <IconButton
            icon="favorite"
            className="showcase-flow__favorite"
            type="button"
            aria-label={'Agregar ' + activeRug.name + ' a favoritos'}
          />
          <div>
            <span>Diseño</span>
            <strong>{activeRug.name}</strong>
          </div>
          <div>
            <span>Tamaño</span>
            <strong>{activeRug.size}</strong>
          </div>
          <div>
            <span>Colores</span>
            <div className="showcase-flow__colors" aria-label="Colores principales">
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
            <span>Desde</span>
            <strong>{formatPrice(activeRug.priceFrom)}</strong>
            <small>{activeRug.size}</small>
          </div>
          <div className="showcase-flow__mobile-actions">
            <ButtonLink to={'/producto/' + encodeURIComponent(activeRug.slug)} variant="secondary">
              Ver detalles
            </ButtonLink>
            <button
              className="button button-light"
              type="button"
              data-action="customize"
              data-rug-slug={activeRug.slug}
              onClick={onAction}
            >
              Personalizar
            </button>
          </div>
          <div className="showcase-flow__mobile-details" aria-label="Detalles de la alfombra destacada">
            <div>
              <span>Diseño</span>
              <strong>{activeRug.name}</strong>
            </div>
            <div>
              <span>Tamaño</span>
              <strong>{activeRug.size}</strong>
            </div>
            <div>
              <span>Colores</span>
              <div className="showcase-flow__colors" aria-label="Colores principales">
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

      <div className="showcase-flow__pagination" aria-label="Navegación del showcase">
        {showcaseItems.map((rug, index) => (
          <button
            className={
              index === activeIndex
                ? 'showcase-flow__indicator is-active'
                : 'showcase-flow__indicator'
            }
            type="button"
            aria-label={'Ver alfombra ' + (index + 1) + ': ' + rug.name}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => {
              setActiveIndex(index);
            }}
            key={rug.id}
          />
        ))}
      </div>
    </section>
  );
}

function FloatingSpec({ rug }: { rug: Product }) {
  return (
    <aside className="floating-spec glass-panel" aria-label={'Ficha rápida de ' + rug.name}>
      <span>Diseño</span>
      <strong>{rug.name}</strong>
      <span>Tamaño</span>
      <strong>{rug.size}</strong>
      <span>Categoría</span>
      <strong>{rug.category}</strong>
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
