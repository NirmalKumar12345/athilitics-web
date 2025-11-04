'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AthliticsLogo from '../../../../public/images/athliticsLogo.svg';

export default function DataDeletionRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    reason: '',
    additionalInfo: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual backend API endpoint
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_BASE_URL}/api/data-deletion-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          reason: formData.reason,
          additionalInfo: formData.additionalInfo.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit data deletion request');
      }

      const result = await response.json();
      console.log('Data deletion request submitted successfully:', result);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error submitting data deletion request:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-white">
        <div className="flex flex-col items-center mb-8">
          <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
        </div>
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-[#4EF162] mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Request Submitted Successfully</h1>
          <p className="text-lg mb-6">
            Thank you for submitting your data deletion request. We have received your request and
            will process it within 30 days as required by applicable privacy laws.
          </p>
          <p className="mb-8">
            You will receive a confirmation email at <strong>{formData.email}</strong> with details
            about your request and next steps.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              className="bg-[#4EF162] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#3ec14e] transition-colors"
              onClick={() => router.push('/')}
            >
              Return to Home
            </Button>
            <Button
              className="border border-[#4EF162] text-[#4EF162] font-semibold px-6 py-2 rounded shadow hover:bg-[#4EF162] hover:text-black transition-colors"
              onClick={() => setIsSubmitted(false)}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="flex flex-col items-center mb-8">
        <Image src={AthliticsLogo} alt="Athlitics Logo" width={80} height={80} />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">Data Deletion Request</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Right to Data Deletion</h2>
        <p className="mb-4">
          As part of our commitment to your privacy, you have the right to request deletion of your
          personal data from our systems. This includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Account information (name, email, phone number)</li>
          <li>Player profiles and tournament participation data</li>
          <li>Payment information (processed securely through third parties)</li>
          <li>Any other personal data we have collected</li>
        </ul>
        <p className="mb-4">
          <strong>Please note:</strong> Some data may be retained for legal compliance, security
          purposes, or to fulfill contractual obligations. We will delete all data that can be
          legally removed.
        </p>
        <p className="mb-6">
          Processing typically takes up to 30 days. You will receive confirmation once your request
          has been completed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4EF162] focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4EF162] focus:border-transparent"
            placeholder="Enter your email address"
          />
          <p className="text-sm text-gray-400 mt-1">
            This should be the email address associated with your Athlitics account
          </p>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4EF162] focus:border-transparent"
            placeholder="Enter your phone number (optional)"
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-2">
            Reason for Data Deletion *
          </label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4EF162] focus:border-transparent"
          >
            <option value="">Select a reason</option>
            <option value="no-longer-using">No longer using the service</option>
            <option value="privacy-concerns">Privacy concerns</option>
            <option value="data-minimization">Data minimization</option>
            <option value="account-closure">Account closure</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#4EF162] focus:border-transparent"
            placeholder="Any additional information or specific requests regarding your data deletion..."
          />
        </div>

        <div className="bg-yellow-900/20 border border-yellow-600 rounded-md p-4">
          <h3 className="font-semibold text-yellow-400 mb-2">Important Notice</h3>
          <p className="text-sm text-yellow-200">
            By submitting this request, you acknowledge that deleting your data will permanently
            remove your account and all associated information. This action cannot be undone. You
            will lose access to your tournament history, rankings, and other account-related data.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-600 rounded-md p-4">
            <h3 className="font-semibold text-red-400 mb-2">Error</h3>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button
            type="button"
            className="border border-gray-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-gray-700 transition-colors"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4EF162] text-black font-semibold px-6 py-2 rounded shadow hover:bg-[#3ec14e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Request'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>
          Have questions? Contact us at{' '}
          <Link href="mailto:founder@athlitics.com" className="underline text-[#4EF162]">
            founder@athlitics.com
          </Link>
        </p>
      </div>
    </div>
  );
}
