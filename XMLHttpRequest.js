//ЗАПРОС XMLhttpRequect
function requestApi(url) {

    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.addEventListener('readystatechange', () => {

        if (request.readyState != 4) {
            movie.innerHTML = 'Загрузка';
            return;
        }
        if (request.status != 200) {
            movie.innerHTML = 'Упс, что-то пошло не так';
            console.log('error' + request.status);
            return
        }

        const output = JSON.parse(request.responseText)
        let inner = '';
        output.results.forEach(function(item) {
            let nameItem = item.name || item.title;
            inner += '<div class="col-12 col-md-4 col-xl-3">' + nameItem + '</div>';
        });
        movie.innerHTML = inner;
    });
}

//ПРОМИСЫ


function apiSearch(event) {
    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    const server = 'https://api.themoviedb.org/3/search/multi?api_key=9bbf2aadf327c17b26d2c35440604b5d&language=ru&query=' + searchText;
    movie.innerHTML = 'Загрузка...';

    requestApi(server)
        //Обработка ответа и ошибок сервера
        .then(function(result) {
            const output = JSON.parse(result)
            console.log(output)
            let inner = '';
            output.results.forEach(function(item) {
                let nameItem = item.name || item.title;
                inner += '<div class="col-12 col-md-4 col-xl-3">' + nameItem + '</div>';
            });
            movie.innerHTML = inner;
        })
        .catch(function(err) {
            movie.innerHTML = 'Упс, что-то пошло не так!';
            console.log('error ' + err.status)
        });

};

searchForm.addEventListener('submit', apiSearch);


function requestApi(url) {
    return new Promise(function(resolve, reject) {
        const request = new XMLHttpRequest();

        request.open('GET', url);
        request.addEventListener('load', function() {
            if (request.status !== 200) {
                reject({ status: request.status })
                return;
            }

            resolve(request.response);

        });
        request.addEventListener('error', function() {
            reject({ status: request.status })
        });
        request.send();
    });

}