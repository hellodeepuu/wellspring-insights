import { Curve } from '@/types/well';
import { useMemo, useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  Brush,
} from 'recharts';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const CURVE_COLORS = [
  'hsl(38, 92%, 50%)',
  'hsl(199, 89%, 48%)',
  'hsl(142, 71%, 45%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 70%, 55%)',
  'hsl(180, 70%, 45%)',
];

interface WellLogChartProps {
  curves: Curve[];
  depthData: { depth: number; value: number }[];
  viewMode: 'merged' | 'separate';
}

interface ZoomState {
  refAreaLeft: number | null;
  refAreaRight: number | null;
  left: number | 'auto';
  right: number | 'auto';
  top: number | 'auto';
  bottom: number | 'auto';
}

const initialZoom: ZoomState = {
  refAreaLeft: null,
  refAreaRight: null,
  left: 'auto',
  right: 'auto',
  top: 'auto',
  bottom: 'auto',
};

function ZoomControls({ onReset, isZoomed }: { onReset: () => void; isZoomed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-mono text-muted-foreground mr-1">Drag on chart to zoom</span>
      {isZoomed && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Maximize2 className="h-3 w-3" />
          Reset
        </button>
      )}
    </div>
  );
}

export function WellLogChart({ curves, depthData, viewMode }: WellLogChartProps) {
  const [mergedZoom, setMergedZoom] = useState(initialZoom);
  const [separateZooms, setSeparateZooms] = useState<Record<string, ZoomState>>({});

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

  const handleMouseDown = useCallback((setter: (fn: (prev: ZoomState) => ZoomState) => void) => (e: any) => {
    if (e?.activeLabel != null) {
      setter((prev) => ({ ...prev, refAreaLeft: e.activeLabel }));
    }
  }, []);

  const handleMouseMove = useCallback((setter: (fn: (prev: ZoomState) => ZoomState) => void, state: ZoomState) => (e: any) => {
    if (state.refAreaLeft != null && e?.activeLabel != null) {
      setter((prev) => ({ ...prev, refAreaRight: e.activeLabel }));
    }
  }, []);

  const handleMouseUp = useCallback((setter: (fn: (prev: ZoomState) => ZoomState) => void, state: ZoomState) => () => {
    if (state.refAreaLeft == null || state.refAreaRight == null) {
      setter((prev) => ({ ...prev, refAreaLeft: null, refAreaRight: null }));
      return;
    }
    let top = Math.min(state.refAreaLeft, state.refAreaRight);
    let bottom = Math.max(state.refAreaLeft, state.refAreaRight);
    if (top === bottom) {
      setter((prev) => ({ ...prev, refAreaLeft: null, refAreaRight: null }));
      return;
    }
    setter(() => ({
      refAreaLeft: null,
      refAreaRight: null,
      left: 'auto',
      right: 'auto',
      top,
      bottom,
    }));
  }, []);

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
          const zoom = separateZooms[curve.name] || initialZoom;
          const setZoom = (fn: (prev: ZoomState) => ZoomState) => {
            setSeparateZooms((prev) => ({ ...prev, [curve.name]: fn(prev[curve.name] || initialZoom) }));
          };
          const isZoomed = zoom.top !== 'auto' || zoom.bottom !== 'auto';
          const filteredData = isZoomed
            ? data.filter((d) => d.depth >= (zoom.top as number) && d.depth <= (zoom.bottom as number))
            : data;

          return (
            <div key={curve.name} className="rounded-xl border border-border gradient-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-mono text-sm font-semibold text-foreground">{curve.name}</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">{curve.unit}</span>
                </div>
                <ZoomControls onReset={() => setSeparateZooms((p) => ({ ...p, [curve.name]: initialZoom }))} isZoomed={isZoomed} />
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={filteredData}
                  layout="vertical"
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  onMouseDown={handleMouseDown(setZoom)}
                  onMouseMove={handleMouseMove(setZoom, zoom)}
                  onMouseUp={handleMouseUp(setZoom, zoom)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <YAxis
                    dataKey="depth"
                    reversed
                    tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }}
                    label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, fill: 'hsl(220, 10%, 50%)' }}
                    domain={isZoomed ? [zoom.top, zoom.bottom] : ['auto', 'auto']}
                    allowDataOverflow
                  />
                  <XAxis
                    type="number"
                    orientation="top"
                    tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }}
                    label={{ value: curve.unit, position: 'insideTop', offset: -15, fontSize: 10, fill: 'hsl(220, 10%, 50%)' }}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'hsl(40, 20%, 92%)' }}
                  />
                  <Line type="monotone" dataKey={curve.name} stroke={CURVE_COLORS[i % CURVE_COLORS.length]} strokeWidth={1.5} dot={false} animationDuration={300} />
                  {zoom.refAreaLeft != null && zoom.refAreaRight != null && (
                    <ReferenceArea
                      y1={zoom.refAreaLeft}
                      y2={zoom.refAreaRight}
                      strokeOpacity={0.3}
                      fill="hsl(38, 92%, 50%)"
                      fillOpacity={0.15}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    );
  }

  const isMergedZoomed = mergedZoom.top !== 'auto' || mergedZoom.bottom !== 'auto';
  const filteredMergedData = isMergedZoomed
    ? mergedData.filter((d) => d.depth >= (mergedZoom.top as number) && d.depth <= (mergedZoom.bottom as number))
    : mergedData;

  return (
    <div className="rounded-xl border border-border gradient-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm font-semibold text-foreground">Well-Log Curves (Merged)</h3>
        <ZoomControls onReset={() => setMergedZoom(initialZoom)} isZoomed={isMergedZoomed} />
      </div>
      <ResponsiveContainer width="100%" height={550}>
        <LineChart
          data={filteredMergedData}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          onMouseDown={handleMouseDown(setMergedZoom)}
          onMouseMove={handleMouseMove(setMergedZoom, mergedZoom)}
          onMouseUp={handleMouseUp(setMergedZoom, mergedZoom)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <YAxis
            dataKey="depth"
            reversed
            tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }}
            label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 11, fill: 'hsl(220, 10%, 50%)' }}
            domain={isMergedZoomed ? [mergedZoom.top, mergedZoom.bottom] : ['auto', 'auto']}
            allowDataOverflow
          />
          <XAxis type="number" orientation="top" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 50%)' }} />
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
              animationDuration={300}
            />
          ))}
          {mergedZoom.refAreaLeft != null && mergedZoom.refAreaRight != null && (
            <ReferenceArea
              y1={mergedZoom.refAreaLeft}
              y2={mergedZoom.refAreaRight}
              strokeOpacity={0.3}
              fill="hsl(38, 92%, 50%)"
              fillOpacity={0.15}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
