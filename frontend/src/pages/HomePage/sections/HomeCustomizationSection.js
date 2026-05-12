import { renderCustomizationForm } from '../../../features/customizations/components/CustomizationForm/CustomizationForm.js';

export function renderHomeCustomizationSection(rugs) {
  return renderCustomizationForm({ product: getCustomProduct(rugs) });
}

function getCustomProduct(rugs) {
  return (
    rugs.find(function (rug) {
      return rug.category === 'Personalizadas';
    }) ||
    rugs.find(function (rug) {
      return rug.customizable;
    }) ||
    null
  );
}
