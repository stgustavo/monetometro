<template>
  <div id="container">
    <q-dialog v-model="showDialog" persistent full-height full-width>
      <q-card>
        <q-card-section align="center" class="qdialog">
          <span class="q-ml-sm text-h5" ref="dialogMsg"
            >Esse evento já deveria ter se encerrado. Deseja continuar vendo o
            seu custo desde o horário marcado para o início?</span
          >
        </q-card-section>

        <q-card-actions align="center" class="qdialog-btt">
          <q-btn
            label="Sim"
            @click="startCalc(true)"
            color="primary"
            v-close-popup
          />
          <q-btn
            label="Não"
            @click="startCalc(false)"
            color="blue-4"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div id="clock" class="clock-text">
      <div class="time">{{ currentTime }}</div>
      <div class="date">{{ currentDate }}</div>
    </div>
    <div id="money" class="money-text">
      <div id="msg" ref="msg"></div>
      {{ formattedMoney }}
    </div>
  </div>

  <q-icon v-show="showLine" name="straight" class="top-right" />
</template>

<script>
import { ref } from "vue";

import { useRoute } from "vue-router";
import { useStore } from "../stores/store";

export default {
  props: {
    DTE: { type: Date, default: new Date() },
    DTI: { type: Date, default: new Date() },
    CMH: { type: Number, default: 0 },
    ID: { type: String, default: "" },
  },
  data() {
    return {
      currentTime: "",
      currentDate: "",
      money: 0,
      showDialog: false,
    };
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    var costsMsg = ref("");
    var dialogMsg = ref("");
    const USER_DEFINED_STATE = ""; //STOPPED|RUNNING|WAITING

    var showLine = true;

    return { store, route, costsMsg, dialogMsg, showLine };
  },
  computed: {
    formattedMoney() {
      if (this.money.toFixed(2) >= 0) return `R$ ${this.money.toFixed(2)}`;
      return ``;
    },
  },
  methods: {
    hideLine() {
      this.showLine = false;
    },
    avgMeetingTime() {
      this.showDialog = false;

      var duringNow = this.store.parameters.DTE - this.store.parameters.DTI;
      if (Math.abs(duringNow) < 0) duringNow = 0;
      this.money =
        ((parseFloat(this.store.parameters.CMH) / 60) * duringNow) / 1000 / 60;
    },

    updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const locale = navigator.language;
      const day = now.toLocaleDateString(locale, { weekday: "long" });
      const date = now.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      this.currentTime = `${hours}:${minutes}:${seconds}`;
      this.currentDate = `${day}, ${date}`;

      this.checkEventStart();
    },
    updateMoney() {
      if (this.USER_DEFINED_STATE != "STOPPED") {
        var duringNow = new Date() - this.store.parameters.DTI;
        if (Math.abs(duringNow) < 0) duringNow = 0;
        this.money =
          ((parseFloat(this.store.parameters.CMH) / 60) * duringNow) /
          1000 /
          60;
        if (this.showDialog !== null && this.store.parameters.DTE < new Date())
          this.USER_DEFINED_STATE = "WAITING";
        if (this.USER_DEFINED_STATE === "WAITING") {
          this.showDialog = true;
        }
      }
      if (
        this.store.parameters.DTE.toLocaleString() ===
          this.store.parameters.DTI.toLocaleString() ||
        (!(this.money.toFixed(2) >= 0) && this.costsMsg)
      ) {
        this.costsMsg.innerHTML =
          "<span style='font-size:100px;'>&#128546;</span></br>Não conseguimos prosseguir. Verifique as configurações do evento!";
        this.showLine = true;
      }
      if (this.money >= 0) this.hideLine();
    },
    startCalc(keepRunning) {
      if (keepRunning === true) {
        this.USER_DEFINED_STATE = "RUNNING";
        this.showDialog = null;
      } else {
        if (this.USER_DEFINED_STATE) this.USER_DEFINED_STATE = "STOPPED";
        if (keepRunning === false) this.showDialog = null;
      }
      if (
        this.store.parameters.DTE.toLocaleString() ===
          this.store.parameters.DTI.toLocaleString() &&
        this.costsMsg
      ) {
        this.costsMsg.innerHTML =
          "<span style='font-size:100px;'>&#128546;</span></br>Não conseguimos prosseguir. Verifique as configurações do evento!";
        this.showLine = true;
        this.money = -1;
      } else if (new Date() < this.store.parameters.DTI) {
        this.avgMeetingTime();
        if (this.costsMsg)
          this.costsMsg.innerText =
            "Esse evento ainda não começou e custará em média";
      } else if (!keepRunning && new Date() > this.store.parameters.DTE) {
        this.avgMeetingTime();
        if (this.costsMsg) this.costsMsg.innerText = "Esse evento custou ";
      } else {
        if (this.costsMsg)
          this.costsMsg.innerText = "Esse evento está custando ";
        this.updateMoney();
        setInterval(this.updateMoney, 1000);
      }
    },
    checkEventStart() {
      if (
        this.store.parameters.DTE.toLocaleString() !=
          this.store.parameters.DTI.toLocaleString() &&
        this.store.parameters.DTE < new Date()
      ) {
        return true;
      } else {
        this.startCalc();
      }
    },
  },
  created() {
    if (this.checkEventStart(true)) this.showDialog = true;

    this.updateTime();
    setInterval(this.updateTime, 1000);
  },

  mounted() {
    this.costsMsg = this.$refs.msg;
    this.dialogMsg = "";
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  position: relative;
}

#clock {
  font-family: "Share Tech Mono", monospace;
  color: #ffffff;
  text-align: center;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1), 0 0 20px rgba(10, 175, 230, 0);
}
#msg {
  font-size: 30px;
}

.money-text {
  font-family: "Share Tech Mono", monospace;
  font-size: 80px; /* Aumente o tamanho do money para maior destaque */
  color: #ffd700;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 20px rgba(255, 215, 0, 0);
}

.time {
  letter-spacing: 0.05em;
  font-size: 50px;
  padding: 5px 0;
}

.date {
  letter-spacing: 0.1em;
  font-size: 20px;
}

.text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
.qdialog {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.qdialog-btt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.top-right {
  position: fixed;
  top: 40px;
  right: -55px;
  font-size: 24px; /* Ajuste conforme necessário */
  color: #fff; /* Cor do ícone */
  font-size: 200px !important;
  color: #ffd700;

  animation: global-piscar 4s ease infinite;
}
</style>

<style>
@keyframes global-piscar {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: 0;
  }
}
</style>
