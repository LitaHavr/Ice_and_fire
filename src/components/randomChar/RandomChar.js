import {Component} from 'react';
import './randomChar.scss';
import Error from '../error/Error'
import logo from '../../img/logo.png'
import GameServices from "../../services/GameServices";
import Spiner from "../spiner/Spiner";

class RandomChar extends Component {


    state = {
        char: {},
        loading: true,
        error: false

    }

    gameService = new GameServices();

    componentDidMount() {
        this.updateChar();
    }

    onCharLoaded = (char) => {
        this.setState({
            char: char,      // в стейт записывается объект с персонажем
            loading: false   // loading переключается в false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error:true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (2100 - 1) + 1);
        this.onCharLoading();
        this.gameService
            .getCharacter(id) //прихлдит нужный нам объект в нужном формате
            .then(this.onCharLoaded)// так как мы используем промисы и у нас стоит просто ссылка на функцию то аргумент который пришел в then автоматически будет подставляться в this.onCharLoaded
            .catch(this.onError);
    }


    render() {
        const {char, loading,error} = this.state;
        const errorFlag = error ? <Error/> : null;
        const spiner = loading ? <Spiner /> : null;
        const content = !(loading || error) ? <View char ={char}/> : null


         //как пропсы мы передали компоненту View объект char
        return (
            <div className="randomchar">
                {errorFlag}
                {spiner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>

                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar}  className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={logo} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => { //char объект со всеми данными о персонаже
    const {name, title, gender, culture, born} = char
    return (
        <div className="randomchar__block">

            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">Title:<br/>{title}</p>
                <p className="randomchar__descr">Gender: {gender}</p>
                <p className="randomchar__descr">Culture: {culture}</p>
                <p className="randomchar__descr">Born: {born}</p>

            </div>
        </div>
    )
}

export default RandomChar;