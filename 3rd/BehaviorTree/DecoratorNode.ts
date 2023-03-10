import { NodeStatus, NodeType } from "./BasicTypes";
import { TreeNode } from "./TreeNode";

export abstract class DecoratorNode extends TreeNode{
    protected mChildNode:TreeNode|undefined;
    
    public SetChild(child:TreeNode){
        this.mChildNode = child;
    }

    public Child():TreeNode | undefined{
        return this.mChildNode;
    }

    public Halt(): void {
       this.HaltChild();
       this.SetStatus(NodeStatus.IDLE); 
    }

    public HaltChild():void{}

    public Type(): NodeType { return NodeType.DECORATOR; }

    public ExecuteTick(): NodeStatus {
        let status:NodeStatus = super.ExecuteTick();
        let child:TreeNode|undefined = this.Child();
        if(child == undefined)
            return status;
        let child_status:NodeStatus = child.Status();
        if (child_status && (child_status == NodeStatus.SUCCESS || child_status == NodeStatus.FAILURE))
            child.SetStatus(NodeStatus.IDLE);
        return status;
    }
};

/**
 * @brief The SimpleDecoratorNode provides an easy to use DecoratorNode.
 * The user should simply provide a callback with this signature
 *
 *    BT::NodeStatus functionName(BT::NodeStatus child_status)
 *
 * This avoids the hassle of inheriting from a DecoratorNode.
 *
 * Using lambdas or std::bind it is easy to pass a pointer to a method.
 * SimpleDecoratorNode does not support halting, NodeParameters, nor Blackboards.
 */
export type TickFunctorDecorator = (status:NodeStatus, node:TreeNode)=>NodeStatus;

export class SimpleDecoratorNode extends DecoratorNode{
    private mTickFunction:TickFunctorDecorator;
    // You must provide the function to call when tick() is invoked
    public constructor(name:string,tickFunc:TickFunctorDecorator){
        super(name);
        this.mTickFunction = tickFunc;
    }
    public Tick(): NodeStatus {
        let node:TreeNode|undefined = this.Child();
        if(node == undefined)
            return NodeStatus.IDLE;
        return this.mTickFunction(node.ExecuteTick(),this);
    }
};
