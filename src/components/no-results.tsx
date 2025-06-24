

interface NoResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export function NoResults({ searchTerm, onClearSearch }: NoResultsProps) {
  return (
    <div className="text-center py-8">
      <svg className="mx-auto h-12 w-12 text-zinc-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-zinc-400 text-lg">No auras found matching "{searchTerm}"</p>
      <button
        onClick={onClearSearch}
        className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        Clear search
      </button>
    </div>
  );
} 