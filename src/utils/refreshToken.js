import mem from 'mem';
import { privateAxios } from '../axios/axios';

const refreshTokenFn = async () => {
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

  try {
    const response = await privateAxios.post(
      '/auth/refresh-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    // const { accessToken } = response.data;

    const refreshResponse = response.data;

    if (!refreshResponse.accessToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    localStorage.setItem(
      'accessToken',
      JSON.stringify(refreshResponse?.accessToken)
    );
    localStorage.setItem(
      'refreshToken',
      JSON.stringify(refreshResponse?.refreshToken)
    );

    return refreshResponse;
  } catch (error) {
    console.log(error);
  }
};

const maxAge = 10000;

export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge,
});
