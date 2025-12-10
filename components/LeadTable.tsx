import React from 'react';
import { Lead } from '../types';

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  const getConfidenceBadge = (conf: string) => {
    let classes = "";
    switch (conf) {
      case 'High': classes = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; break;
      case 'Medium': classes = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; break;
      default: classes = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
        {conf}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/30">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
          <tr>
            <th scope="col" className="px-6 py-4">Name / Role</th>
            <th scope="col" className="px-6 py-4">Company</th>
            <th scope="col" className="px-6 py-4">Contact Info</th>
            <th scope="col" className="px-6 py-4">Confidence</th>
            <th scope="col" className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-white">{lead.name}</div>
                <div className="text-xs text-slate-500">{lead.role}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-white">{lead.company}</div>
                <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate max-w-[150px] block">
                  {lead.website}
                </a>
              </td>
              <td className="px-6 py-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-800 px-1 rounded text-slate-300 select-all">
                    {lead.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 select-all">
                    {lead.phone}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {getConfidenceBadge(lead.confidence)}
              </td>
              <td className="px-6 py-4">
                 <a href={lead.source} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1">
                    Verify
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                 </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};