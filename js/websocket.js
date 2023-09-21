
'use strict';
var stompClient = null;



function connect() {
  var socket = new SockJS('http://localhost:8080/ws');
  stompClient = Stomp.over(socket);

  stompClient.connect({}, onConnected, onError);
  console.log('connect');
}
connect();

function onError(error) {
  console.log('Could not connect to WebSocket server. Please refresh this page to try again!');
}

function onConnected() {
  stompClient.subscribe('/topic/publicRoomSeats', onMessageReceived);
}

function onMessageReceived(payload) {

  const seat = payload.body;
  console.log('payloadddddd' + seat);
  location.reload();
}

function sendMessage(seatId) {
  stompClient.send("/app/room.bookingSeat", {}, JSON.stringify(seatId));
}

// --------------------------
// JavaScript
const modal = document.querySelector(".modal");
const question = document.querySelector(".question");
const ok = document.querySelector(".ok");
const cancel = document.querySelector(".cancel");
const content = document.querySelector(".content");
const success = document.querySelector(".success");

const token = localStorage.getItem('token');
console.log(token);


const seatsContainer = document.querySelector(".seats-container");

cancel.addEventListener('click', clickCancel);

var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams);
var roomId = urlParams.get("id");
console.log(roomId);

const roomName = document.querySelector(".name-rooms");
roomName.innerText = "Room " + roomId;


async function fetchData() {
  const response = await fetch('http://localhost:8080/api/v1/rooms/' + roomId, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const seats = await response.json();

  console.log('tickets - '+seats);

  seats.forEach(seat => {
    const seatElement = document.createElement("div");
    seatElement.classList.add("seat");
    seatElement.innerText = seat.name;
    seatsContainer.appendChild(seatElement);
  });

  const seatElementList = document.querySelectorAll('.seat');
  // seats = await seatElementList; 
  seats.forEach(seat => {
    if (seat.status == 'booked') {
      seatElementList[seat.id - 1].style.backgroundColor = "red";
    }
    if (seat.status == 'empty') {
      seatElementList[seat.id - 1].style.cursor = 'pointer';
      seatElementList[seat.id - 1].addEventListener('click', () => {
        showModal(seat);
      });
    }
  });
}

fetchData();


function showModal(seat) {
  modal.style.display = 'flex';
  question.innerHTML = 'Bạn có muốn đặt ghế ' + seat.name + ' không?';
  ok.addEventListener('click', () => {
    clickOk(seat);
  });
}

function clickOk(seat) {
  console.log(seat.id);
  sendMessage(seat.id);
  modal.style.display = 'none';
}

function clickCancel() {
  modal.style.display = 'none';
}




