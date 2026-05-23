import { useEffect, useState } from 'react';

interface CacheEntry {
  status: 'loading' | 'ok' | 'error';
  url?: string;
  promise?: Promise<void>;
}

const cache = new Map<string, CacheEntry>();

const fetchImage = (slug: string): Promise<void> => {
  const entry: CacheEntry = { status: 'loading' };
  const promise = fetch(`https://dog.ceo/api/breed/${slug}/images/random`)
    .then((r) => r.json())
    .then((data: { status: string; message: string }) => {
      if (data.status === 'success' && typeof data.message === 'string') {
        entry.status = 'ok';
        entry.url = data.message;
      } else {
        entry.status = 'error';
      }
    })
    .catch(() => {
      entry.status = 'error';
    });
  entry.promise = promise;
  cache.set(slug, entry);
  return promise;
};

export interface DogImageState {
  url: string | null;
  loading: boolean;
}

export function useDogImage(slug: string): DogImageState {
  const [, force] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const entry = cache.get(slug);
    if (entry) {
      if (entry.status === 'loading' && entry.promise) {
        entry.promise.then(() => force((n) => n + 1));
      }
      return;
    }
    fetchImage(slug).then(() => force((n) => n + 1));
  }, [slug]);

  if (!slug) return { url: null, loading: false };
  const entry = cache.get(slug);
  if (!entry) return { url: null, loading: true };
  if (entry.status === 'loading') return { url: null, loading: true };
  if (entry.status === 'error') return { url: null, loading: false };
  return { url: entry.url ?? null, loading: false };
}
