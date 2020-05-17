<template>
    <div class="school-register">
        <div class="img">
            <img alt="Vue logo" src="../assets/logo.png" />
        </div>
        <el-form label-position="right" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px">
            <el-form-item label="School Name" prop="schoolName">
                <el-input v-model="ruleForm.schoolName"></el-input>
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
        data(){
            var schoolName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('学校名不能为空'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    schoolName: '',
                },
                rules: {
                    schoolName: [
                        { validator: schoolName, trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
                        Req.post('school/register', {
                            schoolName: this.ruleForm.schoolName
                        }).then((res) => {
                            console.log(res);
                            alert("申请成功！");
                            this.$refs[formName].resetFields();
                        }).catch((error)=>{
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log(error.response.data);
                            }
                            alert("申请失败！");
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
    .school-register{
        display: inline-block;
        min-width: 800px;
    }
    .img{
        display: flex;
        justify-content: center;
        text-align: center;
    }
</style>