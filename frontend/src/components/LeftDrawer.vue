<template>
  <q-toolbar class="bg-grey-4">
    <q-toolbar-title>Informações do projeto </q-toolbar-title>

    <q-btn
      icon="close"
      @click="fechar"
      color="grey-7
"
    >
      <q-tooltip> Fechar</q-tooltip>
    </q-btn>
  </q-toolbar>

  <div class="container">
    <!-- Campo de explicação de funcionamento do site -->
    <div class="explanation">
      <p>
        Você sabia que as reuniões podem ser uma grande fonte de desperdício de
        tempo e dinheiro nas organizações? Muitas vezes, as reuniões são longas,
        improdutivas, desnecessárias ou envolvem pessoas que não precisam estar
        presentes. Isso tem um preço, o MONETOMETRO foi criado pra te
        consientizar disso.
      </p>
      <p>
        Essa ferramenta irá mostrar o quanto um evento está custando em tempo
        real, baseado em dados públicos ou que você quiser informar nas
        configurações do evento. Essa ferramenta é uma forma de conscientizar
        você e sua equipe sobre o uso eficiente do tempo nas reuniões. Com ela,
        você pode planejar melhor as suas reuniões, definir objetivos claros,
        convidar apenas as pessoas essenciais, evitar distrações e interrupções,
        e avaliar os resultados alcançados. Assim, você pode otimizar o seu
        tempo, reduzir os custos e aumentar a produtividade da sua organização.
        Após usar essa ferramenta reflita nessa pergunta: o resultado desse
        evento valeu o gasto?
      </p>
      <p>
        Para um uso mais dinamico do MONETOMETRO recomendamos que use a versão
        automatizada. Ao criar o convite do seu evento adicione como
        participante o email <b>teste@teste.com</b>, feito isso você receberá um
        email com o link de seu evento no MONETOMETRO, no dia e hora do evento
        acesse o link para acompanhar em tempo real o custo do evento.
      </p>
      <p>
        Atualmente os emails dos domínios abaixo estão automatizados, então se
        sua lista de participantes possuir algum desses domínios de email o link
        enviado conterá a remuneração mensal disponibilizada no respectivo site
        de transparência.
      </p>
    </div>
    <!-- Quasar Timeline com 3 pontos -->
    <q-timeline>
      <q-timeline-entry subtitle="es.gov.br" side="left"
        >Fonte de dados:
        <a href="https://dados.es.gov.br">dados.es.gov.br</a></q-timeline-entry
      >
      <q-timeline-entry subtitle="sp.gov.br" side="right"></q-timeline-entry>
      <q-timeline-entry subtitle="rj.gov.br" side="right"></q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script>
export default {
  methods: {
    fechar() {
      this.$emit("fechar");
    },
  },
};
</script>

<style scoped>
.container {
  text-align: justify;
  padding: 20px 20px 20px 20px;
  font-size: 18px; /* Aumenta o tamanho das letras para 18px */
}
</style>
