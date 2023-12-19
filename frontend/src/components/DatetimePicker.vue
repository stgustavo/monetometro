<!-- DateTimePicker.vue -->
<template>
  <div>
    <q-input v-model="dateTime" :label="label" readonly>
      <template v-slot:before>
        <q-icon name="event" />
      </template>
      <template v-slot:append>
        <q-btn icon="search" round color="primary">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <div id="dvp">
              <q-date
                v-model="dateString"
                id="dv1"
                mask="YYYY/MM/DD"
                :locale="ptBrLocale"
              />
              <q-time v-model="timeString" id="dv2" format24h />
            </div>
            <q-btn
              label="OK"
              color="primary"
              class="full-width"
              @click="closePicker"
              v-close-popup
            />
          </q-popup-proxy>
          <q-tooltip> Selecione uma data </q-tooltip>
        </q-btn>
      </template>
    </q-input>
  </div>
</template>

<script>
import moment from "moment";
import { ref, watch } from "vue";

export default {
  props: {
    label: {
      type: String,
      default: "Date and Time",
    },
    modelValue: {
      type: Date,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const ptBrLocale = {
      days: [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ],
      daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      monthsShort: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      firstDayOfWeek: true,
      pluralDay: "dias",
    };
    const date = moment(props.modelValue || new Date());
    const time = ref(date.format("HH:mm"));
    const dateTime = ref(
      "".concat(date.format("DD/MM/YYYY"), " ", date.format("HH:mm"))
    );
    const selectedDatetime = ref(props.modelValue);

    const dateString = ref(date.format("YYYY/MM/DD"));
    const timeString = ref(time);

    return {
      ptBrLocale,
      dateTime,
      pickerModel: false,
      date,
      time,
      dateString,
      timeString,
      selectedDatetime,
    };
  },

  methods: {
    openPicker() {
      this.pickerModel = true;
    },
    closePicker() {
      if (this.dateString && this.timeString) {
        this.date = moment(
          "".concat(this.dateString, " ", this.timeString),
          "YYYY/MM/DD HH:mm"
        );
        this.dateTime = "".concat(
          this.date.format("DD/MM/YYYY"),
          " ",
          this.time
        );
        this.selectedDatetime = new Date(this.date);
        this.$emit("update:modelValue", this.selectedDatetime);
      }
    },
  },
};
</script>

<style scoped>
/* Adicione estilos conforme necessário */
/* Alinhamento dos componentes dentro da janela pop-up */
.q-popup-content {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Uma linha para q-date, uma para q-time, uma para q-btn */
  gap: 10px; /* Espaçamento entre as linhas */
}

/* Alinhamento do ícone dentro do q-input */
.q-field__append {
  display: flex;
  align-items: center;
}
#dvp {
  display: flex;
  flex-direction: row;
}

#dv1,
#dv2 {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
}
</style>
