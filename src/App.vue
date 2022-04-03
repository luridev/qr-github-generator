<template>
  <el-space wrap direction="horizontal" alignment="baseline" spacer=" ">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Settings</span>
        </div>
      </template>
      <el-form label-width="auto" label="right">
        <el-form-item label="Data for QR">
          <el-tooltip
            effect="dark"
            content="You GitHub name or link to profile/repository"
            placement="top-start"
          >
            <el-input v-model="message" clearable />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Colors">
          <el-color-picker v-model="color"></el-color-picker>
          <el-divider direction="vertical" />
          <el-color-picker v-model="backgroundColor" />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="inverseLogoColor"
            label="Inverse logo colors"
            size="large"
            border
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="padding"
            label="Add padding"
            size="large"
            border
          />
        </el-form-item>

        <el-form-item label="Export size (px)">
          <el-input-number
            v-model="exportSize"
            :step="50"
            :min="100"
            :max="10000"
          />
        </el-form-item>
        <el-form-item label="Save as">
          <el-radio-group v-model="exportType" size="small">
            <el-radio-button label="SVG" />
            <el-radio-button label="PNG" />
            <el-radio-button label="JPG" />
            <el-radio-button label="WEBP" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="saveToFile"
            >Save<el-icon class="el-icon--right"><Download /></el-icon
          ></el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      class="box-card"
      body-style="
        background: repeating-linear-gradient(
          -45deg,
          #eee,
          #eee 10px,
          #ccc 10px,
          #ccc 20px
        );
      "
    >
      <template #header>
        <div class="card-header">
          <span>Preview</span>
        </div>
      </template>
      <div v-loading="loading">
        <svg :width="size" :height="size" id="svgcontainer" ref="svgcontainer">
          <svg
            :width="size"
            :height="size"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <svg v-html="preview"></svg>
            <circle
              :fill="logoBackgroundColor"
              stroke-width="6px"
              :stroke="logoColor"
              :cx="size / 2"
              :cy="size / 2"
              :r="(size * logoScale) / 2 + 8"
            />
            <svg
              :x="size / 2 - (size * logoScale) / 2"
              :y="size / 2 - (size * logoScale) / 2"
              :width="size * logoScale"
              :height="size * logoScale"
              viewBox="0 0 24 24"
              :fill="logoColor"
            >
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </svg>
        </svg>
      </div>
    </el-card>
  </el-space>
</template>

<script>
import {
  ElForm,
  ElFormItem,
  ElDivider,
  ElCard,
  ElSpace,
  ElInput,
  ElInputNumber,
  ElColorPicker,
  ElCheckbox,
  ElRadioGroup,
  ElRadioButton,
  ElButton,
  ElIcon,
  ElTooltip,
  ElLoading,
} from "element-plus";

import { Download } from "@element-plus/icons-vue";
import { saveAs } from "file-saver";
import QRCode from "qrcode-svg";

export default {
  name: "App",
  components: {
    ElForm,
    ElFormItem,
    ElDivider,
    ElCard,
    ElSpace,
    ElInput,
    ElInputNumber,
    ElColorPicker,
    ElCheckbox,
    ElRadioGroup,
    ElRadioButton,
    ElButton,
    ElIcon,
    Download,
    ElTooltip,
  },
  directives: {
    loading: ElLoading.directive,
  },
  data() {
    return {
      message: "luridev",
      logoScale: 0.33,
      size: 350,
      color: "#000",
      backgroundColor: "#fff",
      padding: false,
      inverseLogoColor: false,
      exportType: "PNG",
      exportSize: 1200,
      loading: false,
      githubURL: "https://github.com",
    };
  },
  methods: {
    export() {
      const exportType = this.exportType;
      const fileName = this.fileName;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const imgSize = this.size;
      const tempImg = new Image();

      tempImg.onload = function () {
        tempImg.width = imgSize;
        tempImg.height = imgSize;
        canvas.width = imgSize;
        canvas.height = imgSize;
        ctx.drawImage(tempImg, 0, 0, tempImg.width, tempImg.height);

        switch (exportType) {
          case "PNG":
            canvas.toBlob(
              function (blob) {
                saveAs(blob, `${fileName}.png`);
              },
              "image/png",
              1
            );
            break;

          case "JPG":
            canvas.toBlob(
              function (blob) {
                saveAs(blob, `${fileName}.jpg`);
              },
              "image/jpeg",
              1
            );
            break;
          case "WEBP":
            canvas.toBlob(
              function (blob) {
                saveAs(blob, `${fileName}.webp`);
              },
              "image/webp",
              1
            );
            break;
        }
      };

      tempImg.src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(this.$refs.svgcontainer.innerHTML);
    },
    saveToFile() {
      this.loading = true;
      [this.size, this.exportSize] = [this.exportSize, this.size];

      if (this.exportType === "SVG") {
        var blob = new Blob([this.$refs.svgcontainer.innerHTML], {
          type: "image/svg+xml;charset=utf-8",
        });
        saveAs(blob, `${this.fileName}.svg`);
      } else {
        this.export();
      }

      [this.size, this.exportSize] = [this.exportSize, this.size];
      setTimeout(() => (this.loading = false), 1500);
    },
  },
  computed: {
    logoColor() {
      return this.inverseLogoColor ? this.backgroundColor : this.color;
    },
    logoBackgroundColor() {
      return this.inverseLogoColor ? this.color : this.backgroundColor;
    },
    fileName() {
      if (this.content.startsWith(this.githubURL)) {
        const startSubstring = this.githubURL.length + 1;
        const endSubstring = this.content.indexOf("/", startSubstring);
        const name = this.content.substring(
          startSubstring,
          endSubstring > 0 ? endSubstring : this.content.length
        );
        return `QR-for-${name}`;
      }
      return "OR-code";
    },
    content() {
      if (this.message.startsWith("http")) return this.message;
      if (this.message.startsWith("/"))
        return `${this.githubURL}${this.message}`;
      return `${this.githubURL}/${this.message}`;
    },
    preview() {
      var svg = new QRCode({
        content: this.content,
        padding: this.padding ? 1 : 0,
        width: this.size,
        height: this.size,
        color: this.color,
        background: this.backgroundColor,
        ecl: "Q",
        xmlDeclaration: true,
        container: "none",
        join: true,
        pretty: false,
      });
      return svg.svg();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}

.card-header {
  text-align: left;
}

.box-card {
  max-width: 480px;
  margin: 0 auto;
}

.el-space .el-space__item {
  margin: 8px auto !important;
}
</style>
