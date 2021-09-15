import axios from 'axios';


const instance = axios.create({
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 60000,
        cancelToken: axios.CancelToken.source().token
});

export default instance;