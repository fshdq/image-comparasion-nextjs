'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageComparison from '@/components/ImageComparison';
import { supabase } from '@/lib/supabase';

const ComparePage: React.FC = () => {
  const { id } = useParams();
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedImages = async () => {
      const { data, error } = await supabase
        .from('shared_links')
        .select('before_url, after_url')
        .eq('id', id)
        .single();

      if (data) {
        setBeforeImage(data.before_url);
        setAfterImage(data.after_url);
      } else {
        console.error('Error fetching shared images:', error);
      }
    };

    if (id) fetchSharedImages();
  }, [id]);

  if (!beforeImage || !afterImage) {
    return <div className="text-center text-gray-500">Invalid or expired link.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Shared Image Comparison</h1>
        <ImageComparison
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeLabel="Before"
          afterLabel="After"
        />
      </div>
    </div>
  );
};

export default ComparePage;
