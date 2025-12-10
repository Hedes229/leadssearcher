import React, { useState, useCallback } from 'react';
import { Lead, Platform, SearchState } from './types';
import { generateLeads } from './services/geminiService';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { LeadCard } from './components/LeadCard';
import { LeadTable } from './components/LeadTable';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.ALL);
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    leads: [],
    progressMessage: ''
  });

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, progressMessage: 'Starting research...' }));

    try {
      const results = await generateLeads(query, platform, region || 'Global', (msg) => {
        setState(prev => ({ ...prev, progressMessage: msg }));
      });
      setState(prev => ({ ...prev, isLoading: false, leads: results }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || 'An unexpected error occurred during research.' 
      }));
    }
  }, [query, region, platform]);

  const handleExport = () => {
    if (state.leads.length === 0) return;
    
    const headers = ['Name', 'Role', 'Company', 'Email', 'Phone', 'Website', 'Source', 'Confidence'];
    const csvContent = [
      headers.join(','),
      ...state.leads.map(l => 
        [l.name, l.role, l.company, l.email, l.phone, l.website, l.source, l.confidence]
        .map(field => `"${field}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_${query.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              LeadGenius AI
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-mono hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search Section */}
        <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-6">
                <Input 
                  label="Search Intent / Keyword" 
                  placeholder="e.g. Plumbing companies in Lyon, France"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-3">
                <Input 
                  label="Target Region" 
                  placeholder="e.g. Paris, New York"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <Select
                  label="Search Strategy"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  options={[
                    { value: Platform.ALL, label: 'Broad Search (Web)' },
                    { value: Platform.LINKEDIN, label: 'LinkedIn Focus' },
                    { value: Platform.FACEBOOK, label: 'Facebook Business' },
                    { value: Platform.GOOGLE, label: 'Google Directories' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400 max-w-xl">
                <span className="text-amber-400 font-semibold">Note:</span> This tool uses AI to research public information. It does not hack private databases. Results depend on publicly available data indexed by Google.
              </p>
              <button
                type="submit"
                disabled={state.isLoading || !query}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-lg flex items-center gap-2
                  ${state.isLoading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25'
                  }`}
              >
                {state.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    Find Leads
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Feedback / Status */}
        {state.isLoading && (
          <div className="text-center py-12 space-y-3 animate-pulse">
            <div className="text-blue-400 font-mono text-sm">{state.progressMessage}</div>
            <div className="text-slate-500 text-xs">Analyzing search results and extracting contact details...</div>
          </div>
        )}

        {state.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-sm">Search Failed</h3>
              <p className="text-sm opacity-90">{state.error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!state.isLoading && state.leads.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Results
                <span className="text-sm font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                  {state.leads.length} found
                </span>
              </h2>
              <button
                onClick={handleExport}
                className="text-sm text-slate-300 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <LeadTable leads={state.leads} />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {state.leads.map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!state.isLoading && !state.error && state.leads.length === 0 && (
          <div className="text-center py-20 opacity-50">
            <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Ready to find leads?</h3>
            <p className="text-sm text-slate-400">Enter a keyword and region to start researching.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;