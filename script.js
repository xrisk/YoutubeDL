function getWebsite(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    return xhr.responseText;
}

function decodeQueryString(queryString) {
    var key, keyValPair, keyValPairs, r, val, _i, _len;
    r = {};
    keyValPairs = queryString.split("&");
    for (_i = 0, _len = keyValPairs.length; _i < _len; _i++) {
        keyValPair = keyValPairs[_i];
        key = decodeURIComponent(keyValPair.split("=")[0]);
        val = decodeURIComponent(keyValPair.split("=")[1] || "");
        r[key] = val;
    }
    return r;
}

function decodeStreamMap(url_encoded_fmt_stream_map) {
    var quality, sources, stream, type, urlEncodedStream, _i, _len, _ref;
    sources = {};
    _ref = url_encoded_fmt_stream_map.split(",");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        urlEncodedStream = _ref[_i];
        stream = decodeQueryString(urlEncodedStream);
        type = stream.type.split(";")[0];
        quality = stream.quality.split(",")[0];
        stream.original_url = stream.url;
        stream.url = "" + stream.url + "&signature=" + stream.sig;
        sources["" + type + " " + quality] = stream;
    }
    return sources;
}
function YoutubeVideo(youtubeId) {
var videoInfo = getWebsite('http://jsonp.afeld.me/?url=http://www.youtube.com/get_video_info?video_id='+youtubeId);
if (videoInfo === '') {
    //Error
}
var video = decodeQueryString(videoInfo);
if (video.status === "fail") {
    //Error
}
var videoSources = decodeStreamMap(video.url_encoded_fmt_stream_map);


    var key, source, _ref;
    _ref = videoSources;
    var VideoURL = [{}];
    for (key in _ref) {
        source = _ref[key];
        if (source.type.match('video/mp4')) {
        	VideoURL.push(source);
        }
    }
    var mainVideo = {};
    mainVideo.URL = VideoURL;
    mainVideo.author = video.author;
    mainVideo.image = video.iurl;
    mainVideo.title = (video.title).replace(/\+/g, " ");
    return mainVideo;
}