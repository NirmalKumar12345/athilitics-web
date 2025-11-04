'use client';
import { Organizer } from '@/api/models/Organizer';
import FormInput from '@/components/FormInput';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FileUploadButton } from '@/components/ui/fileUploadButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormikProps } from 'formik';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProfileDetailsProps {
  formik: FormikProps<Partial<Organizer>>;
  showTitle?: boolean;
  title?: string;
  showWelcome?: boolean;
  uploadedImage?: string | null;
  updatedLogo?: File | null;
  pendingLogoFile?: File | null; // Add support for pending file display
  onImageUpload: (file: File | null) => void;
  onImageRemove: () => void;
  hasSubmitted?: boolean;
}

const ProfileDetails = ({
  formik,
  showTitle = true,
  title = 'Basic Details',
  showWelcome = false,
  uploadedImage,
  updatedLogo = null,
  pendingLogoFile = null,
  onImageUpload,
  onImageRemove,
  hasSubmitted = false,
}: ProfileDetailsProps) => {
  const initialSocialLinks = formik.values?.social_links || [];

  const [socialLinks, setSocialLinks] = useState<string[]>(initialSocialLinks);
  const [imageUploadError, setImageUploadError] = useState<string>('');

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const organizerName = formik.values?.organizer_name;
  React.useEffect(() => {
    if (!isInitialized && organizerName) {
      const fullName = organizerName;
      const nameParts = fullName.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setIsInitialized(true);
    }
  }, [organizerName, isInitialized]);

  React.useEffect(() => {
    if (formik.values?.social_links) {
      setSocialLinks(formik.values.social_links);
    }
  }, [formik.values?.social_links]);

  const handleAddSocialLink = () => {
    const newLinks = [...socialLinks, ''];
    setSocialLinks(newLinks);
    formik.setFieldValue('social_links', newLinks);
  };
  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
    formik.setFieldValue('social_links', updatedLinks);
  };
  const handleDeleteSocialLink = (index: number) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
    formik.setFieldValue('social_links', updatedLinks);
  };

  const handleRemoveLogo = () => {
    setImageUploadError(''); // Clear any upload errors when removing logo
    if (onImageRemove) {
      onImageRemove();
    } else {
      sessionStorage.removeItem('uploadedLogo');
      window.dispatchEvent(new Event('uploadedLogoChanged'));
    }
  };

  const handleImageUpload = (file: File | null) => {
    setImageUploadError(''); // Clear any previous errors
    onImageUpload(file);
  };

  const handleValidationError = (error: string) => {
    setImageUploadError(error);
  };

  const clearFieldError = (field: string) => {
    formik.setFieldError(field, undefined);
  };

  return (
    <div>
      {showWelcome && (
        <div className="mb-5">
          <span className="font-satoshi-bold text-[24px] sm:text-[30px] text-white">
            Welcome to{' '}
            <span className="text-[#4EF162] font-satoshi-bold text-[24px] sm:text-[30px]">
              Athlitics 🙌
            </span>
          </span>
          <div className="mt-2">
            <span className="font-satoshi-variable text-[16px] sm:text-[18px] text-[#C5C3C3] font-normal">
              Finish setting up your profile and get verified to host your own tournaments
            </span>
          </div>
        </div>
      )}
      {showTitle && (
        <h1 className="text-white font-satoshi-bold text-[18px] sm:text-[22px] pb-[35px]">
          {title}
        </h1>
      )}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
        <Avatar
          src={uploadedImage || updatedLogo || formik.values.organization_profile}
          name={formik.values?.organization_name}
          size={80}
        />
        <div className="flex flex-col gap-2">
          {pendingLogoFile || updatedLogo || uploadedImage ? (
            <>
              <Button
                type="button"
                onClick={handleRemoveLogo}
                className="font-tt-norms-pro-medium text-[14px] text-white w-full px-4 sm:px-0sm:w-[153px] h-[40px] hover:bg-[#e53935] rounded-[84px] flex items-center justify-center bg-[#e53935] cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                Remove your logo
              </Button>
              {pendingLogoFile && (
                <span className="text-yellow-500 text-xs font-satoshi-variable">
                  📄 {pendingLogoFile.name} (pending upload)
                </span>
              )}
            </>
          ) : (
            <FileUploadButton
              onFileChange={handleImageUpload}
              onValidationError={handleValidationError}
              className="font-tt-norms-pro-medium text-[14px] text-black w-full px-4 sm:px-0 sm:w-[153px] h-[40px] hover:bg-[#3DBF50] rounded-[84px] flex items-center justify-center bg-[#4EF162] cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              Upload your logo
            </FileUploadButton>
          )}
          {imageUploadError && (
            <span className="text-red-500 text-sm font-satoshi-variable">{imageUploadError}</span>
          )}
        </div>
      </div>
      <form className=" pt-[30px] w-full max-w-[736px]">
        <FormInput
          label="Organisation Name"
          id="organization_name"
          placeholder="Enter Organisation Name"
          inputClassName="h-[56px] sm:w-full lg:w-[880px]"
          value={formik.values?.organization_name || ''}
          onChange={(e) => {
            formik.setFieldValue('organization_name', e.target.value);
            if (e.target.value.trim()) clearFieldError('organization_name');
          }}
          error={hasSubmitted ? formik.errors.organization_name : undefined}
        />
        <div className="mt-5 flex flex-col lg:flex-row lg:items-start gap-3">
          <FormInput
            label="Organizer First Name"
            id="organizer_name"
            placeholder="First Name"
            inputClassName="h-[56px] w-full lg:w-[435px]"
            value={firstName}
            onChange={(e) => {
              const newFirstName = e.target.value;
              setFirstName(newFirstName);

              const combinedName = (newFirstName.trim() + ' ' + lastName.trim()).trim();
              formik.setFieldValue('organizer_name', combinedName);

              // Clear errors when both names are provided
              if (newFirstName.trim() && lastName.trim()) {
                clearFieldError('organizer_name');
              }
            }}
            error={hasSubmitted && !firstName.trim() ? 'First name is required' : undefined}
          />
          <FormInput
            label="Organizer Last Name"
            id="organizer_name"
            placeholder="Last Name"
            inputClassName="h-[56px] w-full lg:w-[435px]"
            value={lastName}
            onChange={(e) => {
              const newLastName = e.target.value;
              setLastName(newLastName);

              const combinedName = (firstName.trim() + ' ' + newLastName.trim()).trim();
              formik.setFieldValue('organizer_name', combinedName);

              // Clear errors when both names are provided
              if (firstName.trim() && newLastName.trim()) {
                clearFieldError('organizer_name');
              }
            }}
            error={
              hasSubmitted && !lastName.trim()
                ? 'Last name is required'
                : hasSubmitted &&
                    firstName.trim() &&
                    lastName.trim() &&
                    formik.errors.organizer_name
                  ? formik.errors.organizer_name
                  : undefined
            }
          />
        </div>
        <div className="mt-5 flex flex-col lg:flex-row lg:items-start gap-3">
          <FormInput
            label="Phone Number"
            id="mobile_number"
            type="number"
            placeholder="Enter Phone Number"
            inputClassName="h-[56px] w-full lg:w-[435px]"
            value={formik.values?.mobile_number || ''}
            onChange={(e) => {
              formik.setFieldValue('mobile_number', e.target.value);
              if (e.target.value.trim()) clearFieldError('mobile_number');
            }}
            error={hasSubmitted ? formik.errors.mobile_number : undefined}
            readOnly
            disabled
            isMobileNumber={true}
          />
          <FormInput
            label="Email Id"
            id="organization_email"
            type="email"
            placeholder="Enter Email Id"
            inputClassName="h-[56px] w-full lg:w-[435px]"
            value={formik.values?.organization_email || ''}
            onChange={(e) => {
              formik.setFieldValue('organization_email', e.target.value);
              if (EMAIL_REGEX.test(e.target.value.trim())) clearFieldError('organization_email');
            }}
            error={hasSubmitted ? formik.errors.organization_email : undefined}
          />
        </div>
        <FormInput
          className="mt-5"
          label="Website Link (Optional)"
          id="website_link"
          placeholder="Enter Website Link"
          inputClassName="h-[56px] sm:w-full lg:w-[880px]"
          value={formik.values?.website_link || ''}
          onChange={(e) => formik.setFieldValue('website_link', e.target.value)}
        />
        <div className="mt-5">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sociallink" className="font-satoshi-variable text-[14px] text-white">
                Social Link (Optional)
              </Label>
              <span
                className="text-[#4EF162] font-satoshi-variable text-[14px] font-[400] cursor-pointer"
                onClick={handleAddSocialLink}
              >
                +Add More
              </span>
            </div>
            <Input
              showFocusBorder={false}
              id="social_links"
              type="text"
              placeholder="Eg: Instagram, Facebook etc"
              className="h-[56px] sm:w-full lg:w-[880px] font-satoshi-variable font-[500] text-[16px]"
              value={socialLinks[0] || ''}
              onChange={(e) => handleSocialLinkChange(0, e.target.value)}
            />
            {socialLinks.slice(1).map((link, index) => (
              <div key={index + 1} className="flex items-center gap-2 mt-2">
                <Input
                  showFocusBorder={false}
                  id={`sociallink-${index + 1}`}
                  type="text"
                  value={link}
                  onChange={(e) => handleSocialLinkChange(index + 1, e.target.value)}
                  placeholder="Eg: Instagram, Facebook etc"
                  className="h-[56px] w-full max-w-[840px] font-satoshi-variable font-[500] text-[16px]"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSocialLink(index + 1)}
                  className="w-[24px] h-[24px] flex items-center justify-center"
                >
                  <Trash2 className="cursor-pointer" color="white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileDetails;
