(this["webpackJsonpsol-tracker"]=this["webpackJsonpsol-tracker"]||[]).push([[0],{110:function(e,t,n){},111:function(e,t){},115:function(e,t){},135:function(e,t){},151:function(e,t){},152:function(e,t){},172:function(e,t,n){},179:function(e,t,n){"use strict";n.r(t);var a=n(2),r=n.n(a),c=n(25),s=n.n(c),i=(n(110),n(1)),o=n.n(i),l=n(18),u=n(10),d=n(16),x=n(5),p=n(45),b=n(211),g=n(207),h=n(209),j=n(203),f=n(206),m=n(208),O=n(205),y=n(14),v=n(204),w=n(102),k=n.n(w),S=n(101),T=n.n(S),C=n(210),F=n(99),z=n.p+"static/media/genesysgologo.a5ac975b.png",B=n.p+"static/media/rug-scene-investigation-logo.0997e776.png",R=n.p+"static/media/slug-logo.13b7010f.svg",I=(n(172),n(6)),A=20,D=Object(y.a)((function(e){return{root:{color:"white",fontSize:"20px",textTransform:"none",fontFamily:"Agenda-Bold, Arial, sans-serif"},head:{fontSize:"30px"},body:{fontSize:"26px"}}}))(j.a),E=Object(y.a)((function(e){return{root:{fontSize:"20px",fontFamily:"monospace"}}}))(D),M=Object(v.a)({root:{"& > *":{borderBottom:"unset"}}}),L=Object(v.a)({root:{color:"white"}});function N(e){return new Promise((function(t){return setTimeout(t,e)}))}function P(e,t,n,a){return J.apply(this,arguments)}function J(){return(J=Object(x.a)(o.a.mark((function e(t,n,a,r){var c,s,i,l,d,x,b,g,h,j,f,m;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=1,e.next=4,t.getTransaction(n,{commitment:"confirmed"});case 4:if((c=e.sent)&&c.meta){e.next=7;break}return e.abrupt("return");case 7:if(!c.meta.err){e.next=9;break}return e.abrupt("return");case 9:if(s=c.transaction.message.accountKeys,i=c.meta.preBalances,l=c.meta.postBalances,d=[],3===s.length||s[2]===p.d.programId){e.next=15;break}return e.abrupt("return");case 15:x=0,b=Object(u.a)(s),e.prev=17,b.s();case 19:if((g=b.n()).done){e.next=32;break}if(h=g.value,j=i[x],f=l[x],x++,h.toString()!==r.toString()){e.next=26;break}return e.abrupt("continue",30);case 26:if(j!==f){e.next=28;break}return e.abrupt("continue",30);case 28:m=f-j,d.push({address:h.toString(),change:m,signature:n});case 30:e.next=19;break;case 32:e.next=37;break;case 34:e.prev=34,e.t0=e.catch(17),b.e(e.t0);case 37:return e.prev=37,b.f(),e.finish(37);case 40:return e.abrupt("return",d);case 43:return e.prev=43,e.t1=e.catch(1),a("Error fetching transaction: ".concat(e.t1.toString(),", retrying in 1 second...")),N(1e3),e.abrupt("continue",0);case 48:e.next=0;break;case 50:case"end":return e.stop()}}),e,null,[[1,43],[17,34,37,40]])})))).apply(this,arguments)}function G(e){return e.substr(0,4)+".."+e.substr(e.length-4)}function K(e){return(e/p.b).toFixed(2)}function U(e){var t=e.amount;return Object(I.jsx)(D,{align:"center",style:{color:t>0?"#4BB543":"red"},children:"".concat(K(t)," SOL")})}function q(e){var t=e.tx,n=e.target,a=e.address,r=t.amount>0?n:a,c=t.amount>0?a:n;return Object(I.jsxs)("div",{style:{display:"flex",flexDirection:"column",marginTop:"20px"},children:[Object(I.jsx)("span",{style:{color:"white",fontFamily:"monospace",marginRight:"10px"},children:"".concat(G(r)," \u2192 ").concat(G(c))}),Object(I.jsx)("a",{href:"https://solscan.io/tx/".concat(t.signature),style:{color:"white",fontFamily:"monospace",marginTop:"5px",textDecoration:"none"},children:t.signature}),Object(I.jsx)("span",{style:{fontFamily:"monospace",marginRight:"10px",color:t.amount>0?"#4BB543":"red"},children:"".concat(K(t.amount)," SOL")})]})}function H(e){var t=e.row,n=e.handleExpand,a=e.target,r=M(),c=L();return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsxs)(O.a,{className:r.root,children:[Object(I.jsx)(D,{align:"center",children:Object(I.jsxs)(C.a,{"aria-label":"expand row",size:"small",onClick:function(){return n(t.address)},children:[Object(I.jsx)("span",{style:{color:"white",fontSize:"20px",marginRight:"5px"},children:t.expanded?"Collapse":"Expand"}),t.expanded?Object(I.jsx)(T.a,{className:c.root}):Object(I.jsx)(k.a,{className:c.root})]})}),Object(I.jsx)(E,{align:"center",children:t.address}),Object(I.jsx)(U,{amount:t.total})]},t.address),Object(I.jsx)(O.a,{children:Object(I.jsx)(j.a,{style:{paddingBottom:0,paddingTop:0},colSpan:6,children:Object(I.jsx)(b.a,{in:t.expanded,timeout:"auto",unmountOnExit:!0,children:Object(I.jsx)("div",{style:{display:"flex",flexDirection:"column",marginBottom:"10px"},children:t.transactions.sort((function(e,t){return Math.abs(t.amount)-Math.abs(e.amount)})).map((function(e){return Object(I.jsx)(q,{tx:e,target:a,address:t.address})}))})})})})]})}var Q=function(){var e=r.a.useState("https://ssc-dao.genesysgo.net/"),t=Object(d.a)(e,2),n=t[0],a=t[1],c=r.a.useState(""),s=Object(d.a)(c,2),i=s[0],b=s[1],j=r.a.useState(""),y=Object(d.a)(j,2),v=y[0],w=y[1],k=r.a.useState(!1),S=Object(d.a)(k,2),T=S[0],C=S[1],E=r.a.useState([]),M=Object(d.a)(E,2),L=M[0],J=M[1],G=r.a.useRef(!1);function K(e){var t,n=F.cloneDeep(L),a=Object(u.a)(n);try{for(a.s();!(t=a.n()).done;){var r=t.value;r.address===e&&(r.expanded=!r.expanded)}}catch(c){a.e(c)}finally{a.f()}J(n)}function U(){return(U=Object(x.a)(o.a.mark((function e(){var t,a,r,c,s,d,x,b,g,h,j,f,m,O,y,v,k,S,T,F,z;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:J([]),t=new p.a(n,{confirmTransactionInitialTimeout:6e4}),a=new p.c(i),r=[],c=void 0;case 5:if(!G.current){e.next=8;break}return e.abrupt("return");case 8:return e.prev=8,e.next=11,t.getConfirmedSignaturesForAddress2(a,{before:c});case 11:if(0!==(s=e.sent).length){e.next=15;break}return w("Finished collecting ".concat(r.length," signatures.")),e.abrupt("break",30);case 15:return r=r.concat(s.map((function(e){return e.signature}))),w("Collected ".concat(r.length," signatures...")),e.next=19,N(10);case 19:c=r[r.length-1],e.next=28;break;case 22:return e.prev=22,e.t0=e.catch(8),w("Failed to collect signatures, retrying in 1 second..."),e.next=27,N(1e3);case 27:return e.abrupt("continue",5);case 28:e.next=5;break;case 30:d=new Map,x=0;case 32:if(!(x<r.length/A)){e.next=75;break}if(!G.current){e.next=35;break}return e.abrupt("return");case 35:b=Math.min(A,r.length-x*A),g=[],h=0;case 38:if(!(h<b)){e.next=48;break}return w("Collecting transaction ".concat((j=x*A+h)+1," of ").concat(r.length,"...")),e.next=43,N(10);case 43:f=r[j],g.push(P(t,f,w,a));case 45:h++,e.next=38;break;case 48:return e.next=50,Promise.all(g);case 50:m=e.sent,O=Object(u.a)(m),e.prev=52,O.s();case 54:if((y=O.n()).done){e.next=64;break}if(v=y.value){e.next=58;break}return e.abrupt("continue",62);case 58:if(0!==v.length){e.next=60;break}return e.abrupt("continue",62);case 60:k=Object(u.a)(v);try{for(k.s();!(S=k.n()).done;)T=S.value,(F=d.get(T.address)||{total:0,transactions:[],address:T.address,expanded:!1}).transactions.push({signature:T.signature,amount:T.change}),F.total+=T.change,d.set(T.address,F)}catch(o){k.e(o)}finally{k.f()}case 62:e.next=54;break;case 64:e.next=69;break;case 66:e.prev=66,e.t1=e.catch(52),O.e(e.t1);case 69:return e.prev=69,O.f(),e.finish(69);case 72:x++,e.next=32;break;case 75:z=Object(l.a)(d.values()).sort((function(e,t){return Math.abs(t.total)-Math.abs(e.total)})),J(z),w("Finished fetching transactions."),C(!1);case 79:case"end":return e.stop()}}),e,null,[[8,22],[52,66,69,72]])})))).apply(this,arguments)}return r.a.useEffect((function(){T?(G.current=!1,w("Finding transactions..."),function(){U.apply(this,arguments)}()):G.current=!0}),[T]),Object(I.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},children:[Object(I.jsx)("img",{alt:"rug-scene-logo",src:B,style:{width:"256px"}}),Object(I.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:[Object(I.jsx)("label",{style:{marginRight:"10px",fontSize:"26px",color:"white",width:"120px",textTransform:"uppercase"},children:"RPC URL"}),Object(I.jsx)("input",{value:n,style:{width:"600px",fontSize:"20px"},onChange:function(e){a(e.target.value)}})]}),Object(I.jsxs)("div",{style:{marginTop:"20px",display:"flex",alignItems:"center",justifyContent:"center"},children:[Object(I.jsx)("label",{style:{marginRight:"10px",fontSize:"26px",color:"white",width:"120px",textTransform:"uppercase"},children:"Address"}),Object(I.jsx)("input",{value:i,style:{width:"600px",fontSize:"20px"},onChange:function(e){b(e.target.value)}})]}),Object(I.jsx)("button",{style:{width:"300px",marginTop:"30px",fontSize:"26px",textTransform:"uppercase",color:"white",backgroundColor:"#a768fd",border:"none",padding:"5px",borderRadius:"5px"},onClick:function(){i?(T&&w("Cancelled."),C((function(e){return!e}))):w("No address given")},children:T?"Cancel":"Find Transactions"}),Object(I.jsx)("div",{style:{width:"90%",marginTop:"40px"},children:Object(I.jsx)(f.a,{component:"div",children:Object(I.jsxs)(g.a,{children:[Object(I.jsx)(m.a,{children:Object(I.jsxs)(O.a,{children:[Object(I.jsx)(D,{align:"center",style:{width:"300px"},children:"Transactions"}),Object(I.jsx)(D,{align:"center",children:"Address"}),Object(I.jsx)(D,{align:"center",style:{width:"300px"},children:"Address Gained/Lost"})]})}),Object(I.jsx)(h.a,{children:L.map((function(e){return Object(I.jsx)(H,{row:e,target:i,handleExpand:K})}))})]})})}),Object(I.jsx)("span",{style:{marginTop:"30px",fontSize:"30px",color:"white",marginBottom:"20px"},children:v}),Object(I.jsxs)("div",{style:{marginTop:"100px",display:"flex"},children:[Object(I.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",marginLeft:"20px",marginRight:"20px"},children:[Object(I.jsx)("span",{style:{color:"white",width:"128px",textAlign:"center"},children:"Created by"}),Object(I.jsx)("div",{className:"logo-container",style:{marginTop:"10px"},children:Object(I.jsx)("img",{alt:"solslugs-logo",src:R,style:{height:"64px",padding:"10px"}})})]}),Object(I.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",marginLeft:"20px",marginRight:"20px"},children:[Object(I.jsx)("span",{style:{color:"white"},children:"Powered by"}),Object(I.jsx)("div",{className:"logo-container",style:{marginTop:"10px"},children:Object(I.jsx)("img",{alt:"genesysgo-logo",src:z,style:{height:"64px",padding:"10px"}})})]})]})]})};s.a.render(Object(I.jsx)(r.a.StrictMode,{children:Object(I.jsx)(Q,{})}),document.getElementById("root"))}},[[179,1,2]]]);
//# sourceMappingURL=main.5d6d9847.chunk.js.map