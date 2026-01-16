
import React from 'react';
import { IAConfig, ParticleDef } from './types';

export const COLORS = {
  ia1: '#FF6B6B', // Experimental
  ia2: '#4ECDC4', // Theoretical
  ia3: '#FFD166', // Independent
  ia4: '#06D6A0', // NASA
  ia5: '#118AB2', // SpaceX
  ia6: '#073B4C', // Telescopes
  ia7: '#7209B7', // Predictive
};

export const IA_DEFS: IAConfig[] = [
  { id: 1, name: 'IA Experimental', color: COLORS.ia1, icon: 'flask', function: 'Validación empírica', description: 'Analiza retardos de rayos gamma y patrones del CMB.', confidence: 85, status: 'Esperando datos...' },
  { id: 2, name: 'IA Teórica', color: COLORS.ia2, icon: 'atom', function: 'Consistencia matemática', description: 'Verifica constantes físicas como G y la estructura de red.', confidence: 92, status: 'Analizando geometría...' },
  { id: 3, name: 'IA Independiente', color: COLORS.ia3, icon: 'balance-scale', function: 'Consenso final', description: 'Evaluación imparcial y mitigación de sesgos.', confidence: 78, status: 'Monitoreando...' },
  { id: 4, name: 'IA NASA Data', color: COLORS.ia4, icon: 'satellite', function: 'Datos reales NASA', description: 'Compara predicciones con datasets de Fermi y Planck.', confidence: 65, status: 'Inactiva' },
  { id: 5, name: 'IA SpaceX', color: COLORS.ia5, icon: 'rocket', function: 'Datos telemetría', description: 'Analiza trayectorias y anomalías espaciales.', confidence: 60, status: 'Esperando telemetría...' },
  { id: 6, name: 'IA Telescopios', color: COLORS.ia6, icon: 'telescope', function: 'Red observatorios', description: 'Integración de datos de Hubble, JWST y LIGO.', confidence: 72, status: 'Escaneando...' },
  { id: 7, name: 'IA Predictiva', color: COLORS.ia7, icon: 'chart-line', function: 'Análisis predictivo', description: 'Genera predicciones falsificables para el futuro.', confidence: 80, status: 'Generando...' },
];

export const ABC_NODES_DEF = {
  a: { carga: 1/3, color: '#FF4444', label: 'Alfa', description: 'Nodo de expansión positiva' },
  b: { carga: -2/9, color: '#4444FF', label: 'Beta', description: 'Nodo de contracción leptónica' },
  c: { carga: -1/9, color: '#44FF44', label: 'Gamma', description: 'Nodo de estabilidad bariónica' }
};

export const EMERGENT_PARTICLES: Record<string, ParticleDef> = {
  'quark-up': { 
    name: 'Quark Up', 
    combination: ['a', 'c', 'c'], 
    charge: 2/3, 
    mass: 2.2e-30,
    description: 'Partícula fundamental de la materia bariónica. En la teoría ABC, surge de la resonancia de un nodo Alfa con dos nodos Gamma, resultando en una carga positiva fraccionaria estable.'
  },
  'quark-down': { 
    name: 'Quark Down', 
    combination: ['c', 'c', 'c'], 
    charge: -1/3, 
    mass: 4.7e-30,
    description: 'Compañero del Quark Up, formado puramente por nodos Gamma. Su masa ligeramente superior se debe a la interacción armónica entre los tres nodos de carga negativa mínima.'
  },
  'electron': { 
    name: 'Electron', 
    combination: ['b', 'b', 'b'], 
    charge: -1, 
    mass: 9.1e-31,
    description: 'Leptón cargado esencial para el electromagnetismo. La tríada de nodos Beta genera un campo de torsión que le otorga su característica carga unitaria y su baja inercia cuántica.'
  },
  'neutrino': { 
    name: 'Neutrino', 
    combination: ['a', 'a', 'a'], 
    charge: 0, 
    mass: 1e-36,
    description: 'La partícula fantasma. La anulación perfecta de cargas entre tres nodos Alfa crea una estructura neutra de alta penetración que apenas perturba la red del espacio-tiempo.'
  },
  'proton': {
    name: 'Protón',
    combination: ['a', 'c', 'c', 'a', 'c', 'c', 'c', 'c', 'c'], // Composite of 2 Up + 1 Down
    charge: 1,
    mass: 1.67e-27,
    description: 'Núcleo de la estabilidad atómica. Representa una súper-estructura de 9 nodos (triplete de tripletes) cuya geometría de empaquetamiento genera la carga unitaria positiva (+1) y la mayor parte de la masa visible.'
  },
  'higgs': {
    name: 'Bosón de Higgs',
    combination: ['a', 'b', 'c'],
    charge: 0,
    mass: 2.25e-25,
    description: 'El mediador de la inercia. Surge de la interacción balanceada entre un nodo de cada tipo, creando un "arrastre" en la red ABC que percibimos como masa en otras partículas.'
  }
};
