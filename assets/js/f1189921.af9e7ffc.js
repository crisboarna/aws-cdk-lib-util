"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[634],{8653:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>n,default:()=>l,frontMatter:()=>c,metadata:()=>o,toc:()=>a});var i=r(1085),s=r(1184);const c={sidebar_position:1},n="createSecurityGroup",o={id:"utilities/securitygrouputil/createsecuritygroup",title:"createSecurityGroup",description:"Helps in creating a standardized Security Group with a standardized name following the pattern:",source:"@site/docs/utilities/securitygrouputil/createsecuritygroup.md",sourceDirName:"utilities/securitygrouputil",slug:"/utilities/securitygrouputil/createsecuritygroup",permalink:"/aws-cdk-lib-util/docs/utilities/securitygrouputil/createsecuritygroup",draft:!1,unlisted:!1,editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/securitygrouputil/createsecuritygroup.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"createSecretManagerSecret",permalink:"/aws-cdk-lib-util/docs/utilities/secretmanagerutil/createsecretmanagersecret"},next:{title:"getSecurityGroupFromId",permalink:"/aws-cdk-lib-util/docs/utilities/securitygrouputil/getsecuritygroupfromid"}},u={},a=[{value:"Example usage",id:"example-usage",level:2}];function p(e){const t={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",strong:"strong",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"createsecuritygroup",children:"createSecurityGroup"}),"\n",(0,i.jsxs)(t.p,{children:["Helps in creating a standardized ",(0,i.jsx)(t.code,{children:"Security Group"})," with a standardized name following the pattern:"]}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-markdown",children:"`${projectName}-${securityGroupName.toUpperCase()}-SG-${stackEnv}`\n"})}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.strong,{children:"Example:"})}),"\n",(0,i.jsxs)(t.p,{children:["projectName: ",(0,i.jsx)(t.code,{children:"MyProject"})]}),"\n",(0,i.jsxs)(t.p,{children:["securityGroupName: ",(0,i.jsx)(t.code,{children:"API"})]}),"\n",(0,i.jsxs)(t.p,{children:["stackEnv: ",(0,i.jsx)(t.code,{children:"DEV"})]}),"\n",(0,i.jsxs)(t.p,{children:["Result: ",(0,i.jsx)(t.code,{children:"MyProject-API-SG-DEV"})]}),"\n",(0,i.jsx)(t.h2,{id:"example-usage",children:"Example usage"}),"\n",(0,i.jsx)(t.pre,{children:(0,i.jsx)(t.code,{className:"language-typescript",metastring:'title="YourStack.ts"',children:"import { SecurityGroupUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n    } = props;\n    ...\n    SecurityGroupUtil.createSecurityGroup({\n      scope: this,\n      projectName,\n      stackEnv,\n      securityGroupName: 'API',\n    });\n  ...\n  }\n}\n"})})]})}function l(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(p,{...e})}):p(e)}},1184:(e,t,r)=>{r.d(t,{R:()=>n,x:()=>o});var i=r(4041);const s={},c=i.createContext(s);function n(e){const t=i.useContext(c);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:n(e.components),i.createElement(c.Provider,{value:t},e.children)}}}]);