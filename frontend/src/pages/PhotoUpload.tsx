import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const UPLOAD_PHOTO = gql`
  mutation UploadPhoto($file: Upload!, $projectId: ID) {
    uploadPhoto(file: $file, projectId: $projectId) {
      id
      fileName
      s3Url
    }
  }
`;

export default function PhotoUpload() {
  const [uploadPhoto] = useMutation(UPLOAD_PHOTO);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setError(null);

      for (const file of acceptedFiles) {
        await uploadPhoto({
          variables: {
            file,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  }, [uploadPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Upload Photos
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Upload photos to start annotating and collaborating.</p>
            </div>
            <div className="mt-5">
              <div
                {...getRootProps()}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
              >
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        {...getInputProps()}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                  <span className="ml-2 text-sm text-gray-500">Uploading...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4">
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error uploading photo
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 