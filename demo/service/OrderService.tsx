import { Demo } from "@/types";

export const OrderService = {
    getOrder() {
        return fetch('http://localhost:7890/api/donhang', { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => {
            return d as Demo.Order[];
        });
    }
}