import spriteMarkup from '../../assets/tech-sprite.svg?raw';

const TechIconSprite = () => (
  <div
    aria-hidden="true"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    dangerouslySetInnerHTML={{ __html: spriteMarkup }}
  />
);

export default TechIconSprite;
