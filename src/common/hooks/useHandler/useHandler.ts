import React from 'react';
import { toast } from 'react-toastify';
import useSwr, { SWRConfiguration } from 'swr';

export type UseHandlerConfigurations<T = unknown> = {
  onError?: (error: unknown, handlerParams: any[]) => void;
  onSuccess?: (data: T) => void;
};

export const useHandler = <T = void>(
  callback: (...args: any[]) => Promise<T>,
  configs?: UseHandlerConfigurations<T>
) => {
  const [refreshToken, setRefreshToken] = React.useState<number>();
  const dataPromiseRef = React.useRef<Promise<T>>();
  const dataResolveRef = React.useRef<(data: T) => void>();
  const argsRef = React.useRef<unknown[]>();

  const handle = React.useCallback((...params: unknown[]) => {
    argsRef.current = params ?? [];
    setRefreshToken(Math.random());

    dataPromiseRef.current = new Promise(res => {
      dataResolveRef.current = res;
    });

    return dataPromiseRef.current;
  }, []);

  const { onError, ...restConfigs } = configs ?? {};

  const _configs: SWRConfiguration = {
    onError: async (error: unknown) => {
      console.trace(error);
      const shouldUseDefaultErrorHandler = onError?.(error, argsRef.current ?? []) ?? true;

      if (!shouldUseDefaultErrorHandler) return;

      toast.error('Something went wrong!');
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    ...restConfigs,
  };

  const args = argsRef.current;

  const { data, error, isValidating } = useSwr(
    !!args && [args, refreshToken],
    async args => {
      const res = await callback(...(args as unknown[]));

      dataResolveRef.current?.(res);

      return res;
    },
    _configs
  );

  return React.useMemo(() => ({ data, error, isLoading: isValidating, handle }), [data, error, isValidating, handle]);
};
