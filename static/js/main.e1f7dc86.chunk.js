(this["webpackJsonpcarbon-journey"]=this["webpackJsonpcarbon-journey"]||[]).push([[0],[,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/prelitho-stay.41a347e3.png"},,function(e,t,a){e.exports=a.p+"static/media/postlitho-atmo.6d9af7bb.png"},,,,,,,,function(e,t,a){e.exports=a.p+"static/media/bio-atmo.08d0e11b.png"},function(e,t,a){e.exports=a.p+"static/media/hydro-stay.3c886bbd.png"},function(e,t,a){e.exports=a.p+"static/media/atmo-plant.1100d1f8.png"},function(e,t,a){e.exports=a.p+"static/media/atmo-water.5529a4d3.png"},function(e,t,a){e.exports=a.p+"static/media/atmo-stay.ea5d24e5.png"},function(e,t,a){e.exports=a.p+"static/media/bio-lith.fd44ea7f.png"},function(e,t,a){e.exports=a.p+"static/media/postlitho-stay.71a49219.png"},,,,function(e,t,a){e.exports=a.p+"static/media/bio-stay.314c5778.png"},function(e,t,a){e.exports=a.p+"static/media/hydro-atmo.94591631.png"},function(e,t,a){e.exports=a.p+"static/media/hydro-bio.2a63d6ce.png"},function(e,t,a){e.exports=a.p+"static/media/hydro-litho.bc51b8f7.png"},function(e,t,a){e.exports=a.p+"static/media/prelitho-atmo.b9cb90d3.png"},,,function(e,t,a){e.exports=a(49)},,,,function(e,t,a){},function(e,t,a){},,function(e,t,a){e.exports=a.p+"static/media/px.941fa3c0.png"},function(e,t,a){e.exports=a.p+"static/media/nx.6d39d2fd.png"},function(e,t,a){e.exports=a.p+"static/media/py.44b672f3.png"},function(e,t,a){e.exports=a.p+"static/media/ny.14fb552a.png"},function(e,t,a){e.exports=a.p+"static/media/pz.60b2f35e.png"},function(e,t,a){e.exports=a.p+"static/media/nz.b2034567.png"},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(27),i=a.n(o),c=(a(40),a(3)),s=(a(41),a(1)),l=a(50),u=a(7),m=a(28),p=a(21),d=a.n(p),f=a(22),h=a.n(f),b=a(23),g=a.n(b),y=a(19),x=a.n(y),E=a(24),v=a.n(E),w=a(29),j=a.n(w),O=a(30),S=a.n(O),M=a(31),R=a.n(M),k=a(32),P=a.n(k),I=a(20),N=a.n(I),V=a(33),z=a.n(V),B=a(9),C=a.n(B),L=a(11),A=a.n(L),G=a(25),T=a.n(G),D=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--roll-result-transition").replace(/ms/,"")),F=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];Object(u.b)({OrbitControls:m.a});var J=new s.CubeTextureLoader,W=new s.TextureLoader,H=J.load([a(43),a(44),a(45),a(46),a(47),a(48)]),$=[d.a,g.a,h.a,d.a,g.a,h.a],q=[x.a,v.a,x.a,v.a,x.a,j.a],K=[S.a,N.a,R.a,N.a,P.a,N.a],Q=[z.a,C.a,C.a,C.a,C.a,C.a],U=[A.a,A.a,T.a,A.a,A.a,T.a],X=$.map((function(e){return W.load(e)})),Y=q.map((function(e){return W.load(e)})),Z=K.map((function(e){return W.load(e)})),_=Q.map((function(e){return W.load(e)})),ee=U.map((function(e){return W.load(e)})),te=function(e){return 2*(Math.random()-.5)*e},ae=function(){return Math.random()>.5?1:-1},ne={friction:.1,restitution:.3},re=function(e){var t=e.setApi,a=e.readyState,o=e.setReadyState,i=e.textures,m=e.showRollResult,p=Object(l.c)((function(){return{mass:5,material:ne,args:[4,4,4],position:[0,2,0],velocity:[0,0,0],angularVelocity:[0,0,0]}})),d=Object(c.a)(p,2),f=d[0],h=d[1],b=Object(n.useRef)(new s.Euler),g=Object(n.useRef)(new s.Vector3);return Object(n.useEffect)((function(){h.rotation.subscribe((function(e){b.current.x=e[0],b.current.y=e[1],b.current.z=e[2]})),h.velocity.subscribe((function(e){g.current.x=e[0],g.current.y=e[1],g.current.z=e[2]}))}),[]),Object(u.c)((function(){var e;if("init"===a&&g.current.length()>.5&&o("in-motion"),"in-motion"===a&&g.current.length()<.05&&(null===(e=f.current)||void 0===e?void 0:e.matrix)){var t,n=new s.Matrix4;n.extractRotation(null===(t=f.current)||void 0===t?void 0:t.matrix),[].concat(F).some((function(e,t){var a=new s.Vector3(e[0],e[1],e[2]);return a.applyMatrix4(n),a.y>.9&&(o("stopped"),m(t),!0)}))}})),Object(n.useEffect)((function(){t(h)}),[t,h]),r.a.createElement("mesh",{receiveShadow:!0,castShadow:!0,ref:f},r.a.createElement("boxBufferGeometry",{attach:"geometry",args:[4,4,4]}),i.map((function(e){return r.a.createElement("meshLambertMaterial",{key:e.uuid,attachArray:"material",map:e})})))},oe=[20,20,.1,100,100,10],ie=oe,ce=function(){var e=Object(l.e)((function(){return{material:ne,position:[0,0,0],rotation:[-Math.PI/2,0,0]}})),t=Object(c.a)(e,1)[0],a=Object(l.c)((function(){return{material:ne,position:[0,10,-10],args:oe}})),n=Object(c.a)(a,1)[0],o=Object(l.c)((function(){return{material:ne,args:oe,position:[-10,10,0],rotation:[-Math.PI/2,-Math.PI/2,0]}})),i=Object(c.a)(o,1)[0],u=Object(l.c)((function(){return{material:ne,args:oe,position:[10,10,0],rotation:[-Math.PI/2,-Math.PI/2,0]}})),m=Object(c.a)(u,1)[0],p=Object(l.c)((function(){return{material:ne,args:oe,position:[0,10,10]}})),d=Object(c.a)(p,1)[0];return r.a.createElement(r.a.Fragment,null,r.a.createElement("mesh",{ref:t,receiveShadow:!0,name:"ground"},r.a.createElement("planeBufferGeometry",{attach:"geometry",args:[20,20]}),r.a.createElement("meshLambertMaterial",{attach:"material",color:"#444"})),r.a.createElement("mesh",{ref:n},r.a.createElement("boxBufferGeometry",{attach:"geometry",args:ie}),r.a.createElement("meshStandardMaterial",{metalness:.9,roughness:.1,attach:"material",color:"#fff",envMap:H,transparent:!0,side:s.DoubleSide,opacity:.1})),r.a.createElement("mesh",{ref:i},r.a.createElement("boxBufferGeometry",{attach:"geometry",args:ie}),r.a.createElement("meshStandardMaterial",{metalness:.9,roughness:.1,attach:"material",color:"#fff",envMap:H,transparent:!0,side:s.DoubleSide,opacity:.1})),r.a.createElement("mesh",{ref:m},r.a.createElement("boxBufferGeometry",{attach:"geometry",args:ie}),r.a.createElement("meshStandardMaterial",{metalness:.9,roughness:.1,attach:"material",color:"#fff",envMap:H,transparent:!0,side:s.DoubleSide,opacity:.1})),r.a.createElement("mesh",{ref:d},r.a.createElement("boxBufferGeometry",{attach:"geometry",args:ie}),r.a.createElement("meshStandardMaterial",{metalness:.9,roughness:.1,attach:"material",color:"#fff",envMap:H,transparent:!0,side:s.DoubleSide,opacity:.1})))},se=function(e){return r.a.createElement(r.a.Fragment,null,r.a.createElement("ambientLight",null),r.a.createElement("pointLight",{position:[10,30,10],intensity:1,castShadow:!0,"shadow-mapSize-width":2048,"shadow-mapSize-height":2048,"shadow-radius":10}),r.a.createElement(l.a,{gravity:[0,-50,0]},r.a.createElement(re,{setApi:e.setApi,readyState:e.cubeState,setReadyState:e.setCubeState,textures:e.cubeTexture,showRollResult:e.showRollResult}),r.a.createElement(ce,null)))},le=function(){var e=Object(n.useState)(!1),t=Object(c.a)(e,2),a=t[0],o=t[1],i=Object(n.useState)(Math.floor(4*Math.random())),l=Object(c.a)(i,2),m=l[0],p=l[1],d=[{name:"Atmosphere",faces:$,texture:X,color:"lightblue"},{name:"Biosphere",faces:q,texture:Y,color:"green"},{name:"Hydrosphere",faces:K,texture:Z,color:"blue"},{name:"Lithosphere",faces:a?U:Q,texture:a?ee:_,color:"black"}],f=d[m].faces,h=d[m].texture,b=d[m].name,g=Object(n.useState)(),y=Object(c.a)(g,2),x=y[0],E=y[1],v=Object(n.useState)("init"),w=Object(c.a)(v,2),j=w[0],O=w[1],S=Object(n.useState)(),M=Object(c.a)(S,2),R=M[0],k=M[1],P=Object(n.useState)("hide"),I=Object(c.a)(P,2),N=I[0],V=I[1],z=function(){V("hide"),setTimeout((function(){k(void 0)}),D)},B=function(){var e;z();var t={angularVelocity:new s.Vector3(te(8)*Math.PI,te(8)*Math.PI,te(8)*Math.PI),velocity:new s.Vector3(ae()*(10*(Math.random()+1)+10),3*(Math.random()+1),ae()*(10*(Math.random()+1)+10)),position:new s.Vector3(te(2)+2,10,te(2)+2)},a=t.velocity,n=t.angularVelocity,r=t.position;null===x||void 0===x||x.position.set(r.x,r.y,r.z),null===x||void 0===x||x.rotation.set(0,0,0),null===x||void 0===x||x.velocity.set(a.x,a.y,a.z),null===x||void 0===x||x.angularVelocity.set(n.x,n.y,n.z),null===x||void 0===x||null===(e=x.mass)||void 0===e||e.set(5),O("init")},C=null!=R&&R<=5&&R>=0;return r.a.createElement("div",{className:"App"},r.a.createElement(u.a,{style:{height:"100vh",width:"100%"},camera:{position:[0,16,9.5],rotation:[-.15,0,0]},shadowMap:!0},r.a.createElement(se,{setApi:E,cubeState:j,setCubeState:O,cubeTexture:h,showRollResult:function(e){V("show"),k(e)}})),r.a.createElement("div",{className:"roll-result-overlay ".concat(N)},C&&r.a.createElement("img",{src:f[R],alt:""})),r.a.createElement("div",{className:"sphere-name"},b,"Lithosphere"===b&&r.a.createElement("h6",{style:{margin:0}},"(",a?"post-industrial":"pre-industrial",")")),r.a.createElement("div",{className:"right-side"},r.a.createElement("button",{className:"roll-btn",onClick:function(){return B()}},"Roll"),r.a.createElement("div",{className:"label"},a?"Post-industrial":"Pre-industrial"),r.a.createElement("label",{className:"switch industrial-switch"},r.a.createElement("input",{type:"checkbox",onChange:function(e){o(e.target.checked)}}),r.a.createElement("span",{className:"slider round"})),r.a.createElement("div",{className:"label"},"Switch sphere:"),d.map((function(e,t){return r.a.createElement("button",{key:e.name,className:"sphere-selector-button",style:{color:e.color,borderColor:e.color},onClick:function(){!function(e){e<=4&&e>=0&&p(e)}(t),z()}},e.name)}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(le,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[36,1,2]]]);
//# sourceMappingURL=main.e1f7dc86.chunk.js.map