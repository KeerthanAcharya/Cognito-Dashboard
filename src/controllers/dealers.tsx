import axios from 'axios';
import { toastify } from '../components/common/notification';
import config from '../config.json';

const url = config['baseHost_backend'];

export const dealerListApi = (token: string) =>
    axios
        .get(`${url}/fetch-all-dealer`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data)
        .catch((error) =>
            toastify(
                'failure',
                error.response.data.message.length > 0
                    ? error.response.data.message
                    : 'Something went wrong'
            )
        );

export const createDealerApi = (token: string, data: Object) =>
    axios
        .post(`${url}/create-dealer`, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.data)
        .catch((error) =>
            toastify(
                'failure',
                error.response.data.message.length > 0
                    ? error.response.data.message
                    : 'Something went wrong'
            )
        );
