import React, { createContext } from 'react';

export const UserContext = createContext<{
    id: string;
    name: string;
    role: string;
    email: string;
    authToken: string;
    soldvalue:string,
    fromDate:string,
    toDate:string,
    type: string,
    ID: string,
    setUser: Function;
}>({
    id: '',
    name: '',
    role: '',
    email: '',
    authToken: '',
    soldvalue:'',
    fromDate:'',
    type: '',
    ID: '',
    toDate:'',
    setUser: () => {},
});
