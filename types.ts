
export interface ABCNode {
  type: 'a' | 'b' | 'c';
  x: number;
  y: number;
  z: number; // Added for 3D
  dx: number;
  dy: number;
  dz: number; // Added for 3D
  radius: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'ia1' | 'ia2' | 'ia3' | 'ia4' | 'ia5' | 'ia6' | 'ia7';
  icon?: string;
}

export interface IAConfig {
  id: number;
  name: string;
  color: string;
  icon: string;
  function: string;
  description: string;
  confidence: number;
  status: string;
}

export interface ParticleDef {
  name: string;
  combination: string[];
  charge: number;
  mass: number;
  description: string;
}
