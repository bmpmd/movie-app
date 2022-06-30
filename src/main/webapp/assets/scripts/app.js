//toggle appearance of add modal 
//when add movie button is pressed, pop up "add-modal" modal

const startAddMovieButton = document.querySelector('header button ')
// this is a CSS query tag 
//it selects the button element within the header element 

//now grab modal 
const addMovieModal = document.getElementById('add-modal')
const backdrop = document.getElementById('backdrop');
//set anon function to a const 


//piggybacking off of node already captured in html 
//add-modal has children node
const cancelAddMovieButton = addMovieModal.querySelector('.btn--passive')
const confirmAddMovieButton = cancelAddMovieButton.nextElementSibling;//retrieve the sibling node 

const userInputs = document.querySelectorAll('input');// captures all input elements that are INPUTS in an ARRAY!!!
const movies = [];
const entryTextSection = document.getElementById('entry-text')// this is the id of the elemetnn that shows when no movies are here

const renderNewMovieElement = (id, title, imageUrl, rating) => {
//want to target the ul w id = 'movie-element'      
    const newMovieElement = document.createElement('li');
    newMovieElement.className = 'movie-element'// we want to apply a class bc we styled this class in the css file.

    newMovieElement.innerHTML = `
    <div class="movie-element__image">
        <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
        <h2>${title}</h2>
        <p>${rating}/5 stars</p>
    </div>
    `
    //append above element to our existing list 
    const listRoot = document.getElementById('movie-list')
    listRoot.append(newMovieElement);
}


//when do we update ui? 
//whenever we add a movie, so 
const updateUI = () => {
    //check the length of the arr 

    if (movies.length === 0) {
        entryTextSection.style.display = 'block'
    }
    else {
        entryTextSection.style.display = 'none'
    }
    //IF the array has elemnts in it, toggle the display of the movies
}

const toggleBackdropHandler = () => {
    backdrop.classList.toggle('visible')

}
const toggleMovieModal = () => {

    //toggle the class list in the css file 
    //change how the modal is styled 
    addMovieModal.classList.toggle('visible')
    toggleBackdropHandler();

}




const cancelAddMovieHandler = () => {
    //call toggle movie modal function above 
    toggleMovieModal();
    //clear input function can be called here 

}

const confirmAddMovieHandler = () => {
    //when confirmed, capture elements in form 
    const title = userInputs[0].value;
    const imageUrl = userInputs[1].value;
    const rating = userInputs[2].value;


    //add a little input validation 
    if (
        title.trim() === '' ||
        imageUrl.trim() === '' ||
        rating.trim() == '' ||
        +rating < 1 ||
        +rating > 5  // the + operator converts a string to a numeric val so we can apply math ops 

    ) {
        alert('please enter valid values (rating must be between 1-5)')
        return;
    }

    //build an object literal 
    const newMovie = {
        title: title,
        image: imageUrl,
        rating: rating

    }

    //here we could call some async method that JSON.stringify() the obj and send it over 
    sendMovieToServer(newMovie); // POST it to the server 
    
    //push the new movie obj to the array which will be displayed  
    movies.push(newMovie)
    console.log(movies)

    toggleMovieModal();// close ouyt the modal after submission
    clearMovieInput();//and clear movie input 

    //and finally, show movie on ui 
    renderNewMovieElement(newMovie.id, newMovie.title, newMovie.image, newMovie.rating);// render a new movie element
    updateUI();// and lastly  update ui after each submission
    

}

const clearMovieInput = () => {
    // loop over all the userInput elements of the userInput array and clear it 
    for (let ipnut of userInputs) {
        ipnut.value = '';
    }


}

const sendMovieToServer = (newMovie) => {
    console.log('sendMovieToServerInvoked')

    fetch(`http://localhost:8080/movie-app/addmovie`, {
        method: "POST",
        //this must match with whats in java
        body: JSON.stringify({//transforms it into a josn string that iwll be parsed by out reqhelper into a java obj 
            title: newMovie.title,
            imageUrl: newMovie.imageUrl,
            rating: newMovie.rating
        }),
        headers : {
            "Content-type": "application/json; charset=UTF-8",

        },

    })
    //convert the response from server into json 
    .then((response)=> response.json())

    //display results to console
    .then((json)=> console.log(json));

    //incorporate this each time a movie is added...
        
}
//addd event lsitener to button 
//clicking out of backdrop will toggle modal and backdrop
startAddMovieButton.addEventListener('click', toggleMovieModal)
backdrop.addEventListener('click', toggleMovieModal)
cancelAddMovieButton.addEventListener('click', cancelAddMovieHandler)
confirmAddMovieButton.addEventListener('click', confirmAddMovieHandler)