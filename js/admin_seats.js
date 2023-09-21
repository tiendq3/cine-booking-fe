
// // JavaScript
// const modal = document.querySelector(".modal");
// const question = document.querySelector(".question");
// const ok = document.querySelector(".ok");
// const cancel = document.querySelector(".cancel");
// const content = document.querySelector(".content");
// const success = document.querySelector(".success");

// const token = localStorage.getItem('token');
// console.log(token);


// const seatsContainer = document.querySelector(".seats-container");

// cancel.addEventListener('click', clickCancel);

// var urlParams = new URLSearchParams(window.location.search);
// console.log(urlParams);
// var roomId = urlParams.get("id");
// console.log(roomId);

// const roomName = document.querySelector(".name-rooms");
// roomName.innerText = "Room " + roomId;


// async function fetchData() {
//   const response = await fetch('http://localhost:8080/rooms/' + roomId,{
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${token}`
//     }
//   });
//   const seats = await response.json();

//   console.log(seats);

//   seats.forEach(seat => {
//     const seatElement = document.createElement("div");
//     seatElement.classList.add("seat");
//     seatElement.innerText = seat.name;
//     seatsContainer.appendChild(seatElement);
//   });

//   const seatElementList = document.querySelectorAll('.seat');
//   seats.forEach(seat => {
//     if (seat.status == 'booked') {
//       seatElementList[seat.id - 1].style.backgroundColor = "red";
//     }
//     if (seat.status == 'empty') {
//       seatElementList[seat.id - 1].style.cursor = 'pointer';
//       seatElementList[seat.id - 1].addEventListener('click', () => {
//         showModal(seat);
//       });
//     }
//   });
// }

// fetchData();


// function showModal(seat) {
//   modal.style.display = 'flex';
//   question.innerHTML = 'Bạn có muốn đặt ghế ' + seat.name + ' không?';
//   ok.addEventListener('click', () => {
//     clickOk(seat);
//   });
// }

// function clickOk(seat) {
//   console.log(seat.id);
//   fetch(`http://localhost:8080/seats/${seat.id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => {
//       // Xử lý kết quả trả về nếu cần
//       console.log(response);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   content.style.display = 'none';
//   success.style.display = 'inline-block';


//   success.innerText = 'Bạn đã đặt thành công ghế ' + seat.name + ', vui lòng thanh toán trong vòng 10p';
// }

// function clickCancel() {
//   modal.style.display = 'none';
// }




