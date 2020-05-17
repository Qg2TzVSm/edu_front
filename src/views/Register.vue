<template>
    <div class="register">
        <div class="img">
            <img alt="Vue logo" src="../assets/logo.png" />
        </div>
        <el-form label-position="right" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
            <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" placeholder="this will be your log in account"></el-input>
            </el-form-item>
            <el-form-item label="Name" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Passord" prop="pass">
                <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Re-password" prop="checkPass">
                <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
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
            var checkName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('姓名不能为空'));
                }else{
                    callback();
                }
            };

            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    pass: '',
                    checkPass: '',
                    email: '',
                    name: '',
                },
                rules: {
                    email: [
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    name: [
                        { validator: checkName, trigger: 'blur' }
                    ],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Req.post('register', {
                            email: this.ruleForm.email,
                            password: this.ruleForm.pass,
                            name: this.ruleForm.name
                        }).then((res) => {
                            console.log(res);
                            this.$router.push({
                                name: "Login",
                            });
                        }).catch((error)=>{
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log(error.response.data);
                            }
                            alert("注册失败！");
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
.register{
    display: inline-block;
    min-width: 800px;
}
.img{
    display: flex;
    justify-content: center;
    text-align: center;
}
</style>