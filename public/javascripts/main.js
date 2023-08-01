function isURLvalid (url) {
  return new Promise((resolve, reject) => {
    const cors = 'https://cors-anywhere.herokuapp.com/'
    axios.get(`${cors}${url}`)
      .then((response) => {
        console.log('response from axios ' + response.status)
        resolve(response.data) // 將 response.data 作為 Promise 的解決值
      })
      .catch((error) => {
        console.log('error from axios ' + error)
        reject(error) // 將 error 作為 Promise 的拒絕值
      })
  })
}
