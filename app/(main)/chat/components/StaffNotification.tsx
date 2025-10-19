'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

interface Customer {
    id: string;
    name: string;
    message: string;
    time: string;
}

interface StaffNotificationProps {
    onSelectCustomer: (customer: Customer) => void;
}

const StaffNotification: React.FC<StaffNotificationProps> = ({ onSelectCustomer }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [newCount, setNewCount] = useState(0);
    const [socket, setSocket] = useState<any>(null);
    const opRef = React.useRef<OverlayPanel>(null);

    useEffect(() => {
        const s = io('http://localhost:7890');
        setSocket(s);

        // 🟢 Lắng nghe sự kiện khi khách hàng gửi tin nhắn
        s.on('new_message', (data: any) => {
            const { userId, message, name } = data;

            // Nếu khách này chưa có trong danh sách thì thêm vào
            setCustomers((prev) => {
                const exists = prev.find((c) => c.id === userId);
                if (exists) return prev;
                return [...prev, { id: userId, name: name || `Khách ${userId}`, message, time: new Date().toLocaleTimeString() }];
            });

            // Tăng số lượng thông báo
            setNewCount((count) => count + 1);
        });

        return () => {
            s.disconnect();
        };
    }, []);

    const handleSelect = (customer: Customer) => {
        onSelectCustomer(customer);
        setNewCount((count) => Math.max(0, count - 1));
        opRef.current?.hide();
    };

    return (
        <div className="relative">
            <Button
                icon="pi pi-bell"
                className="p-button-rounded p-button-warning"
                onClick={(e) => opRef.current?.toggle(e)}
            />
            {newCount > 0 && (
                <Badge value={newCount} severity="danger" className="absolute top-0 right-0" />
            )}

            <OverlayPanel ref={opRef}>
                {customers.length === 0 ? (
                    <p className="text-gray-500 text-sm m-2">Không có khách hàng nào nhắn tin</p>
                ) : (
                    <ul className="list-none p-0 m-0">
                        {customers.map((c) => (
                            <li
                                key={c.id}
                                className="p-2 border-bottom-1 border-gray-200 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSelect(c)}
                            >
                                <strong>{c.name}</strong>
                                <p className="text-sm text-gray-600">{c.message}</p>
                                <small className="text-xs text-gray-400">{c.time}</small>
                            </li>
                        ))}
                    </ul>
                )}
            </OverlayPanel>
        </div>
    );
};

export default StaffNotification;
