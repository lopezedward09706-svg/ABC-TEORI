
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { ABCNode } from '../types';
import { ABC_NODES_DEF } from '../constants';

interface Props {
  isSimulating: boolean;
  viewMode: '2d' | '3d' | 'network';
  speed: number;
  density: number;
  interactionDistance: number;
  interactionForce: number;
  showConnections: boolean;
  isForceEnabled: boolean;
  rotationX?: number; // Pitch
  rotationY?: number; // Yaw
  zoom?: number;
}

const NetworkCanvas: React.FC<Props> = ({ 
  isSimulating, 
  viewMode, 
  speed, 
  density, 
  interactionDistance,
  interactionForce,
  showConnections,
  isForceEnabled,
  rotationX = 0,
  rotationY = 0,
  zoom = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<ABCNode[]>([]);
  const requestRef = useRef<number>(0);

  const createNodes = useCallback((width: number, height: number) => {
    const types: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];
    const newNodes: ABCNode[] = [];
    const size = 300; // 3D box size
    for (let i = 0; i < density; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      newNodes.push({
        type,
        x: (Math.random() - 0.5) * size,
        y: (Math.random() - 0.5) * size,
        z: (Math.random() - 0.5) * size,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        dz: (Math.random() - 0.5) * 2,
        radius: 8
      });
    }
    nodesRef.current = newNodes;
  }, [density]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Deep space background
    ctx.fillStyle = '#0a1929';
    ctx.fillRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const is3D = viewMode === '3d';

    // Physics Step
    if (isSimulating) {
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (isForceEnabled) {
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dz = is3D ? (n2.z - n1.z) : 0;
            const distSq = dx * dx + dy * dy + dz * dz;
            const dist = Math.sqrt(distSq);

            if (dist < interactionDistance && dist > 1) {
              const force = (interactionDistance - dist) / interactionDistance * interactionForce * 0.05;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              const fz = is3D ? (dz / dist) * force : 0;

              n1.dx -= fx;
              n1.dy -= fy;
              n1.dz -= fz;
              n2.dx += fx;
              n2.dy += fy;
              n2.dz += fz;
            }
          }
        }

        n1.x += n1.dx * speed * 0.5;
        n1.y += n1.dy * speed * 0.5;
        if (is3D) n1.z += n1.dz * speed * 0.5;

        n1.dx *= 0.98;
        n1.dy *= 0.98;
        if (is3D) n1.dz *= 0.98;

        const halfW = width / 2;
        const halfH = height / 2;

        if (!is3D) {
            if (n1.x < -halfW) { n1.x = -halfW; n1.dx *= -1; }
            if (n1.x > halfW) { n1.x = halfW; n1.dx *= -1; }
            if (n1.y < -halfH) { n1.y = -halfH; n1.dy *= -1; }
            if (n1.y > halfH) { n1.y = halfH; n1.dy *= -1; }
        } else {
            // Bounds for 3D simulation cube
            const boundary = 200;
            if (Math.abs(n1.x) > boundary) { n1.x = Math.sign(n1.x) * boundary; n1.dx *= -0.5; }
            if (Math.abs(n1.y) > boundary) { n1.y = Math.sign(n1.y) * boundary; n1.dy *= -0.5; }
            if (Math.abs(n1.z) > boundary) { n1.z = Math.sign(n1.z) * boundary; n1.dz *= -0.5; }
        }
      }
    }

    // 3D Rotation Math
    const radX = (rotationX || 0) * (Math.PI / 180);
    const radY = (rotationY || 0) * (Math.PI / 180);
    
    // Project and Sort Nodes
    const projectedNodes = nodes.map(node => {
      let x = node.x;
      let y = node.y;
      let z = node.z;

      if (is3D) {
        // Rotate Y
        let nx = x * Math.cos(radY) - z * Math.sin(radY);
        let nz = x * Math.sin(radY) + z * Math.cos(radY);
        x = nx; z = nz;
        // Rotate X
        let ny = y * Math.cos(radX) - z * Math.sin(radX);
        nz = y * Math.sin(radX) + z * Math.cos(radX);
        y = ny; z = nz;
      }

      const focalLength = 500;
      const zEff = z * zoom;
      const distToCamera = focalLength + zEff;
      
      // Safety: Nodes behind camera are hidden (scale 0)
      const perspective = (is3D && distToCamera > 10) ? focalLength / distToCamera : (is3D ? 0 : 1);
      
      return {
        ...node,
        px: x * perspective * zoom + width / 2,
        py: y * perspective * zoom + height / 2,
        pz: z,
        pScale: perspective
      };
    }).filter(n => n.pScale > 0); // Optimization: don't render what's behind us

    // Painters Algorithm (Sort by depth)
    projectedNodes.sort((a, b) => b.pz - a.pz);

    // Draw Connections
    if (showConnections && (viewMode === 'network' || viewMode === '3d')) {
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const distSq = Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2) + Math.pow(n1.z - n2.z, 2);
          
          if (distSq < interactionDistance * interactionDistance) {
            const alpha = is3D ? Math.max(0, 0.2 * (n1.pScale + n2.pScale) / 2) : 0.1;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.stroke();
          }
        }
      }
    }

    // Draw Nodes
    projectedNodes.forEach(node => {
      const config = ABC_NODES_DEF[node.type];
      const visualRadius = Math.max(0.1, node.radius * node.pScale);
      const alpha = is3D ? Math.max(0.2, Math.min(1, node.pScale)) : 1;
      
      ctx.globalAlpha = alpha;

      // Glow - ensuring radius is at least 0.1 to avoid IndexSizeError
      const glowRadius = visualRadius * 2.5;
      if (glowRadius > 0) {
        try {
          const gradient = ctx.createRadialGradient(node.px, node.py, 0, node.px, node.py, glowRadius);
          gradient.addColorStop(0, config.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.px, node.py, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        } catch (e) {
          // Fallback if gradient still fails
          ctx.fillStyle = config.color;
          ctx.globalAlpha = alpha * 0.3;
          ctx.beginPath();
          ctx.arc(node.px, node.py, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
        }
      }

      // Core
      ctx.beginPath();
      ctx.arc(node.px, node.py, visualRadius, 0, Math.PI * 2);
      ctx.fillStyle = config.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(0.5, 1.5 * node.pScale);
      ctx.stroke();

      // Label (if close enough in 3D)
      if (node.pScale > 0.8) {
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.round(10 * node.pScale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.type.toUpperCase(), node.px, node.py + (4 * node.pScale));
      }

      ctx.globalAlpha = 1.0;
    });

    requestRef.current = requestAnimationFrame(() => draw(ctx));
  }, [isSimulating, viewMode, speed, interactionDistance, interactionForce, showConnections, isForceEnabled, rotationX, rotationY, zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      createNodes(canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize);
    resize();
    draw(ctx);

    return () => {
      window.removeEventListener('resize', resize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [createNodes, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        createNodes(canvas.width, canvas.height);
    }
  }, [density, createNodes]);

  const handleBigBang = () => {
    nodesRef.current.forEach(n => {
      n.x = 0; n.y = 0; n.z = 0;
      const angle = Math.random() * Math.PI * 2;
      const angle2 = Math.random() * Math.PI * 2;
      const mag = (Math.random() + 0.5) * 15;
      n.dx = Math.cos(angle) * Math.sin(angle2) * mag;
      n.dy = Math.sin(angle) * Math.sin(angle2) * mag;
      n.dz = Math.cos(angle2) * mag;
    });
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={handleBigBang}
          className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 shadow-lg"
        >
          <i className="fas fa-expand-arrows-alt"></i> BIG BANG
        </button>
      </div>
    </div>
  );
};

export default NetworkCanvas;
