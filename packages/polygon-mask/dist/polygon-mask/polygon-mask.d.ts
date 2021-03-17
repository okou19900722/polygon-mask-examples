import Polygon from "./Polygon";
import Line from "./Line";
import Circle from "./Circle";
export default class PolygonMask extends Editor.Gizmo {
    fillArea: Polygon;
    lines: Line[];
    points: Circle[];
    _targetEditing: boolean;
    onCreateRoot(): void;
    moveOrDeleteVertexe(): {
        start: any;
        update: any;
        end: any;
    };
    setOffset(): {
        start: any;
        update: any;
        end: any;
    };
    addVertexe(): {
        start: any;
        update: any;
        end: any;
    };
    onUpdate(): void;
    enterEditing(): void;
    leaveEditing(): void;
    visible(): boolean;
}
