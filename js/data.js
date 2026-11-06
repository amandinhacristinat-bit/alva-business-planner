// Dados padrão e configurações iniciais da ALVA Business Planner
const ALVA_DEFAULT_DATA = {
  company: {
    name: "ALVA",
    tagline: "Beleza Iluminada & Gestão Inteligente",
    mission: "Criar cosméticos de alta performance com formulações limpas, sensoriais nobres e transparência de custos do laboratório até a consumidora final.",
    segment: "Cosméticos & Beleza Premium",
    currency: "BRL",
    taxRegime: "Simples Nacional (Comércio - Faixa 1)",
    taxRate: 6.0, // %
    fixedMonthlyCosts: 4500.0,
    availableCapital: 45000.0
  },
  staff: [
    {
      id: "user-1",
      name: "Amanda Cristina",
      email: "amanda@alvabeauty.com.br",
      role: "Fundadora & Head de Novos Negócios",
      permission: "admin",
      avatarInitials: "AC",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      password: "alva"
    },
    {
      id: "user-2",
      name: "Carlos Eduardo",
      email: "carlos.financas@alvabeauty.com.br",
      role: "Analista Financeiro & Controladoria",
      permission: "finance",
      avatarInitials: "CE",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      password: "alva"
    },
    {
      id: "user-3",
      name: "Dra. Sofia Vasconcelos",
      email: "sofia.pd@alvabeauty.com.br",
      role: "Especialista em P&D e Regulatório ANVISA",
      permission: "rnd",
      avatarInitials: "SV",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      password: "alva"
    }
  ],
  products: [
    // 1. PRODUTO 1: LIP GLOSS 3 CORES (PRODUTO CARRO-CHEFE)
    {
      id: "prod-lipgloss-01",
      name: "ALVA Glaze — Lip Gloss Hidratante Plump",
      category: "Maquiagem Labial",
      volume: "4.5 ml",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      status: "Em Análise de Viabilidade",
      stage: 2,
      tagline: "Efeito espelhado e volume imediato com ácido hialurônico",
      description: "Gloss com microesferas de ácido hialurônico, vitamina E, efeito plump volumizador e sensorial aveludado sem grudar.",
      plannedBatch: 3000,
      variants: [
        {
          id: "var-01",
          sku: "ALVA-LG-01",
          name: "Cristal Glow #01",
          colorCode: "#F5E6E8",
          textColor: "#6B3343",
          finish: "Translúcido perolado com micropartículas refletoras",
          scent: "Baunilha Nobre",
          shareOfBatch: 30,
          rawMaterialCostExtra: 0.0,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-02",
          sku: "ALVA-LG-02",
          name: "Nude Velvet #02",
          colorCode: "#D98E85",
          textColor: "#FFFFFF",
          finish: "Nude rosado clássico com cobertura média espelhada",
          scent: "Pêssego & Caramelo",
          shareOfBatch: 45,
          rawMaterialCostExtra: 0.15,
          image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-03",
          sku: "ALVA-LG-03",
          name: "Berry Bloom #03",
          colorCode: "#9B3855",
          textColor: "#FFFFFF",
          finish: "Amora vibrante com efeito tint e hidratação profunda",
          scent: "Frutas Vermelhas Silvestres",
          shareOfBatch: 25,
          rawMaterialCostExtra: 0.25,
          image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
        }
      ],
      bom: [
        { id: "bom-1", name: "Frasco Acrílico Cristal 4.5ml Premium", category: "Embalagem Primária", unitCost: 2.80, supplier: "PackBeauty S/A", notes: "Paredes grossas, visual de vidro" },
        { id: "bom-2", name: "Tampa Dourada Metalizada c/ Aplicador Big Doe Foot Siliconado", category: "Embalagem Primária", unitCost: 1.40, supplier: "PackBeauty S/A", notes: "Pincel macio de precisão" },
        { id: "bom-3", name: "Granel Fórmula Base Plump + Ácido Hialurônico", category: "Fórmula / Granel", unitCost: 1.85, supplier: "LabBeauté Terceirização", notes: "4.5g de massa dermatologicamente testada" },
        { id: "bom-4", name: "Pigmentos Cosméticos e Micas Tratadas (Média)", category: "Fórmula / Granel", unitCost: 0.65, supplier: "LabBeauté Terceirização", notes: "Grau cosmético farmacêutico" },
        { id: "bom-5", name: "Serviço de Envase, Rotulagem e Selagem", category: "Mão de Obra / Envase", unitCost: 1.20, supplier: "LabBeauté Terceirização", notes: "Sala limpa certificada ANVISA" },
        { id: "bom-6", name: "Cartucho Individual (Caixa 350g, Soft Touch, Hot Stamping)", category: "Embalagem Secundária", unitCost: 1.35, supplier: "Gráfica LuxPack", notes: "Acabamento premium toque aveludado" },
        { id: "bom-7", name: "Lacre de Segurança Termoencolhível", category: "Embalagem Secundária", unitCost: 0.20, supplier: "PackBeauty S/A", notes: "Exigência de inviolabilidade" },
        { id: "bom-8", name: "Caixa de Embarque Master c/ Colmeia (Rateio)", category: "Transporte / Logística", unitCost: 0.35, supplier: "Gráfica LuxPack", notes: "Para caixas com 48 unidades" }
      ],
      setupCosts: [
        { id: "setup-1", description: "Notificação / Registro ANVISA Grau 2", cost: 1400.0, paid: true },
        { id: "setup-2", description: "Testes Dermatológicos e de Estabilidade Acelerada", cost: 4200.0, paid: false },
        { id: "setup-3", description: "Clichês e Facas de Corte para Cartuchos Gráficos", cost: 1600.0, paid: false },
        { id: "setup-4", description: "Responsável Técnico Químico / RT Inicial", cost: 1500.0, paid: false },
        { id: "setup-5", description: "Lote Piloto de Amostras para Fotografia e Testes de Bancada", cost: 950.0, paid: true }
      ],
      pricingChannels: [
        { id: "channel-d2c", name: "E-commerce Oficial (D2C)", icon: "shopping-bag", active: true, targetPrice: 59.90, expectedSalesShare: 50, taxPercent: 6.0, gatewayPercent: 3.8, shippingPackagingCost: 4.50, marketingCacEstimate: 12.00, platformFeePercent: 0.0 },
        { id: "channel-marketplace", name: "Marketplaces (Shopee / Mercado Livre / TikTok)", icon: "store", active: true, targetPrice: 64.90, expectedSalesShare: 30, taxPercent: 6.0, gatewayPercent: 0.0, shippingPackagingCost: 3.50, marketingCacEstimate: 0.0, platformFeePercent: 18.0 },
        { id: "channel-b2b", name: "Atacado / Salões de Beleza / Boutiques (B2B)", icon: "truck", active: true, targetPrice: 32.90, expectedSalesShare: 20, taxPercent: 6.0, gatewayPercent: 1.5, shippingPackagingCost: 0.80, marketingCacEstimate: 2.00, platformFeePercent: 0.0 }
      ],
      suppliers: [
        { id: "sup-1", name: "LabBeauté Indústria Cosmética", type: "Terceirista Full Service (Fórmula + Envase)", city: "Vinhedo - SP", anvisaStatus: "Certificada Grau 1 e Grau 2", moq: 3000, leadTimeDays: 45, unitCostFull: 9.80, paymentTerms: "40% pedido / 30% embarque / 30% 30 DDL", qualityRating: 5, recommended: true, notes: "Sensorial aveludado impecável e estabilidade garantida." },
        { id: "sup-2", name: "Inovapack Cosméticos & Embalagens", type: "Envase & Frascos", city: "Diadema - SP", anvisaStatus: "Certificada Grau 1 e Grau 2", moq: 1500, leadTimeDays: 30, unitCostFull: 11.20, paymentTerms: "50% entrada / 50% entrega", qualityRating: 4, recommended: false, notes: "MOQ menor ideal para testes rápidos." }
      ]
    },

    // 2. PRODUTO 2: BLUSH LÍQUIDO ILUMINADOR COM NIACINAMIDA
    {
      id: "prod-blush-02",
      name: "ALVA Silk Veil — Blush Líquido com Niacinamida",
      category: "Maquiagem Facial & Glow",
      volume: "12 ml",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      status: "Em Orçamento",
      stage: 2,
      tagline: "Cor radiante e tratamento com niacinamida para bochechas esculpidas",
      description: "Blush sérum híbrido de alta fixação, fusão instantânea na pele sem marcar texturas e acabamento segunda pele iluminado.",
      plannedBatch: 2500,
      variants: [
        {
          id: "var-blush-01",
          sku: "ALVA-BL-01",
          name: "Peach Satin #01",
          colorCode: "#E8927C",
          textColor: "#FFFFFF",
          finish: "Pêssego dourado luminoso com partículas peroladas",
          scent: "Floral Suave",
          shareOfBatch: 35,
          rawMaterialCostExtra: 0.10,
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-blush-02",
          sku: "ALVA-BL-02",
          name: "Rose Petal #02",
          colorCode: "#D46F84",
          textColor: "#FFFFFF",
          finish: "Rosa chá elegante de efeito rubor natural e saudável",
          scent: "Rosas Brancas",
          shareOfBatch: 40,
          rawMaterialCostExtra: 0.15,
          image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-blush-03",
          sku: "ALVA-BL-03",
          name: "Golden Bronze #03",
          colorCode: "#B5734C",
          textColor: "#FFFFFF",
          finish: "Terracota bronzeado com brilho solar acetinado",
          scent: "Âmbar & Baunilha",
          shareOfBatch: 25,
          rawMaterialCostExtra: 0.20,
          image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80"
        }
      ],
      bom: [
        { id: "bom-b1", name: "Frasco Vidro Fosco 12ml c/ Conta-gotas Soft Touch", category: "Embalagem Primária", unitCost: 4.20, supplier: "PackBeauty S/A", notes: "Design luxo tipo sérum" },
        { id: "bom-b2", name: "Granel Blush Sérum Base c/ Niacinamida 3%", category: "Fórmula / Granel", unitCost: 2.40, supplier: "LabBeauté Terceirização", notes: "Sensorial aveludado não comedogênico" },
        { id: "bom-b3", name: "Dispersão de Pigmentos e Micas Revestidas", category: "Fórmula / Granel", unitCost: 0.90, supplier: "LabBeauté Terceirização", notes: "Alta dispersão em óleo leve" },
        { id: "bom-b4", name: "Envase Especializado e Fechamento a Vácuo", category: "Mão de Obra", unitCost: 1.40, supplier: "LabBeauté Terceirização", notes: "Controle estrito de viscosidade" },
        { id: "bom-b5", name: "Cartucho Individual c/ Berço Protetor", category: "Embalagem Secundária", unitCost: 1.60, supplier: "Gráfica LuxPack", notes: "Papel triplex 350g" }
      ],
      setupCosts: [
        { id: "setup-b1", description: "Testes Dermatológicos e de Não-Comedogenicidade", cost: 4800.0, paid: false },
        { id: "setup-b2", description: "Notificação ANVISA Grau 2", cost: 1400.0, paid: false },
        { id: "setup-b3", description: "Clichês Gráficos da Linha Face", cost: 1200.0, paid: false }
      ],
      pricingChannels: [
        { id: "ch-b1", name: "E-commerce Oficial (D2C)", icon: "shopping-bag", active: true, targetPrice: 69.90, expectedSalesShare: 55, taxPercent: 6.0, gatewayPercent: 3.8, shippingPackagingCost: 4.80, marketingCacEstimate: 14.00, platformFeePercent: 0.0 },
        { id: "ch-b2", name: "Marketplaces (TikTok / Shopee / Mercado Livre)", icon: "store", active: true, targetPrice: 74.90, expectedSalesShare: 25, taxPercent: 6.0, gatewayPercent: 0.0, shippingPackagingCost: 3.80, marketingCacEstimate: 0.0, platformFeePercent: 18.0 },
        { id: "ch-b3", name: "Atacado & Boutiques (B2B)", icon: "truck", active: true, targetPrice: 38.00, expectedSalesShare: 20, taxPercent: 6.0, gatewayPercent: 1.5, shippingPackagingCost: 1.00, marketingCacEstimate: 2.50, platformFeePercent: 0.0 }
      ],
      suppliers: [
        { id: "sup-b1", name: "LabBeauté Indústria Cosmética", type: "Full Service", city: "Vinhedo - SP", anvisaStatus: "Certificada Grau 2", moq: 2500, leadTimeDays: 45, unitCostFull: 10.50, paymentTerms: "40/30/30", qualityRating: 5, recommended: true, notes: "Excelente textura sérum com secagem rápida sem manchar." }
      ]
    },

    // 3. PRODUTO 3: SÉRUM FACIAL HIDRATANTE MULTI-ATIVO
    {
      id: "prod-serum-03",
      name: "ALVA Cloud Drops — Sérum Multi-Hidratante",
      category: "Skincare Facial de Alta Performance",
      volume: "30 ml",
      image: "https://images.unsplash.com/photo-1608248597359-00f0119e0486?auto=format&fit=crop&w=800&q=80",
      status: "Em Ideação",
      stage: 1,
      tagline: "Hidratação em 4 pesos moleculares com peptídeos e centella",
      description: "Tratamento facial diário ultraleve que restaura a barreira cutânea, atenua linhas finas e devolve o viço radiante natural da pele.",
      plannedBatch: 2000,
      variants: [
        {
          id: "var-serum-01",
          sku: "ALVA-CD-01",
          name: "Original Radiance (Glow Natural)",
          colorCode: "#F3E8E2",
          textColor: "#4C0519",
          finish: "Translúcido com absorção imediata e acabamento luminoso",
          scent: "Sem Fragrância (Hipoalergênico)",
          shareOfBatch: 60,
          rawMaterialCostExtra: 0.0,
          image: "https://images.unsplash.com/photo-1608248597359-00f0119e0486?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-serum-02",
          sku: "ALVA-CD-02",
          name: "Calm & Barrier (Centella & Pantenol)",
          colorCode: "#E2EBD8",
          textColor: "#2D4A22",
          finish: "Levemente leitoso, calmante para peles sensíveis",
          scent: "Chá Verde Suave",
          shareOfBatch: 40,
          rawMaterialCostExtra: 0.35,
          image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80"
        }
      ],
      bom: [
        { id: "bom-s1", name: "Frasco Conta-Gotas Graduado 30ml Vidro Âmbar/Transparente", category: "Embalagem Primária", unitCost: 4.80, supplier: "PackBeauty S/A", notes: "Bulbo de silicone de alta precisão" },
        { id: "bom-s2", name: "Massa Cosmética Ácido Hialurônico 4D + Peptídeos", category: "Fórmula / Granel", unitCost: 4.50, supplier: "LabBeauté Terceirização", notes: "Ativos de biotecnologia francesa" },
        { id: "bom-s3", name: "Envase em Atmosfera Estéril / Nitrogênio", category: "Mão de Obra", unitCost: 1.80, supplier: "LabBeauté Terceirização", notes: "Protege ativos oxidáveis" },
        { id: "bom-s4", name: "Cartucho Individual com Relevo e Lacre de Inviolabilidade", category: "Embalagem Secundária", unitCost: 1.70, supplier: "Gráfica LuxPack", notes: "Acabamento de luxo" }
      ],
      setupCosts: [
        { id: "setup-s1", description: "Estudos de Eficácia Clínica e Instrumental", cost: 5500.0, paid: false },
        { id: "setup-s2", description: "Notificação ANVISA Grau 2", cost: 1400.0, paid: false }
      ],
      pricingChannels: [
        { id: "ch-s1", name: "E-commerce Oficial (D2C)", icon: "shopping-bag", active: true, targetPrice: 89.90, expectedSalesShare: 60, taxPercent: 6.0, gatewayPercent: 3.8, shippingPackagingCost: 5.00, marketingCacEstimate: 18.00, platformFeePercent: 0.0 },
        { id: "ch-s2", name: "Marketplaces (TikTok / Mercado Livre)", icon: "store", active: true, targetPrice: 94.90, expectedSalesShare: 20, taxPercent: 6.0, gatewayPercent: 0.0, shippingPackagingCost: 4.00, marketingCacEstimate: 0.0, platformFeePercent: 18.0 },
        { id: "ch-s3", name: "Clínicas de Estética & Spas (B2B)", icon: "truck", active: true, targetPrice: 48.00, expectedSalesShare: 20, taxPercent: 6.0, gatewayPercent: 1.5, shippingPackagingCost: 1.20, marketingCacEstimate: 3.00, platformFeePercent: 0.0 }
      ],
      suppliers: [
        { id: "sup-s1", name: "LabBeauté Indústria Cosmética", type: "Full Service", city: "Vinhedo - SP", anvisaStatus: "Certificada Grau 2", moq: 2000, leadTimeDays: 50, unitCostFull: 12.80, paymentTerms: "40/30/30", qualityRating: 5, recommended: true, notes: "Tecnologia de vetorização de ácido hialurônico de ponta." }
      ]
    },

    // 4. PRODUTO 4: LIP TINT BALM COM ESQUALANO
    {
      id: "prod-balm-04",
      name: "ALVA Velvet Melt — Balm Tint com Esqualano",
      category: "Cuidado Labial com Cor",
      volume: "3.5 g",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      status: "Em Ideação",
      stage: 1,
      tagline: "Nutrição intensa de balm com a cor irresistível de tint",
      description: "Batom em bastão cremoso enriquecido com esqualano de cana-de-açúcar, manteiga de murumuru e pigmentação que tinge sutilmente os lábios.",
      plannedBatch: 3500,
      variants: [
        {
          id: "var-balm-01",
          sku: "ALVA-VM-01",
          name: "French Rose #01",
          colorCode: "#E07A8A",
          textColor: "#FFFFFF",
          finish: "Rosa elegante com efeito pH-reagente personalizado",
          scent: "Rosas Silvestres",
          shareOfBatch: 40,
          rawMaterialCostExtra: 0.10,
          image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-balm-02",
          sku: "ALVA-VM-02",
          name: "Toffee Nude #02",
          colorCode: "#BA7766",
          textColor: "#FFFFFF",
          finish: "Nude marrom quente caramelo aveludado",
          scent: "Café com Baunilha",
          shareOfBatch: 35,
          rawMaterialCostExtra: 0.10,
          image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-balm-03",
          sku: "ALVA-VM-03",
          name: "Cherry Wine #03",
          colorCode: "#852738",
          textColor: "#FFFFFF",
          finish: "Cereja marcante com brilho nutritivo",
          scent: "Cereja Preta",
          shareOfBatch: 25,
          rawMaterialCostExtra: 0.20,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80"
        }
      ],
      bom: [
        { id: "bom-bm1", name: "Estojo Slim Bastão Metálico Dourado/Nude", category: "Embalagem Primária", unitCost: 3.10, supplier: "PackBeauty S/A", notes: "Fecho magnético de alta sofisticação" },
        { id: "bom-bm2", name: "Massa Balm Esqualano Vegetal + Manteigas Brasileiras", category: "Fórmula / Granel", unitCost: 1.90, supplier: "LabBeauté Terceirização", notes: "100% vegano" },
        { id: "bom-bm3", name: "Envase em Molde de Resfriamento / Maquinário Automático", category: "Mão de Obra", unitCost: 1.10, supplier: "LabBeauté Terceirização", notes: "Acabamento em ponta em gota perfeita" },
        { id: "bom-bm4", name: "Cartucho Individual c/ Verniz Localizado", category: "Embalagem Secundária", unitCost: 1.25, supplier: "Gráfica LuxPack", notes: "Cartão fosco toque de seda" }
      ],
      setupCosts: [
        { id: "setup-bm1", description: "Notificação ANVISA Grau 2", cost: 1400.0, paid: false },
        { id: "setup-bm2", description: "Testes Dermatológicos e de Hipoalergenicidade", cost: 3800.0, paid: false }
      ],
      pricingChannels: [
        { id: "ch-bm1", name: "E-commerce Oficial (D2C)", icon: "shopping-bag", active: true, targetPrice: 49.90, expectedSalesShare: 50, taxPercent: 6.0, gatewayPercent: 3.8, shippingPackagingCost: 4.20, marketingCacEstimate: 10.00, platformFeePercent: 0.0 },
        { id: "ch-bm2", name: "Marketplaces (TikTok / Shopee)", icon: "store", active: true, targetPrice: 54.90, expectedSalesShare: 35, taxPercent: 6.0, gatewayPercent: 0.0, shippingPackagingCost: 3.20, marketingCacEstimate: 0.0, platformFeePercent: 18.0 },
        { id: "ch-bm3", name: "Revenda B2B / Salões de Beleza", icon: "truck", active: true, targetPrice: 26.50, expectedSalesShare: 15, taxPercent: 6.0, gatewayPercent: 1.5, shippingPackagingCost: 0.80, marketingCacEstimate: 1.50, platformFeePercent: 0.0 }
      ],
      suppliers: [
        { id: "sup-bm1", name: "LabBeauté Indústria Cosmética", type: "Full Service", city: "Vinhedo - SP", anvisaStatus: "Certificada Grau 2", moq: 3500, leadTimeDays: 40, unitCostFull: 7.35, paymentTerms: "50/50", qualityRating: 4.9, recommended: true, notes: "Excelente precisão de moldagem e textura sem derreter no calor." }
      ]
    },

    // 5. PRODUTO 5: BRUMA FACIAL FIXADORA E ILUMINADORA
    {
      id: "prod-mist-05",
      name: "ALVA Lumina Mist — Bruma Hidratante Fixadora",
      category: "Preparação & Fixação de Maquiagem",
      volume: "100 ml",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      status: "Em Ideação",
      stage: 1,
      tagline: "Fixação prolongada de 16h com água de rosas, pantenol e glow",
      description: "Bruma ultrafina de nebulização contínua que sela a maquiagem, hidrata instantaneamente e protege contra poluição e luz azul.",
      plannedBatch: 2000,
      variants: [
        {
          id: "var-mist-01",
          sku: "ALVA-LM-01",
          name: "Dewy Glow (Refletora de Luz)",
          colorCode: "#F7F0EB",
          textColor: "#4C0519",
          finish: "Bruma iluminadora com micropérolas minerais douradas",
          scent: "Água de Rosas Frescas",
          shareOfBatch: 60,
          rawMaterialCostExtra: 0.20,
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "var-mist-02",
          sku: "ALVA-LM-02",
          name: "Velvet Soft (Matte Hidratado)",
          colorCode: "#EFEAE6",
          textColor: "#2B2D42",
          finish: "Acabamento aveludado sem brilho, controle de oleosidade",
          scent: "Flor de Lótus",
          shareOfBatch: 40,
          rawMaterialCostExtra: 0.0,
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
        }
      ],
      bom: [
        { id: "bom-m1", name: "Frasco Pet Cristal 100ml c/ Spray Válvula Nebulizadora Névoa Fina", category: "Embalagem Primária", unitCost: 3.80, supplier: "PackBeauty S/A", notes: "Micro-spray ultrafino importado" },
        { id: "bom-m2", name: "Granel Líquido Água de Rosas + Pantenol + Polímero Fixador", category: "Fórmula / Granel", unitCost: 2.50, supplier: "LabBeauté Terceirização", notes: "Sem álcool etílico" },
        { id: "bom-m3", name: "Envase e Rotulagem Termoencolhível Fosca", category: "Mão de Obra", unitCost: 1.30, supplier: "LabBeauté Terceirização", notes: "Rótulo 360 graus" }
      ],
      setupCosts: [
        { id: "setup-m1", description: "Testes de Eficácia Fixadora e Oftalmológicos", cost: 4200.0, paid: false },
        { id: "setup-m2", description: "Notificação ANVISA Grau 2", cost: 1400.0, paid: false }
      ],
      pricingChannels: [
        { id: "ch-m1", name: "E-commerce Oficial (D2C)", icon: "shopping-bag", active: true, targetPrice: 64.90, expectedSalesShare: 55, taxPercent: 6.0, gatewayPercent: 3.8, shippingPackagingCost: 4.80, marketingCacEstimate: 12.00, platformFeePercent: 0.0 },
        { id: "ch-m2", name: "Marketplaces (Mercado Livre / Shopee)", icon: "store", active: true, targetPrice: 69.90, expectedSalesShare: 25, taxPercent: 6.0, gatewayPercent: 0.0, shippingPackagingCost: 3.50, marketingCacEstimate: 0.0, platformFeePercent: 18.0 },
        { id: "ch-m3", name: "Maquiadores Profissionais & Salões (B2B)", icon: "truck", active: true, targetPrice: 34.50, expectedSalesShare: 20, taxPercent: 6.0, gatewayPercent: 1.5, shippingPackagingCost: 1.00, marketingCacEstimate: 2.00, platformFeePercent: 0.0 }
      ],
      suppliers: [
        { id: "sup-m1", name: "LabBeauté Indústria Cosmética", type: "Full Service", city: "Vinhedo - SP", anvisaStatus: "Certificada Grau 2", moq: 2000, leadTimeDays: 35, unitCostFull: 7.60, paymentTerms: "40/30/30", qualityRating: 4.8, recommended: true, notes: "Válvula nebulizadora de padrão internacional que não molha o rosto." }
      ]
    }
  ],
  scenarios: {
    pessimistic: {
      name: "Conservador",
      monthlyGrowthRate: 5,
      months: [
        { month: "Mês 1", units: 150 }, { month: "Mês 2", units: 180 }, { month: "Mês 3", units: 210 },
        { month: "Mês 4", units: 240 }, { month: "Mês 5", units: 270 }, { month: "Mês 6", units: 300 },
        { month: "Mês 7", units: 330 }, { month: "Mês 8", units: 360 }, { month: "Mês 9", units: 400 },
        { month: "Mês 10", units: 440 }, { month: "Mês 11", units: 500 }, { month: "Mês 12", units: 600 }
      ]
    },
    realistic: {
      name: "Realista (Planejado)",
      monthlyGrowthRate: 15,
      months: [
        { month: "Mês 1", units: 350 }, { month: "Mês 2", units: 450 }, { month: "Mês 3", units: 550 },
        { month: "Mês 4", units: 650 }, { month: "Mês 5", units: 750 }, { month: "Mês 6", units: 850 },
        { month: "Mês 7", units: 950 }, { month: "Mês 8", units: 1100 }, { month: "Mês 9", units: 1250 },
        { month: "Mês 10", units: 1400 }, { month: "Mês 11", units: 1650 }, { month: "Mês 12", units: 2000 }
      ]
    },
    optimistic: {
      name: "Acelerado / Viral",
      monthlyGrowthRate: 25,
      months: [
        { month: "Mês 1", units: 600 }, { month: "Mês 2", units: 850 }, { month: "Mês 3", units: 1200 },
        { month: "Mês 4", units: 1600 }, { month: "Mês 5", units: 2000 }, { month: "Mês 6", units: 2500 },
        { month: "Mês 7", units: 3000 }, { month: "Mês 8", units: 3600 }, { month: "Mês 9", units: 4200 },
        { month: "Mês 10", units: 4900 }, { month: "Mês 11", units: 5800 }, { month: "Mês 12", units: 7000 }
      ]
    }
  }
};
