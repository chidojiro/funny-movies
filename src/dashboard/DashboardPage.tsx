import { InfiniteLoader } from '@/common/components';
import { useHandler, useInfiniteData } from '@/common/hooks';
import { MovieApis } from '@/movie/apis';
import { MovieCard } from '@/movie/MovieCard';
import { Movie } from '@/movie/types';
import { useProfile } from '@/profile/useProfile';

export const DashboardPage = () => {
  const { profile } = useProfile();

  const {
    data: movies,
    loadMore: loadMoreMovies,
    update: updateMovie,
  } = useInfiniteData(pagination => {
    return MovieApis.getMovies(pagination);
  });

  const { handle: handleLikeToggle } = useHandler(async (movie: Movie) => {
    if (!profile) return;

    const updatedMovie = await MovieApis.toggleLike(movie, profile.id);
    updateMovie(updatedMovie.id, updatedMovie);
    return updatedMovie;
  });

  const { handle: handleDislikeToggle } = useHandler(async (movie: Movie) => {
    if (!profile) return;

    const updatedMovie = await MovieApis.toggleDislike(movie, profile.id);
    updateMovie(updatedMovie.id, updatedMovie);
    return updatedMovie;
  });

  return (
    <div>
      <div className='flex flex-col gap-8'>
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            userId={profile?.id}
            onLikeToggle={handleLikeToggle}
            onDislikeToggle={handleDislikeToggle}
          />
        ))}
      </div>
      <InfiniteLoader empty={!movies.length} onLoad={loadMoreMovies} mode='ON_SIGHT' />
    </div>
  );
};
