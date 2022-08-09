export const pstTime = (time: string) => {
    return new Date(time).toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles',
        // hour: 'numeric',
        // minute: 'numeric',
        // hour12: true,
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
};

export const Types = [
    {
        label: 'Corporate',
        value: 'corporate'
    },
    {
        label: 'Dealer',
        value: 'dealer'
    }
]

export const Roles = [
    {
        type: 'corporate',
        label: 'corporate_Role 1',
        value: 'corporate_role_1'
    },
    {
        type: 'dealer',
        label: 'dealer_Role_2',
        value: 'dealer_Role_2'
    },
]
