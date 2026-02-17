import { WellStatus } from '@/types/well';
import { cn } from '@/lib/utils';

const statusConfig: Record<WellStatus, { label: string; className: string }> = {
  ready: { label: 'Ready', className: 'bg-success/20 text-success border-success/30' },
  processing: { label: 'Processing', className: 'bg-primary/20 text-primary border-primary/30 animate-pulse-glow' },
  in_queue: { label: 'In Queue', className: 'bg-info/20 text-info border-info/30' },
  error: { label: 'Error', className: 'bg-destructive/20 text-destructive border-destructive/30' },
  uploading: { label: 'Uploading', className: 'bg-warning/20 text-warning border-warning/30 animate-pulse-glow' },
};

export function StatusBadge({ status }: { status: WellStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono font-medium', config.className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', {
        'bg-success': status === 'ready',
        'bg-primary': status === 'processing',
        'bg-info': status === 'in_queue',
        'bg-destructive': status === 'error',
        'bg-warning': status === 'uploading',
      })} />
      {config.label}
    </span>
  );
}
