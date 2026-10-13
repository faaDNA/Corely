/* Service worker Corely — tampilkan push sebagai notifikasi OS. */
self.addEventListener('push', (event) => {
  let data = { title: 'Corely', body: '', url: '/dashboard' };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    // payload rusak → pakai default.
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: { url: data.url },
      icon: '/icon-192.png',
      badge: '/icon-192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});
