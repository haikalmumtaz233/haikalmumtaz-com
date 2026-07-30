import { useEffect, useState } from 'react';
import spriteUrl from '../../assets/tech-sprite.svg?url';

const TechIconSprite = () => {
  const [spriteMarkup, setSpriteMarkup] = useState('');

  useEffect(() => {
    let isStale = false;

    fetch(spriteUrl)
      .then((response) => response.text())
      .then((markup) => {
        if (!isStale) setSpriteMarkup(markup);
      })
      .catch(() => undefined);

    return () => {
      isStale = true;
    };
  }, []);

  if (!spriteMarkup) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      dangerouslySetInnerHTML={{ __html: spriteMarkup }}
    />
  );
};

export default TechIconSprite;
