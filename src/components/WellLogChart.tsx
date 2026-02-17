import { Curve } from '@/types/well';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CURVE_COLORS = [
  'hsl(38, 92%, 50%)',   // primary amber
  'hsl(199, 89%, 48%)',  // info blue
  'hsl(142, 71%, 45%)',  // success green
  'hsl(0, 84%, 60%)',    // red
  'hsl(280, 70%, 55%)',  // purple
  'hsl(180, 70%, 45%)',  // teal
];

interface WellLogChartProps {
  curves: Curve[];
  depthData: { depth: number; value: number }[];
  viewMode: 'merged' | 'separate';
}

export function WellLogChart({ curves, depthData, viewMode }: WellLogChartProps) {
  const mergedData = useMemo(() => {
    if (depthData.length === 0) return [];
    return depthData.map((d) => {
      const point: Record<string, number> = { depth: d.depth };
      curves.forEach((curve) => {
        const match = curve.data.find((cd) => cd.depth === d.depth);
        if (match) point[curve.name] = parseFloat(match.value.toFixed(3));
      });
      return point;
    });
  }, [curves, depthData]);

  if (curves.length === 0) {
    return (
      <div className="rounded-xl border border-border gradient-card p-12 text-center">
        <p className="text-muted-foreground">Select curves to visualize</p>
      </div>
    );
  }

  if (viewMode === 'separate') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {curves.map((curve, i) => {
          const data = curve.data.map((d) => ({ depth: d.depth, [curve.name]: parseFloat(d.value.toFixed(3)) }));
          return (
            <div key={curve.name} className="rounded-xl border border-border gradient-card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm font-semibold text-foreground">{curve.name}</h3>
                <span className="text-[10px] font-mono text-muted-foreground">{curve.unit}</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <XAxis dataKey="depth" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} label={{ value: 'Depth (ft)', position: 'insideBottom', offset: -2, fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'hsl(40, 20%, 92%)' }}
                  />
                  <Line type="monotone" dataKey={curve.name} stroke={CURVE_COLORS[i % CURVE_COLORS.length]} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border gradient-card p-5">
      <h3 className="font-mono text-sm font-semibold text-foreground mb-4">Well-Log Curves (Merged)</h3>
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={mergedData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis dataKey="depth" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} label={{ value: 'Depth (ft)', position: 'insideBottom', offset: -2, fontSize: 11, fill: 'hsl(220, 10%, 50%)' }} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
          <Tooltip
            contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'hsl(40, 20%, 92%)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
          {curves.map((curve, i) => (
            <Line
              key={curve.name}
              type="monotone"
              dataKey={curve.name}
              stroke={CURVE_COLORS[i % CURVE_COLORS.length]}
              strokeWidth={1.5}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
