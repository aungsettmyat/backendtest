var socket = io.connect('https://syncvideoplayer.herokuapp.com/');
var play = document.getElementById('play'),
pause = document.getElementById('pause'),
searchbar = document.getElementById('searchbar'),
resultarea = document.getElementById('resultarea');
vplaceholder = document.getElementById('diviframe');
$('#pause').hide();
$('#play').hide();

var player,
time_update_interval = 0;
function initialize(){
	clearInterval(time_update_interval);
}

searchbtn.addEventListener('click',function(){
	var urlString = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchbar.value+"&type=video&key=AIzaSyBHO2dkGc8FEjKb7QRadas5xhF3AHnYX8A";
	var hdnflg = $('#hdnflg').val();
	$.ajax({
		url: urlString,
		success: (result, status, xhr) => {
			results = result.items;
			resultarea.innerHTML = "";
			if(hdnflg == "show"){
				$( "#diviframe" ).load(window.location.href+" #diviframe", function(){
					$('#pause').hide();
					$('#pause').css('display', 'none');
					$('#play').hide();
					$('#play').css('display', 'none');
				});
				$('#hdnflg').val("");
			}
			//vplaceholder.innerHTML = "";
			results.forEach((video) => {
				resultarea.innerHTML += '<div id='+video.id.videoId+'><img src=\"'+video.snippet.thumbnails.default.url+'\" id='+video.id.videoId+'><span>'+
				video.snippet.title+'</span></div>'
			});      
		},
		error: (xhr, status, err) => {
			console.log("Failed to fetch data");
		}
	});
});

var vid_id ='';
resultarea.addEventListener('click',function(event){
	socket.emit('videoid',event.target.id);
	resultarea.innerHTML = "";
});

socket.on('videoid', function(data){
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	resultarea.innerHTML = "";
	vid_id = data;  
	if(player){
		player.destroy();
		player = new YT.Player('video-placeholder', {
			width: 600,
			height: 400,
			videoId: vid_id,  
			events: {
				onReady: initialize,
				onStateChange: statechange
			}
		});
	} 
    
	$('#hdnflg').val("show");
	$('#pause').show();
	$('#play').show(); 
});

function onYouTubeIframeAPIReady() {
	player = new YT.Player('video-placeholder', {
		width: 600,
        height: 400,
        videoId: vid_id,
	    events: {
	    	onReady: initialize,
	    	onStateChange: statechange
	    }
	});
}

var flag = false;
play.addEventListener('click',function(){
	socket.emit('play',player.getCurrentTime());
});

pause.addEventListener('click',function(){
	socket.emit('pause');
	flag = false;
});

function statechange(event){
	if(event.data == 1 && !flag){
		socket.emit('play',player.getCurrentTime());
		flag = true;
	}else if(event.data==2){
		socket.emit('pause');
		flag = false;
	}
}

socket.on('play', function(data){
	player.playVideo();
	player.seekTo(data);
});

socket.on('pause', function(data){
	player.pauseVideo();
});