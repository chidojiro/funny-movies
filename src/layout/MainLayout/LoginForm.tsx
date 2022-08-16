import { AuthApis } from '@/auth/apis';
import { ApiErrors, LoginPayload } from '@/auth/types';
import { useAccessTokenCookieState } from '@/auth/useAccessTokenCookie';
import { Button, Form } from '@/common/components';
import { useHandler } from '@/common/hooks';
import { PlusIcon, SignInIcon } from '@/common/icons';
import { useProfile } from '@/profile/useProfile';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const LoginForm = () => {
  const [, setAccessToken] = useAccessTokenCookieState();
  const { mutateProfile } = useProfile();

  const methods = useForm<LoginPayload>({ defaultValues: { email: '', password: '' } });
  const { setValue, reset, handleSubmit } = methods;

  const loginHandler = async (data: LoginPayload) => {
    const { accessToken, profile } = await AuthApis.login(data);
    setAccessToken(accessToken);
    mutateProfile(profile);
    reset();
  };

  const { handle: handleLogin, isLoading: isLoggingIn } = useHandler(loginHandler, {
    onError: (e: any) => {
      setValue('password', '');

      if (e.message === ApiErrors.INVALID) {
        toast.error('Invalid email or password!');
        return false;
      }
    },
  });

  const registerHandler = async (data: LoginPayload) => {
    try {
      const { accessToken, profile } = await AuthApis.register(data);
      setAccessToken(accessToken);
      mutateProfile(profile);
      reset();
    } catch (e) {
      setValue('password', '');
      throw e;
    }
  };

  const { handle: handleRegister, isLoading: isRegistering } = useHandler(registerHandler);

  return (
    <Form methods={methods} className='relative flex items-center gap-2'>
      <Form.Input type='email' name='email' placeholder='Email' />
      <Form.Input type='password' name='password' placeholder='Password' />
      <Button loading={isLoggingIn} iconRight={<SignInIcon />} variant='solid' onClick={handleSubmit(handleLogin)}>
        Login
      </Button>
      <Button loading={isRegistering} iconRight={<PlusIcon />} variant='outline' onClick={handleSubmit(handleRegister)}>
        Register
      </Button>
    </Form>
  );
};
