import { renderCosmos, type CosmosRequest } from './cosmos';

self.addEventListener('message', (event: MessageEvent<CosmosRequest>) => {
  const layers = renderCosmos(event.data);
  const transfer = [layers.sky.data.buffer, layers.dust.data.buffer];
  if (layers.galaxy) transfer.push(layers.galaxy.data.buffer);
  self.postMessage(layers, { transfer });
});
