<script setup>
import Layout from "../../layouts/index.vue";
import Description from "../../components/PortfolioDetails/description.vue";
import TypePage from "../../components/PortfolioDetails/TypePage.vue";
import Demo from "../../components/PortfolioDetails/Demo.vue";
import UsedTech from "../../components/PortfolioDetails/UsedTech.vue";
import axios from 'redaxios';
</script>
<script>
export default {
    data(){
        return {
            id: this.$route.params.id,
            project: null,
            showImg: true,
            image: ''
        }
    },
    mounted() {
        this.getProj(this.hardDecrypt(this.id));
    },
    methods: {
        hardDecrypt(str) {
            let info = atob(atob(str))
            
            let characters = [
                ['a', 'yiOYZErZcq'],
                ['b', 'SUicyqdNif'],
                ['c', '3CWlCzoFfO'],
                ['d', 'hhn1i'],
                ['e', 'eNC'],
                ['f', 'SJCQO2jQN'],
                ['g', 'UzGR6'],
                ['h', 'tKFl178GT'],
                ['i', 'HShtT'],
                ['j', 'EIkTtHK9'],
                ['k', 'a2hjG'],
                ['l', 'H4iQw9AdBqM'],
                ['m', '6ZFPeeCStznryVu'],
                ['n', 'JPvg6zWGD'],
                ['ñ', 'H7BbGDOAovN'],
                ['o', 'HMuDN'],
                ['p', 'LU5wr'],
                ['q', '3Ir5j'],
                ['r', '9hI'],
                ['s', '3rmXzscul2z'],
                ['t', 'Xt4LT46tKDwTx6C'],
                ['u', 'xnkhS'],
                ['v', 'v2FXmyRQBqL'],
                ['w', 'VHspuNHqwFsBxiH'],
                ['x', 'NIJyfqqmu'],
                ['y', 'k198s7gT4O8Leb6'],
                ['z', 'ivwFQSqv'],
                ['A', 'h8TEN'],
                ['B', 'KkQY0cDG0'],
                ['C', 'qLzLbdq4BURbSx0'],
                ['D', 'DydlQsGAn'],
                ['E', 'MPxD0JKMqpY'],
                ['F', '8WsYo4wo'],
                ['G', 'MPzhB9ukMl4vEgu'],
                ['H', '9ktdH'],
                ['I', 'pJthXMQlM'],
                ['J', 'rloECtVnxhJSY2R'],
                ['K', 'kGk'],
                ['L', 'Trc7I'],
                ['M', 'lLuex92v'],
                ['N', 'h6G0hnYM1UV'],
                ['Ñ', 'CNgfr89En'],
                ['O', 'l2OkTQ0kRD3C2X4'],
                ['P', 'JMwQV'],
                ['Q', '42RNQpLbZhX'],
                ['R', 'IjCDdwnjO'],
                ['S', 'UjnTz'],
                ['T', 'vPZ'],
                ['U', 'dhVVU'],
                ['V', 'jxluQXUKP'],
                ['W', 'ID9ts'],
                ['X', 'Knr'],
                ['Y', '2xs1xHuYqfY'],
                ['Z', 'rTZc1o01'],
                ['0', 'LM7KJTbLKIW3qxs'],
                ['1', 'WZ3dEW1L4SlJFoD'],
                ['2', '7mrYoNFa'],
                ['3', 'TOzM'],
                ['4', 'xbxeuOHf'],
                ['5', 'Gisb'],
                ['6', 'ULJButIr'],
                ['7', '7GQ9jblN'],
                ['8', 'hgMr'],
                ['9', 'JxIsbFoQ'],
                ['-', 'kp5J'],
                [' ', 'rxm3']
            ];
            
            let newArray = [];
            
            for (let i = 0; i < characters.length; i++) {
                const element = characters[i];

                if(info.search(element[1]) >= 0) {
                    const char = info.search(element[1]);
                    let arr = [element[0],char];
                    newArray.push(arr);
                }
            }
            
            newArray.sort((a,b)=>{
                return a[1]-b[1];
            });
            
            let finalArr = [];

            for (let i = 0; i < newArray.length; i++) {
                const element = newArray[i];
                element.pop();    
            }
            
            let finalString = newArray.join('');

            finalString = finalString.replace('-belarus','')
            
            return finalString;
        },
        async getProj(id) {
            return await axios.get(new URL("../../assets/information/projects.json", import.meta.url).href)
            .then((result) => {
                console.log(result.data.data[id-1]);
                this.project = result.data.data[id-1];
                this.image = new URL(`/src/assets/img/projects/${result.data.data[id-1].thumb}`, import.meta.url);
            })
        }
    }
}
</script>

<template>
    <Layout v-if="project">
        <template #title>{{project.title}}</template>
        <template #content>
            <div class="row">
                <div class="col l6 s12">

                    <Description :info="project.info" :image="image"/>

                    <div class="row">
                        <div class="col s12">
                            <TypePage :type="project.type"/>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col s12">
                            <UsedTech :techs="project.tech"/>
                        </div>
                    </div>
                </div>

                <div class="col l6 s12">
                    
                    <Demo :image="image" :demo="project.demo" :repo="project.repo" :gallery="project.gallery"/>

                </div>
            </div>
        </template>
    </Layout>
</template>
