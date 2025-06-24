import type { AuraGroup as AuraGroupType } from '../types';
import { AuraGroup } from './aura-group';

interface AuraAccordionProps {
  groups: AuraGroupType[];
  expandedGroups: Set<string>;
  onToggleGroup: (parentName: string) => void;
  onRemoveGroup: (parentName: string) => void;
  onRemoveAura: (auraName: string) => void;
}

export function AuraAccordion({
  groups,
  expandedGroups,
  onToggleGroup,
  onRemoveGroup,
  onRemoveAura,
}: AuraAccordionProps) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <AuraGroup
          key={group.parentName}
          group={group}
          isExpanded={expandedGroups.has(group.parentName)}
          onToggle={onToggleGroup}
          onRemoveGroup={onRemoveGroup}
          onRemoveAura={onRemoveAura}
        />
      ))}
    </div>
  );
} 