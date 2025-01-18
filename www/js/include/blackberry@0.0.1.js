function Be(e){let t=Object.create(null);for(let r of e.split(","))t[r]=1;return r=>r in t}var xt={};var At=()=>{};var ze=Object.assign,Nt=(e,t)=>{let r=e.indexOf(t);r>-1&&e.splice(r,1)},gr=Object.prototype.hasOwnProperty,ae=(e,t)=>gr.
call(e,t),M=Array.isArray,V=e=>ge(e)==="[object Map]",wt=e=>ge(e)==="[object Set]";var Z=e=>typeof e=="function",mr=e=>typeof e=="string",Q=e=>typeof e=="symbol",z=e=>e!==null&&typeof e=="object";var vr=Object.prototype.toString,ge=e=>vr.call(e),Rt=e=>ge(e).slice(8,-1),Ot=e=>ge(e)==="[object Object]",me=e=>mr(e)&&e!==
"NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e;var ve=e=>{let t=Object.create(null);return r=>t[r]||(t[r]=e(r))},yr=/-(\w)/g,fn=ve(e=>e.replace(yr,(t,r)=>r?r.toUpperCase():
"")),br=/\B([A-Z])/g,un=ve(e=>e.replace(br,"-$1").toLowerCase()),Er=ve(e=>e.charAt(0).toUpperCase()+e.slice(1)),pn=ve(e=>e?
`on${Er(e)}`:""),P=(e,t)=>!Object.is(e,t);var Ct=(e,t,r,n=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:n,value:r})};var Sr="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly";var hn=Be(Sr+",async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,\
seamless,checked,muted,multiple,selected");function Tr(e,...t){console.warn(`[Vue warn] ${e}`,...t)}var A,qe=class{constructor(t=!1){this.detached=t,this._active=!0,
this.effects=[],this.cleanups=[],this._isPaused=!1,this.parent=A,!t&&A&&(this.index=(A.scopes||(A.scopes=[])).push(this)-
1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,r;if(this.scopes)for(t=0,r=this.scopes.
length;t<r;t++)this.scopes[t].pause();for(t=0,r=this.effects.length;t<r;t++)this.effects[t].pause()}}resume(){if(this._active&&
this._isPaused){this._isPaused=!1;let t,r;if(this.scopes)for(t=0,r=this.scopes.length;t<r;t++)this.scopes[t].resume();for(t=
0,r=this.effects.length;t<r;t++)this.effects[t].resume()}}run(t){if(this._active){let r=A;try{return A=this,t()}finally{
A=r}}}on(){A=this}off(){A=this.parent}stop(t){if(this._active){this._active=!1;let r,n;for(r=0,n=this.effects.length;r<n;r++)
this.effects[r].stop();for(this.effects.length=0,r=0,n=this.cleanups.length;r<n;r++)this.cleanups[r]();if(this.cleanups.
length=0,this.scopes){for(r=0,n=this.scopes.length;r<n;r++)this.scopes[r].stop(!0);this.scopes.length=0}if(!this.detached&&
this.parent&&!t){let s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.
parent=void 0}}};function Mt(e){return new qe(e)}function xr(){return A}function mn(e,t=!1){A&&A.cleanups.push(e)}var y,
vn={ACTIVE:1,1:"ACTIVE",RUNNING:2,2:"RUNNING",TRACKING:4,4:"TRACKING",NOTIFIED:8,8:"NOTIFIED",DIRTY:16,16:"DIRTY",ALLOW_RECURSE:32,
32:"ALLOW_RECURSE",PAUSED:64,64:"PAUSED"},Ge=new WeakSet,ee=class{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=
void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,A&&A.active&&A.effects.push(this)}pause(){
this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ge.has(this)&&(Ge.delete(this),this.trigger()))}notify(){this.flags&
2&&!(this.flags&32)||this.flags&8||Pt(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Dt(this),It(this);let t=y,
r=C;y=this,C=!0;try{return this.fn()}finally{Ft(this),y=t,C=r,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=
t.nextDep)ot(t);this.deps=this.depsTail=void 0,Dt(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&
64?Ge.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Je(this)&&this.run()}get dirty(){return Je(
this)}},Lt=0,le,fe;function Pt(e,t=!1){if(e.flags|=8,t){e.next=fe,fe=e;return}e.next=le,le=e}function st(){Lt++}function it(){
if(--Lt>0)return;if(fe){let t=fe;for(fe=void 0;t;){let r=t.next;t.next=void 0,t.flags&=-9,t=r}}let e;for(;le;){let t=le;
for(le=void 0;t;){let r=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(n){e||(e=n)}t=r}}if(e)throw e}
function It(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ft(e){
let t,r=e.depsTail,n=r;for(;n;){let s=n.prevDep;n.version===-1?(n===r&&(r=s),ot(n),Ar(n)):t=n,n.dep.activeLink=n.prevActiveLink,
n.prevActiveLink=void 0,n=s}e.deps=t,e.depsTail=r}function Je(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||
t.dep.computed&&(Ut(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ut(e){if(e.flags&4&&!(e.
flags&16)||(e.flags&=-17,e.globalVersion===pe))return;e.globalVersion=pe;let t=e.dep;if(e.flags|=2,t.version>0&&!e.isSSR&&
e.deps&&!Je(e)){e.flags&=-3;return}let r=y,n=C;y=e,C=!0;try{It(e);let s=e.fn(e._value);(t.version===0||P(s,e._value))&&(e.
_value=s,t.version++)}catch(s){throw t.version++,s}finally{y=r,C=n,Ft(e),e.flags&=-3}}function ot(e,t=!1){let{dep:r,prevSub:n,
nextSub:s}=e;if(n&&(n.nextSub=s,e.prevSub=void 0),s&&(s.prevSub=n,e.nextSub=void 0),r.subs===e&&(r.subs=n,!n&&r.computed)){
r.computed.flags&=-5;for(let i=r.computed.deps;i;i=i.nextDep)ot(i,!0)}!t&&!--r.sc&&r.map&&r.map.delete(r.key)}function Ar(e){
let{prevDep:t,nextDep:r}=e;t&&(t.nextDep=r,e.prevDep=void 0),r&&(r.prevDep=t,e.nextDep=void 0)}function we(e,t){e.effect instanceof
ee&&(e=e.effect.fn);let r=new ee(e);t&&ze(r,t);try{r.run()}catch(s){throw r.stop(),s}let n=r.run.bind(r);return n.effect=
r,n}function yn(e){e.effect.stop()}var C=!0,at=[];function jt(){at.push(C),C=!1}function bn(){at.push(C),C=!0}function Wt(){
let e=at.pop();C=e===void 0?!0:e}function En(e,t=!1){y instanceof ee&&(y.cleanup=e)}function Dt(e){let{cleanup:t}=e;if(e.
cleanup=void 0,t){let r=y;y=void 0;try{t()}finally{y=r}}}var pe=0,Xe=class{constructor(t,r){this.sub=t,this.dep=r,this.version=
r.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},te=class{constructor(t){this.
computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0}track(t){if(!y||
!C||y===this.computed)return;let r=this.activeLink;if(r===void 0||r.sub!==y)r=this.activeLink=new Xe(y,this),y.deps?(r.prevDep=
y.depsTail,y.depsTail.nextDep=r,y.depsTail=r):y.deps=y.depsTail=r,$t(r);else if(r.version===-1&&(r.version=this.version,
r.nextDep)){let n=r.nextDep;n.prevDep=r.prevDep,r.prevDep&&(r.prevDep.nextDep=n),r.prevDep=y.depsTail,r.nextDep=void 0,y.
depsTail.nextDep=r,y.depsTail=r,y.deps===r&&(y.deps=n)}return r}trigger(t){this.version++,pe++,this.notify(t)}notify(t){
st();try{for(let r=this.subs;r;r=r.prevSub)r.sub.notify()&&r.sub.dep.notify()}finally{it()}}};function $t(e){if(e.dep.sc++,
e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let n=t.deps;n;n=n.nextDep)$t(n)}let r=e.dep.subs;
r!==e&&(e.prevSub=r,r&&(r.nextSub=e)),e.dep.subs=e}}var Se=new WeakMap,G=Symbol(""),Ve=Symbol(""),he=Symbol("");function R(e,t,r){
if(C&&y){let n=Se.get(e);n||Se.set(e,n=new Map);let s=n.get(r);s||(n.set(r,s=new te),s.map=n,s.key=r),s.track()}}function U(e,t,r,n,s,i){
let o=Se.get(e);if(!o){pe++;return}let c=l=>{l&&l.trigger()};if(st(),t==="clear")o.forEach(c);else{let l=M(e),f=l&&me(r);
if(l&&r==="length"){let h=Number(n);o.forEach((a,p)=>{(p==="length"||p===he||!Q(p)&&p>=h)&&c(a)})}else switch((r!==void 0||
o.has(void 0))&&c(o.get(r)),f&&c(o.get(he)),t){case"add":l?f&&c(o.get("length")):(c(o.get(G)),V(e)&&c(o.get(Ve)));break;case"\
delete":l||(c(o.get(G)),V(e)&&c(o.get(Ve)));break;case"set":V(e)&&c(o.get(G));break}}it()}function Nr(e,t){let r=Se.get(
e);return r&&r.get(t)}function K(e){let t=b(e);return t===e?t:(R(t,"iterate",he),D(e)?t:t.map(N))}function ct(e){return R(
e=b(e),"iterate",he),e}var wr={__proto__:null,[Symbol.iterator](){return Ye(this,Symbol.iterator,N)},concat(...e){return K(
this).concat(...e.map(t=>M(t)?K(t):t))},entries(){return Ye(this,"entries",e=>(e[1]=N(e[1]),e))},every(e,t){return I(this,
"every",e,t,void 0,arguments)},filter(e,t){return I(this,"filter",e,t,r=>r.map(N),arguments)},find(e,t){return I(this,"f\
ind",e,t,N,arguments)},findIndex(e,t){return I(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return I(this,"find\
Last",e,t,N,arguments)},findLastIndex(e,t){return I(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return I(this,
"forEach",e,t,void 0,arguments)},includes(...e){return He(this,"includes",e)},indexOf(...e){return He(this,"indexOf",e)},
join(e){return K(this).join(e)},lastIndexOf(...e){return He(this,"lastIndexOf",e)},map(e,t){return I(this,"map",e,t,void 0,
arguments)},pop(){return ce(this,"pop")},push(...e){return ce(this,"push",e)},reduce(e,...t){return kt(this,"reduce",e,t)},
reduceRight(e,...t){return kt(this,"reduceRight",e,t)},shift(){return ce(this,"shift")},some(e,t){return I(this,"some",e,
t,void 0,arguments)},splice(...e){return ce(this,"splice",e)},toReversed(){return K(this).toReversed()},toSorted(e){return K(
this).toSorted(e)},toSpliced(...e){return K(this).toSpliced(...e)},unshift(...e){return ce(this,"unshift",e)},values(){return Ye(
this,"values",N)}};function Ye(e,t,r){let n=ct(e),s=n[t]();return n!==e&&!D(e)&&(s._next=s.next,s.next=()=>{let i=s._next();
return i.value&&(i.value=r(i.value)),i}),s}var Rr=Array.prototype;function I(e,t,r,n,s,i){let o=ct(e),c=o!==e&&!D(e),l=o[t];
if(l!==Rr[t]){let a=l.apply(e,i);return c?N(a):a}let f=r;o!==e&&(c?f=function(a,p){return r.call(this,N(a),p,e)}:r.length>
2&&(f=function(a,p){return r.call(this,a,p,e)}));let h=l.call(o,f,n);return c&&s?s(h):h}function kt(e,t,r,n){let s=ct(e),
i=r;return s!==e&&(D(e)?r.length>3&&(i=function(o,c,l){return r.call(this,o,c,l,e)}):i=function(o,c,l){return r.call(this,
o,N(c),l,e)}),s[t](i,...n)}function He(e,t,r){let n=b(e);R(n,"iterate",he);let s=n[t](...r);return(s===-1||s===!1)&&zr(r[0])?
(r[0]=b(r[0]),n[t](...r)):s}function ce(e,t,r=[]){jt(),st();let n=b(e)[t].apply(e,r);return it(),Wt(),n}var Or=Be("__pro\
to__,__v_isRef,__isVue"),Bt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).
filter(Q));function Cr(e){Q(e)||(e=String(e));let t=b(this);return R(t,"has",e),t.hasOwnProperty(e)}var Te=class{constructor(t=!1,r=!1){
this._isReadonly=t,this._isShallow=r}get(t,r,n){if(r==="__v_skip")return t.__v_skip;let s=this._isReadonly,i=this._isShallow;
if(r==="__v_isReactive")return!s;if(r==="__v_isReadonly")return s;if(r==="__v_isShallow")return i;if(r==="__v_raw")return n===
(s?i?Ht:Yt:i?Gt:zt).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(n)?t:void 0;let o=M(t);if(!s){let l;if(o&&(l=
wr[r]))return l;if(r==="hasOwnProperty")return Cr}let c=Reflect.get(t,r,O(t)?t:n);return(Q(r)?Bt.has(r):Or(r))||(s||R(t,
"get",r),i)?c:O(c)?o&&me(r)?c:c.value:z(c)?s?qt(c):W(c):c}},xe=class extends Te{constructor(t=!1){super(!1,t)}set(t,r,n,s){
let i=t[r];if(!this._isShallow){let l=Y(i);if(!D(n)&&!Y(n)&&(i=b(i),n=b(n)),!M(t)&&O(i)&&!O(n))return l?!1:(i.value=n,!0)}
let o=M(t)&&me(r)?Number(r)<t.length:ae(t,r),c=Reflect.set(t,r,n,O(t)?t:s);return t===b(s)&&(o?P(n,i)&&U(t,"set",r,n,i):
U(t,"add",r,n)),c}deleteProperty(t,r){let n=ae(t,r),s=t[r],i=Reflect.deleteProperty(t,r);return i&&n&&U(t,"delete",r,void 0,
s),i}has(t,r){let n=Reflect.has(t,r);return(!Q(r)||!Bt.has(r))&&R(t,"has",r),n}ownKeys(t){return R(t,"iterate",M(t)?"len\
gth":G),Reflect.ownKeys(t)}},Ae=class extends Te{constructor(t=!1){super(!0,t)}set(t,r){return!0}deleteProperty(t,r){return!0}},
Dr=new xe,kr=new Ae,Mr=new xe(!0),Lr=new Ae(!0),Ze=e=>e,ye=e=>Reflect.getPrototypeOf(e);function Pr(e,t,r){return function(...n){
let s=this.__v_raw,i=b(s),o=V(i),c=e==="entries"||e===Symbol.iterator&&o,l=e==="keys"&&o,f=s[e](...n),h=r?Ze:t?Qe:N;return!t&&
R(i,"iterate",l?Ve:G),{next(){let{value:a,done:p}=f.next();return p?{value:a,done:p}:{value:c?[h(a[0]),h(a[1])]:h(a),done:p}},
[Symbol.iterator](){return this}}}}function be(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}
function Ir(e,t){let r={get(s){let i=this.__v_raw,o=b(i),c=b(s);e||(P(s,c)&&R(o,"get",s),R(o,"get",c));let{has:l}=ye(o),
f=t?Ze:e?Qe:N;if(l.call(o,s))return f(i.get(s));if(l.call(o,c))return f(i.get(c));i!==o&&i.get(s)},get size(){let s=this.
__v_raw;return!e&&R(b(s),"iterate",G),Reflect.get(s,"size",s)},has(s){let i=this.__v_raw,o=b(i),c=b(s);return e||(P(s,c)&&
R(o,"has",s),R(o,"has",c)),s===c?i.has(s):i.has(s)||i.has(c)},forEach(s,i){let o=this,c=o.__v_raw,l=b(c),f=t?Ze:e?Qe:N;return!e&&
R(l,"iterate",G),c.forEach((h,a)=>s.call(i,f(h),f(a),o))}};return ze(r,e?{add:be("add"),set:be("set"),delete:be("delete"),
clear:be("clear")}:{add(s){!t&&!D(s)&&!Y(s)&&(s=b(s));let i=b(this);return ye(i).has.call(i,s)||(i.add(s),U(i,"add",s,s)),
this},set(s,i){!t&&!D(i)&&!Y(i)&&(i=b(i));let o=b(this),{has:c,get:l}=ye(o),f=c.call(o,s);f||(s=b(s),f=c.call(o,s));let h=l.
call(o,s);return o.set(s,i),f?P(i,h)&&U(o,"set",s,i,h):U(o,"add",s,i),this},delete(s){let i=b(this),{has:o,get:c}=ye(i),
l=o.call(i,s);l||(s=b(s),l=o.call(i,s));let f=c?c.call(i,s):void 0,h=i.delete(s);return l&&U(i,"delete",s,void 0,f),h},clear(){
let s=b(this),i=s.size!==0,o=void 0,c=s.clear();return i&&U(s,"clear",void 0,void 0,o),c}}),["keys","values","entries",Symbol.
iterator].forEach(s=>{r[s]=Pr(s,e,t)}),r}function Re(e,t){let r=Ir(e,t);return(n,s,i)=>s==="__v_isReactive"?!e:s==="__v_\
isReadonly"?e:s==="__v_raw"?n:Reflect.get(ae(r,s)&&s in n?r:n,s,i)}var Fr={get:Re(!1,!1)},Ur={get:Re(!1,!0)},jr={get:Re(
!0,!1)},Wr={get:Re(!0,!0)};var zt=new WeakMap,Gt=new WeakMap,Yt=new WeakMap,Ht=new WeakMap;function $r(e){switch(e){case"Object":case"Array":return 1;case"\
Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Br(e){return e.__v_skip||!Object.isExtensible(
e)?0:$r(Rt(e))}function W(e){return Y(e)?e:Oe(e,!1,Dr,Fr,zt)}function Sn(e){return Oe(e,!1,Mr,Ur,Gt)}function qt(e){return Oe(
e,!0,kr,jr,Yt)}function Tn(e){return Oe(e,!0,Lr,Wr,Ht)}function Oe(e,t,r,n,s){if(!z(e)||e.__v_raw&&!(t&&e.__v_isReactive))
return e;let i=s.get(e);if(i)return i;let o=Br(e);if(o===0)return e;let c=new Proxy(e,o===2?n:r);return s.set(e,c),c}function ue(e){
return Y(e)?ue(e.__v_raw):!!(e&&e.__v_isReactive)}function Y(e){return!!(e&&e.__v_isReadonly)}function D(e){return!!(e&&
e.__v_isShallow)}function zr(e){return e?!!e.__v_raw:!1}function b(e){let t=e&&e.__v_raw;return t?b(t):e}function xn(e){
return!ae(e,"__v_skip")&&Object.isExtensible(e)&&Ct(e,"__v_skip",!0),e}var N=e=>z(e)?W(e):e,Qe=e=>z(e)?qt(e):e;function O(e){
return e?e.__v_isRef===!0:!1}function Gr(e){return Jt(e,!1)}function An(e){return Jt(e,!0)}function Jt(e,t){return O(e)?
e:new Ke(e,t)}var Ke=class{constructor(t,r){this.dep=new te,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=r?t:b(
t),this._value=r?t:N(t),this.__v_isShallow=r}get value(){return this.dep.track(),this._value}set value(t){let r=this._rawValue,
n=this.__v_isShallow||D(t)||Y(t);t=n?t:b(t),P(t,r)&&(this._rawValue=t,this._value=n?t:N(t),this.dep.trigger())}};function Nn(e){
e.dep&&e.dep.trigger()}function Xt(e){return O(e)?e.value:e}function wn(e){return Z(e)?e():Xt(e)}var Yr={get:(e,t,r)=>t===
"__v_raw"?e:Xt(Reflect.get(e,t,r)),set:(e,t,r,n)=>{let s=e[t];return O(s)&&!O(r)?(s.value=r,!0):Reflect.set(e,t,r,n)}};function Rn(e){
return ue(e)?e:new Proxy(e,Yr)}var et=class{constructor(t){this.__v_isRef=!0,this._value=void 0;let r=this.dep=new te,{get:n,
set:s}=t(r.track.bind(r),r.trigger.bind(r));this._get=n,this._set=s}get value(){return this._value=this._get()}set value(t){
this._set(t)}};function On(e){return new et(e)}function Cn(e){let t=M(e)?new Array(e.length):{};for(let r in e)t[r]=Vt(e,
r);return t}var tt=class{constructor(t,r,n){this._object=t,this._key=r,this._defaultValue=n,this.__v_isRef=!0,this._value=
void 0}get value(){let t=this._object[this._key];return this._value=t===void 0?this._defaultValue:t}set value(t){this._object[this.
_key]=t}get dep(){return Nr(b(this._object),this._key)}},rt=class{constructor(t){this._getter=t,this.__v_isRef=!0,this.__v_isReadonly=
!0,this._value=void 0}get value(){return this._value=this._getter()}};function Dn(e,t,r){return O(e)?e:Z(e)?new rt(e):z(
e)&&arguments.length>1?Vt(e,t,r):Gr(e)}function Vt(e,t,r){let n=e[t];return O(n)?n:new tt(e,t,r)}var nt=class{constructor(t,r,n){
this.fn=t,this.setter=r,this._value=void 0,this.dep=new te(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,
this.flags=16,this.globalVersion=pe-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!r,this.isSSR=n}notify(){if(this.
flags|=16,!(this.flags&8)&&y!==this)return Pt(this,!0),!0}get value(){let t=this.dep.track();return Ut(this),t&&(t.version=
this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}};function kn(e,t,r=!1){let n,s;return Z(e)?n=e:(n=
e.get,s=e.set),new nt(n,s,r)}var Mn={GET:"get",HAS:"has",ITERATE:"iterate"},Ln={SET:"set",ADD:"add",DELETE:"delete",CLEAR:"\
clear"},Pn={SKIP:"__v_skip",IS_REACTIVE:"__v_isReactive",IS_READONLY:"__v_isReadonly",IS_SHALLOW:"__v_isShallow",RAW:"__\
v_raw",IS_REF:"__v_isRef"},In={WATCH_GETTER:2,2:"WATCH_GETTER",WATCH_CALLBACK:3,3:"WATCH_CALLBACK",WATCH_CLEANUP:4,4:"WA\
TCH_CLEANUP"},Ee={},Ne=new WeakMap,F;function Fn(){return F}function Hr(e,t=!1,r=F){if(r){let n=Ne.get(r);n||Ne.set(r,n=
[]),n.push(e)}}function Un(e,t,r=xt){let{immediate:n,deep:s,once:i,scheduler:o,augmentJob:c,call:l}=r,f=m=>{(r.onWarn||Tr)(
"Invalid watch source: ",m,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array o\
f these types.")},h=m=>s?m:D(m)||s===!1||s===0?j(m,1):j(m),a,p,u,d,E=!1,v=!1;if(O(e)?(p=()=>e.value,E=D(e)):ue(e)?(p=()=>h(
e),E=!0):M(e)?(v=!0,E=e.some(m=>ue(m)||D(m)),p=()=>e.map(m=>{if(O(m))return m.value;if(ue(m))return h(m);if(Z(m))return l?
l(m,2):m()})):Z(e)?t?p=l?()=>l(e,2):e:p=()=>{if(u){jt();try{u()}finally{Wt()}}let m=F;F=a;try{return l?l(e,3,[d]):e(d)}finally{
F=m}}:p=At,t&&s){let m=p,x=s===!0?1/0:s;p=()=>j(m(),x)}let _=xr(),g=()=>{a.stop(),_&&_.active&&Nt(_.effects,a)};if(i&&t){
let m=t;t=(...x)=>{m(...x),g()}}let T=v?new Array(e.length).fill(Ee):Ee,w=m=>{if(!(!(a.flags&1)||!a.dirty&&!m))if(t){let x=a.
run();if(s||E||(v?x.some((X,L)=>P(X,T[L])):P(x,T))){u&&u();let X=F;F=a;try{let L=[x,T===Ee?void 0:v&&T[0]===Ee?[]:T,d];l?
l(t,3,L):t(...L),T=x}finally{F=X}}}else a.run()};return c&&c(w),a=new ee(p),a.scheduler=o?()=>o(w,!1):w,d=m=>Hr(m,!1,a),
u=a.onStop=()=>{let m=Ne.get(a);if(m){if(l)l(m,4);else for(let x of m)x();Ne.delete(a)}},t?n?w(!0):T=a.run():o?o(w.bind(
null,!0),!0):a.run(),g.pause=a.pause.bind(a),g.resume=a.resume.bind(a),g.stop=g,g}function j(e,t=1/0,r){if(t<=0||!z(e)||
e.__v_skip||(r=r||new Set,r.has(e)))return e;if(r.add(e),t--,O(e))j(e.value,t,r);else if(M(e))for(let n=0;n<e.length;n++)
j(e[n],t,r);else if(wt(e)||V(e))e.forEach(n=>{j(n,t,r)});else if(Ot(e)){for(let n in e)j(e[n],t,r);for(let n of Object.getOwnPropertySymbols(
e))Object.prototype.propertyIsEnumerable.call(e,n)&&j(e[n],t,r)}return e}var ht,S,tr,qr,H,Zt,rr,lt,nr,_t,ft,ut,Jr,pt={},sr=[],Xr=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
dt=Array.isArray;function $(e,t){for(var r in t)e[r]=t[r];return e}function gt(e){e&&e.parentNode&&e.parentNode.removeChild(
e)}function Le(e,t,r){var n,s,i,o={};for(i in t)i=="key"?n=t[i]:i=="ref"?s=t[i]:o[i]=t[i];if(arguments.length>2&&(o.children=
arguments.length>3?ht.call(arguments,2):r),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)o[i]===void 0&&
(o[i]=e.defaultProps[i]);return De(e,o,n,s,null)}function De(e,t,r,n,s){var i={type:e,props:t,key:r,ref:n,__k:null,__:null,
__b:0,__e:null,__c:null,constructor:void 0,__v:s??++tr,__i:-1,__u:0};return s==null&&S.vnode!=null&&S.vnode(i),i}function ne(e){return e.children}function ke(e,t){this.props=e,this.context=t}function re(e,t){if(t==null)return e.__?re(
e.__,e.__i+1):null;for(var r;t<e.__k.length;t++)if((r=e.__k[t])!=null&&r.__e!=null)return r.__e;return typeof e.type=="f\
unction"?re(e):null}function ir(e){var t,r;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)
if((r=e.__k[t])!=null&&r.__e!=null){e.__e=e.__c.base=r.__e;break}return ir(e)}}function Qt(e){(!e.__d&&(e.__d=!0)&&H.push(
e)&&!Me.__r++||Zt!==S.debounceRendering)&&((Zt=S.debounceRendering)||rr)(Me)}function Me(){var e,t,r,n,s,i,o,c;for(H.sort(
lt);e=H.shift();)e.__d&&(t=H.length,n=void 0,i=(s=(r=e).__v).__e,o=[],c=[],r.__P&&((n=$({},s)).__v=s.__v+1,S.vnode&&S.vnode(
n),cr(r.__P,n,s,r.__n,r.__P.namespaceURI,32&s.__u?[i]:null,o,i??re(s),!!(32&s.__u),c),n.__v=s.__v,n.__.__k[n.__i]=n,Qr(o,
n,c),n.__e!=i&&ir(n)),H.length>t&&H.sort(lt));Me.__r=0}function or(e,t,r,n,s,i,o,c,l,f,h){var a,p,u,d,E,v,_=n&&n.__k||sr,
g=t.length;for(l=Vr(r,t,_,l,g),a=0;a<g;a++)(u=r.__k[a])!=null&&(p=u.__i===-1?pt:_[u.__i]||pt,u.__i=a,v=cr(e,u,p,s,i,o,c,
l,f,h),d=u.__e,u.ref&&p.ref!=u.ref&&(p.ref&&mt(p.ref,null,u),h.push(u.ref,u.__c||d,u)),E==null&&d!=null&&(E=d),4&u.__u||
p.__k===u.__k?l=ar(u,l,e):typeof u.type=="function"&&v!==void 0?l=v:d&&(l=d.nextSibling),u.__u&=-7);return r.__e=E,l}function Vr(e,t,r,n,s){
var i,o,c,l,f,h=r.length,a=h,p=0;for(e.__k=new Array(s),i=0;i<s;i++)(o=t[i])!=null&&typeof o!="boolean"&&typeof o!="func\
tion"?(l=i+p,(o=e.__k[i]=typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?De(null,o,null,
null,null):dt(o)?De(ne,{children:o},null,null,null):o.constructor===void 0&&o.__b>0?De(o.type,o.props,o.key,o.ref?o.ref:
null,o.__v):o).__=e,o.__b=e.__b+1,c=null,(f=o.__i=Zr(o,r,l,a))!==-1&&(a--,(c=r[f])&&(c.__u|=2)),c==null||c.__v===null?(f==
-1&&p--,typeof o.type!="function"&&(o.__u|=4)):f!=l&&(f==l-1?p--:f==l+1?p++:(f>l?p--:p++,o.__u|=4))):e.__k[i]=null;if(a)
for(i=0;i<h;i++)(c=r[i])!=null&&!(2&c.__u)&&(c.__e==n&&(n=re(c)),lr(c,c));return n}function ar(e,t,r){var n,s;if(typeof e.
type=="function"){for(n=e.__k,s=0;n&&s<n.length;s++)n[s]&&(n[s].__=e,t=ar(n[s],t,r));return t}e.__e!=t&&(t&&e.type&&!r.contains(
t)&&(t=re(e)),r.insertBefore(e.__e,t||null),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Zr(e,t,r,n){var s,i,o=e.key,c=e.type,l=t[r];if(l===null||l&&o==l.key&&c===l.type&&!(2&l.__u))return r;if(n>(l!=
null&&!(2&l.__u)?1:0))for(s=r-1,i=r+1;s>=0||i<t.length;){if(s>=0){if((l=t[s])&&!(2&l.__u)&&o==l.key&&c===l.type)return s;
s--}if(i<t.length){if((l=t[i])&&!(2&l.__u)&&o==l.key&&c===l.type)return i;i++}}return-1}function Kt(e,t,r){t[0]=="-"?e.setProperty(
t,r??""):e[t]=r==null?"":typeof r!="number"||Xr.test(t)?r:r+"px"}function Ce(e,t,r,n,s){var i;e:if(t=="style")if(typeof r==
"string")e.style.cssText=r;else{if(typeof n=="string"&&(e.style.cssText=n=""),n)for(t in n)r&&t in r||Kt(e.style,t,"");if(r)
for(t in r)n&&r[t]===n[t]||Kt(e.style,t,r[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(nr,"$1")),t=t.toLowerCase()in
e||t=="onFocusOut"||t=="onFocusIn"?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=r,r?n?r.u=n.u:(r.u=_t,e.addEventListener(
t,i?ut:ft,i)):e.removeEventListener(t,i?ut:ft,i);else{if(s=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").
replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!=
"rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=r??"";break e}catch{}typeof r=="function"||(r==null||r===
!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&r==1?"":r))}}function er(e){return function(t){if(this.
l){var r=this.l[t.type+e];if(t.t==null)t.t=_t++;else if(t.t<r.u)return;return r(S.event?S.event(t):t)}}}function cr(e,t,r,n,s,i,o,c,l,f){
var h,a,p,u,d,E,v,_,g,T,w,m,x,X,L,We,$e,k=t.type;if(t.constructor!==void 0)return null;128&r.__u&&(l=!!(32&r.__u),i=[c=t.
__e=r.__e]),(h=S.__b)&&h(t);e:if(typeof k=="function")try{if(_=t.props,g="prototype"in k&&k.prototype.render,T=(h=k.contextType)&&
n[h.__c],w=h?T?T.props.value:h.__:n,r.__c?v=(a=t.__c=r.__c).__=a.__E:(g?t.__c=a=new k(_,w):(t.__c=a=new ke(_,w),a.constructor=
k,a.render=en),T&&T.sub(a),a.props=_,a.state||(a.state={}),a.context=w,a.__n=n,p=a.__d=!0,a.__h=[],a._sb=[]),g&&a.__s==null&&
(a.__s=a.state),g&&k.getDerivedStateFromProps!=null&&(a.__s==a.state&&(a.__s=$({},a.__s)),$(a.__s,k.getDerivedStateFromProps(
_,a.__s))),u=a.props,d=a.state,a.__v=t,p)g&&k.getDerivedStateFromProps==null&&a.componentWillMount!=null&&a.componentWillMount(),
g&&a.componentDidMount!=null&&a.__h.push(a.componentDidMount);else{if(g&&k.getDerivedStateFromProps==null&&_!==u&&a.componentWillReceiveProps!=
null&&a.componentWillReceiveProps(_,w),!a.__e&&(a.shouldComponentUpdate!=null&&a.shouldComponentUpdate(_,a.__s,w)===!1||
t.__v==r.__v)){for(t.__v!=r.__v&&(a.props=_,a.state=a.__s,a.__d=!1),t.__e=r.__e,t.__k=r.__k,t.__k.some(function(oe){oe&&
(oe.__=t)}),m=0;m<a._sb.length;m++)a.__h.push(a._sb[m]);a._sb=[],a.__h.length&&o.push(a);break e}a.componentWillUpdate!=
null&&a.componentWillUpdate(_,a.__s,w),g&&a.componentDidUpdate!=null&&a.__h.push(function(){a.componentDidUpdate(u,d,E)})}
if(a.context=w,a.props=_,a.__P=e,a.__e=!1,x=S.__r,X=0,g){for(a.state=a.__s,a.__d=!1,x&&x(t),h=a.render(a.props,a.state,a.
context),L=0;L<a._sb.length;L++)a.__h.push(a._sb[L]);a._sb=[]}else do a.__d=!1,x&&x(t),h=a.render(a.props,a.state,a.context),
a.state=a.__s;while(a.__d&&++X<25);a.state=a.__s,a.getChildContext!=null&&(n=$($({},n),a.getChildContext())),g&&!p&&a.getSnapshotBeforeUpdate!=
null&&(E=a.getSnapshotBeforeUpdate(u,d)),c=or(e,dt(We=h!=null&&h.type===ne&&h.key==null?h.props.children:h)?We:[We],t,r,
n,s,i,o,c,l,f),a.base=t.__e,t.__u&=-161,a.__h.length&&o.push(a),v&&(a.__E=a.__=null)}catch(oe){if(t.__v=null,l||i!=null)
if(oe.then){for(t.__u|=l?160:128;c&&c.nodeType==8&&c.nextSibling;)c=c.nextSibling;i[i.indexOf(c)]=null,t.__e=c}else for($e=
i.length;$e--;)gt(i[$e]);else t.__e=r.__e,t.__k=r.__k;S.__e(oe,t,r)}else i==null&&t.__v==r.__v?(t.__k=r.__k,t.__e=r.__e):
c=t.__e=Kr(r.__e,t,r,n,s,i,o,l,f);return(h=S.diffed)&&h(t),128&t.__u?void 0:c}function Qr(e,t,r){for(var n=0;n<r.length;n++)
mt(r[n],r[++n],r[++n]);S.__c&&S.__c(t,e),e.some(function(s){try{e=s.__h,s.__h=[],e.some(function(i){i.call(s)})}catch(i){
S.__e(i,s.__v)}})}function Kr(e,t,r,n,s,i,o,c,l){var f,h,a,p,u,d,E,v=r.props,_=t.props,g=t.type;if(g=="svg"?s="http://ww\
w.w3.org/2000/svg":g=="math"?s="http://www.w3.org/1998/Math/MathML":s||(s="http://www.w3.org/1999/xhtml"),i!=null){for(f=
0;f<i.length;f++)if((u=i[f])&&"setAttribute"in u==!!g&&(g?u.localName==g:u.nodeType==3)){e=u,i[f]=null;break}}if(e==null){
if(g==null)return document.createTextNode(_);e=document.createElementNS(s,g,_.is&&_),c&&(S.__m&&S.__m(t,i),c=!1),i=null}
if(g===null)v===_||c&&e.data===_||(e.data=_);else{if(i=i&&ht.call(e.childNodes),v=r.props||pt,!c&&i!=null)for(v={},f=0;f<
e.attributes.length;f++)v[(u=e.attributes[f]).name]=u.value;for(f in v)if(u=v[f],f!="children"){if(f=="dangerouslySetInn\
erHTML")a=u;else if(!(f in _)){if(f=="value"&&"defaultValue"in _||f=="checked"&&"defaultChecked"in _)continue;Ce(e,f,null,
u,s)}}for(f in _)u=_[f],f=="children"?p=u:f=="dangerouslySetInnerHTML"?h=u:f=="value"?d=u:f=="checked"?E=u:c&&typeof u!=
"function"||v[f]===u||Ce(e,f,u,v[f],s);if(h)c||a&&(h.__html===a.__html||h.__html===e.innerHTML)||(e.innerHTML=h.__html),
t.__k=[];else if(a&&(e.innerHTML=""),or(e,dt(p)?p:[p],t,r,n,g=="foreignObject"?"http://www.w3.org/1999/xhtml":s,i,o,i?i[0]:
r.__k&&re(r,0),c,l),i!=null)for(f=i.length;f--;)gt(i[f]);c||(f="value",g=="progress"&&d==null?e.removeAttribute("value"):
d!==void 0&&(d!==e[f]||g=="progress"&&!d||g=="option"&&d!==v[f])&&Ce(e,f,d,v[f],s),f="checked",E!==void 0&&E!==e[f]&&Ce(
e,f,E,v[f],s))}return e}function mt(e,t,r){try{if(typeof e=="function"){var n=typeof e.__u=="function";n&&e.__u(),n&&t==
null||(e.__u=e(t))}else e.current=t}catch(s){S.__e(s,r)}}function lr(e,t,r){var n,s;if(S.unmount&&S.unmount(e),(n=e.ref)&&
(n.current&&n.current!==e.__e||mt(n,null,t)),(n=e.__c)!=null){if(n.componentWillUnmount)try{n.componentWillUnmount()}catch(i){
S.__e(i,t)}n.base=n.__P=null}if(n=e.__k)for(s=0;s<n.length;s++)n[s]&&lr(n[s],t,r||typeof e.type!="function");r||gt(e.__e),
e.__c=e.__=e.__e=void 0}function en(e,t,r){return this.constructor(e,r)}ht=sr.slice,S={__e:function(e,t,r,n){for(var s,i,o;t=t.__;)if((s=t.__c)&&!s.__)try{if((i=s.constructor)&&i.getDerivedStateFromError!=
null&&(s.setState(i.getDerivedStateFromError(e)),o=s.__d),s.componentDidCatch!=null&&(s.componentDidCatch(e,n||{}),o=s.__d),
o)return s.__E=s}catch(c){e=c}throw e}},tr=0,qr=function(e){return e!=null&&e.constructor==null},ke.prototype.setState=function(e,t){
var r;r=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=$({},this.state),typeof e=="function"&&(e=e($({},r),this.
props)),e&&$(r,e),e!=null&&this.__v&&(t&&this._sb.push(t),Qt(this))},ke.prototype.forceUpdate=function(e){this.__v&&(this.
__e=!0,e&&this.__h.push(e),Qt(this))},ke.prototype.render=ne,H=[],rr=typeof Promise=="function"?Promise.prototype.then.bind(
Promise.resolve()):setTimeout,lt=function(e,t){return e.__v.__b-t.__v.__b},Me.__r=0,nr=/(PointerCapture)$|Capture$/i,_t=
0,ft=er(!1),ut=er(!0),Jr=0;var ur=1,_e=3,Ie={},yt=[],tn="http://www.w3.org/2000/svg",fr=function(e){this._vevents[e.type](e)},B=e=>e==null?e:e.key,
pr=(e,t,r,n,s)=>{t==="key"||(t[0]==="o"&&t[1]==="n"?(t=t.toLowerCase().slice(2),e._vevents??={},!n&&r&&e.removeEventListener(
t,fr),!r&&n&&e.addEventListener(t,fr),r!==n&&(e._vevents[t]=n?i=>n.call(nn.host??e,i):null)):t==="ref"?typeof n=="functi\
on"?r||(e._vcleanup=n(e)):n.current=n.value=e:t.startsWith("attr:")?e.setAttribute(t.slice(5),n):t.startsWith("prop:")?e[t.
slice(5)]=n:!s&&t!=="list"&&t!=="form"&&t in e?e[t]=n??"":n==null||n===!1?e.removeAttribute(t):e.setAttribute(t,n))},vt=(e,t)=>{
var r=e.props,n=e.type===_e?document.createTextNode(e.tag):(t=t||e.tag==="svg")?document.createElementNS(tn,e.tag,{is:r.
is}):document.createElement(e.tag,{is:r.is});for(var s in r)pr(n,s,null,r[s],t);if(r.dangerouslySetInnerHTML)return n.innerHTML=
r.dangerouslySetInnerHTML.__html,e.node=n;for(var i=0;i<e.children.length;i++)n.appendChild(vt(e.children[i]=se(e.children[i]),
t));return e.node=n},q=(e,t,r,n,s)=>{if(r!==n)if(r!=null&&r.type===_e&&n.type===_e)r.tag!==n.tag&&(t.nodeValue=n.tag);else if(r==
null||r.tag!==n.tag)t=e.insertBefore(vt(n=se(n),s),t),r!=null&&e.removeChild(r.node);else{var i,o,c,l,f=r.props,h=n.props,
a=r.children,p=n.children,u=0,d=0,E=a.length-1,v=p.length-1;s=s||n.tag==="svg";for(var _ in{...f,...h})(_==="value"||_===
"selected"||_==="checked"?t[_]:f[_])!==h[_]&&pr(t,_,f[_],h[_],s);if(n.props?.dangerouslySetInnerHTML)return t.innerHTML=
n.props.dangerouslySetInnerHTML.__html,n.node=t;for(;d<=v&&u<=E&&!((c=B(a[u]))==null||c!==B(p[d]));)q(t,a[u].node,a[u++],
p[d]=se(p[d++]),s);for(;d<=v&&u<=E&&!((c=B(a[E]))==null||c!==B(p[v]));)q(t,a[E].node,a[E--],p[v]=se(p[v--]),s);if(u>E)for(;d<=
v;)t.insertBefore(vt(p[d]=se(p[d++]),s),(o=a[u])&&o.node);else if(d>v)for(;u<=E;)t.removeChild(a[u++].node);else{for(var g={},
T={},_=u;_<=E;_++)(c=a[_].key)!=null&&(g[c]=a[_]);for(;d<=v;){if(c=B(o=a[u]),l=B(p[d]=se(p[d])),T[c]||l!=null&&l===B(a[u+
1])){c==null&&t.removeChild(o.node),u++;continue}l==null||r.type===ur?(c==null&&(q(t,o&&o.node,o,p[d],s),d++),u++):(c===
l?(q(t,o.node,o,p[d],s),T[l]=!0,u++):(i=g[l])!=null?(q(t,t.insertBefore(i.node,o&&o.node),i,p[d],s),T[l]=!0):q(t,o&&o.node,
null,p[d],s),d++)}for(;u<=E;)B(o=a[u++])==null&&t.removeChild(o.node);for(var _ in g)T[_]==null&&t.removeChild(g[_].node)}}
return n.node=t},se=e=>e!==!0&&e!==!1&&e?e:Et(""),hr=e=>e.nodeType===_e?Et(e.nodeValue,e):bt(e.nodeName.toLowerCase(),Ie,
yt.map.call(e.childNodes,hr),ur,e),bt=(e,t,r,n,s)=>({tag:e,props:t,key:t.key,children:r,type:n,node:s}),Et=(e,t)=>bt(e,Ie,
yt,_e,t),rn=(e,t,r=yt)=>bt(e,t,Array.isArray(r)?r:[r]),St=(e,t)=>t.flat(),Fe=(e,t,...r)=>typeof e=="function"?e(t,r):rn(
e,t||{},r.flatMap(n=>typeof n=="string"||typeof n=="number"?Et(n):n)),nn=Ie,Pe=(e,t,r={})=>(Pe.ctx=r,(t=q(t.parentNode,t,
t.vdom||hr(t),e)).vdom=e,Pe.ctx=Ie,t);Symbol.metadata??=Symbol("metadata");var Ue=new Map,Tt=null,sn=()=>(Tt===null&&(Tt=Array.from(document.styleSheets).map(
e=>{let t=new CSSStyleSheet,r=Array.from(e.cssRules).map(n=>n.cssText).join(" ");return t.replaceSync(r),t})),Tt),je=!0,
Gn=e=>je=e,_r=!1,ie=class extends HTMLElement{static styles="";static use_global_styles=!1;static define_self(t){customElements.
get(t)||customElements.define(t,this)}static get observedAttributes(){return Array.from(Ue.get(this[Symbol.metadata])??[])}observedAttributes=W(
{});get observed_attributes(){return this.observedAttributes}attributeChangedCallback(t,r,n){r!==n&&(this.observedAttributes[t]=
n)}constructor(){if(super(),typeof document>"u")return;this.attachShadow({mode:"open"});let t=this.constructor.styles;typeof t!=
"string"&&!Array.isArray(t)&&(this._log_error(new Error("Static styles property must be a string or string array."),"con\
structor"),this.raw_styles=[""]),Array.isArray(t)||(t=[t]);let r=t.map(n=>{let s=new CSSStyleSheet;return s.replaceSync(
n),s});if(this.shadowRoot.adoptedStyleSheets=r,this.constructor.useGlobalStyles||this.constructor.use_global_styles)try{
this.adoptedStyleSheets.push(...sn())}catch(n){this._log_error(n,"adding global stylesheets")}this.root_node=document.createElement(
"shadow-root"),this.shadowRoot.appendChild(this.root_node),je&&!_r&&(console.warn("Blackberry is running in development \
mode. Call set_dev(false) to disable this warning."),_r=!0)}connectedCallback(){this._rootEffectScope?.active&&this._rootEffectScope.
stop(),this._rootEffectScope=Mt(),this._rootEffectScope.run(()=>{try{this.onMount?.(),this.on_mount?.()}catch(t){this._log_error(
t,"on mount")}we(()=>{let t;try{t=this.render.call(this)}catch(r){this._log_error(r,"render")}try{Pe(Fe("shadow-root",{},
t),this.root_node,{host:this})}catch(r){this._log_error(r,"dom update")}});try{this.onMounted?.(),this.on_mounted?.()}catch(t){
this._log_error(t,"on mounted")}})}disconnectedCallback(){this._rootEffectScope.run(()=>{try{this.onUnmount?.(),this.on_unmount?.()}catch(t){
this._log_error(t,"on unmount")}}),this._rootEffectScope.stop()}render(){return je&&console.warn("No render method defin\
ed for",this.constructor.name),Fe(St,{},[])}get_attribute=this.getAttribute.bind(this);set_attribute=this.setAttribute.bind(
this);remove_attribute=this.removeAttribute.bind(this);_log_error=(t,r)=>{if(console.error("Error in",r,"of",this.constructor.
name,t),je)throw t};_rootEffectScope;_decoratedStates=W({});_shouldRender=!1},Yn=ie,Hn=ie,qn=String.raw;function Jn(){return function(e,{
kind:t,name:r}){if(t==="accessor")return{get(){return this._decoratedStates[r]},set(n){this._decoratedStates[r]=n},init(n){
this._decoratedStates[r]=n}};throw new Error("Invalid decorator usage: @state only works on class accessors.")}}var on=e=>e;
function Xn(e,t={}){return function(r,{kind:n,name:s,metadata:i}){let o=e??s,c=t.converter??on;if(Ue.has(i)||Ue.set(i,new Set),
Ue.get(i).add(o),n==="accessor")return{get(){return c(this.observed_attributes[o])},set(l){this.observed_attributes[o]=l,
this.setAttribute(o,String(l))},init(l){this.observed_attributes[o]=l}};if(n==="getter")return function(){let l=this.observed_attributes[o];
return typeof l<"u"?c(l):r()};throw new Error("Invalid decorator usage: @attribute only works on class accessors and get\
ters.")}}var an=window.requestIdleCallback||(e=>setTimeout(e,0)),J=class e{static Cache=new Map;constructor(t){e.Cache.has(t)&&(this.
call=e.Cache.get(t));let r=()=>{try{let n=new Function(["scope"],`with (scope) { return ${t}; }`);return Object.defineProperty(
n,"name",{value:`[expression]: ${t}`}),n}catch(n){return console.log(`Error while compiling expression: ${t}`,n),()=>""}};
e.Cache.set(t,r()),this.call=e.Cache.get(t)}},de=(e,t)=>{if(Array.isArray(e))return Le(ne,{},e.flatMap(o=>de(o,t)));if(e.
nodeType!=1)return e.nodeValue;let r=e.tagName.toLowerCase(),n={},s=[],i;for(let o of e.attributes){let c=o.nodeName,l=o.
nodeValue;if(o.nodeName[0]===":"){let f=new J(o.nodeValue);o.nodeName===":text"?s.push(f.call(t)):o.nodeName===":html"?n.
dangerouslySetInnerHTML={__html:f.call(t)}:o.nodeName===":if"?i=f:o.nodeName===":ref"?n.ref=f.call(t):n["attr:"+o.nodeName.
slice(1)]=f.call(t)}else if(c[0]==="@"){let f=new J(l);n[`on${c[1].toUpperCase()}${c.slice(2)}`]=h=>f.call(t)(h)}else if(c[0]===
"."){let f=new J(l);n["prop:"+c.slice(1)]=f.call(t)}else n[c]=l}for(let o of Array.from((r=="template"?e.content:e).childNodes))
s.push(o.tagName?.toLowerCase()==="template"?cn(o,t):de(o,t));return i&&!i.call(t)?null:Le(r,n,...s)},cn=(e,t)=>{let r,n,
s;for(let c of e.attributes)c.nodeName.startsWith("each")&&(r=c.nodeName.split(":")[1].trim(),n=new J(c.nodeValue)),c.nodeName===
":if"&&(s=new J(c.nodeValue));let i=[],o=Array.from(e.content.children);if(r){let c=n.call(t);for(let l=0;l<c.length;l++){
let f=new Proxy({},{get:(h,a)=>a===r?c[l]:t[a],has:(h,a)=>a===r||a in t,set:(h,a,p)=>(t[a]=p,!0)});i.push(de(o,f))}}else
i.push(de(o,t));return s&&!s.call(t)?null:Le(ne,{},...i)},dr=e=>{if(e.tagName!=="TEMPLATE"||typeof e.getAttribute("black\
berry")!="string")return;let t=e.getAttribute("blackberry");if(customElements.get(t))return;let r="",n="",s=[];for(let l of e.
content.children)l.tagName==="SCRIPT"?(r+=l.innerHTML,s.push(l)):l.tagName==="STYLE"&&(n+=l.innerText,s.push(l));s.forEach(
l=>l.remove());let i=e.content,o=e.getAttribute("attributes")?.split(",").map(l=>l.trim())??[];e.remove();let c=new Function(
"$element","$state","$attributes","$cleanup","$reactive","$effect",r);customElements.define(t,class extends ie{static get observedAttributes(){
return o}static styles=n;onMount(){let l=W({});l.$element=this,l.$attributes=this.observedAttributes;let f=(...h)=>void this.
cleanup_fns.push(...h);c(this,l,this.observedAttributes,f,W,we),this.__internal_data=l}render(){return de(Array.from(i.children),
this.__internal_data).flat()}onUnmount(){this.cleanup_fns.forEach(l=>l())}cleanup_fns=[]})},ln=()=>{an(()=>{document.querySelectorAll(
"template").forEach(t=>dr(t)),document.body.removeAttribute("blackberry-cloak")}),new MutationObserver(t=>{t.forEach(r=>{
r.addedNodes.forEach(n=>{n.tagName==="TEMPLATE"&&dr(n)})})}).observe(document.body,{childList:!0,subtree:!0})};export{he as ARRAY_ITERATE_KEY,ie as BlackberryElement,Yn as Component,vn as EffectFlags,qe as EffectScope,St as Fragment,
G as ITERATE_KEY,Ve as MAP_KEY_ITERATE_KEY,ee as ReactiveEffect,Pn as ReactiveFlags,Mn as TrackOpTypes,Ln as TriggerOpTypes,
In as WatchErrorCodes,Xn as attribute,Hn as component,kn as computed,qn as css,On as customRef,we as effect,Mt as effectScope,
bn as enableTracking,xr as getCurrentScope,Fn as getCurrentWatcher,Fe as h,zr as isProxy,ue as isReactive,Y as isReadonly,
O as isRef,D as isShallow,je as is_dev,xn as markRaw,En as onEffectCleanup,mn as onScopeDispose,Hr as onWatcherCleanup,jt as pauseTracking,
Rn as proxyRefs,W as reactive,K as reactiveReadArray,qt as readonly,Gr as ref,Wt as resetTracking,Gn as set_dev,Sn as shallowReactive,
ct as shallowReadArray,Tn as shallowReadonly,An as shallowRef,ln as start,Jn as state,yn as stop,b as toRaw,N as toReactive,
Qe as toReadonly,Dn as toRef,Cn as toRefs,wn as toValue,R as track,j as traverse,U as trigger,Nn as triggerRef,Xt as unref,
Un as watch};
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
  (*! #__NO_SIDE_EFFECTS__ *)

@vue/reactivity/dist/reactivity.esm-bundler.js:
  (**
  * @vue/reactivity v3.5.13
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/
