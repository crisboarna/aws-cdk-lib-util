"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[436],{876:function(t,e,r){r.d(e,{Zo:function(){return l},kt:function(){return f}});var i=r(2784);function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function c(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,i)}return r}function a(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?c(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function o(t,e){if(null==t)return{};var r,i,n=function(t,e){if(null==t)return{};var r,i,n={},c=Object.keys(t);for(i=0;i<c.length;i++)r=c[i],e.indexOf(r)>=0||(n[r]=t[r]);return n}(t,e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(t);for(i=0;i<c.length;i++)r=c[i],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(n[r]=t[r])}return n}var s=i.createContext({}),u=function(t){var e=i.useContext(s),r=e;return t&&(r="function"==typeof t?t(e):a(a({},e),t)),r},l=function(t){var e=u(t.components);return i.createElement(s.Provider,{value:e},t.children)},p={inlineCode:"code",wrapper:function(t){var e=t.children;return i.createElement(i.Fragment,{},e)}},d=i.forwardRef((function(t,e){var r=t.components,n=t.mdxType,c=t.originalType,s=t.parentName,l=o(t,["components","mdxType","originalType","parentName"]),d=u(r),f=n,y=d["".concat(s,".").concat(f)]||d[f]||p[f]||c;return r?i.createElement(y,a(a({ref:e},l),{},{components:r})):i.createElement(y,a({ref:e},l))}));function f(t,e){var r=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var c=r.length,a=new Array(c);a[0]=d;var o={};for(var s in e)hasOwnProperty.call(e,s)&&(o[s]=e[s]);o.originalType=t,o.mdxType="string"==typeof t?t:n,a[1]=o;for(var u=2;u<c;u++)a[u]=r[u];return i.createElement.apply(null,a)}return i.createElement.apply(null,r)}d.displayName="MDXCreateElement"},628:function(t,e,r){r.r(e),r.d(e,{assets:function(){return l},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return o},metadata:function(){return u},toc:function(){return p}});var i=r(7896),n=r(1461),c=(r(2784),r(876)),a=["components"],o={sidebar_position:1},s="checkArtifactDirectoryExists",u={unversionedId:"utilities/cdkdirectoryutil/checkartifactdirectoryexists",id:"utilities/cdkdirectoryutil/checkartifactdirectoryexists",title:"checkArtifactDirectoryExists",description:"Simple file utility to be used when you want to ensure that a artifact path for a Lambda or a Lambda layer exists, even if you do not plan on deploying that specific stack.",source:"@site/docs/utilities/cdkdirectoryutil/checkartifactdirectoryexists.md",sourceDirName:"utilities/cdkdirectoryutil",slug:"/utilities/cdkdirectoryutil/checkartifactdirectoryexists",permalink:"/aws-cdk-lib-util/docs/utilities/cdkdirectoryutil/checkartifactdirectoryexists",editUrl:"https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/docs/docs/utilities/cdkdirectoryutil/checkartifactdirectoryexists.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"getSSMParamViaCustomResource",permalink:"/aws-cdk-lib-util/docs/utilities/cdkcustomresourceutil/getssmparamviacustomresource"},next:{title:"checkArtifactFileExists",permalink:"/aws-cdk-lib-util/docs/utilities/cdkdirectoryutil/checkartifactfileexists"}},l={},p=[{value:"Example usage",id:"example-usage",level:2}],d={toc:p};function f(t){var e=t.components,r=(0,n.Z)(t,a);return(0,c.kt)("wrapper",(0,i.Z)({},d,r,{components:e,mdxType:"MDXLayout"}),(0,c.kt)("h1",{id:"checkartifactdirectoryexists"},"checkArtifactDirectoryExists"),(0,c.kt)("p",null,"Simple file utility to be used when you want to ensure that a artifact path for a Lambda or a Lambda layer exists, even if you do not plan on deploying that specific stack."),(0,c.kt)("p",null,"Useful when you have multiple stacks in same ",(0,c.kt)("inlineCode",{parentName:"p"},"CDK")," app file but only intend to deploy one stack without building all dependencies."),(0,c.kt)("h2",{id:"example-usage"},"Example usage"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript",metastring:'title="YourStack.ts"',title:'"YourStack.ts"'},"import { App } from 'aws-cdk-lib';\nimport { CDKDirectoryUtil } from 'aws-cdk-lib-util';\n\nconst artifactPath = './dist/apps/stack2';\n\nconst app = new App();\n\nconst stack1 = new YourStack1(app,'Stack1',{...});\n\nCDKDirectoryUtil.checkArtifactDirectoryExists(artifactPath);\n\nconst stack2 = new YourStack1(app,'Stack2',{artifactPath,...});\n...\n\n")))}f.isMDXComponent=!0}}]);