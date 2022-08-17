import { PromiseUtils } from './../common/utils/promise';
import { Movie } from './types';
import { ApiErrors } from '@/auth/types';
import { YoutubeLocalService } from '@/youtube/localService';
import URI from 'urijs';
import { v4 as UUID } from 'uuid';
import { LocalStorageUtils } from '@/common/utils';

const MOVIES_KEY = 'movies';

const getMovies = () => (LocalStorageUtils.get(MOVIES_KEY) as Record<string, Movie>) ?? {};

const getMovieByOriginalId = (originalId: string) => {
  const movies = getMovies();

  const movie = Object.values(movies).find(movie => movie.originalId === originalId);

  if (!movie) throw new Error(ApiErrors.NOT_FOUND);

  return movie;
};

const createMovie = async (url: string, userId: string) => {
  await PromiseUtils.sleep(1000);

  let youtubeVideoId;
  try {
    const uri = new URI(url);
    youtubeVideoId = uri.search(true).v;
  } catch {
    throw new Error(ApiErrors.INVALID);
  }

  if (!youtubeVideoId) throw new Error(ApiErrors.INVALID);

  let existingMovie;
  try {
    existingMovie = getMovieByOriginalId(youtubeVideoId);
  } catch {
    // Do nothing
  }
  if (existingMovie) throw new Error(ApiErrors.ALREADY_EXIST);

  await YoutubeLocalService.getVideo(youtubeVideoId);

  const id = UUID();

  const newMovie: Movie = {
    id,
    originalId: youtubeVideoId,
    url,
    userId,
    likes: 0,
    dislikes: 0,
  };

  const movies = getMovies();

  LocalStorageUtils.set('movies', { ...movies, [id]: newMovie });

  return newMovie;
};

export const MovieLocalService = { createMovie };
