<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    :options.sync="options"
    :server-items-length="totalDesserts"
    :loading="loading"
  >
    <template v-slot:[`header.patient_name`]="{ header }">
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
        v-if="item.status == 0"
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
          <h5>Pre-reg Verification</h5>
          <p class="caption">Manage Pre-reg Verification</p>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- <v-divider class="mx-4 transparent" inset vertical></v-divider> -->
        <v-btn color="primary" text dark @click="addNew">
          <v-icon right dark class="mr-2"> mdi-plus-thick </v-icon>
          New Item
        </v-btn>

        <template v-slot:extension>
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
        </template>

        <!-- # Dialog for Add and Edit Patient Pre-registration # -->
        <v-dialog
          v-model="addEditdialog"
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
                      {{
                        editPatient
                          ? "Edit Patient Information"
                          : "Add Patient Information"
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="white--text font-weight-light">
                      please make sure all required fields are complete.dfsfdsf
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-btn icon color="white" @click="addEditdialog = false">
                      <v-icon small> mdi-close </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row align="center" justify="center">
                    <v-col cols="12">
                      <v-list-item-title class="font-weight-medium green--text text-uppercase">
                        Basic Information
                      </v-list-item-title>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.last_name"
                        label="Last Name"
                        :rules="[(v) => !!v || 'LastName is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.first_name"
                        label="First Name"
                        :rules="[(v) => !!v || 'FirstName is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.middle_name"
                        label="Middle Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="patient.suffix"
                        :items="suffix"
                        label="Suffix"
                        :rules="[(v) => !!v || 'Suffix is required']"
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.date_of_birth"
                        label="Date of Birth"
                        type="date"
                        :rules="[(v) => !!v || 'Date of Birth is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="patient.sex"
                        :items="sex"
                        label="Sex"
                        :rules="[(v) => !!v || 'Sex is required']"
                        required
                      ></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="patient.civil_status"
                        :items="civilStatus"
                        label="Civil Status"
                        :rules="[(v) => !!v || 'Civil Status is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.contact_number"
                        label="Contact Number"
                        prefix="+639"
                        type="text"
                        :rules="[(v) => !!v || 'Contact Number is required']"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-list-item-title class="font-weight-medium green--text text-uppercase">
                        Residential Address
                      </v-list-item-title>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="patient.barangay_obj"
                        :items="barangays"
                        item-text="barangay"
                        return-object
                        label="Barangay"
                        :rules="[(v) => !!v || 'Barangay is required']"
                        required
                      >
                      </v-select>
                    </v-col>

                    <v-col cols="12" sm="12" md="8">
                      <v-textarea
                        v-model="patient.home_address"
                        label="Home Address"
                        type="text"
                        auto-grow
                        rows="1"
                        :rules="[(v) => !!v || 'Home Address is required']"
                        required
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-list-item-title class="font-weight-medium">
                        Additional Information
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="patient.categories"
                        :items="categories"
                        item-text="category_name"
                        return-object
                        label="Category"
                        :rules="[(v) => !!v || 'Category is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="patient.id_categories"
                        :items="id_categories"
                        item-text="id_category_name"
                        return-object
                        label="ID Category"
                        :rules="[(v) => !!v || 'ID Category is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.category_id_number"
                        label="ID Number"
                        type="text"
                        :rules="[(v) => !!v || 'ID Number is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.philhealth_number"
                        label="PhilHealth ID"
                        type="text"
                        :rules="[(v) => !!v || 'PhilHealth ID is required']"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="patient.employee_status"
                        :items="employee_status"
                        item-text="employment_type"
                        return-object
                        label="Employee Status"
                        :rules="[(v) => !!v || 'Employee Status is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="patient.profession"
                        :items="professions"
                        item-text="profession_name"
                        return-object
                        label="Profession"
                        :rules="[(v) => !!v || 'Profession ID is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="patient.specific_profession"
                        label="Specify Profession"
                        type="text"
                        :rules="[
                          (v) => !!v || 'Specify Profession ID is required',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.employer_name"
                        label="Employer Name"
                        type="text"
                        :rules="[(v) => !!v || 'Employer Name is required']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="patient.employer_contact"
                        label="Employer Contact Number"
                        type="text"
                        :rules="[
                          (v) =>
                            !!v || 'Employer Contact Number ID is required',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                      <v-textarea
                        v-model="patient.employer_address"
                        label="Employer Home Address"
                        type="text"
                        auto-grow
                        rows="1"
                        :rules="[
                          (v) => !!v || 'Employer Home Address is required',
                        ]"
                        required
                      >
                      </v-textarea>
                    </v-col>
                  </v-row>

                  <v-row><v-divider></v-divider></v-row>

                  <v-row>
                    <v-col cols="12">
                      <v-list-item-title class="font-weight-medium green--text text-uppercase">
                        Survey Questions
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-row>
                        <v-col>
                          <p class="mb-0 text-subtitle-1">With Allergy</p>
                        </v-col>
                        <v-col>
                          <v-switch
                            v-model="patient.withAlergy"
                            inset
                            class="mt-0"
                            :label="`${patient.withAlergy ? 'Yes' : 'No'}`"
                            @change="validateQuestion1"
                          ></v-switch>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          v-for="allergy in allergies"
                          :key="allergy.id"
                        >
                          <v-checkbox
                            v-model="allergy.isChecked"
                            :label="allergy.name"
                            :value="allergy.isChecked"
                            :disabled="!patient.withAlergy"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-row>
                        <v-col>
                          <p class="mb-0 text-subtitle-1">With Comorbidities</p>
                        </v-col>
                        <v-col>
                          <v-switch
                            v-model="patient.withComorbidities"
                            inset
                            class="mt-0 mb-0"
                            @change="validateQuestion2"
                          >
                            <!-- :label="`${comorbidities ? 'Yes' : 'No'}`" -->
                            <template v-slot:label class="mb-0"
                              ><p class="mb-0 text-subtitle-1">
                                {{ patient.withComorbidities ? "Yes" : "No" }}
                              </p>
                            </template>
                          </v-switch>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="6"
                          md="6"
                          v-for="comord in commorbidities"
                          :key="comord.id"
                        >
                          <v-checkbox
                            v-model="comord.isChecked"
                            :label="comord.name"
                            :value="comord.isChecked"
                            :disabled="!patient.withComorbidities"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-list-item-title class="font-weight-medium green--text text-uppercase">
                        Parent/Guardian Information
                      </v-list-item-title>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field
                        v-model="patient.gurdian_lname"
                        label="Last Name"
                        :rules="[(v) => !!v || 'This field is required.']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field
                        v-model="patient.gurdian_fname"
                        label="First Name"
                        :rules="[(v) => !!v || 'This field is required.']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field
                        v-model="patient.gurdian_mname"
                        label="Middle Name"
                        :rules="[(v) => !!v || 'This field is required.']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-select
                        v-model="patient.gurdian_suffix"
                        :items="suffix"
                        label="Suffix"
                        :rules="[(v) => !!v || 'This field is required.']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field
                        v-model="patient.gurdian_contact_number"
                        label="Contact Number"
                        prefix="+639"
                        type="text"
                        :rules="[(v) => !!v || 'This field is required.']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-select
                        v-model="patient.relationship"
                        :items="relationships"
                        label="Relationship"
                        :rules="[(v) => !!v || 'Relationship is required']"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions class="grey lighten-5 py-4">
                <v-spacer></v-spacer>
                <v-btn small text @click="addEditdialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  small
                  text
                  color="primary"
                  class="white--text"
                  v-if="editPatient"
                  @click="updateRegistration"
                >
                  Update Changes </v-btn
                ><v-btn
                  small
                  text
                  color="primary"
                  class="white--text"
                  v-else
                  @click="savePatient"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <!-- # Dialog for View Patient Information # -->
        <v-dialog
          v-model="viewVerifyDialog"
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
                    {{
                      verifyPatient
                        ? "Approved Registration"
                        : "Patient Information"
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="white--text font-weight-light">
                    Registration summary details
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn icon color="white" @click="hideVerify">
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
                        {{ patient.civil_status }}
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <span class="font-weight-medium grey--text text--darken-2"
                        >Sex:</span
                      >
                      <div class="grey--text text--darken-1">
                        {{ patient.sex }}
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
            <v-card-actions class="grey lighten-5 py-4" v-if="verifyPatient">
              <v-spacer></v-spacer>
              <v-btn small text @click="hideVerify"> Cancel </v-btn>
              <v-btn
                v-if="patient.status == '1'"
                small
                text
                color="primary"
                class="white--text"
                @click="approveRegistration"
              >
                Approved
              </v-btn>
            </v-card-actions>
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
        color="green"
        dark
        class="mr-2 caption text-capitalize"
        v-if="item.status == 0"
        @click="viewVerify(item)"
      >
        <v-icon left> mdi-eye </v-icon>
        View Details
      </v-btn>
      <v-btn
        small
        depressed
        color="teal"
        dark
        class="mr-2 caption text-capitalize"
        v-else
        @click="viewVerify(item)"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Verify Patient
      </v-btn>
      <v-btn
        small
        depressed
        color="blue"
        dark
        class="caption text-capitalize"
        @click="addEdit(item)"
      >
        <v-icon left> mdi-pencil </v-icon>
        Edit Details
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";

import {
  GET_BARANGAY,
  GET_CATEGORIES,
  GET_ID_CATEGORIES,
  GET_EMPLOYEE_STATUS,
  GET_PROFESSIONS,
  GET_PREREG_VERIFICATION,
  VERIFY_PATIENT,
  ADD_PREREG,
  UPDATE_PREREG,
} from "../store/transaction";

export default {
  data: () => ({
    suffix: ["II", "III", "IV", "V", "JR", "SR", "NA"],
    sex: ["MALE", "FEMALE"],
    civilStatus: [
      "MARRIED",
      "SINGLE",
      "WIDOW/WIDOWER",
      "SEPARATED/ANNULLED",
      "LIVING WITH PARTNER",
    ],
    //     sex: [{id: "01_MALE", name:"MALE"}, {id: "02_FEMALE", name:"FEMALE"}],
    // civilStatus: [
    //   {id: "01_SINGLE", name: "SINGLE"},
    //   {id: "02_MARRIED", name: "MARRIED"},
    //   {id: "03_WIDOW/WIDOWER", name: "WIDOW/WIDOWER"},
    //   {id: "04_SEPARATED/ANNULLED", name: "SEPARATED/ANNULLED"},
    //   {id: "05_LIVING_WITH_PARTNER", name: "LIVING_WITH_PARTNER"},
    // ],
    barangays: ["Sala", "Marinig", "Mamatid"],
    categories: ["Sala", "Marinig", "Mamatid"],
    id_categories: ["Sala", "Marinig", "Mamatid"],
    employee_status: ["Sala", "Marinig", "Mamatid"],
    professions: ["Sala", "Marinig", "Mamatid"],
    relationships: ["Mother", "Father", "Guardian"],
    search: "",
    addEditdialog: false,
    editPatient: false,
    viewVerifyDialog: false,
    verifyPatient: false,
    headers: [
      {
        text: "Patient Name",
        align: "start",
        value: "patient_name",
        width: "50%",
        // class: "red--text text-h1",
        // class: "text-subtitle-2 font-weight-bold",
      },
      { text: "Status", align: "center", value: "status" },
      {
        text: "Actions",
        align: "center",
        value: "actions",
        sortable: false,
        width: "35%",
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
      address: "",
    },
    defaultItem: {
      name: "",
      status: 0,
      fat: 0,
      carbs: 0,
      protein: 0,
      address: "",
    },
    addNewPatient: {
      lastName: "",
      firstName: "",
      middleName: "",
      suffix: "",
      dateOfBirth: "",
      sex: "",
      civilStatus: "",
      contactNumber: "",
      barangay: "",
      address: "",
      category: "",
      idCategory: "",
      idNumber: "",
      philHealthId: "",
      employeeStatus: "",
      profession: "",
      specifyProfession: "",
      employerName: "",
      employerAddress: "",
      withAlergy: false,
      withComorbidities: false,
    },
    patient: {
      image: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
      patient_name: "",
      last_name: null,
      first_name: null,
      middle_name: null,
      suffix: null,
      email_address: "",
      contact_number: "",
      philhealth_number: "",
      sex: "",
      age: 0,
      date_of_birth: null,
      civil_status: "",
      home_address: null,
      barangay: null,
      city: null,
      province: null,
      vaccination_summary: [],
      categories: null,
      category: null,
      id_categories: null,
      id_category: "",
      id_number: "",
      category_id_number: null,
      gurdian_lname: "",
      gurdian_fname: "",
      gurdian_mname: "",
      gurdian_suffix: "",
      gurdian_contact_number: "",
      relationship: null,
      barangay_obj: {
        id: null,
        barangay: null,
      },
      employee_status: {
        id: null,
        employment_type: null,
        employment_type_format: null,
      },
      commorbidities: [],
      allergies: [],
      profession: {
        id: null,
        profession_format: null,
        profession_name: null,
        status: null,
      },
      specific_profession: "",
      employer_name: "",
      employer_contact: "",
      employer_address: "",
      withAlergy: false,
      withComorbidities: false,
      withAlergyAnswer: "",
      withComorbiditiesAnswer: "",
    },
    allergyArr: [],
    commorbidityArr: [],
    patientQuestions: [
      "Breast feeding/Pregnant",
      "Directly in Interaction with COVID Patient",
      "With history of COVID-19 infection",
      "With Allergy",
      "With Comorbidities",
      "Provide Electronic Informed Consent?",
    ],
    answer: [],
    valid: true,
    isSearchDisabled: false,
    path: "https://cvimsmicro.com/images/",
  }),
  computed: {
    // formTitle() {
    //   return this.editedIndex === -1 ? "New Item" : "Edit Item";
    // },
    // viewVerifyDialogTitle() {
    //   return this.editPatient
    //     ? "Edit Patient Information"
    //     : "Add Patient Information";
    // },
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
    // barangays() {
    //   let bar = [];
    //   this.barangays.forEach((item) => {
    //     bar.push(item.real_name);
    //   });

    //   return bar;
    // },
    arrCategories() {
      let bar = [];
      this.categories.forEach((item) => {
        bar.push(item.category_name);
      });

      return bar;
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
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
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
    hideVerify() {
      this.viewVerifyDialog = false;
      this.verifyPatient = false;
    },
    viewVerify(patient) {
      this.viewVerifyDialog = true;
      // if (status == 1) this.verifyPatient = false;
      // else this.verifyPatient = true;
      this.verifyPatient = true;
      this.answer = [];
      this.patient = patient;
      this.answer.push(this.patient.surveys.question_1);
      this.answer.push(this.patient.surveys.question_10);
      this.answer.push(this.patient.surveys.question_6);
      this.answer.push(this.patient.surveys.question_2);
      this.answer.push(this.patient.surveys.question_4);
      this.answer.push(this.patient.surveys.question_9);
    },

    addNew() {
      this.patient = {};
      this.addEditdialog = true;
      this.editPatient = false;
    },

    savePatient() {
      if (this.validate()) {
        this.validateQuestion1();
        this.validateQuestion2();
        this.patient.sex = this.getSex(this.patient.sex);
        this.patient.civil_status = this.getCivilStatus(
          this.patient.civil_status
        );
        this.patient.date_of_birth = moment(this.patient.date_of_birth).format(
          "MM/DD/YYYY"
        );

        this.$swal({
          title: "Confirm",
          text: "Are you sure you want to add pre-registration?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch(ADD_PREREG, this.patient).then((data) => {
              if (data.messages.includes("Thank you!")) {
                this.$swal(
                  "Data added",
                  "Pre-registration has been added successfully.",
                  "success"
                );
                this.getDataFromApi();
                this.addEditdialog = false;
              } else if (
                data.messages.includes(
                  "Please check your lastname, firstname, middlename and birthday!."
                )
              ) {
                this.$swal("Error", "Record already exist", "danger");
                this.addEditdialog = false;
              } else {
                this.$swal("Error", "Something went wrong", "danger");
                this.addEditdialog = false;
              }
            });
          }
        });
      }
    },

    getSex(sex) {
      let s = "";
      if (sex == "MALE") {
        s = "01_MALE";
      } else if (sex == "FEMALE") {
        s = "02_FEMALE";
      }

      return s;
    },

    getCivilStatus(civil) {
      let c = "";
      if (civil == "SINGLE") {
        c = "01_SINGLE";
      } else if (civil == "MARRIED") {
        c = "02_MARRIED";
      } else if (civil == "WIDOW/WIDOWER") {
        c = "03_WIDOW/WIDOWER";
      } else if (civil == "SEPARATED/ANNULLED") {
        c = "04_SEPARATED/ANNULLED";
      } else if (civil == "LIVING_WITH_PARTNER") {
        c = "05_LIVING_WITH_PARTNER";
      }
      return c;
    },

    getSexType(sex) {
      let s = "";
      if (sex == "01_MALE") {
        s = "MALE";
      } else {
        s = "FEMALE";
      }

      return s;
    },

    getCivilStatusType(civil) {
      let c = "";
      if (civil == "01_SINGLE") {
        c = "SINGLE";
      } else if (civil == "02_MARRIED") {
        c = "MARRIED";
      } else if (civil == "WIDOWER") {
        c = "WIDOW/WIDOWER";
      } else if (civil == "04_SEPARATED/ANNULLED") {
        c = "SEPARATED/ANNULLED";
      } else if (civil == "05_LIVING_WITH_PARTNER") {
        c = "LIVING_WITH_PARTNER";
      }
      return c;
    },

    addEdit(patient) {
      this.addEditdialog = true;
      // if (status == 1) this.verifyPatient = false;
      // else this.verifyPatient = true;
      this.editPatient = true;
      this.answer = [];
      this.patient = patient;
      // this.patient.civil_status = this.getCivilStatusType(patient.civil_status);
      // this.patient.sex = this.getSexType(patient.sex);
      this.patient.specific_profession =
        this.patient.employers.specific_profession;
      this.patient.employer_name = this.patient.employers.employer_name;
      this.patient.employer_contact = this.patient.employers.employer_contact;
      // this.patient.employer_address =
      //   this.patient.employers.employer_barangay_name +
      //   " " +
      //   this.patient.employers.employer_city +
      //   " " +
      //   this.patient.employers.employer_provice;
      this.patient.employer_address =
        this.patient.employers.employer_barangay_name;
      this.patient.category = this.patient.categories.category_name;
      this.patient.employee_status = {
        id: Number(this.patient.employers.employment_status_id),
        employment_type: this.getEmployeeType(
          this.patient.employers.employment_status_id
        ),
        employment_type_format: this.getEmployeeTypeFormat(
          this.patient.employers.employment_status_id
        ),
      };
      (this.patient.profession = {
        id: Number(this.patient.employers.profession_id),
        profession_format: this.getProfessionTypeFormat(
          this.patient.employers.profession_id
        ),
        profession_name: this.getProfessionType(
          this.patient.employers.profession_id
        ),
      }),
        (this.patient.barangay_obj = {
          id: Number(this.patient.barangay_id),
          barangay: this.patient.barangay,
        });

      // this.patient.date_of_birth = this.patient.date_of_birth.replace(/[/]/g, "-");
      this.patient.date_of_birth = moment(this.patient.date_of_birth).format(
        "YYYY-MM-DD"
      );
      this.patient.withAlergy =
        this.patient.surveys.question_2 == "YES" ? true : false;
      this.patient.withComorbidities =
        this.patient.surveys.question_4 == "YES" ? true : false;
      if (this.patient.surveys.question_2 == "YES") {
        this.getAnswerWithAllergy(this.patient.surveys.question_3);
      }

      if (this.patient.surveys.question_4 == "YES") {
        this.getAnswerWithComorbidities(this.patient.surveys.question_5);
      }
      this.answer.push(this.patient.surveys.question_1);
      this.answer.push(this.patient.surveys.question_10);
      this.answer.push(this.patient.surveys.question_6);
      this.answer.push(this.patient.surveys.question_2);
      this.answer.push(this.patient.surveys.question_4);
      this.answer.push(this.patient.surveys.question_9);
    },
    getEmployeeType(id) {
      let emp = "";
      for (var x = 0; x < this.employee_status.length; x++) {
        if (this.employee_status[x].id == Number(id)) {
          emp = this.employee_status[x].employment_type;
          break;
        }
      }

      return emp;
    },
    getEmployeeTypeFormat(id) {
      let emp = "";
      for (var x = 0; x < this.employee_status.length; x++) {
        if (this.employee_status[x].id == Number(id)) {
          emp = this.employee_status[x].employment_type_format;
          break;
        }
      }

      return emp;
    },
    getProfessionType(id) {
      let emp = "";
      for (var x = 0; x < this.professions.length; x++) {
        if (this.professions[x].id == Number(id)) {
          emp = this.professions[x].profession_name;
          break;
        }
      }

      return emp;
    },
    getProfessionTypeFormat(id) {
      let emp = "";
      for (var x = 0; x < this.professions.length; x++) {
        if (this.professions[x].id == Number(id)) {
          emp = this.professions[x].profession_format;
          break;
        }
      }

      return emp;
    },
    getAnswerWithComorbidities(answer) {
      let ans = answer.split(",");
      for (var x = 0; x < ans.length; x++) {
        for (var y = 0; y < this.commorbidities.length; y++) {
          if (ans[x] == this.commorbidities[y].name) {
            //this.commorbidityArr.push(this.commorbidities[y].name);
            this.commorbidities[y].isChecked = true;
            break;
          }
        }
      }
      return this.commorbidities;
    },
    getAnswerWithAllergy(answer) {
      let ans = answer.split(",");
      for (var x = 0; x < ans.length; x++) {
        for (var y = 0; y < this.allergies.length; y++) {
          if (ans[x] == this.allergies[y].name) {
            // this.allergyArr.push(this.allergies[y].name);
            this.allergies[y].isChecked = true;
            break;
          }
        }
      }
      return this.allergies;
    },
    approveRegistration() {
      this.$swal({
        title: "Confirm",
        text: "Are you sure you want to approved this patient pre-registration?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$store
            .dispatch(VERIFY_PATIENT, {
              pre_registration_id: this.patient.id,
            })
            .then((data) => {
              if (data.message == "Patient validated successfully.") {
                this.$swal(
                  "Data added",
                  "Patient pre-registration has been approved successfully.",
                  "success"
                );
                this.getDataFromApi();
                this.viewVerifyDialog = false;
              } else {
                this.$swal("Error", "Something went wrong", "danger");
                this.viewVerifyDialog = false;
              }
            });
        }
      });
    },
    updateRegistration() {
      if (this.validate()) {
        this.validateQuestion1();
        this.validateQuestion2();
        this.patient.civil_status = this.getCivilStatus(
          this.patient.civil_status
        );
        this.patient.sex = this.getSex(this.patient.sex);
        this.patient.date_of_birth = moment(this.patient.date_of_birth).format(
          "MM/DD/YYYY"
        );
        this.$swal({
          title: "Confirm",
          text: "Are you sure you want to update this patient \n pre-registration information?",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$store.dispatch(UPDATE_PREREG, this.patient).then((data) => {
              if (data.success) {
                this.$swal(
                  "Data updated",
                  "Patient pre-registration informatiom has been updated successfully.",
                  "success"
                );

                this.getDataFromApi();
                this.addEditdialog = false;
              } else {
                this.$swal("Error", "Something went wrong", "danger");
                this.addEditdialog = false;
              }
            });
          }
        });
      }
    },
    validateQuestion1() {
      let answer = [];
      if (this.patient.withAlergy) {
        for (var x = 0; x < this.allergies.length; x++) {
          if (this.allergies[x].isChecked) {
            answer.push(this.allergies[x].name);
          }
        }

        this.patient.withAlergyAnswer = answer.toString();
      } else {
        this.patient.withAlergyAnswer = "";
      }
    },
    validateQuestion2() {
      let answer = [];
      if (this.patient.withComorbidities) {
        for (var x = 0; x < this.commorbidities.length; x++) {
          if (this.commorbidities[x].isChecked) {
            answer.push(this.commorbidities[x].name);
          }
        }

        this.patient.withComorbiditiesAnswer = answer.toString();
      } else {
        this.patient.withComorbiditiesAnswer = "";
      }
    },
    getDataFromApi() {
      this.$emit("changeValue", true);
      this.desserts = [];
      this.loading = true;
      const search_key = this.search;
      const { page, itemsPerPage } = this.options;

      this.$store
        .dispatch(GET_PREREG_VERIFICATION, {
          items_per_page: itemsPerPage,
          page: page,
          search_key: search_key,
        })
        .then((data) => {
          let items = data.data;

          // if (itemsPerPage > 0) {
          //   items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
          // }

          this.desserts = items;
          this.desserts.forEach((item) => {
            item.patient_name =
              item.first_name + " " + item.middle_name + " " + item.last_name;
            item.civil_status = item.civil_status.substr(3);
            item.sex = item.sex.substr(3);
            item.contact_number = item.contact_number.substr(2);
          });
          this.totalDesserts = data.meta.total;
          this.loading = false;

          this.isSearchDisabled = false;
          this.$emit("changeValue", false);
        });
    },
    getBarangay() {
      this.$store.dispatch(GET_BARANGAY).then((data) => {
        this.barangays = data;
      });
    },
    getCategories() {
      this.$store.dispatch(GET_CATEGORIES).then((data) => {
        this.categories = data;
      });
    },
    getIdCategories() {
      this.$store.dispatch(GET_ID_CATEGORIES).then((data) => {
        this.id_categories = data;
      });
    },
    getEmployeeStatus() {
      this.$store.dispatch(GET_EMPLOYEE_STATUS).then((data) => {
        this.employee_status = data;
      });
    },
    getProfessions() {
      this.$store.dispatch(GET_PROFESSIONS).then((data) => {
        this.professions = data;
      });
    },
    searchData() {
      this.isSearchDisabled = true;
      this.getDataFromApi();
    },
  },
  created() {
    //this.$emit("changeValue", false);
    //this.initialize();
    //console.log("pre reg");
    // const search_key = this.search;
    // this.$store
    //   .dispatch(GET_PREREG_VERIFICATION, { search_key })
    //   // go to which page after successfully login
    //   .then((data) => {
    //     this.desserts = data.data.data;
    //     console.log(data.data);
    //     this.$emit("changeValue", false);
    //     console.log("=========== this.desserts ==========");
    //     console.log(this.desserts);
    //     console.log("=========== this.desserts ==========");
    //   });
    this.getBarangay();
    this.getCategories();
    this.getIdCategories();
    this.getEmployeeStatus();
    this.getProfessions();
    this.commorbidities = [
      {
        id: 1,
        name: "HYPERTENSION",
        isChecked: false,
      },
      {
        id: 2,
        name: "HEART DISEASE",
        isChecked: false,
      },
      {
        id: 3,
        name: "DIABETES MELLITUS",
        isChecked: false,
      },
      {
        id: 4,
        name: "BRONCHIAL ASTHMA",
        isChecked: false,
      },
      {
        id: 7,
        name: "IMMUNODEFICIENCY STATE",
        isChecked: false,
      },
      {
        id: 8,
        name: "CANCER",
        isChecked: false,
      },
      {
        id: 9,
        name: "OTHERS",
        isChecked: false,
      },
    ];

    this.allergies = [
      {
        id: 1,
        name: "DRUGS",
        isChecked: false,
      },
      {
        id: 2,
        name: "FOODS",
        isChecked: false,
      },
      {
        id: 3,
        name: "INSECTS",
        isChecked: false,
      },
      {
        id: 4,
        name: "LATEX",
        isChecked: false,
      },
      {
        id: 5,
        name: "MOLD",
        isChecked: false,
      },
      {
        id: 6,
        name: "PET",
        isChecked: false,
      },
      {
        id: 7,
        name: "POLEN",
        isChecked: false,
      },
      {
        id: 8,
        name: "OTHERS",
        isChecked: false,
      },
    ];
  },
};
</script>

<style scoped>
label.v-label.theme--light {
  margin-bottom: 0 !important;
}
</style>
