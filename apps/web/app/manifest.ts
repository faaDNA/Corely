import type { MetadataRoute } from 'next';

// Manifest PWA: install ke home screen Android/desktop. iOS 16.4+ juga butuh ini untuk web push.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Corely',
    short_name: 'Corely',
    description: 'Satu workspace untuk seluruh produktivitas Anda.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#f8fafc',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
