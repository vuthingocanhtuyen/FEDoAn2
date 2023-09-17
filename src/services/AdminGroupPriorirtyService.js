import axios from "axios";

export const axiosJWT = axios.create();

export const createAdminGroupPriority = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/admingrouppriority/create`,
    data
  );
  return res.data;
};

export const updateAdminGroupPriority = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/admingrouppriority/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsAdminGroupPriority = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingrouppriority/get-details/${id}`);
  return res.data;
};
export const getAdminGroupPriorityByAdminGroupPriorityId = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingrouppriority/get-by-id/${id}`);
  return res.data;
};

export const deleteAdminGroupPriority = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/admingrouppriority/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const deleteAdminGroupPriorityById = async (objectcode,prioritycode, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/admingrouppriority/delete/${objectcode}/${prioritycode}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllAdminGroupPriority = async (access_token) => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/admingrouppriority/get-all`, {
    headers: {
      token: `Bearer ${access_token}`,
    },
  });
  return res.data;
};

export const deleteManyAdminGroupPriority = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/admingrouppriority/delete-many`,
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
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/admingrouppriority/get-all-type`);
  return res.data;
};
