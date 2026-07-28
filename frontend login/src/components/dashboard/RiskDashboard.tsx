import React, { useRef } from 'react';
import { AssessmentResult } from '@/types';
import { RiskGauge } from './RiskGauge';
import { EvidencePanel } from './EvidencePanel';
import { DecisionPanel } from './DecisionPanel';
import { TransparencyPanel } from './TransparencyPanel';
import { Download, Copy, RefreshCw } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'motion/react';

interface RiskDashboardProps {
  result: AssessmentResult;
  onReset: () => void;
}

export function RiskDashboard({ result, onReset }: RiskDashboardProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        backgroundColor: '#09090b',
        windowWidth: 1200,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`DARE-Report-${result.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  const handleCopySummary = () => {
    const summary = `DARE Assessment Report
Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})
Type: ${result.riskType}
Decision: ${result.decision}
Action: ${result.suggestedAction}
`;
    navigator.clipboard.writeText(summary);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Assessment Results</h2>
          <p className="text-sm text-zinc-400">ID: {result.id} • {new Date(result.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopySummary}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
            title="Copy Summary"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors ml-2 hover:border-white/20"
          >
            <RefreshCw className="w-4 h-4" />
            New Assessment
          </button>
        </div>
      </div>

      <div ref={dashboardRef} className="space-y-6 bg-background p-1 rounded-xl">
        {/* Top Section: Gauge & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 flex flex-col items-center justify-center md:col-span-1 border border-white/5 hover:border-white/10 transition-colors"
          >
            <RiskGauge score={result.riskScore} level={result.riskLevel} />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 md:col-span-2 flex flex-col justify-center space-y-6 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Primary Risk Type</h3>
              <p className="text-xl font-medium text-zinc-200">{result.riskType}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-xs text-zinc-500 block mb-1">Uncertainty Level</span>
                <span className="font-medium text-zinc-300">{result.uncertaintyLevel}</span>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-xs text-zinc-500 block mb-1">Content Type</span>
                <span className="font-medium text-zinc-300 capitalize">{result.inputType}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decision Panel */}
        <DecisionPanel 
          decision={result.decision} 
          explanation={result.decisionExplanation} 
          suggestedAction={result.suggestedAction} 
        />

        {/* Evidence Panel */}
        <EvidencePanel evidence={result.evidence} />

        {/* Transparency Panel */}
        <TransparencyPanel logs={result.logs} />
      </div>
    </motion.div>
  );
}
