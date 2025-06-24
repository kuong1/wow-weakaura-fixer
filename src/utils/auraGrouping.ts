import type { WeakAura, AuraGroup } from '../types';

export function groupAurasByParent(auras: WeakAura[], searchTerm: string = ''): AuraGroup[] {
  // Filter auras based on search term
  const filteredAuras = auras.filter(aura =>
    aura.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group auras by their parent
  const groups = new Map<string, WeakAura[]>();

  for (const aura of filteredAuras) {
    const parentName = aura.parent || 'No Parent';
    
    if (!groups.has(parentName)) {
      groups.set(parentName, []);
    }
    groups.get(parentName)!.push(aura);
  }

  // Convert to array and sort
  const groupArray: AuraGroup[] = Array.from(groups.entries()).map(([parentName, auras]) => ({
    parentName,
    auras: auras.sort((a, b) => a.name.localeCompare(b.name))
  }));

  // Sort groups: "No Parent" last, then alphabetically
  return groupArray.sort((a, b) => {
    if (a.parentName === 'No Parent') return 1;
    if (b.parentName === 'No Parent') return -1;
    return a.parentName.localeCompare(b.parentName);
  });
} 