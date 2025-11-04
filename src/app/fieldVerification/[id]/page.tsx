'use client';
import {
  getIdFormatHint,
  validateFormData,
  validateIdNumber,
} from '@/app/fieldVerification/validationSchemas';
import { StorageService } from '@/app/utils/storageService';
import { DragDropFileUpload } from '@/components/dragDropFileUpload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkBox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingOverlay from '@/components/ui/loadingOverlay';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioBoxGroup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import useFieldVerificationStore, {
  FieldVerificationFormData,
  GpsLocationData,
  IdProofData,
  VenuePhotoData,
} from '@/services/fieldVerificationService';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const FieldVerification = () => {
  const params = useParams();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const token = params.id as string;

  // Store state
  const { getAssignmentByToken, uploadIdPhoto, submitVerification } = useFieldVerificationStore();

  // Form state
  const [formData, setFormData] = useState<Partial<FieldVerificationFormData>>({});
  const [currentLocation, setCurrentLocation] = useState<GpsLocationData | null>(null);

  // File upload states
  const [idPhotoKey, setIdPhotoKey] = useState<string>('');
  const [organizerVenuePhotoKey, setOrganizerVenuePhotoKey] = useState<string>('');
  const [venuePhotoKeys, setVenuePhotoKeys] = useState<VenuePhotoData[]>([]);

  // Form validation and submission
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load assignment data on mount
  useEffect(() => {
    if (token) {
      loadAssignmentData();
      getCurrentLocation();
    }
  }, [token]);

  const loadAssignmentData = async () => {
    try {
      setShowLoading(true);
      const assignmentData = await getAssignmentByToken(token);
      if (assignmentData) {
        // Pre-fill form with assignment data
        setFormData({
          verifier_token: token,
          organizer_verification: {
            organizer_name: assignmentData.organizer.organizer_name,
            contact_number: assignmentData.organizer.mobile_number,
            id_proof: {
              id_type: 'AADHAAR',
              id_number: '',
            } as IdProofData,
          },
          venue_verification: {
            venue_name: assignmentData.organizer.venue,
            venue_address: assignmentData.organizer.venue_address,
            venue_photos: [],
            gps_location: currentLocation || { latitude: 0, longitude: 0, accuracy: 0 },
            venue_preparedness: {
              equipment_available: false,
              safety_arrangements: false,
              seating_arrangements: false,
              ground_condition_ok: false,
            },
          },
          authenticity_checks: {
            branding_present: false,
            discrepancies: '',
          },
          final_verification: {
            verifier_comments: '',
            status: 'APPROVED' as const,
          },
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error('Failed to load assignment data:', error);

      // Handle 401 Unauthorized error
      if (error?.isUnauthorized || error?.redirectToLogin) {
        StorageService.authToken.clear();

        sessionStorage.setItem('fieldVerificationToken', token);

        toast.error('Your session has expired. Please login again to access this verification');

        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      toast.error('Failed to load verification data');
    } finally {
      setShowLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GpsLocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCurrentLocation(location);

          // Update form data with GPS location
          setFormData((prev) => ({
            ...prev,
            venue_verification: {
              ...prev.venue_verification!,
              gps_location: location,
            },
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // File upload handlers
  const handleIdPhotoUpload = async (file: File | null) => {
    if (!file) return;

    try {
      const response = await uploadIdPhoto(file);
      setIdPhotoKey(response.key);
      clearValidationError('id_photo');

      // Update form data
      setFormData((prev) => ({
        ...prev,
        organizer_verification: {
          ...prev.organizer_verification!,
          id_proof: {
            ...prev.organizer_verification!.id_proof!,
            id_photo_key: response.key,
          },
        },
      }));
      toast.success('ID photo uploaded successfully');
    } catch (error: any) {
      console.error('Failed to upload ID photo:', error);
      const errorMessage =
        error?.message || 'Failed to upload ID photo';

      // Handle 401 Unauthorized error
      if (error?.isUnauthorized || error?.redirectToLogin) {
        StorageService.authToken.clear();

        toast.error('Your session has expired. Please login again to upload files');
        setTimeout(() => {
          sessionStorage.setItem('fieldVerificationToken', token);
          router.push('/login');
        }, 2000);
        return;
      }

      toast.error(errorMessage);
    }
  };

  const handleOrganizerVenuePhotoUpload = async (file: File | null) => {
    if (!file) return;

    try {
      const response = await uploadIdPhoto(file);
      setOrganizerVenuePhotoKey(response.key);
      clearValidationError('organizer_venue_photo');
      toast.success('Organizer venue photo uploaded successfully');
    } catch (error: any) {
      console.error('Failed to upload organizer venue photo:', error);
      const errorMessage =
        error?.message || 'Failed to upload organizer venue photo';
      // Handle 401 Unauthorized error
      if (error?.isUnauthorized || error?.redirectToLogin) {
        StorageService.authToken.clear();

        toast.error('Your session has expired. Please login again to upload files');
        setTimeout(() => {
          sessionStorage.setItem('fieldVerificationToken', token);
          router.push('/login');
        }, 2000);
        return;
      }

      toast.error(errorMessage);
    }
  };

  const handleMultipleVenuePhotosUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      setVenuePhotoKeys([]);
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        const response = await uploadIdPhoto(file);
        return {
          photo_key: response.key,
          photo_type: 'OTHER' as const,
          gps_latitude: currentLocation?.latitude,
          gps_longitude: currentLocation?.longitude,
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setVenuePhotoKeys(uploadedPhotos);
      clearValidationError('venue_photos');
      toast.success(`${files.length} venue photos uploaded successfully`);
    } catch (error: any) {
      console.error('Failed to upload venue photos:', error);
      const errorMessage =
        error?.message || 'Failed to upload venue photos';
      if (error?.isUnauthorized || error?.redirectToLogin) {
        StorageService.authToken.clear();

        toast.error('Your session has expired. Please login again to upload files');
        setTimeout(() => {
          sessionStorage.setItem('fieldVerificationToken', token);
          router.push('/login');
        }, 2000);
        return;
      }

      toast.error(errorMessage);
    }
  };

  // Form field update handlers
  const clearValidationError = (fieldName: string) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const updateFormField = (path: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateVenuePreparedness = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      venue_verification: {
        ...prev.venue_verification!,
        venue_preparedness: {
          ...prev.venue_verification!.venue_preparedness,
          [field]: value,
        },
      },
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    // Build complete form data for validation
    const completeFormData = {
      verifier_token: token,
      verifier_id: 'web_verifier',
      organizer_verification: {
        ...formData.organizer_verification,
        id_proof: {
          ...formData.organizer_verification?.id_proof,
          id_photo_key: idPhotoKey,
        },
        organizer_venue_photo_key: organizerVenuePhotoKey,
      },
      venue_verification: {
        ...formData.venue_verification,
        venue_photos: venuePhotoKeys,
      },
      authenticity_checks: formData.authenticity_checks,
      final_verification: formData.final_verification,
    };

    // Use the validation schema
    const errors = validateFormData(completeFormData);

    // Convert some specific validation errors to simpler field names for UI
    const uiErrors: Record<string, string> = {};

    Object.keys(errors).forEach((key) => {
      if (key.includes('organizer_verification_organizer_name')) {
        uiErrors.organizer_name = errors[key];
      } else if (key.includes('organizer_verification_contact_number')) {
        uiErrors.contact_number = errors[key];
      } else if (key.includes('organizer_verification_id_proof_id_type')) {
        uiErrors.id_type = errors[key];
      } else if (key.includes('organizer_verification_id_proof_id_number')) {
        uiErrors.id_number = errors[key];
      } else if (key.includes('organizer_verification_id_proof_id_photo_key')) {
        uiErrors.id_photo = errors[key];
      } else if (key.includes('organizer_verification_organizer_venue_photo_key')) {
        uiErrors.organizer_venue_photo = errors[key];
      } else if (key.includes('venue_verification_venue_photos')) {
        uiErrors.venue_photos = errors[key];
      } else if (key.includes('final_verification_verifier_comments')) {
        uiErrors.verifier_comments = errors[key];
      } else {
        uiErrors[key] = errors[key];
      }
    });

    setValidationErrors(uiErrors);
    return Object.keys(uiErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      // Auto-scroll to first error field
      setTimeout(() => {
        if (Object.keys(validationErrors).length > 0) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          // Map error keys to input IDs
          const errorKeyToId: Record<string, string> = {
            organizer_name: 'organizerName',
            id_type: 'idTypeSelect',
            id_number: 'idNumber',
            id_photo: 'idPhotoUpload',
            contact_number: 'contactNumber',
            organizer_venue_photo: 'organizerVenuePhotoUpload',
            venue_photos: 'venuePhotosUpload',
          };
          const el = document.getElementById(errorKeyToId[firstErrorKey] || firstErrorKey);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100); // Small delay to ensure validation errors are updated
      return;
    }

    if (
      !formData.organizer_verification ||
      !formData.venue_verification ||
      !formData.final_verification
    ) {
      console.error('Form data is incomplete');
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData: FieldVerificationFormData = {
        verifier_token: token,
        verifier_id: 'web_verifier', // Can be made dynamic
        organizer_verification: {
          ...formData.organizer_verification,
          id_proof: {
            ...formData.organizer_verification.id_proof!,
            id_photo_key: idPhotoKey,
          },
          organizer_venue_photo_key: organizerVenuePhotoKey,
        },
        venue_verification: {
          ...formData.venue_verification,
          venue_photos: venuePhotoKeys,
        },
        authenticity_checks: formData.authenticity_checks!,
        final_verification: formData.final_verification,
      };

      const response = await submitVerification(submissionData);

      if (response.success) {
        toast.success(`Verification submitted successfully! Status: ${response.data.final_status}`);
        setShowLoading(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        // Handle unsuccessful response
        toast.error(response.message || 'Verification submission was not successful');
        setShowLoading(false);
      }
    } catch (err: any) {
      console.error('Error verifying :', err);

      // Handle 401 Unauthorized error
      if (err?.isUnauthorized || err?.redirectToLogin) {
        // Clear any expired or invalid tokens
        StorageService.authToken.clear();

        toast.error('Your session has expired. Please login again to submit verification');
        setTimeout(() => {
          sessionStorage.setItem('fieldVerificationToken', token);
          router.push('/login');
        }, 2000);
        return;
      }

      const errorMessage = err?.message || err?.error || 'Failed to verify';
      toast.error(errorMessage);
      setShowLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showLoading && <LoadingOverlay />}
      <div className="max-w-screen mx-auto px-4 md:px-16 xl:px-88 py-6 md:py-8 xl:py-12 h-auto bg-[#16171B]">
        {/* Logo */}
        <div className="flex justify-center mb-4 md:mb-5 xl:mb-6">
          <Image
            src="/images/athliticsLogo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="md:w-[70px] md:h-[70px] xl:w-[80px] xl:h-[80px]"
          />
        </div>
        {/* Heading */}
        <h2 className="text-xl md:text-2xl xl:text-2xl text-white font-bold text-center mb-6 md:mb-7 xl:mb-8">
          Field Verification
        </h2>

        {/* Organizer Verification */}
        <div className="mb-6 md:mb-7 xl:mb-8">
          <h3 className="text-base md:text-lg xl:text-lg text-white font-semibold mb-3 md:mb-4 xl:mb-4">
            Organizer Verification
          </h3>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label
              htmlFor="organizerName"
              className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
            >
              1. Organizer Name
            </Label>
            <Input
              id="organizerName"
              type="text"
              className="h-[45px] md:h-[48px] xl:h-[50px] text-sm md:text-base"
              placeholder="Enter Organizer Name"
              value={formData.organizer_verification?.organizer_name || ''}
              onChange={(e) => {
                updateFormField('organizer_verification.organizer_name', e.target.value);
                if (e.target.value.trim()) {
                  clearValidationError('organizer_name');
                }
              }}
            />
            {validationErrors.organizer_name && (
              <span className="text-red-500 text-xs md:text-sm">
                {validationErrors.organizer_name}
              </span>
            )}
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label
              htmlFor="idType"
              className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
            >
              2. ID Proof of Organizer
            </Label>
            <ul className="list-disc pl-4 md:pl-6 xl:pl-6 mt-3 md:mt-4 xl:mt-4 text-white space-y-3 md:space-y-4 xl:space-y-4">
              <li>
                <div>
                  <Label
                    htmlFor="idTypeSelect"
                    className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
                  >
                    ID Type
                  </Label>
                  <div className="w-full">
                    <Select
                      value={formData.organizer_verification?.id_proof?.id_type || ''}
                      onValueChange={(value: 'AADHAAR' | 'DL' | 'PASSPORT' | 'OTHER') => {
                        updateFormField('organizer_verification.id_proof.id_type', value);
                        clearValidationError('id_type');

                        // Re-validate ID number if it exists
                        const idNumber = formData.organizer_verification?.id_proof?.id_number || '';
                        if (idNumber.trim()) {
                          clearValidationError('id_number');
                          const validationError = validateIdNumber(value, idNumber);
                          if (validationError) {
                            setValidationErrors((prev) => ({
                              ...prev,
                              id_number: validationError,
                            }));
                          }
                        }
                      }}
                    >
                      <SelectTrigger
                        className="w-full !h-[45px] md:!h-[48px] xl:!h-[50px] text-sm md:text-base"
                        id="idTypeSelect"
                      >
                        <SelectValue placeholder="Select ID Type" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="AADHAAR">Aadhaar</SelectItem>
                        <SelectItem value="DL">Driver's License</SelectItem>
                        <SelectItem value="PASSPORT">Passport</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.id_type && (
                      <span className="text-red-500 text-xs md:text-sm">
                        {validationErrors.id_type}
                      </span>
                    )}
                  </div>
                </div>
              </li>
              <li>
                <div>
                  <Label
                    htmlFor="idNumber"
                    className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
                  >
                    ID Number
                  </Label>
                  <Input
                    id="idNumber"
                    type="text"
                    className="h-[45px] md:h-[48px] xl:h-[50px] text-sm md:text-base"
                    placeholder="Enter ID Number"
                    value={formData.organizer_verification?.id_proof?.id_number || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const idType = formData.organizer_verification?.id_proof?.id_type || '';

                      updateFormField('organizer_verification.id_proof.id_number', value);

                      // Clear previous error
                      clearValidationError('id_number');

                      // Validate if both ID type and number are present
                      if (idType && value.trim()) {
                        const validationError = validateIdNumber(idType, value);
                        if (validationError) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            id_number: validationError,
                          }));
                        }
                      }
                    }}
                  />
                  {formData.organizer_verification?.id_proof?.id_type && (
                    <div className="text-gray-400 text-xs mt-1">
                      {getIdFormatHint(formData.organizer_verification.id_proof.id_type)}
                    </div>
                  )}
                  {validationErrors.id_number && (
                    <span className="text-red-500 text-xs md:text-sm">
                      {validationErrors.id_number}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <div>
                  <Label
                    htmlFor="idPhoto"
                    className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
                  >
                    Upload ID Photo
                  </Label>
                  {/* DragDropFileUpload for ID Photo */}
                  <div id="idPhotoUpload">
                    <DragDropFileUpload
                      onFileChange={handleIdPhotoUpload}
                      defaultImageSrc="/images/image.svg"
                      isDragAndDropEnabled={true}
                      placeholderText="Upload or Drag & Drop ID Photo"
                      acceptedFormats={['.png', '.jpeg', '.jpg']}
                      maxFileSizeMB={2}
                      className="mt-2"
                    />
                  </div>
                  {idPhotoKey && (
                    <div className="text-green-500 text-xs md:text-sm mt-2">
                      ✓ ID photo uploaded successfully
                    </div>
                  )}
                  {validationErrors.id_photo && (
                    <span className="text-red-500 text-xs md:text-sm">
                      {validationErrors.id_photo}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label
              htmlFor="contactNumber"
              className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
            >
              3. Contact Number
            </Label>
            <Input
              id="contactNumber"
              type="text"
              className="h-[45px] md:h-[48px] xl:h-[50px] text-sm md:text-base"
              placeholder="Enter Contact Number"
              value={formData.organizer_verification?.contact_number || ''}
              onChange={(e) => {
                updateFormField('organizer_verification.contact_number', e.target.value);
                if (e.target.value.trim()) {
                  clearValidationError('contact_number');
                }
              }}
            />
            {validationErrors.contact_number && (
              <span className="text-red-500 text-xs md:text-sm">
                {validationErrors.contact_number}
              </span>
            )}
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label
              htmlFor="organizerVenuePhoto"
              className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
            >
              4. Photo of Organizer with Venue
            </Label>
            {/* DragDropFileUpload for Organizer with Venue Photo */}
            <div id="organizerVenuePhotoUpload">
              <DragDropFileUpload
                onFileChange={handleOrganizerVenuePhotoUpload}
                isDragAndDropEnabled={true}
                defaultImageSrc="/images/image.svg"
                placeholderText="Upload or Drag & Drop Organizer with Venue Photo"
                acceptedFormats={['.png', '.jpeg', '.jpg']}
                maxFileSizeMB={2}
                className="mt-2"
              />
            </div>
            {organizerVenuePhotoKey && (
              <div className="text-green-500 text-xs md:text-sm mt-2">
                ✓ Organizer venue photo uploaded successfully
              </div>
            )}
            {validationErrors.organizer_venue_photo && (
              <span className="text-red-500 text-xs md:text-sm">
                {validationErrors.organizer_venue_photo}
              </span>
            )}
          </div>
        </div>

        {/* Venue Verification */}
        <div className="mb-6 md:mb-7 xl:mb-8">
          <h3 className="text-base md:text-lg xl:text-lg font-semibold mb-3 md:mb-4 xl:mb-4 text-white">
            Venue Verification
          </h3>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label
              htmlFor="venueNameAddress"
              className="mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base"
            >
              5. Venue Name & Address
            </Label>
            <Textarea
              id="venueNameAddress"
              className="w-full text-white text-sm md:text-base min-h-[80px] md:min-h-[100px]"
              placeholder="Enter Address"
              value={`${formData.venue_verification?.venue_name || ''}\n${formData.venue_verification?.venue_address || ''}`}
              onChange={(e) => {
                const lines = e.target.value.split('\n');
                updateFormField('venue_verification.venue_name', lines[0] || '');
                updateFormField(
                  'venue_verification.venue_address',
                  lines.slice(1).join('\n') || ''
                );
              }}
            />
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              6. Venue Photos (Minimum 2 Uploads)
            </Label>
            <div id="venuePhotosUpload">
              <DragDropFileUpload
                onFileChange={() => { }}
                onFilesChange={handleMultipleVenuePhotosUpload}
                defaultImageSrc="/images/image.svg"
                allowMultiple={true}
                maxFiles={2}
                isDragAndDropEnabled={true}
                placeholderText="Upload or Drag & Drop Venue Photos (Min 2 required)"
                acceptedFormats={['.png', '.jpeg', '.jpg']}
                maxFileSizeMB={2}
                className="mt-2"
              />
            </div>
            {venuePhotoKeys.length > 0 && (
              <div className="text-green-500 text-xs md:text-sm mt-2">
                ✓ {venuePhotoKeys.length} venue photo(s) uploaded
              </div>
            )}
            {validationErrors.venue_photos && (
              <span className="text-red-500 text-xs md:text-sm">
                {validationErrors.venue_photos}
              </span>
            )}
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              7. GPS Location
            </Label>
            <Input
              type="text"
              className="w-full h-[45px] md:h-[48px] xl:h-[50px] cursor-not-allowed opacity-50 text-sm md:text-base"
              placeholder="Location"
              disabled
              value={
                currentLocation
                  ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
                  : 'Getting location...'
              }
              readOnly
            />
            {currentLocation && (
              <div className="text-green-500 text-xs md:text-sm mt-2 md:mt-3 xl:mt-4">
                ✓ Location captured (Accuracy: ±{currentLocation.accuracy.toFixed(0)}m)
              </div>
            )}
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              8. Venue Preparedness
            </Label>
            <div className="flex flex-col gap-2 md:gap-3 xl:gap-3">
              <Label className="flex items-center gap-2 text-white text-sm md:text-base">
                <Checkbox
                  className="cursor-pointer"
                  checked={
                    formData.venue_verification?.venue_preparedness?.equipment_available || false
                  }
                  onCheckedChange={(checked) =>
                    updateVenuePreparedness('equipment_available', checked as boolean)
                  }
                />
                <span>Sports equipment available</span>
              </Label>
              <Label className="flex items-center gap-2 text-white text-sm md:text-base">
                <Checkbox
                  className="cursor-pointer"
                  checked={
                    formData.venue_verification?.venue_preparedness?.safety_arrangements || false
                  }
                  onCheckedChange={(checked) =>
                    updateVenuePreparedness('safety_arrangements', checked as boolean)
                  }
                />
                <span>Safety arrangements visible</span>
              </Label>
              <Label className="flex items-center gap-2 text-white text-sm md:text-base">
                <Checkbox
                  checked={
                    formData.venue_verification?.venue_preparedness?.seating_arrangements || false
                  }
                  className="cursor-pointer"
                  onCheckedChange={(checked) =>
                    updateVenuePreparedness('seating_arrangements', checked as boolean)
                  }
                />
                <span>Seating / audience arrangements</span>
              </Label>
              <Label className="flex items-center gap-2 text-white text-sm md:text-base">
                <Checkbox
                  checked={
                    formData.venue_verification?.venue_preparedness?.ground_condition_ok || false
                  }
                  className="cursor-pointer"
                  onCheckedChange={(checked) =>
                    updateVenuePreparedness('ground_condition_ok', checked as boolean)
                  }
                />
                <span>Ground/track condition acceptable</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Event Authenticity Checks */}
        <div className="mb-6 md:mb-7 xl:mb-8">
          <h3 className="text-base md:text-lg xl:text-lg font-semibold mb-3 md:mb-4 xl:mb-4 text-white">
            Event Authenticity Checks
          </h3>
          <div className="mb-3 md:mb-4 xl:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <Label className="font-medium text-white text-sm md:text-base">
              9. Presence of Branding/Signage
            </Label>
            <Switch
              className="data-[state=checked]:bg-[#4EF162] cursor-pointer"
              checked={formData.authenticity_checks?.branding_present || false}
              onCheckedChange={(checked) =>
                updateFormField('authenticity_checks.branding_present', checked)
              }
            />
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              10. Any Discrepancies Noticed
            </Label>
            <Textarea
              placeholder="Enter details..."
              className="text-white text-sm md:text-base min-h-[80px] md:min-h-[100px]"
              value={formData.authenticity_checks?.discrepancies || ''}
              onChange={(e) => updateFormField('authenticity_checks.discrepancies', e.target.value)}
            />
          </div>
        </div>

        {/* Final Verification */}
        <div className="mb-6 md:mb-7 xl:mb-8">
          <h3 className="text-base md:text-lg xl:text-lg font-semibold mb-3 md:mb-4 xl:mb-4 text-white">
            Final Verification
          </h3>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              11. Verifier's Comments
            </Label>
            <Textarea
              placeholder="comments..."
              className="text-white text-sm md:text-base min-h-[80px] md:min-h-[100px]"
              value={formData.final_verification?.verifier_comments || ''}
              onChange={(e) => {
                updateFormField('final_verification.verifier_comments', e.target.value);
                if (e.target.value.trim()) {
                  clearValidationError('verifier_comments');
                }
              }}
            />
            {validationErrors.verifier_comments && (
              <span className="text-red-500 text-xs md:text-sm">
                {validationErrors.verifier_comments}
              </span>
            )}
          </div>
          <div className="mb-3 md:mb-4 xl:mb-4">
            <Label className="block font-medium mb-2 md:mb-3 xl:mb-4 text-white text-sm md:text-base">
              12. Status
            </Label>
            <RadioGroup
              value={formData.final_verification?.status || 'APPROVED'}
              onValueChange={(value) =>
                updateFormField(
                  'final_verification.status',
                  value as 'APPROVED' | 'REJECTED' | 'PENDING'
                )
              }
              className="flex flex-col gap-2 sm:flex-row sm:gap-4"
            >
              <RadioGroupItem
                value="APPROVED"
                className="w-full text-sm md:text-base"
                id="approved"
              >
                Approved
              </RadioGroupItem>
              <RadioGroupItem
                value="REJECTED"
                className="w-full text-sm md:text-base"
                id="rejected"
              >
                Rejected
              </RadioGroupItem>
              <RadioGroupItem value="PENDING" className="w-full text-sm md:text-base" id="pending">
                Needs Review
              </RadioGroupItem>
            </RadioGroup>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6 md:mt-7 xl:mt-8">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#4EF162] text-black font-semibold px-6 md:px-7 xl:px-8 py-3 md:py-3 xl:py-3 rounded hover:bg-[#3ad14c] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full sm:w-auto min-w-[120px] md:min-w-[140px]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FieldVerification;
