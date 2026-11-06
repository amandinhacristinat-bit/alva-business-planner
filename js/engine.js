// Motor de Cálculos e Inteligência de Negócios da ALVA
class AlvaFinanceEngine {
  constructor(state) {
    this.state = state;
  }

  // 1. Cálculos de Custos e BOM
  calculateCosts(product) {
    const directBomCost = product.bom.reduce((acc, item) => acc + (Number(item.unitCost) || 0), 0);
    const totalSetupCost = product.setupCosts.reduce((acc, item) => acc + (Number(item.cost) || 0), 0);
    const plannedBatch = Number(product.plannedBatch) || 1000;
    const setupCostPerUnit = plannedBatch > 0 ? totalSetupCost / plannedBatch : 0;
    const totalUnitCost = directBomCost + setupCostPerUnit;

    // Custos por variação
    const variantCosts = product.variants.map(v => {
      const extra = Number(v.rawMaterialCostExtra) || 0;
      const unitCost = directBomCost + extra + setupCostPerUnit;
      const totalUnits = Math.round((plannedBatch * (Number(v.shareOfBatch) || 0)) / 100);
      return {
        ...v,
        directCost: directBomCost + extra,
        setupCostPerUnit,
        unitCost,
        totalUnits,
        totalInvestment: unitCost * totalUnits
      };
    });

    const totalBatchManufacturingCost = directBomCost * plannedBatch;
    const totalInitialInvestment = totalBatchManufacturingCost + totalSetupCost;

    return {
      directBomCost,
      totalSetupCost,
      setupCostPerUnit,
      totalUnitCost,
      plannedBatch,
      variantCosts,
      totalBatchManufacturingCost,
      totalInitialInvestment
    };
  }

  // 2. Formação de Preço (Pricing) por Canal
  calculatePricing(product, costAnalysis) {
    const unitCost = costAnalysis.totalUnitCost;
    const directCost = costAnalysis.directBomCost;

    const channelsAnalysis = product.pricingChannels.map(channel => {
      const price = Number(channel.targetPrice) || 0;
      const taxRate = Number(channel.taxPercent) || 0;
      const taxAmount = (price * taxRate) / 100;
      const gatewayRate = Number(channel.gatewayPercent) || 0;
      const gatewayAmount = (price * gatewayRate) / 100;
      const platformFeeRate = Number(channel.platformFeePercent) || 0;
      const platformFeeAmount = (price * platformFeeRate) / 100;
      const shippingPackaging = Number(channel.shippingPackagingCost) || 0;
      const cacMarketing = Number(channel.marketingCacEstimate) || 0;

      // Custo variável total por unidade vendida
      const totalVariableCost = unitCost + taxAmount + gatewayAmount + platformFeeAmount + shippingPackaging + cacMarketing;
      const netRevenue = price - taxAmount - gatewayAmount - platformFeeAmount;
      const contributionMarginBrl = price - totalVariableCost;
      const contributionMarginPercent = price > 0 ? (contributionMarginBrl / price) * 100 : 0;
      const markup = unitCost > 0 ? (price / unitCost) : 0;

      // Classificação de saúde de margem
      let health = "Ótima";
      let healthColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
      if (contributionMarginPercent < 20) {
        health = "Crítica";
        healthColor = "text-rose-600 bg-rose-50 border-rose-200";
      } else if (contributionMarginPercent < 35) {
        health = "Atenção";
        healthColor = "text-amber-600 bg-amber-50 border-amber-200";
      }

      return {
        ...channel,
        price,
        taxAmount,
        gatewayAmount,
        platformFeeAmount,
        shippingPackaging,
        cacMarketing,
        totalVariableCost,
        netRevenue,
        contributionMarginBrl,
        contributionMarginPercent,
        markup,
        health,
        healthColor
      };
    });

    // Médias ponderadas pelos canais
    const totalShare = channelsAnalysis.reduce((acc, c) => acc + (c.active ? Number(c.expectedSalesShare) : 0), 0) || 100;
    const weightedAvgPrice = channelsAnalysis.reduce((acc, c) => {
      return acc + (c.active ? (c.price * Number(c.expectedSalesShare)) / totalShare : 0);
    }, 0);

    const weightedAvgMarginBrl = channelsAnalysis.reduce((acc, c) => {
      return acc + (c.active ? (c.contributionMarginBrl * Number(c.expectedSalesShare)) / totalShare : 0);
    }, 0);

    const weightedAvgMarginPercent = weightedAvgPrice > 0 ? (weightedAvgMarginBrl / weightedAvgPrice) * 100 : 0;

    return {
      channels: channelsAnalysis,
      weightedAvgPrice,
      weightedAvgMarginBrl,
      weightedAvgMarginPercent
    };
  }

  // 3. Ponto de Equilíbrio (Break-Even) e Capital de Giro
  calculateBreakEven(pricingAnalysis, costAnalysis) {
    const fixedMonthlyCosts = Number(this.state.company.fixedMonthlyCosts) || 0;
    const marginPerUnit = pricingAnalysis.weightedAvgMarginBrl;

    // Unidades mensais necessárias para cobrir custos fixos operacionais
    const monthlyBreakEvenUnits = marginPerUnit > 0 ? Math.ceil(fixedMonthlyCosts / marginPerUnit) : 0;
    const monthlyBreakEvenRevenue = monthlyBreakEvenUnits * pricingAnalysis.weightedAvgPrice;

    // Quantas unidades vendidas para recuperar 100% do investimento inicial (lote + setup)
    const initialInvestment = costAnalysis.totalInitialInvestment;
    const launchPaybackUnits = marginPerUnit > 0 ? Math.ceil(initialInvestment / marginPerUnit) : 0;
    const launchPaybackPercentOfBatch = costAnalysis.plannedBatch > 0 ? ((launchPaybackUnits / costAnalysis.plannedBatch) * 100) : 0;

    // Comparativo de Capital de Giro
    const availableCapital = Number(this.state.company.availableCapital) || 0;
    const workingCapitalGap = availableCapital - initialInvestment;
    const capitalStatus = workingCapitalGap >= 0 ? "Suficiente" : "Déficit de Caixa";

    return {
      fixedMonthlyCosts,
      marginPerUnit,
      monthlyBreakEvenUnits,
      monthlyBreakEvenRevenue,
      launchPaybackUnits,
      launchPaybackPercentOfBatch,
      availableCapital,
      initialInvestment,
      workingCapitalGap,
      capitalStatus
    };
  }

  // 4. Projeções e DRE Mensal (12 Meses)
  calculateDRE(selectedScenarioKey, pricingAnalysis, costAnalysis) {
    const scenario = this.state.scenarios[selectedScenarioKey] || this.state.scenarios.realistic;
    const unitPrice = pricingAnalysis.weightedAvgPrice;
    const unitCost = costAnalysis.totalUnitCost;
    const fixedMonthlyCosts = Number(this.state.company.fixedMonthlyCosts) || 0;
    const marginPerUnit = pricingAnalysis.weightedAvgMarginBrl;

    let cumulativeProfit = -costAnalysis.totalInitialInvestment;
    let paybackMonth = null;

    const monthlyDRE = scenario.months.map((m, index) => {
      const units = Number(m.units) || 0;
      const grossRevenue = units * unitPrice;
      const cogs = units * unitCost;
      const grossMargin = grossRevenue - cogs;
      const marketingAndDeliveryCosts = units * (pricingAnalysis.weightedAvgPrice - pricingAnalysis.weightedAvgMarginBrl - unitCost);
      const operatingContribution = units * marginPerUnit;
      const netProfit = operatingContribution - fixedMonthlyCosts;

      cumulativeProfit += netProfit;

      if (cumulativeProfit >= 0 && paybackMonth === null) {
        paybackMonth = m.month;
      }

      return {
        month: m.month,
        units,
        grossRevenue,
        cogs,
        grossMargin,
        marketingAndDeliveryCosts,
        operatingContribution,
        fixedCosts: fixedMonthlyCosts,
        netProfit,
        netMarginPercent: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0,
        cumulativeProfit
      };
    });

    const total12MonthsUnits = monthlyDRE.reduce((acc, row) => acc + row.units, 0);
    const total12MonthsRevenue = monthlyDRE.reduce((acc, row) => acc + row.grossRevenue, 0);
    const total12MonthsNetProfit = monthlyDRE.reduce((acc, row) => acc + row.netProfit, 0);

    return {
      scenarioName: scenario.name,
      monthlyDRE,
      total12MonthsUnits,
      total12MonthsRevenue,
      total12MonthsNetProfit,
      paybackMonth: paybackMonth || "Após 12 meses"
    };
  }

  // 5. Comparativo Inteligente de Fabricantes
  evaluateSuppliers(product, costAnalysis) {
    return product.suppliers.map(sup => {
      const moq = Number(sup.moq) || 1000;
      const unitCost = Number(sup.unitCostFull) || 10;
      const totalOrderCost = moq * unitCost;
      const leadTime = Number(sup.leadTimeDays) || 30;
      const rating = Number(sup.qualityRating) || 3;

      // Score de 0 a 100 ponderando Custo (40%), MOQ e Acessibilidade (25%), Prazo (15%), Avaliação/Qualidade (20%)
      const costScore = Math.max(0, 100 - ((unitCost - 7.0) / 7.0) * 80);
      const moqScore = Math.max(0, 100 - ((moq - 1000) / 4000) * 80);
      const timeScore = Math.max(0, 100 - ((leadTime - 30) / 45) * 80);
      const qualityScore = (rating / 5) * 100;

      const compositeScore = Math.round(
        costScore * 0.4 +
        moqScore * 0.25 +
        timeScore * 0.15 +
        qualityScore * 0.20
      );

      return {
        ...sup,
        totalOrderCost,
        compositeScore
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }

  // 6. Diagnóstico e Recomendações Automáticas (Copilot de Decisão)
  generateSmartInsights(product, costAnalysis, pricingAnalysis, breakEven, dre) {
    const insights = [];

    // Análise 1: Capital de Giro vs Lote
    if (breakEven.workingCapitalGap < 0) {
      insights.push({
        type: "danger",
        title: "Capital Insuficiente para Lote Inicial",
        description: `O investimento inicial de R$ ${costAnalysis.totalInitialInvestment.toLocaleString('pt-BR', {minimumFractionDigits: 2})} excede seu capital disponível de R$ ${breakEven.availableCapital.toLocaleString('pt-BR', {minimumFractionDigits: 2})} em R$ ${Math.abs(breakEven.workingCapitalGap).toLocaleString('pt-BR', {minimumFractionDigits: 2})}. Sugestão: negociar lote piloto de 1.500 unidades com o fornecedor Inovapack ou parcelar custos de registro ANVISA.`,
        action: "Ajustar tamanho do lote ou selecionar fornecedor com menor MOQ."
      });
    } else {
      insights.push({
        type: "success",
        title: "Capital de Giro Confortável",
        description: `Seu capital disponível de R$ ${breakEven.availableCapital.toLocaleString('pt-BR', {minimumFractionDigits: 2})} cobre com folga de R$ ${breakEven.workingCapitalGap.toLocaleString('pt-BR', {minimumFractionDigits: 2})} a produção do primeiro lote de ${costAnalysis.plannedBatch.toLocaleString('pt-BR')} unidades.`,
        action: "Excelente para sustentar os primeiros 60 dias de marketing inicial."
      });
    }

    // Análise 2: Saúde das Margens por Canal
    const lowMarginChannels = pricingAnalysis.channels.filter(c => c.active && c.contributionMarginPercent < 25);
    if (lowMarginChannels.length > 0) {
      insights.push({
        type: "warning",
        title: `Margem Comprimida em: ${lowMarginChannels.map(c => c.name).join(", ")}`,
        description: `No canal ${lowMarginChannels[0].name}, a margem de contribuição está em ${lowMarginChannels[0].contributionMarginPercent.toFixed(1)}%. Devido às taxas de comissão e frete obrigatório, você precisará de volume muito elevado para gerar lucro real.`,
        action: `Considere subir o preço de venda para R$ ${(lowMarginChannels[0].price * 1.15).toFixed(2)} ou criar kits com 2 ou as 3 cores para diluir a comissão fixa.`
      });
    }

    // Análise 3: Efeito Mix de Cores
    const topVariant = costAnalysis.variantCosts.reduce((prev, curr) => (curr.shareOfBatch > prev.shareOfBatch) ? curr : prev, costAnalysis.variantCosts[0]);
    insights.push({
      type: "info",
      title: `Mix de Cores: ${topVariant.name} lidera a produção (${topVariant.shareOfBatch}%)`,
      description: `A cor "${topVariant.name}" representará ${topVariant.totalUnits} unidades do lote. Essa divisão é ideal para cosméticos labiais, onde tons nudes são a 'vaca leiteira' recorrente, enquanto brilhos translúcidos e vinhos completam a cesta de compras.`,
      action: "Incentivar 'Bundle Trio' (as 3 cores com 10% de desconto) para elevar o ticket médio para R$ 149,00."
    });

    // Análise 4: Tempo de Payback
    insights.push({
      type: dre.paybackMonth !== "Após 12 meses" ? "success" : "warning",
      title: `Payback Estimado: ${dre.paybackMonth}`,
      description: `No cenário ${dre.scenarioName}, o retorno total sobre os R$ ${costAnalysis.totalInitialInvestment.toLocaleString('pt-BR', {minimumFractionDigits: 2})} investidos ocorre no ${dre.paybackMonth}. A partir desse mês, o produto opera gerando fluxo de caixa livre.`,
      action: "Lucro acumulado projetado em 12 meses: R$ " + dre.total12MonthsNetProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})
    });

    return insights;
  }
}

