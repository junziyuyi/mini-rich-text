import { defineComponent, ref } from '@vue-mini/core';

defineComponent(() => {
  const greeting = ref('欢迎使用 Vue Mini');

  const goArticel = () => {
    wx.navigateTo({ url: '/modules/article/pages/index/index' });
  };

  return {
    greeting,
    goArticel,
  };
});
