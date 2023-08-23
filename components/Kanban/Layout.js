import React from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';

function Layout({children}) {
    return (
        <div className="min-w-full overflow-hidden bg-blue-100">
            <SideBar/>
            <main className="pl-40 pt-16">
                {children}
            </main>
        </div>
    );
}

export default Layout;