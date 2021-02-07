
export class BaseRequest {
  static getInstance() {
    return new this
  }

  getHeader() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    }
  }

  buildUrl(url: string) {
    // remove both leading and trailing a slash
    url = url.replace(/^\/+|\/+$/g, '')
    return `${this.getUrlPrefix()}/${url}`
  }

  getUrlPrefix() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://06a6fd781d2a.ngrok.io";
    return BASE_URL;
  }

  async post(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "POST",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async postImage(url: string, data: FormData ) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        body: data
      }));
    } catch (e) {
      throw e;
    }
  }

  async put(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PUT",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async patch(url: string, data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "PATH",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async get(url: string) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "GET",
        headers: this.getHeader(),
      }));
    } catch (e) {
      throw e;
    }
  }

  async delete(url: string,  data: object) {
    try {
      return this._responseHandler(fetch(this.buildUrl(url), {
        method: "DELETE",
        headers: this.getHeader(),
        body: JSON.stringify(data)
      }));
    } catch (e) {
      throw e;
    }
  }

  async _responseHandler(response = {}) {
    return response;
  }
}
