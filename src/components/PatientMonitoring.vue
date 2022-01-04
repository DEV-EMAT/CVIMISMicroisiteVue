<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    :options.sync="options"
    :server-items-length="totalDesserts"
    :loading="loading"
  >
    <!-- <template v-slot:[`header.pre_registration.first_name`]="{ header }">
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
        v-if="item.status == '1'"
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
          <p class="caption">Manage patient monitoring</p>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @keyup.enter="searchData"
          placeholder="Firstname Lastname"
          :disabled="isSearchDisabled"
        ></v-text-field>

        <!-- Monitor Patient Dialog -->
        <v-dialog
          v-model="monitorPatientDialog"
          scrollable
          persistent
          max-width="1000px"
        >
          <v-form ref="form" v-model="valid" lazy-validation>
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
                      Patient Monitoring Form
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text font-weight-light">
                      please make sure all required fields are complete.
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-btn icon color="white" @click="cancelDialog">
                      <v-icon small> mdi-close </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="8">
                      <v-text-field
                        v-model="monitorPatient.patient_name"
                        label="Patient Name"
                        disabled
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="dosages"
                        label="Dosage"
                        v-model="monitorPatient.dosage"
                        @change="changeDosage"
                        :disabled="vaccineSummaryEdit"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        :items="vaccineManufacturers"
                        label="Vaccine Manufacturer"
                        item-text="vaccine_manufacturer"
                        v-model="monitorPatient.vaccine_categories"
                        return-object
                        :rules="[
                          (v) => !!v || 'Vaccine Manufacturer is required',
                        ]"
                        :disabled="isDisabled"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-text-field
                        v-model="monitorPatient.lot_number"
                        label="Lot Number"
                        type="text"
                        :rules="[(v) => !!v || 'Lot Number is required']"
                        :disabled="isDisabled"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-text-field
                        v-model="monitorPatient.batch_number"
                        label="Batch Number"
                        type="text"
                        :rules="[(v) => !!v || 'Batch Number is required']"
                        :disabled="isDisabled"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="3">
                      <v-select
                        :items="consents"
                        label="Consent"
                        v-model="monitorPatient.consent"
                        :rules="[(v) => !!v || 'Consent is required']"
                        :disabled="isDisabled"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="monitorPatient.vaccination_date"
                        label="Vaccination Date"
                        type="date"
                        :rules="[(v) => !!v || 'Vaccination Date is required']"
                        :disabled="isDisabled"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="5">
                      <v-autocomplete
                        :items="vaccinators"
                        label="Vacinator"
                        :item-text="
                          (item) => item.first_name + ' ' + item.last_name
                        "
                        v-model="monitorPatient.vaccinators"
                        :rules="[(v) => !!v || 'Vaccinators is required']"
                        :disabled="isDisabled"
                        return-object
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-textarea
                        v-model="monitorPatient.reason_for_refusal"
                        label="Reason for refusal"
                        type="text"
                        auto-grow
                        rows="1"
                        :rules="[
                          (v) => !!v || 'Reason for Refusal is required',
                        ]"
                        :disabled="isDisabled"
                      >
                      </v-textarea>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-textarea
                        v-model="monitorPatient.deferral"
                        label="Deferral"
                        type="text"
                        auto-grow
                        rows="1"
                        :rules="[(v) => !!v || 'Deferral is required']"
                        :disabled="isDisabled"
                      >
                      </v-textarea>
                    </v-col>

                    <v-col v-if="vaccineSummaryEdit" cols="12" sm="6">
                      <v-textarea
                        v-model="reason_for_update"
                        label="Reason for update"
                        type="text"
                        auto-grow
                        rows="1"
                        :rules="[(v) => !!v || 'Reason for update is required']"
                        :disabled="isDisabled"
                      >
                      </v-textarea>
                    </v-col>

                    <v-col cols="12" v-if="!vaccineSummaryEdit">
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left col-md-10">Questions</th>
                              <th class="text-left col-md-2">Remarks</th>
                            </tr>
                          </thead>
                          <tbody
                            :style="isDisabled ? 'pointer-events : none' : ''"
                          >
                            <tr>
                              <td>
                                Q1: Edad ay mas mababa sa 18 taong gulang?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question1"
                                  :label="`${
                                    monitorPatient.question1 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion1"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>Q2: May alerhiya sa PEG or polysorbate?</td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question2"
                                  :label="`${
                                    monitorPatient.question2 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q3: May malubhang alerhiya (severe allergin
                                reaction) matapos ang unang dose ng bakuna?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question3"
                                  :label="`${
                                    monitorPatient.question3 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q4: May alerhiya sa pagkain, itlog, gamit? May
                                hika (asthma)?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question4"
                                  :label="`${
                                    monitorPatient.question4 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr v-if="monitorPatient.question4">
                              <td>
                                Q5: *Kung may alerhiya o hika, may problema ba
                                sa pag-monitor sa pasyente ng 30 minuto?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question5"
                                  :label="`${
                                    monitorPatient.question5 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q6: May sakit kaugnay ng pagdudugo o sa
                                kasalukuyan ay umiinom ng anti-coagulants
                                (pampalabnaw ng dugo)?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question6"
                                  :label="`${
                                    monitorPatient.question6 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr v-if="monitorPatient.question6">
                              <td>
                                Q7: *Kung may sakit kaugnay ng pagdudugo o
                                kasalukuyang umiinom ng anti-coagulants
                                (pampalabnaw ng dugo), mayroon bang problema sa
                                pagkuha/paggamit ng gauge 23-25 na siringhilya
                                (syring) para sa pagturok?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question7"
                                  :label="`${
                                    monitorPatient.question7 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q8: Mayroon ng kahit alinman sa sumusunod na
                                sintomas?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question8"
                                  :label="`${
                                    monitorPatient.question8 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2">
                                <v-row no-gutters>
                                  <v-col
                                    cols="12"
                                    sm="4"
                                    md="4"
                                    v-for="question8 in questionFor8"
                                    :key="question8.id"
                                  >
                                    <v-checkbox
                                      v-model="question8.isChecked"
                                      :label="question8.name"
                                      :value="question8.isChecked"
                                      :disabled="!monitorPatient.question8"
                                    ></v-checkbox>
                                  </v-col>
                                </v-row>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q10: May exposure sa taong confirmed o suspect
                                na kaso ng COVID-19 nitong nakaraang dalawang
                                linggo (14 na araw)?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question10"
                                  :label="`${
                                    monitorPatient.question10 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q11: Dating ginamot para sa COVID-19 nitong
                                nakaraang 90 na araw?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question11"
                                  :label="`${
                                    monitorPatient.question11 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q12: Nakakuha ng kahit anong bakuna nitong
                                nakaraang 14 na araw o pinaplanong kumuha ng
                                kahit anong bakuna sa susunod na 14 na araw
                                matapos magpabakuna?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question12"
                                  :label="`${
                                    monitorPatient.question12 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q13: Ginamot o nakakuha ng convalescent plasma o
                                monoclonal antibodies para sa COVID-19 nitong
                                nakaraang 90 na araw?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question13"
                                  :label="`${
                                    monitorPatient.question13 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>Q14: Buntis?</td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question14"
                                  :label="`${
                                    monitorPatient.question14 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr v-if="monitorPatient.question14">
                              <td>
                                Q15: *Kung buntis, nasa unang tatlong buwan ng
                                pagbubuntis?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question15"
                                  :label="`${
                                    monitorPatient.question15 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q16: Mayroon ng kahit alinman sa sumusunod na
                                sakit o kundisyon?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question16"
                                  :label="`${
                                    monitorPatient.question16 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2">
                                <v-row no-gutters>
                                  <v-col
                                    cols="12"
                                    sm="4"
                                    md="4"
                                    v-for="question17 in questionFor17"
                                    :key="question17.id"
                                  >
                                    <v-checkbox
                                      v-model="question17.isChecked"
                                      :label="question17.name"
                                      :value="question17.isChecked"
                                      :disabled="!monitorPatient.question16"
                                    ></v-checkbox>
                                  </v-col>
                                </v-row>
                              </td>
                            </tr>
                            <tr v-if="monitorPatient.question16">
                              <td>
                                Q18: *If with mentioned condition, has presented
                                medical clearance prior to vaccination day?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question18"
                                  :label="`${
                                    monitorPatient.question18 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                  @change="validateQuestion"
                                ></v-switch>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Q19: Kasulukuyang may SBP ≥ 180 at/o dBP ≥ 120,
                                at may sintomas ng organ damage?
                              </td>
                              <td>
                                <v-switch
                                  v-model="monitorPatient.question19"
                                  :label="`${
                                    monitorPatient.question19 ? 'Yes' : 'No'
                                  }`"
                                  color="green"
                                  hide-details
                                ></v-switch>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions class="grey lighten-5 py-4">
                <v-spacer></v-spacer>
                <v-btn small text @click="cancelDialog"> Cancel </v-btn>
                <v-btn
                  v-if="!vaccineSummaryEdit"
                  small
                  text
                  color="primary"
                  class="white--text"
                  @click="saveMonitorPatient"
                  :disabled="isDisabled"
                >
                  Submit
                </v-btn>
                <v-btn
                  v-else
                  small
                  text
                  color="primary"
                  class="white--text"
                  @click="saveEditSummary"
                  :disabled="isDisabled"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <!-- View Patient Information Dialog # -->
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
                        >Civil Status:</span
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

        <!-- View Patient Vaccination Summary Dialog # -->
        <v-dialog
          v-model="vaccinationSummaryDialog"
          scrollable
          persistent
          max-width="1300px"
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
                    Vaccination summary details
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn
                    icon
                    color="white"
                    @click="hideVaccinationSummaryDialog"
                  >
                    <v-icon small> mdi-close </v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-card-title>
            <v-card-text class="pt-5">
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
                              Dosage
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
                              Vaccination Date
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
                              Vaccine Manufacturer
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
                              Batch Number
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
                              Lot Number
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
                              Vaccinator Name
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
                              Encoded By
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
                              Consent
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
                              Reason for Refusal
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
                              Deferral
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
                              Action
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            vac_summary, index
                          ) in patient.vaccination_summary"
                          :key="index"
                        >
                          <td>
                            <div class="grey--text text--darken-1">
                              {{
                                vac_summary.dosage == "1"
                                  ? " 1st Dose"
                                  : vac_summary.dosage == "2"
                                  ? "2nd Dose"
                                  : "3rd Dose(Booster)"
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.vaccination_date }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.vaccine_manufacturer }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.batch_number }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.lot_number }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{
                                vac_summary.first_name +
                                " " +
                                vac_summary.middle_name +
                                " " +
                                vac_summary.last_name
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.encoded_by }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{ vac_summary.consent }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{
                                vac_summary.reason_for_refusal != ""
                                  ? vac_summary.reason_for_refusal
                                  : "NA"
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              {{
                                vac_summary.deferral != ""
                                  ? vac_summary.deferral
                                  : "NA"
                              }}
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              <v-btn
                                small
                                dark
                                class="my-1"
                                color="teal"
                                @click="editPatientDetails(vac_summary)"
                              >
                                <v-icon left> mdi-pencil </v-icon> Update
                              </v-btn>
                              <!-- <v-btn
                                small
                                dark
                                class="my-1"
                                color="grey"
                                @click="voidPatientDetails(vac_summary)"
                              >
                                <v-icon left> mdi-delete </v-icon> Void
                              </v-btn> -->
                            </div>
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

        <!-- View Vas Line Information -->
        <v-dialog
          v-model="vasLineDialog"
          scrollable
          persistent
          max-width="1800px"
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
                    VAS Line Information
                  </v-list-item-title>
                  <v-list-item-subtitle class="white--text font-weight-light">
                    Vaccination summary details
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn icon color="white" @click="vasLineDialog = false">
                    <v-icon small> mdi-close </v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-card-title>
            <v-card-text class="pt-5" ref="container">
              <input type="hidden" id="testing-code" :value="vasLineCopy" />
              <v-row>
                <v-col cols="12">
                  <v-btn dark color="blue" @click="copy">
                    {{ isCopyCode ? "Copied" : "Copy" }}
                    <v-icon small right> mdi-content-copy </v-icon>
                  </v-btn>
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
                              Category
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
                              Unique Person ID
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
                              PWD
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
                              Indigenous Member
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
                              Last Name
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
                              First Name
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
                              Middle Name
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
                              Suffix
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
                              Contact No.
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
                              Region
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
                              Province
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
                              Municipal / City
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
                              Barangay
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
                              Sex
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
                              Birthdate
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
                              Deferral
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
                              Reason for Deferral
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
                              Vaccination Date
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
                              Vaccine Manafucturer Name
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
                              Batch Number
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
                              Lot No.
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
                              Bakuna Center CBCR ID
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
                              Vaccinator Name
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
                              1st Dose
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
                              2nd Dose
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
                              Adverse Event
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
                              Adverse Event Condition
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody v-for="(vasline, i) in vasLine" :key="i">
                        <tr>
                          <td v-for="(vas, index) in vasline" :key="index">
                            <div class="grey--text text--darken-1">
                              {{ vas }}
                            </div>
                          </td>
                          <!-- <td>
                            <div class="grey--text text--darken-1">
                              UNIQUE_PERSON_ID
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">PWD</div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              Indigenous Member
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              LAST_NAME
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              FIRST_NAME
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              MIDDLE_NAME
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">SUFFIX</div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              CONTACT_NO
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">REGION</div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              PROVINCE
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              MUNI_CITY
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              BARANGAY
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">SEX</div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              BIRTHDATE
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              DEFERRAL
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              REASON_FOR_DEFERRAL
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              VACCINATION_DATE
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              VACCINE_MANUFACTURER_NAME
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              BATCH_NUMBER
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">LOT_NO</div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              BAKUNA_CENTER_CBCR_ID
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              VACCINATOR_NAME
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              1ST_DOSE
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              2ND_DOSE
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              Adverse Event
                            </div>
                          </td>
                          <td>
                            <div class="grey--text text--darken-1">
                              Adverse Event Condition
                            </div>
                          </td> -->
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
        @click="viewPatientDetails(item)"
      >
        <v-icon left> mdi-eye </v-icon>
        View Details
      </v-btn>
      <v-btn
        small
        depressed
        color="blue"
        dark
        class="mr-2 caption text-capitalize"
        @click="viewVaccinationSummaryDialog(item)"
      >
        <v-icon left> mdi-view-list-outline </v-icon>
        Vaccination Summary
      </v-btn>
      <v-btn
        small
        depressed
        color="teal"
        dark
        class="caption text-capitalize"
        @click="viewVasLineDialog(item)"
      >
        <v-icon left> mdi-view-list-outline </v-icon>
        Vas Line Info
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import {
  GET_QUALIFIED_PATIENT,
  GET_VACCINATORS,
  GET_VACCINE_CATEGORIES,
  MONITOR_PATIENT,
  VERIFY_PASSWORD,
  UPDATE_SUMMARY,
  VOID_RECORD,
  GET_VASLINE_INFO,
} from "../store/transaction";
export default {
  data: () => ({
    e1: 1,
    message: `A4\tVQSQ0000002921794270\tN\tNO\tAALA\tBERNADETTE\tFLORES\tNA\t09156621977\tREGION IV-A (CALABARZON)\t043400000Laguna\t043404000City of Cabuyao\tBANAYBANAY\tM\t10/26/1986\tN\tNONE\t08/17/2021\tSinovac\tH202107052\tNA\tCBC07625\tLINSAO, MELENOR\tY\tN\tN\tNONE\r\n
      A4\tVQSQ0000002921794270\tN\tNO\tAALA\tBERNADETTE\tFLORES\tNA\t09156621977\tREGION IV-A (CALABARZON)\t043400000Laguna\t043404000City of Cabuyao\tBANAYBANAY\tM\t10/26/1986\tN\tNONE\t09/14/2021\tSinovac\tJ202108094\tJ202108094\tCBC07625\tBOLIBOL, RENZ MARION\tY\tY\tN\tNONE`,
    search: "",
    monitorPatientDialog: false,
    viewPatientDetailsDialog: false,
    vaccinationSummaryDialog: false,
    editPatientDetailsDialog: false,
    vasLineDialog: false,
    headers: [
      {
        text: "Patient Name",
        align: "start",
        value: "pre_registration.patient_name",
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
    totalDesserts: 0,
    options: {},
    loading: true,
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
    dosages: ["1st", "2nd", "3rd(Booster)"],
    vaccineManufacturers: [
      "ASTRAZENECA",
      "MODERNA",
      "PFIZER",
      "SINOVAC",
      "JOHNSON AND JOHNSON",
    ],
    vaccinators: [
      "Delores Wood",
      "Darren Owens",
      "Seth Larson",
      "Lewis Holland",
      "Nina Weaver",
      "Kurt Watson",
      "Ann Kim",
      "Pedro Sims",
      "Andy Ruiz",
      "Elijah Mendoza",
    ],
    consents: ["YES", "NO"],
    monitorPatient: {
      qualified_patient_id: null,
      patient_name: "",
      dosage: "",
      dose: "",
      vaccine_manufacturer: "",
      vaccine_categories: null,
      lot_number: "",
      batch_number: "",
      consent: "",
      vaccination_date: "",
      vaccinator: "",
      vaccinators: null,
      reason_for_refusal: "",
      deferral: "",
      question1: false,
      question2: false,
      question3: false,
      question4: false,
      question5: false,
      question6: false,
      question7: false,
      question8: false,
      question8Arr: [],
      question9: [],
      question10: false,
      question11: false,
      question12: false,
      question13: false,
      question14: false,
      question15: false,
      question16: false,
      question17: false,
      question18: [],
      question17Arr: [],
      question19: false,
      question_1: false,
      question_2: false,
      question_3: false,
      question_4: false,
      question_5: false,
      question_6: false,
      question_7: false,
      question_8: false,
      question_10: false,
      question_11: false,
      question_12: false,
      question_13: false,
      question_14: false,
      question_15: false,
      question_16: false,
      question_18: false,
      question_19: false,
    },
    hidepatient: [3, 5, 14, 17],
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
    questionFor8: [
      {
        id: 1,
        name: "Lagnat / panginginig dahil sa lamig",
        isChecked: false,
      },
      {
        id: 2,
        name: "Pagkapagod",
        isChecked: false,
      },
      {
        id: 3,
        name: "Sakit ng ulo",
        isChecked: false,
      },
      {
        id: 4,
        name: "Panghihina",
        isChecked: false,
      },
      {
        id: 5,
        name: "Ubo",
        isChecked: false,
      },
      {
        id: 6,
        name: "Kawalan ng panlasa o pang-amoy",
        isChecked: false,
      },
      {
        id: 7,
        name: "Sipon",
        isChecked: false,
      },
      {
        id: 8,
        name: "Pagtatae",
        isChecked: false,
      },
      {
        id: 9,
        name: "Pananakit ng lalamunan",
        isChecked: false,
      },
      {
        id: 10,
        name: "Hirap sa paghinga",
        isChecked: false,
      },
      {
        id: 11,
        name: "Pananakit ng kalamnan",
        isChecked: false,
      },
      {
        id: 12,
        name: "Rashes",
        isChecked: false,
      },
    ],
    questionFor17: [
      {
        id: 1,
        name: "Human Immunodeficiency Virus(HIV)",
        isChecked: false,
      },
      {
        id: 2,
        name: "Kanser(Cancer o Malignancy)",
        isChecked: false,
      },
      {
        id: 3,
        name: "Sumailalim sa organ transplant",
        isChecked: false,
      },
      {
        id: 4,
        name: "Kasalukuyang umiinom ng steroids",
        isChecked: false,
      },
      {
        id: 5,
        name: "Nakaratay na lang sa kama (bed-ridden), may sakit (terminal illness) na hindi tataas sa anim (6) na buwan ang taning",
        isChecked: false,
      },
      {
        id: 6,
        name: "May autoimmune disease",
        isChecked: false,
      },
    ],
    question8Arr: [],
    question17Arr: [],
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
      // address: "B169 L57 PHASE 2 MABUHAY CITY, MAMATID, CABUYAO, LAGUNA",
      // other: [0, 0, 1, 0, 0, 1],
      // questions: [
      //   "Breast feeding/Pregnant",
      //   "Directly in Interaction with COVID Patient",
      //   "With history of COVID-19 infection",
      //   "With Allergy",
      //   "With Comorbidities",
      //   "Provide Electronic Informed Consent?",
      // ],
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
    patientVaccinationSummary: [
      {
        dose: "1",
        vaccinationDate: "01/01/2000",
        vaccineManufacturer: "Moderna",
        batchNumber: "J202107067",
        lotNumber: "NA",
        vaccinatorName: "Dela Cruz, Jose D.",
        encodedBy: "Dela Cruz, Jose D.",
        consent: "Yes",
        reasonForRefusal: "",
        deferral: "",
      },
    ],
    vaccinationMonitoringpatient: [
      "Edad ay mas mababa sa 18 taong gulang?",
      "May alerhiya sa PEG or polysorbate?",
      "May malubhang alerhiya (severe allergin reaction) matapos ang unang dose ng bakuna?",
      "May alerhiya sa pagkain, itlog, gamit? May hika (asthma)?",
      "Kung may alerhiya o hika, may problema ba sa pag-monitor sa pasyente ng 30 minuto?",
      "May sakit kaugnay ng pagdudugo o sa kasalukuyan ay umiinom ng anti-coagulants (pampalabnaw ng dugo)?",
      "Kung may sakit kaugnay ng pagdudugo o kasalukuyang umiinom ng anti-coagulants (pampalabnaw ng dugo), mayroon bang problema sa pagkuha/paggamit ng gauge 23-25 na siringhilya (syring) para sa pagturok?",
      "Mayroon ng kahit alinman sa sumusunod na sintomas? Lagnat / panginginig dahil sa lamig, Sakit ng ulo, Ubo, Sipon, Pananakit ng lalamunan, Pananakit ng kalamnan, Pagkapagod, Panghihina, Kawalan ng panlasa o pang-amoy, Pagtatae, Hirap sa paghinga, Rashes",
      "Sintomas",
      "Kasulukuyang may SBP ≥ 180 at/o dBP ≥ 120, at may sintomas ng organ damage?",
      "May exposure sa taong confirmed o suspect na kaso ng COVID-19 nitong nakaraang dalawang linggo (14 na araw)?",
      "Dating ginamot para sa COVID-19 nitong nakaraang 90 na araw?",
      "Nakakuha ng kahit anong bakuna nitong nakaraang 14 na araw o pinaplanong kumuha ng kahit anong bakuna sa susunod na 14 na araw matapos magpabakuna?",
      "Ginamot o nakakuha ng convalescent plasma o monoclonal antibodies para sa COVID-19 nitong nakaraang 90 na araw?",
      "Buntis?",
      "Kung buntis, nasa unang tatlong buwan ng pagbubuntis?",
      "Mayroon ng kahit alinman sa sumusunod na sakit o kundisyon? Human Immunodeficiency Virus(HIV), Kanser(Cancer o Malignancy), Sumailalim sa organ transplant, Kasalukuyang umiinom ng steroids, Nakaratay na lang sa kama (bed-ridden), may sakit (terminal illness) na hindi tataas sa anim (6) na buwan ang taning, may autoimmune disease",
      "Sakit / Kundisyon",
      "Kung may alinman sa mga nabanggit, tutol ba ang doktor sa pagbabakuna sa dalang medical clearane bago ang araw ng pagbabakuna?",
    ],
    isDisabled: false,
    isSearchDisabled: false,
    valid: false,
    reason_for_update: null,
    vaccineSummaryEdit: false,
    vasLine: [],
    vasLineCopy: "",
    isCopyCode: false,
    isSaved: false,
    path: process.env.VUE_APP_STORAGE_END_POINT,
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    actionWidth() {
      return this.$vuetify.breakpoint.mdAndUp ? "35%" : "50%";
    },
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
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    options: {
      handler() {
        this.getDataFromApi();
      },
      deep: true,
    },
    monitorPatient() {
      return this.monitorPatient;
    },
  },
  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    toggleQuestion8() {
      if (!this.monitorPatient.question8) this.monitorPatient.question9 = [];
    },
    toggleQuestion17() {
      if (!this.monitorPatient.question17) {
        this.monitorPatient.question18 = [];
        this.monitorPatient.question19 = true;
      } else {
        this.monitorPatient.question19 = false;
      }
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
    showMonitorDialog(item) {
      this.monitorPatientDialog = false;
      this.monitorPatient = item;
    },
    saveMonitorPatient() {
      console.log("save");
      if (this.validate()) {
        this.getAnswerQuestion8();
        this.getAnswerQuestion17();
        this.getAnswerSurvey();
        this.monitorPatient.vaccination_date = moment(
          this.monitorPatient.vaccination_date
        ).format("MM/DD/YYYY");
        let data = this.monitorPatient;
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
            this.$store.dispatch(MONITOR_PATIENT, data).then((data) => {
              if (data.message == "Qualified Patient monitored successfully.") {
                this.$swal(
                  "Monitor Patient",
                  "Patient monitor successfully.",
                  "success"
                );
                this.getDataFromApi();
                this.e1 = 1;
                this.monitorPatientDialog = false;
              } else {
                this.$swal("Error", "Something went wrong", "danger");
                this.e1 = 1;
                this.monitorPatientDialog = false;
              }
            });
          }
        });
      }
    },
    getAnswerQuestion8() {
      let answer = [];
      for (var y = 0; y < this.questionFor8.length; y++) {
        if (this.questionFor8[y].isChecked) {
          answer.push(this.questionFor8[y].name);
        }
      }
      this.monitorPatient.question8Arr = answer.toString();
    },
    getAnswerQuestion17() {
      let answer = [];
      for (var y = 0; y < this.questionFor17.length; y++) {
        if (this.questionFor17[y].isChecked) {
          answer.push(this.questionFor17[y].name);
        }
      }
      this.monitorPatient.question17Arr = answer.toString();
    },
    getAnswerSurvey() {
      this.monitorPatient.question_1 = this.getAnswerQuestion(
        this.monitorPatient.question1
      );
      this.monitorPatient.question_2 = this.getAnswerQuestion(
        this.monitorPatient.question2
      );
      this.monitorPatient.question_3 = this.getAnswerQuestion(
        this.monitorPatient.question3
      );
      this.monitorPatient.question_4 = this.getAnswerQuestion(
        this.monitorPatient.question4
      );
      this.monitorPatient.question_5 = this.getAnswerQuestion(
        this.monitorPatient.question5
      );
      this.monitorPatient.question_6 = this.getAnswerQuestion(
        this.monitorPatient.question6
      );
      this.monitorPatient.question_7 = this.getAnswerQuestion(
        this.monitorPatient.question7
      );
      this.monitorPatient.question_8 = this.getAnswerQuestion(
        this.monitorPatient.question8
      );
      this.monitorPatient.question_10 = this.getAnswerQuestion(
        this.monitorPatient.question10
      );
      this.monitorPatient.question_11 = this.getAnswerQuestion(
        this.monitorPatient.question11
      );
      this.monitorPatient.question_12 = this.getAnswerQuestion(
        this.monitorPatient.question12
      );
      this.monitorPatient.question_13 = this.getAnswerQuestion(
        this.monitorPatient.question13
      );
      this.monitorPatient.question_14 = this.getAnswerQuestion(
        this.monitorPatient.question14
      );
      this.monitorPatient.question_15 = this.getAnswerQuestion(
        this.monitorPatient.question15
      );
      this.monitorPatient.question_16 = this.getAnswerQuestion(
        this.monitorPatient.question16
      );
      this.monitorPatient.question_18 = this.getAnswerQuestion(
        this.monitorPatient.question18
      );
      this.monitorPatient.question_19 = this.getAnswerQuestion(
        this.monitorPatient.question19
      );
    },
    editMonitorPatient(item) {
      this.isDisabled = false;
      this.monitorPatientDialog = true;
      this.vaccineSummaryEdit = false;
      this.clearInput();
      if (this.dosages.length == 1) {
        this.dosages.push("2nd");
      }
      if (this.dosages.length == 2) {
        this.dosages.push("3rd(Booster)");
      }
      // console.log('this.monitorPatient');
      // console.log(this.monitorPatient);
      // console.log('this.monitorPatient');
      // console.log('===================');
      // this.monitorPatient = item;
      // console.log('this.monitorPatient');
      // console.log(this.monitorPatient);
      // console.log('this.monitorPatient');
      this.monitorPatient.qualified_patient_id = item.id;
      this.monitorPatient.vaccination_monitoring = item.vaccination_monitoring;
      this.monitorPatient.patient_name =
        item.pre_registration.first_name +
        " " +
        item.pre_registration.last_name;
      if (item.vaccination_monitoring.length == 1) {
        this.monitorPatient.dosage = "2nd";
        this.monitorPatient.dose = "2";
        this.monitorPatient.vaccine_manufacturer = null;
        this.monitorPatient.vaccine_categories = null;
        this.monitorPatient.lot_number = null;
        this.monitorPatient.batch_number = null;
        this.monitorPatient.consent = null;
        this.monitorPatient.vaccination_date = null;
        this.monitorPatient.vaccinator = null;
        this.monitorPatient.vaccinators = null;
        this.monitorPatient.refusal = null;
        this.monitorPatient.reason_for_refusal = null;
        this.monitorPatient.deferral = null;
        this.dosages.splice(2, 1);
      } else if (item.vaccination_monitoring.length == 2) {
        // this.isDisabled = true;
        this.monitorPatient.dosage = "3rd(Booster)";
        this.monitorPatient.dose = "3";
        this.monitorPatient.vaccine_manufacturer = null;
        this.monitorPatient.vaccine_categories = null;
        this.monitorPatient.lot_number = null;
        this.monitorPatient.batch_number = null;
        this.monitorPatient.consent = null;
        this.monitorPatient.vaccination_date = null;
        this.monitorPatient.vaccinator = null;
        this.monitorPatient.vaccinators = null;
        this.monitorPatient.refusal = null;
        this.monitorPatient.reason_for_refusal = null;
        this.monitorPatient.deferral = null;
      } else if (item.vaccination_monitoring.length == 3) {
        this.isDisabled = true;
        let vac = item.vaccination_monitoring[0];
        this.monitorPatient.dosage = "1st";
        this.monitorPatient.dose = "1";
        this.monitorPatient.vaccinators = {
          first_name: vac.first_name,
          health_facilities_id: vac.health_facilities_id,
          id: vac.vaccinator_id,
          last_name: vac.last_name,
          middle_name: vac.middle_name,
          prc_license_number: vac.prc_license_number,
          profession: vac.profession,
          role: vac.role,
          suffix: vac.suffix,
        };
        this.monitorPatient.vaccine_categories = {
          id: vac.vaccine_category_id,
          vaccine_manufacturer: vac.vaccine_manufacturer,
          vaccine_name: vac.vaccine_name,
        };
        this.monitorPatient.lot_number = vac.lot_number;
        this.monitorPatient.batch_number = vac.batch_number;
        this.monitorPatient.consent = vac.consent;
        this.monitorPatient.vaccination_date = moment(
          vac.vaccination_date
        ).format("YYYY-MM-DD");
        this.monitorPatient.refusal = vac.reason_for_refusal;
        this.monitorPatient.deferral = vac.deferral;
        this.monitorPatient.question1 = this.getAnswer(vac.question_1);
        this.monitorPatient.question2 = this.getAnswer(vac.question_2);
        this.monitorPatient.question3 = this.getAnswer(vac.question_3);
        this.monitorPatient.question4 = this.getAnswer(vac.question_4);
        this.monitorPatient.question5 = this.getAnswer(vac.question_5);
        this.monitorPatient.question6 = this.getAnswer(vac.question_6);
        this.monitorPatient.question7 = this.getAnswer(vac.question_7);
        this.monitorPatient.question8 = this.getAnswer(vac.question_8);
        this.getAnswer9(vac.question_9);
        this.monitorPatient.question10 = this.getAnswer(vac.question_10);
        this.monitorPatient.question11 = this.getAnswer(vac.question_11);
        this.monitorPatient.question12 = this.getAnswer(vac.question_12);
        this.monitorPatient.question13 = this.getAnswer(vac.question_13);
        this.monitorPatient.question14 = this.getAnswer(vac.question_14);
        this.monitorPatient.question15 = this.getAnswer(vac.question_15);
        this.monitorPatient.question16 = this.getAnswer(vac.question_16);
        this.getAnswer17(vac.question_17);
        this.monitorPatient.question18 = this.getAnswer(vac.question_18);
        this.monitorPatient.question19 = this.getAnswer(vac.question_19);
      } else {
        this.isDisabled = false;
        this.monitorPatient.dosage = "1st";
        this.monitorPatient.dose = "1";
        this.dosages.splice(1);
      }
    },
    changeDosage() {
      let monitorPatient = this.monitorPatient;
      // this.monitorPatient = {};
      this.clearInput();
      // this.monitorPatient.patient_name =
      //   monitorPatient.pre_registration.first_name +
      //   " " +
      //   monitorPatient.pre_registration.last_name;
      if (monitorPatient.dosage == "1st") {
        if (monitorPatient.vaccination_monitoring[0] != undefined) {
          this.isDisabled = true;
          let vac = monitorPatient.vaccination_monitoring[0];
          this.monitorPatient.vaccinators = {
            first_name: vac.first_name,
            health_facilities_id: vac.health_facilities_id,
            id: vac.vaccinator_id,
            last_name: vac.last_name,
            middle_name: vac.middle_name,
            prc_license_number: vac.prc_license_number,
            profession: vac.profession,
            role: vac.role,
            suffix: vac.suffix,
          };
          this.monitorPatient.dosage = vac.dosage;
          this.monitorPatient.dosage = "1st";
          this.monitorPatient.dose = "1";
          this.monitorPatient.vaccine_categories = {
            id: vac.vaccine_category_id,
            vaccine_manufacturer: vac.vaccine_manufacturer,
            vaccine_name: vac.vaccine_name,
          };
          this.monitorPatient.lot_number = vac.lot_number;
          this.monitorPatient.batch_number = vac.batch_number;
          this.monitorPatient.consent = vac.consent;
          this.monitorPatient.vaccination_date = moment(
            vac.vaccination_date
          ).format("YYYY-MM-DD");
          this.monitorPatient.reason_for_refusal = vac.reason_for_refusal;
          this.monitorPatient.deferral = vac.deferral;
          this.monitorPatient.question1 = this.getAnswer(vac.question_1);
          this.monitorPatient.question2 = this.getAnswer(vac.question_2);
          this.monitorPatient.question3 = this.getAnswer(vac.question_3);
          this.monitorPatient.question4 = this.getAnswer(vac.question_4);
          this.monitorPatient.question5 = this.getAnswer(vac.question_5);
          this.monitorPatient.question6 = this.getAnswer(vac.question_6);
          this.monitorPatient.question7 = this.getAnswer(vac.question_7);
          this.monitorPatient.question8 = this.getAnswer(vac.question_8);
          this.getAnswer9(vac.question_9);
          this.monitorPatient.question10 = this.getAnswer(vac.question_10);
          this.monitorPatient.question11 = this.getAnswer(vac.question_11);
          this.monitorPatient.question12 = this.getAnswer(vac.question_12);
          this.monitorPatient.question13 = this.getAnswer(vac.question_13);
          this.monitorPatient.question14 = this.getAnswer(vac.question_14);
          this.monitorPatient.question15 = this.getAnswer(vac.question_15);
          this.monitorPatient.question16 = this.getAnswer(vac.question_16);
          this.getAnswer17(vac.question_17);
          this.monitorPatient.question18 = this.getAnswer(vac.question_18);
          this.monitorPatient.question19 = this.getAnswer(vac.question_19);
        } else {
          this.isDisabled = false;
          this.monitorPatient.vaccinator = "";
          this.monitorPatient.vaccinators = null;
          this.monitorPatient.dosage = "1st";
          this.monitorPatient.dose = "1";
          this.monitorPatient.vaccine_categories = null;
          this.monitorPatient.vaccine_manufacturer = "";
          this.monitorPatient.lot_number = "";
          this.monitorPatient.batch_number = "";
          this.monitorPatient.consent = "";
          this.monitorPatient.vaccination_date = null;
          this.monitorPatient.reason_for_refusal = "";
          this.monitorPatient.deferral = "";
        }
      } else if (monitorPatient.dosage == "2nd") {
        if (monitorPatient.vaccination_monitoring[1] != undefined) {
          this.isDisabled = true;
          let vac = monitorPatient.vaccination_monitoring[1];
          this.monitorPatient.vaccinators = {
            first_name: vac.first_name,
            health_facilities_id: vac.health_facilities_id,
            id: vac.vaccinator_id,
            last_name: vac.last_name,
            middle_name: vac.middle_name,
            prc_license_number: vac.prc_license_number,
            profession: vac.profession,
            role: vac.role,
            suffix: vac.suffix,
          };
          this.monitorPatient.dose = "2";
          this.monitorPatient.vaccine_categories = {
            id: vac.vaccine_category_id,
            vaccine_manufacturer: vac.vaccine_manufacturer,
            vaccine_name: vac.vaccine_name,
          };
          this.monitorPatient.lot_number = vac.lot_number;
          this.monitorPatient.batch_number = vac.batch_number;
          this.monitorPatient.consent = vac.consent;
          this.monitorPatient.vaccination_date = moment(
            vac.vaccination_date
          ).format("YYYY-MM-DD");
          this.monitorPatient.reason_for_refusal = vac.reason_for_refusal;
          this.monitorPatient.deferral = vac.deferral;
          this.monitorPatient.question1 = this.getAnswer(vac.question_1);
          this.monitorPatient.question2 = this.getAnswer(vac.question_2);
          this.monitorPatient.question3 = this.getAnswer(vac.question_3);
          this.monitorPatient.question4 = this.getAnswer(vac.question_4);
          this.monitorPatient.question5 = this.getAnswer(vac.question_5);
          this.monitorPatient.question6 = this.getAnswer(vac.question_6);
          this.monitorPatient.question7 = this.getAnswer(vac.question_7);
          this.monitorPatient.question8 = this.getAnswer(vac.question_8);
          this.getAnswer9(vac.question_9);
          this.monitorPatient.question10 = this.getAnswer(vac.question_10);
          this.monitorPatient.question11 = this.getAnswer(vac.question_11);
          this.monitorPatient.question12 = this.getAnswer(vac.question_12);
          this.monitorPatient.question13 = this.getAnswer(vac.question_13);
          this.monitorPatient.question14 = this.getAnswer(vac.question_14);
          this.monitorPatient.question15 = this.getAnswer(vac.question_15);
          this.monitorPatient.question16 = this.getAnswer(vac.question_16);
          this.getAnswer17(vac.question_17);
          this.monitorPatient.question18 = this.getAnswer(vac.question_18);
          this.monitorPatient.question19 = this.getAnswer(vac.question_19);
        } else {
          this.isDisabled = false;
          this.monitorPatient.vaccinator = "";
          this.monitorPatient.vaccinators = null;
          this.monitorPatient.dose = "2";
          this.monitorPatient.vaccine_categories = null;
          this.monitorPatient.vaccine_manufacturer = "";
          this.monitorPatient.lot_number = "";
          this.monitorPatient.batch_number = "";
          this.monitorPatient.consent = "";
          this.monitorPatient.vaccination_date = null;
          this.monitorPatient.reason_for_refusal = "";
          this.monitorPatient.deferral = "";
        }
      } else {
        if (monitorPatient.vaccination_monitoring[2] != undefined) {
          this.isDisabled = true;
          let vac = monitorPatient.vaccination_monitoring[2];
          this.monitorPatient.vaccinators = {
            first_name: vac.first_name,
            health_facilities_id: vac.health_facilities_id,
            id: vac.vaccinator_id,
            last_name: vac.last_name,
            middle_name: vac.middle_name,
            prc_license_number: vac.prc_license_number,
            profession: vac.profession,
            role: vac.role,
            suffix: vac.suffix,
          };
          this.monitorPatient.dose = "3";
          this.monitorPatient.vaccine_categories = {
            id: vac.vaccine_category_id,
            vaccine_manufacturer: vac.vaccine_manufacturer,
            vaccine_name: vac.vaccine_name,
          };
          this.monitorPatient.lot_number = vac.lot_number;
          this.monitorPatient.batch_number = vac.batch_number;
          this.monitorPatient.consent = vac.consent;
          this.monitorPatient.vaccination_date = moment(
            vac.vaccination_date
          ).format("YYYY-MM-DD");
          this.monitorPatient.reason_for_refusal = vac.reason_for_refusal;
          this.monitorPatient.deferral = vac.deferral;
          this.monitorPatient.question1 = this.getAnswer(vac.question_1);
          this.monitorPatient.question2 = this.getAnswer(vac.question_2);
          this.monitorPatient.question3 = this.getAnswer(vac.question_3);
          this.monitorPatient.question4 = this.getAnswer(vac.question_4);
          this.monitorPatient.question5 = this.getAnswer(vac.question_5);
          this.monitorPatient.question6 = this.getAnswer(vac.question_6);
          this.monitorPatient.question7 = this.getAnswer(vac.question_7);
          this.monitorPatient.question8 = this.getAnswer(vac.question_8);
          this.getAnswer9(vac.question_9);
          this.monitorPatient.question10 = this.getAnswer(vac.question_10);
          this.monitorPatient.question11 = this.getAnswer(vac.question_11);
          this.monitorPatient.question12 = this.getAnswer(vac.question_12);
          this.monitorPatient.question13 = this.getAnswer(vac.question_13);
          this.monitorPatient.question14 = this.getAnswer(vac.question_14);
          this.monitorPatient.question15 = this.getAnswer(vac.question_15);
          this.monitorPatient.question16 = this.getAnswer(vac.question_16);
          this.getAnswer17(vac.question_17);
          this.monitorPatient.question18 = this.getAnswer(vac.question_18);
          this.monitorPatient.question19 = this.getAnswer(vac.question_19);
        } else {
          this.isDisabled = false;
          this.monitorPatient.vaccinator = "";
          this.monitorPatient.vaccinators = null;
          this.monitorPatient.dose = "3";
          this.monitorPatient.vaccine_categories = null;
          this.monitorPatient.vaccine_manufacturer = "";
          this.monitorPatient.lot_number = "";
          this.monitorPatient.batch_number = "";
          this.monitorPatient.consent = "";
          this.monitorPatient.vaccination_date = null;
          this.monitorPatient.reason_for_refusal = "";
          this.monitorPatient.deferral = "";
        }
      }
      return this;
    },
    clearInput() {
      this.monitorPatient.vaccine_categories = {};
      this.monitorPatient.vaccinators = {};
      this.monitorPatient.batch_number = "";
      this.monitorPatient.lot_number = "";
      this.monitorPatient.consent = "";
      this.monitorPatient.vaccination_date = null;
      this.monitorPatient.reason_for_refusal = "";
      this.monitorPatient.deferral = "";
      this.monitorPatient.question1 = false;
      this.monitorPatient.question2 = false;
      this.monitorPatient.question3 = false;
      this.monitorPatient.question4 = false;
      this.monitorPatient.question5 = false;
      this.monitorPatient.question6 = false;
      this.monitorPatient.question7 = false;
      this.monitorPatient.question8 = false;
      for (var x = 0; x < this.questionFor8.length; x++) {
        this.questionFor8[x].isChecked = false;
      }
      this.monitorPatient.question10 = false;
      this.monitorPatient.question11 = false;
      this.monitorPatient.question12 = false;
      this.monitorPatient.question13 = false;
      this.monitorPatient.question14 = false;
      this.monitorPatient.question15 = false;
      this.monitorPatient.question16 = false;
      for (var y = 0; y < this.questionFor17.length; y++) {
        this.questionFor17[y].isChecked = false;
      }
      this.monitorPatient.question18 = false;
      this.monitorPatient.question19 = false;
    },
    getAnswer(answer) {
      let ans = "";
      if (answer == "01_Yes") {
        ans = true;
      } else {
        ans = false;
      }
      return ans;
    },
    getAnswer9(answer) {
      let ans = answer.split(",");
      for (var x = 0; x < ans.length; x++) {
        for (var y = 0; y < this.questionFor8.length; y++) {
          if (ans[x] == this.questionFor8[y].name) {
            // this.allergyArr.push(this.allergies[y].name);
            this.questionFor8[y].isChecked = true;
            break;
          }
        }
      }
      return this.questionFor8;
    },
    getAnswer17(answer) {
      let ans = answer.split(",");
      for (var x = 0; x < ans.length; x++) {
        for (var y = 0; y < this.questionFor17.length; y++) {
          if (ans[x] == this.questionFor17[y].name) {
            this.questionFor17[y].isChecked = true;
            break;
          }
        }
      }
      return this.questionFor17;
    },
    getAnswerQuestion(answer) {
      let ans = "";
      if (answer) {
        ans = "01_Yes";
      } else {
        ans = "02_No";
      }
      return ans;
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
    validateQuestion1() {
      // console.log(this.monitorPatient.question1);
      // if (!this.monitorPatient.question1) {
      //   this.monitorPatient.question1 = false;
      // }
    },
    validateQuestion() {
      if (!this.monitorPatient.question4) {
        this.monitorPatient.question5 = false;
      }
      // if (!this.monitorPatient.question6) {
      //   this.monitorPatient.question7 = false;
      // }
      if (!this.monitorPatient.question15) {
        this.monitorPatient.question16 = false;
      }
      if (!this.monitorPatient.question6) {
        this.monitorPatient.question7 = false;
      }
      if (!this.monitorPatient.question16) {
        this.monitorPatient.question17 = [];
        this.monitorPatient.question18 = false;
      }
    },
    hidePatientDetails() {
      this.patient = {
        image: "",
        patient_name: "",
        email_address: "",
        contact_number: "",
        philhealth_number: "",
        sex: "",
        age: 0,
        date_of_birth: null,
        civil_status: "",
        home_address: null,
        barangay_name: null,
        city: null,
        province: null,
        vaccination_summary: [],
      };
      this.viewPatientDetailsDialog = false;
    },
    viewPatientDetails(pat) {
      var patient = pat.pre_registration;
      this.answer = [];
      this.viewPatientDetailsDialog = true;
      this.patient = patient;
      this.civil = this.patient.civil_status.substr(3);
      this.sex = this.patient.sex.substr(3);
      this.answer.push(pat.question_1);
      this.answer.push(pat.question_10);
      this.answer.push(pat.question_6);
      this.answer.push(pat.question_2);
      this.answer.push(pat.question_4);
      this.answer.push(pat.question_9);
    },
    hideVaccinationSummaryDialog() {
      this.patient.vaccination_summary = [];
      this.vaccinationSummaryDialog = false;
    },
    viewVaccinationSummaryDialog(pat) {
      this.patient.vaccination_summary = [];
      this.vaccinationSummaryDialog = true;
      this.patient.vaccination_summary = pat.vaccination_monitoring;
    },
    cancelDialog() {
      this.monitorPatientDialog = false;
      this.isDisabled = false;
      this.vaccineSummaryEdit = false;
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
          items = items.filter((item) => {
            return item.pre_registration != null;
          });
          items.forEach((item) => {
            item.pre_registration.patient_name =
              item.pre_registration.first_name +
              " " +
              item.pre_registration.middle_name +
              " " +
              item.pre_registration.last_name +
              " " +
              (item.pre_registration.suffix != "NA"
                ? item.pre_registration.suffix
                : "");
          });
          this.desserts = items;
          this.totalDesserts = data.meta.total;
          this.loading = false;
          this.$emit("changeValue", false);
          this.isSearchDisabled = false;
        });
    },
    searchData() {
      this.isSearchDisabled = true;
      this.options.page = 1;
      //this.options = {};
      this.getDataFromApi();
    },
    getVaccinators() {
      this.$store.dispatch(GET_VACCINATORS).then((data) => {
        this.vaccinators = data;
      });
    },
    getVaccineCategories() {
      this.$store.dispatch(GET_VACCINE_CATEGORIES).then((data) => {
        this.vaccineManufacturers = data;
      });
    },
    check() {},
    async confirmPassword() {
      var isConfirm = false;
      await this.$swal({
        title: "Confirm Password",
        // text: "Please confirm your password to continue.",
        input: "password",
        inputLabel: "Please confirm your password to continue.",
        // inputPlaceholder: "Enter your password",
        confirmButtonText: "Continue",
        showCancelButton: true,
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          //console.log(result.value);
          await this.$store
            .dispatch(VERIFY_PASSWORD, { password: result.value })
            .then((data) => {
              if (data.success) {
                //console.log("ok");
                isConfirm = true;
              } else {
                this.$swal("Error", "Password Incorrect", "danger");
                //isConfirm = false;
              }
            });
        }
      });

      //console.log(isConfirm);
      return isConfirm;
    },
    async editPatientDetails(summary) {
      console.log(summary);
      console.log(summary.vaccination_monitoring_id);
      this.clearInput();
      this.vaccinationSummaryDialog = false;
      if (await this.confirmPassword()) {
        this.vaccineSummaryEdit = true;
        this.isDisabled = false;
        this.monitorPatientDialog = true;
        if (summary.dosage == "1") {
          this.monitorPatient.dosage = "1st";
          this.monitorPatient.dose = "1";
        } else if (summary.dosage == "2") {
          this.monitorPatient.dosage = "2nd";
          this.monitorPatient.dose = "2";
        } else {
          this.monitorPatient.dosage = "3rd(Booster)";
          this.monitorPatient.dose = "3";
        }
        this.monitorPatient.id = summary.vaccination_monitoring_id;
        this.monitorPatient.qualified_patient_id = summary.qualified_patient_id;
        this.monitorPatient.vaccinators = {
          first_name: summary.first_name,
          health_facilities_id: summary.health_facilities_id,
          id: summary.vaccinator_id,
          last_name: summary.last_name,
          middle_name: summary.middle_name,
          prc_license_number: summary.prc_license_number,
          profession: summary.profession,
          role: summary.role,
          suffix: summary.suffix,
        };
        this.monitorPatient.vaccine_categories = {
          id: summary.vaccine_category_id,
          vaccine_manufacturer: summary.vaccine_manufacturer,
          vaccine_name: summary.vaccine_name,
        };
        this.monitorPatient.lot_number = summary.lot_number;
        this.monitorPatient.batch_number = summary.batch_number;
        this.monitorPatient.consent = summary.consent;
        this.monitorPatient.deferral = summary.deferral;
        this.monitorPatient.reason_for_refusal = summary.reason_for_refusal;
        this.monitorPatient.vaccination_date = moment(
          summary.vaccination_date
        ).format("YYYY-MM-DD");
      }
    },
    saveEditSummary() {
      console.log("edit");
      //console.log(this.vaccineSummaryEdit);
      if (this.validate()) {
        this.monitorPatient.vaccination_date = moment(
          this.monitorPatient.vaccination_date
        ).format("MM/DD/YYYY");
        let data = this.monitorPatient;
        data.reason_for_update = this.reason_for_update;
        //console.log(this.monitorPatient);
        this.vaccineSummaryEdit = false;
        console.log(data);

        this.$swal({
          title: "Confirm",
          text: "Are you sure you want to update this?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        }).then(async (result) => {
          if (result.isConfirmed) {
            //console.log(result.value);
            this.$store.dispatch(UPDATE_SUMMARY, data).then((data) => {
              if (data.success) {
                this.$swal(
                  "Update Vaccination Summary",
                  "Successfully updated.",
                  "success"
                );
                this.getDataFromApi();
                this.monitorPatientDialog = false;
                //this.vaccineSummaryEdit = false;
              } else {
                this.$swal("Error", "Something went wrong", "danger");
                this.monitorPatientDialog = false;
                //this.vaccineSummaryEdit = false;
              }
            });
          }
        });
      }
    },
    async voidPatientDetails(summary) {
      //console.log(summary);
      this.vaccinationSummaryDialog = false;
      if (await this.confirmPassword()) {
        this.$swal({
          icon: "warning",
          title: "Are you sure?",
          text: "Do you really want to void this record? You won't be able to revert this.",
          showCancelButton: true,
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store
              .dispatch(VOID_RECORD, { id: summary.id })
              .then((data) => {
                if (data.success) {
                  this.$swal({
                    icon: "success",
                    title: "Success!",
                    text: "Record voided successfully.",
                  });
                  this.getDataFromApi();
                } else {
                  this.$swal("Error", "Something went wrong", "danger");
                }
              });
          }
        });
      }
    },
    viewVasLineDialog(item) {
      this.vasLine = [];
      this.vasLineDialog = true;
      this.isCopyCode = false;
      //console.log(item);
      this.$store.dispatch(GET_VASLINE_INFO, { id: item.id }).then((data) => {
        this.vasLine = data;
        console.log(this.vasLine);
        this.vasLineCopy = this.vasLine.join(" ");
      });
    },
    copy() {
      // let container = this.$refs.container;
      // var text = "A4\tNA\tVKGE0000025218179077\tN\tNO\nA4\tNA\tVKGE0000025218179077\tN\tNO";
      // this.$copyText(text, container).then(
      //   function (e) {
      //     // alert("Copied");
      //     console.log(e);
      //   },
      //   function (e) {
      //     // alert("Can not copy");
      //     console.log(e);
      //   }
      // );
      let testingCodeToCopy = document.querySelector("#testing-code");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();
      // try {
      //   var successful = document.execCommand("copy");
      //   var msg = successful ? "successful" : "unsuccessful";
      //   alert("Testing code was copied " + msg);
      // } catch (err) {
      //   alert("Oops, unable to copy");
      // }
      /* unselect the range */
      document.execCommand("copy");
      testingCodeToCopy.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();

      this.isCopyCode = true;
      setTimeout(() => {
        this.isCopyCode = false;
      }, 3000);
    },
  },
  created() {
    this.getVaccinators();
    this.getVaccineCategories();
    //this.initialize();
    // const search_key = this.search;
    // this.$store
    //   .dispatch(GET_QUALIFIED_PATIENT, { search_key })
    //   // go to which page after successfully login
    //   .then((data) => {
    //     this.desserts = data.data.data;
    //     console.log(data.data);
    //     this.$emit("changeValue", false);
    //     console.log("=========== this.desserts ==========");
    //     console.log(this.desserts);
    //     console.log("=========== this.desserts ==========");
    //   });
  },
};
</script>
<style scoped>
.disabledEl {
  pointer-events: none;
}
</style>