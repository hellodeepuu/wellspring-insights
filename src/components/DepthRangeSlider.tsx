import { Slider } from '@/components/ui/slider';
import { Ruler } from 'lucide-react';

interface DepthRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function DepthRangeSlider({ min, max, value, onChange }: DepthRangeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Depth Range</span>
        </div>
        <span className="font-mono text-xs text-primary">
          {value[0]} — {value[1]} ft
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
        <span>{min} ft</span>
        <span>{max} ft</span>
      </div>
    </div>
  );
}
