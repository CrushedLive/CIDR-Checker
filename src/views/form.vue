<template>
    <b-container id="root" :class="[`bg-${bg}`]" fluid @click="clearState">
        <bc-cidr-octocat :colour-class="`text-${bg}`"/>

        <b-row align-h="center" align-v="center" class="vh-100">
            <b-col cols="12" sm="9" md="6" xl="4" class="text-light">
                <h1 class="text-center mb-2">CIDR Checker</h1>
                <h5 class="text-center mb-4">Check if an address matches a range</h5>
                <b-list-group v-if="ips.length" class="mb-1">
                    <b-list-group-item v-for="(ip, i) in ips" :variant="matches(i)" :key="i"
                                       class="d-flex justify-content-between align-items-center">
                        {{ ip.toString() }}
                        <b-button variant="link" class="close" aria-label="Close" @click="remove(i)">&times;</b-button>
                    </b-list-group-item>
                </b-list-group>
                <b-form-group v-if="ips.length" class="text-right mb-1">
                    <b-button variant="link" @click="reset">
                        Clear All
                    </b-button>
                </b-form-group>

                <b-form @submit.prevent="doSearch" autocomplete="off">
                    <b-form-group class="mb-4" :label="checking ? 'Check Address' : 'Add Range'">
                        <b-form-input type="text" v-model="newIp" class="text-light bg-dark"
                                      :state="state" @input="clearState" @blur="clearState"
                                      @keydown.tab.prevent="toggleCheck"
                                      @keydown.esc.prevent="newIp = null"
                                      @keydown.shift.delete.prevent="removeLast"
                                      @keydown.alt.delete.prevent="reset"></b-form-input>
                    </b-form-group>
                    <b-form-group class="text-right">
                        <template v-if="!checking">
                            <b-button variant="secondary" @click="toggleCheck" class="mr-1">
                                Check IPs
                            </b-button>
                            <b-button variant="primary" type="submit" class="ml-1">
                                Add Address
                            </b-button>
                        </template>
                        <template v-else>
                            <b-button variant="secondary" @click="toggleCheck" class="mr-1">
                                Add Addresses
                            </b-button>
                            <b-button variant="primary" type="submit" class="ml-1">
                                Check IP
                            </b-button>
                        </template>
                    </b-form-group>
                </b-form>
                <p>
                    <small>
                        Shortcuts:<br/>
                        TAB - Switch between range entry and address test mode<br/>
                        ESC - Clear input<br/>
                        SHIFT + BACKSPACE - Remove last input and place in input<br/>
                        ALT + BACKSPACE - Clear all ranges<br/>
                        Re-enter a range to delete it
                    </small>
                </p>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import {Netmask} from 'netmask';

    export default {
        data() {
            return {
                checking: false,
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
                this.matched = null;
                this.state = null;
            },
            removeLast() {
                this.newIp = this.ips.pop().toString();
            },
            clearState() {
                this.matched = null;
                this.state = null;
            },
            toggleCheck() {
                this.clearState();
                this.checking = !this.checking;
            },
            doSearch(...a) {
                return this.checking ? this.test(...a) : this.addIp(...a);
            },
            addIp() {
                try {
                    let newIp = new Netmask(this.newIp);
                    if (this.ips.find((i) => i.toString() === newIp.toString())) {
                        this.ips = this.ips.filter((i) => i.toString() !== newIp.toString());
                    } else {
                        this.ips.push(newIp);
                        this.state = true;
                        this.newIp = null;
                    }
                } catch (e) {
                    console.error(e);
                    this.state = false;
                }
            },
            test() {
                try {
                    for (let index in this.ips) {
                        if (this.ips[index].contains(this.newIp)) {
                            this.state = true;
                            this.matched = parseInt(index);
                            break;
                        }
                    }
                    if (!this.state) {
                        this.state = false;
                    }
                    this.newIp = null;
                } catch (e) {
                    this.state = false;
                }
            },
            matches(i) {
                return this.matched === i ? 'success' : 'dark';
            }
        },
        computed: {
            bg() {
                if (this.checking && this.state !== null) {
                    return this.state ? 'success' : 'danger';
                } else {
                    return 'dark';
                }
            }
        }
    }
</script>