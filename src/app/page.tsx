'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import PartySelector from './components/PartySelector';
import RiskDisplay from './components/RiskDisplay';

type Step = 'upload' | 'party' | 'analyzing' | 'results';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState('');
  const [contractType, setContractType] = useState('');
  const [partyRole, setPartyRole] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileUploaded = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('party');
    setError('');
  };

  const handlePartySelected = async (type: string, party: string) => {
    setContractType(type);
    setPartyRole(party);
    setCurrentStep('analyzing');
    
    // Call the API to analyze the contract
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile!);
      formData.append('contractType', type);
      formData.append('partyRole', party);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Store the contract text from the response
      if (result.contractText) {
        setContractText(result.contractText);
      } else if (uploadedFile) {
        // Fallback: read the file directly if not in response
        const fileText = await uploadedFile.text();
        setContractText(fileText);
      }
      
      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (err) {
      setError('Failed to analyze contract. Please try again.');
      setCurrentStep('party');
    }
  };

  const startOver = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setContractText('');
    setContractType('');
    setPartyRole('');
    setAnalysisResult(null);
    setError('');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Contract Risk Analyzer
          </h1>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${
              ['party', 'analyzing', 'results'].includes(currentStep) ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['party', 'analyzing', 'results'].includes(currentStep) ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Select Role</span>
            </div>
            
            <div className="w-12 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center ${
              currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Results</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentStep === 'upload' && (
          <div>
            <p className="text-center text-gray-600 mb-8">
              Upload your contract and we'll identify potential risks from your perspective
            </p>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {currentStep === 'party' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Analyzing: <span className="font-medium">{uploadedFile?.name}</span>
              </p>
              {error && (
                <p className="text-red-600 mt-2">{error}</p>
              )}
            </div>
            <PartySelector onSelectionComplete={handlePartySelected} />
          </div>
        )}

        {currentStep === 'analyzing' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Analyzing Your Contract
            </h2>
            <p className="text-gray-600">
              Identifying risks from the {partyRole} perspective...
            </p>
          </div>
        )}

        {currentStep === 'results' && analysisResult && (
          <RiskDisplay 
            analysis={analysisResult} 
            onStartOver={startOver}
            fileName={uploadedFile?.name}
            contractText={contractText}
          />
        )}
      </div>
    </main>
  );
}