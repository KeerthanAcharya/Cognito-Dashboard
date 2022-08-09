import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function toastify(status: string, message: string) {
    switch (status) {
        case 'success':
            toast.success(message);
            break;
        case 'failure':
            toast.error(message);
            break;
        default:
            break;
    }
}
