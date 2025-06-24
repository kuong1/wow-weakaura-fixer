import type { WeakAura } from '../types';

export const parseWeakAurasFile = (content: string): WeakAura[] => {
  const auraList: WeakAura[] = [];
  
  // Find the displays section
  const displaysMatch = content.match(/\["displays"\]\s*=\s*\{/);
  if (!displaysMatch) return auraList;

  const displaysStart = displaysMatch.index! + displaysMatch[0].length;
  let braceCount = 1;
  let currentPos = displaysStart;
  let currentAuraStart = -1;
  let currentAuraName = '';
  
  // Parse through the displays section
  while (currentPos < content.length && braceCount > 0) {
    const char = content[currentPos];
    
    if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      
      // If we're closing an aura definition (braceCount === 1)
      if (braceCount === 1 && currentAuraStart >= 0) {
        const auraData = content.substring(currentAuraStart, currentPos + 1);
        
        // Extract parent information from the aura data
        const parentMatch = auraData.match(/\["parent"\]\s*=\s*"([^"]+)"/);
        const parent = parentMatch ? parentMatch[1] : undefined;
        
        auraList.push({
          name: currentAuraName,
          data: auraData,
          parent
        });
        currentAuraStart = -1;
        currentAuraName = '';
      }
    }
    
    // Look for aura names at the beginning of lines
    if (braceCount === 1 && currentAuraStart === -1) {
      const lineStart = content.lastIndexOf('\n', currentPos) + 1;
      const lineEnd = content.indexOf('\n', currentPos);
      const line = content.substring(lineStart, lineEnd >= 0 ? lineEnd : content.length);
      
      const auraNameMatch = line.match(/^\s*\["([^"]+)"\]\s*=\s*\{/);
      if (auraNameMatch) {
        currentAuraName = auraNameMatch[1];
        currentAuraStart = lineStart;
      }
    }
    
    currentPos++;
  }
  
  return auraList;
};

export const generateModifiedFile = (
  originalContent: string,
  currentAuras: WeakAura[],
  fileName: string
): void => {
  let modifiedContent = originalContent;
  
  // Get the list of auras to remove
  const originalAuras = parseWeakAurasFile(originalContent);
  const currentAuraNames = new Set(currentAuras.map(aura => aura.name));
  const aurasToRemove = originalAuras.filter(aura => !currentAuraNames.has(aura.name));

  // Remove each aura from the content using improved method
  const aurasWithPositions: Array<{ aura: WeakAura; start: number; end: number }> = [];
  
  for (const aura of aurasToRemove) {
    const escapedName = aura.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Find the exact start of the aura definition
    const auraStartRegex = new RegExp(`^(\\s*)\\["${escapedName}"\\]\\s*=\\s*\\{`, 'gm');
    let match = auraStartRegex.exec(originalContent);
    
    if (match) {
      const startPos = match.index;
      let pos = startPos + match[0].length;
      let braceCount = 1;
      
      // Find the end of this aura's definition
      while (pos < originalContent.length && braceCount > 0) {
        const char = originalContent[pos];
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
        pos++;
      }
      
      // Include the trailing comma and newline if they exist
      let endPos = pos;
      if (originalContent[endPos] === ',') {
        endPos++;
      }
      if (originalContent[endPos] === '\n') {
        endPos++;
      }
      
      aurasWithPositions.push({
        aura,
        start: startPos,
        end: endPos
      });
    }
  }
  
  // Sort by start position in descending order
  aurasWithPositions.sort((a, b) => b.start - a.start);
  
  // Remove auras from end to beginning to avoid position shifting
  for (const { start, end } of aurasWithPositions) {
    modifiedContent = modifiedContent.substring(0, start) + modifiedContent.substring(end);
  }

  const blob = new Blob([modifiedContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'WeakAuras_modified.lua';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 