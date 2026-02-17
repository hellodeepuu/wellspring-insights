import { useState, useCallback } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { WellCard } from '@/components/WellCard';
import { mockWells } from '@/data/mockData';
import { Well } from '@/types/well';
import { toast } from 'sonner';
import { Search, SlidersHorizontal } from 'lucide-react';

const Index = () => {
  const [wells, setWells] = useState<Well[]>(mockWells);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleUpload = useCallback(() => {
    toast.info('LAS file upload — connect to your backend API');
  }, []);

  const handleDelete = useCallback((id: string) => {
    setWells((prev) => prev.filter((w) => w.id !== id));
    toast.success('Well deleted successfully');
  }, []);

  const filtered = wells.filter((w) => {
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.location?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ['all', 'ready', 'processing', 'in_queue', 'error'];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md gradient-accent" />
            <span className="font-bold text-lg tracking-tight text-foreground">OneGeo</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground hidden sm:block">Mudlogging Mass Spectrometer</span>
        </div>
      </nav>

      <HeroSection onUpload={handleUpload} />

      {/* Wells Section */}
      <section className="container py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Wells</h2>
            <p className="text-sm text-muted-foreground mt-1">{wells.length} wells in workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search wells..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 rounded-lg border border-border bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-56"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-1" />
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s === 'all' ? 'All' : s === 'in_queue' ? 'Queue' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((well, i) => (
            <WellCard key={well.id} well={well} index={i} onDelete={handleDelete} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No wells found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 OneGeo — Well-Log Analysis Platform</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
