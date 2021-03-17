export default class Shape<S extends SVGShape> {
    parent: SVGShape;
    children: Shape<SVGShape>[];
    isRoot: boolean;
    _position: [number, number];
    _rotate: number;
    _scale: number;
    _visible: boolean;
    root: SVGShape;
    _angle: number;
    shape: S;
    constructor(parent: any);
    position(x: any, y: any): this;
    rotate(angle: any): this;
    scale(s: any): this;
    color(lineColor?: any, fillColor?: any): this;
    lineStytle(lineWidth: any): this;
    cursorStytle(cursorType?: any, pointerArea?: any): this;
    visible(v: any): this;
    _resize(): void;
    onClick(callback: any): this;
    onMousedown(callback: any): this;
    onMouseup(callback: any): this;
    onMousemove(callback: any): this;
    onMouseover(callback: any): this;
    onMouseout(callback: any): this;
}
