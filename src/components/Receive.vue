<template>
    <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
    ></v-progress-circular>
    <v-container v-else>
        <v-row class="main-row">
            <v-card class="text-center pt-4">
                <v-card-title>Decrypted Message:</v-card-title>
                <v-card-text>
                    <iframe width="500" height="400" :srcdoc="srcdoc" frameborder="0" sandbox></iframe>
                </v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: ['token'],
    data() {
        return {
            srcdoc: '',
            loading: false,
        }
    },
    mounted() {
        this.receive();
    },
    methods: {
        async receive() {
            this.loading = true;
            const { shareId, encryptionKey } = this.decodedToken();
            const encryptor = this.getEncryptor(encryptionKey);
            const response = await fetch(process.env.VUE_APP_API_ENDPOINT + shareId, this.retreiveConfig);
            const {encrypted_data} = await response.json();
            this.srcdoc = encryptor.decrypt(encrypted_data);
            this.loading = false;
        },
        decodedToken() {
            const jsonString = window.atob(this.token);
            return JSON.parse(jsonString); 
        },
        getEncryptor(key) {
            return require('simple-encryptor')(key);
        },
        retreiveConfig() {
            return {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            }
        },
    }
}
</script>