const token = sessionStorage.getItem('token');
const roles = sessionStorage.getItem('roles');
const email = sessionStorage.getItem('email');

// console.log(token);
// console.log(roles);
// console.log(email);

if (roles == null || !roles.includes("ROLE_ADMIN")) {
    window.location.href = 'http://127.0.0.1:5500/unAuthorization.html';
}

document.addEventListener('DOMContentLoaded', function () {
    var addShowtimeBtn = document.getElementById('addShowtimeBtn');
    var closeBtn = document.getElementsByClassName('close')[0];

    addShowtimeBtn.addEventListener('click', function () {
        var modal = document.getElementById('modal');
        var modalTitle = document.getElementById('modalTitle');
        var modalForm = document.getElementById('showtimeForm');

        modal.style.display = 'block';
        modalTitle.innerText = 'Thêm Showtime';
        modalForm.reset();

        modalForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var newShowtime = handleFormChange();

            insertShowtime(newShowtime);
            addShowtime(newShowtime);

            modal.style.display = 'none';
            modalForm.reset();
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when user clicks outside of it
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function addShowtime(showtime) {
        var table = document.getElementById('showtimesTable').getElementsByTagName('tbody')[0];
        var row = table.insertRow();

        var movieCell = row.insertCell(0);
        movieCell.innerHTML = showtime.filmDTO.name;

        var roomCell = row.insertCell(1);
        roomCell.innerHTML = showtime.roomDTO.name;

        var priceCell = row.insertCell(2);
        priceCell.innerHTML = showtime.price;

        var startTimeCell = row.insertCell(3);
        startTimeCell.innerHTML = showtime.startTime;

        var endTimeCell = row.insertCell(4);
        endTimeCell.innerHTML = showtime.endTime;

        var actionCell = row.insertCell(5);
        actionCell.innerHTML = '<button class="editBtn">Sửa</button> <button class="deleteBtn">Xóa</button>';

        // ấn nút sửa
        var editBtn = actionCell.getElementsByClassName('editBtn')[0];
        editBtn.addEventListener('click', function () {
            var modal = document.getElementById('modal');
            var modalTitle = document.getElementById('modalTitle');
            var modalForm = document.getElementById('showtimeForm');

            console.log(showtime);
            modal.style.display = 'block';
            modalTitle.innerText = 'Sửa Showtime';
            // hiện thị showtime hiện tại vào form::
            document.getElementById('movieName').value = showtime.filmDTO.name;
            document.getElementById('roomName').value = showtime.roomDTO.name;
            document.getElementById('price').value = showtime.price;
            document.getElementById('startTime').value = convertTime(showtime.startTime);
            document.getElementById('endTime').value = convertTime(showtime.endTime);

            modalForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var newShowtime = handleFormChange();
                var response = updateShowtime(showtime.id, newShowtime);
                response.then(r=>{
                    reloadParentIframe()
                })
            })

        });

        // Add event listener to delete button
        var deleteBtn = actionCell.getElementsByClassName('deleteBtn')[0];
        deleteBtn.addEventListener('click', function () {
            // Delete the row from the table
            table.deleteRow(row.rowIndex - 1);
            deleteShowtime(showtime.id);
        });
    }

    async function fetchShowtimes() {
        const response = await fetch('http://localhost:8080/api/v1/showtimes', {
            method: 'GET'
        });
        var showtimes = await response.json();
        showtimes.forEach(function (showtime) {
            addShowtime(showtime);
        });
    }
    // Populate the table with showtimes
    fetchShowtimes();

    // Submit form event listener

});

async function insertShowtime(showtime) {

    console.log(showtime);
    const response = await fetch('http://localhost:8080/api/v1/management/showtimes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(showtime)
    });

    const result = await response.json();
    return result;
}
// Populate the table with showtimes
// fetchShowtimes();

async function updateShowtime(id, newShowtime) {
    const response = await fetch('http://localhost:8080/api/v1/management/showtimes/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newShowtime)
    });

    return response;
}


async function loadRoomAndFilm() {
    var responseFilm = await fetch('http://localhost:8080/api/v1/films', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    var responseRoom = await fetch('http://localhost:8080/api/v1/rooms', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    const movies = await responseFilm.json();
    const rooms = await responseRoom.json();
    console.log(movies);
    console.log(rooms);

    // Lấy các phần tử <select> từ DOM
    var movieSelect = document.getElementById("movieName");
    var roomSelect = document.getElementById("roomName");

    // Thêm các tùy chọn phim vào combobox
    movies.forEach(function (movie) {
        var option = document.createElement("option");
        option.text = movie.name;
        movieSelect.add(option);
    });

    // Thêm các tùy chọn phòng vào combobox
    rooms.forEach(function (room) {
        var option = document.createElement("option");
        option.text = room.name;
        roomSelect.add(option);
    });

}
loadRoomAndFilm();

async function deleteShowtime(showtimeId) {
    var response = await fetch('http://localhost:8080/api/v1/management/showtimes/' + showtimeId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });
    const status = response.status;
    console.log(status);
}

function convertTime(iso8601String) {
    const dateTime = new Date(iso8601String);
    return dateTime.toISOString().slice(0, 16);
}

function handleFormChange() {
    var movieName = document.getElementById('movieName').value;
    var roomName = document.getElementById('roomName').value;
    var price = document.getElementById('price').value;
    var startTimeInput = document.getElementById("startTime");
    var endTimeInput = document.getElementById("endTime");

    // Chuyển đổi thời gian bắt đầu thành Instant
    var startTime = new Date(startTimeInput.value);
    startTime.setHours(startTime.getHours() + 7);
    var startTimeInstant = startTime.toISOString();

    var endTime = new Date(endTimeInput.value);
    endTime.setHours(endTime.getHours() + 7);
    var endTimeInstant = endTime.toISOString();

    var newShowtime = {
        filmDTO: { name: movieName },
        roomDTO: { name: roomName },
        price: price,
        startTime: startTimeInstant,
        endTime: endTimeInstant
    };
    return newShowtime;
}

function reloadParentIframe() {
    var parentIframe = parent.document.getElementById('myIframe');
    parentIframe.src = parentIframe.src;
}