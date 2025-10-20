import { Demo } from '@/types';
import { create } from 'domain';

export const CustomerService = {
    getCustomersMedium() {
        return fetch('/demo/data/customers-medium.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    },

    getCustomersLarge() {
        return fetch('/demo/data/customers-large.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Customer[]);
    },
    getCustomerInfo: async (customer: Demo.CustomerCheckRequest) => {
        const response = await fetch(`http://localhost:7890/api/khachhang/checkCustom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hoten: customer.hoten,
                sdt: customer.sdt,
                diachi: customer.diachi
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Lấy thông tin khách hàng thất bại');
        }

        return data as { data: { status: string; makh?: number; customer?: Demo.CustomerCheckRequest } };
    },
    // ✅ CẬP NHẬT createCustomer trong CustomerService
    // ✅ src/demo/service/CustomerService.ts
    createCustomer: async (data: { email: string; password: string }) => {
        try {
            // ✅ TẠO SĐT NGẪU NHIÊN 10 CHỮ SỐ
            const randomSdt = `0${Math.floor(10000000 + Math.random() * 90000000)}`;

            const payload = {
                hoten: 'Khách hàng',
                email: data.email.trim(),
                password: data.password.trim(),
                sdt: randomSdt, // ✅ SĐT NGẪU NHIÊN - KHÔNG TRÙNG
                diachi: '',
                gioitinh: 'Khác',
                diemtl: 0
            };

            console.log('📞 SĐT tạm:', randomSdt);
            console.log('📤 Payload:', payload);

            const response = await fetch(`http://localhost:7890/api/khachhang`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            console.log('📥 Create response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || responseData.sqlMessage || `HTTP ${response.status}`);
            }

            return {
                success: true,
                data: responseData
            };
        } catch (error: any) {
            console.error('❌ Create customer error:', error);
            throw error;
        }
    }
};
