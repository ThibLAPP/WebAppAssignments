let text_area = document.getElementById('area');
text_area.innerHTML = '';

let score = 0;
let movies = [];
let persons = [];

function StartGame() {
  let start_id = Math.floor(Math.random() * 10000);
  //let start_id =  299534;
  let start_url = "https://api.themoviedb.org/3/movie/" + start_id + "?api_key=58f802e1c4ab785df2171fb8421447ba";
  fetch(start_url).then(res => {
    return res.json();
  }).then(data => {
    AddFirstMovieTitle(data);
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error);
  });
}

// https://image.tmdb.org/t/p/w500/8kNruSfhk5IoE4eZOc4UpvDn6tq.jpg

function AddFirstMovieTitle(data){
  if(data.original_title != null){
    text_area.innerHTML += '<div><h2><a>' + data.original_title + '</a></h2>' + 
      '<p>' + data.release_date + '</p>' +
      '<img src=https://image.tmdb.org/t/p/w500' + data.poster_path + '></div>';
    let start_movie_name = data.original_title;
    let start_movie_id = data.id;
    movies.push(start_movie_id);
    let play_btn = document.getElementById('play_btn');
    play_btn.disabled = true;
    AskForPoeple();
  }
  else{
    StartGame();
  }
}

function AskForPoeple() {
  text_area.innerHTML += '<hr><div>' +
    '<h3>Your score : ' + score + '</h3>' +
    '<input type="search" id="actor_search' + score + '" name="q">' +
    '<button id="actor_search_btn' + score + '" onclick="SearchActor()">actor</button>' +
    ' or <input type="search" id="director_search' + score + '" name="q">' +
    '<button id="director_search_btn' + score + '" onclick="SearchDirector()">director</button><br>' +
    '</div>';
}

//////////////////////////////////////////////////////////////////////
//actors
//////////////////////////////////////////////////////////////////////

function SearchActor() {
  console.log('SearchActor')
  let actor_name = document.getElementById('actor_search' + score).value;
  let actor_url = 'http://api.themoviedb.org/3/search/person?api_key=58f802e1c4ab785df2171fb8421447ba&query=' + actor_name;
  fetch(actor_url).then(res => {
    return res.json();
  }).then(data => {
    ActorByName(data);
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error);
  });
}

function ActorByName(data) {
  let gotit = false;
  for(let i = 0; i < data.results.length; i++){
    let actor_id = data.results[i].id;
    let notexist = true;
    for(let z = 0; z < persons.length; z++) {
      if(persons[z] == actor_id) {
        notexist = false;
      }
    }
    if(notexist) {
      let name = data.results[i].name;
      let actor_movies_url = 'http://api.themoviedb.org/3/person/' + actor_id + '/movie_credits?api_key=58f802e1c4ab785df2171fb8421447ba';
      let actor_def = '<div><h2><a>' + data.results[i].name + '</a></h2>' +
        '<img src=https://image.tmdb.org/t/p/w500' + data.results[i].profile_path + '></div>'
      fetch(actor_movies_url).then(res => {
        return res.json();
      }).then(data => {
        for(var j = 0; j < data.cast.length; j++) {
          if(data.cast[j].id == movies[movies.length - 1]) {
            text_area.innerHTML += actor_def;
            persons.push(actor_id);
            let actor_search_btn = document.getElementById('actor_search_btn' + score);
            actor_search_btn.disabled = true;
            let director_search_btn = document.getElementById('director_search_btn' + score);
            director_search_btn.disabled = true;
            score = score + 1;
            AskForMovie();
          }
          if(gotit) {
            j = 1000000000000000000000000000000000000000000000000000;
          }
        }
        //ActorById(data, actor_def, actor_id);
      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error);
      });
      if(gotit) {
        i = 1000000000000000000000000000000000000000000000000000;
      }
    }
    else {
      text_area.innerHTML += "You already selected this person...<br>";
    }
  }
}

//////////////////////////////////////////////////////////////////////
//actors
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//directors
//////////////////////////////////////////////////////////////////////

function SearchDirector() {
  let director_name = document.getElementById('director_search' + score).value;
  let director_url = 'http://api.themoviedb.org/3/search/person?api_key=58f802e1c4ab785df2171fb8421447ba&query=' + director_name;
  fetch(director_url).then(res => {
    return res.json();
  }).then(data => {
    DirectorByName(data);
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error);
  });
}

function DirectorByName(data) {
  let gotit = false;
  for(let i = 0; i < data.results.length; i++){
    let director_id = data.results[i].id;
    let notexist = true;
    for(let z = 0; z < persons.length; z++) {
      if(persons[z] == director_id) {
        notexist = false;
      }
    }
    if(notexist) {
      let name = data.results[i].name;
      let director_movies_url = 'http://api.themoviedb.org/3/person/' + director_id + '/movie_credits?api_key=58f802e1c4ab785df2171fb8421447ba';
      let director_def = '<div><h2><a>' + data.results[i].name + '</a></h2>' +
        '<img src=https://image.tmdb.org/t/p/w500' + data.results[i].profile_path + '></div>'
      fetch(director_movies_url).then(res => {
        return res.json();
      }).then(data => {
        for(var j = 0; j < data.crew.length; j++) {
          if(data.crew[j].id == movies[movies.length - 1]) {
            text_area.innerHTML += director_def;
            persons.push(director_id);
            let actor_search_btn = document.getElementById('actor_search_btn' + score);
            actor_search_btn.disabled = true;
            let director_search_btn = document.getElementById('director_search_btn' + score);
            director_search_btn.disabled = true;
            score = score + 1;
            gotit = true;
            AskForMovie();
          }
          if(gotit) {
            j = 1000000000000000000000000000000000000000000000000000;
          }
        }
        //DirectorById(data, director_def, director_id, gotit);
      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error);
      });
      if(gotit) {
        console.log('coucou')
        i = 1000000000000000000000000000000000000000000000000000;
      }
    }
    else {
      text_area.innerHTML += "You already selected this person...<br>";
    }
  }
}

//////////////////////////////////////////////////////////////////////
//actors
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//movies
//////////////////////////////////////////////////////////////////////

function AskForMovie() {
  console.log("movies: " + movies);
  console.log("persons: " + persons);
  text_area.innerHTML += '<hr><div>' + 
    '<h3>Your score : ' + score + '</h3>' +
    '<input type="search" id="movie_search' + score + '" name="q">' +
    '<button id="movie_search_btn' + score + '" onclick="SearchMovie()">movie</button>' +
    '</div>';
}

function SearchMovie() {
  let user_movie_name = document.getElementById('movie_search' + score).value;
  let movie_url = "http://api.themoviedb.org/3/search/movie?api_key=58f802e1c4ab785df2171fb8421447ba&query=" + user_movie_name;
  fetch(movie_url).then(res => {
    return res.json();
  }).then(data => {
    MovieByName(data);
  }).catch(error => {
    console.log('Something went wrong.');
    console.log(error);
  });
}

async function MovieByName(data) {
  for(let i = 0; i < data.results.length; i++){
    let old_score = score;
    let movie_id = data.results[i].id;
    let notexist = true;
    for(let z = 0; z < movies.length; z++) {
      if(movies[z] == movie_id) {
        notexist = false;
      }
    }
    if(notexist) {
      let name = data.results[i].original_title;
      let movie_id_url = 'http://api.themoviedb.org/3/movie/' + movie_id + '/casts?api_key=58f802e1c4ab785df2171fb8421447ba';
      let movie_def = '<div><h2><a>' + data.results[i].original_title + '</a></h2>' +
        '<img src=https://image.tmdb.org/t/p/w500' + data.results[i].poster_path + '></div>'
      await fetch(movie_id_url).then(res => {
        return res.json();
      }).then(data => {
        for(let j = 0; j < data.cast.length; j++) {
          if(data.cast[j].id == persons[persons.length - 1]) {
            text_area.innerHTML += movie_def;
            movies.push(movie_id);
            let movie_search_btn = document.getElementById('movie_search_btn' + score);
            movie_search_btn.disabled = true;
            score = score + 1;
            AskForPoeple();
          }
          if(old_score != score) {
            j = 1000000000000000;
          }
        }
        if(old_score != score) {
          for(let j = 0; j < data.crew.length; j++) {
          if(data.crew[j].id == persons[persons.length - 1]) {
            text_area.innerHTML += movie_def;
            movies.push(movie_id);
            let movie_search_btn = document.getElementById('movie_search_btn' + score);
            movie_search_btn.disabled = true;
            score = score + 1;
            AskForPoeple();
          }
          if(old_score != score) {
            j = 1000000000000000;
          }
        }
        }
      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error);
      });
      if(old_score != score) {
        i = 1000000000000000;
      }
    }
    else {
      text_area.innerHTML += "You already selected this movie...<br>";
    }
  }
}