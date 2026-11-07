'use strict';
const crypto = require('node:crypto').webcrypto;

function b64(bytes) {
  let text = '';
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}
async function derive(secret) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600000 }, key, 256));
  return { salt: b64(salt), verifier: b64(bits) };
}
function randomPin(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let pin = '';
  for (const byte of bytes) pin += String(byte % 10);
  return pin;
}
function polyfillCrypto(windowObject) {
  if (typeof windowObject.TextEncoder !== 'function') windowObject.TextEncoder = TextEncoder;
  if (windowObject.crypto?.subtle?.deriveBits && windowObject.crypto?.subtle?.importKey) return;
  const value = {
    subtle: crypto.subtle,
    getRandomValues: array => crypto.getRandomValues(array),
    randomUUID: crypto.randomUUID.bind(crypto)
  };
  Object.defineProperty(windowObject, 'crypto', { configurable: true, writable: true, value });
}
async function installSynthetic(windowObject) {
  polyfillCrypto(windowObject);
  if (windowObject.__gateSynthetic) return windowObject.__gateSynthetic;
  const pin = randomPin(8);
  windowObject.ACCESS_VERIFIERS = {
    version: 1, algorithm: 'PBKDF2', hash: 'SHA-256', iterations: 600000, keyLengthBytes: 32, encoding: 'base64',
    credentials: { gamesPin: await derive(pin) }
  };
  windowObject.__gateSynthetic = { pin };
  return windowObject.__gateSynthetic;
}
async function unlockShell(windowObject) {
  const creds = await installSynthetic(windowObject);
  if (windowObject.studyGamesUnlocked?.()) return creds;
  const document = windowObject.document;
  const gate = document.getElementById('pinGate');
  if (!gate?.open) {
    if (!['#games', '#movies', '#tv'].includes(windowObject.location.hash)) windowObject.history.replaceState(null, '', '#games');
    windowObject.dispatchEvent(new windowObject.HashChangeEvent('hashchange'));
  }
  document.getElementById('pinInput').value = creds.pin;
  document.getElementById('pinForm').dispatchEvent(new windowObject.Event('submit', { bubbles: true, cancelable: true }));
  const started = Date.now();
  while (!windowObject.studyGamesUnlocked?.()) {
    if (Date.now() - started > 8000) throw new Error('games gate stayed locked');
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  return creds;
}
module.exports = { unlockShell, installSynthetic, derive, randomPin, polyfillCrypto };
