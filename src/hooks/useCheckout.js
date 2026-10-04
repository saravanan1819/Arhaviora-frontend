import { useCallback, useMemo, useState } from 'react';
import { CHECKOUT_STEP } from '../features/checkout/checkoutUtils';

// UI-only checkout state, held in memory. Addresses and totals come from the
// backend; this only tracks the step and which saved address is chosen.
export const useCheckout = () => {
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEP.ADDRESS);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // Keep the selection valid as the address list changes; default to the
  // default shipping address, else the first one.
  const handleAddressesLoaded = useCallback((list) => {
    setAddresses(list);
    setSelectedAddressId((current) => {
      if (current && list.some((a) => a.id === current)) return current;
      return (list.find((a) => a.isDefaultShipping) || list[0])?.id ?? null;
    });
  }, []);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const goToAddressStep = useCallback(() => setCurrentStep(CHECKOUT_STEP.ADDRESS), []);
  const goToSummaryStep = useCallback(() => setCurrentStep(CHECKOUT_STEP.ORDER_SUMMARY), []);

  return {
    currentStep,
    selectedAddressId,
    selectedAddress,
    selectAddress: setSelectedAddressId,
    handleAddressesLoaded,
    goToAddressStep,
    goToSummaryStep,
  };
};

export default useCheckout;
