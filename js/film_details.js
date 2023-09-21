'use strict';
var stompClient = null;

const tokenWebsocket = sessionStorage.getItem('token');
console.log(tokenWebsocket);

const headers = {
  Authorization: `Bearer ${tokenWebsocket}`
};


function connect() {
  var socket = new SockJS('http://localhost:8080/ws', null, { headers: headers });
  stompClient = Stomp.over(socket);

  stompClient.connect({}, onConnected, onError);
  console.log('connect');
}
connect();

function onError(error) {
  console.log('Could not connect to WebSocket server. Please refresh this page to try again!');
}

function onConnected() {
  stompClient.subscribe('/topic/publicBookingRoom', onMessageReceived);
  stompClient.subscribe('/topic/error', onReceiveError);
}

function onReceiveError(payload) {
  const error = JSON.parse(payload.body);
  console.log('payload.body');
  console.log(error);
}
function onMessageReceived(payload) {
  const booking = JSON.parse(payload.body);
  console.log('payload.body');
  console.log(booking);

  const seatsBooked = booking.seatNames;
  var seats = document.querySelectorAll('.seat');
  for (let i = 0; i < seats.length; i++) {
    for (let j = 0; j < seatsBooked.length; j++) {
      if (seats[i].textContent == seatsBooked[j])
        seats[i].style.backgroundColor = 'red';
    }
  }
}

function sendMessage(payload) {
  stompClient.send("/app/room.bookingTicket", headers, JSON.stringify(payload));
  console.log('send-message-ok');
}


// get filmId by url
var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams);
var filmId = urlParams.get("id");

async function fetchFilm() {
  const response = await fetch('http://localhost:8080/api/v1/films/' + filmId, {
    method: 'GET'
  });
  const movie = await response.json();
  console.log(movie);
  // Tạo phần tử div chứa thông tin chi tiết phim
  var movieDetails = document.getElementById('movie-details');
  var movieElement = document.createElement('div');
  movieElement.className = 'movie';

  var imageElement = document.createElement('img');
  imageElement.src = '/images/' + movie.fileDTOS[0].name;

  var detailsElement = document.createElement('div');
  detailsElement.className = 'details';

  var titleElement = document.createElement('h2');
  titleElement.textContent = movie.name;

  var actorElement = document.createElement('p');
  actorElement.textContent = 'Diễn viên: ' + movie.actors;

  var timeElement = document.createElement('p');
  timeElement.textContent = 'Thời lượng: ' + movie.time;

  var descriptionElement = document.createElement('p');
  descriptionElement.textContent = 'Mô tả: ' + movie.description;

  // Gắn các phần tử con vào phần tử chứa thông tin chi tiết phim
  detailsElement.appendChild(titleElement);
  detailsElement.appendChild(timeElement);
  detailsElement.appendChild(actorElement);
  detailsElement.appendChild(descriptionElement);

  // Gắn hình ảnh và thông tin chi tiết phim vào phần tử chứa chi tiết phim
  movieElement.appendChild(imageElement);
  movieElement.appendChild(detailsElement);

  // Gắn phần tử chứa chi tiết phim vào trang web
  movieDetails.appendChild(movieElement);
}
fetchFilm();


async function fetchShowtime() {
  const response = await fetch('http://localhost:8080/api/v1/films/' + filmId + '/showtimes', {
    method: 'GET'
  });
  const showtimes = await response.json();
  console.log(showtimes);

  var showtimeList = document.getElementById('showtimes');

  for (var i = 0; i < showtimes.length; i++) {
    var showtime = showtimes[i];

    var showtimeElement = document.createElement('div');
    showtimeElement.className = 'showtime';

    var roomElement = document.createElement('div');
    roomElement.textContent = 'Phòng: ' + showtime.roomDTO.name;

    var startElement = document.createElement('div');
    startElement.textContent = 'Thời gian bắt đầu: ' + showtime.startTime;

    var endElement = document.createElement('div');
    endElement.textContent = 'Thời gian kết thúc: ' + showtime.endTime;

    var buyTicket = document.createElement('button');
    buyTicket.className = 'buy-ticket';
    buyTicket.textContent = 'Mua vé';

    showtimeElement.appendChild(roomElement);
    showtimeElement.appendChild(startElement);
    showtimeElement.appendChild(endElement);
    showtimeElement.appendChild(buyTicket);

    showtimeList.appendChild(showtimeElement);

    // chờ hàm showModal thực hiện xong
    await showModal(showtime.id, showtime.roomDTO.name);
  }

  var listModal = document.querySelectorAll('.modal');
  var listBuy = document.querySelectorAll('.buy-ticket');

  var arrayModal = Array.from(listModal);
  var arrayBuy = Array.from(listBuy);


  for (let i = 0; i < arrayBuy.length; i++) {
    arrayBuy[i].addEventListener('click', function () {
      arrayModal[i].style.display = 'block';
    });
  }
}
fetchShowtime();

async function showModal(showtimeId, roomName) {
  const response = await fetch('http://localhost:8080/api/v1/tickets/showtime/' + showtimeId, {
    method: 'GET'
  });
  const tickets = await response.json();
  console.log('tickets');
  console.log(tickets);

  var modal = document.createElement('div');
  modal.className = 'modal';

  var modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  var room = document.createElement('h1');
  room.className = 'room';
  room.textContent = roomName;

  var seatsContainer = document.createElement('div');
  seatsContainer.className = 'seats-container';

  var actions = document.createElement('div');
  actions.className = 'actions';

  var btnCloseModal = document.createElement('button');
  btnCloseModal.className = 'btnCloseModal';
  btnCloseModal.innerText = 'Đóng';

  btnCloseModal.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  var btnBooking = document.createElement('button');
  btnBooking.className = 'btnBooking';
  btnBooking.textContent = 'Đặt vé';
  btnBooking.style.display = 'none';

  btnBooking.addEventListener('click', function () {
    var selecteds = document.querySelectorAll('.selected');
    var selectedTexts = Array.from(selecteds).map(function (element) {
      return element.textContent;
    });

    var payload = {
      seatNames: selectedTexts,
      showtimeId: showtimeId
    };
    sendMessage(payload);
    // showConfirmBookingModal();
  });

  for (let j = 0; j < tickets.length; j++) {
    var seatElement = document.createElement('div');
    seatElement.className = 'seat';
    seatElement.innerText = tickets[j].seatDTO.name;

    function handleClickSeat() {
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
      } else {
        this.classList.add('selected');
      }
      var selecteds = document.querySelectorAll('.selected');
      if (selecteds.length == 0) btnBooking.style.display = 'none';
      else btnBooking.style.display = 'block';
    }
    seatElement.addEventListener('click', handleClickSeat);

    if (tickets[j].status == 'BOOKED') {
      seatElement.style.backgroundColor = 'red';
      seatElement.removeEventListener('click', handleClickSeat);
    }

    if (tickets[j].seatDTO.status == 'MAINTENANCE') {
      seatElement.style.backgroundColor = 'brown';
      seatElement.removeEventListener('click', handleClickSeat);
    }

    seatsContainer.appendChild(seatElement);
  }

  modal.appendChild(modalContent);
  modalContent.appendChild(room);
  modalContent.appendChild(seatsContainer);
  modalContent.appendChild(actions);
  actions.appendChild(btnCloseModal);
  actions.appendChild(btnBooking);

  var myModal = document.getElementById('myModal');
  myModal.appendChild(modal);
}

function showConfirmBookingModal() {
  var confirmModal = document.getElementById('confirmModal');
  confirmModal.style.display = 'block';
}








