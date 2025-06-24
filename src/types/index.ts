export interface WeakAura {
  name: string;
  data: string; // The full LUA data for this aura
  parent?: string; // Optional parent aura name
}

export interface AuraGroup {
  parentName: string; // Name of the parent aura, or "No Parent" for orphaned auras
  auras: WeakAura[];
} 