export const exerciseCategories = ['Todos', 'Pescoço', 'Ombros', 'Coluna', 'Pernas', 'Punhos', 'Pausa ativa']

export const exercises = [
  {
    id: 'cervical',
    title: 'Alongamento Cervical',
    category: 'Pescoço',
    duration: 120,
    tag: '2 MIN',
    icon: 'neck',
    gradient: 'from-brand-400 to-brand-600',
    description:
      'Alivia a tensão do pescoço após longas horas ao volante. Ideal a cada 2 horas de direção.',
    steps: [
      'Sente-se ereto com os dois pés no chão e os ombros relaxados.',
      'Incline a cabeça lentamente em direção ao ombro direito até sentir um leve estiramento.',
      'Segure por 20 segundos, respirando fundo.',
      'Volte ao centro e repita para o lado esquerdo.',
      'Repita o ciclo completo por 2 minutos.',
    ],
    tips: [
      'Nunca force além do ponto de conforto.',
      'Mantenha o queixo levemente recolhido, como se fosse fazer um queixo duplo.',
      'Solte o ar ao esticar, não segure a respiração.',
    ],
  },
  {
    id: 'ombros',
    title: 'Rotação de Ombros',
    category: 'Ombros',
    duration: 120,
    tag: '2 MIN',
    icon: 'shoulder',
    gradient: 'from-navy-500 to-navy-700',
    description:
      'Movimenta e solta os ombros, reduzindo a rigidez de manter o volante firme por horas.',
    steps: [
      'Sentado ou em pé, deixe os braços soltos ao lado do corpo.',
      'Eleve os ombros em direção às orelhas e segure por 5 segundos.',
      'Empurre os ombros para trás e para baixo, juntando as escápulas.',
      'Faça círculos grandes com os ombros para trás (10 vezes) e depois para frente.',
      'Finalize abraçando o próprio corpo, alongando as costas por 20 segundos.',
    ],
    tips: [
      'Faça isso enquanto espera em um posto ou em paradas obrigatórias.',
      'Preste atenção para não arquear a lombar durante o movimento.',
    ],
  },
  {
    id: 'lombar',
    title: 'Torção Lombar Sentada',
    category: 'Coluna',
    duration: 180,
    tag: '3 MIN',
    icon: 'spine',
    gradient: 'from-choco-400 to-choco-600',
    description:
      'Alongamento que alivia a tensão da lombar acumulada na posição sentada prolongada.',
    steps: [
      'Sente-se na ponta do assento com a coluna bem ereta.',
      'Gire o tronco para a direita, apoiando a mão esquerda no joelho direito.',
      'Coloque a outra mão no encosto do banco ou no apoio de braço.',
      'Segure a posição por 25 segundos respirando devagar.',
      'Volte ao centro e repita para o lado esquerdo. Complete por 3 minutos.',
    ],
    tips: [
      'Evite girar o pescoço junto — mantenha o olhar na linha do ombro.',
      'Se sentir dor aguda, reduza a amplitude e procure orientação.',
    ],
  },
  {
    id: 'panturrilha',
    title: 'Ativação de Panturrilha',
    category: 'Pernas',
    duration: 120,
    tag: '2 MIN',
    icon: 'legs',
    gradient: 'from-danger-400 to-danger-600',
    description:
      'Ativa a circulação das pernas e combate o inchaço e o risco de trombose em viagens longas.',
    steps: [
      'Em pé, apoie as mãos na lateral do veículo ou em uma superfície firme.',
      'Suba na ponta dos pés, segurando por 3 segundos, e desça devagar.',
      'Repita 15 vezes com os joelhos levemente flexionados.',
      'Depois, levante alternadamente os joelhos (marcha estacionária) por 30 segundos.',
      'Alongue a panturrilha apoiando o pé na roda: calcanhar no chão, joelho esticado.',
    ],
    tips: [
      'Esse exercício é essencial para a circulação — faça a cada parada.',
      'Beba água ao finalizar para ajudar na circulação.',
    ],
  },
  {
    id: 'quadris',
    title: 'Alongamento de Quadris',
    category: 'Pernas',
    duration: 180,
    tag: '3 MIN',
    icon: 'hip',
    gradient: 'from-brand-500 to-choco-600',
    description:
      'Solta a musculatura do quadril e do glúteo, muito tensionada por horas sentado.',
    steps: [
      'Em pé, apoie-se em uma superfície firme.',
      'Cruce o tornozelo direito sobre o joelho esquerdo (posição 4).',
      'Flexione o joelho esquerdo, levando o quadril para trás como se fosse sentar.',
      'Segure por 20 a 30 segundos, mantendo a coluna reta.',
      'Troque de lado e repita. Complete por 3 minutos.',
    ],
    tips: [
      'Se perder o equilíbrio, mantenha-se perto do veículo.',
      'Respire fundo e relaxe o rosto e os ombros.',
    ],
  },
  {
    id: 'punhos',
    title: 'Punhos e Mãos',
    category: 'Punhos',
    duration: 120,
    tag: '2 MIN',
    icon: 'hands',
    gradient: 'from-emerald-400 to-emerald-600',
    description:
      'Previne LER/DORT nas mãos e punhos, exigidos constantemente no câmbio e no volante.',
    steps: [
      'Estique o braço à frente com a palma para cima.',
      'Com a outra mão, puxe delicadamente os dedos para baixo até sentir o estiramento.',
      'Segure por 15 segundos e repita com a palma para baixo.',
      'Abra e feche os dedos com força por 20 repetições.',
      'Gire os punhos em círculos para os dois lados.',
    ],
    tips: [
      'Excelente para fazer durante a pausa no pedágio.',
      'Não force se sentir formigamento intenso ou dor.',
    ],
  },
  {
    id: 'descompressao',
    title: 'Descompressão da Coluna',
    category: 'Coluna',
    duration: 180,
    tag: '3 MIN',
    icon: 'stretch',
    gradient: 'from-sky-400 to-navy-600',
    description:
      'Ajuda a aliviar a pressão sobre os discos da coluna após longos trechos sentado.',
    steps: [
      'Em pé, afaste os pés na largura dos ombros.',
      'Entrelace as mãos atrás da cabeça e alongue o tronco para cima.',
      'Incline-se lentamente para os lados, primeiro à direita, depois à esquerda.',
      'Depois, incline-se para frente deixando os braços pendentes por 20 segundos.',
      'Retorne devagar, empilhando vértebra por vértebra.',
    ],
    tips: [
      'Ao voltar, flexione levemente os joelhos para proteger a lombar.',
      'Nunca faça movimentos bruscos de torção.',
    ],
  },
  {
    id: 'pausa-completa',
    title: 'Pausa Ativa Completa',
    category: 'Pausa ativa',
    duration: 300,
    tag: '5 MIN',
    icon: 'full',
    gradient: 'from-brand-400 to-danger-500',
    description:
      'Sequência completa: pescoço, ombros, coluna e pernas. O ritual ideal de cada parada.',
    steps: [
      '1º minuto: alongamento cervical e rotação de ombros.',
      '2º minuto: torção lombar sentada e descompressão da coluna.',
      '3º minuto: ativação de panturrilha e marcha estacionária.',
      '4º minuto: alongamento de quadris e punhos.',
      '5º minuto: respiração profunda (inspire 4s, segure 4s, solte 6s) caminhando um pouco.',
    ],
    tips: [
      'Programe o timer para fazer isso a cada 2 horas de direção.',
      'Complete com um copo de água — hidratação e movimento andam juntos.',
    ],
  },
]

export const articleCategories = ['Todos', 'Ergonomia', 'Saúde', 'Qualidade de Vida']

export const articles = [
  {
    id: 'ergonomia-cabine',
    category: 'Ergonomia',
    title: 'Ajuste do banco e do volante: sua postura no comando',
    summary:
      'Um banco mal ajustado transforma cada quilômetro em sobrecarga para a coluna. Aprenda o ajuste certo em 4 passos.',
    readTime: '3 min de leitura',
    icon: 'seat',
    color: 'bg-brand-100 text-brand-700',
    body: [
      {
        heading: 'Por que isso importa',
        text: 'Dirigir por horas mantém a coluna em carga estática. Um banco inadequado aumenta a pressão nos discos lombares e favorece dores que se tornam crônicas. O ajuste correto é a primeira linha de prevenção de LER/DORT.',
      },
      {
        heading: 'Passo 1 — Altura e distância do banco',
        text: 'Ajuste o banco para que os pés alcancem os pedais com os joelhos levemente flexionados (entre 90° e 120°). O quadril deve ficar um pouco mais alto que os joelhos. Não estique a perna totalmente para alcançar a embreagem.',
      },
      {
        heading: 'Passo 2 — Encosto e apoio lombar',
        text: 'Regule o encosto para ficar com o tronco levemente inclinado (cerca de 100° a 110°). O apoio lombar deve tocar a região da cintura. Se o banco não tiver, use uma almofada pequena ou um casaco dobrado.',
      },
      {
        heading: 'Passo 3 — Volante',
        text: 'Posicione o volante de modo que os braços fiquem levemente flexionados (cerca de 120°) na posição “9h15”. Os pulsos devem permanecer alinhados e relaxados, nunca esticados para cima.',
      },
      {
        heading: 'Passo 4 — Retrovisores e cabeça',
        text: 'Ajuste os retrovisores sem torcer o corpo. A cabeça deve ficar apoiada (ou muito próxima) no encosto, e o topo do cinto não deve tocar o pescoço.',
      },
      {
        heading: 'Dica rápida',
        text: 'Faça microajustes a cada parada. Alternar o apoio das mãos no volante e fazer pausas ativas de 2 minutos a cada 2 horas reduz muito a carga na coluna.',
      },
    ],
  },
  {
    id: 'hidratacao',
    category: 'Saúde',
    title: 'Hidratação na estrada: água também é combustível',
    summary:
      'A desidratação reduz o foco, aumenta a fadiga e piora dores musculares. Veja quanto e como beber água durante a viagem.',
    readTime: '3 min de leitura',
    icon: 'droplet',
    color: 'bg-sky-100 text-sky-700',
    body: [
      {
        heading: 'O impacto no corpo',
        text: 'Perda de 1% a 2% do peso corporal em água já compromete a atenção e a coordenação. No trânsito, isso significa mais tempo de reação — um risco direto à segurança.',
      },
      {
        heading: 'Quanto beber',
        text: 'A recomendação geral é de 2 a 3 litros por dia para adultos. Em viagens, conte 200 a 250 ml por hora dirigida. O calor da cabine e a direção exigem ainda mais.',
      },
      {
        heading: 'Como organizar',
        text: 'Tenha uma garrafa ao alcance e beba em pequenos goles a cada pausa. Evite exagerar logo antes de dormir para não quebrar o sono — e jamais substitua água por café ou refrigerante.',
      },
      {
        heading: 'Sinais de atenção',
        text: 'Urina escura, boca seca, dor de cabeça, tontura e cansaço fora do comum podem indicar desidratação. Nessas situações, pare em um local seguro e hidrate-se antes de continuar.',
      },
    ],
  },
  {
    id: 'alongamentos-paradas',
    category: 'Ergonomia',
    title: 'Alongamentos rápidos para cada parada',
    summary:
      '5 movimentos de até 2 minutos que você faz ao lado do veículo e chega no destino mais leve.',
    readTime: '4 min de leitura',
    icon: 'activity',
    color: 'bg-emerald-100 text-emerald-700',
    body: [
      {
        heading: 'Por que alongar na parada',
        text: 'O corpo foi feito para se movimentar. Horas sentado encurtam a musculatura posterior da perna e sobrecarregam a lombar. Alongar reduz dor, melhora a circulação e renova a atenção.',
      },
      {
        heading: '1. Pescoço e ombros (1 min)',
        text: 'Incline a cabeça para cada lado por 20 segundos e faça círculos de ombro. Direcione a atenção para soltar a tensão acumulada no volante.',
      },
      {
        heading: '2. Lombar (1 min)',
        text: 'Em pé, coloque as mãos na lombar e estenda o tronco levemente para trás. Depois, incline para frente com os joelhos flexionados, deixando os braços pendentes.',
      },
      {
        heading: '3. Pernas (1 min)',
        text: 'Apoie o pé na roda ou no degrau e alongue a parte de trás da coxa. Em seguida, suba na ponta dos pés 15 vezes para ativar a panturrilha.',
      },
      {
        heading: '4. Quadris (1 min)',
        text: 'Cruce o tornozelo sobre o joelho oposto (posição 4) e flexione o outro joelho, levando o quadril para trás. Segure 30 segundos de cada lado.',
      },
      {
        heading: '5. Respiração (1 min)',
        text: 'Termine com respiração lenta: inspire pelo nariz contando 4, segure 4 e solte pela boca contando 6. Isso reduz o cortisol e acalma o sistema nervoso.',
      },
    ],
  },
  {
    id: 'cardiovascular',
    category: 'Saúde',
    title: 'Coração de motorista: previna doenças cardiovasculares',
    summary:
      'O sedentarismo e o estresse da estrada pesam no coração. Pequenos hábitos fazem grande diferença.',
    readTime: '4 min de leitura',
    icon: 'heart',
    color: 'bg-rose-100 text-rose-700',
    body: [
      {
        heading: 'O cenário',
        text: 'A profissão de motorista combina longos períodos sentado, alimentação irregular e estresse. Essa combinação aumenta o risco de pressão alta, colesterol elevado e doenças do coração.',
      },
      {
        heading: 'Movimente-se sempre que puder',
        text: 'Acumule pelo menos 30 minutos de movimento por dia. Cada pausa conta: 5 minutos de caminhada ou exercícios ativos em cada parada já melhoram o retorno venoso e o controle da glicemia.',
      },
      {
        heading: 'Cuide da pressão',
        text: 'Meça a pressão regularmente nos postos de saúde das rodovias. Fique atento a dores no peito, falta de ar e palpitações — esses sintomas merecem avaliação médica imediata.',
      },
      {
        heading: 'Alimentação e sono',
        text: 'Prefira refeições leves e ricas em fibras, evite frituras e doces em excesso. O sono de 7 a 8 horas protege o coração tanto quanto o exercício.',
      },
      {
        heading: 'Quando buscar ajuda',
        text: 'Dores no peito, formigamento no braço esquerdo, suor frio e náuseas podem ser sinais de infarto. Chame o SAMU (192) imediatamente — cada minuto conta.',
      },
    ],
  },
  {
    id: 'sono',
    category: 'Qualidade de Vida',
    title: 'Sono de motorista: o descanso que salva vidas',
    summary:
      'A sonolência ao volante é tão perigosa quanto dirigir alcoolizado. Aprenda a proteger suas noites de sono.',
    readTime: '4 min de leitura',
    icon: 'moon',
    color: 'bg-indigo-100 text-indigo-700',
    body: [
      {
        heading: 'O risco real',
        text: 'Ficar 24 horas sem dormir reduz os reflexos de forma semelhante ao efeito do álcool. Microdesligamentos de 3 a 5 segundos podem custar vidas na estrada.',
      },
      {
        heading: 'Proteja o horário de dormir',
        text: 'O corpo funciona melhor com rotina. Tente deitar sempre próximo do mesmo horário e garanta 7 a 8 horas de sono, mesmo que em turnos. Escureça o ambiente e evite telas na hora de dormir.',
      },
      {
        heading: 'Evite o “efeito rebote” da cafeína',
        text: 'Café ajuda, mas tem prazo: o efeito dura de 4 a 6 horas. Não tome café nas últimas 6 horas antes de deitar, senão o sono fica raso e você acorda cansado.',
      },
      {
        heading: 'Reconheça os sinais de fadiga',
        text: 'Piscar muito, bocejar constantemente, desviar da faixa, perder o ritmo da música — pare no próximo ponto seguro. Uma soneca de 20 minutos recupera mais do que um café.',
      },
    ],
  },
  {
    id: 'alimentacao',
    category: 'Saúde',
    title: 'Alimentação saudável dentro e fora da estrada',
    summary:
      'Como montar marmitas e escolher lanches inteligentes em postos sem sabotar a energia da viagem.',
    readTime: '3 min de leitura',
    icon: 'apple',
    color: 'bg-orange-100 text-orange-700',
    body: [
      {
        heading: 'Planeje antes de sair',
        text: 'Quem define o que vai comer antes da viagem tem menos chance de cair nas tentações do posto. Monte marmitas com arroz integral, proteína magra e bastante salada.',
      },
      {
        heading: 'Lanches que ajudam',
        text: 'Frutas (principalmente banana e maçã), castanhas, iogurte natural e ovos cozidos são práticos, saciam e dão energia estável. Evite biscoitos recheados, frituras e refrigerantes.',
      },
      {
        heading: 'Comendo em restaurantes de posto',
        text: 'Prefira grelhados, assados e cozidos. Monte um prato colorido: metade salada, um quarto proteína e um quarto carboidrato. Controle o sal — a hipertensão é comum na categoria.',
      },
      {
        heading: 'Intervalos entre refeições',
        text: 'Comer em horários regulares evita picos de glicose e quedas de energia. Se sentir muita fome no meio do trecho, faça um lanche leve em vez de esperar a fome extrema.',
      },
    ],
  },
  {
    id: 'estresse',
    category: 'Qualidade de Vida',
    title: 'Controle do estresse: a mente em dia na cabine',
    summary:
      'Trânsito, prazo e solidão: o estresse do motorista tem nome e tratamento. Aprenda técnicas de 3 minutos.',
    readTime: '4 min de leitura',
    icon: 'brain',
    color: 'bg-violet-100 text-violet-700',
    body: [
      {
        heading: 'Reconheça o estresse',
        text: 'Irritação fácil, tensão no maxilar, ombros travados, batimentos acelerados e pensamentos em loop são sinais de estresse agudo. Ignorá-los aumenta o risco de acidentes e de adoecimento.',
      },
      {
        heading: 'Técnica 3-3-3-3',
        text: 'Olhe 3 coisas que você vê, identifique 3 sons que ouve, mova 3 partes do corpo e respire 3 vezes fundo. Em 60 segundos você interrompe a reação de “luta ou fuga”.',
      },
      {
        heading: 'Respiração do cofre',
        text: 'Inspire pelo nariz contando 4, segure contando 4 e solte pela boca contando 6. Repita por 3 minutos na parada. Isso ativa o sistema nervoso parassimpático e reduz a ansiedade.',
      },
      {
        heading: 'Fale sobre isso',
        text: 'A solidão da estrada pesa. Ligue para familiares, use o app para registrar como se sente e, se a tristeza ou a ansiedade persistirem, procure um profissional. Saúde mental é saúde.',
      },
    ],
  },
]


