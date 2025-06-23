import { clearInstagramCache } from '@/lib/instagramApi';

export async function POST() {
  const cleared = clearInstagramCache();

  if (cleared) {
    return Response.json({
      success: true,
      message: 'Cache cleared successfully',
    });
  } else {
    return Response.json({ success: false, message: 'No cache file found' });
  }
}

// fetch('/api/clear-instagram-cache', { method: 'POST' })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => console.error(err));
