import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_MEMORIES,
  calculateDistance,
  findNearbyMemory,
  getCompletedMemoriesCount,
  isAllMemoriesCompleted,
  clampPlayerPosition,
  getNextInteractionState,
} from './rules';

test('initial memories list has authentic Diwali memories including bench sitting', () => {
  assert.equal(INITIAL_MEMORIES.length >= 10, true);
  const diyaMem = INITIAL_MEMORIES.find((m) => m.id === 'diya');
  assert.ok(diyaMem);
  assert.equal(diyaMem?.pose, 'bend');
  assert.equal(diyaMem?.shortPrompt, 'Light Diya');

  const sitMem = INITIAL_MEMORIES.find((m) => m.id === 'sit');
  assert.ok(sitMem);
  assert.equal(sitMem?.pose, 'sit');
});

test('calculateDistance computes Euclidean distance accurately', () => {
  const d = calculateDistance([0, 0, 0], [3, 0, 4]);
  assert.equal(d, 5);
});

test('findNearbyMemory detects memory within radius', () => {
  const nearby = findNearbyMemory([0, 0, 1.2], INITIAL_MEMORIES, 2.0);
  assert.ok(nearby);
  assert.equal(nearby?.id, 'rangoli');

  const none = findNearbyMemory([20, 0, 20], INITIAL_MEMORIES, 2.0);
  assert.equal(none, null);
});

test('interaction state machine transitions step-by-step', () => {
  assert.equal(getNextInteractionState('idle'), 'approaching');
  assert.equal(getNextInteractionState('approaching'), 'playing_animation');
  assert.equal(getNextInteractionState('playing_animation'), 'completing_event');
  assert.equal(getNextInteractionState('completing_event'), 'returning_control');
  assert.equal(getNextInteractionState('returning_control'), 'idle');
});

test('clampPlayerPosition bounds player inside gali walls and street endpoints', () => {
  const [clampedX, clampedZ] = clampPlayerPosition(10, -20);
  assert.equal(clampedX, 4.5);
  assert.equal(clampedZ, -14);
});
