async function fetchData() {
    const response = await fetch('http://localhost:8080/api/v1/films/upcoming', {
        method: 'GET'
    });
    const movies = await response.json();
    console.log(movies);

    // Lặp qua mảng phim và tạo các phần tử HTML tương ứng
    var moviesList = document.getElementById('movies-list');

    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];

        // Tạo phần tử div chứa thông tin phim
        var movieElement = document.createElement('a');
        movieElement.className = 'movie';

        // Tạo phần tử hình ảnh phim
        var imageElement = document.createElement('img');
        imageElement.src = '/images/' + movie.fileDTOS[0].name;

        // Tạo phần tử tên phim
        var titleElement = document.createElement('div');
        titleElement.className = 'name';
        titleElement.textContent = movie.name;

        // Gắn hình ảnh và tên phim vào phần tử chứa thông tin phim
        movieElement.appendChild(imageElement);
        movieElement.appendChild(titleElement);

        // Gắn phần tử chứa thông tin phim vào danh sách phim
        moviesList.appendChild(movieElement);
    }
    redirectFilmDetail(movies);
}

fetchData();

function redirectFilmDetail(movies) {
    const movieList = document.querySelectorAll('.movie');
    for (var i = 0; i < movies.length; i++) {
        var movie = movies[i];
        movieList[i].style.textDecoration = 'none';

        var linkFilmDetail = 'uFilmDetail.html?id=' + movie.id;
        console.log(linkFilmDetail);
        movieList[i].setAttribute('href', linkFilmDetail);
    }
}



