$(document).ready(function(){

    $(document).on('click', '#form-fav', function(){
        var cityName = $('#weatherCityName').val();
        var cityId = $('#weatherCityId').val();
        var cityDegree = $('#cityDegree').val();
        $.ajax({
            url: '/updateweather',
            type: 'PATCH',
            data: {
                cityName: cityName,
                cityId: cityId,
                cityDegree: cityDegree
            },
            success: function(){
                console.log('okay');
            }
        });
    });
});