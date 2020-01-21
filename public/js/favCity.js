// $(document).ready(function(){

//     $(document).on('click', '#form-fav', function(){
//         var cityName = $('#weatherCityName').val();
//         var cityId = $('#weatherCityId').val();
//         var cityDegree = $('#cityDegree').val();
//         $.ajax({
//             url: '/updateweather',
//             type: 'PATCH',
//             data: {
//                 cityName: cityName,
//                 cityId: cityId,
//                 cityDegree: cityDegree
//             },
//             success: function(){
//                 location.reload();
//             }
//         });
//     });
// });


/* eslint-disable */
const updateFav = async (cityName, cityId, cityDegree) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/updateweather', //'http://localhost:3000/api/v1/users/login'
            data: {
                cityName,
                cityId,
                cityDegree
            }
        });

        if (res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign('/home')
            }, 100);
        }
    } catch (err) {
        const el = document.querySelector('.alert');
        if (el) el.parentElement.removeChild(el);
        const markup = `<div class="alert alert--error">${err.response.data.message}</div>`;
        document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    }

};

document.querySelector('#form-fav').addEventListener('submit', e => {
    e.preventDefault();
    var cityName = document.getElementById('weatherCityName').value;
    var cityId = document.getElementById('weatherCityId').value;
    var cityDegree = document.getElementById('cityDegree').value;
    updateFav(cityName, cityId, cityDegree);
});