


'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import StaffNotification from './components/StaffNotification';
import { ChatService } from '@/demo/service/ChatService';

const ChatComponent = dynamic(() => import('./components/StaffChat'), { ssr: false });

export default function StaffChatPage() {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const staffId = '1';

    const handleSelectCustomer = async (customer: any) => {
        setSelectedCustomer(customer);
        const res = await ChatService.createRoom(customer.id, staffId);
        setRoomId(res.roomId);
    };

    return (
        <div className="p-4">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý tin nhắn</h1>
                <StaffNotification onSelectCustomer={handleSelectCustomer} />
            </div>

            {selectedCustomer && roomId ? <ChatComponent userId={selectedCustomer.id} staffId={staffId} roomId={roomId} /> : <p className="text-gray-600">💬 Chưa chọn khách hàng nào.</p>}
        </div>
    );
}
