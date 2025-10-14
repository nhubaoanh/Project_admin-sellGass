import { Demo } from "@/types";
import { create } from "domain";
import { userStorage } from "./userStorage";

export const UserService = {
    getUser() {
        return fetch('http://localhost:7890/api/nhanvien', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                // console.log('Dữ liệu trả về:', d);
                return d as Demo.nguoidung[];
            });
    },
    // Sửa thành async/await để dễ handle lỗi và log
    deleteUser: async (id: number) => {
        console.log('UserService.deleteUser gọi với manv =', id); // Log gọi API

        const response = await fetch(`http://localhost:7890/api/nhanvien/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status); // Log status (200/404/500)

        if (!response.ok) {
            const errorText = await response.text(); // Lấy text lỗi từ server
            // console.error('Server error response:', errorText);
            throw new Error(`Không thể xóa nhân viên: ${response.status} - ${errorText}`);
        }

        // Đọc raw text trước để kiểm tra rỗng (tránh parse pending hoặc rỗng)
        const rawText = await response.text();
        // console.log('Raw response text:', rawText);  // Log raw để debug (nếu rỗng → server lỗi)

        if (!rawText || rawText.trim() === '' || rawText.trim() === '{}') {
            // console.error('Body rỗng hoặc {} từ server');
            throw new Error('Server trả về dữ liệu rỗng - không xóa được');
        }

        let data;
        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            // console.error('JSON parse error:', parseError);
            throw new Error('Phản hồi server không phải JSON hợp lệ');
        }

        // Kiểm tra affectedRows từ server (giả định server trả về)
        if (!data || data.affectedRows === 0 || data.affectedRows == null) {
            throw new Error(data.message || 'Không xóa được - 0 rows affected trong CSDL');
        }

        return data; // Trả về data đầy đủ cho page/component dùng
    },

    updateUser: async (id: number, user: Demo.nguoidung) => {
        const response = await fetch(`http://localhost:7890/api/nhanvien/${id}`, {
            method: 'PUT', // Hoặc PATCH
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('✅ User updated:', data);
        return data;
    },
    createUser(user: Demo.nguoidung) {
        return fetch('http://localhost:7890/api/nhanvien', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((res) => res.json());
    },

    getLocation() {
        const token = userStorage.getCurrentToken();
        if (!token) return Promise.resolve([]);

        return fetch('http://localhost:7890/api/vaitro', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            }
        })
            .then((res) => res.json())
            .then((d) => {
                // Nếu d.data là mảng vị trí → trả về, nếu lỗi → trả về []
                if (Array.isArray(d.data)) return d.data;
                return [];
            });
    }
};