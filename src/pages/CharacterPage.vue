<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'CharacterPage',
});

type SelectOption = {
  label: string;
  value: string;
  description?: string;
};

let addDialogShow = ref(false);

type CharacterDataInfo =
  | Character
  | {
      groups?: string;
    };

const data = ref([] as CharacterDataInfo[]);
const options = ref([] as SelectOption[]);
async function getData() {
  const temp = await apis.getCharacters();
  data.value = temp.map((item) => {
    if (item.groups) {
      let groups = item.groups.map((item) => item.group.name).join(' / ');
      return {
        ...item,
        groups,
      };
    } else {
      return item;
    }
  });
  console.log(1, temp);
}
async function getOptionsData() {
  options.value = (await apis.getGroups()).map((item) => {
    return {
      label: item.name,
      value: item.id,
      description: item.comments,
    } as unknown as SelectOption;
  });
}
onMounted(async () => {
  await getData();
  await getOptionsData();
});

const columns = [
  // {
  //   name: 'index',
  //   label: '#',
  //   field: 'index',
  // },
  {
    name: 'name',
    label: 'name',
    field: 'name',
    // align: 'left',
    // align: 'left',
  },
  {
    name: 'comments',
    label: '备注',
    field: 'comments',
    // align: 'left',
    // align: 'left',
  },
  {
    name: '所属组',
    label: '所属组',
    field: 'groups',
  },
  {
    name: 'actions',
    label: 'actions',
    field: '',
  },
];

const $q = useQuasar();

const name = ref(null);
const comments = ref(null);
const accept = ref(false);
const groups = ref([] as SelectOption[]);

async function onSubmit() {
  if (!name.value || !comments.value) return;
  const success = await apis.createCharacter(
    name.value,
    comments.value,
    groups.value.map((item) => item.value)
  );
  if (success) {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: '新增成功！',
    });
  } else {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: '新增失败！',
    });
  }
  addDialogShow.value = false;
  await getData();
  onReset();
}

function onReset() {
  name.value = null;
  comments.value = null;
  accept.value = false;
  groups.value = [];
}
</script>

<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="data"
      :columns="columns"
      row-key="id"
      flat
      bordered
    >
      <template v-slot:top>
        <img
          style="height: 50px; width: 50px"
          src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
        />

        <q-space />

        <q-btn color="primary" label="新增人物" @click="addDialogShow = true" />
      </template>
    </q-table>

    <q-dialog v-model="addDialogShow">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">新增人物</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="name"
              label="人物名"
              hint="人物名"
              :rules="[(val) => (val && val.length > 0) || '不能为空']"
            />

            <q-input
              filled
              v-model="comments"
              label="备注"
              type="textarea"
              :rules="[(val) => (val && val.length > 0) || '不能为空']"
            />
            <q-select
              filled
              v-model="groups"
              multiple
              :options="options"
              use-chips
              stack-label
              label="Multiple selection"
            />

            <!-- 加字段 -->
            <q-toggle v-model="accept" label="主要人物" />

            <div>
              <q-btn label="Submit" type="submit" color="primary" />
              <q-btn
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>

        <!-- <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions> -->
      </q-card>
    </q-dialog>
  </div>
</template>
