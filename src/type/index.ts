const types = 2
declare interface dependenciesType {
    name: string;
    version: string |null;
    dependencies?: dependenciesType[];
    circular?:boolean
}