import { NodeStatus, NodeType } from "./BasicTypes"
import { TreeNode } from "./TreeNode"

export abstract class ConditionNode extends TreeNode{
    public Halt(): void {
        this.SetStatus(NodeStatus.IDLE);
    }

    public Type(): NodeType {
        return NodeType.CONDITION;
    }
};
export type TickFunctorCondition = (node:TreeNode)=>NodeStatus;
export class SimpleConditionNode extends ConditionNode{
    private mTickFunction:TickFunctorCondition;
    public constructor(name:string,func:TickFunctorCondition){
        super(name);
        this.mTickFunction = func;
    }
    public Tick(): NodeStatus {
        return this.mTickFunction(this);
    }
};