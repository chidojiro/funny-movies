import { AuthApis } from '@/auth/apis';
import { ProfileApis } from '@/profile/apis';
import { COOKIE_ACCESS_TOKEN_KEY } from '@/auth/constants';
import { ApiErrors, User } from '@/auth/types';
import { CookiesUtils } from '@/common/utils';
import { Profile } from '@/profile/types';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { MainLayoutHeader } from './MainLayoutHeader';

const mockToken = 'abcd';
const mockEmail = 'user@gmail.com';
const mockPassword = '123123123';

const mockProfile: Profile = {
  id: '1',
  email: mockEmail,
};

const renderComponent = () =>
  render(
    <BrowserRouter>
      <ToastContainer />
      <MainLayoutHeader />
    </BrowserRouter>
  );

const getLoginForm = () => screen.queryByTestId('login-form');
const getProfileSection = () => screen.queryByTestId('profile-section');
const getEmailInput = () => screen.getByPlaceholderText('Email');
const getPasswordInput = () => screen.getByPlaceholderText('Password');
const getCreateAccountModal = () => screen.queryByTestId('create-account-modal');

afterEach(() => {
  CookiesUtils.remove(COOKIE_ACCESS_TOKEN_KEY);
});

describe('Login', () => {
  it('should render login form when token is invalid', () => {
    renderComponent();

    expect(getLoginForm()).toBeInTheDocument();
    expect(screen.queryByTestId('profile-section')).not.toBeInTheDocument();
  });

  it('should show profile section and save token to cookie when login succeed', async () => {
    jest.spyOn(AuthApis, 'login').mockResolvedValue({ accessToken: mockToken, profile: mockProfile });

    renderComponent();

    userEvent.type(getEmailInput(), mockEmail);
    userEvent.type(getPasswordInput(), mockPassword);
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

    expect(getCreateAccountModal()).toBeInTheDocument();
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
});

describe('Register', () => {
  const renderCreateAccountModal = () => {
    renderComponent();

    act(() => {
      userEvent.click(screen.getByText('Register'));
    });
  };

  const getEmailInput = () => within(screen.getByTestId('create-account-modal')).getByPlaceholderText('Email');
  const getPasswordInput = () => within(screen.getByTestId('create-account-modal')).getByPlaceholderText('Password');
  const getRegisterButton = () => within(screen.getByTestId('create-account-modal')).getByText('Register');

  it('should auto login when register succeed', async () => {
    jest.spyOn(AuthApis, 'register').mockResolvedValue({ accessToken: mockToken, profile: mockProfile });

    renderCreateAccountModal();

    expect(getCreateAccountModal()).toBeInTheDocument();

    userEvent.type(getEmailInput(), mockEmail);
    userEvent.type(getPasswordInput(), mockPassword);

    act(() => {
      userEvent.click(getRegisterButton());
    });

    await waitFor(() => {
      expect(getCreateAccountModal()).not.toBeInTheDocument();
      expect(getProfileSection()).toBeInTheDocument();
    });
  });

  it('should validate register form before submission', async () => {
    jest.spyOn(AuthApis, 'register').mockResolvedValue({ accessToken: mockToken, profile: mockProfile });

    renderCreateAccountModal();

    act(() => {
      userEvent.click(getRegisterButton());
    });

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
      expect(screen.getByText('Email is required!')).toBeInTheDocument();
      expect(screen.getByText('Password is required!')).toBeInTheDocument();
    });

    userEvent.type(getEmailInput(), 'user');
    await waitFor(() => {
      expect(screen.getByText('Invalid email!')).toBeInTheDocument();
    });
    userEvent.type(getEmailInput(), '@gmail.');
    await waitFor(() => {
      expect(screen.getByText('Invalid email!')).toBeInTheDocument();
    });
    userEvent.type(getEmailInput(), 'com');
    await waitFor(() => {
      expect(screen.queryByText('Invalid email!')).not.toBeInTheDocument();
      expect(screen.queryByTestId('email-error')).toBeEmptyDOMElement();
    });

    userEvent.type(getPasswordInput(), '1234567');
    await waitFor(() => {
      expect(screen.getByText('Password must be at least eight characters!')).toBeInTheDocument();
    });
    userEvent.type(getPasswordInput(), '8');
    await waitFor(() => {
      expect(screen.queryByText('Password must be at least eight characters!')).not.toBeInTheDocument();
      expect(screen.queryByTestId('password-error')).toBeEmptyDOMElement();
    });

    act(() => {
      userEvent.click(getRegisterButton());
    });

    await waitFor(() => {
      expect(getCreateAccountModal()).not.toBeInTheDocument();
      expect(getProfileSection()).toBeInTheDocument();
    });

    expect(CookiesUtils.get(COOKIE_ACCESS_TOKEN_KEY)).toBe(mockToken);
  });
});
