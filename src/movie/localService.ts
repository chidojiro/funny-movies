import { AuthLocalService } from '@/auth/localService';
import { ApiErrors } from '@/auth/types';
import { LocalStorageUtils } from '@/common/utils';
import { PaginationParams } from '@/rest/types';
import { YoutubeLocalService } from '@/youtube/localService';
import URI from 'urijs';
import { v4 as UUID } from 'uuid';
import { PromiseUtils } from './../common/utils/promise';
import { Movie } from './types';

const MOVIES_KEY = 'movies';

const getMovies = async () => {
  await PromiseUtils.sleep(1000);

  return (LocalStorageUtils.get(MOVIES_KEY) as Record<string, Movie>) ?? {};
};

const getPaginatedMovies = async ({ page, limit }: PaginationParams) => {
  const movies = Object.values(await getMovies());

  return Promise.all(
    movies.slice((page - 1) * limit, page * limit).map(async movie => {
      const youtubeVideo = await YoutubeLocalService.getVideo(movie.originalId);
      return { ...movie, ...youtubeVideo };
    })
  );
};

const getMovie = async (id: string) => {
  const movies = await getMovies();

  const movie = Object.values(movies).find(movie => movie.id === id);

  if (!movie) throw new Error(ApiErrors.NOT_FOUND);

  return movie;
};

const getMovieByOriginalId = async (originalId: string) => {
  const movies = await getMovies();

  const movie = Object.values(movies).find(movie => movie.originalId === originalId);

  if (!movie) throw new Error(ApiErrors.NOT_FOUND);

  return movie;
};

const createMovie = async (url: string, userId: string) => {
  const profile = AuthLocalService.extractProfileFromUser(AuthLocalService.getUser(userId));

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
    existingMovie = await getMovieByOriginalId(youtubeVideoId);
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
    sharedBy: profile,
    likedBy: [],
    dislikedBy: [],
    title: '',
    description: '',
    embedHtml: '',
  };

  const movies = await getMovies();

  LocalStorageUtils.set('movies', { ...movies, [id]: newMovie });

  return newMovie;
};

const toggleLike = async (movie: Movie, userId: string) => {
  const movies = await getMovies();

  const updatedMovie: Movie = {
    ...movie,
    likedBy: movie.likedBy.includes(userId) ? movie.likedBy.filter(id => id !== userId) : [...movie.likedBy, userId],
    dislikedBy: movie.dislikedBy.includes(userId) ? movie.dislikedBy.filter(id => id !== userId) : movie.dislikedBy,
  };

  LocalStorageUtils.set('movies', { ...movies, [updatedMovie.id]: updatedMovie });

  return updatedMovie;
};

const toggleDislike = async (movie: Movie, userId: string) => {
  const movies = await getMovies();

  const youtubeVideo = await YoutubeLocalService.getVideo(movie.originalId);

  const updatedMovie: Movie = {
    ...movie,
    ...youtubeVideo,
    likedBy: movie.likedBy.includes(userId) ? movie.likedBy.filter(id => id !== userId) : movie.likedBy,
    dislikedBy: movie.dislikedBy.includes(userId)
      ? movie.dislikedBy.filter(id => id !== userId)
      : [...movie.dislikedBy, userId],
  };

  LocalStorageUtils.set('movies', { ...movies, [updatedMovie.id]: updatedMovie });

  return updatedMovie;
};

export const MovieLocalService = { createMovie, getMovies: getPaginatedMovies, toggleDislike, toggleLike, getMovie };
