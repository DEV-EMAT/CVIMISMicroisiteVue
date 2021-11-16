<template>
  <v-data-table :headers="headers" :items="desserts" :search="search">
    <template v-slot:[`header.name`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>
    <template v-slot:[`header.status`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>
    <template v-slot:[`header.actions`]="{ header }">
      {{ header.text.toUpperCase() }}
    </template>

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
          <h5>Patient Monitoring</h5>
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
        ></v-text-field>
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Monitor Patient Dialog -->
        <v-dialog v-model="monitorPatientDialog" persistent max-width="800px">
          <v-card class="mx-auto">
            <v-card-title>
              <span class="text-h6 font-weight-medium">Patient Details</span>
            </v-card-title>

            <v-card-subtitle>
              <span class="text-subtitle-2">
                please make sure all required fields are complete.
              </span>
            </v-card-subtitle>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Patient Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select :items="suffix" label="Dosage"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="suffix"
                    label="Vaccine Manufacturer"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="editedItem.protein"
                    label="Lot Number"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="editedItem.protein"
                    label="Batch Number"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select :items="sex" label="Consent"></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="editedItem.protein"
                    label="Vaccination Date"
                    type="date"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select :items="civilStatus" label="Vacinator"></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="address"
                    label="Reason for refusal"
                    type="text"
                    auto-grow
                    rows="1"
                  >
                  </v-textarea>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="address"
                    label="Deferral"
                    type="text"
                    auto-grow
                    rows="1"
                  >
                  </v-textarea>
                </v-col>

                <v-col cols="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left col-md-10">Questions</th>
                          <th class="text-center col-md-2">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- :class="
                            [4, 6, 15, 18].includes(index) &&
                            monitorPatient.questions[3]
                              ? 'green'
                              : 'amber'
                          " -->
                        <tr
                          v-for="(question, index) in questions"
                          :key="index"
                          :class="classObject(index)"
                        >
                          <td class="col-md-10" v-if="Array.isArray(question)">
                            <v-row>
                              <v-col
                                cols="12"
                                sm="6"
                                md="6"
                                v-for="(item, i) in question"
                                :key="i"
                              >
                                <v-checkbox
                                  v-model="monitorPatient.questions[index]"
                                  :label="item"
                                  color="primary"
                                  :value="item"
                                  hide-details
                                ></v-checkbox>
                              </v-col>
                            </v-row>
                          </td>
                          <td class="col-md-10" v-else>
                            {{ question }}
                          </td>
                          <td class="col-md-2">
                            <!-- {{ Array.isArray(question) }} -->
                            <v-switch
                              v-model="monitorPatient.questions[index]"
                              :label="`${
                                monitorPatient.questions[index] ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                            <!-- <v-switch
                              v-model="monitorPatient.questions[index]"
                              :label="`${answer ? 'Yes' : 'No'}`"
                            ></v-switch> -->
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="monitorPatientDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="saveMonitorPatient">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- End Monitor Patient Dialog -->
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
        class="mr-2 caption text-capitalize"
        @click="editMonitorPatient(item)"
      >
        <v-icon left> mdi-stethoscope </v-icon>
        Monitor Patient
      </v-btn>
      <v-btn
        small
        depressed
        color="green"
        dark
        class="mr-2 caption text-capitalize"
        @click="editItem(item)"
      >
        <v-icon left> mdi-eye </v-icon>
        View Details
      </v-btn>
      <v-btn
        small
        depressed
        color="blue"
        dark
        class="caption text-capitalize"
        @click="editItem(item)"
      >
        <v-icon left> mdi-view-list-outline </v-icon>
        Vaccination Summary
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    monitorPatientDialog: false,
    headers: [
      {
        text: "Patient Name",
        align: "start",
        value: "name",
        width: "35%",
        // width: "this.$vuetify.breakpoint.mdAndUp ? 35% : 50%",
        // class: "red--text text-h1",
        // class: "text-subtitle-2 font-weight-bold",
      },
      { text: "Status", align: "center", value: "status" },
      {
        text: "Actions",
        align: "center",
        value: "actions",
        sortable: false,
        width: "50%",
        // width: this.$vuetify.breakpoint.mdAndUp ? "50%" : "35%"
      },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      status: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    defaultItem: {
      name: "",
      status: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
    },
    monitorPatient: {
      patientName: "",
      dosage: "",
      vaccineManufacturer: "",
      lotNumber: "",
      batchNumber: "",
      consent: "",
      vaccinationDate: "",
      vaccinator: "",
      reafusal: "",
      deferral: "",
      questions: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        [],
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        [],
        false,
      ],
      // q1: false,
      // q2: false,
      // q3: false,

      // q4: false,
      // q5: false,

      // q6: false,
      // q7: false,

      // q8: false,
      // q9: [],

      // q10: false,
      // q11: false,
      // q12: false,
      // q13: false,
      // q14: false,

      // q15: false,
      // q16: false,

      // q17: false,
      // q18: [],
      // q19: false,
    },
    hideQuestions: [3, 5, 14, 17],
    questions: [
      "Edad ay mas mababa sa 18 taong gulang?",
      "May alerhiya sa PEG or polysorbate?",
      "May malubhang alerhiya (severe allergin reaction) matapos ang unang dose ng bakuna?",
      // q4 -> q5
      "May alerhiya sa pagkain, itlog, gamit? May hika (asthma)?",
      "*Kung may alerhiya o hika, may problema ba sa pag-monitor sa pasyente ng 30 minuto?",
      // q6 -> q7
      "May sakit kaugnay ng pagdudugo o sa kasalukuyan ay umiinom ng anti-coagulants (pampalabnaw ng dugo)?",
      "*Kung may sakit kaugnay ng pagdudugo o kasalukuyang umiinom ng anti-coagulants (pampalabnaw ng dugo), mayroon bang problema sa pagkuha/paggamit ng gauge 23-25 na siringhilya (syring) para sa pagturok?",
      // q8 -> q9
      "Mayroon ng kahit alinman sa sumusunod na sintomas?",
      [
        "Lagnat / panginginig dahil sa lamig",
        "Pagkapagod",
        "Sakit ng ulo",
        "Panghihina",
        "Ubo",
        "Kawalan ng panlasa o pang-amoy",
        "Sipon",
        "Pagtatae",
        "Pananakit ng lalamunan",
        "Hirap sa paghinga",
        "Pananakit ng kalamnan",
        "Rashes",
      ],
      // ----
      "Kasulukuyang may SBP ≥ 180 at/o dBP ≥ 120, at may sintomas ng organ damage?",
      "May exposure sa taong confirmed o suspect na kaso ng COVID-19 nitong nakaraang dalawang linggo (14 na araw)?",
      "Dating ginamot para sa COVID-19 nitong nakaraang 90 na araw?",
      "Nakakuha ng kahit anong bakuna nitong nakaraang 14 na araw o pinaplanong kumuha ng kahit anong bakuna sa susunod na 14 na araw matapos magpabakuna?",
      "Ginamot o nakakuha ng convalescent plasma o monoclonal antibodies para sa COVID-19 nitong nakaraang 90 na araw?",
      // q15 -> q16
      "Buntis?",
      "*Kung buntis, nasa unang tatlong buwan ng pagbubuntis?",
      // q17 -> q18 & q19
      "Mayroon ng kahit alinman sa sumusunod na sakit o kundisyon?",
      [
        "Human Immunodeficiency Virus(HIV)",
        "Kanser(Cancer o Malignancy)",
        "Sumailalim sa organ transplant",
        "Kasalukuyang umiinom ng steroids",
        "Nakaratay na lang sa kama (bed-ridden), may sakit (terminal illness) na hindi tataas sa anim (6) na buwan ang taning",
        "May autoimmune disease",
      ],
      "*If with mentioned condition, has presented medical clearance prior to vaccination day?",
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    actionWidth() {
      return this.$vuetify.breakpoint.mdAndUp ? "35%" : "50%";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },
  methods: {
    classObject(index) {
      var found = false;

      // if ([4, 6, 15, 18].includes(index))
      //   found = this.monitorPatient.questions[index - 1];

      if ([3, 5, 14, 17].includes(index))
        found = this.monitorPatient.questions[index + 1];

      return {
        "green d-none": found,
      };
    },
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
    saveMonitorPatient() {
      this.$swal({
        title: "Confirm",
        text: "Are you sure you want to save this?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal(
            "Data added",
            "Data has been added successfully.",
            "success"
          );
        }
      });
    },
    editMonitorPatient(item) {
      this.monitorPatientDialog = true;
    },
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },

    getColor(status) {
      if (status == 1) return "green";
      else return "red";
    },
  },
};
</script>
