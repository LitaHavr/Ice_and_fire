import {Component} from 'react';
import PropTypes from 'prop-types';
import './charList.scss';
import GameServices from "../../services/GameServices";
import Spiner from "../spiner/Spiner";
import Error from '../error/Error'


class CharList extends Component {


    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,   //этот лоадинг только для пагинации
        page: 2,
        charEnded:false
    }

    gameService = new GameServices();

    componentDidMount() {
        this.onRequest() //так как логика была одинаковая то мы просто вызываем onRequest без аргумента,будет использован по умолчанию

    }


    onRequest = (page) => {
        this.onCharListLoadinggg();
        this.gameService
            .getAllCharacters(page)
            .then(this.onCharListLoaded)// сбда прийдет новый массив эллементов newCharList из .getAllCharacters(page)
            .catch(this.onError)

    }

    onCharListLoadinggg = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({charList, page}) => ({   //charList из пред стейта
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            page: page + 1,
            charEnded:ended

        }))
    }


    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }


    itemRefs=[];

    setRef= (ref)=>{
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    updateCharList = (arr) => {

        const items = arr.map((item,i) => {

            return (

                <li
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <div className="char__name"> Name: {item.name} </div>
                    <br/>
                    <div className="char__name"> Played By : {item.playedBy}</div>

                </li>
            )
        });
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    render() {
        const {charList, loading, error,page,newItemLoading,charEnded} = this.state;
        const items = this.updateCharList(charList);

        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spiner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                    onClick={() => this.onRequest(page)}
                    className="button button__main button__long"
                    disabled={newItemLoading}
                style={{'display':charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;