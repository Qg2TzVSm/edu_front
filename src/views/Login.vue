<template>
    <div class="login">
        <div class="img">
            <img alt="Vue logo" src="../assets/logo.png" />
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" v-if="login_default">
            <el-form-item label="邮箱" prop="email">
                <el-input type="text" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-radio-group v-model="ruleForm.role">
                    <el-radio :label="1">老师</el-radio>
                    <el-radio :label="0">学生</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
                <el-button @click="loginWithLine">line登陆</el-button>
            </el-form-item>
        </el-form>
        <el-form :model="ruleForm" status-icon ref="loginForm" label-width="100px" v-else>
            <el-form-item label="账号">
                <el-select v-model="login_id" placeholder="请选择" @change="setLoginType">
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitLogin">登陆</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import Req from "../apis/baseReq";
    export default {
        data() {
            var checkEmail = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('邮箱不能为空'));
                }else{
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    email: '',
                    password: '',
                    role:1,
                },
                rules: {
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                },
                login_type: {
                    user_type: -1,
                    user_id:0,
                    type: 0,
                },
                login_id: '请选择账号',
                options: [],
            };
        },
        computed: {
            login_default: function () {
                return this.login_type.type === 0
            }
        },
        created() {
            if (this.$route.query.nonce !== undefined){
                if (this.$route.query.nonce.length === 12){
                    this.login_type.type = 1;
                    this.reqAccInfo(this.$route.query.nonce);
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        Req.post('login', {
                            auth_type:this.ruleForm.role,
                            email: this.ruleForm.email,
                            password: this.ruleForm.password
                        }).then((res) => {
                            localStorage.setItem('edu_user_token', res.data.result.access_token);
                            localStorage.setItem('edu_user_type', this.ruleForm.role);
                            this.$store.commit('setToken', res.data.result.access_token);
                            this.$store.commit('setUserType', this.ruleForm.role);
                            this.$router.push({
                                name: "Home",
                                });
                        }).catch((error)=>{
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log(error.response.data);
                            }
                            alert("登陆失败，请检查用户名和密码是否输对。");
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            submitLogin() {
                console.log(this.login_id);
                Req.post(`login/by/line`,{
                    auth_type:this.login_type.user_type,
                    user_id:this.login_type.user_id}).then((res) => {
                    localStorage.setItem('edu_user_token', res.data.result.access_token);
                    localStorage.setItem('edu_user_type', this.login_type.user_type);
                    this.$store.commit('setToken', res.data.result.access_token);
                    this.$store.commit('setUserType', this.login_type.user_type);
                    this.$router.push({
                        name: "Home",
                    });
                }).catch((error)=>{
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                    }
                    alert("获取账号信息失败。");
                });
            },
            reqAccInfo(nonce) {
                Req.get(`login/by/line?nonce=${nonce}`).then((res) => {
                    let t = res.data.result.teachers;
                    let s = res.data.result.students;
                    let tt = []
                    let id = 1;
                    if (t.length > 0){
                        for (let i=0;i < t.length;i++){
                            tt.push({value:t[i].id, label:`老师： ${t[i].name}`,user_type:1,id:id})
                            id++;
                        }
                    }
                    if (s.length > 0){
                        for (let i=0;i < t.length;i++){
                            tt.push({value:s[i].id, label:`学生： ${s[i].name}`,user_type:0,id:id})
                            id++
                        }
                    }
                    this.options = tt;
                }).catch((error)=>{
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                    }
                    alert("获取账号信息失败。");
                });
            },
            loginWithLine: function () {
                window.location.href = "https://edudemo.herokuapp.com/auth?nonce=loginVia&line=1"
            },
            setLoginType(v){
                let t = this.options;
                for (let i = 0;i<t.length;i++){
                    if (t[i].id == v){
                        this.login_type.user_type = t[i].user_type
                        this.login_type.user_id = t[i].value
                        break;
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .login{
        display: inline-block;
        min-width: 800px;
    }
    .img{
        display: flex;
        justify-content: center;
        text-align: center;
    }
</style>