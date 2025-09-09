import axios from 'axios';

export default axios.create({
  baseURL: process.env.OLD_API_BASE,
  timeout: 2000,
  headers: {
    Authorization: `Bearer ${process.env.SERVICE_USER_TOKEN}`,
  },
});
