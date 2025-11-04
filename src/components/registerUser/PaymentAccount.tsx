'use client';

import { InfoSubText } from '@/components/ui/infoSubText';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from '@/hooks/useLocation';
import { useRazorPay } from '@/hooks/useRazorPay';
import { FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';


const countries = [
    { value: 'IN', label: 'India' },
];



export default function PaymentAccount({ formik, hasSubmitted = false }: { formik: FormikProps<Partial<any>>; hasSubmitted?: boolean }) {
    const {
        getBusinessTypes,
        getBusinessCategories,
        getBusinessSubcategories,
    } = useRazorPay();

    const [businessTypes, setBusinessTypes] = useState<{ value: string; label: string }[]>([]);
    const [businessCategories, setBusinessCategories] = useState<{ value: string; label: string }[]>([]);
    const [businessSubCategories, setBusinessSubCategories] = useState<{ value: string; label: string }[]>([]);

    // Fetch business types and categories on mount
    useEffect(() => {
        (async () => {
            const types = await getBusinessTypes();
            setBusinessTypes(
                Array.isArray(types)
                    ? types.map(t => ({ value: t.internal_name || t.id?.toString(), label: t.display_name }))
                    : []
            );
            const categories = await getBusinessCategories();
            setBusinessCategories(
                Array.isArray(categories)
                    ? categories.map(c => ({ value: c.internal_name, label: c.display_name }))
                    : []
            );
        })();
    }, []);

    useEffect(() => {
        const category = formik.values.profile?.category;
        const initialSubcategory = formik.values.profile?.subcategory;
        if (category) {
            (async () => {
                const subcategories = await getBusinessSubcategories(category);
                setBusinessSubCategories(
                    Array.isArray(subcategories)
                        ? subcategories.map(sc => ({ value: sc.internal_name, label: sc.display_name }))
                        : []
                );
                if (initialSubcategory) {
                    const found = subcategories.find(
                        (s: any) => s.internal_name === initialSubcategory
                    );
                    if (found) {
                        formik.setFieldValue('profile.subcategory', initialSubcategory);
                    }
                }
            })();
        } else {
            setBusinessSubCategories([]);
            formik.setFieldValue('profile.subcategory', '');
        }
    }, [formik.values.profile?.category, formik.values.profile?.subcategory]);

    useEffect(() => {
        let phone = '';
        if (typeof window !== 'undefined') {
            phone = sessionStorage.getItem('mobileNumber') || '';
        }
        if (phone && !formik.values.phone) {
            formik.setFieldValue('phone', phone);
        }
    }, []);

    useEffect(() => {
        if (formik.values.business_type === 'individual') {
            formik.setFieldValue('profile.category', 'not_for_profit');
            formik.setFieldValue('profile.subcategory', 'personal');
            formik.setFieldValue('legal_info.gst', '');
            formik.setFieldValue('legal_info.pan', '');
            formik.setFieldValue('legal_business_name', formik.values.bank_account?.name || '');
        }
    }, [formik.values.business_type, formik.values.bank_account?.name]);

    const clearFieldError = (field: string) => {
        formik.setFieldError(field, undefined);
    };

    const {
        states,
        cities,
        selectedStateId,
        selectedCityId,
        isLoadingStates,
        isLoadingCities,
        handleStateChange,
        handleCityChange,
    } = useLocation();

    useEffect(() => {
        if (
            states.length > 0 &&
            formik.values?.address?.state &&
            !selectedStateId
        ) {
            const stateObj = states.find(s => s.name === formik.values.address.state);
            if (stateObj) {
                handleStateChange(stateObj.id);
            }
        }
    }, [states, formik.values?.address?.state]);

    useEffect(() => {
        if (
            cities.length > 0 &&
            formik.values?.address?.city &&
            !selectedCityId
        ) {
            const cityObj = cities.find(c => c.name === formik.values.address.city);
            if (cityObj) {
                handleCityChange(cityObj.id);
            }
        }
    }, [cities, formik.values?.address?.city]);

    useEffect(() => {
        if (selectedStateId) {
            const stateObj = states.find(s => s.id === selectedStateId);
            if (stateObj && formik.values.address?.state !== stateObj.name) {
                formik.setFieldValue('address.state', stateObj.name);
            }
        }
    }, [selectedStateId, states]);

    useEffect(() => {
        if (selectedCityId) {
            const cityObj = cities.find(c => c.id === selectedCityId);
            if (cityObj && formik.values.address?.city !== cityObj.name) {
                formik.setFieldValue('address.city', cityObj.name);
            }
        }
    }, [selectedCityId, cities]);

    const handleStateValueChange = (val: string) => {
        const stateId = Number(val);
        handleStateChange(stateId);
        formik.setFieldValue('address.state', states.find(s => s.id === stateId)?.name || '');
        formik.setFieldValue('address.city', '');
    };

    const handleCityValueChange = (val: string) => {
        const cityId = Number(val);
        handleCityChange(cityId);
        formik.setFieldValue('address.city', cities.find(c => c.id === cityId)?.name || '');
    };

    const showBusinessFields = formik.values.business_type && formik.values.business_type !== 'individual';
    return (
        <div className="flex flex-col gap-2 w-full max-w-[880px] h-full">
            <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white mb-4">
                Payment account information
            </span>
            <Label htmlFor="email" className="font-satoshi-variable text-[14px] text-white">Email Id <span className="text-red-500">*</span></Label>
            <Input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-[56px] sm:w-full lg:w-[880px]"
            />
            {hasSubmitted && typeof formik.errors.email === 'string' && (
                <span className="text-red-500 text-xs">{formik.errors.email}</span>
            )}
            <InfoSubText text="We need your business email id to provide dashboard access for payments" />

            {/* Phone */}
            <Label htmlFor="phone" className="font-satoshi-variable text-[14px] text-white mt-4">Phone Number <span className="text-red-500">*</span></Label>
            <Input
                id="phone"
                type="number"
                placeholder="Enter Phone Number"
                value={formik.values.phone || ''}
                disabled
                readOnly
                isMobileNumber={true}
                className="h-[56px] sm:w-full lg:w-[880px]"
            />
            {hasSubmitted && typeof formik.errors.phone === 'string' && (
                <span className="text-red-500 text-xs">{formik.errors.phone}</span>
            )}
            <InfoSubText text="Business phone number for payments, OTP, and other verifications" />
            <Label htmlFor="business_type" className="font-satoshi-variable text-[14px] text-white mt-4">Business type <span className="text-red-500">*</span></Label>
            <Select
                value={formik.values.business_type}
                onValueChange={val => formik.setFieldValue('business_type', val)}
            >
                <SelectTrigger id="business_type" className="!h-[56px] w-full sm:w-full lg:w-[880px] text-white">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    {businessTypes
                        .filter(bt => bt.label.toLowerCase() !== 'other' && bt.value.toLowerCase() !== 'other')
                        .map(bt => (
                            <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                        ))}
                </SelectContent>
            </Select>
            {hasSubmitted && typeof formik.errors.business_type === 'string' && (
                <span className="text-red-500 text-xs">{formik.errors.business_type}</span>
            )}
            {/* Legal Business Name */}
            {showBusinessFields && (
                <>
                    <Label htmlFor="legal_business_name" className="font-satoshi-variable text-[14px] text-white mt-4">Legal business name <span className="text-red-500">*</span></Label>
                    <Input
                        id="legal_business_name"
                        type="text"
                        placeholder="Enter Legal Business Name"
                        value={formik.values.legal_business_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-[56px] sm:w-full lg:w-[880px]"
                    />
                    {hasSubmitted && typeof formik.errors.legal_business_name === 'string' && (
                        <span className="text-red-500 text-xs">{formik.errors.legal_business_name}</span>
                    )}
                    <InfoSubText text="The actual name of the business. For example, Acme Corp.The minimum length is 4 characters and the maximum length is 200. For Individuals Use your Bank Account Name." />
                </>
            )}
            {/* Advance Category */}
            {showBusinessFields && (
                <>
                    <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white mt-4 mb-2">
                        Advance Category
                    </span>
                    {/* Business Category */}
                    <Label htmlFor="category" className="font-satoshi-variable text-[14px] text-white mt-4">Business Category <span className="text-red-500">*</span></Label>
                    <Select
                        value={formik.values.profile?.category || ''}
                        onValueChange={val => formik.setFieldValue('profile.category', val)}
                    >
                        <SelectTrigger id="profile.category" className="!h-[56px] w-full sm:w-full lg:w-[880px] text-white">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {businessCategories.map(bc => (
                                <SelectItem key={bc.value} value={bc.value}>{bc.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasSubmitted &&
                        formik.errors.profile &&
                        !Array.isArray(formik.errors.profile) &&
                        typeof formik.errors.profile === 'object' &&
                        typeof (formik.errors.profile as Record<string, any>).category === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.profile as Record<string, any>).category}</span>
                        )}

                    {/* Business Sub Category */}
                    <Label htmlFor="subcategory" className="font-satoshi-variable text-[14px] text-white mt-4">Business SUB Category <span className="text-red-500">*</span></Label>
                    <Select
                        value={formik.values.profile?.subcategory || ''}
                        onValueChange={val => formik.setFieldValue('profile.subcategory', val)}
                    >
                        <SelectTrigger id="profile.subcategory" className="!h-[56px] w-full sm:w-full lg:w-[880px] text-white">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {businessSubCategories.map(bsc => (
                                <SelectItem key={bsc.value} value={bsc.value}>{bsc.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasSubmitted &&
                        formik.errors.profile &&
                        !Array.isArray(formik.errors.profile) &&
                        typeof formik.errors.profile === 'object' &&
                        typeof (formik.errors.profile as Record<string, any>).subcategory === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.profile as Record<string, any>).subcategory}</span>
                        )}

                    <Label htmlFor="line1" className="font-satoshi-variable text-[14px] text-white mt-4">GST <span className="text-red-500">*</span> </Label>
                    <Input
                        id="legal_info.gst"
                        type="text"
                        placeholder="Enter GST"
                        value={formik.values.legal_info?.gst || ''}
                        onChange={e => formik.setFieldValue('legal_info.gst', e.target.value)}
                        onBlur={formik.handleBlur}
                        className={`h-[56px] sm:w-full lg:w-[880px] font-satoshi-variable font-[500] text-[16px] text-white`}
                    />
                </>
            )}
            {hasSubmitted &&
                formik.errors.legal_info &&
                !Array.isArray(formik.errors.legal_info) &&
                typeof formik.errors.legal_info === 'object' &&
                typeof (formik.errors.legal_info as Record<string, any>).gst === 'string' && (
                    <span className="text-red-500 text-xs">{(formik.errors.legal_info as Record<string, any>).gst}</span>
                )}
            <span className="font-satoshi-bold text-[18px] sm:text-[22px] text-white mt-4 mb-2">
                Billing Address
            </span>
            {/* Address Line 1 */}
            <Label htmlFor="line1" className="font-satoshi-variable text-[14px] text-white mt-4">Address line 1 <span className="text-red-500">*</span></Label>
            <Textarea
                id="address.line1"
                placeholder="Enter Address line 1"
                value={formik.values.address?.line1 || ''}
                onChange={e => formik.setFieldValue('address.line1', e.target.value)}
                onBlur={formik.handleBlur}
                className="h-[90px] sm:w-full lg:w-[880px] font-satoshi-variable font-[500] text-[16px] text-white"
            />
            {hasSubmitted &&
                formik.errors.address &&
                !Array.isArray(formik.errors.address) &&
                typeof formik.errors.address === 'object' &&
                typeof (formik.errors.address as Record<string, any>).line1 === 'string' && (
                    <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).line1}</span>
                )}

            {/* Address Line 2 */}
            <Label htmlFor="line2" className="font-satoshi-variable text-[14px] text-white mt-4">Address line 2 <span className="text-red-500">*</span></Label>
            <Textarea
                id="address.line2"
                placeholder="Enter Address line 2"
                value={formik.values.address?.line2 || ''}
                onChange={e => formik.setFieldValue('address.line2', e.target.value)}
                onBlur={formik.handleBlur}
                className="h-[90px] sm:w-full lg:w-[880px] font-satoshi-variable font-[500] text-[16px] text-white"
            />
            {hasSubmitted &&
                formik.errors.address &&
                !Array.isArray(formik.errors.address) &&
                typeof formik.errors.address === 'object' &&
                typeof (formik.errors.address as Record<string, any>).line2 === 'string' && (
                    <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).line2}</span>
                )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                <div>
                    <Label htmlFor="state" className="text-white mb-3">State <span className="text-red-500">*</span></Label>
                    <Select
                        value={
                            selectedStateId
                                ? String(selectedStateId)
                                : states.find(s => s.name === formik.values.address?.state)?.id
                                    ? String(states.find(s => s.name === formik.values.address?.state)?.id)
                                    : ''
                        }
                        onValueChange={handleStateValueChange}
                    >
                        <SelectTrigger id="address.state" className={`w-full lg:w-[435px] text-white flex items-center px-4 !h-[56px] ${hasSubmitted && formik.errors['address.state'] ? 'border-red-500 focus:border-red-500' : ''}`}>
                            <SelectValue placeholder={isLoadingStates ? 'Loading...' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((stateObj) => (
                                <SelectItem key={stateObj.id} value={String(stateObj.id)}>
                                    {stateObj.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasSubmitted &&
                        formik.errors.address &&
                        !Array.isArray(formik.errors.address) &&
                        typeof formik.errors.address === 'object' &&
                        typeof (formik.errors.address as Record<string, any>).state === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).state}</span>
                        )}
                </div>
                <div>
                    <Label htmlFor="city" className="text-white mb-3">City <span className="text-red-500">*</span></Label>
                    <Select
                        value={
                            selectedCityId
                                ? String(selectedCityId)
                                : cities.find(c => c.name === formik.values.address?.city)?.id
                                    ? String(cities.find(c => c.name === formik.values.address?.city)?.id)
                                    : ''
                        }
                        onValueChange={handleCityValueChange}
                        disabled={!selectedStateId || isLoadingCities}
                    >
                        <SelectTrigger id="address.city" className={`w-full lg:w-[435px] text-white flex items-center px-4 !h-[56px] ${hasSubmitted && formik.errors['address.city'] ? 'border-red-500 focus:border-red-500' : ''}`}>
                            <SelectValue placeholder={isLoadingCities ? 'Loading...' : 'Select'} />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((cityObj) => (
                                <SelectItem key={cityObj.id} value={String(cityObj.id)}>
                                    {cityObj.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasSubmitted &&
                        formik.errors.address &&
                        !Array.isArray(formik.errors.address) &&
                        typeof formik.errors.address === 'object' &&
                        typeof (formik.errors.address as Record<string, any>).city === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).city}</span>
                        )}
                </div>
                <div>
                    <Label htmlFor="postal_code" className="text-white mb-3">Postal code <span className="text-red-500">*</span></Label>
                    <Input
                        id="address.postal_code"
                        maxLength={6}
                        type="text"
                        placeholder="Enter Postal code"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        value={formik.values.address?.postal_code || ''}
                        onChange={e => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                            formik.setFieldValue('address.postal_code', value);
                        }}
                        onBlur={formik.handleBlur}
                        className="h-[56px]"
                    />
                    {hasSubmitted &&
                        formik.errors.address &&
                        !Array.isArray(formik.errors.address) &&
                        typeof formik.errors.address === 'object' &&
                        typeof (formik.errors.address as Record<string, any>).postal_code === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).postal_code}</span>
                        )}
                </div>
                <div>
                    <Label htmlFor="country" className="text-white mb-3">Country <span className="text-red-500">*</span></Label>
                    <Select
                        value={formik.values.address?.country || ''}
                        onValueChange={val => formik.setFieldValue('address.country', val)}
                    >
                        <SelectTrigger id="address.country" className="!h-[56px] w-full sm:w-full lg:w-full text-white">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {hasSubmitted &&
                        formik.errors.address &&
                        !Array.isArray(formik.errors.address) &&
                        typeof formik.errors.address === 'object' &&
                        typeof (formik.errors.address as Record<string, any>).country === 'string' && (
                            <span className="text-red-500 text-xs">{(formik.errors.address as Record<string, any>).country}</span>
                        )}
                </div>
            </div>
        </div>

    );
}
