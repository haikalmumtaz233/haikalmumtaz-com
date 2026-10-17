import { useEffect } from 'react';
import { profile } from '../data/profile';

export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${profile.name}` : profile.name;
  }, [title]);
};
