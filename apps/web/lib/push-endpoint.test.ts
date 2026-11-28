import assert from 'node:assert/strict';
import { isHttpUrl, isPushEndpoint, isPushKeys } from './push-endpoint.ts';

// push service resmi lolos
assert.ok(isPushEndpoint('https://fcm.googleapis.com/fcm/send/abc:def'));
assert.ok(isPushEndpoint('https://updates.push.services.mozilla.com/wpush/v2/xyz'));
assert.ok(isPushEndpoint('https://web.push.apple.com/QF1'));
assert.ok(isPushEndpoint('https://db5p.notify.windows.com/w/?token=1'));
// SSRF: metadata cloud, internal, http, port, host mirip, kredensial
assert.ok(!isPushEndpoint('http://169.254.169.254/latest/meta-data'));
assert.ok(!isPushEndpoint('http://fcm.googleapis.com/fcm/send/x'));
assert.ok(!isPushEndpoint('https://fcm.googleapis.com:8443/x'));
assert.ok(!isPushEndpoint('https://fcm.googleapis.com.evil.com/x'));
assert.ok(!isPushEndpoint('https://evilfcm.googleapis.com.attacker.io/x'));
assert.ok(!isPushEndpoint('https://user:pw@fcm.googleapis.com/x'));
assert.ok(!isPushEndpoint('not a url'));

assert.ok(isPushKeys({ p256dh: 'B'.repeat(87), auth: 'a'.repeat(22) }));
assert.ok(!isPushKeys({ p256dh: 'short', auth: 'a'.repeat(22) }));
assert.ok(!isPushKeys({ p256dh: 'B'.repeat(87), auth: '<script>' }));

assert.ok(isHttpUrl('https://github.com/x'));
assert.ok(isHttpUrl('http://localhost:3000'));
assert.ok(!isHttpUrl('javascript:alert(1)'));
assert.ok(!isHttpUrl('data:text/html,<b>x</b>'));
assert.ok(!isHttpUrl('github.com'));

console.log('push-endpoint.test.ts OK');
