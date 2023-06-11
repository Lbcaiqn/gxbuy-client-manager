<script setup lang="ts">
import { ref, watch } from "vue";
import { createGoodsSkuRequest, updateGoodsSkuRequest } from "@/api";
import { myMessage } from "@/tools/myMessage";
import MyForm from "@/components/common/MyForm.vue";

const props = withDefaults(
  defineProps<{
    currentOperateSpu: any;
    currentOperateSku?: any;
  }>(),
  {
    currentOperateSpu: () => {
      return {};
    },
    currentOperateSku: () => {
      return {};
    }
  }
);

const emit = defineEmits(["cancel", "refreshData"]);

const formList = ref<any>({
  formMessage: [
    [{ type: "textarea", formItemLabel: "SKU名称", label: "SKU名称", model: "goodsSkuName" }],

    [],

    [
      {
        type: "upload-one",
        formItemLabel: "SKU图片",
        action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
        model: "goodsSkuImg"
      }
    ],
    [{ type: "number", formItemLabel: "价格", label: "价格", model: "goodsSkuPrice" }],
    [{ type: "number", formItemLabel: "库存", label: "库存", model: "goodsSkuStock" }]
  ],
  formData: {
    goodsSkuName: "",
    goodsSkuImg: "",
    goodsSkuPrice: "",
    goodsSkuStock: ""
  }
});

function clearSkuFormData() {
  formList.value.formData.goodsSkuName = "";
  formList.value.formData.goodsSkuImg = "";
  formList.value.formData.goodsSkuPrice = "";
  formList.value.formData.goodsSkuStock = "";

  formList.value.formMessage[1] = [];

  formList.value.formData = {
    goodsSkuName: "",
    goodsSkuImg: "",
    goodsSkuPrice: "",
    goodsSkuStock: ""
  };
}

function skuFormInit() {
  clearSkuFormData();

  if (JSON.stringify(props.currentOperateSpu) === "{}") return;

  const spuSalesAttrs = props.currentOperateSpu?.spu_sales_attrs;

  if (JSON.stringify(props.currentOperateSku) === "{}") {
    // 动态添加销售属性的select框
    for (const i of spuSalesAttrs) {
      formList.value.formData["salesAttrsIs" + i.name] = "";
      formList.value.formMessage[1].push({
        type: "select",
        formItemLabel: "销售属性",
        label: i.name,
        model: "salesAttrsIs" + i.name,
        options: i.values.map((i: any) => {
          return {
            value: i,
            text: i
          };
        })
      });
    }
  } else {
    formList.value.formData.goodsSkuName = props.currentOperateSku.goods_sku_name;
    formList.value.formData.goodsSkuImg = props.currentOperateSku.goods_sku_img;
    formList.value.formData.goodsSkuPrice = props.currentOperateSku.goods_sku_price;
    formList.value.formData.goodsSkuStock = props.currentOperateSku.goods_sku_stock;

    for (const i of spuSalesAttrs) {
      formList.value.formData["salesAttrsIs" + i.name] = props.currentOperateSku.sku_sales_attrs.find(
        (attr: any) => attr.name === i.name
      )?.value;
      formList.value.formMessage[1].push({
        type: "select",
        formItemLabel: "销售属性",
        label: i.name,
        model: "salesAttrsIs" + i.name,
        options: i.values.map((i: any) => {
          return {
            value: i,
            text: i
          };
        })
      });
    }
  }
}

watch(
  () => props.currentOperateSpu,
  () => {
    skuFormInit();
  },
  { immediate: true }
);

watch(
  () => props.currentOperateSku,
  () => {
    skuFormInit();
  },
  { immediate: true }
);

async function submit() {
  const { goodsSkuName, goodsSkuImg, goodsSkuPrice, goodsSkuStock } = formList.value.formData;
  const skuSalesAttrs: Array<{ name: string; value: string }> = [];

  for (const i of formList.value.formMessage[1]) {
    if (!formList.value.formData[i.model]) {
      myMessage("还有未选择的销售属性", "error");
      return;
    }
    skuSalesAttrs.push({ name: i.label, value: formList.value.formData[i.model] });
  }

  if (JSON.stringify(props.currentOperateSku) === "{}") {
    try {
      const res = await createGoodsSkuRequest({
        goodsSkuName,
        goodsSkuImg,
        goodsSkuPrice,
        goodsSkuStock: Number(goodsSkuStock),
        skuSalesAttrs,
        goodsSpuId: props.currentOperateSpu._id
      });
      myMessage(res.data, "success");
      emit("refreshData");
    } catch (err: any) {
      myMessage(err, "error", true);
    }
  } else {
    try {
      const res = await updateGoodsSkuRequest({
        goodsSkuName,
        goodsSkuImg,
        goodsSkuPrice,
        goodsSkuStock: Number(goodsSkuStock),
        skuSalesAttrs,
        goodsSpuId: props.currentOperateSpu._id,
        goodsSkuId: props.currentOperateSku._id
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
    @cancel="emit('cancel')"
    @reset="clearSkuFormData"
    @submit="submit"
  ></MyForm>
</template>

<style lang="less" scoped></style>
