var app = {};

$(document).ready(function(){
  init();
})

function init() {
  $('.typing-indicator').hide();

  $('#btn-chat').click(function(){
    sendMessage();
  })

  $('#btn-input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        sendMessage();
    }
  })

  $('#btn-input').focus();
  app.guid = guid();
}

function sendMessage() {
  var message = $('#btn-input').val();
  console.log("Sending message", message);
  if(message) {
    var backendUrl = "https://us-central1-makan-func.cloudfunctions.net/makanBot/ask";
    //var backendUrl = "/ask";

    $('.typing-indicator').show();
    var data = { channel: 'webhook',
                text: message,
                user: app.guid,
                type: 'message'};
    $.ajax({
      url: backendUrl,
      type:'POST',
      data: JSON.stringify(data),
      contentType: "application/json",
      dataType: 'json',
      success: function(response){
          console.log("Result", response);
          if(response && response.type == 'message' && response.text) {
            createMessageLine(response.text, true);
          }
          else if(response && response.type == 'typing') {
            createMessageLine("Thinking. Give me a minute");
          }
          else {
            createMessageLine("Oops. I wasn't paying attention. Can you repeat?", true);
          }

      }
    })
    .fail(function(err){
      console.error(err);
      createMessageLine("Sorry. I'm tired. Try again later.", true);
    });
    createMessageLine(message, false);
    $('#btn-input').val("");
    $('#btn-input').focus();
  }
}

function createMessageLine(message, isBot) {
  if(isBot) {
    $('.typing-indicator').hide();
  }

  var line = document.createElement('li');
  line.classList.add(isBot?'left':'right');
  line.classList.add('clearfix');
  var span = document.createElement('span');
  span.classList.add('chat-img');
  span.classList.add(isBot?'pull-left':'pull-right');

  var img = document.createElement('img');
  var imgSrc = isBot?'img/ma.png':'img/u.png'
  img.src = imgSrc;
  img.classList.add('img-circle');
  img.alt = 'User Avatar';

  var chatBody = document.createElement('div');
  chatBody.classList.add('chat-body');
  chatBody.classList.add('clearfix');

  var header = document.createElement('div');
  header.classList.add('header');

  var name = document.createElement('strong');
  if(!isBot) {
    name.classList.add('pull-right');
  }
  name.classList.add('primary-font');
  $(name).text(isBot?'Bot':'You');

  var small = document.createElement('small');
  if(isBot) {
    small.classList.add('pull-right');
  }
  small.classList.add('text-muted');

  var timeSpan = document.createElement('span');
  timeSpan.classList.add('glyphicon');
  timeSpan.classList.add('glyphicon-time');

  //var timeNode = document.createTextNode('x mins ago');
  //small.appendChild(timeNode);

  var text = document.createElement('p');
  if(!isBot) {
    text.classList.add('pull-right');
  }
  $(text).text(message);

  small.appendChild(timeSpan);

  if(isBot) {
    header.appendChild(name);
    header.appendChild(small);
  }
  else {
    header.appendChild(small);
    header.appendChild(name);
  }

  chatBody.appendChild(header);
  chatBody.appendChild(text);

  span.appendChild(img);
  line.appendChild(span);
  line.appendChild(chatBody);

  $('#chat-list').append(line);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
