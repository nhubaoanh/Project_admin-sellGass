import { Demo } from '@/types';

export const OrderService = {
    async getOrder() {
        try {
            const res = await fetch('http://localhost:7890/api/orders', {
                headers: { 'Cache-Control': 'no-cache' }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data.data as Demo.Order[];
        } catch (error) {
            console.error('Get order failed:', error);
            throw error; // Ném lỗi để component xử lý
        }
    },

    async deleteOrder(madh: number) {
        try {
            const res = await fetch(`http://localhost:7890/api/orders/${madh}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('Delete order failed:', error);
            throw error;
        }
    },

    async updateOrder(id: number, order: Demo.Order) {
        try {
            const res = await fetch(`http://localhost:7890/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('Update order failed:', error);
            throw error;
        }
    },

    async createOrder(order: Demo.Order) {
        try {
            const res = await fetch('http://localhost:7890/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            if (!res.ok) {
                const errorText = await res.text(); // Lấy text để debug
                console.error('Create order failed, response:', errorText);
                throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`);
            }
            return await res.json();
        } catch (error) {
            console.error('Create order failed:', error);
            throw error;
        }
    },

    async getDashBroad() {
        try {
            const res = await fetch('http://localhost:7890/api/orders/dashboarddata', {
                method: 'POST', // POST thay vì GET
                headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log('Dữ liệu trả về:', data);
            return data.data; // data = { overview, dailyStats }
        } catch (error) {
            console.error('Lỗi khi lấy dashboard:', error);
            throw error;
        }
    }
};
