'use client';
import Image from 'next/image';
import { useState } from 'react';

interface ImageComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="max-w-4xl mx-auto my-8 relative">
      <div className="relative w-full h-auto overflow-hidden">
        {/* Before Image - Always Fully Visible */}
        <div className="relative w-full h-auto">
        <Image 
            src={afterImage} 
            alt="After" 
            width={800} 
            height={500} 
            className="w-full h-auto"
            priority
          />
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded z-99">
            {afterLabel}
          </div>
        </div>

        {/* After Image - Revealed by Slider */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image 
            src={beforeImage} 
            alt="Before" 
            width={800} 
            height={500} 
            className="w-full h-auto"
            priority
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded">
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="10"
            viewBox="0 0 18 10"
            fill="currentColor"
          >
            <path d="M12.121 4.703V.488c0-.302.384-.454.609-.24l4.42 4.214a.33.33 0 0 1 0 .481l-4.42 4.214c-.225.215-.609.063-.609-.24V4.703z"></path>
            <path d="M5.879 4.703V.488c0-.302-.384-.454-.609-.24L.85 4.462a.33.33 0 0 0 0 .481l4.42 4.214c.225.215.609.063.609-.24V4.703z"></path>
          </svg>
        </div>
      </div>

      {/* Range Input (Slider) */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
    </section>
  );
};

export default ImageComparison;
