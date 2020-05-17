<template>
  <div id="app">
    <div id="nav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">
          <router-link to="/">Home</router-link>
        </el-menu-item>
        <el-submenu index="2" v-if="is_teacher">
          <template slot="title">选择学校</template>
          <el-menu-item v-for="item in options" :key="item.id" :school_id="item.id" :index="item.name">{{item.name}}</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" v-if="is_teacher">
          <router-link to="/register-school">申请学校</router-link>
        </el-menu-item>
        <el-menu-item index="4" v-if="is_teacher">
          <router-link to="/invite">邀请老师</router-link>
        </el-menu-item>
        <el-menu-item index="5" v-if="login_state">
          <router-link to="/login">Log in</router-link>
        </el-menu-item>
        <el-menu-item index="5" v-else-if="!login_state">
          <router-link to="/bind">绑定line</router-link>
        </el-menu-item>
        <el-menu-item index="6">
          <router-link to="/register">Sign up</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view />
  </div>
</template>

<script>
  import Req from "./apis/baseReq";
  export default {
    data() {
      return {
        activeIndex: '1',
        options: [],
      }
    },
    computed:{
      login_state: function() {
        return this.$store.state.edu_user_token === ''
      },
      is_teacher: function(){
        return this.$store.state.edu_user_type === 1
      },
      is_student: function () {
        return this.$store.state.edu_user_type === 0
      }
    },
    watch:{
      is_teacher: function () {
        this.reqProfile();
      },
      is_student: function () {
        this.reqProfile();
      }
    },
    created() {
      let token = localStorage.getItem("edu_user_token");
      let user_type = localStorage.getItem("edu_user_type");
      if (token !== null && user_type !== null){
        this.$store.state.edu_user_type = parseInt(user_type);
        this.$store.state.edu_user_token = token
      }
    },
    mounted() {

    },
    methods: {
      handleSelect: function(key, keyPath,e) {
        if (keyPath !== undefined && keyPath[0] === '2'){
          this.$store.commit('setSchool', {id:e.$attrs.school_id, name:key});
        }
      },
      reqProfile: function () {
        let url = this.is_teacher ? 'teacher/profile' : 'student/profile';
        Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
        Req.get(url).then((res) => {
          console.log(res.data);
          this.$store.commit("setUserProfile", res.data.result);
          if (this.is_teacher){
            this.options = res.data.result.schools;
          }else if (this.is_student){
            this.$store.commit('setSchool', {id:res.data.result.school.id, name:res.data.result.school.name});
          }
        }).catch((error)=>{
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
          }
        });
      }
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
