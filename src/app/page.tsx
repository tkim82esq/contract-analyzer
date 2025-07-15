"use client";

import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ContractTypeSelector from "./components/ContractTypeSelector";
import ContractTypeDetector from "./components/ContractTypeDetector";
import PartySelector from "./components/PartySelector";
import PartyExtractor from "./components/PartyExtractor";
import RiskDisplay from "./components/RiskDisplay";

type Step = "upload" | "contractType" | "party" | "analyzing" | "results";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState("");
  const [contractType, setContractType] = useState("");
  const [partyRole, setPartyRole] = useState("");
  const [extractedParties, setExtractedParties] = useState<{
    [role: string]: string;
  }>({});
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [useDetector, setUseDetector] = useState(true);
  const [usePartyExtractor, setUsePartyExtractor] = useState(true);

  const handleFileUploaded = async (file: File) => {
    setUploadedFile(file);
    setError("");

    // Extract contract text immediately after upload
    try {
      const fileText = await file.text();
      setContractText(fileText);
      setCurrentStep("contractType");
    } catch (err) {
      setError("Failed to read contract file. Please try again.");
      console.error("File reading error:", err);
    }
  };

  const handleContractTypeSelected = (type: string) => {
    setContractType(type);
    setCurrentStep("party");
    setError("");
  };

  const handlePartiesSelected = async (
    selectedParty: string,
    parties: { [role: string]: string },
  ) => {
    setPartyRole(selectedParty);
    setExtractedParties(parties);
    setCurrentStep("analyzing");

    // Call the API to analyze the contract
    try {
      const formData = new FormData();

      // If we have contract text, create a blob and send it
      if (contractText) {
        const blob = new Blob([contractText], { type: "text/plain" });
        const file = new File([blob], uploadedFile?.name || "contract.txt", {
          type: "text/plain",
        });
        formData.append("file", file);
      } else if (uploadedFile) {
        // Fallback to original file
        formData.append("file", uploadedFile);
      } else {
        throw new Error("No contract data available");
      }

      formData.append("contractType", contractType);
      formData.append("partyRole", selectedParty);

      // Add party information for enhanced analysis
      formData.append("extractedParties", JSON.stringify(parties));

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();

      // Ensure we have contract text for display
      if (!result.contractText && contractText) {
        result.contractText = contractText;
      }

      setAnalysisResult(result);
      setCurrentStep("results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze contract. Please try again.");
      setCurrentStep("party");
    }
  };

  const handlePartySelected = async (party: string) => {
    setPartyRole(party);
    setCurrentStep("analyzing");

    // Call the API to analyze the contract
    try {
      const formData = new FormData();

      // If we have contract text, create a blob and send it
      if (contractText) {
        const blob = new Blob([contractText], { type: "text/plain" });
        const file = new File([blob], uploadedFile?.name || "contract.txt", {
          type: "text/plain",
        });
        formData.append("file", file);
      } else if (uploadedFile) {
        // Fallback to original file
        formData.append("file", uploadedFile);
      } else {
        throw new Error("No contract data available");
      }

      formData.append("contractType", contractType);
      formData.append("partyRole", party);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();

      // Ensure we have contract text for display
      if (!result.contractText && contractText) {
        result.contractText = contractText;
      }

      setAnalysisResult(result);
      setCurrentStep("results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze contract. Please try again.");
      setCurrentStep("party");
    }
  };

  const startOver = () => {
    setCurrentStep("upload");
    setUploadedFile(null);
    setContractText("");
    setContractType("");
    setPartyRole("");
    setExtractedParties({});
    setAnalysisResult(null);
    setError("");
    setUseDetector(true);
    setUsePartyExtractor(true);
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
            <div
              className={`flex items-center ${currentStep === "upload" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center ${
                ["contractType", "party", "analyzing", "results"].includes(
                  currentStep,
                )
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["contractType", "party", "analyzing", "results"].includes(
                    currentStep,
                  )
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Contract Type</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center ${
                ["party", "analyzing", "results"].includes(currentStep)
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["party", "analyzing", "results"].includes(currentStep)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Select Party</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center ${
                ["analyzing", "results"].includes(currentStep)
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  ["analyzing", "results"].includes(currentStep)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                4
              </div>
              <span className="ml-2 font-medium">Analyzing</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div
              className={`flex items-center ${
                currentStep === "results" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === "results"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                5
              </div>
              <span className="ml-2 font-medium">Results</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {currentStep === "upload" && (
          <div>
            <p className="text-center text-gray-600 mb-8">
              Upload your contract and we'll identify potential risks from your
              perspective
            </p>
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {currentStep === "contractType" && (
          <div>
            {useDetector && uploadedFile && contractText ? (
              <ContractTypeDetector
                contractFile={uploadedFile}
                onTypeSelected={handleContractTypeSelected}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-600">
                    Analyzing:{" "}
                    <span className="font-medium">{uploadedFile?.name}</span>
                  </p>
                  {!contractText && (
                    <p className="text-orange-600 mt-2">
                      Contract text not available for detection
                    </p>
                  )}
                </div>
                <ContractTypeSelector
                  onContractTypeSelected={handleContractTypeSelected}
                />
              </>
            )}
            {useDetector && contractText && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setUseDetector(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Skip detection and select manually
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === "party" && (
          <div>
            {usePartyExtractor && uploadedFile && contractText ? (
              <PartyExtractor
                contractFile={uploadedFile}
                contractType={contractType}
                onPartiesSelected={handlePartiesSelected}
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <p className="text-gray-600">
                    Contract:{" "}
                    <span className="font-medium">{contractType}</span>
                  </p>
                  <p className="text-gray-600">
                    File:{" "}
                    <span className="font-medium">{uploadedFile?.name}</span>
                  </p>
                  {!contractText && (
                    <p className="text-orange-600 mt-2">
                      Contract text not available for extraction
                    </p>
                  )}
                  {error && <p className="text-red-600 mt-2">{error}</p>}
                </div>
                <PartySelector
                  contractType={contractType}
                  onSelectionComplete={handlePartySelected}
                />
              </>
            )}
            {usePartyExtractor && contractText && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setUsePartyExtractor(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Skip extraction and select manually
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === "analyzing" && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Analyzing Your Contract
            </h2>
            <div className="text-gray-600 space-y-1">
              <p>
                Contract Type:{" "}
                <span className="font-medium">{contractType}</span>
              </p>
              <p>
                Your Role: <span className="font-medium">{partyRole}</span>
              </p>
              {Object.keys(extractedParties).length > 0 && (
                <div className="mt-3">
                  <p className="text-sm">Parties identified:</p>
                  {Object.entries(extractedParties).map(([role, name]) => (
                    <p key={role} className="text-sm">
                      {role}: <span className="font-medium">{name}</span>
                    </p>
                  ))}
                </div>
              )}
              <p className="mt-3">Identifying risks from your perspective...</p>
            </div>
          </div>
        )}

        {currentStep === "results" && analysisResult && (
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
