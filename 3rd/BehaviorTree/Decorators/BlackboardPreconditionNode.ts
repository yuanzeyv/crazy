import { NodeStatus } from "../BasicTypes";
import { DecoratorNode } from "../DecoratorNode"

export class BlackboardPreconditionNode extends DecoratorNode{
  
    constructor(name:string){
        super(name);
    }
    
    public Tick():NodeStatus{
        return NodeStatus.FAILURE;
    }
};