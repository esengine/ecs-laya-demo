// 敌人组件 继承es.Component确定他是一个组件
// 组件当中不应该含有具体逻辑 只存储数据/属性
export class SpawnerComponent extends es.Component {
    public cooldown: number = -1;
    public minInterval: number = 2;
    public maxInterval: number = 60;
    public minCount: number = 1;
    public maxCount: number = 1;
    public enemyType: EnemyType = EnemyType.worm;
    public numSpawned: number = 0;
    public numAlive: number = 0;

    constructor(enemyType: EnemyType) {
        super();
        this.enemyType = enemyType;
    }
}

export enum EnemyType {
    worm
}