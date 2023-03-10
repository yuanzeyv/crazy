/// Enumerates the possible types of nodes
export enum NodeType{
    UNDEFINED = 0,
    ACTION,
    CONDITION,
    CONTROL,
    DECORATOR,
    SUBTREE
};
export enum NodeStatus{
    IDLE = 0,
    RUNNING,
    SUCCESS,
    FAILURE
};

export enum PortDirection{
    INPUT,
    OUTPUT,
    INOUT
}; 
export class PortInfo{
    private mType:PortDirection; 
    private mDescription:string = "";
    private mDefaultValue:string = "";
    public constructor(direction:PortDirection = PortDirection.INOUT){
        this.mType = direction;
    }
    get Direction():PortDirection{
        return this.mType;
    }
    get Description():string{
        return this.mDescription;
    }
    get DefaultValue():string{
        return this.mDefaultValue;
    }
    set DefaultValue(str:string){
        this.mDefaultValue = str;
    }
};

export type PortsList = Map<string,PortInfo>;
