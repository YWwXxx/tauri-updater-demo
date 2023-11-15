<template>
  <div>
    <a-modal v-model:open="open" title="Basic Modal" @ok="update">
      <p>检测到新版本，是否立即更新?</p>
    </a-modal>
  </div>
</template>

<script setup>
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import { Modal } from "ant-design-vue";
import { ref } from "vue";

const open = ref(true);
const update = async () => {
  try {
    const { shouldUpdate, manifest } = await checkUpdate();
    console.log(manifest);
    console.log(shouldUpdate);
    if (shouldUpdate) {
      // 显示正在更新的提示或加载页面

      // 安装更新
      await installUpdate();

      // 重新启动应用
      await relaunch();
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
