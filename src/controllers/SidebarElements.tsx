import dashboard from '../assets/images/dashboard.svg';
import users from '../assets/images/users.svg';
import books from '../assets/images/books.svg';
import chartBar from '../assets/images/chart-line-solid.svg';

const sidebarItems = [
    {
        label: 'Dashboard',
        value: 'dashboard',
        route: 'dashboard',
        image: chartBar,
        alt: 'Dashboard',
        width: '20px',
        users: ['admin', 'manager_internal', 'rep_internal', 'dealer_admin', 'dealer_rep', "corporate_role_1"],
    },
    // {
    //     label: 'Leads and Opportunities',
    //     value: 'leads',
    //     route: 'leads',
    //     image: books,
    //     alt: 'Leads',
    //     width: '20px',
    //     users: ['admin', 'manager_internal', 'rep_internal', 'dealer_admin', 'dealer_rep'],
    // },
    // {
    //     label: 'Dealers',
    //     value: 'dealer',
    //     route: 'dealers',
    //     image: dashboard,
    //     alt: 'Dealer',
    //     width: '20px',
    //     users: ['admin', 'manager_internal', 'rep_internal', 'dealer_admin', 'dealer_rep'],
    // },
    // {
    //     label: 'Users',
    //     value: 'users',
    //     route: 'users',
    //     image: users,
    //     alt: 'Users',
    //     width: '20px',
    //     users: ['admin', 'manager_internal', 'rep_internal', 'dealer_admin', 'dealer_rep'],
    // },
];

export default sidebarItems;
