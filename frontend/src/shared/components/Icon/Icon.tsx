import { createElement } from 'react';

type IconShape = {
  tag?: 'path' | 'circle';
  d?: string;
  cx?: string;
  cy?: string;
  r?: string;
};

type IconDefinition = {
  viewBox?: string;
  shapes: IconShape[];
};

export type IconName =
  | 'menu'
  | 'search'
  | 'close'
  | 'arrowRight'
  | 'favorite'
  | 'shoppingBag'
  | 'shoppingCart'
  | 'sparkles'
  | 'tuftMark';

const iconDefinitions: Record<IconName, IconDefinition> = {
  menu: {
    shapes: [{ d: 'M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z' }]
  },
  search: {
    shapes: [
      { d: 'M10.7 18.4a7.7 7.7 0 1 1 0-15.4 7.7 7.7 0 0 1 0 15.4Zm0-2a5.7 5.7 0 1 0 0-11.4 5.7 5.7 0 0 0 0 11.4Z' },
      { d: 'm16.4 16.1 4.2 4.2-1.5 1.4-4.2-4.2z' }
    ]
  },
  close: {
    shapes: [
      { d: 'm6.4 5 12.6 12.6-1.4 1.4L5 6.4z' },
      { d: 'M5 17.6 17.6 5l1.4 1.4L6.4 19z' }
    ]
  },
  arrowRight: {
    shapes: [{ d: 'M5 11h10.8l-4.4-4.4L13 5l7 7-7 7-1.6-1.6 4.4-4.4H5v-2Z' }]
  },
  favorite: {
    shapes: [
      {
        d: 'M12 20.5 10.7 19C5.6 14.4 2 11.1 2 7.1A5.1 5.1 0 0 1 7.2 2c2 0 3.7 1 4.8 2.5A5.8 5.8 0 0 1 16.8 2 5.1 5.1 0 0 1 22 7.1c0 4-3.6 7.3-8.7 11.9L12 20.5Zm0-3.1.2-.2c4.6-4.1 7.8-7 7.8-10.1A3.1 3.1 0 0 0 16.8 4c-1.7 0-3.3 1.1-3.9 2.7h-1.8A4.2 4.2 0 0 0 7.2 4 3.1 3.1 0 0 0 4 7.1c0 3.1 3.2 6 7.8 10.1l.2.2Z'
      }
    ]
  },
  shoppingBag: {
    shapes: [
      {
        d: 'M7 8V7a5 5 0 0 1 10 0v1h3l1 13H3L4 8h3Zm2 0h6V7a3 3 0 0 0-6 0v1Zm-3.1 2-.7 9h13.6l-.7-9H17v3h-2v-3H9v3H7v-3H5.9Z'
      }
    ]
  },
  shoppingCart: {
    shapes: [
      { d: 'M6 6h15l-2 8H8L6 6Zm0 0-.7-3H3v2h.7l3 13H19v-2H8.3l-.5-2H19l2.7-10H5.6Z' },
      { tag: 'circle', cx: '9', cy: '21', r: '1.7' },
      { tag: 'circle', cx: '18', cy: '21', r: '1.7' }
    ]
  },
  sparkles: {
    shapes: [
      { d: 'm5 19 9.5-9.5' },
      { d: 'm14 4 6 6' },
      { d: 'm12.5 5.5 6 6' },
      { d: 'M5 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z' },
      { d: 'M18 15l.8 1.5 1.7.8-1.7.8L18 21l-.8-1.9-1.7-.8 1.7-.8L18 15Z' }
    ]
  },
  tuftMark: {
    viewBox: '0 0 36 36',
    shapes: [
      { tag: 'circle', cx: '18', cy: '18', r: '15' },
      {
        d: 'M11 23.5c4.3-8.6 9.6-13 15.8-13.1M11.5 12.5c3 1.6 4.9 4 5.6 7.1m4.3-2.3c2.9 1.2 4.7 3.2 5.5 6'
      }
    ]
  }
};

type IconProps = {
  name: IconName;
  className?: string | undefined;
  label?: string | undefined;
};

export function Icon({ name, className, label }: IconProps) {
  const definition = iconDefinitions[name];

  return (
    <svg
      viewBox={definition.viewBox || '0 0 24 24'}
      focusable="false"
      className={['ui-icon', className].filter(Boolean).join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {definition.shapes.map((shape, index) =>
        createElement(shape.tag || 'path', {
          key: index,
          ...shape,
          tag: undefined
        })
      )}
    </svg>
  );
}
