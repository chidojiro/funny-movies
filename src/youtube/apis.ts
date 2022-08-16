import { YOUTUBE_API_KEY } from '@/youtube/constants';
import { RestApis } from '@/rest/apis';
import { YOUTUBE__VIDEO_ENDPOINT } from './constants';
import qs from 'qs';
import { YoutubeVideoLocalization } from './types';

const getVideo = (id: string) =>
  RestApis.get(YOUTUBE__VIDEO_ENDPOINT, {
    params: { key: YOUTUBE_API_KEY, id, part: ['localizations'] },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  }).then((data: any) => Object.values(data.items[0].localizations)[0] as YoutubeVideoLocalization);

export const YoutubeApis = {
  getVideo,
};
