import type { WeakAura } from '../types';

interface AuraItemProps {
  aura: WeakAura;
  groupName: string;
  onRemove: (auraName: string) => void;
}

export function AuraItem({ aura, groupName, onRemove }: AuraItemProps) {
  return (
    <div className="flex justify-between items-center p-4 hover:bg-zinc-750 transition-colors">
      <div>
        <h4 className="text-zinc-100 font-medium">{aura.name}</h4>
        <p className="text-zinc-400 text-sm">
          {groupName === 'No Parent' ? 'No parent group' : `Parent: ${groupName}`}
        </p>
      </div>
      <button
        onClick={() => onRemove(aura.name)}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
      >
        Remove
      </button>
    </div>
  );
} 