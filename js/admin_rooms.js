const roomsContainer = document.querySelector(".rooms-container");
const token = localStorage.getItem('token');
console.log(token);


async function fetchData() {
  const response = await fetch('http://localhost:8080/rooms/all',{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const rooms = await response.json();
  console.log(rooms);

  rooms.forEach(room => {
    const roomElement = document.createElement("div");
    roomElement.classList.add("room");
    roomElement.innerHTML = "<a href='admin_seats.html?id=" + room.id + "'>" + room.name + "</a>";
    roomsContainer.appendChild(roomElement);
  });
}

fetchData();
