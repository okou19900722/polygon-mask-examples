import Shape from "./Shape";
export default class Polygon extends Shape<SVGPolygon> {
    _vertexes: string;
    constructor(parent: any, close: any);
    _resize(): void;
    vertexes(vs: any): this;
}
