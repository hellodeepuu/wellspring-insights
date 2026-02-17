import { motion } from 'framer-motion';
import { Activity, Upload, Database } from 'lucide-react';

export function HeroSection({ onUpload }: { onUpload: () => void }) {
  return (
    <section className="relative overflow-hidden gradient-hero border-b border-border">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      
      <div className="container relative z-10 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Well-Log Analysis Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-foreground">Subsurface Data</span>
            <br />
            <span className="text-gradient">Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Ingest, visualize, and interpret well-log data with AI-powered analysis. 
            Upload LAS files and unlock deep subsurface insights in seconds.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onUpload}
              className="inline-flex items-center gap-2 rounded-lg gradient-accent px-6 py-3 font-semibold text-primary-foreground shadow-lg glow-primary transition-all hover:scale-105 hover:shadow-xl"
            >
              <Upload className="h-4 w-4" />
              Upload LAS File
            </button>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-6 py-3 text-secondary-foreground font-medium">
              <Database className="h-4 w-4 text-primary" />
              {5} Wells Loaded
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Wells Processed', value: '1,247' },
            { label: 'Curves Analyzed', value: '18.3K' },
            { label: 'Depth Coverage', value: '2.1M ft' },
            { label: 'AI Interpretations', value: '892' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-2xl font-bold font-mono text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
