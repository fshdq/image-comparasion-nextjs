import React, { useState } from 'react';

interface ImageUploadProps {
  onUpload: (image1: File | null, image2: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  };

  const handleSubmit = () => {
    onUpload(image1, image2);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <label className="block">
          <span className="text-gray-700">Upload First Image:</span>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => handleImageChange(e, setImage1)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Upload Second Image:</span>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => handleImageChange(e, setImage2)}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Compare Images
      </button>
    </div>
  );
};

export default ImageUpload;
