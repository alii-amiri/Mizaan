import axios from 'axios'

export default function auth(){
    const request = axios.get('/auth/auth', {
        withCredentials: true,
    })
    .then(response => response.data)
    return {
        type:'USER_AUTH',
        payload:request
    }
}