import { MovieLocalService } from './localService';

const createMovie = MovieLocalService.createMovie;

const getMovies = MovieLocalService.getMovies;

const toggleLike = MovieLocalService.toggleLike;

const toggleDislike = MovieLocalService.toggleDislike;

export const MovieApis = { createMovie, getMovies, toggleLike, toggleDislike };
