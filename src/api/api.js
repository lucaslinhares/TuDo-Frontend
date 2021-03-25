import axios from 'axios'

const api = axios.create({
    baseURL: 'https://TuDo.einsteinn.repl.co',
    //baseURL: 'https://my-json-server.typicode.com/Thiago051/apirestfake',
    headers: {"Access-Control-Allow-Origin": "true"}
})

export default api;