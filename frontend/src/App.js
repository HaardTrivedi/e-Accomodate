import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import UserContext from './UserContext';
import NavBar from './component/NavBar/NavBar';
import LoginPage from './component/Login/LoginPage';
import Register from './component/Register/RegisterPage';
import PrivateRoute from './component/PrivateRoute/PrivateRoute';
import PropertyPage from './component/Property/PropertyPage/PropertyPage';
import ProfilePage from './component/Profile/ProfilePage';
import AddPropertyPage from './component/Property/AddPropertyPage/AddPropertyPage';
import PropertyLibrary from './component/Property/PropertyList/PropertyLibrary';

const App = () => {
        const [user, setUser] = useState(() => {
                const localData = localStorage.getItem('user');
                return localData ? JSON.parse(localData) : null;
        });
        const value = useMemo(() => ({ user, setUser }), [user, setUser]);

        useEffect(() => {
                localStorage.setItem('user', JSON.stringify(user));
        }, [user]);

        const loadUser = (data) => {
                setUser(data);
        };

        return (
                <Router>
                        <UserContext.Provider value={value}>
                                <NavBar/>
                                <Switch>
                                        <Route
                                                path='/login'
                                                component={() => ( <LoginPage  loadUser={ loadUser } />  )}
                                        />
                                        <Route
                                                exact
                                                path='/'
                                                render={() => (
                                                        <React.Fragment>
                                                                <div className='main'>
                                                                        <PropertyLibrary />
                                                                </div>
                                                        </React.Fragment>
                                                )}
                                        />
                                        <Route path='/register' component={Register} />
                                        <PrivateRoute path='/add-property' component={AddPropertyPage} />
                                        <PrivateRoute
                                                path='/property/:propertyid'
                                                component={(props) => (
                                                        <PropertyPage {...props} />
                                                )}
                                        />
                                        <PrivateRoute path='/profile/:pid' component={ProfilePage} />
                                </Switch>
                        </UserContext.Provider>
                </Router>
        );
};

export default App;
