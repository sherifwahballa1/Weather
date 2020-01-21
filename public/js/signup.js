const signup = async (name, email, country, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup', //'http://localhost:8000/api/v1/users/signup'
            data: {
                name,
                email,
                country,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            const el = document.querySelector('.alert');
            if (el) el.parentElement.removeChild(el);
            const markup = '<div class="alert alert--success">Signup successfully</div>';
            document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
            //alert('Logged in successfully');
            window.setTimeout(() => {
                location.assign('/home')
            }, 1500);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    }

};

document.querySelector('.form--signup').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const country = document.getElementById('country').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, country, password, passwordConfirm);
});