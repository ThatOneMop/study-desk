import assert from 'node:assert/strict';
import {createFixedStepper} from '../dist/sim-clock.mjs';

function run(frame, frames) {
  const clock = createFixedStepper();
  let steps = 0, sim = 0;
  for (let i = 0; i < frames; i++) {
    const slice = clock.consume(frame);
    steps += slice.length;
    sim += slice.reduce((sum, dt) => sum + dt, 0);
  }
  return {steps, sim, pending: clock.pending()};
}

const slow = run(1 / 30, 30);
const fast = run(1 / 120, 120);
assert.equal(slow.steps, fast.steps);
assert.ok(Math.abs(slow.sim - fast.sim) < 1e-9, '30 FPS and 120 FPS simulate the same second');
assert.ok(Math.abs(slow.sim - 1) < 1 / 60, 'one real second stays within a single step of one sim second');
assert.ok(slow.steps >= 59 && slow.steps <= 60);

const hitch = createFixedStepper();
const caught = hitch.consume(1);
assert.ok(Math.abs(caught.reduce((sum, dt) => sum + dt, 0) - 0.25) < 1e-9, 'a one-second hitch catches up a quarter second, not 60 ms and not the whole second');
assert.equal(caught.length, 15);
assert.equal(hitch.consume(-5).length, 0);
assert.equal(hitch.consume(Number.NaN).length, 0);

const partial = createFixedStepper();
assert.equal(partial.consume(0.01).length, 0);
assert.equal(partial.consume(0.006).length, 0);
const crossed = partial.consume(0.001);
assert.equal(crossed.length, 1);
assert.ok(Math.abs(crossed[0] - 1 / 60) < 1e-12);
assert.ok(partial.pending() < 1 / 60);

assert.throws(() => createFixedStepper({step: 0, maxFrame: 1}));
console.log('PASS: fixed steps match across 30/120 FPS, long frames catch up to 0.25 s, and short frames keep their remainder.');
