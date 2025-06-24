import { useState, useCallback, useMemo, useEffect } from 'react';
import type { WeakAura } from '../types';
import { groupAurasByParent } from '../utils/auraGrouping';
import { useFileProcessor } from './use-file-processor';

export function useWeakAuras() {
  const [auras, setAuras] = useState<WeakAura[]>([]);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const { parseFile, generateFile, isProcessing, error, cleanup } = useFileProcessor();

  // Cleanup worker when component unmounts
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Group auras by parent relationship and filter by search term
  const groupedAuras = useMemo(() => {
    return groupAurasByParent(auras, searchTerm);
  }, [auras, searchTerm]);

  const totalAuras = useMemo(() => {
    return groupedAuras.reduce((sum, group) => sum + group.auras.length, 0);
  }, [groupedAuras]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    try {
      const content = await file.text();
      setOriginalContent(content);
      
      // Parse file using Web Worker
      const parsedAuras = await parseFile(content);
      setAuras(parsedAuras);
      
      // Keep groups closed by default - don't expand any groups
      setExpandedGroups(new Set());
    } catch (error) {
      console.error('Error processing file:', error);
      // Reset state on error
      setAuras([]);
      setOriginalContent('');
      setFileName('');
    }
  }, [parseFile]);

  const removeAura = useCallback((auraName: string) => {
    setAuras(prev => prev.filter(aura => aura.name !== auraName));
  }, []);

  const removeGroup = useCallback((parentName: string) => {
    setAuras(prev => {
      if (parentName === 'No Parent') {
        // Remove all auras without a parent
        return prev.filter(aura => aura.parent);
      } else {
        // Remove the parent and all its children
        return prev.filter(aura => 
          aura.name !== parentName && aura.parent !== parentName
        );
      }
    });
  }, []);

  const toggleGroup = useCallback((parentName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(parentName)) {
        newSet.delete(parentName);
      } else {
        newSet.add(parentName);
      }
      return newSet;
    });
  }, []);

  const downloadModifiedFile = useCallback(async () => {
    if (!originalContent) return;
    
    try {
      await generateFile(originalContent, auras, fileName);
    } catch (error) {
      console.error('Error generating file:', error);
    }
  }, [originalContent, auras, fileName, generateFile]);

  const resetApp = useCallback(() => {
    setAuras([]);
    setOriginalContent('');
    setFileName('');
    setSearchTerm('');
    setExpandedGroups(new Set());
  }, []);

  return {
    auras,
    fileName,
    searchTerm,
    expandedGroups,
    groupedAuras,
    totalAuras,
    isProcessing,
    error,
    setSearchTerm,
    handleFileUpload,
    removeAura,
    removeGroup,
    toggleGroup,
    downloadModifiedFile,
    resetApp,
  };
} 