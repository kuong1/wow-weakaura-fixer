import type { WeakAura } from '../types';

// Parse WeakAuras file to extract aura definitions with parent information
const parseWeakAurasFile = (content: string): WeakAura[] => {
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

// Better approach: remove entire aura blocks using more precise matching
const removeAurasFromContent = (
  originalContent: string,
  aurasToRemove: WeakAura[]
): string => {
  let modifiedContent = originalContent;
  
  // Sort by position in descending order to avoid offset issues
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
  
  return modifiedContent;
};

// Worker message handling
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  try {
    switch (type) {
      case 'PARSE_FILE':
        const { content } = data;
        const auras = parseWeakAurasFile(content);
        self.postMessage({ type: 'PARSE_SUCCESS', data: { auras } });
        break;
        
      case 'GENERATE_FILE':
        const { originalContent, currentAuras } = data;
        
        // Parse original file to get all auras
        const originalAuras = parseWeakAurasFile(originalContent);
        const currentAuraNames = new Set(currentAuras.map((aura: WeakAura) => aura.name));
        const aurasToRemove = originalAuras.filter(aura => !currentAuraNames.has(aura.name));
        
        // Remove auras using improved method
        const modifiedContent = removeAurasFromContent(originalContent, aurasToRemove);
        
        self.postMessage({ 
          type: 'GENERATE_SUCCESS', 
          data: { 
            modifiedContent,
            removedCount: aurasToRemove.length 
          } 
        });
        break;
        
      default:
        self.postMessage({ type: 'ERROR', data: { message: 'Unknown message type' } });
    }
  } catch (error) {
    self.postMessage({ 
      type: 'ERROR', 
      data: { 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      } 
    });
  }
}; 