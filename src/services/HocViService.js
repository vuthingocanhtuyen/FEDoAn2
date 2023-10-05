import { axiosJWT } from "./UserService"
export const updateHocVi = async (id, access_token, data) => {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_URL}/hocvi/update/${id}`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };