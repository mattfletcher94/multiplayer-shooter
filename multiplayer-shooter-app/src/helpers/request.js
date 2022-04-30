import axios from 'axios';
import router from '../router';

/**
 * Create an Axios Client with defaults
 */
const axiosClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    withCredentials: true,
});
  
/**
 * Make an API request
 */
const request = (options) => {

    // Set headers
    options.headers = {
        'Authorization': 'Bearer ' + window.localStorage.getItem('JWT'),
        'Access-Control-Max-Age': 1728000,
    };
    options.contentType = options.contentType ?  options.contentType : 'text/plain';

    // Set response data, if request was successful
    const onSuccess = (response) => {
        return {
            'json':response.data,
            'statusText': response.statusText,
            'statusCode': response.status
        }
    }
    
    // Set response data, if request was unsucessful
    const onError = (error) => {

        // Set response
        var resp = null;

        // If error has a response..
        if (error.response) {

            // Set response to data
            resp = {
                'json': error.response.data,
                'statusText': error.response.statusText,
                'statusCode': error.response.status
            }

            // Handle specific status codes
            if (error.response.status === 401) {
                window.localStorage.removeItem('JWT');
                router.push('/login/');
            } if (error.response.status === 404) {
                resp.json = {};
            } else {
                // Request was made but server responded with something
                // other than 2xx
            }
            
        } else {

            // Request was cancelled
            if (error.message == 'Request Cancelled') {
                resp = {
                    'json': {
                        'message': error.message
                    },
                    'statusText': null,
                    'code': null
                }
            }

        }

        // Reject the promise
        return Promise.reject(resp);
    };

    // Return request with promises to user
    //return axiosClient(options).then(onSuccess).catch(onError);
    return axiosClient(options).then(onSuccess).catch(onError);
};

/**
 * Generate a cancel token
 */
const cancelToken = () => {
    return axios.CancelToken.source();
}

export { request, cancelToken };