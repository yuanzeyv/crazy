import { Mediator, Notifier } from "../PureMVC";
import { NotificationEnum } from "../../NotificationTable";
import { _Facade, _G } from "../../Global";
import { BaseMediator } from "../BaseMediator/BaseMediator";
import { BaseProxy } from "../BaseProxy/BaseProxy";
export type CommandConstructor = new ()=> Notifier;
export type ProxyConstructor = new (proxyName:string)=> BaseProxy;
export type MediatorConstructor = new (mediatorName:string)=> BaseMediator;
export interface IBaseMVCRegister{
    Register():void;
    UnRegister():void;
}

export class BaseMVCRegister implements IBaseMVCRegister{
    public m_IsRegister:boolean = false;
    private m_CommandMap:Map<NotificationEnum,CommandConstructor>  = new Map<NotificationEnum,CommandConstructor>();
    private m_MediatorMap:Set<MediatorConstructor>  = new Set<MediatorConstructor>();
    private m_ProxyMap:Set<ProxyConstructor>  = new Set<ProxyConstructor>();

    protected AllocProxy(proxyMap:Set<ProxyConstructor>) {}//注册所需要的代理
    protected AllocMediator(mediatorMap:Set<MediatorConstructor>) {}//注册所需要的中介
    protected AllocCommand(commandMap:Map<NotificationEnum,CommandConstructor>) {} //注册所需要的中介
    
    public Register(){
        if(this.m_IsRegister) return;
        this.Init();
        this.RegisterProxy();
        this.RegisterMediator();
        this.RegisterCommand();
        this.OnLoadProxy();//执行OnLoad方法
        this.m_IsRegister = true;
    }   
    OnLoadProxy(){
        //所有代理加载成功后，会再次调用其Onload方法
        this.m_ProxyMap.forEach(( proxyConstructor:ProxyConstructor)=>{
            let tempProxy:BaseProxy = _Facade.retrieveProxy(proxyConstructor.name);
            tempProxy.onLoad();
        });
    }
    
    public UnRegister(){
        if(!this.m_IsRegister) return;
        this.UnRegisterCommand();
        this.UnRegisterMediator();
        this.UnRegisterProxy();
        this.m_IsRegister = false;

    }

    private Init(){
        this.AllocProxy(this.m_ProxyMap);
        this.AllocMediator(this.m_MediatorMap);
        this.AllocCommand(this.m_CommandMap);//命令由于是固定的函数，没有任务的状态，直接返回即可
    }
    private RegisterProxy() {//注册所需要的代理
        this.m_ProxyMap.forEach((proxyConstructor:ProxyConstructor)=>{
            _Facade.registerProxy(new proxyConstructor(proxyConstructor.name)); 
        });
    
    } 
    private RegisterMediator() {//注册所需要的中介
        this.m_MediatorMap.forEach((mediatorConstructor:MediatorConstructor)=>{
            _Facade.registerMediator(new mediatorConstructor(mediatorConstructor.name));
        });
    }
    private RegisterCommand() {//注册所需要的中介
        this.m_CommandMap.forEach(( command:CommandConstructor ,notify:NotificationEnum)=>{
            _Facade.registerCommand(notify,command);
        });
    } 

    private UnRegisterCommand(){ 
        this.m_CommandMap.forEach(( command:CommandConstructor ,notify:NotificationEnum)=>{
            _Facade.removeCommand(notify);
        });
        this.m_CommandMap.clear();
    }
    
    private UnRegisterMediator() { 
        this.m_MediatorMap.forEach(( mediatorConstructor:MediatorConstructor)=>{
            _Facade.removeMediator(mediatorConstructor.name);
        });
        this.m_MediatorMap.clear();
    }

    private UnRegisterProxy() { 
        this.m_ProxyMap.forEach(( proxyConstructor:ProxyConstructor)=>{
            _Facade.removeProxy(proxyConstructor.name);
        });
        this.m_ProxyMap.clear();
    }
}