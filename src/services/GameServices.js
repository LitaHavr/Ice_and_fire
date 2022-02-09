


class GameServices {
    _apiBase='https://www.anapioficeandfire.com/api/characters'
    _pageBase= 2

    getResource = async (url) => {
        let res = await fetch (url);

        if(!res.ok){
            throw new Error (`Could not fetch ${url} , status ${res.status}`);

        }

        return await res.json()
    }

    getAllCharacters = async (page = this._pageBase) => {
       const res = await this.getResource(`${this._apiBase}?page=${page}&pageSize=9`);
       return res.map(this._transformCharacter);//в методе map будет приходить каждый отдельный объект по порядку и трансформироваться
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}/${id}`);
        return this._transformCharacter(res)
    }

    _transformCharacter = (res) => {
        return{
            id: res.url.split('/').pop(),
            name:res.name,
            title:res.titles.length > 1 ? res.titles :'There is no titles for this character',
            gender:res.gender.length > 1? res.gender :"We don't know gender of this character",
            culture:res.culture.length >1 ? res.culture:"We don't know culture of this character",
            born:res.born.length >1 ? res.born : "We don't know when this character was born",
            playedBy: res.playedBy[0].length>1 ? res.playedBy : "We don't know ",
            aliases:res.aliases
        }

    }
}
export default GameServices;