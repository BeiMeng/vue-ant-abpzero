const appConfig=process.env.NODE_ENV === 'production' ?
{
    "remoteServiceBaseUrl": "http://sys.tbkmama.com", //后端部署的api接口地址
    "remoteSignalrBaseUrl": "http://sys.tbkmama.com", //后端部署的signalr地址，可以直连asp.net core  也可以配置反向代理地址(这样需要配置ws)
    "appBaseUrl": "http://beidream.tbkmama.com",  //前端部署的地址
    "localeMappings": [
      {
        "from": "pt-BR",
        "to": "pt"
      },
      {
        "from": "zh-CN",
        "to": "zh"
      },
      {
          "from": "he-IL",
          "to": "he"
      }
    ]
}
:
{
    "remoteServiceBaseUrl": "http://localhost:5000", 
    "remoteSignalrBaseUrl": "http://localhost:5000",
    "appBaseUrl": "http://localhost:4200",
    "localeMappings": [
      {
        "from": "pt-BR",
        "to": "pt"
      },
      {
        "from": "zh-CN",
        "to": "zh"
      },
      {
          "from": "he-IL",
          "to": "he"
      }
    ]
}
export default appConfig;