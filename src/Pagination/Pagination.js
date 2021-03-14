


export default function Pagination (props) {
        const disablePrev = props.currentPage < 1 || (props.paginatedPokemon.length <= 23 && props.currentPage !== 33);
        const disableNext = props.currentPage > 32 || props.paginatedPokemon.length <= 23 || props.paginatedPokemon.length > 24
	return(
         <div className="Pagination">
        <button disabled={disablePrev}  className="btn btn-primary bwd" onClick={props.setCurrentPage} >««</button>
        <button disabled={disablePrev}  className="btn btn-primary prev" onClick={props.setCurrentPage} >Previous</button>
        <button disabled  className="btn btn-primary" >{props.currentPage}</button>
        <button disabled={disableNext} className="btn btn-primary next" onClick={props.setCurrentPage} >Next</button>
        <button disabled={disableNext} className="btn btn-primary fwd" onClick={props.setCurrentPage} >»»</button>
        </div>
	)
}