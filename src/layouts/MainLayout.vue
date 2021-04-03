<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-btn flat color="white" to="/">
                        Bisar App
                    </q-btn>
                </q-toolbar-title>

                <div>bisar v.{{ appVersion }}</div>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />
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
