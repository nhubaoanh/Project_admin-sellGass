import { Demo } from "@/types";

export const UserService = {
    getUser() {
        return fetch('http://localhost:7890/api/nhanvien', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                // console.log('Dữ liệu trả về:', d);
                return d as Demo.nguoidung[];
            });
    },
    deleteUser(id: number) {
        return fetch(`http://localhost:7890/api/nhanvien/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to delete product');
                }
                return res.json(); // hoặc res.text() nếu API trả về thông báo
            })
            .then((data) => {
                console.log('✅ Product deleted:', data);
                return data;
            });
    }
};