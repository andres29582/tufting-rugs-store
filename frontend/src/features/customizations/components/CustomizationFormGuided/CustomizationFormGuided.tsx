import type { Product } from '../../../../shared/types';
import { CustomizationForm } from '../CustomizationForm/CustomizationForm';

type CustomizationFormGuidedProps = {
  product: Product | null;
};

export function CustomizationFormGuided({ product }: CustomizationFormGuidedProps) {
  return <CustomizationForm product={product} />;
}
