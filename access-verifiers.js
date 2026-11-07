/* Casual games-screen lock. Not account security and not private hosting.
   PBKDF2 HMAC-SHA-256, 600000 iterations, 32-byte key, UTF-8, no trim.
   Salt and verifier are standard base64. See docs/casual-gates.md.
   Only credentials.gamesPin is used. A missing or rejected record stays locked. */
window.ACCESS_VERIFIERS = {
  "version": 1,
  "algorithm": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "keyLengthBytes": 32,
  "encoding": "base64",
  "credentials": {
    "gamesPin": {
      "salt": "Sfpoe42BBFipqbaqHdzCXA==",
      "verifier": "xQ5eDEgNXX8xuKnAQvZtAQyIMQufYWkHmgPO2pXlHI0="
    }
  }
};
