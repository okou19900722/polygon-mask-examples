import Shape from "./Shape";
export default class Rect extends Shape<SVGJSRect> {
    _size: [number, number];
    constructor(parent: any);
    size(w: any, h: any): this;
}
