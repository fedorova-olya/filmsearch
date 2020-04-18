const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movie');
const urlPoster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;

    if (searchText.length === 0) {
        movie.trim().innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>'
        return
    }

    movie.innerHTML = '<div class="spinner"></div>';

    fetch('https://api.themoviedb.org/3/search/multi?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru&query=' + searchText)
        .then(function(value) {

            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json()

        })
        .then(function(output) {
            let inner = '';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';

            };

            output.results.forEach(function(item) {
                let nameItem = item.name || item.title;
                let mediaType = item.title ? 'movie' : 'tv';
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noPoster.png';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;


                inner += `
                <div class="col-12 col-md-6 col-xl-3 item">
                <img src="${poster}" alt="${nameItem}" ${dataInfo}>
                <h5>${nameItem}</h5></div>
                `;
            });
            movie.innerHTML = inner;

            addEventMedia();

        })
        .catch(function(err) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error ' + err)
        })
};

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(function(elem) {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    })
}

function showFullInfo() {
    let url = '';

    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru'
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru'
    } else {
        movie.innerHTML = `<h2 class="col-12 text-center text-danger">Произошла ошибка, повторите через несколько минут</h2>`
    }

    fetch(url)
        .then(function(value) {

            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json()

        })
        .then(function(output) {

            console.log(output)
            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.tittle}</h4>
            <div class="col-4"></div>
            <div class="col-8"></div>
            `;
        })
        .catch(function(err) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error ' + err)
        })
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru')
        .then(function(value) {

            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json()

        })
        .then(function(output) {
            let inner = '<h2 class="col-12 text-center text-info">Популярные за неделю</h2>';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';

            };

            output.results.forEach(function(item) {
                let nameItem = item.name || item.title;
                const poster = item.poster_path ? urlPoster + item.poster_path : './img/noPoster.png';
                let dataInfo = '';

                if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;

                inner += `
            <div class="col-12 col-md-6 col-xl-3 item">
            <img src="${poster}" alt="${nameItem}" ${dataInfo}>
            <h5>${nameItem}</h5></div>
            `;
            });
            movie.innerHTML = inner;

            addEventMedia();

        })
        .catch(function(err) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error ' + err)
        })
})