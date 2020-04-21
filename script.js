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
};

function showFullInfo() {
    let url = '';

    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/ ' + this.dataset.id + '?api_key=e7ce9e411b6abb502d53016fcd98db24&language=ru';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=e7ce9e411b6abb502d53016fcd98db24&language=ru';
    } else {
        movie.innerHTML = '<h5 class="col-12 text-center text-info">Ошибка...</h5>';
    }

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json();
        })
        .then((outputResult) => {
                movie.innerHTML = `
            <h5 class="col-12 text-center text-info">${outputResult.name || outputResult.title}</h5>
            
            <div class="col-4">
                <img src='${urlPoster + outputResult.poster_path}' alt='${outputResult.name || outputResult.title}'>
                ${(outputResult.homepage) ? `<p class='text-center'> <a href="${outputResult.homepage}" target="_blank"> Официальная страница</a> </p>` : ''}
                ${(outputResult.imdb_id) ? `<p class='text-center'> <a href="https://imdb.com/title/${outputResult.imdb_id}" target="_blank"> Страница IMDB</a> </p>` : ''}
            </div>
            <div class="col-8">
                <p> Рейтинг: ${outputResult.vote_average}</p>
                <p> Статус: ${outputResult.status}</p>
                <p> Премьера: ${outputResult.first_air_date || outputResult.release_date}</p>
                ${(outputResult.last_episode_to_air) ? `<p>Сезонов: ${outputResult.number_of_seasons}, серий: ${outputResult.last_episode_to_air.episode_number}</p>` : ''}
                <p> Описание: ${outputResult.overview}</p>
                <br>
                <div class="youtube"></div>
            </div>
            `;
            getVideo(this.dataset.type, this.dataset.id);
        })
        .catch((reason) => {
            movie.innerHTML = 'УПС... Что-то пошло не так.';
            console.error('error: ' + reason.status);
        });
}



document.addEventListener('DOMContentLoaded', function () {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru')
        .then(function (value) {

            if (value.status !== 200) {
                return Promise.reject(value);
            }
            return value.json()

        })
        .then(function (output) {
            let inner = '<h2 class="col-12 text-center text-info">Популярные за неделю</h2>';

            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';

            };

            output.results.forEach(function (item) {
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
        .catch(function (err) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.error('error ' + err)
    });
    
});

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru`)
    .then((value) => {

        if (value.status !== 200) {
            return Promise.reject(value);
        }
        return value.json()

    })
    .then((output) => {
        console.log(output)
        let videoFrame = `<h5 class="text-info">Треллер</h5>`
        if(output.results.length === 0) {
            videoFrame = `<p>К сожалению видео отсувствует</p>`
        };
        output.results.forEach((item) => {
            videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        });

        youtube.innerHTML = videoFrame;

    })
    .catch((err) => {
        youtube.innerHTML = 'Видео отсутствует';
        console.error('error ' + err)
    })

}