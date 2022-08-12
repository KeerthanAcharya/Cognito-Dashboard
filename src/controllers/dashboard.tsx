import axios from "axios";
import config from '../config.json';
import { toastify } from "../components/common/notification";
const url = config['baseHost_backend'];
export const dashboard = (token: string) => 
    axios
        .post(`${url}/drm-dashboard`, {
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
