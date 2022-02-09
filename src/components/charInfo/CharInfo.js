import {Component} from 'react';
import PropTypes from 'prop-types';
import './charInfo.scss';
import Spiner from "../spiner/Spiner";
import Error from '../error/Error';
import Skeleton from "../skeleton/Skeleton";
import GameServices from "../../services/GameServices";


class CharInfo extends Component {


    state = {
        char: null,
        loading: false,
        error: false

    }

    gameService = new GameServices();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading();
        this.gameService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)

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
            error: true
        })
    }


    render() {
        const {char, loading, error} = this.state;
        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorFlag = error ? <Error/> : null;
        const spiner = loading ? <Spiner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorFlag}
                {spiner}
                {content}
            </div>
        )
    }

}

const View = ({char}) => {
    const {name, title, gender, culture, born, aliases} = char;
    return (
        <>
            <div className="char__basics">

                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href="#" className="button button__main">
                            <div className="inner">books</div>
                        </a>
                        <a href="#" className="button button__secondary">
                            <div className="inner">tvSeries</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{title}</div>
            <div className="char__aliases ">Aliases:</div>
            <ul className="char__aliases-list">

                {aliases.map((item, i) => {
                    if(item.length <1){
                        return (
                            <li key={i} className="char__aliases-item">
                               No alliases for this character
                            </li>
                        )
                    }
                    return (
                        <li key={i} className="char__aliases-item">
                            {item}
                        </li>
                    )
                })
                }


            </ul>
        </>
    )
}
CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;