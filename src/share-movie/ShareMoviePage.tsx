import { ApiErrors } from '@/auth/types';
import { Button, Form } from '@/common/components';
import { useHandler } from '@/common/hooks';
import { DashboardRoutes } from '@/dashboard/routes';
import { MovieApis } from '@/movie/apis';
import { useProfile } from '@/profile/useProfile';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

type ShareMovieForm = {
  url: string;
};

export const ShareMoviePage = () => {
  const { profile } = useProfile();

  const history = useHistory();

  const methods = useForm();

  const { handle: handleShare, isLoading } = useHandler(
    async ({ url }: ShareMovieForm) => {
      if (!profile) return;

      const data = await MovieApis.createMovie(url, profile.id);

      history.push(DashboardRoutes.Dashboard.path);

      return data;
    },
    {
      onError: (e: any) => {
        switch (e.message) {
          case ApiErrors.ALREADY_EXIST:
            toast.error('This movie has already been shared!');
            return false;

          case ApiErrors.INVALID:
            toast.error('URL is invalid!');
            return false;

          case ApiErrors.NOT_FOUND:
            toast.error('Can not find the youtube video associated with the URL!');
            return false;
        }
      },
    }
  );

  return (
    <div className='relative border border-primary shadow max-w-2xl max-auto rounded px-20 py-10 mx-auto mt-32'>
      <p className='absolute top-0 left-4 -translate-y-1/2 bg-white px-2'>Share a youtube movie</p>
      <Form methods={methods} onSubmit={handleShare} className='flex flex-col gap-4'>
        <div>
          <Form.Input
            name='url'
            placeholder='Youtube URL'
            rules={{
              required: 'URL is required!',
            }}
          />
          <Form.ErrorMessage name='url' />
        </div>
        <Button type='submit' variant='solid' loading={isLoading}>
          Share
        </Button>
      </Form>
    </div>
  );
};
