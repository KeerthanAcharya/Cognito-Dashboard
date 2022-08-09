import moment from 'moment-timezone';

export const dateformater: any = (date: any) => {
    return moment.tz(date, 'America/Los_Angeles').format('ll');
};

export const timeformater: any = (date: any) => {
    return moment.tz(date,'America/Los_Angeles').locale('').format('LT');
};
