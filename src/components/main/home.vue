<template>
    <el-container>
        <el-header>
            <h1>用户{{$store.getters.userName}}你好,欢迎您使用本系统!! 您的角色为 [{{compRule()}}]</h1>
        </el-header>
        <el-main>
            <el-calendar v-model="value">
            </el-calendar>
        </el-main>
    </el-container>

</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                value: new Date(),
            }
        },
        methods: {
            compRule() {
                const rule = this.$store.getters.rule;
                if (rule == 0) {
                    return "投保人";
                } else if (rule == 1) {
                    return "投保人";
                }else if (rule == 2) {
                    return "受益人";
                }else if (rule == 3) {
                    return "管理员";
                } else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>

</style>