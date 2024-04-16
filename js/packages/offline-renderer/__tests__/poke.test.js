import OfflineRenderer from '../index';
import { el } from '@elemaudio/core';


test.only('poke node', async function() {
  let core = new OfflineRenderer();

  await core.initialize({
    numInputChannels: 0,
    numOutputChannels: 1,
  });

  // Graph
  core.render(el.poke());

  // Ten blocks of data
  let inps = [];
  let outs = [new Float32Array(512 * 10)];

  // Get past the fade-in
  core.process(inps, outs);

  // Now we should be able to poke the graph and see the impulse on the next block
  core.poke();

  inps = [];
  outs = [new Float32Array(32)];

  core.process(inps, outs);
  expect(outs[0]).toMatchSnapshot();
});
