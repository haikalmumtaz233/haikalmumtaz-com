import { renderCosmos, type Bitmap, type CosmosImages, type CosmosRequest } from './cosmos';

const toImage = ({ data, width, height }: Bitmap) =>
  createImageBitmap(new ImageData(data, width, height));

self.addEventListener('message', async (event: MessageEvent<CosmosRequest>) => {
  const layers = renderCosmos(event.data);
  const [sky, dust, planet] = await Promise.all([
    toImage(layers.sky),
    toImage(layers.dust),
    toImage(layers.planet),
  ]);
  const images: CosmosImages = { sky, dust, planet };
  self.postMessage(images, { transfer: [sky, dust, planet] });
});
