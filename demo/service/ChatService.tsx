// src/services/ChatService.ts
export const ChatService = {
    // Gọi API tạo phòng chat giữa user và staff
    createRoom(userId: string, staffId: string) {
        return fetch('http://localhost:7890/api/chat/createRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ userId, staffId })
        })
            .then((res) => {
                if (!res.ok) throw new Error('Không thể tạo phòng chat');
                return res.json();
            })
            .then((data) => {
                console.log('✅ Room ID nhận từ backend:', data);
                return data as { roomId: string };
            });
    }
};
