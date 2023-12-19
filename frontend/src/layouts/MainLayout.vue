<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="custom-header">
      <q-toolbar>
        <q-toolbar-title> MONETOMETRO </q-toolbar-title>

        <div style="position: fixed; bottom: 0; left: 0">
          <q-btn
            flat
            round
            dense
            icon="info_outline"
            size="18pt"
            @click="toggleInfoDialog"
          >
            <q-tooltip> Informações </q-tooltip>
          </q-btn>
        </div>

        <q-btn
          flat
          round
          dense
          icon="schedule"
          size="md"
          class="q-mr-md"
          @click="toggleRightDrawer"
        >
          <q-tooltip> Editar evento </q-tooltip>
          <q-badge color="orange" floating>{{ participantsCount() }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="rightDrawerOpen"
      bordered
      content-class="bg-grey-1"
      side="right"
      :width="500"
    >
      <q-list>
        <RightDrawer @participants-updated="updateEventParticipants" />
      </q-list>
    </q-drawer>
    <q-dialog v-model="infoDialogOpen" full-height full-width>
      <q-card>
        <q-toolbar class="bg-grey-4">
          <q-toolbar-title>Informações do projeto </q-toolbar-title>

          <q-btn icon="close" @click="toggleInfoDialog" color="grey-7">
            <q-tooltip> Fechar</q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-card-section align="center" class="qdialog">
          <div class="container">
            <q-list>
              <q-item class="q-mb-md">
                <q-icon
                  name="thumb_down"
                  color="deep-orange"
                  class="info-icon"
                />
                <q-item-section class="flex-grow">
                  Você sabia que as reuniões podem ser uma grande fonte de
                  desperdício de tempo e dinheiro nas organizações? Muitas
                  vezes, as reuniões são longas, improdutivas, desnecessárias ou
                  envolvem pessoas que não precisam estar presentes. Isso tem um
                  preço, o MONETOMETRO foi criado para te consientizar disso.
                </q-item-section>
              </q-item>
              <q-item class="q-mb-md">
                <q-icon
                  name="tips_and_updates"
                  color="yellow-7
"
                  class="info-icon"
                />
                <q-item-section class="flex-grow">
                  Essa ferramenta irá mostrar o quanto um evento está custando
                  em tempo real, baseado em dados públicos ou que você quiser
                  informar nas configurações do evento. Essa ferramenta é uma
                  forma de conscientizar você e sua equipe sobre o uso eficiente
                  do tempo nas reuniões. Com uma equipe conscientizada você
                  poderá planejar melhor as suas reuniões, definir objetivos
                  claros, convidar apenas as pessoas essenciais, evitar
                  distrações e interrupções, e avaliar os resultados alcançados.
                  Assim, você pode otimizar o seu tempo, reduzir os custos e
                  aumentar a produtividade da sua organização. Após usar essa
                  ferramenta reflita nessa pergunta: "O resultado desse evento
                  valeu o gasto?"
                </q-item-section>
              </q-item>
              <q-item class="q-mb-md">
                <q-icon
                  name="electric_bolt"
                  size="md"
                  color="blue-8"
                  class="info-icon"
                />
                <q-item-section class="flex-grow"
                  ><p>
                    Para um uso mais dinamico do MONETOMETRO recomendamos que
                    use a versão automatizada. Ao criar o convite do seu evento
                    adicione como participante o email

                    <span class="code"
                      ><strong ref="copyText"
                        >agenda@monetometro.petaflop.net</strong
                      >
                      &nbsp;
                      <q-btn
                        icon="content_copy"
                        flat
                        round
                        dense
                        @click="copyToClipboard"
                      >
                        <q-tooltip
                          ><span ref="copyTooltip">Copiar</span></q-tooltip
                        >
                      </q-btn></span
                    >. Feito isso você receberá um email com o link de seu
                    evento no MONETOMETRO, no dia e hora do evento acesse o link
                    para acompanhar em tempo real o custo dele.
                  </p>
                </q-item-section>
              </q-item>

              <q-item class="q-mb-md">
                <q-icon name="manage_search" color="green" class="info-icon" />
                <q-item-section class="flex-grow">
                  <div class="explanation">
                    Atualmente os emails dos domínios abaixo estão
                    automatizados, então se sua lista de participantes possuir
                    algum desses domínios de email o link enviado conterá a
                    remuneração mensal disponibilizada no respectivo site de
                    transparência. Você também pode consultar a disponibilidade
                    do serviço de extração de dados do MONETOMETRO em cada
                    domínio, se online (<q-icon
                      name="cloud_done"
                      color="green"
                    />) ou indisponível (<q-icon
                      name="cloud_off"
                      color="red"
                    />).
                  </div>
                  <q-timeline color="dark">
                    <q-timeline-entry
                      v-for="(uf, index) in uniqueUFs"
                      :key="index"
                      :subtitle="uf"
                      side="left"
                      class="tm-content"
                    >
                      <q-list>
                        <q-item
                          v-for="(item, itemIndex) in itemsByUF(uf)"
                          :key="itemIndex"
                        >
                          <q-item-section avatar>
                            <q-icon :name="item.icon" :color="item.color" />
                            <q-tooltip v-if="!item.status"
                              >Monetometro INDISPONÍVEL</q-tooltip
                            >
                            <q-tooltip v-if="item.status"
                              >Monetometro ONLINE</q-tooltip
                            >
                          </q-item-section>
                          <q-item-section>
                            <q-item-label lines="1">
                              <a :href="item.link" target="_blank"
                                >{{ item.org }}
                                <q-tooltip
                                  >Clique para acessar a Fonte dos Dados em
                                  {{ item.link }}</q-tooltip
                                >
                              </a>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-timeline-entry>
                  </q-timeline>
                </q-item-section>
              </q-item>

              <q-item>
                <q-icon name="code" color="indigo" class="info-icon" />
                <q-item-section class="flex-grow">
                  <span>
                    Se você é desenvolvedor ou quer colaborar incluindo novas
                    fontes de dados públicos acesse a página do projeto no
                    <a href="https://gitbub.com">GitHub</a>.
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { useRoute } from "vue-router";

import { defineComponent, ref } from "vue";
import RightDrawer from "components/RightDrawer.vue";
import { useStore } from "../stores/store";

export default defineComponent({
  name: "MainLayout",

  components: {
    RightDrawer,
  },
  setup() {
    const route = useRoute();

    const store = useStore();
    const eventParticipants = ref(
      route.query.ATT ? JSON.parse(decodeURIComponent(route.query.ATT)) : []
    );
    const infoDialogOpen = ref(false);
    const rightDrawerOpen = ref(false);

    return {
      infoDialogOpen,
      rightDrawerOpen,
      store,
      eventParticipants,
      toggleInfoDialog() {
        infoDialogOpen.value = !infoDialogOpen.value;
      },
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
      items: [
        {
          org: "es.gov.br",
          link: "https://dados.es.gov.br",
          icon: "",
          color: "green",
          UF: "Espírito Santo",
        },
        {
          org: "tjes.jus.br",
          link: "http://www.tjes.jus.br/portal-da-transparencia/pessoal/folha-de-pagamento",
          icon: "",
          color: "red",
          UF: "Espírito Santo",
        },
        {
          org: "example.org",
          link: "https://example.org",
          icon: "",
          color: "green",
          UF: "São Paulo",
        },
        {
          org: "example.org",
          link: "https://example.org",
          icon: "",
          color: "green",
          UF: "Rio de Janeiro",
        },
        // Adicione mais itens conforme necessário
      ],
    };
  },
  computed: {
    uniqueUFs() {
      return [...new Set(this.items.map((item) => item.UF))];
    },
  },
  created() {
    // Chama a função de atualização a cada 5 minutos (300.000 milissegundos)
    setInterval(this.updateIcons, 30000);
    // Chama a função de atualização uma vez ao iniciar o componente
    this.updateIcons();
  },
  methods: {
    async updateIcons() {
      // Substitua isso pela sua lógica real de chamada à API
      // Aqui estou usando uma lógica aleatória para simular diferentes status
      this.items.forEach((item) => {
        item.status = Math.random() < 0.5; // 50% de chance de ser true ou false
        this.updateItemIcon(item);
      });
    },
    updateItemIcon(item) {
      item.icon = item.status ? "cloud_done" : "cloud_off";
      item.color = item.status ? "green" : "red";
    },
    itemsByUF(uf) {
      return this.items.filter((item) => item.UF === uf);
    },
    updateEventParticipants(newParticipants, CMH, DTE, DTI) {
      this.eventParticipants = newParticipants;
      this.store.parameters.CMH = CMH;
      this.store.parameters.DTE = DTE;
      this.store.parameters.DTI = DTI;
    },
    participantsCount() {
      return this.eventParticipants.length;
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.$refs.copyText.textContent);
        this.$refs.copyTooltip.textContent = "Copiado";
      } catch (err) {
        console.error("Erro ao copiar texto: ", err);
      }
    },
  },
});
</script>

<style scoped>
.custom-header {
  background-color: #000; /* Defina a cor que desejar aqui */
  /* Outras propriedades de estilo do cabeçalho, se necessário */
}
.container {
  text-align: justify;
  padding: 20px 20px 20px 20px;
  font-size: 18px; /* Aumenta o tamanho das letras para 18px */
}
.q-timeline__subtitle {
  font-size: 16px !important;
}
.tm-content {
  font-size: 14px;
}
.info-icon {
  padding-right: 10px;
  font-size: 50px !important;
}
.code {
  display: inline-block !important;
  padding: 0 0.4em !important;
  border: 1px solid rgba(0, 0, 0, 0.25) !important;
  background-color: #eaeaea !important;
  font-size: 0.9em !important;
  border-radius: 0.25rem !important;
}
</style>
