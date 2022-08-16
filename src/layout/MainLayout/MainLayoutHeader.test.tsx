import { AuthApis } from '@/auth/apis';
import { ProfileApis } from '@/profile/apis';
import { COOKIE_ACCESS_TOKEN_KEY } from '@/auth/constants';
import { ApiErrors, User } from '@/auth/types';
import { CookiesUtils } from '@/common/utils';
import { Profile } from '@/profile/types';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MainLayoutHeader } from './MainLayoutHeader';

const mockToken = 'abcd';

const mockUser: User = {
  id: '1',
  email: 'user@gmail.com',
  password: '123123123',
};

const mockProfile: Profile = {
  id: mockUser.id,
  email: mockUser.email,
};

// jest.mock('@/auth/apis', () => ({
//   login: () => ({ accessToken: mockToken, profile: mockProfile }),
// }));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <ToastContainer />
      <MainLayoutHeader />
    </BrowserRouter>
  );

const getLoginForm = () => screen.queryByTestId('login-form');

const getProfileSection = () => screen.queryByTestId('profile-section');

afterEach(() => {
  CookiesUtils.remove(COOKIE_ACCESS_TOKEN_KEY);
});

it('should render login form when token is invalid', () => {
  renderComponent();

  expect(getLoginForm()).toBeInTheDocument();
  expect(screen.queryByTestId('profile-section')).not.toBeInTheDocument();
});

it('should show profile section and save token to cookie when login succeed', async () => {
  jest.spyOn(AuthApis, 'login').mockResolvedValue({ accessToken: mockToken, profile: mockProfile });

  renderComponent();

  userEvent.type(screen.getByPlaceholderText('Email'), mockUser.email);
  userEvent.type(screen.getByPlaceholderText('Password'), mockUser.password);
  userEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(getProfileSection()).toBeInTheDocument();
  });

  expect(CookiesUtils.get(COOKIE_ACCESS_TOKEN_KEY)).toBe(mockToken);
});

it('should show a error toast when login fail', async () => {
  jest.spyOn(AuthApis, 'login').mockRejectedValue({ message: ApiErrors.INVALID });

  renderComponent();

  userEvent.click(screen.getByText('Login'));

  await waitFor(() => {
    expect(screen.getByText('Incorrect email or password!')).toBeInTheDocument();
  });
});

it('should open create account modal when register button is clicked', async () => {
  jest.spyOn(AuthApis, 'login').mockResolvedValue({ accessToken: mockToken, profile: mockProfile });

  renderComponent();

  userEvent.click(screen.getByText('Register'));

  expect(screen.getByText('Create an account')).toBeInTheDocument();
});

it('should show login form again and remove token from cookie when logout button is clicked', async () => {
  CookiesUtils.set(COOKIE_ACCESS_TOKEN_KEY, mockToken);
  jest.spyOn(ProfileApis, 'getProfile').mockResolvedValue(mockProfile);
  jest.spyOn(AuthApis, 'logout');

  renderComponent();

  await waitFor(() => {
    userEvent.click(screen.getByText('Logout'));
  });

  await waitFor(() => {
    expect(getLoginForm()).toBeInTheDocument();
  });

  expect(CookiesUtils.get(COOKIE_ACCESS_TOKEN_KEY)).toBe('');
});
