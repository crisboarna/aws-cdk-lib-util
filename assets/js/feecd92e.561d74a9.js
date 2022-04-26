"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[26],{876:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return d}});var n=r(2784);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),p=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},l=function(e){var t=p(e.components);return n.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=p(r),d=a,f=u["".concat(c,".").concat(d)]||u[d]||m[d]||i;return r?n.createElement(f,o(o({ref:t},l),{},{components:r})):n.createElement(f,o({ref:t},l))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},2977:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return c},default:function(){return d},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var n=r(7896),a=r(1461),i=(r(2784),r(876)),o=["components"],s={sidebar_position:3},c="getSSMParameter",p={unversionedId:"utilities/ssmutil/getssmparameter",id:"utilities/ssmutil/getssmparameter",title:"getSSMParameter",description:"You can optionally provide the extract parameter to false to return the ParameterString object. This can be used in locations where the CDK parameter object is expected, for example, by passing it in to ECS environment directly.",source:"@site/docs/utilities/ssmutil/getssmparameter.md",sourceDirName:"utilities/ssmutil",slug:"/utilities/ssmutil/getssmparameter",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/getssmparameter",editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/ssmutil/getssmparameter.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"createSSMParameterList",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/createssmparameterlist"},next:{title:"getSSMParameterList",permalink:"/aws-cdk-lib-util/docs/utilities/ssmutil/getssmparameterlist"}},l={},m=[{value:"Example usage",id:"example-usage",level:2}],u={toc:m};function d(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"getssmparameter"},"getSSMParameter"),(0,i.kt)("p",null,"You can optionally provide the ",(0,i.kt)("inlineCode",{parentName:"p"},"extract")," parameter to false to return the ",(0,i.kt)("inlineCode",{parentName:"p"},"ParameterString")," object. This can be used in locations where the ",(0,i.kt)("inlineCode",{parentName:"p"},"CDK")," parameter object is expected, for example, by passing it in to ECS environment directly."),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The ",(0,i.kt)("inlineCode",{parentName:"p"},"SSM")," parameter name must adhere to the naming convention specified in ",(0,i.kt)("a",{parentName:"p",href:"/docs/intro#parameter-naming"},"Parameter naming"),"."))),(0,i.kt)("h2",{id:"example-usage"},"Example usage"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="YourStack.ts"',title:'"YourStack.ts"'},"import { SSMUtil } from 'aws-cdk-lib-util';\n...\n\nexport class YourStack extends Stack {\n  constructor(scope: Construct, id: string, props: IYourStackProps) {\n    super(scope, id, props);\n\n    const {\n      projectName,\n      stackEnv,\n      secret\n    } = props;\n    ...\n    const paramName = 'vpc/sg/id/api';\n    \n    const apiSgId = SSMUtil.getSSMParameter({\n      scope: this,\n      projectName,\n      stackEnv,\n      paramName: paramName,\n    });\n  ...\n  }\n}\n")))}d.isMDXComponent=!0}}]);