import { useCallback, useRef, useState } from 'react';
import type { WeakAura } from '../types';

interface FileProcessorState {
  isProcessing: boolean;
  error: string | null;
}

export function useFileProcessor() {
  const [state, setState] = useState<FileProcessorState>({
    isProcessing: false,
    error: null,
  });
  
  const workerRef = useRef<Worker | null>(null);
  
  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      // Create worker with the worker file
      workerRef.current = new Worker(
        new URL('../workers/file-processor.worker.ts', import.meta.url),
        { type: 'module' }
      );
    }
    return workerRef.current;
  }, []);

  const parseFile = useCallback((content: string): Promise<WeakAura[]> => {
    return new Promise((resolve, reject) => {
      const worker = initWorker();
      
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const handleMessage = (e: MessageEvent) => {
        const { type, data } = e.data;
        
        worker.removeEventListener('message', handleMessage);
        setState(prev => ({ ...prev, isProcessing: false }));
        
        switch (type) {
          case 'PARSE_SUCCESS':
            resolve(data.auras);
            break;
          case 'ERROR':
            setState(prev => ({ ...prev, error: data.message }));
            reject(new Error(data.message));
            break;
          default:
            reject(new Error('Unknown response type'));
        }
      };
      
      worker.addEventListener('message', handleMessage);
      worker.postMessage({ type: 'PARSE_FILE', data: { content } });
    });
  }, [initWorker]);

  const generateFile = useCallback((
    originalContent: string,
    currentAuras: WeakAura[],
    fileName: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const worker = initWorker();
      
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const handleMessage = (e: MessageEvent) => {
        const { type, data } = e.data;
        
        worker.removeEventListener('message', handleMessage);
        setState(prev => ({ ...prev, isProcessing: false }));
        
        switch (type) {
          case 'GENERATE_SUCCESS':
            // Download the file
            const blob = new Blob([data.modifiedContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'WeakAuras_modified.lua';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            resolve();
            break;
          case 'ERROR':
            setState(prev => ({ ...prev, error: data.message }));
            reject(new Error(data.message));
            break;
          default:
            reject(new Error('Unknown response type'));
        }
      };
      
      worker.addEventListener('message', handleMessage);
      worker.postMessage({ 
        type: 'GENERATE_FILE', 
        data: { originalContent, currentAuras } 
      });
    });
  }, [initWorker]);

  // Cleanup worker when component unmounts
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    parseFile,
    generateFile,
    isProcessing: state.isProcessing,
    error: state.error,
    cleanup,
  };
} 