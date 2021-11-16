<template>
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
              {{ question }}
            </td>
            <td class="col-md-2">
              <v-switch
                v-model="monitorPatient.questions[index]"
                :label="`${monitorPatient.questions[index] ? 'Yes' : 'No'}`"
                color="green"
                hide-details
              ></v-switch>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-col>
</template>

<script>
// import Dashboard from "../components/Dashboard";

export default {
  name: "SurveyQuestion",
  data: () => ({
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
    answers: [
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
  }),
};
</script>
