<script setup lang="ts">
import { ref, watch } from "vue";
import { createGoodsSpuRequest, updateGoodsSpuRequest } from "@/api";
import { myMessage } from "@/tools/myMessage";
import MyForm from "@/components/common/MyForm.vue";
import addItemTable from "@/components/common/addItemTable.vue";

const props = withDefaults(
  defineProps<{
    currentUpdateSpu: any;
    categoryData: Array<any>;
  }>(),
  {
    currentUpdateSpu: () => {
      return {};
    },
    categoryData: () => []
  }
);

const emit = defineEmits(["cancel", "refreshData"]);

// 初始化数据 -------------------------------------------------------------------

const formList = ref<any>({
  formMessage: [
    [{ type: "textarea", formItemLabel: "商品名", label: "商品名", model: "goodsSpuName" }],

    [
      {
        type: "select",
        formItemLabel: "所属分类",
        label: "一级分类",
        model: "c1id",
        options: []
      },
      {
        type: "select",
        label: "二级分类",
        model: "c2id",
        options: []
      },
      {
        type: "select",
        label: "三级分类",
        model: "c3id",
        options: []
      }
    ],

    [
      {
        type: "upload-one",
        formItemLabel: "商品主图",
        action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
        model: "goodsSpuMainImg"
      }
    ],

    [
      {
        type: "upload-many",
        formItemLabel: "商品轮播图",
        action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
        model: "bannerImgList"
      }
    ],

    [
      {
        type: "upload-many",
        formItemLabel: "商品详情图",
        action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
        model: "detailImgList"
      }
    ]
  ],
  formData: {
    goodsSpuName: "",
    c1id: "",
    c2id: "",
    c3id: "",
    goodsSpuMainImg: "",
    bannerImgList: {
      fileList: []
    },
    detailImgList: {
      fileList: []
    }
  }
});

const salesAttrs = ref<any>([]);

// 当spu变化时 -------------------------------------------------------------
function clearSpuFormData() {
  formList.value.formData.goodsSpuName = "";
  formList.value.formData.goodsSpuMainImg = "";
  formList.value.formData.c1id = "";
  formList.value.formData.c2id = "";
  formList.value.formData.c3id = "";
  formList.value.formData.bannerImgList.fileList = [];
  formList.value.formData.detailImgList.fileList = [];
  salesAttrs.value = [];
}

function spuFormInit() {
  clearSpuFormData();

  if (JSON.stringify(props.currentUpdateSpu) === "{}") {
    formList.value.formMessage[1][0].options = props.categoryData.map((i: any) => {
      return {
        value: i._id,
        text: i.cat_name
      };
    });
  } else {
    const currentSpu = props.currentUpdateSpu;

    const banner = currentSpu.goods_img.find((i: any) => i.goods_img_type === "banner");
    const detail = currentSpu.goods_img.find((i: any) => i.goods_img_type === "detail");

    formList.value.formData.goodsSpuName = currentSpu.goods_spu_name;
    formList.value.formData.goodsSpuMainImg = currentSpu.goods_spu_main_img;

    formList.value.formMessage[1][0].options = props.categoryData.map((i: any) => {
      return {
        value: i._id,
        text: i.cat_name
      };
    });

    formList.value.formMessage[1][1].options = props.categoryData
      .find((i: any) => i._id === currentSpu.c1id)
      .children.map((i: any) => {
        return {
          value: i._id,
          text: i.cat_name
        };
      });

    formList.value.formMessage[1][2].options = props.categoryData
      .find((i: any) => i._id === currentSpu.c1id)
      .children.find((i: any) => i._id === currentSpu.c2id)
      .children.map((i: any) => {
        return {
          value: i._id,
          text: i.cat_name
        };
      });

    formList.value.formData.c1id = currentSpu.c1id;
    formList.value.formData.c2id = currentSpu.c2id;
    formList.value.formData.c3id = currentSpu.c3id;

    formList.value.formData.bannerImgList.fileList = banner.goods_img_list.map((i: any) => {
      return {
        name: i.url.match(/\/([^\/]+)$/),
        url: i.url
      };
    });

    formList.value.formData.detailImgList.fileList = detail.goods_img_list.map((i: any) => {
      return {
        name: i.url.match(/\/([^\/]+)$/),
        url: i.url
      };
    });

    salesAttrs.value = currentSpu.spu_sales_attrs;
  }
}

watch(
  () => props.currentUpdateSpu,
  () => {
    spuFormInit();
  },
  { immediate: true }
);

// 分类select变化时 -----------------------------------------------------
function selectChange(payload: { rowIndex: number; columnIndex: number }) {
  const { rowIndex, columnIndex } = payload;

  const c1id = formList.value.formData.c1id;
  const c2id = formList.value.formData.c2id;

  // 一级菜单change
  if (rowIndex === 1 && columnIndex === 0) {
    formList.value.formMessage[1][1].options = props.categoryData
      .find((i: any) => i._id === c1id)
      .children.map((i: any) => {
        return {
          value: i._id,
          text: i.cat_name
        };
      });
    formList.value.formMessage[1][2].options = [];

    formList.value.formData.c2id = "";
    formList.value.formData.c3id = "";
  }
  // 二级菜单change
  else if (rowIndex === 1 && columnIndex === 1) {
    formList.value.formMessage[1][2].options = props.categoryData
      .find((i: any) => i._id === c1id)
      .children.find((i: any) => i._id === c2id)
      .children.map((i: any) => {
        return {
          value: i._id,
          text: i.cat_name
        };
      });

    formList.value.formData.c3id = "";
  }
}

// 提交 ------------------------------------------------------
async function submit() {
  const { goodsSpuName, goodsSpuMainImg, c1id, c2id, c3id } = formList.value.formData;

  const bannerImgList = formList.value.formData.bannerImgList.fileList.map((i: any) => i.url);
  const detailImgList = formList.value.formData.detailImgList.fileList.map((i: any) => i.url);
  const spuSalesAttrs = salesAttrs.value;

  // 新增SPU
  if (JSON.stringify(props.currentUpdateSpu) === "{}") {
    try {
      const res = await createGoodsSpuRequest({
        goodsSpuName,
        goodsSpuMainImg,
        c1id,
        c2id,
        c3id,
        bannerImgList,
        detailImgList,
        spuSalesAttrs
      });
      myMessage(res.data, "success");
      emit("refreshData");
    } catch (err: any) {
      myMessage(err, "error", true);
    }
    // 修改SPU
  } else {
    try {
      const res = await updateGoodsSpuRequest({
        goodsSpuName,
        goodsSpuMainImg,
        c1id: Number(c1id),
        c2id: Number(c2id),
        c3id: Number(c3id),
        bannerImgList,
        detailImgList,
        spuSalesAttrs,
        goodsSpuId: props.currentUpdateSpu._id
      });
      myMessage(res.data, "success");
      emit("refreshData");
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  }
}
</script>

<template>
  <MyForm
    :formMessage="formList.formMessage"
    :formData="formList.formData"
    :useExtraFormItem="true"
    :extraFormItemLabel="'销售属性'"
    @selectChange="selectChange"
    @cancel="emit('cancel')"
    @reset="clearSpuFormData"
    @submit="submit"
  >
    <template #extraFormItem>
      <addItemTable :tableData="salesAttrs" />
    </template>
  </MyForm>
</template>

<style lang="less" scoped></style>
