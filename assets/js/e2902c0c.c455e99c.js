"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[470],{876:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return g}});var n=r(2784);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},l=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),m=u(r),g=a,d=m["".concat(s,".").concat(g)]||m[g]||p[g]||i;return r?n.createElement(d,c(c({ref:t},l),{},{components:r})):n.createElement(d,c({ref:t},l))}));function g(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,c=new Array(i);c[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,c[1]=o;for(var u=2;u<i;u++)c[u]=r[u];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},3746:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return p}});var n=r(7896),a=r(1461),i=(r(2784),r(876)),c=["components"],o={sidebar_position:1},s="createSecretManagerSecret",u={unversionedId:"utilities/secretmanagerutil/createsecretmanagersecret",id:"utilities/secretmanagerutil/createsecretmanagersecret",title:"createSecretManagerSecret",description:"Creates Secrets Manager secret while adhering to same naming convention mentioned in Parameter naming",source:"@site/docs/utilities/secretmanagerutil/createsecretmanagersecret.md",sourceDirName:"utilities/secretmanagerutil",slug:"/utilities/secretmanagerutil/createsecretmanagersecret",permalink:"/aws-cdk-lib-util/docs/utilities/secretmanagerutil/createsecretmanagersecret",editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/secretmanagerutil/createsecretmanagersecret.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"capitalizeInputString",permalink:"/aws-cdk-lib-util/docs/utilities/cdkstringutil/capitalizeinputstring"},next:{title:"createSecurityGroup",permalink:"/aws-cdk-lib-util/docs/utilities/securitygrouputil/createsecuritygroup"}},l={},p=[{value:"Example usage",id:"example-usage",level:2}],m={toc:p};function g(e){var t=e.components,r=(0,a.Z)(e,c);return(0,i.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"createsecretmanagersecret"},"createSecretManagerSecret"),(0,i.kt)("p",null,"Creates ",(0,i.kt)("inlineCode",{parentName:"p"},"Secrets Manager")," secret while adhering to same naming convention mentioned in ",(0,i.kt)("a",{parentName:"p",href:"#parameter-naming"},"Parameter naming")),(0,i.kt)("h2",{id:"example-usage"},"Example usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="YourStack.ts"',title:'"YourStack.ts"'},"import { SecretManagerUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n      secret\n    } = props;\n    ...\n    const paramName = 'db/rds/auth/';\n    const paramValue = {secret};\n    \n    SecretManagerUtil.createSecretManagerSecret({\n      scope: this,\n      projectName,\n      stackEnv,\n      paramName: paramName,\n      value: paramValue,\n    });\n  ...\n  }\n}\n")))}g.isMDXComponent=!0}}]);