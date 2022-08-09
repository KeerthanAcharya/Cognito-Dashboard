import axios from 'axios';
import config from '../config.json';
import { toastify } from '../components/common/notification';

const url = config['baseHost_backend'];

export const selfUser = (token: string) =>
    axios
        .get(`${url}/refresh-token`, {
            headers: {
                Authorization: token,
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

export const getOneUserApi = (token: string, id: string) =>
    axios
        .get(`${url}/user/${id}`, {
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

export const forgotPassword = (email: string) =>
    axios.post(`${url}/forgot-password`, { email }).then((res) => res.data);

export const userListApi = (token: string) =>
    axios
        .get(`${url}/fetch-all-user`, {
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

export const organisationUserListApi = (token: string, org_id: string) =>
    axios
        .get(`${url}/user/org/${org_id}`, {
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

export const organisationDeveloperListApi = (token: string, org_id: string) =>
    axios
        .get(`${url}/user/org/${org_id}/developer`, {
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

export const createUserApi = (token: string, data: object) =>
    axios
        .post(`${url}/create-user`, data, {
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

export const updateUserAgentApi = (token: string, data: object, id: string) =>
    axios
        .put(`${url}/user/agentUpdate/${id}`, data, {
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
export const updateUserApi = (token: string, data: object, id: string) =>
    axios
        .put(`${url}/user/agentUpdate/${id}`, data, {
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

export const resetPassword = (token: string, password: string) =>
    axios
        .post(
            `${url}/user/reset-password`,
            { password },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        )
        .then((res) => res.data)
        .catch((error) =>
            toastify(
                'failure',
                error.response.data.message.length > 0
                    ? error.response.data.message
                    : 'Something went wrong'
            )
        );

export const resetPasswordNewUser = (password: string, id: string) =>
    axios
        .post(`${url}/reset-password-new`, { password, id })
        .then((res) => res.data)
        .catch((error) =>
            toastify(
                'failure',
                error.response.data.message.length > 0
                    ? error.response.data.message
                    : 'Something went wrong'
            )
        );

export const agentUserApi = (token: string, data: object) =>
    axios
        .post(`${url}/user/agentCreate`, data, {
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

export const userDeleteApi = (token: string, id: string) =>
    axios
        .delete(`${url}/user/${id}`, {
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
