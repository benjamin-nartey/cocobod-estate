import axios from "axios";
import useAuth from "./useAuth";

function useRefresh() {
  const { setAuthState, authState } = useAuth();

  const refresh = async () => {
    const response = await axios.post(
      "https://cocobod-estates-api.onrender.com/api/v1/auth/refresh-token",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.refreshToken}`,
        },
      }
    );
    setAuthState((prev) => {
      console.log({ prev });
      console.log("newAccess", response.data);
      return {
        ...prev,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    });

    return response.data.accessToken;
  };
  return refresh;
}

export default useRefresh;
