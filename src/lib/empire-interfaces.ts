interface Image {
  path: string;
  property: string;
  size: string | null;
}

interface UniversExpo {
  img: string;
  name: string;
}

interface NewEpisode {
  bool: boolean;
  details: string;
}

interface SymImage {
  poster: string;
  backdrop: string;
}

interface Banner {
  id: number;
  title: string;
  versions: string[];
  dateCreatedAt: string;
  description: string;
  label: string;
  image: Image[];
  season: string;
  new_episode: NewEpisode;
  sym_image: SymImage;
  BackDrop: Image[];
  note: number;
  createdAt: string;
  path: string;
  last_episode: string;
  trailer: string;
  urlPath: string;
  universExpo: UniversExpo[];
}

interface Country {
  id: number;
  name: string;
  code: string;
  path: string;
}

interface DistributionMember {
  id: number;
  name: string;
  image: Image[];
}

interface Univers {
  id: number;
  name: string;
  image: Image[];
  images: Image[];
  path: string;
  urlPath: string;
}

interface VideoInfo {
  property: string;
  idVideo: number;
}

interface VideoInfoByLanguage {
  vf: VideoInfo[];
  vostfr: VideoInfo[];
}

interface Episode {
  id: number;
  versions: string[];
  createdAt: string;
  title: string;
  description: string;
  episode: number;
  saison: number;
  YearProduct: string;
  label: string;
  sym_image: string;
  isNew: boolean;
  video: {
    id: number;
    code: null;
    property: string;
    version: string;
    title: string;
    editMod: boolean;
    isPrem: boolean;
  }[];
  image: Image[];
  video_info_free: VideoInfoByLanguage;
  video_info_premium: VideoInfoByLanguage;
}

interface Season {
  [key: string]: Episode[];
}

interface ContentVideos {
  id: number;
  Titre: string;
  TitreOriginal: string | null;
  Description: string;
  Banner: Banner;
  Folder: null;
  Poster: Image[];
  BackDrop: Image[];
  YearProduct: string;
  Vote: number;
  Trailer: string;
  Country: Country;
  Distribution: DistributionMember[];
  Category: string[];
  category_id: number[];
  Univers: Univers[];
  label: string;
  CreatedAt: string;
  Saison: Season;
  year: number;
  slug: string;
  universExpo: UniversExpo[];
  urlPath: string;
  video_info_free?: VideoInfoByLanguage;
  video_info_premium?: VideoInfoByLanguage;
}

interface ContentItem {
  id: number;
  title: string;
  category: { name: string; id: number }[];
  univers: { name: string; id: number }[];
  description: string;
  originalTitle: string;
  label: string;
  image: Image[];
  season: string;
  new_episode: NewEpisode;
  path: string;
  trailer: string;
  versions: string[];
  dateCreatedAt: string;
  createdAt: string;
  note: number;
  year: number;
  slug: string;
  universExpo: { img: string; name: string }[];
  urlPath: string;
}

interface ContentItems {
  films: ContentItem[];
  series: ContentItem[];
}

interface VideoResponse {
  name: string;
  size: number;
  url: string;
}

interface VideoData {
  type: string;
  typeVideo: string;
  response: VideoResponse[];
  status: boolean;
}

export type {
  Banner,
  ContentItem,
  ContentItems,
  ContentVideos,
  Country,
  DistributionMember,
  Episode,
  Image,
  NewEpisode,
  Season,
  SymImage,
  Univers,
  UniversExpo,
  VideoData,
  VideoInfo,
  VideoInfoByLanguage,
  VideoResponse,
};
