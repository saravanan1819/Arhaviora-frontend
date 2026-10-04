import { useCallback, useState } from 'react';
import { CHECKOUT_STEP } from '../features/checkout/checkoutUtils';

// UI-only checkout step, held in memory. Addresses, order creation and payment
// need an authenticated backend session and an order API that are not
// available yet, so nothing here persists or fabricates commerce data.
export const useCheckout = () => {
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEP.ADDRESS);
  const goToAddressStep = useCallback(() => setCurrentStep(CHECKOUT_STEP.ADDRESS), []);
  return { currentStep, goToAddressStep };
};

export default useCheckout;
