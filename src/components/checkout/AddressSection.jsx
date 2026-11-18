
"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Check,
  CheckCircle2,
  Plus,
  X,
  House,
  Phone,
  MapPinned,
} from "lucide-react";

import api from "@/service/api";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import useNotification from "@/hooks/useNotification";

export default function AddressSection({ onAddressSelect }) {
  const { user } = useAuth();
  const { notify } = useNotification();

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.[0]?.id || null
  );

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [errors, setErrors] = useState({});

  const initialAddressForm = {
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    phoneNumber: user?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  };

  const [addressForm, setAddressForm] = useState(initialAddressForm);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);

      setSelectedAddressId((prev) => {
        const existingAddress = user.addresses.find(
          (address) => address.id === prev
        );

        return existingAddress?.id ?? user.addresses[0]?.id ?? null;
      });
    }
  }, [user]);

  useEffect(() => {
    onAddressSelect?.(selectedAddressId);
  }, [selectedAddressId, onAddressSelect]);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
  };

  const handleInputChange = (field, value) => {
    setAddressForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateAddress = () => {
    const newErrors = {};

    Object.entries(addressForm).forEach(([field, value]) => {
      if (!value.trim()) {
        newErrors[field] = `${field} is required`;
      }
    });

    if (
      addressForm.phoneNumber &&
      !/^[0-9+\-\s()]{10,15}$/.test(addressForm.phoneNumber)
    ) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    if (
      addressForm.postalCode &&
      !/^[0-9]{5,6}$/.test(addressForm.postalCode)
    ) {
      newErrors.postalCode = "Enter a valid postal code";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!validateAddress()) return;

    try {
      setIsSavingAddress(true);

      const response = await api.post("/order/user/address", addressForm);

      const savedAddress = response.data;

      setAddresses((prev) => [...prev, savedAddress]);

      setSelectedAddressId(savedAddress.id);

      setShowAddressForm(false);

      notify("Address added successfully", "success");

      setAddressForm(initialAddressForm);
      setErrors({});
    } catch (error) {
      notify(
        error.response?.data?.message || "Failed to save address",
        "error"
      );
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleCloseModal = () => {
    if (isSavingAddress) return;

    setShowAddressForm(false);
    setErrors({});
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200/80 shadow-soft-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPinned className="w-5 h-5 text-brand-700" />

            <h3 className="font-serif text-lg font-bold text-stone-900">
              Delivery Address
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Choose where your order should be delivered.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddressForm(true)}
          className="flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </Button>
      </div>

      {/* Saved Address Cards */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <button
                key={address.id}
                type="button"
                onClick={() => handleSelectAddress(address.id)}
                className={`group w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? "border-brand-700 bg-brand-50/60 ring-1 ring-brand-700 shadow-sm"
                    : "border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-brand-700 text-white"
                        : "bg-stone-100 text-stone-600 group-hover:bg-stone-200"
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>

                  {/* Address Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Delivery Address
                      </span>

                      {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 text-brand-800 px-2 py-0.5 text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-[15px] font-semibold text-stone-900 leading-6 break-words">
                      {address.address}
                    </p>

                    {/* <p className="text-xs sm:text-sm text-stone-500 mt-1">
                      {address.city}, {address.state} - {address.postalCode}
                    </p>

                    <p className="text-xs text-stone-500 mt-0.5">
                      {address.country}
                    </p>

                    {address.phoneNumber && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-500">
                        <Phone className="w-3.5 h-3.5" />
                        {address.phoneNumber}
                      </div>
                    )} */}
                  </div>

                  {/* Selection Check */}
                  <div
                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-brand-700 border-brand-700"
                        : "border-stone-300 group-hover:border-stone-500"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10">
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mb-4 shadow-sm">
            <House className="w-6 h-6 text-stone-500" />
          </div>

          <h4 className="text-sm font-semibold text-stone-900">
            No saved address yet
          </h4>

          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xs">
            Add your delivery address to continue with your order.
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddressForm(true)}
            className="mt-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Address
          </Button>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressForm && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-5 sm:px-7 sm:py-6 border-b border-stone-100 flex items-center justify-between gap-4 bg-stone-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                    Add New Address
                  </h2>
                </div>

                <p className="text-xs text-stone-500 mt-2">
                  Enter your complete delivery details.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSavingAddress}
                className="w-9 h-9 shrink-0 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSaveAddress}
              className="flex-1 overflow-y-auto"
            >
              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ["fullName", "Full Name"],
                    ["phoneNumber", "Phone Number"],
                    ["addressLine1", "Street Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["postalCode", "Postal Code"],
                  ].map(([field, label]) => (
                    <div
                      key={field}
                      className={
                        field === "fullName" ||
                        field === "phoneNumber" ||
                        field === "addressLine1"
                          ? "sm:col-span-2"
                          : ""
                      }
                    >
                      <Input
                        label={label}
                        value={addressForm[field]}
                        onChange={(e) =>
                          handleInputChange(field, e.target.value)
                        }
                        error={errors[field]}
                        required
                      />
                    </div>
                  ))}

                  {/* Country */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                      Country
                    </label>

                    <select
                      value={addressForm.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-700/10"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white border-t border-stone-100 px-5 py-4 sm:px-7 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSavingAddress}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSavingAddress}
                  disabled={isSavingAddress}
                  className="flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
