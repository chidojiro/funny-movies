import { isEqual } from 'lodash-es';
import React from 'react';
import { Movie } from './types';

export type MovieCardProps = {
  movie: Movie;
  signedIn?: boolean;
};

export const MovieCard = React.memo(
  ({ movie: { dislikedBy, likedBy, sharedBy, embedHtml, title, description }, signedIn }: MovieCardProps) => {
    const { email } = sharedBy;

    return (
      <div className='flex gap-10'>
        <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
        <div className='max-w-xl'>
          <h3>{title}</h3>
          <p>
            <span className='font-semibold underline'>Shared by: </span>
            <span>{email}</span>
          </p>
          <p className='font-semibold underline'>Description:</p>
          <p className='text-sm line-clamp-6 text-gray-600'>{description}</p>
        </div>
      </div>
    );
  },
  isEqual
);

MovieCard.displayName = 'MovieCard';
