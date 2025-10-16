import { Demo } from '@/types';

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
    }
};
