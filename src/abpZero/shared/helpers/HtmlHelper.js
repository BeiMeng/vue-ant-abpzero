export class HtmlHelper {
    static encodeText(value) {
        let div = document.createElement('div');
        div[('textContent' in div) ? 'textContent' : 'innerText'] = value;
        return div.innerHTML;
    }
    static decodeText(value) {
        let div = document.createElement('div');
        div.innerHTML = value;
        return ('textContent' in div) ? div.textContent : div.innerText;
    }
    static encodeJson(jsonObject) {
        return JSON.parse(this.encodeText(JSON.stringify(jsonObject)));
    }
    static decodeJson(jsonObject) {
        return JSON.parse(this.decodeText(JSON.stringify(jsonObject)));
    }
}
