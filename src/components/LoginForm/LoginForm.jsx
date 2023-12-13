import { useState, useEffect } from 'react';

import { useNavigate, useLocation, json } from 'react-router-dom';

import { useLocalStorage } from '../../Hooks/useLocalStorage';
import { useOnlineStatus } from '../../Hooks/useIsOnlineStatus';
import state from '../../store/store';

import Loader from '../Loader/Loader';

import axios from 'axios';
// import { useSnapshot } from "valtio";
import bcrypt from 'bcryptjs';
import { useCookies } from 'react-cookie';

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
  baseURL: 'http://192.168.0.178:3000/api/v1/',
});

function LoginForm() {
  const [formFields, setFormfields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const [ipAddress, setIPAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const isOnLine = useOnlineStatus();
  const [cookies, setCookie] = useCookies(['name']);

  const [accessTokenAuth, setAccessTokenAuth] = useLocalStorage(
    'accessToken',
    null
  );
  const [refreshTokenAuth, setRefreshTokenAuth] = useLocalStorage(
    'refreshToken',
    null
  );

  // const snap = useSnapshot(state);
  // console.log(snap.currentUser.currentUser.email);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

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

    console.log(password, defaultPassword);

    switch (isOnLine) {
      case true:
        try {
          setLoading(true);
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
            const currentUser = userResponse.data;
            state.currentUser = { currentUser };
            const offlineUser = JSON.stringify(currentUser);
            console.log({ offlineUser });
            // setCookie("name", userResponse.data.name);
            setCookie('currentUser', offlineUser);

            setAccessTokenAuth(response?.data?.accessToken);
            setRefreshTokenAuth(response?.data?.refreshToken);

            navigate(from, { replace: true });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
        break;

      case false:
        const isMatch = await bcrypt.compare(password, hashedDefaultPassword);
        try {
          if (!isMatch) {
            console.log('wrong password');
          } else if (isMatch && email === cookies?.email) {
            console.log('success');
            navigate(from, { replace: true });
          } else {
            console.log('wrong username or password');
          }
        } catch (error) {
          throw error;
        }

      default:
        console.log('Error signing in offline');
        break;
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
