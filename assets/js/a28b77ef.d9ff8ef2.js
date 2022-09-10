"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[479],{876:(t,e,r)=>{r.d(e,{Zo:()=>u,kt:()=>m});var n=r(2784);function i(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function c(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){i(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function o(t,e){if(null==t)return{};var r,n,i=function(t,e){if(null==t)return{};var r,n,i={},a=Object.keys(t);for(n=0;n<a.length;n++)r=a[n],e.indexOf(r)>=0||(i[r]=t[r]);return i}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(n=0;n<a.length;n++)r=a[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(i[r]=t[r])}return i}var s=n.createContext({}),l=function(t){var e=n.useContext(s),r=e;return t&&(r="function"==typeof t?t(e):c(c({},e),t)),r},u=function(t){var e=l(t.components);return n.createElement(s.Provider,{value:e},t.children)},p={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},d=n.forwardRef((function(t,e){var r=t.components,i=t.mdxType,a=t.originalType,s=t.parentName,u=o(t,["components","mdxType","originalType","parentName"]),d=l(r),m=i,g=d["".concat(s,".").concat(m)]||d[m]||p[m]||a;return r?n.createElement(g,c(c({ref:e},u),{},{components:r})):n.createElement(g,c({ref:e},u))}));function m(t,e){var r=arguments,i=e&&e.mdxType;if("string"==typeof t||i){var a=r.length,c=new Array(a);c[0]=d;var o={};for(var s in e)hasOwnProperty.call(e,s)&&(o[s]=e[s]);o.originalType=t,o.mdxType="string"==typeof t?t:i,c[1]=o;for(var l=2;l<a;l++)c[l]=r[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},7081:(t,e,r)=>{r.r(e),r.d(e,{assets:()=>s,contentTitle:()=>c,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var n=r(7896),i=(r(2784),r(876));const a={sidebar_position:1},c="capitalizeInputString",o={unversionedId:"utilities/cdkstringutil/capitalizeinputstring",id:"utilities/cdkstringutil/capitalizeinputstring",title:"capitalizeInputString",description:"Useful for giving a uniform PascalCase naming to your constructs.",source:"@site/docs/utilities/cdkstringutil/capitalizeinputstring.md",sourceDirName:"utilities/cdkstringutil",slug:"/utilities/cdkstringutil/capitalizeinputstring",permalink:"/aws-cdk-lib-util/docs/utilities/cdkstringutil/capitalizeinputstring",editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/cdkstringutil/capitalizeinputstring.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"getStackName",permalink:"/aws-cdk-lib-util/docs/utilities/cdkdirectoryutil/getstackname"},next:{title:"createSecretManagerSecret",permalink:"/aws-cdk-lib-util/docs/utilities/secretmanagerutil/createsecretmanagersecret"}},s={},l=[{value:"Example usage",id:"example-usage",level:2}],u={toc:l};function p(t){let{components:e,...r}=t;return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:e,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"capitalizeinputstring"},"capitalizeInputString"),(0,i.kt)("p",null,"Useful for giving a uniform ",(0,i.kt)("inlineCode",{parentName:"p"},"PascalCase")," naming to your constructs."),(0,i.kt)("h2",{id:"example-usage"},"Example usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="YourStack.ts"',title:'"YourStack.ts"'},"import { CDKStringUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n    } = props;\n    ...\n\n    const lambda = new Function(this,`${projectName}-Lambda-API-${stackEnv}`, {\n      functionName: `${projectName}-${CDKStringUtil.capitalizeInputString('lambda-api')}-${stackEnv}`\n      ...\n    });\n  ...\n  }\n}\n")))}p.isMDXComponent=!0}}]);