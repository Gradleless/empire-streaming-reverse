'use client';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  PlyrLayout,
  plyrLayoutIcons,
} from '@vidstack/react/player/layouts/plyr';
import Head from 'next/head';
import * as React from 'react';
import { useState } from 'react';
import '@/lib/env';

import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

import { ContentData, ContentItem } from '@/lib/empire-streaming';
import { VideoData } from '@/lib/empire-streaming';
import { sha256 } from '@/lib/md5';

import Logo from '~/svg/Logo.svg';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [fixResults, setFixResults] = useState<ContentItem[]>([]);
  const [itemData, setItemData] = useState<ContentData>();
  const [videoData, setVideoData] = useState<VideoData>();
  const [selectedVF, setSelectedVF] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number | undefined>(
    undefined
  );
  const [selectedEpisode, setSelectedEpisode] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const timestamp = Date.now().toString();
    const hashSig: string = await sha256('***REMOVED******REMOVED***:getItems:' + timestamp);
    const response = await fetch(`/api/getItems`, {
      headers: {
        s: hashSig,
        x: timestamp,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setFixResults(data);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (term: string) => {
    if (term === '') return setResults([]);
    if (fixResults.length === 0) return;

    setLoading(true);
    const filteredResults = fixResults.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
    setResults(filteredResults);
    setLoading(false);
  };

  const handleVideoData = async (
    id: number,
    type: string,
    vf: boolean,
    episode?: number,
    season?: number
  ) => {
    const timestamp = Date.now().toString();
    const signature = await sha256(
      'jaiplusdideeswsh:getVideo:' +
        timestamp +
        ':' +
        id +
        ':' +
        type +
        ':' +
        episode +
        ':' +
        season +
        ':' +
        vf
    );

    const response = await fetch(
      `/api/getVideo?id=${id}&type=${type}&episode=${episode}&season=${season}&vf=${vf}`,
      {
        headers: {
          x: timestamp,
          s: signature,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setVideoData(data);
    }
  };

  const handleItemData = async (id: number, type: string) => {
    const timestamp = Date.now().toString();
    const signature = await sha256(
      '***REMOVED***:getData:' + timestamp + ':' + id + ':' + type
    );
    const response = await fetch(`/api/getData?id=${id}&type=${type}`, {
      headers: {
        s: signature,
        x: timestamp,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setItemData(data);
      if (data.seasons) {
        setSelectedSeason(data.seasons[0].seasonNumber);
        setSelectedEpisode(data.seasons[0].episodes[0].episode);
        handleVideoData(
          id,
          'series',
          false,
          data.seasons[0].episodes[0].episode,
          data.seasons[0].seasonNumber
        );
      } else {
        handleVideoData(id, type, false, undefined, undefined);
      }
      setSearchTerm('');
      setResults([]);
    }
  };

  React.useEffect(() => {
    if (itemData)
      handleVideoData(
        itemData?.id,
        itemData?.type,
        selectedVF,
        selectedEpisode,
        selectedSeason
      );
  }, [selectedSeason, selectedEpisode, selectedVF, itemData]);

  return (
    <main>
      <Head>
        <title>
          C ça votre problème aussi pk tu viens checker le code ? Ya rien ici
          mgl
        </title>
      </Head>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          <Logo className='w-16' />
          <h1 className='mt-4'>empire-streaming.life bypasser</h1>
          <p className='mt-2 text-sm text-gray-800'>
            Un simple outil pour bypasser le site empire-streaming.life, toutes
            les vidéos/séries, sans publicités.
          </p>

          <div className='mt-8 w-full max-w-md'>
            <div className='relative'>
              <input
                type='text'
                className='w-full rounded-full border-2 border-gray-300 bg-white px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none'
                placeholder='Rechercher un film ou une série...'
                value={searchTerm}
                onChange={(e) => {
                  handleSearch(e.target.value);
                  setSearchTerm(e.target.value);
                }}
              />
              <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                </svg>
              </span>
            </div>
            {loading ? (
              <p className='my-5 animate-loading-dots'>
                Chargement des données...
              </p>
            ) : (
              results.length > 0 && (
                <ul className='mt-2 max-h-60 max-md:mb-20 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md animate-slide-down'>
                  {results.slice(0, 25).map((item, index) => (
                    <li
                      key={`${item.id}-${index}`}
                      className='cursor-pointer px-4 py-2 hover:bg-gray-100'
                      onClick={() => handleItemData(item.id, item.label)}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>

          {videoData && (
            <div className='my-8 w-full max-w-md max-md:mb-20 animate-slide-down'>
              <div className='flex mb-8'>
                <div className='relative'>
                  <select
                    className='w-full rounded-full border-2 border-gray-300 bg-white px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsi'
                    value={String(selectedVF)}
                    onChange={(e) =>
                      setSelectedVF(e.target.value === 'true' ? true : false)
                    }
                  >
                    <option value={String(true)}>VF</option>
                    <option value={String(false)}>VOSTFR</option>
                  </select>
                </div>

                {itemData?.type === 'series' && (
                  <>
                    <div className='relative'>
                      <select
                        className='w-full rounded-full border-2 border-gray-300 bg-white px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis'
                        value={selectedSeason}
                        onChange={(e) =>
                          setSelectedSeason(parseInt(e.target.value))
                        }
                      >
                        {itemData?.seasons?.map((season) => (
                          <option
                            key={season.seasonNumber}
                            value={season.seasonNumber}
                          >
                            {`Saison ${season.seasonNumber}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='relative'>
                      <select
                        className='w-full rounded-full border-2 border-gray-300 bg-white px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none whitespace-nowrap overflow-hidden text-ellipsi'
                        value={selectedEpisode}
                        onChange={(e) =>
                          setSelectedEpisode(parseInt(e.target.value))
                        }
                      >
                        {itemData?.seasons?.map((season) => {
                          if (season.seasonNumber === selectedSeason) {
                            return season.episodes.map((episode) => (
                              <option
                                key={episode.episode}
                                value={episode.episode}
                              >
                                {`Épisode ${episode.episode}`}
                              </option>
                            ));
                          }
                        })}
                      </select>
                    </div>
                  </>
                )}
              </div>
              <MediaPlayer
                title=''
                className='aspect-auto'
                src={videoData?.response?.map((item) => {
                  return {
                    src: item.url,
                    type: 'video/mp4',
                    width: 1280,
                    height:
                      item.name === 'n' ? 720 : item.name === 'h' ? 1080 : 2160,
                  };
                })}
              >
                <MediaProvider />
                <PlyrLayout icons={plyrLayoutIcons} />
              </MediaPlayer>
            </div>
          )}

          <footer className='absolute bottom-2 text-gray-700 flex-col flex'>
            <span className='text-sm'>
              © N'a pas été fait par un PNJ qui se vante de savoir programmer ou
              reverse quoique ce soit. Si vous voyez un PNJ s'en vanter, c'est
              que ce n'est pas lui.
            </span>{' '}
            N'y voyez rien de mal, c'est juste pour le fun. Modifiez votre code
            les brozers.
          </footer>
        </div>
      </section>
    </main>
  );
}
