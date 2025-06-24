import type { AuraGroup as AuraGroupType } from '../types';
import { AuraItem } from './aura-item';

interface AuraGroupProps {
  group: AuraGroupType;
  isExpanded: boolean;
  onToggle: (parentName: string) => void;
  onRemoveGroup: (parentName: string) => void;
  onRemoveAura: (auraName: string) => void;
}

export function AuraGroup({
  group,
  isExpanded,
  onToggle,
  onRemoveGroup,
  onRemoveAura,
}: AuraGroupProps) {
  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
      {/* Group Header */}
      <div className="flex justify-between items-center p-4 hover:bg-zinc-750 transition-colors">
        <button
          onClick={() => onToggle(group.parentName)}
          className="flex items-center space-x-3 flex-1 text-left"
        >
          <svg
            className={`h-5 w-5 text-zinc-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-zinc-100">
              {group.parentName === 'No Parent' ? 'Ungrouped Auras' : group.parentName}
            </h3>
            <p className="text-sm text-zinc-400">
              {group.auras.length} aura{group.auras.length !== 1 ? 's' : ''}
            </p>
          </div>
        </button>
        <button
          onClick={() => onRemoveGroup(group.parentName)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          Remove Group
        </button>
      </div>

      {/* Group Content */}
      {isExpanded && (
        <div className="border-t border-zinc-700">
          {group.auras.map((aura, index) => (
            <div key={aura.name}>
              {index > 0 && <div className="border-t border-zinc-700" />}
              <AuraItem
                aura={aura}
                groupName={group.parentName}
                onRemove={onRemoveAura}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 