"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[106],{5731:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>p,frontMatter:()=>n,metadata:()=>o,toc:()=>l});var i=s(1085),r=s(1184);const n={sidebar_position:4},a="getSSMParameterList",o={id:"utilities/ssmutil/getssmparameterlist",title:"getSSMParameterList",description:"You can optionally provide the extract parameter to false to return the ParameterString object. This can be used in locations where the CDK parameter object is expected, for example, by passing it in to ECS environment directly.",source:"@site/docs/utilities/ssmutil/getssmparameterlist.md",sourceDirName:"utilities/ssmutil",slug:"/utilities/ssmutil/getssmparameterlist",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/getssmparameterlist",draft:!1,unlisted:!1,editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/ssmutil/getssmparameterlist.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"getSSMParameter",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/getssmparameter"},next:{title:"getSSMParameterList",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/getssmsecureparameter"}},c={},l=[{value:"Example usage",id:"example-usage",level:2}];function m(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"getssmparameterlist",children:"getSSMParameterList"}),"\n",(0,i.jsxs)(t.p,{children:["You can optionally provide the ",(0,i.jsx)(t.code,{children:"extract"})," parameter to false to return the ",(0,i.jsx)(t.code,{children:"ParameterString"})," object. This can be used in locations where the ",(0,i.jsx)(t.code,{children:"CDK"})," parameter object is expected, for example, by passing it in to ECS environment directly."]}),"\n",(0,i.jsx)(t.admonition,{title:"Note",type:"tip",children:(0,i.jsxs)(t.p,{children:["The ",(0,i.jsx)(t.code,{children:"SSM"})," parameter name must adhere to the naming convention specified in ",(0,i.jsx)(t.a,{href:"/docs/intro#parameter-naming",children:"Parameter naming"}),"."]})}),"\n",(0,i.jsx)(t.h2,{id:"example-usage",children:"Example usage"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",metastring:'title="YourStack.ts"',children:"import { SSMUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n      secret\n    } = props;\n    ...\n    const paramName = 'sn/arn/topics/alarms';\n    \n    const snsAlarmTopicArns = SSMUtil.getSSMParameterList({\n      scope: this,\n      projectName,\n      stackEnv,\n      paramName: paramName,\n    });\n  ...\n  }\n}\n"})})]})}function p(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(m,{...e})}):m(e)}},1184:(e,t,s)=>{s.d(t,{R:()=>a,x:()=>o});var i=s(4041);const r={},n=i.createContext(r);function a(e){const t=i.useContext(n);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:a(e.components),i.createElement(n.Provider,{value:t},e.children)}}}]);