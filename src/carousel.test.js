import test from 'node:test';
import assert from 'node:assert/strict';
import {slidesForWidth} from './carousel.js';

test('carousel uses the correct initial count at each responsive boundary', () => {
  for (const [width, expected] of [[390,1],[575,1],[576,2],[991,2],[992,3],[1199,3],[1200,4]]) {
    assert.equal(slidesForWidth(width), expected);
  }
});
