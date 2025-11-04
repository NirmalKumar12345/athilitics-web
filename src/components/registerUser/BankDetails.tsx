'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormikProps } from 'formik';

interface BankDetailsProps {
    formik: FormikProps<any>;
    hasSubmitted?: boolean;
}

const BankDetails = ({ formik, hasSubmitted = false }: BankDetailsProps) => {
    const clearFieldError = (field: string) => {
        formik.setFieldError(field, undefined);
    };

    return (
        <div>
            <h1 className="text-white font-satoshi-bold text-[18px] sm:text-[22px] pb-[35px]">
                Bank account details
            </h1>
            <div className="flex flex-col gap-5 w-full max-w-[880px] h-full">
                <div>
                    <Label htmlFor="name" className="font-satoshi-variable text-[14px] mb-2 text-white">
                        Account name as per bank record <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="bank_account.name"
                        type="text"
                        placeholder="Enter account name"
                        className="h-[56px] sm:w-full lg:w-[880px]"
                        value={formik.values?.bank_account?.name || ''}
                        onChange={e => {
                            formik.setFieldValue('bank_account.name', e.target.value);
                            if (e.target.value.trim()) clearFieldError('bank_account.name');
                        }}
                        aria-invalid={!!(hasSubmitted && formik.errors['bank_account.name'])}
                        aria-describedby={hasSubmitted && formik.errors['bank_account.name'] ? 'bank_account.name-error' : undefined}
                    />
                    {hasSubmitted &&
                        formik.errors.bank_account &&
                        !Array.isArray(formik.errors.bank_account) &&
                        typeof formik.errors.bank_account === 'object' &&
                        typeof (formik.errors.bank_account as Record<string, any>).name === 'string' && (
                            <span id="bank_account.name-error" className="text-red-500 text-xs mt-1 font-satoshi-variable">
                                {(formik.errors.bank_account as Record<string, any>).name}
                            </span>
                        )}
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full">
                        <Label htmlFor="account_number" className="font-satoshi-variable text-[14px] mb-2 text-white">
                            Bank account number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bank_account.account_number"
                            type="text"
                            maxLength={18}
                            placeholder="Enter account number"
                            className="h-[56px] sm:w-full w-full bg-black text-white"
                            value={formik.values?.bank_account?.account_number || ''}
                            onChange={e => {
                                formik.setFieldValue('bank_account.account_number', e.target.value.replace(/\D/g, ''));
                                if (e.target.value.trim()) clearFieldError('bank_account.account_number');
                            }}
                        />
                        {hasSubmitted &&
                            formik.errors.bank_account &&
                            !Array.isArray(formik.errors.bank_account) &&
                            typeof formik.errors.bank_account === 'object' &&
                            typeof (formik.errors.bank_account as Record<string, any>).account_number === 'string' && (
                                <span id="bank_account.account_number-error" className="text-red-500 text-xs mt-1 font-satoshi-variable">
                                    {(formik.errors.bank_account as Record<string, any>).account_number}
                                </span>
                            )}
                    </div>
                    <div className="w-full">
                        <Label htmlFor="ifsc" className="font-satoshi-variable text-[14px] mb-2 text-white">
                            IFSC CODE <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bank_account.ifsc"
                            type="text"
                            placeholder="IFSC code"
                            className="h-[56px] sm:w-full w-full bg-black text-white uppercase"
                            value={formik.values?.bank_account?.ifsc || ''}
                            onChange={e => {
                                formik.setFieldValue('bank_account.ifsc', e.target.value.toUpperCase());
                                if (e.target.value.trim()) clearFieldError('bank_account.ifsc');
                            }}
                        />
                        {hasSubmitted &&
                            formik.errors.bank_account &&
                            !Array.isArray(formik.errors.bank_account) &&
                            typeof formik.errors.bank_account === 'object' &&
                            typeof (formik.errors.bank_account as Record<string, any>).ifsc === 'string' && (
                                <span id="bank_account.ifsc-error" className="text-red-500 text-xs mt-1 font-satoshi-variable">
                                    {(formik.errors.bank_account as Record<string, any>).ifsc}
                                </span>
                            )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="w-full">
                        <Label htmlFor="account_number" className="font-satoshi-variable text-[14px] mb-2 text-white">
                            Confirm bank account number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="bank_account.confirm_account_number"
                            type="text"
                            maxLength={18}
                            placeholder="Re-enter account number"
                            className="h-[56px] sm:w-full w-full bg-black text-white"
                            value={formik.values?.bank_account?.confirm_account_number || ''}
                            onChange={e => {
                                formik.setFieldValue('bank_account.confirm_account_number', e.target.value.replace(/\D/g, ''));
                                if (e.target.value.trim()) clearFieldError('bank_account.confirm_account_number');
                            }}

                        />
                        {hasSubmitted &&
                            formik.errors.bank_account &&
                            !Array.isArray(formik.errors.bank_account) &&
                            typeof formik.errors.bank_account === 'object' &&
                            typeof (formik.errors.bank_account as Record<string, any>).confirm_account_number === 'string' && (
                                <span id="bank_account.confirm_account_number-error" className="text-red-500 text-xs mt-1 font-satoshi-variable">
                                    {(formik.errors.bank_account as Record<string, any>).confirm_account_number}
                                </span>
                            )}
                    </div>
                    {formik.values?.business_type !== 'individual' && (
                        <div className="w-full">
                            <Label htmlFor="pan" className="font-satoshi-variable text-[14px] mb-2 text-white">
                                PAN No <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="legal_info.pan"
                                type="text"
                                placeholder="PAN number"
                                className="h-[56px] sm:w-full w-full bg-black text-white uppercase"
                                value={formik.values?.legal_info?.pan || ''}
                                onChange={e => {
                                    formik.setFieldValue('legal_info.pan', e.target.value.toUpperCase());
                                    if (e.target.value.trim()) clearFieldError('legal_info.pan');
                                }}
                            />
                            {hasSubmitted &&
                                formik.errors.legal_info &&
                                !Array.isArray(formik.errors.legal_info) &&
                                typeof formik.errors.legal_info === 'object' &&
                                typeof (formik.errors.legal_info as Record<string, any>).pan === 'string' && (
                                    <span id="legal_info.pan-error" className="text-red-500 text-xs mt-1 font-satoshi-variable">
                                        {(formik.errors.legal_info as Record<string, any>).pan}
                                    </span>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BankDetails;
