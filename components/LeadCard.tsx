import React from 'react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case 'High': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'Medium': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      default: return 'text-slate-400 border-slate-400/30 bg-slate-400/10';
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-white text-lg">{lead.name}</h3>
          <p className="text-slate-400 text-sm">{lead.role} at <span className="text-blue-400">{lead.company}</span></p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getConfidenceColor(lead.confidence)}`}>
          {lead.confidence}
        </span>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-400">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline truncate">
            {lead.website}
          </a>
        </div>
      </div>
    </div>
  );
};