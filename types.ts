
export type Tab = 'chat' | 'agents' | 'source';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export type AgentType = 'apa_audit' | 'precheck' | 'chart' | 'image_comment' | 'proofread';

export interface AgentResult {
  id: string;
  type: AgentType;
  title: string;
  content: string; // HTML or Markdown string
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

export interface Source {
  id: string;
  title: string;
  citation: string;
  snippet: string;
  type: 'paper' | 'report' | 'internal';
  confidence: number;
}

export interface AcademicDocument {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  wordCount: number;
  preview?: string;
}