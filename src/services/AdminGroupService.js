import axios from "axios";

import { axiosJWT } from "./UserService"

export const createAdminGroup = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/admingroup/create`,
    data
  );
  return res.data;
};
export const createStaffAdminGroup = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/staffadmingroup/create`,
    data
  );
  return res.data;
};
export const updateAdminGroup = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/admingroup/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsAdminGroup = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingroup/get-details/${id}`);
  return res.data;
};
export const getAdminGroupByAdminGroupId = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingroup/get-by-id/${id}`);
  return res.data;
};

export const deleteAdminGroup = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/admingroup/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllAdminGroup = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/admingroup/get-all`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteManyAdminGroup = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/admingroup/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllType = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingroup/get-all-type`);
  return res.data;
};
export const update2ListsAdminGroup = async (id,index, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/admingroup/editdata/${id}/${index}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const updateAdminGroupLists = async (id,data,access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/admingroup/pushdata/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const delete2ListsAdminGroup = async (id,index, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/admingroup/deletedata/${id}/${index}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};