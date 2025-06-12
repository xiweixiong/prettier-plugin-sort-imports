run_spec(__dirname, ["vue"], {
  importOrder: ["^vue(.*)", "dayjs(.*)", "@ant-design/icons-vue", "ant-design-vue(.*)", "<THIRD_PARTY_MODULES>", "@/(.*)", "^./", "^../", "lodash(.*)"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true
});
