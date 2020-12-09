<template>
    <div>
        <v-container>
            <v-row class="main-row">
                <v-card width="400" class="text-center pt-4">
                    <v-progress-circular
                    v-if="loading"
                    indeterminate
                    color="primary"
                    ></v-progress-circular>
                    <v-card-text v-else>
                        <quill-editor v-model="content"/>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn
                            color="orange"
                            text
                            :disabled="!validContent || loading"
                            @click="share"
                        >
                            Share
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-row>
        </v-container>
        <v-row justify="center">
            <v-dialog
                v-model="shareDialog"
                persistent
                max-width="700"
            >
                <v-card>
                    <v-card-title class="headline">
                        Sharing information:
                    </v-card-title>
                    <v-card-text>Share Link: {{shareLink}} <v-icon @click="copy">content_copy</v-icon><v-icon v-if="copied" color="green">done</v-icon></v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        color="green darken-1"
                        text
                        @click="close"
                        >
                        Got it!
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <input type="text" class="shareLink" id="link" :value="shareLink">
            </v-dialog>
        </v-row>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor';
    export default {
    components: {
        quillEditor
    },
    methods: {
        generateKey() {
            var key = ""
            while(key.length < 16) {
                key += Math.random().toString(36).substring(3)
            }
            this.encryptionKey = key;
        },
        async share() {
            this.loading = true;
            this.generateKey();
            const encryptor = this.getEncryptor(this.encryptionKey);
            this.encryptedData = encryptor.encrypt(this.content);
            const response = await fetch(process.env.VUE_APP_API_ENDPOINT, this.shareConfig);
            const { body } = await response.json();
            this.shareId = body;
            this.loading = false;
            this.shareDialog = true;
        },
        copy() {
            var copyText = document.querySelector("#link");
            copyText.select();
            document.execCommand("copy");
            this.copied = true;
        },
        getEncryptor(key) {
            return require('simple-encryptor')(key);
        },
        close() {
            this.shareDialog = false;
            this.clear();
        },
        clear() {
            this.shareId = '';
            this.encryptionKey = '';
        }
    },
    computed: {
        shareLink() {
            return this.shareId && this.encryptionKey ? `${window.location.origin}/?token=${this.token}`: '';
        },
        validContent() {
            return !!this.content.trim();
        },
        token() {
            if(!this.encryptionKey && !this.shareId) return '';
            const key = JSON.stringify({shareId: this.shareId, encryptionKey: this.encryptionKey});
            return window.btoa(key);
        },
        shareConfig() {
            return {
                method: 'POST',
                body: JSON.stringify({data: this.encryptedData}),
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            }
        },
    },
    data: () => ({
        content: '',
        encryptionKey: '',
        encryptedData: '',
        shareId: '',
        loading: false,
        shareDialog: false,
        encryptor: null,
        copied: false,
    }),
    }
</script>