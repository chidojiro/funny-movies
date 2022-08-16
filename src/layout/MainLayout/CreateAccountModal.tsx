import { AuthApis } from '@/auth/apis';
import { PASSWORD_PATTERN } from '@/auth/constants';
import { ApiErrors, LoginPayload } from '@/auth/types';
import { useAccessTokenCookieState } from '@/auth/useAccessTokenCookieState';
import { Button, Form } from '@/common/components';
import { Modal, ModalProps } from '@/common/components/Modal';
import { EMAIL_PATTERN } from '@/common/constants';
import { useHandler } from '@/common/hooks';
import { PlusIcon } from '@/common/icons';
import { useProfile } from '@/profile/useProfile';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export type CreateAccountModalProps = ModalProps;

export const CreateAccountModal = ({ open, onClose, ...restProps }: CreateAccountModalProps) => {
  const [, setAccessToken] = useAccessTokenCookieState();
  const { mutateProfile } = useProfile();

  const methods = useForm<LoginPayload>({ defaultValues: { email: '', password: '' } });
  const { setValue, reset, handleSubmit, watch } = methods;

  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [reset, open]);

  const registerHandler = async (data: LoginPayload) => {
    const { accessToken, profile } = await AuthApis.register(data);
    setAccessToken(accessToken);
    mutateProfile(profile);
    reset();
    onClose?.();
  };

  const email = watch('email');

  const { handle: handleRegister, isLoading: isRegistering } = useHandler(registerHandler, {
    onError: (e: any) => {
      setValue('password', '');

      if (e.message === ApiErrors.ALREADY_EXIST) {
        toast.error(`There is already an account registered with the email ${email}!`);
        return false;
      }
    },
  });

  return (
    <Modal open={open} onClose={onClose} {...restProps}>
      <Modal.Title>Create an account</Modal.Title>
      <Modal.Content>
        <Form methods={methods} onSubmit={handleRegister} className='flex gap-4 flex-col'>
          <div>
            <Form.Input
              type='email'
              name='email'
              placeholder='Email'
              size='md'
              rules={{
                pattern: {
                  value: EMAIL_PATTERN,
                  message: 'Invalid email!',
                },
                required: {
                  value: true,
                  message: 'Email is required!',
                },
              }}
            />
            <Form.ErrorMessage name='email' />
          </div>
          <div>
            <Form.Input
              type='password'
              name='password'
              placeholder='Password'
              size='md'
              rules={{
                pattern: {
                  value: PASSWORD_PATTERN,
                  message: 'Password must be at least eight characters!',
                },
              }}
            />
            <Form.ErrorMessage name='password' />
          </div>
          <Button
            className='mt-4'
            loading={isRegistering}
            iconRight={<PlusIcon />}
            variant='solid'
            onClick={handleSubmit(handleRegister)}>
            Register
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
