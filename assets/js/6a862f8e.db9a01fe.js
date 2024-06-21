"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[691],{8218:(t,e,s)=>{s.r(e),s.d(e,{assets:()=>a,contentTitle:()=>o,default:()=>d,frontMatter:()=>c,metadata:()=>r,toc:()=>l});var n=s(1085),i=s(1184);const c={sidebar_position:2},o="hasContext",r={id:"utilities/cdkcontextutil/hascontext",title:"hasContext",description:"Useful for checking if a context key exists, either programatically set beforehand or from CLI via",source:"@site/docs/utilities/cdkcontextutil/hascontext.md",sourceDirName:"utilities/cdkcontextutil",slug:"/utilities/cdkcontextutil/hascontext",permalink:"/aws-cdk-lib-util/docs/utilities/cdkcontextutil/hascontext",draft:!1,unlisted:!1,editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/cdkcontextutil/hascontext.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"getSSMParamViaCustomResource",permalink:"/aws-cdk-lib-util/docs/utilities/cdkcustomresourceutil/getssmparamviacustomresource"},next:{title:"checkArtifactDirectoryExists",permalink:"/aws-cdk-lib-util/docs/utilities/cdkdirectoryutil/checkartifactdirectoryexists"}},a={},l=[{value:"Example usage",id:"example-usage",level:2}];function u(t){const e={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,i.R)(),...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h1,{id:"hascontext",children:"hasContext"}),"\n",(0,n.jsx)(e.p,{children:"Useful for checking if a context key exists, either programatically set beforehand or from CLI via"}),"\n",(0,n.jsx)(e.pre,{children:(0,n.jsx)(e.code,{className:"language-shell",children:"cdk -c KEY=....\n"})}),"\n",(0,n.jsx)(e.h2,{id:"example-usage",children:"Example usage"}),"\n",(0,n.jsx)(e.pre,{children:(0,n.jsx)(e.code,{className:"language-typescript",metastring:'title="YourStack.ts"',children:"import { CDKContextUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n    } = props;\n    ...\n    const hasTarget = CDKContextUtil.hasContextKey(this, 'SOME_CONTEXT_KEY_TARGET');\n    if(hasTarget) {\n      const target = scope.node.tryGetContext('SOME_CONTEXT_KEY_TARGET');\n    }\n  ...\n  }\n}\n"})})]})}function d(t={}){const{wrapper:e}={...(0,i.R)(),...t.components};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(u,{...t})}):u(t)}},1184:(t,e,s)=>{s.d(e,{R:()=>o,x:()=>r});var n=s(4041);const i={},c=n.createContext(i);function o(t){const e=n.useContext(c);return n.useMemo((function(){return"function"==typeof t?t(e):{...e,...t}}),[e,t])}function r(t){let e;return e=t.disableParentContext?"function"==typeof t.components?t.components(i):t.components||i:o(t.components),n.createElement(c.Provider,{value:e},t.children)}}}]);