/*
Copyright 2020 Jeysson Guevara (JeyDotC)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.behaviors, "cr.behaviors not created");

/////////////////////////////////////
// Behavior class
cr.behaviors.SimpleThree_Sprite = function (runtime) {
    this.runtime = runtime;
};

(function () {

    const FacingCameraMode = {
        No: 0,
        Yes: 1,
        OnlyYAxis: 2,
        asString(value) {
            switch (value) {
                case FacingCameraMode.No:
                    return 'No';
                case FacingCameraMode.Yes:
                    return 'Yes';
                case FacingCameraMode.OnlyYAxis:
                    return 'Only Y Axis';
                default:
                    return 'UNKNOWN';
            }
        },
        fromString(value) {
            switch (value) {
                case 'No':
                    return FacingCameraMode.No;
                case 'Yes':
                    return FacingCameraMode.Yes;
                case 'Only Y Axis':
                case 'y':
                case 'Y':
                    return FacingCameraMode.OnlyYAxis;
                default:
                    return FacingCameraMode.No;
            }
        }
    };

    const toMinificationFilter = (filter) => {
        switch (filter){
            case 0: return THREE.NearestFilter;
            case 1: return THREE.NearestMipmapNearestFilter;
            case 2: return THREE.NearestMipmapLinearFilter;
            case 3: return THREE.LinearFilter;
            case 4: return THREE.LinearMipmapNearestFilter;
            case 5: return THREE.LinearMipmapLinearFilter;
        }
    }

    const behaviorProto = cr.behaviors.SimpleThree_Sprite.prototype;

    /////////////////////////////////////
    // Behavior type class
    behaviorProto.Type = function (behavior, objtype) {
        this.behavior = behavior;
        this.objtype = objtype;
        this.runtime = behavior.runtime;

        this.simpleThree = undefined;
        this.allTextures = [];
    };

    const typeProto = behaviorProto.Type.prototype;

    typeProto.onCreate = function () {
    };

    /////////////////////////////////////
    // Behavior instance class
    behaviorProto.Instance = function (type, inst) {
        this.type = type;
        this.behavior = type.behavior;
        this.inst = inst;				// associated object instance to modify
        this.runtime = type.runtime;

        this.elevation = 0;
        this.rotationX = 0;
        this.rotationZ = 0;
    };

    const instanceProto = behaviorProto.Instance.prototype;

    instanceProto.findSimpleThreeInstance = function () {
        const simpleThreeInstances = Object.values(this.runtime.objectsByUid)
            .filter(instance => instance.plugin instanceof cr.plugins_.SimpleThree);

        if (simpleThreeInstances.length === 0) {
            return undefined;
        }

        return simpleThreeInstances[0];
    };


    instanceProto.onCreate = function () {
        this.elevation = this.properties[0];
        this.rotationX = cr.to_radians(this.properties[1]);
        this.rotationZ = cr.to_radians(this.properties[2]);
        this.facingCamera = this.properties[3];
        this.render2D = this.properties[4] === 1;
        this.magnificationFilter = this.properties[5] === 0 ? THREE.LinearFilter : THREE.NearestFilter;
        this.minificationFilter = toMinificationFilter(this.properties[6]);

        console.log({ m: this.magnificationFilter, mprop: this.properties[5], min: this.minificationFilter, minProp: this.properties[6] });

        if(!this.render2D){
            this.inst.drawGL = this.inst.drawGL_earlyZPass = this.inst.draw = () => {};
        }

        this.pivot = new THREE.Group();
        this.simpleThree = this.findSimpleThreeInstance();
        this.pixelsTo3DUnits = v => v;
        if (this.simpleThree === undefined) {

            console.warn('No simpleThree Object found. If it exists in this layout and you see this message, try moving the SimpleThree object to the bottom of the layer.');
            return;
        }

        this.pixelsTo3DUnits = this.simpleThree.pixelsTo3DUnits.bind(this.simpleThree);

        if (this.type.allTextures.length === 0) {
            this.type.allTextures = this.inst.type.all_frames.reduce((prev, frame) => {
                const texture =  new THREE.TextureLoader().load(frame.texture_file);
                texture.magFilter = this.magnificationFilter;
                texture.minFilter = this.minificationFilter;
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                return {
                    ...prev,
                    [frame.texture_file]: {
                        name: frame.texture_file,
                        texture,
                    },
                }
            }, {});
        }

        this.currentTexture = undefined;
        this.currentGeometry = undefined;
        this.currentMaterial = undefined;
        this.mesh = undefined;

        this.pivot.rotation.order = 'YXZ';
        this.updatePivot();

        this.simpleThree.scene.add(this.pivot);
    };

    instanceProto.updatePivot = function () {
        const currentFrame = this.inst.curFrame || {hotspotX: 0, hotspotY: 0};
        const {scaleX, scaleY} = this.getCurrentScale();

        this.pivot.position.set(
            this.pixelsTo3DUnits(this.inst.x + (currentFrame.hotspotX - 0.5) * currentFrame.width * scaleX),
            this.pixelsTo3DUnits(this.elevation + (currentFrame.hotspotY - 0.5) * currentFrame.height * scaleY),
            this.pixelsTo3DUnits(this.inst.y)
        );

        if (this.facingCamera && this.simpleThree && this.simpleThree.camera) {
            this.pivot.lookAt(this.simpleThree.camera.position);
            if (this.facingCamera === FacingCameraMode.OnlyYAxis) {
                this.pivot.rotation.x = -this.rotationX;
                this.pivot.rotation.z = -this.rotationZ;
            }
        } else {
            this.pivot.rotation.set(
                -this.rotationX,
                -this.inst.angle,
                -this.rotationZ
            );
        }
    };

    instanceProto.updateGeometry = function () {
        // datauri: ""
        // duration: 1
        // getDataUri: ƒ frame_getDataUri()
        // height: 358
        // hotspotX: 0.5023923516273499
        // hotspotY: 0.5
        // image_points: []
        // offx: 0
        // offy: 0
        // pixelformat: 0
        // poly_pts: []
        // sheetTex:
        //     bottom: 1
        // left: 0
        // right: 1
        // top: 0
        // __proto__: Object
        // spritesheeted: false
        // texture_file: "samplesprite-default-003.png"
        // texture_filesize: 11677
        // texture_img: img
        // webGL_texture: WebGLTexture {c2width: 209, c2height: 358, c2refcount: 1, c2texkey: "http://localhost:50000/samplesprite-default-003.png,false,true"}
        // width: 209
        const currentFrame = this.inst.curFrame;
        const textureChanged = this.currentTexture === undefined || currentFrame.texture_file !== this.currentTexture.name;
        if (textureChanged) {
            this.currentTexture = this.type.allTextures[currentFrame.texture_file];
        }

        const currentTextureImage = this.currentTexture.texture.image;

        if (currentTextureImage === undefined) {
            return;
        }

        const {scaleX, scaleY} = this.getCurrentScale();

        const newWidth3D = this.pixelsTo3DUnits(currentFrame.width * scaleX);
        const newHeight3D = this.pixelsTo3DUnits(currentFrame.height * scaleY);

        if (!this.currentGeometry) {
            this.currentGeometry = new THREE.PlaneGeometry(newWidth3D, newHeight3D);
        }

        if (!this.currentMaterial) {
            this.currentMaterial = new THREE.MeshStandardMaterial({
                map: this.currentTexture.texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5,
                opacity: this.inst.opacity
            });
        }

        if (!this.mesh) {
            this.mesh = new THREE.Mesh(this.currentGeometry, this.currentMaterial);
            this.pivot.add(this.mesh);
        }

        if (textureChanged) {
            this.currentMaterial.map = this.currentTexture.texture;
            this.currentMaterial.needsUpdate = true;
        }

        this.currentMaterial.map.center.x = 0;
        this.currentMaterial.map.center.y = 1;

        this.currentMaterial.map.offset.x = currentFrame.offx / currentTextureImage.width;
        this.currentMaterial.map.offset.y = 1 - currentFrame.offy / currentTextureImage.height;

        this.currentMaterial.map.repeat.x = currentFrame.width / currentTextureImage.width;
        this.currentMaterial.map.repeat.y = currentFrame.height / currentTextureImage.height;
    };

    instanceProto.getCurrentScale = function () {
        const currentFrame = this.inst.curFrame || { width: this.inst.width, height: this.inst.height };

        return {
            scaleX: Math.abs(this.inst.width / currentFrame.width),
            scaleY: Math.abs(this.inst.height / currentFrame.height),
        }
    };

    instanceProto.onDestroy = function () {
        // called when associated object is being destroyed
        // note runtime may keep the object and behavior alive after this call for recycling;
        // release, recycle or reset any references here as necessary
    };

    // called when saving the full state of the game
    instanceProto.saveToJSON = function () {
        // return a Javascript object containing information about your behavior's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {
            "e": this.elevation,
            "rx": this.rotationX,
            "rz": this.rotationZ,
            "fc": this.facingCamera,
        };
    };

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function (o) {
        this.elevation = o["e"];
        this.rotationX = o["rx"];
        this.rotationZ = o["rz"];
        this.facingCamera = o["fc"];
    };

    instanceProto.tick = function () {
        const dt = this.runtime.getDt(this.inst);
        const isVisible = this.inst.visible;

        this.pivot.visible = isVisible;

        if (isVisible) {
            this.updateGeometry();
            this.updatePivot();
        }
    };

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.
        propsections.push({
            "title": this.type.name,
            "properties": [
                {"name": "Elevation", "value": this.elevation},
                {"name": "Rotation X", "value": cr.to_degrees(this.rotationX)},
                {"name": "Rotation Z", "value": cr.to_degrees(this.rotationZ)},
                {"name": "Facing Camera", "value": FacingCameraMode.asString(this.facingCamera)},
            ]
        });
    };

    instanceProto.onDebugValueEdited = function (header, name, value) {
        const acts = this.behavior.acts;
        switch (name) {
            case "Elevation"      :
                acts.SetElevationFrom2D.bind(this)(value);
                break;
            case "Rotation X"     :
                acts.SetRotationXFrom2D.bind(this)(value);
                break;
            case "Rotation Z"     :
                acts.SetRotationZFrom2D.bind(this)(value);
                break;
            case "Facing Camera":
                acts.SetFacingCameraOption.bind(this)(FacingCameraMode.fromString(value));
                break;
        }
    };

    /**END-PREVIEWONLY**/

    //////////////////////////////////////
    // Conditions
    function Cnds() {
    }

    // Conditions here ...
    Cnds.prototype.CompareElevation = function (cmp, value) {
        return cr.do_cmp(this.elevation, cmp, value);
    };

    Cnds.prototype.CompareRotationX = function (cmp, value) {
        return cr.do_cmp(this.rotationX, cmp, cr.to_radians(value));
    };

    Cnds.prototype.CompareRotationZ = function (cmp, value) {
        return cr.do_cmp(this.rotationZ, cmp, cr.to_radians(value));
    };

    behaviorProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {
    }

    Acts.prototype.SetElevationFrom2D = function (elevation) {
        this.elevation = elevation;
    };

    Acts.prototype.SetRotationXFrom2D = function (angle) {
        this.rotationX = cr.to_radians(angle);
    };

    Acts.prototype.SetRotationZFrom2D = function (angle) {
        this.rotationZ = cr.to_radians(angle);
    };

    Acts.prototype.SetFacingCameraOption = function (option) {
        this.facingCamera = option;
    };

    // Actions here ...

    behaviorProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {
    }

    Exps.prototype.Elevation = function (ret) {
        ret.set_float(this.elevation);
    };

    Exps.prototype.RotationX = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationX));
    };

    Exps.prototype.RotationZ = function (ret) {
        ret.set_float(cr.to_degrees(this.rotationZ));
    };

    // Expressions here ...

    behaviorProto.exps = new Exps();

}());