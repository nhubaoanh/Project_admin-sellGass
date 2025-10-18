'use client';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';

interface Message {
    message: string;
    sender: 'user' | 'staff';
    timestamp: Date;
}

interface StaffChatProps {
    userId: string;
    staffId: string;
}

const StaffChat: React.FC<StaffChatProps> = ({ userId, staffId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isUserOnline, setIsUserOnline] = useState<boolean>(false);
    const roomId = `chat_${userId}_${staffId}`;
    const scrollRef = useRef<ScrollPanel>(null);
    const socketRef = useRef<Socket | null>(null);
    const toastRef = useRef<Toast>(null);

    // 🔗 Kết nối socket
    useEffect(() => {
        const socket = io('http://localhost:7890', {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socket.emit('join_room', roomId);
        socketRef.current = socket;

        // Lắng nghe trạng thái online của user
        socket.on('user_status', (data: { userId: string; online: boolean }) => {
            if (data.userId === userId) {
                setIsUserOnline(data.online);
            }
        });

        // Lắng nghe tin nhắn và hiển thị thông báo
        socket.on('receive_message', (data) => {
            if (data.room === roomId) {
                const newMsg = {
                    message: data.message,
                    sender: data.sender,
                    timestamp: new Date(data.timestamp)
                };
                setMessages((prev) => [...prev, newMsg]);

                // Hiển thị thông báo khi nhận tin nhắn từ user
                if (data.sender === 'user') {
                    toastRef.current?.show({
                        severity: 'info',
                        summary: 'Tin nhắn mới',
                        detail: `${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
                        life: 3000
                    });
                }
            }
        });

        // Xử lý lỗi kết nối
        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_status');
            socket.off('connect_error');
            socket.emit('leave_room', roomId);
            socket.disconnect();
        };
    }, [roomId]);

    // 🧭 Cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        const content = scrollRef.current?.getContent();
        if (content) {
            content.scrollTo({
                top: content.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // ✉️ Gửi tin nhắn
    const sendMessage = () => {
        if (!message.trim() || !socketRef.current) return;

        socketRef.current.emit('send_message', {
            room: roomId,
            message,
            sender: 'staff',
            timestamp: new Date().toISOString()
        });

        setMessage('');
    };

    // ⌨️ Xử lý Enter / Shift+Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <Toast ref={toastRef} position="top-right" />
            <Card
                title={
                    <div className="flex align-items-center justify-content-between">
                        <span>💬 Chat với khách hàng #{userId}</span>
                        <Badge value={isUserOnline ? 'Online' : 'Offline'} severity={isUserOnline ? 'success' : 'danger'} className="ml-2" />
                    </div>
                }
                className="shadow-5 border-round-xl p-0 h-full"
                style={{ background: '#ffffff' }}
            >
                <div className="flex flex-column h-[75vh]">
                    <ScrollPanel ref={scrollRef} style={{ height: '60vh', background: '#f1f5f9' }} className="p-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-5">
                                <i className="pi pi-comments text-4xl mb-3" />
                                <p className="text-lg font-medium">Chưa có tin nhắn nào</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex mb-4 ${msg.sender === 'staff' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    <div className={`max-w-2xl p-4 border-round-xl shadow-2 ${msg.sender === 'staff' ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-gray-900 mr-auto border-1 border-gray-200'}`}>
                                        <p className="m-0 break-words whitespace-pre-wrap font-medium">{msg.message}</p>
                                        <small className="block mt-2 opacity-70 text-sm text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollPanel>

                    <Divider className="m-0" />

                    <div className="flex align-items-center gap-3 p-4 bg-white border-top-1 border-gray-200">
                        <InputTextarea
                            autoResize
                            rows={1}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                            className="flex-1 border-round-lg p-3 bg-gray-100"
                            style={{ maxHeight: '120px', fontSize: '1rem' }}
                        />
                        <Button icon="pi pi-send" onClick={sendMessage} className="p-button-rounded p-button-success" style={{ padding: '0.75rem' }} />
                    </div>
                </div>
            </Card>
        </>
    );
};

export default StaffChat;
