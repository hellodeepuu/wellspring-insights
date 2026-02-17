import { Well } from '@/types/well';
import { StatusBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Download, ChevronRight, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface WellCardProps {
  well: Well;
  index: number;
  onDelete: (id: string) => void;
}

export function WellCard({ well, index, onDelete }: WellCardProps) {
  const navigate = useNavigate();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Downloading ${well.name}...`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(well.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={() => well.status === 'ready' && navigate(`/well/${well.id}`)}
      className={`group relative rounded-xl border border-border gradient-card p-5 transition-all duration-300 ${
        well.status === 'ready' 
          ? 'cursor-pointer hover:border-primary/40 hover:glow-primary' 
          : 'opacity-80'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
            {well.name}
          </h3>
          {well.location && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              {well.location}
            </p>
          )}
        </div>
        <StatusBadge status={well.status} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="rounded-md bg-secondary/50 p-2">
          <p className="text-muted-foreground">Curves</p>
          <p className="font-mono font-semibold text-foreground">{well.curvesCount}</p>
        </div>
        <div className="rounded-md bg-secondary/50 p-2">
          <p className="text-muted-foreground">Depth</p>
          <p className="font-mono font-semibold text-foreground">
            {well.depthRange.min}–{well.depthRange.max} ft
          </p>
        </div>
        <div className="rounded-md bg-secondary/50 p-2">
          <p className="text-muted-foreground">Size</p>
          <p className="font-mono font-semibold text-foreground">{well.fileSize}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(well.uploadedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="rounded-md p-2 text-muted-foreground hover:text-info hover:bg-info/10 transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {well.status === 'ready' && (
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
