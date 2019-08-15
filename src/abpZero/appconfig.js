const appConfig=process.env.NODE_ENV === 'production' ?
{
    "remoteServiceBaseUrl": "http://www.tbkmama.com:9000", //http://www.tbkmama.com:81
    "appBaseUrl": "http://www.tbkmama.com:83",
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
    "remoteServiceBaseUrl": "http://localhost:5000", //http://www.tbkmama.com:81
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