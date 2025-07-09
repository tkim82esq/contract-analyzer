'use client';

import { useState } from 'react';

const CONTRACT_TYPES = [
  {
    name: 'Employment Agreement',
    parties: ['Employer', 'Employee']
  },
  {
    name: 'Sales/Purchase Agreement',
    parties: ['Buyer', 'Seller']
  },
  {
    name: 'Service Agreement',
    parties: ['Service Provider', 'Client']
  },
  {
    name: 'Lease Agreement',
    parties: ['Landlord', 'Tenant']
  },
  {
    name: 'Loan Agreement',
    parties: ['Lender', 'Borrower']
  },
  {
    name: 'Software/SaaS Agreement',
    parties: ['Licensor', 'Licensee']
  },
  {
    name: 'NDA',
    parties: ['Disclosing Party', 'Receiving Party']
  }
];

interface PartySelectorProps {
  onSelectionComplete: (contractType: string, party: string) => void;
}

export default function PartySelector({ onSelectionComplete }: PartySelectorProps) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [step, setStep] = useState<'type' | 'party'>('type');

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep('party');
  };

  const handlePartySelect = (party: string) => {
    setSelectedParty(party);
    onSelectionComplete(selectedType, party);
  };

  const handleBack = () => {
    setStep('type');
    setSelectedParty('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {step === 'type' ? (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            What type of contract is this?
          </h2>
          <div className="grid gap-3">
            {CONTRACT_TYPES.map((type) => (
              <button
                key={type.name}
                onClick={() => handleTypeSelect(type.name)}
                className="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-500"
              >
                <span className="font-medium text-gray-900">{type.name}</span>
                <p className="text-sm text-gray-500 mt-1">
                  Parties: {type.parties.join(' / ')}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBack}
            className="mb-4 text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Which party are you in this {selectedType}?
          </h2>
          <p className="text-gray-600 mb-6">
            This helps us analyze risks from your perspective
          </p>
          
          <div className="grid gap-3">
            {CONTRACT_TYPES.find(t => t.name === selectedType)?.parties.map((party) => (
              <button
                key={party}
                onClick={() => handlePartySelect(party)}
                className="text-left p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-500"
              >
                <span className="font-medium text-gray-900 text-lg">{party}</span>
                {party === CONTRACT_TYPES.find(t => t.name === selectedType)?.parties[0] && (
                  <p className="text-sm text-gray-500 mt-1">
                    Typically the party offering or providing something
                  </p>
                )}
                {party === CONTRACT_TYPES.find(t => t.name === selectedType)?.parties[1] && (
                  <p className="text-sm text-gray-500 mt-1">
                    Typically the party receiving or purchasing something
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}