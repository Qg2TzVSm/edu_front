<template>
    <h1></h1>
</template>

<script>
    import Req from "../apis/baseReq";

    export default {
        data(){
            return {
                first: true
            }
        },
        created() {
            if (this.$route.query.result !== undefined){
                this.first = false
                if (this.$route.query.result == 1){
                    alert("绑定成功！");
                    this.$router.push({
                        name: "Home",
                    });
                }else{
                    alert("绑定失败！");
                    this.$router.push({
                        name: "Home",
                    });
                }
            }
        },
        mounted() {
            if (this.first){
                Req.defaults.headers.common['Authorization'] = "Bearer " + this.$store.state.edu_user_token;
                Req.get("bind/prepare").then((res) => {
                    console.log(res.data);
                    window.location.href = "https://edudemo.herokuapp.com/auth?nonce=" + res.data.result
                }).catch((error)=>{
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        console.log(error.response.data);
                        this.$router.push({
                            name: "Home",
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>