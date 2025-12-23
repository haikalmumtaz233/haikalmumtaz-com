export interface HobbyItem {
  id: number;
  title: string;
  type: 'gaming' | 'music' | 'movies' | 'tech';
  content: GamingContent | MusicContent | MoviesContent | TechContent;
  colSpan: string;
  rowSpan: string;
}

export interface GamingContent {
  games: Array<{
    name: string;
    rank: string;
    image: string;
  }>;
}

export interface MusicContent {
  nowPlaying: {
    track: string;
    artist: string;
  };
  playlist: string[];
}

export interface MoviesContent {
  title: string;
  posters: string[];
}

export interface TechContent {
  item: string;
  description?: string;
}

export const hobbies: HobbyItem[] = [
  {
    id: 1,
    title: 'Rank Showcase',
    type: 'gaming',
    content: {
      games: [
        {
          name: 'Mobile Legends',
          rank: 'Mythic Immortal',
          image: 'https://placehold.co/800x800/1a1a1a/white?text=MLBB',
        },
        {
          name: 'Valorant',
          rank: 'Immortal',
          image: 'https://placehold.co/800x800/1a1a1a/white?text=Valorant',
        },
      ],
    } as GamingContent,
    colSpan: 'col-span-2',
    rowSpan: 'row-span-2',
  },
  {
    id: 2,
    title: 'On Repeat',
    type: 'music',
    content: {
      nowPlaying: {
        track: 'Love Me Not',
        artist: 'Playlist Mix',
      },
      playlist: [
        'Love Me Not',
        'Be My Baby',
        'Birds of a Feather',
        'Line Without a Hook',
        'Blue',
      ],
    } as MusicContent,
    colSpan: 'col-span-2',
    rowSpan: 'row-span-1',
  },
  {
    id: 3,
    title: 'Cinema & Chill',
    type: 'movies',
    content: {
      title: 'Movie Watchlist',
      posters: [
        'https://placehold.co/200x300/1a1a1a/white?text=Movie+1',
        'https://placehold.co/200x300/1a1a1a/white?text=Movie+2',
        'https://placehold.co/200x300/1a1a1a/white?text=Movie+3',
        'https://placehold.co/200x300/1a1a1a/white?text=Movie+4',
      ],
    } as MoviesContent,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-2',
  },
  {
    id: 4,
    title: 'Daily Driver',
    type: 'tech',
    content: {
      item: 'MacBook Pro M2',
      description: 'Primary development machine',
    } as TechContent,
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1',
  },
];
