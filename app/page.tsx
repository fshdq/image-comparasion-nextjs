'use client';
import { useState } from 'react';
import ImageComparison from '@/components/ImageComparison';
import { supabase } from '@/lib/supabase';

const Home: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (
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

  const dataURLtoFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleShare = async () => {
    if (!beforeImage || !afterImage) return;

    setIsUploading(true);

    try {
      // Upload "Before" image
      const beforeFile = dataURLtoFile(beforeImage, 'before.jpg');
      const { data: beforeData, error: beforeError } = await supabase.storage
        .from('image-comparison')
        .upload(`before-${Date.now()}.jpg`, beforeFile);

      if (beforeError) throw beforeError;

      // Upload "After" image
      const afterFile = dataURLtoFile(afterImage, 'after.jpg');
      const { data: afterData, error: afterError } = await supabase.storage
        .from('image-comparison')
        .upload(`after-${Date.now()}.jpg`, afterFile);

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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Image Comparison Slider</h1>

        {/* Upload Section */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Before Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBeforeImage)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Upload After Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setAfterImage)} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Image Comparison Component */}
        {beforeImage && afterImage && (
          <>
            <ImageComparison beforeImage={beforeImage} afterImage={afterImage} beforeLabel="Before" afterLabel="After" />
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
