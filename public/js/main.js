$('#pause').hide();
var audio;
var curr;

initAudio('#playlist_ul li:first-child');

function initAudio(element) {
  var song = "/song/" + $(element + ' p:first-child').attr('song');
  var songname = $(element + ' p:first-child').attr('songname');
  var cover = $(element + ' p:first-child').attr('cover');
  var artist = $(element + ' p:first-child').next().attr('artist');
  $(element).addClass('active');

  audio = new Audio(song);

  initMp3Player();

  $('.curr_song').text(songname);
  $('.curr_artist').text(artist);
  $('#cover-img').attr('src', cover);

}

$('#play').click(()=> {
  audio.play();
  showDuration();
  $('#pause').show();
  $('#play').hide();
});

$('#pause').click(()=> {
  audio.pause();
  $('#pause').hide();
  $('#play').show();
});

$('#next').click(()=> {
  audio.pause();
  var next = $('#playlist_ul .active').next();
  $('#playlist_ul li').removeClass('active');
  if(next.length===0){
    $('#playlist_ul li:first-child').addClass('active');
  } else {
    next.addClass('active');
  }
  initAudio('#playlist_ul .active');
  if($('#pause').is(':visible')) {
    audio.play();
    showDuration();
  }
});

$('#prev').click(()=> {
  audio.pause();
  var prev = $('#playlist_ul .active').prev();
  $('#playlist_ul li').removeClass('active');
  if(prev.length===0){
    $('#playlist_ul li:last-child').addClass('active');
  } else {
    prev.addClass('active');
  }
  initAudio('#playlist_ul .active');
  if($('#pause').is(':visible')) {
    audio.play();
    showDuration();
  }
});

$('#stop').click(()=> {
  audio.pause();
  $('#play').show();
  $('#pause').hide();
  audio.currentTime = 0;
});

$('#volume').change(function(){
  audio.volume = parseFloat( this.value / 10 )
});

function showDuration(){
  $('#prog_knob').attr('src','../images/prog_knob.png');
  $(audio).bind('timeupdate', ()=>{
    if(audio.currentTime > 0){
      var value = Math.floor(( 100 / audio.duration ) * audio.currentTime);
      var buffered = Math.floor((100 / audio.duration ) * audio.buffered.end(0));
    }

    $('.progressbar').css('width', value + '%');
    $('#prog_knob').css('left', value + '%');
    $('.bufferbar').css('width', buffered + '%');
  });
}

//for the visualizer
var context, analyzer, canvas, ctx, source, fbc_array, bars, bar_x, bar_width, bar_height;

function initMp3Player() {
  context = new AudioContext();
  analyzer = context.createAnalyser();
  canvas = document.getElementById("visualizations");
  ctx = canvas.getContext('2d');
  source = context.createMediaElementSource(audio);
  source.connect(analyzer);
  analyzer.connect(context.destination);
  frameLooper();
}

function frameLooper(){
  window.requestAnimationFrame(frameLooper);
  fbc_array = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(fbc_array);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8B098B';
  bars = 100;

  for(var i = 0; i < bars; i++ ) {
    bar_x = i*3;
    bar_width = 1;
    bar_height = -(2.5*fbc_array[i]/4);
    //(x, y, width, height)

    ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
  }
}
