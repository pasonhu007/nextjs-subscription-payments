'use client'

import React, { useState, useRef, DragEvent } from 'react';

interface Props {
  onFilesSelected: (files: FileList) => void;
}

const FileUploader: React.FC<Props> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 ${isDragging ? 'border-blue-500' : 'border-gray-500 '} p-4 rounded-md`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        multiple 
        className="hidden" 
        onChange={handleFileChange}
      />
      {isDragging ? <p>Drop files here...</p> : <p>Drag & Drop files or click to select</p>}
    </div>
  );
}

export default FileUploader;
