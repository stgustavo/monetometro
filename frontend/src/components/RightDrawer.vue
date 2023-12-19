<template>
  <div id="app">
    <span class="section-title">
      <q-icon name="schedule"></q-icon> Dados do Evento</span
    >
    <q-form @submit.prevent="onSubmit">
      <div class="q-pa-md">
        <q-card class="q-ma-md">
          <q-card-section>
            <DatetimePicker
              v-model="store.parameters.DTI"
              @update:modelValue="updateDTI"
              label="Data de Início do Evento (DTI)"
            />
          </q-card-section>
        </q-card>

        <q-card class="q-ma-md">
          <q-card-section>
            <DatetimePicker
              v-model="store.parameters.DTE"
              @update:modelValue="updateDTE"
              label="Data de Término do Evento (DTE)"
            />
          </q-card-section>
        </q-card>

        <q-card class="q-ma-md">
          <q-card-section>
            <div>
              <q-input
                label="Email do participante"
                v-model="newParticipant.email"
                type="email"
              >
                <template v-slot:before>
                  <q-icon name="alternate_email" />
                </template>
              </q-input>
              <q-input
                label="Remuneração mensal média (RMM)"
                v-model="newParticipant.value"
                type="number"
              >
                <template v-slot:before>
                  <q-icon name="payments" />
                </template>
              </q-input>
              <q-btn
                @click="addParticipant"
                label="Adicionar Participante"
                color="blue-4"
              /><br /><br />
            </div>
            <q-table
              rows-per-page-label="Registros por página"
              :rows-per-page-options="[5, 10, 15]"
              v-model:pagination="pagination"
              :rows="participants"
              :columns="columns"
              row-key="id"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="email" :props="props">
                    {{ props.row.email }}
                  </q-td>
                  <q-td key="value" :props="props">
                    {{ props.row.value }}
                  </q-td>
                  <q-td auto-width>
                    <q-btn
                      round
                      tooltip="teste"
                      icon="edit"
                      color="blue-4"
                      size="12px"
                      @click="editParticipant(props.row)"
                    >
                      <q-tooltip> Editar participante </q-tooltip> </q-btn
                    >&nbsp;
                    <q-btn
                      round
                      icon="delete"
                      color="negative"
                      size="12px"
                      @click="deleteParticipant(props.row)"
                    >
                      <q-tooltip> Excluir participante </q-tooltip>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-card class="q-ma-md">
          <q-card-section>
            <q-input
              label="Custo Médio por Hora (CMH)"
              v-model="store.parameters.CMH"
              readonly
            >
              <template v-slot:before>
                <q-icon name="attach_money" />
              </template>
            </q-input>
          </q-card-section>
        </q-card>
      </div>
      <q-btn type="submit" color="primary">Salvar Evento</q-btn>
    </q-form>
  </div>
</template>

<script>
import DatetimePicker from "../components/DatetimePicker.vue";
import { useStore } from "../stores/store";

import { useRoute } from "vue-router";

import { ref } from "vue";

export default {
  name: "App",
  components: { DatetimePicker },
  setup() {
    const route = useRoute();
    const store = useStore();

    const now = new Date();

    store.parameters.DTI = new Date(route.query.DTI ? route.query.DTI : now);
    store.parameters.DTE = new Date(route.query.DTE ? route.query.DTE : now);
    store.parameters.CMH = parseFloat(route.query.CMH ?? 0) || 0; // Garante que CMH seja um número

    // Retornar as variáveis e outras coisas que você precisa no setup
    return {
      store,
      newParticipant: ref({
        email: "",
        value: 0,
      }),
      participants: ref(
        route.query.ATT ? JSON.parse(decodeURIComponent(route.query.ATT)) : []
      ),
      pagination: { sortBy: "email", descending: false },
      columns: [
        {
          name: "email",
          required: true,
          label: "Email",
          align: "left",
          field: "email",
          sortable: true,
        },
        {
          name: "value",
          required: true,
          label: "RMM",
          align: "left",
          field: "value",
          sortable: true,
        },
        { name: "actions", label: "Ações", align: "center", field: "actions" },
      ],
    };
  },
  watch: {
    participants: {
      handler(newParticipants) {
        this.updateParticipants();
      },
      deep: true, // Observar alterações profundas na lista de participantes
    },
  },
  methods: {
    updateDTI(value) {
      this.store.parameters.DTI = value;
    },
    updateDTE(value) {
      this.store.parameters.DTE = value;
    },
    updateParticipants() {
      this.calcularCMH();

      this.$emit(
        "participants-updated",
        this.participants,
        this.store.parameters.CMH,
        this.store.parameters.DTE,
        this.store.parameters.DTI
      );
      console.log('Evento "participants-updated" emitido no RightDrawer');
    },
    addParticipant() {
      if (this.newParticipant.email && this.newParticipant.value > 0) {
        const existingParticipant = this.participants.find(
          (p) => p.email === this.newParticipant?.email
        );
        if (existingParticipant) {
          // Atualizar o participante existente
          existingParticipant.email = this.newParticipant.email;
          existingParticipant.value = this.newParticipant.value;
        } else {
          // Inserir um novo participante
          this.participants.push({
            id: this.participants.length + 1,
            email: this.newParticipant.email,
            value: this.newParticipant.value,
          });
        }

        this.newParticipant.email = "";
        this.newParticipant.value = 0;
      }
    },
    editParticipant(participant) {
      this.newParticipant.email = participant.email;
      this.newParticipant.value = participant.value;
      this.newParticipant.id = participant.id;

      console.log("Editando participante:", participant);
    },
    deleteParticipant(participant) {
      const index = this.participants.indexOf(participant);
      if (index !== -1) {
        this.participants.splice(index, 1);
      }
    },

    calcularCMH() {
      const horasUteisNoPeriodo = 168; //média de 21 dias úteis, 8 horas trabalhadas por dia
      if (this.participants.length > 0) {
        const totalSalarios = this.participants.reduce(
          (total, participant) => total + parseFloat("0" + participant.value),
          0
        );

        // Calcula o CMH considerando a quantidade total de horas úteis no período
        this.store.parameters.CMH = (
          totalSalarios / horasUteisNoPeriodo
        ).toFixed(2);
      } else {
        // Caso não haja participantes, o CMH é 0
        this.store.parameters.CMH = 0;
      }
    },

    onSubmit() {
      // Envie os dados do evento, incluindo os participantes, quando o formulário for enviado
      console.log("Dados do evento:", {
        DTI: this.store.parameters.DTI.toISOString(),
        DTE: this.store.parameters.DTE.toISOString(),
        participants: this.participants,
        CMH: this.store.parameters.CMH,
      });
      this.updateParticipants();
      this.$router
        .push({
          path: this.$route.path,
          query: {
            DTE: this.store.parameters.DTE.toISOString(),
            DTI: this.store.parameters.DTI.toISOString(),
            CMH: this.store.parameters.CMH,
            ATT: encodeURIComponent(JSON.stringify(this.participants)),
            ID: this.store.parameters.ID,
          },
        })
        .then(() => {
          this.$router.go(0);
        });
    },
  },
  mounted() {
    this.calcularCMH();
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
  margin-top: 60px;
}

.section-title {
  font-size: 25pt;
}
</style>
