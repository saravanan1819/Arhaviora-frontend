import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '../Input/Input';
import { StatusPanel } from '../StatusPanel/StatusPanel';
import * as addressApi from '../../services/api/addresses';
import { toApiError } from '../../services/api/errors';
import '../../pages/Auth/Auth.css';
import './AddressManager.css';

const EMPTY_FORM = {
  label: '',
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

// Backend field names -> form field names, for validation errors.
const FIELD_MAP = {
  label: 'label',
  recipientName: 'fullName',
  phone: 'phone',
  addressLine1: 'line1',
  addressLine2: 'line2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
};

const summaryLine = (a) => [a.line1, a.line2, a.city, a.state, a.postalCode].filter(Boolean).join(', ');

const AddressForm = ({ initial, onCancel, onSaved }) => {
  const editing = Boolean(initial?.id);
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const fieldErrors = {};
  Object.entries(error?.fieldErrors || {}).forEach(([k, v]) => {
    fieldErrors[FIELD_MAP[k] || k] = v;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const saved = editing
        ? await addressApi.updateAddress(initial.id, form)
        : await addressApi.createAddress(form);
      onSaved(saved);
    } catch (err) {
      setError(toApiError(err));
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form address-form" onSubmit={handleSubmit} noValidate>
      <h2 className="address-form-title">{editing ? 'Edit address' : 'Add a new address'}</h2>
      {error && !error.errors && <div className="auth-alert" role="alert">{error.message}</div>}
      <Input label="Full name" autoComplete="name" value={form.fullName} onChange={update('fullName')} error={fieldErrors.fullName} required />
      <Input label="Phone" type="tel" autoComplete="tel" placeholder="+917598238098" value={form.phone} onChange={update('phone')} error={fieldErrors.phone} required />
      <Input label="Address line 1" autoComplete="address-line1" value={form.line1} onChange={update('line1')} error={fieldErrors.line1} required />
      <Input label="Address line 2 (optional)" autoComplete="address-line2" value={form.line2} onChange={update('line2')} error={fieldErrors.line2} />
      <div className="auth-row">
        <Input label="City" autoComplete="address-level2" value={form.city} onChange={update('city')} error={fieldErrors.city} required />
        <Input label="State" autoComplete="address-level1" value={form.state} onChange={update('state')} error={fieldErrors.state} required />
      </div>
      <div className="auth-row">
        <Input label="Postal code" autoComplete="postal-code" value={form.postalCode} onChange={update('postalCode')} error={fieldErrors.postalCode} required />
        <Input label="Country" autoComplete="country-name" value={form.country} onChange={update('country')} error={fieldErrors.country} required />
      </div>
      <Input label="Label (optional)" placeholder="Home, Office…" value={form.label} onChange={update('label')} error={fieldErrors.label} />
      <div className="address-form-actions">
        <button type="submit" className="auth-submit address-form-submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save address'}
        </button>
        <button type="button" className="status-panel-cta is-outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
};

// Lists, creates, edits and deletes the signed-in user's addresses via /addresses.
// With `selectable`, a card can be chosen (onSelect) as the shipping address.
export const AddressManager = ({ selectable = false, selectedId = null, onSelect, onLoaded }) => {
  const [addresses, setAddresses] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [formState, setFormState] = useState(null); // null | { address? }
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(
    () =>
      addressApi
        .listAddresses()
        .then((list) => {
          setLoadError(null);
          setAddresses(list);
          return list;
        })
        .catch((e) => setLoadError(toApiError(e))),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (addresses) onLoaded?.(addresses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const run = async (id, fn) => {
    setActionError(null);
    setBusyId(id);
    try {
      await fn();
      await load();
    } catch (e) {
      setActionError(toApiError(e).message);
    } finally {
      setBusyId(null);
    }
  };

  if (!addresses && !loadError) return <StatusPanel>Loading your addresses…</StatusPanel>;
  if (!addresses && loadError) {
    return (
      <StatusPanel role="alert" title="We couldn't load your addresses" actions={[{ label: 'Try again', onClick: load }]}>
        {loadError.message}
      </StatusPanel>
    );
  }

  if (formState) {
    return (
      <AddressForm
        initial={formState.address}
        onCancel={() => setFormState(null)}
        onSaved={async (saved) => {
          const wasNew = !formState.address;
          setFormState(null);
          await load();
          if (selectable && wasNew) onSelect?.(saved.id);
        }}
      />
    );
  }

  return (
    <section className="address-manager" aria-label="Addresses">
      {(actionError || loadError) && (
        <div className="auth-alert" role="alert">{actionError || loadError.message}</div>
      )}

      {addresses.length === 0 ? (
        <StatusPanel title="No saved addresses" actions={[{ label: 'Add an address', onClick: () => setFormState({}) }]}>
          Add a delivery address to continue.
        </StatusPanel>
      ) : (
        <>
          <div className="checkout-address-list" role={selectable ? 'radiogroup' : 'list'} aria-label="Saved addresses">
            {addresses.map((a) => {
              const isSelected = selectable && selectedId === a.id;
              const select = () => selectable && onSelect?.(a.id);
              return (
                <article
                  key={a.id}
                  className={`checkout-address-card ${isSelected ? 'is-selected' : ''}`}
                  role={selectable ? 'radio' : 'listitem'}
                  aria-checked={selectable ? isSelected : undefined}
                  tabIndex={selectable ? 0 : undefined}
                  onClick={select}
                  onKeyDown={(e) => {
                    if (selectable && e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      select();
                    }
                  }}
                >
                  <div className="checkout-address-card-row">
                    {selectable && (
                      <div className="checkout-address-radio-wrap">
                        {isSelected ? (
                          <img src="/assets/icons/radio.svg" alt="" className="checkout-address-radio" width={24} height={24} />
                        ) : (
                          <span className="checkout-address-radio checkout-address-radio-empty" aria-hidden="true" />
                        )}
                      </div>
                    )}
                    <div className="checkout-address-content">
                      <div className="checkout-address-card-top">
                        <div className="checkout-address-name-row">
                          <span className="checkout-address-name">{a.fullName}</span>
                          {a.label && <span className="checkout-address-badge">{a.label}</span>}
                          {a.isDefaultShipping && <span className="checkout-address-badge">Default shipping</span>}
                          {a.isDefaultBilling && <span className="checkout-address-badge">Default billing</span>}
                        </div>
                      </div>
                      <p className="checkout-address-line">{summaryLine(a)}</p>
                      <p className="checkout-address-phone">{a.phone}</p>
                      <div className="address-card-links" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="sp-empty-clear" disabled={busyId === a.id} onClick={() => setFormState({ address: a })}>Edit</button>
                        {!a.isDefaultShipping && (
                          <button type="button" className="sp-empty-clear" disabled={busyId === a.id} onClick={() => run(a.id, () => addressApi.setDefaultShipping(a.id))}>Set as default shipping</button>
                        )}
                        {!a.isDefaultBilling && (
                          <button type="button" className="sp-empty-clear" disabled={busyId === a.id} onClick={() => run(a.id, () => addressApi.setDefaultBilling(a.id))}>Set as default billing</button>
                        )}
                        <button
                          type="button"
                          className="sp-empty-clear"
                          disabled={busyId === a.id}
                          onClick={() => {
                            if (window.confirm('Delete this address?')) run(a.id, () => addressApi.deleteAddress(a.id));
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="address-manager-add">
            <button type="button" className="status-panel-cta is-outline" onClick={() => setFormState({})}>
              Add New Address
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default AddressManager;
