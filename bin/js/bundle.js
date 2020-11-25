(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class SpawnerComponent extends es.Component {
        constructor(enemyType) {
            super();
            this.cooldown = -1;
            this.minInterval = 2;
            this.maxInterval = 60;
            this.minCount = 1;
            this.maxCount = 1;
            this.enemyType = EnemyType.worm;
            this.numSpawned = 0;
            this.numAlive = 0;
            this.enemyType = enemyType;
        }
    }
    var EnemyType;
    (function (EnemyType) {
        EnemyType[EnemyType["worm"] = 0] = "worm";
    })(EnemyType || (EnemyType = {}));

    class SpawnerSystem extends es.EntityProcessingSystem {
        constructor(matcher) {
            super(matcher);
        }
        processEntity(entity) {
            let spawner = entity.getComponent(SpawnerComponent);
            if (spawner.numAlive <= 0)
                spawner.enabled = true;
            if (!spawner.enabled)
                return;
            if (spawner.cooldown <= -1) {
                this.scheduleSpawn(spawner);
                console.log("冷却时间已到，进入下一轮刷新 冷却时间:", spawner.cooldown);
                spawner.cooldown /= 4;
            }
            spawner.cooldown -= es.Time.deltaTime;
            if (spawner.cooldown <= 0) {
                this.scheduleSpawn(spawner);
                for (let i = 0; i < RandomUtils.randint(spawner.minCount, spawner.maxCount); i++) {
                    console.log("创建敌人", entity.position.x, entity.position.y, spawner.enemyType, entity);
                    spawner.numSpawned++;
                    spawner.numAlive++;
                }
                if (spawner.numAlive > 0)
                    spawner.enabled = false;
            }
        }
        scheduleSpawn(spawner) {
            spawner.cooldown = RandomUtils.randint(spawner.minInterval, spawner.maxInterval);
        }
    }

    class MainScene extends es.Scene {
        onStart() {
            return __awaiter(this, void 0, void 0, function* () {
                let spawn = this.createEntity("spawn");
                spawn.addComponent(new SpawnerComponent(EnemyType.worm));
                this.addEntityProcessor(new SpawnerSystem(new es.Matcher().all(SpawnerComponent)));
            });
        }
    }

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
            let core = new es.Core(GameConfig.width, GameConfig.height);
            Laya.timer.frameLoop(1, this, () => {
                es.Time.update(Laya.systemTimer.currTimer);
                es.Core.emitter.emit(es.CoreEvents.FrameUpdated);
            });
            es.Core.scene = new MainScene();
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
