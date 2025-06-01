import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
  DocumentTextIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const GET_ERP_DATA = gql`
  query GetERPData($partNumber: String!) {
    erpData(partNumber: $partNumber) {
      partNumber
      description
      revision
      status
      metadata
    }
  }
`;

interface ERPDataViewerProps {
  partNumber: string;
}

export default function ERPDataViewer({ partNumber }: ERPDataViewerProps) {
  const { loading, error, data } = useQuery(GET_ERP_DATA, {
    variables: { partNumber },
  });

  if (loading) return <div>Loading ERP data...</div>;
  if (error) return <div>Error loading ERP data: {error.message}</div>;

  const { erpData } = data;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {erpData.partNumber}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {erpData.description}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              erpData.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {erpData.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Part Details</h4>
            </div>
            <dl className="mt-2 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Revision</dt>
                <dd className="mt-1 text-sm text-gray-900">{erpData.revision}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.description}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <CubeIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Material</h4>
            </div>
            <dl className="mt-2 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.metadata.material?.type || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Grade</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.metadata.material?.grade || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">BOM</h4>
            </div>
            <dl className="mt-2 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Components</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.metadata.bom?.components?.length || 0} items
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Cost</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${erpData.metadata.bom?.totalCost?.toFixed(2) || '0.00'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <TagIcon className="h-5 w-5 text-gray-400 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Inventory</h4>
            </div>
            <dl className="mt-2 space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.metadata.inventory?.quantity || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {erpData.metadata.inventory?.location || 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 