'use client';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const ChatComponent = dynamic(() => import('./components/StaffChat'), {
    ssr: false
});

export default function StaffChatPage() {

    //  check được user id nè
    const params = useParams();
    const userId = '2'; // Tạm thời để cứng, sau này lấy từ context/params
    const staffId = '1'; // Tạm thời để cứng

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Trò chuyện với khách hàng</h1>
            <ChatComponent userId={userId} staffId={staffId} />
        </div>
    );
}
