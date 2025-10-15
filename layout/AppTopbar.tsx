/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, use, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { userStorage, UserStorageItem } from '@/demo/service/userStorage';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface UserOption {
    name: string;
    code: string;
}
interface DropdownChangeEvent {
    value: UserOption | null;
}

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [user, setUser] = useState<UserStorageItem | null>(null);
    const [selectedOption, setSelectedOption] = useState<UserOption | null>(null);
    const [visible, setVisible] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const router = useRouter();
    const userOptions: UserOption[] = [
        { name: 'Profile', code: 'profile' },
        { name: 'Settings', code: 'settings' },
        { name: 'Logout', code: 'logout' }
    ];

    useEffect(() => {
        fetUser();
    }, []);

    const fetUser = () => {
        try {
            const currentUser = userStorage.getCurrentUser();
            console.log('Current User:', currentUser);
            setUser(currentUser);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    // Xử lý khi chọn tùy chọn trong Dropdown
    const handleOptionSelect = (e: DropdownChangeEvent) => {
        setSelectedOption(e.value);
        if (e.value?.code === 'logout') {
            if (user?.userId) {
                userStorage.removeUser(user.userId); // Truyền userId
                console.log('User logged out, localStorage cleared');
                router.push('/landing');
            }
        } else if (e.value?.code === 'profile') {
            router.push('/profile'); // Chuyển hướng đến trang profile
        } else if (e.value?.code === 'settings') {
            router.push('/settings'); // Chuyển hướng đến trang settings
        }
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar" style={{ backgroundColor: 'var(--indigo-400)', color: 'var(--primary-color-text)', padding: '0 1rem' }}>
            <Link href="/" className="layout-topbar-logo">
                {/* <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" /> */}
                <i className="pi pi-spin pi-bitcoin" style={{ fontSize: '3rem' }}></i>
                <span style={{ fontSize: '1.2rem', marginLeft: '1rem' }}>NHUBAOANH-SHOP GASS</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <span style={{ alignContent: 'center', color: 'var(--text-white)', marginTop: '0.3rem', fontSize: '14px' }}>User Name : {user?.username}</span>
                <>
                    <Button type="button" className="p-link layout-topbar-button m-2" onClick={() => setVisible(true)}>
                        <i className="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </Button>
                    <Button className="p-link layout-topbar-button m-2">
                        <i className="pi pi-bell"></i>
                    </Button>

                    <Dialog header="Select a Date" visible={visible} onHide={() => setVisible(false)} style={{ width: '30vw' }}>
                        <Calendar value={date} onChange={(e) => setDate(e.value || null)} showIcon dateFormat="dd/mm/yy" showButtonBar />
                        <div style={{ marginTop: '1rem' }}>
                            <Button label="Close" icon="pi pi-times" onClick={() => setVisible(false)} />
                            {date && <p>Selected Date: {new Date(date).toLocaleDateString()}</p>}
                        </div>
                    </Dialog>
                </>
                <Dropdown
                    value={selectedOption}
                    onChange={handleOptionSelect}
                    options={userOptions}
                    optionLabel="name"
                    placeholder="Select an option"
                    className="w-full md:w-14rem"
                    style={{
                        borderRadius: '12px',
                        border: '1px solid transparent',
                        background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(45deg, #ff6b6b, #4ecdc4) border-box',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    itemTemplate={(option) => (
                        <div className="flex align-items-center gap-2">
                            <i className={option.code === 'profile' ? 'pi pi-user' : option.code === 'settings' ? 'pi pi-spin pi-cog' : 'pi pi-sign-out'} />
                            <span>{option.name}</span>
                        </div>
                    )}
                />
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
