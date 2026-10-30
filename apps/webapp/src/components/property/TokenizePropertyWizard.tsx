"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  DollarSign,
  FileUp,
  Landmark,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Upload,
} from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";

export interface TokenizeFormData {
  title: string;
  description: string;
  location: string;
  propertyType: "residential" | "commercial" | "industrial";
  valuationUsd: number;
  totalShares: number;
  expectedYieldApr: number;
  deedIpfsCid: string;
  parcelNumber: string;
}

interface TokenizePropertyWizardProps {
  onSubmit?: (data: TokenizeFormData) => Promise<void> | void;
  onCancel?: () => void;
}

export function TokenizePropertyWizard({
  onSubmit,
  onCancel,
}: TokenizePropertyWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<TokenizeFormData>({
    title: "",
    description: "",
    location: "",
    propertyType: "residential",
    valuationUsd: 500_000,
    totalShares: 10_000,
    expectedYieldApr: 8.5,
    deedIpfsCid: "",
    parcelNumber: "",
  });

  const sharePrice = formData.valuationUsd / (formData.totalShares || 1);

  const handleNext = () => {
    if (step < 4) setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-xl mx-auto border-emerald-500/30 bg-emerald-950/10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-white">
          Tokenization Proposal Submitted
        </h3>
        <p className="text-sm text-slate-300">
          Your property &ldquo;{formData.title}&rdquo; has been registered for
          on-chain appraisal verification and Soroban share minting.
        </p>
        <div className="pt-4">
          <Button onClick={onCancel} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto border-slate-800 bg-slate-900/90 text-slate-100">
      {/* Steps Progress Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-400" />
            Tokenize Real Estate Property
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fractionalize institutional real-world real estate on Stellar
            Soroban
          </p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center ${
                step === i
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400/50"
                  : step > i
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400"
              }`}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Identity & Metadata */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            Step 1: Property Description & Details
          </h3>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Property Title
            </label>
            <input
              type="text"
              placeholder="e.g. Marina Bay Horizon Penthouse"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Physical Location / Address
            </label>
            <input
              type="text"
              placeholder="e.g. 10 Marina Blvd, Tower 2, Singapore"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Property Type
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  propertyType: e.target.value as
                    | "residential"
                    | "commercial"
                    | "industrial",
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="residential">Residential Luxury</option>
              <option value="commercial">Commercial Office</option>
              <option value="industrial">Industrial Logistics</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Asset Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a detailed overview of the asset and tenant lease profiles..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Step 2: Valuation & Shares */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            Step 2: Valuation & Fractional Shares
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Appraised Valuation (USD)
              </label>
              <input
                type="number"
                min="1000"
                value={formData.valuationUsd}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    valuationUsd: Number(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Total Fractional Shares
              </label>
              <input
                type="number"
                min="10"
                value={formData.totalShares}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalShares: Number(e.target.value) || 1,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Projected Annual Rental Yield (APR %)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.expectedYieldApr}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  expectedYieldApr: Number(e.target.value) || 0,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400">
                Calculated Fractional Share Price
              </p>
              <p className="text-lg font-bold text-indigo-400">
                ${sharePrice.toFixed(2)} USD
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-indigo-500/30 text-indigo-300"
            >
              7 Decimal Precision
            </Badge>
          </div>
        </div>
      )}

      {/* Step 3: Legal Deed & Due Diligence */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            Step 3: Deed Verification & Legal Registry
          </h3>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Land Registry Parcel ID
            </label>
            <input
              type="text"
              placeholder="e.g. CADASTRE-SG-2026-9981-A"
              value={formData.parcelNumber}
              onChange={(e) =>
                setFormData({ ...formData, parcelNumber: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-1">
              IPFS Deed Document CID (SHA-256)
            </label>
            <input
              type="text"
              placeholder="bafybeic5...qmy"
              value={formData.deedIpfsCid}
              onChange={(e) =>
                setFormData({ ...formData, deedIpfsCid: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-950/40">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-200 font-medium">
              Upload Certified Title Deed (PDF)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Automatic IPFS pinning and cryptographic CID generation
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Review & On-Chain Confirmation */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            Step 4: Review & Deploy Token Contract
          </h3>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Title:</span>
              <span className="font-semibold text-white">
                {formData.title || "Untitled Property"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">
                {formData.location || "Unspecified"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Total Valuation:</span>
              <span className="font-semibold text-white">
                ${formData.valuationUsd.toLocaleString()} USD
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Fractional Shares:</span>
              <span className="font-semibold text-white">
                {formData.totalShares.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-900">
              <span className="text-slate-400">Expected Yield:</span>
              <span className="font-semibold text-emerald-400">
                {formData.expectedYieldApr}% APR
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Estimated Soroban Gas Fee:</span>
              <span className="font-semibold text-indigo-400">~0.045 XLM</span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-lg text-xs text-indigo-200">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>
              All fractional share contracts are SEP-41 compliant and
              automatically integrated into StellAdullam DeFi lending pools.
            </span>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-800 mt-6">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        ) : (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}

        {step < 4 ? (
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {isSubmitting ? "Deploying Contract..." : "Confirm & Tokenize"}
          </Button>
        )}
      </div>
    </Card>
  );
}
