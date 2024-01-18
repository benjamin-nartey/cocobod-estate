import { useState, useEffect } from 'react';

import { useOnlineStatus } from '../../Hooks/useIsOnlineStatus';
import { useNavigate, useLocation } from 'react-router-dom';

import { useLocalStorage } from '../../Hooks/useLocalStorage';
import state from '../../store/store';

import Loader from '../Loader/Loader';

// import { useSnapshot } from "valtio";
import bcrypt from 'bcryptjs';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useIndexedDB } from 'react-indexed-db-hook';
import { message } from 'antd';

const defaultFormFields = {
  email: '',
  password: '',
};

const defaultPassword = import.meta.env.VITE_APP_DEFAULT_PASSWORD;

const hashedDefaultPassword = bcrypt.hashSync(
  defaultPassword,
  bcrypt.genSaltSync()
);

const API = axios.create({
  baseURL: 'https://estate-api-2.onrender.com/api/v1',
  // baseURL: 'http://localhost:3000/api/v1',
});

function LoginForm() {
  const [formFields, setFormfields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [ipAddress, setIPAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const isOnLine = useOnlineStatus();
  const [cookies, setCookie] = useCookies(['name']);
  // const [offlineUser, setOfflineUser] = useState(null);

  const { add: addOfflineUser } = useIndexedDB('offlineUser');

  const { getAll: getOfflineUser } = useIndexedDB('offlineUser');

  // useEffect(() => {
  //   getOfflineUser().then((data) => setOfflineUser(data[0]));
  // }, []);

  const [accessTokenAuth, setAccessTokenAuth] = useLocalStorage(
    'accessToken',
    null
  );

  const [offlineUser, setOfflineUser] = useLocalStorage('offlineUser', null);

  const [refreshTokenAuth, setRefreshTokenAuth] = useLocalStorage(
    'refreshToken',
    null
  );

  // const snap = useSnapshot(state);
  // console.log(snap.currentUser.currentUser.email);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    axios
      .get('https://ipapi.co/json')
      .then((response) => response.data)
      .then((data) => setIPAddress(data.ip))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormfields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log(password, defaultPassword);

    try {
      setLoading(true);

      if (isOnLine) {
        const response = await API.post(
          '/auth',
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-IP-Address': ipAddress,
            },
          }
        );

        const userResponse = await API.get('/auth/user', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response?.data?.accessToken}`,
          },
        });

        if (userResponse) {
          const currentUser = {
            id: userResponse.data.id,
            name: userResponse.data.name,
            email: userResponse.data.email,
            staff: userResponse.data.staff,
            roles: userResponse.data.roles,
          };

          state.auth.currentUser = currentUser;

          setOfflineUser(currentUser);

          setAccessTokenAuth(response?.data?.accessToken);
          setRefreshTokenAuth(response?.data?.refreshToken);

          navigate(from, { replace: true });
        }
      } else {
        //match password
        bcrypt.compare(
          password,
          hashedDefaultPassword,
          function (error, isMatch) {
            if (error) {
              throw error;
            } else if (!isMatch) {
              console.log('wrong password');
              message.error('Wrong password');
            } else if (isMatch && email !== offlineUser?.email) {
              console.log('wrong email');
              message.error('Wrong email');
            } else if (isMatch && email === offlineUser?.email) {
              state.auth.currentUser = offlineUser;

              navigate(from, { replace: true });
            }
          }
        );
      }
    } catch (error) {
      switch (error.response.data.statusCode) {
        case 400:
          message.error(`${error.response.data.message}`);
          break;

        case 403:
          message.error(`${error.response.data.message}`);
          break;

        default:
          message.error(`${error.response.data.message}`);
          break;
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(formFields);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="email"
        value={email}
        placeholder="Enter Email"
        className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] max-md:border-white max-md:placeholder:text-white focus:outline-none focus:border-b-[2px] mb-4 max-md:text-white"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={password}
        placeholder="Enter Password"
        className="w-full h-[35px] pl-2 bg-transparent border-b-[1px] border-solid border-[#6E431D] max-md:border-white  max-md:placeholder:text-white focus:outline-none focus:border-b-[2px] mb-4 max-md:text-white"
        onChange={handleChange}
      />
      <button className="max-md:bg-white max-md:text-[#6E431D] max-md:hover:bg-white w-full h-[35px] outline-none bg-[#6E431D] text-white rounded mb-2 hover:bg-[#B67F4E] hover:font-black hover:translate-y-[-2px] active:translate-y-[3px] transition-all hover:shadow-md active:shadow-sm">
        {loading ? (
          <Loader width="w-5" height="h-5" fillColor="fill-[#6E431D]" />
        ) : (
          'Login'
        )}
      </button>
      <div className="w-full">
        <span className=" max-md:text-white text-xs font-thin text-[#B67F4E] cursor-pointer hover:underline">
          Forgot password? Reset
        </span>
      </div>
    </form>
  );
}

export default LoginForm;
