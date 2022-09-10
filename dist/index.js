(()=>{"use strict";var e={n:t=>{var r=t&&t.__esModule?()=>t.default:()=>t;return e.d(r,{a:r}),r},d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=require("express");var r=e.n(t);const n=require("cors");var i=e.n(n);const o=require("helmet");var a=e.n(o);require("morgan");require("fs");const s=require("path");var u=e.n(s);(0,require("dotenv").config)();var l=process.env,c=l.PORT;l.POSTGRESQL_USER,l.POSTGRESQL_PASSWORD,l.POSTGRESQL_PORT,l.DATABASE_URL;function p(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function f(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}(new(function(){function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),f(this,"logPath",u().join(__dirname,"..","logs","access.log")),f(this,"handleMiscRoutes",(function(){t.app.get("/",(function(e,t){t.status(200).json({error:null,data:{server:"Base-Healthy"}})})),t.app.all("*",(function(e,t){t.status(404).json({error:"Requested route doesn't exist - 404",data:null})}))})),this.app=r()(),this.port=+c||4e3,this.initializeMiddlewares(),this.handleMiscRoutes()}var t,n,o;return t=e,(n=[{key:"listen",value:function(){var e=this;this.app.listen(this.port,(function(){console.log("Server is up on the port: ".concat(e.port))}))}},{key:"initializeMiddlewares",value:function(){this.app.use(i()()),this.app.use(r().json()),this.app.use(a()())}}])&&p(t.prototype,n),o&&p(t,o),Object.defineProperty(t,"prototype",{writable:!1}),e}())).listen()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Im1CQUNBLElBQUlBLEVBQXNCLENDQTFCQSxFQUF5QkMsSUFDeEIsSUFBSUMsRUFBU0QsR0FBVUEsRUFBT0UsV0FDN0IsSUFBT0YsRUFBaUIsUUFDeEIsSUFBTSxFQUVQLE9BREFELEVBQW9CSSxFQUFFRixFQUFRLENBQUVHLEVBQUdILElBQzVCQSxDQUFNLEVDTGRGLEVBQXdCLENBQUNNLEVBQVNDLEtBQ2pDLElBQUksSUFBSUMsS0FBT0QsRUFDWFAsRUFBb0JTLEVBQUVGLEVBQVlDLEtBQVNSLEVBQW9CUyxFQUFFSCxFQUFTRSxJQUM1RUUsT0FBT0MsZUFBZUwsRUFBU0UsRUFBSyxDQUFFSSxZQUFZLEVBQU1DLElBQUtOLEVBQVdDLElBRTFFLEVDTkRSLEVBQXdCLENBQUNjLEVBQUtDLElBQVVMLE9BQU9NLFVBQVVDLGVBQWVDLEtBQUtKLEVBQUtDLElDQWxGLE1BQU0sRUFBK0JJLFFBQVEsVyxhQ0E3QyxNQUFNLEVBQStCQSxRQUFRLFEsYUNBN0MsTUFBTSxFQUErQkEsUUFBUSxVLGFDQVJBLFFBQVEsVUNBUkEsUUFBUSxNQ0E3QyxNQUFNLEVBQStCQSxRQUFRLFEsY0NDN0NDLEVDRHFDRCxRQUFRLFVEQzdDQyxVQUVPLE1BT0hDLFFBQVFDLElBTFZDLEVBRkssRUFFTEEsS0FGSyxFQUdMQyxnQkFISyxFQUlMQyxvQkFKSyxFQUtMQyxnQkFMSyxFQU1MQyxhLCtSRVJVLElDT05DLFdBVUosYUFBZSxZLDRGQUFBLDBCQVBXQyxJQUFBQSxLQUN4QkMsVUFDQSxLQUNBLE9BQ0EsZUFHYSwyQkEwQ1ksV0FJekIsRUFBS0MsSUFBSWxCLElBQUksS0FBSyxTQUFDbUIsRUFBS0MsR0FDdEJBLEVBQUlDLE9BQU8sS0FBS0MsS0FBSyxDQUNuQkMsTUFBTyxLQUNQQyxLQUFNLENBQ0pDLE9BQVEsaUJBR2IsSUFLRCxFQUFLUCxJQUFJUSxJQUFJLEtBQUssU0FBQ1AsRUFBS0MsR0FDdEJBLEVBQUlDLE9BQU8sS0FBS0MsS0FBSyxDQUNuQkMsTUFBTyxzQ0FDUEMsS0FBTSxNQUVULEdBQ0YsSUEvRENHLEtBQUtULElBQU1VLE1BQ1hELEtBQUtFLE1BQVFuQixHQUFTLElBRXRCaUIsS0FBS0csd0JBQ0xILEtBQUtJLGtCQUNOLEMsNkNBRUQsV0FBaUIsV0FDZkosS0FBS1QsSUFBSWMsT0FBT0wsS0FBS0UsTUFBTSxXQUV6QkksUUFBUUMsSUFBUixvQ0FBeUMsRUFBS0wsTUFDL0MsR0FDRixHLG1DQUVELFdBQ0VGLEtBQUtULElBQUlpQixJQUFJQyxPQUNiVCxLQUFLVCxJQUFJaUIsSUFBSVAsSUFBQUEsUUFLYkQsS0FBS1QsSUFBSWlCLElBQUlFLE1Ba0JkLE0sZ0ZBbERHdEIsS0RMRmlCLFEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vc2xhc2gtYmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL29zbGFzaC1iZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL29zbGFzaC1iZS9leHRlcm5hbCBjb21tb25qcyBcImNvcnNcIiIsIndlYnBhY2s6Ly9vc2xhc2gtYmUvZXh0ZXJuYWwgY29tbW9uanMgXCJoZWxtZXRcIiIsIndlYnBhY2s6Ly9vc2xhc2gtYmUvZXh0ZXJuYWwgY29tbW9uanMgXCJtb3JnYW5cIiIsIndlYnBhY2s6Ly9vc2xhc2gtYmUvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlLy4vc3JjL2NvbmZpZy9pbmRleC50cyIsIndlYnBhY2s6Ly9vc2xhc2gtYmUvZXh0ZXJuYWwgY29tbW9uanMgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly9vc2xhc2gtYmUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vb3NsYXNoLWJlLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiY29uc3QgX19XRUJQQUNLX05BTUVTUEFDRV9PQkpFQ1RfXyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsImNvbnN0IF9fV0VCUEFDS19OQU1FU1BBQ0VfT0JKRUNUX18gPSByZXF1aXJlKFwiY29yc1wiKTsiLCJjb25zdCBfX1dFQlBBQ0tfTkFNRVNQQUNFX09CSkVDVF9fID0gcmVxdWlyZShcImhlbG1ldFwiKTsiLCJjb25zdCBfX1dFQlBBQ0tfTkFNRVNQQUNFX09CSkVDVF9fID0gcmVxdWlyZShcIm1vcmdhblwiKTsiLCJjb25zdCBfX1dFQlBBQ0tfTkFNRVNQQUNFX09CSkVDVF9fID0gcmVxdWlyZShcImZzXCIpOyIsImNvbnN0IF9fV0VCUEFDS19OQU1FU1BBQ0VfT0JKRUNUX18gPSByZXF1aXJlKFwicGF0aFwiKTsiLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tIFwiZG90ZW52XCI7XG5jb25maWcoKTtcblxuZXhwb3J0IGNvbnN0IHtcbiAgTk9ERV9FTlYsXG4gIFBPUlQsXG4gIFBPU1RHUkVTUUxfVVNFUixcbiAgUE9TVEdSRVNRTF9QQVNTV09SRCxcbiAgUE9TVEdSRVNRTF9QT1JULFxuICBEQVRBQkFTRV9VUkwsXG59ID0gcHJvY2Vzcy5lbnY7XG4iLCJjb25zdCBfX1dFQlBBQ0tfTkFNRVNQQUNFX09CSkVDVF9fID0gcmVxdWlyZShcImRvdGVudlwiKTsiLCJpbXBvcnQgQXBwIGZyb20gXCIuL2FwcFwiO1xuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5hcHAubGlzdGVuKCk7XG4iLCJpbXBvcnQgZXhwcmVzcywgeyBBcHBsaWNhdGlvbiB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xuaW1wb3J0IGhlbG1ldCBmcm9tIFwiaGVsbWV0XCI7XG5pbXBvcnQgbW9yZ2FuIGZyb20gXCJtb3JnYW5cIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBOT0RFX0VOViwgUE9SVCB9IGZyb20gXCIuL2NvbmZpZ1wiO1xuXG5jbGFzcyBBcHAge1xuICBwcml2YXRlIGFwcDogQXBwbGljYXRpb247XG4gIHByaXZhdGUgcG9ydDogbnVtYmVyO1xuICBwcml2YXRlIGxvZ1BhdGg6IHN0cmluZyA9IHBhdGguam9pbihcbiAgICBfX2Rpcm5hbWUsXG4gICAgXCIuLlwiLFxuICAgIFwibG9nc1wiLFxuICAgIFwiYWNjZXNzLmxvZ1wiLFxuICApO1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcbiAgICB0aGlzLnBvcnQgPSArUE9SVCEgfHwgNDAwMDtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZU1pZGRsZXdhcmVzKCk7XG4gICAgdGhpcy5oYW5kbGVNaXNjUm91dGVzKCk7XG4gIH1cblxuICBwdWJsaWMgbGlzdGVuICgpIHtcbiAgICB0aGlzLmFwcC5saXN0ZW4odGhpcy5wb3J0LCAoKSA9PiB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coYFNlcnZlciBpcyB1cCBvbiB0aGUgcG9ydDogJHt0aGlzLnBvcnR9YCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVNaWRkbGV3YXJlcyAoKSB7XG4gICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XG4gICAgdGhpcy5hcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxuICAgIC8qKlxuICAgICAqIFNlY3VyaXR5IGhlYWRlcnMgdG8gYmUgYXR0YWNoZWQgd2l0aCByZXF1ZXN0c1xuICAgICAqL1xuICAgIHRoaXMuYXBwLnVzZShoZWxtZXQoKSk7XG5cbiAgICAvKipcbiAgICAgKiBGb3IgbG9nIHJlbGF0ZWQgc2VydmljZXMgLSBvbmx5IGZvciBkZXYgc2VydmVyXG4gICAgICovXG4gICAgaWYgKE5PREVfRU5WID09IFwiZGV2ZWxvcG1lbnRcIiB8fCBOT0RFX0VOViA9PSBcInRlc3RcIikge1xuICAgICAgY29uc3QgYWNjZXNzTG9nU3RyZWFtOiBmcy5Xcml0ZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKFxuICAgICAgICB0aGlzLmxvZ1BhdGgsXG4gICAgICAgIHtcbiAgICAgICAgICBmbGFnczogXCJhXCIsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgICAgdGhpcy5hcHAudXNlKFxuICAgICAgICBtb3JnYW4oXCJjb21tb25cIiwge1xuICAgICAgICAgIHN0cmVhbTogYWNjZXNzTG9nU3RyZWFtLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVNaXNjUm91dGVzID0gKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIEJhc2Ugcm91dGUgLSB0byBjaGVjayBBUEkgaGVhbHRoXG4gICAgICovXG4gICAgdGhpcy5hcHAuZ2V0KFwiL1wiLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBzZXJ2ZXI6IFwiQmFzZS1IZWFsdGh5XCIsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEhhbmRsaW5nIGFsbCB1bmRlZmluZWQgcm91dGVzXG4gICAgICovXG4gICAgdGhpcy5hcHAuYWxsKFwiKlwiLCAocmVxLCByZXMpID0+IHtcbiAgICAgIHJlcy5zdGF0dXMoNDA0KS5qc29uKHtcbiAgICAgICAgZXJyb3I6IFwiUmVxdWVzdGVkIHJvdXRlIGRvZXNuJ3QgZXhpc3QgLSA0MDRcIixcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBBcHA7XG4iXSwibmFtZXMiOlsiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZSIsImdldHRlciIsIl9fZXNNb2R1bGUiLCJkIiwiYSIsImV4cG9ydHMiLCJkZWZpbml0aW9uIiwia2V5IiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsIm9iaiIsInByb3AiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJyZXF1aXJlIiwiY29uZmlnIiwicHJvY2VzcyIsImVudiIsIlBPUlQiLCJQT1NUR1JFU1FMX1VTRVIiLCJQT1NUR1JFU1FMX1BBU1NXT1JEIiwiUE9TVEdSRVNRTF9QT1JUIiwiREFUQUJBU0VfVVJMIiwiQXBwIiwicGF0aCIsIl9fZGlybmFtZSIsImFwcCIsInJlcSIsInJlcyIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsImRhdGEiLCJzZXJ2ZXIiLCJhbGwiLCJ0aGlzIiwiZXhwcmVzcyIsInBvcnQiLCJpbml0aWFsaXplTWlkZGxld2FyZXMiLCJoYW5kbGVNaXNjUm91dGVzIiwibGlzdGVuIiwiY29uc29sZSIsImxvZyIsInVzZSIsImNvcnMiLCJoZWxtZXQiXSwic291cmNlUm9vdCI6IiJ9