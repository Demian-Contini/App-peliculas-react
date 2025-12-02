  import { useState } from "react";
  import "./MovieApp.css";

  export const MovieApp = () => {
    
    const [search, setSearch] = useState('')
    const [movieList, setMovieList] = useState([])

  const urlBase = 'https://api.themoviedb.org/3/search/movie'
  const API_KEY = 'acbf77ebf714e03a944f407e7141db42'

  const handleInputChange = ({target}) => {
    setSearch(target.value)
  }
    
  const handleSubmit = (event) =>{
  event.preventDefault()
  fetchMovies()
  }

  const fetchMovies = async () => {

    try {
      
      const response = await fetch(`${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`)
      const data = await response.json()
      console.log(data)

      setMovieList(data.results)

    } catch (error) {
      console.error('Ah ocurrido el siguiente error: ', error)
    }
  }

  return (
      <div className = "container">

          <h1 className="title">Buscador de Peliculas</h1>


          <form onSubmit = {handleSubmit}>
          <input 
          type="text" 
          placeholder = "Escribi una pelicula" 
          value = {search}
          onChange = {handleInputChange}
          />

          <button className="search-button">Buscar</button>
          </form>
          
        { movieList &&
            <div className = 'movie-list'> 
        
            {movieList.map(movie => (

              <div key={movie.id} className='movie-card'>
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
                </div>

            ))}
        
        </div> 
        }
      </div>
    )
  }
