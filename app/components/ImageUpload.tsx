'use client';
import Image from 'next/image';
import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    updateFile(file);
  };

  const updateFile = (file: File | null) => {
    setSelectedFile(file);
    onUpload(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 bg-white border-dashed rounded-lg transition-all duration-300 p-4 cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <Image 
        src={previewUrl} 
        alt="Uploaded Image" 
        width={300} // Adjust width based on UI needs
        height={200} // Adjust height based on UI needs
        className="w-full h-full object-cover rounded-lg" 
        priority 
      />
      ) : (
        <>
          <div className="w-12 h-12 text-gray-500 mb-2"></div>
          <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUpload;
