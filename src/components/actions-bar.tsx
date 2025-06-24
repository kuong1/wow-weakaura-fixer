import { LoadingSpinner } from './loading-spinner';

interface ActionsBarProps {
  totalAuras: number;
  fileName: string;
  isProcessing: boolean;
  onReset: () => void;
  onDownload: () => void;
}

export function ActionsBar({ 
  totalAuras, 
  fileName, 
  isProcessing,
  onReset, 
  onDownload 
}: ActionsBarProps) {
  return (
    <div className="flex justify-between items-center bg-zinc-800 rounded-lg border border-zinc-700 p-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-zinc-100">
          WeakAuras ({totalAuras})
        </h2>
        {fileName && (
          <span className="text-sm text-zinc-400 bg-zinc-700 px-2 py-1 rounded">
            {fileName}
          </span>
        )}
        {isProcessing && (
          <div className="flex items-center space-x-2 text-sm text-blue-400">
            <LoadingSpinner size="sm" />
            <span>Processing...</span>
          </div>
        )}
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-200 rounded-md transition-colors"
        >
          Upload New File
        </button>
        <button
          onClick={onDownload}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Download Modified File</span>
          )}
        </button>
      </div>
    </div>
  );
} 