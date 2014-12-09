var infographic = {};
var last_modified = {};
var po = org.polymaps;
var map;
var points;
var currentPoint = 0;
var minDuration = 180;
var maxDuration = 180;
var starInterval;

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function tickInfographic() {
    for (var i in infographic) {
        var start_count = infographic[i].total;
        var start_date = last_modified[i];
        var average_per_day = infographic[i].daily;
        var single_pace = 1/(average_per_day/24/60/60)*1000;
        var today_date = Math.round((new Date()).getTime() / 1000);
        var date_difference_seconds = Math.abs(today_date - start_date);
        var date_difference_days_not_round = (date_difference_seconds / 86400);
        var corrected_total_downloads_not_round = Math.round(start_count + (average_per_day*date_difference_days_not_round));

        $("." + i).counter({
            direction: "up",
            format: "9,999,999",
            initial: addCommas(corrected_total_downloads_not_round),
            interval: single_pace
        });
    }
}

function overlay(tile, proj) {
    proj = proj(tile);
    var point = points[currentPoint];
    var tl = proj.locationPoint({lon: parseFloat(point.longitude), lat: parseFloat(point.latitude)}),
    image = tile.element = po.svg("image");

    image.setAttribute("x", tl.x - 6);
    image.setAttribute("y", tl.y - 6);
    image.setAttribute("width", 12);
    image.setAttribute("height", 11);
    image.setAttribute("class", "point");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/assets/campaigns/christmas/small_star.png");
    currentPoint++;
    if (currentPoint >= points.length) currentPoint = 0;

    var duration = (Math.floor(Math.random() * (maxDuration - minDuration)) * 1000)
        + (minDuration * 1000);
    $(image).fadeIn().animate({ opacity: 0}, duration, function() {
        $(this).remove();
    });
}

function addPoint() {
    map.add(po.layer(overlay).tile(false));
}

function installs_data(STATS) {
  var start_count = STATS.start_count;
  var start_date = STATS.start_date;
  var average_per_day = STATS.average_per_day;
  var single_pace = 1/(average_per_day/24/60/60)*1000;
  var today_date = Math.round((new Date()).getTime() / 1000);
  var date_difference_seconds = Math.abs(today_date - start_date);
  var date_difference_days_not_round = (date_difference_seconds / 86400);
  var corrected_total_downloads_not_round = Math.round(start_count + (average_per_day*date_difference_days_not_round));

  $('.verse').hide().removeClass('hidden').fadeIn('slow');
  $(".installs").counter({
    direction: "up",
    format: "999,999,999",
    initial: addCommas(corrected_total_downloads_not_round),
    interval: single_pace
  });
}

function runIt(data) {
    points = data;
    clearInterval(starInterval);

    var pointsPerSecond = data.length / (30 * 60);
    starFrequency = 1000 / pointsPerSecond; // How many seconds between stars

    currentPoint = Math.floor(Math.random() * data.length);
    starInterval = setInterval(addPoint, starFrequency);
}

function christmas_map(data) {
    runIt(data);
}

function christmas_chapters(data) {
    if (data.resultset && data.resultset[0]) {
        var item = data.resultset[0];
        infographic['chapter_requests'] = { total: item[0], daily: item[1] };
        last_modified['chapter_requests'] = 1417737600; //item[2]; TODO put this to BQ

        $(".figures").delay(2000).removeClass('hidden').hide().fadeIn('slow');
        tickInfographic();
    }
}

$(document).ready(function() {
    $.getScript("https://commondatastorage.googleapis.com/installs.youversion.com/stats_jsonp.js");
    $.getScript("https://commondatastorage.googleapis.com/installs.youversion.com/christmas_chapter_calls_jsonp.js");
    $.getScript("https://commondatastorage.googleapis.com/installs.youversion.com/christmas_map_jsonp.js");
    setInterval(function() {
        $.getScript("https://commondatastorage.googleapis.com/installs.youversion.com/christmas_map_jsonp.js");
    }, 30 * 60 * 1000); // Fetch a new dataset every 30 minutes

    $(window).load(function(){
        map = po.map()
            .container(document.getElementById("map").appendChild(po.svg("svg")))
            .center({lat: 44, lon: 12})
            .zoomRange([2, 2])
            .zoom(2);
    });
});