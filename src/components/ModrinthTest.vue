<script setup lang="ts">
import { computed, onMounted, ref, provide } from 'vue';
import Project from '../api/modrinth/models/Project';
import ModrinthApi from '../api/modrinth/ModrinthApi';
import lang from '../api/modrinth/i18n/zh-CN.json';
import { useModrinthStore } from '../stores/ModrinthStore';

const store = useModrinthStore();
const api = new ModrinthApi();
provide("modrinth-api", api);

const envs = [
    {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" data-v-417c3a8a=""><rect width="20" height="14" x="2" y="3" rx="2" ry="2"></rect><path d="M8 21h8m-4-4v4"></path></svg>`,
        value: "client",
        label: "Client"
    },
    {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" data-v-417c3a8a=""><path d="M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01"></path></svg>`,
        value: "server",
        label: "Server"
    }
];
const client = envs[0];
const server = envs[1];

const checkedEnvs = ref<string[]>([]);
const allVersions = ref(false);
const keywords = ref("");
const results = ref<Project[]>([]);

const asideWidth = ref("220px");

const gameVersionOptions = computed(() => {
    return store.gameVersions.filter((opts) => {
        if (allVersions.value) return true;
        return opts.major;
    }).map((opts) => {
        return {
            value: opts.version,
            label: opts.version
        };
    });
});

onMounted(() => {
    api.getCategories().then((resp) => {
        store.categories = resp;
    });
    api.getLoaders().then((resp) => {
        store.loaders = resp;
    });
    api.getGameVersions().then((resp) => {
        store.gameVersions = resp;
    });
});

function search() {
    console.debug("点击搜索按钮");
    let trimedKeywords = keywords.value.split(",").map((keyword) => {
        return keyword.trim();
    });
    console.info("trim后的关键字如下：", trimedKeywords);

    for (let keyword of trimedKeywords) {
        if (keyword.startsWith("@") || keyword.startsWith("#")) {
            let id = keyword.substring(1);
            api.getProject(id).then((project) => {
                if (project == null) {
                    console.warn(`Modrinth上找不到id或者slug为${id}的工程`);
                    return;
                }
                console.info(`找到id为${id}的工程，信息如下：`, project);
                results.value.push(project);
            });
        }
    }
}

</script>

<template>
    <div class="modrinth-test">
        <a-row>
            <a-col :flex="asideWidth" class="aside">
                <!-- categories -->
                <a-row><span class="group-name"><b>分类</b></span></a-row>
                <a-row>
                    <a-checkbox-group v-model="store.checkedCategories">
                        <template v-for="category in store.categories">
                            <a-col>
                                <a-checkbox :value="category.name">
                                    <div class="checkbox-label">
                                        <span class="checkbox-label-icon" v-html="category.icon"></span>
                                        <span class="checkbox-label-text">{{
                                            // @ts-ignore
                                            lang.categories[category.name]
                                        }}</span>
                                    </div>
                                </a-checkbox>
                            </a-col>
                        </template>
                    </a-checkbox-group>
                </a-row>

                <!-- loaders -->
                <a-row><span class="group-name"><b>加载器</b></span></a-row>
                <a-row>
                    <a-checkbox-group v-model="store.checkedLoaders">
                        <template v-for="loader in store.loaders">
                            <a-col>
                                <a-checkbox :value="loader.name">
                                    <div class="checkbox-label">
                                        <span class="checkbox-label-icon" v-html="loader.icon"></span>
                                        <span class="checkbox-label-text">{{
                                            // @ts-ignore
                                            lang.loaders[loader.name]
                                        }}</span>
                                    </div>
                                </a-checkbox>
                            </a-col>
                        </template>
                    </a-checkbox-group>
                </a-row>

                <!-- env -->
                <a-row><span class="group-name"><b>运行环境</b></span></a-row>
                <a-row>
                    <a-checkbox-group v-model="checkedEnvs">
                        <a-checkbox :value="client.value">
                            <div class="checkbox-label">
                                <span class="checkbox-label-icon" v-html="client.icon"></span>
                                <span class="checkbox-label-text">{{ client.label }}</span>
                            </div>
                        </a-checkbox>
                        <a-checkbox :value="server.value">
                            <div class="checkbox-label">
                                <span class="checkbox-label-icon" v-html="server.icon"></span>
                                <span class="checkbox-label-text">{{ server.label }}</span>
                            </div>
                        </a-checkbox>
                    </a-checkbox-group>
                </a-row>

                <!-- game versions -->
                <a-row><span class="group-name"><b>Minecraft版本</b></span></a-row>
                <a-row><a-checkbox v-model="allVersions" disabled>显示所有版本</a-checkbox></a-row>
                <a-row class="game-version-selector">
                    <a-select 
                        v-model="store.checkedGameVersions"
                        multiple 
                        :scrollbar="false" 
                        :options="gameVersionOptions"
                    />
                </a-row>
            </a-col>
            <a-col flex="1">
                <a-row :gutter="10">
                    <a-col flex="1">
                        <a-input v-model="keywords" placeholder="请输入MOD关键字，#id / @slug / 名称"></a-input>
                    </a-col>
                    <a-col flex="100px">
                        <a-button class="buttons" @click="search">搜索</a-button>
                    </a-col>
                </a-row>

                <template v-for="result in results">
                    <a-row>
                        <a-col>
                            <modrinth-project :data="result" />
                        </a-col>
                    </a-row>
                </template>
            </a-col>
        </a-row>
    </div>
</template>

<style scoped>
.modrinth-test {
    margin: 10px;
}

.buttons {
    width: 100%;
}

.group-name {
    font-size: 1.5em;
    margin: 10px 0;
}

.checkbox-label {
    display: flex;
}

.checkbox-label-icon {
    width: 20px;
    height: 20px;
    margin-right: 3px;
}

.checkbox-label-text {
    font-size: 1.2em;
}

.game-version-selector {
    margin-top: 10px;
}
</style>
