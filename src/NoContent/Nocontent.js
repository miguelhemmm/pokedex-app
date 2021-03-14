import './Nocontent.css';

export default function Nocontent(props) {
	return(
        <div className="Nocontent" >
        <div className="pikachu-img"><div></div></div>
        <p>{props.noPokemonFound}</p>
        </div>
	)
}