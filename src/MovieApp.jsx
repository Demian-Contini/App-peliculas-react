import { useState } from "react";
import "./MovieApp.css";

// URL de una imagen placeholder (por si falta el póster)
const PLACEHOLDER_IMG = 'https://via.placeholder.com/500x750?text=Poster+No+Disponible';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/';

export const MovieApp = () => {
    
    // 1. Estados iniciales
    const [search, setSearch] = useState('')
    const [movieList, setMovieList] = useState([])
    const [loading, setLoading] = useState(false) // Estado de carga (UX)
    const [searchPerformed, setSearchPerformed] = useState(false); // Bandera para saber si ya se buscó

    const urlBase = 'https://api.themoviedb.org/3/search/movie'
    const API_KEY = 'acbf77ebf714e03a944f407e7141db42'

    // 2. Manejadores
    const handleInputChange = ({target}) => {
        setSearch(target.value)
    }
        
    const handleSubmit = (event) =>{
        event.preventDefault()
        if (search.trim() === '') return // Evita búsquedas vacías
        fetchMovies()
    }

    // 3. Función de Fetch mejorada
    const fetchMovies = async () => {
        setLoading(true) // Iniciar estado de carga
        setSearchPerformed(true); // Marcar que se ha iniciado una búsqueda

        try {
            const response = await fetch(`${urlBase}?query=${search}&api_key=${API_KEY}&language=es-ES`)
            const data = await response.json()
            
            setMovieList(data.results)

        } catch (error) {
            console.error('Ha ocurrido el siguiente error: ', error)
            setMovieList([]) // Limpiar lista en caso de error
        } finally {
            setLoading(false) // Finalizar estado de carga
        }
    }

    // 4. Componente a renderizar
    return (
        <div className="container">

            <h1 className="title">Buscador de Peliculas</h1>

            {/* Formulario de Búsqueda */}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Escribe una película..." 
                    value={search}
                    onChange={handleInputChange}
                />
                <button className="search-button">Buscar</button>
            </form>
            
            {/* 5. Renderizado Condicional */}
            
            {/* Mensaje de Carga */}
            {loading && 
                <h2 className="loading-message">Cargando películas...</h2>
            }

            {/* Mostrar resultados si no está cargando */}
            {!loading && searchPerformed && movieList.length > 0 &&
                <div className='movie-list'> 
                    {movieList.map(movie => (
                        <div key={movie.id} className='movie-card'>
                            
                            {/* Manejo de póster faltante (Mejora UX) */}
                            <img 
                                src={movie.poster_path 
                                    ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                                    : PLACEHOLDER_IMG
                                } 
                                alt={movie.title} 
                            />
                            
                            <div className="card-info">
                                <h2>{movie.title}</h2>
                                {/* Recorte de la descripción (Mejora UX) */}
                                <p>{movie.overview.length > 150
                                    ? movie.overview.substring(0, 150) + '...'
                                    : movie.overview
                                }</p>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {/* Mensaje si no hay resultados */}
            {!loading && searchPerformed && movieList.length === 0 &&
                <p className="no-results">
                    No se encontraron resultados para **"{search}"**. Intenta con otra búsqueda.
                </p>
            }

        </div>
    )
}