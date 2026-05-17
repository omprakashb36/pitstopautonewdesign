'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import {store } from './lib/redux/store';

const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        const persistor = persistStore(store);
        persistor.subscribe(() => {
            setIsHydrated(true);
        });
    }, []);

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default StoreProvider;