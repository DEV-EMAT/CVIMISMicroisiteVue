<template>
  <!-- Monitor Patient Dialog -->
  <v-dialog
    v-model="monitorPatientDialog"
    scrollable
    persistent
    max-width="800px"
  >
    <v-stepper v-model="e1" class="elevation-0">
      <v-list-item two-line>
        <v-list-item-content class="px-2">
          <v-list-item-title class="text-h5">
            Patient Monitoring
          </v-list-item-title>
          <v-list-item-subtitle>
            please make sure all required fields are complete.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card elevation="0">
        <v-stepper-header class="elevation-0" style="height: 62px">
          <v-stepper-step class="py-3" :complete="e1 > 1" step="1">
            Patient Information
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step class="py-3" :complete="e1 > 2" step="2">
            Survey Questions
          </v-stepper-step>
        </v-stepper-header>

        <v-divider class="my-0"></v-divider>
        <v-card-text style="max-height: 1000px">
          <v-stepper-items class="overflow-y-auto">
            <v-stepper-content step="1" class="py-0" style="max-height: 600px">
              <v-row>
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="monitorPatient.patientName"
                    label="Patient Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="monitorPatient.dosage"
                    :items="dosages"
                    label="Dosage"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="monitorPatient.vaccineManufacturer"
                    :items="vaccineManufacturers"
                    label="Vaccine Manufacturer"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="monitorPatient.lotNumber"
                    label="Lot Number"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="monitorPatient.batchNumber"
                    label="Batch Number"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                    v-model="monitorPatient.consent"
                    :items="consents"
                    label="Consent"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="monitorPatient.vaccinationDate"
                    label="Vaccination Date"
                    type="date"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <!-- <v-select
                    v-model="monitorPatient.vaccinator"
                    :items="vaccinators"
                    label="Vacinator"
                  ></v-select> -->
                  <v-autocomplete
                    v-model="monitorPatient.vaccinator"
                    :items="vaccinators"
                    label="Vacinator"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="monitorPatient.reafusal"
                    label="Reason for refusal"
                    type="text"
                    auto-grow
                    rows="1"
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
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-content step="2" class="py-0" style="max-height: 600px">
              <v-row>
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
                        <tr>
                          <td class="col-md-10">
                            Edad ay mas mababa sa 18 taong gulang?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question1"
                              :label="`${
                                monitorPatient.question1 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                          </td>
                        </tr>
                        <tr>
                          <td class="col-md-10">
                            May alerhiya sa PEG or polysorbate?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question2"
                              :label="`${
                                monitorPatient.question2 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                          </td>
                        </tr>
                        <tr>
                          <td class="col-md-10">
                            May malubhang alerhiya (severe allergin reaction)
                            matapos ang unang dose ng bakuna?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question3"
                              :label="`${
                                monitorPatient.question3 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                          </td>
                        </tr>

                        <tr>
                          <td class="col-md-10">
                            May alerhiya sa pagkain, itlog, gamit? May hika
                            (asthma)?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question4"
                              :label="`${
                                monitorPatient.question4 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                              @change="
                                !monitorPatient.question4
                                  ? (question5 = false)
                                  : true
                              "
                            ></v-switch>
                          </td>
                        </tr>
                        <tr v-show="monitorPatient.question4">
                          <td class="col-md-10">
                            *Kung may alerhiya o hika, may problema ba sa
                            pag-monitor sa pasyente ng 30 minuto?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            May sakit kaugnay ng pagdudugo o sa kasalukuyan ay
                            umiinom ng anti-coagulants (pampalabnaw ng dugo)?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question6"
                              :label="`${
                                monitorPatient.question6 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                              @change="
                                !monitorPatient.question6
                                  ? (question7 = false)
                                  : true
                              "
                            ></v-switch>
                          </td>
                        </tr>
                        <tr v-show="monitorPatient.question6">
                          <td class="col-md-10">
                            *Kung may sakit kaugnay ng pagdudugo o kasalukuyang
                            umiinom ng anti-coagulants (pampalabnaw ng dugo),
                            mayroon bang problema sa pagkuha/paggamit ng gauge
                            23-25 na siringhilya (syring) para sa pagturok?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            Mayroon ng kahit alinman sa sumusunod na sintomas?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question8"
                              :label="`${
                                monitorPatient.question8 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                              @change="toggleQuestion8"
                            ></v-switch>
                          </td>
                        </tr>
                        <tr>
                          <td class="col-md-12" colspan="2">
                            <v-row>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Lagnat / panginginig dahil sa lamig"
                                  value="Lagnat / panginginig dahil sa lamig"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Pagkapagod"
                                  value="Pagkapagod"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Sakit ng ulo"
                                  value="Sakit ng ulo"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Panghihina"
                                  value="Panghihina"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Ubo"
                                  value="Ubo"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Kawalan ng panlasa o pang-amoy"
                                  value="Kawalan ng panlasa o pang-amoy"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Sipon"
                                  value="Sipon"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Pagtatae"
                                  value="Pagtatae"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Pananakit ng lalamunan"
                                  value="Pananakit ng lalamunan"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Hirap sa paghinga"
                                  value="Hirap sa paghinga"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Pananakit ng kalamnan"
                                  value="Pananakit ng kalamnan"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question9"
                                  label="Rashes"
                                  value="Rashes"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question8"
                                ></v-checkbox>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>

                        <tr>
                          <td class="col-md-10">
                            Kasulukuyang may SBP ≥ 180 at/o dBP ≥ 120, at may
                            sintomas ng organ damage?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            May exposure sa taong confirmed o suspect na kaso ng
                            COVID-19 nitong nakaraang dalawang linggo (14 na
                            araw)?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            Dating ginamot para sa COVID-19 nitong nakaraang 90
                            na araw?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            Nakakuha ng kahit anong bakuna nitong nakaraang 14
                            na araw o pinaplanong kumuha ng kahit anong bakuna
                            sa susunod na 14 na araw matapos magpabakuna?
                          </td>
                          <td class="col-md-2">
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
                          <td class="col-md-10">
                            Ginamot o nakakuha ng convalescent plasma o
                            monoclonal antibodies para sa COVID-19 nitong
                            nakaraang 90 na araw?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question14"
                              :label="`${
                                monitorPatient.question14 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                          </td>
                        </tr>

                        <tr>
                          <td class="col-md-10">Buntis?</td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question15"
                              :label="`${
                                monitorPatient.question15 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                              @change="
                                !monitorPatient.question15
                                  ? (monitorPatient.question16 = false)
                                  : true
                              "
                            ></v-switch>
                          </td>
                        </tr>
                        <tr v-show="monitorPatient.question15">
                          <td class="col-md-10">
                            *Kung buntis, nasa unang tatlong buwan ng
                            pagbubuntis?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question16"
                              :label="`${
                                monitorPatient.question16 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                            ></v-switch>
                          </td>
                        </tr>
                        <tr>
                          <td class="col-md-10">
                            Mayroon ng kahit alinman sa sumusunod na sakit o
                            kundisyon?
                          </td>
                          <td class="col-md-2">
                            <v-switch
                              v-model="monitorPatient.question17"
                              :label="`${
                                monitorPatient.question17 ? 'Yes' : 'No'
                              }`"
                              color="green"
                              hide-details
                              @change="toggleQuestion17"
                            ></v-switch>
                          </td>
                        </tr>
                        <tr>
                          <td class="col-md-12" colspan="2">
                            <v-row>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="Human Immunodeficiency Virus(HIV)"
                                  value="Human Immunodeficiency Virus(HIV)"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="Kanser(Cancer o Malignancy)"
                                  value="Kanser(Cancer o Malignancy)"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="Sumailalim sa organ transplant"
                                  value="Sumailalim sa organ transplant"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="Kasalukuyang umiinom ng steroids"
                                  value="Kasalukuyang umiinom ng steroids"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="Nakaratay na lang sa kama (bed-ridden), may sakit (terminal illness) na hindi tataas sa anim (6) na buwan ang taning"
                                  value="Nakaratay na lang sa kama (bed-ridden), may sakit (terminal illness) na hindi tataas sa anim (6) na buwan ang taning"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                              <v-col cols="6">
                                <v-checkbox
                                  v-model="monitorPatient.question18"
                                  label="May autoimmune disease"
                                  value="May autoimmune disease"
                                  color="green"
                                  hide-details
                                  :disabled="!monitorPatient.question17"
                                ></v-checkbox>
                              </v-col>
                            </v-row>
                          </td>
                        </tr>
                        <tr v-show="monitorPatient.question17">
                          <td class="col-md-10">
                            *If with mentioned condition, has presented medical
                            clearance prior to vaccination day?
                          </td>
                          <td class="col-md-2">
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
            </v-stepper-content>
          </v-stepper-items>
        </v-card-text>

        <v-divider class="my-0"></v-divider>

        <v-card-actions class="pa-3">
          <v-btn text v-if="e1 == 1" @click="monitorPatientDialog = false">
            Cancel
          </v-btn>
          <v-btn text v-else @click="e1 = 1"> Previous </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            v-if="e1 == 1"
            @click="e1 == 1 ? (e1 = 2) : null"
          >
            Continue
          </v-btn>
          <v-btn color="primary" text v-else @click="saveMonitorPatient">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-stepper>
  </v-dialog>
  <!-- End Monitor Patient Dialog -->
</template>
