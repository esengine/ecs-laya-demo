import { SpawnerComponent } from "../components/SpawnerComponent";

// 每个组件应对应一个系统 系统中负责游戏逻辑
export class SpawnerSystem extends es.EntityProcessingSystem {
    // 必须实现的构造函数
    constructor(matcher: es.Matcher) {
        super(matcher);
    }

    // 当满足条件的实体会被派发至这统一进行处理
    // 条件在Matcher中进行设置
    processEntity(entity: es.Entity) {
        let spawner = entity.getComponent<SpawnerComponent>(SpawnerComponent);
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

    private scheduleSpawn(spawner: SpawnerComponent) {
        spawner.cooldown = RandomUtils.randint(spawner.minInterval, spawner.maxInterval);
    }
}