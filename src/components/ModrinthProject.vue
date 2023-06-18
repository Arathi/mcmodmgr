<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import Project from '../api/modrinth/models/Project';
import ModrinthApi from '../api/modrinth/ModrinthApi';
import { useModrinthStore } from '../stores/ModrinthStore';

const props = defineProps<{
    data: Project;
}>();

const api: ModrinthApi = inject("modrinth-api")!;
const store = useModrinthStore();

const ownerNameOrTeamId = computed(() => {
    let teamId = props.data.team;
    if (store.ownerNames.has(teamId)) {
        return store.ownerNames.get(teamId);
    }

    api.getProjectMembers(props.data.slug).then((members) => {
        console.info("项目成员列表获取成功：", members);
        store.addTeam(teamId, members);
    });

    return teamId;
});

const backgroundColor = computed(() => {
    return props.data.color;
});

interface VersionOptions {
    label: string;
    value: string;
}

const _versions = ref<VersionOptions[]>([]);

const versions = computed(() => {
    if (_versions.value.length == 0) {
        let loaders = store.checkedLoaders.length > 0 ? store.checkedLoaders : null;
        let gameVersions = store.checkedGameVersions.length > 0 ? store.checkedGameVersions : null;

        api.getProjectVersionList(
            props.data.id,
            loaders,
            gameVersions
        ).then((resp) => {
            _versions.value = resp.map((version) => {
                return {
                    label: `${version.name}`,
                    value: version.id
                };
            });
            if (_versions.value.length > 0) {
                selectedVersion.value = _versions.value[0].value;
            }
        });

        return props.data.versionIdList.map((versionId) => {
            return {
                label: versionId,
                value: versionId
            };
        });
    }
    
    return _versions.value;
});

const selectedVersion = ref<string|null>(null);

onMounted(() => {
});

function download() {
    console.info("点击下载按钮，开始下载：");
}
</script>

<template>
    <div class="modrinth-project">
        <a-row :gutter="10">
            <a-col flex="100px">
                <div class="icon-container">
                    <a-image 
                        :src="data.iconUrl"
                        :width="96"
                        :height:="96"
                        :preview="false"
                    />
                </div>
            </a-col>
            <a-col :flex="3">
                <a-row>
                    <a-col>
                        <span class="project-name"><b>{{ data.title }}</b></span>
                        <span class="team-name">by {{ ownerNameOrTeamId }}</span>
                        <span class="project-id">#{{ data.id }}</span>
                        <span class="project-slug">@{{ data.slug }}</span>
                    </a-col>
                    <a-col>
                        <span class="description">{{ data.description }}</span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col flex="256px">
                <a-row :gutter="5">
                    <a-col :flex="1">
                        <a-select v-model="selectedVersion" :options="versions"></a-select>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col flex="64px">
                        <a-button @click="download" style="width:100%;">下载</a-button>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<style scoped>
.modrinth-project {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    margin-top: 10px;
}

.icon-container {
    background-color: v-bind(backgroundColor);
    border-radius: 10px;
}

.team-name {
    margin-right: 10px;
}

.project-name {
    font-size: 1.5em;
    margin-right: 10px;
}

.project-id {
    color: gray;
    margin-right: 10px;
}

.project-slug {
    color: gray;
    margin-right: 10px;
}

.description {
    color: #111111;
}
</style>