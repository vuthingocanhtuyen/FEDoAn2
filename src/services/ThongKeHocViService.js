import axios from "axios";

import { axiosJWT } from "./UserService"

export const getThongKeHocViByDonViId = async (id, access_token) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/thongkehocvi/get-by-id/${id}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };
  export const updateThongKeHocVi = async (donviid,nam, access_token,data) => {
    const res = await axiosJWT.put(
      `${process.env.REACT_APP_API_URL}/thongkehocvi/update/${donviid}/${nam}`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };      