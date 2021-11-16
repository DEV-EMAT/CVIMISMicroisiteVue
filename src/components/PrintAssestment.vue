<template>
  <div id="printDiv" style="margin-top: 50px;">
    <div id="printQrCode"></div>
    <div id="assessmentNumber"></div>
    <div id="printContainer" style="height: 200px; width: 200px"></div>

    <div class="row">
      <table id="printInfo" width="500px"></table>
    </div>
    <div class="row">
      <table id="printInfoFirstDose" width="500px"></table>
    </div>
    <div class="row">
      <table id="printInfoSecondDose" width="500px"></table>
    </div>
  </div>
</template>
<script>
// import "js/jquery.min.js";
// import "js/jQuery.print.js";

export default {
    created(){
        window.print();
    }
}
</script>
<style lang="scss">

#printDiv {
  background-color: red;
  /* width:96%;
        height:1500px; */
  width: 68%;
  height: 1020px;
  /* margin-top:-420px; */
  margin-top: -290px;
  margin-left: 16px;
  font-family: "Arial", Times, serif;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-position: center left !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  overflow: visible;
}
</style>