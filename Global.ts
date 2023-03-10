import { Log4js, Logger } from "log4js";
import { GlobalConfig } from "./Config/config";
import { ServerMVCRegister } from "./Config/ServerConfig/ServerMVCRegister";
import { Facade } from "./Frame/PureMVC";
import { MySqlProxy } from "./Server/Proxy/MySqlProxy/MySqlProxy";
import { RedisProxy } from "./Server/Proxy/RedisProxy/RedisProxy";
import { TimeWheel } from "./Util/TWTime";
const log4js:Log4js = require('log4js');
log4js.configure(GlobalConfig.Log4);
export let _Log4JS:Logger = log4js.getLogger("Server");
//存放一些全局对象的区域
class Global{
    public m_Facade:Facade = new Facade();
    public m_ServerMVCRegister:ServerMVCRegister = new ServerMVCRegister();
    public m_TimeWheel:TimeWheel = new TimeWheel(10,"GlobalTimer");//全局时间轮，进度是10毫秒 
}
_Log4JS.info("Initialization of the server");
export let _G:Global = new Global();
export let _Facade:Facade = _G.m_Facade;
_G.m_ServerMVCRegister.Register();
export let _TimeWheel:TimeWheel = _G.m_TimeWheel;
export let _MySqlProxy:MySqlProxy = _Facade.FindProxy(MySqlProxy);
export let _RedisProxy:RedisProxy = _Facade.FindProxy(RedisProxy);