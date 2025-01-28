'use client';
import { useState } from 'react';
import ImageComparison from '@/components/ImageComparasion';

const Home: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Image Comparison Slider
        </h1>

        {/* Upload Section */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Before Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setBeforeImage)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload After Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setAfterImage)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Image Comparison Component */}
        {beforeImage && afterImage && (
          <ImageComparison
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="Before"
            afterLabel="After"
          />
        )}

        {/* Placeholder Message */}
        {(!beforeImage || !afterImage) && (
          <div className="text-center text-gray-500">
            Please upload both "Before" and "After" images to see the
            comparison.
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
