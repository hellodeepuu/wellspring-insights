import { Curve } from '@/types/well';
import { Check } from 'lucide-react';

interface CurveSelectorProps {
  curves: Curve[];
  selected: string[];
  onToggle: (name: string) => void;
}

export function CurveSelector({ curves, selected, onToggle }: CurveSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {curves.map((curve) => {
        const isSelected = selected.includes(curve.name);
        const isDept = curve.name === 'DEPT';
        return (
          <button
            key={curve.name}
            onClick={() => onToggle(curve.name)}
            disabled={isDept}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-mono transition-all ${
              isDept
                ? 'border-primary/50 bg-primary/20 text-primary cursor-default'
                : isSelected
                ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/15'
                : 'border-border bg-secondary/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground'
            }`}
            title={`${curve.description} (${curve.unit})`}
          >
            {(isSelected || isDept) && <Check className="h-3 w-3" />}
            <span>{curve.name}</span>
            <span className="text-[10px] opacity-60">{curve.unit}</span>
          </button>
        );
      })}
    </div>
  );
}
