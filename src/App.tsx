import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Loader from './components/common/Loader';

import './App.css';

import Login from './components/Login/Login';
// import UserList from './components/User/userList';
// import CreateUser from './components/User/createUser';
import WithoutBars from './components/common/withoutbar';
// import DealerList from './components/Dealer/dealerList';

import { UserContext } from './components/common/UserContext';
import WithBars from './components/common/withbar';
import { selfUser } from './controllers/users';
import sidebarItems from './controllers/SidebarElements';
// import Leads from './components/Leads/Leads';
// import LeadDetails from './components/Leads/LeadDetails';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
// import CreateDealer from './components/Dealer/createDealer';

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
} & RouteProps;



function ProtectedRoute({ isAuthenticated, ...routeProps }: ProtectedRouteProps) {
    if (isAuthenticated) {
        return <Route {...routeProps} />;
    } else {
        return <Redirect to={{ pathname: '/auth' }} />;
    }
}

// Create a client
const queryClient = new QueryClient();

function App() {
    const[soldData,setSoldData]=useState<any>("")
    const [user, setUser] = useState({
        id: '',
        email: '',
        name: '',
        role: '',
        soldvalue:'0',
        fromDate:'',
        toDate:'',
        type: '',
        ID: '',
        authToken: '',
    });

    const [loading, setLoading] = useState(true);

    const [route, setRoute] = useState('login');

    console.log('user', user)

    useEffect(() => {
        const token = localStorage.getItem('$AuthToken');
        console.log("🚀 ~ file: App.tsx ~ line 67 ~ useEffect ~ token", token)
        if (token) {
            console.log('called selfUser', token)
            selfUser(token)
                .then((data) => {
                    if (!data) {
                        localStorage.removeItem('$AuthToken');
                    } else {
                        setUser({
                            id: data.data.id,
                            email: data.data.email,
                            name: data.data.first_name + ' ' + data.data.last_name,
                            role: data.data.role,
                            soldvalue:'0',
                            fromDate:'',
                            type: data.data.type,
                            ID: data.data.ID,
                            toDate:'',
                            authToken: token,
                        });

                        const firstElement = sidebarItems.find((item) =>
                            item.users?.includes(data.role)
                        );

                        const sideItems = sidebarItems.filter((item) =>
                            item.users?.includes(data.role)
                        );

                        setRoute(firstElement?.route || '/auth');
                    }
                    setTimeout(() => setLoading(false), 100);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                    // localStorage.removeItem('$AuthToken');
                });
        } else {
            setLoading(false);
        }
    }, [localStorage.getItem('$AuthToken')]);

    const isAuthenticate = () => {
        return user.email !== '';
    };

    if (loading) {
        return <Loader />;
    }
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter hashType='noslash'>
                <UserContext.Provider
                    value={{
                        id: user.id,
                        name: user.name,
                        role: user.role,
                        email: user.email,
                        authToken: user.authToken,
                        soldvalue:user.soldvalue,
                        fromDate:user.fromDate,
                        toDate:user.toDate,
                        type: user.type,
                        ID: user.ID,
                        setUser: setUser,
                    }}>
                    <div className='container-div'>
                        <Switch>
                            {/* <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/leads'
                                render={() => <WithBars render={() => <Leads />} />}
                                exact
                            /> */}
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/dashboard'
                                render={() => <WithBars render={() => <Dashboard setUser={setUser}/>} />}
                                exact
                            />
                            {/* <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/leads/:id'
                                render={() => (
                                    <WithBars
                                        render={() => (
                                            <React.Suspense fallback={<Loader />}>
                                                <LeadDetails />
                                            </React.Suspense>
                                        )}
                                    />
                                )}
                                exact
                            /> */}
                            {/* <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/dealers'
                                render={() => <WithBars render={() => <DealerList />} />}
                                exact
                            />
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/dealers/edit/:id'
                                render={() => <WithBars render={() => <CreateDealer />} />}
                                exact
                            />
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/dealers/create'
                                render={() => <WithBars render={() => <CreateDealer />} />}
                                exact
                            />
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/users'
                                render={() => <WithBars render={() => <UserList />} />}
                                exact
                            />
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/users/create'
                                render={() => <WithBars render={() => <CreateUser />} />}
                                exact
                            />
                            <ProtectedRoute
                                isAuthenticated={isAuthenticate()}
                                path='/users/edit/:id'
                                render={() => <WithBars render={() => <CreateUser />} />}
                                exact
                            /> */}
                            <Route
                                path={'/auth'}
                                render={() => (
                                    <WithoutBars render={() => <Login setUser={setUser} />} />
                                )}
                                exact
                            />

                            {isAuthenticate() ? (
                                <Redirect to={`/${route}`} />
                            ) : (
                                <Redirect to={'/auth'} />
                            )}
                        </Switch>
                    </div>
                </UserContext.Provider>
            </HashRouter>
            <ToastContainer
                position='top-right'
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
        </QueryClientProvider>
    );
}

export default App;
