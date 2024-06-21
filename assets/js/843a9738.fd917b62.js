"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[206],{4624:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>r,contentTitle:()=>i,default:()=>l,frontMatter:()=>c,metadata:()=>a,toc:()=>u});var s=o(1085),n=o(1184);const c={sidebar_position:1},i="actionViaCustomResource",a={id:"utilities/cdkcustomresourceutil/actionviacustomresource",title:"actionViaCustomResource",description:"To be used when you need to perform custom actions during a Cloudformation stack deployment via a custom lambda.",source:"@site/docs/utilities/cdkcustomresourceutil/actionviacustomresource.md",sourceDirName:"utilities/cdkcustomresourceutil",slug:"/utilities/cdkcustomresourceutil/actionviacustomresource",permalink:"/aws-cdk-lib-util/docs/utilities/cdkcustomresourceutil/actionviacustomresource",draft:!1,unlisted:!1,editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/cdkcustomresourceutil/actionviacustomresource.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"LambdaUtilStack",permalink:"/aws-cdk-lib-util/docs/stacks/lambda"},next:{title:"getSSMParamViaCustomResource",permalink:"/aws-cdk-lib-util/docs/utilities/cdkcustomresourceutil/getssmparamviacustomresource"}},r={},u=[{value:"Example usage",id:"example-usage",level:2}];function d(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,n.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"actionviacustomresource",children:"actionViaCustomResource"}),"\n",(0,s.jsxs)(t.p,{children:["To be used when you need to perform custom actions during a ",(0,s.jsx)(t.code,{children:"Cloudformation"})," stack deployment via a custom lambda.\nCustom lambda is to be provisioned separately, via ",(0,s.jsx)(t.a,{href:"/docs/stacks/lambda",children:"LambdaUtilStack"})," ;) for example and the function is to be passed in as the target to be invoked during ",(0,s.jsx)(t.code,{children:"onCreate"}),", ",(0,s.jsx)(t.code,{children:"onUpdate"})," ",(0,s.jsx)(t.code,{children:"onDelete"})," lifecycle events."]}),"\n",(0,s.jsx)(t.h2,{id:"example-usage",children:"Example usage"}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-typescript",metastring:'title="YourStack.ts"',children:"import { CDKCustomResourceUtil } from 'aws-cdk-lib-util';\nimport { LambdaUtilStack } from \"./LambdaUtilStack\";\n\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n      lambdaConfig,\n      functionName,\n      targetParamName,\n      targetAccount,\n    } = props;\n    ...\n    const lambda = new Function(...);\n  \n    CDKCustomResourceUtil.actionViaCustomResource({\n      scope: this,\n      projectName,\n      stackEnv,\n      functionArn: lambda.functionArn,\n    });\n  ...\n  }\n}\n"})})]})}function l(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1184:(e,t,o)=>{o.d(t,{R:()=>i,x:()=>a});var s=o(4041);const n={},c=s.createContext(n);function i(e){const t=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(n):e.components||n:i(e.components),s.createElement(c.Provider,{value:t},e.children)}}}]);