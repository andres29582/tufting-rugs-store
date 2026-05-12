import type { CSSProperties } from 'react';
import type { Product } from '../../../../shared/types';

type RugStyle = CSSProperties & {
  '--rug-a': string;
  '--rug-b': string;
  '--rug-c': string;
};

function escapeAttr(value: string): string {
  return String(value).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function getSvg(rug: Product): string {
  const id = rug.slug.replace(/[^a-z0-9-]/g, '') || 'rug';
  const c1 = rug.colors[0];
  const c2 = rug.colors[1];
  const c3 = rug.colors[2];
  const c4 = rug.colors[3] || '#f8eee0';
  const clipId = 'rug-clip-' + id;
  const label = escapeAttr(rug.name);

  if (rug.motif === 'geometric') {
    return [
      '<svg class="rug-svg rug-svg-geometric" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
      '<defs><clipPath id="' + clipId + '"><path d="M110 96h500c28 0 50 22 50 50v286c0 28-22 50-50 50H110c-28 0-50-22-50-50V146c0-28 22-50 50-50Z"/></clipPath></defs>',
      '<g clip-path="url(#' + clipId + ')">',
      '<rect width="720" height="560" fill="' + c4 + '"/>',
      '<path d="M60 96h260L176 286 60 225Z" fill="' + c2 + '"/>',
      '<path d="M320 96h340v142L492 284Z" fill="' + c1 + '"/>',
      '<path d="M176 286 320 96l172 188-146 198H60V378Z" fill="#9b3f32"/>',
      '<path d="M492 284 660 238v244H346Z" fill="#244f63"/>',
      '<path d="M258 208 432 208 346 326Z" fill="#f7ead4"/>',
      '<path d="M60 392 176 286l170 196H60Z" fill="#e2bd82"/>',
      '</g>',
      '<path class="rug-outline" d="M110 96h500c28 0 50 22 50 50v286c0 28-22 50-50 50H110c-28 0-50-22-50-50V146c0-28 22-50 50-50Z"/>',
      '</svg>'
    ].join('');
  }

  if (rug.motif === 'organic') {
    return [
      '<svg class="rug-svg rug-svg-organic" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
      '<defs><clipPath id="' + clipId + '"><path d="M118 72c126-18 366-20 490 38 48 23 58 86 31 125-30 43-20 98 6 142 29 49-1 105-56 116-130 26-369 24-486-10-55-16-73-76-44-124 27-45 31-85 2-130-34-54 0-145 57-157Z"/></clipPath></defs>',
      '<g clip-path="url(#' + clipId + ')">',
      '<rect width="720" height="560" fill="' + c3 + '"/>',
      '<path d="M77 128c105 25 147 103 129 187-18 82 31 143 128 183H65Z" fill="' + c1 + '"/>',
      '<path d="M245 76c-70 94-62 170 25 228 88 58 98 121 30 188h171c46-86 23-156-70-210-92-54-98-122-17-204Z" fill="#f4eadb"/>',
      '<path d="M430 80c30 73 93 108 190 105v315H431c74-76 91-144 50-204-41-60-26-132 45-216Z" fill="' + c2 + '"/>',
      '<path d="M188 112c-54 71-42 135 35 192 78 58 83 119 14 184" fill="none" stroke="#f7f1e8" stroke-width="36" stroke-linecap="round"/>',
      '<circle cx="562" cy="330" r="86" fill="#6c7d43" opacity=".95"/>',
      '</g>',
      '<path class="rug-outline" d="M118 72c126-18 366-20 490 38 48 23 58 86 31 125-30 43-20 98 6 142 29 49-1 105-56 116-130 26-369 24-486-10-55-16-73-76-44-124 27-45 31-85 2-130-34-54 0-145 57-157Z"/>',
      '</svg>'
    ].join('');
  }

  if (rug.motif === 'circles') {
    return [
      '<svg class="rug-svg rug-svg-circles" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
      '<defs><clipPath id="' + clipId + '"><path d="M360 502c-145 0-263-94-263-210S215 82 360 82s263 94 263 210-118 210-263 210Z"/></clipPath></defs>',
      '<g clip-path="url(#' + clipId + ')">',
      '<rect width="720" height="560" fill="#ead7bf"/>',
      '<circle cx="242" cy="318" r="144" fill="' + c1 + '"/>',
      '<circle cx="474" cy="248" r="176" fill="' + c3 + '"/>',
      '<circle cx="386" cy="210" r="78" fill="' + c2 + '"/>',
      '<circle cx="406" cy="236" r="38" fill="#9a632b"/>',
      '<path d="M146 432c86-72 164-74 234-7 58 55 124 50 197-14v126H146Z" fill="#eeb2a0"/>',
      '<path d="M102 189c55 26 104 23 148-11 50-39 95-37 133 6" fill="none" stroke="#f7eddf" stroke-width="42" stroke-linecap="round"/>',
      '</g>',
      '<path class="rug-outline" d="M360 502c-145 0-263-94-263-210S215 82 360 82s263 94 263 210-118 210-263 210Z"/>',
      '</svg>'
    ].join('');
  }

  if (rug.motif === 'arches') {
    return [
      '<svg class="rug-svg rug-svg-arches" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
      '<defs><clipPath id="' + clipId + '"><path d="M128 64h464c30 0 54 24 54 54v324c0 30-24 54-54 54H128c-30 0-54-24-54-54V118c0-30 24-54 54-54Z"/></clipPath></defs>',
      '<g clip-path="url(#' + clipId + ')">',
      '<rect width="720" height="560" fill="' + c2 + '"/>',
      '<path d="M152 476V213c0-82 66-148 148-148s148 66 148 148v263h-44V214c0-58-47-105-105-105s-105 47-105 105v262Z" fill="' + c1 + '"/>',
      '<path d="M238 476V234c0-35 28-63 63-63s63 28 63 63v242h-41V234c0-12-10-22-22-22s-22 10-22 22v242Z" fill="' + c2 + '"/>',
      '<circle cx="547" cy="146" r="42" fill="' + c3 + '"/>',
      '<circle cx="564" cy="338" r="46" fill="#c47738"/>',
      '<path d="M100 406h385" stroke="' + c1 + '" stroke-width="28" stroke-linecap="round"/>',
      '</g>',
      '<path class="rug-outline" d="M128 64h464c30 0 54 24 54 54v324c0 30-24 54-54 54H128c-30 0-54-24-54-54V118c0-30 24-54 54-54Z"/>',
      '</svg>'
    ].join('');
  }

  if (rug.motif === 'soft') {
    return [
      '<svg class="rug-svg rug-svg-soft" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
      '<defs><clipPath id="' + clipId + '"><path d="M124 136c78-79 229-87 341-61 105 24 195 94 186 202-9 109-118 177-244 194-130 18-279-20-338-107-51-76-16-158 55-228Z"/></clipPath></defs>',
      '<g clip-path="url(#' + clipId + ')">',
      '<rect width="720" height="560" fill="' + c2 + '"/>',
      '<path d="M70 162c104-26 188 0 252 77 79 96 176 101 292 16v260H70Z" fill="' + c1 + '"/>',
      '<path d="M146 83c84 95 92 178 24 248-40 42-52 91-34 147H51V83Z" fill="#f3eee6"/>',
      '<path d="M420 71c-58 77-50 147 26 210 75 63 90 132 44 207h180V71Z" fill="' + c3 + '"/>',
      '<path d="M222 393c68-51 142-47 222 12" fill="none" stroke="#f5e3d5" stroke-width="52" stroke-linecap="round"/>',
      '</g>',
      '<path class="rug-outline" d="M124 136c78-79 229-87 341-61 105 24 195 94 186 202-9 109-118 177-244 194-130 18-279-20-338-107-51-76-16-158 55-228Z"/>',
      '</svg>'
    ].join('');
  }

  return [
    '<svg class="rug-svg rug-svg-waves" viewBox="0 0 720 560" role="img" aria-label="' + label + '">',
    '<defs><clipPath id="' + clipId + '"><path d="M121 143c97-95 278-92 413-35 90 38 147 107 128 189-20 85-110 148-212 176-124 34-275 20-360-47-82-65-52-205 31-283Z"/></clipPath></defs>',
    '<g clip-path="url(#' + clipId + ')">',
    '<rect width="720" height="560" fill="' + c1 + '"/>',
    '<path d="M64 103c87 30 137 83 151 160 17 95 76 155 177 180l-108 90C179 493 118 424 101 326 84 231 29 168-64 138Z" fill="#f2d1bd"/>',
    '<path d="M186 53c92 57 130 128 116 211-17 102 32 170 146 204l-95 98c-115-44-169-119-161-225 7-96-33-164-119-205Z" fill="#51318a"/>',
    '<path d="M305 64c105 47 152 113 140 199-13 91 31 153 131 186l-77 83c-119-45-170-120-152-225 15-88-32-146-139-174Z" fill="' + c1 + '"/>',
    '<path d="M470 55c-66 90-66 164 2 221 67 56 65 130-7 223l166 8c77-94 78-172 4-235-73-63-70-135 9-217Z" fill="' + c2 + '"/>',
    '<path d="M242 346c30-63 76-79 139-49 58 28 84 9 77-56 73 67 68 140-14 219-80 4-147-34-202-114Z" fill="' + c3 + '"/>',
    '<path d="M63 434c85-32 149-16 193 49H63Z" fill="#eeb1c4"/>',
    '<path d="M535 109c31 62 83 93 155 93v-93Z" fill="#f2d1bd"/>',
    '</g>',
    '<path class="rug-outline" d="M121 143c97-95 278-92 413-35 90 38 147 107 128 189-20 85-110 148-212 176-124 34-275 20-360-47-82-65-52-205 31-283Z"/>',
    '</svg>'
  ].join('');
}

export function RugVisualMockup({ rug }: { rug: Product }) {
  const style: RugStyle = {
    '--rug-a': rug.colors[0],
    '--rug-b': rug.colors[1],
    '--rug-c': rug.colors[2]
  };

  return (
    <div className="rug-visual-shell" style={style}>
      <div className="rug-glow" aria-hidden="true" />
      <div className="rug-shadow" aria-hidden="true" />
      {rug.imageUrl ? (
        <img className="rug-image" src={rug.imageUrl} alt={rug.name} loading="lazy" />
      ) : (
        <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: getSvg(rug) }} />
      )}
    </div>
  );
}
