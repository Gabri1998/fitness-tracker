(()=>{"use strict";var e={966:(e,t,r)=>{var s=r(144),o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("div",[r("b-navbar",{attrs:{toggleable:"lg",type:"dark",variant:"info"}},[r("b-navbar-brand",{attrs:{href:"/"}},[e._v("Fitness Tracker")]),r("b-navbar-toggle",{attrs:{target:"nav-collapse"}}),r("b-collapse",{attrs:{id:"nav-collapse","is-nav":""}},[r("b-navbar-nav",[e.isLoggedIn?r("b-nav-item",[r("router-link",{attrs:{to:"/"}},[e._v("Home")])],1):e._e(),e.isLoggedIn?r("b-nav-item",[r("router-link",{attrs:{to:"/workout-plans"}},[e._v("Workout Plans")])],1):e._e(),e.isLoggedIn?r("b-nav-item",[r("router-link",{attrs:{to:"/exercises"}},[e._v("Exercises")])],1):e._e(),e.isLoggedIn?e._e():r("b-nav-item",[r("router-link",{attrs:{to:"/login"}},[e._v("Log in")])],1),e.isLoggedIn?e._e():r("b-nav-item",[r("router-link",{attrs:{to:"/Signup"}},[e._v("Sign up")])],1),e.isLoggedIn?r("b-nav-item",[r("a",{attrs:{href:"#"},on:{click:e.logout}},[e._v("Log out")])]):e._e()],1)],1)],1)],1),r("b-container",{staticClass:"container_layout"},[r("router-view")],1)],1)},a=[];const n={data(){return{isLoggedIn:null!=localStorage.getItem("token")}},methods:{logout(e){e.preventDefault(),localStorage.removeItem("token"),window.location.href="/login"}}},i=n;var l=r(1),u=(0,l.Z)(i,o,a,!1,null,null,null);const m=u.exports;var c=r(345),d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h3",[e._v("Profile")]),r("b-table",{attrs:{striped:"",hover:"",items:e.users,fields:e.fields}}),r("div",{staticClass:"summary-cards"},[r("section",{staticClass:"workout-card"},[r("img",{attrs:{src:"/workoutplans.jpg",alt:""}}),r("div",[r("h1",[e._v("Workout Plans")]),r("h1",[e._v(e._s(this.summary.workoutCount))])])]),r("section",{staticClass:"session-card"},[r("img",{attrs:{src:"sessions.jpg",alt:""}}),r("div",[r("h1",[e._v("Sessions")]),r("h1",[e._v(e._s(this.summary.sessionCount))])])]),r("section",{staticClass:"exercise-card"},[r("img",{attrs:{src:"/exercises.jpg",alt:""}}),r("div",[r("h1",[e._v("Exercises")]),r("h1",[e._v(e._s(this.summary.exerciseCount))])])])])],1)},p=[],h=r(154);const f=h.Z.create({baseURL:{NODE_ENV:"production",BASE_URL:"/"}.VUE_APP_API_ENDPOINT||"http://localhost:3000/api/v1",headers:{Authorization:localStorage.getItem("token")}}),g={name:"home",data(){return{users:[],fields:["name","age","email"],errorMessage:"",summary:{workoutCount:0,sessionCount:0,exerciseCount:0}}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):(this.getUsers(),this.getUserSummary())},methods:{getUsers(){f.get("/users/me").then((e=>{this.users=[e.data]})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},getUserSummary(){f.get("/users/summary").then((e=>{this.summary=e.data})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))}}},b=g;var v=(0,l.Z)(b,d,p,!1,null,null,null);const w=v.exports;var y=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"Username","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter Username",required:""},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Password","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",type:"password",placeholder:"Enter password",required:""},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1),r("div",{staticClass:"login-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Login")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},k=[];const x={data(){return{form:{username:"",password:""},errorMessage:""}},methods:{async onSubmit(e){e.preventDefault();try{const e=await f.post("/auth/login",{username:this.form.username,password:this.form.password});localStorage.setItem("token",e.data.token),window.location.href="/"}catch(t){console.log("correct",t);const e=t.response.status;this.errorMessage=404===e?"Username or password not correct":"Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.username="",this.form.password="",this.errorMessage=""}}},_=x;var $=(0,l.Z)(_,y,k,!1,null,null,null);const S=$.exports;var E=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-",label:"Your Name:","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter name",required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Username:","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",placeholder:"Enter Username",required:""},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),r("b-form-group",{attrs:{id:"input-group-3",label:"Email address:","label-for":"input-3"}},[r("b-form-input",{attrs:{id:"input-3",type:"email",placeholder:"Enter email",required:""},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1),r("b-form-group",{attrs:{id:"input-group-4",label:"Age","label-for":"input-4"}},[r("b-form-input",{attrs:{id:"input-4",type:"number",placeholder:"Enter age",required:""},model:{value:e.form.age,callback:function(t){e.$set(e.form,"age",t)},expression:"form.age"}})],1),r("b-form-group",{attrs:{id:"input-group-5",label:"Password","label-for":"input-5"}},[r("b-form-input",{attrs:{id:"input-5",type:"password",placeholder:"Enter password",required:""},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1),r("div",{staticClass:"signup-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Sigup")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},M=[];const D={data(){return{form:{name:"",username:"",email:"",age:"",password:""},errorMessage:""}},methods:{async onSubmit(e){e.preventDefault();try{const e=await f.post("/auth/register",{name:this.form.name,username:this.form.username,email:this.form.email,age:this.form.age,password:this.form.password});localStorage.setItem("token",e.data.token),this.$router.push({path:"/login"})}catch(t){console.log("correct",t);const e=t.response.status;this.errorMessage=404===e||400===e?"Username or Email already exists":"Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.username="",this.form.email="",this.form.age="",this.form.password="",this.errorMessage=""}}},C=D;var I=(0,l.Z)(C,E,M,!1,null,null,null);const R=I.exports;var P=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h3",[e._v("Workout Plans")]),r("div",{staticClass:"btn_container"},[r("b-button",{attrs:{variant:"outline-danger"},on:{click:function(t){return e.deleteWorkoutPlans()}}},[e._v("Delete All")])],1),r("b-table",{attrs:{striped:"",hover:"",items:e.workoutPlans,fields:e.fields},scopedSlots:e._u([{key:"cell(type)",fn:function(t){return[r("router-link",{attrs:{to:"/workout-plans/"+t.item._id+"/sessions"}},[e._v(e._s(t.item.type))])]}},{key:"cell(dateCreated)",fn:function(t){return[e._v(" "+e._s(t.item.dateCreated?new Intl.DateTimeFormat("en-UK").format(new Date(t.item.dateCreated)):"-")+" ")]}},{key:"cell(actions)",fn:function(t){return[r("router-link",{attrs:{to:"/workout-plans/"+t.item._id+"/update"}},[e._v(" Update Workout ")])]}}])}),r("router-link",{attrs:{to:"/workout-plans/add"}},[e._v("Add")])],1)},q=[];const A={data(){return{workoutPlans:[],fields:["type","dateCreated","duration","actions"],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):this.getWorkoutPlans()},methods:{getWorkoutPlans(){f.get("/workoutplans").then((e=>{this.workoutPlans=e.data})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},deleteWorkoutPlans(){f.delete("/workoutplans").then((()=>{this.workoutPlans=[]})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))}}},U=A;var Z=(0,l.Z)(U,P,q,!1,null,null,null);const L=Z.exports;var W=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"Type","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter Type",required:""},model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Duration","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",placeholder:"Enter Duration",required:""},model:{value:e.form.duration,callback:function(t){e.$set(e.form,"duration",t)},expression:"form.duration"}})],1),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Add")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},O=[];const T={data(){return{form:{type:"",duration:""},errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e&&this.$router.push("/login")},methods:{async onSubmit(e){e.preventDefault();try{await f.post("/workoutplans",{type:this.form.type,duration:this.form.duration}),this.$router.push({path:"/workout-plans"})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.type="",this.form.duration="",this.errorMessage=""}}},j=T;var N=(0,l.Z)(j,W,O,!1,null,null,null);const F=N.exports;var Y=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h3",[e._v("Workout plan: "+e._s(e.workoutDetails.type)+" => Sessions")]),r("div",{staticClass:"btn_container"},[r("b-button",{attrs:{variant:"outline-danger"},on:{click:function(t){return e.deleteWorkoutPlan()}}},[e._v("Delete Workout Plan")])],1),r("b-table",{attrs:{striped:"",hover:"",items:e.sessions,fields:e.fields},scopedSlots:e._u([{key:"cell(name)",fn:function(t){return[r("router-link",{attrs:{to:"/workout-plans/"+e.$route.params.workoutid+"/view-session/"+t.item._id}},[e._v(e._s(t.item.name))])]}},{key:"cell(date)",fn:function(t){return[e._v(" "+e._s(t.item.date?new Intl.DateTimeFormat("en-UK").format(new Date(t.item.date)):"-")+" ")]}},{key:"cell(actions)",fn:function(t){return[r("router-link",{attrs:{to:"/workout-plans/"+e.$route.params.workoutid+"/update-session/"+t.item._id}},[e._v(" Update ")]),r("b-button",{staticClass:"text-danger",attrs:{variant:"link"},on:{click:function(r){return e.deleteSession(t.item._id)}}},[e._v("Delete")])]}}])}),r("router-link",{attrs:{to:"/workout-plans/"+e.$route.params.workoutid+"/add-session"}},[e._v(" Add Session ")])],1)},K=[];const V={data(){return{workoutDetails:{},sessions:[],fields:["name","date","duration","actions"],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):(this.getSessions(),this.getWorkoutDetails(),this.getAllExercises())},methods:{getSessions(){f.get(`/workoutplans/${this.$route.params.workoutid}/sessions`).then((e=>{this.sessions=e.data})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},getWorkoutDetails(){f.get(`/workoutplans/${this.$route.params.workoutid}`).then((e=>{this.workoutDetails=e.data})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},deleteWorkoutPlan(){f.delete(this.workoutDetails.links.find((e=>"DELETE"===e.method)).href).then((()=>{this.$router.push("/workout-plans")})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},deleteSession(e){f.delete(`/sessions/${e}`).then((()=>{this.getSessions()})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},async getAllExercises(){try{const e=await f.get("/exercises}");this.exercises=e.data.map((e=>({text:e.name,value:e._id})))}catch(e){this.errorMessage="Sorry something went wrong please try again later"}}}},z=V;var B=(0,l.Z)(z,Y,K,!1,null,null,null);const H=B.exports;var G=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"name","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter name",required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Duration","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",placeholder:"Enter Duration",required:""},model:{value:e.form.duration,callback:function(t){e.$set(e.form,"duration",t)},expression:"form.duration"}})],1),r("b-form-group",{attrs:{id:"input-group-3",label:"Date","label-for":"input-3"}},[r("b-form-input",{attrs:{id:"input-3",type:"date",placeholder:"yyyy-mm-dd",required:""},model:{value:e.form.date,callback:function(t){e.$set(e.form,"date",t)},expression:"form.date"}})],1),r("b-form-checkbox-group",{attrs:{id:"checkbox-group-1",options:e.exercises,"aria-describedby":e.ariaDescribedby,name:"flavour-1"},model:{value:e.form.selectedExercises,callback:function(t){e.$set(e.form,"selectedExercises",t)},expression:"form.selectedExercises"}}),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Add")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},J=[];const Q={data(){return{form:{name:"",duration:"",date:"",selectedExercises:[]},exercises:[],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):this.getAllExercises()},methods:{async onSubmit(e){e.preventDefault();try{await f.post(`/workoutplans/${this.$route.params.workoutid}/sessions`,{name:this.form.name,duration:this.form.duration,date:this.form.date,exercises:this.form.selectedExercises}),this.$router.push({path:`/workout-plans/${this.$route.params.workoutid}/sessions`})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.duration="",this.form.date="",this.form.selectedExercises=[],this.errorMessage=""},async getAllExercises(){try{const e=await f.get("/exercises");this.exercises=e.data.map((e=>({text:e.name,value:e._id})))}catch(e){this.errorMessage="Sorry something went wrong please try again later"}}}},X=Q;var ee=(0,l.Z)(X,G,J,!1,null,null,null);const te=ee.exports;var re=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"name","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter name",required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Duration","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",placeholder:"Enter Duration",required:""},model:{value:e.form.duration,callback:function(t){e.$set(e.form,"duration",t)},expression:"form.duration"}})],1),r("b-form-group",{attrs:{id:"input-group-3",label:"Date","label-for":"input-3"}},[r("b-form-input",{attrs:{id:"input-3",type:"date",placeholder:"yyyy-mm-dd",required:""},model:{value:e.form.date,callback:function(t){e.$set(e.form,"date",t)},expression:"form.date"}})],1),r("b-form-checkbox-group",{attrs:{id:"checkbox-group-1",options:e.exercises,"aria-describedby":e.ariaDescribedby,name:"flavour-1"},model:{value:e.form.selectedExercises,callback:function(t){e.$set(e.form,"selectedExercises",t)},expression:"form.selectedExercises"}}),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Update")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},se=[];const oe={data(){return{form:{name:"",duration:"",date:"",selectedExercises:[]},exercises:[],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):(this.getAllExercises(),this.getSessionDetails())},methods:{async onSubmit(e){e.preventDefault();try{await f.put(`/sessions/${this.$route.params.sessionid}`,{name:this.form.name,duration:this.form.duration,date:this.form.date,workoutplan:this.$route.params.workoutid,exercises:this.form.selectedExercises}),this.$router.push({path:`/workout-plans/${this.$route.params.workoutid}/sessions`})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.duration="",this.form.date="",this.form.selectedExercises=[],this.errorMessage=""},formatDate(e){e=new Date(e);const t=`${e.getDate()<10?"0":""}${e.getDate()}`,r=`${e.getMonth()+1<10?"0":""}${e.getMonth()+1}`,s=e.getFullYear();return`${s}-${r}-${t}`},getSessionDetails(){f.get(`/sessions/${this.$route.params.sessionid}`).then((e=>{this.form.name=e.data.name,this.form.duration=e.data.duration,this.form.date=this.formatDate(e.data.date),this.form.selectedExercises=e.data.exercises})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},async getAllExercises(){try{const e=await f.get("/exercises");this.exercises=e.data.map((e=>({text:e.name,value:e._id})))}catch(e){this.errorMessage="Sorry something went wrong please try again later"}}}},ae=oe;var ne=(0,l.Z)(ae,re,se,!1,null,null,null);const ie=ne.exports;var le=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"Type","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter Type",required:""},model:{value:e.form.type,callback:function(t){e.$set(e.form,"type",t)},expression:"form.type"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Duration","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",placeholder:"Enter Duration",required:""},model:{value:e.form.duration,callback:function(t){e.$set(e.form,"duration",t)},expression:"form.duration"}})],1),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Update")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},ue=[];const me={data(){return{form:{type:"",duration:""},errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e&&this.$router.push("/login"),this.getWorkoutDetails()},methods:{async onSubmit(e){e.preventDefault();try{await f.patch(`/workoutplans/${this.$route.params.workoutid}`,{type:this.form.type,duration:this.form.duration}),this.$router.push({path:"/workout-plans"})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.type="",this.form.duration="",this.errorMessage=""},getWorkoutDetails(){f.get(`/workoutplans/${this.$route.params.workoutid}`).then((e=>{this.form.type=e.data.type,this.form.duration=e.data.duration})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))}}},ce=me;var de=(0,l.Z)(ce,le,ue,!1,null,null,null);const pe=de.exports;var he=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("h3",[e._v("Exercises")]),r("div",{staticClass:"btn_container"},[r("b-button",{attrs:{variant:"outline-danger"},on:{click:function(t){return e.deleteAllExercise()}}},[e._v("Delete All")])],1),r("b-table",{attrs:{striped:"",hover:"",items:e.exercises,fields:e.fields},scopedSlots:e._u([{key:"cell(actions)",fn:function(t){return[r("router-link",{attrs:{to:"/exercises/"+t.item._id+"/update"}},[e._v(" Update ")]),r("b-button",{staticClass:"text-danger",attrs:{variant:"link"},on:{click:function(r){return e.deleteExercise(t.item._id)}}},[e._v("Delete")])]}}])}),r("router-link",{attrs:{to:"/exercises/add"}},[e._v("Add")])],1)},fe=[];const ge={data(){return{exercises:[],fields:["name","instruction","level","actions"],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):this.getExercises()},methods:{getExercises(){f.get("/exercises").then((e=>{this.exercises=e.data})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},deleteAllExercise(){f.delete("/exercises").then((()=>{this.exercises=[]})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},deleteExercise(e){f.delete(`/exercises/${e}`).then((()=>{this.getExercises()})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))}}},be=ge;var ve=(0,l.Z)(be,he,fe,!1,null,null,null);const we=ve.exports;var ye=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"Name","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter Name",required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Level","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",type:"number",placeholder:"Enter Difficulty Level",required:""},model:{value:e.form.level,callback:function(t){e.$set(e.form,"level",t)},expression:"form.level"}})],1),r("b-form-group",{attrs:{id:"input-group-3",label:"Instruction","label-for":"input-3"}},[r("b-form-input",{attrs:{id:"input-3",placeholder:"Enter Instructions",required:""},model:{value:e.form.instruction,callback:function(t){e.$set(e.form,"instruction",t)},expression:"form.instruction"}})],1),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Add")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},ke=[];const xe={data(){return{form:{name:"",level:"",instruction:""},errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e&&this.$router.push("/login")},methods:{async onSubmit(e){e.preventDefault();try{await f.post("/exercises",{name:this.form.name,level:this.form.level,instruction:this.form.instruction}),this.$router.push({path:"/exercises"})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.level="",this.form.instruction="",this.errorMessage=""}}},_e=xe;var $e=(0,l.Z)(_e,ye,ke,!1,null,null,null);const Se=$e.exports;var Ee=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("b-alert",{attrs:{variant:"danger",show:!!e.errorMessage}},[e._v(e._s(e.errorMessage))]),r("b-form",{on:{submit:e.onSubmit,reset:e.onReset}},[r("b-form-group",{attrs:{id:"input-group-1",label:"Name","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",placeholder:"Enter name",required:""},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),r("b-form-group",{attrs:{id:"input-group-2",label:"Level","label-for":"input-2"}},[r("b-form-input",{attrs:{id:"input-2",type:"number",placeholder:"Enter level",required:""},model:{value:e.form.level,callback:function(t){e.$set(e.form,"level",t)},expression:"form.level"}})],1),r("b-form-group",{attrs:{id:"input-group-3",label:"Instruction","label-for":"input-3"}},[r("b-form-input",{attrs:{id:"input-3",placeholder:"Enter instruction",required:""},model:{value:e.form.instruction,callback:function(t){e.$set(e.form,"instruction",t)},expression:"form.instruction"}})],1),r("div",{staticClass:"add-button"},[r("b-button",{attrs:{type:"submit",variant:"primary"}},[e._v("Update")]),r("b-button",{attrs:{type:"reset",variant:"danger"}},[e._v("Reset")])],1)],1)],1)},Me=[];const De={data(){return{form:{name:"",level:"",instruction:""},errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e&&this.$router.push("/login"),this.getExerciseDetails()},methods:{async onSubmit(e){e.preventDefault();try{await f.patch(`/exercises/${this.$route.params.exerciseid}`,{name:this.form.name,level:this.form.level,instruction:this.form.instruction}),this.$router.push({path:"/exercises"})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.level="",this.form.instruction=""},getExerciseDetails(){f.get(`/exercises/${this.$route.params.exerciseid}`).then((e=>{this.form.name=e.data.name,this.form.level=e.data.level,this.form.instruction=e.data.instruction})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))}}},Ce=De;var Ie=(0,l.Z)(Ce,Ee,Me,!1,null,null,null);const Re=Ie.exports;var Pe=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[e._v(" "+e._s(e.form.name)+" "),r("hr"),r("b-form-checkbox-group",{attrs:{id:"checkbox-group-1",options:e.exercises,"aria-describedby":e.ariaDescribedby,name:"flavour-1",stacked:"",disabled:""},model:{value:e.form.selectedExercises,callback:function(t){e.$set(e.form,"selectedExercises",t)},expression:"form.selectedExercises"}})],1)},qe=[];const Ae={data(){return{form:{name:"",duration:"",date:"",selectedExercises:[]},exercises:[],errorMessage:""}},mounted(){const e=null==localStorage.getItem("token");e?this.$router.push("/login"):(this.getAllExercises(),this.getSessionDetails())},methods:{async onSubmit(e){e.preventDefault();try{await f.put(`/sessions/${this.$route.params.sessionid}`,{name:this.form.name,duration:this.form.duration,date:this.form.date,workoutplan:this.$route.params.workoutid,exercises:this.form.selectedExercises}),this.$router.push({path:`/workout-plans/${this.$route.params.workoutid}/sessions`})}catch(t){this.errorMessage="Sorry something went wrong please try again later"}},onReset(e){e.preventDefault(),this.form.name="",this.form.duration="",this.form.date="",this.form.selectedExercises=[],this.errorMessage=""},formatDate(e){e=new Date(e);const t=`${e.getDate()<10?"0":""}${e.getDate()}`,r=`${e.getMonth()+1<10?"0":""}${e.getMonth()+1}`,s=e.getFullYear();return`${s}-${r}-${t}`},getSessionDetails(){f.get(`/sessions/${this.$route.params.sessionid}`).then((e=>{this.form.name=e.data.name,this.form.duration=e.data.duration,this.form.date=this.formatDate(e.data.date),this.form.selectedExercises=e.data.exercises})).catch((()=>{this.errorMessage="Sorry something went wrong please try again later"}))},async getAllExercises(){try{const e=await f.get("/exercises");this.exercises=e.data.map((e=>({text:`${e.name}   -   - ${e.instruction}`,value:e._id,instruction:e.instruction})))}catch(e){this.errorMessage="Sorry something went wrong please try again later"}}}},Ue=Ae;var Ze=(0,l.Z)(Ue,Pe,qe,!1,null,null,null);const Le=Ze.exports;s["default"].use(c.Z);const We=new c.Z({mode:"history",base:"/",routes:[{path:"/",name:"home",component:w},{path:"/workout-plans",name:"workout-plans",component:L},{path:"/workout-plans/add",name:"workout-plans/add",component:F},{path:"/workout-plans/:workoutid/update",name:"workout-plans/:workoutid/update",component:pe},{path:"/workout-plans/:workoutid/sessions",name:"workout-plans/:workoutid/sessions",component:H},{path:"/workout-plans/:workoutid/add-session",name:"workout-plans/:workoutid/add-session",component:te},{path:"/workout-plans/:workoutid/update-session/:sessionid",name:"workout-plans/:workoutid/update-session/:sessionid",component:ie},{path:"/workout-plans/:workoutid/view-session/:sessionid",name:"workout-plans/:workoutid/view-session/:sessionid",component:Le},{path:"/login",name:"login",component:S},{path:"/signup",name:"signup",component:R},{path:"/exercises",name:"exercises",component:we},{path:"/exercises/add",name:"exercises/add",component:Se},{path:"/exercises/:exerciseid/update",name:"exercises/:exerciseid/update",component:Re}]});var Oe=r(32);r(24);s["default"].use(Oe.ZPm),s["default"].config.productionTip=!1,new s["default"]({router:We,render:function(e){return e(m)}}).$mount("#app")}},t={};function r(s){var o=t[s];if(void 0!==o)return o.exports;var a=t[s]={exports:{}};return e[s](a,a.exports,r),a.exports}r.m=e,(()=>{var e=[];r.O=(t,s,o,a)=>{if(!s){var n=1/0;for(m=0;m<e.length;m++){for(var[s,o,a]=e[m],i=!0,l=0;l<s.length;l++)(!1&a||n>=a)&&Object.keys(r.O).every((e=>r.O[e](s[l])))?s.splice(l--,1):(i=!1,a<n&&(n=a));if(i){e.splice(m--,1);var u=o();void 0!==u&&(t=u)}}return t}a=a||0;for(var m=e.length;m>0&&e[m-1][2]>a;m--)e[m]=e[m-1];e[m]=[s,o,a]}})(),(()=>{r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}})(),(()=>{r.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}})(),(()=>{var e={143:0};r.O.j=t=>0===e[t];var t=(t,s)=>{var o,a,[n,i,l]=s,u=0;if(n.some((t=>0!==e[t]))){for(o in i)r.o(i,o)&&(r.m[o]=i[o]);if(l)var m=l(r)}for(t&&t(s);u<n.length;u++)a=n[u],r.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return r.O(m)},s=self["webpackChunkclient"]=self["webpackChunkclient"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var s=r.O(void 0,[998],(()=>r(966)));s=r.O(s)})();
//# sourceMappingURL=app.de6186c9.js.map