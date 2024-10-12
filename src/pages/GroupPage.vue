<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Character } from '@prisma/client';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'GroupPage',
});

let addDialogShow = ref(false);

const data = ref([] as Character[]);
async function getData() {
  const temp = await apis.getGroups();
  data.value = temp;
}
onMounted(async () => {
  await getData();
});
const columns = [
  {
    name: '组名',
    label: 'name',
    field: 'name',
  },
  {
    name: 'comments',
    label: '备注',
    field: 'comments',
  },
];

const $q = useQuasar();

const name = ref(null);
const comments = ref(null);
const accept = ref(false);
async function onSubmit() {
  if (!name.value || !comments.value) return;
  const success = await apis.createGroup(name.value, comments.value);
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

        <q-btn color="primary" label="新增组" @click="addDialogShow = true" />
      </template>
    </q-table>

    <q-dialog v-model="addDialogShow">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">新增组</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              filled
              v-model="name"
              label="组名"
              hint="组名"
              :rules="[(val) => (val && val.length > 0) || '不能为空']"
            />

            <q-input
              filled
              v-model="comments"
              label="备注"
              type="textarea"
              :rules="[(val) => (val && val.length > 0) || '不能为空']"
            />

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
      </q-card>
    </q-dialog>
  </div>
</template>
