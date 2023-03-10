import { _Facade } from "../../Global";
import { SimpleActionNode, TickFunctorAction } from "./ActionNode";
import { NodeStatus, NodeType, PortInfo, PortsList } from "./BasicTypes";
import { Blackboard } from "./BlackBoard";
import { SimpleConditionNode, TickFunctorCondition } from "./ConditionNode";
import { FallbackNode as Fallback } from "./Controls/FallbackNode";
import { IfThenElseNode as IfThenElse } from "./Controls/IfThenElseNode";
import { ParallelNode as Parallel } from "./Controls/ParallelNode";
import { ReactiveFallback } from "./Controls/ReactiveFallback";
import { ReactiveSequence } from "./Controls/ReactiveSequence";
import { SequenceNode as Sequence } from "./Controls/SequenceNode";
import { SequenceStarNode as SequenceStar } from "./Controls/SequenceStarNode";
import { SwitchNode } from "./Controls/SwitchNode";
import { WhileDoElseNode as WhileDoElse } from "./Controls/WhileDoElseNode";
import { SimpleDecoratorNode, TickFunctorDecorator } from "./DecoratorNode";
import { BlackboardPreconditionNode } from "./Decorators/BlackboardPreconditionNode";
import { DelayNode } from "./Decorators/DelayNode";
import { ForceFailureNode } from "./Decorators/ForceFailureNode";
import { ForceSuccessNode } from "./Decorators/ForceSuccessNode";
import { InverterNode as Inverter } from "./Decorators/InverterNode";
import { KeepRunningUntilFailureNode } from "./Decorators/KeepRunningUntilFailureNode";
import { RepeatNode } from "./Decorators/RepeatNode";
import { RetryNode } from "./Decorators/RetryNode";
import { SubtreeNode } from "./Decorators/SubtreeNode";
import { TimeoutNode } from "./Decorators/TimeoutNode";
import { NodeConfiguration, TreeNode, TreeNodeManifest } from "./TreeNode";
class Tree{
    public mNodes:Array<TreeNode> = new Array<TreeNode>(); 
    public mBlackBoardStack:Array<Blackboard> = new Array<Blackboard>();
    public mMainfests:Map<string,TreeNodeManifest> = new Map<string,TreeNodeManifest>();
    public get RootNode():TreeNode|undefined{
        return this.mNodes.length == 0 ? undefined: this.mNodes[0];
    }

    public HaltTree():void{
        let rootNode:TreeNode | undefined = this.RootNode
        if(!rootNode)
            return;
        rootNode.Halt();
        rootNode.SetStatus(NodeStatus.IDLE);
    }

    public TickRoot(){
        let rootNode:TreeNode | undefined = this.RootNode
        if(!rootNode)
            return;
        let ret:NodeStatus =rootNode.ExecuteTick();
        if( ret == NodeStatus.SUCCESS || ret == NodeStatus.FAILURE)
            rootNode.SetStatus(NodeStatus.IDLE);
        return ret;
    }
    
    public RootBlackboard():Blackboard{
        if( this.mBlackBoardStack.length <= 0 )
            return new Blackboard();
        return this.mBlackBoardStack[0];
    }
}; 

export type NodeBuilder = (name:string)=>TreeNode;
export class BehaviorTreeFactory{
    private mBuilders:Map<string,NodeBuilder> = new Map<string,NodeBuilder>();
    private mManifests:Map<string,TreeNodeManifest> = new Map<string,TreeNodeManifest>();
    private mBuiltinIDs:Set<string> = new Set<string>();
    private mBehaviorTreeDefinitions:Map<string,any> = new Map<string,any>(); 
    public constructor(){
        this.RegisterNodeType("Fallback",Fallback);
        this.RegisterNodeType("Sequence",Sequence);
        this.RegisterNodeType("SequenceStar",SequenceStar);
        this.RegisterNodeType("Parallel",Parallel );
        this.RegisterNodeType("ReactiveSequence",ReactiveSequence);
        this.RegisterNodeType("ReactiveFallback",ReactiveFallback);
        this.RegisterNodeType("IfThenElse",IfThenElse);
        this.RegisterNodeType("WhileDoElse",WhileDoElse);

        this.RegisterNodeType("KeepRunningUntilFailure",KeepRunningUntilFailureNode);
        this.RegisterNodeType("Inverter",Inverter);
        this.RegisterNodeType("RetryUntilSuccessful",RetryNode); // correct one
        this.RegisterNodeType("Repeat",RepeatNode);
        this.RegisterNodeType("Timeout",TimeoutNode);
        this.RegisterNodeType("Delay",DelayNode);

        this.RegisterNodeType("ForceSuccess",ForceSuccessNode);
        this.RegisterNodeType("ForceFailure",ForceFailureNode);

        //this.RegisterNodeType("AlwaysSuccess",AlwaysSuccess);
        //this.RegisterNodeType<AlwaysFailureNode>("AlwaysFailure");
        //this.RegisterNodeType<SetBlackboard>("SetBlackboard");

        this.RegisterNodeType("SubTree",SubtreeNode);
        //this.RegisterNodeType<SubtreePlusNode>("SubTreePlus");

        //this.RegisterNodeType<BlackboardPreconditionNode<int>>("BlackboardCheckInt");
        //this.RegisterNodeType<BlackboardPreconditionNode<double>>("BlackboardCheckDouble");
        //this.RegisterNodeType<BlackboardPreconditionNode<std::string>>("BlackboardCheckString");
        //this.RegisterNodeType<BlackboardPreconditionNode<bool>>("BlackboardCheckBool");
        this.RegisterNodeType<SwitchNode>("Switch",SwitchNode); 
        
        for(let element of this.mBuilders)
            this.mBuiltinIDs.add(element[0]);
    } 

    public UnregisterBuilder(id:string):boolean{
        if(this.BuiltinNodes().has(id))
            throw `You can not remove the builtin registration ID [${id}]`;
        if(this.mBuilders.get(id) == undefined)
            return false;
        this.mBuilders.delete(id);
        this.mManifests.delete(id);
        return true;
    }
    /// The most generic way to register your own builder.
    public RegisterBuilder(manifest:TreeNodeManifest,builder:NodeBuilder):void{
        if(this.mBuilders.get(manifest.RegistrationID) != undefined)
            throw `ID [${manifest.RegistrationID}] already registered`; 
        this.mBuilders.set(manifest.RegistrationID,builder);        
        this.mManifests.set(manifest.RegistrationID,manifest);
    }

    public RegisterNodeType<T extends TreeNode> (id:string,create:new (name:string)=>T){
        let typeData:any = create; 
        let type:NodeType = typeData["GetType"]();//获取到当前的节点类型
        let portList:PortsList = typeData["ProvidedPorts"]();//获取到当前的节点类型
        let manifest:TreeNodeManifest = {Type:type,RegistrationID: id,Ports: portList};
        let builder = (name:string)=>{ return new create(name); };
        this.RegisterBuilder(manifest,builder);
    } 


    public RegisterSimpleCondition(id:string,tickFunction:TickFunctorCondition,ports:PortsList=new Map<string,PortInfo>()){
        let builder = (name:string)=> new SimpleConditionNode(name,tickFunction);
        let manifest:TreeNodeManifest = {RegistrationID: id, Type: NodeType.CONDITION,Ports:ports};
        this.RegisterBuilder(manifest,builder);
    }

    public RegisterSimpleAction(id:string,tickFunction:TickFunctorAction,ports:PortsList=new Map<string,PortInfo>()){
        let builder = (name:string)=> new SimpleActionNode(name,tickFunction);
        let manifest:TreeNodeManifest = { RegistrationID: id, Type: NodeType.ACTION,Ports:ports }       
        this.RegisterBuilder(manifest,builder);
    }

    public RegisterSimpleDecorator(id:string,tickFunction:TickFunctorDecorator,ports:PortsList=new Map<string,PortInfo>()){
        let builder = (name:string)=> new SimpleDecoratorNode(name,tickFunction);
        let manifest:TreeNodeManifest = { RegistrationID: id, Type: NodeType.ACTION,Ports:ports }    
        this.RegisterBuilder(manifest,builder);
    }

    public RegisterBehaviorTreeFromFile(filename:string){

    }
    public RegisterBehaviorTreeFromText(text:string){

    }
    
    public InstantiateTreeNode(name:string,id:string,config:NodeConfiguration):TreeNode{
        let builder:NodeBuilder|undefined = this.mBuilders.get(id);
        if(builder == undefined)
            throw `BehaviorTreeFactory: ID [${id}] not registered`;
        let node:TreeNode = builder(name);
        node.SetRegistrationID(id);
        return node;
    }

    public CreateTreeFromText(text:string,blackboard:Blackboard){

    }

    public Builders():Map<string,NodeBuilder>{
        return this.mBuilders;
    }
    
    public Maifests():Map<string,TreeNodeManifest>{
        return this.mManifests;
    }

    public BuiltinNodes():Set<string>{
        return this.mBuiltinIDs;
    } 
}