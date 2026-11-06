// Dados padrão e configurações iniciais da ALVA Business Planner
const ALVA_DEFAULT_DATA = {
  company: {
    name: "ALVA",
    tagline: "Gestão Integrada de Finanças e Novos Negócios",
    segment: "Cosméticos & Beleza Premium",
    currency: "BRL",
    taxRegime: "Simples Nacional (Comércio - Faixa 1)",
    taxRate: 6.0, // %
    fixedMonthlyCosts: 3500.0, // Aluguel/software/marketing institucional
    availableCapital: 35000.0 // Capital de giro inicial disponível
  },
  products: [
    {
      id: "prod-lipgloss-01",
      name: "ALVA Glaze - Lip Gloss Hidratante Efeito Plump",
      category: "Maquiagem Labial",
      volume: "4.5 ml",
      status: "Em Análise de Viabilidade", // Ideação, Em Análise, Orçamento, Testes ANVISA, Produção, Lançado
      stage: 2, // 1 to 5
      description: "Gloss com ácido hialurônico, vitamina E, efeito plump volumizador imediato e textura confortável sem grudar.",
      plannedBatch: 3000, // Lote total planejado
      variants: [
        {
          id: "var-01",
          sku: "ALVA-LG-01",
          name: "Cristal Glow #01",
          colorCode: "#F5E6E8",
          textColor: "#6B3343",
          finish: "Translúcido perolado com micropartículas refletoras",
          scent: "Baunilha Suave",
          shareOfBatch: 30, // % da produção total
          rawMaterialCostExtra: 0.0 // Custo adicional de pigmentos
        },
        {
          id: "var-02",
          sku: "ALVA-LG-02",
          name: "Nude Velvet #02",
          colorCode: "#D98E85",
          textColor: "#FFFFFF",
          finish: "Nude rosado elegante com cobertura média espelhada",
          scent: "Pêssego & Caramelo",
          shareOfBatch: 45, // Mais vendido previsto
          rawMaterialCostExtra: 0.15
        },
        {
          id: "var-03",
          sku: "ALVA-LG-03",
          name: "Berry Bloom #03",
          colorCode: "#9B3855",
          textColor: "#FFFFFF",
          finish: "Amora vibrante sofisticado com efeito tint",
          scent: "Frutas Vermelhas",
          shareOfBatch: 25,
          rawMaterialCostExtra: 0.25
        }
      ],
      // Bill of Materials (BOM) - Custos Diretos por Unidade
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
      // Custos Não Recorrentes / Setup de P&D (Diluídos no projeto)
      setupCosts: [
        { id: "setup-1", description: "Notificação / Registro ANVISA Grau 2", cost: 1400.0, paid: true },
        { id: "setup-2", description: "Testes Dermatológicos e de Estabilidade Acelerada", cost: 4200.0, paid: false },
        { id: "setup-3", description: "Clichês e Facas de Corte para Cartuchos Gráficos", cost: 1600.0, paid: false },
        { id: "setup-4", description: "Responsável Técnico Químico / RT Inicial", cost: 1500.0, paid: false },
        { id: "setup-5", description: "Lote Piloto de Amostras para Fotografia e Testes de Bancada", cost: 950.0, paid: true }
      ],
      // Canais de Venda e Parâmetros de Formação de Preço
      pricingChannels: [
        {
          id: "channel-d2c",
          name: "E-commerce Oficial (D2C)",
          icon: "shopping-bag",
          active: true,
          targetPrice: 59.90,
          expectedSalesShare: 50, // 50% das vendas
          taxPercent: 6.0, // Simples Nacional
          gatewayPercent: 3.8, // Cartão / Pix gateway
          shippingPackagingCost: 4.50, // Caixinha personalizada e brinde
          marketingCacEstimate: 12.00, // Custo de Aquisição por Venda (Mídia Paga)
          platformFeePercent: 0.0 // Shopify / Nuvemshop mensal rateado
        },
        {
          id: "channel-marketplace",
          name: "Marketplaces (Mercado Livre / Shopee / TikTok)",
          icon: "store",
          active: true,
          targetPrice: 64.90,
          expectedSalesShare: 30, // 30% das vendas
          taxPercent: 6.0,
          gatewayPercent: 0.0, // Já incluído na comissão do canal
          shippingPackagingCost: 3.50, // Embalagem padrão correios
          marketingCacEstimate: 0.0, // Tráfego orgânico do marketplace
          platformFeePercent: 18.0 // Comissão média marketplace
        },
        {
          id: "channel-b2b",
          name: "Atacado / Salões de Beleza / Boutiques (B2B)",
          icon: "truck",
          active: true,
          targetPrice: 32.90, // Desconto comercial de atacado (~45% do PVS)
          expectedSalesShare: 20, // 20% das vendas
          taxPercent: 6.0,
          gatewayPercent: 1.5, // Boleto bancário
          shippingPackagingCost: 0.80, // Caixa coletiva
          marketingCacEstimate: 2.00, // Comissão comercial de representante
          platformFeePercent: 0.0
        }
      ],
      // Fabricantes / Fornecedores em Cotação
      suppliers: [
        {
          id: "sup-1",
          name: "LabBeauté Indústria Cosmética",
          type: "Terceirista Full Service (Fórmula + Envase)",
          city: "Vinhedo - SP",
          anvisaStatus: "Certificada Grau 1 e Grau 2",
          moq: 3000,
          leadTimeDays: 45,
          unitCostFull: 9.80,
          paymentTerms: "40% pedido / 30% embarque / 30% 30 DDL",
          qualityRating: 5, // 1 to 5
          recommended: true,
          notes: "Laboratório conceituado, formulação premiada com sensorial aveludado e estabilidade garantida."
        },
        {
          id: "sup-2",
          name: "Inovapack Cosméticos & Embalagens",
          type: "Envase & Frascos",
          city: "Diadema - SP",
          anvisaStatus: "Certificada Grau 1 e Grau 2",
          moq: 1500,
          leadTimeDays: 30,
          unitCostFull: 11.20,
          paymentTerms: "50% entrada / 50% entrega",
          qualityRating: 4,
          recommended: false,
          notes: "MOQ menor ideal para testes rápidos, porém custo unitário 14% superior."
        },
        {
          id: "sup-3",
          name: "PrimaFace Química Industrial",
          type: "Terceirista de Grande Porte",
          city: "Campinas - SP",
          anvisaStatus: "Certificada Internacional (ISO 22716)",
          moq: 5000,
          leadTimeDays: 60,
          unitCostFull: 8.40,
          paymentTerms: "30% pedido / 70% 30 DDL faturado",
          qualityRating: 4.8,
          recommended: false,
          notes: "Excelente custo para escala de lote superior (5.000 un), mas exige investimento de R$ 42.000."
        }
      ]
    }
  ],
  // Projeção de Vendas e Cenários Mensais (12 Meses)
  scenarios: {
    pessimistic: {
      name: "Conservador",
      monthlyGrowthRate: 5,
      months: [
        { month: "Mês 1", units: 150 },
        { month: "Mês 2", units: 180 },
        { month: "Mês 3", units: 210 },
        { month: "Mês 4", units: 240 },
        { month: "Mês 5", units: 270 },
        { month: "Mês 6", units: 300 },
        { month: "Mês 7", units: 330 },
        { month: "Mês 8", units: 360 },
        { month: "Mês 9", units: 400 },
        { month: "Mês 10", units: 440 },
        { month: "Mês 11", units: 500 },
        { month: "Mês 12", units: 600 }
      ]
    },
    realistic: {
      name: "Realista (Planejado)",
      monthlyGrowthRate: 15,
      months: [
        { month: "Mês 1", units: 350 },
        { month: "Mês 2", units: 450 },
        { month: "Mês 3", units: 550 },
        { month: "Mês 4", units: 650 },
        { month: "Mês 5", units: 750 },
        { month: "Mês 6", units: 850 },
        { month: "Mês 7", units: 950 },
        { month: "Mês 8", units: 1100 },
        { month: "Mês 9", units: 1250 },
        { month: "Mês 10", units: 1400 },
        { month: "Mês 11", units: 1650 },
        { month: "Mês 12", units: 2000 }
      ]
    },
    optimistic: {
      name: "Acelerado / Viral",
      monthlyGrowthRate: 25,
      months: [
        { month: "Mês 1", units: 600 },
        { month: "Mês 2", units: 850 },
        { month: "Mês 3", units: 1200 },
        { month: "Mês 4", units: 1600 },
        { month: "Mês 5", units: 2000 },
        { month: "Mês 6", units: 2500 },
        { month: "Mês 7", units: 3000 },
        { month: "Mês 8", units: 3600 },
        { month: "Mês 9", units: 4200 },
        { month: "Mês 10", units: 4900 },
        { month: "Mês 11", units: 5800 },
        { month: "Mês 12", units: 7000 }
      ]
    }
  }
};
