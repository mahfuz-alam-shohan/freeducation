var Te=(e,t,s)=>(a,i)=>{let n=-1;return o(0);async function o(r){if(r<=n)throw new Error("next() called multiple times");n=r;let c,l=!1,u;if(e[r]?(u=e[r][0][0],a.req.routeIndex=r):u=r===e.length&&i||void 0,u)try{c=await u(a,()=>o(r+1))}catch(m){if(m instanceof Error&&t)a.error=m,c=await t(m,a),l=!0;else throw m}else a.finalized===!1&&s&&(c=await s(a));return c&&(a.finalized===!1||l)&&(a.res=c),a}};var it=Symbol();var nt=async(e,t=Object.create(null))=>{let{all:s=!1,dot:a=!1}=t,n=(e instanceof re?e.raw.headers:e.headers).get("Content-Type");return n?.startsWith("multipart/form-data")||n?.startsWith("application/x-www-form-urlencoded")?an(e,{all:s,dot:a}):{}};async function an(e,t){let s=await e.formData();return s?nn(s,t):{}}function nn(e,t){let s=Object.create(null);return e.forEach((a,i)=>{t.all||i.endsWith("[]")?on(s,i,a):s[i]=a}),t.dot&&Object.entries(s).forEach(([a,i])=>{a.includes(".")&&(rn(s,a,i),delete s[a])}),s}var on=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},rn=(e,t,s)=>{let a=e,i=t.split(".");i.forEach((n,o)=>{o===i.length-1?a[n]=s:((!a[n]||typeof a[n]!="object"||Array.isArray(a[n])||a[n]instanceof File)&&(a[n]=Object.create(null)),a=a[n])})};var Le=e=>{let t=e.split("/");return t[0]===""&&t.shift(),t},ot=e=>{let{groups:t,path:s}=cn(e),a=Le(s);return ln(a,t)},cn=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(s,a)=>{let i=`@${a}`;return t.push([i,s]),i}),{groups:t,path:e}},ln=(e,t)=>{for(let s=t.length-1;s>=0;s--){let[a]=t[s];for(let i=e.length-1;i>=0;i--)if(e[i].includes(a)){e[i]=e[i].replace(a,t[s][1]);break}}return e},ce={},rt=(e,t)=>{if(e==="*")return"*";let s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){let a=`${e}#${t}`;return ce[a]||(s[2]?ce[a]=t&&t[0]!==":"&&t[0]!=="*"?[a,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:ce[a]=[e,s[1],!0]),ce[a]}return null},le=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},dn=e=>le(e,decodeURI),Pe=e=>{let t=e.url,s=t.indexOf("/",t.indexOf(":")+4),a=s;for(;a<t.length;a++){let i=t.charCodeAt(a);if(i===37){let n=t.indexOf("?",a),o=t.slice(s,n===-1?void 0:n);return dn(o.includes("%25")?o.replace(/%25/g,"%2525"):o)}else if(i===63)break}return t.slice(s,a)};var ct=e=>{let t=Pe(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},D=(e,t,...s)=>(s.length&&(t=D(t,...s)),`${e?.[0]==="/"?"":"/"}${e}${t==="/"?"":`${e?.at(-1)==="/"?"":"/"}${t?.[0]==="/"?t.slice(1):t}`}`),de=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;let t=e.split("/"),s=[],a="";return t.forEach(i=>{if(i!==""&&!/\:/.test(i))a+="/"+i;else if(/\:/.test(i))if(/\?/.test(i)){s.length===0&&a===""?s.push("/"):s.push(a);let n=i.replace("?","");a+="/"+n,s.push(a)}else a+="/"+i}),s.filter((i,n,o)=>o.indexOf(i)===n)},Ee=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?le(e,ke):e):e,lt=(e,t,s)=>{let a;if(!s&&t&&!/[%+]/.test(t)){let o=e.indexOf("?",8);if(o===-1)return;for(e.startsWith(t,o+1)||(o=e.indexOf(`&${t}`,o+1));o!==-1;){let r=e.charCodeAt(o+t.length+1);if(r===61){let c=o+t.length+2,l=e.indexOf("&",c);return Ee(e.slice(c,l===-1?void 0:l))}else if(r==38||isNaN(r))return"";o=e.indexOf(`&${t}`,o+1)}if(a=/[%+]/.test(e),!a)return}let i={};a??=/[%+]/.test(e);let n=e.indexOf("?",8);for(;n!==-1;){let o=e.indexOf("&",n+1),r=e.indexOf("=",n);r>o&&o!==-1&&(r=-1);let c=e.slice(n+1,r===-1?o===-1?void 0:o:r);if(a&&(c=Ee(c)),n=o,c==="")continue;let l;r===-1?l="":(l=e.slice(r+1,o===-1?void 0:o),a&&(l=Ee(l))),s?(i[c]&&Array.isArray(i[c])||(i[c]=[]),i[c].push(l)):i[c]??=l}return t?i[t]:i},dt=lt,pt=(e,t)=>lt(e,t,!0),ke=decodeURIComponent;var ut=e=>le(e,ke),re=class{raw;#t;#e;routeIndex=0;path;bodyCache={};constructor(e,t="/",s=[[]]){this.raw=e,this.path=t,this.#e=s,this.#t={}}param(e){return e?this.#s(e):this.#n()}#s(e){let t=this.#e[0][this.routeIndex][1][e],s=this.#i(t);return s&&/\%/.test(s)?ut(s):s}#n(){let e={},t=Object.keys(this.#e[0][this.routeIndex][1]);for(let s of t){let a=this.#i(this.#e[0][this.routeIndex][1][s]);a!==void 0&&(e[s]=/\%/.test(a)?ut(a):a)}return e}#i(e){return this.#e[1]?this.#e[1][e]:e}query(e){return dt(this.url,e)}queries(e){return pt(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t={};return this.raw.headers.forEach((s,a)=>{t[a]=s}),t}async parseBody(e){return this.bodyCache.parsedBody??=await nt(this,e)}#a=e=>{let{bodyCache:t,raw:s}=this,a=t[e];if(a)return a;let i=Object.keys(t)[0];return i?t[i].then(n=>(i==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=s[e]()};json(){return this.#a("text").then(e=>JSON.parse(e))}text(){return this.#a("text")}arrayBuffer(){return this.#a("arrayBuffer")}blob(){return this.#a("blob")}formData(){return this.#a("formData")}addValidatedData(e,t){this.#t[e]=t}valid(e){return this.#t[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[it](){return this.#e}get matchedRoutes(){return this.#e[0].map(([[,e]])=>e)}get routePath(){return this.#e[0].map(([[,e]])=>e)[this.routeIndex].path}};var mt={Stringify:1,BeforeStream:2,Stream:3},pn=(e,t)=>{let s=new String(e);return s.isEscaped=!0,s.callbacks=t,s};var Ie=async(e,t,s,a,i)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let n=e.callbacks;if(!n?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let o=Promise.all(n.map(r=>r({phase:t,buffer:i,context:a}))).then(r=>Promise.all(r.filter(Boolean).map(c=>Ie(c,t,!1,a,i))).then(()=>i[0]));return s?pn(await o,n):o};var un="text/plain; charset=UTF-8",Re=(e,t)=>({"Content-Type":e,...t}),ht=class{#t;#e;env={};#s;finalized=!1;error;#n;#i;#a;#d;#c;#l;#r;#p;#u;constructor(e,t){this.#t=e,t&&(this.#i=t.executionCtx,this.env=t.env,this.#l=t.notFoundHandler,this.#u=t.path,this.#p=t.matchResult)}get req(){return this.#e??=new re(this.#t,this.#u,this.#p),this.#e}get event(){if(this.#i&&"respondWith"in this.#i)return this.#i;throw Error("This context has no FetchEvent")}get executionCtx(){if(this.#i)return this.#i;throw Error("This context has no ExecutionContext")}get res(){return this.#a||=new Response(null,{headers:this.#r??=new Headers})}set res(e){if(this.#a&&e){e=new Response(e.body,e);for(let[t,s]of this.#a.headers.entries())if(t!=="content-type")if(t==="set-cookie"){let a=this.#a.headers.getSetCookie();e.headers.delete("set-cookie");for(let i of a)e.headers.append("set-cookie",i)}else e.headers.set(t,s)}this.#a=e,this.finalized=!0}render=(...e)=>(this.#c??=t=>this.html(t),this.#c(...e));setLayout=e=>this.#d=e;getLayout=()=>this.#d;setRenderer=e=>{this.#c=e};header=(e,t,s)=>{this.finalized&&(this.#a=new Response(this.#a.body,this.#a));let a=this.#a?this.#a.headers:this.#r??=new Headers;t===void 0?a.delete(e):s?.append?a.append(e,t):a.set(e,t)};status=e=>{this.#n=e};set=(e,t)=>{this.#s??=new Map,this.#s.set(e,t)};get=e=>this.#s?this.#s.get(e):void 0;get var(){return this.#s?Object.fromEntries(this.#s):{}}#o(e,t,s){let a=this.#a?new Headers(this.#a.headers):this.#r??new Headers;if(typeof t=="object"&&"headers"in t){let n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(let[o,r]of n)o.toLowerCase()==="set-cookie"?a.append(o,r):a.set(o,r)}if(s)for(let[n,o]of Object.entries(s))if(typeof o=="string")a.set(n,o);else{a.delete(n);for(let r of o)a.append(n,r)}let i=typeof t=="number"?t:t?.status??this.#n;return new Response(e,{status:i,headers:a})}newResponse=(...e)=>this.#o(...e);body=(e,t,s)=>this.#o(e,t,s);text=(e,t,s)=>!this.#r&&!this.#n&&!t&&!s&&!this.finalized?new Response(e):this.#o(e,t,Re(un,s));json=(e,t,s)=>this.#o(JSON.stringify(e),t,Re("application/json",s));html=(e,t,s)=>{let a=i=>this.#o(i,t,Re("text/html; charset=UTF-8",s));return typeof e=="object"?Ie(e,mt.Stringify,!1,{}).then(a):a(e)};redirect=(e,t)=>{let s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)};notFound=()=>(this.#l??=()=>new Response,this.#l(this))};var N="ALL",gt="all",bt=["get","post","put","delete","options","patch"],pe="Can not add a route since the matcher is already built.",ue=class extends Error{};var yt="__COMPOSED_HANDLER";var mn=e=>e.text("404 Not Found",404),vt=(e,t)=>{if("getResponse"in e){let s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},ft=class St{get;post;put;delete;options;patch;all;on;use;router;getPath;_basePath="/";#t="/";routes=[];constructor(t={}){[...bt,gt].forEach(n=>{this[n]=(o,...r)=>(typeof o=="string"?this.#t=o:this.#n(n,this.#t,o),r.forEach(c=>{this.#n(n,this.#t,c)}),this)}),this.on=(n,o,...r)=>{for(let c of[o].flat()){this.#t=c;for(let l of[n].flat())r.map(u=>{this.#n(l.toUpperCase(),this.#t,u)})}return this},this.use=(n,...o)=>(typeof n=="string"?this.#t=n:(this.#t="*",o.unshift(n)),o.forEach(r=>{this.#n(N,this.#t,r)}),this);let{strict:a,...i}=t;Object.assign(this,i),this.getPath=a??!0?t.getPath??Pe:ct}#e(){let t=new St({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,t.#s=this.#s,t.routes=this.routes,t}#s=mn;errorHandler=vt;route(t,s){let a=this.basePath(t);return s.routes.map(i=>{let n;s.errorHandler===vt?n=i.handler:(n=async(o,r)=>(await Te([],s.errorHandler)(o,()=>i.handler(o,r))).res,n[yt]=i.handler),a.#n(i.method,i.path,n)}),this}basePath(t){let s=this.#e();return s._basePath=D(this._basePath,t),s}onError=t=>(this.errorHandler=t,this);notFound=t=>(this.#s=t,this);mount(t,s,a){let i,n;a&&(typeof a=="function"?n=a:(n=a.optionHandler,a.replaceRequest===!1?i=c=>c:i=a.replaceRequest));let o=n?c=>{let l=n(c);return Array.isArray(l)?l:[l]}:c=>{let l;try{l=c.executionCtx}catch{}return[c.env,l]};i||=(()=>{let c=D(this._basePath,t),l=c==="/"?0:c.length;return u=>{let m=new URL(u.url);return m.pathname=m.pathname.slice(l)||"/",new Request(m,u)}})();let r=async(c,l)=>{let u=await s(i(c.req.raw),...o(c));if(u)return u;await l()};return this.#n(N,D(t,"*"),r),this}#n(t,s,a){t=t.toUpperCase(),s=D(this._basePath,s);let i={basePath:this._basePath,path:s,method:t,handler:a};this.router.add(t,s,[a,i]),this.routes.push(i)}#i(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t}#a(t,s,a,i){if(i==="HEAD")return(async()=>new Response(null,await this.#a(t,s,a,"GET")))();let n=this.getPath(t,{env:a}),o=this.router.match(i,n),r=new ht(t,{path:n,matchResult:o,env:a,executionCtx:s,notFoundHandler:this.#s});if(o[0].length===1){let l;try{l=o[0][0][0][0](r,async()=>{r.res=await this.#s(r)})}catch(u){return this.#i(u,r)}return l instanceof Promise?l.then(u=>u||(r.finalized?r.res:this.#s(r))).catch(u=>this.#i(u,r)):l??this.#s(r)}let c=Te(o[0],this.errorHandler,this.#s);return(async()=>{try{let l=await c(r);if(!l.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return l.res}catch(l){return this.#i(l,r)}})()}fetch=(t,...s)=>this.#a(t,s[1],s[0],t.method);request=(t,s,a,i)=>t instanceof Request?this.fetch(s?new Request(t,s):t,a,i):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${D("/",t)}`,s),a,i));fire=()=>{addEventListener("fetch",t=>{t.respondWith(this.#a(t.request,t,void 0,t.request.method))})}};var me=[];function je(e,t){let s=this.buildAllMatchers(),a=(i,n)=>{let o=s[i]||s[N],r=o[2][n];if(r)return r;let c=n.match(o[0]);if(!c)return[[],me];let l=c.indexOf("",1);return[o[1][l],c]};return this.match=a,a(e,t)}var he="[^/]+",z=".*",W="(?:|/.*)",K=Symbol(),hn=new Set(".\\+*[^]$()");function gn(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===z||e===W?1:t===z||t===W?-1:e===he?1:t===he?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var xt=class Be{#t;#e;#s=Object.create(null);insert(t,s,a,i,n){if(t.length===0){if(this.#t!==void 0)throw K;if(n)return;this.#t=s;return}let[o,...r]=t,c=o==="*"?r.length===0?["","",z]:["","",he]:o==="/*"?["","",W]:o.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),l;if(c){let u=c[1],m=c[2]||he;if(u&&c[2]&&(m===".*"||(m=m.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(m))))throw K;if(l=this.#s[m],!l){if(Object.keys(this.#s).some(p=>p!==z&&p!==W))throw K;if(n)return;l=this.#s[m]=new Be,u!==""&&(l.#e=i.varIndex++)}!n&&u!==""&&a.push([u,l.#e])}else if(l=this.#s[o],!l){if(Object.keys(this.#s).some(u=>u.length>1&&u!==z&&u!==W))throw K;if(n)return;l=this.#s[o]=new Be}l.insert(r,s,a,i,n)}buildRegExpStr(){let s=Object.keys(this.#s).sort(gn).map(a=>{let i=this.#s[a];return(typeof i.#e=="number"?`(${a})@${i.#e}`:hn.has(a)?`\\${a}`:a)+i.buildRegExpStr()});return typeof this.#t=="number"&&s.unshift(`#${this.#t}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}};var Nt=class{#t={varIndex:0};#e=new xt;insert(e,t,s){let a=[],i=[];for(let o=0;;){let r=!1;if(e=e.replace(/\{[^}]+\}/g,c=>{let l=`@\\${o}`;return i[o]=[l,c],o++,r=!0,l}),!r)break}let n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let o=i.length-1;o>=0;o--){let[r]=i[o];for(let c=n.length-1;c>=0;c--)if(n[c].indexOf(r)!==-1){n[c]=n[c].replace(r,i[o][1]);break}}return this.#e.insert(n,t,a,this.#t,s),a}buildRegExp(){let e=this.#e.buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0,s=[],a=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(i,n,o)=>n!==void 0?(s[++t]=Number(n),"$()"):(o!==void 0&&(a[Number(o)]=++t),"")),[new RegExp(`^${e}`),s,a]}};var bn=[/^$/,[],Object.create(null)],Ct=Object.create(null);function wt(e){return Ct[e]??=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`)}function yn(){Ct=Object.create(null)}function vn(e){let t=new Nt,s=[];if(e.length===0)return bn;let a=e.map(l=>[!/\*|\/:/.test(l[0]),...l]).sort(([l,u],[m,p])=>l?1:m?-1:u.length-p.length),i=Object.create(null);for(let l=0,u=-1,m=a.length;l<m;l++){let[p,h,g]=a[l];p?i[h]=[g.map(([v])=>[v,Object.create(null)]),me]:u++;let y;try{y=t.insert(h,u,p)}catch(v){throw v===K?new ue(h):v}p||(s[u]=g.map(([v,x])=>{let j=Object.create(null);for(x-=1;x>=0;x--){let[oe,R]=y[x];j[oe]=R}return[v,j]}))}let[n,o,r]=t.buildRegExp();for(let l=0,u=s.length;l<u;l++)for(let m=0,p=s[l].length;m<p;m++){let h=s[l][m]?.[1];if(!h)continue;let g=Object.keys(h);for(let y=0,v=g.length;y<v;y++)h[g[y]]=r[h[g[y]]]}let c=[];for(let l in o)c[l]=s[o[l]];return[n,c,i]}function H(e,t){if(e){for(let s of Object.keys(e).sort((a,i)=>i.length-a.length))if(wt(s).test(t))return[...e[s]]}}var ge=class{name="RegExpRouter";#t;#e;constructor(){this.#t={[N]:Object.create(null)},this.#e={[N]:Object.create(null)}}add(e,t,s){let a=this.#t,i=this.#e;if(!a||!i)throw new Error(pe);a[e]||[a,i].forEach(r=>{r[e]=Object.create(null),Object.keys(r[N]).forEach(c=>{r[e][c]=[...r[N][c]]})}),t==="/*"&&(t="*");let n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let r=wt(t);e===N?Object.keys(a).forEach(c=>{a[c][t]||=H(a[c],t)||H(a[N],t)||[]}):a[e][t]||=H(a[e],t)||H(a[N],t)||[],Object.keys(a).forEach(c=>{(e===N||e===c)&&Object.keys(a[c]).forEach(l=>{r.test(l)&&a[c][l].push([s,n])})}),Object.keys(i).forEach(c=>{(e===N||e===c)&&Object.keys(i[c]).forEach(l=>r.test(l)&&i[c][l].push([s,n]))});return}let o=de(t)||[t];for(let r=0,c=o.length;r<c;r++){let l=o[r];Object.keys(i).forEach(u=>{(e===N||e===u)&&(i[u][l]||=[...H(a[u],l)||H(a[N],l)||[]],i[u][l].push([s,n-c+r+1]))})}}match=je;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#e).concat(Object.keys(this.#t)).forEach(t=>{e[t]||=this.#s(t)}),this.#t=this.#e=void 0,yn(),e}#s(e){let t=[],s=e===N;return[this.#t,this.#e].forEach(a=>{let i=a[e]?Object.keys(a[e]).map(n=>[n,a[e][n]]):[];i.length!==0?(s||=!0,t.push(...i)):e!==N&&t.push(...Object.keys(a[N]).map(n=>[n,a[N][n]]))}),s?vn(t):null}};var Me=class{name="SmartRouter";#t=[];#e=[];constructor(e){this.#t=e.routers}add(e,t,s){if(!this.#e)throw new Error(pe);this.#e.push([e,t,s])}match(e,t){if(!this.#e)throw new Error("Fatal error");let s=this.#t,a=this.#e,i=s.length,n=0,o;for(;n<i;n++){let r=s[n];try{for(let c=0,l=a.length;c<l;c++)r.add(...a[c]);o=r.match(e,t)}catch(c){if(c instanceof ue)continue;throw c}this.match=r.match.bind(r),this.#t=[r],this.#e=void 0;break}if(n===i)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#e||this.#t.length!==1)throw new Error("No active router has been determined yet.");return this.#t[0]}};var $=Object.create(null),Tt=class Et{#t;#e;#s;#n=0;#i=$;constructor(t,s,a){if(this.#e=a||Object.create(null),this.#t=[],t&&s){let i=Object.create(null);i[t]={handler:s,possibleKeys:[],score:0},this.#t=[i]}this.#s=[]}insert(t,s,a){this.#n=++this.#n;let i=this,n=ot(s),o=[];for(let r=0,c=n.length;r<c;r++){let l=n[r],u=n[r+1],m=rt(l,u),p=Array.isArray(m)?m[0]:l;if(p in i.#e){i=i.#e[p],m&&o.push(m[1]);continue}i.#e[p]=new Et,m&&(i.#s.push(m),o.push(m[1])),i=i.#e[p]}return i.#t.push({[t]:{handler:a,possibleKeys:o.filter((r,c,l)=>l.indexOf(r)===c),score:this.#n}}),i}#a(t,s,a,i){let n=[];for(let o=0,r=t.#t.length;o<r;o++){let c=t.#t[o],l=c[s]||c[N],u={};if(l!==void 0&&(l.params=Object.create(null),n.push(l),a!==$||i&&i!==$))for(let m=0,p=l.possibleKeys.length;m<p;m++){let h=l.possibleKeys[m],g=u[l.score];l.params[h]=i?.[h]&&!g?i[h]:a[h]??i?.[h],u[l.score]=!0}}return n}search(t,s){let a=[];this.#i=$;let n=[this],o=Le(s),r=[];for(let c=0,l=o.length;c<l;c++){let u=o[c],m=c===l-1,p=[];for(let h=0,g=n.length;h<g;h++){let y=n[h],v=y.#e[u];v&&(v.#i=y.#i,m?(v.#e["*"]&&a.push(...this.#a(v.#e["*"],t,y.#i)),a.push(...this.#a(v,t,y.#i))):p.push(v));for(let x=0,j=y.#s.length;x<j;x++){let oe=y.#s[x],R=y.#i===$?{}:{...y.#i};if(oe==="*"){let M=y.#e["*"];M&&(a.push(...this.#a(M,t,y.#i)),M.#i=R,p.push(M));continue}let[en,at,V]=oe;if(!u&&!(V instanceof RegExp))continue;let B=y.#e[en],tn=o.slice(c).join("/");if(V instanceof RegExp){let M=V.exec(tn);if(M){if(R[at]=M[0],a.push(...this.#a(B,t,y.#i,R)),Object.keys(B.#e).length){B.#i=R;let sn=M[0].match(/\//)?.length??0;(r[sn]||=[]).push(B)}continue}}(V===!0||V.test(u))&&(R[at]=u,m?(a.push(...this.#a(B,t,R,y.#i)),B.#e["*"]&&a.push(...this.#a(B.#e["*"],t,R,y.#i))):(B.#i=R,p.push(B)))}}n=p.concat(r.shift()??[])}return a.length>1&&a.sort((c,l)=>c.score-l.score),[a.map(({handler:c,params:l})=>[c,l])]}};var qe=class{name="TrieRouter";#t;constructor(){this.#t=new Tt}add(e,t,s){let a=de(t);if(a){for(let i=0,n=a.length;i<n;i++)this.#t.insert(e,a[i],s);return}this.#t.insert(e,t,s)}match(e,t){return this.#t.search(e,t)}};var P=class extends ft{constructor(e={}){super(e),this.router=e.router??new Me({routers:[new ge,new qe]})}};async function Lt(e,t){let a=btoa(JSON.stringify({alg:"HS256",typ:"JWT"})),i=btoa(JSON.stringify({...e,exp:Date.now()+7*24*60*60*1e3})),n=`${a}.${i}`,o=await crypto.subtle.importKey("raw",new TextEncoder().encode(t),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),r=await crypto.subtle.sign("HMAC",o,new TextEncoder().encode(n)),c=btoa(String.fromCharCode(...new Uint8Array(r)));return`${n}.${c}`}async function be(e,t){try{let[s,a,i]=e.split(".");if(!s||!a||!i)return null;let n=`${s}.${a}`,o=await crypto.subtle.importKey("raw",new TextEncoder().encode(t),{name:"HMAC",hash:"SHA-256"},!1,["verify"]),r=Uint8Array.from(atob(i),u=>u.charCodeAt(0));if(!await crypto.subtle.verify("HMAC",o,r,new TextEncoder().encode(n)))return null;let l=JSON.parse(atob(a));return l.exp<Date.now()?null:l}catch{return null}}async function k(e,t){let s=new TextEncoder,a=await crypto.subtle.importKey("raw",s.encode(e),{name:"PBKDF2"},!1,["deriveBits"]),i=await crypto.subtle.deriveBits({name:"PBKDF2",salt:s.encode(t),iterations:1e5,hash:"SHA-256"},a,256);return Array.from(new Uint8Array(i)).map(n=>n.toString(16).padStart(2,"0")).join("")}async function Ae(e,t){if(!e)return!1;let[s,a]=e.split(":");return!s||!a?!1:await k(t,s)===a}var fn={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, HEAD, POST, OPTIONS, PUT, DELETE","Access-Control-Allow-Headers":"Content-Type, Authorization"},Sn={"Referrer-Policy":"strict-origin-when-cross-origin","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Permissions-Policy":"camera=(), microphone=(), geolocation=()"},d={...fn,...Sn},Pt=e=>!e||Number.isNaN(e)?1:Math.min(1,Math.max(.8,e)),Y=e=>{let t=e.JWT_SECRET;if(!t)throw new Error("JWT secret is not configured.");return t},b=async(e,t)=>{let s=e.headers.get("Authorization");if(!s||!s.startsWith("Bearer "))return null;let a=Y(t);return await be(s.split(" ")[1],a)},E=e=>e.trim().toLowerCase(),C=e=>!(!e||e.role!=="admin"),_=e=>e.trim().toLowerCase(),U=e=>e.trim().toUpperCase(),De=e=>/^[a-z0-9-]+$/.test(e),Q=e=>/^[a-z0-9\s-]+$/.test(e),O=e=>["SSC","HSC"].includes(e),I=async e=>{let t=crypto.getRandomValues(new Uint8Array(16)),s=Array.from(t).map(i=>i.toString(16).padStart(2,"0")).join(""),a=await k(e,s);return{saltHex:s,passwordHash:`${s}:${a}`}},kt=e=>{if(typeof e!="string")return{};try{return JSON.parse(e)}catch{return{}}},xn=(e,t)=>!e||typeof e!="object"?{}:Object.fromEntries(Object.entries(e).filter(([s])=>t(s))),Nn=(e,t)=>!e||typeof e!="object"?{...t||{}}:{...e,...t||{}},It=(e,t,s,a)=>{let i=String(s.level||"").toUpperCase(),n=_(String(s.subject||"")),o={...e},r=`${i}-`,c=p=>{Array.isArray(t?.[p])&&(o[p]=t[p])},l=(p,h)=>{if(t?.[p]&&typeof t[p]=="object"){let g=xn(t[p],h);o[p]=Nn(e?.[p],g)}};if(n==="bangla 1st paper")return a&&c("content"),l("banglaQuestions",p=>p.startsWith(r)),l("mcqQuestions",p=>p.startsWith(r)),l("notesByItem",p=>p.startsWith(r)),l("videosByItem",p=>p.startsWith(r)),o;if(n==="english 2nd paper")return a&&c("content"),l("englishSecondQuestions",p=>p.startsWith(r)),l("mcqQuestions",p=>p.startsWith(r)),l("notesByItem",p=>p.startsWith(r)),l("videosByItem",p=>p.startsWith(r)),o;if(n==="english 1st paper"&&i==="SSC")return a&&c("content"),l("englishQuestions",p=>p.startsWith(r)),o;let u={physics:"Physics",chemistry:"Chemistry",biology:"Biology"};if(i==="SSC"&&u[n]){let p=u[n],h=`${r}${p}-`;return a&&c(p.toLowerCase()),l("srijonshilQuestions",g=>g.startsWith(h)),l("mcqQuestions",g=>g.startsWith(h)),l("notesByItem",g=>g.startsWith(h)),l("videosByItem",g=>g.startsWith(h)),o}let m={"physics 1st paper":{label:"Physics-1",key:"physics1"},"physics 2nd paper":{label:"Physics-2",key:"physics2"},"chemistry 1st paper":{label:"Chemistry-1",key:"chemistry1"},"chemistry 2nd paper":{label:"Chemistry-2",key:"chemistry2"},"biology 1st paper":{label:"Biology-1",key:"biology1"},"biology 2nd paper":{label:"Biology-2",key:"biology2"},"higher mathematics 1st paper":{label:"HigherMathematics-1",key:"higherMath1"},"higher mathematics 2nd paper":{label:"HigherMathematics-2",key:"higherMath2"}};if(i==="HSC"&&m[n]){let p=m[n],h=`${r}${p.label}-`;return a&&c(p.key),l("srijonshilQuestions",g=>g.startsWith(h)),l("mcqQuestions",g=>g.startsWith(h)),l("notesByItem",g=>g.startsWith(h)),l("videosByItem",g=>g.startsWith(h)),o}return n==="english 1st paper"&&i==="HSC"?(l("englishQuestions",p=>p.startsWith(r)),o):null},T=async(e,t,s,a)=>{if(!t?.id)return;let i=typeof a=="string"||a==null?a:JSON.stringify(a);await e.prepare("INSERT INTO edit_history (user_id, action, details) VALUES (?, ?, ?)").bind(t.id,s,i??null).run()},q=async(e,t)=>!t||Number.isNaN(t)?null:await e.prepare(`SELECT users.id, users.email, users.role, user_profiles.username, user_profiles.name
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       WHERE users.id = ?`).bind(t).first()||null;var Rt=async(e,t,s)=>{if(s==="/api/register-admin"&&e.method==="POST"){let{username:a,password:i}=await e.json(),n=await t.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first(),o=await t.DB.prepare("SELECT count(*) as count FROM admins").first();if(n?.count>0||o?.count>0)return Response.json({success:!1,error:"User already exists"},{status:403,headers:d});let r=String(a||"").trim(),c=String(i||"");if(r.length<3)return Response.json({success:!1,error:"Username must be at least 3 characters."},{status:400,headers:d});if(c.length<8)return Response.json({success:!1,error:"Password must be at least 8 characters."},{status:400,headers:d});let{passwordHash:l}=await I(c);await t.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)").bind(null,l,"admin").run();let u=await t.DB.prepare("SELECT id FROM users WHERE role = 'admin' ORDER BY id DESC LIMIT 1").first();return u?.id?(await t.DB.batch([t.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)").bind(u.id,r,r),t.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)").bind(u.id,JSON.stringify(["dashboard","classes","settings","thumbnails","userManagement"])),t.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(r,l)]),Response.json({success:!0},{headers:d})):Response.json({success:!1,error:"Admin creation failed."},{status:500,headers:d})}if(s==="/api/login"&&e.method==="POST"){let{username:a,password:i}=await e.json(),n=String(a||"").trim(),o=String(i||"");if(!n||!o)return Response.json({success:!1,error:"Username and password are required."},{status:400,headers:d});let r=E(n),c=await t.DB.prepare(`SELECT users.id, users.email, users.password_hash, users.role, user_profiles.username, user_profiles.name
         FROM users
         LEFT JOIN user_profiles ON user_profiles.user_id = users.id
         WHERE users.email = ? OR user_profiles.username = ?`).bind(r,n).first(),l=c?.role,u=[],m=null,p=null,h=null;if(c){if(!await Ae(c.password_hash,o))return Response.json({success:!1,error:"Invalid credentials"},{status:401,headers:d});if(l==="admin"){let x=await t.DB.prepare("SELECT permissions FROM admin_permissions WHERE user_id = ?").bind(c.id).first();u=x?.permissions?JSON.parse(x.permissions):[]}if(l==="teacher"){let x=await t.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(c.id).first();m=x?{level:x.level,subject:x.subject}:null;let j=await t.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?").bind(c.id).first();u=j?.permissions?JSON.parse(j.permissions):[]}if(l==="student"){let x=await t.DB.prepare("SELECT class_label, group_label FROM academic_profiles WHERE user_id = ?").bind(c.id).first();p=x?.class_label||null,h=x?.group_label||null}}else{let v=await t.DB.prepare("SELECT * FROM admins WHERE username = ?").bind(n).first();if(!v)return Response.json({success:!1,error:"Invalid credentials"},{status:401,headers:d});if(c=v,l="admin",!await Ae(v.password_hash,o))return Response.json({success:!1,error:"Invalid credentials"},{status:401,headers:d});u=["dashboard","classes","settings","thumbnails","userManagement"]}let g=Y(t),y=await Lt({username:c.username||c.email||c.name,id:c.id,role:l,permissions:u,assignment:m,classLabel:p,groupLabel:h},g);return Response.json({success:!0,username:c.username||c.email||c.name,role:l,permissions:u,assignment:m,classLabel:p,groupLabel:h,token:y},{headers:d})}if(s==="/api/me"&&e.method==="GET"){let a=await b(e,t),i=a?await t.DB.prepare(`SELECT users.role, user_profiles.username
             FROM users
             LEFT JOIN user_profiles ON user_profiles.user_id = users.id
             WHERE users.id = ?`).bind(a.id).first():null,n=a?await t.DB.prepare("SELECT class_label, group_label FROM academic_profiles WHERE user_id = ?").bind(a.id).first():null;return Response.json({user:a?{username:i?.username||a.username,role:i?.role||a.role,permissions:a.permissions||[],assignment:a.assignment||null,classLabel:n?.class_label||a.classLabel||null,groupLabel:n?.group_label||a.groupLabel||null}:null},{headers:d})}if(s==="/api/change-password"&&e.method==="POST"){let a=await b(e,t);if(!a)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await e.json().catch(()=>({})),n=String(i.currentPassword||""),o=String(i.newPassword||""),r=String(i.confirmPassword||"");if(!n||!o||!r)return Response.json({success:!1,error:"All password fields are required."},{status:400,headers:d});if(o.length<8)return Response.json({success:!1,error:"New password must be at least 8 characters."},{status:400,headers:d});if(o!==r)return Response.json({success:!1,error:"New passwords do not match."},{status:400,headers:d});let c=await t.DB.prepare(`SELECT users.id, users.password_hash, user_profiles.username
         FROM users
         LEFT JOIN user_profiles ON user_profiles.user_id = users.id
         WHERE users.id = ?`).bind(a.id).first(),l=c?.password_hash,u=null;if(!l&&a.role==="admin"){let v=await t.DB.prepare("SELECT id, username, password_hash FROM admins WHERE id = ?").bind(a.id).first();v?.password_hash&&(u=v,l=v.password_hash)}if(!l)return Response.json({success:!1,error:"User not found."},{status:404,headers:d});let[m,p]=l.split(":");if(await k(n,m)!==p)return Response.json({success:!1,error:"Current password is incorrect."},{status:401,headers:d});let{passwordHash:g}=await I(o),y=[];return c?.id&&(y.push(t.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(g,c.id)),c.username&&y.push(t.DB.prepare("UPDATE admins SET password_hash = ? WHERE username = ?").bind(g,c.username))),u?.id&&y.push(t.DB.prepare("UPDATE admins SET password_hash = ? WHERE id = ?").bind(g,u.id)),y.length&&await t.DB.batch(y),Response.json({success:!0},{headers:d})}return null};var Ke=new Map,w=e=>{Ke.has(e.name)||Ke.set(e.name,e)},ye=()=>Array.from(Ke.values());async function _e(e){let t=ye(),s=t.map(i=>e.prepare(i.createSql)),a=t.flatMap(i=>(i.seeds||[]).map(n=>e.prepare(n)));(s.length||a.length)&&await e.batch([...s,...a]),await Cn(e,t)}var Cn=async(e,t)=>{for(let s of t)try{let a=await e.prepare(`PRAGMA table_info(${s.name})`).all(),i=new Set((a.results||[]).map(n=>String(n.name)));for(let n of s.columns)i.has(n.name)||await e.prepare(`ALTER TABLE ${s.name} ADD COLUMN ${n.name} ${n.sql}`).run()}catch(a){console.warn(`Skipping column check for ${s.name}.`,a)}};var jt=async(e,t,s)=>{if(s==="/api/settings/reset"&&e.method==="POST"){let a=await b(e,t);if(!C(a))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await e.json().catch(()=>({}));if(!i||i.confirm!==!0)return Response.json({success:!1,error:"Confirmation required."},{status:400,headers:d});let o=((await t.DB.prepare("SELECT file_key FROM fonts").all()).results||[]).map(m=>m.file_key).filter(m=>typeof m=="string"&&m.length>0),c=((await t.DB.prepare("SELECT file_key FROM subject_thumbnails").all()).results||[]).map(m=>m.file_key).filter(m=>typeof m=="string"&&m.length>0),u=((await t.DB.prepare("SELECT file_key FROM chapter_thumbnails").all()).results||[]).map(m=>m.file_key).filter(m=>typeof m=="string"&&m.length>0);return o.length>0&&await t.BUCKET.delete(o),c.length>0&&await t.BUCKET.delete(c),u.length>0&&await t.BUCKET.delete(u),await t.DB.batch([t.DB.prepare("DELETE FROM fonts"),t.DB.prepare("DELETE FROM subject_thumbnails"),t.DB.prepare("DELETE FROM chapter_thumbnails"),t.DB.prepare("DELETE FROM content_store WHERE key = 'app-content'"),t.DB.prepare("DELETE FROM class_groups"),t.DB.prepare("DELETE FROM classes")]),await _e(t.DB),await T(t.DB,a,"Settings reset",{scope:"soft"}),Response.json({success:!0},{headers:d})}if(s==="/api/settings/hard-reset"&&e.method==="POST"){let a=await b(e,t);if(!C(a))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await e.json().catch(()=>({})),n=String(i.password||"");if(!n)return Response.json({success:!1,error:"Password is required."},{status:400,headers:d});let r=(await t.DB.prepare("SELECT id, password_hash FROM users WHERE id = ?").bind(a.id).first())?.password_hash;if(!r&&a.role==="admin"){let p=await t.DB.prepare("SELECT id, password_hash FROM admins WHERE id = ?").bind(a.id).first();p?.password_hash&&(r=p.password_hash)}if(!r)return Response.json({success:!1,error:"User not found."},{status:404,headers:d});let[c,l]=r.split(":");if(await k(n,c)!==l)return Response.json({success:!1,error:"Password is incorrect."},{status:401,headers:d});let m;do{let p=await t.BUCKET.list({cursor:m}),h=p.objects.map(g=>g.key);h.length&&await t.BUCKET.delete(h),m=p.truncated?p.cursor:void 0}while(m);return await t.DB.batch([t.DB.prepare("DROP TABLE IF EXISTS edit_history"),t.DB.prepare("DROP TABLE IF EXISTS user_profiles"),t.DB.prepare("DROP TABLE IF EXISTS admin_permissions"),t.DB.prepare("DROP TABLE IF EXISTS teacher_assignments"),t.DB.prepare("DROP TABLE IF EXISTS teacher_permissions"),t.DB.prepare("DROP TABLE IF EXISTS content_store"),t.DB.prepare("DROP TABLE IF EXISTS class_groups"),t.DB.prepare("DROP TABLE IF EXISTS classes"),t.DB.prepare("DROP TABLE IF EXISTS fonts"),t.DB.prepare("DROP TABLE IF EXISTS subject_thumbnails"),t.DB.prepare("DROP TABLE IF EXISTS chapter_thumbnails"),t.DB.prepare("DROP TABLE IF EXISTS users"),t.DB.prepare("DROP TABLE IF EXISTS admins")]),await _e(t.DB),Response.json({success:!0},{headers:d})}return null};w({name:"email_verifications",createSql:`CREATE TABLE IF NOT EXISTS email_verifications (
    email TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"email",sql:"TEXT PRIMARY KEY"},{name:"code",sql:"TEXT NOT NULL"},{name:"expires_at",sql:"INTEGER NOT NULL"},{name:"attempts",sql:"INTEGER DEFAULT 0"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"admins",createSql:`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"username",sql:"TEXT UNIQUE"},{name:"password_hash",sql:"TEXT"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"users",createSql:`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL
  )`,columns:[{name:"email",sql:"TEXT UNIQUE"},{name:"password_hash",sql:"TEXT"},{name:"role",sql:"TEXT NOT NULL"}]});w({name:"user_profiles",createSql:`CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    avatar_key TEXT,
    avatar_content_type TEXT,
    dashboard_view TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"username",sql:"TEXT UNIQUE"},{name:"name",sql:"TEXT"},{name:"avatar_key",sql:"TEXT"},{name:"avatar_content_type",sql:"TEXT"},{name:"dashboard_view",sql:"TEXT"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"admin_permissions",createSql:`CREATE TABLE IF NOT EXISTS admin_permissions (
    user_id INTEGER PRIMARY KEY,
    permissions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"permissions",sql:"TEXT NOT NULL"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"teacher_assignments",createSql:`CREATE TABLE IF NOT EXISTS teacher_assignments (
    user_id INTEGER PRIMARY KEY,
    level TEXT NOT NULL,
    subject TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"level",sql:"TEXT NOT NULL"},{name:"subject",sql:"TEXT NOT NULL"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"teacher_permissions",createSql:`CREATE TABLE IF NOT EXISTS teacher_permissions (
    user_id INTEGER PRIMARY KEY,
    permissions TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"permissions",sql:"TEXT NOT NULL"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"edit_history",createSql:`CREATE TABLE IF NOT EXISTS edit_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER NOT NULL"},{name:"action",sql:"TEXT NOT NULL"},{name:"details",sql:"TEXT"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"content_store",createSql:`CREATE TABLE IF NOT EXISTS content_store (
    key TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"key",sql:"TEXT PRIMARY KEY"},{name:"data",sql:"TEXT NOT NULL"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"classes",createSql:`CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"name",sql:"TEXT UNIQUE"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}],seeds:["INSERT OR IGNORE INTO classes (name) VALUES ('SSC'), ('HSC')",`INSERT OR IGNORE INTO class_groups (class_id, name)
      SELECT classes.id, group_names.name
      FROM classes
      JOIN (SELECT 'Science' AS name UNION ALL SELECT 'Humanities' UNION ALL SELECT 'Business Studies') AS group_names
      WHERE classes.name IN ('SSC', 'HSC')`]});w({name:"class_groups",createSql:`CREATE TABLE IF NOT EXISTS class_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
  )`,columns:[{name:"class_id",sql:"INTEGER NOT NULL"},{name:"name",sql:"TEXT NOT NULL"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"fonts",createSql:`CREATE TABLE IF NOT EXISTS fonts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    file_key TEXT,
    content_type TEXT,
    original_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"name",sql:"TEXT"},{name:"file_key",sql:"TEXT"},{name:"content_type",sql:"TEXT"},{name:"original_name",sql:"TEXT"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"subject_thumbnails",createSql:`CREATE TABLE IF NOT EXISTS subject_thumbnails (
    subject_key TEXT PRIMARY KEY,
    file_key TEXT,
    content_type TEXT,
    zoom REAL DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"file_key",sql:"TEXT"},{name:"content_type",sql:"TEXT"},{name:"zoom",sql:"REAL DEFAULT 1"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"chapter_thumbnails",createSql:`CREATE TABLE IF NOT EXISTS chapter_thumbnails (
    chapter_key TEXT PRIMARY KEY,
    file_key TEXT,
    content_type TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"file_key",sql:"TEXT"},{name:"content_type",sql:"TEXT"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"academic_profiles",createSql:`CREATE TABLE IF NOT EXISTS academic_profiles (
    user_id INTEGER PRIMARY KEY,
    class_label TEXT,
    group_label TEXT,
    religion TEXT,
    date_of_birth TEXT,
    batch_year TEXT,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"class_label",sql:"TEXT"},{name:"group_label",sql:"TEXT"},{name:"religion",sql:"TEXT"},{name:"date_of_birth",sql:"TEXT"},{name:"batch_year",sql:"TEXT"},{name:"points",sql:"INTEGER DEFAULT 0"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"user_points_log",createSql:`CREATE TABLE IF NOT EXISTS user_points_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER NOT NULL"},{name:"points",sql:"INTEGER NOT NULL"},{name:"reason",sql:"TEXT NOT NULL"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});w({name:"social_profiles",createSql:`CREATE TABLE IF NOT EXISTS social_profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,columns:[{name:"user_id",sql:"INTEGER PRIMARY KEY"},{name:"bio",sql:"TEXT"},{name:"followers_count",sql:"INTEGER DEFAULT 0"},{name:"following_count",sql:"INTEGER DEFAULT 0"},{name:"created_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"},{name:"updated_at",sql:"DATETIME DEFAULT CURRENT_TIMESTAMP"}]});var wn=async(e,t)=>(await e.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").bind(t.name).first())?.name?!0:(await e.prepare(t.createSql).run(),!1),Bt=async(e,t)=>{let s=await e.prepare(`PRAGMA table_info(${t})`).all();return new Set((s.results||[]).map(a=>String(a.name)))},Tn=async e=>{let t=await Bt(e,"users");if(t.has("username")||t.has("name")||t.has("class_label")||t.has("group_label")){let i=t.has("username")?"username":"email",n=t.has("name")?"name":i;await e.prepare(`INSERT INTO user_profiles (user_id, username, name)
       SELECT id, ${i}, ${n}
       FROM users
       WHERE id NOT IN (SELECT user_id FROM user_profiles)`).run()}if(t.has("class_label")||t.has("group_label")||t.has("religion")||t.has("date_of_birth")||t.has("batch_year")||t.has("points")){let i=t.has("class_label")?"class_label":"NULL",n=t.has("group_label")?"group_label":"NULL",o=t.has("religion")?"religion":"NULL",r=t.has("date_of_birth")?"date_of_birth":"NULL",c=t.has("batch_year")?"batch_year":"NULL",l=t.has("points")?"points":"0";await e.prepare(`INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year, points)
       SELECT id, ${i}, ${n}, ${o}, ${r}, ${c}, ${l}
       FROM users
       WHERE role = 'student' AND id NOT IN (SELECT user_id FROM academic_profiles)`).run()}},En=async e=>((await e.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()).results||[]).map(s=>String(s.name)),Ln=e=>e.startsWith("sqlite_")||e==="d1_migrations",F=async e=>{let t=ye(),s=new Set(t.map(n=>n.name)),a={createdTables:[],addedColumns:[],droppedTables:[],errors:[]},i=await En(e.DB);for(let n of i)if(!Ln(n)&&!s.has(n))try{let o=n.replace(/"/g,'""');await e.DB.prepare(`DROP TABLE IF EXISTS "${o}"`).run(),a.droppedTables.push(n)}catch(o){a.errors.push({table:n,error:o instanceof Error?o.message:String(o)})}for(let n of t)try{if(!await wn(e.DB,n)){if(a.createdTables.push(n.name),n.seeds&&n.seeds.length){let c=n.seeds.map(l=>e.DB.prepare(l));await e.DB.batch(c)}continue}let r=await Bt(e.DB,n.name);for(let c of n.columns)r.has(c.name)||(await e.DB.prepare(`ALTER TABLE ${n.name} ADD COLUMN ${c.name} ${c.sql}`).run(),a.addedColumns.push({table:n.name,column:c.name,sql:c.sql}))}catch(o){a.errors.push({table:n.name,error:o instanceof Error?o.message:String(o)})}return await Tn(e.DB),a};var Pn=["dashboard","classes","settings","thumbnails","userManagement"],Mt=async(e,t,s)=>{if(s==="/api/system/status"&&e.method==="GET"){let p=await t.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first(),h=await t.DB.prepare("SELECT count(*) as count FROM admins").first(),g=Number(p?.count||0)>0||Number(h?.count||0)>0;return Response.json({initialized:g},{headers:d})}if(s!=="/api/system/init"||e.method!=="POST")return null;await F(t);let a=await t.DB.prepare("SELECT count(*) as count FROM users WHERE role = 'admin'").first();if(Number(a?.count||0)>0)return Response.json({success:!1,error:"System already initialized"},{status:403,headers:d});let n=await e.json().catch(()=>({})),o=String(n.adminName||"").trim(),r=E(String(n.email||"")),c=String(n.password||""),l=String(n.confirmPassword||"");if(!o||!r||!c||!l)return Response.json({success:!1,error:"Admin name, email, and password are required."},{status:400,headers:d});if(c.length<8)return Response.json({success:!1,error:"Password must be at least 8 characters."},{status:400,headers:d});if(c!==l)return Response.json({success:!1,error:"Passwords do not match."},{status:400,headers:d});let{passwordHash:u}=await I(c);await t.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)").bind(r,u,"admin").run();let m=await t.DB.prepare("SELECT id FROM users WHERE email = ?").bind(r).first();return m?.id?(await t.DB.batch([t.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)").bind(m.id,o,o),t.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)").bind(m.id,JSON.stringify(Pn)),t.DB.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?)").bind(o,u)]),Response.json({success:!0,message:"System Initialized & Admin Created"},{headers:d})):Response.json({success:!1,error:"Admin creation failed."},{status:500,headers:d})};var kn=(e,t)=>{let s=t.ADMIN_KEY;return s?e.headers.get("x-admin-key")===s:!1},qt=async(e,t,s)=>{if(s!=="/api/system/migrate"||e.method!=="GET")return null;if(!kn(e,t))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await F(t);return Response.json({success:!0,report:a},{headers:d})};var At=e=>`/api/profile/avatar?v=${e?new Date(e).getTime():Date.now()}`,Dt=async(e,t,s)=>{if(!s.startsWith("/api/profile"))return null;let a=async()=>{let i=await b(e,t);if(i)return i;let o=new URL(e.url).searchParams.get("token");if(!o)return null;let r=Y(t);return await be(o,r)};if(s==="/api/profile"&&e.method==="GET"){let i=await b(e,t);if(!i)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let o=await t.DB.prepare(`SELECT users.id, users.email, users.role, user_profiles.username, user_profiles.name, user_profiles.dashboard_view
         FROM users
         LEFT JOIN user_profiles ON user_profiles.user_id = users.id
         WHERE users.id = ?`).bind(i.id).first();if(!o&&i.role==="admin"){let l=await t.DB.prepare("SELECT id, username FROM admins WHERE id = ?").bind(i.id).first(),u=await t.DB.prepare("SELECT username, name FROM user_profiles WHERE user_id = ?").bind(i.id).first();o=l?{id:l.id,username:u?.username||l.username,name:u?.name||u?.username||l.username,email:null,role:"admin"}:null}if(!o)return Response.json({success:!1,error:"User not found."},{status:404,headers:d});let r=i.role==="teacher"?await t.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(i.id).first():null,c=await t.DB.prepare("SELECT avatar_key, avatar_content_type, updated_at FROM user_profiles WHERE user_id = ?").bind(i.id).first();return Response.json({success:!0,profile:{id:o.id,username:o.username||o.email,name:o.name||o.username,email:o.email||null,role:o.role||i.role,dashboardView:o.dashboard_view||null,assignment:r?{level:r.level,subject:r.subject}:null,avatarUrl:c?.avatar_key?At(c.updated_at):null}},{headers:d})}if(s==="/api/profile"&&e.method==="PUT"){let i=await b(e,t);if(!i)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let n=await e.json().catch(()=>({})),o=typeof n.name=="string"?n.name.trim():"",r=typeof n.dashboardView=="string"?n.dashboardView.trim():"",c=new Set(["card","list"]),l=!!o,u=c.has(r);return!l&&!u?Response.json({success:!1,error:"Profile update payload is required."},{status:400,headers:d}):l&&u?(await t.DB.prepare("INSERT INTO user_profiles (user_id, name, dashboard_view) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET name = excluded.name, dashboard_view = excluded.dashboard_view, updated_at = CURRENT_TIMESTAMP").bind(i.id,o,r).run()).success?(await T(t.DB,i,"Profile updated",{name:o,dashboardView:r}),Response.json({success:!0},{headers:d})):Response.json({success:!1,error:"Profile update failed."},{status:500,headers:d}):l?(await t.DB.prepare("INSERT INTO user_profiles (user_id, name) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET name = excluded.name, updated_at = CURRENT_TIMESTAMP").bind(i.id,o).run()).success?(await T(t.DB,i,"Profile updated",{name:o}),Response.json({success:!0},{headers:d})):Response.json({success:!1,error:"Profile update failed."},{status:500,headers:d}):(await t.DB.prepare("INSERT INTO user_profiles (user_id, dashboard_view) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET dashboard_view = excluded.dashboard_view, updated_at = CURRENT_TIMESTAMP").bind(i.id,r).run()).success?(await T(t.DB,i,"Dashboard view updated",{dashboardView:r}),Response.json({success:!0},{headers:d})):Response.json({success:!1,error:"Profile update failed."},{status:500,headers:d})}if(s==="/api/profile/avatar"&&e.method==="GET"){let i=await a();if(!i)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let n=await t.DB.prepare("SELECT avatar_key, avatar_content_type FROM user_profiles WHERE user_id = ?").bind(i.id).first();if(!n?.avatar_key)return Response.json({success:!1,error:"Avatar not found."},{status:404,headers:d});let o=await t.BUCKET.get(n.avatar_key);if(!o)return Response.json({success:!1,error:"Avatar file missing."},{status:404,headers:d});let r=new Headers(d);return r.set("Content-Type",n.avatar_content_type||"application/octet-stream"),r.set("Cache-Control","public, max-age=3600"),new Response(o.body,{headers:r})}if(s==="/api/profile/avatar"&&e.method==="POST"){let i=await b(e,t);if(!i)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let o=(await e.formData()).get("file");if(!(o instanceof File))return Response.json({success:!1,error:"Avatar file is required."},{status:400,headers:d});let r=await o.arrayBuffer(),c=`avatars/${i.id}-${crypto.randomUUID()}-${o.name}`,l=o.type||"application/octet-stream";await t.BUCKET.put(c,r,{httpMetadata:{contentType:l}});let u=await t.DB.prepare("SELECT avatar_key FROM user_profiles WHERE user_id = ?").bind(i.id).first();return await t.DB.prepare("INSERT INTO user_profiles (user_id, avatar_key, avatar_content_type) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET avatar_key = excluded.avatar_key, avatar_content_type = excluded.avatar_content_type, updated_at = CURRENT_TIMESTAMP").bind(i.id,c,l).run(),u?.avatar_key&&await t.BUCKET.delete(u.avatar_key),await T(t.DB,i,"Avatar updated",{fileKey:c}),Response.json({success:!0,avatarUrl:At(new Date().toISOString())},{headers:d})}if(s==="/api/profile/history"&&e.method==="GET"){let i=await b(e,t);if(!i)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let o=((await t.DB.prepare("SELECT action, details, created_at FROM edit_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 20").bind(i.id).all()).results||[]).map(r=>({action:r.action,details:r.details,createdAt:r.created_at}));return Response.json({success:!0,entries:o},{headers:d})}return null};var In=[Rt,jt,Mt,Dt,qt],Kt=()=>({id:"system",match:e=>e.startsWith("/api"),handle:async(e,t)=>{let a=new URL(e.url).pathname;for(let i of In){let n=await i(e,t,a);if(n)return n}return null}});var _t=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await e.json(),i=String(a.role||"").trim().toLowerCase(),n=String(a.name||"").trim(),o=E(String(a.email||"")),r=String(a.password||"");if(!n||!o||!r)return Response.json({success:!1,error:"Name, email, and password are required."},{status:400,headers:d});if(r.length<8)return Response.json({success:!1,error:"Password must be at least 8 characters."},{status:400,headers:d});if(!["admin","teacher","student"].includes(i))return Response.json({success:!1,error:"Invalid role."},{status:400,headers:d});if(await t.DB.prepare("SELECT id FROM users WHERE email = ?").bind(o).first())return Response.json({success:!1,error:"User with this email already exists."},{status:400,headers:d});let{passwordHash:l}=await I(r),u=o,m=a.classLabel||null,p=a.groupLabel||null;await t.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)").bind(o,l,i).run();let h=await t.DB.prepare("SELECT id FROM users WHERE email = ?").bind(o).first();if(!h?.id)return Response.json({success:!1,error:"User creation failed."},{status:500,headers:d});if(await t.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)").bind(h.id,u,n).run(),i==="student"&&await t.DB.prepare("INSERT INTO academic_profiles (user_id, class_label, group_label) VALUES (?, ?, ?)").bind(h.id,m,p).run(),i==="teacher"){let g=U(String(a.level||"")),y=_(String(a.subject||""));if(!O(g)||!Q(y))return await t.DB.batch([t.DB.prepare("DELETE FROM academic_profiles WHERE user_id = ?").bind(h.id),t.DB.prepare("DELETE FROM user_profiles WHERE user_id = ?").bind(h.id),t.DB.prepare("DELETE FROM users WHERE id = ?").bind(h.id)]),Response.json({success:!1,error:"Invalid teacher level or subject."},{status:400,headers:d});let v=a.permissions||[],x=Array.isArray(v)?v:[];await t.DB.batch([t.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?)").bind(h.id,g,y),t.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?)").bind(h.id,JSON.stringify(x))])}if(i==="admin"){let g=a.permissions||[],y=Array.isArray(g)?g:[];await t.DB.prepare("INSERT INTO admin_permissions (user_id, permissions) VALUES (?, ?)").bind(h.id,JSON.stringify(y)).run()}return Response.json({success:!0},{headers:d})};var Ht=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await e.json(),i=Number(a.id);if(!i)return Response.json({success:!1,error:"User ID is required"},{status:400,headers:d});let n=await t.DB.prepare("SELECT role FROM users WHERE id = ?").bind(i).first();if(!n)return Response.json({success:!1,error:"User not found"},{status:404,headers:d});if(n.role!=="student")return Response.json({success:!1,error:"Only student accounts can be deleted here."},{status:400,headers:d});let o=await t.DB.prepare("SELECT avatar_key FROM user_profiles WHERE user_id = ?").bind(i).first();return await t.DB.batch([t.DB.prepare("DELETE FROM academic_profiles WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM social_profiles WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM user_profiles WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM admin_permissions WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM teacher_assignments WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM teacher_permissions WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM edit_history WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM user_points_log WHERE user_id = ?").bind(i),t.DB.prepare("DELETE FROM users WHERE id = ?").bind(i)]),o?.avatar_key&&await t.BUCKET.delete(o.avatar_key),Response.json({success:!0},{headers:d})};var Ut=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await t.DB.prepare(`SELECT users.id, users.email, user_profiles.name
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       WHERE users.role = 'admin'
       ORDER BY user_profiles.created_at DESC`).all(),i=await t.DB.prepare(`SELECT users.id, users.email, user_profiles.name
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       WHERE users.role = 'teacher'
       ORDER BY user_profiles.created_at DESC`).all(),n=await t.DB.prepare(`SELECT users.id, users.email, user_profiles.name, academic_profiles.class_label, academic_profiles.group_label
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
       WHERE users.role = 'student'
       ORDER BY user_profiles.created_at DESC`).all(),o=await t.DB.prepare("SELECT user_id, permissions FROM admin_permissions").all(),r=await t.DB.prepare("SELECT user_id, permissions FROM teacher_permissions").all(),c=await t.DB.prepare("SELECT user_id, level, subject FROM teacher_assignments").all(),l=new Map;(o.results||[]).forEach(p=>{p?.user_id&&l.set(p.user_id,p.permissions?JSON.parse(p.permissions):[])});let u=new Map;(c.results||[]).forEach(p=>{p?.user_id&&u.set(p.user_id,{level:p.level,subject:p.subject})});let m=new Map;return(r.results||[]).forEach(p=>{p?.user_id&&m.set(p.user_id,p.permissions?JSON.parse(p.permissions):[])}),Response.json({success:!0,admins:(a.results||[]).map(p=>({id:p.id,name:p.name||p.email,email:p.email,permissions:l.get(p.id)||[]})),teachers:(i.results||[]).map(p=>({id:p.id,name:p.name||p.email,email:p.email,level:u.get(p.id)?.level||"",subject:u.get(p.id)?.subject||"",permissions:m.get(p.id)||[]})),students:(n.results||[]).map(p=>({id:p.id,name:p.name||p.email,email:p.email,classLabel:p.class_label,groupLabel:p.group_label}))},{headers:d})};var Qt=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let{adminPassword:a,targetId:i}=await e.json(),n=await t.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(s.id).first();if(!n)return Response.json({success:!1,error:"Admin not found"},{status:401,headers:d});let[o,r]=n.password_hash.split(":");if(await k(a,o)!==r)return Response.json({success:!1,error:"Incorrect Admin Password"},{status:401,headers:d});let l=await t.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(i).first();return l?Response.json({success:!0,hash:l.password_hash},{headers:d}):Response.json({success:!1,error:"User not found"},{status:404,headers:d})};var Ot=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let{adminPassword:a,targetId:i,newPassword:n}=await e.json(),o=await t.DB.prepare("SELECT password_hash FROM users WHERE id = ?").bind(s.id).first();if(!o)return Response.json({success:!1,error:"Admin not found"},{status:401,headers:d});let[r,c]=o.password_hash.split(":");if(await k(a,r)!==c)return Response.json({success:!1,error:"Incorrect Admin Password"},{status:401,headers:d});if(n.length<8)return Response.json({success:!1,error:"New password too short"},{status:400,headers:d});let{passwordHash:u}=await I(n);return await t.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(u,i).run(),Response.json({success:!0},{headers:d})};var Ft=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await e.json(),i=Number(a.id);if(!i)return Response.json({success:!1,error:"User ID is required"},{status:400,headers:d});if(String(a.role||"").trim().toLowerCase()==="teacher"){let o=U(String(a.level||"")),r=_(String(a.subject||""));if(!O(o)||!Q(r))return Response.json({success:!1,error:"Invalid teacher level or subject."},{status:400,headers:d});let c=a.permissions||[];await t.DB.batch([t.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET level=excluded.level, subject=excluded.subject").bind(i,o,r),t.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET permissions=excluded.permissions").bind(i,JSON.stringify(c))])}return Response.json({success:!0},{headers:d})};var Gt=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=new URL(e.url),i=Number(a.searchParams.get("id"));if(!i)return Response.json({success:!1,error:"User ID is required"},{status:400,headers:d});let n=await t.DB.prepare(`SELECT users.id, users.email, users.role, user_profiles.name, user_profiles.created_at,
              academic_profiles.class_label, academic_profiles.group_label, academic_profiles.religion,
              academic_profiles.date_of_birth, academic_profiles.batch_year, academic_profiles.points
       FROM users
       LEFT JOIN user_profiles ON user_profiles.user_id = users.id
       LEFT JOIN academic_profiles ON academic_profiles.user_id = users.id
       WHERE users.id = ?`).bind(i).first();if(!n)return Response.json({success:!1,error:"User not found"},{status:404,headers:d});let o=await t.DB.prepare("SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC").bind(i).all();return Response.json({success:!0,user:{id:n.id,name:n.name||n.email,email:n.email,role:n.role,classLabel:n.class_label,groupLabel:n.group_label,religion:n.religion,dateOfBirth:n.date_of_birth,batchYear:n.batch_year,points:n.points||0,createdAt:n.created_at,pointLogs:(o.results||[]).map(r=>({points:r.points,reason:r.reason,createdAt:r.created_at}))}},{headers:d})},Vt=async(e,t)=>{let s=await b(e,t);if(!C(s))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let a=await e.json(),i=Number(a.id);if(!i)return Response.json({success:!1,error:"User ID is required"},{status:400,headers:d});let n=await q(t.DB,i);if(!n)return Response.json({success:!1,error:"User not found"},{status:404,headers:d});if(n.role!=="student")return Response.json({success:!1,error:"Only student accounts can be edited here."},{status:400,headers:d});let o=a.name?String(a.name).trim():null,r=a.email?E(String(a.email)):null,c=a.classLabel?String(a.classLabel).trim():null,l=a.groupLabel?String(a.groupLabel).trim():null,u=a.religion?String(a.religion).trim():null,m=a.dateOfBirth?String(a.dateOfBirth).trim():null,p=a.batchYear?String(a.batchYear).trim():null,h=r||n.email;return r&&r!==n.email&&await t.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?").bind(r,i).first()?Response.json({success:!1,error:"Email already in use."},{status:400,headers:d}):(await t.DB.batch([t.DB.prepare("UPDATE users SET email = ? WHERE id = ?").bind(h,i),t.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET username = excluded.username, name = excluded.name, updated_at = CURRENT_TIMESTAMP").bind(i,h,o),t.DB.prepare("INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET class_label = excluded.class_label, group_label = excluded.group_label, religion = excluded.religion, date_of_birth = excluded.date_of_birth, batch_year = excluded.batch_year, updated_at = CURRENT_TIMESTAMP").bind(i,c,l,u,m,p)]),Response.json({success:!0},{headers:d}))};var zt=async(e,t,s)=>s==="/api/users"&&e.method==="GET"?Ut(e,t):s==="/api/users"&&e.method==="POST"?_t(e,t):s==="/api/users"&&e.method==="PUT"?Ft(e,t):s==="/api/users/reveal"&&e.method==="POST"?Qt(e,t):s==="/api/users/reset"&&e.method==="POST"?Ot(e,t):s==="/api/users/details"&&e.method==="GET"?Gt(e,t):s==="/api/users/details"&&e.method==="PUT"?Vt(e,t):s==="/api/users/delete"&&e.method==="POST"?Ht(e,t):null;var Rn=[zt],Wt=()=>({id:"admin-users",match:e=>e.startsWith("/api/users"),handle:async(e,t)=>{let a=new URL(e.url).pathname;for(let i of Rn){let n=await i(e,t,a);if(n)return n}return null}});var ve=e=>{let s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},a=(n=>typeof n=="string"?n==="*"?()=>n:o=>n===o?o:null:typeof n=="function"?n:o=>n.includes(o)?o:null)(s.origin),i=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(s.allowMethods);return async function(o,r){function c(u,m){o.res.headers.set(u,m)}let l=await a(o.req.header("origin")||"",o);if(l&&c("Access-Control-Allow-Origin",l),s.credentials&&c("Access-Control-Allow-Credentials","true"),s.exposeHeaders?.length&&c("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),o.req.method==="OPTIONS"){s.origin!=="*"&&c("Vary","Origin"),s.maxAge!=null&&c("Access-Control-Max-Age",s.maxAge.toString());let u=await i(o.req.header("origin")||"",o);u.length&&c("Access-Control-Allow-Methods",u.join(","));let m=s.allowHeaders;if(!m?.length){let p=o.req.header("Access-Control-Request-Headers");p&&(m=p.split(/\s*,\s*/))}return m?.length&&(c("Access-Control-Allow-Headers",m.join(",")),o.res.headers.append("Vary","Access-Control-Request-Headers")),o.res.headers.delete("Content-Length"),o.res.headers.delete("Content-Type"),new Response(null,{headers:o.res.headers,status:204,statusText:"No Content"})}await r(),s.origin!=="*"&&o.header("Vary","Origin",{append:!0})}};var $t=async(e,t,s)=>{try{let i=await(await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({client_id:s.GMAIL_CLIENT_ID,client_secret:s.GMAIL_CLIENT_SECRET,refresh_token:s.GMAIL_REFRESH_TOKEN,grant_type:"refresh_token"})})).json();if(!i.access_token)return console.error("Failed to refresh Gmail token:",i),!1;let n="Your Verification Code",o=`
<div style="font-family: sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 8px;">
    <h2>Welcome to Freeducation!</h2>
    <p>Please enter the following code to verify your account:</p>
    <h1 style="color: #4F46E5; letter-spacing: 5px; margin: 20px 0;">${t}</h1>
    <p>This code will expire in 10 minutes.</p>
    <p style="font-size: 12px; color: #888; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
</div>
`,r=`=?utf-8?B?${btoa(n)}?=`,l=["From: Freeducation <mahfuz.alam.shohan@gmail.com>",`To: ${e}`,`Subject: ${r}`,"MIME-Version: 1.0","Content-Type: text/html; charset=utf-8","",o].join(`
`),u=btoa(unescape(encodeURIComponent(l))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),m=await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send",{method:"POST",headers:{Authorization:`Bearer ${i.access_token}`,"Content-Type":"application/json"},body:JSON.stringify({raw:u})});return m.ok?!0:(console.error("Gmail Send Error:",await m.text()),!1)}catch(a){return console.error("Network Error:",a),!1}};var He=new P;He.post("/register-request",async e=>{try{let{name:t,email:s,password:a,classLabel:i,groupLabel:n}=await e.req.json(),o=String(t||"").trim(),r=E(String(s||"")),c=String(a||"");if(!r||!c||!o)return e.json({success:!1,error:"Missing fields"},400);if(c.length<8)return e.json({success:!1,error:"Password must be at least 8 characters."},400);if(await e.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(r).first())return e.json({success:!1,error:"User already exists. Please login."},400);let u=Math.floor(1e5+Math.random()*9e5).toString(),m=Date.now()+10*60*1e3;return await e.env.DB.prepare(`
      INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET code = ?, expires_at = ?, attempts = 0
    `).bind(r,u,m,u,m).run(),await $t(r,u,e.env)?e.json({success:!0,message:"OTP sent"}):e.json({success:!1,error:"Failed to send email. Please try again later."},500)}catch(t){return console.error("Register Error:",t),e.json({success:!1,error:"Server error"},500)}});He.post("/register-verify",async e=>{try{let{email:t,code:s,name:a,password:i,classLabel:n,groupLabel:o}=await e.req.json(),r=E(String(t||"")),c=String(a||"").trim(),l=String(i||"");if(!r||!c||!l)return e.json({success:!1,error:"Missing fields"},400);if(l.length<8)return e.json({success:!1,error:"Password must be at least 8 characters."},400);let u=await e.env.DB.prepare("SELECT * FROM email_verifications WHERE email = ?").bind(r).first();if(!u)return e.json({success:!1,error:"No verification request found"},400);if(Date.now()>u.expires_at)return e.json({success:!1,error:"Code expired. Try again."},400);if(String(u.code)!==String(s))return e.json({success:!1,error:"Invalid code"},400);if(await e.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(r).first())return e.json({success:!1,error:"User already exists. Please login."},400);let{passwordHash:p}=await I(l);await e.env.DB.prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)").bind(r,p,"student").run();let h=await e.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(r).first();return h?.id?(await e.env.DB.batch([e.env.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?)").bind(h.id,r,c),e.env.DB.prepare("INSERT INTO academic_profiles (user_id, class_label, group_label) VALUES (?, ?, ?)").bind(h.id,n||null,o||null)]),await e.env.DB.prepare("DELETE FROM email_verifications WHERE email = ?").bind(r).run(),e.json({success:!0,message:"Account created"})):e.json({success:!1,error:"Account creation failed"},500)}catch(t){return e.json({success:!1,error:"Database error: "+(t instanceof Error?t.message:String(t))},500)}});var Yt=He;var Xt=e=>{let t=e.classLabel?String(e.classLabel).trim():"",s=e.religion?String(e.religion).trim():"",a=e.dateOfBirth?String(e.dateOfBirth).trim():"",i=e.batchYear?String(e.batchYear).trim():"",n=e.groupLabel?String(e.groupLabel).trim():"",o=t==="SSC"||t==="HSC",r=t==="SSC"||t==="HSC";return!(!s||!t||!a||o&&!n||r&&!i)},jn=async(e,t)=>((await e.prepare("SELECT points, reason, created_at FROM user_points_log WHERE user_id = ? ORDER BY created_at DESC").bind(t).all()).results||[]).map(a=>({points:a.points,reason:a.reason,createdAt:a.created_at})),fe=async(e,t,s)=>{if(s==="/api/student/profile"&&e.method==="GET"){let a=await b(e,t);if(!a||a.role!=="student")return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await q(t.DB,a.id),n=await t.DB.prepare("SELECT class_label, group_label, religion, date_of_birth, batch_year, points FROM academic_profiles WHERE user_id = ?").bind(a.id).first();return i?Response.json({success:!0,profile:{id:i.id,name:i.name||i.email,email:i.email,classLabel:n?.class_label||null,groupLabel:n?.group_label||null,religion:n?.religion||null,dateOfBirth:n?.date_of_birth||null,batchYear:n?.batch_year||null,points:n?.points||0}},{headers:d}):Response.json({success:!1,error:"User not found"},{status:404,headers:d})}if(s==="/api/student/profile"&&e.method==="PUT"){let a=await b(e,t);if(!a||a.role!=="student")return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});if(!await q(t.DB,a.id))return Response.json({success:!1,error:"User not found"},{status:404,headers:d});let n=await e.json().catch(()=>({})),o=n.classLabel?String(n.classLabel).trim():null,r=n.groupLabel?String(n.groupLabel).trim():null,c=n.religion?String(n.religion).trim():null,l=n.dateOfBirth?String(n.dateOfBirth).trim():null,u=n.batchYear?String(n.batchYear).trim():null,m=await t.DB.prepare("SELECT class_label, group_label, religion, date_of_birth, batch_year, points FROM academic_profiles WHERE user_id = ?").bind(a.id).first(),p={religion:c,classLabel:o,groupLabel:r,dateOfBirth:l,batchYear:u},h=Number(m?.points||0);await t.DB.prepare("INSERT INTO academic_profiles (user_id, class_label, group_label, religion, date_of_birth, batch_year, points) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET class_label = excluded.class_label, group_label = excluded.group_label, religion = excluded.religion, date_of_birth = excluded.date_of_birth, batch_year = excluded.batch_year, points = excluded.points, updated_at = CURRENT_TIMESTAMP").bind(a.id,o,r,c,l,u,h).run();let g=Xt({religion:m?.religion||null,classLabel:m?.class_label||null,groupLabel:m?.group_label||null,dateOfBirth:m?.date_of_birth||null,batchYear:m?.batch_year||null}),y=Xt(p),v=0;if(!g&&y&&!await t.DB.prepare("SELECT id FROM user_points_log WHERE user_id = ? AND reason = ? LIMIT 1").bind(a.id,"profile_complete").first()){v=10;let j=h+v;await t.DB.batch([t.DB.prepare("UPDATE academic_profiles SET points = ? WHERE user_id = ?").bind(j,a.id),t.DB.prepare("INSERT INTO user_points_log (user_id, points, reason) VALUES (?, ?, ?)").bind(a.id,v,"profile_complete")])}return await T(t.DB,a,"Student profile updated",{classLabel:o,groupLabel:r,religion:c,dateOfBirth:l,batchYear:u}),Response.json({success:!0,pointsAwarded:v},{headers:d})}if(s==="/api/points"&&e.method==="GET"){let a=await b(e,t);if(!a||a.role!=="student")return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await t.DB.prepare("SELECT points FROM academic_profiles WHERE user_id = ?").bind(a.id).first();if(!i)return Response.json({success:!1,error:"User not found"},{status:404,headers:d});let n=await jn(t.DB,a.id);return Response.json({success:!0,points:i.points||0,logs:n},{headers:d})}return null};var G=new P;G.use("/api/*",ve());G.route("/api/student",Yt);G.get("/api/student/profile",async e=>fe(e.req.raw,e.env,"/api/student/profile"));G.put("/api/student/profile",async e=>fe(e.req.raw,e.env,"/api/student/profile"));G.get("/api/points",async e=>fe(e.req.raw,e.env,"/api/points"));var Jt=()=>({id:"student-auth",match:e=>e.startsWith("/api/student"),handle:(e,t)=>G.fetch(e,t)});var X=new P;X.get("/profile",async e=>{let t=await b(e.req.raw,e.env);if(!t||t.role!=="teacher")return e.json({success:!1,error:"Unauthorized"},401,d);let s=await q(e.env.DB,t.id);if(!s)return e.json({success:!1,error:"User not found."},404,d);let a=await e.env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(t.id).first(),i=await e.env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?").bind(t.id).first();return e.json({success:!0,profile:{id:s.id,name:s.name||s.email,email:s.email,assignment:a?{level:a.level,subject:a.subject}:null,permissions:i?.permissions?JSON.parse(i.permissions):[]}},200,d)});X.put("/profile",async e=>{let t=await b(e.req.raw,e.env);if(!t||t.role!=="teacher")return e.json({success:!1,error:"Unauthorized"},401,d);let s=await e.req.json().catch(()=>({})),a=s.name?String(s.name).trim():null,i=s.email?E(String(s.email)):null,n=await q(e.env.DB,t.id);return n?i&&i!==n.email&&await e.env.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?").bind(i,t.id).first()?e.json({success:!1,error:"Email already in use."},400,d):(await e.env.DB.batch([e.env.DB.prepare("UPDATE users SET email = ? WHERE id = ?").bind(i||n.email,t.id),e.env.DB.prepare("INSERT INTO user_profiles (user_id, username, name) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET username = excluded.username, name = excluded.name, updated_at = CURRENT_TIMESTAMP").bind(t.id,i||n.email,a||n.name)]),e.json({success:!0},200,d)):e.json({success:!1,error:"User not found."},404,d)});X.get("/assignments",async e=>{let t=await b(e.req.raw,e.env);if(!t||t.role!=="teacher")return e.json({success:!1,error:"Unauthorized"},401,d);let s=await e.env.DB.prepare("SELECT level, subject FROM teacher_assignments WHERE user_id = ?").bind(t.id).first(),a=await e.env.DB.prepare("SELECT permissions FROM teacher_permissions WHERE user_id = ?").bind(t.id).first();return e.json({success:!0,assignment:s?{level:s.level,subject:s.subject}:null,permissions:a?.permissions?JSON.parse(a.permissions):[]},200,d)});X.put("/assignments",async e=>{let t=await b(e.req.raw,e.env);if(!t||t.role!=="teacher")return e.json({success:!1,error:"Unauthorized"},401,d);let s=await e.req.json().catch(()=>({})),a=U(String(s.level||"")),i=_(String(s.subject||""));if(!O(a)||!Q(i))return e.json({success:!1,error:"Invalid teacher level or subject."},400,d);let n=s.permissions||[],o=Array.isArray(n)?n:[];return await e.env.DB.batch([e.env.DB.prepare("INSERT INTO teacher_assignments (user_id, level, subject) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET level = excluded.level, subject = excluded.subject").bind(t.id,a,i),e.env.DB.prepare("INSERT INTO teacher_permissions (user_id, permissions) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET permissions = excluded.permissions").bind(t.id,JSON.stringify(o))]),e.json({success:!0},200,d)});var Zt=X;var Ue=new P;Ue.use("/api/*",ve());Ue.route("/api/teacher",Zt);var es=()=>({id:"teacher-profile",match:e=>e.startsWith("/api/teacher"),handle:(e,t)=>Ue.fetch(e,t)});var dashboardApiModule=()=>({id:"dashboard",match:e=>e.startsWith("/api/dashboard"),handle:async(e,t)=>{let s=new URL(e.url).pathname;if(s==="/api/dashboard/admin"&&e.method==="GET"){let a=await b(e,t);if(!C(a))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=(await t.DB.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all()).results||[],n=i.reduce((p,h)=>{let g=String(h.role||"");return p[g]=Number(h.count||0),p},{admin:0,teacher:0,student:0}),o=n.admin+n.teacher+n.student,r=await t.DB.prepare("SELECT COUNT(*) as count FROM classes").first(),c=await t.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'teacher' AND id NOT IN (SELECT user_id FROM teacher_assignments)").first(),l=await t.DB.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND id NOT IN (SELECT user_id FROM academic_profiles)").first(),u=await t.DB.prepare("SELECT COUNT(*) as count FROM academic_profiles WHERE class_label IS NULL OR group_label IS NULL OR religion IS NULL OR date_of_birth IS NULL OR batch_year IS NULL").first(),m=await t.DB.prepare("SELECT COUNT(*) as count FROM edit_history WHERE created_at >= datetime('now', '-7 days')").first(),p=await t.DB.prepare("SELECT updated_at FROM content_store WHERE key = ?").bind(ts).first(),h=(await t.DB.prepare(`SELECT edit_history.user_id, edit_history.action, edit_history.details, edit_history.created_at, users.role, user_profiles.name, user_profiles.username, users.email
      FROM edit_history
      LEFT JOIN users ON users.id = edit_history.user_id
      LEFT JOIN user_profiles ON user_profiles.user_id = edit_history.user_id
      ORDER BY edit_history.created_at DESC
      LIMIT 12`).all()).results||[],g=(await t.DB.prepare(`SELECT users.id, users.role, users.email, user_profiles.name, user_profiles.created_at
      FROM users
      LEFT JOIN user_profiles ON user_profiles.user_id = users.id
      ORDER BY user_profiles.created_at DESC
      LIMIT 6`).all()).results||[],y=(await t.DB.prepare("SELECT COUNT(*) as count FROM subject_thumbnails").first())?.count||0,v=(await t.DB.prepare("SELECT COUNT(*) as count FROM chapter_thumbnails").first())?.count||0,x=(await t.DB.prepare("SELECT COUNT(*) as count FROM fonts").first())?.count||0,j=t=>{if(!t)return null;try{return JSON.parse(t)}catch{return t}},M=h.map(t=>({action:t.action,createdAt:t.created_at,user:{id:t.user_id,name:t.name||t.username||t.email||"Unknown",role:t.role||"unknown"},details:j(t.details)})),B=g.map(t=>({id:t.id,name:t.name||t.email||"Unknown",role:t.role||"unknown",createdAt:t.created_at}));return Response.json({success:!0,stats:{totalUsers:o,admins:n.admin,teachers:n.teacher,students:n.student,classes:Number(r?.count||0),recentEdits:Number(m?.count||0),contentUpdatedAt:p?.updated_at||null,thumbnails:Number(y||0)+Number(v||0),fonts:Number(x||0)},onboarding:{teachersWithoutAssignment:Number(c?.count||0),studentsWithoutProfiles:Number(l?.count||0),studentsMissingDetails:Number(u?.count||0)},recentEdits:M,recentUsers:B},{headers:d})}if(s==="/api/dashboard/teacher"&&e.method==="GET"){let a=await b(e,t);if(!a||a.role!=="teacher")return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await t.DB.prepare("SELECT level, subject, created_at FROM teacher_assignments WHERE user_id = ?").bind(a.id).first(),n=i?await t.DB.prepare("SELECT COUNT(*) as count FROM academic_profiles WHERE class_label = ?").bind(i.level).first():null,o=await t.DB.prepare("SELECT updated_at FROM content_store WHERE key = ?").bind(ts).first(),r=(await t.DB.prepare(`SELECT edit_history.action, edit_history.details, edit_history.created_at, user_profiles.name, user_profiles.username
      FROM edit_history
      LEFT JOIN user_profiles ON user_profiles.user_id = edit_history.user_id
      ORDER BY edit_history.created_at DESC
      LIMIT 30`).all()).results||[],c=t=>{if(!t)return null;try{return JSON.parse(t)}catch{return null}},l=String(i?.level||"").toUpperCase(),u=String(i?.subject||"").toLowerCase(),m=r.map(t=>{let p=c(t.details);return{action:t.action,createdAt:t.created_at,user:t.name||t.username||"Staff",details:p}}).filter(t=>{let p=t.details;if(!p||typeof p!="object")return!1;let h=String(p.level||"").toUpperCase(),g=String(p.subject||"").toLowerCase();return l?h===l&&(!u||g.includes(u)):!1}).slice(0,8);return Response.json({success:!0,assignment:i?{level:i.level,subject:i.subject,createdAt:i.created_at}:null,studentCount:Number(n?.count||0),contentUpdatedAt:o?.updated_at||null,recentUpdates:m},{headers:d})}return null}});var ts="app-content",Qe=async e=>{let t=await e.DB.prepare("SELECT data FROM content_store WHERE key = ?").bind(ts).first();return t?.data?kt(t.data):{}},Oe=async(e,t)=>{await e.DB.prepare("INSERT INTO content_store (key, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP").bind(ts,JSON.stringify(t)).run()};var ss="bangla",J=["sscGoddoItems","sscPoddoItems","hscGoddoItems","hscPoddoItems","sscShohopathItems","hscShohopathItems"];var as=e=>Object.fromEntries(J.map(t=>[t,e[t]])),is=(e,t)=>{let s={...e};for(let a of J)a in t&&(s[a]=t[a]);return s},Se=class{getLessons(){return[{id:"bangla-prose-01",title:"\u0997\u09A6\u09CD\u09AF: \u09AD\u09BE\u09B7\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0",focus:["\u0985\u09A8\u09C1\u099A\u09CD\u099B\u09C7\u09A6 \u09AC\u09BF\u09B6\u09CD\u09B2\u09C7\u09B7\u09A3","\u09AE\u09C2\u09B2\u09AD\u09BE\u09AC \u09A8\u09BF\u09B0\u09CD\u09A3\u09DF","\u09B6\u09AC\u09CD\u09A6\u09BE\u09B0\u09CD\u09A5"]},{id:"bangla-poetry-02",title:"\u09AA\u09A6\u09CD\u09AF: \u0995\u09BE\u09AC\u09CD\u09AF\u09B0\u09C2\u09AA",focus:["\u099A\u09BF\u09A4\u09CD\u09B0\u0995\u09B2\u09CD\u09AA","\u0995\u09AC\u09BF\u09B0 \u09AD\u09BE\u09AC","\u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8"]},{id:"bangla-grammar-03",title:"\u09AC\u09CD\u09AF\u09BE\u0995\u09B0\u09A3: \u09B0\u099A\u09A8\u09BE \u0993 \u09AC\u09BE\u0995\u09CD\u09AF",focus:["\u09AC\u09BE\u0995\u09CD\u09AF\u09B0\u09C2\u09AA\u09BE\u09A8\u09CD\u09A4\u09B0","\u09AA\u09CD\u09B0\u09DF\u09CB\u0997","\u09AA\u09B0\u09BF\u09AD\u09BE\u09B7\u09BE"]}]}async generateQuestions(t){return{topicId:t,format:"creative",label:"\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2",questions:[{id:`${t}-cq-1`,stem:"\u09A8\u09BF\u099A\u09C7\u09B0 \u0989\u09A6\u09CD\u09A7\u09C3\u09A4\u09BE\u0982\u09B6\u099F\u09BF \u09AA\u09DC\u09C7 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u0997\u09C1\u09B2\u09CB\u09B0 \u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09BE\u0993\u0964",passage:"\u09AE\u09BE\u09A8\u09C1\u09B7\u09C7\u09B0 \u099A\u09BF\u09A8\u09CD\u09A4\u09BE \u0993 \u099A\u09B0\u09CD\u099A\u09BE\u09B0 \u09AE\u09A7\u09CD\u09AF \u09A6\u09BF\u09DF\u09C7 \u09AD\u09BE\u09B7\u09BE \u09AA\u09B0\u09BF\u09B6\u09C0\u09B2\u09BF\u09A4 \u09B9\u09DF\u0964 \u09AD\u09BE\u09B7\u09BE\u09B0 \u09AF\u09A5\u09BE\u09AF\u09A5 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u0987 \u099A\u09BF\u09A8\u09CD\u09A4\u09BE\u09B0 \u0997\u09AD\u09C0\u09B0\u09A4\u09BE\u0995\u09C7 \u09AA\u09CD\u09B0\u0995\u09BE\u09B6 \u0995\u09B0\u09C7\u0964",parts:[{type:"\u0995",prompt:"\u0989\u09A6\u09CD\u09A7\u09C3\u09A4\u09BE\u0982\u09B6\u09C7\u09B0 \u09AE\u09C2\u09B2\u09AD\u09BE\u09AC \u09B2\u09BF\u0996\u0964"},{type:"\u0996",prompt:"\u09AD\u09BE\u09B7\u09BE\u09B0 \u09AF\u09A5\u09BE\u09AF\u09A5 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09C7\u09A8 \u099C\u09B0\u09C1\u09B0\u09BF?"},{type:"\u0997",prompt:"\u0989\u09A6\u09CD\u09A7\u09C3\u09A4\u09BE\u0982\u09B6\u099F\u09BF \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8\u09C7\u09B0 \u09B8\u0999\u09CD\u0997\u09C7 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09B8\u09AE\u09CD\u09AA\u09B0\u09CD\u0995\u09BF\u09A4?"},{type:"\u0998",prompt:"\u09A8\u09BF\u099C\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u0986\u09B2\u09CB\u0995\u09C7 \u098F\u0995\u099F\u09BF \u0989\u09A6\u09BE\u09B9\u09B0\u09A3 \u09A6\u09BE\u0993\u0964"}]},{id:`${t}-cq-2`,stem:"\u098F\u0995\u099C\u09A8 \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09B0\u09CD\u09A5\u09C0 \u09A4\u09BE\u09B0 \u09AA\u09BE\u09A0 \u09A5\u09C7\u0995\u09C7 \u09AF\u09BE \u09B6\u09BF\u0996\u09C7\u099B\u09C7 \u09A4\u09BE \u09AA\u09CD\u09B0\u09DF\u09CB\u0997 \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u099B\u09C7 \u09A8\u09BE\u0964",parts:[{type:"\u0995",prompt:"\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u0989\u09A6\u09CD\u09A6\u09C7\u09B6\u09CD\u09AF \u0995\u09C0?"},{type:"\u0996",prompt:"\u09AA\u09CD\u09B0\u09DF\u09CB\u0997\u09C7\u09B0 \u0985\u09AD\u09BE\u09AC\u09C7 \u0995\u09C0 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7?"},{type:"\u0997",prompt:"\u09AA\u09BE\u09A0\u09CD\u09AF\u099C\u09CD\u099E\u09BE\u09A8 \u09AC\u09BE\u09B8\u09CD\u09A4\u09AC\u09C7 \u09AA\u09CD\u09B0\u09DF\u09CB\u0997\u09C7\u09B0 \u098F\u0995\u099F\u09BF \u0989\u09AA\u09BE\u09DF \u09AC\u09CD\u09AF\u09BE\u0996\u09CD\u09AF\u09BE \u0995\u09B0\u0964"},{type:"\u0998",prompt:"\u098F\u0987 \u09AA\u09B0\u09BF\u09B8\u09CD\u09A5\u09BF\u09A4\u09BF \u09AC\u09A6\u09B2\u09BE\u09A4\u09C7 \u09B6\u09BF\u0995\u09CD\u09B7\u0995\u09C7\u09B0 \u0995\u09B0\u09A3\u09C0\u09DF \u0989\u09B2\u09CD\u09B2\u09C7\u0996 \u0995\u09B0\u0964"}]}]}}validateAnswer(t,s){return 0}renderExamUI(){return'<div data-exam="bangla"></div>'}};var Fe={id:ss,contentKeys:J,pickContentSlice:as,applyContentSlice:is};var ns="english",Z=["englishQuestions"];var os=e=>Object.fromEntries(Z.map(t=>[t,e[t]])),rs=(e,t)=>{let s={...e};for(let a of Z)a in t&&(s[a]=t[a]);return s};var cs={id:ns,contentKeys:Z,pickContentSlice:os,applyContentSlice:rs};var ls="humanities",ee=["sscBangladeshGlobalChapters"];var ds=e=>Object.fromEntries(ee.map(t=>[t,e[t]])),ps=(e,t)=>{let s={...e};for(let a of ee)a in t&&(s[a]=t[a]);return s};var us={id:ls,contentKeys:ee,pickContentSlice:ds,applyContentSlice:ps};var ms="ict",te=["sscIctChapters","hscIctChapters"];var hs=e=>Object.fromEntries(te.map(t=>[t,e[t]])),gs=(e,t)=>{let s={...e};for(let a of te)a in t&&(s[a]=t[a]);return s};var bs={id:ms,contentKeys:te,pickContentSlice:hs,applyContentSlice:gs};var ys="religion",se=["sscReligionChapters"];var vs=e=>Object.fromEntries(se.map(t=>[t,e[t]])),fs=(e,t)=>{let s={...e};for(let a of se)a in t&&(s[a]=t[a]);return s};var Ss={id:ys,contentKeys:se,pickContentSlice:vs,applyContentSlice:fs};var xs="science",ae=["sscPhysicsChapters","sscChemistryChapters","sscBiologyChapters","hscPhysics1stChapters","hscPhysics2ndChapters","hscChemistry1stChapters","hscChemistry2ndChapters","hscBiology1stChapters","hscBiology2ndChapters"];var Ns=e=>Object.fromEntries(ae.map(t=>[t,e[t]])),Cs=(e,t)=>{let s={...e};for(let a of ae)a in t&&(s[a]=t[a]);return s},xe=class{async generateQuestions(t){return{topicId:t,questions:[]}}validateAnswer(t,s){return 0}renderExamUI(){return'<div data-exam="science"></div>'}};var Ge={id:xs,contentKeys:ae,pickContentSlice:Ns,applyContentSlice:Cs};var ws="shared",ie=["srijonshilQuestions","mcqQuestions","notesByItem","videosByItem"];var Ts=e=>Object.fromEntries(ie.map(t=>[t,e[t]])),Es=(e,t)=>{let s={...e};for(let a of ie)a in t&&(s[a]=t[a]);return s};var Ls={id:ws,contentKeys:ie,pickContentSlice:Ts,applyContentSlice:Es};var Ve=[Fe,cs,us,bs,Ss,Ge,Ls].sort((e,t)=>e.id.localeCompare(t.id)),Vl={[Fe.id]:()=>new Se,[Ge.id]:()=>new xe};var Ps="videos",Bn=e=>Ve.reduce((t,s)=>({...t,...s.pickContentSlice(e)}),{}),Mn=e=>Ve.reduce((t,s)=>s.applyContentSlice(t,e),{}),qn=async(e,t)=>{let s=await b(e,t);if(!s)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});if(!C(s)&&s?.role!=="teacher")return Response.json({success:!1,error:"Admin or teacher access required."},{status:403,headers:d});let i=(await e.formData()).get("file");if(!(i instanceof File))return Response.json({success:!1,error:"Video file is required."},{status:400,headers:d});let n=await i.arrayBuffer(),o=`${Ps}/${crypto.randomUUID()}-${i.name}`,r=i.type||"application/octet-stream";return await t.BUCKET.put(o,n,{httpMetadata:{contentType:r}}),Response.json({success:!0,fileKey:o,url:`/api/videos/${encodeURIComponent(o)}`},{headers:d})},An=async(e,t)=>{let s=decodeURIComponent(t);if(!s||!s.startsWith(`${Ps}/`))return Response.json({success:!1,error:"Invalid video key."},{status:400,headers:d});let a=await e.BUCKET.get(s);if(!a)return Response.json({success:!1,error:"Video not found."},{status:404,headers:d});let i=new Headers(d);return i.set("Content-Type",a.httpMetadata?.contentType||"application/octet-stream"),i.set("Cache-Control","public, max-age=3600"),new Response(a.body,{headers:i})},ks=async(e,t,s)=>{if(s!=="/api/content")return null;if(e.method==="GET"){let a=await Qe(t),i=Bn(a);return Response.json({success:!0,content:i},{headers:d})}if(e.method==="PUT"){let a=await b(e,t);if(!a)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await e.json().catch(()=>({}));if(!i||typeof i!="object")return Response.json({success:!1,error:"Invalid content payload."},{status:400,headers:d});let n=Mn(i);if(C(a))return await Oe(t,n),await T(t.DB,a,"Content updated",{scope:"admin"}),Response.json({success:!0},{headers:d});if(a.role==="teacher"){if(!a.assignment)return Response.json({success:!1,error:"Assignment missing."},{status:400,headers:d});let o=Array.isArray(a.permissions)&&a.permissions.includes("structure"),r=await Qe(t),c=It(r,n,a.assignment,o);return c?(await Oe(t,c),await T(t.DB,a,"Content updated",{scope:"teacher",level:a.assignment.level,subject:a.assignment.subject}),Response.json({success:!0},{headers:d})):Response.json({success:!1,error:"Subject is not configured for updates."},{status:400,headers:d})}return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d})}return null},Is=async(e,t,s)=>s==="/api/videos"&&e.method==="POST"?qn(e,t):s.startsWith("/api/videos/")&&e.method==="GET"?An(t,s.replace("/api/videos/","")):null;var Rs=async(e,t,s)=>{if(s!=="/api/classes")return null;if(e.method==="GET"){if(!await b(e,t))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let i=await t.DB.prepare("SELECT id, name, created_at FROM classes ORDER BY created_at DESC").all();return Response.json({success:!0,classes:i.results||[]},{headers:d})}if(e.method==="POST"){if(!await b(e,t))return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});let{name:i}=await e.json(),n=String(i||"").trim();if(!n)return Response.json({success:!1,error:"Class name is required"},{status:400,headers:d});await t.DB.prepare("INSERT INTO classes (name) VALUES (?)").bind(n).run();let o=await t.DB.prepare("SELECT id, name, created_at FROM classes WHERE name = ?").bind(n).first();return Response.json({success:!0,class:o},{headers:d})}return null};var ze={table:"subject_thumbnails",keyColumn:"subject_key",keyField:"subjectKey",urlPrefix:"/api/thumbnails",bucketPrefix:"thumbnails",includeZoom:!0},We={table:"chapter_thumbnails",keyColumn:"chapter_key",keyField:"chapterKey",urlPrefix:"/api/chapter-thumbnails",bucketPrefix:"chapter-thumbnails",includeZoom:!1},Dn=e=>e?.updated_at?new Date(e.updated_at).getTime():Date.now(),js=async(e,t)=>{let s=t.includeZoom?`${t.keyColumn}, zoom, updated_at`:`${t.keyColumn}, updated_at`,i=((await e.DB.prepare(`SELECT ${s} FROM ${t.table} ORDER BY updated_at DESC`).all()).results||[]).map(n=>{let o=Dn(n),r=n[t.keyColumn];return{[t.keyField]:r,...t.includeZoom?{zoom:typeof n.zoom=="number"?n.zoom:1}:{},url:`${t.urlPrefix}/${r}?v=${o}`}});return Response.json({thumbnails:i},{headers:d})},Bs=async(e,t,s)=>{let a=await b(e,t);if(!a)return Response.json({success:!1,error:"Unauthorized"},{status:401,headers:d});if(!C(a))return Response.json({success:!1,error:"Admin access required."},{status:403,headers:d});let i=await e.formData(),n=String(i.get(s.keyField)||"").trim().toLowerCase();if(!n||!De(n))return Response.json({success:!1,error:`Invalid ${s.keyField.replace("Key"," key")}.`},{status:400,headers:d});let o=s.includeZoom?Pt(Number(i.get("zoom"))):null,r=i.get("file"),c=await t.DB.prepare(`SELECT file_key, content_type${s.includeZoom?", zoom":""} FROM ${s.table} WHERE ${s.keyColumn} = ?`).bind(n).first();if(!(r instanceof File)&&!c)return Response.json({success:!1,error:"Thumbnail file is required."},{status:400,headers:d});let l=c?.file_key,u=c?.content_type;if(r instanceof File){let x=await r.arrayBuffer();l=`${s.bucketPrefix}/${n}-${crypto.randomUUID()}-${r.name}`,u=r.type||"application/octet-stream",await t.BUCKET.put(l,x,{httpMetadata:{contentType:u}}),c?.file_key&&await t.BUCKET.delete(c.file_key)}let m=s.includeZoom?`${s.keyColumn}, file_key, content_type, zoom, updated_at`:`${s.keyColumn}, file_key, content_type, updated_at`,p=s.includeZoom?"?, ?, ?, ?, CURRENT_TIMESTAMP":"?, ?, ?, CURRENT_TIMESTAMP",h=s.includeZoom?"file_key = excluded.file_key, content_type = excluded.content_type, zoom = excluded.zoom, updated_at = CURRENT_TIMESTAMP":"file_key = excluded.file_key, content_type = excluded.content_type, updated_at = CURRENT_TIMESTAMP",g=t.DB.prepare(`INSERT INTO ${s.table} (${m}) VALUES (${p}) ON CONFLICT(${s.keyColumn}) DO UPDATE SET ${h}`),y=s.includeZoom?[n,l,u,o]:[n,l,u];await g.bind(...y).run(),await T(t.DB,a,"Thumbnail updated",{key:n,type:s.table});let v=Date.now();return Response.json({success:!0,thumbnail:{[s.keyField]:n,...s.includeZoom?{zoom:o}:{},url:`${s.urlPrefix}/${n}?v=${v}`}},{headers:d})},Ms=async(e,t,s)=>{let a=decodeURIComponent(s).toLowerCase();if(!a||!De(a))return Response.json({success:!1,error:`Invalid ${t.keyField.replace("Key"," key")}.`},{status:400,headers:d});let i=await e.DB.prepare(`SELECT file_key, content_type FROM ${t.table} WHERE ${t.keyColumn} = ?`).bind(a).first();if(!i)return Response.json({success:!1,error:"Thumbnail not found."},{status:404,headers:d});let n=await e.BUCKET.get(i.file_key);if(!n)return Response.json({success:!1,error:"Thumbnail file missing."},{status:404,headers:d});let o=new Headers(d);return o.set("Content-Type",i.content_type||"application/octet-stream"),o.set("Cache-Control","public, max-age=86400"),new Response(n.body,{headers:o})},qs=async(e,t,s)=>{if(s.startsWith("/api/thumbnails")){if(s==="/api/thumbnails"&&e.method==="GET")return js(t,ze);if(s==="/api/thumbnails"&&e.method==="POST")return Bs(e,t,ze);if(s.startsWith("/api/thumbnails/")&&e.method==="GET")return Ms(t,ze,s.replace("/api/thumbnails/",""))}if(s.startsWith("/api/chapter-thumbnails")){if(s==="/api/chapter-thumbnails"&&e.method==="GET")return js(t,We);if(s==="/api/chapter-thumbnails"&&e.method==="POST")return Bs(e,t,We);if(s.startsWith("/api/chapter-thumbnails/")&&e.method==="GET")return Ms(t,We,s.replace("/api/chapter-thumbnails/",""))}return null};var Kn=[{format:"woff2",contentHints:["woff2"],extensions:[".woff2"]},{format:"woff",contentHints:["woff"],extensions:[".woff"]},{format:"opentype",contentHints:["opentype"],extensions:[".otf"]},{format:"truetype",contentHints:["truetype"],extensions:[".ttf"]}],_n=(e,t)=>{let s=(e||"").toLowerCase(),a=(t||"").toLowerCase();for(let i of Kn)if(i.contentHints.some(n=>s.includes(n))||i.extensions.some(n=>a.endsWith(n)))return i.format;return"truetype"},As=async(e,t,s)=>{if(!s.startsWith("/api/fonts"))return null;if(s==="/api/fonts"&&e.method==="GET"){let i=((await t.DB.prepare("SELECT id, name, content_type, original_name FROM fonts ORDER BY created_at DESC").all()).results||[]).map(n=>({id:n.id,name:n.name,original_name:n.original_name,content_type:n.content_type,format:_n(n.content_type,n.original_name),url:`/api/fonts/file/${n.id}`}));return Response.json(i,{headers:d})}if(s.startsWith("/api/fonts/file/")&&e.method==="GET"){let a=s.split("/").pop();if(!a)return Response.json({success:!1,error:"Font ID is required."},{status:400,headers:d});let i=await t.DB.prepare("SELECT file_key, content_type FROM fonts WHERE id = ?").bind(a).first();if(!i)return Response.json({success:!1,error:"Font not found."},{status:404,headers:d});let n=await t.BUCKET.get(i.file_key);if(!n)return Response.json({success:!1,error:"Font file missing."},{status:404,headers:d});let o=new Headers(d);return o.set("Content-Type",i.content_type||"application/octet-stream"),o.set("Cache-Control","public, max-age=31536000"),new Response(n.body,{headers:o})}if(s==="/api/fonts/bulk"&&e.method==="POST"){let i=(await e.formData()).getAll("files").filter(o=>o instanceof File);if(i.length===0)return Response.json({success:!1,error:"No font files provided."},{status:400,headers:d});let n=[];for(let o of i){let r=await o.arrayBuffer(),c=`fonts/${crypto.randomUUID()}-${o.name}`;await t.BUCKET.put(c,r,{httpMetadata:{contentType:o.type||"application/octet-stream"}});let l=o.name.replace(/\.[^/.]+$/,"")||o.name;n.push(t.DB.prepare("INSERT INTO fonts (name, file_key, content_type, original_name) VALUES (?, ?, ?, ?)").bind(l,c,o.type||"application/octet-stream",o.name))}return await t.DB.batch(n),Response.json({success:!0,inserted:n.length},{headers:d})}return null};var Hn=[ks,Is,Rs,qs,As],Ds=()=>({id:"academic-subjects",match:e=>e.startsWith("/api/content")||e.startsWith("/api/videos")||e.startsWith("/api/classes")||e.startsWith("/api/thumbnails")||e.startsWith("/api/chapter-thumbnails")||e.startsWith("/api/fonts"),handle:async(e,t)=>{let a=new URL(e.url).pathname;for(let i of Hn){let n=await i(e,t,a);if(n)return n}return null}});var $e=null,Ks=async e=>{$e||($e=F(e).then(()=>{})),await $e};var S=new P,Un=(e,t)=>{let s=new URL(e.url);return s.pathname=t,new Request(s,e)},f=async(e,t,s,a)=>await e.handle(Un(t,a),s)??null,A=Kt(),_s=Wt(),Ne=Jt(),Qn=es(),dashboardModule=dashboardApiModule(),L=Ds();S.all("/api/system",async e=>await f(A,e.req.raw,e.env,"/api/system")??e.notFound());S.all("/api/system/*",async e=>{let t=e.req.path.replace("/api/system","");return await f(A,e.req.raw,e.env,`/api/system${t}`)??e.notFound()});S.all("/api/login",async e=>await f(A,e.req.raw,e.env,"/api/login")??e.notFound());S.all("/api/register-admin",async e=>await f(A,e.req.raw,e.env,"/api/register-admin")??e.notFound());S.all("/api/me",async e=>await f(A,e.req.raw,e.env,"/api/me")??e.notFound());S.all("/api/change-password",async e=>await f(A,e.req.raw,e.env,"/api/change-password")??e.notFound());S.all("/api/profile",async e=>await f(A,e.req.raw,e.env,"/api/profile")??e.notFound());S.all("/api/profile/*",async e=>{let t=e.req.path.replace("/api/profile","");return await f(A,e.req.raw,e.env,`/api/profile${t}`)??e.notFound()});S.all("/api/users",async e=>await f(_s,e.req.raw,e.env,"/api/users")??e.notFound());S.all("/api/users/*",async e=>{let t=e.req.path.replace("/api/users","");if(t.startsWith("/student")){let a=`/api/student${t.slice(8)}`||"/api/student";return await f(Ne,e.req.raw,e.env,a)??e.notFound()}if(t.startsWith("/teacher")){let a=`/api/teacher${t.slice(8)}`||"/api/teacher";return await f(Qn,e.req.raw,e.env,a)??e.notFound()}return await f(_s,e.req.raw,e.env,`/api/users${t}`)??e.notFound()});S.all("/api/student",async e=>await f(Ne,e.req.raw,e.env,"/api/student")??e.notFound());S.all("/api/student/*",async e=>{let s=`/api/student${e.req.path.replace("/api/student","")}`||"/api/student";return await f(Ne,e.req.raw,e.env,s)??e.notFound()});S.all("/api/points",async e=>await f(Ne,e.req.raw,e.env,"/api/points")??e.notFound());S.all("/api/dashboard",async e=>await f(dashboardModule,e.req.raw,e.env,"/api/dashboard")??e.notFound());S.all("/api/dashboard/*",async e=>{let t=e.req.path.replace("/api/dashboard","");return await f(dashboardModule,e.req.raw,e.env,`/api/dashboard${t}`)??e.notFound()});S.all("/api/classes",async e=>await f(L,e.req.raw,e.env,"/api/classes")??e.notFound());S.all("/api/content",async e=>await f(L,e.req.raw,e.env,"/api/content")??e.notFound());S.all("/api/content/*",async e=>{let t=e.req.path.replace("/api/content","");return await f(L,e.req.raw,e.env,`/api/content${t}`)??e.notFound()});S.all("/api/videos",async e=>await f(L,e.req.raw,e.env,"/api/videos")??e.notFound());S.all("/api/videos/*",async e=>{let t=e.req.path.replace("/api/videos","");return await f(L,e.req.raw,e.env,`/api/videos${t}`)??e.notFound()});S.all("/api/thumbnails",async e=>await f(L,e.req.raw,e.env,"/api/thumbnails")??e.notFound());S.all("/api/thumbnails/*",async e=>{let t=e.req.path.replace("/api/thumbnails","");return await f(L,e.req.raw,e.env,`/api/thumbnails${t}`)??e.notFound()});S.all("/api/chapter-thumbnails",async e=>await f(L,e.req.raw,e.env,"/api/chapter-thumbnails")??e.notFound());S.all("/api/chapter-thumbnails/*",async e=>{let t=e.req.path.replace("/api/chapter-thumbnails","");return await f(L,e.req.raw,e.env,`/api/chapter-thumbnails${t}`)??e.notFound()});S.all("/api/fonts",async e=>await f(L,e.req.raw,e.env,"/api/fonts")??e.notFound());S.all("/api/academic",async e=>await f(L,e.req.raw,e.env,"/api")??e.notFound());S.all("/api/academic/*",async e=>{let t=e.req.path.replace("/api/academic","");return await f(L,e.req.raw,e.env,`/api${t}`)??e.notFound()});var Hs=async(e,t)=>{if(!new URL(e.url).pathname.startsWith("/api"))return null;await Ks(t);let a=await S.fetch(e,t);return a.status!==404?a:Response.json({success:!1,error:"API route not found."},{status:404,headers:d})};var Us=`
const NavBar = ({ user, hasAdmin, onNavigate, onLogout }) => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const [profile, setProfile] = useState(null);
// NEW: Toggle state for sketch/animations
const [sketchEnabled, setSketchEnabled] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('sketch_enabled') !== 'false' : true);

const closeMenu = () => setIsMenuOpen(false);
const openMenu = () => setIsMenuOpen(true);

// NEW: Toggle Handler
const toggleSketch = () => {
const newState = !sketchEnabled;
setSketchEnabled(newState);
localStorage.setItem('sketch_enabled', newState);
window.dispatchEvent(new Event('sketch-toggle'));
};

const appendTokenToAvatarUrl = (avatarUrl, token) => {
if (!avatarUrl || !token) return avatarUrl;
try {
const resolved = new URL(avatarUrl, window.location.origin);
resolved.searchParams.set('token', token);
return resolved.pathname + resolved.search;
} catch (error) {
return avatarUrl;
}
};

useEffect(() => {
// Sync state with local storage on mount/change
const handleStorage = () => setSketchEnabled(localStorage.getItem('sketch_enabled') !== 'false');
window.addEventListener('sketch-toggle', handleStorage);
if (!user) {
setProfile(null);
return;
}
const token = localStorage.getItem('auth_token');
if (!token) {
setProfile(null);
return;
}
let isActive = true;
const loadProfile = async () => {
try {
const response = await fetch('/api/profile', {
headers: { Authorization: 'Bearer ' + token }
});
const data = await response.json();
if (!isActive) return;
if (data.success) {
setProfile({
...data.profile,
avatarUrl: appendTokenToAvatarUrl(data.profile?.avatarUrl, token)
});
}
} catch (error) {
if (isActive) {
setProfile(null);
}
}
};
loadProfile();
return () => {
isActive = false;
window.removeEventListener('sketch-toggle', handleStorage);
};
}, [user?.username, user?.role]);

const getInitials = () => (profile?.name || user?.username || '?').charAt(0).toUpperCase();

return (
<>
{/* Main Header Bar - Solid Indigo Color */}
<nav className="bg-indigo-700 sticky top-0 z-50 shadow-md">
<div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">

{/* Logo Section */}
<div className="flex items-center gap-4">
<div className="cursor-pointer group text-white" onClick={() => onNavigate('landing')}>
<LogoMark 
className="transition-opacity hover:opacity-90" 
textClassName="text-white" 
compact={true} 
/>
</div>
</div>

{/* Right Side Actions */}
<div className="flex items-center gap-4">

{/* NEW: Desktop Animation Toggle (Magic Wand) */}
<button
onClick={toggleSketch}
className={'hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition ' + (sketchEnabled ? 'text-amber-300 hover:text-white bg-white/10' : 'text-indigo-300 hover:text-white')}
title={sketchEnabled ? "Disable Magic Effects" : "Enable Magic Effects"}
>
<i className="fa-solid fa-wand-magic-sparkles"></i>
</button>

{/* Mobile Menu Button (Hamburger) */}
<button
onClick={openMenu}
className="sm:hidden w-10 h-10 rounded-md text-white hover:bg-indigo-600 flex items-center justify-center transition"
aria-label="Open menu"
>
<i className="fa-solid fa-bars text-xl"></i>
</button>

{/* Desktop User Controls */}
{user ? (
<div className="hidden sm:flex items-center gap-5">
<button
onClick={() => onNavigate('dashboard')}
className="flex items-center gap-3 group focus:outline-none"
title={user?.role === 'teacher' ? 'Open teacher dashboard' : 'Open admin dashboard'}
>
<div className="w-9 h-9 rounded-full bg-indigo-500 border-2 border-indigo-400 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm group-hover:border-white transition-colors">
{profile?.avatarUrl ? (
<img src={profile.avatarUrl} alt={profile?.name} className="w-full h-full object-cover" />
) : (
<span>{getInitials()}</span>
)}
</div>
<span className="font-medium text-white group-hover:text-indigo-100 transition-colors">
{profile?.name || user.username}
</span>
</button>

<div className="h-6 w-px bg-indigo-500"></div>

<button
onClick={onLogout}
className="text-indigo-200 hover:text-white transition-colors p-2"
title="Log Out"
>
<i className="fa-solid fa-right-from-bracket text-lg"></i>
</button>
</div>
) : (
<div className="hidden sm:flex items-center gap-3">
<button
onClick={() => onNavigate('student-register')}
className="text-sm font-medium text-indigo-100 hover:text-white transition px-4 py-2"
>
Sign Up
</button>
<button
onClick={() => onNavigate('login')}
className="text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 transition px-5 py-2 rounded-md shadow-sm"
>
Log In
</button>
</div>
)}
</div>
</div>
</nav>

{/* Mobile Menu Overlay */}
{isMenuOpen && (
<div className="fixed inset-0 z-[60] sm:hidden">
<button
onClick={closeMenu}
className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
aria-label="Close menu"
></button>

<div className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl p-6 flex flex-col animate-slide-in">
<div className="flex items-center justify-between mb-8">
<div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Menu</div>
<button
onClick={closeMenu}
className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
>
<i className="fa-solid fa-xmark"></i>
</button>
</div>

<div className="flex-1 overflow-y-auto">
{user ? (
<div className="mb-8 flex flex-col items-center">
<div className="w-16 h-16 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl mb-3 shadow-sm">
{profile?.avatarUrl ? (
<img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
) : (
getInitials()
)}
</div>
<div className="font-bold text-slate-900 text-lg text-center leading-tight">
{profile?.name || user.username}
</div>
<div className="text-sm text-slate-500 mt-1 text-center mb-5">
{profile?.email || user.username}
</div>
<button
onClick={() => {
closeMenu();
onNavigate('dashboard');
}}
className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition text-center shadow-sm"
>
Go to Dashboard
</button>
</div>
) : (
<div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
<p className="text-slate-600 text-sm mb-4">Join Freeducation today.</p>
<div className="grid grid-cols-2 gap-3">
<button
onClick={() => { closeMenu(); onNavigate('student-register'); }}
className="py-2.5 rounded-lg border border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
>
Sign Up
</button>
<button
onClick={() => { closeMenu(); onNavigate('login'); }}
className="py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
>
Log In
</button>
</div>
</div>
)}

<div className="space-y-1">
<div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Navigation</div>
<button onClick={() => { closeMenu(); onNavigate('landing'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
<span>Home</span>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>
<button onClick={() => { closeMenu(); onNavigate('public-videos'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
<span>Videos</span>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>
<button onClick={() => { closeMenu(); onNavigate('ssc-subjects'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
<span>SSC Subjects</span>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>
<button onClick={() => { closeMenu(); onNavigate('hsc-subjects'); }} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
<span>HSC Subjects</span>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>

{/* NEW: Mobile Animation Toggle */}
<button onClick={toggleSketch} className="w-full text-left px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition font-medium flex items-center justify-between group">
<div className="flex items-center gap-2">
<span>Magic Effects</span>
{sketchEnabled && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 rounded font-bold">ON</span>}
</div>
<div className={'w-8 h-4 rounded-full relative transition ' + (sketchEnabled ? 'bg-indigo-500' : 'bg-slate-300')}>
<div className={'absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ' + (sketchEnabled ? 'left-4.5' : 'left-0.5')} style={{left: sketchEnabled ? '18px' : '2px'}}></div>
</div>
</button>
</div>
</div>

{user && (
<div className="pt-6 mt-4 border-t border-slate-100">
<button
onClick={() => {
closeMenu();
onLogout();
}}
className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
>
<i className="fa-solid fa-arrow-right-from-bracket"></i>
<span>Log Out</span>
</button>
</div>
)}
</div>
</div>
)}
</>
);
};
`;var Qs=`
        const AdminMobileNav = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
                { id: 'users', label: 'Users', icon: 'fa-users' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                classes: 'dashboard',
                users: 'admin-users',
                settings: 'admin-settings'
            };

            return (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full transition-colors duration-200 \${activeTab === item.id ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}\`}
                            >
                                <i className={\`fas \${item.icon} text-base mb-0.5\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            );
        };
`;var Os=`
        const AdminPageHeader = ({ title, subtitle }) => (
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            </header>
        );
`;var Fs=`
        const AdminShell = ({ activeTab, onNavigate, children }) => {
            return (
                <div className="relative flex flex-col lg:flex-row flex-1 bg-[#fdfbf7] overflow-hidden">
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl"></div>
                        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl"></div>
                        <div className="absolute top-1/3 right-1/3 h-24 w-24 rounded-full bg-rose-100/70 blur-2xl"></div>
                    </div>
                    <AdminSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-transparent">
                        {/* Centered content wrapper for the legacy look */}
                        <section className="relative flex flex-col gap-6 w-full max-w-6xl mx-auto">
                            {children}
                        </section>
                        <footer className="border-t border-stone-200/60 pt-6 text-xs text-stone-500 text-center font-serif italic">
                            Freeducation Administration \u2022 Established 2024
                        </footer>
                    </main>

                    <AdminMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;var Gs=`
        const AdminSidebar = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'classes', label: 'Classes', icon: 'fa-layer-group' },
                { id: 'users', label: 'Users', icon: 'fa-users' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                classes: 'dashboard',
                users: 'admin-users',
                settings: 'admin-settings'
            };

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 \${activeTab === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}\`}
                            >
                                <i className={\`fas \${item.icon} \${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>
            );
        };
`;var Vs=`
        const TeacherMobileNav = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'subject', label: 'Subject', icon: 'fa-book-open' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                subject: 'dashboard',
                settings: 'admin-settings'
            };

            return (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full transition-colors duration-200 \${activeTab === item.id ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}\`}
                            >
                                <i className={\`fas \${item.icon} text-base mb-0.5\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            );
        };
`;var zs=`
        const TeacherShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-[#f3f6ff]">
                    <TeacherSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-[#f7f9ff]">
                        {(title || subtitle) && <AdminPageHeader title={title} subtitle={subtitle} />}
                        <section className="flex flex-col gap-6">
                            {children}
                        </section>
                        <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
                            Freeducation Teacher \u2022 Manage your assigned subject content.
                        </footer>
                    </main>

                    <TeacherMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;var Ws=`
        const TeacherSidebar = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'subject', label: 'Subject', icon: 'fa-book-open' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                subject: 'dashboard',
                settings: 'admin-settings'
            };

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'dashboard')}
                                className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 \${activeTab === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}\`}
                            >
                                <i className={\`fas \${item.icon} \${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>
            );
        };
`;var $s=`
        const StudentMobileNav = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'class', label: 'My Class', icon: 'fa-graduation-cap' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                class: 'student-class',
                settings: 'student-settings'
            };

            return (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-around">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'student-class')}
                                className={\`flex flex-col items-center gap-1 py-3 text-xs font-semibold w-full transition-colors duration-200 \${activeTab === item.id ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}\`}
                            >
                                <i className={\`fas \${item.icon} text-base mb-0.5\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </nav>
            );
        };
`;var Ys=`
        const StudentShell = ({ title, subtitle, activeTab, onNavigate, children }) => {
            return (
                <div className="flex flex-col lg:flex-row flex-1 bg-[#f3f6ff]">
                    <StudentSidebar activeTab={activeTab} onNavigate={onNavigate} />

                    <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 pb-24 lg:pb-8 flex flex-col gap-6 bg-[#f7f9ff]">
                        {(title || subtitle) && <AdminPageHeader title={title} subtitle={subtitle} />}
                        <section className="flex flex-col gap-6">
                            {children}
                        </section>
                        <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
                            Freeducation Student \u2022 Focused learning space.
                        </footer>
                    </main>

                    <StudentMobileNav activeTab={activeTab} onNavigate={onNavigate} />
                </div>
            );
        };
`;var Xs=`
        const StudentSidebar = ({ activeTab, onNavigate }) => {
            const navItems = [
                { id: 'class', label: 'My Class', icon: 'fa-graduation-cap' },
                { id: 'settings', label: 'Settings', icon: 'fa-gear' }
            ];
            const navRoutes = {
                class: 'student-class',
                settings: 'student-settings'
            };

            return (
                <aside className="hidden lg:flex lg:w-64 border-r border-gray-200 bg-white p-6">
                    <div className="flex flex-col gap-2 w-full">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(navRoutes[item.id] || 'student-class')}
                                className={\`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 \${activeTab === item.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}\`}
                            >
                                <i className={\`fas \${item.icon} \${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}\`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>
            );
        };
`;var Ce=`
        const LogoMark = ({ className = '', textClassName = '', subtitle = 'Learning that feels effortless.', compact = false }) => (
            <div className={\`flex items-center gap-3 \${className}\`}>
                <div className="relative w-11 h-11 flex items-center justify-center">
                    {/* Changed text-black to text-current so it adapts to the header color */}
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-current" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" />
                        <path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" />
                        <path d="M20.5 9.7V14" />
                        <path d="M21.5 14h-2" />
                    </svg>
                </div>
                <div className="flex flex-col leading-tight">
                    <span className={\`text-base sm:text-lg font-bold \${textClassName || 'text-current'}\`}>Freeducation</span>
                    {!compact && (
                        <span className={\`text-[11px] uppercase tracking-[0.2em] \${textClassName ? 'opacity-80' : 'text-gray-500'}\`}>{subtitle}</span>
                    )}
                </div>
            </div>
        );

        const Loading = () => (
            <div className="flex items-center justify-center h-screen text-indigo-600">
                <i className="fas fa-circle-notch fa-spin text-3xl"></i>
            </div>
        );

        const makeThumbnailKey = (subject, classLabel) =>
            (classLabel + '-' + subject)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

        const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterKey) =>
            (classLabel + '-' + subjectLabel + '-' + chapterKey)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
`;var Js=`
const quoteItems = [
{ text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
{ text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
{ text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
{ text: 'Education is not the filling of a pail, but the lighting of a fire.', author: 'William Butler Yeats' },
{ text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
{ text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.', author: 'Malcolm X' },
{ text: 'Service to others is the rent you pay for your room here on earth.', author: 'Muhammad Ali' },
{ text: 'Knowledge will bring you the opportunity to make a difference.', author: 'Claire Fagin' },
{ text: 'The purpose of education is to replace an empty mind with an open one.', author: 'Malcolm Forbes' },
{ text: 'We serve others best when we empower them to learn for themselves.', author: 'Education proverb' }
];

const subjectGroups = {
SSC: {
Science: [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics',
'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'
],
Humanities: [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology',
'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'
],
'Business Studies': [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology',
'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education'
]
},
HSC: {
Science: [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper',
'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper',
'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'
],
Humanities: [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper',
'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper',
'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'
],
'Business Studies': [
'Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper',
'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper',
'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper',
'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper',
'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper'
]
}
};

const subjectIconMap = {
'Bangla 1st Paper': 'fa-book-open', 'Bangla 2nd Paper': 'fa-book',
'English 1st Paper': 'fa-language', 'English 2nd Paper': 'fa-pen-nib',
'General Mathematics': 'fa-calculator', Mathematics: 'fa-calculator',
Physics: 'fa-atom', Chemistry: 'fa-flask', Biology: 'fa-dna',
'Higher Mathematics': 'fa-square-root-variable', 'Higher Mathematics 1st Paper': 'fa-square-root-variable',
'Higher Mathematics 2nd Paper': 'fa-square-root-variable', 'Bangladesh and Global Studies': 'fa-globe',
'Information and Communication Technology': 'fa-laptop-code', Religion: 'fa-hands-praying',
'Religion and Moral Education': 'fa-hands-praying', 'Geography and Environment': 'fa-mountain-sun',
'History of Bangladesh and World Civilization': 'fa-landmark', 'Civics and Citizenship': 'fa-scale-balanced',
Accounting: 'fa-receipt', 'Business Entrepreneurship': 'fa-briefcase', 'Finance and Banking': 'fa-coins',
'Physics 1st Paper': 'fa-atom', 'Physics 2nd Paper': 'fa-atom', 'Chemistry 1st Paper': 'fa-flask',
'Chemistry 2nd Paper': 'fa-flask', 'Biology 1st Paper': 'fa-dna', 'Biology 2nd Paper': 'fa-dna',
'Economics 1st Paper': 'fa-chart-line', 'Economics 2nd Paper': 'fa-chart-line',
'History 1st Paper': 'fa-landmark', 'History 2nd Paper': 'fa-landmark',
'Civics and Good Governance 1st Paper': 'fa-scale-balanced', 'Civics and Good Governance 2nd Paper': 'fa-scale-balanced',
'Logic 1st Paper': 'fa-lightbulb', 'Logic 2nd Paper': 'fa-lightbulb',
'Accounting 1st Paper': 'fa-receipt', 'Accounting 2nd Paper': 'fa-receipt',
'Business Organization and Management 1st Paper': 'fa-briefcase', 'Business Organization and Management 2nd Paper': 'fa-briefcase',
'Finance, Banking and Insurance 1st Paper': 'fa-coins', 'Finance, Banking and Insurance 2nd Paper': 'fa-coins',
'Production Management and Marketing 1st Paper': 'fa-industry', 'Production Management and Marketing 2nd Paper': 'fa-industry'
};

const accentPalette = ['bg-sky-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-teal-500'];

const buildSubjectList = (classLabel) => {
const groupMap = subjectGroups[classLabel] || {};
let paletteIndex = 0;
const subjectMap = new Map();
Object.entries(groupMap).forEach(([group, subjects]) => {
subjects.forEach((subject) => {
if (subjectMap.has(subject)) {
subjectMap.get(subject).groups.add(group);
return;
}
const accent = accentPalette[paletteIndex % accentPalette.length];
paletteIndex += 1;
const isBanglaFirst = subject === 'Bangla 1st Paper';
const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
const isIct = subject === 'Information and Communication Technology' && classLabel === 'SSC';
const isHscIct = subject === 'Information and Communication Technology' && classLabel === 'HSC';
const isSscPhysics = subject === 'Physics' && classLabel === 'SSC';
const isSscChemistry = subject === 'Chemistry' && classLabel === 'SSC';
const isSscBiology = subject === 'Biology' && classLabel === 'SSC';
const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
const isHscChemistry1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
const isHscChemistry2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
const isHscBiology1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
const isHscBiology2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';
subjectMap.set(subject, {
title: subject,
subtitle: isBanglaFirst ? '\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0' : '',
icon: subjectIconMap[subject] || 'fa-book',
accent,
groups: new Set([group]),
classLabel,
subjectKey: makeThumbnailKey(subject, classLabel),
route: isBanglaFirst
? (classLabel === 'SSC' ? 'public-bangla-ssc-1st-paper' : 'public-bangla-hsc-1st-paper')
: isEnglishFirst ? 'public-english-hsc-1st-paper'
: isIct ? 'public-ssc-ict'
: isHscIct ? 'public-hsc-ict'
: isSscPhysics ? 'public-ssc-physics'
: isSscChemistry ? 'public-ssc-chemistry'
: isSscBiology ? 'public-ssc-biology'
: isBangladeshGlobal ? 'public-ssc-bangladesh-global-studies'
: isReligionMoral ? 'public-ssc-religion'
: isHscPhysics1 ? 'public-hsc-physics-1st'
: isHscPhysics2 ? 'public-hsc-physics-2nd'
: isHscChemistry1 ? 'public-hsc-chemistry-1st'
: isHscChemistry2 ? 'public-hsc-chemistry-2nd'
: isHscBiology1 ? 'public-hsc-biology-1st'
: isHscBiology2 ? 'public-hsc-biology-2nd' : ''
});
});
});
return Array.from(subjectMap.values()).map((subject) => {
const groups = Array.from(subject.groups);
return { ...subject, groups, groupLabel: groups.length > 1 ? 'Common' : groups[0] };
});
};

const sscSubjects = buildSubjectList('SSC');
const hscSubjects = buildSubjectList('HSC');
const sscFeaturedSubjects = sscSubjects.slice(0, 8);
const hscFeaturedSubjects = hscSubjects.slice(0, 8);
const religionOptions = [
{ key: 'Islam', label: 'Islam', subtitle: '\u0987\u09B8\u09B2\u09BE\u09AE' },
{ key: 'Hinduism', label: 'Hinduism', subtitle: '\u09B9\u09BF\u09A8\u09CD\u09A6\u09C1 \u09A7\u09B0\u09CD\u09AE' },
{ key: 'Buddhism', label: 'Buddhism', subtitle: '\u09AC\u09CC\u09A6\u09CD\u09A7 \u09A7\u09B0\u09CD\u09AE' },
{ key: 'Christianity', label: 'Christianity', subtitle: '\u0996\u09CD\u09B0\u09BF\u09B7\u09CD\u099F\u09BE\u09A8 \u09A7\u09B0\u09CD\u09AE' }
];

const useThumbnails = (endpoint, keyField) => {
const [thumbnailMap, setThumbnailMap] = useState({});
useEffect(() => {
let isActive = true;
const loadThumbnails = async () => {
try {
const response = await fetch(endpoint);
if (!response.ok) return;
const data = await response.json();
if (!isActive) return;
const map = (data.thumbnails || []).reduce((acc, item) => {
const key = item[keyField];
if (!key) return acc;
acc[key] = { url: item.url };
return acc;
}, {});
setThumbnailMap(map);
} catch (error) { console.warn('Failed to load thumbnails', error); }
};
loadThumbnails();
return () => { isActive = false; };
}, []);
return thumbnailMap;
};

const READ_PROGRESS_KEY = 'freeducation.read-progress';
const RECENT_READ_KEY = 'freeducation.recent-read';
const VIDEO_PROGRESS_KEY = 'freeducation.video-progress';
const RECENT_VIDEO_KEY = 'freeducation.recent-video';

const loadVideoProgress = () => {
try { const raw = localStorage.getItem(VIDEO_PROGRESS_KEY); return raw ? JSON.parse(raw) : {}; }
catch (error) { console.warn('Failed to read video progress', error); return {}; }
};

const loadRecentVideo = () => {
try { const raw = localStorage.getItem(RECENT_VIDEO_KEY); return raw ? JSON.parse(raw) : null; }
catch (error) { console.warn('Failed to read recent video', error); return null; }
};

const storeVideoProgress = (entry) => {
const current = loadVideoProgress();
const updated = {
...current,
[entry.id]: {
title: entry.title, context: entry.context, route: entry.route,
currentTime: entry.currentTime, duration: entry.duration, updatedAt: entry.updatedAt
}
};
try {
localStorage.setItem(VIDEO_PROGRESS_KEY, JSON.stringify(updated));
localStorage.setItem(RECENT_VIDEO_KEY, JSON.stringify({
id: entry.id, title: entry.title, context: entry.context, route: entry.route,
currentTime: entry.currentTime, duration: entry.duration, updatedAt: entry.updatedAt
}));
} catch (error) { console.warn('Failed to store video progress', error); }
return updated;
};

const useVideoProgress = () => {
const [videoProgress, setVideoProgress] = useState(() => loadVideoProgress());
const [recentVideo, setRecentVideo] = useState(() => loadRecentVideo());
const updateVideoProgress = (entry) => {
const timestamped = { ...entry, updatedAt: Date.now() };
const updated = storeVideoProgress(timestamped);
setVideoProgress(updated);
setRecentVideo({
id: entry.id, title: entry.title, context: entry.context, route: entry.route,
currentTime: entry.currentTime, duration: entry.duration, updatedAt: timestamped.updatedAt
});
};
return { videoProgress, recentVideo, updateVideoProgress };
};

const loadReadProgress = () => {
try { const raw = localStorage.getItem(READ_PROGRESS_KEY); return raw ? JSON.parse(raw) : {}; }
catch (error) { console.warn('Failed to read progress data', error); return {}; }
};
const loadRecentRead = () => {
try { const raw = localStorage.getItem(RECENT_READ_KEY); return raw ? JSON.parse(raw) : null; }
catch (error) { console.warn('Failed to read recent chapter', error); return null; }
};
const storeReadProgress = (entry) => {
const current = loadReadProgress();
const updated = { ...current, [entry.key]: { label: entry.label, subjectLabel: entry.subjectLabel, updatedAt: entry.updatedAt } };
try {
localStorage.setItem(READ_PROGRESS_KEY, JSON.stringify(updated));
localStorage.setItem(RECENT_READ_KEY, JSON.stringify({ label: entry.label, route: entry.route, updatedAt: entry.updatedAt }));
} catch (error) { console.warn('Failed to store reading progress', error); }
return updated;
};
const storeBanglaSelection = ({ classLabel, categoryName, itemName }) => {
try { localStorage.setItem('freeducation.bangla-selection', JSON.stringify({ classLabel, categoryName, itemName })); }
catch (error) { console.warn('Failed to store Bangla selection', error); }
};
const getLastReadForSubject = (readMap, subjectLabel) => {
const entries = Object.values(readMap || {}).filter((entry) => entry.subjectLabel === subjectLabel);
if (entries.length === 0) return '';
entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
return entries[0]?.label || '';
};
const useReadingProgress = () => {
const [readMap, setReadMap] = useState(() => loadReadProgress());
const [recentRead, setRecentRead] = useState(() => loadRecentRead());
const markRead = (entry) => {
const timestamped = { ...entry, updatedAt: Date.now() };
const updated = storeReadProgress(timestamped);
setReadMap(updated);
setRecentRead({ label: entry.label, route: entry.route, updatedAt: timestamped.updatedAt });
};
return { readMap, recentRead, markRead };
};
`;var Zs=`
const FullScreenLoader = () => (
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
<div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
<div className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-[0.2em] animate-pulse">Loading Content...</div>
</div>
);

const useImagePreloader = (urls, { eagerCount = 6, maxWaitMs = 1200 } = {}) => {
const [ready, setReady] = useState(false);
useEffect(() => {
const validUrls = urls.filter(Boolean).slice(0, eagerCount);
if (validUrls.length === 0) {
const timer = setTimeout(() => setReady(true), 100); 
return () => clearTimeout(timer);
}
let mounted = true;
let loadedCount = 0;
const total = validUrls.length;
const check = () => {
loadedCount++;
if (loadedCount >= total && mounted) {
setReady(true);
}
};
const timeoutId = setTimeout(() => {
if (mounted) setReady(true);
}, maxWaitMs);
validUrls.forEach((url) => {
const img = new Image();
img.src = url;
if (img.complete) {
check();
} else {
img.onload = check;
img.onerror = check;
}
});
return () => { mounted = false; clearTimeout(timeoutId); };
}, [JSON.stringify(urls), eagerCount, maxWaitMs]); 
return ready;
};

const cardWidthClass = 'w-36 sm:w-44';
const cardGridGapClass = 'gap-4 sm:gap-6';
const cardSurfaceClass = 'relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md shadow-[0_20px_45px_-30px_rgba(15,23,42,0.7)] ring-1 ring-white/70 transition-all duration-300 group-hover:shadow-[0_28px_60px_-35px_rgba(30,64,175,0.55)] group-hover:-translate-y-1 card-art-surface';
const cardPanelClass = 'relative';
const flatSectionClass = 'border-b border-slate-200 pb-4 last:border-b-0';

const FloatingInkStyles = () => (
<style>{\`
@keyframes drawStroke {
0% { stroke-dashoffset: 1000; opacity: 0; }
10% { opacity: 1; }
80% { opacity: 1; }
100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes floatSlow {
0%, 100% { transform: translateY(0px); }
50% { transform: translateY(-10px); }
}
@keyframes floatUpVanish {
0% { transform: translateY(0); opacity: 0.7; }
100% { transform: translateY(-150px); opacity: 0; }
}
.sketch-line {
stroke-dasharray: 1000;
stroke-dashoffset: 1000;
animation: drawStroke 8s ease-in-out infinite;
stroke-linecap: round;
stroke-linejoin: round;
fill: none;
}
.ink-trail {
pointer-events: none;
fill: none;
stroke: #475569;
stroke-width: 2;
stroke-linecap: round;
stroke-linejoin: round;
}
.ink-floating {
animation: floatUpVanish 4s ease-out forwards;
}
.delay-1 { animation-delay: 0s; }
.delay-2 { animation-delay: 3s; }
.delay-3 { animation-delay: 5s; }
\`}</style>
);

// UPDATED: Toggle-able Sketch Overlay
const InteractiveSketchOverlay = () => {
const [enabled, setEnabled] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('sketch_enabled') !== 'false' : true);
const [paths, setPaths] = useState([]);
const [currentPoints, setCurrentPoints] = useState([]);
const timerRef = useRef(null);

useEffect(() => {
const handleToggle = () => setEnabled(localStorage.getItem('sketch_enabled') !== 'false');
window.addEventListener('sketch-toggle', handleToggle);
return () => window.removeEventListener('sketch-toggle', handleToggle);
}, []);

const getPathD = (points) => {
if (points.length < 2) return '';
return \`M \${points[0].x} \${points[0].y} \` + points.slice(1).map(p => \`L \${p.x} \${p.y}\`).join(' ');
};

useEffect(() => {
if (!enabled) {
setPaths([]);
setCurrentPoints([]);
return;
}

const handleMove = (e) => {
const x = e.clientX || (e.touches && e.touches[0].clientX);
const y = e.clientY || (e.touches && e.touches[0].clientY);
if (x === undefined || y === undefined) return;

setCurrentPoints(prev => [...prev, { x, y }]);
if (timerRef.current) clearTimeout(timerRef.current);
timerRef.current = setTimeout(finalizeStroke, 150);
};

const finalizeStroke = () => {
setCurrentPoints(curr => {
if (curr.length > 2) {
const newPath = { id: Date.now() + Math.random(), d: getPathD(curr) };
setPaths(prev => [...prev, newPath]);
setTimeout(() => { setPaths(prev => prev.filter(p => p.id !== newPath.id)); }, 4000);
}
return [];
});
};

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: true });
window.addEventListener('pointerup', finalizeStroke);

return () => {
window.removeEventListener('mousemove', handleMove);
window.removeEventListener('touchmove', handleMove);
window.removeEventListener('pointerup', finalizeStroke);
};
}, [enabled]);

if (!enabled) return null;

return (
<div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
<svg className="w-full h-full overflow-visible">
{paths.map(p => <path key={p.id} d={p.d} className="ink-trail ink-floating" />)}
{currentPoints.length > 1 && <path d={getPathD(currentPoints)} className="ink-trail" style={{ opacity: 0.8 }} />}
</svg>
</div>
);
};

// UPDATED: Toggle-able Background Art
const BackgroundArt = () => {
const [enabled, setEnabled] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem('sketch_enabled') !== 'false' : true);

useEffect(() => {
const handleToggle = () => setEnabled(localStorage.getItem('sketch_enabled') !== 'false');
window.addEventListener('sketch-toggle', handleToggle);
return () => window.removeEventListener('sketch-toggle', handleToggle);
}, []);

if (!enabled) return null;

return (
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
<FloatingInkStyles />

{/* Geometry Sketch */}
<div className="absolute top-10 right-10 opacity-10 text-indigo-900 w-64 h-64">
<svg viewBox="0 0 200 200" className="w-full h-full">
<path d="M50 150 L150 150 L100 50 Z" stroke="currentColor" strokeWidth="2" className="sketch-line delay-1" />
<path d="M90 70 Q100 80 110 70" stroke="currentColor" strokeWidth="1" className="sketch-line delay-1" />
<path d="M100 50 L100 150" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="sketch-line delay-1" />
</svg>
</div>

{/* Physics Trajectory */}
<div className="absolute bottom-20 left-10 opacity-10 text-slate-800 w-80 h-40">
<svg viewBox="0 0 300 150" className="w-full h-full">
<line x1="0" y1="140" x2="300" y2="140" stroke="currentColor" strokeWidth="2" />
<path d="M20 140 Q 150 -50 280 140" stroke="currentColor" strokeWidth="2" className="sketch-line delay-2" />
<path d="M20 140 L 50 100" stroke="currentColor" strokeWidth="1" className="sketch-line delay-2" />
<path d="M280 140 L 250 100" stroke="currentColor" strokeWidth="1" className="sketch-line delay-2" />
</svg>
</div>

{/* Chemistry Benzene */}
<div className="absolute top-20 left-20 opacity-10 text-slate-900 w-48 h-48" style={{animation: 'floatSlow 6s ease-in-out infinite'}}>
<svg viewBox="0 0 100 100" className="w-full h-full">
<path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke="currentColor" strokeWidth="2" className="sketch-line delay-3" />
<circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" className="sketch-line delay-3" />
<path d="M50 10 L50 30" stroke="currentColor" strokeWidth="1" className="sketch-line delay-3" />
</svg>
</div>

<div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
</div>
);
};

const BookReader = ({ children, className = '' }) => (
<div className={'w-full ' + className}>
<div className="font-serif text-slate-900 text-sm leading-snug text-justify space-y-2">
{children}
</div>
</div>
);

const getSubjectChapterCount = (subject) => {
if (!contentLoaded || !subject) return null;
const title = subject.title;
if (subject.classLabel === 'SSC') {
if (title === 'Information and Communication Technology') return sscIctChapters.length;
if (title === 'Physics') return sscPhysicsChapters.length;
if (title === 'Chemistry') return sscChemistryChapters.length;
if (title === 'Biology') return sscBiologyChapters.length;
if (title === 'Bangladesh and Global Studies') return sscBangladeshGlobalChapters.length;
if (title === 'Religion and Moral Education') {
return Object.values(sscReligionChapters || {}).reduce((total, chapters) => total + (chapters?.length || 0), 0);
}
return null;
}
if (subject.classLabel === 'HSC') {
if (title === 'Information and Communication Technology') return hscIctChapters.length;
if (title === 'Physics 1st Paper') return hscPhysics1stChapters.length;
if (title === 'Physics 2nd Paper') return hscPhysics2ndChapters.length;
if (title === 'Chemistry 1st Paper') return hscChemistry1stChapters.length;
if (title === 'Chemistry 2nd Paper') return hscChemistry2ndChapters.length;
if (title === 'Biology 1st Paper') return hscBiology1stChapters.length;
if (title === 'Biology 2nd Paper') return hscBiology2ndChapters.length;
return null;
}
return null;
};

const ArtPanelGrid = ({ children, className = '' }) => (
<div className={cardPanelClass}>
<div className={'relative grid justify-items-center ' + cardGridGapClass + ' ' + className}>
{children}
</div>
</div>
);

const SubjectCard = ({ subject, onNavigate, className = '', showGroup = false }) => {
const isActive = Boolean(subject.route);
const chapterCount = getSubjectChapterCount(subject);
return (
<div 
onClick={() => isActive && onNavigate(subject.route)}
className={className + ' block text-left transition-all duration-300 group ' + (isActive ? 'cursor-pointer' : 'opacity-60 cursor-default')}
>
<div className={cardSurfaceClass + ' mb-3 relative'}>
{subject.thumbnailUrl ? (
<img src={subject.thumbnailUrl} alt={subject.title + ' thumbnail'} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 card-art-media" />
) : (
<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 bg-slate-50 gap-2 card-art-media">
<div className={'h-10 w-10 bg-white border border-slate-100 flex items-center justify-center shadow-sm ' + subject.accent}>
<i className={'fa-solid ' + subject.icon + ' text-sm text-slate-400'}></i>
</div>
</div>
)}
<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
{subject.lastRead && (
<div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white backdrop-blur-sm text-emerald-600 text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 z-10 border border-emerald-100">
<i className="fa-solid fa-check-circle"></i>
Read
</div>
)}
{showGroup && subject.groupLabel && (
<div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider shadow-sm z-10">
{subject.groupLabel}
</div>
)}
</div>
<div className="pl-1">
<h4 className="font-bold text-base text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors font-serif">{subject.title}</h4>
<p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide font-medium">
{subject.subtitle}
{chapterCount !== null && <span className="mx-1">\u2022</span>}
{chapterCount !== null && <span>{chapterCount} Ch</span>}
</p>
</div>
</div>
);
};

const ChapterCard = ({ title, subtitle, thumbnailUrl, onClick, className = '', isRead = false, stars = 0 }) => (
<button onClick={onClick} className={className + ' block text-left transition-all duration-300 group'}>
<div className="space-y-2 h-full text-center">
<div className={cardSurfaceClass + (isRead ? ' ring-2 ring-emerald-400' : '')}>
{isRead && (
<div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm z-10 border border-emerald-600">
<i className="fa-solid fa-check text-[10px]"></i>Read
</div>
)}
{Number(stars) > 0 && (
<div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-white/90 px-2 py-1 text-[10px] font-semibold text-amber-600 shadow-sm z-10 border border-amber-200">
{'\u2605'.repeat(Math.min(5, Number(stars)))}
</div>
)}
{thumbnailUrl ? (
<img src={thumbnailUrl} alt={title + ' thumbnail'} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 card-art-media" />
) : (
<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 text-[9px] uppercase tracking-[0.3em] card-art-media"><span>No thumbnail</span></div>
)}
<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</div>
<div className="text-center px-1">
<div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors font-bangla">{title}</div>
{subtitle && <div className="text-[10px] text-slate-500 mt-0.5">{subtitle}</div>}
</div>
</div>
</button>
);

const PublicChapterList = ({ classLabel, subjectLabel, chapters, onSelectChapter, recentRoute }) => {
const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
const { readMap, markRead } = useReadingProgress();
const imageUrls = chapters.map(c => chapterThumbnails[makeChapterThumbnailKey(classLabel, subjectLabel, c.id)]?.url);
const isReady = useImagePreloader(imageUrls, { eagerCount: 8, maxWaitMs: 1000 });
if (!isReady && chapters.length > 0) return <FullScreenLoader />;
return (
<ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
{chapters.map((chapter) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
return (
<ChapterCard
key={chapter.id}
title={chapter.name}
subtitle={subjectLabel}
thumbnailUrl={chapterThumbnails[chapterKey]?.url}
stars={chapter.stars}
isRead={Boolean(readMap[chapterKey])}
onClick={() => {
markRead({ key: chapterKey, label: chapter.name, subjectLabel, route: recentRoute });
onSelectChapter(chapter);
}}
className={cardWidthClass + ' font-bangla'}
/>
);
})}
{chapters.length === 0 && <div className="border border-dashed border-slate-200 p-6 text-sm text-slate-400 font-bangla text-center">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
</ArtPanelGrid>
);
};

const SubjectRow = ({ title, subjects, onNavigate, onAll, thumbnailMap, readMap }) => {
const containerRef = useRef(null);
const scroll = (direction) => {
if (containerRef.current) {
const scrollAmount = direction === 'left' ? -300 : 300;
containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}
};
return (
<div className="w-full mb-12">
<div className="relative mb-8 px-2 py-4">
<div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between z-10 pl-2">
<div>
<span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] pl-1 mb-1 block">Curriculum</span>
<h3 className="text-4xl font-bold text-slate-800 font-serif leading-none relative inline-block">
{title}
<span className="absolute -bottom-2 left-0 w-2/3 h-1.5 bg-indigo-500/20"></span>
<span className="absolute -bottom-2 left-2/3 w-1.5 h-1.5 bg-amber-400 ml-1"></span>
</h3>
</div>
<div className="flex flex-wrap items-center gap-3 pb-1">
<button onClick={() => scroll('left')} className="w-9 h-9 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition shadow-sm hidden sm:flex"><i className="fa-solid fa-arrow-left text-sm"></i></button>
<button onClick={() => scroll('right')} className="w-9 h-9 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 flex items-center justify-center transition shadow-sm hidden sm:flex"><i className="fa-solid fa-arrow-right text-sm"></i></button>
<button onClick={onAll} className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition shadow-sm ml-2">View All</button>
</div>
</div>
</div>
<div ref={containerRef} className="flex overflow-x-auto gap-4 pb-8 px-2 snap-x hide-scrollbars pt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
{subjects.map((subject, index) => {
const thumbnail = thumbnailMap[subject.subjectKey];
const lastRead = getLastReadForSubject(readMap, subject.title);
return <SubjectCard key={index} subject={{ ...subject, lastRead, thumbnailUrl: thumbnail?.url }} onNavigate={onNavigate} className={'flex-none snap-start ' + cardWidthClass} />;
})}
</div>
</div>
);
};

const formatHierarchyLabel = (segment) => {
if (!segment) return '';
const normalized = segment.toLowerCase();
const replacements = { ssc: 'SSC', hsc: 'HSC', ict: 'ICT', mcq: 'MCQ', cq: 'CQ', srijonshil: 'Srijonshil', shohopath: 'Shohopath', shahitto: 'Shahitto', goddo: 'Goddo', poddo: 'Poddo', topics: 'Topics', topic: 'Topic', chapters: 'Chapters', videos: 'Videos' };
if (replacements[normalized]) return replacements[normalized];
return segment.split('-').map((part) => replacements[part] || part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const buildHierarchyTrail = () => {
const { pathname } = window.location;
const parts = pathname.split('/').filter(Boolean);
const trail = [{ label: 'Home', path: '/' }];
let currentPath = '';
parts.forEach((part) => {
currentPath += '/' + part;
trail.push({ label: formatHierarchyLabel(part), path: currentPath });
});
return trail;
};

const PublicSidebar = ({ title, subtitle, onBack, onNavigate }) => {
const [trail, setTrail] = useState(buildHierarchyTrail());
useEffect(() => { setTrail(buildHierarchyTrail()); }, [title, subtitle]);
return (
<aside className="hidden lg:flex lg:w-64 border-r border-slate-200 bg-white/50 backdrop-blur-sm p-6 shrink-0">
<div className="flex flex-col gap-6 w-full">
<div>
<div className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-bold">Location</div>
<div className="mt-4 space-y-1">
{trail.map((item, index) => {
const view = getViewFromPath(item.path);
return (
<button key={item.path} onClick={() => onNavigate(view)} className={\`w-full text-left text-sm py-1.5 transition flex items-center gap-2 \${index === trail.length - 1 ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'}\`}>
<i className={\`fa-solid fa-angle-right text-[10px] \${index === trail.length - 1 ? 'text-indigo-400' : 'text-slate-300'}\`}></i>
{item.label}
</button>
);
})}
</div>
</div>
<div>
<div className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-bold">Shortcuts</div>
<div className="mt-3 space-y-2">
{onBack && <button onClick={onBack} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Back</button>}
<button onClick={() => onNavigate('landing')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Home</button>
<button onClick={() => onNavigate('public-videos')} className="w-full text-left text-sm font-semibold text-slate-600 hover:text-indigo-600 transition py-1">Videos</button>
</div>
</div>
</div>
</aside>
);
};

const PublicSimpleShell = ({ title, subtitle, backgroundClass = 'bg-slate-50', badge, onBack, onNavigate, children }) => (
<div className={'flex-1 min-h-screen relative ' + backgroundClass}>
<BackgroundArt />
<InteractiveSketchOverlay />

<div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 relative z-10">
<div className="flex flex-col items-center justify-center text-center gap-4 mb-10 pb-6 border-b border-slate-200/50">
<div className="w-full flex items-center justify-between absolute top-8 px-4 sm:px-12 left-0 z-20 pointer-events-none">
{onBack ? (
<button onClick={onBack} className="pointer-events-auto w-10 h-10 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition flex items-center justify-center group backdrop-blur-sm">
<i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
</button>
) : <div></div>}
<button onClick={() => onNavigate('landing')} className="pointer-events-auto px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-300 transition shadow-sm backdrop-blur-sm">
Home
</button>
</div>
<div className="mt-12">
{badge && <div className="mb-4">{badge}</div>}
<h2 className="text-3xl sm:text-5xl font-bold text-slate-900 font-serif leading-tight">
{title}
</h2>
{subtitle && <p className="text-lg text-slate-500 font-serif italic mt-3 opacity-80 max-w-2xl mx-auto">{subtitle}</p>}
</div>
</div>

<div className="mt-6 lg:flex lg:gap-8">
<PublicSidebar title={title} subtitle={subtitle} onBack={onBack} onNavigate={onNavigate} />
<div className="flex-1 min-w-0">
{children}
</div>
</div>
</div>
</div>
);

const CqQuestionList = ({ sections }) => {
const [openMap, setOpenMap] = useState({});
const toggleAnswer = (sectionKey, index) => { setOpenMap((prev) => ({ ...prev, [sectionKey + '-' + index]: !prev[sectionKey + '-' + index] })); };
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);
if (!sections.length) return <div className="text-sm text-slate-400 font-serif italic">No questions added yet.</div>;
return (
<div className="space-y-6">
{sections.map((section) => (
<div key={section.key} className={flatSectionClass}>
<div className="text-base font-bold text-slate-900 font-serif mb-4">{section.label}</div>
{section.items.length === 0 ? <div className="text-sm text-slate-400 mt-3 italic">No questions.</div> : (
<div className="space-y-6">
{section.items.map((entry, index) => {
const openKey = section.key + '-' + index;
const isOpen = Boolean(openMap[openKey]);
return (
<div key={entry.question + '-' + index} className="space-y-3">
<div className="flex flex-wrap items-baseline gap-x-2 text-sm font-medium text-slate-800 leading-snug font-serif">
<span>{section.prefix(index)}. {entry.question}</span>
{Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
</div>
<button onClick={() => toggleAnswer(section.key, index)} className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition uppercase tracking-wider">{isOpen ? 'Hide Answer' : 'Show Answer'}</button>
{isOpen && <div className="text-sm text-slate-700 bg-slate-50 p-4 border-l-4 border-indigo-200 leading-relaxed font-serif text-justify">{entry.answer}</div>}
</div>
);
})}
</div>
)}
</div>
))}
</div>
);
};

const PublicMcqList = ({ mcqList }) => {
const optionLabels = ['\u0995', '\u0996', '\u0997', '\u0998'];
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const [globalOpen, setGlobalOpen] = useState(false);
const [openOverrides, setOpenOverrides] = useState({});
const isOpen = (index) => openOverrides[index] !== undefined ? openOverrides[index] : globalOpen;
const toggleAnswer = (index) => { setOpenOverrides((prev) => ({ ...prev, [index]: !isOpen(index) })); };
const showAll = () => { setGlobalOpen(true); setOpenOverrides({}); };
const hideAll = () => { setGlobalOpen(false); setOpenOverrides({}); };
const normalizedStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);
if (mcqList.length === 0) return <div className="text-sm text-slate-400 italic font-serif">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 MCQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>;
return (
<div className="space-y-6">
<div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
<span>Total: {toBanglaNumber(mcqList.length)}</span>
<div className="flex flex-wrap gap-2">
<button onClick={showAll} className="hover:text-indigo-600 transition">Show All</button>
<span>/</span>
<button onClick={hideAll} className="hover:text-indigo-600 transition">Hide All</button>
</div>
</div>
<div className="divide-y divide-slate-100">
{mcqList.map((entry, index) => (
<div key={entry.question + '-' + index} className="py-6">
<div className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-900 font-bangla mb-1">
<span>{toBanglaNumber(index + 1)}. {entry.question}</span>
{normalizedStars(entry.stars) > 0 && renderStars(normalizedStars(entry.stars))}
</div>
<div className="grid gap-2 text-sm text-slate-600 font-bangla ml-4">{(entry.options || []).map((option, optionIndex) => <div key={entry.question + '-' + optionIndex}>{optionLabels[optionIndex]}. {option}</div>)}</div>
<div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
<button onClick={() => toggleAnswer(index)} className="font-bold text-indigo-600 hover:text-indigo-500 uppercase tracking-wider">{isOpen(index) ? 'Hide Answer' : 'Show Answer'}</button>
{isOpen(index) && <div className="text-emerald-700 font-bold font-bangla bg-emerald-50 px-2 py-1 border border-emerald-100">\u0989\u09A4\u09CD\u09A4\u09B0: {optionLabels[entry.answerIndex]}\u0964 {entry.options?.[entry.answerIndex]}</div>}
</div>
</div>
))}
</div>
</div>
);
};
`;var ea=`
const PublicBanglaShell = ({ title, subtitle, onBack, onNavigate, children }) => (
<PublicSimpleShell 
title={title} 
subtitle={subtitle} 
onBack={onBack} 
onNavigate={onNavigate} 
backgroundClass="bg-slate-50"
badge={
/* LEGACY UPDATE: Square Badge */
<div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-rose-100 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-sm">
<span className="w-1.5 h-1.5 bg-rose-500"></span>
Bangla 1st Paper
</div>
}
>
{children}
</PublicSimpleShell>
);

const PublicBanglaTopicGrid = ({ classLabel, subjectLabel, topics, onNavigate }) => {
const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
const { readMap, markRead } = useReadingProgress();
return (
<ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
{topics.map((topic) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey || topic.title);
return (
<ChapterCard
key={topic.title}
title={topic.title}
subtitle={topic.description}
thumbnailUrl={chapterThumbnails[chapterKey]?.url}
isRead={Boolean(readMap[chapterKey])}
onClick={() => {
markRead({ key: chapterKey, label: topic.title, subjectLabel, route: topic.route });
topic.route && onNavigate(topic.route);
}}
className={cardWidthClass}
/>
);
})}
</ArtPanelGrid>
);
};

const PublicBanglaTextList = ({ classLabel, subjectLabel, categoryLabel, subtitle, items, onSelectItem }) => {
const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
const { readMap, markRead } = useReadingProgress();
return (
<div className="space-y-4 font-bangla">
<ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
{items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">\u098F\u0987 \u0985\u0982\u09B6\u09C7 \u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8 \u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + categoryLabel);
return (
<ChapterCard
key={item}
title={item}
subtitle={categoryLabel}
thumbnailUrl={chapterThumbnails[chapterKey]?.url}
isRead={Boolean(readMap[chapterKey])}
onClick={() => {
storeBanglaSelection({ classLabel, categoryName: categoryLabel, itemName: item });
markRead({ key: chapterKey, label: item, subjectLabel, route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item' });
onSelectItem(item);
}}
className={cardWidthClass}
/>
);
})}
</ArtPanelGrid>
</div>
);
};

const PublicBanglaShohopathList = ({ classLabel, subjectLabel, items, onSelectItem }) => {
const chapterThumbnails = useThumbnails('/api/chapter-thumbnails', 'chapterKey');
const { readMap, markRead } = useReadingProgress();
return (
<ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 font-bangla">
{items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">\u098F\u0987 \u0985\u0982\u09B6\u09C7 \u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8 \u09B8\u09B9\u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, (item.id || item.name) + '-\u09B8\u09B9\u09AA\u09BE\u09A0');
return (
<ChapterCard
key={item.id}
title={item.name}
subtitle={item.type}
thumbnailUrl={chapterThumbnails[chapterKey]?.url}
isRead={Boolean(readMap[chapterKey])}
onClick={() => {
storeBanglaSelection({ classLabel, categoryName: item.type, itemName: item.name });
markRead({ key: chapterKey, label: item.name, subjectLabel, route: classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item' });
onSelectItem(item);
}}
className={cardWidthClass}
/>
);
})}
</ArtPanelGrid>
);
};

const PublicBanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, onNavigate, onOpenVideos }) => {
const categoryRoute = classLabel === 'SSC' ? (categoryName === '\u09AA\u09A6\u09CD\u09AF' ? 'public-bangla-ssc-poddo' : categoryName === '\u09A8\u09BE\u099F\u0995' || categoryName === '\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8' ? 'public-bangla-ssc-shohopath' : 'public-bangla-ssc-goddo')
: (categoryName === '\u09AA\u09A6\u09CD\u09AF' ? 'public-bangla-hsc-poddo' : categoryName === '\u09A8\u09BE\u099F\u0995' || categoryName === '\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8' ? 'public-bangla-hsc-shohopath' : 'public-bangla-hsc-goddo');
const srijonshilRoute = classLabel === 'SSC' ? 'public-bangla-ssc-srijonshil' : 'public-bangla-hsc-srijonshil';
const mcqRoute = classLabel === 'SSC' ? 'public-bangla-ssc-mcq' : 'public-bangla-hsc-mcq';
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
const notes = (notesByItem || {})[noteKey] || [];
const normalizedNote = (note) => {
if (!note) return { text: '', stars: 0 };
if (typeof note === 'string') return { text: note, stars: 0 };
return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
};
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px] text-amber-400">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);

const actionCards = [
{ key: 'cq', label: 'CQ Questions', icon: 'fa-pen-to-square', onClick: () => onNavigate(srijonshilRoute) },
{ key: 'mcq', label: 'MCQ Practice', icon: 'fa-list-check', onClick: () => onNavigate(mcqRoute) },
{ key: 'videos', label: 'Video Lessons', icon: 'fa-play', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: itemName, subtitle: '', backRoute: categoryRoute }) },
];

return (
<PublicBanglaShell title={itemName || '\u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'} onBack={() => onNavigate(categoryRoute)} onNavigate={onNavigate}>
<div className="space-y-8 font-bangla text-left max-w-4xl mx-auto">

{/* LEGACY UPDATE: Square Action Buttons */}
<div className="flex flex-wrap justify-center gap-4">
{actionCards.map((card) => (
<button key={card.key} onClick={card.onClick} className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 transition group shadow-sm">
<i className={'fa-solid ' + card.icon + ' text-indigo-400 group-hover:text-indigo-600'}></i>
<span className="font-bold text-sm">{card.label}</span>
</button>
))}
</div>

<BookReader>
{notes.length === 0 && <div className="text-center py-8 text-slate-400 italic">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{notes.map((note, index) => {
const resolved = normalizedNote(note);
return (
<div key={noteKey + '-' + index} className="flex items-start gap-3">
<span className="mt-0.5 font-bold text-indigo-900/40 select-none">{toBanglaNumber(index + 1)}.</span>
<div className="flex-1">
<div className="flex flex-wrap items-baseline gap-x-2 text-slate-900 font-bangla text-base leading-snug whitespace-pre-wrap">
<span>{resolved.text}</span>
{resolved.stars > 0 && renderStars(resolved.stars)}
</div>
</div>
</div>
);
})}
</BookReader>

</div>
</PublicBanglaShell>
);
};

const PublicBanglaSrijonshilDetail = ({ classLabel, itemName, categoryName, srijonshilQuestions, getQuestionKey, onNavigate }) => {
const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
const srijonshilTypes = [
{ key: 'gyan', label: '\u099C\u09CD\u099E\u09BE\u09A8\u09AE\u09C2\u09B2\u0995 (\u0995)' },
{ key: 'onudhabon', label: '\u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8\u09AE\u09C2\u09B2\u0995 (\u0996)' },
{ key: 'scenario', label: '\u0997 \u0993 \u0998 (\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993)' }
];
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);
return (
<PublicBanglaShell title="\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8" subtitle={itemName ? itemName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
<div className="space-y-12 font-bangla text-left max-w-4xl mx-auto">
{srijonshilTypes.map((type) => {
const list = srijonshilQuestions[getQuestionKey(classLabel, categoryName, itemName, type.key)] || [];
const scenarioEntries = type.key === 'scenario'
? list.flatMap((entry, index) => [
{
id: 'scenario-' + index + '-g',
label: '\u0997',
scenario: entry.scenario,
question: entry.questionG,
answer: entry.answerG,
stars: entry.starsG
},
{
id: 'scenario-' + index + '-gh',
label: '\u0998',
scenario: entry.scenario,
question: entry.questionGh,
answer: entry.answerGh,
stars: entry.starsGh
}
])
: [];
return (
<div key={type.key}>
<h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
{/* LEGACY UPDATE: Square marker */}
<span className="w-8 h-1 bg-indigo-500"></span>
{type.label}
</h3>
<BookReader>
{list.length === 0 ? <div className="text-sm text-slate-400 italic">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div> : (
<div className="space-y-8">
{type.key === 'scenario' ? (
scenarioEntries.map((entry, index) => (
<div key={entry.id} className="space-y-3">
<div className="font-bold text-slate-900 text-sm">{index + 1}. <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-2">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993</span></div>
<div className="text-slate-800 text-sm leading-snug whitespace-pre-wrap">{entry.scenario}</div>
<div className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-900">
<span>{entry.label}. {entry.question}</span>
{Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
</div>
<div className="text-slate-800 text-sm leading-snug pl-4 border-l-2 border-indigo-200/50 whitespace-pre-wrap">{entry.answer}</div>
</div>
))
) : (
list.map((entry, index) => (
<div key={entry.question + '-' + index} className="space-y-3">
<div className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-900">
<span>{index + 1}. {entry.question}</span>
{Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
</div>
<div className="text-slate-800 text-sm leading-snug pl-4 border-l-2 border-indigo-200/50 whitespace-pre-wrap">{entry.answer}</div>
</div>
))
)}
</div>
)}
</BookReader>
</div>
);
})}
</div>
</PublicBanglaShell>
);
};

const PublicBanglaMcqDetail = ({ classLabel, itemName, categoryName, mcqQuestions, getQuestionKey, onNavigate }) => {
const itemRoute = classLabel === 'SSC' ? 'public-bangla-ssc-item' : 'public-bangla-hsc-item';
const mcqList = mcqQuestions[getQuestionKey(classLabel, categoryName, itemName, 'mcq')] || [];
return (
<PublicBanglaShell title="\u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8" subtitle={itemName ? itemName : ''} onBack={() => onNavigate(itemRoute)} onNavigate={onNavigate}>
{/* LEGACY UPDATE: Removed rounded container */}
<div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md p-8 border border-white shadow-sm font-bangla">
<PublicMcqList mcqList={mcqList} />
</div>
</PublicBanglaShell>
);
};
`;var ta=`
const PublicIctShell = ({ title, subtitle, classLabel, onBack, onNavigate, children }) => {
// Reusing the upgraded PublicSimpleShell
return (
<PublicSimpleShell 
title={title} 
subtitle={subtitle} 
onBack={onBack} 
onNavigate={onNavigate} 
backgroundClass="bg-slate-50"
>
<div className="mb-6 flex justify-center">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-cyan-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-cyan-600 shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
{classLabel} ICT
</div>
</div>
{children}
</PublicSimpleShell>
);
};
const PublicIctChapterList = (props) => <PublicChapterList {...props} />;
const PublicIctMcqDetail = ({ classLabel, chapter, mcqQuestions, getQuestionKey, onBack, onNavigate }) => {
const chapterKey = chapter?.id || '';
const mcqList = mcqQuestions[getQuestionKey(classLabel, 'ICT', chapterKey, 'mcq')] || [];
const chapterTitle = chapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8';
return (
<PublicIctShell title="\u0986\u0987\u09B8\u09BF\u099F\u09BF \u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0" subtitle={chapterTitle} classLabel={classLabel} onBack={onBack} onNavigate={onNavigate}>
<div className="space-y-8 font-bangla bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-200/50 shadow-sm">
<div className="text-center">
<div className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Selected Chapter</div>
<h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">{chapterTitle}</h2>
</div>
<PublicMcqList mcqList={mcqList} />
</div>
</PublicIctShell>
);
};

const PublicScienceShell = ({ title, subtitle, subjectLabel, classLabel, onBack, onNavigate, children }) => {
return (
<PublicSimpleShell 
title={title} 
subtitle={subtitle} 
onBack={onBack} 
onNavigate={onNavigate} 
backgroundClass="bg-slate-50"
>
<div className="mb-6 flex justify-center">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
{classLabel} {subjectLabel}
</div>
</div>
{children}
</PublicSimpleShell>
);
};

const PublicScienceChapterList = (props) => <PublicChapterList {...props} />;

const PublicReligionOptionList = ({ options, onSelect }) => (
<ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
{options.map((option) => (
<button key={option.key} onClick={() => onSelect(option)} className="text-left transition-all duration-300 group">
<div className={cardSurfaceClass + ' flex items-center justify-center'}>
<div className="text-center px-4 card-art-media z-10">
<div className="text-lg font-bold text-slate-900 font-serif mb-1 group-hover:text-indigo-700 transition-colors">{option.label}</div>
<div className="text-xs text-slate-500 font-bangla opacity-80">{option.subtitle}</div>
</div>
{/* Decorative Overlay */}
<div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
</div>
</button>
))}
</ArtPanelGrid>
);

const PublicScienceTopicList = ({ topics, onSelectTopic }) => {
const renderStars = (value) => (
<div className="flex items-center justify-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</div>
);
return (
<div className={'grid justify-items-center ' + cardGridGapClass + ' sm:grid-cols-2 lg:grid-cols-3'}>
{topics.map((topic) => (
<button 
key={topic.id} 
onClick={() => onSelectTopic(topic)} 
className="w-full relative group bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden font-bangla"
>
<div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
<div className="relative z-10">
<div className="inline-block px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.25em] text-slate-400 bg-slate-50 mb-3 font-bold group-hover:bg-white transition-colors">Topic</div>
<div className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors mb-2">{topic.name}</div>
{Number(topic.stars) > 0 && <div className="mb-2">{renderStars(Math.min(5, Number(topic.stars)))}</div>}
<p className="text-xs text-slate-500">View Notes, CQ & MCQ</p>
</div>
</button>
))}
{topics.length === 0 && (
<div className="col-span-full py-12 text-center text-slate-400 font-bangla">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3"><i className="fa-regular fa-folder-open text-xl"></i></div>
<p>\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u099F\u09AA\u09BF\u0995 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</p>
</div>
)}
</div>
);
};

const PublicScienceTopicDetail = ({ subjectLabel, classLabel, chapterName, topicName, noteKey, notesByItem, cqQuestions, mcqList, onBack, backRoute, onNavigateCq, onNavigateMcq, onOpenVideos, onNavigate }) => {
const notes = (notesByItem || {})[noteKey] || [];
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const normalizedNote = (note) => {
if (!note) return { text: '', stars: 0 };
if (typeof note === 'string') return { text: note, stars: 0 };
return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
};
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);
const actionCards = [
{ key: 'cq', label: 'CQ Questions', icon: 'fa-pen-to-square', onClick: onNavigateCq },
{ key: 'mcq', label: 'MCQ Practice', icon: 'fa-list-check', onClick: onNavigateMcq },
{ key: 'videos', label: 'Video Lessons', icon: 'fa-play', onClick: () => onOpenVideos && onOpenVideos({ noteKey, title: topicName || '\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8', subtitle: chapterName || '', backRoute }) },
];
return (
<PublicSimpleShell title={topicName || '\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'} subtitle={chapterName || ''} onBack={onBack} onNavigate={onNavigate}>
<div className="mb-6 flex justify-center">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-500 shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
Topic Details
</div>
</div>

<div className="space-y-8 font-bangla">
{/* Action Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
{actionCards.map((card) => (
<button key={card.key} onClick={card.onClick} className="flex items-center justify-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md hover:text-indigo-700 transition group">
<div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
<i className={'fa-solid ' + card.icon + ' text-sm'}></i>
</div>
<span className="font-semibold text-sm">{card.label}</span>
</button>
))}
</div>

{/* Notes Section */}
<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm">
<div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Study Notes</div>
<div className="space-y-4 text-sm text-slate-700 leading-snug">
{notes.length === 0 && <div className="text-center py-8 text-slate-400 italic">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{notes.map((note, index) => {
const resolved = normalizedNote(note);
return (
<div key={noteKey + '-' + index} className="flex items-start gap-3">
<div className="flex-none w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center mt-0.5">
{toBanglaNumber(index + 1)}
</div>
<div className="flex flex-wrap items-baseline gap-x-2 whitespace-pre-wrap">
<span>{resolved.text}</span>
{resolved.stars > 0 && renderStars(resolved.stars)}
</div>
</div>
);
})}
</div>
</div>
</div>
</PublicSimpleShell>
);
};

const PublicScienceCqDetail = ({ subjectLabel, classLabel, chapterName, topicName, questions, onBack, onNavigate }) => {
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const cqTypes = [
{ key: 'gyan', label: '\u099C\u09CD\u099E\u09BE\u09A8\u09AE\u09C2\u09B2\u0995 (\u0995)' },
{ key: 'onudhabon', label: '\u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8\u09AE\u09C2\u09B2\u0995 (\u0996)' },
{ key: 'scenario', label: '\u0997 \u0993 \u0998 (\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993)' }
];
const renderStars = (value) => (
<span className="inline-flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</span>
);
return (
<PublicScienceShell subjectLabel={subjectLabel} classLabel={classLabel} title="\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8" subtitle={chapterName ? chapterName + ' \u2022 ' + (topicName || '') : topicName || ''} onBack={onBack} onNavigate={onNavigate}>
<div className="space-y-6 font-bangla">
{cqTypes.map((type) => {
const list = questions[type.key] || [];
const scenarioEntries = type.key === 'scenario'
? list.flatMap((entry, index) => [
{
id: 'scenario-' + index + '-g',
label: '\u0997',
scenario: entry.scenario,
question: entry.questionG,
answer: entry.answerG,
stars: entry.starsG
},
{
id: 'scenario-' + index + '-gh',
label: '\u0998',
scenario: entry.scenario,
question: entry.questionGh,
answer: entry.answerGh,
stars: entry.starsGh
}
])
: [];
return (
<div key={type.key} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
<div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">{type.label}</div>
{list.length === 0 ? <div className="text-sm text-slate-400 italic">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div> : (
<div className="space-y-5">
{type.key === 'scenario' ? (
scenarioEntries.map((entry, index) => (
<div key={entry.id} className="space-y-3">
<div className="flex gap-3">
<span className="font-bold text-indigo-600">{toBanglaNumber(index + 1)}.</span>
<div className="flex-1">
<div className="text-xs uppercase tracking-[0.2em] text-slate-400">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993</div>
<div className="text-sm font-semibold text-slate-800 whitespace-pre-wrap mt-1 leading-snug">{entry.scenario}</div>
<div className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-800">
<span>{entry.label}. {entry.question}</span>
{Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
</div>
</div>
</div>
<div className="text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 leading-snug whitespace-pre-wrap">
{entry.answer}
</div>
</div>
))
) : (
list.map((entry, index) => (
<div key={entry.question + '-' + index} className="space-y-3">
<div className="flex items-start gap-3">
<span className="font-bold text-indigo-600">{toBanglaNumber(index + 1)}.</span>
<div className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-slate-800">
<span>{entry.question}</span>
{Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
</div>
</div>
<div className="text-sm text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-100 leading-snug whitespace-pre-wrap">
{entry.answer}
</div>
</div>
))
)}
</div>
)}
</div>
);
})}
</div>
</PublicScienceShell>
);
};
const PublicScienceMcqDetail = ({ subjectLabel, classLabel, chapterName, topicName, mcqList, onBack, onNavigate }) => (
<PublicScienceShell subjectLabel={subjectLabel} classLabel={classLabel} title="\u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8" subtitle={chapterName ? chapterName + ' \u2022 ' + (topicName || '') : topicName || ''} onBack={onBack} onNavigate={onNavigate}>
<div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm font-bangla">
<PublicMcqList mcqList={mcqList} />
</div>
</PublicScienceShell>
);
`;var sa=`
        const PublicEnglishShell = ({ title, subtitle, onBack, onNavigate, children }) => (
            <PublicSimpleShell 
                title={title} 
                subtitle={subtitle} 
                onBack={onBack} 
                onNavigate={onNavigate} 
                backgroundClass="bg-slate-50"
                badge={
                    /* LEGACY UPDATE: Square Badge */
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500"></span>
                        English 1st Paper
                    </div>
                }
            >
                {children}
            </PublicSimpleShell>
        );

        const PublicEnglishCardGrid = ({ items, onNavigate }) => (
            <ArtPanelGrid className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                    <button 
                        key={item.key} 
                        onClick={() => item.route && onNavigate(item.route)} 
                        className="text-left transition-all duration-300 group w-full"
                    >
                        {/* LEGACY UPDATE: rounded-none */}
                        <div className="relative w-full aspect-[3/4] rounded-none overflow-hidden border border-slate-100 bg-white hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center">
                            {/* LEGACY UPDATE: Square Icon Box */}
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <i className="fa-solid fa-book-open text-lg"></i>
                            </div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Section</div>
                            <div className="text-lg font-bold text-slate-900 font-serif mb-2">{item.title}</div>
                            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    </button>
                ))}
            </ArtPanelGrid>
        );

        const PublicEnglishTypeList = ({ items, onSelect }) => (
            <div className="grid gap-4 sm:grid-cols-2 max-w-5xl mx-auto">
                {items.map((item) => (
                    // LEGACY UPDATE: rounded-none
                    <button key={item.key} onClick={() => onSelect(item)} className="relative w-full bg-white border border-slate-200 rounded-none p-6 text-left hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Question Type</div>
                                <i className="fa-solid fa-arrow-right text-indigo-300 group-hover:text-indigo-600 transition-colors"></i>
                            </div>
                            <div className="text-lg font-bold text-slate-900 font-serif mb-1 group-hover:text-indigo-700 transition-colors">{item.label}</div>
                            {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
                            {item.children?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {item.children.map((child) => (
                                        <span key={child.key} className="inline-block px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] border border-slate-100">{child.label}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
                {items.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">No question types available yet.</div>}
            </div>
        );

        const PublicEnglishQuestionList = ({ questions }) => {
            const renderStars = (value) => (
                <span className="inline-flex items-center gap-1 text-[10px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
                    ))}
                </span>
            );
            return (
                <div className="max-w-4xl mx-auto space-y-8">
                    {questions.length === 0 && <div className="text-center py-12 text-slate-400 italic">No questions have been added yet.</div>}
                    {questions.map((entry, index) => (
                        <BookReader key={index}>
                            <div className="flex gap-4">
                                {/* LEGACY UPDATE: Square Q Marker */}
                                <div className="flex-none w-8 h-8 bg-indigo-100 text-indigo-700 font-bold font-serif flex items-center justify-center -mt-1">
                                    Q{index + 1}
                                </div>
                                <div className="space-y-3 w-full">
                                    <div className="flex flex-wrap items-baseline gap-x-2 text-base font-semibold text-slate-900 font-serif">
                                        <span>{entry.question}</span>
                                        {Number(entry.stars) > 0 && renderStars(Math.min(5, Number(entry.stars)))}
                                    </div>
                                    <div className="bg-white/50 border-l-4 border-emerald-400 pl-4 py-2">
                                        <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Answer</span>
                                        <div className="text-slate-800">{entry.answer}</div>
                                    </div>
                                </div>
                            </div>
                        </BookReader>
                    ))}
                </div>
            );
        };
`;var aa=`
const formatDuration = (value) => {
if (value === null || value === undefined) return '';
const total = Math.floor(Number(value));
if (Number.isNaN(total)) return '';
const minutes = Math.floor(total / 60);
const seconds = total % 60;
return String(minutes) + ':' + String(seconds).padStart(2, '0');
};

const getYoutubeEmbedUrl = (url) => {
if (!url) return '';
const match = url.match(/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/)|youtu\\.be\\/)([\\w-]+)/);
return match ? 'https://www.youtube.com/embed/' + match[1] : '';
};

const getVideoSource = (video) => {
if (!video) return '';
if (video.sourceType === 'upload') return video.url || (video.fileKey ? '/api/videos/' + encodeURIComponent(video.fileKey) : '');
return video.url || '';
};

const PublicVideoPlayer = ({ video, progress, onProgress, onDuration, className }) => {
const videoRef = useRef(null);
const [playbackRate, setPlaybackRate] = useState(1.0);
const embedUrl = video?.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
const source = getVideoSource(video);
const frameClassName = className || 'w-full aspect-video rounded-md border border-slate-200';

useEffect(() => {
if (!videoRef.current) return;
const node = videoRef.current;
const handleLoaded = () => {
if (progress?.currentTime && progress.currentTime < node.duration) { node.currentTime = progress.currentTime; }
};
node.addEventListener('loadedmetadata', handleLoaded);
return () => node.removeEventListener('loadedmetadata', handleLoaded);
}, [video?.id]);

// Handle speed change
useEffect(() => {
if (videoRef.current) {
videoRef.current.playbackRate = playbackRate;
}
}, [playbackRate]);

const cycleSpeed = () => {
const rates = [1.0, 1.25, 1.5, 2.0];
const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
setPlaybackRate(rates[nextIndex]);
};

if (embedUrl) return <iframe title={video.title} src={embedUrl} className={frameClassName} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>;

return (
<div className="relative group">
<video
ref={videoRef} src={source} controls playsInline className={frameClassName + ' bg-black'}
onLoadedMetadata={(event) => {
if (onDuration) { onDuration(event.currentTarget.duration || 0); }
if (onProgress) { onProgress(event.currentTarget.currentTime || 0, event.currentTarget.duration || 0); }
}}
onTimeUpdate={(event) => { if (!onProgress) return; onProgress(event.currentTarget.currentTime, event.currentTarget.duration || 0); }}
/>
{/* Speed Control Overlay Button */}
<button 
onClick={cycleSpeed}
className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100 flex items-center gap-1"
title="Change Playback Speed"
>
<i className="fa-solid fa-gauge-high"></i>
{playbackRate}x
</button>
</div>
);
};

const PublicVideoList = ({ context, videosByItem, onBack, onNavigate, onSelectVideo }) => {
const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
const resolvedContext = context || recentVideo?.context;
const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
const [durationMap, setDurationMap] = useState({});
const resolvedBack = onBack || (resolvedContext?.backRoute ? () => onNavigate(resolvedContext.backRoute) : null);
const handleSelect = (video) => {
updateVideoProgress({
id: video.id, title: video.title, context: resolvedContext, route: 'public-video-player',
currentTime: videoProgress?.[video.id]?.currentTime || 0, duration: durationMap[video.id] || videoProgress?.[video.id]?.duration || 0
});
if (onSelectVideo) onSelectVideo(video, resolvedContext);
};
const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
const title = resolvedContext?.title || '\u09AD\u09BF\u09A1\u09BF\u0993';
const subtitle = resolvedContext?.subtitle || '';
return (
<PublicSimpleShell backgroundClass={backgroundClass} title={title} subtitle={subtitle} onBack={resolvedBack} onNavigate={onNavigate}>
<div className="space-y-4 font-bangla text-left">
<div className="text-xs uppercase tracking-[0.3em] text-slate-400">\u09AD\u09BF\u09A1\u09BF\u0993 \u09B2\u09BF\u09B8\u09CD\u099F</div>
<div className="space-y-3">
{videos.length === 0 && <div className="text-sm text-slate-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{videos.map((video) => {
const progress = videoProgress?.[video.id];
const previewUrl = getVideoSource(video);
const embedUrl = video.sourceType === 'link' ? getYoutubeEmbedUrl(video.url) : '';
const durationValue = durationMap[video.id] || progress?.duration || 0;
const durationLabel = durationValue ? formatDuration(durationValue) : 'Unavailable';
return (
<button key={video.id} onClick={() => handleSelect(video)} className="w-full text-left border-b border-slate-200 last:border-b-0 px-2 py-3 hover:bg-slate-50 transition">
<div className="flex items-start gap-3">
<div className="w-20 h-12 shrink-0">
{embedUrl ? <iframe title={video.title} src={embedUrl} className="w-20 h-12 rounded-md border border-slate-200" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> : previewUrl ? <video src={previewUrl} muted playsInline preload="metadata" className="w-20 h-12 rounded-md border border-slate-200 bg-black object-cover" onLoadedMetadata={(event) => { const nextDuration = event.currentTarget.duration || 0; setDurationMap((prev) => ({ ...prev, [video.id]: nextDuration })); }} /> : <div className="w-20 h-12 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">Preview unavailable</div>}
</div>
<div className="flex-1 space-y-1">
<div className="text-sm font-semibold text-slate-900 truncate">{video.title}</div>
<div className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Channel:</span> {video.channelName ? (video.channelUrl ? <a href={video.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">{video.channelName}</a> : video.channelName) : 'Unavailable'}</div>
<div className="text-xs text-slate-500"><span className="font-semibold text-slate-600">Duration:</span> {durationLabel}</div>
</div>
</div>
</button>
);
})}
</div>
</div>
</PublicSimpleShell>
);
};

const PublicVideoDetail = ({ context, videoId, videosByItem, onBack, onNavigate }) => {
const { videoProgress, recentVideo, updateVideoProgress } = useVideoProgress();
const resolvedContext = context || recentVideo?.context;
const videos = resolvedContext ? (videosByItem?.[resolvedContext.noteKey] || []) : [];
const fallbackVideoId = videoId || recentVideo?.id;
const activeVideo = videos.find((video) => video.id === fallbackVideoId) || videos[0];
const progress = activeVideo ? videoProgress?.[activeVideo.id] : null;
const [duration, setDuration] = useState(progress?.duration || 0);
const resolvedBack = onBack || (() => onNavigate('public-videos'));
const backgroundClass = resolvedContext?.backgroundClass || 'bg-white';
const title = resolvedContext?.title || '\u09AD\u09BF\u09A1\u09BF\u0993';
const subtitle = resolvedContext?.subtitle || '';
return (
<PublicSimpleShell backgroundClass={backgroundClass} title={title} subtitle={subtitle} onBack={resolvedBack} onNavigate={onNavigate}>
{activeVideo ? (
<div className="space-y-4 font-bangla text-left">
<div className="space-y-1">
<div className="text-base font-semibold text-slate-900">{activeVideo.title}</div>
<div className="text-sm text-slate-600"><span className="font-semibold">Channel:</span> {activeVideo.channelName ? (activeVideo.channelUrl ? <a href={activeVideo.channelUrl} target="_blank" rel="noreferrer" className="text-indigo-500">{activeVideo.channelName}</a> : activeVideo.channelName) : 'Unavailable'}</div>
<div className="text-sm text-slate-600"><span className="font-semibold">Duration:</span> {duration ? formatDuration(duration) : 'Unavailable'}</div>
</div>
<div className="flex justify-center">
<PublicVideoPlayer
video={activeVideo} progress={progress} className="w-full max-w-3xl aspect-video rounded-md border border-slate-200"
onDuration={(nextDuration) => { if (nextDuration) setDuration(nextDuration); }}
onProgress={(currentTime, nextDuration) => {
if (nextDuration) setDuration(nextDuration);
updateVideoProgress({ id: activeVideo.id, title: activeVideo.title, context: resolvedContext, route: 'public-video-player', currentTime, duration: nextDuration });
}}
/>
</div>
</div>
) : <div className="text-sm text-slate-400 font-bangla">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8\u09CB \u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
</PublicSimpleShell>
);
};
`;var ia=`
const SubjectIndexPage = ({ classLabel, subjects, onNavigate }) => {
const [activeGroup, setActiveGroup] = useState('All');
const [query, setQuery] = useState('');
const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
const { readMap } = useReadingProgress();
const isStudentRestricted = user?.role === 'student' && user?.classLabel && user.classLabel !== classLabel;
const normalizedQuery = query.trim().toLowerCase();
const groups = ['All', ...new Set(subjects.flatMap((subject) => subject.groups || []))];
const filteredSubjects = subjects.filter((subject) => {
const matchesGroup = activeGroup === 'All' || (subject.groups || []).includes(activeGroup);
const matchesQuery = !normalizedQuery || subject.title.toLowerCase().includes(normalizedQuery) || subject.subtitle.toLowerCase().includes(normalizedQuery);
return matchesGroup && matchesQuery;
});

// Collect images for visible subjects
const imageUrls = filteredSubjects.map(s => thumbnailMap[s.subjectKey]?.url);
const isReady = useImagePreloader(imageUrls);

if (isStudentRestricted) {
return (
<div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50 px-6">
<div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md text-center shadow-sm">
<div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
<i className="fa-solid fa-lock"></i>
</div>
<h2 className="text-xl font-semibold text-slate-900">Class library locked</h2>
<p className="text-sm text-slate-500 mt-2">Switch to your assigned class to explore your learning library.</p>
<button onClick={() => onNavigate('student-class')} className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg">Go to my class</button>
</div>
</div>
);
}

if (!isReady && filteredSubjects.length > 0) return <FullScreenLoader />;

return (
<div className="flex-1 bg-slate-50 min-h-screen relative">
{/* BOLD & NOTICEABLE Background Design */}
<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
{/* 1. Large Indigo Concentric Circles (Top Right) */}
<svg className="absolute -top-20 -right-20 w-[600px] h-[600px] text-indigo-100 opacity-60" viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
<circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
<circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" opacity="0.5" />
<circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.2" />
</svg>

{/* 2. Amber Geometric Constellation (Top Left) */}
<svg className="absolute top-10 left-0 w-96 h-96 text-slate-300 opacity-50" viewBox="0 0 200 200" fill="none">
<path d="M40 40 L90 20 L140 60" stroke="currentColor" strokeWidth="1.5" />
<circle cx="40" cy="40" r="3" fill="#fbbf24" />
<circle cx="90" cy="20" r="3" fill="#fbbf24" />
<circle cx="140" cy="60" r="3" fill="#fbbf24" />
<path d="M40 40 L60 120 L120 100" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
<circle cx="60" cy="120" r="2" fill="currentColor" />
<circle cx="120" cy="100" r="2" fill="currentColor" />
</svg>

{/* 3. Stylish Dot Matrix Grid (Bottom Left) */}
<div className="absolute bottom-0 left-0 w-full h-64 opacity-20" 
style={{backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
</div>

{/* 4. Floating Distinct Shapes */}
<svg className="absolute bottom-40 right-40 w-24 h-24 text-indigo-200 opacity-80 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
<path d="M12 2L2 22h20L12 2z" />
</svg>
<svg className="absolute top-1/2 left-20 w-16 h-16 text-amber-200 opacity-80" viewBox="0 0 24 24" fill="currentColor" style={{transform: 'rotate(45deg)'}}>
<rect width="24" height="24" rx="4" />
</svg>
</div>

<div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-12 relative z-10">
{/* Header Section */}
<div className="flex flex-col items-center text-center gap-4 mb-12">
<div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
Academic Library
</div>
<h2 className="text-4xl sm:text-5xl font-bold text-slate-800 font-serif relative inline-block">
{classLabel} Subjects
{/* Artistic Underline */}
<svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 text-indigo-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
<path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
</svg>
</h2>
<p className="text-base text-slate-600 mt-2 max-w-lg font-serif italic">Explore the complete collection of {classLabel} subjects, organized for your learning journey.</p>

<button onClick={() => onNavigate('landing')} className="mt-4 px-4 py-2 bg-white/80 hover:bg-white text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-full transition flex items-center gap-2 group shadow-sm backdrop-blur-sm">
<i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
Back to Home
</button>
</div>

{/* Controls Section (Search & Filter) - Floating Glass Effect */}
<div className="max-w-4xl mx-auto mb-12 bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg shadow-indigo-100/50 border border-white/50 flex flex-col sm:flex-row items-center gap-2 relative z-20">
{/* Filter Dropdown */}
<div className="w-full sm:w-1/3 relative group">
<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
<i className="fa-solid fa-filter text-indigo-400 text-xs"></i>
</div>
<select 
value={activeGroup} 
onChange={(event) => setActiveGroup(event.target.value)} 
className="w-full pl-9 pr-4 py-3 bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer appearance-none hover:bg-slate-50 transition rounded-xl"
>
{groups.map((group) => <option key={group} value={group}>{group === 'All' ? 'All Groups' : group}</option>)}
</select>
<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
<i className="fa-solid fa-chevron-down text-slate-300 text-xs"></i>
</div>
</div>

{/* Divider */}
<div className="hidden sm:block w-px h-8 bg-slate-200"></div>

{/* Search Input */}
<div className="w-full sm:w-2/3 relative">
<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
<i className="fa-solid fa-magnifying-glass text-indigo-400 text-xs"></i>
</div>
<input 
value={query} 
onChange={(event) => setQuery(event.target.value)} 
placeholder="Search for a subject..." 
className="w-full pl-9 pr-4 py-3 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 font-medium focus:outline-none" 
/>
</div>
</div>

{/* Results Count */}
<div className="mb-6 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
<span>Showing {filteredSubjects.length} Results</span>
</div>

{/* Cards Grid - Using Flex Wrap for better Portrait Card fit */}
<div className="flex flex-wrap justify-center gap-6 sm:gap-8 pb-12">
{filteredSubjects.map((subject) => {
const thumbnail = thumbnailMap[subject.subjectKey];
const lastRead = getLastReadForSubject(readMap, subject.title);
return (
<div key={subject.subjectKey} className="flex-none">
<SubjectCard 
subject={{ ...subject, lastRead, thumbnailUrl: thumbnail?.url }} 
onNavigate={onNavigate} 
className={cardWidthClass} 
showGroup 
/>
</div>
);
})}

{/* Empty State */}
{filteredSubjects.length === 0 && (
<div className="w-full py-20 text-center bg-white/50 rounded-3xl border border-dashed border-slate-200">
<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
<i className="fa-regular fa-face-frown text-2xl"></i>
</div>
<h3 className="text-lg font-semibold text-slate-900">No subjects found</h3>
<p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query.</p>
</div>
)}
</div>
</div>
</div>
);
};
`;var na=`
const StudentLanding = ({ onNavigate }) => {
const [quoteIndex, setQuoteIndex] = useState(0);
const [quickQuery, setQuickQuery] = useState('');
const thumbnailMap = useThumbnails('/api/thumbnails', 'subjectKey');
const { readMap } = useReadingProgress();
const isStudent = user?.role === 'student';
const studentClass = user?.classLabel;
const allowedClass = isStudent && (studentClass === 'SSC' || studentClass === 'HSC') ? studentClass : null;
const showSsc = !allowedClass || allowedClass === 'SSC';
const showHsc = !allowedClass || allowedClass === 'HSC';
const scopedSscSubjects = showSsc ? sscSubjects : [];
const scopedHscSubjects = showHsc ? hscSubjects : [];
const scopedSscFeatured = showSsc ? sscFeaturedSubjects : [];
const scopedHscFeatured = showHsc ? hscFeaturedSubjects : [];

// Collect all images we need to show
const allSubjects = [...scopedSscFeatured, ...scopedHscFeatured];
const imageUrls = allSubjects.map(s => thumbnailMap[s.subjectKey]?.url);
const isReady = useImagePreloader(imageUrls, { eagerCount: 6, maxWaitMs: 900 });

useEffect(() => {
const timer = setInterval(() => { setQuoteIndex((prev) => (prev + 1) % quoteItems.length); }, 9000);
return () => clearInterval(timer);
}, []);

const activeQuote = quoteItems[quoteIndex];

const normalizedQuickQuery = quickQuery.trim().toLowerCase();
const buildQuickSearchEntries = () => {
const entries = [];
const addEntry = (entry) => entries.push(entry);
const addContentEntries = ({ noteKey, parentLabel, onSelect, videoContext }) => {
const notes = (notesByItem || {})[noteKey] || [];
const normalizeNoteText = (note) => typeof note === 'string' ? note : (note?.text || note?.note || '');
notes.forEach((note, index) => {
const noteText = normalizeNoteText(note);
if (!noteText) return;
addEntry({ type: 'Content', title: noteText, subtitle: parentLabel + ' \u2022 Note ' + (index + 1), keywords: [noteText, parentLabel, 'note', 'content'].join(' '), onSelect });
});
const videos = (videosByItem || {})[noteKey] || [];
videos.forEach((video) => {
addEntry({
type: 'Video', title: video.title, subtitle: parentLabel + ' \u2022 Video', keywords: [video.title, parentLabel, 'video'].join(' '),
onSelect: () => { setSelectedVideoContext({ ...videoContext, noteKey }); setSelectedVideoId(video.id); onNavigate('public-video-player'); }
});
});
};

[...scopedSscSubjects, ...scopedHscSubjects].forEach((subject) => {
if (!subject.route) return;
addEntry({ type: 'Subject', title: subject.title, subtitle: subject.classLabel + ' \u2022 ' + subject.groupLabel, keywords: [subject.title, subject.subtitle, subject.classLabel, subject.groupLabel].join(' '), onSelect: () => onNavigate(subject.route) });
});

const scienceConfigs = [
...(showSsc ? [
{ classLabel: 'SSC', subjectLabel: 'Physics', chapters: sscPhysicsChapters, listRoute: 'public-ssc-physics-topics', topicRoute: 'public-ssc-physics-topic' },
{ classLabel: 'SSC', subjectLabel: 'Chemistry', chapters: sscChemistryChapters, listRoute: 'public-ssc-chemistry-topics', topicRoute: 'public-ssc-chemistry-topic' },
{ classLabel: 'SSC', subjectLabel: 'Biology', chapters: sscBiologyChapters, listRoute: 'public-ssc-biology-topics', topicRoute: 'public-ssc-biology-topic' },
{ classLabel: 'SSC', subjectLabel: 'Bangladesh and Global Studies', chapters: sscBangladeshGlobalChapters, listRoute: 'public-ssc-bangladesh-global-studies-topics', topicRoute: 'public-ssc-bangladesh-global-studies-topic' }
] : []),
...(showHsc ? [
{ classLabel: 'HSC', subjectLabel: 'Physics 1st Paper', chapters: hscPhysics1stChapters, listRoute: 'public-hsc-physics-1st-topics', topicRoute: 'public-hsc-physics-1st-topic' },
{ classLabel: 'HSC', subjectLabel: 'Physics 2nd Paper', chapters: hscPhysics2ndChapters, listRoute: 'public-hsc-physics-2nd-topics', topicRoute: 'public-hsc-physics-2nd-topic' },
{ classLabel: 'HSC', subjectLabel: 'Chemistry 1st Paper', chapters: hscChemistry1stChapters, listRoute: 'public-hsc-chemistry-1st-topics', topicRoute: 'public-hsc-chemistry-1st-topic' },
{ classLabel: 'HSC', subjectLabel: 'Chemistry 2nd Paper', chapters: hscChemistry2ndChapters, listRoute: 'public-hsc-chemistry-2nd-topics', topicRoute: 'public-hsc-chemistry-2nd-topic' },
{ classLabel: 'HSC', subjectLabel: 'Biology 1st Paper', chapters: hscBiology1stChapters, listRoute: 'public-hsc-biology-1st-topics', topicRoute: 'public-hsc-biology-1st-topic' },
{ classLabel: 'HSC', subjectLabel: 'Biology 2nd Paper', chapters: hscBiology2ndChapters, listRoute: 'public-hsc-biology-2nd-topics', topicRoute: 'public-hsc-biology-2nd-topic' },
{ classLabel: 'HSC', subjectLabel: 'Information and Communication Technology', chapters: hscIctChapters, listRoute: 'public-hsc-ict-topics', topicRoute: 'public-hsc-ict-topic', questionKey: 'ICT' }
] : [])
];

scienceConfigs.forEach((config) => {
(config.chapters || []).forEach((chapter) => {
addEntry({
type: 'Chapter', title: chapter.name, subtitle: config.subjectLabel + ' \u2022 ' + config.classLabel, keywords: [chapter.name, config.subjectLabel, config.classLabel, 'chapter'].join(' '),
onSelect: () => { setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: config.classLabel, subjectLabel: config.subjectLabel, questionKey: config.questionKey }); setSelectedScienceTopic(null); onNavigate(config.listRoute); }
});
(chapter.topics || []).forEach((topic) => {
const topicKey = getScienceTopicKey(chapter.id, topic.id);
const noteKey = [config.classLabel, config.subjectLabel, topicKey].join('-');
const topicAction = () => { setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: config.classLabel, subjectLabel: config.subjectLabel, questionKey: config.questionKey }); setSelectedScienceTopic(topic); onNavigate(config.topicRoute); };
const parentLabel = topic.name + ' \u2022 ' + chapter.name;
addEntry({ type: 'Topic', title: topic.name, subtitle: config.subjectLabel + ' \u2022 ' + chapter.name, keywords: [topic.name, chapter.name, config.subjectLabel, 'topic'].join(' '), onSelect: topicAction });
addContentEntries({ noteKey, parentLabel, onSelect: topicAction, videoContext: { title: topic.name, subtitle: chapter.name, backRoute: config.topicRoute, backgroundClass: 'bg-[#ecfdf3]' } });
});
});
});

if (showSsc) (sscIctChapters || []).forEach((chapter) => {
addEntry({
type: 'Chapter', title: chapter.name, subtitle: 'ICT \u2022 SSC', keywords: [chapter.name, 'ICT', 'SSC', 'chapter'].join(' '),
onSelect: () => { setSelectedIctChapter(chapter); setSelectedIctClass('SSC'); onNavigate('public-ssc-ict-mcq'); }
});
});

if (showSsc) religionOptions.forEach((option) => {
const chapters = (sscReligionChapters || {})[option.key] || [];
chapters.forEach((chapter) => {
addEntry({
type: 'Chapter', title: chapter.name, subtitle: option.label + ' \u2022 Religion', keywords: [chapter.name, option.label, option.subtitle, 'religion', 'chapter'].join(' '),
onSelect: () => { setSelectedReligion(option); setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: 'SSC', subjectLabel: 'Religion and Moral Education', religionKey: option.key }); setSelectedScienceTopic(null); onNavigate('public-ssc-religion-topics'); }
});
(chapter.topics || []).forEach((topic) => {
const topicKey = getScienceTopicKey(chapter.id, topic.id);
const noteKey = ['SSC', getReligionSubjectKey(option), topicKey].join('-');
const topicAction = () => { setSelectedReligion(option); setSelectedScienceChapter(chapter); setSelectedScienceSubject({ classLabel: 'SSC', subjectLabel: 'Religion and Moral Education', religionKey: option.key }); setSelectedScienceTopic(topic); onNavigate('public-ssc-religion-topic'); };
const parentLabel = topic.name + ' \u2022 ' + chapter.name;
addEntry({ type: 'Topic', title: topic.name, subtitle: option.label + ' \u2022 ' + chapter.name, keywords: [topic.name, chapter.name, option.label, 'religion', 'topic'].join(' '), onSelect: topicAction });
addContentEntries({ noteKey, parentLabel, onSelect: topicAction, videoContext: { title: topic.name, subtitle: chapter.name, backRoute: 'public-ssc-religion-topic', backgroundClass: 'bg-[#ecfdf3]' } });
});
});
});

const addBanglaItems = (classLabel, categoryLabel, items, itemRoute) => {
(items || []).forEach((item) => {
const itemName = typeof item === 'string' ? item : item.name;
const label = typeof item === 'string' ? categoryLabel : item.type;
if (!itemName || !label) return;
const noteKey = [classLabel, label, itemName].join('-');
const itemAction = () => { storeBanglaSelection({ classLabel, categoryName: label, itemName }); setSelectedBanglaItem(itemName); setSelectedBanglaCategory(label); onNavigate(itemRoute); };
const parentLabel = itemName + ' \u2022 ' + label;
addEntry({ type: 'Content', title: itemName, subtitle: classLabel + ' Bangla \u2022 ' + label, keywords: [itemName, label, classLabel, 'bangla', 'content'].join(' '), onSelect: itemAction });
addContentEntries({ noteKey, parentLabel, onSelect: itemAction, videoContext: { title: itemName, subtitle: label, backRoute: itemRoute, backgroundClass: 'bg-[#fff7ed]' } });
});
};
if (showSsc) {
addBanglaItems('SSC', '\u0997\u09A6\u09CD\u09AF', sscGoddoItems, 'public-bangla-ssc-item');
addBanglaItems('SSC', '\u09AA\u09A6\u09CD\u09AF', sscPoddoItems, 'public-bangla-ssc-item');
addBanglaItems('SSC', '\u09B8\u09B9\u09AA\u09BE\u09A0', sscShohopathItems, 'public-bangla-ssc-item');
}
if (showHsc) {
addBanglaItems('HSC', '\u0997\u09A6\u09CD\u09AF', hscGoddoItems, 'public-bangla-hsc-item');
addBanglaItems('HSC', '\u09AA\u09A6\u09CD\u09AF', hscPoddoItems, 'public-bangla-hsc-item');
addBanglaItems('HSC', '\u09B8\u09B9\u09AA\u09BE\u09A0', hscShohopathItems, 'public-bangla-hsc-item');
}
return entries;
};

const quickResults = normalizedQuickQuery ? buildQuickSearchEntries().filter((entry) => { const haystack = (entry.keywords || entry.title || '').toLowerCase(); return haystack.includes(normalizedQuickQuery); }).slice(0, 10) : [];
const countTopics = (chapters) => (chapters || []).reduce((total, chapter) => total + (chapter?.topics?.length || 0), 0);
const countEntries = (store) => Object.values(store || {}).reduce((total, value) => total + (Array.isArray(value) ? value.length : 0), 0);
const religionChapters = Object.values(sscReligionChapters || {}).flat();
const chapterPools = [sscPhysicsChapters, sscChemistryChapters, sscBiologyChapters, sscBangladeshGlobalChapters, sscIctChapters, hscPhysics1stChapters, hscPhysics2ndChapters, hscChemistry1stChapters, hscChemistry2ndChapters, hscBiology1stChapters, hscBiology2ndChapters, hscIctChapters, religionChapters];
const totalSubjects = scopedSscSubjects.length + scopedHscSubjects.length;
const totalChapters = chapterPools.reduce((sum, pool) => sum + (pool || []).length, 0);
const totalTopics = chapterPools.reduce((sum, pool) => sum + countTopics(pool || []), 0);
const totalNotes = countEntries(notesByItem);
const totalVideos = countEntries(videosByItem);
const totalQuestions = countEntries(mcqQuestions) + countEntries(srijonshilQuestions) + countEntries(englishQuestions);
const handleQuickSelect = (entry) => { if (!entry?.onSelect) return; entry.onSelect(); };

if (!isReady) return <FullScreenLoader />;

return (
<div className="flex-1 bg-white">
{/* Style to hide scrollbars for the academic section */}
<style>{\`
.hide-scrollbars *::-webkit-scrollbar { display: none !important; }
.hide-scrollbars * { -ms-overflow-style: none; scrollbar-width: none; }
\`}</style>

<section className="border-b border-slate-200 bg-white">
<div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative z-10">
<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
<div className="flex items-center gap-4">
<div className="w-14 h-14 rounded-md bg-white border border-slate-200 flex items-center justify-center">
<svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 9.5L12 5l8.5 4.5L12 14 3.5 9.5z" /><path d="M6.5 11.2V16c0 .7.4 1.4 1.1 1.7C9 18.4 10.4 19 12 19s3-.6 4.4-1.3c.7-.3 1.1-1 1.1-1.7v-4.8" /><path d="M20.5 9.7V14" /><path d="M21.5 14h-2" /></svg>
</div>
<div><div className="text-3xl sm:text-4xl font-semibold text-slate-900">Freeducation</div><div className="text-sm text-slate-500 uppercase tracking-[0.2em] mt-1">Serve education with clarity</div></div>
</div>
<div className="max-w-xl text-slate-700">
<p className="text-base sm:text-lg font-serif italic leading-relaxed opacity-90">\u201C{activeQuote.text}\u201D</p>
<p className="text-sm font-semibold opacity-80 mt-2">\u2014 {activeQuote.author}</p>
</div>
</div>
<div className="mt-8">
<div className="relative">
<label className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Quick Search</label>
<input value={quickQuery} onChange={(event) => setQuickQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && quickResults[0]) { handleQuickSelect(quickResults[0]); } }} placeholder="Search subjects, chapters, topics, notes, videos..." className="mt-2 w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200" />
<i className="fa-solid fa-magnifying-glass absolute left-4 top-[calc(50%+12px)] -translate-y-1/2 text-slate-400"></i>
{normalizedQuickQuery && (
<div className="absolute left-0 right-0 mt-2 z-[100] rounded-lg border border-slate-200 bg-white text-slate-700 max-h-72 overflow-y-auto shadow-2xl">
{quickResults.length === 0 && <div className="px-4 py-3 text-sm text-slate-400 text-left">No matches found.</div>}
{quickResults.map((entry, index) => (
<button key={entry.title + '-' + entry.type + '-' + index} onClick={() => handleQuickSelect(entry)} className="w-full text-left px-4 py-3 hover:bg-slate-50 transition">
<div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{entry.type}</div>
<div className="text-sm font-semibold text-slate-900">{entry.title}</div>
{entry.subtitle && <div className="text-xs text-slate-500 mt-1">{entry.subtitle}</div>}
</button>
))}
</div>
)}
</div>
</div>
</div>
</section>

<section className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
<div className="border border-slate-200 p-4">
<div className="text-xs uppercase tracking-[0.2em] text-slate-500">Learning overview</div>
<div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Subjects</div>
<div className="text-lg font-semibold text-slate-900">{totalSubjects}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Chapters</div>
<div className="text-lg font-semibold text-slate-900">{totalChapters}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Topics</div>
<div className="text-lg font-semibold text-slate-900">{totalTopics}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Questions</div>
<div className="text-lg font-semibold text-slate-900">{totalQuestions}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Notes</div>
<div className="text-lg font-semibold text-slate-900">{totalNotes}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Videos</div>
<div className="text-lg font-semibold text-slate-900">{totalVideos}</div>
</div>
</div>
</div>
</section>

{/* Academic Section with Styled Background & No Scrollbars */}
<section className="relative w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-6 bg-white z-0 hide-scrollbars overflow-hidden">

{/* Styled Header Section */}
<div className="relative z-10 mb-12 text-center">
<h2 className="text-3xl sm:text-4xl font-bold text-slate-800 font-serif tracking-tight">
<span className="relative inline-block">
Academic Courses
<span className="absolute -bottom-2 left-0 w-full h-1.5 bg-indigo-500 rounded-full opacity-20"></span>
</span>
</h2>
<p className="mt-4 text-slate-500 max-w-lg mx-auto text-base">Select your class level below to explore subjects, chapters, and resources.</p>
</div>

{/* Content */}
<div className="relative z-10">
{allowedClass ? (
<SubjectRow title={allowedClass} subjects={allowedClass === 'SSC' ? scopedSscFeatured : scopedHscFeatured} onNavigate={onNavigate} onAll={() => onNavigate(allowedClass === 'SSC' ? 'ssc-subjects' : 'hsc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
) : (
<>
<SubjectRow title="SSC" subjects={scopedSscFeatured} onNavigate={onNavigate} onAll={() => onNavigate('ssc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
<div className="h-10"></div>
<SubjectRow title="HSC" subjects={scopedHscFeatured} onNavigate={onNavigate} onAll={() => onNavigate('hsc-subjects')} thumbnailMap={thumbnailMap} readMap={readMap} />
</>
)}
{isStudent && studentClass && !allowedClass && (
<div className="mt-10 bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
Academic content for this class level is coming soon. Keep your profile updated for new updates.
</div>
)}
</div>
</section>
</div>
);
};
`;var oa=`
        return {
            StudentLanding,
            StudentRegister, // <--- ADDED THIS
            SubjectIndexPage,
            PublicBanglaShell,
            PublicBanglaTopicGrid,
            PublicBanglaTextList,
            PublicBanglaShohopathList,
            PublicBanglaItemDetail,
            PublicBanglaSrijonshilDetail,
            PublicBanglaMcqDetail,
            PublicIctShell,
            PublicIctChapterList,
            PublicIctMcqDetail,
            PublicScienceShell,
            PublicScienceChapterList,
            PublicScienceTopicList,
            PublicScienceTopicDetail,
            PublicScienceCqDetail,
            PublicScienceMcqDetail,
            PublicVideoList,
            PublicVideoDetail,
            PublicReligionOptionList,
            PublicEnglishShell,
            PublicEnglishCardGrid,
            PublicEnglishTypeList,
            PublicEnglishQuestionList,
            sscSubjects,
            hscSubjects,
            religionOptions
        };
        })();
        
        // Destructure it here too so the View can see it
        const {
            StudentLanding, StudentRegister, SubjectIndexPage, PublicBanglaShell, PublicBanglaTopicGrid, PublicBanglaTextList,
            PublicBanglaShohopathList, PublicBanglaItemDetail, PublicBanglaSrijonshilDetail, PublicBanglaMcqDetail,
            PublicIctShell, PublicIctChapterList, PublicIctMcqDetail, PublicScienceShell, PublicScienceChapterList,
            PublicScienceTopicList, PublicScienceTopicDetail, PublicScienceCqDetail, PublicScienceMcqDetail,
            PublicVideoList, PublicVideoDetail, PublicReligionOptionList, PublicEnglishShell, PublicEnglishCardGrid,
            PublicEnglishTypeList, PublicEnglishQuestionList, sscSubjects, hscSubjects, religionOptions
        } = LandingModule;
`;var ra=`
const StudentRegister = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', classLabel: 'SSC', groupLabel: 'Science' });
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegisterRequest = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/student/register-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setStep(2);
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (e) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndCreate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('/api/student/register-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, code: otp })
            });
            const data = await res.json();
            if (data.success) {
                alert('Account Created Successfully! Please Login.');
                onNavigate('login');
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch (e) {
            setError('Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-1">Join Freeducation for free</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}

                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Full Name</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Email</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="student@example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Password</label>
                            <input className="w-full mt-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                                type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="********" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Class</label>
                                <select className="w-full mt-1 p-3 border border-slate-200 rounded-lg bg-white"
                                    value={formData.classLabel} onChange={e => {
                                        const nextClass = e.target.value;
                                        setFormData({
                                            ...formData,
                                            classLabel: nextClass,
                                            groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? formData.groupLabel : ''
                                        });
                                    }}>
                                    <option value="SSC">SSC</option>
                                    <option value="HSC">HSC</option>
                                    <option value="6">Class 6</option>
                                    <option value="7">Class 7</option>
                                    <option value="8">Class 8</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Group</label>
                                <select className="w-full mt-1 p-3 border border-slate-200 rounded-lg bg-white"
                                    value={formData.groupLabel} onChange={e => setFormData({...formData, groupLabel: e.target.value})} disabled={!(formData.classLabel === 'SSC' || formData.classLabel === 'HSC')}>
                                    <option value="Science">Science</option>
                                    <option value="Humanities">Humanities</option>
                                    <option value="Business Studies">Business</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleRegisterRequest} disabled={isLoading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg shadow-indigo-200">
                            {isLoading ? 'Sending OTP...' : 'Continue'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Check your Email</h3>
                            <p className="text-sm text-slate-500 mt-1">We sent a code to {formData.email}</p>
                        </div>
                        <input className="w-full text-center text-3xl tracking-[0.5em] font-bold p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none" 
                            maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" />
                        
                        <button onClick={handleVerifyAndCreate} disabled={isLoading} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition shadow-lg shadow-emerald-200">
                            {isLoading ? 'Verifying...' : 'Verify & Create Account'}
                        </button>
                        <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 underline">Wrong email?</button>
                    </div>
                )}
                
                <div className="mt-6 text-center border-t border-slate-100 pt-4">
                    <p className="text-sm text-slate-500">Already have an account? <button onClick={() => onNavigate('login')} className="text-indigo-600 font-semibold hover:underline">Login</button></p>
                </div>
            </div>
        </div>
    );
};
`;var ne=`
        const LandingModule = (() => {
`+Js+Zs+ea+ta+sa+aa+ia+na+ra+oa;var Ye=`
        const AuthForm = ({ mode, onSubmit, onNavigate }) => {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const [error, setError] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                setIsLoading(true);
                setError('');
                try {
                    await onSubmit({ username, password });
                } catch (err) {
                    setError('Authentication failed. Please check your credentials.');
                } finally {
                    setIsLoading(false);
                }
            };

            return (
                <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                                <i className={mode === 'login' ? "fa-solid fa-lock" : "fa-solid fa-user-plus"}></i>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                            <p className="text-sm text-slate-500 mt-2">
                                {mode === 'login' ? 'Please sign in to continue.' : 'Join us to start learning.'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                                <div className="text-sm text-red-600">{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
                                    {mode === 'login' ? 'Email or Username' : 'Username'}
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder={mode === 'login' ? "Enter your email" : "Choose a username"}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                                )}
                            </button>
                        </form>

                        {mode === 'login' && (
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-sm text-slate-500">
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={() => onNavigate('student-register')} 
                                        className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                                    >
                                        Create Free Student Account
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        };
`;var Xe=`
const SetupView = ({ onNavigate }) => {
const [adminName, setAdminName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [successMessage, setSuccessMessage] = useState('');

useEffect(() => {
const checkStatus = async () => {
try {
const res = await fetch('/api/system/status');
const data = await res.json();
if (data.initialized) {
onNavigate('login', { replace: true });
}
} catch (err) {
setError('Unable to verify system status.');
}
};
checkStatus();
}, []);

const handleSubmit = async (e) => {
e.preventDefault();
if (password !== confirmPassword) {
setError('Passwords do not match.');
return;
}
setIsLoading(true);
setError('');
try {
const res = await fetch('/api/system/init', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ adminName, email, password, confirmPassword })
});
const data = await res.json();
if (!data.success) {
setError(data.error || 'Setup failed.');
return;
}
setSuccessMessage('Setup Complete! Redirecting...');
setTimeout(() => {
window.location.href = '/admin/dashboard';
}, 1200);
} catch (err) {
setError('Setup failed. Please try again.');
} finally {
setIsLoading(false);
}
};

return (
<div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
<div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
<div className="text-center mb-8">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
<i className="fa-solid fa-screwdriver-wrench"></i>
</div>
<h2 className="text-2xl font-bold text-slate-900">First Run Setup</h2>
<p className="text-sm text-slate-500 mt-2">Create your admin account to get started.</p>
</div>

{error && (
<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
<i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
<div className="text-sm text-red-600">{error}</div>
</div>
)}

{successMessage && (
<div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
<i className="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i>
<div className="text-sm text-emerald-600">{successMessage}</div>
</div>
)}

<form onSubmit={handleSubmit} className="space-y-5">
<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Name</label>
<input
type="text"
value={adminName}
onChange={(e) => setAdminName(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="Enter admin name"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Email</label>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="admin@example.com"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Admin Password</label>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
required
/>
</div>

<div>
<label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Confirm Password</label>
<input
type="password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
required
/>
</div>

<button
type="submit"
disabled={isLoading}
className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
{isLoading ? (
<>
<i className="fa-solid fa-circle-notch fa-spin"></i>
<span>Setting up...</span>
</>
) : (
<span>Complete Setup</span>
)}
</button>
</form>
</div>
</div>
);
};
`,ca=`
{view === 'setup' && <SetupView onNavigate={navigate} />}
`;var la=`
        const resizeImageFile = (file, { maxWidth = 400, maxHeight = 500, quality = 0.7 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) { resolve(file); return; }
                
                // If it's not an image, don't touch it
                if (!file.type.startsWith('image/')) { resolve(file); return; }

                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                
                image.onload = () => {
                    // Calculate new size keeping aspect ratio
                    let targetWidth = image.width;
                    let targetHeight = image.height;

                    if (targetWidth > maxWidth || targetHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
                        targetWidth = Math.round(targetWidth * ratio);
                        targetHeight = Math.round(targetHeight * ratio);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { URL.revokeObjectURL(objectUrl); resolve(file); return; }
                    
                    // smooth drawing
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    
                    canvas.toBlob((blob) => {
                        URL.revokeObjectURL(objectUrl);
                        if (!blob) { resolve(file); return; }
                        
                        // Create new file with same name but .jpg extension (efficient compression)
                        const baseName = file.name.replace(/\\.[^/.]+$/, '') || 'thumbnail';
                        resolve(new File([blob], \`\${baseName}.jpg\`, { type: 'image/jpeg' }));
                    }, 'image/jpeg', quality);
                };
                
                image.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
                image.src = objectUrl;
            });

        const useThumbnailMap = (url, keyField) => {
            const [thumbnailMap, setThumbnailMap] = useState({});
            useEffect(() => {
                let isActive = true;
                const loadThumbnails = async () => {
                    try {
                        const response = await fetch(url);
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const map = (data.thumbnails || []).reduce((acc, item) => {
                            acc[item[keyField]] = { url: item.url };
                            return acc;
                        }, {});
                        setThumbnailMap(map);
                    } catch (error) { console.warn('Failed to load thumbnails', error); }
                };
                loadThumbnails();
                return () => { isActive = false; };
            }, [url, keyField]);
            return [thumbnailMap, setThumbnailMap];
        };

        const dashboardViewOptions = [
            { key: 'card', label: 'Card' },
            { key: 'list', label: 'List' }
        ];

        const useDashboardViewPreference = (initial = 'card') => {
            const [viewMode, setViewMode] = useState(initial);
            const [profileId, setProfileId] = useState(null);

            useEffect(() => {
                const cached = localStorage.getItem('dashboard_view');
                if (cached === 'card' || cached === 'list') {
                    setViewMode(cached);
                }
            }, []);

            useEffect(() => {
                let isActive = true;
                const token = localStorage.getItem('auth_token');
                if (!token) return undefined;
                const loadPreference = async () => {
                    try {
                        const response = await fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } });
                        if (!response.ok) return;
                        const data = await response.json();
                        if (!isActive) return;
                        const profile = data.profile || {};
                        if (profile.id) {
                            setProfileId(profile.id);
                            const cached = localStorage.getItem('dashboard_view_' + profile.id);
                            const resolved = cached || profile.dashboardView;
                            if (resolved === 'card' || resolved === 'list') {
                                setViewMode(resolved);
                            }
                            if (profile.dashboardView === 'card' || profile.dashboardView === 'list') {
                                localStorage.setItem('dashboard_view_' + profile.id, profile.dashboardView);
                                localStorage.setItem('dashboard_view', profile.dashboardView);
                            }
                        }
                    } catch (error) {
                        console.warn('Failed to load dashboard view preference', error);
                    }
                };
                loadPreference();
                return () => { isActive = false; };
            }, []);

            const updateViewMode = async (nextMode) => {
                if (nextMode !== 'card' && nextMode !== 'list') return;
                setViewMode(nextMode);
                const key = profileId ? 'dashboard_view_' + profileId : 'dashboard_view';
                localStorage.setItem(key, nextMode);
                localStorage.setItem('dashboard_view', nextMode);
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                try {
                    await fetch('/api/profile', {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ dashboardView: nextMode })
                    });
                } catch (error) {
                    console.warn('Failed to save dashboard view preference', error);
                }
            };

            return { viewMode, setViewMode: updateViewMode, viewOptions: dashboardViewOptions };
        };
`;var da=`
const ThumbnailUploadModal = ({ title, description, uploadUrl, keyField, itemKey, existingUrl, onSaved, onClose }) => {
const [file, setFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState('');
const [status, setStatus] = useState(null);
const [isSaving, setIsSaving] = useState(false);
const canSave = Boolean(file || existingUrl);

useEffect(() => {
if (!file) return undefined;
const nextUrl = URL.createObjectURL(file);
setPreviewUrl(nextUrl);
return () => { URL.revokeObjectURL(nextUrl); };
}, [file]);

const handleSave = async () => {
setStatus(null);
const token = localStorage.getItem('auth_token');
if (!token) { setStatus('You must be logged in to upload thumbnails.'); return; }
setIsSaving(true);
try {
const formData = new FormData();
formData.append(keyField, itemKey);
if (file) { formData.append('file', file); }
const response = await fetch(uploadUrl, {
method: 'POST',
headers: { Authorization: 'Bearer ' + token },
body: formData
});
const data = await response.json();
if (!response.ok || !data.success) { setStatus(data.error || 'Upload failed.'); }
else {
onSaved(data.thumbnail);
setStatus('Thumbnail saved.');
setFile(null);
setPreviewUrl('');
}
} catch (error) { setStatus('Upload failed. Please try again.'); }
finally { setIsSaving(false); }
};

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
<div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
<div className="px-6 py-4 border-b border-gray-200">
<div className="text-xs uppercase tracking-[0.3em] text-gray-400">Thumbnail</div>
<div className="text-lg font-semibold text-gray-900 mt-2">{title}</div>
{description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
</div>
<div className="p-4 space-y-4">
<div className="relative w-32 sm:w-40 aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm mx-auto">
{previewUrl || existingUrl ? (
<img src={previewUrl || existingUrl} alt={title} className="w-full h-full object-cover" />
) : (
<div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs uppercase tracking-[0.3em]"><span>No thumbnail</span></div>
)}
</div>
<div>
<label className="text-xs uppercase tracking-[0.3em] text-gray-400">Upload image</label>
<input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setFile(null); return; } const resized = await resizeImageFile(selected); setFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-xs" />
</div>
{status && <div className="text-sm text-gray-500">{status}</div>}
</div>
<div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
<button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Close</button>
<button onClick={handleSave} disabled={!canSave || isSaving} className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.3em] bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60">{isSaving ? 'Saving...' : 'Save thumbnail'}</button>
</div>
</div>
</div>
);
};

const VideoManager = ({ noteKey, videosByItem, onUpdateVideos }) => {
const [isModalOpen, setIsModalOpen] = useState(false);
const [formState, setFormState] = useState({ title: '', sourceType: 'link', url: '', file: null, channelName: '', channelUrl: '', duration: '' });
const videos = (videosByItem || {})[noteKey] || [];
const formatDuration = (value) => {
if (value === null || value === undefined) return '';
const total = Math.floor(Number(value));
if (Number.isNaN(total)) return '';
const minutes = Math.floor(total / 60);
const seconds = total % 60;
return String(minutes) + ':' + String(seconds).padStart(2, '0');
};
const resetForm = () => { setFormState({ title: '', sourceType: 'link', url: '', file: null, channelName: '', channelUrl: '', duration: '' }); };
const handleSave = async () => {
const trimmedTitle = formState.title.trim();
if (!trimmedTitle) return;
let url = formState.url.trim();
let fileKey = '';
if (formState.sourceType === 'upload') {
const token = localStorage.getItem('auth_token');
if (!token || !(formState.file instanceof File)) return;
const formData = new FormData();
formData.append('file', formState.file);
const response = await fetch('/api/videos', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (!response.ok || !data.success) return;
url = data.url;
fileKey = data.fileKey;
}
if (!url) return;
const nextEntry = { id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2), title: trimmedTitle, sourceType: formState.sourceType, url, fileKey, channelName: formState.channelName.trim(), channelUrl: formState.channelUrl.trim(), duration: formState.duration.trim() };
if (onUpdateVideos) { onUpdateVideos((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; current.push(nextEntry); return { ...prev, [noteKey]: current }; }); }
setIsModalOpen(false);
resetForm();
};
const handleRemove = (entryId) => { if (!onUpdateVideos) return; onUpdateVideos((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; return { ...prev, [noteKey]: current.filter((entry) => entry.id !== entryId) }; }); };

return (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
<div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
<div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09AD\u09BF\u09A1\u09BF\u0993</div><div className="text-sm font-semibold text-gray-700 mt-1">\u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u09AC\u09BE \u09B2\u09BF\u0982\u0995 \u09A6\u09BF\u09A8</div></div>
<button onClick={() => setIsModalOpen(true)} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">\u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>
</div>
<div className="divide-y">
{videos.length === 0 && <div className="px-4 py-3 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{videos.map((video) => (
<div key={video.id} className="px-4 py-3 flex items-center justify-between gap-3">
<div className="space-y-1">
<div className="text-sm font-semibold text-gray-900">{video.title}</div>
<div className="text-xs text-gray-500">{video.channelName && <span>{video.channelName}</span>}{video.duration && <span className="ml-2">Duration: {video.duration}</span>}</div>
{video.channelUrl && <a href={video.channelUrl} className="text-xs text-blue-500" target="_blank" rel="noreferrer">{video.channelUrl}</a>}
</div>
<button onClick={() => handleRemove(video.id)} className="px-2 py-1 rounded-md border border-red-100 text-red-500 text-xs hover:bg-red-50 transition">Remove</button>
</div>
))}
</div>
{isModalOpen && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">\u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</h3>
<p className="text-sm text-gray-500 mt-1">\u09AD\u09BF\u09A1\u09BF\u0993 \u09AB\u09BE\u0987\u09B2 \u0986\u09AA\u09B2\u09CB\u09A1 \u0995\u09B0\u09C1\u09A8 \u0985\u09A5\u09AC\u09BE \u09B2\u09BF\u0982\u0995 \u09A6\u09BF\u09A8\u0964</p>
<div className="mt-4 space-y-3">
<input value={formState.title} onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))} placeholder="\u09AD\u09BF\u09A1\u09BF\u0993 \u09B6\u09BF\u09B0\u09CB\u09A8\u09BE\u09AE" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
<div className="flex gap-3 text-xs font-semibold">
{['link', 'upload'].map((type) => (
<button key={type} onClick={() => setFormState((prev) => ({ ...prev, sourceType: type, duration: type === 'link' ? '' : prev.duration }))} className={'px-3 py-2 rounded-lg border ' + (formState.sourceType === type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600')}>{type === 'link' ? '\u09B2\u09BF\u0982\u0995' : '\u0986\u09AA\u09B2\u09CB\u09A1'}</button>
))}
</div>
{formState.sourceType === 'link' ? (
<input value={formState.url} onChange={(event) => setFormState((prev) => ({ ...prev, url: event.target.value }))} placeholder="\u09AD\u09BF\u09A1\u09BF\u0993 \u09B2\u09BF\u0982\u0995" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
) : (
<input type="file" accept="video/*" onChange={(event) => { const selected = event.target.files?.[0] || null; setFormState((prev) => ({ ...prev, file: selected, duration: '' })); if (!selected) return; const previewUrl = URL.createObjectURL(selected); const video = document.createElement('video'); video.preload = 'metadata'; video.src = previewUrl; video.onloadedmetadata = () => { const nextDuration = formatDuration(video.duration); setFormState((prev) => ({ ...prev, duration: nextDuration })); URL.revokeObjectURL(previewUrl); }; }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
)}
<input value={formState.channelName} onChange={(event) => setFormState((prev) => ({ ...prev, channelName: event.target.value }))} placeholder="\u099A\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u09A8\u09BE\u09AE (\u0990\u099A\u09CD\u099B\u09BF\u0995)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
<input value={formState.channelUrl} onChange={(event) => setFormState((prev) => ({ ...prev, channelUrl: event.target.value }))} placeholder="\u099A\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u09B2\u09BF\u0982\u0995 (\u0990\u099A\u09CD\u099B\u09BF\u0995)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
</div>
<div className="mt-5 flex justify-end gap-2">
<button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
<button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button>
</div>
</div>
</div>
)}
</div>
);
};

const DashboardViewToggle = ({ viewMode, onChange, options = dashboardViewOptions }) => (
<div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs font-semibold">
{options.map((option) => (
<button key={option.key} onClick={() => onChange(option.key)} className={'px-3 py-1 rounded-md transition ' + (viewMode === option.key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50')}>{option.label}</button>
))}
</div>
);
`;var pa=`
const SrijonshilTypeList = ({ classLabel, itemName, onSelectType, onNavigate, itemRoute, questionRoute, title, subtitle }) => {
const resolvedItemRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
const resolvedQuestionRoute = questionRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-questions' : 'bangla-hsc-srijonshil-questions');
const types = [
{ key: 'gyan', label: '\u099C\u09CD\u099E\u09BE\u09A8 (\u0995)', description: '\u099C\u09CD\u099E\u09BE\u09A8\u09AE\u09C2\u09B2\u0995 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' },
{ key: 'onudhabon', label: '\u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8 (\u0996)', description: '\u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8\u09AE\u09C2\u09B2\u0995 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' },
{ key: 'scenario', label: '\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09AE\u09BE\u09B2\u09BE (\u0997/\u0998)', description: '\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993\u09B8\u09B9 \u0997 \u0993 \u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' }
];
return (
<AdminShell title={title || '\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'} subtitle={subtitle || \`\${itemName} \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964\`} activeTab="classes" onNavigate={onNavigate}>
<div className="flex justify-between items-center font-bangla">
<button onClick={() => onNavigate(resolvedItemRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
</div>
<div className="mt-4 grid card-grid-gap sm:grid-cols-2 font-bangla">
{types.map((type) => (
<button key={type.key} onClick={() => { onSelectType(type); onNavigate(resolvedQuestionRoute); }} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition">
<div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A7\u09B0\u09A3</div><div className="text-lg font-semibold text-gray-900 mt-2">{type.label}</div><p className="text-sm text-gray-500 mt-2">{type.description}</p>
</button>
))}
</div>
</AdminShell>
);
};

const SrijonshilQuestionList = ({ classLabel, itemName, typeLabel, questions, onAdd, onUpdate, onDelete, onNavigate, typeRoute }) => {
const resolvedTypeRoute = typeRoute || (classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types');
const isScenarioType = typeLabel?.includes('\u0997') || typeLabel?.includes('\u0998') || typeLabel?.includes('\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09AE\u09BE\u09B2\u09BE');
const [isModalOpen, setIsModalOpen] = useState(false);
const [showScenarioForm, setShowScenarioForm] = useState(false);
const [questionInput, setQuestionInput] = useState('');
const [answerInput, setAnswerInput] = useState('');
const [scenarioInput, setScenarioInput] = useState('');
const [questionGInput, setQuestionGInput] = useState('');
const [answerGInput, setAnswerGInput] = useState('');
const [questionGhInput, setQuestionGhInput] = useState('');
const [answerGhInput, setAnswerGhInput] = useState('');
const [starRating, setStarRating] = useState(0);
const [starRatingG, setStarRatingG] = useState(0);
const [starRatingGh, setStarRatingGh] = useState(0);
const [editingIndex, setEditingIndex] = useState(null);
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const resetForm = () => {
setQuestionInput('');
setAnswerInput('');
setScenarioInput('');
setQuestionGInput('');
setAnswerGInput('');
setQuestionGhInput('');
setAnswerGhInput('');
setStarRating(0);
setStarRatingG(0);
setStarRatingGh(0);
setEditingIndex(null);
};
const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
const handleSave = () => {
const trimmedQuestion = questionInput.trim();
const trimmedAnswer = answerInput.trim();
const trimmedScenario = scenarioInput.trim();
const trimmedQuestionG = questionGInput.trim();
const trimmedAnswerG = answerGInput.trim();
const trimmedQuestionGh = questionGhInput.trim();
const trimmedAnswerGh = answerGhInput.trim();
if (isScenarioType) {
if (!trimmedScenario || !trimmedQuestionG || !trimmedAnswerG || !trimmedQuestionGh || !trimmedAnswerGh) return;
const payload = {
scenario: trimmedScenario,
questionG: trimmedQuestionG,
answerG: trimmedAnswerG,
questionGh: trimmedQuestionGh,
answerGh: trimmedAnswerGh,
starsG: normalizeStars(starRatingG),
starsGh: normalizeStars(starRatingGh)
};
if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
} else {
if (!trimmedQuestion || !trimmedAnswer) return;
const payload = { question: trimmedQuestion, answer: trimmedAnswer, stars: normalizeStars(starRating) };
if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
}
resetForm();
if (isScenarioType) { setShowScenarioForm(false); } else { setIsModalOpen(false); }
};
if (isScenarioType && showScenarioForm) {
return (
<AdminShell title={typeLabel} subtitle={\`\${itemName} \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u0997 \u0993 \u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964\`} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
<button onClick={() => { setShowScenarioForm(false); resetForm(); }} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => onNavigate(resolvedTypeRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Types</button>
</div>
<div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? '\u09A8\u09A4\u09C1\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' : '\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993, \u0997 \u098F\u09AC\u0982 \u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3\u09AD\u09BE\u09AC\u09C7 \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993</label><textarea value={scenarioInput} onChange={(event) => setScenarioInput(event.target.value)} placeholder="\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[140px]" /></div>
<div className="mt-4 grid gap-4 sm:grid-cols-2">
<div>
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label>
<textarea value={questionGInput} onChange={(event) => setQuestionGInput(event.target.value)} placeholder="\u0997 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[110px]" />
<label className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-3 block">\u0997 \u0989\u09A4\u09CD\u09A4\u09B0</label>
<textarea value={answerGInput} onChange={(event) => setAnswerGInput(event.target.value)} placeholder="\u0997 \u0989\u09A4\u09CD\u09A4\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[110px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997 \u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setStarRatingG(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRatingG === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRatingG(star)} className={star <= starRatingG ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
</div>
<div>
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label>
<textarea value={questionGhInput} onChange={(event) => setQuestionGhInput(event.target.value)} placeholder="\u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[110px]" />
<label className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-3 block">\u0998 \u0989\u09A4\u09CD\u09A4\u09B0</label>
<textarea value={answerGhInput} onChange={(event) => setAnswerGhInput(event.target.value)} placeholder="\u0998 \u0989\u09A4\u09CD\u09A4\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[110px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0998 \u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setStarRatingGh(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRatingGh === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRatingGh(star)} className={star <= starRatingGh ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
</div>
</div>
<div className="mt-6 flex justify-end gap-2">
<button onClick={() => { setShowScenarioForm(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
<button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button>
</div>
</div>
</AdminShell>
);
}
return (
<AdminShell title={typeLabel} subtitle={\`\${itemName} \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964\`} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
<button onClick={() => onNavigate(resolvedTypeRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => { resetForm(); if (isScenarioType) { setShowScenarioForm(true); } else { setIsModalOpen(true); } }} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>
</div>
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{questions.map((entry, index) => (
<div key={\`\${entry.question || entry.scenario || 'entry'}-\${index}\`} className="px-5 py-4">
<div className="flex flex-wrap gap-3 items-start justify-between">
<div className="flex-1">
{entry.scenario ? (
<div className="space-y-3 text-sm text-gray-700">
<div className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993</div>
<div className="text-sm font-semibold text-gray-800 whitespace-pre-wrap">{entry.scenario}</div>
<div className="space-y-3">
<div>
<div className="font-semibold text-gray-800">\u0997. {entry.questionG}</div>
{Number(entry.starsG) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(entry.starsG)))}</div>}
<details className="mt-2 text-sm text-gray-600"><summary className="cursor-pointer text-blue-600">\u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8</summary><div className="mt-2 border-l-2 border-blue-100 pl-3 text-gray-700 whitespace-pre-wrap">{entry.answerG}</div></details>
</div>
<div>
<div className="font-semibold text-gray-800">\u0998. {entry.questionGh}</div>
{Number(entry.starsGh) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(entry.starsGh)))}</div>}
<details className="mt-2 text-sm text-gray-600"><summary className="cursor-pointer text-blue-600">\u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8</summary><div className="mt-2 border-l-2 border-blue-100 pl-3 text-gray-700 whitespace-pre-wrap">{entry.answerGh}</div></details>
</div>
</div>
</div>
) : (
<>
<div className="text-sm font-semibold text-gray-800">{toBanglaNumber(index + 1)}. {entry.question}</div>
{Number(entry.stars) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(entry.stars)))}</div>}
<details className="mt-2 text-sm text-gray-600"><summary className="cursor-pointer text-blue-600">\u0989\u09A4\u09CD\u09A4\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8</summary><div className="mt-2 border-l-2 border-blue-100 pl-3 text-gray-700 whitespace-pre-wrap">{entry.answer}</div></details>
</>
)}
</div>
<div className="flex items-center gap-2 text-xs font-semibold">
<button onClick={() => {
setEditingIndex(index);
if (entry.scenario) {
setScenarioInput(entry.scenario || '');
setQuestionGInput(entry.questionG || '');
setAnswerGInput(entry.answerG || '');
setQuestionGhInput(entry.questionGh || '');
setAnswerGhInput(entry.answerGh || '');
setStarRatingG(normalizeStars(entry.starsG));
setStarRatingGh(normalizeStars(entry.starsGh));
setShowScenarioForm(true);
} else {
setQuestionInput(entry.question || '');
setAnswerInput(entry.answer || '');
setStarRating(normalizeStars(entry.stars));
setIsModalOpen(true);
}
}} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
<button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
</div>
</div>
</div>
))}
</div>
{isModalOpen && !isScenarioType && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? '\u09A8\u09A4\u09C1\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' : '\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8'}</h3>
{isScenarioType ? (
<>
<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993</label><textarea value={scenarioInput} onChange={(event) => setScenarioInput(event.target.value)} placeholder="\u09B8\u09BF\u09A8\u09BE\u09B0\u09BF\u0993 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]" /></div>
<div className="mt-4 grid gap-4 sm:grid-cols-2">
<div>
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label>
<textarea value={questionGInput} onChange={(event) => setQuestionGInput(event.target.value)} placeholder="\u0997 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]" />
<label className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-3 block">\u0997 \u0989\u09A4\u09CD\u09A4\u09B0</label>
<textarea value={answerGInput} onChange={(event) => setAnswerGInput(event.target.value)} placeholder="\u0997 \u0989\u09A4\u09CD\u09A4\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997 \u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setStarRatingG(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRatingG === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRatingG(star)} className={star <= starRatingG ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
</div>
<div>
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label>
<textarea value={questionGhInput} onChange={(event) => setQuestionGhInput(event.target.value)} placeholder="\u0998 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]" />
<label className="text-xs uppercase tracking-[0.2em] text-gray-400 mt-3 block">\u0998 \u0989\u09A4\u09CD\u09A4\u09B0</label>
<textarea value={answerGhInput} onChange={(event) => setAnswerGhInput(event.target.value)} placeholder="\u0998 \u0989\u09A4\u09CD\u09A4\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0998 \u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setStarRatingGh(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRatingGh === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRatingGh(star)} className={star <= starRatingGh ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
</div>
</div>
</>
) : (
<>
<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label><textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]" /></div>
<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0989\u09A4\u09CD\u09A4\u09B0</label><textarea value={answerInput} onChange={(event) => setAnswerInput(event.target.value)} placeholder="\u0989\u09A4\u09CD\u09A4\u09B0 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[100px]" /></div>
</>
)}
{!isScenarioType && (
<div className="mt-4">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC (\u09B8\u09CD\u099F\u09BE\u09B0)</label>
<div className="mt-2 flex items-center gap-2">
<button onClick={() => setStarRating(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRating === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRating(star)} className={star <= starRating ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
)}
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
</AdminShell>
);
};

const McqQuestionList = ({ classLabel, itemName, questions, onAdd, onUpdate, onDelete, onNavigate, itemRoute }) => {
const backRoute = itemRoute || (classLabel === 'SSC' ? 'bangla-ssc-item' : 'bangla-hsc-item');
const [isModalOpen, setIsModalOpen] = useState(false);
const [questionInput, setQuestionInput] = useState('');
const [optionsInput, setOptionsInput] = useState(['', '', '', '']);
const [answerIndex, setAnswerIndex] = useState(0);
const [starRating, setStarRating] = useState(0);
const [editingIndex, setEditingIndex] = useState(null);
const optionLabels = ['\u0995', '\u0996', '\u0997', '\u0998'];
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const resetForm = () => { setQuestionInput(''); setOptionsInput(['', '', '', '']); setAnswerIndex(0); setStarRating(0); setEditingIndex(null); };
const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
const renderStars = (value) => (
<div className="flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</div>
);
const handleSave = () => {
const trimmedQuestion = questionInput.trim();
const trimmedOptions = optionsInput.map((option) => option.trim());
if (!trimmedQuestion || trimmedOptions.some((option) => !option)) return;
const payload = { question: trimmedQuestion, options: trimmedOptions, answerIndex, stars: normalizeStars(starRating) };
if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
resetForm(); setIsModalOpen(false);
};
return (
<AdminShell title="\u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0" subtitle={\`\${itemName} \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 MCQ \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964\`} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
<button onClick={() => onNavigate(backRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">MCQ \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>
</div>
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 MCQ \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{questions.map((entry, index) => (
<div key={\`\${entry.question}-\${index}\`} className="px-5 py-4">
<div className="flex flex-wrap gap-3 items-start justify-between">
<div className="flex-1">
<div className="text-sm font-semibold text-gray-800">{toBanglaNumber(index + 1)}. {entry.question}</div>
{normalizeStars(entry.stars) > 0 && <div className="mt-1">{renderStars(normalizeStars(entry.stars))}</div>}
<div className="mt-2 grid gap-1 text-sm text-gray-600">{entry.options.map((option, optionIndex) => (<div key={\`\${option}-\${optionIndex}\`}>{optionLabels[optionIndex]}. {option}</div>))}</div>
<div className="mt-2 text-sm text-gray-700">\u0989\u09A4\u09CD\u09A4\u09B0: {optionLabels[entry.answerIndex]}\u0964 {entry.options[entry.answerIndex]}</div>
</div>
<div className="flex items-center gap-2 text-xs font-semibold">
<button onClick={() => { setEditingIndex(index); setQuestionInput(entry.question); setOptionsInput(entry.options); setAnswerIndex(entry.answerIndex); setStarRating(normalizeStars(entry.stars)); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
<button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 MCQ \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
</div>
</div>
</div>
))}
</div>
{isModalOpen && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-4 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? '\u09A8\u09A4\u09C1\u09A8 MCQ \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' : 'MCQ \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8'}</h3>
<div className="mt-3"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8</label><textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="\u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8" className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[60px]" /></div>
<div className="mt-3 grid gap-2 sm:grid-cols-2">{optionsInput.map((option, optionIndex) => (<div key={\`option-\${optionIndex}\`} className="flex flex-col gap-1"><label className="text-[10px] uppercase tracking-[0.2em] text-gray-400">\u0985\u09AA\u09B6\u09A8 {optionLabels[optionIndex]}</label><input value={option} onChange={(event) => { const nextOptions = [...optionsInput]; nextOptions[optionIndex] = event.target.value; setOptionsInput(nextOptions); }} placeholder={\`\u0985\u09AA\u09B6\u09A8 \${optionLabels[optionIndex]}\`} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" /></div>))}</div>
<div className="mt-3"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09A0\u09BF\u0995 \u0989\u09A4\u09CD\u09A4\u09B0</label><div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">{optionLabels.map((label, optionIndex) => (<label key={label} className="flex items-center gap-2"><input type="radio" name="mcq-answer" checked={answerIndex === optionIndex} onChange={() => setAnswerIndex(optionIndex)} />{label}</label>))}</div></div>
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC (\u09B8\u09CD\u099F\u09BE\u09B0)</label>
<div className="mt-2 flex items-center gap-2">
<button onClick={() => setStarRating(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRating === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setStarRating(star)} className={star <= starRating ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
</AdminShell>
);
};
`;var ua=`
        const AdminDashboard = ({ onNavigate }) => {
            const [classes, setClasses] = useState([]);
            const [loading, setLoading] = useState(true);
            const [dashboard, setDashboard] = useState(null);
            const allowedClasses = ['SSC', 'HSC'];

            const fetchDashboard = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setLoading(false); return; }
                try {
                    const response = await fetch('/api/dashboard/admin', { headers: { Authorization: 'Bearer ' + token } });
                    const data = await response.json();
                    if (data.success) {
                        setDashboard(data);
                    }
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            };

            const fetchClasses = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { return; }
                try {
                    const response = await fetch('/api/classes', { headers: { 'Authorization': 'Bearer ' + token } });
                    const data = await response.json();
                    if (data.success) { setClasses(data.classes || []); }
                } catch (error) {}
            };

            useEffect(() => { fetchDashboard(); fetchClasses(); }, []);

            const allowedLookup = new Set(allowedClasses.map((name) => name.toUpperCase()));
            const filteredClasses = classes.filter((item) => allowedLookup.has(String(item.name || '').toUpperCase()));

            const getClassRoute = (name) => {
                const upper = String(name || '').toUpperCase();
                if (upper === 'SSC') return 'admin-groups-ssc';
                if (upper === 'HSC') return 'admin-groups-hsc';
                return null;
            };

            const stats = dashboard?.stats || { totalUsers: 0, admins: 0, teachers: 0, students: 0, classes: 0, recentEdits: 0, thumbnails: 0, fonts: 0 };
            const onboarding = dashboard?.onboarding || { teachersWithoutAssignment: 0, studentsWithoutProfiles: 0, studentsMissingDetails: 0 };
            const formatDate = (value) => {
                if (!value) return 'N/A';
                const parsed = new Date(value);
                return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
            };

            return (
                <AdminShell activeTab="classes" onNavigate={onNavigate}>
                    <div className="space-y-6">
                        <section className="border border-slate-200 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Overview</div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Total users</div>
                                    <div className="text-lg font-semibold text-slate-900">{stats.totalUsers}</div>
                                    <div className="text-[11px] text-slate-500">Admins {stats.admins} • Teachers {stats.teachers} • Students {stats.students}</div>
                                </div>
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Active classes</div>
                                    <div className="text-lg font-semibold text-slate-900">{stats.classes}</div>
                                    <div className="text-[11px] text-slate-500">Curriculum panels available</div>
                                </div>
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Content edits (7 days)</div>
                                    <div className="text-lg font-semibold text-slate-900">{stats.recentEdits}</div>
                                    <div className="text-[11px] text-slate-500">Latest change log</div>
                                </div>
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Media library</div>
                                    <div className="text-lg font-semibold text-slate-900">{stats.thumbnails + stats.fonts}</div>
                                    <div className="text-[11px] text-slate-500">Thumbnails {stats.thumbnails} • Fonts {stats.fonts}</div>
                                </div>
                            </div>
                        </section>

                        <section className="border border-slate-200 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Onboarding watchlist</div>
                                <button onClick={() => onNavigate('admin-users')} className="text-xs font-semibold text-indigo-600">Manage users</button>
                            </div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Teachers without assignments</div>
                                    <div className="text-lg font-semibold text-slate-900">{onboarding.teachersWithoutAssignment}</div>
                                </div>
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Students without profiles</div>
                                    <div className="text-lg font-semibold text-slate-900">{onboarding.studentsWithoutProfiles}</div>
                                </div>
                                <div className="border border-slate-200 p-3">
                                    <div className="text-xs text-slate-500">Students missing details</div>
                                    <div className="text-lg font-semibold text-slate-900">{onboarding.studentsMissingDetails}</div>
                                </div>
                            </div>
                        </section>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <section className="border border-slate-200 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent activity</div>
                                {loading && <div className="mt-3 text-sm text-slate-400">Loading activity...</div>}
                                {!loading && (dashboard?.recentEdits || []).length === 0 && (
                                    <div className="mt-3 text-sm text-slate-500">No edits logged yet.</div>
                                )}
                                <div className="mt-3 space-y-3">
                                    {(dashboard?.recentEdits || []).map((entry, index) => (
                                        <div key={entry.action + '-' + index} className="border border-slate-200 p-3 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="font-semibold text-slate-800">{entry.action}</div>
                                                <div className="text-xs text-slate-500">{formatDate(entry.createdAt)}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{entry.user?.name} • {entry.user?.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="border border-slate-200 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">New accounts</div>
                                {loading && <div className="mt-3 text-sm text-slate-400">Loading users...</div>}
                                {!loading && (dashboard?.recentUsers || []).length === 0 && (
                                    <div className="mt-3 text-sm text-slate-500">No user registrations yet.</div>
                                )}
                                <div className="mt-3 space-y-3">
                                    {(dashboard?.recentUsers || []).map((entry, index) => (
                                        <div key={entry.id || index} className="border border-slate-200 p-3 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="font-semibold text-slate-800">{entry.name}</div>
                                                <div className="text-xs text-slate-500">{formatDate(entry.createdAt)}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{entry.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <section className="border border-slate-200 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Class panels</div>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {filteredClasses.map((item) => {
                                    const route = getClassRoute(item.name);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => route && onNavigate(route)}
                                            className="border border-slate-200 p-3 text-left text-sm hover:border-indigo-200 hover:text-indigo-600 transition"
                                        >
                                            <div className="font-semibold text-slate-900">{item.name}</div>
                                            <div className="text-xs text-slate-500">Open curriculum and subject management.</div>
                                        </button>
                                    );
                                })}
                                {filteredClasses.length === 0 && !loading && (
                                    <div className="text-sm text-slate-500">No classes configured yet.</div>
                                )}
                            </div>
                        </section>
                    </div>
                </AdminShell>
            );
        };
`;var ma=`
const AdminGroupSelection = ({ classLabel, onNavigate }) => {
const groups = [
{ title: 'Science', description: 'Physics, Chemistry, Biology' },
{ title: 'Humanities', description: 'Arts, Social Science' },
{ title: 'Business Studies', description: 'Commerce, Finance' }
];

const getGroupRoute = (groupTitle) => {
const base = String(classLabel || '').toLowerCase();
const groupKey = String(groupTitle || '').toLowerCase().replace(/\\s+/g, '-');
return \`admin-\${base}-\${groupKey}\`;
};

// Legacy Academic Colors
const getBgColor = (title) => {
const t = title.toLowerCase();
if (t.includes('science')) return 'bg-[#1e3a8a]'; // Navy Blue
if (t.includes('humanities')) return 'bg-[#7c2d12]'; // Sienna/Rust
if (t.includes('business')) return 'bg-[#14532d]'; // Forest Green
return 'bg-slate-700';
};

return (
<AdminShell activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-col items-center justify-center py-8 fade-in">

{/* Back Button */}
<div className="w-full max-w-4xl flex justify-start mb-4">
<button onClick={() => onNavigate('dashboard')} className="text-stone-500 hover:text-stone-800 font-serif italic flex items-center gap-2 transition-colors">
<i className="fa-solid fa-arrow-left text-xs"></i> Back to Dashboard
</button>
</div>

{/* Legacy Headline */}
<div className="text-center mb-12">
<h2 className="text-3xl sm:text-4xl font-black text-stone-800 font-serif tracking-tight uppercase mb-3">
Class {classLabel} Groups
</h2>
<div className="h-1 w-16 bg-stone-800 mx-auto opacity-20"></div>
</div>

{/* Compact Legacy Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl px-4">
{groups.map((group) => {
const bgClass = getBgColor(group.title);
return (
<button 
key={group.title} 
onClick={() => onNavigate(getGroupRoute(group.title))} 
className={\`relative group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl \${bgClass}\`}
>
<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

<div className="relative p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px]">
<div className="font-serif italic text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-2">DIVISION</div>
<div className="text-2xl font-bold text-white font-serif mb-1">{group.title}</div>
<div className="h-px w-8 bg-white/30 my-3"></div>
<p className="text-slate-500 text-xs font-serif italic opacity-80">{group.description}</p>
</div>
</button>
);
})}
</div>
</div>
</AdminShell>
);
};

const AdminGroupDetail = ({ classLabel, groupLabel, onNavigate, canManageThumbnails }) => {
const subjectMap = {
SSC: {
Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'],
Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'],
'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education']
},
HSC: {
Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper', 'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'],
Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper', 'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper', 'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'],
'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper', 'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper', 'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper', 'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper']
}
};
const [subjectThumbnails, setSubjectThumbnails] = useThumbnailMap('/api/thumbnails', 'subjectKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const subjects = subjectMap[classLabel]?.[groupLabel] || [];
const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
const banglaRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
const englishRoute = classLabel === 'HSC' ? 'english-hsc-1st-paper' : null;
const ictRoute = classLabel === 'SSC' ? 'admin-ssc-ict' : null;
const hscIctRoute = classLabel === 'HSC' ? 'admin-hsc-ict' : null;
const bangladeshGlobalRoute = classLabel === 'SSC' ? 'admin-ssc-bangladesh-global-studies' : null;
const religionRoute = classLabel === 'SSC' ? 'admin-ssc-religion' : null;
const physicsRoute = classLabel === 'SSC' ? 'admin-ssc-physics' : null;
const chemistryRoute = classLabel === 'SSC' ? 'admin-ssc-chemistry' : null;
const biologyRoute = classLabel === 'SSC' ? 'admin-ssc-biology' : null;
const hscPhysics1Route = classLabel === 'HSC' ? 'admin-hsc-physics-1st' : null;
const hscPhysics2Route = classLabel === 'HSC' ? 'admin-hsc-physics-2nd' : null;
const hscChem1Route = classLabel === 'HSC' ? 'admin-hsc-chemistry-1st' : null;
const hscChem2Route = classLabel === 'HSC' ? 'admin-hsc-chemistry-2nd' : null;
const hscBio1Route = classLabel === 'HSC' ? 'admin-hsc-biology-1st' : null;
const hscBio2Route = classLabel === 'HSC' ? 'admin-hsc-biology-2nd' : null;

return (
<AdminShell activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-col items-center justify-center py-4 fade-in">
<div className="w-full max-w-6xl flex flex-wrap gap-3 justify-between items-center mb-8">
<button onClick={() => onNavigate(groupRoute)} className="text-stone-500 hover:text-stone-800 font-serif italic flex items-center gap-2 transition-colors">
<i className="fa-solid fa-arrow-left text-xs"></i> Back to Groups
</button>
<div className="flex flex-wrap items-center gap-3">
<div className="text-stone-400 font-serif italic text-sm">{classLabel} \u2022 {groupLabel}</div>
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
</div>
</div>

{subjects.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No subjects configured.</div>}

{subjects.length > 0 && (
viewMode === 'card' ? (
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full max-w-6xl justify-items-center">
{subjects.map((subject) => {
const isBanglaFirst = subject === 'Bangla 1st Paper';
const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
const isIct = subject === 'Information and Communication Technology';
const isPhysics = subject === 'Physics' && classLabel === 'SSC';
const isChemistry = subject === 'Chemistry' && classLabel === 'SSC';
const isBiology = subject === 'Biology' && classLabel === 'SSC';
const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
const isHscChem1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
const isHscChem2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
const isHscBio1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
const isHscBio2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';

const displayLabel = isBanglaFirst ? '\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0' : isIct ? '\u0986\u0987\u09B8\u09BF\u099F\u09BF' : subject;
const route = isBanglaFirst ? banglaRoute : isEnglishFirst ? englishRoute : isIct ? (classLabel === 'SSC' ? ictRoute : hscIctRoute) : isBangladeshGlobal ? bangladeshGlobalRoute : isReligionMoral ? religionRoute : isPhysics ? physicsRoute : isChemistry ? chemistryRoute : isBiology ? biologyRoute : isHscPhysics1 ? hscPhysics1Route : isHscPhysics2 ? hscPhysics2Route : isHscChem1 ? hscChem1Route : isHscChem2 ? hscChem2Route : isHscBio1 ? hscBio1Route : hscBio2Route;
const subjectKey = makeThumbnailKey(subject, classLabel);
const thumbnailUrl = subjectThumbnails[subjectKey]?.url;
const canOpen = Boolean(route);

return (
<div key={subject} className="group w-full max-w-[150px] aspect-[1/1.618] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-200 bg-stone-900 flex flex-col">
<div className="p-2 flex flex-col gap-2">
<div>
<div className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Subject</div>
<h3 className={\`text-white font-semibold leading-tight mt-1 \${isBanglaFirst ? 'font-bangla text-sm' : 'text-[11px]'}\`}>{displayLabel}</h3>
</div>
<div className="flex gap-2">
<button onClick={() => route && onNavigate(route)} disabled={!canOpen} className={\`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded text-center transition-colors \${canOpen ? 'bg-white/90 text-stone-900 hover:bg-white' : 'bg-white/10 text-stone-400 cursor-not-allowed'}\`}>{canOpen ? 'Open' : 'Locked'}</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: subject, subjectKey })} className="w-7 h-7 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded border border-white/10 transition-colors"><i className="fa-solid fa-camera text-[10px]"></i></button>}
</div>
</div>
<div className="relative flex-1 bg-stone-800 border-t border-stone-700">
{thumbnailUrl ? (
<img src={thumbnailUrl} alt={subject} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
) : (
<div className="absolute inset-0 flex items-center justify-center bg-stone-800">
<i className="fa-solid fa-book text-stone-700 text-3xl"></i>
</div>
)}
</div>
</div>
);
})}
</div>
) : (
<div className="w-full max-w-6xl bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{subjects.map((subject) => {
const isBanglaFirst = subject === 'Bangla 1st Paper';
const isEnglishFirst = subject === 'English 1st Paper' && classLabel === 'HSC';
const isIct = subject === 'Information and Communication Technology';
const isPhysics = subject === 'Physics' && classLabel === 'SSC';
const isChemistry = subject === 'Chemistry' && classLabel === 'SSC';
const isBiology = subject === 'Biology' && classLabel === 'SSC';
const isBangladeshGlobal = subject === 'Bangladesh and Global Studies' && classLabel === 'SSC';
const isReligionMoral = subject === 'Religion and Moral Education' && classLabel === 'SSC';
const isHscPhysics1 = subject === 'Physics 1st Paper' && classLabel === 'HSC';
const isHscPhysics2 = subject === 'Physics 2nd Paper' && classLabel === 'HSC';
const isHscChem1 = subject === 'Chemistry 1st Paper' && classLabel === 'HSC';
const isHscChem2 = subject === 'Chemistry 2nd Paper' && classLabel === 'HSC';
const isHscBio1 = subject === 'Biology 1st Paper' && classLabel === 'HSC';
const isHscBio2 = subject === 'Biology 2nd Paper' && classLabel === 'HSC';
const displayLabel = isBanglaFirst ? '\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0' : isIct ? '\u0986\u0987\u09B8\u09BF\u099F\u09BF' : subject;
const route = isBanglaFirst ? banglaRoute : isEnglishFirst ? englishRoute : isIct ? (classLabel === 'SSC' ? ictRoute : hscIctRoute) : isBangladeshGlobal ? bangladeshGlobalRoute : isReligionMoral ? religionRoute : isPhysics ? physicsRoute : isChemistry ? chemistryRoute : isBiology ? biologyRoute : isHscPhysics1 ? hscPhysics1Route : isHscPhysics2 ? hscPhysics2Route : isHscChem1 ? hscChem1Route : isHscChem2 ? hscChem2Route : isHscBio1 ? hscBio1Route : hscBio2Route;
const subjectKey = makeThumbnailKey(subject, classLabel);
const thumbnailUrl = subjectThumbnails[subjectKey]?.url;
const canOpen = Boolean(route);
return (
<div key={subject} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">
{thumbnailUrl ? <img src={thumbnailUrl} alt={subject} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}
</div>
<div className="text-left">
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">Subject</div>
<div className={\`text-sm font-semibold text-gray-900 mt-1 \${isBanglaFirst ? 'font-bangla' : ''}\`}>{displayLabel}</div>
</div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
<button onClick={() => route && onNavigate(route)} disabled={!canOpen} className={\`px-2 py-1 rounded-md border border-gray-200 transition \${canOpen ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed'}\`}>{canOpen ? 'Open' : 'Locked'}</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: subject, subjectKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
</div>
</div>
);
})}
</div>
)
)}

{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a subject thumbnail for public cards." uploadUrl="/api/thumbnails" keyField="subjectKey" itemKey={activeThumbnail.subjectKey} existingUrl={subjectThumbnails[activeThumbnail.subjectKey]?.url} onSaved={(thumbnail) => { setSubjectThumbnails((prev) => ({ ...prev, [thumbnail.subjectKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</div>
</AdminShell>
);
};
`;var ha=`
const BanglaFirstPaperTopics = ({ classLabel, onNavigate, canManageThumbnails }) => {
const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const subjectLabel = 'Bangla 1st Paper';
const topics = [{ title: '\u09AC\u09BE\u0982\u09B2\u09BE \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF', description: '\u0997\u09A6\u09CD\u09AF \u0993 \u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9', route: classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto', active: true, thumbnailKey: 'shahitto' }, { title: '\u09B8\u09B9\u09AA\u09BE\u09A0', description: '\u09A8\u09BE\u099F\u0995 \u0993 \u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AA\u09BE\u09A0', route: classLabel === 'SSC' ? 'bangla-ssc-shohopath' : 'bangla-hsc-shohopath', active: true, thumbnailKey: 'shohopath' }];
return (
<AdminShell title="\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0" subtitle={\`\${classLabel} \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09B0 \u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964\`} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center">
<div className="flex flex-wrap items-center gap-2">
<button onClick={() => onNavigate(groupRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
</div>
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{topics.map((topic) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={topic.title} className={'w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col ' + (topic.active ? 'text-gray-700' : 'text-gray-300')}>
<div className="p-2 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09AC\u09BF\u09B7\u09DF</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{topic.title}</div>
<p className="text-xs text-gray-500 mt-1">{topic.description}</p>
</div>
<div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
<button onClick={() => topic.active && topic.route && onNavigate(topic.route)} className={'px-2 py-1 rounded-md border border-gray-200 transition ' + (topic.active ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed')} disabled={!topic.active}>Open</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: topic.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={topic.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{topics.map((topic) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, topic.thumbnailKey);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={topic.title} className={'w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold transition ' + (topic.active ? 'text-gray-700' : 'text-gray-300')}>
<div className="flex items-center gap-3">
<div className="w-10 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={topic.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<div className="text-left"><div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09AC\u09BF\u09B7\u09DF</div><div className="text-sm font-semibold text-gray-900 mt-1">{topic.title}</div><p className="text-xs text-gray-500 mt-1">{topic.description}</p></div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
<button onClick={() => topic.active && topic.route && onNavigate(topic.route)} className={'px-2 py-1 rounded-md border border-gray-200 transition ' + (topic.active ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 cursor-not-allowed')} disabled={!topic.active}>Open</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: topic.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
</div>
</div>
);
})}
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a category thumbnail for Bangla 1st Paper." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const BanglaShahitto = ({ classLabel, onNavigate, canManageThumbnails }) => {
const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
const goddoRoute = classLabel === 'SSC' ? 'bangla-ssc-goddo' : 'bangla-hsc-goddo';
const poddoRoute = classLabel === 'SSC' ? 'bangla-ssc-poddo' : 'bangla-hsc-poddo';
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const subjectLabel = 'Bangla 1st Paper';
const categoryCards = [{ title: '\u0997\u09A6\u09CD\u09AF', description: '\u0997\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9', route: goddoRoute, thumbnailKey: 'goddo' }, { title: '\u09AA\u09A6\u09CD\u09AF', description: '\u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9', route: poddoRoute, thumbnailKey: 'poddo' }];
return (
<AdminShell title="\u09AC\u09BE\u0982\u09B2\u09BE \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF" subtitle="\u0997\u09A6\u09CD\u09AF \u0993 \u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center">
<div className="flex flex-wrap items-center gap-2">
<button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
</div>
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{categoryCards.map((card) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, card.thumbnailKey);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={card.title} className="w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-2 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09A7\u09BE\u09B0\u09BE</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{card.title}</div>
<p className="text-xs text-gray-500 mt-1">{card.description}</p>
</div>
<div className="mt-auto flex items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onNavigate(card.route)} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Open</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: card.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{categoryCards.map((card) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, card.thumbnailKey);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={card.title} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-10 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<div className="text-left"><div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09A7\u09BE\u09B0\u09BE</div><div className="text-sm font-semibold text-gray-900 mt-1">{card.title}</div><p className="text-xs text-gray-500 mt-1">{card.description}</p></div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onNavigate(card.route)} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Open</button>
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: card.title, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
</div>
</div>
);
})}
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a category thumbnail for Bangla literature." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const BanglaShohopath = ({ classLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate, canManageStructure, canManageThumbnails }) => {
const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [newItemName, setNewItemName] = useState('');
const [newItemType, setNewItemType] = useState('\u09A8\u09BE\u099F\u0995');
const [editingItem, setEditingItem] = useState(null);
const [thumbnailFile, setThumbnailFile] = useState(null);
const typeOptions = ['\u09A8\u09BE\u099F\u0995', '\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8'];
const subjectLabel = 'Bangla 1st Paper';
const resetForm = () => { setNewItemName(''); setNewItemType('\u09A8\u09BE\u099F\u0995'); setEditingItem(null); setThumbnailFile(null); };
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const handleSave = async () => {
const trimmed = newItemName.trim();
if (!trimmed) return;
const token = localStorage.getItem('auth_token');
const uploadThumbnail = async (chapterKey) => {
if (!thumbnailFile || !token) return;
const formData = new FormData();
formData.append('chapterKey', chapterKey);
formData.append('file', thumbnailFile);
const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
};
if (editingItem) {
onUpdateItem(editingItem.id, { name: trimmed, type: newItemType });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingItem.id + '-\u09B8\u09B9\u09AA\u09BE\u09A0');
await uploadThumbnail(chapterKey);
} else {
const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
onAddItem({ id: nextId, name: trimmed, type: newItemType });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId + '-\u09B8\u09B9\u09AA\u09BE\u09A0');
await uploadThumbnail(chapterKey);
}
resetForm(); setIsModalOpen(false);
};
return (
<AdminShell title="\u09B8\u09B9\u09AA\u09BE\u09A0" subtitle="\u09A8\u09BE\u099F\u0995 \u0993 \u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8\u09C7\u09B0 \u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964" activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center">
<button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<div className="flex flex-wrap items-center gap-2">
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add</button>}
</div>
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{items.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">\u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8\u09CB \u09B8\u09B9\u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item.id + '-\u09B8\u09B9\u09AA\u09BE\u09A0');
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={item.id} className="w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-2 flex-1 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09B8\u09B9\u09AA\u09BE\u09A0</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{item.name}</div>
<div className="text-xs text-gray-500 mt-1">{item.type}</div>
</div>
<div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onSelectItem(item)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
{canManageStructure && <button onClick={() => { setEditingItem(item); setNewItemName(item.name); setNewItemType(item.type); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u09AA\u09BE\u09A0\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onRemoveItem(item.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8\u09CB \u09B8\u09B9\u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item.id + '-\u09B8\u09B9\u09AA\u09BE\u09A0');
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={item.id} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<div className="flex flex-col text-left"><span>{item.name}</span><span className="text-xs text-gray-500 mt-1">{item.type}</span></div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
{canManageStructure && <button onClick={() => { setEditingItem(item); setNewItemName(item.name); setNewItemType(item.type); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u09AA\u09BE\u09A0\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onRemoveItem(item.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
<button onClick={() => onSelectItem(item)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
</div>
</div>
);
})}
</div>
)}
{isModalOpen && canManageStructure && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingItem ? 'Rename entry' : '\u09A8\u09A4\u09C1\u09A8 \u09B8\u09B9\u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u09AA\u09BE\u09A0\u09C7\u09B0 \u09A8\u09BE\u09AE \u0993 \u09A7\u09B0\u09A3 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964</p>
<input value={newItemName} onChange={(event) => setNewItemName(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u09B8\u09BF\u09B0\u09BE\u099C\u0989\u09A6\u09CD\u09A6\u09CC\u09B2\u09BE" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09A7\u09B0\u09A3</label><select value={newItemType} onChange={(event) => setNewItemType(event.target.value)} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">{typeOptions.map((option) => (<option key={option} value={option}>{option}</option>))}</select></div>
{canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later with the thumbnail button.</p></div>)}
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">{editingItem ? 'Update' : 'Add'}</button></div>
</div>
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this \u09B8\u09B9\u09AA\u09BE\u09A0 chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const BanglaTextList = ({ classLabel, typeLabel, items, onAddItem, onUpdateItem, onRemoveItem, onSelectItem, onNavigate, showAdd = false, baseRouteOverride, canManageStructure, canManageThumbnails }) => {
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [newItem, setNewItem] = useState('');
const [editingItem, setEditingItem] = useState(null);
const [thumbnailFile, setThumbnailFile] = useState(null);
const baseRoute = baseRouteOverride || (classLabel === 'SSC' ? 'bangla-ssc-shahitto' : 'bangla-hsc-shahitto');
const subjectLabel = 'Bangla 1st Paper';
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const handleSave = async () => {
const trimmed = newItem.trim();
if (!trimmed) return;
const token = localStorage.getItem('auth_token');
const uploadThumbnail = async (chapterKey) => {
if (!thumbnailFile || !token) return;
const formData = new FormData();
formData.append('chapterKey', chapterKey);
formData.append('file', thumbnailFile);
const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
};
if (editingItem) {
onUpdateItem(editingItem, trimmed);
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, trimmed + '-' + typeLabel);
await uploadThumbnail(chapterKey);
} else {
onAddItem(trimmed);
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, trimmed + '-' + typeLabel);
await uploadThumbnail(chapterKey);
}
setNewItem(''); setEditingItem(null); setThumbnailFile(null); setIsModalOpen(false);
};
return (
<AdminShell title={\`\${typeLabel} \u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\`} subtitle="\u09AA\u09BE\u09A0\u09C7\u09B0 \u09A8\u09BE\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964" activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center">
<button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<div className="flex flex-wrap items-center gap-2">
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
{showAdd && canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add</button>}
</div>
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{items.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">\u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8\u09CB \u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + typeLabel);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={item} className="w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-2 flex-1 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u09AA\u09BE\u09A0</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{item}</div>
<div className="text-xs text-gray-500 mt-1">{typeLabel}</div>
</div>
<div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onSelectItem(item)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
{canManageStructure && <button onClick={() => { setEditingItem(item); setNewItem(item); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u09AA\u09BE\u09A0\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onRemoveItem(item); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={item} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u0993 \u0995\u09CB\u09A8\u09CB \u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{items.map((item) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, item + '-' + typeLabel);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={item} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={item} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<span>{item}</span>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
{canManageStructure && <button onClick={() => { setEditingItem(item); setNewItem(item); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: item, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u09AA\u09BE\u09A0\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onRemoveItem(item); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
<button onClick={() => onSelectItem(item)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
</div>
</div>
);
})}
</div>
)}
{isModalOpen && canManageStructure && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingItem ? 'Rename entry' : '\u09A8\u09A4\u09C1\u09A8 \u09AA\u09BE\u09A0 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u09AA\u09BE\u09A0\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<input value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u0985\u09AA\u09B0\u09BF\u099A\u09BF\u09A4\u09BE" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
{canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); setNewItem(''); setEditingItem(null); setThumbnailFile(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">{editingItem ? 'Update' : 'Add'}</button></div>
</div>
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const BanglaItemDetail = ({ classLabel, itemName, categoryName, notesByItem, videosByItem, onUpdateNotes, onUpdateVideos, onNavigate }) => {
const baseRoute = classLabel === 'SSC' ? 'bangla-ssc-1st-paper' : 'bangla-hsc-1st-paper';
const categoryRoute = classLabel === 'SSC' ? (categoryName === '\u09AA\u09A6\u09CD\u09AF' ? 'bangla-ssc-poddo' : categoryName === '\u09A8\u09BE\u099F\u0995' || categoryName === '\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8' ? 'bangla-ssc-shohopath' : 'bangla-ssc-goddo') : (categoryName === '\u09AA\u09A6\u09CD\u09AF' ? 'bangla-hsc-poddo' : categoryName === '\u09A8\u09BE\u099F\u0995' || categoryName === '\u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8' ? 'bangla-hsc-shohopath' : 'bangla-hsc-goddo');
const srijonshilRoute = classLabel === 'SSC' ? 'bangla-ssc-srijonshil-types' : 'bangla-hsc-srijonshil-types';
const mcqRoute = classLabel === 'SSC' ? 'bangla-ssc-mcq' : 'bangla-hsc-mcq';
const optionList = [{ label: '\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2', description: '\u099C\u09CD\u099E\u09BE\u09A8 \u0993 \u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8', route: srijonshilRoute }, { label: '\u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0', description: 'MCQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C1\u09A8', route: mcqRoute }];
const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
const [noteInput, setNoteInput] = useState('');
const [noteStars, setNoteStars] = useState(0);
const [editingNoteIndex, setEditingNoteIndex] = useState(null);
const noteKey = [classLabel, categoryName || 'general', itemName || ''].join('-');
const notes = (notesByItem || {})[noteKey] || [];
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const normalizedNote = (note) => {
if (!note) return { text: '', stars: 0 };
if (typeof note === 'string') return { text: note, stars: 0 };
return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
};
const openNoteModal = (index = null) => {
const resolved = index === null ? { text: '', stars: 0 } : normalizedNote(notes[index]);
setEditingNoteIndex(index);
setNoteInput(resolved.text);
setNoteStars(resolved.stars);
setIsNoteModalOpen(true);
};
const handleNoteSave = () => {
const trimmed = noteInput.trim();
if (!trimmed) return;
const payload = { text: trimmed, stars: Math.max(0, Math.min(5, Number(noteStars) || 0)) };
if (onUpdateNotes) { onUpdateNotes((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; if (editingNoteIndex === null) { current.push(payload); } else { current[editingNoteIndex] = payload; } return { ...prev, [noteKey]: current }; }); }
setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null);
};
const renderStars = (value) => (
<div className="flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</div>
);
return (
<AdminShell title={null} subtitle={null} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-col gap-2 font-bangla">
<div className="flex flex-wrap gap-3 justify-between items-center"><button onClick={() => onNavigate(categoryRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><button onClick={() => onNavigate(baseRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Subjects</button></div>
<div className="text-center"><h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">{itemName || '\u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}</h2></div>
<div className="grid card-grid-gap sm:grid-cols-2">{optionList.map((option) => (<button key={option.label} onClick={() => option.route && onNavigate(option.route)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A7\u09B0\u09A3</div><div className="text-lg font-semibold text-gray-900 mt-2">{option.label}</div><p className="text-sm text-gray-500 mt-2">{option.description}</p></button>))}</div>
<div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
<div className="px-4 py-3 flex items-center justify-between border-b border-gray-100"><div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A8\u09CB\u099F\u09B8</div><div className="text-sm font-semibold text-gray-700 mt-1">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B2\u09BE\u0987\u09A8 \u09B8\u0982\u09AF\u09C1\u0995\u09CD\u09A4 \u0995\u09B0\u09C1\u09A8</div></div><button onClick={() => openNoteModal()} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">\u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button></div>
<ul className="divide-y">{notes.length === 0 && <li className="px-4 py-3 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09A8\u09CB\u099F \u09AF\u09C1\u0995\u09CD\u09A4 \u09B9\u09DF\u09A8\u09BF\u0964</li>}{notes.map((note, index) => { const resolved = normalizedNote(note); return (<li key={\`\${noteKey}-\${index}\`} className="px-4 py-3 flex items-start gap-3"><span className="text-sm font-semibold text-gray-500">{toBanglaNumber(index + 1)}.</span><div className="flex-1"><div className="text-sm text-gray-700">{resolved.text}</div>{resolved.stars > 0 && <div className="mt-1 text-[10px]">{renderStars(resolved.stars)}</div>}</div><button onClick={() => openNoteModal(index)} className="text-gray-400 hover:text-gray-600 transition" title="\u09A8\u09CB\u099F \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8">\u270E</button></li>); })}</ul>
</div>
<VideoManager noteKey={noteKey} videosByItem={videosByItem} onUpdateVideos={onUpdateVideos} />
</div>
{isNoteModalOpen && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingNoteIndex === null ? '\u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' : '\u09A8\u09CB\u099F \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09B2\u09BE\u0987\u09A8 \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<textarea value={noteInput} onChange={(event) => setNoteInput(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u09AA\u09BE\u09A0\u09C7\u09B0 \u09AE\u09C2\u09B2 \u09AC\u0995\u09CD\u09A4\u09AC\u09CD\u09AF..." className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC (\u09B8\u09CD\u099F\u09BE\u09B0)</label>
<div className="mt-2 flex items-center gap-2">
<button onClick={() => setNoteStars(0)} className={'text-xs px-2 py-1 rounded-md border ' + (noteStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setNoteStars(star)} className={star <= noteStars ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleNoteSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
</AdminShell>
);
};
`;var ga=`
const IctChapterList = ({ classLabel, subjectLabel, chapters, onAdd, onUpdate, onDelete, onSelect, onBack, onNavigate, canManageStructure, canManageThumbnails }) => {
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [chapterName, setChapterName] = useState('');
const [chapterStars, setChapterStars] = useState(0);
const [editingChapter, setEditingChapter] = useState(null);
const [thumbnailFile, setThumbnailFile] = useState(null);
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const resetForm = () => { setChapterName(''); setChapterStars(0); setEditingChapter(null); setThumbnailFile(null); };
const handleSave = async () => {
const trimmed = chapterName.trim();
if (!trimmed) return;
const token = localStorage.getItem('auth_token');
const uploadThumbnail = async (chapterKey) => {
if (!thumbnailFile || !token) return;
const formData = new FormData();
formData.append('chapterKey', chapterKey);
formData.append('file', thumbnailFile);
const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
};
if (editingChapter) {
onUpdate(editingChapter.id, { name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingChapter.id);
await uploadThumbnail(chapterKey);
} else {
const nextId = \`\${Date.now()}-\${Math.random().toString(16).slice(2)}\`;
onAdd({ id: nextId, name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId);
await uploadThumbnail(chapterKey);
}
resetForm(); setIsModalOpen(false);
};
return (
<AdminShell title={classLabel + ' ICT'} subtitle={classLabel + ' \u0986\u0987\u09B8\u09BF\u099F\u09BF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 MCQ \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C1\u09A8\u0964'} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
<button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<div className="flex flex-wrap items-center gap-2">
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>}
</div>
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{chapters.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{chapters.map((chapter) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={chapter.id} className="w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-2 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u0985\u09A7\u09CD\u09AF\u09BE\u09DF</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{chapter.name}</div>
{Number(chapter.stars) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(chapter.stars)))}</div>}
</div>
<div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onSelect(chapter)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
{canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={chapter.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{chapters.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{chapters.map((chapter) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={chapter.id} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={chapter.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<div>
<div>{chapter.name}</div>
{Number(chapter.stars) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(chapter.stars)))}</div>}
</div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
{canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Rename</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
<button onClick={() => onSelect(chapter)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
</div>
</div>
);
})}
</div>
)}
{isModalOpen && canManageStructure && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingChapter ? '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8' : '\u09A8\u09A4\u09C1\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u0986\u0987\u09B8\u09BF\u099F\u09BF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u09A4\u09A5\u09CD\u09AF \u0993 \u09AF\u09CB\u0997\u09BE\u09AF\u09CB\u0997 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
<div className="mt-4">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setChapterStars(0)} className={'px-2 py-1 rounded-md border ' + (chapterStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-sm">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setChapterStars(star)} className={star <= chapterStars ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
{canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this ICT chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const ReligionSelectionList = ({ classLabel, options, onSelect, onBack, onNavigate }) => (
<AdminShell title="Religion and Moral Education" subtitle="\u09A7\u09B0\u09CD\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AA\u09B0\u09BF\u099A\u09BE\u09B2\u09A8\u09BE \u0995\u09B0\u09C1\u09A8\u0964" activeTab="classes" onNavigate={onNavigate}>
<div className="flex justify-between items-center"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><div className="text-xs uppercase tracking-[0.2em] text-gray-400">{classLabel}</div></div>
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{options.map((option) => (
<button key={option.key} onClick={() => onSelect(option)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
<div className="text-left"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A7\u09B0\u09CD\u09AE</div><div className="text-base font-semibold text-gray-900 mt-1">{option.label}</div><p className="text-xs text-gray-500 mt-2">{option.subtitle}</p></div><span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
</button>
))}
</div>
</AdminShell>
);

const ScienceChapterList = ({ classLabel, subjectLabel, chapters, onAdd, onUpdate, onDelete, onSelect, onNavigate, onBack, canManageStructure, canManageThumbnails }) => {
const [chapterThumbnails, setChapterThumbnails] = useThumbnailMap('/api/chapter-thumbnails', 'chapterKey');
const [activeThumbnail, setActiveThumbnail] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [chapterName, setChapterName] = useState('');
const [chapterStars, setChapterStars] = useState(0);
const [editingChapter, setEditingChapter] = useState(null);
const [thumbnailFile, setThumbnailFile] = useState(null);
const { viewMode, setViewMode, viewOptions } = useDashboardViewPreference();
const resetForm = () => { setChapterName(''); setChapterStars(0); setEditingChapter(null); setThumbnailFile(null); };
const handleSave = async () => {
const trimmed = chapterName.trim();
if (!trimmed) return;
const token = localStorage.getItem('auth_token');
const uploadThumbnail = async (chapterKey) => {
if (!thumbnailFile || !token) return;
const formData = new FormData();
formData.append('chapterKey', chapterKey);
formData.append('file', thumbnailFile);
const response = await fetch('/api/chapter-thumbnails', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { setChapterThumbnails((prev) => ({ ...prev, [data.thumbnail.chapterKey]: { url: data.thumbnail.url } })); }
};
if (editingChapter) {
onUpdate(editingChapter.id, { name: trimmed, stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, editingChapter.id);
await uploadThumbnail(chapterKey);
} else {
const nextId = Date.now() + '-' + Math.random().toString(16).slice(2);
onAdd({ id: nextId, name: trimmed, topics: [], stars: Math.max(0, Math.min(5, Number(chapterStars) || 0)) });
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, nextId);
await uploadThumbnail(chapterKey);
}
resetForm(); setIsModalOpen(false);
};
return (
<AdminShell title={classLabel + ' ' + subjectLabel} subtitle={subjectLabel + ' \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u099F\u09AA\u09BF\u0995 \u09B8\u09C7\u099F \u0995\u09B0\u09C1\u09A8\u0964'} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla">
<button onClick={onBack || (() => onNavigate(classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc'))} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
<div className="flex flex-wrap items-center gap-2">
<DashboardViewToggle viewMode={viewMode} onChange={setViewMode} options={viewOptions} />
{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>}
</div>
</div>
{viewMode === 'card' ? (
<div className="mt-4 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center font-bangla">
{chapters.length === 0 && <div className="col-span-full px-5 py-4 text-sm text-gray-400 text-center bg-white border border-dashed border-gray-200 rounded-2xl">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{chapters.map((chapter) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={chapter.id} className="w-full max-w-[160px] aspect-[1/1.618] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
<div className="p-2 flex flex-col gap-2">
<div>
<div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">\u0985\u09A7\u09CD\u09AF\u09BE\u09DF</div>
<div className="text-sm font-semibold text-gray-900 mt-1">{chapter.name}</div>
{Number(chapter.stars) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(chapter.stars)))}</div>}
<div className="text-xs text-gray-400 mt-1">\u099F\u09AA\u09BF\u0995: {(chapter.topics || []).length}</div>
</div>
<div className="mt-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
<button onClick={() => onSelect(chapter)} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Open</button>
{canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
</div>
</div>
<div className="flex-1 bg-gray-100 border-t border-gray-200">
{thumbnailUrl ? <img src={thumbnailUrl} alt={chapter.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-300">No image</div>}
</div>
</div>
);
})}
</div>
) : (
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{chapters.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{chapters.map((chapter) => {
const chapterKey = makeChapterThumbnailKey(classLabel, subjectLabel, chapter.id);
const thumbnailUrl = chapterThumbnails[chapterKey]?.url;
return (
<div key={chapter.id} className="w-full flex flex-wrap gap-3 items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700">
<div className="flex items-center gap-3">
<div className="w-9 h-11 rounded-md overflow-hidden border border-gray-200 bg-gray-100">{thumbnailUrl ? <img src={thumbnailUrl} alt={chapter.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-gray-300">No image</div>}</div>
<div>
<div className="text-sm font-semibold text-gray-900">{chapter.name}</div>
{Number(chapter.stars) > 0 && <div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(chapter.stars)))}</div>}
<div className="text-xs text-gray-400 mt-1">\u099F\u09AA\u09BF\u0995: {(chapter.topics || []).length}</div>
</div>
</div>
<div className="flex items-center gap-2 text-[11px] font-semibold">
{canManageStructure && <button onClick={() => { setEditingChapter(chapter); setChapterName(chapter.name); setChapterStars(Number(chapter.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>}
{canManageThumbnails && <button onClick={() => setActiveThumbnail({ title: chapter.name, chapterKey })} className="px-2 py-1 rounded-md border border-blue-100 text-blue-600 hover:bg-blue-50 transition">Thumbnail</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove) { onDelete(chapter.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
<button onClick={() => onSelect(chapter)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
</div>
</div>
);
})}
</div>
)}
{isModalOpen && canManageStructure && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingChapter ? '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8' : '\u09A8\u09A4\u09C1\u09A8 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<input value={chapterName} onChange={(event) => setChapterName(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09E7" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
<div className="mt-4">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setChapterStars(0)} className={'px-2 py-1 rounded-md border ' + (chapterStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-sm">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setChapterStars(star)} className={star <= chapterStars ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
{canManageThumbnails && (<div className="mt-4"><label className="text-xs uppercase tracking-[0.2em] text-gray-400">Thumbnail</label><input type="file" accept="image/*" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) { setThumbnailFile(null); return; } const resized = await resizeImageFile(selected); setThumbnailFile(resized || null); }} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><p className="text-xs text-gray-400 mt-2">Upload now or edit later from the chapter list.</p></div>)}
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
{activeThumbnail && canManageThumbnails && <ThumbnailUploadModal title={activeThumbnail.title} description="Upload a thumbnail for this chapter." uploadUrl="/api/chapter-thumbnails" keyField="chapterKey" itemKey={activeThumbnail.chapterKey} existingUrl={chapterThumbnails[activeThumbnail.chapterKey]?.url} onSaved={(thumbnail) => { setChapterThumbnails((prev) => ({ ...prev, [thumbnail.chapterKey]: { url: thumbnail.url } })); setActiveThumbnail(null); }} onClose={() => setActiveThumbnail(null)} />}
</AdminShell>
);
};

const ScienceTopicList = ({ classLabel, subjectLabel, chapter, onAddTopic, onUpdateTopic, onDeleteTopic, onSelectTopic, onBack, onNavigate, canManageStructure }) => {
const [isModalOpen, setIsModalOpen] = useState(false);
const [topicName, setTopicName] = useState('');
const [topicStars, setTopicStars] = useState(0);
const [editingTopic, setEditingTopic] = useState(null);
const topics = chapter?.topics || [];
const resetForm = () => { setTopicName(''); setTopicStars(0); setEditingTopic(null); };
const handleSave = () => {
const trimmed = topicName.trim();
if (!trimmed || !chapter) return;
const starsValue = Math.max(0, Math.min(5, Number(topicStars) || 0));
if (editingTopic) { onUpdateTopic(chapter.id, editingTopic.id, { name: trimmed, stars: starsValue }); } else { const nextId = Date.now() + '-' + Math.random().toString(16).slice(2); onAddTopic(chapter.id, { id: nextId, name: trimmed, stars: starsValue }); }
resetForm(); setIsModalOpen(false);
};
return (
<AdminShell title={subjectLabel + ' \u099F\u09AA\u09BF\u0995\u09B8\u09AE\u09C2\u09B9'} subtitle={(chapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF') + ' \u098F\u09B0 \u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>{canManageStructure && <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">\u099F\u09AA\u09BF\u0995 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button>}</div>
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y font-bangla">
{topics.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u099F\u09AA\u09BF\u0995 \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</div>}
{topics.map((topic) => (
<div key={topic.id} className="px-5 py-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<div>
<div className="text-sm font-semibold text-gray-900">{topic.name}</div>
{Number(topic.stars) > 0 && (
<div className="mt-1 text-[10px] text-amber-500">{'\u2605'.repeat(Math.min(5, Number(topic.stars)))}</div>
)}
</div>
<div className="flex items-center gap-2 text-xs font-semibold">
{canManageStructure && <button onClick={() => { setEditingTopic(topic); setTopicName(topic.name); setTopicStars(Number(topic.stars) || 0); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>}
{canManageStructure && <button onClick={() => { const shouldRemove = window.confirm('\u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0987 \u099F\u09AA\u09BF\u0995\u099F\u09BF \u09AE\u09C1\u099B\u09C7 \u09AB\u09C7\u09B2\u09A4\u09C7 \u099A\u09BE\u09A8?'); if (shouldRemove && chapter) { onDeleteTopic(chapter.id, topic.id); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>}
<button onClick={() => onSelectTopic(topic)} className="text-xs uppercase tracking-[0.2em] text-blue-600 hover:text-blue-500 transition">Open</button>
</div>
</div>
</div>
))}
</div>
{isModalOpen && canManageStructure && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingTopic ? '\u099F\u09AA\u09BF\u0995 \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8' : '\u09A8\u09A4\u09C1\u09A8 \u099F\u09AA\u09BF\u0995 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u099F\u09AA\u09BF\u0995\u09C7\u09B0 \u09A8\u09BE\u09AE \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<input value={topicName} onChange={(event) => setTopicName(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u09AC\u09B2 \u098F\u09AC\u0982 \u0997\u09A4\u09BF" className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
<div className="mt-4">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u09B8\u09CD\u099F\u09BE\u09B0</label>
<div className="mt-2 flex items-center gap-2 text-xs">
<button onClick={() => setTopicStars(0)} className={'px-2 py-1 rounded-md border ' + (topicStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
<div className="flex items-center gap-1 text-sm">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setTopicStars(star)} className={star <= topicStars ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
</AdminShell>
);
};

const ScienceTopicDetail = ({ classLabel, subjectLabel, chapter, topic, noteKey, notesByItem, videosByItem, onUpdateNotes, onUpdateVideos, onBack, onNavigateCq, onNavigateMcq, onNavigate }) => {
const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
const [noteInput, setNoteInput] = useState('');
const [noteStars, setNoteStars] = useState(0);
const [editingNoteIndex, setEditingNoteIndex] = useState(null);
const notes = (notesByItem || {})[noteKey] || [];
const banglaDigits = ['\u09E6', '\u09E7', '\u09E8', '\u09E9', '\u09EA', '\u09EB', '\u09EC', '\u09ED', '\u09EE', '\u09EF'];
const toBanglaNumber = (value) => String(value).split('').map((digit) => banglaDigits[Number(digit)] ?? digit).join('');
const normalizedNote = (note) => {
if (!note) return { text: '', stars: 0 };
if (typeof note === 'string') return { text: note, stars: 0 };
return { text: note.text || note.note || '', stars: Math.max(0, Math.min(5, Number(note.stars) || 0)) };
};
const openNoteModal = (index = null) => {
const resolved = index === null ? { text: '', stars: 0 } : normalizedNote(notes[index]);
setEditingNoteIndex(index);
setNoteInput(resolved.text);
setNoteStars(resolved.stars);
setIsNoteModalOpen(true);
};
const handleNoteSave = () => {
const trimmed = noteInput.trim();
if (!trimmed) return;
const payload = { text: trimmed, stars: Math.max(0, Math.min(5, Number(noteStars) || 0)) };
if (onUpdateNotes) { onUpdateNotes((prev) => { const current = prev && prev[noteKey] ? [...prev[noteKey]] : []; if (editingNoteIndex === null) { current.push(payload); } else { current[editingNoteIndex] = payload; } return { ...prev, [noteKey]: current }; }); }
setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null);
};
const renderStars = (value) => (
<div className="flex items-center gap-1 text-[10px]">
{[1, 2, 3, 4, 5].map((star) => (
<span key={star} className={star <= value ? 'text-amber-400' : 'text-slate-200'}>\u2605</span>
))}
</div>
);
return (
<AdminShell title={subjectLabel + ' \u2022 ' + (topic?.name || '\u099F\u09AA\u09BF\u0995')} subtitle={chapter?.name ? '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF: ' + chapter.name : '\u099F\u09AA\u09BF\u0995\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8\u0964'} activeTab="classes" onNavigate={onNavigate}>
<div className="flex flex-wrap gap-3 justify-between items-center font-bangla"><button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button><button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button></div>
<div className="mt-4 grid card-grid-gap sm:grid-cols-2 font-bangla">
<button onClick={onNavigateCq} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A7\u09B0\u09A3</div><div className="text-lg font-semibold text-gray-900 mt-2">\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2 (CQ)</div><p className="text-sm text-gray-500 mt-2">\u099C\u09CD\u099E\u09BE\u09A8 \u0993 \u0985\u09A8\u09C1\u09A7\u09BE\u09AC\u09A8 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</p></button>
<button onClick={onNavigateMcq} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A7\u09B0\u09A3</div><div className="text-lg font-semibold text-gray-900 mt-2">\u09AC\u09B9\u09C1\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8\u09C0 (MCQ)</div><p className="text-sm text-gray-500 mt-2">MCQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09C1\u09A8</p></button>
</div>
<div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
<div className="px-4 py-3 flex items-center justify-between border-b border-gray-100"><div><div className="text-xs uppercase tracking-[0.2em] text-gray-300">\u09A8\u09CB\u099F\u09B8</div><div className="text-sm font-semibold text-gray-700 mt-1">\u099F\u09AA\u09BF\u0995\u09C7\u09B0 \u09AE\u09C2\u09B2 \u09A4\u09A5\u09CD\u09AF \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</div></div><button onClick={() => openNoteModal()} className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">\u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8</button></div>
<ul className="divide-y">{notes.length === 0 && <li className="px-4 py-3 text-sm text-gray-400">\u098F\u0996\u09A8\u09CB \u0995\u09CB\u09A8 \u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09BE \u09B9\u09DF\u09A8\u09BF\u0964</li>}{notes.map((note, index) => { const resolved = normalizedNote(note); return (<li key={noteKey + '-' + index} className="px-4 py-3 flex items-start gap-3"><span className="text-sm font-semibold text-gray-500">{toBanglaNumber(index + 1)}.</span><div className="flex-1"><div className="text-sm text-gray-700">{resolved.text}</div>{resolved.stars > 0 && <div className="mt-1 text-[10px]">{renderStars(resolved.stars)}</div>}</div><button onClick={() => openNoteModal(index)} className="text-gray-400 hover:text-gray-600 transition" title="\u09A8\u09CB\u099F \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8">\u270E</button></li>); })}</ul>
</div>
<VideoManager noteKey={noteKey} videosByItem={videosByItem} onUpdateVideos={onUpdateVideos} />
{isNoteModalOpen && (
<div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 font-bangla">
<h3 className="text-lg font-semibold text-gray-900">{editingNoteIndex === null ? '\u09A8\u09CB\u099F \u09AF\u09CB\u0997 \u0995\u09B0\u09C1\u09A8' : '\u09A8\u09CB\u099F \u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8'}</h3>
<p className="text-sm text-gray-500 mt-1">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A4\u09A5\u09CD\u09AF \u09B2\u09BF\u0996\u09C1\u09A8\u0964</p>
<textarea value={noteInput} onChange={(event) => setNoteInput(event.target.value)} placeholder="\u0989\u09A6\u09BE\u09B9\u09B0\u09A3: \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09C7\u09B0 \u09AE\u09C2\u09B2 \u09B8\u09C2\u09A4\u09CD\u09B0..." className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[120px]" />
<div className="mt-3">
<label className="text-xs uppercase tracking-[0.2em] text-gray-400">\u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC (\u09B8\u09CD\u099F\u09BE\u09B0)</label>
<div className="mt-2 flex items-center gap-2">
<button onClick={() => setNoteStars(0)} className={\`text-xs px-2 py-1 rounded-md border \${noteStars === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500'}\`}>No Star</button>
<div className="flex items-center gap-1 text-xs">
{[1, 2, 3, 4, 5].map((star) => (
<button key={star} onClick={() => setNoteStars(star)} className={star <= noteStars ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
))}
</div>
</div>
</div>
<div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsNoteModalOpen(false); setNoteInput(''); setNoteStars(0); setEditingNoteIndex(null); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleNoteSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
</div>
</div>
)}
</AdminShell>
);
};
`;var ba=`
        const EnglishFirstPaperHome = ({ classLabel, onNavigate }) => {
            const groupRoute = classLabel === 'SSC' ? 'admin-groups-ssc' : 'admin-groups-hsc';
            const readingRoute = classLabel === 'SSC' ? 'english-ssc-reading' : 'english-hsc-reading';
            const writingRoute = classLabel === 'SSC' ? 'english-ssc-writing' : 'english-hsc-writing';
            return (
                <AdminShell title="English 1st Paper" subtitle={\`\${classLabel} section overview for Reading and Writing.\`} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex justify-between items-center">
                        <button onClick={() => onNavigate(groupRoute)} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                    </div>
                    <div className="grid card-grid-gap sm:grid-cols-2">
                        <button onClick={() => onNavigate(readingRoute)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div><div className="text-lg font-semibold text-gray-900 mt-2">Reading</div><p className="text-sm text-gray-500 mt-2">MCQ, comprehension, and passage-based tasks.</p></button>
                        <button onClick={() => onNavigate(writingRoute)} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 text-left hover:bg-gray-50 transition"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Section</div><div className="text-lg font-semibold text-gray-900 mt-2">Writing</div><p className="text-sm text-gray-500 mt-2">Paragraphs, stories, letters, and analysis tasks.</p></button>
                    </div>
                </AdminShell>
            );
        };

        const EnglishSectionList = ({ title, subtitle, items, onBack, onSelect, onNavigate }) => (
            <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                <div className="flex justify-between items-center">
                    <button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                    <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Dashboard</button>
                </div>
                <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                    {items.map((item) => (
                        <button key={item.key} onClick={() => onSelect(item)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                            <div className="text-left space-y-1"><div className="text-xs uppercase tracking-[0.2em] text-gray-400">Question Type</div><div className="text-base font-semibold text-gray-900">{item.label}</div>{item.description && <p className="text-xs text-gray-500">{item.description}</p>}{item.children?.length > 0 && <p className="text-xs text-blue-500">Includes {item.children.map((child) => child.label).join(', ')}</p>}</div><span className="text-xs uppercase tracking-[0.2em] text-blue-600">Open</span>
                        </button>
                    ))}
                    {items.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No question types configured yet.</div>}
                </div>
            </AdminShell>
        );

        const EnglishQuestionList = ({ title, subtitle, questions, onAdd, onUpdate, onDelete, onBack, onNavigate }) => {
            const [questionInput, setQuestionInput] = useState('');
            const [answerInput, setAnswerInput] = useState('');
            const [starRating, setStarRating] = useState(0);
            const [editingIndex, setEditingIndex] = useState(null);
            const [isModalOpen, setIsModalOpen] = useState(false);
            const resetForm = () => { setQuestionInput(''); setAnswerInput(''); setStarRating(0); setEditingIndex(null); };
            const normalizeStars = (value) => Math.max(0, Math.min(5, Number(value) || 0));
            const handleSave = () => {
                const trimmedQuestion = questionInput.trim();
                const trimmedAnswer = answerInput.trim();
                if (!trimmedQuestion || !trimmedAnswer) return;
                const payload = { question: trimmedQuestion, answer: trimmedAnswer, stars: normalizeStars(starRating) };
                if (editingIndex === null) { onAdd(payload); } else { onUpdate(editingIndex, payload); }
                resetForm(); setIsModalOpen(false);
            };
            return (
                <AdminShell title={title} subtitle={subtitle} activeTab="classes" onNavigate={onNavigate}>
                    <div className="flex flex-wrap gap-3 justify-between items-center">
                        <button onClick={onBack} className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Back</button>
                        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Add Question</button>
                    </div>
                    <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm divide-y">
                        {questions.length === 0 && <div className="px-5 py-4 text-sm text-gray-400">No questions added yet.</div>}
                        {questions.map((entry, index) => (
                            <div key={index} className="px-5 py-4 text-sm text-gray-700 space-y-2">
                                <div className="font-semibold text-gray-900">Q{index + 1}. {entry.question}</div>
                                {normalizeStars(entry.stars) > 0 && <div className="text-[10px] text-amber-500">{'\u2605'.repeat(normalizeStars(entry.stars))}</div>}
                                <div className="text-sm text-gray-600">Answer: {entry.answer}</div>
                                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                    <button onClick={() => { setEditingIndex(index); setQuestionInput(entry.question); setAnswerInput(entry.answer); setStarRating(normalizeStars(entry.stars)); setIsModalOpen(true); }} className="px-2 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Edit</button>
                                    <button onClick={() => { const shouldDelete = window.confirm('Delete this question?'); if (shouldDelete) { onDelete(index); } }} className="px-2 py-1 rounded-md border border-red-100 text-red-500 hover:bg-red-50 transition">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center px-4 py-6 z-50">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900">{editingIndex === null ? 'Add question' : 'Update question'}</h3>
                                <p className="text-sm text-gray-500 mt-1">Provide the question prompt and answer.</p>
                                <textarea value={questionInput} onChange={(event) => setQuestionInput(event.target.value)} placeholder="Question prompt" rows={3} className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <textarea value={answerInput} onChange={(event) => setAnswerInput(event.target.value)} placeholder="Answer" rows={3} className="mt-4 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                                <div className="mt-4">
                                    <label className="text-xs uppercase tracking-[0.2em] text-gray-400">Importance (Stars)</label>
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        <button onClick={() => setStarRating(0)} className={'text-xs px-2 py-1 rounded-md border ' + (starRating === 0 ? 'border-amber-400 text-amber-600' : 'border-gray-200 text-gray-500')}>No Star</button>
                                        <div className="flex items-center gap-1 text-xs">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setStarRating(star)} className={star <= starRating ? 'text-amber-400' : 'text-slate-200'}>\u2605</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 flex justify-end gap-2"><button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition">Save</button></div>
                            </div>
                        </div>
                    )}
                </AdminShell>
            );
        };
`;var ya=`
        return {
            AdminDashboard,
            AdminGroupSelection,
            AdminGroupDetail,
            AdminUserList,
            AdminStudentProfile,
            BanglaFirstPaperTopics,
            BanglaShahitto,
            BanglaShohopath,
            BanglaTextList,
            BanglaItemDetail,
            SrijonshilTypeList,
            SrijonshilQuestionList,
            McqQuestionList,
            IctChapterList,
            ReligionSelectionList,
            ScienceChapterList,
            ScienceTopicList,
            ScienceTopicDetail,
            VideoManager,
            EnglishFirstPaperHome,
            EnglishSectionList,
            EnglishQuestionList
        };
`;var va=`
const AdminStudentProfile = ({ onNavigate }) => {
const [userId, setUserId] = useState(() => {
const params = new URLSearchParams(window.location.search);
const queryId = Number(params.get('id'));
if (queryId) {
sessionStorage.setItem('admin_user_profile_id', String(queryId));
return queryId;
}
return Number(sessionStorage.getItem('admin_user_profile_id') || 0);
});
const [detailData, setDetailData] = useState(null);
const [detailForm, setDetailForm] = useState(null);
const [detailLoading, setDetailLoading] = useState(false);
const [detailMessage, setDetailMessage] = useState('');
const [editingField, setEditingField] = useState(null);

useEffect(() => {
const params = new URLSearchParams(window.location.search);
const queryId = Number(params.get('id'));
if (queryId && queryId !== userId) {
sessionStorage.setItem('admin_user_profile_id', String(queryId));
setUserId(queryId);
return;
}
const stored = Number(sessionStorage.getItem('admin_user_profile_id') || 0);
if (stored !== userId) setUserId(stored);
}, []);

const toggleEditField = (field) => setEditingField((prev) => (prev === field ? null : field));

const loadUserDetails = async (selectedId) => {
setDetailLoading(true);
setDetailMessage('');
setDetailData(null);
const token = localStorage.getItem('auth_token');
if (!token) { setDetailLoading(false); return; }
try {
const res = await fetch('/api/users/details?id=' + selectedId, { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setDetailData(data.user);
setDetailForm({
name: data.user.name || '',
email: data.user.email || '',
classLabel: data.user.classLabel || '',
groupLabel: data.user.groupLabel || '',
religion: data.user.religion || '',
dateOfBirth: data.user.dateOfBirth || '',
batchYear: data.user.batchYear || ''
});
} else {
setDetailMessage(data.error || 'Unable to load user.');
}
} catch (e) {
setDetailMessage('Unable to load user.');
}
setDetailLoading(false);
};

useEffect(() => {
if (userId) {
loadUserDetails(userId);
}
}, [userId]);

const handleDetailSave = async () => {
if (!detailForm?.name || !detailForm?.email) {
setDetailMessage('Name and email are required.');
return;
}
const token = localStorage.getItem('auth_token');
if (!token) return;
setDetailLoading(true);
setDetailMessage('');
try {
const res = await fetch('/api/users/details', {
method: 'PUT',
headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
body: JSON.stringify({ id: userId, ...detailForm })
});
const data = await res.json();
if (data.success) {
setDetailMessage('Student updated.');
loadUserDetails(userId);
} else {
setDetailMessage(data.error || 'Update failed.');
}
} catch (e) {
setDetailMessage('Update failed.');
}
setDetailLoading(false);
};

const handleUserDelete = async () => {
const token = localStorage.getItem('auth_token');
if (!token || !userId) return;
if (!confirm('Delete this student account? This action cannot be undone.')) return;
setDetailLoading(true);
try {
const res = await fetch('/api/users/delete', {
method: 'POST',
headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
body: JSON.stringify({ id: userId })
});
const data = await res.json();
if (data.success) {
sessionStorage.removeItem('admin_user_profile_id');
onNavigate('admin-users');
} else {
setDetailMessage(data.error || 'Delete failed.');
}
} catch (e) {
setDetailMessage('Delete failed.');
}
setDetailLoading(false);
};

const handleBack = () => {
sessionStorage.removeItem('admin_user_profile_id');
onNavigate('admin-users');
};

const canSelectGroup = detailForm?.classLabel === 'SSC' || detailForm?.classLabel === 'HSC';

return (
<AdminShell title="Student Profile" subtitle="Review and edit student details" activeTab="users" onNavigate={onNavigate}>
<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
<div className="flex flex-wrap items-center justify-between gap-3">
<button onClick={handleBack} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back to Users</button>
{detailData?.createdAt && !Number.isNaN(Date.parse(detailData.createdAt)) && (
<div className="text-xs text-slate-400">Joined {new Date(detailData.createdAt).toLocaleDateString()}</div>
)}
</div>

{!userId && (
<div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">Select a student from the users list to view their profile.</div>
)}

{detailLoading && <div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading...</div>}

{!detailLoading && detailMessage && !detailForm && (
<div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-500">{detailMessage}</div>
)}

{!detailLoading && detailForm && (
<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
<div className="grid gap-4 sm:grid-cols-2">
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name</label>
<div className="flex items-center gap-2">
<input value={detailForm.name} onChange={e => setDetailForm({ ...detailForm, name: e.target.value })} disabled={editingField !== 'name'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
<button onClick={() => toggleEditField('name')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label>
<div className="flex items-center gap-2">
<input value={detailForm.email} onChange={e => setDetailForm({ ...detailForm, email: e.target.value })} disabled={editingField !== 'email'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
<button onClick={() => toggleEditField('email')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Class</label>
<div className="flex items-center gap-2">
<select value={detailForm.classLabel} onChange={e => {
const nextClass = e.target.value;
setDetailForm({ 
...detailForm, 
classLabel: nextClass, 
groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? detailForm.groupLabel : '',
batchYear: nextClass === 'SSC' || nextClass === 'HSC' ? detailForm.batchYear : ''
});
}} disabled={editingField !== 'classLabel'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
<option value="">Select</option>
<option value="SSC">SSC</option>
<option value="HSC">HSC</option>
<option value="6">Class 6</option>
<option value="7">Class 7</option>
<option value="8">Class 8</option>
</select>
<button onClick={() => toggleEditField('classLabel')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Group</label>
<div className="flex items-center gap-2">
<select value={detailForm.groupLabel} onChange={e => setDetailForm({ ...detailForm, groupLabel: e.target.value })} disabled={!canSelectGroup || editingField !== 'groupLabel'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
<option value="">Select</option>
<option value="Science">Science</option>
<option value="Humanities">Humanities</option>
<option value="Business Studies">Business Studies</option>
</select>
<button onClick={() => toggleEditField('groupLabel')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Religion</label>
<div className="flex items-center gap-2">
<select value={detailForm.religion} onChange={e => setDetailForm({ ...detailForm, religion: e.target.value })} disabled={editingField !== 'religion'} className="w-full p-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-50 disabled:text-slate-500">
<option value="">Select</option>
<option value="Islam">Islam</option>
<option value="Hinduism">Hinduism</option>
<option value="Buddhism">Buddhism</option>
<option value="Christianity">Christianity</option>
<option value="Other">Other</option>
</select>
<button onClick={() => toggleEditField('religion')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date of Birth</label>
<div className="flex items-center gap-2">
<input type="date" value={detailForm.dateOfBirth} onChange={e => setDetailForm({ ...detailForm, dateOfBirth: e.target.value })} disabled={editingField !== 'dateOfBirth'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
<button onClick={() => toggleEditField('dateOfBirth')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
<div className="sm:col-span-2">
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">SSC/HSC Batch Year</label>
<div className="flex items-center gap-2">
<input value={detailForm.batchYear} onChange={e => setDetailForm({ ...detailForm, batchYear: e.target.value })} disabled={!canSelectGroup || editingField !== 'batchYear'} className="w-full p-3 border border-slate-200 rounded-lg disabled:bg-slate-50 disabled:text-slate-500" />
<button onClick={() => toggleEditField('batchYear')} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50"><i className="fa-solid fa-pen"></i></button>
</div>
</div>
</div>

<div className="bg-slate-50 rounded-xl p-4">
<div className="text-xs uppercase tracking-wider text-slate-400">Points</div>
<div className="text-lg font-semibold text-slate-800">{detailData?.points || 0}</div>
<div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
{(detailData?.pointLogs || []).length === 0 && <div className="text-xs text-slate-400">No point logs yet.</div>}
{(detailData?.pointLogs || []).map((log, index) => (
<div key={log.createdAt + '-' + index} className="flex items-center justify-between text-xs text-slate-600">
<span>{log.reason === 'profile_complete' ? 'Profile completed' : log.reason}</span>
<span className="font-semibold text-emerald-600">+{log.points}</span>
</div>
))}
</div>
</div>

{detailMessage && <div className="p-3 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-200">{detailMessage}</div>}

<div className="flex flex-col sm:flex-row gap-3">
<button onClick={handleDetailSave} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg">Save Changes</button>
<button onClick={handleUserDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">Delete Student</button>
</div>
</div>
)}
</div>
</AdminShell>
);
};
`;var fa=`
const AdminUserList = ({ onNavigate }) => {
const [users, setUsers] = useState({ admins: [], teachers: [], students: [] });
const [activeTab, setActiveTab] = useState('students');
const [isLoading, setIsLoading] = useState(true);

// Modal & Selection States
const [selectedUser, setSelectedUser] = useState(null);
const [actionType, setActionType] = useState(null); // 'reveal' or 'reset'
const [adminPass, setAdminPass] = useState('');
const [newPass, setNewPass] = useState('');
const [modalMessage, setModalMessage] = useState('');

// Create User Form State
const [isCreateOpen, setIsCreateOpen] = useState(false);
const [createForm, setCreateForm] = useState({
name: '', email: '', password: '', 
classLabel: 'SSC', groupLabel: 'Science', // For Students
level: 'SSC', subject: '', permissions: [] // For Teachers
});

// FULL SUBJECT MAP (Matches Settings)
const adminSubjectGroups = {
SSC: {
Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Physics', 'Chemistry', 'Biology', 'Higher Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Religion and Moral Education'],
Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Geography and Environment', 'History of Bangladesh and World Civilization', 'Civics and Citizenship', 'Religion and Moral Education'],
'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'General Mathematics', 'Bangladesh and Global Studies', 'Information and Communication Technology', 'Accounting', 'Business Entrepreneurship', 'Finance and Banking', 'Religion and Moral Education']
},
HSC: {
Science: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Physics 1st Paper', 'Physics 2nd Paper', 'Chemistry 1st Paper', 'Chemistry 2nd Paper', 'Biology 1st Paper', 'Biology 2nd Paper', 'Higher Mathematics 1st Paper', 'Higher Mathematics 2nd Paper'],
Humanities: ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Economics 1st Paper', 'Economics 2nd Paper', 'History 1st Paper', 'History 2nd Paper', 'Civics and Good Governance 1st Paper', 'Civics and Good Governance 2nd Paper', 'Logic 1st Paper', 'Logic 2nd Paper'],
'Business Studies': ['Bangla 1st Paper', 'Bangla 2nd Paper', 'English 1st Paper', 'English 2nd Paper', 'Information and Communication Technology', 'Accounting 1st Paper', 'Accounting 2nd Paper', 'Business Organization and Management 1st Paper', 'Business Organization and Management 2nd Paper', 'Finance, Banking and Insurance 1st Paper', 'Finance, Banking and Insurance 2nd Paper', 'Production Management and Marketing 1st Paper', 'Production Management and Marketing 2nd Paper']
}
};

// Compute available subjects for Teacher Dropdown based on selected Level
const getTeacherSubjects = (level) => {
if (!level) return [];
const groups = adminSubjectGroups[level] || {};
// Flatten all subjects from all groups in that level, remove duplicates
const allSubjects = new Set();
Object.values(groups).forEach(list => list.forEach(sub => allSubjects.add(sub)));
return Array.from(allSubjects).sort();
};

useEffect(() => {
fetchUsers();
const interval = setInterval(fetchUsers, 30000);
return () => clearInterval(interval);
}, []);

const fetchUsers = async () => {
const res = await fetch('/api/users', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') }});
const data = await res.json();
if (data.success) setUsers(data);
setIsLoading(false);
};

const openUserProfile = (userId) => {
sessionStorage.setItem('admin_user_profile_id', String(userId));
onNavigate('admin-user-profile', { path: '/dashboard/users/profile?id=' + userId });
};

const handleAction = async () => {
const endpoint = actionType === 'reveal' ? '/api/users/reveal' : '/api/users/reset';
const body = { 
adminPassword: adminPass, targetId: selectedUser.id,
...(actionType === 'reset' && { newPassword: newPass })
};
const res = await fetch(endpoint, {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') },
body: JSON.stringify(body)
});
const data = await res.json();
if (data.success) {
if (actionType === 'reveal') setModalMessage('Hash: ' + data.hash.substring(0, 20) + '... (Hidden)');
else { setModalMessage('Success!'); setTimeout(() => { setSelectedUser(null); setAdminPass(''); }, 1500); }
} else setModalMessage('Error: ' + data.error);
};

const handleCreateUser = async () => {
if (!createForm.name || !createForm.email || !createForm.password) return;
const res = await fetch('/api/users', {
method: 'POST',
headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('auth_token') },
body: JSON.stringify({ role: activeTab.slice(0, -1), ...createForm })
});
const data = await res.json();
if (data.success) { fetchUsers(); setIsCreateOpen(false); }
else alert(data.error);
};

const renderTable = (list) => (
<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
{/* DESKTOP TABLE VIEW (Hidden on Mobile) */}
<div className="hidden md:block overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
<th className="p-4 font-semibold">Name</th>
<th className="p-4 font-semibold">Email</th>
{activeTab === 'students' ? <th className="p-4 font-semibold">Class/Group</th> : <th className="p-4 font-semibold">Access</th>}
<th className="p-4 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-slate-100">
{list.map(u => (
<tr key={u.id} className="hover:bg-slate-50 transition">
<td className="p-4 font-medium text-slate-900">{u.name}</td>
<td className="p-4 text-slate-600">{u.email}</td>
{activeTab === 'students' ? (
<td className="p-4 text-slate-600"><span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold mr-2">{u.classLabel}</span><span className="text-xs">{u.groupLabel}</span></td>
) : (
<td className="p-4 text-slate-600 text-xs">{activeTab === 'teachers' ? (u.level + ' - ' + u.subject) : 'Full Admin'}</td>
)}
<td className="p-4 text-right space-x-2">
{activeTab === 'students' && (
<button onClick={() => openUserProfile(u.id)} className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg">See Profile</button>
)}
<button onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"><i className="fa-solid fa-eye"></i></button>
<button onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }} className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><i className="fa-solid fa-key"></i></button>
</td>
</tr>
))}
{list.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">No users found.</td></tr>}
</tbody>
</table>
</div>

{/* MOBILE CARD VIEW (Hidden on PC) */}
<div className="md:hidden divide-y divide-slate-100">
{list.map(u => (
<div key={u.id} className="p-4 flex flex-col gap-3">
<div className="flex justify-between items-start gap-3">
<div className="min-w-0 flex-1">
<div className="font-bold text-slate-900 truncate">{u.name}</div>
<div className="text-xs text-slate-500 truncate">{u.email}</div>
</div>
<div className="flex shrink-0 gap-2">
{activeTab === 'students' && (
<button onClick={() => openUserProfile(u.id)} className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg shadow-sm"><i className="fa-solid fa-user"></i></button>
)}
<button onClick={() => { setSelectedUser(u); setActionType('reveal'); setModalMessage(''); }} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg shadow-sm"><i className="fa-solid fa-eye"></i></button>
<button onClick={() => { setSelectedUser(u); setActionType('reset'); setModalMessage(''); }} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg shadow-sm"><i className="fa-solid fa-key"></i></button>
</div>
</div>

<div className="flex items-center justify-between pt-2 border-t border-slate-50">
{activeTab === 'students' ? (
<div className="flex items-center gap-2">
<span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{u.classLabel}</span>
<span className="text-xs font-medium text-slate-600">{u.groupLabel}</span>
</div>
) : (
<div className="text-xs text-slate-600">
<span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mr-1">Access:</span>
{activeTab === 'teachers' ? (u.level + ' \u2022 ' + u.subject) : 'Full Admin'}
</div>
)}
</div>
</div>
))}
{list.length === 0 && <div className="p-8 text-center text-slate-400">No users found.</div>}
</div>
</div>
);

return (
<AdminShell title="User Management" subtitle="Manage students, teachers, and admins." activeTab="users" onNavigate={onNavigate}>
<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
<div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
<div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto no-scrollbar">
{['students', 'teachers', 'admins'].map(tab => (
<button key={tab} onClick={() => setActiveTab(tab)} className={\`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap \${activeTab === tab ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}\`}>{tab}</button>
))}
</div>
<button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg shadow-indigo-200 transition">
<i className="fa-solid fa-plus mr-2"></i> Add {activeTab.slice(0, -1)}
</button>
</div>

{isLoading ? <div className="text-center py-12"><i className="fa-solid fa-circle-notch fa-spin text-indigo-600 text-xl"></i></div> : renderTable(users[activeTab] || [])}

{/* REVEAL / RESET MODAL */}
{selectedUser && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
<h3 className="text-lg font-bold text-slate-900 mb-4">{actionType === 'reveal' ? 'Security Check' : 'Reset Password'}</h3>
<p className="text-sm text-slate-500 mb-4">Action for user: <span className="font-semibold text-slate-900">{selectedUser.name}</span></p>
<div className="space-y-4">
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Admin Password</label><input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Confirm your identity" /></div>
{actionType === 'reset' && <div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">New Password</label><input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Enter new password" /></div>}
{modalMessage && <div className="p-3 bg-slate-50 text-slate-700 text-xs rounded-lg border border-slate-200 break-all font-mono">{modalMessage}</div>}
<div className="flex gap-3 pt-2">
<button onClick={handleAction} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg">Confirm</button>
<button onClick={() => setSelectedUser(null)} className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg">Close</button>
</div>
</div>
</div>
</div>
)}

{/* CREATE USER MODAL */}
{isCreateOpen && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
<div className="flex justify-between items-center mb-6">
<h3 className="text-lg font-bold text-slate-900">Add New {activeTab.slice(0, -1)}</h3>
<button onClick={() => setIsCreateOpen(false)}><i className="fa-solid fa-xmark text-slate-400 hover:text-slate-600 text-xl"></i></button>
</div>
<div className="space-y-4">
<div className="grid grid-cols-2 gap-4">
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Name</label><input value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label><input value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>
</div>
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label><input type="password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg" /></div>

{/* Student Fields */}
{activeTab === 'students' && (
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Class</label>
<select value={createForm.classLabel} onChange={e => {
const nextClass = e.target.value;
setCreateForm({
...createForm,
classLabel: nextClass,
groupLabel: nextClass === 'SSC' || nextClass === 'HSC' ? createForm.groupLabel : ''
});
}} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
<option>SSC</option>
<option>HSC</option>
<option value="6">Class 6</option>
<option value="7">Class 7</option>
<option value="8">Class 8</option>
</select>
</div>
<div>
<label className="block text-xs font-bold uppercase text-slate-400 mb-1">Group</label>
<select value={createForm.groupLabel} onChange={e => setCreateForm({...createForm, groupLabel: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white" disabled={!(createForm.classLabel === 'SSC' || createForm.classLabel === 'HSC')}>
<option>Science</option>
<option>Humanities</option>
<option>Business Studies</option>
</select>
</div>
</div>
)}

{/* Teacher Fields */}
{activeTab === 'teachers' && (
<div className="grid grid-cols-2 gap-4">
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Level</label><select value={createForm.level} onChange={e => setCreateForm({...createForm, level: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white"><option>SSC</option><option>HSC</option></select></div>
<div><label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
<select value={createForm.subject} onChange={e => setCreateForm({...createForm, subject: e.target.value})} className="w-full p-3 border border-slate-200 rounded-lg bg-white">
<option value="">Select...</option>
{getTeacherSubjects(createForm.level).map(s => <option key={s} value={s}>{s}</option>)}
</select>
</div>
</div>
)}

<button onClick={handleCreateUser} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition mt-4">Create Account</button>
</div>
</div>
</div>
)}
</div>
</AdminShell>
);
};
`;var Sa=`
${fa}
${va}
`;var Je=`
    const DashboardModule = (() => {
`+la+da+pa+ua+ma+ha+ga+ba+Sa+ya+`
    })();

    const {
        AdminDashboard,
        AdminGroupSelection,
        AdminGroupDetail,
        AdminUserList,
        AdminStudentProfile,
        BanglaFirstPaperTopics,
        BanglaShahitto,
        BanglaShohopath,
        BanglaTextList,
        BanglaItemDetail,
        SrijonshilTypeList,
        SrijonshilQuestionList,
        McqQuestionList,
        IctChapterList,
        ReligionSelectionList,
        ScienceChapterList,
        ScienceTopicList,
        ScienceTopicDetail,
        VideoManager,
        EnglishFirstPaperHome,
        EnglishSectionList,
        EnglishQuestionList
    } = DashboardModule;
`;var xa=`
        // 4. Main Admin Settings Controller
        const AdminSettings = ({ onNavigate }) => {
            const [activePanel, setActivePanel] = useState('main'); // 'main', 'profile', 'danger'

            // Render Sub-Panels
            if (activePanel === 'profile') {
                return <ProfileManagement onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }
            if (activePanel === 'danger') {
                return <DangerZonePanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
            }

            // Render Main List View - Compact "Clean Type" Visual
            return (
                <AdminShell title="Settings" subtitle="System preferences" activeTab="settings" onNavigate={onNavigate}>
                    <div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
                        
                        {/* Profile Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('profile')} 
                            className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-user-gear text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Profile Settings</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
                        </button>

                        {/* Danger Zone Option - Narrow & Clean */}
                        <button 
                            onClick={() => setActivePanel('danger')} 
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50/30 transition text-left group"
                        >
                            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                                    <i className="fa-solid fa-triangle-exclamation text-sm"></i>
                            </div>
                            <div className="flex-1">
                                    <div className="font-medium text-slate-700 text-sm">Danger Zone</div>
                            </div>
                            <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-rose-400"></i>
                        </button>

                    </div>
                </AdminShell>
            );
        };

        const TeacherSettings = ({ onNavigate }) => {
            return <ProfileManagement onNavigate={onNavigate} shell="teacher" />;
        };
`;var Na=`
        // 3. Danger Zone Component
        const DangerZonePanel = ({ onBack, onNavigate }) => {
            const [statusMessage, setStatusMessage] = useState(null);
            const [hardResetPassword, setHardResetPassword] = useState('');

            const handleHardReset = async () => {
                if (!hardResetPassword) return setStatusMessage('Password required.');
                if(!confirm('HARD RESET: Wipes ALL data. Cannot be undone.')) return;
                const token = localStorage.getItem('auth_token');
                const res = await fetch('/api/settings/hard-reset', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ password: hardResetPassword }) });
                const data = await res.json();
                if (data.success) { localStorage.removeItem('auth_token'); window.location.href = '/register'; }
                else setStatusMessage(data.error);
            };

            return (
                 <AdminShell title="System Reset" subtitle="Danger Zone" activeTab="settings" onNavigate={onNavigate}>
                    <div className="animate-fade-in max-w-2xl">
                        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 shadow-sm">
                            <h3 className="text-rose-700 font-bold mb-4 flex items-center gap-2 text-lg">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                Danger Zone
                            </h3>
                            <p className="text-sm text-rose-800/80 mb-6 leading-relaxed">
                                You are about to perform a Hard Reset. This will <strong>permanently delete</strong> all database content, including users, classes, subjects, and files. This action is irreversible.
                            </p>
                            
                            <div className="space-y-4 bg-white p-5 rounded-lg border border-rose-100">
                                <div>
                                    <label className="block text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Admin Password</label>
                                    <input 
                                        type="password" 
                                        value={hardResetPassword} 
                                        onChange={e => setHardResetPassword(e.target.value)} 
                                        className="w-full p-3 text-sm border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" 
                                        placeholder="Enter password to confirm"
                                    />
                                </div>
                                
                                <button 
                                    onClick={handleHardReset} 
                                    className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition shadow-sm flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-radiation"></i>
                                    NUKE SITE (Hard Reset)
                                </button>
                            </div>
                            
                            {statusMessage && <p className="text-sm text-rose-700 mt-4 font-medium text-center bg-rose-100 p-2 rounded">{statusMessage}</p>}
                        </div>
                        
                        <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
                            <i className="fa-solid fa-arrow-left"></i> Back
                        </button>
                    </div>
                </AdminShell>
            );
        };
`;var Ca=`
        // --- HELPERS ---
        const resizeImageFile = (file, { maxWidth = 520, maxHeight = 650, quality = 0.82 } = {}) =>
            new Promise((resolve) => {
                if (!file || !(file instanceof File)) { resolve(file); return; }
                const image = new Image();
                const objectUrl = URL.createObjectURL(file);
                image.onload = () => {
                    const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
                    const targetWidth = Math.max(1, Math.round(image.width * ratio));
                    const targetHeight = Math.max(1, Math.round(image.height * ratio));
                    const canvas = document.createElement('canvas');
                    canvas.width = targetWidth; canvas.height = targetHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                    canvas.toBlob((blob) => { URL.revokeObjectURL(objectUrl); resolve(new File([blob], file.name, { type: 'image/jpeg' })); }, 'image/jpeg', quality);
                };
                image.src = objectUrl;
            });

        const appendTokenToAvatarUrl = (avatarUrl, token) => {
            if (!avatarUrl || !token) return avatarUrl;
            try {
                const resolved = new URL(avatarUrl, window.location.origin);
                resolved.searchParams.set('token', token);
                return resolved.pathname + resolved.search;
            } catch (error) {
                return avatarUrl;
            }
        };

        const parseApiResponse = async (response, fallbackMessage) => {
            const data = await response.json().catch(() => null);
            if (response.ok && data?.success) {
                return { ok: true, data };
            }
            const errorMessage = data?.error || data?.message || (fallbackMessage + ' (status ' + response.status + ')');
            return { ok: false, data, errorMessage };
        };

        const useProfileData = () => {
            const [profile, setProfile] = useState(null);
            const [history, setHistory] = useState([]);
            const [isLoading, setIsLoading] = useState(true);
            
            const loadProfile = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoading(false); return; }
                try {
                    const [profileRes, historyRes] = await Promise.all([ 
                        fetch('/api/profile', { headers: { Authorization: 'Bearer ' + token } }), 
                        fetch('/api/profile/history', { headers: { Authorization: 'Bearer ' + token } }) 
                    ]);
                    const pData = await profileRes.json(); 
                    const hData = await historyRes.json();
                    
                    if (pData.success) {
                        const profileWithToken = {
                            ...pData.profile,
                            avatarUrl: appendTokenToAvatarUrl(pData.profile?.avatarUrl, token)
                        };
                        setProfile(profileWithToken);
                    }
                    if (hData.success) setHistory(hData.entries || []);
                } catch (e) {} finally { setIsLoading(false); }
            };
            
            useEffect(() => { loadProfile(); }, []);
            return { profile, history, isLoading, refreshProfile: loadProfile, setProfile };
        };
`;var wa=`
        // 2. Change Password Component
        const ChangePasswordPanel = ({ onNavigate, onBack, shell = 'admin' }) => {
            const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
            const [statusMessage, setStatusMessage] = useState(null);
            const [isSaving, setIsSaving] = useState(false);
            const ShellComponent = shell === 'teacher' ? TeacherShell : shell === 'student' ? StudentShell : AdminShell;

            const handleSubmit = async () => {
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setStatusMessage('Please log in again.');
                    setIsSaving(false);
                    return;
                }
                const response = await fetch('/api/change-password', {
                    method: 'POST',
                    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify(form)
                });
                const data = await response.json();
                if (data.success) {
                    setStatusMessage('Password updated successfully.');
                    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                    setStatusMessage(data.error || 'Password update failed.');
                }
                setIsSaving(false);
            };

            return (
                <ShellComponent title="Change Password" subtitle="Keep your account secure" activeTab="settings" onNavigate={onNavigate}>
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl shadow-sm animate-fade-in">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    value={form.currentPassword}
                                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    value={form.newPassword}
                                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="Re-enter new password"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Update Password'}
                            </button>
                            {statusMessage && <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">{statusMessage}</div>}
                        </div>
                    </div>
                    {onBack && <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
                </ShellComponent>
            );
        };
`;var Ta=`
        // 1. Profile Editor Component
        const ProfileManagement = ({ onNavigate, onBack, showHistory, shell = 'admin' }) => {
            const { profile, history, refreshProfile, setProfile } = useProfileData();
            const [statusMessage, setStatusMessage] = useState(null);
            const [nameInput, setNameInput] = useState('');
            const [isSaving, setIsSaving] = useState(false);
            const [avatarFile, setAvatarFile] = useState(null);
            const [avatarPreview, setAvatarPreview] = useState('');
            const ShellComponent = shell === 'teacher' ? TeacherShell : shell === 'student' ? StudentShell : AdminShell;

            useEffect(() => { if (profile?.name) setNameInput(profile.name); }, [profile?.name]);
            useEffect(() => { if (avatarFile) setAvatarPreview(URL.createObjectURL(avatarFile)); }, [avatarFile]);

            const handleProfileSave = async () => {
                setIsSaving(true);
                setStatusMessage(null);
                const token = localStorage.getItem('auth_token');
                if (!token) { setStatusMessage('Please log in again.'); setIsSaving(false); return; }

                const messages = [];
                const errors = [];
                const trimmedName = nameInput.trim();
                const shouldUpdateName = trimmedName && trimmedName !== profile?.name;

                if (shouldUpdateName) {
                    const response = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: trimmedName })
                    });
                    const { ok, errorMessage } = await parseApiResponse(response, 'Profile update failed.');
                    if (ok) {
                        messages.push('Name updated.');
                        setProfile(p => ({...p, name: trimmedName}));
                    } else {
                        errors.push(errorMessage);
                    }
                }

                if (avatarFile) {
                    const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
                    const formData = new FormData(); formData.append('file', resized || avatarFile);
                    const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
                    const { ok, errorMessage } = await parseApiResponse(response, 'Avatar upload failed.');
                    if (ok) { 
                        messages.push('Picture updated.');
                        setAvatarFile(null);
                        setAvatarPreview('');
                        await refreshProfile(); 
                    } else {
                        errors.push(errorMessage);
                    }
                }

                if (errors.length) {
                    setStatusMessage(errors[0]);
                } else if (messages.length) {
                    setStatusMessage(messages.join(' '));
                } else {
                    setStatusMessage('No changes to save.');
                }
                setIsSaving(false);
            };

            return (
                <ShellComponent title="Edit Profile" subtitle="Update personal details" activeTab="settings" onNavigate={onNavigate}>
                    <div className="animate-fade-in bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <div className="w-28 h-28 sm:w-24 sm:h-24 bg-slate-100 rounded-full border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
                                <img 
                                    src={avatarPreview || profile?.avatarUrl} 
                                    className="w-full h-full object-cover" 
                                    alt="Profile"
                                    onError={(e) => { e.target.style.display = 'none'; }} 
                                />
                                {(!avatarPreview && !profile?.avatarUrl) && (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <i className="fa-solid fa-user text-4xl"></i>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Change Photo</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setAvatarFile(e.target.files[0])} 
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer mx-auto sm:mx-0"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={nameInput} 
                                        onChange={e => setNameInput(e.target.value)} 
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
                                        placeholder="Display Name"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={handleProfileSave} 
                                        disabled={isSaving} 
                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                                {statusMessage && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-medium animate-fade-in text-center sm:text-left">{statusMessage}</div>}
                            </div>
                        </div>
                    </div>
                    {onBack && <button onClick={onBack} className="mt-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
                </ShellComponent>
            );
        };
`;var Ea=`
const StudentProfilePanel = ({ onNavigate, onBack }) => {
const { profile, refreshProfile, setProfile } = useProfileData();
const [statusMessage, setStatusMessage] = useState(null);
const [nameInput, setNameInput] = useState('');
const [isSaving, setIsSaving] = useState(false);
const [avatarFile, setAvatarFile] = useState(null);
const [avatarPreview, setAvatarPreview] = useState('');
const [details, setDetails] = useState({
email: '',
religion: '',
classLabel: '',
groupLabel: '',
dateOfBirth: '',
batchYear: ''
});
const [isLoadingDetails, setIsLoadingDetails] = useState(true);
const [detailsMessage, setDetailsMessage] = useState('');

useEffect(() => { if (profile?.name) setNameInput(profile.name); }, [profile?.name]);
useEffect(() => { if (avatarFile) setAvatarPreview(URL.createObjectURL(avatarFile)); }, [avatarFile]);

const handleProfileSave = async () => {
setIsSaving(true);
setStatusMessage(null);
const token = localStorage.getItem('auth_token');
if (!token) { setStatusMessage('Please log in again.'); setIsSaving(false); return; }

const messages = [];
const errors = [];
const trimmedName = nameInput.trim();
const shouldUpdateName = trimmedName && trimmedName !== profile?.name;

if (shouldUpdateName) {
const response = await fetch('/api/profile', {
method: 'PUT',
headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
body: JSON.stringify({ name: trimmedName })
});
const data = await response.json();
if (response.ok && data.success) {
messages.push('Name updated.');
setProfile(p => ({...p, name: trimmedName}));
} else {
errors.push(data.error || 'Profile update failed.');
}
}

if (avatarFile) {
const resized = await resizeImageFile(avatarFile, { maxWidth: 480, maxHeight: 480, quality: 0.8 });
const formData = new FormData(); formData.append('file', resized || avatarFile);
const response = await fetch('/api/profile/avatar', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body: formData });
const data = await response.json();
if (response.ok && data.success) { 
messages.push('Picture updated.');
setAvatarFile(null);
setAvatarPreview('');
await refreshProfile(); 
} else {
errors.push(data.error || 'Avatar upload failed.');
}
}

if (errors.length) {
setStatusMessage(errors[0]);
} else if (messages.length) {
setStatusMessage(messages.join(' '));
} else {
setStatusMessage('No changes to save.');
}
setIsSaving(false);
};

const computeAge = (dob) => {
if (!dob) return '';
const birthDate = new Date(dob);
if (Number.isNaN(birthDate.getTime())) return '';
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
age -= 1;
}
return age >= 0 ? String(age) : '';
};

const loadDetails = async () => {
const token = localStorage.getItem('auth_token');
if (!token) { setIsLoadingDetails(false); return; }
try {
const res = await fetch('/api/student/profile', { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setDetails({
email: data.profile?.email || '',
religion: data.profile?.religion || '',
classLabel: data.profile?.classLabel || '',
groupLabel: data.profile?.groupLabel || '',
dateOfBirth: data.profile?.dateOfBirth || '',
batchYear: data.profile?.batchYear || ''
});
}
} catch (e) {} finally { setIsLoadingDetails(false); }
};

useEffect(() => { loadDetails(); }, []);

const handleDetailsSave = async () => {
setIsSaving(true);
setDetailsMessage('');
const token = localStorage.getItem('auth_token');
if (!token) { setIsSaving(false); return; }
try {
const res = await fetch('/api/student/profile', {
method: 'PUT',
headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
body: JSON.stringify({
religion: details.religion,
classLabel: details.classLabel,
groupLabel: details.classLabel === 'SSC' || details.classLabel === 'HSC' ? details.groupLabel : '',
dateOfBirth: details.dateOfBirth,
batchYear: details.classLabel === 'SSC' || details.classLabel === 'HSC' ? details.batchYear : ''
})
});
const { ok, data, errorMessage } = await parseApiResponse(res, 'Update failed.');
if (ok) {
setDetailsMessage(data.pointsAwarded ? 'Profile updated and 10 points added!' : 'Profile updated.');
} else {
setDetailsMessage(errorMessage);
}
} catch (e) {
setDetailsMessage('Update failed. Please try again.');
}
setIsSaving(false);
};

const age = computeAge(details.dateOfBirth);
const showGroup = details.classLabel === 'SSC' || details.classLabel === 'HSC';

return (
<StudentShell title="Profile" subtitle="Update your profile and details" activeTab="settings" onNavigate={onNavigate}>
<div className="space-y-6 animate-fade-in">
<div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm">
<div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
<div className="w-28 h-28 sm:w-24 sm:h-24 bg-slate-100 rounded-full border-2 border-slate-100 overflow-hidden flex-shrink-0 shadow-sm">
<img 
src={avatarPreview || profile?.avatarUrl} 
className="w-full h-full object-cover" 
alt="Profile"
onError={(e) => { e.target.style.display = 'none'; }} 
/>
{(!avatarPreview && !profile?.avatarUrl) && (
<div className="w-full h-full flex items-center justify-center text-slate-300">
<i className="fa-solid fa-user text-4xl"></i>
</div>
)}
</div>

<div className="flex-1 space-y-4 w-full text-center sm:text-left">
<div className="space-y-1">
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Change Photo</label>
<input 
type="file" 
onChange={e => setAvatarFile(e.target.files[0])} 
className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer mx-auto sm:mx-0"
/>
</div>

<div className="space-y-1">
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
<input 
type="text" 
value={nameInput} 
onChange={e => setNameInput(e.target.value)} 
className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" 
placeholder="Display Name"
/>
</div>

<div className="pt-2">
<button 
onClick={handleProfileSave} 
disabled={isSaving} 
className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
>
{isSaving ? 'Saving...' : 'Save Changes'}
</button>
</div>

{statusMessage && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-medium animate-fade-in text-center sm:text-left">{statusMessage}</div>}
</div>
</div>
</div>

<div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl shadow-sm space-y-5">
{isLoadingDetails ? (
<div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading profile...</div>
) : (
<>
<div className="grid gap-4 sm:grid-cols-2">
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
<input value={details.email} disabled className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Religion</label>
<select value={details.religion} onChange={e => setDetails({ ...details, religion: e.target.value })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white">
<option value="">Select religion</option>
<option value="Islam">Islam</option>
<option value="Hinduism">Hinduism</option>
<option value="Buddhism">Buddhism</option>
<option value="Christianity">Christianity</option>
<option value="Other">Other</option>
</select>
</div>
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Class Level</label>
<select value={details.classLabel} onChange={e => setDetails({ ...details, classLabel: e.target.value, groupLabel: e.target.value === 'SSC' || e.target.value === 'HSC' ? details.groupLabel : '' })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white">
<option value="">Select class</option>
<option value="SSC">SSC</option>
<option value="HSC">HSC</option>
<option value="6">Class 6</option>
<option value="7">Class 7</option>
<option value="8">Class 8</option>
</select>
</div>
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Group</label>
<select value={details.groupLabel} onChange={e => setDetails({ ...details, groupLabel: e.target.value })} disabled={!showGroup} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-white disabled:bg-slate-50 disabled:text-slate-400">
<option value="">Select group</option>
<option value="Science">Science</option>
<option value="Humanities">Humanities</option>
<option value="Business Studies">Business Studies</option>
</select>
</div>
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
<input type="date" value={details.dateOfBirth} onChange={e => setDetails({ ...details, dateOfBirth: e.target.value })} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm" />
</div>
<div>
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
<input value={age} disabled className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
</div>
<div className="sm:col-span-2">
<label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">SSC/HSC Batch Year</label>
<input value={details.batchYear} onChange={e => setDetails({ ...details, batchYear: e.target.value })} disabled={!showGroup} className="w-full mt-1 p-3 border border-slate-200 rounded-lg text-sm disabled:bg-slate-50 disabled:text-slate-400" placeholder="e.g. 2026" />
</div>
</div>

<div className="pt-2 flex flex-col sm:flex-row gap-3">
<button onClick={handleDetailsSave} disabled={isSaving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50">
{isSaving ? 'Saving...' : 'Save Details'}
</button>
</div>

{detailsMessage && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">{detailsMessage}</div>}
</>
)}
</div>

{onBack && <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"><i className="fa-solid fa-arrow-left"></i> Back</button>}
</div>
</StudentShell>
);
};

const StudentPointsPanel = ({ onNavigate, onBack }) => {
const [points, setPoints] = useState(0);
const [logs, setLogs] = useState([]);
const [isLoading, setIsLoading] = useState(true);

const loadPoints = async () => {
const token = localStorage.getItem('auth_token');
if (!token) { setIsLoading(false); return; }
try {
const res = await fetch('/api/points', { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setPoints(data.points || 0);
setLogs(data.logs || []);
}
} catch (e) {} finally { setIsLoading(false); }
};

useEffect(() => { loadPoints(); }, []);

return (
<StudentShell title="My Points" subtitle="Track your achievements" activeTab="settings" onNavigate={onNavigate}>
<div className="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl shadow-sm space-y-6 animate-fade-in">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<div>
<div className="text-xs uppercase tracking-wider text-slate-400">Total Points</div>
<div className="text-3xl font-semibold text-slate-900">{points}</div>
</div>
{onBack && <button onClick={onBack} className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">Back</button>}
</div>
{isLoading ? (
<div className="text-center text-sm text-slate-500"><i className="fa-solid fa-circle-notch fa-spin mr-2"></i>Loading points...</div>
) : (
<div className="space-y-3">
{logs.length === 0 && <div className="text-sm text-slate-500">No points earned yet.</div>}
{logs.map((log, index) => (
<div key={log.createdAt + '-' + index} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
<div>
<div className="text-sm font-semibold text-slate-800">{log.reason === 'profile_complete' ? 'Profile completed' : log.reason}</div>
<div className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</div>
</div>
<div className="text-sm font-bold text-emerald-600">+{log.points}</div>
</div>
))}
</div>
)}
</div>
</StudentShell>
);
};

const StudentSettings = ({ onNavigate }) => {
const [activePanel, setActivePanel] = useState('main');

if (activePanel === 'profile') {
return <StudentProfilePanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
}
if (activePanel === 'points') {
return <StudentPointsPanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} />;
}
if (activePanel === 'password') {
return <ChangePasswordPanel onNavigate={onNavigate} onBack={() => setActivePanel('main')} shell="student" />;
}

return (
<StudentShell title="Settings" subtitle="Account preferences" activeTab="settings" onNavigate={onNavigate}>
<div className="max-w-xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-fade-in">
<button
onClick={() => setActivePanel('profile')}
className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
>
<div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
<i className="fa-solid fa-user-gear text-sm"></i>
</div>
<div className="flex-1">
<div className="font-medium text-slate-700 text-sm">Profile</div>
</div>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>

<button
onClick={() => setActivePanel('points')}
className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left group"
>
<div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
<i className="fa-solid fa-coins text-sm"></i>
</div>
<div className="flex-1">
<div className="font-medium text-slate-700 text-sm">My Points</div>
</div>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-emerald-400"></i>
</button>

<button
onClick={() => setActivePanel('password')}
className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition text-left group"
>
<div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
<i className="fa-solid fa-key text-sm"></i>
</div>
<div className="flex-1">
<div className="font-medium text-slate-700 text-sm">Change Password</div>
</div>
<i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-indigo-400"></i>
</button>
</div>
</StudentShell>
);
};
`;var Ze=`
        const AdminSettingsModule = (() => {
${Ca}
${Ta}
${wa}
${Na}
${xa}
${Ea}

        return { AdminSettings, TeacherSettings, StudentSettings };
        })();
        const { AdminSettings, TeacherSettings, StudentSettings } = AdminSettingsModule;
`;var et=`
const StudentClassView = ({ user, onNavigate }) => {
const [profile, setProfile] = useState(null);
const [pointsSummary, setPointsSummary] = useState({ points: 0, logs: [] });
const [showPrompt, setShowPrompt] = useState(false);
const [isLoadingProfile, setIsLoadingProfile] = useState(true);
const [isLoadingPoints, setIsLoadingPoints] = useState(true);

const classLabel = profile?.classLabel || user?.classLabel || user?.class_label || '';
const groupLabel = profile?.groupLabel || user?.groupLabel || user?.group_label || '';
const isAcademicClass = classLabel === 'SSC' || classLabel === 'HSC';
const hasClass = Boolean(classLabel);
const classSubjects = classLabel === 'HSC' ? hscSubjects : sscSubjects;
const subjectPool = Array.isArray(classSubjects) ? classSubjects : [];
const normalizedGroup = groupLabel || 'Common';
const filteredSubjects = subjectPool.filter((subject) => {
if (!groupLabel) return subject.groupLabel === 'Common';
const groups = subject.groups || [];
return groups.includes(groupLabel) || subject.groupLabel === 'Common';
});
const classRoute = classLabel === 'HSC' ? 'hsc-subjects' : 'ssc-subjects';

useEffect(() => {
const loadProfile = async () => {
const token = localStorage.getItem('auth_token');
if (!token) { setIsLoadingProfile(false); return; }
try {
const res = await fetch('/api/student/profile', { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setProfile(data.profile);
const needsClass = !data.profile?.classLabel;
const needsGroup = (data.profile?.classLabel === 'SSC' || data.profile?.classLabel === 'HSC') && !data.profile?.groupLabel;
const needsBatch = (data.profile?.classLabel === 'SSC' || data.profile?.classLabel === 'HSC') && !data.profile?.batchYear;
const needsReligion = !data.profile?.religion;
const needsDob = !data.profile?.dateOfBirth;
if (needsClass || needsGroup || needsBatch || needsReligion || needsDob) {
setShowPrompt(true);
}
}
} catch (e) {} finally { setIsLoadingProfile(false); }
};
loadProfile();
}, []);

useEffect(() => {
const loadPoints = async () => {
const token = localStorage.getItem('auth_token');
if (!token) { setIsLoadingPoints(false); return; }
try {
const res = await fetch('/api/points', { headers: { Authorization: 'Bearer ' + token } });
const data = await res.json();
if (data.success) {
setPointsSummary({ points: data.points || 0, logs: data.logs || [] });
}
} catch (e) {} finally { setIsLoadingPoints(false); }
};
loadPoints();
}, []);

const countEntriesForClass = (store) => {
if (!hasClass) return 0;
const prefix = classLabel + '-';
return Object.entries(store || {}).reduce((total, [key, value]) => {
if (!String(key).startsWith(prefix)) return total;
return total + (Array.isArray(value) ? value.length : 0);
}, 0);
};

const notesCount = countEntriesForClass(notesByItem);
const videosCount = countEntriesForClass(videosByItem);
const mcqCount = countEntriesForClass(mcqQuestions);
const srijonshilCount = countEntriesForClass(srijonshilQuestions);
const englishCount = countEntriesForClass(englishQuestions);
const totalQuestions = mcqCount + srijonshilCount + englishCount;

const checklist = [
{ label: 'Class', complete: Boolean(classLabel) },
{ label: 'Group', complete: !isAcademicClass || Boolean(groupLabel) },
{ label: 'Batch year', complete: !isAcademicClass || Boolean(profile?.batchYear) },
{ label: 'Religion', complete: Boolean(profile?.religion) },
{ label: 'Date of birth', complete: Boolean(profile?.dateOfBirth) }
];

return (
<StudentShell
title="My Class"
subtitle={hasClass ? classLabel + (groupLabel ? ' • ' + groupLabel : '') + ' learning space' : 'Complete your profile to see content'}
activeTab="class"
onNavigate={onNavigate}
>
<div className="space-y-6">
<div className="border border-slate-200 p-4">
<div className="flex flex-wrap items-center justify-between gap-4">
<div>
<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Your Class</div>
<div className="mt-2 text-2xl font-semibold text-slate-900">
{hasClass ? classLabel : 'Profile incomplete'}
</div>
{hasClass && (
<div className="mt-1 text-sm text-slate-500">
{groupLabel ? groupLabel + ' group' : 'General group'}
</div>
)}
</div>
{hasClass && isAcademicClass && (
<button
onClick={() => onNavigate(classRoute)}
className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition"
>
View full library
</button>
)}
</div>
{!hasClass && (
<div className="text-sm text-slate-500">
Add your class, group, and other details to unlock your learning dashboard.
</div>
)}
{hasClass && !isAcademicClass && (
<div className="text-sm text-slate-500">
Content for this class level is on the way. Keep your profile updated for new releases.
</div>
)}
</div>

<div className="grid gap-4 lg:grid-cols-2">
<div className="border border-slate-200 p-4">
<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Learning summary</div>
<div className="mt-3 grid gap-3 sm:grid-cols-2">
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Subjects available</div>
<div className="text-lg font-semibold text-slate-900">{filteredSubjects.length}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Notes</div>
<div className="text-lg font-semibold text-slate-900">{notesCount}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Videos</div>
<div className="text-lg font-semibold text-slate-900">{videosCount}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Questions</div>
<div className="text-lg font-semibold text-slate-900">{totalQuestions}</div>
</div>
</div>
</div>

<div className="border border-slate-200 p-4">
<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Profile checklist</div>
<div className="mt-3 grid gap-3 sm:grid-cols-2">
{checklist.map((item) => (
<div key={item.label} className="border border-slate-200 p-3 text-sm flex items-center justify-between">
<span className="text-slate-700">{item.label}</span>
<span className={item.complete ? 'text-emerald-600 font-semibold' : 'text-amber-500 font-semibold'}>
{item.complete ? 'Complete' : 'Missing'}
</span>
</div>
))}
</div>
</div>
</div>

<div className="border border-slate-200 p-4">
<div className="flex items-center justify-between">
<div className="text-xs uppercase tracking-[0.25em] text-slate-400">Points activity</div>
<button onClick={() => onNavigate('student-settings')} className="text-xs font-semibold text-indigo-600">Update profile</button>
</div>
<div className="mt-3 grid gap-3 sm:grid-cols-2">
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Total points</div>
<div className="text-lg font-semibold text-slate-900">{pointsSummary.points}</div>
</div>
<div className="border border-slate-200 p-3">
<div className="text-xs text-slate-500">Recent rewards</div>
<div className="text-lg font-semibold text-slate-900">{pointsSummary.logs.length}</div>
</div>
</div>
<div className="mt-3 space-y-3">
{isLoadingPoints && <div className="text-sm text-slate-400">Loading points...</div>}
{!isLoadingPoints && pointsSummary.logs.length === 0 && (
<div className="text-sm text-slate-500">No points earned yet.</div>
)}
{pointsSummary.logs.map((log, index) => (
<div key={log.reason + '-' + index} className="border border-slate-200 p-3 text-sm">
<div className="flex items-center justify-between">
<div className="font-semibold text-slate-800">{log.reason}</div>
<div className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</div>
</div>
<div className="text-xs text-slate-500 mt-1">Points {log.points}</div>
</div>
))}
</div>
</div>

{hasClass && isAcademicClass && (
<div className="space-y-3">
<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Subjects</div>
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
{filteredSubjects.map((subject) => (
<button
key={subject.subjectKey}
onClick={() => subject.route && onNavigate(subject.route)}
className="group w-full text-left border border-slate-200 p-4 transition"
>
<div className="flex items-start gap-4">
<div className={'w-10 h-10 rounded-md text-white flex items-center justify-center ' + subject.accent}>
<i className={'fa-solid ' + subject.icon}></i>
</div>
<div className="flex-1">
<div className="text-sm font-semibold text-slate-900">{subject.title}</div>
{subject.subtitle && <div className="text-xs text-slate-500 mt-1">{subject.subtitle}</div>}
<div className="text-xs text-slate-400 mt-2">
{subject.groupLabel === 'Common' ? 'Common subject' : normalizedGroup + ' group'}
</div>
</div>
</div>
<div className="mt-3 text-xs font-semibold text-indigo-600">Open subject</div>
</button>
))}
{filteredSubjects.length === 0 && (
<div className="col-span-full border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
Select your group in settings to see your subjects.
</div>
)}
</div>
</div>
)}

{showPrompt && !isLoadingProfile && (
<div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
<i className="fa-solid fa-star"></i>
</div>
<div>
<div className="text-lg font-semibold text-slate-900">Complete your profile</div>
<div className="text-sm text-slate-500">Finish your details and earn 10 points.</div>
</div>
</div>
<div className="mt-5 flex flex-col sm:flex-row gap-3">
<button onClick={() => { setShowPrompt(false); onNavigate('student-settings'); }} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">
Update now
</button>
<button onClick={() => setShowPrompt(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50">
Remind me later
</button>
</div>
</div>
</div>
)}
</div>
</StudentShell>
);
};
`;var tt=`
    const TeacherDashboard = ({ assignment, subjectConfig, onNavigate }) => {
        const hasAssignment = assignment && assignment.level && assignment.subject;
        const [dashboard, setDashboard] = useState(null);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const loadDashboard = async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) { setIsLoading(false); return; }
                try {
                    const response = await fetch('/api/dashboard/teacher', { headers: { Authorization: 'Bearer ' + token } });
                    const data = await response.json();
                    if (data.success) { setDashboard(data); }
                } catch (error) {} finally { setIsLoading(false); }
            };
            loadDashboard();
        }, []);

        const countTopics = (chapters) => (chapters || []).reduce((total, chapter) => total + (chapter?.topics?.length || 0), 0);
        const countEntries = (store, prefix) => {
            if (!prefix) return 0;
            return Object.entries(store || {}).reduce((total, [key, value]) => {
                if (!String(key).startsWith(prefix)) return total;
                return total + (Array.isArray(value) ? value.length : 0);
            }, 0);
        };

        const getSubjectStats = () => {
            if (!hasAssignment) return null;
            const level = assignment.level;
            const subject = String(assignment.subject || '').toLowerCase();
            let chapterSource = [];
            let itemCount = 0;
            let questionPrefix = null;
            let usesEnglish = false;

            if (level === 'SSC' && subject === 'physics') { chapterSource = sscPhysicsChapters; questionPrefix = \`\${level}-Physics-\`; }
            if (level === 'SSC' && subject === 'chemistry') { chapterSource = sscChemistryChapters; questionPrefix = \`\${level}-Chemistry-\`; }
            if (level === 'SSC' && subject === 'biology') { chapterSource = sscBiologyChapters; questionPrefix = \`\${level}-Biology-\`; }
            if (level === 'SSC' && subject === 'information and communication technology') { chapterSource = sscIctChapters; }
            if (level === 'SSC' && subject === 'bangladesh and global studies') { chapterSource = sscBangladeshGlobalChapters; }
            if (level === 'SSC' && subject === 'religion and moral education') {
                chapterSource = Object.values(sscReligionChapters || {}).flat();
            }
            if (level === 'HSC' && subject === 'physics 1st paper') { chapterSource = hscPhysics1stChapters; questionPrefix = \`\${level}-Physics-1-\`; }
            if (level === 'HSC' && subject === 'physics 2nd paper') { chapterSource = hscPhysics2ndChapters; questionPrefix = \`\${level}-Physics-2-\`; }
            if (level === 'HSC' && subject === 'chemistry 1st paper') { chapterSource = hscChemistry1stChapters; questionPrefix = \`\${level}-Chemistry-1-\`; }
            if (level === 'HSC' && subject === 'chemistry 2nd paper') { chapterSource = hscChemistry2ndChapters; questionPrefix = \`\${level}-Chemistry-2-\`; }
            if (level === 'HSC' && subject === 'biology 1st paper') { chapterSource = hscBiology1stChapters; questionPrefix = \`\${level}-Biology-1-\`; }
            if (level === 'HSC' && subject === 'biology 2nd paper') { chapterSource = hscBiology2ndChapters; questionPrefix = \`\${level}-Biology-2-\`; }
            if (level === 'HSC' && subject === 'information and communication technology') { chapterSource = hscIctChapters; }

            if (subject === 'bangla 1st paper') {
                itemCount = level === 'SSC'
                    ? (sscGoddoItems.length + sscPoddoItems.length + sscShohopathItems.length)
                    : (hscGoddoItems.length + hscPoddoItems.length + hscShohopathItems.length);
                questionPrefix = \`\${level}-\`;
            }

            if (subject === 'english 1st paper') {
                usesEnglish = true;
                questionPrefix = \`\${level}-\`;
            }

            const chapterCount = chapterSource.length;
            const topicCount = countTopics(chapterSource);
            const creativeCount = countEntries(srijonshilQuestions, questionPrefix);
            const mcqCount = countEntries(mcqQuestions, questionPrefix);
            const englishCount = usesEnglish ? countEntries(englishQuestions, questionPrefix) : 0;
            const notesCount = countEntries(notesByItem, questionPrefix);
            const videosCount = countEntries(videosByItem, questionPrefix);

            return {
                itemCount,
                chapterCount,
                topicCount,
                creativeCount,
                mcqCount,
                englishCount,
                notesCount,
                videosCount,
                label: itemCount > 0 ? 'Items' : 'Chapters'
            };
        };

        const stats = getSubjectStats();

        return (
            <TeacherShell title="Teacher Portal" subtitle="Track your subject work and class needs." activeTab="subject" onNavigate={onNavigate}>
                <div className="space-y-6">
                    {!hasAssignment && (
                        <div className="border border-slate-200 p-6 text-center">
                            <div className="text-sm font-semibold text-slate-800">No assignment</div>
                            <p className="text-sm text-slate-600 mt-2">Contact an admin to assign a subject to your account.</p>
                        </div>
                    )}

                    {hasAssignment && (
                        <>
                            <div className="border border-slate-200 p-4">
                                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Current assignment</div>
                                <div className="mt-2 text-2xl font-semibold text-slate-900">{assignment.subject}</div>
                                <div className="mt-1 text-sm text-slate-500">Class {assignment.level}</div>
                                {dashboard?.contentUpdatedAt && (
                                    <div className="text-xs text-slate-400 mt-2">Content updated {new Date(dashboard.contentUpdatedAt).toLocaleDateString()}</div>
                                )}
                            </div>

                            <div className="grid gap-4 lg:grid-cols-2">
                                <div className="border border-slate-200 p-4">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Class snapshot</div>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <div className="border border-slate-200 p-3">
                                            <div className="text-xs text-slate-500">Students in class</div>
                                            <div className="text-lg font-semibold text-slate-900">{dashboard?.studentCount ?? 0}</div>
                                        </div>
                                        <div className="border border-slate-200 p-3">
                                            <div className="text-xs text-slate-500">Recent updates</div>
                                            <div className="text-lg font-semibold text-slate-900">{(dashboard?.recentUpdates || []).length}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-slate-200 p-4">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Content coverage</div>
                                    {stats ? (
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">{stats.label}</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.itemCount || stats.chapterCount}</div>
                                            </div>
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">Topics</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.topicCount}</div>
                                            </div>
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">Creative questions</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.creativeCount}</div>
                                            </div>
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">MCQ questions</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.mcqCount}</div>
                                            </div>
                                            {stats.englishCount > 0 && (
                                                <div className="border border-slate-200 p-3">
                                                    <div className="text-xs text-slate-500">English questions</div>
                                                    <div className="text-lg font-semibold text-slate-900">{stats.englishCount}</div>
                                                </div>
                                            )}
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">Notes</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.notesCount}</div>
                                            </div>
                                            <div className="border border-slate-200 p-3">
                                                <div className="text-xs text-slate-500">Videos</div>
                                                <div className="text-lg font-semibold text-slate-900">{stats.videosCount}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-sm text-slate-500">Assignment stats will appear once content is loaded.</div>
                                    )}
                                </div>
                            </div>

                            <div className="border border-slate-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent updates</div>
                                    <button onClick={() => onNavigate('profile')} className="text-xs font-semibold text-indigo-600">Profile</button>
                                </div>
                                {isLoading && <div className="mt-3 text-sm text-slate-400">Loading updates...</div>}
                                {!isLoading && (dashboard?.recentUpdates || []).length === 0 && (
                                    <div className="mt-3 text-sm text-slate-500">No updates matched your assignment yet.</div>
                                )}
                                <div className="mt-3 space-y-3">
                                    {(dashboard?.recentUpdates || []).map((entry, index) => (
                                        <div key={entry.action + '-' + index} className="border border-slate-200 p-3 text-sm">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="font-semibold text-slate-800">{entry.action}</div>
                                                <div className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{entry.user}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {subjectConfig?.route ? (
                                <button onClick={() => onNavigate(subjectConfig.route)} className="w-full px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:text-indigo-600 transition">
                                    Open content manager
                                </button>
                            ) : (
                                <div className="border border-slate-200 p-3 text-sm text-slate-500">Content tools unavailable for this subject.</div>
                            )}
                        </>
                    )}
                </div>
            </TeacherShell>
        );
    };
`;var La=[["/","landing"],["/videos","public-videos"],["/videos/watch","public-video-player"],["/ssc","ssc-subjects"],["/hsc","hsc-subjects"],["/ssc/bangla-1st-paper","public-bangla-ssc-1st-paper"],["/hsc/bangla-1st-paper","public-bangla-hsc-1st-paper"],["/ssc/bangla-1st-paper/shahitto","public-bangla-ssc-shahitto"],["/hsc/bangla-1st-paper/shahitto","public-bangla-hsc-shahitto"],["/ssc/bangla-1st-paper/shohopath","public-bangla-ssc-shohopath"],["/hsc/bangla-1st-paper/shohopath","public-bangla-hsc-shohopath"],["/ssc/bangla-1st-paper/goddo","public-bangla-ssc-goddo"],["/ssc/bangla-1st-paper/poddo","public-bangla-ssc-poddo"],["/hsc/bangla-1st-paper/goddo","public-bangla-hsc-goddo"],["/hsc/bangla-1st-paper/poddo","public-bangla-hsc-poddo"],["/ssc/bangla-1st-paper/item/srijonshil","public-bangla-ssc-srijonshil"],["/hsc/bangla-1st-paper/item/srijonshil","public-bangla-hsc-srijonshil"],["/ssc/bangla-1st-paper/item/mcq","public-bangla-ssc-mcq"],["/hsc/bangla-1st-paper/item/mcq","public-bangla-hsc-mcq"],["/ssc/bangla-1st-paper/item","public-bangla-ssc-item"],["/hsc/bangla-1st-paper/item","public-bangla-hsc-item"],["/ssc/ict","public-ssc-ict"],["/ssc/ict/mcq","public-ssc-ict-mcq"],["/hsc/ict","public-hsc-ict"],["/hsc/ict/topics","public-hsc-ict-topics"],["/hsc/ict/topic","public-hsc-ict-topic"],["/hsc/ict/cq","public-hsc-ict-cq"],["/hsc/ict/mcq","public-hsc-ict-mcq"],["/ssc/physics","public-ssc-physics"],["/ssc/physics/topics","public-ssc-physics-topics"],["/ssc/physics/topic","public-ssc-physics-topic"],["/ssc/physics/cq","public-ssc-physics-cq"],["/ssc/physics/mcq","public-ssc-physics-mcq"],["/ssc/chemistry","public-ssc-chemistry"],["/ssc/chemistry/topics","public-ssc-chemistry-topics"],["/ssc/chemistry/topic","public-ssc-chemistry-topic"],["/ssc/chemistry/cq","public-ssc-chemistry-cq"],["/ssc/chemistry/mcq","public-ssc-chemistry-mcq"],["/ssc/biology","public-ssc-biology"],["/ssc/biology/topics","public-ssc-biology-topics"],["/ssc/biology/topic","public-ssc-biology-topic"],["/ssc/biology/cq","public-ssc-biology-cq"],["/ssc/biology/mcq","public-ssc-biology-mcq"],["/ssc/bangladesh-and-global-studies","public-ssc-bangladesh-global-studies"],["/ssc/bangladesh-and-global-studies/topics","public-ssc-bangladesh-global-studies-topics"],["/ssc/bangladesh-and-global-studies/topic","public-ssc-bangladesh-global-studies-topic"],["/ssc/bangladesh-and-global-studies/cq","public-ssc-bangladesh-global-studies-cq"],["/ssc/bangladesh-and-global-studies/mcq","public-ssc-bangladesh-global-studies-mcq"],["/ssc/religion-and-moral-education","public-ssc-religion"],["/ssc/religion-and-moral-education/chapters","public-ssc-religion-chapters"],["/ssc/religion-and-moral-education/topics","public-ssc-religion-topics"],["/ssc/religion-and-moral-education/topic","public-ssc-religion-topic"],["/ssc/religion-and-moral-education/cq","public-ssc-religion-cq"],["/ssc/religion-and-moral-education/mcq","public-ssc-religion-mcq"],["/hsc/physics-1st-paper","public-hsc-physics-1st"],["/hsc/physics-1st-paper/topics","public-hsc-physics-1st-topics"],["/hsc/physics-1st-paper/topic","public-hsc-physics-1st-topic"],["/hsc/physics-1st-paper/cq","public-hsc-physics-1st-cq"],["/hsc/physics-1st-paper/mcq","public-hsc-physics-1st-mcq"],["/hsc/physics-2nd-paper","public-hsc-physics-2nd"],["/hsc/physics-2nd-paper/topics","public-hsc-physics-2nd-topics"],["/hsc/physics-2nd-paper/topic","public-hsc-physics-2nd-topic"],["/hsc/physics-2nd-paper/cq","public-hsc-physics-2nd-cq"],["/hsc/physics-2nd-paper/mcq","public-hsc-physics-2nd-mcq"],["/hsc/chemistry-1st-paper","public-hsc-chemistry-1st"],["/hsc/chemistry-1st-paper/topics","public-hsc-chemistry-1st-topics"],["/hsc/chemistry-1st-paper/topic","public-hsc-chemistry-1st-topic"],["/hsc/chemistry-1st-paper/cq","public-hsc-chemistry-1st-cq"],["/hsc/chemistry-1st-paper/mcq","public-hsc-chemistry-1st-mcq"],["/hsc/chemistry-2nd-paper","public-hsc-chemistry-2nd"],["/hsc/chemistry-2nd-paper/topics","public-hsc-chemistry-2nd-topics"],["/hsc/chemistry-2nd-paper/topic","public-hsc-chemistry-2nd-topic"],["/hsc/chemistry-2nd-paper/cq","public-hsc-chemistry-2nd-cq"],["/hsc/chemistry-2nd-paper/mcq","public-hsc-chemistry-2nd-mcq"],["/hsc/biology-1st-paper","public-hsc-biology-1st"],["/hsc/biology-1st-paper/topics","public-hsc-biology-1st-topics"],["/hsc/biology-1st-paper/topic","public-hsc-biology-1st-topic"],["/hsc/biology-1st-paper/cq","public-hsc-biology-1st-cq"],["/hsc/biology-1st-paper/mcq","public-hsc-biology-1st-mcq"],["/hsc/biology-2nd-paper","public-hsc-biology-2nd"],["/hsc/biology-2nd-paper/topics","public-hsc-biology-2nd-topics"],["/hsc/biology-2nd-paper/topic","public-hsc-biology-2nd-topic"],["/hsc/biology-2nd-paper/cq","public-hsc-biology-2nd-cq"],["/hsc/biology-2nd-paper/mcq","public-hsc-biology-2nd-mcq"],["/hsc/english-1st-paper","public-english-hsc-1st-paper"],["/hsc/english-1st-paper/reading","public-english-hsc-reading"],["/hsc/english-1st-paper/writing","public-english-hsc-writing"],["/hsc/english-1st-paper/subtypes","public-english-hsc-subtypes"],["/hsc/english-1st-paper/questions","public-english-hsc-questions"],["/login","login"],["/setup","setup"],["/register","register"]];var Pa=[["/dashboard","dashboard"],["/dashboard/ssc","admin-groups-ssc"],["/dashboard/hsc","admin-groups-hsc"],["/dashboard/ssc/science","admin-ssc-science"],["/dashboard/ssc/humanities","admin-ssc-humanities"],["/dashboard/ssc/business-studies","admin-ssc-business-studies"],["/dashboard/ssc/ict","admin-ssc-ict"],["/dashboard/ssc/ict/mcq","admin-ssc-ict-mcq"],["/dashboard/hsc/ict","admin-hsc-ict"],["/dashboard/hsc/ict/topics","admin-hsc-ict-topics"],["/dashboard/hsc/ict/topic","admin-hsc-ict-topic"],["/dashboard/hsc/ict/cq","admin-hsc-ict-cq-types"],["/dashboard/hsc/ict/cq/questions","admin-hsc-ict-cq-questions"],["/dashboard/hsc/ict/mcq","admin-hsc-ict-mcq"],["/dashboard/ssc/physics","admin-ssc-physics"],["/dashboard/ssc/physics/topics","admin-ssc-physics-topics"],["/dashboard/ssc/physics/topic","admin-ssc-physics-topic"],["/dashboard/ssc/physics/cq","admin-ssc-physics-cq-types"],["/dashboard/ssc/physics/cq/questions","admin-ssc-physics-cq-questions"],["/dashboard/ssc/physics/mcq","admin-ssc-physics-mcq"],["/dashboard/ssc/chemistry","admin-ssc-chemistry"],["/dashboard/ssc/chemistry/topics","admin-ssc-chemistry-topics"],["/dashboard/ssc/chemistry/topic","admin-ssc-chemistry-topic"],["/dashboard/ssc/chemistry/cq","admin-ssc-chemistry-cq-types"],["/dashboard/ssc/chemistry/cq/questions","admin-ssc-chemistry-cq-questions"],["/dashboard/ssc/chemistry/mcq","admin-ssc-chemistry-mcq"],["/dashboard/ssc/biology","admin-ssc-biology"],["/dashboard/ssc/biology/topics","admin-ssc-biology-topics"],["/dashboard/ssc/biology/topic","admin-ssc-biology-topic"],["/dashboard/ssc/biology/cq","admin-ssc-biology-cq-types"],["/dashboard/ssc/biology/cq/questions","admin-ssc-biology-cq-questions"],["/dashboard/ssc/biology/mcq","admin-ssc-biology-mcq"],["/dashboard/ssc/bangladesh-and-global-studies","admin-ssc-bangladesh-global-studies"],["/dashboard/ssc/bangladesh-and-global-studies/topics","admin-ssc-bangladesh-global-studies-topics"],["/dashboard/ssc/bangladesh-and-global-studies/topic","admin-ssc-bangladesh-global-studies-topic"],["/dashboard/ssc/bangladesh-and-global-studies/cq","admin-ssc-bangladesh-global-studies-cq-types"],["/dashboard/ssc/bangladesh-and-global-studies/cq/questions","admin-ssc-bangladesh-global-studies-cq-questions"],["/dashboard/ssc/bangladesh-and-global-studies/mcq","admin-ssc-bangladesh-global-studies-mcq"],["/dashboard/ssc/religion-and-moral-education","admin-ssc-religion"],["/dashboard/ssc/religion-and-moral-education/chapters","admin-ssc-religion-chapters"],["/dashboard/ssc/religion-and-moral-education/topics","admin-ssc-religion-topics"],["/dashboard/ssc/religion-and-moral-education/topic","admin-ssc-religion-topic"],["/dashboard/ssc/religion-and-moral-education/cq","admin-ssc-religion-cq-types"],["/dashboard/ssc/religion-and-moral-education/cq/questions","admin-ssc-religion-cq-questions"],["/dashboard/ssc/religion-and-moral-education/mcq","admin-ssc-religion-mcq"],["/dashboard/hsc/physics-1st-paper","admin-hsc-physics-1st"],["/dashboard/hsc/physics-1st-paper/topics","admin-hsc-physics-1st-topics"],["/dashboard/hsc/physics-1st-paper/topic","admin-hsc-physics-1st-topic"],["/dashboard/hsc/physics-1st-paper/cq","admin-hsc-physics-1st-cq-types"],["/dashboard/hsc/physics-1st-paper/cq/questions","admin-hsc-physics-1st-cq-questions"],["/dashboard/hsc/physics-1st-paper/mcq","admin-hsc-physics-1st-mcq"],["/dashboard/hsc/physics-2nd-paper","admin-hsc-physics-2nd"],["/dashboard/hsc/physics-2nd-paper/topics","admin-hsc-physics-2nd-topics"],["/dashboard/hsc/physics-2nd-paper/topic","admin-hsc-physics-2nd-topic"],["/dashboard/hsc/physics-2nd-paper/cq","admin-hsc-physics-2nd-cq-types"],["/dashboard/hsc/physics-2nd-paper/cq/questions","admin-hsc-physics-2nd-cq-questions"],["/dashboard/hsc/physics-2nd-paper/mcq","admin-hsc-physics-2nd-mcq"],["/dashboard/hsc/chemistry-1st-paper","admin-hsc-chemistry-1st"],["/dashboard/hsc/chemistry-1st-paper/topics","admin-hsc-chemistry-1st-topics"],["/dashboard/hsc/chemistry-1st-paper/topic","admin-hsc-chemistry-1st-topic"],["/dashboard/hsc/chemistry-1st-paper/cq","admin-hsc-chemistry-1st-cq-types"],["/dashboard/hsc/chemistry-1st-paper/cq/questions","admin-hsc-chemistry-1st-cq-questions"],["/dashboard/hsc/chemistry-1st-paper/mcq","admin-hsc-chemistry-1st-mcq"],["/dashboard/hsc/chemistry-2nd-paper","admin-hsc-chemistry-2nd"],["/dashboard/hsc/chemistry-2nd-paper/topics","admin-hsc-chemistry-2nd-topics"],["/dashboard/hsc/chemistry-2nd-paper/topic","admin-hsc-chemistry-2nd-topic"],["/dashboard/hsc/chemistry-2nd-paper/cq","admin-hsc-chemistry-2nd-cq-types"],["/dashboard/hsc/chemistry-2nd-paper/cq/questions","admin-hsc-chemistry-2nd-cq-questions"],["/dashboard/hsc/chemistry-2nd-paper/mcq","admin-hsc-chemistry-2nd-mcq"],["/dashboard/hsc/biology-1st-paper","admin-hsc-biology-1st"],["/dashboard/hsc/biology-1st-paper/topics","admin-hsc-biology-1st-topics"],["/dashboard/hsc/biology-1st-paper/topic","admin-hsc-biology-1st-topic"],["/dashboard/hsc/biology-1st-paper/cq","admin-hsc-biology-1st-cq-types"],["/dashboard/hsc/biology-1st-paper/cq/questions","admin-hsc-biology-1st-cq-questions"],["/dashboard/hsc/biology-1st-paper/mcq","admin-hsc-biology-1st-mcq"],["/dashboard/hsc/biology-2nd-paper","admin-hsc-biology-2nd"],["/dashboard/hsc/biology-2nd-paper/topics","admin-hsc-biology-2nd-topics"],["/dashboard/hsc/biology-2nd-paper/topic","admin-hsc-biology-2nd-topic"],["/dashboard/hsc/biology-2nd-paper/cq","admin-hsc-biology-2nd-cq-types"],["/dashboard/hsc/biology-2nd-paper/cq/questions","admin-hsc-biology-2nd-cq-questions"],["/dashboard/hsc/biology-2nd-paper/mcq","admin-hsc-biology-2nd-mcq"],["/dashboard/hsc/science","admin-hsc-science"],["/dashboard/hsc/humanities","admin-hsc-humanities"],["/dashboard/hsc/business-studies","admin-hsc-business-studies"],["/dashboard/users","admin-users"],["/dashboard/users/profile","admin-user-profile"],["/dashboard/settings","admin-settings"],["/dashboard/ssc/bangla-1st-paper","bangla-ssc-1st-paper"],["/dashboard/hsc/bangla-1st-paper","bangla-hsc-1st-paper"],["/dashboard/ssc/bangla-1st-paper/shahitto","bangla-ssc-shahitto"],["/dashboard/hsc/bangla-1st-paper/shahitto","bangla-hsc-shahitto"],["/dashboard/ssc/bangla-1st-paper/shohopath","bangla-ssc-shohopath"],["/dashboard/hsc/bangla-1st-paper/shohopath","bangla-hsc-shohopath"],["/dashboard/ssc/bangla-1st-paper/goddo","bangla-ssc-goddo"],["/dashboard/ssc/bangla-1st-paper/poddo","bangla-ssc-poddo"],["/dashboard/hsc/bangla-1st-paper/goddo","bangla-hsc-goddo"],["/dashboard/hsc/bangla-1st-paper/poddo","bangla-hsc-poddo"],["/dashboard/ssc/bangla-1st-paper/item","bangla-ssc-item"],["/dashboard/hsc/bangla-1st-paper/item","bangla-hsc-item"],["/dashboard/ssc/bangla-1st-paper/item/srijonshil","bangla-ssc-srijonshil-types"],["/dashboard/hsc/bangla-1st-paper/item/srijonshil","bangla-hsc-srijonshil-types"],["/dashboard/ssc/bangla-1st-paper/item/srijonshil/questions","bangla-ssc-srijonshil-questions"],["/dashboard/hsc/bangla-1st-paper/item/srijonshil/questions","bangla-hsc-srijonshil-questions"],["/dashboard/ssc/bangla-1st-paper/item/mcq","bangla-ssc-mcq"],["/dashboard/hsc/bangla-1st-paper/item/mcq","bangla-hsc-mcq"],["/dashboard/hsc/english-1st-paper","english-hsc-1st-paper"],["/dashboard/hsc/english-1st-paper/reading","english-hsc-reading"],["/dashboard/hsc/english-1st-paper/writing","english-hsc-writing"],["/dashboard/hsc/english-1st-paper/subtypes","english-hsc-subtypes"],["/dashboard/hsc/english-1st-paper/questions","english-hsc-questions"]];var ka=[["/admin/dashboard","dashboard"],["/dashboard/ssc/bangla-1st-paper/natok","bangla-ssc-shohopath"],["/dashboard/ssc/bangla-1st-paper/upannyas","bangla-ssc-shohopath"],["/dashboard/hsc/bangla-1st-paper/natok","bangla-hsc-shohopath"],["/dashboard/hsc/bangla-1st-paper/upannyas","bangla-hsc-shohopath"]];var Ia=[["/student","student-class"],["/student/class","student-class"],["/student/settings","student-settings"]];var Ra=[];var ja=[...La,...Pa,...Ia,...Ra],st=[...ka,...ja].sort((e,t)=>t[0].length-e[0].length),Ba=ja.reduce((e,[t,s])=>(e[s]=t,e),{}),Ma=e=>{for(let[t,s]of st)if(e.startsWith(t))return s;return"landing"};var On=JSON.stringify(Ba),Fn=JSON.stringify(st),qa=`
            const viewToPath = ${On};
            const routeEntries = ${Fn};
            const getViewFromPath = (path) => {
                for (const [routePath, view] of routeEntries) {
                    if (path.startsWith(routePath)) {
                        return view;
                    }
                }
                return 'landing';
            };
`;var Aa=`
            const initialView = window.__INITIAL_VIEW || getViewFromPath(window.location.pathname);
            const [view, setView] = useState(initialView);
            const [isLoading, setIsLoading] = useState(true);
            const [user, setUser] = useState(null);
            const [hasAdmin, setHasAdmin] = useState(null);
            const [contentLoaded, setContentLoaded] = useState(false);
`;var Da=`
            const getQuestionKey = (classLabel, categoryName, itemName, extra = '') => {
                return [classLabel, categoryName || 'general', itemName || 'general', extra].join('-');
            };
            const getScienceTopicKey = (chapterId, topicId) => {
                return [chapterId || 'chapter', topicId || 'topic'].join(':');
            };
            const getEnglishQuestionKey = (section, typeKey, subtypeKey) => {
                return ['HSC', section || 'general', typeKey || 'general', subtypeKey || 'general'].join('-');
            };
            const getReligionSubjectKey = (religion) => {
                const label = religion?.label || religion?.key || '';
                return ['Religion and Moral Education', label].filter(Boolean).join(' - ');
            };
`;var Ka=`
            const teacherSubjectRoutes = {
                SSC: {
                    'bangla 1st paper': {
                        route: 'bangla-ssc-1st-paper',
                        views: [
                            'bangla-ssc-1st-paper',
                            'bangla-ssc-shahitto',
                            'bangla-ssc-shohopath',
                            'bangla-ssc-goddo',
                            'bangla-ssc-poddo',
                            'bangla-ssc-item',
                            'bangla-ssc-srijonshil-types',
                            'bangla-ssc-srijonshil-questions',
                            'bangla-ssc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'information and communication technology': {
                        route: 'admin-ssc-ict',
                        views: ['admin-ssc-ict', 'admin-ssc-ict-mcq'],
                        description: 'Manage ICT chapters and MCQ uploads.'
                    },
                    physics: {
                        route: 'admin-ssc-physics',
                        views: [
                            'admin-ssc-physics',
                            'admin-ssc-physics-topics',
                            'admin-ssc-physics-topic',
                            'admin-ssc-physics-cq-types',
                            'admin-ssc-physics-cq-questions',
                            'admin-ssc-physics-mcq'
                        ],
                        description: 'Manage SSC Physics chapters, topics, and questions.'
                    },
                    chemistry: {
                        route: 'admin-ssc-chemistry',
                        views: [
                            'admin-ssc-chemistry',
                            'admin-ssc-chemistry-topics',
                            'admin-ssc-chemistry-topic',
                            'admin-ssc-chemistry-cq-types',
                            'admin-ssc-chemistry-cq-questions',
                            'admin-ssc-chemistry-mcq'
                        ],
                        description: 'Manage SSC Chemistry chapters, topics, and questions.'
                    },
                    biology: {
                        route: 'admin-ssc-biology',
                        views: [
                            'admin-ssc-biology',
                            'admin-ssc-biology-topics',
                            'admin-ssc-biology-topic',
                            'admin-ssc-biology-cq-types',
                            'admin-ssc-biology-cq-questions',
                            'admin-ssc-biology-mcq'
                        ],
                        description: 'Manage SSC Biology chapters, topics, and questions.'
                    },
                    'bangladesh and global studies': {
                        route: 'admin-ssc-bangladesh-global-studies',
                        views: [
                            'admin-ssc-bangladesh-global-studies',
                            'admin-ssc-bangladesh-global-studies-topics',
                            'admin-ssc-bangladesh-global-studies-topic',
                            'admin-ssc-bangladesh-global-studies-cq-types',
                            'admin-ssc-bangladesh-global-studies-cq-questions',
                            'admin-ssc-bangladesh-global-studies-mcq'
                        ],
                        description: 'Manage Bangladesh and Global Studies chapters, topics, and questions.'
                    },
                    'religion and moral education': {
                        route: 'admin-ssc-religion',
                        views: [
                            'admin-ssc-religion',
                            'admin-ssc-religion-chapters',
                            'admin-ssc-religion-topics',
                            'admin-ssc-religion-topic',
                            'admin-ssc-religion-cq-types',
                            'admin-ssc-religion-cq-questions',
                            'admin-ssc-religion-mcq'
                        ],
                        description: 'Manage Religion and Moral Education chapters, topics, and questions.'
                    }
                },
                HSC: {
                    'bangla 1st paper': {
                        route: 'bangla-hsc-1st-paper',
                        views: [
                            'bangla-hsc-1st-paper',
                            'bangla-hsc-shahitto',
                            'bangla-hsc-shohopath',
                            'bangla-hsc-goddo',
                            'bangla-hsc-poddo',
                            'bangla-hsc-item',
                            'bangla-hsc-srijonshil-types',
                            'bangla-hsc-srijonshil-questions',
                            'bangla-hsc-mcq'
                        ],
                        description: 'Manage Bangla lessons, notes, and question banks.'
                    },
                    'english 1st paper': {
                        route: 'english-hsc-1st-paper',
                        views: [
                            'english-hsc-1st-paper',
                            'english-hsc-reading',
                            'english-hsc-writing',
                            'english-hsc-subtypes',
                            'english-hsc-questions'
                        ],
                        description: 'Manage English reading and writing question content.'
                    },
                    'physics 1st paper': {
                        route: 'admin-hsc-physics-1st',
                        views: [
                            'admin-hsc-physics-1st',
                            'admin-hsc-physics-1st-topics',
                            'admin-hsc-physics-1st-topic',
                            'admin-hsc-physics-1st-cq-types',
                            'admin-hsc-physics-1st-cq-questions',
                            'admin-hsc-physics-1st-mcq'
                        ],
                        description: 'Manage HSC Physics 1st Paper chapters, topics, and questions.'
                    },
                    'physics 2nd paper': {
                        route: 'admin-hsc-physics-2nd',
                        views: [
                            'admin-hsc-physics-2nd',
                            'admin-hsc-physics-2nd-topics',
                            'admin-hsc-physics-2nd-topic',
                            'admin-hsc-physics-2nd-cq-types',
                            'admin-hsc-physics-2nd-cq-questions',
                            'admin-hsc-physics-2nd-mcq'
                        ],
                        description: 'Manage HSC Physics 2nd Paper chapters, topics, and questions.'
                    },
                    'chemistry 1st paper': {
                        route: 'admin-hsc-chemistry-1st',
                        views: [
                            'admin-hsc-chemistry-1st',
                            'admin-hsc-chemistry-1st-topics',
                            'admin-hsc-chemistry-1st-topic',
                            'admin-hsc-chemistry-1st-cq-types',
                            'admin-hsc-chemistry-1st-cq-questions',
                            'admin-hsc-chemistry-1st-mcq'
                        ],
                        description: 'Manage HSC Chemistry 1st Paper chapters, topics, and questions.'
                    },
                    'chemistry 2nd paper': {
                        route: 'admin-hsc-chemistry-2nd',
                        views: [
                            'admin-hsc-chemistry-2nd',
                            'admin-hsc-chemistry-2nd-topics',
                            'admin-hsc-chemistry-2nd-topic',
                            'admin-hsc-chemistry-2nd-cq-types',
                            'admin-hsc-chemistry-2nd-cq-questions',
                            'admin-hsc-chemistry-2nd-mcq'
                        ],
                        description: 'Manage HSC Chemistry 2nd Paper chapters, topics, and questions.'
                    },
                    'biology 1st paper': {
                        route: 'admin-hsc-biology-1st',
                        views: [
                            'admin-hsc-biology-1st',
                            'admin-hsc-biology-1st-topics',
                            'admin-hsc-biology-1st-topic',
                            'admin-hsc-biology-1st-cq-types',
                            'admin-hsc-biology-1st-cq-questions',
                            'admin-hsc-biology-1st-mcq'
                        ],
                        description: 'Manage HSC Biology 1st Paper chapters, topics, and questions.'
                    },
                    'biology 2nd paper': {
                        route: 'admin-hsc-biology-2nd',
                        views: [
                            'admin-hsc-biology-2nd',
                            'admin-hsc-biology-2nd-topics',
                            'admin-hsc-biology-2nd-topic',
                            'admin-hsc-biology-2nd-cq-types',
                            'admin-hsc-biology-2nd-cq-questions',
                            'admin-hsc-biology-2nd-mcq'
                        ],
                        description: 'Manage HSC Biology 2nd Paper chapters, topics, and questions.'
                    },
                    'information and communication technology': {
                        route: 'admin-hsc-ict',
                        views: [
                            'admin-hsc-ict',
                            'admin-hsc-ict-topics',
                            'admin-hsc-ict-topic',
                            'admin-hsc-ict-cq-types',
                            'admin-hsc-ict-cq-questions',
                            'admin-hsc-ict-mcq'
                        ],
                        description: 'Manage HSC ICT chapters, topics, and both CQ/MCQ question sets.'
                    }
                }
            };
            const getTeacherSubjectConfig = (assignment) => {
                if (!assignment) return null;
                const level = String(assignment.level || '').toUpperCase();
                const subjectKey = String(assignment.subject || '').trim().toLowerCase();
                const config = teacherSubjectRoutes[level]?.[subjectKey];
                if (!config) return null;
                return { ...config, level, subject: assignment.subject };
            };
            const getTeacherAllowedViews = (assignment) => {
                const config = getTeacherSubjectConfig(assignment);
                return new Set(['dashboard', 'admin-settings', ...(config?.views || [])]);
            };
            const isDashboardView = (targetView) =>
                targetView === 'dashboard' ||
                targetView === 'admin-settings' ||
                targetView.startsWith('student-') ||
                targetView.startsWith('admin-') ||
                targetView.startsWith('bangla-') ||
                targetView.startsWith('english-');
`;var _a=`
            const defaultContent = {
                sscGoddoItems: [],
                sscPoddoItems: [],
                hscGoddoItems: [],
                hscPoddoItems: [],
                sscShohopathItems: [],
                hscShohopathItems: [],
                sscIctChapters: [],
                hscIctChapters: [],
                sscPhysicsChapters: [],
                sscChemistryChapters: [],
                sscBiologyChapters: [],
                sscBangladeshGlobalChapters: [],
                sscReligionChapters: {
                    Islam: [],
                    Hinduism: [],
                    Buddhism: [],
                    Christianity: []
                },
                hscPhysics1stChapters: [],
                hscPhysics2ndChapters: [],
                hscChemistry1stChapters: [],
                hscChemistry2ndChapters: [],
                hscBiology1stChapters: [],
                hscBiology2ndChapters: [],
                srijonshilQuestions: {},
                mcqQuestions: {},
                englishQuestions: {},
                notesByItem: {},
                videosByItem: {}
            };

            const applyContentState = (content) => {
                const merged = { ...defaultContent, ...(content || {}) };
                setSscGoddoItems(Array.isArray(merged.sscGoddoItems) ? merged.sscGoddoItems : []);
                setSscPoddoItems(Array.isArray(merged.sscPoddoItems) ? merged.sscPoddoItems : []);
                setHscGoddoItems(Array.isArray(merged.hscGoddoItems) ? merged.hscGoddoItems : []);
                setHscPoddoItems(Array.isArray(merged.hscPoddoItems) ? merged.hscPoddoItems : []);
                setSscShohopathItems(Array.isArray(merged.sscShohopathItems) ? merged.sscShohopathItems : []);
                setHscShohopathItems(Array.isArray(merged.hscShohopathItems) ? merged.hscShohopathItems : []);
                setSscIctChapters(Array.isArray(merged.sscIctChapters) ? merged.sscIctChapters : []);
                setHscIctChapters(Array.isArray(merged.hscIctChapters) ? merged.hscIctChapters : []);
                setSscPhysicsChapters(Array.isArray(merged.sscPhysicsChapters) ? merged.sscPhysicsChapters : []);
                setSscChemistryChapters(Array.isArray(merged.sscChemistryChapters) ? merged.sscChemistryChapters : []);
                setSscBiologyChapters(Array.isArray(merged.sscBiologyChapters) ? merged.sscBiologyChapters : []);
                setSscBangladeshGlobalChapters(
                    Array.isArray(merged.sscBangladeshGlobalChapters) ? merged.sscBangladeshGlobalChapters : []
                );
                const religionChapters =
                    merged.sscReligionChapters && typeof merged.sscReligionChapters === 'object'
                        ? merged.sscReligionChapters
                        : {};
                setSscReligionChapters({
                    Islam: [],
                    Hinduism: [],
                    Buddhism: [],
                    Christianity: [],
                    ...religionChapters
                });
                setHscPhysics1stChapters(Array.isArray(merged.hscPhysics1stChapters) ? merged.hscPhysics1stChapters : []);
                setHscPhysics2ndChapters(Array.isArray(merged.hscPhysics2ndChapters) ? merged.hscPhysics2ndChapters : []);
                setHscChemistry1stChapters(Array.isArray(merged.hscChemistry1stChapters) ? merged.hscChemistry1stChapters : []);
                setHscChemistry2ndChapters(Array.isArray(merged.hscChemistry2ndChapters) ? merged.hscChemistry2ndChapters : []);
                setHscBiology1stChapters(Array.isArray(merged.hscBiology1stChapters) ? merged.hscBiology1stChapters : []);
                setHscBiology2ndChapters(Array.isArray(merged.hscBiology2ndChapters) ? merged.hscBiology2ndChapters : []);
                setSrijonshilQuestions(merged.srijonshilQuestions || {});
                setMcqQuestions(merged.mcqQuestions || {});
                setEnglishQuestions(merged.englishQuestions || {});
                setNotesByItem(merged.notesByItem || {});
                setVideosByItem(merged.videosByItem || {});
            };
`;var Ha=`
            const englishQuestionKey = getEnglishQuestionKey(
                selectedEnglishSection,
                selectedEnglishType?.key,
                selectedEnglishSubtype?.key
            );
            const englishQuestionEntries = englishQuestions[englishQuestionKey] || [];
            const englishQuestionTitle = selectedEnglishSubtype
                ? (selectedEnglishType?.label || '') + ' \u2022 ' + selectedEnglishSubtype.label
                : selectedEnglishType?.label || 'English 1st Paper';
            const englishQuestionSubtitle = selectedEnglishSection
                ? selectedEnglishSection + ' section questions'
                : 'English 1st Paper questions';

            const activeScienceTopicKey = getScienceTopicKey(selectedScienceChapter?.id, selectedScienceTopic?.id);
`;var Ua=`
            const addQuestionEntry = (setter, key) => (entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.push(entry);
                    return { ...prev, [key]: updated };
                });
            };

            const updateQuestionEntry = (setter, key) => (index, entry) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated[index] = entry;
                    return { ...prev, [key]: updated };
                });
            };

            const removeQuestionEntry = (setter, key) => (index) => {
                setter((prev) => {
                    const updated = prev[key] ? [...prev[key]] : [];
                    updated.splice(index, 1);
                    return { ...prev, [key]: updated };
                });
            };
`;var Qa=`
            const addStringItem = (setItems) => (value) => {
                setItems((prev) => [...prev, value]);
            };

            const updateStringItem = (setItems) => (prevValue, nextValue) => {
                setItems((prev) => prev.map((item) => (item === prevValue ? nextValue : item)));
            };

            const removeStringItem = (setItems) => (value) => {
                setItems((prev) => prev.filter((item) => item !== value));
            };

            const addShohopathItem = (setItems) => (nextItem) => {
                setItems((prev) => [...prev, nextItem]);
            };

            const updateShohopathItem = (setItems) => (itemId, updates) => {
                setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, ...updates } : item)));
            };

            const removeShohopathItem = (setItems) => (itemId) => {
                setItems((prev) => prev.filter((item) => item.id !== itemId));
            };

            const addChapterItem = (setItems) => (entry) => {
                setItems((prev) => [...prev, entry]);
            };

            const updateChapterItem = (setItems) => (chapterId, updates) => {
                const resolved = typeof updates === 'string' ? { name: updates } : (updates || {});
                setItems((prev) =>
                    prev.map((item) => (item.id === chapterId ? { ...item, ...resolved } : item))
                );
            };

            const removeChapterItem = (setItems) => (chapterId) => {
                setItems((prev) => prev.filter((item) => item.id !== chapterId));
            };

            const addTopicItem = (setItems) => (chapterId, topic) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: [...(chapter.topics || []), topic] }
                            : chapter
                    )
                );
            };

            const updateTopicItem = (setItems) => (chapterId, topicId, updates) => {
                const resolved = typeof updates === 'string' ? { name: updates } : (updates || {});
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId ? { ...topic, ...resolved } : topic
                                )
                            }
                            : chapter
                    )
                );
            };

            const removeTopicItem = (setItems) => (chapterId, topicId) => {
                setItems((prev) =>
                    prev.map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: (chapter.topics || []).filter((topic) => topic.id !== topicId) }
                            : chapter
                    )
                );
            };

            const addReligionChapterItem = (setItems) => (religionKey, chapter) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: [...(prev[religionKey] || []), chapter]
                }));
            };

            const updateReligionChapterItem = (setItems) => (religionKey, chapterId, updates) => {
                const resolved = typeof updates === 'string' ? { name: updates } : (updates || {});
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId ? { ...chapter, ...resolved } : chapter
                    )
                }));
            };

            const removeReligionChapterItem = (setItems) => (religionKey, chapterId) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).filter((chapter) => chapter.id !== chapterId)
                }));
            };

            const addReligionTopicItem = (setItems) => (religionKey, chapterId, topic) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: [...(chapter.topics || []), topic] }
                            : chapter
                    )
                }));
            };

            const updateReligionTopicItem = (setItems) => (religionKey, chapterId, topicId, updates) => {
                const resolved = typeof updates === 'string' ? { name: updates } : (updates || {});
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? {
                                ...chapter,
                                topics: (chapter.topics || []).map((topic) =>
                                    topic.id === topicId ? { ...topic, ...resolved } : topic
                                )
                            }
                            : chapter
                    )
                }));
            };

            const removeReligionTopicItem = (setItems) => (religionKey, chapterId, topicId) => {
                setItems((prev) => ({
                    ...prev,
                    [religionKey]: (prev[religionKey] || []).map((chapter) =>
                        chapter.id === chapterId
                            ? { ...chapter, topics: (chapter.topics || []).filter((topic) => topic.id !== topicId) }
                            : chapter
                    )
                }));
            };
`;var Oa=`
            const syncRoutesFromLocation = () => {
                const { pathname } = window.location;
                setView(getViewFromPath(pathname));
            };

            const navigate = (nextView, options = {}) => {
                const { replace = false, path } = options;
                setView(nextView);
                const nextPath = path || viewToPath[nextView] || '/';
                if (window.location.pathname !== nextPath) {
                    const method = replace ? 'replaceState' : 'pushState';
                    window.history[method]({ view: nextView }, '', nextPath);
                }
            };

            useEffect(() => {
                const handlePopState = () => {
                    syncRoutesFromLocation();
                };
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);
`;var Fa=`
            // Ref to track if we are currently fetching data (to prevent auto-save loops)
            const isFetchingRef = useRef(false);

            // 1. Initial System Check & Session Restore
            useEffect(() => {
                const initSystem = async () => {
                    try {
                        // A. Check Setup Status
                        const res = await fetch(statusEndpoint);
                        if (!res.ok) {
                            throw new Error('Status check failed');
                        }
                        const data = await res.json();
                        const initialized = Boolean(data.initialized);
                        setHasAdmin(initialized);

                        // B. Try to Restore Session
                        const token = localStorage.getItem('auth_token');
                        if (token) {
                            try {
                                const meRes = await fetch('/api/me', {
                                    headers: { 'Authorization': 'Bearer ' + token }
                                });
                                const meData = await meRes.json();
                                if (meData.user) {
                                    setUser(meData.user);
                                } else {
                                    // Invalid token
                                    localStorage.removeItem('auth_token');
                                }
                            } catch (e) {
                                localStorage.removeItem('auth_token');
                            }
                        }

                        if (initialized && view === 'register') {
                            navigate('login', { replace: true });
                        }
                        if (!initialized && view !== 'setup') {
                            navigate('setup', { replace: true });
                        }
                        if (!token && isDashboardView(view)) {
                            navigate('landing', { replace: true });
                        }
                    } catch (e) {
                        setHasAdmin(false);
                        if (view !== 'setup') {
                            navigate('setup', { replace: true });
                        }
                    } finally {
                        setIsLoading(false);
                    }
                };
                initSystem();
            }, []);

            // 2. Smart Background Refresh
            useEffect(() => {
                const loadContent = async () => {
                    // BUSY CHECK: If user is typing in a form, skip this refresh cycle
                    const active = document.activeElement;
                    const isUserBusy = active && (
                        active.tagName === 'INPUT' || 
                        active.tagName === 'TEXTAREA' || 
                        active.tagName === 'SELECT' ||
                        active.isContentEditable
                    );

                    if (isUserBusy) {
                        // User is busy, simply return and try again next cycle
                        return;
                    }

                    try {
                        const response = await fetch('/api/content');
                        const data = await response.json();
                        if (data.success && data.content) {
                            // Mark as fetching so the "Save" effect knows to ignore this change
                            isFetchingRef.current = true;
                            applyContentState(data.content);
                            
                            // Reset the flag after the state update cycle finishes.
                            setTimeout(() => {
                                isFetchingRef.current = false;
                            }, 0);
                        }
                    } catch (e) {
                        console.warn('Failed to load content', e);
                    } finally {
                        setContentLoaded(true);
                    }
                };
                
                // Initial load
                loadContent();

                // Auto-refresh every 15 seconds
                const interval = setInterval(loadContent, 15000);
                return () => clearInterval(interval);
            }, []);

            const getScienceChapterList = (selection) => {
                if (!selection) return null;
                const { classLabel, subjectLabel, religionKey } = selection;
                if (classLabel === 'SSC' && subjectLabel === 'Physics') return sscPhysicsChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Chemistry') return sscChemistryChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Biology') return sscBiologyChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Bangladesh and Global Studies') return sscBangladeshGlobalChapters;
                if (classLabel === 'SSC' && subjectLabel === 'Religion and Moral Education')
                    return (sscReligionChapters || {})[religionKey] || [];
                if (classLabel === 'HSC' && subjectLabel === 'Physics 1st Paper') return hscPhysics1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Physics 2nd Paper') return hscPhysics2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Chemistry 1st Paper') return hscChemistry1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Chemistry 2nd Paper') return hscChemistry2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Biology 1st Paper') return hscBiology1stChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Biology 2nd Paper') return hscBiology2ndChapters;
                if (classLabel === 'HSC' && subjectLabel === 'Information and Communication Technology') return hscIctChapters;
                return null;
            };

            useEffect(() => {
                if (!selectedScienceChapter || !selectedScienceSubject) return;
                const chapters = getScienceChapterList(selectedScienceSubject);
                if (!chapters) return;
                const refreshedChapter = chapters.find((chapter) => chapter.id === selectedScienceChapter.id);
                if (!refreshedChapter) {
                    setSelectedScienceChapter(null);
                    setSelectedScienceTopic(null);
                    return;
                }
                if (refreshedChapter !== selectedScienceChapter) {
                    setSelectedScienceChapter(refreshedChapter);
                }
                if (!selectedScienceTopic) return;
                const refreshedTopic = (refreshedChapter.topics || []).find(
                    (topic) => topic.id === selectedScienceTopic.id
                );
                if (!refreshedTopic) {
                    setSelectedScienceTopic(null);
                    return;
                }
                if (refreshedTopic !== selectedScienceTopic) {
                    setSelectedScienceTopic(refreshedTopic);
                }
            }, [
                selectedScienceChapter,
                selectedScienceTopic,
                selectedScienceSubject,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                sscBangladeshGlobalChapters,
                sscReligionChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                hscIctChapters
            ]);

            useEffect(() => {
                if (!contentLoaded) return;
                if (!user) return;
                const canEditContent = user.role === 'admin' || (user.role === 'teacher' && user.assignment);
                if (!canEditContent) return;
                
                // If this change was caused by a background fetch, do NOT save it back to server
                if (isFetchingRef.current) return;

                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const payload = {
                    sscGoddoItems,
                    sscPoddoItems,
                    hscGoddoItems,
                    hscPoddoItems,
                    sscShohopathItems,
                    hscShohopathItems,
                    sscIctChapters,
                    hscIctChapters,
                    sscPhysicsChapters,
                    sscChemistryChapters,
                    sscBiologyChapters,
                    sscBangladeshGlobalChapters,
                    sscReligionChapters,
                    hscPhysics1stChapters,
                    hscPhysics2ndChapters,
                    hscChemistry1stChapters,
                    hscChemistry2ndChapters,
                    hscBiology1stChapters,
                    hscBiology2ndChapters,
                    srijonshilQuestions,
                    mcqQuestions,
                    englishQuestions,
                    notesByItem,
                    videosByItem
                };

                const timeout = setTimeout(async () => {
                    try {
                        await fetch('/api/content', {
                            method: 'PUT',
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                    } catch (e) {
                        console.warn('Failed to save content', e);
                    }
                }, 300);

                return () => clearTimeout(timeout);
            }, [
                contentLoaded,
                user,
                sscGoddoItems,
                sscPoddoItems,
                hscGoddoItems,
                hscPoddoItems,
                sscShohopathItems,
                hscShohopathItems,
                sscIctChapters,
                hscIctChapters,
                sscPhysicsChapters,
                sscChemistryChapters,
                sscBiologyChapters,
                sscBangladeshGlobalChapters,
                sscReligionChapters,
                hscPhysics1stChapters,
                hscPhysics2ndChapters,
                hscChemistry1stChapters,
                hscChemistry2ndChapters,
                hscBiology1stChapters,
                hscBiology2ndChapters,
                srijonshilQuestions,
                mcqQuestions,
                englishQuestions,
                notesByItem,
                videosByItem
            ]);
`;var Ga=`
            // FIX: We now accept an object { username, password }
            const handleLogin = async ({ username, password }) => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('auth_token', data.token);
                    setUser({
                        username: data.username,
                        role: data.role,
                        permissions: data.permissions || [],
                        assignment: data.assignment || null,
                        classLabel: data.classLabel || null,
                        groupLabel: data.groupLabel || null
                    });
                    navigate('dashboard');
                } else {
                    alert(data.error || 'Login failed');
                }
            };

            const handleLogout = () => {
                localStorage.removeItem('auth_token');
                setUser(null);
                navigate('landing');
            };

            const handleRegister = async ({ username, password }) => {
                const res = await fetch('/api/register-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    alert("Account created successfully. Please login.");
                    setHasAdmin(true);
                    navigate('login');
                } else {
                    alert(data.error);
                }
            };
`;var Va=`
            useEffect(() => {
                if (!user || user.role !== 'teacher') return;
                const allowedViews = getTeacherAllowedViews(user.assignment);
                if (isDashboardView(view) && !allowedViews.has(view)) {
                    navigate('dashboard', { replace: true });
                }
            }, [user, view]);
`;var za=`
            if (isLoading || hasAdmin === null) return <Loading />;
            const teacherSubjectConfig = getTeacherSubjectConfig(user?.assignment);
            const canManageStructure = user?.role === 'admin' || user?.permissions?.includes('structure');
            const canManageThumbnails = user?.role === 'admin';

            return (
                <div className="min-h-screen flex flex-col">
                    <NavBar user={user} hasAdmin={hasAdmin} onNavigate={navigate} onLogout={handleLogout} />
                    <main className="flex-grow bg-gray-50 flex flex-col">
                        <div key={view} className="flex-grow flex flex-col animate-fade-in">
`;var Wa=`
{view === 'login' && <AuthForm mode="login" onSubmit={handleLogin} onNavigate={navigate} />}

{/* Only show Admin Registration if no admin exists */}
{view === 'register' && !hasAdmin && <AuthForm mode="register" onSubmit={handleRegister} />}

{/* Block Admin Registration if admin exists */}
{view === 'register' && hasAdmin && (
    <div className="flex-1 flex items-center justify-center bg-[#f3f6ff] px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100 max-w-sm w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Registration Closed</h2>
            <p className="text-slate-500 mb-6">Admin account already exists.</p>
            <button onClick={() => navigate('student-register')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                Create Student Account
            </button>
        </div>
    </div>
)}
`;var $a=`
{view === 'landing' && <StudentLanding onNavigate={navigate} />}
{view === 'public-videos' && (
    <PublicVideoList
        context={selectedVideoContext}
        videosByItem={videosByItem}
        onBack={
            selectedVideoContext?.backRoute
                ? () => navigate(selectedVideoContext.backRoute)
                : null
        }
        onNavigate={navigate}
        onSelectVideo={(video, context) => {
            setSelectedVideoId(video.id);
            if (context) {
                setSelectedVideoContext(context);
            }
            navigate('public-video-player');
        }}
    />
)}
{view === 'public-video-player' && (
    <PublicVideoDetail
        context={selectedVideoContext}
        videoId={selectedVideoId}
        videosByItem={videosByItem}
        onBack={() => navigate('public-videos')}
        onNavigate={navigate}
    />
)}
{view === 'ssc-subjects' && (
    <SubjectIndexPage classLabel="SSC" subjects={sscSubjects} onNavigate={navigate} />
)}
{view === 'hsc-subjects' && (
    <SubjectIndexPage classLabel="HSC" subjects={hscSubjects} onNavigate={navigate} />
)}
`;var Ya=`
{view === 'student-register' && <StudentRegister onNavigate={navigate} />}
`;var Xa=`
            const loadBanglaSelection = () => {
                try {
                    const raw = localStorage.getItem('freeducation.bangla-selection');
                    return raw ? JSON.parse(raw) : { itemName: '', categoryName: '' };
                } catch (error) {
                    console.warn('Failed to load Bangla selection', error);
                    return { itemName: '', categoryName: '' };
                }
            };
            const initialBanglaSelection = loadBanglaSelection();
            const [selectedBanglaItem, setSelectedBanglaItem] = useState(initialBanglaSelection.itemName || '');
            const [selectedBanglaCategory, setSelectedBanglaCategory] = useState(initialBanglaSelection.categoryName || '');
            const [selectedSrijonshilType, setSelectedSrijonshilType] = useState(null);
            const [sscGoddoItems, setSscGoddoItems] = useState([]);
            const [sscPoddoItems, setSscPoddoItems] = useState([]);
            const [hscGoddoItems, setHscGoddoItems] = useState([]);
            const [hscPoddoItems, setHscPoddoItems] = useState([]);
            const [sscShohopathItems, setSscShohopathItems] = useState([]);
            const [hscShohopathItems, setHscShohopathItems] = useState([]);
`;var Ja=`
            const getBanglaTopics = (classLabel) => [
                {
                    title: '\u09AC\u09BE\u0982\u09B2\u09BE \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF',
                    description: '\u0997\u09A6\u09CD\u09AF \u0993 \u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shahitto' : 'public-bangla-hsc-shahitto',
                    thumbnailKey: 'shahitto'
                },
                {
                    title: '\u09B8\u09B9\u09AA\u09BE\u09A0',
                    description: '\u09A8\u09BE\u099F\u0995 \u0993 \u0989\u09AA\u09A8\u09CD\u09AF\u09BE\u09B8 \u09AD\u09BF\u09A4\u09CD\u09A4\u09BF\u0995 \u09AA\u09BE\u09A0',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-shohopath' : 'public-bangla-hsc-shohopath',
                    thumbnailKey: 'shohopath'
                }
            ];

            const getBanglaShahittoTopics = (classLabel) => [
                {
                    title: '\u0997\u09A6\u09CD\u09AF',
                    description: '\u0997\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-goddo' : 'public-bangla-hsc-goddo',
                    thumbnailKey: 'goddo'
                },
                {
                    title: '\u09AA\u09A6\u09CD\u09AF',
                    description: '\u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09B8\u09AE\u09C2\u09B9',
                    route: classLabel === 'SSC' ? 'public-bangla-ssc-poddo' : 'public-bangla-hsc-poddo',
                    thumbnailKey: 'poddo'
                }
            ];
`;var Za=`
{view === 'public-bangla-ssc-1st-paper' && (
    <PublicBanglaShell
        title="\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0"
        subtitle="SSC \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09B0 \u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicBanglaTopicGrid
            classLabel="SSC"
            subjectLabel="Bangla 1st Paper"
            topics={getBanglaTopics('SSC')}
            onNavigate={navigate}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-hsc-1st-paper' && (
    <PublicBanglaShell
        title="\u09AC\u09BE\u0982\u09B2\u09BE \u09E7\u09AE \u09AA\u09A4\u09CD\u09B0"
        subtitle="HSC \u09B6\u09CD\u09B0\u09C7\u09A3\u09BF\u09B0 \u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicBanglaTopicGrid
            classLabel="HSC"
            subjectLabel="Bangla 1st Paper"
            topics={getBanglaTopics('HSC')}
            onNavigate={navigate}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-ssc-shahitto' && (
    <PublicBanglaShell
        title="\u09AC\u09BE\u0982\u09B2\u09BE \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF"
        subtitle="\u0997\u09A6\u09CD\u09AF \u0993 \u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('public-bangla-ssc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicBanglaTopicGrid
            classLabel="SSC"
            subjectLabel="Bangla 1st Paper"
            topics={getBanglaShahittoTopics('SSC')}
            onNavigate={navigate}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-hsc-shahitto' && (
    <PublicBanglaShell
        title="\u09AC\u09BE\u0982\u09B2\u09BE \u09B8\u09BE\u09B9\u09BF\u09A4\u09CD\u09AF"
        subtitle="\u0997\u09A6\u09CD\u09AF \u0993 \u09AA\u09A6\u09CD\u09AF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('public-bangla-hsc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicBanglaTopicGrid
            classLabel="HSC"
            subjectLabel="Bangla 1st Paper"
            topics={getBanglaShahittoTopics('HSC')}
            onNavigate={navigate}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-ssc-goddo' && (
    <PublicBanglaShell
        title="\u0997\u09A6\u09CD\u09AF"
        subtitle="SSC \u0997\u09A6\u09CD\u09AF \u09AA\u09BE\u09A0\u09C7\u09B0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0964"
        onBack={() => navigate('public-bangla-ssc-shahitto')}
        onNavigate={navigate}
    >
        <PublicBanglaTextList
            classLabel="SSC"
            subjectLabel="Bangla 1st Paper"
            categoryLabel="\u0997\u09A6\u09CD\u09AF"
            subtitle="\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u099B\u09A8\u09CD\u09A6\u09C7\u09B0 \u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
            items={sscGoddoItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item);
                setSelectedBanglaCategory('\u0997\u09A6\u09CD\u09AF');
                navigate('public-bangla-ssc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-ssc-poddo' && (
    <PublicBanglaShell
        title="\u09AA\u09A6\u09CD\u09AF"
        subtitle="SSC \u09AA\u09A6\u09CD\u09AF \u09AA\u09BE\u09A0\u09C7\u09B0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0964"
        onBack={() => navigate('public-bangla-ssc-shahitto')}
        onNavigate={navigate}
    >
        <PublicBanglaTextList
            classLabel="SSC"
            subjectLabel="Bangla 1st Paper"
            categoryLabel="\u09AA\u09A6\u09CD\u09AF"
            subtitle="\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u099B\u09A8\u09CD\u09A6\u09C7\u09B0 \u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
            items={sscPoddoItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item);
                setSelectedBanglaCategory('\u09AA\u09A6\u09CD\u09AF');
                navigate('public-bangla-ssc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-hsc-goddo' && (
    <PublicBanglaShell
        title="\u0997\u09A6\u09CD\u09AF"
        subtitle="HSC \u0997\u09A6\u09CD\u09AF \u09AA\u09BE\u09A0\u09C7\u09B0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0964"
        onBack={() => navigate('public-bangla-hsc-shahitto')}
        onNavigate={navigate}
    >
        <PublicBanglaTextList
            classLabel="HSC"
            subjectLabel="Bangla 1st Paper"
            categoryLabel="\u0997\u09A6\u09CD\u09AF"
            subtitle="\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u099B\u09A8\u09CD\u09A6\u09C7\u09B0 \u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
            items={hscGoddoItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item);
                setSelectedBanglaCategory('\u0997\u09A6\u09CD\u09AF');
                navigate('public-bangla-hsc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-hsc-poddo' && (
    <PublicBanglaShell
        title="\u09AA\u09A6\u09CD\u09AF"
        subtitle="HSC \u09AA\u09A6\u09CD\u09AF \u09AA\u09BE\u09A0\u09C7\u09B0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE\u0964"
        onBack={() => navigate('public-bangla-hsc-shahitto')}
        onNavigate={navigate}
    >
        <PublicBanglaTextList
            classLabel="HSC"
            subjectLabel="Bangla 1st Paper"
            categoryLabel="\u09AA\u09A6\u09CD\u09AF"
            subtitle="\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u099B\u09A8\u09CD\u09A6\u09C7\u09B0 \u09AA\u09BE\u09A0 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
            items={hscPoddoItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item);
                setSelectedBanglaCategory('\u09AA\u09A6\u09CD\u09AF');
                navigate('public-bangla-hsc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-ssc-shohopath' && (
    <PublicBanglaShell
        title="\u09B8\u09B9\u09AA\u09BE\u09A0"
        subtitle="SSC \u09B8\u09B9\u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('public-bangla-ssc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicBanglaShohopathList
            classLabel="SSC"
            subjectLabel="Bangla 1st Paper"
            items={sscShohopathItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item.name);
                setSelectedBanglaCategory(item.type);
                navigate('public-bangla-ssc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-hsc-shohopath' && (
    <PublicBanglaShell
        title="\u09B8\u09B9\u09AA\u09BE\u09A0"
        subtitle="HSC \u09B8\u09B9\u09AA\u09BE\u09A0 \u09A4\u09BE\u09B2\u09BF\u0995\u09BE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('public-bangla-hsc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicBanglaShohopathList
            classLabel="HSC"
            subjectLabel="Bangla 1st Paper"
            items={hscShohopathItems}
            onSelectItem={(item) => {
                setSelectedBanglaItem(item.name);
                setSelectedBanglaCategory(item.type);
                navigate('public-bangla-hsc-item');
            }}
        />
    </PublicBanglaShell>
)}
{view === 'public-bangla-ssc-item' && (
    <PublicBanglaItemDetail
        classLabel="SSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#fff7ed]'
            });
            navigate('public-videos');
        }}
        onNavigate={navigate}
    />
)}
{view === 'public-bangla-hsc-item' && (
    <PublicBanglaItemDetail
        classLabel="HSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#fff7ed]'
            });
            navigate('public-videos');
        }}
        onNavigate={navigate}
    />
)}
{view === 'public-bangla-ssc-srijonshil' && (
    <PublicBanglaSrijonshilDetail
        classLabel="SSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        srijonshilQuestions={srijonshilQuestions}
        getQuestionKey={getQuestionKey}
        onNavigate={navigate}
    />
)}
{view === 'public-bangla-hsc-srijonshil' && (
    <PublicBanglaSrijonshilDetail
        classLabel="HSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        srijonshilQuestions={srijonshilQuestions}
        getQuestionKey={getQuestionKey}
        onNavigate={navigate}
    />
)}
{view === 'public-bangla-ssc-mcq' && (
    <PublicBanglaMcqDetail
        classLabel="SSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        mcqQuestions={mcqQuestions}
        getQuestionKey={getQuestionKey}
        onNavigate={navigate}
    />
)}
{view === 'public-bangla-hsc-mcq' && (
    <PublicBanglaMcqDetail
        classLabel="HSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        mcqQuestions={mcqQuestions}
        getQuestionKey={getQuestionKey}
        onNavigate={navigate}
    />
)}
`;var ei=`
{view === 'bangla-ssc-1st-paper' && (
    <BanglaFirstPaperTopics classLabel="SSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-hsc-1st-paper' && (
    <BanglaFirstPaperTopics classLabel="HSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-ssc-shahitto' && (
    <BanglaShahitto classLabel="SSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-hsc-shahitto' && (
    <BanglaShahitto classLabel="HSC" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'bangla-ssc-shohopath' && (
    <BanglaShohopath
        classLabel="SSC"
        items={sscShohopathItems}
        onAddItem={addShohopathItem(setSscShohopathItems)}
        onUpdateItem={updateShohopathItem(setSscShohopathItems)}
        onRemoveItem={removeShohopathItem(setSscShohopathItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item.name);
            setSelectedBanglaCategory(item.type);
            navigate('bangla-ssc-item');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-hsc-shohopath' && (
    <BanglaShohopath
        classLabel="HSC"
        items={hscShohopathItems}
        onAddItem={addShohopathItem(setHscShohopathItems)}
        onUpdateItem={updateShohopathItem(setHscShohopathItems)}
        onRemoveItem={removeShohopathItem(setHscShohopathItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item.name);
            setSelectedBanglaCategory(item.type);
            navigate('bangla-hsc-item');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-ssc-goddo' && (
    <BanglaTextList
        classLabel="SSC"
        typeLabel="\u0997\u09A6\u09CD\u09AF"
        items={sscGoddoItems}
        onAddItem={addStringItem(setSscGoddoItems)}
        onUpdateItem={updateStringItem(setSscGoddoItems)}
        onRemoveItem={removeStringItem(setSscGoddoItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item);
            setSelectedBanglaCategory('\u0997\u09A6\u09CD\u09AF');
            navigate('bangla-ssc-item');
        }}
        onNavigate={navigate}
        showAdd
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-ssc-poddo' && (
    <BanglaTextList
        classLabel="SSC"
        typeLabel="\u09AA\u09A6\u09CD\u09AF"
        items={sscPoddoItems}
        onAddItem={addStringItem(setSscPoddoItems)}
        onUpdateItem={updateStringItem(setSscPoddoItems)}
        onRemoveItem={removeStringItem(setSscPoddoItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item);
            setSelectedBanglaCategory('\u09AA\u09A6\u09CD\u09AF');
            navigate('bangla-ssc-item');
        }}
        onNavigate={navigate}
        showAdd
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-hsc-goddo' && (
    <BanglaTextList
        classLabel="HSC"
        typeLabel="\u0997\u09A6\u09CD\u09AF"
        items={hscGoddoItems}
        onAddItem={addStringItem(setHscGoddoItems)}
        onUpdateItem={updateStringItem(setHscGoddoItems)}
        onRemoveItem={removeStringItem(setHscGoddoItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item);
            setSelectedBanglaCategory('\u0997\u09A6\u09CD\u09AF');
            navigate('bangla-hsc-item');
        }}
        onNavigate={navigate}
        showAdd
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-hsc-poddo' && (
    <BanglaTextList
        classLabel="HSC"
        typeLabel="\u09AA\u09A6\u09CD\u09AF"
        items={hscPoddoItems}
        onAddItem={addStringItem(setHscPoddoItems)}
        onUpdateItem={updateStringItem(setHscPoddoItems)}
        onRemoveItem={removeStringItem(setHscPoddoItems)}
        onSelectItem={(item) => {
            setSelectedBanglaItem(item);
            setSelectedBanglaCategory('\u09AA\u09A6\u09CD\u09AF');
            navigate('bangla-hsc-item');
        }}
        onNavigate={navigate}
        showAdd
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'bangla-ssc-item' && (
    <BanglaItemDetail
        classLabel="SSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onNavigate={navigate}
    />
)}
{view === 'bangla-hsc-item' && (
    <BanglaItemDetail
        classLabel="HSC"
        itemName={selectedBanglaItem}
        categoryName={selectedBanglaCategory}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onNavigate={navigate}
    />
)}
{view === 'bangla-ssc-srijonshil-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedBanglaItem}
        onSelectType={setSelectedSrijonshilType}
        onNavigate={navigate}
    />
)}
{view === 'bangla-hsc-srijonshil-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedBanglaItem}
        onSelectType={setSelectedSrijonshilType}
        onNavigate={navigate}
    />
)}
{view === 'bangla-ssc-srijonshil-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedBanglaItem}
        typeLabel={selectedSrijonshilType?.label || '\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2'}
        questions={srijonshilQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
        onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onNavigate={navigate}
    />
)}
{view === 'bangla-hsc-srijonshil-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedBanglaItem}
        typeLabel={selectedSrijonshilType?.label || '\u09B8\u09C3\u099C\u09A8\u09B6\u09C0\u09B2'}
        questions={srijonshilQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key)] || []}
        onAdd={addQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onUpdate={updateQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onDelete={removeQuestionEntry(setSrijonshilQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, selectedSrijonshilType?.key))}
        onNavigate={navigate}
    />
)}
{view === 'bangla-ssc-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedBanglaItem}
        questions={mcqQuestions[getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onNavigate={navigate}
    />
)}
{view === 'bangla-hsc-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedBanglaItem}
        questions={mcqQuestions[getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', selectedBanglaCategory, selectedBanglaItem, 'mcq'))}
        onNavigate={navigate}
    />
)}
`;var ti={id:"bangla",state:Xa,types:Ja,views:{public:Za,admin:ei}};var si=`
            const [selectedEnglishSection, setSelectedEnglishSection] = useState('');
            const [selectedEnglishType, setSelectedEnglishType] = useState(null);
            const [selectedEnglishSubtype, setSelectedEnglishSubtype] = useState(null);
            const [englishQuestions, setEnglishQuestions] = useState({});
`;var ai=`
            const englishReadingTypes = [
                {
                    key: 'reading-mcq',
                    label: '1. A. MCQ',
                    description: 'Multiple choice questions based on passages.'
                },
                {
                    key: 'reading-qa',
                    label: '1. B. Question and Answer',
                    description: 'Short answer comprehension questions.'
                },
                {
                    key: 'information-transfer-flow-chart',
                    label: '2. Information Transfer / Flow Chart',
                    description: 'Data or passage-based transfer tasks.',
                    children: [
                        { key: 'information-transfer', label: 'Information Transfer' },
                        { key: 'flow-chart', label: 'Flow Chart' }
                    ]
                },
                {
                    key: 'summarizing',
                    label: '3. Summarizing of a passage',
                    description: 'Summarize the given passage.'
                },
                {
                    key: 'cloze-test-with-clues',
                    label: '4. Cloze test with clues',
                    description: 'Fill in the blanks with guiding clues.'
                },
                {
                    key: 'cloze-test-without-clues',
                    label: '5. Cloze test without clues',
                    description: 'Fill in the blanks without clues.'
                },
                {
                    key: 'rearranging-passage',
                    label: '6. Rearranging the passage',
                    description: 'Arrange jumbled sentences into the correct order.'
                }
            ];

            const englishWritingTypes = [
                {
                    key: 'writing-paragraph',
                    label: '7. Writing paragraph',
                    description: 'Write a focused paragraph on a topic.'
                },
                {
                    key: 'completing-story',
                    label: '8. Completing a story',
                    description: 'Finish a story with a logical ending.'
                },
                {
                    key: 'informal-letters-emails',
                    label: '9. Informal letters / Emails',
                    description: 'Personal letters and email writing.',
                    children: [
                        { key: 'informal-letters', label: 'Informal letters' },
                        { key: 'emails', label: 'Emails' }
                    ]
                },
                {
                    key: 'analyzing-maps-graphs-charts',
                    label: '10. Analyzing maps / Graphs / Charts',
                    description: 'Describe and analyze visual data.',
                    children: [
                        { key: 'maps', label: 'Analyzing maps' },
                        { key: 'graphs', label: 'Analyzing graphs' },
                        { key: 'charts', label: 'Analyzing charts' }
                    ]
                },
                {
                    key: 'theme-writing',
                    label: '11. Theme writing',
                    description: 'Write on a theme or idea.'
                }
            ];
`;var ii=`
{view === 'public-english-hsc-1st-paper' && (
    <PublicEnglishShell
        title="English 1st Paper"
        subtitle="Select Reading or Writing to explore HSC English 1st Paper."
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicEnglishCardGrid
            items={[
                {
                    key: 'reading',
                    title: 'Reading',
                    description: 'MCQ, comprehension, and passage-based tasks.',
                    route: 'public-english-hsc-reading'
                },
                {
                    key: 'writing',
                    title: 'Writing',
                    description: 'Paragraphs, stories, letters, and analysis tasks.',
                    route: 'public-english-hsc-writing'
                }
            ]}
            onNavigate={navigate}
        />
    </PublicEnglishShell>
)}
{view === 'public-english-hsc-reading' && (
    <PublicEnglishShell
        title="Reading"
        subtitle="Choose a question type from the reading section."
        onBack={() => navigate('public-english-hsc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicEnglishTypeList
            items={englishReadingTypes}
            onSelect={(item) => {
                setSelectedEnglishSection('Reading');
                setSelectedEnglishType(item);
                setSelectedEnglishSubtype(null);
                if (item.children?.length) {
                    navigate('public-english-hsc-subtypes');
                } else {
                    navigate('public-english-hsc-questions');
                }
            }}
        />
    </PublicEnglishShell>
)}
{view === 'public-english-hsc-writing' && (
    <PublicEnglishShell
        title="Writing"
        subtitle="Choose a question type from the writing section."
        onBack={() => navigate('public-english-hsc-1st-paper')}
        onNavigate={navigate}
    >
        <PublicEnglishTypeList
            items={englishWritingTypes}
            onSelect={(item) => {
                setSelectedEnglishSection('Writing');
                setSelectedEnglishType(item);
                setSelectedEnglishSubtype(null);
                if (item.children?.length) {
                    navigate('public-english-hsc-subtypes');
                } else {
                    navigate('public-english-hsc-questions');
                }
            }}
        />
    </PublicEnglishShell>
)}
{view === 'public-english-hsc-subtypes' && (
    <PublicEnglishShell
        title={selectedEnglishType?.label || 'Question type'}
        subtitle="Select a specific option to view questions."
        onBack={() =>
            navigate(
                selectedEnglishSection === 'Writing'
                    ? 'public-english-hsc-writing'
                    : 'public-english-hsc-reading'
            )
        }
        onNavigate={navigate}
    >
        <PublicEnglishTypeList
            items={selectedEnglishType?.children || []}
            onSelect={(child) => {
                setSelectedEnglishSubtype(child);
                navigate('public-english-hsc-questions');
            }}
        />
    </PublicEnglishShell>
)}
{view === 'public-english-hsc-questions' && (
    <PublicEnglishShell
        title={englishQuestionTitle}
        subtitle={englishQuestionSubtitle}
        onBack={() =>
            navigate(
                selectedEnglishType?.children?.length
                    ? 'public-english-hsc-subtypes'
                    : selectedEnglishSection === 'Writing'
                        ? 'public-english-hsc-writing'
                        : 'public-english-hsc-reading'
            )
        }
        onNavigate={navigate}
    >
        <PublicEnglishQuestionList questions={englishQuestionEntries} />
    </PublicEnglishShell>
)}
`;var ni=`
{view === 'english-hsc-1st-paper' && (
    <EnglishFirstPaperHome classLabel="HSC" onNavigate={navigate} />
)}
{view === 'english-hsc-reading' && (
    <EnglishSectionList
        title="Reading"
        subtitle="Select a reading question type."
        items={englishReadingTypes}
        onBack={() => navigate('english-hsc-1st-paper')}
        onSelect={(item) => {
            setSelectedEnglishSection('Reading');
            setSelectedEnglishType(item);
            setSelectedEnglishSubtype(null);
            if (item.children?.length) {
                navigate('english-hsc-subtypes');
            } else {
                navigate('english-hsc-questions');
            }
        }}
        onNavigate={navigate}
    />
)}
{view === 'english-hsc-writing' && (
    <EnglishSectionList
        title="Writing"
        subtitle="Select a writing question type."
        items={englishWritingTypes}
        onBack={() => navigate('english-hsc-1st-paper')}
        onSelect={(item) => {
            setSelectedEnglishSection('Writing');
            setSelectedEnglishType(item);
            setSelectedEnglishSubtype(null);
            if (item.children?.length) {
                navigate('english-hsc-subtypes');
            } else {
                navigate('english-hsc-questions');
            }
        }}
        onNavigate={navigate}
    />
)}
{view === 'english-hsc-subtypes' && (
    <EnglishSectionList
        title={selectedEnglishType?.label || 'Question type'}
        subtitle="Choose a specific question variation."
        items={selectedEnglishType?.children || []}
        onBack={() =>
            navigate(selectedEnglishSection === 'Writing' ? 'english-hsc-writing' : 'english-hsc-reading')
        }
        onSelect={(child) => {
            setSelectedEnglishSubtype(child);
            navigate('english-hsc-questions');
        }}
        onNavigate={navigate}
    />
)}
{view === 'english-hsc-questions' && (
    <EnglishQuestionList
        title={englishQuestionTitle}
        subtitle={englishQuestionSubtitle}
        questions={englishQuestionEntries}
        onAdd={addQuestionEntry(setEnglishQuestions, englishQuestionKey)}
        onUpdate={updateQuestionEntry(setEnglishQuestions, englishQuestionKey)}
        onDelete={removeQuestionEntry(setEnglishQuestions, englishQuestionKey)}
        onBack={() =>
            navigate(
                selectedEnglishType?.children?.length
                    ? 'english-hsc-subtypes'
                    : selectedEnglishSection === 'Writing'
                        ? 'english-hsc-writing'
                        : 'english-hsc-reading'
            )
        }
        onNavigate={navigate}
    />
)}
`;var oi={id:"english",state:si,types:ai,views:{public:ii,admin:ni}};var ri=`
            const [sscBangladeshGlobalChapters, setSscBangladeshGlobalChapters] = useState([]);
`;var ci="";var li=`
{view === 'public-ssc-bangladesh-global-studies' && (
    <PublicScienceShell
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        title="Bangladesh & Global Studies \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="\u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6 \u0993 \u09AC\u09BF\u09B6\u09CD\u09AC\u09AA\u09B0\u09BF\u099A\u09DF \u09AC\u09BF\u09B7\u09DF\u099F\u09BF\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Bangladesh and Global Studies"
            chapters={sscBangladeshGlobalChapters}
            recentRoute="public-ssc-bangladesh-global-studies"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Bangladesh and Global Studies'
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-bangladesh-global-studies-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-bangladesh-global-studies-topics' && (
    <PublicScienceShell
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-ssc-bangladesh-global-studies')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-bangladesh-global-studies-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-bangladesh-global-studies-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', 'Bangladesh and Global Studies', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-bangladesh-global-studies-cq')}
        onNavigateMcq={() => navigate('public-ssc-bangladesh-global-studies-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-bangladesh-global-studies-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-bangladesh-global-studies-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-bangladesh-global-studies-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Bangladesh and Global Studies"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-ssc-bangladesh-global-studies-topic')}
        onNavigate={navigate}
    />
)}
`;var di=`
{view === 'admin-ssc-bangladesh-global-studies' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapters={sscBangladeshGlobalChapters}
        onAdd={addChapterItem(setSscBangladeshGlobalChapters)}
        onUpdate={updateChapterItem(setSscBangladeshGlobalChapters)}
        onDelete={removeChapterItem(setSscBangladeshGlobalChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Bangladesh and Global Studies'
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-bangladesh-global-studies-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setSscBangladeshGlobalChapters)}
        onUpdateTopic={updateTopicItem(setSscBangladeshGlobalChapters)}
        onDeleteTopic={removeTopicItem(setSscBangladeshGlobalChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-bangladesh-global-studies-topic');
        }}
        onBack={() => navigate('admin-ssc-bangladesh-global-studies')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Bangladesh and Global Studies"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', 'Bangladesh and Global Studies', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-bangladesh-global-studies-topics')}
        onNavigateCq={() => navigate('admin-ssc-bangladesh-global-studies-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-bangladesh-global-studies-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-ssc-bangladesh-global-studies-topic"
        questionRoute="admin-ssc-bangladesh-global-studies-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey(
                    'SSC',
                    'Bangladesh and Global Studies',
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                'Bangladesh and Global Studies',
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        typeRoute="admin-ssc-bangladesh-global-studies-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-bangladesh-global-studies-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[
                getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
            ] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', 'Bangladesh and Global Studies', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-bangladesh-global-studies-topic"
        onNavigate={navigate}
    />
)}
`;var pi={id:"humanities",state:ri,types:ci,views:{public:li,admin:di}};var ui=`
            const [selectedIctChapter, setSelectedIctChapter] = useState(null);
            const [selectedIctClass, setSelectedIctClass] = useState('SSC');
            const [sscIctChapters, setSscIctChapters] = useState([]);
            const [hscIctChapters, setHscIctChapters] = useState([]);
`;var mi="";var hi=`
{view === 'public-ssc-ict' && (
    <PublicIctShell
        title="\u0986\u0987\u09B8\u09BF\u099F\u09BF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="SSC \u0986\u0987\u09B8\u09BF\u099F\u09BF\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        classLabel="SSC"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicIctChapterList
            classLabel="SSC"
            subjectLabel="Information and Communication Technology"
            chapters={sscIctChapters}
            recentRoute="public-ssc-ict"
            onSelectChapter={(chapter) => {
                setSelectedIctChapter(chapter);
                setSelectedIctClass('SSC');
                navigate('public-ssc-ict-mcq');
            }}
        />
    </PublicIctShell>
)}
{view === 'public-ssc-ict-mcq' && (
    <PublicIctMcqDetail
        classLabel={selectedIctClass}
        chapter={selectedIctChapter}
        mcqQuestions={mcqQuestions}
        getQuestionKey={getQuestionKey}
        onBack={() => navigate('public-ssc-ict')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict' && (
    <PublicScienceShell
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        title="\u0986\u0987\u09B8\u09BF\u099F\u09BF \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC \u0986\u0987\u09B8\u09BF\u099F\u09BF\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Information and Communication Technology"
            chapters={hscIctChapters}
            recentRoute="public-hsc-ict"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Information and Communication Technology',
                    questionKey: 'ICT'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-ict-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-ict-topics' && (
    <PublicScienceShell
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-ict')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-ict-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-ict-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'ICT', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-ict-cq')}
        onNavigateMcq={() => navigate('public-hsc-ict-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-ict-topic"
        cqQuestions={{
            gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || [],
            scenario:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'scenario')] || []
        }}
        mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-hsc-ict-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan: srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'gyan')] || [],
            onudhabon:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'onudhabon')] || [],
            scenario:
                srijonshilQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'scenario')] || []
        }}
        onBack={() => navigate('public-hsc-ict-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-ict-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Information and Communication Technology"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onBack={() => navigate('public-hsc-ict-topic')}
        onNavigate={navigate}
    />
)}
`;var gi=`
{view === 'admin-ssc-ict' && (
    <IctChapterList
        classLabel="SSC"
        subjectLabel="Information and Communication Technology"
        chapters={sscIctChapters}
        onAdd={addChapterItem(setSscIctChapters)}
        onUpdate={updateChapterItem(setSscIctChapters)}
        onDelete={removeChapterItem(setSscIctChapters)}
        onSelect={(chapter) => {
            setSelectedIctChapter(chapter);
            setSelectedIctClass('SSC');
            navigate('admin-ssc-ict-mcq');
        }}
        onBack={() => navigate('admin-groups-ssc')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-ict-mcq' && (
    <McqQuestionList
        classLabel={selectedIctClass}
        itemName={selectedIctChapter?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF'}
        questions={mcqQuestions[getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey(selectedIctClass, 'ICT', selectedIctChapter?.id, 'mcq'))}
        itemRoute={selectedIctClass === 'HSC' ? 'admin-hsc-ict' : 'admin-ssc-ict'}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapters={hscIctChapters}
        onAdd={addChapterItem(setHscIctChapters)}
        onUpdate={updateChapterItem(setHscIctChapters)}
        onDelete={removeChapterItem(setHscIctChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Information and Communication Technology',
                questionKey: 'ICT'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-ict-topics');
        }}
        onBack={() => navigate('admin-groups-hsc')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-ict-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscIctChapters)}
        onUpdateTopic={updateTopicItem(setHscIctChapters)}
        onDeleteTopic={removeTopicItem(setHscIctChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-ict-topic');
        }}
        onBack={() => navigate('admin-hsc-ict')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-ict-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Information and Communication Technology"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'ICT', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-ict-topics')}
        onNavigateCq={() => navigate('admin-hsc-ict-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-ict-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-ict-topic"
        questionRoute="admin-hsc-ict-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'ICT', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        itemRoute="admin-hsc-ict-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-ict-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={mcqQuestions[getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq')] || []}
        onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('HSC', 'ICT', activeScienceTopicKey, 'mcq'))}
        itemRoute="admin-hsc-ict-topic"
        onNavigate={navigate}
    />
)}
`;var bi={id:"ict",state:ui,types:mi,views:{public:hi,admin:gi}};var yi=`
            const [selectedReligion, setSelectedReligion] = useState(null);
            const [sscReligionChapters, setSscReligionChapters] = useState({
                Islam: [],
                Hinduism: [],
                Buddhism: [],
                Christianity: []
            });
`;var vi="";var fi=`
{view === 'public-ssc-religion' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title="Religion and Moral Education"
        subtitle="\u09A7\u09B0\u09CD\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964"
        onBack={() => navigate('ssc-subjects')}
        onNavigate={navigate}
    >
        <PublicReligionOptionList
            options={religionOptions}
            onSelect={(option) => {
                setSelectedReligion(option);
                setSelectedScienceChapter(null);
                setSelectedScienceTopic(null);
                navigate('public-ssc-religion-chapters');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-chapters' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title="Religion & Moral Education \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle={selectedReligion?.subtitle || '\u09A7\u09B0\u09CD\u09AE \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        onBack={() => navigate('public-ssc-religion')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="SSC"
            subjectLabel="Religion and Moral Education"
            chapters={sscReligionChapters[selectedReligion?.key] || []}
            recentRoute="public-ssc-religion-chapters"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'SSC',
                    subjectLabel: 'Religion and Moral Education',
                    religionKey: selectedReligion?.key
                });
                setSelectedScienceTopic(null);
                navigate('public-ssc-religion-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-topics' && (
    <PublicScienceShell
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-ssc-religion-chapters')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-ssc-religion-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-ssc-religion-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-ssc-religion-cq')}
        onNavigateMcq={() => navigate('public-ssc-religion-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-ssc-religion-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-religion-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-religion-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-ssc-religion-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-ssc-religion-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Religion and Moral Education"
        classLabel="SSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onBack={() => navigate('public-ssc-religion-topic')}
        onNavigate={navigate}
    />
)}
`;var Si=`
{view === 'admin-ssc-religion' && (
    <ReligionSelectionList
        classLabel="SSC"
        options={religionOptions}
        onSelect={(option) => {
            setSelectedReligion(option);
            setSelectedScienceChapter(null);
            setSelectedScienceTopic(null);
            navigate('admin-ssc-religion-chapters');
        }}
        onBack={() => navigate('admin-groups-ssc')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-chapters' && (
    <ScienceChapterList
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapters={sscReligionChapters[selectedReligion?.key] || []}
        onBack={() => navigate('admin-ssc-religion')}
        onAdd={(chapter) =>
            selectedReligion?.key &&
            addReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapter)
        }
        onUpdate={(chapterId, name) =>
            selectedReligion?.key &&
            updateReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapterId, name)
        }
        onDelete={(chapterId) =>
            selectedReligion?.key &&
            removeReligionChapterItem(setSscReligionChapters)(selectedReligion.key, chapterId)
        }
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'SSC',
                subjectLabel: 'Religion and Moral Education',
                religionKey: selectedReligion?.key
            });
            setSelectedScienceTopic(null);
            navigate('admin-ssc-religion-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-ssc-religion-topics' && (
    <ScienceTopicList
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapter={selectedScienceChapter}
        onAddTopic={(chapterId, topic) =>
            selectedReligion?.key &&
            addReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topic)
        }
        onUpdateTopic={(chapterId, topicId, name) =>
            selectedReligion?.key &&
            updateReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topicId, name)
        }
        onDeleteTopic={(chapterId, topicId) =>
            selectedReligion?.key &&
            removeReligionTopicItem(setSscReligionChapters)(selectedReligion.key, chapterId, topicId)
        }
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-ssc-religion-topic');
        }}
        onBack={() => navigate('admin-ssc-religion-chapters')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-ssc-religion-topic' && (
    <ScienceTopicDetail
        classLabel="SSC"
        subjectLabel="Religion and Moral Education"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-ssc-religion-topics')}
        onNavigateCq={() => navigate('admin-ssc-religion-cq-types')}
        onNavigateMcq={() => navigate('admin-ssc-religion-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-cq-types' && (
    <SrijonshilTypeList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-ssc-religion-topic"
        questionRoute="admin-ssc-religion-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey(
                    'SSC',
                    getReligionSubjectKey(selectedReligion),
                    activeScienceTopicKey,
                    selectedScienceCqType?.key
                )
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                getReligionSubjectKey(selectedReligion),
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                getReligionSubjectKey(selectedReligion),
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey(
                'SSC',
                getReligionSubjectKey(selectedReligion),
                activeScienceTopicKey,
                selectedScienceCqType?.key
            )
        )}
        typeRoute="admin-ssc-religion-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-ssc-religion-mcq' && (
    <McqQuestionList
        classLabel="SSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[
                getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
            ] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('SSC', getReligionSubjectKey(selectedReligion), activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-ssc-religion-topic"
        onNavigate={navigate}
    />
)}
`;var xi={id:"religion",state:yi,types:vi,views:{public:fi,admin:Si}};var Ni=`
            const [selectedScienceChapter, setSelectedScienceChapter] = useState(null);
            const [selectedScienceTopic, setSelectedScienceTopic] = useState(null);
            const [selectedScienceCqType, setSelectedScienceCqType] = useState(null);
            const [selectedScienceSubject, setSelectedScienceSubject] = useState(null);
            const [sscPhysicsChapters, setSscPhysicsChapters] = useState([]);
            const [sscChemistryChapters, setSscChemistryChapters] = useState([]);
            const [sscBiologyChapters, setSscBiologyChapters] = useState([]);
            const [hscPhysics1stChapters, setHscPhysics1stChapters] = useState([]);
            const [hscPhysics2ndChapters, setHscPhysics2ndChapters] = useState([]);
            const [hscChemistry1stChapters, setHscChemistry1stChapters] = useState([]);
            const [hscChemistry2ndChapters, setHscChemistry2ndChapters] = useState([]);
            const [hscBiology1stChapters, setHscBiology1stChapters] = useState([]);
            const [hscBiology2ndChapters, setHscBiology2ndChapters] = useState([]);
`;var Ci="";var wi=`
{view === 'admin-ssc-physics' && (
<ScienceChapterList
classLabel="SSC"
subjectLabel="Physics"
chapters={sscPhysicsChapters}
onAdd={addChapterItem(setSscPhysicsChapters)}
onUpdate={updateChapterItem(setSscPhysicsChapters)}
onDelete={removeChapterItem(setSscPhysicsChapters)}
onSelect={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Physics'
});
setSelectedScienceTopic(null);
navigate('admin-ssc-physics-topics');
}}
onNavigate={navigate}
canManageStructure={canManageStructure}
canManageThumbnails={canManageThumbnails}
/>
)}
{view === 'admin-ssc-physics-topics' && (
<ScienceTopicList
classLabel="SSC"
subjectLabel="Physics"
chapter={selectedScienceChapter}
onAddTopic={addTopicItem(setSscPhysicsChapters)}
onUpdateTopic={updateTopicItem(setSscPhysicsChapters)}
onDeleteTopic={removeTopicItem(setSscPhysicsChapters)}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('admin-ssc-physics-topic');
}}
onBack={() => navigate('admin-ssc-physics')}
onNavigate={navigate}
canManageStructure={canManageStructure}
/>
)}
{view === 'admin-ssc-physics-topic' && (
<ScienceTopicDetail
classLabel="SSC"
subjectLabel="Physics"
chapter={selectedScienceChapter}
topic={selectedScienceTopic}
noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
videosByItem={videosByItem}
onUpdateNotes={setNotesByItem}
onUpdateVideos={setVideosByItem}
onBack={() => navigate('admin-ssc-physics-topics')}
onNavigateCq={() => navigate('admin-ssc-physics-cq-types')}
onNavigateMcq={() => navigate('admin-ssc-physics-mcq')}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-physics-cq-types' && (
<SrijonshilTypeList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
itemRoute="admin-ssc-physics-topic"
questionRoute="admin-ssc-physics-cq-questions"
title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
onSelectType={(type) => setSelectedScienceCqType(type)}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-physics-cq-questions' && (
<SrijonshilQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
questions={
srijonshilQuestions[
getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
] || []
}
onAdd={addQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onUpdate={updateQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onDelete={removeQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Physics', activeScienceTopicKey, selectedScienceCqType?.key)
)}
typeRoute="admin-ssc-physics-cq-types"
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-physics-mcq' && (
<McqQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
questions={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
onAdd={addQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
onUpdate={updateQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
onDelete={removeQuestionEntry(setMcqQuestions, getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq'))}
itemRoute="admin-ssc-physics-topic"
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-chemistry' && (
<ScienceChapterList
classLabel="SSC"
subjectLabel="Chemistry"
chapters={sscChemistryChapters}
onAdd={addChapterItem(setSscChemistryChapters)}
onUpdate={updateChapterItem(setSscChemistryChapters)}
onDelete={removeChapterItem(setSscChemistryChapters)}
onSelect={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Chemistry'
});
setSelectedScienceTopic(null);
navigate('admin-ssc-chemistry-topics');
}}
onNavigate={navigate}
canManageStructure={canManageStructure}
canManageThumbnails={canManageThumbnails}
/>
)}
{view === 'admin-ssc-chemistry-topics' && (
<ScienceTopicList
classLabel="SSC"
subjectLabel="Chemistry"
chapter={selectedScienceChapter}
onAddTopic={addTopicItem(setSscChemistryChapters)}
onUpdateTopic={updateTopicItem(setSscChemistryChapters)}
onDeleteTopic={removeTopicItem(setSscChemistryChapters)}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('admin-ssc-chemistry-topic');
}}
onBack={() => navigate('admin-ssc-chemistry')}
onNavigate={navigate}
canManageStructure={canManageStructure}
/>
)}
{view === 'admin-ssc-chemistry-topic' && (
<ScienceTopicDetail
classLabel="SSC"
subjectLabel="Chemistry"
chapter={selectedScienceChapter}
topic={selectedScienceTopic}
noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
videosByItem={videosByItem}
onUpdateNotes={setNotesByItem}
onUpdateVideos={setVideosByItem}
onBack={() => navigate('admin-ssc-chemistry-topics')}
onNavigateCq={() => navigate('admin-ssc-chemistry-cq-types')}
onNavigateMcq={() => navigate('admin-ssc-chemistry-mcq')}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-chemistry-cq-types' && (
<SrijonshilTypeList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
itemRoute="admin-ssc-chemistry-topic"
questionRoute="admin-ssc-chemistry-cq-questions"
title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
onSelectType={(type) => setSelectedScienceCqType(type)}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-chemistry-cq-questions' && (
<SrijonshilQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
questions={
srijonshilQuestions[
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
] || []
}
onAdd={addQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onUpdate={updateQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onDelete={removeQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, selectedScienceCqType?.key)
)}
typeRoute="admin-ssc-chemistry-cq-types"
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-chemistry-mcq' && (
<McqQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
questions={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
onAdd={addQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
)}
onUpdate={updateQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
)}
onDelete={removeQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')
)}
itemRoute="admin-ssc-chemistry-topic"
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-biology' && (
<ScienceChapterList
classLabel="SSC"
subjectLabel="Biology"
chapters={sscBiologyChapters}
onAdd={addChapterItem(setSscBiologyChapters)}
onUpdate={updateChapterItem(setSscBiologyChapters)}
onDelete={removeChapterItem(setSscBiologyChapters)}
onSelect={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Biology'
});
setSelectedScienceTopic(null);
navigate('admin-ssc-biology-topics');
}}
onNavigate={navigate}
canManageStructure={canManageStructure}
canManageThumbnails={canManageThumbnails}
/>
)}
{view === 'admin-ssc-biology-topics' && (
<ScienceTopicList
classLabel="SSC"
subjectLabel="Biology"
chapter={selectedScienceChapter}
onAddTopic={addTopicItem(setSscBiologyChapters)}
onUpdateTopic={updateTopicItem(setSscBiologyChapters)}
onDeleteTopic={removeTopicItem(setSscBiologyChapters)}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('admin-ssc-biology-topic');
}}
onBack={() => navigate('admin-ssc-biology')}
onNavigate={navigate}
canManageStructure={canManageStructure}
/>
)}
{view === 'admin-ssc-biology-topic' && (
<ScienceTopicDetail
classLabel="SSC"
subjectLabel="Biology"
chapter={selectedScienceChapter}
topic={selectedScienceTopic}
noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
videosByItem={videosByItem}
onUpdateNotes={setNotesByItem}
onUpdateVideos={setVideosByItem}
onBack={() => navigate('admin-ssc-biology-topics')}
onNavigateCq={() => navigate('admin-ssc-biology-cq-types')}
onNavigateMcq={() => navigate('admin-ssc-biology-mcq')}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-biology-cq-types' && (
<SrijonshilTypeList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
itemRoute="admin-ssc-biology-topic"
questionRoute="admin-ssc-biology-cq-questions"
title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
onSelectType={(type) => setSelectedScienceCqType(type)}
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-biology-cq-questions' && (
<SrijonshilQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
questions={
srijonshilQuestions[
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
] || []
}
onAdd={addQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onUpdate={updateQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
)}
onDelete={removeQuestionEntry(
setSrijonshilQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, selectedScienceCqType?.key)
)}
typeRoute="admin-ssc-biology-cq-types"
onNavigate={navigate}
/>
)}
{view === 'admin-ssc-biology-mcq' && (
<McqQuestionList
classLabel="SSC"
itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
questions={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
onAdd={addQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
)}
onUpdate={updateQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
)}
onDelete={removeQuestionEntry(
setMcqQuestions,
getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')
)}
itemRoute="admin-ssc-biology-topic"
onNavigate={navigate}
/>
)}
`;var Ti=`
{view === 'admin-hsc-biology-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapters={hscBiology1stChapters}
        onAdd={addChapterItem(setHscBiology1stChapters)}
        onUpdate={updateChapterItem(setHscBiology1stChapters)}
        onDelete={removeChapterItem(setHscBiology1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Biology 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-biology-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-biology-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscBiology1stChapters)}
        onUpdateTopic={updateTopicItem(setHscBiology1stChapters)}
        onDeleteTopic={removeTopicItem(setHscBiology1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-biology-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-biology-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-biology-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Biology 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-biology-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-biology-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-biology-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-biology-1st-topic"
        questionRoute="admin-hsc-biology-1st-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-1st-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-biology-1st-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-biology-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapters={hscBiology2ndChapters}
        onAdd={addChapterItem(setHscBiology2ndChapters)}
        onUpdate={updateChapterItem(setHscBiology2ndChapters)}
        onDelete={removeChapterItem(setHscBiology2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Biology 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-biology-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-biology-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscBiology2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscBiology2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscBiology2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-biology-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-biology-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-biology-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Biology 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-biology-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-biology-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-biology-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-biology-2nd-topic"
        questionRoute="admin-hsc-biology-2nd-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-biology-2nd-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-biology-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-biology-2nd-topic"
        onNavigate={navigate}
    />
)}
`;var Ei=`
{view === 'admin-hsc-chemistry-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapters={hscChemistry1stChapters}
        onAdd={addChapterItem(setHscChemistry1stChapters)}
        onUpdate={updateChapterItem(setHscChemistry1stChapters)}
        onDelete={removeChapterItem(setHscChemistry1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Chemistry 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-chemistry-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-chemistry-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscChemistry1stChapters)}
        onUpdateTopic={updateTopicItem(setHscChemistry1stChapters)}
        onDeleteTopic={removeTopicItem(setHscChemistry1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-chemistry-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-chemistry-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-chemistry-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Chemistry 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-chemistry-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-chemistry-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-chemistry-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-chemistry-1st-topic"
        questionRoute="admin-hsc-chemistry-1st-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-chemistry-1st-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-chemistry-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapters={hscChemistry2ndChapters}
        onAdd={addChapterItem(setHscChemistry2ndChapters)}
        onUpdate={updateChapterItem(setHscChemistry2ndChapters)}
        onDelete={removeChapterItem(setHscChemistry2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Chemistry 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-chemistry-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-chemistry-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscChemistry2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscChemistry2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscChemistry2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-chemistry-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-chemistry-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-chemistry-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Chemistry 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-chemistry-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-chemistry-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-chemistry-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-chemistry-2nd-topic"
        questionRoute="admin-hsc-chemistry-2nd-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-chemistry-2nd-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-chemistry-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-chemistry-2nd-topic"
        onNavigate={navigate}
    />
)}
`;var Li=`
{view === 'admin-hsc-physics-1st' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapters={hscPhysics1stChapters}
        onAdd={addChapterItem(setHscPhysics1stChapters)}
        onUpdate={updateChapterItem(setHscPhysics1stChapters)}
        onDelete={removeChapterItem(setHscPhysics1stChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Physics 1st Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-physics-1st-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-physics-1st-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscPhysics1stChapters)}
        onUpdateTopic={updateTopicItem(setHscPhysics1stChapters)}
        onDeleteTopic={removeTopicItem(setHscPhysics1stChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-physics-1st-topic');
        }}
        onBack={() => navigate('admin-hsc-physics-1st')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-physics-1st-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Physics 1st Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-physics-1st-topics')}
        onNavigateCq={() => navigate('admin-hsc-physics-1st-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-physics-1st-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-physics-1st-topic"
        questionRoute="admin-hsc-physics-1st-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-physics-1st-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-1st-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-physics-1st-topic"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd' && (
    <ScienceChapterList
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapters={hscPhysics2ndChapters}
        onAdd={addChapterItem(setHscPhysics2ndChapters)}
        onUpdate={updateChapterItem(setHscPhysics2ndChapters)}
        onDelete={removeChapterItem(setHscPhysics2ndChapters)}
        onSelect={(chapter) => {
            setSelectedScienceChapter(chapter);
            setSelectedScienceSubject({
                classLabel: 'HSC',
                subjectLabel: 'Physics 2nd Paper'
            });
            setSelectedScienceTopic(null);
            navigate('admin-hsc-physics-2nd-topics');
        }}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
        canManageThumbnails={canManageThumbnails}
    />
)}
{view === 'admin-hsc-physics-2nd-topics' && (
    <ScienceTopicList
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapter={selectedScienceChapter}
        onAddTopic={addTopicItem(setHscPhysics2ndChapters)}
        onUpdateTopic={updateTopicItem(setHscPhysics2ndChapters)}
        onDeleteTopic={removeTopicItem(setHscPhysics2ndChapters)}
        onSelectTopic={(topic) => {
            setSelectedScienceTopic(topic);
            navigate('admin-hsc-physics-2nd-topic');
        }}
        onBack={() => navigate('admin-hsc-physics-2nd')}
        onNavigate={navigate}
        canManageStructure={canManageStructure}
    />
)}
{view === 'admin-hsc-physics-2nd-topic' && (
    <ScienceTopicDetail
        classLabel="HSC"
        subjectLabel="Physics 2nd Paper"
        chapter={selectedScienceChapter}
        topic={selectedScienceTopic}
        noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        videosByItem={videosByItem}
        onUpdateNotes={setNotesByItem}
        onUpdateVideos={setVideosByItem}
        onBack={() => navigate('admin-hsc-physics-2nd-topics')}
        onNavigateCq={() => navigate('admin-hsc-physics-2nd-cq-types')}
        onNavigateMcq={() => navigate('admin-hsc-physics-2nd-mcq')}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-cq-types' && (
    <SrijonshilTypeList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        itemRoute="admin-hsc-physics-2nd-topic"
        questionRoute="admin-hsc-physics-2nd-cq-questions"
        title="CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8"
        subtitle={(selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995') + ' \u098F\u09B0 \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8\u09C7\u09B0 \u09A7\u09B0\u09A8 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8\u0964'}
        onSelectType={(type) => setSelectedScienceCqType(type)}
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-cq-questions' && (
    <SrijonshilQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        typeLabel={selectedScienceCqType?.label || 'CQ \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8'}
        questions={
            srijonshilQuestions[
                getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
            ] || []
        }
        onAdd={addQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onUpdate={updateQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        onDelete={removeQuestionEntry(
            setSrijonshilQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, selectedScienceCqType?.key)
        )}
        typeRoute="admin-hsc-physics-2nd-cq-types"
        onNavigate={navigate}
    />
)}
{view === 'admin-hsc-physics-2nd-mcq' && (
    <McqQuestionList
        classLabel="HSC"
        itemName={selectedScienceTopic?.name || '\u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u099F\u09AA\u09BF\u0995'}
        questions={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onAdd={addQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onUpdate={updateQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        onDelete={removeQuestionEntry(
            setMcqQuestions,
            getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')
        )}
        itemRoute="admin-hsc-physics-2nd-topic"
        onNavigate={navigate}
    />
)}
`;var Pi=`${Li}${Ei}${Ti}`;var ki=`
{view === 'public-ssc-physics' && (
<PublicScienceShell
subjectLabel="Physics"
classLabel="SSC"
title="Physics \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
subtitle="SSC Physics \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
onBack={() => navigate('ssc-subjects')}
onNavigate={navigate}
>
<PublicScienceChapterList
classLabel="SSC"
subjectLabel="Physics"
chapters={sscPhysicsChapters}
recentRoute="public-ssc-physics"
onSelectChapter={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Physics'
});
setSelectedScienceTopic(null);
navigate('public-ssc-physics-topics');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-physics-topics' && (
<PublicScienceShell
subjectLabel="Physics"
classLabel="SSC"
title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
onBack={() => navigate('public-ssc-physics')}
onNavigate={navigate}
>
<PublicScienceTopicList
topics={selectedScienceChapter?.topics || []}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('public-ssc-physics-topic');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-physics-topic' && (
<PublicScienceTopicDetail
subjectLabel="Physics"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
noteKey={['SSC', 'Physics', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
onNavigateCq={() => navigate('public-ssc-physics-cq')}
onNavigateMcq={() => navigate('public-ssc-physics-mcq')}
onOpenVideos={(context) => {
setSelectedVideoContext({
...context,
backgroundClass: 'bg-[#ecfdf3]'
});
navigate('public-videos');
}}
backRoute="public-ssc-physics-topic"
cqQuestions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'scenario')] || []
}}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-physics-topics')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-physics-cq' && (
<PublicScienceCqDetail
subjectLabel="Physics"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
questions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'scenario')] || []
}}
onBack={() => navigate('public-ssc-physics-topic')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-physics-mcq' && (
<PublicScienceMcqDetail
subjectLabel="Physics"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Physics', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-physics-topic')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-chemistry' && (
<PublicScienceShell
subjectLabel="Chemistry"
classLabel="SSC"
title="Chemistry \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
subtitle="SSC Chemistry \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
onBack={() => navigate('ssc-subjects')}
onNavigate={navigate}
>
<PublicScienceChapterList
classLabel="SSC"
subjectLabel="Chemistry"
chapters={sscChemistryChapters}
recentRoute="public-ssc-chemistry"
onSelectChapter={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Chemistry'
});
setSelectedScienceTopic(null);
navigate('public-ssc-chemistry-topics');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-chemistry-topics' && (
<PublicScienceShell
subjectLabel="Chemistry"
classLabel="SSC"
title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
onBack={() => navigate('public-ssc-chemistry')}
onNavigate={navigate}
>
<PublicScienceTopicList
topics={selectedScienceChapter?.topics || []}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('public-ssc-chemistry-topic');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-chemistry-topic' && (
<PublicScienceTopicDetail
subjectLabel="Chemistry"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
noteKey={['SSC', 'Chemistry', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
onNavigateCq={() => navigate('public-ssc-chemistry-cq')}
onNavigateMcq={() => navigate('public-ssc-chemistry-mcq')}
onOpenVideos={(context) => {
setSelectedVideoContext({
...context,
backgroundClass: 'bg-[#ecfdf3]'
});
navigate('public-videos');
}}
backRoute="public-ssc-chemistry-topic"
cqQuestions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'scenario')] || []
}}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-chemistry-topics')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-chemistry-cq' && (
<PublicScienceCqDetail
subjectLabel="Chemistry"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
questions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'scenario')] || []
}}
onBack={() => navigate('public-ssc-chemistry-topic')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-chemistry-mcq' && (
<PublicScienceMcqDetail
subjectLabel="Chemistry"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Chemistry', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-chemistry-topic')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-biology' && (
<PublicScienceShell
subjectLabel="Biology"
classLabel="SSC"
title="Biology \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
subtitle="SSC Biology \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
onBack={() => navigate('ssc-subjects')}
onNavigate={navigate}
>
<PublicScienceChapterList
classLabel="SSC"
subjectLabel="Biology"
chapters={sscBiologyChapters}
recentRoute="public-ssc-biology"
onSelectChapter={(chapter) => {
setSelectedScienceChapter(chapter);
setSelectedScienceSubject({
classLabel: 'SSC',
subjectLabel: 'Biology'
});
setSelectedScienceTopic(null);
navigate('public-ssc-biology-topics');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-biology-topics' && (
<PublicScienceShell
subjectLabel="Biology"
classLabel="SSC"
title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
onBack={() => navigate('public-ssc-biology')}
onNavigate={navigate}
>
<PublicScienceTopicList
topics={selectedScienceChapter?.topics || []}
onSelectTopic={(topic) => {
setSelectedScienceTopic(topic);
navigate('public-ssc-biology-topic');
}}
/>
</PublicScienceShell>
)}
{view === 'public-ssc-biology-topic' && (
<PublicScienceTopicDetail
subjectLabel="Biology"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
noteKey={['SSC', 'Biology', activeScienceTopicKey].join('-')}
notesByItem={notesByItem}
onNavigateCq={() => navigate('public-ssc-biology-cq')}
onNavigateMcq={() => navigate('public-ssc-biology-mcq')}
onOpenVideos={(context) => {
setSelectedVideoContext({
...context,
backgroundClass: 'bg-[#ecfdf3]'
});
navigate('public-videos');
}}
backRoute="public-ssc-biology-topic"
cqQuestions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'scenario')] || []
}}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-biology-topics')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-biology-cq' && (
<PublicScienceCqDetail
subjectLabel="Biology"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
questions={{
gyan: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'gyan')] || [],
onudhabon:
srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'onudhabon')] ||
[],
scenario: srijonshilQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'scenario')] || []
}}
onBack={() => navigate('public-ssc-biology-topic')}
onNavigate={navigate}
/>
)}
{view === 'public-ssc-biology-mcq' && (
<PublicScienceMcqDetail
subjectLabel="Biology"
classLabel="SSC"
chapterName={selectedScienceChapter?.name}
topicName={selectedScienceTopic?.name}
mcqList={mcqQuestions[getQuestionKey('SSC', 'Biology', activeScienceTopicKey, 'mcq')] || []}
onBack={() => navigate('public-ssc-biology-topic')}
onNavigate={navigate}
/>
)}
`;var Ii=`
{view === 'public-hsc-physics-1st' && (
    <PublicScienceShell
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        title="Physics 1st Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Physics 1st Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Physics 1st Paper"
            chapters={hscPhysics1stChapters}
            recentRoute="public-hsc-physics-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Physics 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-physics-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-physics-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-physics-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Physics 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-physics-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-physics-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-physics-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-physics-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Physics 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd' && (
    <PublicScienceShell
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        title="Physics 2nd Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Physics 2nd Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Physics 2nd Paper"
            chapters={hscPhysics2ndChapters}
            recentRoute="public-hsc-physics-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Physics 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-physics-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-physics-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-physics-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-physics-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Physics 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-physics-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-physics-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-physics-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'gyan')] ||
                [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-physics-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-physics-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Physics 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Physics 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-physics-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;var Ri=`
{view === 'public-hsc-chemistry-1st' && (
    <PublicScienceShell
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        title="Chemistry 1st Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Chemistry 1st Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Chemistry 1st Paper"
            chapters={hscChemistry1stChapters}
            recentRoute="public-hsc-chemistry-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Chemistry 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-chemistry-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-chemistry-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-chemistry-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Chemistry 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-chemistry-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-chemistry-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-chemistry-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-chemistry-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Chemistry 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd' && (
    <PublicScienceShell
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        title="Chemistry 2nd Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Chemistry 2nd Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Chemistry 2nd Paper"
            chapters={hscChemistry2ndChapters}
            recentRoute="public-hsc-chemistry-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Chemistry 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-chemistry-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-chemistry-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-chemistry-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-chemistry-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Chemistry 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-chemistry-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-chemistry-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-chemistry-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-chemistry-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Chemistry 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Chemistry 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-chemistry-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;var ji=`
{view === 'public-hsc-biology-1st' && (
    <PublicScienceShell
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        title="Biology 1st Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Biology 1st Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Biology 1st Paper"
            chapters={hscBiology1stChapters}
            recentRoute="public-hsc-biology-1st"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Biology 1st Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-biology-1st-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-1st-topics' && (
    <PublicScienceShell
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-biology-1st')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-biology-1st-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-1st-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Biology 1st Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-biology-1st-cq')}
        onNavigateMcq={() => navigate('public-hsc-biology-1st-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-biology-1st-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-1st-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-1st-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-biology-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-1st-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Biology 1st Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 1st Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-1st-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd' && (
    <PublicScienceShell
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        title="Biology 2nd Paper \u0985\u09A7\u09CD\u09AF\u09BE\u09DF\u09B8\u09AE\u09C2\u09B9"
        subtitle="HSC Biology 2nd Paper \u098F\u09B0 \u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09AC\u09C7\u099B\u09C7 \u09A8\u09BF\u09A8\u0964"
        onBack={() => navigate('hsc-subjects')}
        onNavigate={navigate}
    >
        <PublicScienceChapterList
            classLabel="HSC"
            subjectLabel="Biology 2nd Paper"
            chapters={hscBiology2ndChapters}
            recentRoute="public-hsc-biology-2nd"
            onSelectChapter={(chapter) => {
                setSelectedScienceChapter(chapter);
                setSelectedScienceSubject({
                    classLabel: 'HSC',
                    subjectLabel: 'Biology 2nd Paper'
                });
                setSelectedScienceTopic(null);
                navigate('public-hsc-biology-2nd-topics');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-2nd-topics' && (
    <PublicScienceShell
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        title={selectedScienceChapter?.name || '\u0985\u09A7\u09CD\u09AF\u09BE\u09DF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8'}
        subtitle="\u099F\u09AA\u09BF\u0995 \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8"
        onBack={() => navigate('public-hsc-biology-2nd')}
        onNavigate={navigate}
    >
        <PublicScienceTopicList
            topics={selectedScienceChapter?.topics || []}
            onSelectTopic={(topic) => {
                setSelectedScienceTopic(topic);
                navigate('public-hsc-biology-2nd-topic');
            }}
        />
    </PublicScienceShell>
)}
{view === 'public-hsc-biology-2nd-topic' && (
    <PublicScienceTopicDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        noteKey={['HSC', 'Biology 2nd Paper', activeScienceTopicKey].join('-')}
        notesByItem={notesByItem}
        onNavigateCq={() => navigate('public-hsc-biology-2nd-cq')}
        onNavigateMcq={() => navigate('public-hsc-biology-2nd-mcq')}
        onOpenVideos={(context) => {
            setSelectedVideoContext({
                ...context,
                backgroundClass: 'bg-[#ecfdf3]'
            });
            navigate('public-videos');
        }}
        backRoute="public-hsc-biology-2nd-topic"
        cqQuestions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-2nd-topics')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd-cq' && (
    <PublicScienceCqDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        questions={{
            gyan:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'gyan')
                ] || [],
            onudhabon:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'onudhabon')
                ] || [],
            scenario:
                srijonshilQuestions[
                    getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'scenario')
                ] || []
        }}
        onBack={() => navigate('public-hsc-biology-2nd-topic')}
        onNavigate={navigate}
    />
)}
{view === 'public-hsc-biology-2nd-mcq' && (
    <PublicScienceMcqDetail
        subjectLabel="Biology 2nd Paper"
        classLabel="HSC"
        chapterName={selectedScienceChapter?.name}
        topicName={selectedScienceTopic?.name}
        mcqList={
            mcqQuestions[getQuestionKey('HSC', 'Biology 2nd Paper', activeScienceTopicKey, 'mcq')] || []
        }
        onBack={() => navigate('public-hsc-biology-2nd-topic')}
        onNavigate={navigate}
    />
)}
`;var Gn=ki+Ii+Ri+ji,Vn=wi+Pi,Bi={id:"science",state:Ni,types:Ci,views:{public:Gn,admin:Vn}};var Mi=`
            const [srijonshilQuestions, setSrijonshilQuestions] = useState({});
            const [mcqQuestions, setMcqQuestions] = useState({});
            const [notesByItem, setNotesByItem] = useState({});
            const [videosByItem, setVideosByItem] = useState({});
`;var qi={id:"shared",state:Mi};var we=[ti,oi,pi,bi,xi,Bi,qi].sort((e,t)=>e.id.localeCompare(t.id)),Ai=we.map(e=>e.state).filter(e=>!!e),Di=we.map(e=>e.types).filter(e=>!!e),Ki=we.map(e=>e.views?.public).filter(e=>!!e).join(""),_i=we.map(e=>e.views?.admin).filter(e=>!!e).join("");var Hi=Wa+$a+ca+Ki+Ya;var Ui=`
{view === 'dashboard' && (!user || (user.role !== 'teacher' && user.role !== 'student')) && (
    <AdminDashboard onNavigate={navigate} />
)}
{view === 'admin-groups-ssc' && (
    <AdminGroupSelection classLabel="SSC" onNavigate={navigate} />
)}
{view === 'admin-groups-hsc' && (
    <AdminGroupSelection classLabel="HSC" onNavigate={navigate} />
)}
{view === 'admin-ssc-science' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Science" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-ssc-humanities' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Humanities" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-ssc-business-studies' && (
    <AdminGroupDetail classLabel="SSC" groupLabel="Business Studies" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-science' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Science" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-humanities' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Humanities" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-hsc-business-studies' && (
    <AdminGroupDetail classLabel="HSC" groupLabel="Business Studies" onNavigate={navigate} canManageThumbnails={canManageThumbnails} />
)}
{view === 'admin-settings' && (!user || user.role !== 'teacher') && <AdminSettings onNavigate={navigate} />}
{view === 'admin-users' && (
    <AdminUserList onNavigate={navigate} />
)}
{view === 'admin-user-profile' && (
    <AdminStudentProfile onNavigate={navigate} />
)}
`;var Qi=`
{view === 'dashboard' && user?.role === 'student' && (
    <StudentClassView user={user} onNavigate={navigate} />
)}
{view === 'student-class' && user?.role === 'student' && (
    <StudentClassView user={user} onNavigate={navigate} />
)}
{view === 'student-settings' && user?.role === 'student' && (
    <StudentSettings onNavigate={navigate} />
)}
`;var Oi=`
{view === 'dashboard' && user?.role === 'teacher' && (
    <TeacherDashboard assignment={user.assignment} subjectConfig={teacherSubjectConfig} onNavigate={navigate} />
)}
{view === 'admin-settings' && user?.role === 'teacher' && <TeacherSettings onNavigate={navigate} />}
`;var Fi=Oi+Qi+Ui+_i;var Gi=`
                        </div>
                    </main>
                </div>
            );
`;var Vi=`${za}${Hi}${Fi}${Gi}`;var zi=`
            const [selectedVideoContext, setSelectedVideoContext] = useState(null);
            const [selectedVideoId, setSelectedVideoId] = useState(null);
`;var Wi=`
            const [teacherAssignment, setTeacherAssignment] = useState(null);
            const [teacherPermissions, setTeacherPermissions] = useState([]);
`;var $i=`
            const [studentPoints, setStudentPoints] = useState(0);
            const [studentPointLogs, setStudentPointLogs] = useState([]);
`;var Yi=[qa,Aa,zi,...Ai,_a,Wi,$i,...Di,Da,Ka,Ha,Ua,Qa,Oa,Fa,Ga,Va,Ce,ne,Xe,Vi];var Xi=`
        function App() {
            const statusEndpoint = '/api/system/status';
${Yi.join(`
`)}
        }
`;function Ji(e){return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Freeducation - Learning Platform</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

    <style>
        :root {
            color-scheme: light;
            --card-grid-gap: clamp(0.75rem, 1.4vw, 1.5rem);
            --ui-surface: #ffffff;
            --ui-soft: #f3f6ff;
            --ui-muted: #e2e8f0;
        }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background-color: var(--ui-soft); color: #0f172a; -webkit-text-size-adjust: 100%; min-height: 100vh; font-size: 15px; }
        input, select, textarea { font-size: 16px !important; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-bangla { font-family: 'Noto Sans Bengali', 'Inter', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .thumbnail-float { animation: thumbnailFloat 9s ease-in-out infinite; }
        .float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .float-slower { animation: floatSlow 12s ease-in-out infinite; }
        .pulse-soft { animation: pulseSoft 10s ease-in-out infinite; }
        .marquee-wrapper { position: relative; overflow: hidden; }
        .marquee-track { display: flex; width: max-content; animation: marquee 36s linear infinite; }
        .marquee-wrapper:hover .marquee-track { animation-play-state: paused; }
        .soft-glow { background-color: #eef2ff; }
        .card-grid-gap { gap: var(--card-grid-gap); }
        .card-art-surface {
            position: relative;
            overflow: hidden;
            background: #f1f5f9;
        }
        .card-art-media {
            position: relative;
            z-index: 1;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes thumbnailFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseSoft { 0%, 100% { opacity: 0.9; } 50% { opacity: 1; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
            .thumbnail-float {
                animation: none;
            }
            .float-slow,
            .float-slower,
            .pulse-soft,
            .marquee-track,
            .soft-glow {
                animation: none;
            }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #e2e8f0; }
        ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: #64748b; }
        @media (max-width: 640px) {
            .qa-container { padding: 0 !important; margin: 0 !important; }
            .qa-card { padding: 0 !important; border-radius: 0 !important; width: 100% !important; }
            .qa-card .qa-text,
            .qa-card .qa-text span { display: block; width: 100%; }
            .qa-indent { padding-left: 0 !important; }
        }
    </style>
    <style id="custom-fonts"></style>
</head>
<body>
    <div id="root"></div>

    <script>
        const loadCustomFonts = async () => {
            try {
                const response = await fetch('/api/fonts');
                if (!response.ok) return;
                const fonts = await response.json();
                if (!Array.isArray(fonts) || fonts.length === 0) return;
                const styleEl = document.getElementById('custom-fonts');
                if (!styleEl) return;
                const css = fonts.map((font) => {
                    const name = String(font.name || '').replace(/'/g, "\\'");
                    const url = font.url || '';
                    const format = font.format ? " format('" + font.format + "')" : '';
                    return "@font-face { font-family: '" + name + "'; src: url('" + url + "')" + format + "; font-display: swap; }";
                }).join('\\n');
                styleEl.textContent = css;
            } catch (err) {
                console.warn('Failed to load custom fonts', err);
            }
        };

        loadCustomFonts();
    </script>

    <script>
        window.__INITIAL_VIEW = ${JSON.stringify(e)};
    </script>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        ${Ce}

        ${Us}
        ${Gs}
        ${Qs}
        ${Os}
        ${Fs}
        ${Ws}
        ${Vs}
        ${zs}
        ${Xs}
        ${$s}
        ${Ys}

        ${Ye}
        ${ne}
        ${Je}
        ${tt}
        ${et}
        ${Ze}

        ${Xi}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        try {
            root.render(<App />);
        } catch (error) {
            console.error('Failed to render app', error);
            const rootEl = document.getElementById('root');
            if (rootEl) {
                rootEl.innerHTML = '<div style="padding:24px;font-family:Inter, sans-serif;"><h2>Something went wrong.</h2><p>Please refresh the page or contact support if the problem persists.</p></div>';
            }
        }
    </script>
</body>
</html>
  `}function Zi(e){let t=Ma(e);return Ji(t)}var pg={async fetch(e,t){let s=await Hs(e,t);if(s)return s;let a=new URL(e.url),i={"Content-Type":"text/html","Referrer-Policy":"strict-origin-when-cross-origin","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Permissions-Policy":"camera=(), microphone=(), geolocation=()"};return new Response(Zi(a.pathname),{headers:i})}};export{pg as default};
