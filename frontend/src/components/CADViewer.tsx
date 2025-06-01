import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { CubeIcon, DocumentIcon } from '@heroicons/react/24/outline';

const GET_CAD_DATA = gql`
  query GetCADData($id: ID!) {
    cadData(id: $id) {
      id
      name
      type
      version
      viewerUrl
      metadata
    }
  }
`;

interface CADViewerProps {
  cadId: string;
}

export default function CADViewer({ cadId }: CADViewerProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const { loading, error, data } = useQuery(GET_CAD_DATA, {
    variables: { id: cadId },
  });

  if (loading) return <div>Loading CAD data...</div>;
  if (error) return <div>Error loading CAD data: {error.message}</div>;

  const { cadData } = data;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {cadData.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Version: {cadData.version}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('2d')}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                viewMode === '2d'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              2D View
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                viewMode === '3d'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CubeIcon className="h-5 w-5 mr-2" />
              3D View
            </button>
          </div>
        </div>

        <div className="mt-4 aspect-w-16 aspect-h-9">
          {viewMode === '2d' ? (
            <iframe
              src={cadData.viewerUrl}
              className="w-full h-full rounded-lg"
              title="2D CAD Viewer"
            />
          ) : (
            <iframe
              src={`${cadData.viewerUrl}?mode=3d`}
              className="w-full h-full rounded-lg"
              title="3D CAD Viewer"
            />
          )}
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Metadata</h4>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {Object.entries(cadData.metadata).map(([key, value]) => (
              <div key={key} className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">{key}</dt>
                <dd className="mt-1 text-sm text-gray-900">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 