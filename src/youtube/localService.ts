import { YOUTUBE_API_KEY } from '@/youtube/constants';
import { RestApis } from '@/rest/apis';
import { YOUTUBE__VIDEO_ENDPOINT } from './constants';
import qs from 'qs';
import { YoutubeVideo } from './types';
import { ApiErrors } from '@/auth/types';

const getVideo = (id: string) =>
  RestApis.get(YOUTUBE__VIDEO_ENDPOINT, {
    params: { key: YOUTUBE_API_KEY, id, part: ['snippet', 'player'] },
    paramsSerializer: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    },
  })
    .then((data: any) => {
      const snippet = data.items[0]?.snippet;
      const embedHtml = data.items[0]?.player?.embedHtml;
      if (!snippet || !embedHtml) throw new Error(ApiErrors.NOT_FOUND);

      const { title, description } = snippet;
      return { title, description, embedHtml } as YoutubeVideo;
    })
    .catch(e => {
      throw new Error(ApiErrors.NOT_FOUND);
    });

export const YoutubeLocalService = {
  getVideo,
};
