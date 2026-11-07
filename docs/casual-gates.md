# Casual games lock

The study screen does not show games, movie or show tabs, thumbnails, or the Monday pick. Pressing P three times, outside a text field and without holding the key down, opens a PIN dialog. The right PIN shows the collection. Esc or Back returns to study and does not unlock. Lock, after the collection is open, clears the player and returns to study.

This is a casual lock for one browser tab on a static site. It is not an account, and it does not make the files private. Pages under `games/` and `arcade/` remain ordinary files. A refresh forgets the unlock. Saves and flashcards are not deleted.

The check fails closed when Web Crypto is missing or `access-verifiers.js` is missing, malformed, or not the expected PBKDF2 record. A short value, a non-numeric value, and a wrong PIN all stay locked. The dialog does not say which of those happened. Digits beyond six are kept and checked in full; the field does not cut the PIN down to six.

## Verifier

`credentials.gamesPin` is the only record. There is no second PIN and no secret-section password in this file.

```json
{
  "version": 1,
  "algorithm": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "keyLengthBytes": 32,
  "encoding": "base64",
  "credentials": {
    "gamesPin": { "salt": "<standard base64, 16 bytes>", "verifier": "<standard base64, 32 bytes>" }
  }
}
```

Derivation: UTF-8 of the exact typed string, no trim and no Unicode normalization, PBKDF2 HMAC-SHA-256, 600000 iterations, 256-bit output. Store the 16-byte salt and 32-byte result as standard base64. Do not put the PIN itself in the file, the page, or a chat.
