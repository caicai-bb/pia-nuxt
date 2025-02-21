<script setup lang='ts'>
import {
  NFlex,
} from 'naive-ui'

import { useBasicLayout } from '@/hooks/useBasicLayout'
const { isMobile } = useBasicLayout()
const router = useRouter()
function toRouter(path: string) {
  const routeUrl = router.resolve({ name: path })
  window.open(routeUrl.href, '_blank')
}
async function imgError(image: any) {
  const img = await import('@/assets/images/featured.svg')
  if (image && image.target) {
    image.target.src = img.default // 设置默认图片
    image.target.error = null // 防止无限循环
  }
  // image.target.style = 'width:35px;' // 设置默认图片
}
</script>

<template>
<div>
  <div v-if="!isMobile" class="h-ft-dv">

    <div class="h-ft-jb">
      <a href="https://x.com/piaxgpt" target="_blank">
        <div class="h-ft-tt">
          <span class="icon-span">
            <common-svgIcon icon="prime:twitter" />
          </span>
          <span class="d-tt-text">Twitter / X</span>
        </div>
      </a>
      <div class="h-ft-ph">
        <a href="https://www.producthunt.com/coming-soon?ref=header_nav" target="_blank">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=750060&theme=dark" alt="PIA - Personal&#0032;Intelligence&#0032;Assistant | Product Hunt" style="width: 250px; height: 35px;" width="250" height="35" @error="imgError">
        </a>
      </div>
      <span class="ts-pp">
        <a class="to-ts-pp" @click="toRouter('terms-of-service')">Terms of Service</a>
        <!-- and  -->
        <a class="to-ts-pp" @click="toRouter('privacy-poilcy')">Privacy Policy</a>
      </span>
      © ImageCraft L.L.C. Foundation, 2024. All rights reserved.
    </div>
  </div>
  <div v-if="isMobile" class="py-5 bg-[#000000] text-[#D7D7D7] text-xs font-bold">
    <NFlex vertical>
      <div class="pl-5 h-9 leading-9">
        <NFlex>
          <a href="https://x.com/piaxgpt" target="_blank">
            <div class="">
              <span class="inline-block mt-0 text-base align-middle">
                <common-svgIcon icon="prime:twitter" />
              </span>
              <span class="ml-2 inline-block align-middle">Twitter / X</span>
            </div>
          </a>
          <div class="">
            <a href="https://www.producthunt.com/coming-soon?ref=header_nav" target="_blank">
              <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=750060&theme=dark" alt="PIA - Personal&#0032;Intelligence&#0032;Assistant | Product Hunt" style="width: 170px; height: 35px;" width="170" height="35" @error="imgError">
            </a>
          </div>
        </NFlex>
      </div>
      <div class="pl-5 h-9">
        <a class="to-ts-pp h-full leading-9 inline-block align-middle" @click="toRouter('terms-of-service')">Terms of Service</a>
        <a class="to-ts-pp h-full leading-9 inline-block align-middle" @click="toRouter('privacy-poilcy')">Privacy Policy</a>
      </div>
      <div class="pl-5">
        © ImageCraft L.L.C. Foundation, 2024. All rights reserved.
      </div>
    </NFlex>
  </div>
</div>
</template>

<style scoped>
.h-ft-dv{
  width: 100%;
  height: 75px;
  background: #000000;
  padding-top: 20px;
  padding-bottom: 20px;
}
.h-ft{
  margin: 0 auto;
  max-width: 1365px;
  height: 35px;
  padding-left: 20px;
  color: #fff;
}
.h-ft-tt{
  width: 140px;
  height: 35px;
  padding: 5px 10px;
  line-height: 35px;
  display: inline-block;
  float: left;
  cursor: pointer;
  font-size: 25px;
  /* background: #0b0b07; */

}
.icon-span{
  display: inline-block;
}
.d-tt-text{
  display: inline-block;
  font-size: 14px;
  vertical-align: top;
  line-height: 25px;
  margin-left: 10px;

}
.h-ft-ph{
  /* width: 140px; */
  height: 35px;
  /* padding: 5px 10px; */
  line-height: 35px;
  display: inline-block;
  vertical-align: top;
  cursor: pointer;
  float: left;
  /* font-size: 25px; */
  /* background: #0b0b07; */
}
.h-ft-dd{
  width: 140px;
  height: 35px;
  padding: 5px 10px;
  line-height: 35px;
  display: inline-block;
  cursor: pointer;
  font-size: 25px;
  background: #0b0b07;
}
.h-ft-jb{
  margin: 0 auto;
  max-width: 1365px;
  padding-right: 20px;
  text-align: right;
  font-weight: bold;
  font-size: 16px;
  color: #d3d3d3;
  height: 35px;
  line-height: 35px;
}
.ts-pp{
  /* position: relative;
  width: 550px;
  margin: 0 auto;
  color: #9c9c9c;
  margin-top: 10px; */
  margin-right: 20px;
}
.to-ts-pp{
  color: #e9e7e7;
  cursor: pointer;
  margin-right: 20px;
}
.to-ts-pp:hover{
  color: #fff;
  text-decoration: underline;
}
</style>
