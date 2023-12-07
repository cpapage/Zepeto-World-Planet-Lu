export const PLAYER_HEALTH = 1000;
export const HENCHMAN_HEALTH = 100;
export const KREN_HEALTH = 500;
export const CAGE_HEALTH = 50;
export const TREE_CUTTER_HEALTH = 100;
export const FISH_BOAT_HEALTH = 200;

/**
 * The type of entity
 */
export enum EntityType
{
    NONE = 0,
    PLAYER = 1,
    ALLY = 2,
    ENEMY = 3
}

/**
 * The type of enemy to spawn as
 */
export enum EnemyType
{
    NONE = 0,
    HENCH = 1,      //Ground Henchman
    FISH_BOAT = 2,  //Fishing boat
    TREE_CUT = 3,   //Tree cutter
    KREN = 4,       //Kren
    TRI_CAGE = 5,   //triceratops cage
    T_CAGE = 6,     //tiger cage
    EL_CAGE = 7,    //elephant cage
    CLND_CAGE = 8,  //child brontosaurus cage
    ALND_CAGE = 9   //adult brontosaurus cage
}

/**
 * The Game state
 */
export enum GameState
{
    NONE = 0,
    LOADING = 1,
    START = 2,
    CONTINUE = 3,
    END = 4,
    COMPLETE_GAME = 5
}

/**
 * This Class contains an array of all the enemy types.
 */
export class Level
{
    public EnemyTypes: EnemyType[];
}

/**
 * This class contains the Level and all the enemy types in it.
 * @author Chris Papageorge
 */
export default class Config
{
    public Level : Level;

    constructor()
    {
        this.Level = {

            EnemyTypes : [
                EnemyType.TRI_CAGE,
                EnemyType.FISH_BOAT,
                EnemyType.TREE_CUT,
                EnemyType.T_CAGE,
                EnemyType.ALND_CAGE,
                EnemyType.CLND_CAGE,
                EnemyType.HENCH,
                EnemyType.HENCH,
                EnemyType.HENCH,
                EnemyType.EL_CAGE,
                EnemyType.HENCH,
                EnemyType.HENCH,
                EnemyType.TREE_CUT,
                EnemyType.HENCH,
                EnemyType.TREE_CUT,
                EnemyType.HENCH
            ]
        }
    }
}