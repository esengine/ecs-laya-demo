import { SpawnerComponent, EnemyType } from "../components/SpawnerComponent";
import { SpawnerSystem } from "../systems/SpawnerSystem";

// 继承es.Scene来确定这是一个场景
export class MainScene extends es.Scene {
    public async onStart() {
        // 创建实体
        let spawn = this.createEntity("spawn");
        // 添加组件
        spawn.addComponent(new SpawnerComponent(EnemyType.worm));
    
        // 添加实体处理
        // Matcher.all 代表对带有该组件的实体进行处理
        // Matcher.one 代表对至少有一个该组件的实体进行处理
        // Matcher.exclude 代表对不带该组件的实体进行处理
        this.addEntityProcessor(new SpawnerSystem(new es.Matcher().all(SpawnerComponent)));
    }
}