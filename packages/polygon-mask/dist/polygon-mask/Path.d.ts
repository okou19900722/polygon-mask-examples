import Shape from "./Shape";
export default class Path extends Shape<SVGPath> {
    _path: string;
    constructor(parent: any);
    path(v: any): this;
}
