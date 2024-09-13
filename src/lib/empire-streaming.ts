import {
  ContentItem,
  ContentItems,
  ContentVideos,
  Episode,
  VideoData,
  VideoInfoByLanguage,
} from '@/lib/empire-interfaces';

let allItems: ContentItems = { films: [], series: [] };

async function getItems(): Promise<ContentItems> {
  if (allItems.films.length === 0 && allItems.series.length === 0) {
    const response = await fetch(
      'https://empire-streaming.life/api/views/contenitem'
    );
    allItems = await response.json().then((data) => data.contentItem);
  }
  return allItems;
}

async function getSlug(
  typeContent: string,
  idContent: number
): Promise<string> {
  const response = await fetch(
    'https://empire-streaming.life/api/travelguard/prev',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        data: {
          ip: '1',
          type: 'premium',
          keyCall: 'c$2',
          infoIp: '',
          idContent,
          typeContent,
        },
      }),
    }
  );
  const data = await response.json();
  return data.slug;
}

interface SeasonData {
  seasonNumber: number;
  episodes: { season: number; episode: number }[];
}

export interface ContentData {
  id: number;
  title: string;
  type: string;
  seasons?: SeasonData[];
}

let contentData: ContentData;

async function getData(content: number, type: string): Promise<ContentData> {
  const url = `https://empire-streaming.life/api/${
    type === 'serie' ? 'series' : 'films_anonymous'
  }/${content}`;

  const response: ContentVideos = await fetch(url).then((res) => res.json());

  if (type === 'serie') {
    contentData = {
      id: response.id,
      title: response.Titre,
      type: 'series',
      seasons: [],
    };

    for (const [seasonNumber, episodes] of Object.entries(response.Saison)) {
      const seasonData: SeasonData = {
        seasonNumber: parseInt(seasonNumber, 10),
        episodes: [],
      };

      for (const episode of episodes) {
        const episodeData: { id: number; season: number; episode: number } = {
          id: episode.id,
          season: episode.saison,
          episode: episode.episode,
        };
        seasonData.episodes.push(episodeData);
      }
      contentData.seasons?.push(seasonData);
    }
  } else {
    contentData = {
      id: response.id,
      title: response.Titre,
      type: 'film',
    };
  }

  return contentData;
}

async function getEpisodeSerie(
  season: number,
  episode: number,
  idContent: number
): Promise<Episode | undefined> {
  const response: ContentVideos = await fetch(
    `https://empire-streaming.life/api/series/${idContent}`
  ).then((res) => res.json());
  const seasonData = response.Saison[season];
  const episodeData = seasonData.find(
    (episodeData) => episodeData.episode === episode
  );
  return episodeData;
}

async function getFilm(
  idContent: number
): Promise<VideoInfoByLanguage | undefined> {
  const response: ContentVideos = await fetch(
    `https://empire-streaming.life/api/films_anonymous/${idContent}`
  ).then((res) => res.json());
  return response.video_info_premium;
}

async function getVideo(
  idContent: number,
  type: string,
  episode?: number,
  season?: number,
  vf?: boolean
): Promise<VideoData> {
  let slug;
  let idVideo: number | undefined;

  if (type === 'series' && episode != undefined && season != undefined) {
    const episodeData = await getEpisodeSerie(season, episode, idContent);
    if (episodeData) slug = await getSlug('serie', episodeData?.id);
    const isVF =
      vf && episodeData?.video_info_premium.vf
        ? episodeData.video_info_premium.vf.find(
            (video) => video.property === 'Eplayer_light'
          )?.idVideo
        : episodeData?.video_info_premium.vostfr
        ? episodeData.video_info_premium.vostfr.find(
            (video) => video.property === 'Eplayer_light'
          )?.idVideo
        : undefined; // Handle case where neither vf nor vostfr exist
    idVideo = isVF;
  } else {
    const contentData = await getFilm(idContent);
    await getData(idContent, type);
    slug = await getSlug(type, idContent);
    const isVF =
      vf && contentData?.vf
        ? contentData.vf.find((video) => video.property === 'Eplayer_light')
            ?.idVideo
        : contentData?.vostfr
        ? contentData.vostfr.find((video) => video.property === 'Eplayer_light')
            ?.idVideo
        : undefined; // Handle case where neither vf nor vostfr exist
    idVideo = isVF;
  }

  const response = await fetch(
    'https://empire-streaming.life/api/travelguard/get_data',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        data: {
          ip: '1',
          slug,
          idVideo,
          info: {
            idVideo: 1,
            title: '',
            type: '',
            poster: '',
            backdrop: '',
          },
        },
      }),
    }
  );
  return response.json();
}

export { getData, getItems, getVideo };
export type { ContentItem, VideoData };
