import axios from 'axios';
import { toastify } from '../components/common/notification';
import config from '../config.json';

const url = config['baseHost_backend'];

export const leadListApi = (
    token: string,
    config: {
        page: number;
        limit: number;
        filterQuery: {
            status: string;
            dealer: string;
            owner: string;
            sdate: string;
            edate: string;
        };
    }
) =>
    axios
        .get(`${url}/fetch-all-leads`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
            params: {
                pages_to_skip: config.page - 1,
                limit_per_page: config.limit,
                ...config.filterQuery,
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

export const leadDetailsApi = (token: string, id: string) =>
    axios
        .get(`${url}/fetch-lead-detail/${id}`, {
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

export const leadUpdateApi = (token: string, data: any) =>
    axios
        .put(`${url}/update-leads`, data, {
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

export const leadFilterDetailsApi = (token: string) =>
    axios
        .get(`${url}/fetch-filter`, {
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

export const botLeadsApi = (token: string) =>
    axios
        .get(`${url}/bot-leads`, {
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
export const allLeadsApi = (token: string) =>
    axios
        .get(`${url}/all-lead-by-date`, {
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
export const openLeadsDealerApi = (token: string) =>
    axios
        .get(`${url}/open-leads-dealer`, {
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

export const openLeadsOwnerApi = (token: string) =>
    axios
        .get(`${url}/open-lead-owner`, {
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

export const leadsProgressionApi = (token: string) =>
    axios
        .get(`${url}/leads-progression`, {
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
