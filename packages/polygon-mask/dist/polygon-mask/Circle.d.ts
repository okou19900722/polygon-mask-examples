import Shape from "./Shape";
export default class Circle extends Shape<SVGCircle> {
    _radius: number;
    constructor(parent: any);
    radius(radius: any): this;
}
