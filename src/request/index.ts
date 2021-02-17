import axios from 'axios';

class Request {
  instance: any;
  constructor() {
    const instance = axios.create({
      //baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        //Authorization: 'Bearer ' + localStorage.getItem('access_token'),
      }
    });
    this.instance = instance;
  };

  get = (url: string) => {
    return this.instance.get(url);
  };

  post = (url: string, data: object) => {
    return this.instance.post(url, data);
  };

  put = (url: string, data: object) => {
    return this.instance.put(url, data);
  };

  delete = (url: string) => {
    return this.instance.delete(url);
  };
}

export default new Request();