import { MovieLocalService } from './localService';

const createMovie = MovieLocalService.createMovie;

const getMovies = MovieLocalService.getMovies;

export const MovieApis = { createMovie, getMovies };
