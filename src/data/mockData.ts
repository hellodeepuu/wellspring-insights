import { Well, Curve } from '@/types/well';

export const mockWells: Well[] = [
  {
    id: '1',
    name: 'WELL-A-2024-001',
    status: 'ready',
    uploadedAt: '2024-12-15T10:30:00Z',
    fileSize: '2.4 MB',
    curvesCount: 12,
    depthRange: { min: 500, max: 4500 },
    location: 'Gulf of Mexico, Block 42',
    operator: 'Petro Corp',
  },
  {
    id: '2',
    name: 'WELL-B-2024-015',
    status: 'processing',
    uploadedAt: '2024-12-18T14:15:00Z',
    fileSize: '3.1 MB',
    curvesCount: 8,
    depthRange: { min: 200, max: 3800 },
    location: 'North Sea, Quadrant 15',
    operator: 'Nordic Energy',
  },
  {
    id: '3',
    name: 'WELL-C-2024-022',
    status: 'in_queue',
    uploadedAt: '2024-12-20T09:00:00Z',
    fileSize: '1.8 MB',
    curvesCount: 10,
    depthRange: { min: 100, max: 5200 },
    location: 'Permian Basin, TX',
    operator: 'Basin Drilling LLC',
  },
  {
    id: '4',
    name: 'WELL-D-2024-007',
    status: 'ready',
    uploadedAt: '2024-11-30T16:45:00Z',
    fileSize: '4.7 MB',
    curvesCount: 15,
    depthRange: { min: 0, max: 6000 },
    location: 'Campos Basin, Brazil',
    operator: 'Atlantico S.A.',
  },
  {
    id: '5',
    name: 'WELL-E-2024-033',
    status: 'error',
    uploadedAt: '2024-12-22T11:20:00Z',
    fileSize: '0.9 MB',
    curvesCount: 0,
    depthRange: { min: 0, max: 0 },
    location: 'Bakken, ND',
    operator: 'Prairie Resources',
  },
];

function generateCurveData(min: number, max: number, base: number, variance: number): { depth: number; value: number }[] {
  const points: { depth: number; value: number }[] = [];
  for (let d = min; d <= max; d += 10) {
    points.push({
      depth: d,
      value: base + Math.sin(d / 200) * variance + (Math.random() - 0.5) * variance * 0.5,
    });
  }
  return points;
}

export const mockCurves: Curve[] = [
  { name: 'DEPT', unit: 'ft', description: 'Depth', data: generateCurveData(500, 4500, 0, 1) },
  { name: 'GR', unit: 'gAPI', description: 'Gamma Ray', data: generateCurveData(500, 4500, 75, 40) },
  { name: 'RHOB', unit: 'g/cc', description: 'Bulk Density', data: generateCurveData(500, 4500, 2.5, 0.3) },
  { name: 'NPHI', unit: 'v/v', description: 'Neutron Porosity', data: generateCurveData(500, 4500, 0.2, 0.1) },
  { name: 'ILD', unit: 'ohmm', description: 'Deep Resistivity', data: generateCurveData(500, 4500, 10, 8) },
  { name: 'ILM', unit: 'ohmm', description: 'Medium Resistivity', data: generateCurveData(500, 4500, 8, 6) },
  { name: 'SP', unit: 'mV', description: 'Spontaneous Potential', data: generateCurveData(500, 4500, -20, 30) },
  { name: 'CALI', unit: 'in', description: 'Caliper', data: generateCurveData(500, 4500, 8.5, 1.5) },
  { name: 'DT', unit: 'us/ft', description: 'Sonic Transit Time', data: generateCurveData(500, 4500, 90, 25) },
  { name: 'PEF', unit: 'barns/e', description: 'Photoelectric Factor', data: generateCurveData(500, 4500, 3.5, 1.5) },
  { name: 'DRHO', unit: 'g/cc', description: 'Density Correction', data: generateCurveData(500, 4500, 0, 0.1) },
  { name: 'MSFL', unit: 'ohmm', description: 'Micro Resistivity', data: generateCurveData(500, 4500, 5, 4) },
];
