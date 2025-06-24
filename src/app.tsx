import { useWeakAuras } from './hooks/use-weak-auras';
import {
	FileUpload,
	SearchBar,
	ActionsBar,
	AuraAccordion,
	NoResults,
} from './components';

export function App() {
	const {
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
	} = useWeakAuras();

	const handleClearSearch = () => {
		setSearchTerm('');
	};

	return (
		<div className="min-h-screen bg-zinc-900 text-zinc-100">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-zinc-100 mb-2">WeakAura Fixer</h1>
					<p className="text-zinc-400 text-lg">
						Upload, manage, and modify your World of Warcraft WeakAuras configuration
					</p>
				</div>

				{/* Error Display */}
				{error && (
					<div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
						<div className="flex items-center space-x-2">
							<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span className="text-red-400 font-medium">Error:</span>
							<span className="text-red-300">{error}</span>
						</div>
					</div>
				)}

				{/* File Upload Section */}
				{auras.length === 0 && (
					<FileUpload onFileUpload={handleFileUpload} />
				)}

				{/* Auras Management Section */}
				{auras.length > 0 && (
					<div className="space-y-6">
						{/* Actions Bar */}
						<ActionsBar
							totalAuras={totalAuras}
							fileName={fileName}
							isProcessing={isProcessing}
							onReset={resetApp}
							onDownload={downloadModifiedFile}
						/>

						{/* Search Bar */}
						<SearchBar
							searchTerm={searchTerm}
							onSearchChange={setSearchTerm}
						/>

						{/* Auras Accordion */}
						<AuraAccordion
							groups={groupedAuras}
							expandedGroups={expandedGroups}
							onToggleGroup={toggleGroup}
							onRemoveGroup={removeGroup}
							onRemoveAura={removeAura}
						/>

						{/* No Results Message */}
						{searchTerm && totalAuras === 0 && (
							<NoResults
								searchTerm={searchTerm}
								onClearSearch={handleClearSearch}
							/>
						)}
					</div>
				)}

				{/* Footer */}
				<div className="mt-12 text-center text-zinc-500 text-sm">
					<p>Made by Munigan from LUNA (Onyxia/Warmane) (<a className="underline" href="https://github.com/diego3g">https://github.com/diego3g</a>)</p>
				</div>
			</div>
		</div>
	);
}

