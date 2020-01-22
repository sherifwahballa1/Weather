const logout = async () => {
    try { 
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });
        if((res.data.status = 'success')) {
            location.replace('/login');
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if(el) el.parentElement.removeChild(el);
        const markup = '<div class="alert alert--error">Error Logging our! try again </div>';
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
   }
};


const logOutBtn = document.querySelector('.logOutBtn');

if(logOutBtn) logOutBtn.addEventListener('click', logout);