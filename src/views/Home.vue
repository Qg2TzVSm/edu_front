<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <el-row>
          角色：{{edu_role}}
        </el-row>
        <el-row>
          {{school}}
        </el-row>
      </el-aside>
      <el-main>
        <el-row class="operating" v-if="is_teacher">
          <el-button type="primary" @click="getData">学生列表</el-button>
          <el-button type="success" @click="getFollows">关注我的</el-button>
        </el-row>
        <el-row v-if="is_teacher">
          <el-table
                  :data="tableData"
                  height="450"
                  border
                  style="width: 100%">
            <el-table-column
                    prop="id"
                    label="ID">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" size="small">聊天</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="operating" v-if="is_student">
          <el-button type="primary" @click="getData">老师列表</el-button>
          <el-button type="success" @click="getFollows">我关注的</el-button>
        </el-row>
        <el-row v-if="is_student">
          <el-table
                  :data="tableData"
                  height="450"
                  border
                  style="width: 100%">
            <el-table-column
                    prop="id"
                    label="ID">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" size="small">聊天</el-button>
                <el-button @click="handleFollow(scope.row)" size="small" v-if="student_chose_1" :disabled="scope.row.followed_count===1">{{scope.row.followed_count ? '已关注' : '关注'}}</el-button>
                <el-button @click="handleUnFollow(scope.row)" size="small" v-if="student_chose_2">取消关注</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-main>
      <el-drawer
              :visible.sync="drawer"
              direction="rtl"
              :before-close="handleClose">
        <ul id="messages">
          <li v-for="(item, i) in receive" :key="i">{{item.from}}说：{{item.msg}}</li>
        </ul>
        <form action="" id="msg-input">
          <input id="m" v-model="msg" autocomplete="off" @keyup.enter="sendMessage"/>
        </form>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Req from "../apis/baseReq";

var websocket;
Array.prototype.remove = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i].id == val) this.splice(i, 1);
  }
};
export default {
  data(){
    return {
      drawer: false,
      tableData:[],
      msg: '',
      receive: [],
      chatWith:{},
      student_chose_1: false,
      student_chose_2: false,

    }
  },
  computed:{
    edu_role: function () {
      if (this.$store.state.edu_user_type === -1){
        return '未登陆';
      }else if (this.$store.state.edu_user_type === 1){
        return '老师';
      }else{
        return '学生';
      }
    },
    school: function () {
      if (this.$store.state.edu_user_type === -1){
        return '';
      }else{
        return "学校：" + this.$store.state.school.name;
      }
    },
    is_teacher: function(){
      return this.$store.state.edu_user_type === 1
    },
    is_student: function () {
      return this.$store.state.edu_user_type === 0
    },
    login_state: function() {
      return this.$store.state.edu_user_token === ''
    },
    profile_ready: function () {
      return this.$store.state.profile.id !== undefined
    }
  },
  watch:{
    login_state: function() {
      // this.connToWs();
    },
    profile_ready: function () {
      console.log("profile updated")
      this.connToWs()
    }
  },
  mounted() {
    let old_data = sessionStorage.getItem('home_table_data_cache');
    if (old_data){
      this.tableData = JSON.parse(old_data);
    }
    let student_c = sessionStorage.getItem("home_student_chose_cache");
    if (student_c === '2'){
      this.student_chose_2 = true;
    }else if (student_c === '1'){
      this.student_chose_1 = true;
    }
    if (!this.login_state && this.profile_ready){
      this.connToWs()
    }
  },
  methods: {
    connToWs:function (){
      let that = this;
      var wsServer = 'wss://edu-chat-server.herokuapp.com/ws';
      websocket = new WebSocket(wsServer);
      websocket.onopen = function () {
        console.log("Connected to WebSocket server.");
        websocket.send(JSON.stringify({
          type:0,
          user_type:that.$store.state.edu_user_type, // 当前用户类型
          id:0,
          from:that.$store.state.profile.id,
        }));
      };

      websocket.onclose = function () {
        console.log("Disconnected");
      };

      websocket.onmessage = function (evt) {
        console.log('Retrieved data from server: ' + evt.data);
        let data = JSON.parse(evt.data);
        if (data.type === 2){
          that.$notify({
            title: '收到老师的通知',
            message: data.from + "说：" + data.msg,
            duration: 0
          });
        }else if (data.type === 3){
          that.$notify({
            title: '收到管理员通知',
            message: data.msg,
            duration: 0
          });
        } else{
          let t = that.receive;
          t.push({from:that.chatWith.name, msg:data.msg});
          that.receive = t;
          console.log(that.receive);
        }
      };

      websocket.onerror = function (evt) {
        console.log('Error occured: ' + evt.data);
      };
    },
    handleClick: function (v) {
      console.log(v);
      // this.connToWs();
      this.chatWith = {id:v.id, name:v.name};
      this.drawer = true;
    },
    handleClose() {
      this.drawer = false;
    },
    sendMessage: function () {
      if (websocket !== undefined){
        let type = this.$store.state.edu_user_type === 1 ? 0 : 1;
        websocket.send(JSON.stringify({
          type:1,
          user_type: this.$store.state.edu_user_type,
          id:this.chatWith.id,
          to_user_type: type,
          from:this.$store.state.profile.id,
          msg:this.msg,
        }));
        let t = this.receive;
        t.push({from:"我",msg:this.msg});
        this.receive = t;
      }
      this.msg = "";
    },
    getData: function () {
      Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
      let url = this.$store.state.edu_user_type === 1 ? 'school/'+this.$store.state.school.id+'/students' : 'student/teachers';
      Req.get(url).then((res) => {
        console.log(res.data);
        this.tableData = res.data.result;
        this.student_chose_1 = true;
        this.student_chose_2 = false;
        sessionStorage.setItem("home_student_chose_cache", '1');
        sessionStorage.setItem("home_table_data_cache", JSON.stringify(res.data.result));
      }).catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        }
      });
    },
    getFollows: function () {
      Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
      let url = this.$store.state.edu_user_type === 1 ? 'school/'+this.$store.state.school.id+'/follows' : 'student/follows';
      Req.get(url).then((res) => {
        console.log(res.data);
        this.tableData = res.data.result;
        this.student_chose_2 = true;
        this.student_chose_1 = false;
        sessionStorage.setItem("home_student_chose_cache", '2');
        sessionStorage.setItem("home_table_data_cache", JSON.stringify(res.data.result));
      }).catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        }
      });
    },
    handleFollow: function (v) {
      Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
      Req.post('student/teacher/'+v.id+'/follow').then((res) => {
        console.log(res.data);
        let t = this.tableData;
        t.remove(v.id);
        this.tableData = t;
        sessionStorage.setItem("home_table_data_cache", JSON.stringify(t));
      }).catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        }
      });
    },
    handleUnFollow: function (v) {
      Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
      Req.post('student/teacher/'+v.id+'/un-follow').then((res) => {
        console.log(res.data);
        let t = this.tableData;
        t.remove(v.id);
        this.tableData = t;
        sessionStorage.setItem("home_table_data_cache", JSON.stringify(t));
      }).catch((error)=>{
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        }
      });
    }
  }
};
</script>

<style scoped>
  .operating{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 50px;
  }
  #msg-input { background: #000; padding: 3px; position: fixed; bottom: 0; width: 100%; }
  #msg-input input { border: 0; padding: 10px; width: 100%; margin-right: 0.5%; }
  #messages { list-style-type: none; margin: 0; padding: 0; }
  #messages li { padding: 5px 10px; }
  #messages li:nth-child(odd) { background: #eee; }
</style>
