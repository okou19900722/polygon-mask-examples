const gfx = cc.gfx;
const {ccclass, property, executeInEditMode, requireComponent} = cc._decorator;

const DEFAULT_VERTEXES = [
    cc.v2(-50, -50),
    cc.v2(50, -50),
    cc.v2(50, 50),
    cc.v2(-50, 50)
];

@ccclass
@executeInEditMode
@requireComponent(cc.MeshRenderer)
export default class PolygonMask extends cc.Component {

    @property({
        serializable: false,
        readonly: true
    })
    _editing = false;
    @property
    get editing() {
        return this._editing;
    }
    set editing(value: boolean) {
        this._editing = value;
        this._applyVertexes();
    }

    @property
    _offset: cc.Vec2 = cc.v2(0, 0);
    @property
    get offset() {
        return this._offset;
    }
    set offset(value: cc.Vec2) {
        this._offset = value;
        if (this.editing) {
            this._applyVertexes();
        }
    }

    @property({
        type: cc.SpriteFrame
    })
    _spriteFrame: cc.SpriteFrame = null;
    @property({
        type: cc.SpriteFrame
    })
    get spriteFrame() {
        return this._spriteFrame;
    }
    set spriteFrame(value: cc.SpriteFrame) {
        this._spriteFrame = value;
        CC_EDITOR && this._applySpriteFrame();
    }

    @property({
        type: cc.Vec2
    })
    _vertexes: cc.Vec2[] = DEFAULT_VERTEXES;

    @property({
        type: cc.Vec2
    })
    get vertexes() {
        return this._vertexes;
    }
    set vertexes(value: cc.Vec2[]) {
        this._vertexes = value;
        this._updateMesh();
        if (this.editing) {
            this._applyVertexes();
        }
    }

    _meshCache = null;
    renderer: cc.MeshRenderer = null;

    protected start(): void {
        this._meshCache = {};

        this._updateMesh();

        let renderer = this.node.getComponent(cc.MeshRenderer);

        renderer.mesh = null;
        this.renderer = renderer;
        // let builtinMaterial = cc.Material("unlit", this);
        let builtinMaterial = cc.MaterialVariant.createWithBuiltin("unlit", this).material;
        // let builtinMaterial = cc.Material.getInstantiatedBuiltinMaterial("unlit");
        // builtinMaterial.copy(cc.Material.getInstantiatedBuiltinMaterial("unlit", this));   //getBuiltinMaterial
        renderer.setMaterial(0, builtinMaterial);

        this._applySpriteFrame();
        this._applyVertexes();
    }

    // update (dt) {}

    mesh = null;
    _updateMesh() {
        let mesh = this._meshCache[this.vertexes.length];
        if (!mesh) {
            mesh = new cc.Mesh();
            mesh.init(new gfx.VertexFormat([
                { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
                { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            ]), this.vertexes.length, true);
            this._meshCache[this.vertexes.length] = mesh;
        }
        this.mesh = mesh;
        // cc.log('_updateMesh');
    }
    texture = null;
    // ????????????
    _applyVertexes() {
        // cc.log('_applyVertexes');

        // ????????????
        const mesh = this.mesh;
        let ves = this.vertexes.map(i => i.add(this.offset));
        mesh.setVertices(gfx.ATTR_POSITION, ves);

        if (this.texture) {
            let uvs = [];
            // ??????uv
            for (const pt of ves) {
                const vx = (pt.x + this.texture.width / 2) / this.texture.width;
                const vy = 1.0 - (pt.y + this.texture.height / 2) / this.texture.height;
                uvs.push(cc.v2(vx, vy));
            }
            mesh.setVertices(gfx.ATTR_UV0, uvs);
        }

        if (this.vertexes.length >= 3) {
            // ??????????????????
            let ids = [];
            const vertexes = [].concat(ves);

            // ???????????????????????????????????????????????????????????????????????????????????????????????????
            let index = 0, rootIndex = -1;
            while (vertexes.length > 3) {
                const p1 = vertexes[index % vertexes.length];
                const p2 = vertexes[(index + 1) % vertexes.length];
                const p3 = vertexes[(index + 2) % vertexes.length];

                const v1 = p2.sub(p1);
                const v2 = p3.sub(p2);
                if (v1.cross(v2) >= 0) {
                    // ?????????
                    let isIn = false;
                    for (const p_t of vertexes) {
                        if (p_t !== p1 && p_t !== p2 && p_t !== p3 && this._testInTriangle(p_t, p1, p2, p3)) {
                            // ????????????????????????
                            isIn = true;
                            break;
                        }
                    }
                    if (!isIn) {
                        // ?????????????????????????????????????????????????????????
                        ids = ids.concat([ves.indexOf(p1), ves.indexOf(p2), ves.indexOf(p3)]);
                        vertexes.splice(vertexes.indexOf(p2), 1);
                        rootIndex = index;
                    } else {
                        index = (index + 1) % vertexes.length;
                        if (index === rootIndex) {
                            cc.log('?????????????????????');
                            break;
                        }
                    }
                } else {
                    index = (index + 1) % vertexes.length;
                    if (index === rootIndex) {
                        cc.log('?????????????????????');
                        break;
                    }
                }
            }
            ids = ids.concat(vertexes.map(v => { return ves.indexOf(v) }));
            mesh.setIndices(ids);

            if (this.renderer.mesh != mesh) {
                // mesh ????????????????????? MeshRenderer , ???????????????(mac)?????????
                this.renderer.mesh = mesh;
            }
        } else {

        }
    }

    // ????????????????????????????????????
    _testInTriangle(point, triA, triB, triC) {
        let AB = triB.sub(triA), AC = triC.sub(triA), BC = triC.sub(triB), AD = point.sub(triA), BD = point.sub(triB);
        return (AB.cross(AC) >= 0 !== AB.cross(AD) < 0)  // D,C ???AB????????????
            && (AB.cross(AC) >= 0 !== AC.cross(AD) >= 0) // D,B ???AC????????????
            && (BC.cross(AB) > 0 !== BC.cross(BD) >= 0); // D,A ???BC????????????
    }

    // ????????????
    _applySpriteFrame() {
        // cc.log('_applySpriteFrame');
        if (this.spriteFrame) {
            const renderer = this.renderer;
            let material: any = renderer.getMaterial(0);
            // let material = renderer._materials[0];
            // Reset material
            let texture = this.spriteFrame.getTexture();
            material.define("USE_DIFFUSE_TEXTURE", true);
            material.setProperty('diffuseTexture', texture);
            this.texture = texture;
        }

    }
}
