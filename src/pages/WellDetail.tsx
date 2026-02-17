import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockWells, mockCurves } from '@/data/mockData';
import { Curve, ChatMessage } from '@/types/well';
import { CurveSelector } from '@/components/CurveSelector';
import { DepthRangeSlider } from '@/components/DepthRangeSlider';
import { WellLogChart } from '@/components/WellLogChart';
import { AIChatPanel } from '@/components/AIChatPanel';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Sparkles, MessageSquare, Merge, SplitSquareHorizontal } from 'lucide-react';

const WellDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const well = mockWells.find((w) => w.id === id);

  const [selectedCurves, setSelectedCurves] = useState<string[]>(['DEPT', 'GR', 'RHOB']);
  const [depthRange, setDepthRange] = useState<[number, number]>([
    well?.depthRange.min ?? 0,
    well?.depthRange.max ?? 5000,
  ]);
  const [viewMode, setViewMode] = useState<'merged' | 'separate'>('merged');
  const [showAI, setShowAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // DEPT is always included
  const effectiveSelected = useMemo(() => {
    const set = new Set(selectedCurves);
    set.add('DEPT');
    return Array.from(set);
  }, [selectedCurves]);

  const displayCurves = useMemo(() => {
    return mockCurves
      .filter((c) => effectiveSelected.includes(c.name) && c.name !== 'DEPT')
      .map((c) => ({
        ...c,
        data: c.data.filter((d) => d.depth >= depthRange[0] && d.depth <= depthRange[1]),
      }));
  }, [effectiveSelected, depthRange]);

  const depthData = useMemo(() => {
    const dept = mockCurves.find((c) => c.name === 'DEPT');
    return dept?.data.filter((d) => d.depth >= depthRange[0] && d.depth <= depthRange[1]) ?? [];
  }, [depthRange]);

  const handleToggleCurve = (name: string) => {
    if (name === 'DEPT') return; // can't deselect DEPT
    setSelectedCurves((prev) => {
      if (prev.includes(name)) return prev.filter((c) => c !== name);
      const nonDept = prev.filter((c) => c !== 'DEPT');
      if (nonDept.length >= 6) return prev;
      return [...prev, name];
    });
  };

  const handleAIInterpretation = async () => {
    setAiLoading(true);
    setShowAI(true);
    // Simulate AI call
    await new Promise((r) => setTimeout(r, 2000));
    setAiResult(
      `## AI Interpretation\n\n**Depth Range:** ${depthRange[0]}–${depthRange[1]} ft\n**Curves Analyzed:** ${displayCurves.map(c => c.name).join(', ')}\n\n### Key Findings\n\n1. **Gamma Ray (GR)** shows elevated readings between ${depthRange[0] + 500}–${depthRange[0] + 1200} ft, indicating potential shale-rich intervals.\n\n2. **Bulk Density (RHOB)** averages ~2.5 g/cc with a notable decrease around ${depthRange[0] + 800} ft, suggesting possible porosity increase.\n\n3. **Resistivity patterns** suggest a potential hydrocarbon-bearing zone between ${depthRange[0] + 900}–${depthRange[0] + 1100} ft where ILD shows anomalously high values.\n\n### Recommendations\n- Focus investigation on the ${depthRange[0] + 800}–${depthRange[0] + 1200} ft interval\n- Cross-reference with mud log gas readings\n- Consider running formation pressure tests in the identified zone`
    );
    setAiLoading(false);
  };

  if (!well) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Well not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-5 w-px bg-border" />
            <span className="font-mono font-semibold text-foreground">{well.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAIInterpretation}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-semibold text-primary-foreground shadow glow-primary hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading ? 'Analyzing...' : 'AI Interpretation'}
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                showChat ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Chat
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Controls */}
              <div className="rounded-xl border border-border gradient-card p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Curve Selection</h2>
                    <span className="text-xs font-mono text-muted-foreground">
                      ({effectiveSelected.filter(c => c !== 'DEPT').length}/6 selected)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
                    <button
                      onClick={() => setViewMode('merged')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        viewMode === 'merged' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Merge className="h-3.5 w-3.5" />
                      Merge
                    </button>
                    <button
                      onClick={() => setViewMode('separate')}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        viewMode === 'separate' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <SplitSquareHorizontal className="h-3.5 w-3.5" />
                      Separate
                    </button>
                  </div>
                </div>

                <CurveSelector
                  curves={mockCurves}
                  selected={effectiveSelected}
                  onToggle={handleToggleCurve}
                />

                <DepthRangeSlider
                  min={well.depthRange.min}
                  max={well.depthRange.max}
                  value={depthRange}
                  onChange={setDepthRange}
                />
              </div>

              {/* Charts */}
              <WellLogChart
                curves={displayCurves}
                depthData={depthData}
                viewMode={viewMode}
              />

              {/* AI Result */}
              {showAI && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-primary/30 gradient-card p-6 glow-primary"
                >
                  {aiLoading ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="h-5 w-5 text-primary animate-pulse-glow" />
                      <span>Analyzing well data with AI...</span>
                    </div>
                  ) : aiResult ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <AIMarkdown content={aiResult} />
                    </div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Chat Panel */}
          {showChat && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-96 shrink-0"
            >
              <AIChatPanel wellName={well.name} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

function AIMarkdown({ content }: { content: string }) {
  // Simple markdown rendering
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-foreground">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-semibold text-foreground mt-4">{line.slice(4)}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="text-sm text-secondary-foreground ml-4">{line.slice(2)}</li>;
        if (line.match(/^\d+\./)) {
          const text = line.replace(/^\d+\.\s*/, '');
          return <p key={i} className="text-sm text-secondary-foreground">{renderBold(text)}</p>;
        }
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-foreground text-sm">{line.replace(/\*\*/g, '')}</p>;
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm text-secondary-foreground">{renderBold(line)}</p>;
      })}
    </div>
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default WellDetail;
