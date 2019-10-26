<template>
    <b-container id="root" class="bg-dark" fluid @click="clearState">
        <b-row align-h="center" align-v="center" class="vh-100">
            <b-col cols="6">
                <h1 class="text-light text-center mb-4">CIDR Checker</h1>
                <b-list-group v-if="ips.length" class="mb-4">
                    <b-list-group-item v-for="(ip, i) in ips" :variant="matches(i)"
                                       class="d-flex justify-content-between align-items-center">
                        {{ ip.base }}/{{ ip.bitmask }}
                        <b-button variant="link" class="close" aria-label="Close" @click="remove(i)">&times;</b-button>
                    </b-list-group-item>
                </b-list-group>
                <b-form @submit.prevent="doSearch" autocomplete="off">
                    <b-form-group class="mb-4">
                        <b-form-input type="text" v-model="newIp" class="text-light" :class="{[`bg-${bg}`]: true}"
                                      :state="state" @input="clearState" @blur="clearState"
                                      @keydown.tab.prevent="toggleTest"
                                      @keydown.shift.delete.prevent="reset"></b-form-input>
                    </b-form-group>
                    <b-form-group v-if="!testing" class="text-right">
                        <b-button-group>
                            <b-button variant="danger" @click="reset">
                                Reset
                            </b-button>
                            <b-button variant="primary" @click="toggleTest">
                                Test IPs
                            </b-button>
                            <b-button variant="success" type="submit">
                                Add Address
                            </b-button>
                        </b-button-group>
                    </b-form-group>
                    <b-form-group v-else class="text-right">
                        <b-button-group>
                            <b-button variant="danger" @click="reset">
                                Reset
                            </b-button>
                            <b-button variant="primary" @click="toggleTest">
                                Add Addresses
                            </b-button>
                            <b-button variant="success" type="submit">
                                Test IP
                            </b-button>
                        </b-button-group>
                    </b-form-group>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {Netmask} from 'netmask';

    export default {
        data() {
            return {
                testing: false,
                newIp: null,
                state: null,
                matched: null,
                ips: [],
            }
        },
        methods: {
            remove(i) {
                this.ips[i] = null;
                this.ips = this.ips.filter(Boolean);
            },
            reset() {
                this.ips = [];
            },
            clearState() {
                this.matched = null;
                this.state = null;
            },
            toggleTest() {
                this.state = null;
                this.testing = !this.testing;
            },
            doSearch(...a) {
                return this.testing ? this.test(...a) : this.addIp(...a);
            },
            addIp() {
                try {
                    this.ips.push(new Netmask(this.newIp));
                    this.newIp = null;
                    this.state = true;
                } catch (e) {
                    this.state = false;
                }
            },
            test() {
                try {
                    for(let index in this.ips) {
                        if(this.ips[index].contains(this.newIp)){
                            this.state = true;
                            this.matched = parseInt(index);
                            break;
                        }
                    }
                    if(!this.state) {
                        this.state = false;
                    }
                    this.newIp = null;
                } catch (e) {
                    this.state = false;
                }
            },
            matches(i) {
                return this.matched === i ? 'success' : 'dark'
            }
        },
        computed: {
            bg() {
                if (this.testing && this.state !== null) {
                    return this.state ? 'success' : 'danger'
                } else {
                    return 'dark';
                }
            }
        }
    }
</script>