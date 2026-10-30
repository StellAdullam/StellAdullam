import React from "react";
import { ShieldCheck, FileText, Landmark, Globe } from "lucide-react";

export interface PropertyLegalDisclosuresCardProps {
  spvEntityName?: string;
  registrationNumber?: string;
  jurisdiction?: string;
  titleDeedCid?: string;
  isKycMandatory?: boolean;
  className?: string;
}

export const PropertyLegalDisclosuresCard: React.FC<
  PropertyLegalDisclosuresCardProps
> = ({
  spvEntityName = "StellAdullam Holdings SPV LLC",
  registrationNumber = "DE-LLC-7849102",
  jurisdiction = "Delaware, United States",
  titleDeedCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  isKycMandatory = true,
  className = "",
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 border-b border-slate-800 pb-2">
        <Landmark className="w-4 h-4 text-emerald-400" />
        <span>Legal SPV & Real Estate Deed Disclosures</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">
            Special Purpose Vehicle (SPV)
          </span>
          <span className="font-medium text-slate-200">{spvEntityName}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">
            Jurisdiction Registration
          </span>
          <span className="font-mono text-slate-200">
            {registrationNumber} ({jurisdiction})
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-full">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="shrink-0">Title Deed CID:</span>
          <span className="font-mono text-slate-300 truncate">
            {titleDeedCid}
          </span>
        </div>

        {isKycMandatory && (
          <div className="flex items-center gap-1 text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accreditation Required</span>
          </div>
        )}
      </div>
    </div>
  );
};
