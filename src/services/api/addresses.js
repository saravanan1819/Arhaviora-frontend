import { api } from './client';

export const E164 = /^\+[1-9]\d{7,14}$/;

const COUNTRY_CODES = { india: 'IN' };
export const toCountryCode = (country = '') => {
  const value = String(country).trim();
  return COUNTRY_CODES[value.toLowerCase()] || value.toUpperCase();
};

// Frontend form fields -> backend names. Backend bodies are strict, so only
// these fields are ever sent.
export const toAddressPayload = (form = {}) => ({
  label: form.label || null,
  recipientName: form.fullName,
  phone: form.phone,
  addressLine1: form.line1,
  addressLine2: form.line2 || null,
  city: form.city,
  state: form.state,
  postalCode: form.postalCode,
  country: toCountryCode(form.country),
});

export const fromAddress = (a) => ({
  id: a.id,
  label: a.label || '',
  fullName: a.recipientName,
  phone: a.phone,
  line1: a.addressLine1,
  line2: a.addressLine2 || '',
  city: a.city,
  state: a.state,
  postalCode: a.postalCode,
  country: a.country === 'IN' ? 'India' : a.country,
  isDefaultShipping: a.isDefaultShipping,
  isDefaultBilling: a.isDefaultBilling,
});

export const listAddresses = () => api.get('/addresses').then((d) => d.addresses.map(fromAddress));
export const createAddress = (form) =>
  api.post('/addresses', toAddressPayload(form)).then((d) => fromAddress(d.address));
export const updateAddress = (id, form) =>
  api.patch(`/addresses/${id}`, toAddressPayload(form)).then((d) => fromAddress(d.address));
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);
export const setDefaultShipping = (id) =>
  api.patch(`/addresses/${id}/default-shipping`).then((d) => fromAddress(d.address));
export const setDefaultBilling = (id) =>
  api.patch(`/addresses/${id}/default-billing`).then((d) => fromAddress(d.address));
