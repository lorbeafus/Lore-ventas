document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
        alert('Debe iniciar sesión para ver esta página.');
        window.location.href = './login.html';
        return;
    }

    const user = JSON.parse(userJson);

    try {
        // Consultar datos actualizados desde el backend
        const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error('Token inválido');
        }

        const data = await res.json();
        const u = data.user || user;

        document.getElementById('acc-name').textContent = u.name || '-';
        document.getElementById('acc-email').textContent = u.email || '-';
        document.getElementById('acc-date').textContent = new Date(u.createdAt).toLocaleDateString();

    } catch (err) {
        console.error(err);
        alert('Error al obtener los datos del usuario');
    }
});
