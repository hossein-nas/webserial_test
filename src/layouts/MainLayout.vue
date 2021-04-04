<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-btn flat color="white" :to="{ name : 'index', params : { reset : true } }" >
                        Bisar App
                    </q-btn>
                </q-toolbar-title>

                <div>bisar v.{{ appVersion }}</div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <keep-alive>
                <router-view />
            </keep-alive>
        </q-page-container>
    </q-layout>
</template>

<script>

    export default {
        name: 'MainLayout',
        data () {
            return {
                appVersion: '0.0.1',
            }
        }
    }
</script>
