import React from 'react';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  return (
    <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-8 mb-6">
      <div className="text-center">
        <div className="border-2 border-dashed border-zinc-600 rounded-lg p-8 transition-colors">
          <svg 
            className="mx-auto h-12 w-12 text-zinc-400 mb-4" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          
          <h3 className="text-xl font-medium text-zinc-200 mb-2">
            Upload your WeakAuras.lua file
          </h3>
          <p className="text-zinc-400 mb-4">
            Select your WeakAuras configuration file to get started
          </p>
          
          <label htmlFor="file-upload">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Select File
            </span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".lua"
              className="sr-only"
              onChange={onFileUpload}
            />
          </label>
          <p className="text-zinc-500 text-sm mt-2">Supports .lua files only</p>
        </div>
      </div>
    </div>
  );
} 