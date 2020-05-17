<template>
    <el-form :inline="true" :model="formInline" ref="inviteForm" class="demo-form-inline">
        <el-form-item label="学校">
            <el-select v-model="formInline.school_id" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="搜索用户">
            <el-input v-model="formInline.email" placeholder="请输入对方邮箱"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
    import Req from "../apis/baseReq";
    export default {
        data() {
            return {
                formInline: {
                    email: '',
                    school_id: '邀请到此学校'
                },
                options: [],
            }
        },
        mounted() {
            Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
            Req.get('q').then((res) => {
                console.log(res.data.result);
                this.options = res.data.result;
            }).catch((error)=>{
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                }
                console.log(error);
                //alert("邀请失败1！");
            });
        },
        methods: {
            onSubmit() {
                Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
                Req.post('invite', {email:this.formInline.email, school_id:this.formInline.school_id}).then((res) => {
                    console.log(res.data.result);
                    alert("邀请成功！");
                }).catch((error)=>{
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        alert(error.response.data.result);
                    }else{
                        alert("邀请失败！");
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>