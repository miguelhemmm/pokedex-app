import { useState, useEffect } from "react"
import { from as fromPromise } from 'rxjs';
import {  retry } from 'rxjs/operators';
import Pokecard from "../Pokecard/Pokecard";
import { sortPokemon, paginate, filterPokemon, filterBySearch } from '../shared/helper';
import './Pokedex.css'
import { FormCheck, Modal } from 'react-bootstrap';
import Pagination from "../Pagination/Pagination";
import Nocontent from "../NoContent/Nocontent";





export default function PokedexHooks() {
    const [currentPage, setCurrent] = useState(0);
    const [paginatedPokemon, setPagPokemon] = useState([]);
    const [allPokemon, setAll] = useState([]);
    const [searchValue, setFilter] = useState('');
    const [noPokemonFound, setError] = useState(false);
    const [searchParameter, setParameter] = useState(false);
    const [smShow, setSmShow] = useState(false);
    const [pokemonInfo, setPokemonInfo] = useState('');

    useEffect (() => {
        fromPromise(
            fetch('https://raw.githubusercontent.com/robert-z/simple-pokemon-json-api/master/data/pokemon.json')
            .then(response => response.json())
          ).subscribe(data => {
            setAll(data)
            setPagPokemon(filterPokemon(data, paginate(data, 24)[currentPage]))
          },
          err => retry(3))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])


    const setCurrentPage = (e) => {
        const target = e.target.classList[2];
        if (target === 'prev') setCurrent(currentPage - 1)
        if (target === 'next') setCurrent(currentPage + 1)
        if (target === 'bwd') setCurrent(0)
        if (target === 'fwd') setCurrent(33)
    }

    const sortList = (e) => {
        const target = e.target.classList[2];
        if (target === 'order') setPagPokemon(filterPokemon(allPokemon, paginate(allPokemon, 24)[currentPage]));
        if (target === 'sort' ) setPagPokemon(sortPokemon(paginatedPokemon));
    }

    const handleChange = (e) => {
        const target = e.target.value
        setFilter(target)
        if (e.key === 'Enter') {
             onFilter()
        }
    }

    const onFilter = (e) => {
        const filteredPokemon = filterBySearch(allPokemon, searchValue, searchParameter);
        setError('');
        setCurrent(0);

        if (filteredPokemon?.length) setPagPokemon(filteredPokemon);
        if (!filteredPokemon?.length) setError('No Pokemon were found!')
    }

    const handleSwitch = (e) => {
        setParameter(e.target.checked)
    }

    const onClickCard = (e) => {
        setPokemonInfo(e.target.alt)
        setSmShow(true)
    }

    let pokemon = [];
    const displayPokemon = paginatedPokemon?.length && !noPokemonFound;
    if (paginatedPokemon && paginatedPokemon.length) {
    for (let i = 0; i<paginatedPokemon.length; i++) {
        pokemon.push(
        <div key={paginatedPokemon[i]?.num}>
            <Pokecard
          num={paginatedPokemon[i]?.num}
          name={paginatedPokemon[i]?.name}
          type={paginatedPokemon[i]?.variations[0].types}
          specie={paginatedPokemon[i]?.variations[0].specie}
          data={paginatedPokemon[i]?.variations}
          onClickCard={onClickCard}/>
        </div>)
      }

    }
    return (

    <div className="Pokedex">
        <div className="Pokedex-buttons">
            <div className="sorting-buttons">
                {displayPokemon? <button className="btn btn-primary sort" onClick={sortList}>Sort</button> : ''}
                {displayPokemon? <button disabled={searchValue} className="btn btn-primary order" onClick={sortList}>Order</button> : ''}
            </div>
            <div className="search-bar">
                <div className="d-flex search-bar">
                    <input className="form-control me-2" type="search" placeholder="Search Pokemon" aria-label="Search" onChange={handleChange} onKeyDown={handleChange}/>
                    <button className="btn btn-primary" type="button" onClick={onFilter}>Search</button>
                </div>
                <FormCheck
                type="switch"
                id="custom-switch"
                onChange={handleSwitch}
                label={`Search By: ${searchParameter ? 'Type' : 'Name' }`}/>
            </div>
        </div>
            <div className="Pokedex-cards">
                {displayPokemon ? pokemon : ''}
                {!paginatedPokemon?.length ? <div className="lds-circle"><div></div></div> : ''}
                {noPokemonFound ? <Nocontent noPokemonFound={noPokemonFound}/> : ''}
            </div>
            {displayPokemon ? <Pagination
            noPokemonFound={noPokemonFound}
            currentPage={currentPage}
            paginatedPokemon={paginatedPokemon}
            setCurrentPage={setCurrentPage}/> : ''}
      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm">
        <Modal.Body>{pokemonInfo}</Modal.Body>
      </Modal>
    </div>
    )
}
