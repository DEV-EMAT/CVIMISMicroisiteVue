<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    :options.sync="options"
    :server-items-length="totalDesserts"
    :loading="loading"
  >
    <!-- <template v-slot:[`header.patient_name`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>
    <template v-slot:[`header.status`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>
    <template v-slot:[`header.actions`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template> -->

    <template v-slot:[`item.status`]="{ item }">
      <!-- <v-chip :color="getColor(item.status)" dark>
          {{ item.status == 1 ? 'Verfied' : 'Unverfied' }}
        </v-chip> -->

      <v-chip
        small
        label
        v-if="item.status == 1"
        color="green lighten-4"
        text-color="green darken-2"
        class="font-weight-medium"
        dark
      >
        <v-icon left color="green darken-2"> mdi-check-circle </v-icon>
        Verfied
      </v-chip>

      <v-chip
        small
        label
        v-else
        color="red lighten-4"
        text-color="red darken-2"
        class="font-weight-medium"
        dark
      >
        <v-icon left color="red darken-2"> mdi-close-circle </v-icon>
        Unverfied
      </v-chip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>
          <h5>Vaccination Card</h5>
          <p class="caption">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @keyup.enter="searchData"
        ></v-text-field>

        <!-- # Dialog for View Patient Information and Registration Verification # -->
        <v-dialog
          v-model="viewPatientDetailsDialog"
          scrollable
          persistent
          max-width="700px"
        >
          <v-card>
            <v-card-title class="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-avatar color="green lighten-2" size="48">
                    <v-icon color="white"> mdi-account </v-icon>
                  </v-avatar>
                  <!-- <v-icon large color="green darken-3"> mdi-account-search </v-icon> -->
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="white--text">
                    Patient Information
                  </v-list-item-title>
                  <v-list-item-subtitle class="white--text font-weight-light">
                    Registration summary details
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn icon color="white" @click="hidePatientDetails">
                    <v-icon small> mdi-close </v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-card-title>
            <v-card-text class="pt-5">
              <v-row align="start">
                <v-col cols="12" sm="4" class="d-flex justify-content-center">
                  <v-avatar size="180" tile class="rounded">
                    <v-img :src="path + patient.image"></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="12" sm="8" align-self="center">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <span class="font-weight-medium grey--text text--darken-2"
                        >Full Name:</span
                      >
                      <div class="grey--text text--darken-1">
                        {{ patient.patient_name }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <span class="font-weight-medium grey--text text--darken-2"
                        >Address:</span
                      >
                      <div class="grey--text text--darken-1">
                        {{ civil }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <span class="font-weight-medium grey--text text--darken-2"
                        >Sex:</span
                      >
                      <div class="grey--text text--darken-1">
                        {{ sex }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <span class="font-weight-medium grey--text text--darken-2"
                        >Age:</span
                      >
                      <div class="grey--text text--darken-1">
                        {{ getAge }} years old
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="4">
                  <span class="font-weight-medium grey--text text--darken-2"
                    >Email Address:</span
                  >
                  <div class="grey--text text--darken-1">
                    {{ patient.email_address }}
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <span class="font-weight-medium grey--text text--darken-2"
                    >Mobile Number:</span
                  >
                  <div class="grey--text text--darken-1">
                    {{ patient.contact_number }}
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <span class="font-weight-medium grey--text text--darken-2"
                    >PhilHealth Number:</span
                  >
                  <div class="grey--text text--darken-1">
                    {{ patient.philhealth_number }}
                  </div>
                </v-col>
                <v-col cols="12">
                  <span class="font-weight-medium grey--text text--darken-2"
                    >Address:</span
                  >
                  <div class="grey--text text--darken-1">
                    {{
                      patient.home_address +
                      ", " +
                      patient.barangay +
                      ", " +
                      patient.city +
                      ", " +
                      patient.province
                    }}
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">
                            <span
                              class="
                                v-card__text
                                pa-0
                                font-weight-medium
                                grey--text
                                text--darken-2
                              "
                            >
                              Question
                            </span>
                          </th>
                          <th class="text-left">
                            <span
                              class="
                                v-card__text
                                pa-0
                                font-weight-medium
                                grey--text
                                text--darken-2
                              "
                            >
                              Yes
                            </span>
                          </th>
                          <th class="text-left">
                            <span
                              class="
                                v-card__text
                                pa-0
                                font-weight-medium
                                grey--text
                                text--darken-2
                              "
                            >
                              No
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in answer" :key="index">
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ patientQuestions[index] }}
                            </div>
                          </td>
                          <td v-if="item == 'YES'">
                            <v-avatar color="green lighten-5" size="25">
                              <v-icon x-small color="green darken-1">
                                mdi-check-bold
                              </v-icon>
                            </v-avatar>
                          </td>
                          <td v-else>
                            <v-avatar color="red lighten-5" size="25">
                              <v-icon x-small color="red darken-1">
                                mdi-close-thick
                              </v-icon>
                            </v-avatar>
                          </td>
                          <td v-if="item == 'NO'">
                            <v-avatar color="green lighten-5" size="25">
                              <v-icon x-small color="green darken-1">
                                mdi-check-bold
                              </v-icon>
                            </v-avatar>
                          </td>
                          <td v-else>
                            <v-avatar color="red lighten-5" size="25">
                              <v-icon x-small color="red darken-1">
                                mdi-close-thick
                              </v-icon>
                            </v-avatar>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="printDialog"
          transition="dialog-bottom-transition"
          max-width="700"
        >
          <div id="print">
            <v-card
              id="printDiv"
              :style="{
                height: printDivHeight,
                width: printDivWidth,
                margin: printDivMargin,
              }"
            >
              <div id="printQrCode">
                <img
                  :src="img"
                  style="margin-bottom: 6px"
                  :style="{
                    height: qrcodeHeight,
                    width: qrcodeWidth,
                    margin: qrcodeMargin,
                  }"
                /><qrcode-vue
                  :value="value"
                  :size="size"
                  level="H"
                  id="qrCode"
                />
              </div>
              <div
                id="assessmentNumber"
                v-html="assessmentNumber"
                :style="{
                  margin: assessmentMargin,
                  fontSize: assessmentFontSize,
                }"
              ></div>
              <div
                id="printContainer"
                style="height: 200px; width: 200px"
              ></div>

              <div class="row">
                <table
                  id="printInfo"
                  v-html="printInfo"
                  :style="{
                    margin: printInfoMargin,
                    fontSize: printInfoFontSize,
                    width: printInfoWidth,
                  }"
                ></table>
              </div>
              <div class="row">
                <table
                  id="printInfoFirstDose"
                  v-html="printInfoFirstDose"
                  :style="{
                    margin: printInfoFirstDoseMargin,
                    fontSize: printInfoFirstDoseFontSize,
                  }"
                ></table>
              </div>
              <div class="row">
                <table
                  id="printInfoSecondDose"
                  v-html="printInfoSecondDose"
                  :style="{
                    margin: printInfoSecondDoseMargin,
                    fontSize: printInfoSecondDoseFontSize,
                  }"
                ></table>
              </div>
            </v-card>
          </div>
          <v-card-actions class="grey lighten-5 py-4">
            <v-spacer></v-spacer>
            <v-btn small text @click="printDialog = false"> Cancel </v-btn>
            <v-btn
              small
              text
              color="primary"
              class="white--text"
              @click="printAssessment"
            >
              Print</v-btn
            >
          </v-card-actions>
        </v-dialog>
        <v-dialog
          v-model="printDialogCert"
          transition="dialog-bottom-transition"
          max-width="700"
        >
          <div id="print">
            <v-card id="printDiv">
              <div id="printQrCode">
                <img :src="img" style="margin-bottom: 6px" /><qrcode-vue
                  :value="value"
                  :size="size"
                  level="H"
                  id="qrCode"
                />
              </div>
              <div
                id="assessmentNumber"
                v-html="assessmentNumber"
                style="font-size: 12px"
              ></div>
              <div
                id="printContainer"
                style="height: 200px; width: 200px"
              ></div>

              <div class="row">
                <table id="printInfo" v-html="printInfo"></table>
              </div>
              <div class="row">
                <table
                  id="printInfoFirstDose"
                  v-html="printInfoFirstDose"
                ></table>
              </div>
              <div class="row">
                <table
                  id="printInfoSecondDose"
                  v-html="printInfoSecondDose"
                ></table>
              </div>
            </v-card>
          </div>
          <v-card-actions class="grey lighten-5 py-4">
            <v-spacer></v-spacer>
            <v-btn small text @click="printDialogCert = false"> Cancel </v-btn>
            <!-- <v-btn
              small
              text
              color="primary"
              class="white--text"
              @click="printCert"
            >
              Print</v-btn
            > -->
          </v-card-actions>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <!-- <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
      <v-btn
        small
        depressed
        color="amber"
        dark
        class="mr-2 caption text-capitalize my-1"
        @click="showDialog(item)"
      >
        <v-icon left> mdi-printer </v-icon>
        Print Assessment
      </v-btn>
      <v-btn
        small
        depressed
        color="deep-orange"
        dark
        class="mr-2 caption text-capitalize my-1"
        @click="printCertificate(item)"
      >
        <v-icon left> mdi-printer </v-icon>
        Print Certificate
      </v-btn>
      <!-- <v-btn
        small
        depressed
        color="blue"
        dark
        class="mr-2 caption text-capitalize my-1"
        @click="printConsentForm(item)"
      >
        <v-icon left> mdi-printer </v-icon>
        Print Consent Form
      </v-btn> -->
      <v-btn
        small
        depressed
        color="green"
        dark
        class="caption text-capitalize my-1"
        @click="viewPatientDetails(item)"
      >
        <v-icon left> mdi-eye </v-icon>
        View Details
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import { GET_QUALIFIED_PATIENT, GET_CATEGORIES } from "../store/transaction";

export default {
  components: {
    QrcodeVue,
  },
  data: () => ({
    search: "",
    desserts: [],
    totalDesserts: 0,
    options: {},
    loading: true,
    viewPatientDetailsDialog: false,
    headers: [
      {
        text: "Patient Name",
        align: "start",
        value: "pre_registration.patient_name",
        width: "45%",
        // class: "red--text text-h1",
        // class: "text-subtitle-2 font-weight-bold",
      },
      { text: "Status", align: "center", value: "status" },
      {
        text: "Actions",
        align: "center",
        value: "actions",
        sortable: false,
        width: "55%",
      },
    ],
    patient: {
      image: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
      patient_name: "MANALASTAS, CAMILLE LYKA PALUYO",
      email_address: "camille@mail.com",
      contact_number: "09108987036",
      philhealth_number: "NA",
      sex: "Female",
      age: 24,
      date_of_birth: null,
      civil_status: "Single",
      home_address: null,
      barangay_name: null,
      city: null,
      province: null,
      vaccination_summary: [],
    },
    civil: null,
    sex: null,
    patientQuestions: [
      "Breast feeding/Pregnant",
      "Directly in Interaction with COVID Patient",
      "With history of COVID-19 infection",
      "With Allergy",
      "With Comorbidities",
      "Provide Electronic Informed Consent?",
    ],
    answer: [],
    path: process.env.VUE_APP_STORAGE_END_POINT,
    printDialog: false,
    printDialogCert: false,
    assessmentNumber: null,
    printQrCode: null,
    printInfo: null,
    printInfoFirstDose: null,
    printInfoSecondDose: null,
    vaccinationDate: null,
    today: null,
    birthDate: null,
    temp: null,
    value: "",
    size: 80,
    img: null,
    printDivHeight: null,
    printDivWidth: null,
    printDivWargin: null,
    assessmentMargin: null,
    assessmentFontSize: null,
    qrcodeHeight: null,
    qrcodeWidth: null,
    qrcodeMargin: null,
    printInfoMargin: null,
    printInfoFontSize: null,
    printInfoWidth: null,
    printInfoFirstDoseMargin: null,
    printInfoFirstDoseFontSize: null,
    printInfoSecondDoseMargin: null,
    printInfoSecondDoseFontSize: null,
    vaccine: null,
    vaccinator: null,
  }),

  computed: {
    getAge() {
      // birthday is a date
      if (this.patient.date_of_birth != null) {
        return Math.floor(
          (new Date() - new Date(this.patient.date_of_birth).getTime()) /
            3.15576e10
        );
      }
      return 0;
    },
  },

  watch: {
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
  },

  methods: {
    initialize() {
      this.desserts = [
        { id: 1, name: "Delores Wood", status: 1 },
        { id: 2, name: "Darren Owens", status: 1 },
        { id: 3, name: "Seth Larson", status: 0 },
        { id: 4, name: "Lewis Holland", status: 1 },
        { id: 5, name: "Nina Weaver", status: 0 },
        { id: 6, name: "Kurt Watson", status: 1 },
        { id: 7, name: "Ann Kim", status: 0 },
        { id: 8, name: "Pedro Sims", status: 1 },
        { id: 9, name: "Andy Ruiz", status: 0 },
        { id: 10, name: "Elijah Mendoza", status: 1 },
      ];
    },

    // printAssessment(item) {
    //   window.print();
    //   let route = this.$router.resolve({ name: "print-assestment" });
    //   window.open(route.href);
    //   this.printDialog = true;
    // },
    showDialog(item) {
      console.log(item);
      this.printInfoFirstDose = "";
      this.printInfoSecondDose = "";
      this.printDialog = true;
      setTimeout(
        function () {
          this.printDialog = false;
        }.bind(this),
        0
      );

      this.printDivHeight = "1020px";
      this.printDivWidth = "100%";
      this.printDivMargin = "-100px 0px 0px 16px";

      this.qrcodeHeight = "140px";
      this.qrcodeWidth = "140px";
      this.qrcodeMargin = "150px 0px 0px 700px";
      this.assessmentMargin = "-70px 0px 0px -700px";
      this.assessmentFontSize = "18px";
      this.printInfoMargin = "-170px 0px 0px -10px";
      this.printInfoFontSize = "14px";
      this.printInfoWidth = "950px";
      this.printInfoFirstDoseMargin = "-28px 0px 0px 140px";
      this.printInfoFirstDoseFontSize = "15px";
      this.printInfoSecondDoseMargin = "10px 0px 0px 140px";
      this.printInfoSecondDoseFontSize = "15px";

      this.sex = item.pre_registration.sex == "01_MALE" ? "Male" : "Female";
      // this.date_of_birth = new Date(item.pre_registration.date_of_birth);
      this.today = new Date();
      this.birthDate = new Date(item.pre_registration.date_of_birth);
      this.age = this.today.getFullYear() - this.birthDate.getFullYear();
      this.temp = this.today.getMonth() - this.birthDate.getMonth();
      if (
        this.temp < 0 ||
        (this.temp === 0 && this.today.getDate() < this.birthDate.getDate())
      ) {
        this.age--;
      }

      this.printDialog = true;
      this.assessmentNumber = item.qrcode;
      this.value = item.qrcode;
      this.printInfo =
        `<tr><td class="pdetails">Fullname:</td><td colspan="4">` +
        item.pre_registration.patient_name +
        `</td></tr>
                        <tr><td class="pdetails">Address:</td><td colspan="4">` +
        item.pre_registration.home_address +
        `</td></tr>
                        <tr><td class="pdetails">Mobile Number:</td><td>` +
        item.pre_registration.contact_number +
        `</td><td width="2px"></td>
                          <td class="pdetails">Age:</td><td>` +
        this.age +
        ` years old</td><td width="2px"></td>
                          <td class="pdetails">Sex:</td><td>` +
        this.sex +
        `</td></tr>
                        <tr><td class="pdetails">PhilHealth Number:</td><td>` +
        item.pre_registration.philhealth_number +
        `</td><td width="2px"></td>
                          <td class="pdetails">Category:</td><td>` +
        this.getCategoryName(item.pre_registration.category_id) +
        `</td><td width="2px"></td>
                          <td class="pdetails">Barangay:</td><td>` +
        item.pre_registration.barangay +
        `</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;

      if (item.vaccination_monitoring.length) {
        if (item.vaccination_monitoring[0].dosage == "1") {
          if (
            item.vaccination_monitoring[0].vaccine_manufacturer ==
            "JOHNSON AND JOHNSON"
          ) {
            this.vaccine = "J&J";
          } else {
            this.vaccine = item.vaccination_monitoring[0].vaccine_manufacturer;
          }
          if (item.vaccination_monitoring[0].last_name)
            this.vaccinator = item.vaccination_monitoring[0].last_name;
          if (item.vaccination_monitoring[0].suffix)
            if (item.vaccination_monitoring[0].suffix != "NA")
              this.vaccinator += " " + item.vaccination_monitoring[0].suffix;
          this.vaccinator += ", ";
          if (item.vaccination_monitoring[0].first_name)
            this.vaccinator += item.vaccination_monitoring[0].first_name + " ";
          if (
            item.vaccination_monitoring[0].middle_name &&
            item.vaccination_monitoring[0].middle_name != "NA"
          )
            this.vaccinator +=
              item.vaccination_monitoring[0].middle_name[0] + "";

          this.vaccinationDate = new Date(
            item.vaccination_monitoring[0].vaccination_date
          );
          this.printInfoFirstDose =
            `<tr><td style="width:150px">` +
            (this.vaccinationDate.getMonth() + 1) +
            "&emsp;&emsp;&nbsp;&nbsp;" +
            this.vaccinationDate.getDate() +
            "&emsp;&emsp;&nbsp;" +
            this.vaccinationDate.getFullYear().toString().substr(2, 2) +
            `</td><td style="width:50px"></td>
                                        <td style="width:85px">` +
            this.vaccine +
            `</td><td style="width:90px"></td>
                                        <td style="width:100px">` +
            item.vaccination_monitoring[0].batch_number +
            `</td><td style="width:85px"></td>
                                        <td style="width:100px">` +
            item.vaccination_monitoring[0].lot_number +
            `</td>
                                      </tr>
                                      <tr><td style='height:34px'><br></td></tr>
                                      <tr><td style="text-align:left" colspan="3">&nbsp` +
            this.vaccinator +
            `.</td></tr>`;
        }
        if (item.vaccination_monitoring[1]) {
          if (item.vaccination_monitoring[1].dosage == "2") {
            if (
              item.vaccination_monitoring[1].vaccine_manufacturer ==
              "JOHNSON AND JOHNSON"
            ) {
              this.vaccine = "J&J";
            } else {
              this.vaccine =
                item.vaccination_monitoring[0].vaccine_manufacturer;
            }
            if (item.vaccination_monitoring[1].last_name)
              this.vaccinator = item.vaccination_monitoring[1].last_name;
            if (item.vaccination_monitoring[1].suffix)
              if (item.vaccination_monitoring[1].suffix != "NA")
                this.vaccinator += " " + item.vaccination_monitoring[1].suffix;
            this.vaccinator += ", ";
            if (item.vaccination_monitoring[1].first_name)
              this.vaccinator +=
                item.vaccination_monitoring[1].first_name + " ";
            if (
              item.vaccination_monitoring[1].middle_name &&
              item.vaccination_monitoring[1].middle_name != "NA"
            )
              this.vaccinator +=
                item.vaccination_monitoring[1].middle_name[0] + "";
            this.vaccinationDate = new Date(
              item.vaccination_monitoring[1].vaccination_date
            );
            this.printInfoSecondDose =
              `<tr><td style="width:150px">` +
              (this.vaccinationDate.getMonth() + 1) +
              "&emsp;&emsp;&nbsp;&nbsp;" +
              this.vaccinationDate.getDate() +
              "&emsp;&emsp;&nbsp;" +
              this.vaccinationDate.getFullYear().toString().substr(2, 2) +
              `</td><td style="width:50px"></td>
                                          <td style="width:85px">` +
              this.vaccine +
              `</td><td style="width:90px"></td>
                                          <td style="width:100px">` +
              item.vaccination_monitoring[1].batch_number +
              `</td><td style="width:85px"></td>
                                          <td style="width:100px">` +
              item.vaccination_monitoring[1].lot_number +
              `</td>
                                        </tr>
                                        <tr><td style='height:34px'><br></td></tr>
                                        <tr><td style="text-align:left" colspan="3">&nbsp` +
              this.vaccinator +
              `.</td></tr>`;
          }
        }
      }

      setTimeout(
        function () {
          functionOutsideVue(this);
        }.bind(this),
        100
      );

      setTimeout(
        function () {
          this.printAssessment();
        }.bind(this),
        1000
      );
    },
    assignImage() {
      this.img = canvas.toDataURL("image/png");
    },
    async printAssessment() {
      // Pass the element id here

      await this.$htmlToPaper("print");
    },
    changeStatus() {
      this.printDialog = true;
    },
    printCertificate(item) {
      this.printInfoFirstDose = "";
      this.printInfoSecondDose = "";
      this.printDialog = true;
      setTimeout(
        function () {
          this.printDialog = false;
        }.bind(this),
        0
      );
      this.printDivHeight = "510px";
      this.printDivWidth = "50%";
      this.printDivMargin = "-60px 0px 0px 10px";
      this.qrcodeHeight = "60px";
      this.qrcodeWidth = "60px";
      this.qrcodeMargin = "90px 0px 0px 370px";
      this.assessmentMargin = "-80px 0px 0px -350px";
      this.assessmentFontSize = "10px";
      this.printInfoMargin = "-185px 0px 0px 10px";
      this.printInfoFontSize = "8px";
      this.printInfoWidth = "475px";
      this.printInfoFirstDoseMargin = "-115px 0px 0px 60px";
      this.printInfoFirstDoseFontSize = "8px";
      this.printInfoSecondDoseMargin = "-75px 0px 0px 60px";
      this.printInfoSecondDoseFontSize = "8px";

      this.sex = item.pre_registration.sex == "01_MALE" ? "Male" : "Female";
      // this.date_of_birth = new Date(item.pre_registration.date_of_birth);
      this.today = new Date();
      this.birthDate = new Date(item.pre_registration.date_of_birth);
      this.age = this.today.getFullYear() - this.birthDate.getFullYear();
      this.temp = this.today.getMonth() - this.birthDate.getMonth();
      if (
        this.temp < 0 ||
        (this.temp === 0 && this.today.getDate() < this.birthDate.getDate())
      ) {
        this.age--;
      }

      this.printDialog = true;
      this.value = item.qrcode;
      this.assessmentNumber = item.qrcode;
      this.printInfo =
        `<tr><td class="pdetailsCert">Fullname:</td><td colspan="3">` +
        item.pre_registration.patient_name +
        `</td></tr>
                        <tr><td class="pdetailsCert">Address:</td><td colspan="3">` +
        item.pre_registration.home_address +
        `</td></tr>
                        <tr><td class="pdetailsCert">Mobile Number:</td><td>` +
        item.pre_registration.contact_number +
        `</td><td width="7px"></td>
                          <td class="pdetailsCert">Age:</td><td>` +
        this.age +
        ` years old</td><td width="7px"></td>
                          <td class="pdetailsCert">Sex:</td><td>` +
        this.sex +
        `</td></tr>
                        <tr><td class="pdetailsCert">PhilHealth Number:</td><td>` +
        item.pre_registration.philhealth_number +
        `</td><td width="7px"></td>
                          <td class="pdetailsCert">Category:</td><td>` +
        this.getCategoryName(item.pre_registration.category_id) +
        `</td><td width="7px"></td>
                          <td class="pdetailsCert">Barangay:</td><td>` +
        item.pre_registration.barangay +
        `</td></tr>`;

      if (item.vaccination_monitoring.length) {
        if (item.vaccination_monitoring[0].dosage == "1") {
          if (
            item.vaccination_monitoring[0].vaccine_manufacturer ==
            "JOHNSON AND JOHNSON"
          ) {
            this.vaccine = "J&J";
          } else {
            this.vaccine = item.vaccination_monitoring[0].vaccine_manufacturer;
          }
          if (item.vaccination_monitoring[0].last_name)
            this.vaccinator = item.vaccination_monitoring[0].last_name;
          if (item.vaccination_monitoring[0].suffix)
            if (item.vaccination_monitoring[0].suffix != "NA")
              this.vaccinator += " " + item.vaccination_monitoring[0].suffix;
          this.vaccinator += ", ";
          if (item.vaccination_monitoring[0].first_name)
            this.vaccinator += item.vaccination_monitoring[0].first_name + " ";
          if (
            item.vaccination_monitoring[0].middle_name &&
            item.vaccination_monitoring[0].middle_name != "NA"
          )
            this.vaccinator +=
              item.vaccination_monitoring[0].middle_name[0] + "";

          this.vaccinationDate = new Date(
            item.vaccination_monitoring[0].vaccination_date
          );
          this.printInfoFirstDose =
            `<tr><td style="width:90px">` +
            (this.vaccinationDate.getMonth() + 1) +
            "&emsp;&nbsp;&nbsp;" +
            this.vaccinationDate.getDate() +
            "&emsp;&emsp;&nbsp;" +
            this.vaccinationDate.getFullYear().toString().substr(2, 2) +
            `</td><td style="width:10px"></td>
                                        <td style="width:60px">` +
            this.vaccine +
            `</td><td style="width:30px"></td>
                                        <td style="width:60px">` +
            item.vaccination_monitoring[0].batch_number +
            `</td><td style="width:30px"></td>
                                        <td style="width:60px">` +
            item.vaccination_monitoring[0].lot_number +
            `</td>
                                      </tr>
                                      <tr><td style='height:15px'><br></td></tr>
                                      <tr><td style="text-align:left;" colspan="4">&emsp;&emsp;&emsp;` +
            this.vaccinator +
            `.</td></tr>`;
        }
        if (item.vaccination_monitoring[1]) {
          if (item.vaccination_monitoring[1].dosage == "2") {
            if (
              item.vaccination_monitoring[1].vaccine_manufacturer ==
              "JOHNSON AND JOHNSON"
            ) {
              this.vaccine = "J&J";
            } else {
              this.vaccine =
                item.vaccination_monitoring[0].vaccine_manufacturer;
            }
            if (item.vaccination_monitoring[1].last_name)
              this.vaccinator = item.vaccination_monitoring[1].last_name;
            if (item.vaccination_monitoring[1].suffix)
              if (item.vaccination_monitoring[1].suffix != "NA")
                this.vaccinator += " " + item.vaccination_monitoring[1].suffix;
            this.vaccinator += ", ";
            if (item.vaccination_monitoring[1].first_name)
              this.vaccinator +=
                item.vaccination_monitoring[1].first_name + " ";
            if (
              item.vaccination_monitoring[1].middle_name &&
              item.vaccination_monitoring[1].middle_name != "NA"
            )
              this.vaccinator +=
                item.vaccination_monitoring[1].middle_name[0] + "";

            this.vaccinationDate = new Date(
              item.vaccination_monitoring[1].vaccination_date
            );
            this.printInfoSecondDose =
              `<tr><td style="width:90px">` +
              (this.vaccinationDate.getMonth() + 1) +
              "&emsp;&nbsp;&nbsp;" +
              this.vaccinationDate.getDate() +
              "&emsp;&emsp;&nbsp;" +
              this.vaccinationDate.getFullYear().toString().substr(2, 2) +
              `</td><td style="width:10px"></td>
                                          <td style="width:60px">` +
              this.vaccine +
              `</td><td style="width:30px"></td>
                                          <td style="width:60px">` +
              item.vaccination_monitoring[1].batch_number +
              `</td><td style="width:30px"></td>
                                          <td style="width:60px">` +
              item.vaccination_monitoring[1].lot_number +
              `</td>
                                        </tr>
                                        <tr><td style='height:15px'><br></td></tr>
                                        <tr><td style="text-align:left;" colspan="4">&emsp;&emsp;&emsp;` +
              this.vaccinator +
              `.</td></tr>`;
          }
        }
      }

      setTimeout(
        function () {
          functionOutsideVue(this);
        }.bind(this),
        100
      );

      setTimeout(
        function () {
          this.printAssessment();
          this.printDialog = false;
          this.printDialogCert = false;
        }.bind(this),
        1000
      );
      // changeWidth(function () {
      //   this.width='50px';
      // })
    },
    printConsentForm(item) {
      console.log(item);
    },

    sweetAlert() {
      this.$swal("The Internet?", "That thing is still around?", "question");
    },
    hidePatientDetails() {
      this.viewPatientDetailsDialog = false;
    },
    viewPatientDetails(pat) {
      console.log(pat);
      var patient = pat.pre_registration;

      this.answer = [];
      this.viewPatientDetailsDialog = true;
      this.patient = patient;
      this.civil = this.patient.civil_status.substr(3);
      this.sex = this.patient.sex.substr(3);
      this.answer.push(this.patient.question_1);
      this.answer.push(this.patient.question_10);
      this.answer.push(this.patient.question_6);
      this.answer.push(this.patient.question_2);
      this.answer.push(this.patient.question_4);
      this.answer.push(this.patient.question_9);
    },
    getDataFromApi() {
      this.$emit("changeValue", true);
      this.desserts = [];
      this.loading = true;
      const search_key = this.search;
      const { page, itemsPerPage } = this.options;

      this.$store
        .dispatch(GET_QUALIFIED_PATIENT, {
          items_per_page: itemsPerPage,
          page: page,
          search_key: search_key,
        })
        // go to which page after successfully login
        .then((data) => {
          let items = data.data;

          // if (itemsPerPage > 0) {
          //   items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          // }

          this.desserts = items;
          this.desserts.forEach((item) => {
            item.pre_registration.patient_name =
              item.pre_registration.first_name +
              " " +
              item.pre_registration.middle_name +
              " " +
              item.pre_registration.last_name;
          });
          this.totalDesserts = data.meta.total;
          this.loading = false;

          console.log(data.data);
          this.$emit("changeValue", false);
        });
    },
    searchData() {
      console.log(this.search);
      this.getDataFromApi();
    },
    getCategories() {
      this.$store.dispatch(GET_CATEGORIES).then((data) => {
        this.categories = data;
      });
    },
    getCategoryName(id) {
      let cat = "";
      for (var x = 0; x < this.categories.length; x++) {
        if (id == this.categories[x].id.toString()) {
          cat = this.categories[x].category_name;
        }
      }

      return cat;
    },
  },
  created() {
    // this.initialize();
    // console.log("vac card");
    this.getCategories();
  },
};

let canvas;

function functionOutsideVue(vue) {
  canvas = document.getElementsByTagName("canvas")[0];
  console.log(canvas);
  vue.assignImage();
}
</script>
<style scoped>
#printDiv {
  background-color: red;
  /* width:96%;
        height:1500px; */
  width: 68%;
  height: 1020px;
  /* margin-top:-420px; */
  /* margin-top: -290px; */
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
#printQrCode {
  margin-top: 330px;
  margin-left: 400px;
  height: 90px;
  width: 90px;
  /* margin-top: 468px;
        margin-right: -540px;
        height: 130px;
        width: 130px; */
}
#assessmentNumber {
  margin-top: -7px;
  margin-left: -375px;
  font-size: 12px;
  font-weight: bold;
}
#printInfo {
  margin-top: -190px;
  margin-left: -100px;
  text-align: left;
  font-size: 13px;
  padding: 0px;
}

#printInfoFirstDose,
#printInfoSecondDose {
  margin-left: 225px;
  text-align: left;
  font-size: 218px;
  padding: 0px;
}

#printInfoFirstDose {
  margin-top: -105px;
}

#printInfoSecondDose {
  margin-top: -62px;
}

/* Consent form */
#printConsentAstra,
#printConsentSinovac {
  background-color: red;
  width: 96%;
  height: 1400px;
  margin-top: -110px;
  margin-left: 16px;
  margin-bottom: 50px;
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

#printConsentAstraInfo,
#printConsentSinovacInfo {
  margin-top: 220px;
  margin-left: 10px;
  text-align: left;
  font-size: 13px;
  padding: 0px;
}
</style>
