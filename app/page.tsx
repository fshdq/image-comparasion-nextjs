'use client';
import { useState } from 'react';
import ImageComparison from '@/components/ImageComparison';
import { supabase } from '@/lib/supabase';
import ImageUpload from './components/ImageUpload';

const Home: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (file: File | null, setImage: (image: File | null) => void) => {
    setImage(file);
  };

  const dataURLtoFile = (file: File) => file;

  const handleShare = async () => {
    if (!beforeImage || !afterImage) return;

    setIsUploading(true);

    try {
      // Upload "Before" image
      const { data: beforeData, error: beforeError } = await supabase.storage
        .from('image-comparison')
        .upload(`before-${Date.now()}.jpg`, beforeImage);

      if (beforeError) throw beforeError;

      // Upload "After" image
      const { data: afterData, error: afterError } = await supabase.storage
        .from('image-comparison')
        .upload(`after-${Date.now()}.jpg`, afterImage);

      if (afterError) throw afterError;

      // Insert data into the shared_links table
      const { data: linkData, error: linkError } = await supabase
        .from('shared_links')
        .insert([
          {
            before_url: supabase.storage.from('image-comparison').getPublicUrl(beforeData.path).data.publicUrl,
            after_url: supabase.storage.from('image-comparison').getPublicUrl(afterData.path).data.publicUrl,
          },
        ])
        .select()
        .single();

      if (linkError) throw linkError;

      // Generate a shareable link
      const tempLink = `${window.location.origin}/compare/${linkData.id}`;
      setShareLink(tempLink);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className="text-primary from-primary/15 ring-primary/35 inline-flex rounded-lg bg-gradient-to-t p-1 ring-2"
            style={{ width: 38, height: 38 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" fill="currentColor" viewBox="0 0 512 512">
              <path d="M453.94 118.15H10.87C5.42 118.15 0 121.9 0 127.34v315.08c0 5.43 5.42 10.5 10.87 10.5h443.07c5.44 0 8.83-5.07 8.83-10.5V127.34c0-5.44-3.38-9.19-8.83-9.19m-10.86 315.08H19.69v-35.97l138.6-138.1 131.16 121.55a10 10 0 0 0 13.79-.26l71.81-72.25 68.03 59.91zm0-91.28-61.94-54.63a9.53 9.53 0 0 0-13.18.44l-71.93 72.06L165.2 238.28a10.45 10.45 0 0 0-14.14.25L19.69 369.42V137.85h423.39z" />
              <path d="M503.17 59.08H60.1c-5.45 0-10.87 3.75-10.87 9.18v40.05h19.7V78.77H492.3v295.38h-19.7v19.7h30.56c5.45 0 8.83-5.07 8.83-10.51V68.26c0-5.44-3.38-9.18-8.83-9.18z" />
              <path d="M306.25 186.42a49.29 49.29 0 0 0-49.23 49.23 49.29 49.29 0 0 0 49.23 49.23 49.29 49.29 0 0 0 49.23-49.23 49.29 49.29 0 0 0-49.23-49.23m0 78.77a29.57 29.57 0 0 1-29.54-29.54 29.57 29.57 0 0 1 29.54-29.54 29.57 29.57 0 0 1 29.54 29.54 29.57 29.57 0 0 1-29.54 29.53z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold leading-tight sm:text-3xl">Image Comparison Slider</h1>
        </div>

        {/* ✅ Share Button + Link (If Available) */}
        {shareLink ? (
          <div className="flex items-center gap-2">
            <textarea readOnly value={shareLink} className="w-64 p-2 border rounded text-sm text-gray-800" />
            <button onClick={handleCopy} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Copy
            </button>
          </div>
        ) : (
          <button
            onClick={handleShare}
            disabled={isUploading}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isUploading ? 'Uploading...' : 'Share Comparison'}
          </button>
        )}
      </header>
      <div className="mx-auto max-w-[1680px] mb-14 px-3 py-10 sm:px-5 lg:px-6 xl:px-8 2xl:px-14">
        {/* <header>
          <div className="flex items-center gap-4">
            <div
              className="text-primary from-primary/15 ring-primary/35 inline-flex rounded-lg bg-gradient-to-t p-1 ring-2"
              style={{ width: 38, height: 38 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M453.94 118.15H10.87C5.42 118.15 0 121.9 0 127.34v315.08c0 5.43 5.42 10.5 10.87 10.5h443.07c5.44 0 8.83-5.07 8.83-10.5V127.34c0-5.44-3.38-9.19-8.83-9.19m-10.86 315.08H19.69v-35.97l138.6-138.1 131.16 121.55a10 10 0 0 0 13.79-.26l71.81-72.25 68.03 59.91zm0-91.28-61.94-54.63a9.53 9.53 0 0 0-13.18.44l-71.93 72.06L165.2 238.28a10.45 10.45 0 0 0-14.14.25L19.69 369.42V137.85h423.39z" />
                <path d="M503.17 59.08H60.1c-5.45 0-10.87 3.75-10.87 9.18v40.05h19.7V78.77H492.3v295.38h-19.7v19.7h30.56c5.45 0 8.83-5.07 8.83-10.51V68.26c0-5.44-3.38-9.18-8.83-9.18z" />
                <path d="M306.25 186.42a49.29 49.29 0 0 0-49.23 49.23 49.29 49.29 0 0 0 49.23 49.23 49.29 49.29 0 0 0 49.23-49.23 49.29 49.29 0 0 0-49.23-49.23m0 78.77a29.57 29.57 0 0 1-29.54-29.54 29.57 29.57 0 0 1 29.54-29.54 29.57 29.57 0 0 1 29.54 29.54 29.57 29.57 0 0 1-29.54 29.53z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold leading-tight sm:text-3xl">
              Image Comparison Slider
            </h1>
          </div>
          <p className="mt-4 text-sm">
            Easily compare two images placed on top of each other with intuitive slider
            operation.
          </p>
        </header> */}

        {/* Upload Section */}
        <div className="space-y-4 my-8">
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select the first image</h3>
              <ImageUpload onUpload={(file) => handleImageUpload(file, setBeforeImage)} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select the second image</h3>
              <ImageUpload onUpload={(file) => handleImageUpload(file, setAfterImage)} />
            </div>
          </div>
        </div>

        {/* Image Comparison Component */}
        {beforeImage && afterImage && (
          <>
            <ImageComparison beforeImage={URL.createObjectURL(beforeImage)} afterImage={URL.createObjectURL(afterImage)} beforeLabel="Before" afterLabel="After" />
            <button onClick={handleShare} disabled={isUploading} className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
              {isUploading ? 'Uploading...' : 'Share Comparison'}
            </button>
          </>
        )}

        {/* Shareable Link */}
        {shareLink && (
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">Share this link:</p>
            <div className="flex items-center gap-2">
              <textarea readOnly value={shareLink} className="w-full p-2 border rounded text-sm text-gray-800" />
              <button onClick={handleCopy} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Placeholder Message */}
        {(!beforeImage || !afterImage) && <div className="text-center text-gray-500">Please upload both "Before" and "After" images to see the comparison.</div>}
      </div>
    </div>
  );
};

export default Home;
