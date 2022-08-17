import { InfiniteLoader } from '@/common/components';
import { useInfiniteData } from '@/common/hooks';
import { MovieApis } from '@/movie/apis';
import { MovieCard } from '@/movie/MovieCard';
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

  return (
    <div>
      <div className='flex flex-col gap-8'>
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} signedIn={!!profile} />
        ))}
      </div>
      <InfiniteLoader empty={!movies.length} onLoad={loadMoreMovies} mode='ON_SIGHT' />
    </div>
  );
};
