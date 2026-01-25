import React, { useState, useEffect } from 'react';
import { PublicLayout } from '../components/common/layouts/PublicLayout';
import { AdminSetupForm } from '../components/auth/AdminSetupForm';

interface SetupStatus {
  needsSetup: boolean;
  isLoading: boolean;
  error?: string;
  success?: boolean;
}

export const SetupPage: React.FC = () => {
  const [setupStatus, setSetupStatus] = useState<SetupStatus>({
    needsSetup: true,
    isLoading: true
  });

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/v1/admin/setup/check');
      const data = await response.json();
      
      setSetupStatus({
        needsSetup: data.needsSetup,
        isLoading: false
      });
    } catch (error) {
      setSetupStatus({
        needsSetup: true,
        isLoading: false,
        error: 'Failed to check setup status'
      });
    }
  };

  const handleAdminSubmit = async (data: { name: string; email: string; password: string; profile_picture_url?: string }) => {
    try {
      setSetupStatus(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      const response = await fetch('/api/v1/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSetupStatus({
          needsSetup: false,
          isLoading: false,
          success: true
        });
      } else {
        setSetupStatus({
          needsSetup: true,
          isLoading: false,
          error: result.message || 'Failed to create admin'
        });
      }
    } catch (error) {
      setSetupStatus({
        needsSetup: true,
        isLoading: false,
        error: 'Network error occurred'
      });
    }
  };

  if (setupStatus.isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking setup status...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (setupStatus.success) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <div className="mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your admin account has been created. You can now start using the platform.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> The platform is ready for use. You can now log in with your admin credentials and start setting up subjects, content, and manage users.
              </p>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!setupStatus.needsSetup) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Platform Already Configured
            </h2>
            <p className="text-gray-600">
              This platform has already been set up. Please contact your administrator if you need access.
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Freeducation
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Let's set up your admin account to get started
            </p>
          </div>

          {setupStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{setupStatus.error}</p>
                </div>
              </div>
            </div>
          )}

          <AdminSetupForm 
            onSubmit={handleAdminSubmit}
            isLoading={setupStatus.isLoading}
          />
        </div>
      </div>
    </PublicLayout>
  );
};
