import{q as r,r as S,v as Qe,u as ea,j as e,g as aa,B as je,s as Re,F as ta,l as oa,t as Ae,w as ra,x as na,y as Me,A as sa,p as ia,o as la}from"./vendor-76e8fbeb.js";import{C as we,H as da,F as ca}from"./Footer-86ece21d.js";import{_ as ua}from"./index-76c473c5.js";import{B as ne}from"./button-f27569b5.js";import{validateEmail as ma,subscribeToNewsletter as ya}from"./newsletterHelpers-9820e1d4.js";import"./index-eb76685c.js";var wa=t=>{switch(t){case"success":return ga;case"info":return ba;case"warning":return fa;case"error":return ka;default:return null}},pa=Array(12).fill(0),ha=({visible:t,className:o})=>r.createElement("div",{className:["sonner-loading-wrapper",o].filter(Boolean).join(" "),"data-visible":t},r.createElement("div",{className:"sonner-spinner"},pa.map((n,l)=>r.createElement("div",{className:"sonner-loading-bar",key:`spinner-bar-${l}`})))),ga=r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},r.createElement("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",clipRule:"evenodd"})),fa=r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},r.createElement("path",{fillRule:"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",clipRule:"evenodd"})),ba=r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},r.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",clipRule:"evenodd"})),ka=r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},r.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",clipRule:"evenodd"})),za=r.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"},r.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),r.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"})),xa=()=>{let[t,o]=r.useState(document.hidden);return r.useEffect(()=>{let n=()=>{o(document.hidden)};return document.addEventListener("visibilitychange",n),()=>window.removeEventListener("visibilitychange",n)},[]),t},ve=1,ja=class{constructor(){this.subscribe=t=>(this.subscribers.push(t),()=>{let o=this.subscribers.indexOf(t);this.subscribers.splice(o,1)}),this.publish=t=>{this.subscribers.forEach(o=>o(t))},this.addToast=t=>{this.publish(t),this.toasts=[...this.toasts,t]},this.create=t=>{var o;let{message:n,...l}=t,m=typeof(t==null?void 0:t.id)=="number"||((o=t.id)==null?void 0:o.length)>0?t.id:ve++,k=this.toasts.find(x=>x.id===m),j=t.dismissible===void 0?!0:t.dismissible;return this.dismissedToasts.has(m)&&this.dismissedToasts.delete(m),k?this.toasts=this.toasts.map(x=>x.id===m?(this.publish({...x,...t,id:m,title:n}),{...x,...t,id:m,dismissible:j,title:n}):x):this.addToast({title:n,...l,dismissible:j,id:m}),m},this.dismiss=t=>(this.dismissedToasts.add(t),t||this.toasts.forEach(o=>{this.subscribers.forEach(n=>n({id:o.id,dismiss:!0}))}),this.subscribers.forEach(o=>o({id:t,dismiss:!0})),t),this.message=(t,o)=>this.create({...o,message:t}),this.error=(t,o)=>this.create({...o,message:t,type:"error"}),this.success=(t,o)=>this.create({...o,type:"success",message:t}),this.info=(t,o)=>this.create({...o,type:"info",message:t}),this.warning=(t,o)=>this.create({...o,type:"warning",message:t}),this.loading=(t,o)=>this.create({...o,type:"loading",message:t}),this.promise=(t,o)=>{if(!o)return;let n;o.loading!==void 0&&(n=this.create({...o,promise:t,type:"loading",message:o.loading,description:typeof o.description!="function"?o.description:void 0}));let l=t instanceof Promise?t:t(),m=n!==void 0,k,j=l.then(async c=>{if(k=["resolve",c],r.isValidElement(c))m=!1,this.create({id:n,type:"default",message:c});else if(Na(c)&&!c.ok){m=!1;let y=typeof o.error=="function"?await o.error(`HTTP error! status: ${c.status}`):o.error,z=typeof o.description=="function"?await o.description(`HTTP error! status: ${c.status}`):o.description;this.create({id:n,type:"error",message:y,description:z})}else if(o.success!==void 0){m=!1;let y=typeof o.success=="function"?await o.success(c):o.success,z=typeof o.description=="function"?await o.description(c):o.description;this.create({id:n,type:"success",message:y,description:z})}}).catch(async c=>{if(k=["reject",c],o.error!==void 0){m=!1;let y=typeof o.error=="function"?await o.error(c):o.error,z=typeof o.description=="function"?await o.description(c):o.description;this.create({id:n,type:"error",message:y,description:z})}}).finally(()=>{var c;m&&(this.dismiss(n),n=void 0),(c=o.finally)==null||c.call(o)}),x=()=>new Promise((c,y)=>j.then(()=>k[0]==="reject"?y(k[1]):c(k[1])).catch(y));return typeof n!="string"&&typeof n!="number"?{unwrap:x}:Object.assign(n,{unwrap:x})},this.custom=(t,o)=>{let n=(o==null?void 0:o.id)||ve++;return this.create({jsx:t(n),id:n,...o}),n},this.getActiveToasts=()=>this.toasts.filter(t=>!this.dismissedToasts.has(t.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}},N=new ja,va=(t,o)=>{let n=(o==null?void 0:o.id)||ve++;return N.addToast({title:t,...o,id:n}),n},Na=t=>t&&typeof t=="object"&&"ok"in t&&typeof t.ok=="boolean"&&"status"in t&&typeof t.status=="number",Pa=va,Ea=()=>N.toasts,Ca=()=>N.getActiveToasts(),Ie=Object.assign(Pa,{success:N.success,info:N.info,warning:N.warning,error:N.error,custom:N.custom,message:N.message,promise:N.promise,dismiss:N.dismiss,loading:N.loading},{getHistory:Ea,getToasts:Ca});function Sa(t,{insertAt:o}={}){if(!t||typeof document>"u")return;let n=document.head||document.getElementsByTagName("head")[0],l=document.createElement("style");l.type="text/css",o==="top"&&n.firstChild?n.insertBefore(l,n.firstChild):n.appendChild(l),l.styleSheet?l.styleSheet.cssText=t:l.appendChild(document.createTextNode(t))}Sa(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);function pe(t){return t.label!==void 0}var Ba=3,Da="32px",Ta="16px",We=4e3,Ra=356,Aa=14,Ia=20,Wa=200;function I(...t){return t.filter(Boolean).join(" ")}function _a(t){let[o,n]=t.split("-"),l=[];return o&&l.push(o),n&&l.push(n),l}var Ka=t=>{var o,n,l,m,k,j,x,c,y,z,K;let{invert:$,toast:a,unstyled:ee,interacting:g,setHeights:P,visibleToasts:M,heights:L,index:s,toasts:B,expanded:O,removeToast:D,defaultRichColors:ae,closeButton:se,style:ie,cancelButtonStyle:he,actionButtonStyle:le,className:W="",descriptionClassName:de="",duration:J,position:ce,gap:Z,loadingIcon:_,expandByDefault:ue,classNames:d,icons:E,closeButtonAriaLabel:ge="Close toast",pauseWhenPageIsHidden:w}=t,[p,f]=r.useState(null),[v,G]=r.useState(null),[b,fe]=r.useState(!1),[te,me]=r.useState(!1),[oe,be]=r.useState(!1),[Ne,Le]=r.useState(!1),[Oe,Pe]=r.useState(!1),[Ue,ke]=r.useState(0),[Fe,Ee]=r.useState(0),re=r.useRef(a.duration||J||We),Ce=r.useRef(null),Y=r.useRef(null),Ve=s===0,Ze=s+1<=M,C=a.type,X=a.dismissible!==!1,Ye=a.className||"",He=a.descriptionClassName||"",ye=r.useMemo(()=>L.findIndex(i=>i.toastId===a.id)||0,[L,a.id]),$e=r.useMemo(()=>{var i;return(i=a.closeButton)!=null?i:se},[a.closeButton,se]),Se=r.useMemo(()=>a.duration||J||We,[a.duration,J]),ze=r.useRef(0),q=r.useRef(0),Be=r.useRef(0),Q=r.useRef(null),[Je,Ge]=ce.split("-"),De=r.useMemo(()=>L.reduce((i,u,h)=>h>=ye?i:i+u.height,0),[L,ye]),Te=xa(),Xe=a.invert||$,xe=C==="loading";q.current=r.useMemo(()=>ye*Z+De,[ye,De]),r.useEffect(()=>{re.current=Se},[Se]),r.useEffect(()=>{fe(!0)},[]),r.useEffect(()=>{let i=Y.current;if(i){let u=i.getBoundingClientRect().height;return Ee(u),P(h=>[{toastId:a.id,height:u,position:a.position},...h]),()=>P(h=>h.filter(T=>T.toastId!==a.id))}},[P,a.id]),r.useLayoutEffect(()=>{if(!b)return;let i=Y.current,u=i.style.height;i.style.height="auto";let h=i.getBoundingClientRect().height;i.style.height=u,Ee(h),P(T=>T.find(R=>R.toastId===a.id)?T.map(R=>R.toastId===a.id?{...R,height:h}:R):[{toastId:a.id,height:h,position:a.position},...T])},[b,a.title,a.description,P,a.id]);let U=r.useCallback(()=>{me(!0),ke(q.current),P(i=>i.filter(u=>u.toastId!==a.id)),setTimeout(()=>{D(a)},Wa)},[a,D,P,q]);r.useEffect(()=>{if(a.promise&&C==="loading"||a.duration===1/0||a.type==="loading")return;let i;return O||g||w&&Te?(()=>{if(Be.current<ze.current){let u=new Date().getTime()-ze.current;re.current=re.current-u}Be.current=new Date().getTime()})():re.current!==1/0&&(ze.current=new Date().getTime(),i=setTimeout(()=>{var u;(u=a.onAutoClose)==null||u.call(a,a),U()},re.current)),()=>clearTimeout(i)},[O,g,a,C,w,Te,U]),r.useEffect(()=>{a.delete&&U()},[U,a.delete]);function qe(){var i,u,h;return E!=null&&E.loading?r.createElement("div",{className:I(d==null?void 0:d.loader,(i=a==null?void 0:a.classNames)==null?void 0:i.loader,"sonner-loader"),"data-visible":C==="loading"},E.loading):_?r.createElement("div",{className:I(d==null?void 0:d.loader,(u=a==null?void 0:a.classNames)==null?void 0:u.loader,"sonner-loader"),"data-visible":C==="loading"},_):r.createElement(ha,{className:I(d==null?void 0:d.loader,(h=a==null?void 0:a.classNames)==null?void 0:h.loader),visible:C==="loading"})}return r.createElement("li",{tabIndex:0,ref:Y,className:I(W,Ye,d==null?void 0:d.toast,(o=a==null?void 0:a.classNames)==null?void 0:o.toast,d==null?void 0:d.default,d==null?void 0:d[C],(n=a==null?void 0:a.classNames)==null?void 0:n[C]),"data-sonner-toast":"","data-rich-colors":(l=a.richColors)!=null?l:ae,"data-styled":!(a.jsx||a.unstyled||ee),"data-mounted":b,"data-promise":!!a.promise,"data-swiped":Oe,"data-removed":te,"data-visible":Ze,"data-y-position":Je,"data-x-position":Ge,"data-index":s,"data-front":Ve,"data-swiping":oe,"data-dismissible":X,"data-type":C,"data-invert":Xe,"data-swipe-out":Ne,"data-swipe-direction":v,"data-expanded":!!(O||ue&&b),style:{"--index":s,"--toasts-before":s,"--z-index":B.length-s,"--offset":`${te?Ue:q.current}px`,"--initial-height":ue?"auto":`${Fe}px`,...ie,...a.style},onDragEnd:()=>{be(!1),f(null),Q.current=null},onPointerDown:i=>{xe||!X||(Ce.current=new Date,ke(q.current),i.target.setPointerCapture(i.pointerId),i.target.tagName!=="BUTTON"&&(be(!0),Q.current={x:i.clientX,y:i.clientY}))},onPointerUp:()=>{var i,u,h,T;if(Ne||!X)return;Q.current=null;let R=Number(((i=Y.current)==null?void 0:i.style.getPropertyValue("--swipe-amount-x").replace("px",""))||0),F=Number(((u=Y.current)==null?void 0:u.style.getPropertyValue("--swipe-amount-y").replace("px",""))||0),H=new Date().getTime()-((h=Ce.current)==null?void 0:h.getTime()),A=p==="x"?R:F,V=Math.abs(A)/H;if(Math.abs(A)>=Ia||V>.11){ke(q.current),(T=a.onDismiss)==null||T.call(a,a),G(p==="x"?R>0?"right":"left":F>0?"down":"up"),U(),Le(!0),Pe(!1);return}be(!1),f(null)},onPointerMove:i=>{var u,h,T,R;if(!Q.current||!X||((u=window.getSelection())==null?void 0:u.toString().length)>0)return;let F=i.clientY-Q.current.y,H=i.clientX-Q.current.x,A=(h=t.swipeDirections)!=null?h:_a(ce);!p&&(Math.abs(H)>1||Math.abs(F)>1)&&f(Math.abs(H)>Math.abs(F)?"x":"y");let V={x:0,y:0};p==="y"?(A.includes("top")||A.includes("bottom"))&&(A.includes("top")&&F<0||A.includes("bottom")&&F>0)&&(V.y=F):p==="x"&&(A.includes("left")||A.includes("right"))&&(A.includes("left")&&H<0||A.includes("right")&&H>0)&&(V.x=H),(Math.abs(V.x)>0||Math.abs(V.y)>0)&&Pe(!0),(T=Y.current)==null||T.style.setProperty("--swipe-amount-x",`${V.x}px`),(R=Y.current)==null||R.style.setProperty("--swipe-amount-y",`${V.y}px`)}},$e&&!a.jsx?r.createElement("button",{"aria-label":ge,"data-disabled":xe,"data-close-button":!0,onClick:xe||!X?()=>{}:()=>{var i;U(),(i=a.onDismiss)==null||i.call(a,a)},className:I(d==null?void 0:d.closeButton,(m=a==null?void 0:a.classNames)==null?void 0:m.closeButton)},(k=E==null?void 0:E.close)!=null?k:za):null,a.jsx||S.isValidElement(a.title)?a.jsx?a.jsx:typeof a.title=="function"?a.title():a.title:r.createElement(r.Fragment,null,C||a.icon||a.promise?r.createElement("div",{"data-icon":"",className:I(d==null?void 0:d.icon,(j=a==null?void 0:a.classNames)==null?void 0:j.icon)},a.promise||a.type==="loading"&&!a.icon?a.icon||qe():null,a.type!=="loading"?a.icon||(E==null?void 0:E[C])||wa(C):null):null,r.createElement("div",{"data-content":"",className:I(d==null?void 0:d.content,(x=a==null?void 0:a.classNames)==null?void 0:x.content)},r.createElement("div",{"data-title":"",className:I(d==null?void 0:d.title,(c=a==null?void 0:a.classNames)==null?void 0:c.title)},typeof a.title=="function"?a.title():a.title),a.description?r.createElement("div",{"data-description":"",className:I(de,He,d==null?void 0:d.description,(y=a==null?void 0:a.classNames)==null?void 0:y.description)},typeof a.description=="function"?a.description():a.description):null),S.isValidElement(a.cancel)?a.cancel:a.cancel&&pe(a.cancel)?r.createElement("button",{"data-button":!0,"data-cancel":!0,style:a.cancelButtonStyle||he,onClick:i=>{var u,h;pe(a.cancel)&&X&&((h=(u=a.cancel).onClick)==null||h.call(u,i),U())},className:I(d==null?void 0:d.cancelButton,(z=a==null?void 0:a.classNames)==null?void 0:z.cancelButton)},a.cancel.label):null,S.isValidElement(a.action)?a.action:a.action&&pe(a.action)?r.createElement("button",{"data-button":!0,"data-action":!0,style:a.actionButtonStyle||le,onClick:i=>{var u,h;pe(a.action)&&((h=(u=a.action).onClick)==null||h.call(u,i),!i.defaultPrevented&&U())},className:I(d==null?void 0:d.actionButton,(K=a==null?void 0:a.classNames)==null?void 0:K.actionButton)},a.action.label):null))};function _e(){if(typeof window>"u"||typeof document>"u")return"ltr";let t=document.documentElement.getAttribute("dir");return t==="auto"||!t?window.getComputedStyle(document.documentElement).direction:t}function Ma(t,o){let n={};return[t,o].forEach((l,m)=>{let k=m===1,j=k?"--mobile-offset":"--offset",x=k?Ta:Da;function c(y){["top","right","bottom","left"].forEach(z=>{n[`${j}-${z}`]=typeof y=="number"?`${y}px`:y})}typeof l=="number"||typeof l=="string"?c(l):typeof l=="object"?["top","right","bottom","left"].forEach(y=>{l[y]===void 0?n[`${j}-${y}`]=x:n[`${j}-${y}`]=typeof l[y]=="number"?`${l[y]}px`:l[y]}):c(x)}),n}S.forwardRef(function(t,o){let{invert:n,position:l="bottom-right",hotkey:m=["altKey","KeyT"],expand:k,closeButton:j,className:x,offset:c,mobileOffset:y,theme:z="light",richColors:K,duration:$,style:a,visibleToasts:ee=Ba,toastOptions:g,dir:P=_e(),gap:M=Aa,loadingIcon:L,icons:s,containerAriaLabel:B="Notifications",pauseWhenPageIsHidden:O}=t,[D,ae]=r.useState([]),se=r.useMemo(()=>Array.from(new Set([l].concat(D.filter(w=>w.position).map(w=>w.position)))),[D,l]),[ie,he]=r.useState([]),[le,W]=r.useState(!1),[de,J]=r.useState(!1),[ce,Z]=r.useState(z!=="system"?z:typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),_=r.useRef(null),ue=m.join("+").replace(/Key/g,"").replace(/Digit/g,""),d=r.useRef(null),E=r.useRef(!1),ge=r.useCallback(w=>{ae(p=>{var f;return(f=p.find(v=>v.id===w.id))!=null&&f.delete||N.dismiss(w.id),p.filter(({id:v})=>v!==w.id)})},[]);return r.useEffect(()=>N.subscribe(w=>{if(w.dismiss){ae(p=>p.map(f=>f.id===w.id?{...f,delete:!0}:f));return}setTimeout(()=>{Qe.flushSync(()=>{ae(p=>{let f=p.findIndex(v=>v.id===w.id);return f!==-1?[...p.slice(0,f),{...p[f],...w},...p.slice(f+1)]:[w,...p]})})})}),[]),r.useEffect(()=>{if(z!=="system"){Z(z);return}if(z==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?Z("dark"):Z("light")),typeof window>"u")return;let w=window.matchMedia("(prefers-color-scheme: dark)");try{w.addEventListener("change",({matches:p})=>{Z(p?"dark":"light")})}catch{w.addListener(({matches:f})=>{try{Z(f?"dark":"light")}catch(v){console.error(v)}})}},[z]),r.useEffect(()=>{D.length<=1&&W(!1)},[D]),r.useEffect(()=>{let w=p=>{var f,v;m.every(G=>p[G]||p.code===G)&&(W(!0),(f=_.current)==null||f.focus()),p.code==="Escape"&&(document.activeElement===_.current||(v=_.current)!=null&&v.contains(document.activeElement))&&W(!1)};return document.addEventListener("keydown",w),()=>document.removeEventListener("keydown",w)},[m]),r.useEffect(()=>{if(_.current)return()=>{d.current&&(d.current.focus({preventScroll:!0}),d.current=null,E.current=!1)}},[_.current]),r.createElement("section",{ref:o,"aria-label":`${B} ${ue}`,tabIndex:-1,"aria-live":"polite","aria-relevant":"additions text","aria-atomic":"false",suppressHydrationWarning:!0},se.map((w,p)=>{var f;let[v,G]=w.split("-");return D.length?r.createElement("ol",{key:w,dir:P==="auto"?_e():P,tabIndex:-1,ref:_,className:x,"data-sonner-toaster":!0,"data-theme":ce,"data-y-position":v,"data-lifted":le&&D.length>1&&!k,"data-x-position":G,style:{"--front-toast-height":`${((f=ie[0])==null?void 0:f.height)||0}px`,"--width":`${Ra}px`,"--gap":`${M}px`,...a,...Ma(c,y)},onBlur:b=>{E.current&&!b.currentTarget.contains(b.relatedTarget)&&(E.current=!1,d.current&&(d.current.focus({preventScroll:!0}),d.current=null))},onFocus:b=>{b.target instanceof HTMLElement&&b.target.dataset.dismissible==="false"||E.current||(E.current=!0,d.current=b.relatedTarget)},onMouseEnter:()=>W(!0),onMouseMove:()=>W(!0),onMouseLeave:()=>{de||W(!1)},onDragEnd:()=>W(!1),onPointerDown:b=>{b.target instanceof HTMLElement&&b.target.dataset.dismissible==="false"||J(!0)},onPointerUp:()=>J(!1)},D.filter(b=>!b.position&&p===0||b.position===w).map((b,fe)=>{var te,me;return r.createElement(Ka,{key:b.id,icons:s,index:fe,toast:b,defaultRichColors:K,duration:(te=g==null?void 0:g.duration)!=null?te:$,className:g==null?void 0:g.className,descriptionClassName:g==null?void 0:g.descriptionClassName,invert:n,visibleToasts:ee,closeButton:(me=g==null?void 0:g.closeButton)!=null?me:j,interacting:de,position:w,style:g==null?void 0:g.style,unstyled:g==null?void 0:g.unstyled,classNames:g==null?void 0:g.classNames,cancelButtonStyle:g==null?void 0:g.cancelButtonStyle,actionButtonStyle:g==null?void 0:g.actionButtonStyle,removeToast:ge,toasts:D.filter(oe=>oe.position==b.position),heights:ie.filter(oe=>oe.position==b.position),setHeights:he,expandByDefault:k,gap:M,loadingIcon:L,expanded:le,pauseWhenPageIsHidden:O,swipeDirections:t.swipeDirections})})):null}))});const La=()=>e.jsxs("div",{className:"text-center py-16 glass-card",children:[e.jsx(je,{className:"h-16 w-16 mx-auto text-slate-500 mb-4"}),e.jsx("h3",{className:"text-lg font-medium text-white mb-2",children:"Brak artykułów"}),e.jsx("p",{className:"text-slate-400",children:"Nie znaleziono artykułów spełniających kryteria wyszukiwania."})]}),Oa=()=>e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[1,2,3,4,5,6].map(t=>e.jsxs("div",{className:"glass-card overflow-hidden animate-pulse",children:[e.jsx("div",{className:"h-48 bg-slate-700/50"}),e.jsxs("div",{className:"p-6 space-y-4",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("div",{className:"h-6 w-24 bg-slate-700/50 rounded"}),e.jsx("div",{className:"h-5 w-32 bg-slate-700/50 rounded"})]}),e.jsx("div",{className:"h-8 w-full bg-slate-700/50 rounded"}),e.jsx("div",{className:"h-20 w-full bg-slate-700/50 rounded"}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("div",{className:"h-6 w-32 bg-slate-700/50 rounded"}),e.jsx("div",{className:"h-8 w-28 bg-slate-700/50 rounded"})]})]})]},t))}),Ua=t=>t?new Date(t).toLocaleDateString("pl-PL",{year:"numeric",month:"long",day:"numeric"}):"",Fa=t=>{var l;const n=((l=t==null?void 0:t.split(/\s+/))==null?void 0:l.length)||0;return Math.ceil(n/200)||1},Va=({post:t,onClick:o})=>{const n=Fa(t.excerpt+t.content);return e.jsxs("div",{className:"glass-card overflow-hidden hover-lift card-border-glow group cursor-pointer",onClick:o,children:[t.image_url&&e.jsxs("div",{className:"h-48 overflow-hidden relative",children:[e.jsx("img",{src:t.image_url,alt:t.title,className:"w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"})]}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsx("span",{className:"px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-medium",children:t.category}),e.jsx("div",{className:"flex items-center text-sm text-slate-400 gap-3",children:e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(ia,{className:"w-4 h-4"}),n," min"]})})]}),e.jsx("h3",{className:"text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2",children:t.title}),e.jsx("p",{className:"text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed",children:t.excerpt}),e.jsxs("div",{className:"flex justify-between items-center pt-4 border-t border-white/10",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center",children:e.jsx(Me,{className:"w-4 h-4 text-slate-900"})}),e.jsxs("div",{children:[e.jsx("span",{className:"text-sm text-white",children:t.author}),e.jsx("p",{className:"text-xs text-slate-500",children:Ua(t.published_at)})]})]}),e.jsxs("div",{className:"flex items-center text-amber-400 text-sm font-medium group-hover:gap-2 transition-all",children:[e.jsx("span",{children:"Czytaj"}),e.jsx(la,{className:"w-4 h-4 group-hover:translate-x-1 transition-transform"})]})]})]})]})},Ke=[{id:"1",title:"Rozporządzenie CPR (EU) 2024/3110 - Kompletny przewodnik dla producentów",slug:"cpr-2024-przewodnik",excerpt:"Wszystko co musisz wiedzieć o nowym rozporządzeniu w sprawie wyrobów budowlanych. Kluczowe zmiany, terminy wejścia w życie od 8 stycznia 2025 i obowiązki producentów.",content:`# Rozporządzenie CPR (EU) 2024/3110 - Kompletny przewodnik

## Wprowadzenie
Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2024/3110 z dnia 13 grudnia 2024 r. ustanawia zharmonizowane warunki wprowadzania do obrotu wyrobów budowlanych. Weszło w życie **8 stycznia 2025 roku**.

## Kluczowe zmiany
1. **Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP)** - obowiązkowa od 2027
2. **Paszport produktu budowlanego** - nowe wymagania środowiskowe
3. **Rozszerzone wymagania AVCP** - zaostrzone kontrole
4. **Sustainability requirements** - informacje o zrównoważonym rozwoju

## Terminy wdrożenia
- 8 stycznia 2025 - wejście w życie
- 2026 - okres przejściowy
- 2027 - pełne wdrożenie Digital DoP

## Obowiązki producentów
Producenci muszą zapewnić:
- Zgodność z normami zharmonizowanymi
- Prawidłową dokumentację techniczną
- Oznakowanie CE ze wszystkimi wymaganymi informacjami
- Deklarację właściwości użytkowych (DoP)`,author:"dr inż. Jan Kowalski",published_at:"2026-01-08",is_published:!0,category:"Przewodniki",image_url:"/images/blog/certyfikacja.jpg",tags:["CPR 2024","przepisy","wyroby budowlane","EU"]},{id:"2",title:"Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP) - Praktyczny poradnik",slug:"cyfrowa-dop",excerpt:"Jak przygotować się do obowiązkowej cyfryzacji dokumentacji produktów budowlanych zgodnie z CPR 2024. Format danych, wymagania techniczne i harmonogram wdrożenia.",content:`# Cyfrowa Deklaracja Właściwości Użytkowych (Digital DoP)

## Czym jest Digital DoP?
Digital DoP to elektroniczna forma deklaracji właściwości użytkowych, która zastąpi tradycyjne dokumenty papierowe. Format oparty na standardach XML/JSON umożliwi automatyczne przetwarzanie danych.

## Wymagania techniczne
- Format: strukturyzowany XML lub JSON
- Podpis elektroniczny: kwalifikowany lub zaawansowany
- Repozytorium: dostęp przez unikalny identyfikator (QR kod)
- Archiwizacja: minimum 10 lat

## Harmonogram wdrożenia
- 2025: Przygotowanie infrastruktury
- 2026: Testy pilotażowe
- 2027: Obowiązkowe stosowanie

## Korzyści
1. Automatyzacja procesów weryfikacji
2. Łatwiejszy dostęp do informacji
3. Redukcja kosztów administracyjnych
4. Lepsza identyfikowalność produktów`,author:"mgr inż. Anna Nowak",published_at:"2026-01-05",is_published:!0,category:"Digital DoP",image_url:"/images/blog/certyfikacja.jpg",tags:["Digital DoP","cyfryzacja","dokumentacja","XML"]},{id:"3",title:"Oznakowanie CE wyrobów budowlanych - nowe wymagania 2026",slug:"oznakowanie-ce-2026",excerpt:"Zmiany w oznakowaniu CE dla producentów wyrobów budowlanych. Praktyczne wskazówki, nowe elementy etykiety i przykłady zgodne z CPR (EU) 2024/3110.",content:`# Oznakowanie CE wyrobów budowlanych - 2026

## Nowe wymagania
CPR 2024/3110 wprowadza rozszerzone wymagania dotyczące oznakowania CE:

1. **Numer referencyjny Digital DoP** - obowiązkowy QR kod
2. **Informacje środowiskowe** - klasa zrównoważoności
3. **Dane producenta** - rozszerzone informacje kontaktowe

## Elementy etykiety CE
- Symbol CE (min. 5mm wysokości)
- Numer jednostki notyfikowanej (jeśli dotyczy)
- Nazwa/znak producenta
- Adres producenta
- Kod identyfikacyjny produktu
- Nr Digital DoP / link do repozytorium
- Zamierzone zastosowanie
- Deklarowane właściwości użytkowe

## Sankcje
Nieprawidłowe oznakowanie CE może skutkować:
- Wycofaniem produktu z rynku
- Karami finansowymi
- Odpowiedzialnością cywilną`,author:"dr inż. Piotr Wiśniewski",published_at:"2026-01-02",is_published:!0,category:"Certyfikacja",image_url:"/images/blog/certyfikacja.jpg",tags:["CE","oznakowanie","certyfikacja","etykieta"]},{id:"4",title:"System AVCP - Ocena i weryfikacja stałości właściwości użytkowych",slug:"system-avcp",excerpt:"Kompletny przegląd systemów oceny AVCP 1+, 1, 2+, 3 i 4. Który system dotyczy Twojego produktu, jakie są wymagania i koszty certyfikacji?",content:`# Systemy AVCP w CPR 2024

## Przegląd systemów

### System 1+ (najwyższy poziom)
- Pełna certyfikacja przez jednostkę notyfikowaną
- Ciągły nadzór nad produkcją
- Badania próbek z rynku
- Produkty: konstrukcyjne elementy stalowe, cement

### System 1
- Certyfikacja wstępna
- Ciągły nadzór nad FPC
- Produkty: drzwi przeciwpożarowe, okna

### System 2+
- Certyfikacja zakładowej kontroli produkcji
- Badania typu przez producenta
- Produkty: prefabrykaty betonowe, kruszywa

### System 3
- Badania typu przez jednostkę notyfikowaną
- FPC przez producenta
- Produkty: wyroby izolacyjne

### System 4
- Samodzielna deklaracja producenta
- Produkty: armatura sanitarna

## Koszty typowej certyfikacji
- System 1+: 15 000 - 50 000 PLN rocznie
- System 2+: 5 000 - 15 000 PLN rocznie`,author:"dr hab. Marek Zieliński",published_at:"2025-12-20",is_published:!0,category:"Certyfikacja",image_url:"/images/blog/certyfikacja.jpg",tags:["AVCP","systemy oceny","certyfikacja","jednostki notyfikowane"]},{id:"5",title:"Zharmonizowane normy europejskie (hEN) - aktualizacje 2026",slug:"normy-zharmonizowane-2026",excerpt:"Aktualna lista norm zharmonizowanych dla wyrobów budowlanych. Co nowego w 2026 roku, które normy uległy zmianie i jak się przygotować?",content:`# Normy zharmonizowane 2026

## Nowe i zaktualizowane normy

### Wyroby konstrukcyjne
- EN 1090-1:2024 - Konstrukcje stalowe i aluminiowe
- EN 1992-1-1:2025 - Projektowanie konstrukcji betonowych (Eurokod 2)
- EN 13369:2024 - Wyroby prefabrykowane z betonu

### Wyroby izolacyjne
- EN 13162:2024 - Wyroby z wełny mineralnej
- EN 13163:2024 - Wyroby z EPS
- EN 13164:2024 - Wyroby z XPS

### Okna i drzwi
- EN 14351-1:2024 - Okna i drzwi zewnętrzne
- EN 16034:2024 - Wyroby drzwiowe do ochrony przeciwpożarowej

## Jak śledzić zmiany?
1. Dziennik Urzędowy UE - oficjalne publikacje
2. CEN/CENELEC - komitety normalizacyjne
3. PKN - Polski Komitet Normalizacyjny
4. NowyCPR.pl - bieżące informacje`,author:"mgr inż. Katarzyna Dąbrowska",published_at:"2025-12-15",is_published:!0,category:"Normy",image_url:"/images/blog/certyfikacja.jpg",tags:["normy","hEN","standardy","EN"]},{id:"6",title:"Paszport produktu budowlanego - nowy wymóg CPR",slug:"paszport-produktu",excerpt:"Czym jest paszport produktu budowlanego i jak go przygotować? Wymagania dotyczące informacji o zrównoważonym rozwoju, cyklu życia produktu i gospodarki o obiegu zamkniętym.",content:`# Paszport produktu budowlanego

## Definicja
Paszport produktu to cyfrowy dokument zawierający kompleksowe informacje o produkcie budowlanym przez cały jego cykl życia - od produkcji przez użytkowanie po recykling.

## Wymagane informacje

### Dane podstawowe
- Identyfikator produktu
- Producent i łańcuch dostaw
- Skład materiałowy

### Informacje środowiskowe
- Ślad węglowy (GWP)
- Zużycie energii w produkcji
- Potencjał recyklingu
- Klasa cyrkularna

### Cykl życia
- Przewidywana trwałość
- Instrukcje konserwacji
- Wskazówki demontażu
- Opcje ponownego użycia

## Powiązanie z EPD
Paszport produktu będzie bazował na danych z Deklaracji Środowiskowej Produktu (EPD) zgodnej z EN 15804+A2.`,author:"dr inż. Tomasz Kamiński",published_at:"2025-12-10",is_published:!0,category:"Przepisy",image_url:"/images/blog/certyfikacja.jpg",tags:["paszport produktu","zrównoważoność","ESG","cyrkularność"]},{id:"7",title:"EPD - Deklaracja Środowiskowa Produktu dla wyrobów budowlanych",slug:"epd-deklaracja-srodowiskowa",excerpt:"Jak przygotować EPD zgodnie z EN 15804+A2? Wymagania, proces weryfikacji, koszty i korzyści dla producentów wyrobów budowlanych.",content:`# EPD - Deklaracja Środowiskowa Produktu

## Czym jest EPD?
Environmental Product Declaration (EPD) to znormalizowany dokument prezentujący dane środowiskowe produktu przez cały cykl życia.

## Norma EN 15804+A2
Kluczowe wymagania:
- Etapy A1-A3: Produkcja
- Etapy A4-A5: Transport i montaż
- Etapy B1-B7: Użytkowanie
- Etapy C1-C4: Koniec życia
- Etap D: Korzyści poza systemem

## Proces przygotowania EPD
1. Analiza LCA (Life Cycle Assessment)
2. Przygotowanie raportu środowiskowego
3. Weryfikacja przez niezależną stronę trzecią
4. Rejestracja w programie EPD (np. IBU, EPD Norway)

## Koszty
- LCA: 10 000 - 30 000 PLN
- Weryfikacja: 5 000 - 15 000 PLN
- Rejestracja: 2 000 - 5 000 PLN

## Ważność
EPD jest ważna przez 5 lat od daty weryfikacji.`,author:"dr Magdalena Lewandowska",published_at:"2025-12-05",is_published:!0,category:"Środowisko",image_url:"/images/blog/srodowisko.jpg",tags:["EPD","LCA","środowisko","EN 15804"]},{id:"8",title:"Zakładowa Kontrola Produkcji (FPC) - wymagania i wdrożenie",slug:"zakładowa-kontrola-produkcji-fpc",excerpt:"Jak wdrożyć i utrzymać system Zakładowej Kontroli Produkcji zgodny z CPR 2024? Dokumentacja, procedury, audyty i najczęstsze błędy.",content:`# Zakładowa Kontrola Produkcji (FPC)

## Definicja
Factory Production Control (FPC) to udokumentowany, stały i wewnętrzny system kontroli produkcji prowadzony przez producenta.

## Wymagania
1. Dokumentacja systemu
2. Kontrola surowców
3. Kontrola procesu produkcji
4. Badania wyrobu gotowego
5. Postępowanie z wyrobem niezgodnym
6. Działania korygujące

## Kluczowe elementy
- Księga FPC
- Procedury operacyjne
- Instrukcje stanowiskowe
- Zapisy i rejestry
- Plan badań i kontroli

## Audyty
- Wewnętrzne: minimum raz w roku
- Zewnętrzne (dla systemów 1+, 1, 2+): zgodnie z harmonogramem jednostki

## Najczęstsze błędy
1. Brak aktualizacji dokumentacji
2. Nieprawidłowe kalibracje sprzętu
3. Niekompletne zapisy badań
4. Brak szkoleń personelu`,author:"mgr inż. Robert Wójcik",published_at:"2025-11-28",is_published:!0,category:"Produkcja",image_url:"/images/blog/certyfikacja.jpg",tags:["FPC","kontrola produkcji","jakość","audyt"]},{id:"9",title:"Jednostki notyfikowane - jak wybrać partnera do certyfikacji?",slug:"jednostki-notyfikowane-wybor",excerpt:"Kryteria wyboru jednostki notyfikowanej dla certyfikacji wyrobów budowlanych. Lista jednostek w Polsce, zakres akredytacji i koszty współpracy.",content:`# Jednostki notyfikowane w Polsce

## Czym są jednostki notyfikowane?
Jednostki notyfikowane (Notified Bodies) to organizacje wyznaczone przez państwa członkowskie do przeprowadzania oceny zgodności wyrobów budowlanych.

## Jednostki w Polsce
1. **ITB** - Instytut Techniki Budowlanej (NB 1488)
2. **ICiMB** - Instytut Ceramiki i Materiałów Budowlanych (NB 1454)
3. **CNBOP-PIB** - Centrum Naukowo-Badawcze Ochrony Przeciwpożarowej (NB 1438)
4. **IGNiG-PIB** - Instytut Nafty i Gazu (NB 1453)

## Kryteria wyboru
- Zakres notyfikacji (normy, produkty)
- Doświadczenie w branży
- Terminy realizacji
- Koszty certyfikacji
- Lokalizacja i dostępność

## Baza NANDO
Oficjalna baza jednostek notyfikowanych UE: ec.europa.eu/growth/tools-databases/nando/

## Typowe koszty (rocznie)
- Certyfikacja wstępna: 8 000 - 25 000 PLN
- Nadzór roczny: 4 000 - 12 000 PLN`,author:"mgr Agnieszka Kowalczyk",published_at:"2025-11-20",is_published:!0,category:"Certyfikacja",image_url:"/images/blog/certyfikacja.jpg",tags:["jednostki notyfikowane","certyfikacja","ITB","NANDO"]},{id:"10",title:"Nadzór rynku wyrobów budowlanych - GUNB i kontrole",slug:"nadzor-rynku-gunb",excerpt:"Jak działa nadzór rynku wyrobów budowlanych w Polsce? Rola GUNB, procedury kontrolne, najczęstsze nieprawidłowości i sankcje.",content:`# Nadzór rynku wyrobów budowlanych

## Główny Urząd Nadzoru Budowlanego (GUNB)
GUNB jest organem odpowiedzialnym za nadzór rynku wyrobów budowlanych w Polsce.

## Zakres kontroli
1. Dokumentacja techniczna
2. Deklaracja właściwości użytkowych
3. Oznakowanie CE
4. Zgodność z normami zharmonizowanymi

## Procedura kontrolna
1. Wszczęcie kontroli (planowa lub na wniosek)
2. Pobranie próbek
3. Badania laboratoryjne
4. Protokół kontroli
5. Decyzja administracyjna

## Najczęstsze nieprawidłowości
- Brak DoP lub nieprawidłowa treść
- Niewłaściwe oznakowanie CE
- Niezgodność deklarowanych właściwości
- Brak wymaganej dokumentacji

## Sankcje
- Nakaz wycofania z rynku
- Zakaz wprowadzania do obrotu
- Kary pieniężne do 100 000 PLN
- Odpowiedzialność karna`,author:"mec. Paweł Szczepański",published_at:"2025-11-15",is_published:!0,category:"Prawo",image_url:"/images/blog/prawo.jpg",tags:["GUNB","nadzór rynku","kontrola","sankcje"]},{id:"11",title:"Wyroby nieobjęte normami zharmonizowanymi - ETA i krajowe oceny techniczne",slug:"eta-krajowe-oceny-techniczne",excerpt:"Co zrobić gdy produkt nie jest objęty normą zharmonizowaną? Europejska Ocena Techniczna (ETA), krajowe oceny techniczne i ścieżka do oznakowania CE.",content:`# ETA i krajowe oceny techniczne

## Kiedy potrzebna ETA?
Europejska Ocena Techniczna (ETA) jest wymagana gdy:
- Brak normy zharmonizowanej (hEN)
- Produkt znacząco odbiega od normy
- Innowacyjny wyrób budowlany

## Proces uzyskania ETA
1. Wniosek do jednostki TAB (Technical Assessment Body)
2. Opracowanie EAD (European Assessment Document)
3. Ocena i badania produktu
4. Wydanie ETA
5. Certyfikacja zgodnie z systemem AVCP

## Jednostki TAB w Polsce
- ITB (Instytut Techniki Budowlanej)

## Krajowe Oceny Techniczne
Dla produktów wprowadzanych wyłącznie na rynek polski, gdy nie ma hEN ani ETA.

## Koszty i czas
- ETA: 50 000 - 200 000 PLN, 6-18 miesięcy
- Krajowa ocena: 20 000 - 80 000 PLN, 3-6 miesięcy`,author:"dr inż. Krzysztof Adamski",published_at:"2025-11-10",is_published:!0,category:"Certyfikacja",image_url:"/images/blog/certyfikacja.jpg",tags:["ETA","ocena techniczna","TAB","ITB"]},{id:"12",title:"Import wyrobów budowlanych spoza UE - wymagania CPR",slug:"import-wyrobow-spoza-ue",excerpt:"Jak legalnie importować wyroby budowlane z Chin, Turcji czy USA? Obowiązki importera, wymagana dokumentacja i procedury celne.",content:`# Import wyrobów budowlanych spoza UE

## Obowiązki importera
Zgodnie z CPR 2024, importer musi:
1. Upewnić się, że producent przeprowadził ocenę zgodności
2. Sprawdzić dokumentację techniczną
3. Weryfikować oznakowanie CE i DoP
4. Przechowywać dokumentację przez 10 lat
5. Współpracować z organami nadzoru

## Wymagana dokumentacja
- Deklaracja właściwości użytkowych (DoP)
- Raporty z badań
- Certyfikaty zgodności (jeśli wymagane)
- Dokumentacja zakładowej kontroli produkcji

## Procedury celne
1. Zgłoszenie celne z kodem CN produktu
2. Kontrola dokumentacji przez celników
3. Możliwa kontrola fizyczna i pobranie próbek
4. Dopuszczenie do obrotu

## Ryzyko
- Produkty niezgodne - koszty utylizacji
- Kary za wprowadzenie niezgodnych wyrobów
- Odpowiedzialność za wady produktu`,author:"mgr Joanna Wrońska",published_at:"2025-11-05",is_published:!0,category:"Handel",image_url:"/images/blog/certyfikacja.jpg",tags:["import","handel","cło","dokumentacja"]},{id:"13",title:"Beton i prefabrykaty betonowe - specyficzne wymagania CPR",slug:"beton-prefabrykaty-wymagania",excerpt:"Certyfikacja betonu towarowego i prefabrykatów betonowych według CPR 2024. System 2+, normy EN 206 i EN 13369, zakładowa kontrola produkcji.",content:`# Beton i prefabrykaty betonowe - CPR 2024

## Beton towarowy
### Norma: EN 206:2024
- System AVCP: 2+
- Wymagana certyfikacja FPC przez jednostkę notyfikowaną

### Kluczowe właściwości
- Klasa wytrzymałości (np. C25/30)
- Klasa konsystencji
- Klasa ekspozycji
- Maksymalny wymiar kruszywa

## Prefabrykaty betonowe
### Normy produktowe
- EN 13369 - Wymagania ogólne
- EN 13225 - Elementy liniowe
- EN 13224 - Płyty żebrowe
- EN 1168 - Płyty kanałowe

### System AVCP
- System 2+ dla większości prefabrykatów
- System 4 dla niektórych elementów wykończeniowych

## Badania
- Wytrzymałość na ściskanie
- Wodoszczelność
- Mrozoodporność
- Geometria i tolerancje`,author:"prof. dr hab. inż. Michał Górski",published_at:"2025-10-25",is_published:!0,category:"Materiały",image_url:"/images/blog/materialy.jpg",tags:["beton","prefabrykaty","EN 206","konstrukcje"]},{id:"14",title:"Okna i drzwi - certyfikacja według EN 14351-1",slug:"okna-drzwi-certyfikacja",excerpt:"Pełny proces certyfikacji okien i drzwi zewnętrznych zgodnie z EN 14351-1:2024. Badania ITT, klasyfikacje, oznakowanie CE i Digital DoP.",content:`# Okna i drzwi - certyfikacja EN 14351-1

## Zakres normy EN 14351-1:2024
Okna i drzwi zewnętrzne do budynków mieszkalnych i niemieszkalnych.

## System AVCP: 3
- Badania typu (ITT) przez jednostkę notyfikowaną
- Zakładowa kontrola produkcji przez producenta

## Badane właściwości
1. **Przepuszczalność powietrza** (klasa 1-4)
2. **Wodoszczelność** (klasa 1A-9A)
3. **Odporność na obciążenie wiatrem** (klasa 1-5)
4. **Współczynnik przenikania ciepła Uw**
5. **Izolacyjność akustyczna Rw**
6. **Promieniowanie słoneczne g**

## Proces certyfikacji
1. Przygotowanie próbek reprezentatywnych
2. Badania w laboratorium notyfikowanym
3. Raport z badań typu (ITT report)
4. Opracowanie DoP
5. Oznakowanie CE

## Koszty badań
- Pełny zakres badań: 15 000 - 40 000 PLN
- Badania pojedyncze: 3 000 - 8 000 PLN`,author:"mgr inż. Andrzej Maj",published_at:"2025-10-18",is_published:!0,category:"Materiały",image_url:"/images/blog/materialy.jpg",tags:["okna","drzwi","EN 14351","ITT"]},{id:"15",title:"Wyroby izolacyjne - przegląd norm i wymagań CPR",slug:"wyroby-izolacyjne-normy",excerpt:"Kompleksowy przegląd wymagań dla materiałów izolacyjnych: wełna mineralna, EPS, XPS, PIR. Normy, właściwości deklarowane i system AVCP.",content:`# Wyroby izolacyjne - wymagania CPR

## Główne normy zharmonizowane

### Wełna mineralna - EN 13162
- System AVCP: 3 (1 dla reakcji na ogień)
- Właściwości termiczne, akustyczne, ogniowe

### Styropian EPS - EN 13163
- System AVCP: 3 (1 dla ETICS)
- Klasy lambda: od 030 do 045

### Styrodur XPS - EN 13164
- System AVCP: 3
- Zastosowanie: fundamenty, dachy odwrócone

### Pianka PIR/PUR - EN 13165
- System AVCP: 3
- Najlepsze parametry termiczne

## Kluczowe właściwości
1. Deklarowana wartość lambda λD
2. Reakcja na ogień (Euroklasy A1-F)
3. Wytrzymałość na ściskanie
4. Absorpcja wody
5. Przepuszczalność pary wodnej

## Oznakowanie
- Symbol λD na etykiecie
- Klasa reakcji na ogień
- Wymiary i tolerancje
- Nr DoP`,author:"dr inż. Barbara Sikora",published_at:"2025-10-10",is_published:!0,category:"Materiały",image_url:"/images/blog/materialy.jpg",tags:["izolacja","EPS","wełna","termoizolacja"]}];function Za(){const t=ea(),[o,n]=S.useState(""),[l,m]=S.useState("all"),[k,j]=S.useState(Ke),[x,c]=S.useState(!0),[y,z]=S.useState(null),[K,$]=S.useState(""),[a,ee]=S.useState(null);S.useEffect(()=>{(async()=>{try{c(!0);const{getAllPosts:B}=await ua(()=>import("./blogLoader-16c5109e.js"),["assets/blogLoader-16c5109e.js","assets/index-76c473c5.js","assets/vendor-76e8fbeb.js","assets/index-bf414e21.css"]),O=await B();console.log("✅ Załadowano artykuły z markdown:",O.length),j(O),ee(new Date),z(null)}catch(B){console.error("Błąd ładowania artykułów z markdown:",B),j(Ke),z(null)}finally{c(!1)}})()},[]);const g=s=>{t(`/blog-post?slug=${s}`)},P=k.filter(s=>(s.title.toLowerCase().includes(o.toLowerCase())||s.excerpt.toLowerCase().includes(o.toLowerCase()))&&(l==="all"||s.category===l)),M=k.length>0?[...new Set(k.map(s=>s.category))].sort():[],L=s=>{if(s.preventDefault(),!ma(K)){Ie.error("Proszę podać poprawny adres e-mail");return}ya(K),Ie.success("Dziękujemy za zapisanie się do newslettera!"),$("")};return e.jsxs("div",{className:"min-h-screen bg-slate-900",children:[e.jsxs("section",{className:"relative py-24 overflow-hidden",children:[e.jsxs("div",{className:"absolute inset-0 overflow-hidden pointer-events-none",children:[e.jsx("div",{className:"absolute top-1/4 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"}),e.jsx("div",{className:"absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"})]}),e.jsx(we,{children:e.jsx("div",{className:"relative z-10",children:e.jsxs("div",{className:"flex flex-col md:flex-row items-center justify-between gap-12",children:[e.jsxs("div",{className:"md:w-2/3",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6",children:[e.jsx(aa,{className:"w-4 h-4 text-amber-400"}),e.jsx("span",{className:"text-amber-400 text-sm font-medium",children:"Blog CPR"})]}),e.jsxs("h1",{className:"text-4xl md:text-5xl font-bold mb-6",children:[e.jsx("span",{className:"text-white",children:"Aktualności i "}),e.jsx("span",{className:"gradient-text",children:"Wiedza CPR"})]}),e.jsx("p",{className:"text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl",children:"Najnowsze informacje, interpretacje i poradniki dotyczące Rozporządzenia CPR (EU) 2024/3110. Bądź na bieżąco ze wszystkimi zmianami prawnymi i najlepszymi praktykami w branży."}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[e.jsxs(ne,{onClick:()=>{var s;return(s=document.getElementById("blog-list"))==null?void 0:s.scrollIntoView({behavior:"smooth"})},className:"btn-premium px-6 py-3 rounded-full text-slate-900 font-semibold",children:[e.jsx(je,{className:"w-5 h-5 mr-2"}),"Przeglądaj artykuły"]}),e.jsxs(ne,{variant:"outline",className:"px-6 py-3 rounded-full border-white/20 text-white bg-transparent hover:bg-white/10",onClick:()=>{var s;return(s=document.getElementById("newsletter-section"))==null?void 0:s.scrollIntoView({behavior:"smooth"})},children:[e.jsx(Re,{className:"w-5 h-5 mr-2"}),"Newsletter"]})]})]}),e.jsx("div",{className:"md:w-1/3",children:e.jsxs("div",{className:"glass-card p-6",children:[e.jsx("div",{className:"w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center",children:e.jsx(ta,{className:"w-10 h-10 text-slate-900"})}),e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-3xl font-bold gradient-text mb-1",children:k.length}),e.jsx("p",{className:"text-slate-400 text-sm",children:"artykułów dostępnych"})]}),e.jsxs("div",{className:"mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xl font-bold text-white",children:M.length}),e.jsx("p",{className:"text-slate-500 text-xs",children:"kategorii"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xl font-bold text-white",children:"2026"}),e.jsx("p",{className:"text-slate-500 text-xs",children:"aktualny rok"})]})]})]})})]})})})]}),e.jsx("section",{id:"blog-list",className:"py-16 bg-gradient-to-b from-slate-900 to-slate-950",children:e.jsxs(we,{children:[e.jsxs("div",{className:"mb-12",children:[e.jsxs("h2",{className:"text-2xl md:text-3xl font-bold text-white mb-2",children:["Najnowsze ",e.jsx("span",{className:"gradient-text",children:"artykuły"})]}),e.jsx("p",{className:"text-slate-400",children:"Wybierz kategorię lub wyszukaj interesujący Cię temat"})]}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-4 mb-8",children:[e.jsxs("div",{className:"flex-grow relative",children:[e.jsx(oa,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"}),e.jsx("input",{type:"text",placeholder:"Szukaj artykułów...",value:o,onChange:s=>n(s.target.value),className:"w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"})]}),e.jsxs("div",{className:"md:w-64 relative",children:[e.jsx(Ae,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"}),e.jsxs("select",{value:l,onChange:s=>m(s.target.value),className:"w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all appearance-none cursor-pointer",children:[e.jsx("option",{value:"all",className:"bg-slate-800",children:"Wszystkie kategorie"}),M.map(s=>e.jsx("option",{value:s,className:"bg-slate-800",children:s},s))]})]})]}),e.jsx("div",{id:"blog-posts-grid",children:x?e.jsx(Oa,{}):y?e.jsxs("div",{className:"text-center py-12 glass-card",children:[e.jsx("h3",{className:"text-xl font-medium text-white mb-2",children:y}),e.jsx("p",{className:"text-slate-400 mb-4",children:"Spróbuj odświeżyć stronę"}),e.jsxs(ne,{onClick:()=>window.location.reload(),variant:"outline",className:"border-white/20 text-white bg-transparent hover:bg-white/10",children:[e.jsx(ra,{className:"w-4 h-4 mr-2"}),"Odśwież stronę"]})]}):P.length>0?e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:P.map(s=>e.jsx(Va,{post:s,onClick:()=>g(s.slug)},s.id))}):e.jsxs("div",{children:[e.jsx(La,{}),l!=="all"&&e.jsx("div",{className:"text-center mt-6",children:e.jsx(ne,{onClick:()=>m("all"),variant:"outline",className:"border-white/20 text-white bg-transparent hover:bg-white/10",children:"Pokaż wszystkie kategorie"})})]})})]})}),e.jsx("section",{id:"newsletter-section",className:"py-24 bg-slate-950",children:e.jsx(we,{children:e.jsxs("div",{className:"relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 p-8 md:p-12",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10"}),e.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"}),e.jsxs("div",{className:"relative z-10 flex flex-col md:flex-row items-center gap-12",children:[e.jsxs("div",{className:"md:w-2/3",children:[e.jsxs("h2",{className:"text-2xl md:text-3xl font-bold text-white mb-4",children:["Bądź na bieżąco z ",e.jsx("span",{className:"gradient-text",children:"CPR"})]}),e.jsx("p",{className:"text-slate-400 mb-6 leading-relaxed",children:"Zapisz się do naszego newslettera i otrzymuj najnowsze informacje, interpretacje przepisów i praktyczne porady dotyczące Rozporządzenia CPR."}),e.jsxs("form",{onSubmit:L,className:"flex flex-col sm:flex-row gap-3",children:[e.jsx("input",{type:"email",placeholder:"Twój adres e-mail",value:K,onChange:s=>$(s.target.value),className:"flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all",required:!0}),e.jsxs("button",{type:"submit",className:"btn-premium px-6 py-3 rounded-xl text-slate-900 font-semibold flex items-center justify-center gap-2",children:[e.jsx(na,{className:"w-4 h-4"}),"Zapisz się"]})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-3",children:"Zapisując się, zgadzasz się na naszą politykę prywatności. W każdej chwili możesz zrezygnować z subskrypcji."})]}),e.jsx("div",{className:"md:w-1/3 flex justify-center",children:e.jsx("div",{className:"w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30",children:e.jsx(Re,{className:"w-16 h-16 text-slate-900"})})})]})]})})}),e.jsx("section",{className:"py-16 bg-slate-900 border-t border-white/5",children:e.jsx(we,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-white mb-4 flex items-center gap-2",children:[e.jsx(je,{className:"w-5 h-5 text-amber-400"}),"O blogu"]}),e.jsx("p",{className:"text-slate-400 text-sm leading-relaxed",children:"Dostarczamy ekspercką wiedzę i praktyczne informacje dla producentów wyrobów budowlanych dotyczące Rozporządzenia CPR (EU) 2024/3110."})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-white mb-4 flex items-center gap-2",children:[e.jsx(Ae,{className:"w-5 h-5 text-blue-400"}),"Kategorie"]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:M.slice(0,6).map(s=>e.jsx("button",{className:"px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm hover:text-amber-400 hover:border-amber-400/30 transition-all",onClick:()=>{var B;m(s),(B=document.getElementById("blog-list"))==null||B.scrollIntoView({behavior:"smooth"})},children:s},s))})]}),e.jsxs("div",{className:"glass-card p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-white mb-4 flex items-center gap-2",children:[e.jsx(Me,{className:"w-5 h-5 text-emerald-400"}),"Kontakt"]}),e.jsx("p",{className:"text-slate-400 text-sm mb-4",children:"Masz pytania dotyczące CPR? Skontaktuj się z naszymi ekspertami."}),e.jsxs(ne,{variant:"outline",className:"border-white/20 text-white bg-transparent hover:bg-white/10",onClick:()=>t("/services"),children:["Skontaktuj się",e.jsx(sa,{className:"w-4 h-4 ml-2"})]})]})]})})})]})}function qa(){return e.jsxs(e.Fragment,{children:[e.jsx(da,{}),e.jsx(Za,{}),e.jsx(ca,{})]})}export{qa as default};
