function StringFormat() {
         if (arguments.length == 0)
             return null;
         var str = arguments[0];
         for (var i = 1; i < arguments.length; i++) {
             var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
             str = str.replace(re, arguments[i]);
         }
         return str;
}

function getTrip() {
    var table_html = "<li id=\"{0}\" onclick=\"submitTripInfo(this)\">\n" +
        "\t\t\t<a id=\"{4}\">\n" +
        "\t\t\t\t<span id=\"start-time\">{1}</span>\n" +
        "\t\t\t\t<span id=\"cycling-time\">{2}</span> <span>分钟</span>\n" +
        "\t\t\t\t<span id=\"current-time\">{3}</span>\n" +
        "\t\t\t\t<i></i>\n" +
        "\t\t\t</a>\n" +
        "\t\t</li>";

    var p = $.ajax({
        type:'GET',
        url:'/main/getTripInfo/',
        success:function (data) {
           var list_data = $.parseJSON(data);
           console.log(list_data);
           for(var i=0;i<list_data.length;i++){
               var t_html = table_html;
                t_html = StringFormat(t_html, list_data[i].travelId,list_data[i].startTime,list_data[i].how_long_minute,
                list_data[i].startDate, list_data[i].bikeId);
                $('#my-trip').append(t_html);
            }
        },
        error:function (error) {
            console.log(error)
        }
        }
    );
    return p;
}

function submitTripInfo(elem) {
    var tripId = elem.id;
    var bikeId = elem.children[0].id;
    var startTime = elem.children[0].children[0].innerHTML;
    var cycling_time = elem.children[0].children[1].innerHTML;
    var startDate = elem.children[0].children[3].innerHTML;
    console.log(elem.children[0].children[0].innerHTML);
    console.log(elem.children[0].firstElementChild);
    window.location.href="/main/tripDetail/?tripId="+tripId+"&bikeId="+bikeId +
        "&startTime=" + startTime + "&cycling_time=" + cycling_time + "&startDate=" + startDate


}
$(document).ready(function () {
     var p = null;
     p = getTrip();


}
);