import './Pokecard.css';
import { typeMap } from '../shared/helper';

const POKE_API = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'

export default function Pokecard (props) {
      return  (<div className="pokecard">
                <p className="pokecard-title" >{`#${props.num} ${props.name}`}</p>
                <img
                onClick={props.onClickCard}
                alt={props?.data[0].description}
                className="pokecard-img"
                src={`${POKE_API}${props.num}.png`}/>
                <div className="pokecard-text">
                <p style={{color: typeMap(props?.type[0])}}>{props?.type[0]}</p>
                <p style={{color: typeMap(props?.type[1])}}>{props.type?.length > 1 ? `${props?.type[1]}` : '' }</p>
            </div>
        </div>)
}

