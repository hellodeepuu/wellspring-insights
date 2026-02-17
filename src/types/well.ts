export type WellStatus = 'ready' | 'processing' | 'in_queue' | 'error' | 'uploading';

export interface Well {
  id: string;
  name: string;
  status: WellStatus;
  uploadedAt: string;
  fileSize: string;
  curvesCount: number;
  depthRange: { min: number; max: number };
  location?: string;
  operator?: string;
}

export interface Curve {
  name: string;
  unit: string;
  description: string;
  data: { depth: number; value: number }[];
}

export interface WellDetail {
  well: Well;
  curves: Curve[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
