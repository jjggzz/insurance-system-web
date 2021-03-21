<template>
        <el-container class="main-container" >

            <el-aside width="200px" style="height:100%;">
                <el-menu style="height:100%"
                         router
                         @select="handleSelect">
                    <el-menu-item index="/main/home" >主页</el-menu-item>
                    <el-submenu index="1" v-if="this.checkAuthority([0,1,2,3])">
                        <template slot="title"><i class="el-icon-message"></i>保险管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="/main/insurance" >保险列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2" v-if="this.checkAuthority([2,3])">
                        <template slot="title"><i class="el-icon-menu"></i>用户管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="/main/user" >用户列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="3" v-if="this.checkAuthority([0,1,2,3])">
                        <template slot="title"><i class="el-icon-setting"></i>保单管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="/main/policy" >保单列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item index="exit" >退出</el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <router-view/>
            </el-container>
    </el-container>
</template>

<script>
    import { Message } from 'element-ui'
    export default {
        data(){
            return {
            };
        },
        methods: {
            // eslint-disable-next-line no-unused-vars
            handleSelect(key, keyPath) {
                if (key === 'exit') {
                    this.$axios.post("/user/logout").then(response=>{
                        const { data } = response;
                        if (data.code !== 200) {
                            Message({
                                message: data.message || 'Error',
                                type: 'error',
                                duration: 5 * 1000
                            })
                        } else {
                            this.$router.push({path: '/'})
                        }
                    })
                } else {
                    this.active = key
                }
            }
        }
    }
</script>

<style scoped lang="scss">

.main-container {
    height: 100%;
}
</style>