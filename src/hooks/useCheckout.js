import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createSeedAddresses,
  getDefaultAddressId,
  loadAddressesFromStorage,
  loadSelectedAddressId,
  normalizeAddress,
  removeAddressById,
  saveAddressesToStorage,
  saveSelectedAddressId,
  setDefaultAddress,
  upsertAddress,
} from '../features/checkout/addressUtils';
import {
  CHECKOUT_STEP,
  canProceedFromAddress,
  canProceedFromOrderSummary,
  createOrderConfirmation,
  loadCheckoutStep,
  loadLastOrder,
  loadPaymentMethod,
  saveCheckoutStep,
  saveLastOrder,
  savePaymentMethod,
} from '../features/checkout/checkoutUtils';

export const useCheckout = () => {
  const [addresses, setAddresses] = useState(() => {
    const stored = loadAddressesFromStorage();
    return stored && stored.length > 0 ? stored : createSeedAddresses();
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const storedId = loadSelectedAddressId();
    if (storedId) return storedId;

    const storedAddresses = loadAddressesFromStorage();
    const list = storedAddresses && storedAddresses.length > 0
      ? storedAddresses
      : createSeedAddresses();

    return getDefaultAddressId(list);
  });

  const [currentStep, setCurrentStep] = useState(loadCheckoutStep);
  const [paymentMethod, setPaymentMethod] = useState(loadPaymentMethod);
  const [placedOrder, setPlacedOrder] = useState(loadLastOrder);
  const [addressForm, setAddressForm] = useState({ mode: null, addressId: null });

  useEffect(() => {
    saveAddressesToStorage(addresses);
  }, [addresses]);

  useEffect(() => {
    saveSelectedAddressId(selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    saveCheckoutStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    savePaymentMethod(paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    saveLastOrder(placedOrder);
  }, [placedOrder]);

  const selectAddress = useCallback((addressId) => {
    const id = String(addressId);
    setSelectedAddressId(id);
    setAddresses((prev) => {
      const next = setDefaultAddress(prev, id);
      return next;
    });
    setCurrentStep(CHECKOUT_STEP.ORDER_SUMMARY);
  }, []);

  const deleteAddress = useCallback((addressId) => {
    setAddresses((prev) => {
      const next = removeAddressById(prev, addressId);
      setSelectedAddressId((currentId) => {
        if (currentId !== String(addressId)) return currentId;
        return getDefaultAddressId(next);
      });
      return next;
    });
  }, []);

  const saveAddress = useCallback((address) => {
    const normalized = normalizeAddress(address);
    setAddresses((prev) => upsertAddress(prev, normalized));
    setSelectedAddressId(normalized.id);
    setAddressForm({ mode: null, addressId: null });
  }, []);

  const requestAddAddress = useCallback(() => {
    setAddressForm({ mode: 'add', addressId: null });
  }, []);

  const requestEditAddress = useCallback((addressId) => {
    setAddressForm({ mode: 'edit', addressId: String(addressId) });
  }, []);

  const dismissAddressForm = useCallback(() => {
    setAddressForm({ mode: null, addressId: null });
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const goToAddressStep = useCallback(() => {
    setCurrentStep(CHECKOUT_STEP.ADDRESS);
  }, []);

  const beginNewCheckout = useCallback(() => {
    setCurrentStep(CHECKOUT_STEP.ADDRESS);
  }, []);

  const selectPaymentMethod = useCallback((method) => {
    setPaymentMethod(method);
  }, []);

  const confirmAddressStep = useCallback(() => {
    if (!canProceedFromAddress(selectedAddressId, addresses)) return false;
    setCurrentStep(CHECKOUT_STEP.ORDER_SUMMARY);
    return true;
  }, [selectedAddressId, addresses]);

  const selectedAddress = useMemo(
    () => addresses.find((item) => item.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const confirmOrderSummaryStep = useCallback(
    (cartItems = [], totals = {}) => {
      if (!canProceedFromOrderSummary(cartItems, selectedAddressId, addresses, paymentMethod)) {
        return false;
      }

      const order = createOrderConfirmation({
        address: selectedAddress,
        cartItems,
        totals,
        paymentMethod,
      });

      setPlacedOrder(order);
      setCurrentStep(CHECKOUT_STEP.CONFIRMATION);
      return true;
    },
    [selectedAddressId, addresses, paymentMethod, selectedAddress]
  );

  const copyOrderId = useCallback(async () => {
    const orderId = placedOrder?.orderId;
    if (!orderId) return false;

    try {
      await navigator.clipboard.writeText(orderId);
      return true;
    } catch {
      return false;
    }
  }, [placedOrder]);

  const editingAddress = useMemo(
    () => addresses.find((item) => item.id === addressForm.addressId) || null,
    [addresses, addressForm.addressId]
  );

  const canProceed = useMemo(
    () => canProceedFromAddress(selectedAddressId, addresses),
    [selectedAddressId, addresses]
  );

  const canProceedToPayment = useCallback(
    (cartItems = []) =>
      canProceedFromOrderSummary(cartItems, selectedAddressId, addresses, paymentMethod),
    [selectedAddressId, addresses, paymentMethod]
  );

  return {
    addresses,
    selectedAddressId,
    selectedAddress,
    currentStep,
    paymentMethod,
    placedOrder,
    addressFormMode: addressForm.mode,
    editingAddressId: addressForm.addressId,
    editingAddress,
    canProceed,
    selectAddress,
    deleteAddress,
    saveAddress,
    requestAddAddress,
    requestEditAddress,
    dismissAddressForm,
    goToStep,
    goToAddressStep,
    beginNewCheckout,
    selectPaymentMethod,
    confirmAddressStep,
    confirmOrderSummaryStep,
    canProceedToPayment,
    copyOrderId,
  };
};

export default useCheckout;
