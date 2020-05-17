<template>
    <div class="login">
        <div class="img">
            <img alt="Vue logo" src="../assets/logo.png" />
        </div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
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
                }
            };
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