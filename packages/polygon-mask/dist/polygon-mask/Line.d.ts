import Shape from "./Shape";
export default class Line extends Shape<SVGLine> {
    _start: [number, number];
    _end: [number, number];
    constructor(parent: any);
    _resize(): void;
    line(start: any, end: any): this;
}
