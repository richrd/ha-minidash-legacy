
class HTTPWrapper {
  static request(url, data = null) {
    let method = 'GET';
    if(data) {
        data = JSON.stringify(data);
        method = 'POST';
    }

    return HTTPWrapper._request(url, method, data);
  }

  static _request(url, method, data) {
    let promise = new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.onreadystatechange = () => { 
        if (request.readyState === 4 && request.status === 200) {
          console.log('resolve(request);');
          resolve(request);
        } else if (request.readyState === 4) {
          console.log('reject(request);');
          reject(request);
        }
      }
      request.open(method, url, true);  // true for asynchronous
      request.send(data);
    });

    return promise;
  }
}

export default HTTPWrapper;
