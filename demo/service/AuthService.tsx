export const AuthService = {
    login(email: string, matkhau: string) {
        return fetch('http://localhost:7890/api/vaitro/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, matkhau })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Dữ liệu trả về:', data);
                return data;
            });
    }
};
