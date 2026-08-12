export const ADDRESS_STORAGE_KEY = 'arhaviora_addresses_v4';
export const SELECTED_ADDRESS_STORAGE_KEY = 'arhaviora_selected_address_v4';

export const normalizeAddress = (address = {}) => ({
  id: String(address.id),
  label: address.label || 'HOME',
  fullName: address.fullName || '',
  phone: address.phone || '',
  line1: address.line1 || '',
  line2: address.line2 || '',
  city: address.city || '',
  postalCode: address.postalCode || '',
  state: address.state || '',
  country: address.country || 'India',
  isDefault: Boolean(address.isDefault),
});

export const formatAddressLine = (address = {}) => {
  const parts = [
    address.fullName,
    address.phone,
    [address.line1, address.line2].filter(Boolean).join(', '),
    [address.city, address.postalCode ? `- ${address.postalCode}` : ''].filter(Boolean).join(' '),
    [address.state, address.country ? `- ${address.country}` : ''].filter(Boolean).join(' '),
  ].filter(Boolean);

  return parts.join(', ');
};

export const formatDeliveryAddressSummary = (address = {}) => {
  const street = [address.line1, address.line2].filter(Boolean).join(', ');
  const cityPostal = [address.city, address.postalCode].filter(Boolean).join(' - ');
  const stateCountry = [address.state, address.country].filter(Boolean).join(' - ');

  return [street, cityPostal, stateCountry].filter(Boolean).join(' ');
};

export const createSeedAddresses = () => [
  normalizeAddress({
    id: 'addr-1',
    label: 'HOME',
    fullName: 'Saravanan S',
    phone: '+917598238098',
    line1: '12, Kovaiputhur',
    city: 'Coimbatore',
    postalCode: '621 041',
    state: 'Tamilnadu',
    country: 'India',
    isDefault: true,
  }),
  normalizeAddress({
    id: 'addr-2',
    label: 'HOME',
    fullName: 'Saravanan',
    phone: '+917598238098',
    line1: '45 / 5 / 1 Kovaiputhur , Coimbatore',
    isDefault: false,
  }),
];

export const loadAddressesFromStorage = () => {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeAddress) : null;
  } catch {
    return null;
  }
};

export const saveAddressesToStorage = (addresses = []) => {
  try {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  } catch {
    // ignore quota / private mode
  }
};

export const loadSelectedAddressId = () => {
  try {
    return localStorage.getItem(SELECTED_ADDRESS_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const saveSelectedAddressId = (addressId) => {
  try {
    if (addressId) {
      localStorage.setItem(SELECTED_ADDRESS_STORAGE_KEY, String(addressId));
    } else {
      localStorage.removeItem(SELECTED_ADDRESS_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

export const removeAddressById = (addresses = [], addressId) =>
  addresses.filter((item) => item.id !== String(addressId));

export const upsertAddress = (addresses = [], nextAddress = {}) => {
  const normalized = normalizeAddress(nextAddress);
  const exists = addresses.some((item) => item.id === normalized.id);

  if (exists) {
    return addresses.map((item) => (item.id === normalized.id ? normalized : item));
  }

  return [...addresses, normalized];
};

export const getDefaultAddressId = (addresses = []) => {
  const defaultAddress = addresses.find((item) => item.isDefault);
  return defaultAddress?.id || addresses[0]?.id || null;
};

export const createAddressDraft = (partial = {}) =>
  normalizeAddress({
    id: partial.id || `addr-${Date.now()}`,
    label: 'HOME',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    postalCode: '',
    state: '',
    country: 'India',
    isDefault: false,
    ...partial,
  });

export const getAddressCardDisplay = (address = {}) => ({
  fullName: address.fullName,
  label: address.label,
  streetLine: [address.line1, address.line2].filter(Boolean).join(', '),
  phone: address.phone,
});

export const setDefaultAddress = (addresses = [], addressId) =>
  addresses.map((item) => ({
    ...item,
    isDefault: item.id === String(addressId),
  }));
