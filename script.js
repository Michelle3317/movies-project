document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = "4b498373"; "http://www.omdbapi.com/?i=tt3896198&apikey=4b498373"
    const API_URL = "https://www.omdbapi.com/";

    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const movieList = document.getElementById("movie-list");
    const sortSelect = document.getElementById("sort-select");

    let moviesData = []; 

   
    fetchMovies("harry potter");

    searchButton.addEventListener("click", () => {
        fetchMovies(searchInput.value.trim());
    });

    sortSelect.addEventListener("change", () => {
        displayMovies();
    });

    async function fetchMovies(query) {
        if (!query) return;

        try {
            const response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${query}`);
            const data = await response.json();

            if (data.Response === "True") {
                moviesData = await fetchMovieDetails(data.Search);
                displayMovies();
            } else {
                movieList.innerHTML = `<p style="color:red;">No movies found.</p>`;
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            movieList.innerHTML = `<p style="color:red;">Failed to load movies.</p>`;
        }
    }

    async function fetchMovieDetails(movies) {
        const detailedMovies = await Promise.all(movies.map(async (movie) => {
            const response = await fetch(`${API_URL}?apikey=${API_KEY}&i=${movie.imdbID}`);
            return await response.json();
        }));
        return detailedMovies;
    }

    function displayMovies() {
        movieList.innerHTML = "";

        let sortedMovies = [...moviesData];

        if (sortSelect.value === "newest") {
            sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        } else if (sortSelect.value === "oldest") {
            sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        } else if (sortSelect.value === "best") {
            sortedMovies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        }

        sortedMovies.forEach(movie => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie");
            movieItem.innerHTML = `
                <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
                <h3>${movie.Title} (${movie.Year})</h3>
                <p>IMDb Rating: ⭐ ${movie.imdbRating || "N/A"}</p>
            `;
            movieList.appendChild(movieItem);
        });
    }
});

