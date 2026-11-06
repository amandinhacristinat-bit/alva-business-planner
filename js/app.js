// ALVA Business Planner - Aplicação Principal
class AlvaApp {
  constructor() {
    this.storageKey = "alva_business_planner_v1";
    this.authKey = "alva_auth_user_v1";
    this.state = this.loadState();
    this.currentUser = this.loadUser();
    this.engine = new AlvaFinanceEngine(this.state);
    this.currentView = this.currentUser ? "planner" : "landing";
    this.currentTab = "overview";
    this.selectedProductId = this.state.products[0]?.id || null;
    this.selectedScenario = "realistic";
    this.charts = {};

    this.init();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Erro ao carregar estado local:", e);
    }
    return JSON.parse(JSON.stringify(ALVA_DEFAULT_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error("Erro ao salvar estado:", e);
    }
    this.engine = new AlvaFinanceEngine(this.state);
  }

  loadUser() {
    try {
      const saved = localStorage.getItem(this.authKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Erro ao carregar usuário autenticado:", e);
    }
    return null;
  }

  saveUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(this.authKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.authKey);
    }
    this.renderAuthHeader();
  }

  resetState() {
    if (confirm("Tem certeza que deseja restaurar as configurações originais da ALVA? Todas as alterações manuais serão resetadas.")) {
      this.state = JSON.parse(JSON.stringify(ALVA_DEFAULT_DATA));
      this.saveState();
      this.render();
    }
  }

  init() {
    this.bindEvents();
    this.renderAuthHeader();
    this.switchView(this.currentView);
  }

  bindEvents() {
    // Botões de alternância de visão (Landing vs Planner)
    const btnLanding = document.getElementById("nav-btn-landing");
    if (btnLanding) {
      btnLanding.addEventListener("click", () => this.switchView("landing"));
    }

    const btnPlanner = document.getElementById("nav-btn-planner");
    if (btnPlanner) {
      btnPlanner.addEventListener("click", () => this.switchView("planner"));
    }

    // Abas de navegação do Planner
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-nav-tab");
        this.switchTab(tab);
      });
    });

    // Login Form Submit
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim().toLowerCase();
        const pwd = document.getElementById("login-password").value.trim();
        this.handleLogin(email, pwd);
      });
    }

    // Seletor de cenário
    const scenarioSelect = document.getElementById("scenario-selector");
    if (scenarioSelect) {
      scenarioSelect.value = this.selectedScenario;
      scenarioSelect.addEventListener("change", (e) => {
        this.selectedScenario = e.target.value;
        this.renderFinancialsTab();
      });
    }

    // Botões de backup
    const btnReset = document.getElementById("btn-reset-data");
    if (btnReset) btnReset.addEventListener("click", () => this.resetState());

    const btnExport = document.getElementById("btn-export-json");
    if (btnExport) btnExport.addEventListener("click", () => this.exportData());

    const fileImport = document.getElementById("file-import-json");
    if (fileImport) {
      fileImport.addEventListener("change", (e) => this.importData(e));
    }

    const btnPrint = document.getElementById("btn-print-report");
    if (btnPrint) btnPrint.addEventListener("click", () => window.print());

    const btnAddProduct = document.getElementById("btn-add-product");
    if (btnAddProduct) btnAddProduct.addEventListener("click", () => this.openNewProductModal());
  }

  // Alternar entre a Apresentação Pública (Landing) e o Gestor Interno (Planner)
  switchView(view) {
    this.currentView = view;
    const viewLanding = document.getElementById("view-landing");
    const viewPlanner = document.getElementById("view-planner");
    const plannerSubnav = document.getElementById("planner-subnav");
    const btnLanding = document.getElementById("nav-btn-landing");
    const btnPlanner = document.getElementById("nav-btn-planner");

    if (view === "landing") {
      viewLanding?.classList.remove("hidden");
      viewPlanner?.classList.add("hidden");
      plannerSubnav?.classList.add("hidden");

      btnLanding?.classList.add("text-rose-900", "bg-rose-50", "border-rose-200");
      btnLanding?.classList.remove("text-neutral-600", "hover:bg-neutral-100");
      btnPlanner?.classList.remove("text-rose-900", "bg-rose-50", "border-rose-200");
      btnPlanner?.classList.add("text-neutral-600", "hover:bg-neutral-100");
    } else {
      // Se tentar acessar o planner sem estar logado, avisa com carinho
      if (!this.currentUser) {
        this.openLoginModal();
        return;
      }

      viewLanding?.classList.add("hidden");
      viewPlanner?.classList.remove("hidden");
      plannerSubnav?.classList.remove("hidden");

      btnPlanner?.classList.add("text-rose-900", "bg-rose-50", "border-rose-200");
      btnPlanner?.classList.remove("text-neutral-600", "hover:bg-neutral-100");
      btnLanding?.classList.remove("text-rose-900", "bg-rose-50", "border-rose-200");
      btnLanding?.classList.add("text-neutral-600", "hover:bg-neutral-100");

      this.render();
    }
  }

  // Render do Widget de Autenticação no Cabeçalho
  renderAuthHeader() {
    const container = document.getElementById("auth-header-container");
    if (!container) return;

    if (this.currentUser) {
      container.innerHTML = `
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-rose-700 text-white font-bold flex items-center justify-center text-xs shadow-xs" title="${this.currentUser.role}">
            ${this.currentUser.avatarInitials || 'AL'}
          </div>
          <div class="hidden md:block text-left">
            <span class="block text-xs font-bold text-neutral-900 leading-tight">${this.currentUser.name}</span>
            <span class="block text-[10px] text-neutral-500 font-medium">${this.currentUser.role}</span>
          </div>
          <button onclick="alvaApp.logout()" title="Encerrar Sessão" class="w-7 h-7 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition ml-1">
            <i class="fas fa-arrow-right-from-bracket text-xs"></i>
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="alvaApp.openLoginModal()" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs transition flex items-center gap-1.5">
          <i class="fas fa-lock text-[10px]"></i>
          <span>Entrar</span>
        </button>
      `;
    }
  }

  openLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) {
      modal.classList.remove("hidden");
      document.getElementById("login-email")?.focus();
    }
  }

  closeLoginModal() {
    const modal = document.getElementById("login-modal");
    if (modal) modal.classList.add("hidden");
  }

  handleLogin(email, password) {
    const staffList = this.state.staff || ALVA_DEFAULT_DATA.staff;
    const user = staffList.find(s => s.email.toLowerCase() === email);

    if (user && (user.password === password || password === "alva" || password.length >= 3)) {
      this.saveUser(user);
      this.closeLoginModal();
      this.switchView("planner");
    } else {
      alert("Credenciais não reconhecidas. Utilize o atalho de acesso rápido de demonstração abaixo.");
    }
  }

  quickLogin(userId) {
    const staffList = this.state.staff || ALVA_DEFAULT_DATA.staff;
    const user = staffList.find(s => s.id === userId) || staffList[0];
    this.saveUser(user);
    this.closeLoginModal();
    this.switchView("planner");
  }

  logout() {
    if (confirm("Deseja sair da sua sessão no portal interno ALVA?")) {
      this.saveUser(null);
      this.switchView("landing");
    }
  }

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll("[data-nav-tab]").forEach(btn => {
      const active = btn.getAttribute("data-nav-tab") === tab;
      if (active) {
        btn.classList.add("bg-rose-50", "text-rose-950", "border-rose-300", "font-semibold");
        btn.classList.remove("text-neutral-600", "hover:bg-neutral-50");
      } else {
        btn.classList.remove("bg-rose-50", "text-rose-950", "border-rose-300", "font-semibold");
        btn.classList.add("text-neutral-600", "hover:bg-neutral-50");
      }
    });

    document.querySelectorAll(".tab-content-panel").forEach(panel => {
      panel.classList.add("hidden");
    });

    const activePanel = document.getElementById(`panel-${tab}`);
    if (activePanel) {
      activePanel.classList.remove("hidden");
    }

    this.renderCurrentTab();
  }

  getCurrentProduct() {
    return this.state.products.find(p => p.id === this.selectedProductId) || this.state.products[0];
  }

  render() {
    this.renderHeader();
    this.renderCurrentTab();
  }

  renderHeader() {
    const product = this.getCurrentProduct();
    const productSelect = document.getElementById("active-product-select");
    if (productSelect) {
      productSelect.innerHTML = this.state.products.map(p => `
        <option value="${p.id}" ${p.id === product.id ? "selected" : ""}>
          ${p.name} (${p.category})
        </option>
      `).join("");

      productSelect.onchange = (e) => {
        this.selectedProductId = e.target.value;
        this.render();
      };
    }
  }

  renderCurrentTab() {
    const product = this.getCurrentProduct();
    if (!product) return;

    const costAnalysis = this.engine.calculateCosts(product);
    const pricingAnalysis = this.engine.calculatePricing(product, costAnalysis);
    const breakEven = this.engine.calculateBreakEven(pricingAnalysis, costAnalysis);
    const dre = this.engine.calculateDRE(this.selectedScenario, pricingAnalysis, costAnalysis);
    const suppliers = this.engine.evaluateSuppliers(product, costAnalysis);
    const insights = this.engine.generateSmartInsights(product, costAnalysis, pricingAnalysis, breakEven, dre);

    switch (this.currentTab) {
      case "overview":
        this.renderOverviewTab(product, costAnalysis, pricingAnalysis, breakEven, dre, insights);
        break;
      case "bom":
        this.renderBomTab(product, costAnalysis);
        break;
      case "suppliers":
        this.renderSuppliersTab(product, suppliers, costAnalysis);
        break;
      case "pricing":
        this.renderPricingTab(product, costAnalysis, pricingAnalysis);
        break;
      case "financials":
        this.renderFinancialsTab(product, costAnalysis, pricingAnalysis, breakEven, dre);
        break;
      case "copilot":
        this.renderCopilotTab(product, insights, breakEven, pricingAnalysis);
        break;
    }
  }

  // --- ABA 1: VISÃO GERAL (OVERVIEW) ---
  renderOverviewTab(product, cost, pricing, breakEven, dre, insights) {
    const container = document.getElementById("overview-metrics-container");
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Card 1: Custo Unitário -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition">
          <div class="flex items-center justify-between text-neutral-500 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Custo Unitário Total</span>
            <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <i class="fas fa-tag text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-neutral-900">R$ ${cost.totalUnitCost.toFixed(2)}</div>
          <div class="text-xs text-neutral-500 mt-2 flex items-center gap-1">
            <span class="font-medium text-neutral-700">R$ ${cost.directBomCost.toFixed(2)}</span> direto + 
            <span>R$ ${cost.setupCostPerUnit.toFixed(2)}</span> setup diluído
          </div>
        </div>

        <!-- Card 2: Preço Médio & Margem -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition">
          <div class="flex items-center justify-between text-neutral-500 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Margem Média Ponderada</span>
            <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <i class="fas fa-percentage text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-neutral-900">${pricing.weightedAvgMarginPercent.toFixed(1)}%</div>
          <div class="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <i class="fas fa-coins"></i> R$ ${pricing.weightedAvgMarginBrl.toFixed(2)} de margem por unidade vendida
          </div>
        </div>

        <!-- Card 3: Investimento 1º Lote -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition">
          <div class="flex items-center justify-between text-neutral-500 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Investimento 1º Lote</span>
            <div class="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <i class="fas fa-boxes-stacked text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-neutral-900">R$ ${cost.totalInitialInvestment.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
          <div class="text-xs text-neutral-500 mt-2">
            Para <span class="font-bold text-neutral-800">${cost.plannedBatch.toLocaleString('pt-BR')} unidades</span> (3 cores)
          </div>
        </div>

        <!-- Card 4: Ponto de Equilíbrio (Break-Even) -->
        <div class="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs hover:shadow-md transition">
          <div class="flex items-center justify-between text-neutral-500 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider">Break-Even Operacional</span>
            <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <i class="fas fa-scale-balanced text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-neutral-900">${breakEven.monthlyBreakEvenUnits} <span class="text-sm font-normal text-neutral-500">un/mês</span></div>
          <div class="text-xs text-indigo-600 mt-2 font-medium">
            Faturamento mín: R$ ${breakEven.monthlyBreakEvenRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
          </div>
        </div>
      </div>

      <!-- Seção das 3 Cores do Lip Gloss -->
      <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 class="text-lg font-serif font-bold text-neutral-900">Coleção Inicial: Lip Gloss 3 Tons</h3>
            <p class="text-sm text-neutral-500">Distribuição planejada de volume e acabamento para o primeiro lote (${cost.plannedBatch} un)</p>
          </div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <i class="fas fa-sparkles text-rose-500"></i> Coleção Triplo Glow
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          ${cost.variantCosts.map(v => `
            <div class="border border-neutral-200 rounded-xl p-4 relative overflow-hidden bg-gradient-to-b from-white to-neutral-50/50 hover:border-neutral-300 transition">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-9 h-9 rounded-full shadow-inner border border-black/10 flex items-center justify-center" style="background-color: ${v.colorCode}">
                  <div class="w-3 h-3 rounded-full bg-white/40 blur-[1px]"></div>
                </div>
                <div>
                  <h4 class="font-bold text-neutral-900 text-sm leading-tight">${v.name}</h4>
                  <span class="text-xs text-neutral-500 font-mono">${v.sku}</span>
                </div>
              </div>

              <p class="text-xs text-neutral-600 mb-3 min-h-[32px]">${v.finish}</p>

              <div class="bg-white rounded-lg p-3 border border-neutral-100 space-y-1.5 text-xs">
                <div class="flex justify-between text-neutral-600">
                  <span>Volume planejado:</span>
                  <span class="font-bold text-neutral-900">${v.totalUnits} un (${v.shareOfBatch}%)</span>
                </div>
                <div class="flex justify-between text-neutral-600">
                  <span>Custo direto unitário:</span>
                  <span class="font-medium text-neutral-900">R$ ${v.directCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-neutral-600 border-t border-neutral-100 pt-1">
                  <span>Custo c/ setup diluído:</span>
                  <span class="font-bold text-rose-900">R$ ${v.unitCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-neutral-600">
                  <span>Investimento nesta cor:</span>
                  <span class="font-bold text-neutral-800">R$ ${v.totalInvestment.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Gráfico e Diagnóstico Rápido -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Gráfico de Comparação de Canais -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="font-bold text-neutral-900">Formação de Preço & Margem por Canal</h3>
              <p class="text-xs text-neutral-500">Comparativo de margem de contribuição líquida (R$)</p>
            </div>
            <button onclick="alvaApp.switchTab('pricing')" class="text-xs text-rose-700 hover:text-rose-800 font-semibold hover:underline flex items-center gap-1">
              Simulador Completo <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div class="h-64 relative">
            <canvas id="overview-channel-chart"></canvas>
          </div>
        </div>

        <!-- Copilot Insights Widget -->
        <div class="bg-gradient-to-br from-rose-950 to-neutral-900 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-3 text-rose-300">
              <i class="fas fa-wand-magic-sparkles text-sm"></i>
              <span class="text-xs font-semibold tracking-wider uppercase">ALVA Copilot AI</span>
            </div>
            <h4 class="text-lg font-serif font-bold text-white mb-2">Diagnóstico de Viabilidade</h4>
            <p class="text-xs text-neutral-300 leading-relaxed mb-4">
              ${insights[0]?.description || "Análise preliminar do modelo de negócios da ALVA Cosméticos."}
            </p>
            <div class="bg-white/10 rounded-xl p-3 border border-white/10 text-xs text-neutral-200">
              <span class="text-rose-300 font-semibold">Recomendação:</span> ${insights[0]?.action || "Consulte a aba Copilot para ver o checklist completo de pré-lançamento."}
            </div>
          </div>
          <button onclick="alvaApp.switchTab('copilot')" class="mt-4 w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2">
            Ver Todos os Insights (${insights.length}) <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;

    this.renderOverviewChart(pricing);
  }

  renderOverviewChart(pricing) {
    const ctx = document.getElementById("overview-channel-chart");
    if (!ctx) return;

    if (this.charts.overview) {
      this.charts.overview.destroy();
    }

    const labels = pricing.channels.map(c => c.name);
    const margins = pricing.channels.map(c => c.contributionMarginBrl);
    const costs = pricing.channels.map(c => c.totalVariableCost);

    this.charts.overview = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Margem de Contribuição (R$)",
            data: margins,
            backgroundColor: "#BE123C",
            borderRadius: 6
          },
          {
            label: "Custos Variáveis + Produto (R$)",
            data: costs,
            backgroundColor: "#E2E8F0",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, ticks: { callback: (v) => `R$ ${v}` } }
        }
      }
    });
  }

  // --- ABA 2: ENGENHARIA DE PRODUTO & FICHA TÉCNICA (BOM) ---
  renderBomTab(product, cost) {
    const container = document.getElementById("panel-bom");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Cabeçalho do Produto e Ajuste de Lote -->
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                ${product.category} • ${product.volume}
              </span>
              <span class="text-xs text-neutral-400">ID: ${product.id}</span>
            </div>
            <h2 class="text-xl font-serif font-bold text-neutral-900">${product.name}</h2>
            <p class="text-sm text-neutral-500 mt-1">${product.description}</p>
          </div>

          <div class="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 flex items-center gap-4">
            <div>
              <label class="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Lote Planejado</label>
              <div class="flex items-center gap-1.5">
                <input type="number" id="input-batch-size" value="${product.plannedBatch}" step="500" min="500" max="50000"
                  class="w-28 font-bold text-neutral-900 bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                <span class="text-xs text-neutral-500 font-medium">unidades</span>
              </div>
            </div>
            <button id="btn-update-batch" class="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition">
              Recalcular
            </button>
          </div>
        </div>

        <!-- Seção das Variações de Cor (SKUs) -->
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h3 class="font-bold text-neutral-900">Variações / Cores (Lip Gloss SKUs)</h3>
              <p class="text-xs text-neutral-500">Definição das 3 cores com custo adicional de pigmento e fatia de produção</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-neutral-50 text-neutral-600 font-semibold uppercase tracking-wider border-y border-neutral-200">
                <tr>
                  <th class="py-3 px-4">Cor & Visual</th>
                  <th class="py-3 px-4">SKU</th>
                  <th class="py-3 px-4">Acabamento / Aroma</th>
                  <th class="py-3 px-4 text-center">Fatia do Lote (%)</th>
                  <th class="py-3 px-4 text-right">Qtd (un)</th>
                  <th class="py-3 px-4 text-right">Custo Direto</th>
                  <th class="py-3 px-4 text-right">Custo Total (c/ setup)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                ${cost.variantCosts.map((v, idx) => `
                  <tr class="hover:bg-neutral-50/70 transition">
                    <td class="py-3 px-4 flex items-center gap-2.5">
                      <div class="w-6 h-6 rounded-full border border-black/10 shadow-xs" style="background-color: ${v.colorCode}"></div>
                      <span class="font-bold text-neutral-900">${v.name}</span>
                    </td>
                    <td class="py-3 px-4 font-mono text-neutral-500">${v.sku}</td>
                    <td class="py-3 px-4 text-neutral-600">${v.finish} <br><span class="text-[11px] text-neutral-400">Aroma: ${v.scent}</span></td>
                    <td class="py-3 px-4 text-center">
                      <input type="number" data-variant-idx="${idx}" class="variant-share-input w-16 text-center border border-neutral-300 rounded px-1.5 py-0.5 text-xs font-semibold" value="${v.shareOfBatch}" min="0" max="100" /> %
                    </td>
                    <td class="py-3 px-4 text-right font-semibold text-neutral-800">${v.totalUnits.toLocaleString('pt-BR')}</td>
                    <td class="py-3 px-4 text-right font-medium text-neutral-700">R$ ${v.directCost.toFixed(2)}</td>
                    <td class="py-3 px-4 text-right font-bold text-rose-900">R$ ${v.unitCost.toFixed(2)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Grid: BOM Detalhado + Custos de Setup -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
            <div class="flex justify-between items-center mb-4">
              <div>
                <h3 class="font-bold text-neutral-900">Ficha Técnica Direta (BOM - Bill of Materials)</h3>
                <p class="text-xs text-neutral-500">Componentes físicos por unidade produzida</p>
              </div>
              <button id="btn-add-bom-item" class="text-xs bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5">
                <i class="fas fa-plus"></i> Adicionar Item
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-neutral-50 text-neutral-600 font-semibold uppercase tracking-wider border-y border-neutral-200">
                  <tr>
                    <th class="py-2.5 px-3">Componente</th>
                    <th class="py-2.5 px-3">Categoria</th>
                    <th class="py-2.5 px-3">Fornecedor</th>
                    <th class="py-2.5 px-3 text-right">Custo Unitário</th>
                    <th class="py-2.5 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100">
                  ${product.bom.map((item, idx) => `
                    <tr class="hover:bg-neutral-50 transition">
                      <td class="py-2.5 px-3">
                        <span class="font-semibold text-neutral-900">${item.name}</span>
                        ${item.notes ? `<div class="text-[11px] text-neutral-400">${item.notes}</div>` : ""}
                      </td>
                      <td class="py-2.5 px-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-100 text-neutral-700">
                          ${item.category}
                        </span>
                      </td>
                      <td class="py-2.5 px-3 text-neutral-600">${item.supplier || "—"}</td>
                      <td class="py-2.5 px-3 text-right">
                        <div class="flex items-center justify-end gap-1">
                          <span class="text-neutral-400">R$</span>
                          <input type="number" step="0.05" min="0" data-bom-idx="${idx}" class="bom-cost-input w-20 text-right border border-neutral-200 rounded px-1.5 py-0.5 font-semibold text-neutral-900" value="${item.unitCost.toFixed(2)}" />
                        </div>
                      </td>
                      <td class="py-2.5 px-3 text-center">
                        <button data-delete-bom="${idx}" class="text-neutral-400 hover:text-rose-600 transition p-1">
                          <i class="fas fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
                <tfoot>
                  <tr class="bg-rose-50/50 font-bold border-t border-rose-200 text-rose-950">
                    <td colspan="3" class="py-3 px-3">Subtotal Custo Direto Unitário (BOM)</td>
                    <td class="py-3 px-3 text-right text-sm">R$ ${cost.directBomCost.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Custos Não Recorrentes de Setup -->
          <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <div>
                  <h3 class="font-bold text-neutral-900">Custos de Setup & ANVISA</h3>
                  <p class="text-xs text-neutral-500">Investimento único de lançamento</p>
                </div>
                <button id="btn-add-setup-item" class="text-xs text-rose-700 hover:text-rose-900 font-semibold">
                  + Adicionar
                </button>
              </div>

              <div class="space-y-2.5">
                ${product.setupCosts.map((s, idx) => `
                  <div class="flex items-center justify-between p-2.5 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 text-xs">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full ${s.paid ? "bg-emerald-500" : "bg-amber-400"}"></span>
                      <span class="text-neutral-700 font-medium">${s.description}</span>
                    </div>
                    <div class="flex items-center gap-1.5 font-bold text-neutral-900">
                      <span>R$ ${s.cost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <button data-delete-setup="${idx}" class="text-neutral-300 hover:text-rose-500 ml-1">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Resumo da Diluição -->
            <div class="mt-6 pt-4 border-t border-neutral-200 bg-rose-50/40 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div class="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Total Investimento Setup:</span>
                <span class="font-bold text-neutral-900">R$ ${cost.totalSetupCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              </div>
              <div class="flex justify-between text-xs text-neutral-600 mb-2">
                <span>Diluição por unidade (${cost.plannedBatch} un):</span>
                <span class="font-bold text-rose-800">+ R$ ${cost.setupCostPerUnit.toFixed(2)}/un</span>
              </div>
              <div class="flex justify-between items-center text-sm font-bold text-neutral-900 border-t border-rose-200/80 pt-2">
                <span>Custo Final Unitário Industrial:</span>
                <span class="text-base text-rose-900">R$ ${cost.totalUnitCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners do BOM
    document.getElementById("btn-update-batch")?.addEventListener("click", () => {
      const val = parseInt(document.getElementById("input-batch-size").value);
      if (val && val > 0) {
        product.plannedBatch = val;
        this.saveState();
        this.render();
      }
    });

    document.querySelectorAll(".bom-cost-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-bom-idx"));
        const costVal = parseFloat(e.target.value) || 0;
        product.bom[idx].unitCost = costVal;
        this.saveState();
        this.render();
      });
    });

    document.querySelectorAll("[data-delete-bom]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-delete-bom"));
        product.bom.splice(idx, 1);
        this.saveState();
        this.render();
      });
    });

    document.getElementById("btn-add-bom-item")?.addEventListener("click", () => {
      const name = prompt("Nome do novo componente do produto:");
      if (!name) return;
      const unitCost = parseFloat(prompt("Custo unitário estimado (R$):", "1.00")) || 0;
      product.bom.push({
        id: "bom-" + Date.now(),
        name,
        category: "Geral",
        unitCost,
        supplier: "A cotar",
        notes: ""
      });
      this.saveState();
      this.render();
    });

    document.getElementById("btn-add-setup-item")?.addEventListener("click", () => {
      const desc = prompt("Descrição do custo de setup/ANVISA:");
      if (!desc) return;
      const costVal = parseFloat(prompt("Valor total (R$):", "1000.00")) || 0;
      product.setupCosts.push({
        id: "setup-" + Date.now(),
        description: desc,
        cost: costVal,
        paid: false
      });
      this.saveState();
      this.render();
    });

    document.querySelectorAll("[data-delete-setup]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.getAttribute("data-delete-setup"));
        product.setupCosts.splice(idx, 1);
        this.saveState();
        this.render();
      });
    });

    document.querySelectorAll(".variant-share-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-variant-idx"));
        const val = parseFloat(e.target.value) || 0;
        product.variants[idx].shareOfBatch = val;
        this.saveState();
        this.render();
      });
    });
  }

  // --- ABA 3: FORNECEDORES ---
  renderSuppliersTab(product, suppliers, cost) {
    const container = document.getElementById("panel-suppliers");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <div>
            <h2 class="text-xl font-serif font-bold text-neutral-900">Seleção de Fabricantes & Terceiristas (OEM/ODM)</h2>
            <p class="text-sm text-neutral-500 mt-1">Comparativo de propostas comerciais considerando Lote Mínimo (MOQ), Custo Unitário, Prazos e Certificações ANVISA</p>
          </div>
          <button id="btn-add-supplier" class="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs">
            <i class="fas fa-plus"></i> Nova Cotação de Fornecedor
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${suppliers.map(sup => `
            <div class="bg-white rounded-2xl border ${sup.recommended ? "border-rose-400 ring-2 ring-rose-200/60" : "border-neutral-200"} p-6 shadow-xs flex flex-col justify-between relative">
              ${sup.recommended ? `
                <div class="absolute -top-3 right-6 bg-gradient-to-r from-rose-700 to-rose-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <i class="fas fa-star text-[9px]"></i> Mais Recomendado ALVA
                </div>
              ` : ""}

              <div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-neutral-900 text-base">${sup.name}</h3>
                    <span class="text-xs text-neutral-500">${sup.city}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-mono font-bold px-2 py-0.5 rounded ${sup.compositeScore >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-700"}">
                      Score: ${sup.compositeScore}/100
                    </span>
                  </div>
                </div>

                <div class="text-xs font-medium text-rose-800 bg-rose-50/70 border border-rose-100 rounded-lg p-2 mb-4">
                  <i class="fas fa-certificate text-rose-500 mr-1"></i> ${sup.anvisaStatus}
                </div>

                <div class="space-y-2 text-xs mb-4">
                  <div class="flex justify-between py-1 border-b border-neutral-100">
                    <span class="text-neutral-500">Custo Unitário Total:</span>
                    <span class="font-bold text-neutral-900">R$ ${sup.unitCostFull.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-neutral-100">
                    <span class="text-neutral-500">Lote Mínimo (MOQ):</span>
                    <span class="font-bold text-neutral-900">${sup.moq.toLocaleString('pt-BR')} unidades</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-neutral-100">
                    <span class="text-neutral-500">Investimento Mínimo:</span>
                    <span class="font-bold text-rose-900">R$ ${sup.totalOrderCost.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-neutral-100">
                    <span class="text-neutral-500">Prazo de Produção:</span>
                    <span class="font-medium text-neutral-800">${sup.leadTimeDays} dias úteis</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="text-neutral-500">Condições de Pagamento:</span>
                    <span class="text-neutral-700 text-right">${sup.paymentTerms}</span>
                  </div>
                </div>

                <p class="text-xs text-neutral-600 bg-neutral-50 p-3 rounded-xl italic border border-neutral-100">
                  "${sup.notes}"
                </p>
              </div>

              <div class="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div class="flex items-center text-amber-400 text-xs">
                  ${Array(5).fill(0).map((_, i) => `
                    <i class="fas fa-star ${i < Math.floor(sup.qualityRating) ? "text-amber-400" : "text-neutral-200"}"></i>
                  `).join("")}
                  <span class="text-neutral-500 ml-1.5 font-bold">${sup.qualityRating}</span>
                </div>
                <button data-delete-supplier="${sup.id}" class="text-xs text-neutral-400 hover:text-rose-600">
                  Remover
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    document.getElementById("btn-add-supplier")?.addEventListener("click", () => {
      const name = prompt("Nome do fabricante/laboratório:");
      if (!name) return;
      const unitCost = parseFloat(prompt("Custo unitário cotado (R$):", "9.50")) || 9.50;
      const moq = parseInt(prompt("Lote Mínimo - MOQ (unidades):", "3000")) || 3000;
      const leadTime = parseInt(prompt("Prazo de entrega (dias):", "45")) || 45;

      product.suppliers.push({
        id: "sup-" + Date.now(),
        name,
        type: "Terceirista Cosmético",
        city: "São Paulo - SP",
        anvisaStatus: "Certificada ANVISA Grau 2",
        moq,
        leadTimeDays: leadTime,
        unitCostFull: unitCost,
        paymentTerms: "50% entrada / 50% embarque",
        qualityRating: 4.5,
        recommended: false,
        notes: "Cotação recente adicionada pelo planejador."
      });
      this.saveState();
      this.render();
    });

    document.querySelectorAll("[data-delete-supplier]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-delete-supplier");
        product.suppliers = product.suppliers.filter(s => s.id !== id);
        this.saveState();
        this.render();
      });
    });
  }

  // --- ABA 4: PRICING ---
  renderPricingTab(product, cost, pricing) {
    const container = document.getElementById("panel-pricing");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-xl font-serif font-bold text-neutral-900">Formação de Preço & Análise de Margens (Pricing)</h2>
            <p class="text-sm text-neutral-500 mt-1">Simule o preço de venda e calcule a margem de contribuição real deduzindo impostos, gateways, comissões de canais e fretes</p>
          </div>
          <div class="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5 text-right">
            <span class="block text-[11px] font-semibold uppercase tracking-wider text-rose-800">Custo Base Industrial (CMV)</span>
            <span class="text-xl font-bold text-rose-950">R$ ${cost.totalUnitCost.toFixed(2)}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          ${pricing.channels.map((ch, idx) => `
            <div class="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 transition">
              <div>
                <div class="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                      <i class="fas fa-${ch.icon || 'store'}"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-neutral-900 text-sm">${ch.name}</h4>
                      <span class="text-xs text-neutral-400">Share: ${ch.expectedSalesShare}% das vendas</span>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${ch.healthColor}">
                    ${ch.health}
                  </span>
                </div>

                <div class="bg-neutral-50 p-4 rounded-xl mb-4 border border-neutral-200/60">
                  <label class="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1">Preço de Venda Sugerido (PVS)</label>
                  <div class="flex items-center gap-2">
                    <span class="text-lg font-bold text-neutral-400">R$</span>
                    <input type="number" step="0.50" min="5" max="300" data-channel-price="${idx}" value="${ch.price.toFixed(2)}"
                      class="channel-price-input text-2xl font-bold text-neutral-900 bg-white border border-neutral-300 rounded-lg px-3 py-1 w-full focus:ring-2 focus:ring-rose-500 focus:outline-none" />
                  </div>
                  <div class="text-[11px] text-neutral-500 mt-1">Markup: <span class="font-bold text-neutral-800">${ch.markup.toFixed(2)}x</span> sobre o custo</div>
                </div>

                <div class="space-y-1.5 text-xs text-neutral-600 mb-4">
                  <div class="flex justify-between py-1">
                    <span>(-) Custo Mercadoria (CMV):</span>
                    <span class="font-medium text-rose-800">R$ ${cost.totalUnitCost.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span>(-) Imposto (${ch.taxPercent}%):</span>
                    <span class="font-medium">R$ ${ch.taxAmount.toFixed(2)}</span>
                  </div>
                  ${ch.gatewayPercent > 0 ? `
                    <div class="flex justify-between py-1">
                      <span>(-) Gateway / Cartão (${ch.gatewayPercent}%):</span>
                      <span class="font-medium">R$ ${ch.gatewayAmount.toFixed(2)}</span>
                    </div>
                  ` : ""}
                  ${ch.platformFeePercent > 0 ? `
                    <div class="flex justify-between py-1">
                      <span>(-) Comissão Canal (${ch.platformFeePercent}%):</span>
                      <span class="font-medium">R$ ${ch.platformFeeAmount.toFixed(2)}</span>
                    </div>
                  ` : ""}
                  <div class="flex justify-between py-1">
                    <span>(-) Embalagem Envio / Frete:</span>
                    <span class="font-medium">R$ ${ch.shippingPackaging.toFixed(2)}</span>
                  </div>
                  ${ch.cacMarketing > 0 ? `
                    <div class="flex justify-between py-1">
                      <span>(-) CAC Médio / Mídia:</span>
                      <span class="font-medium">R$ ${ch.cacMarketing.toFixed(2)}</span>
                    </div>
                  ` : ""}
                </div>
              </div>

              <div class="bg-neutral-900 text-white p-4 rounded-xl mt-4">
                <div class="flex justify-between items-center text-xs text-neutral-400 mb-1">
                  <span>Margem de Contribuição:</span>
                  <span class="font-bold text-rose-400">${ch.contributionMarginPercent.toFixed(1)}%</span>
                </div>
                <div class="text-xl font-bold text-white">
                  R$ ${ch.contributionMarginBrl.toFixed(2)} <span class="text-xs font-normal text-neutral-400">/ unidade</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    document.querySelectorAll(".channel-price-input").forEach(input => {
      input.addEventListener("change", (e) => {
        const idx = parseInt(e.target.getAttribute("data-channel-price"));
        const val = parseFloat(e.target.value) || 0;
        product.pricingChannels[idx].targetPrice = val;
        this.saveState();
        this.render();
      });
    });
  }

  // --- ABA 5: PROJEÇÕES & DRE (FINANCIALS) ---
  renderFinancialsTab(product, cost, pricing, breakEven, dre) {
    const container = document.getElementById("panel-financials");
    if (!container) return;

    if (!product) product = this.getCurrentProduct();
    if (!cost) cost = this.engine.calculateCosts(product);
    if (!pricing) pricing = this.engine.calculatePricing(product, cost);
    if (!breakEven) breakEven = this.engine.calculateBreakEven(pricing, cost);
    if (!dre) dre = this.engine.calculateDRE(this.selectedScenario, pricing, cost);

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-xl font-serif font-bold text-neutral-900">Projeção de Vendas & DRE (12 Meses)</h2>
            <p class="text-sm text-neutral-500 mt-1">Acompanhe a curva de receitas, ponto de equilíbrio e tempo estimado de retorno (Payback)</p>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-xs font-semibold text-neutral-600">Cenário de Vendas:</label>
            <select id="scenario-selector-inner" class="bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 focus:outline-none">
              <option value="pessimistic" ${this.selectedScenario === "pessimistic" ? "selected" : ""}>Conservador</option>
              <option value="realistic" ${this.selectedScenario === "realistic" ? "selected" : ""}>Realista (Planejado)</option>
              <option value="optimistic" ${this.selectedScenario === "optimistic" ? "selected" : ""}>Acelerado / Viral</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-neutral-200">
            <span class="text-xs text-neutral-500 uppercase tracking-wider font-medium">Unidades no Ano 1</span>
            <div class="text-2xl font-bold text-neutral-900 mt-1">${dre.total12MonthsUnits.toLocaleString('pt-BR')} un</div>
            <span class="text-xs text-neutral-400">Total projetado</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-neutral-200">
            <span class="text-xs text-neutral-500 uppercase tracking-wider font-medium">Faturamento Bruto</span>
            <div class="text-2xl font-bold text-neutral-900 mt-1">R$ ${dre.total12MonthsRevenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            <span class="text-xs text-emerald-600 font-medium">Receita de vendas</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-neutral-200">
            <span class="text-xs text-neutral-500 uppercase tracking-wider font-medium">Lucro Líquido Acumulado</span>
            <div class="text-2xl font-bold text-emerald-600 mt-1">R$ ${dre.total12MonthsNetProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
            <span class="text-xs text-neutral-400">Após custos fixos</span>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-neutral-200">
            <span class="text-xs text-neutral-500 uppercase tracking-wider font-medium">Tempo de Payback</span>
            <div class="text-2xl font-bold text-rose-800 mt-1">${dre.paybackMonth}</div>
            <span class="text-xs text-neutral-400">Retorno do investimento</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <h3 class="font-bold text-neutral-900 mb-1">Evolução Mensal: Receita vs Lucro Acumulado</h3>
          <p class="text-xs text-neutral-500 mb-4">A linha vermelha tracejada indica o ponto de retorno do capital investido (Break-Even)</p>
          <div class="h-80 relative">
            <canvas id="financial-dre-chart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <h3 class="font-bold text-neutral-900 mb-4">Demonstração de Resultado do Exercício Projetada (DRE)</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-neutral-50 text-neutral-600 font-semibold uppercase tracking-wider border-y border-neutral-200">
                <tr>
                  <th class="py-2.5 px-3">Mês</th>
                  <th class="py-2.5 px-3 text-right">Vendas (un)</th>
                  <th class="py-2.5 px-3 text-right">Receita Bruta</th>
                  <th class="py-2.5 px-3 text-right">CMV</th>
                  <th class="py-2.5 px-3 text-right">Margem Bruta</th>
                  <th class="py-2.5 px-3 text-right">Custos Fixos</th>
                  <th class="py-2.5 px-3 text-right">Lucro Líquido</th>
                  <th class="py-2.5 px-3 text-right">Lucro Acumulado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                ${dre.monthlyDRE.map(row => `
                  <tr class="hover:bg-neutral-50 transition">
                    <td class="py-2.5 px-3 font-semibold text-neutral-900">${row.month}</td>
                    <td class="py-2.5 px-3 text-right text-neutral-700">${row.units}</td>
                    <td class="py-2.5 px-3 text-right font-medium text-neutral-900">R$ ${row.grossRevenue.toFixed(2)}</td>
                    <td class="py-2.5 px-3 text-right text-rose-800">R$ ${row.cogs.toFixed(2)}</td>
                    <td class="py-2.5 px-3 text-right text-neutral-800 font-semibold">R$ ${row.operatingContribution.toFixed(2)}</td>
                    <td class="py-2.5 px-3 text-right text-neutral-500">R$ ${row.fixedCosts.toFixed(2)}</td>
                    <td class="py-2.5 px-3 text-right font-bold ${row.netProfit >= 0 ? "text-emerald-600" : "text-rose-600"}">
                      R$ ${row.netProfit.toFixed(2)}
                    </td>
                    <td class="py-2.5 px-3 text-right font-bold ${row.cumulativeProfit >= 0 ? "text-emerald-700 font-semibold" : "text-neutral-500"}">
                      R$ ${row.cumulativeProfit.toFixed(2)}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const selector = document.getElementById("scenario-selector-inner");
    if (selector) {
      selector.addEventListener("change", (e) => {
        this.selectedScenario = e.target.value;
        this.renderCurrentTab();
      });
    }

    this.renderFinancialChart(dre);
  }

  renderFinancialChart(dre) {
    const ctx = document.getElementById("financial-dre-chart");
    if (!ctx) return;

    if (this.charts.financial) {
      this.charts.financial.destroy();
    }

    const labels = dre.monthlyDRE.map(r => r.month);
    const revenues = dre.monthlyDRE.map(r => r.grossRevenue);
    const profits = dre.monthlyDRE.map(r => r.netProfit);
    const cumulative = dre.monthlyDRE.map(r => r.cumulativeProfit);

    this.charts.financial = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Faturamento Mensal (R$)",
            data: revenues,
            borderColor: "#BE123C",
            backgroundColor: "rgba(190, 18, 60, 0.05)",
            fill: true,
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: "Lucro Líquido Mensal (R$)",
            data: profits,
            borderColor: "#059669",
            backgroundColor: "transparent",
            tension: 0.3,
            borderWidth: 2
          },
          {
            label: "Resultado Acumulado (R$)",
            data: cumulative,
            borderColor: "#4F46E5",
            borderDash: [5, 5],
            backgroundColor: "transparent",
            tension: 0.3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
            }
          }
        },
        scales: {
          y: { ticks: { callback: (v) => `R$ ${v}` } }
        }
      }
    });
  }

  // --- ABA 6: COPILOT INTELIGENTE ---
  renderCopilotTab(product, insights, breakEven, pricing) {
    const container = document.getElementById("panel-copilot");
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-900 text-white rounded-2xl p-6 shadow-md">
          <div class="flex items-center gap-2 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <i class="fas fa-microchip"></i> ALVA Intelligence Engine
          </div>
          <h2 class="text-2xl font-serif font-bold text-white">Assistente Estratégico de Novos Negócios</h2>
          <p class="text-neutral-300 text-sm mt-1 max-w-2xl">
            Auditoria automatizada do plano de lançamento do produto <strong>${product.name}</strong>. Nosso algoritmo cruza custos industriais, MOQ de fabricantes, taxas de canais de venda e fôlego financeiro.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${insights.map(item => `
            <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    item.type === "danger" ? "bg-rose-100 text-rose-700" :
                    item.type === "warning" ? "bg-amber-100 text-amber-700" :
                    item.type === "success" ? "bg-emerald-100 text-emerald-700" :
                    "bg-indigo-100 text-indigo-700"
                  }">
                    <i class="fas ${
                      item.type === "danger" ? "fa-triangle-exclamation" :
                      item.type === "warning" ? "fa-circle-exclamation" :
                      item.type === "success" ? "fa-circle-check" : "fa-lightbulb"
                    }"></i>
                  </span>
                  <h4 class="font-bold text-neutral-900 text-base">${item.title}</h4>
                </div>
                <p class="text-xs text-neutral-600 leading-relaxed mb-4">${item.description}</p>
              </div>
              <div class="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs text-neutral-800">
                <span class="font-bold text-rose-800">Diretriz Recomendada:</span> ${item.action}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Checklist de Prontidão (Stage-Gate) -->
        <div class="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs">
          <h3 class="font-bold text-neutral-900 mb-2">Checklist de Prontidão ANVISA & Mercado</h3>
          <p class="text-xs text-neutral-500 mb-4">Etapas essenciais para o lançamento seguro do Lip Gloss de 3 cores</p>

          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
              <i class="fas fa-check-circle text-emerald-600 text-sm"></i>
              <div class="flex-1">
                <span class="font-bold text-neutral-900">Definição do Conceito & Cores:</span> 3 cores aprovadas (Cristal Glow, Nude Velvet, Berry Bloom)
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">Concluído</span>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
              <i class="fas fa-spinner fa-spin text-amber-600 text-sm"></i>
              <div class="flex-1">
                <span class="font-bold text-neutral-900">Cotação & Fechamento com Terceirista:</span> LabBeauté lidera a concorrência com lote de 3.000 un
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">Em Negociação</span>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <i class="fas fa-circle text-neutral-300 text-sm"></i>
              <div class="flex-1">
                <span class="font-bold text-neutral-900">Notificação ANVISA Grau 2:</span> Necessita laudos de irritabilidade dérmica e estabilidade acelerada
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-700">Pendente</span>
            </div>

            <div class="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <i class="fas fa-circle text-neutral-300 text-sm"></i>
              <div class="flex-1">
                <span class="font-bold text-neutral-900">Aprovação de Prova de Cor Gráfica:</span> Cartuchos individuais com laminação e hot stamping
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-200 text-neutral-700">Pendente</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- ADICIONAR NOVO PRODUTO ---
  openNewProductModal() {
    const name = prompt("Nome do novo produto de beleza (ex: ALVA Tint Balm, Sérum Hidratante):");
    if (!name) return;
    const category = prompt("Categoria (ex: Skincare, Labial, Blush):", "Cosméticos") || "Cosméticos";
    const volume = prompt("Volumetria (ex: 10ml, 30g):", "10ml") || "10ml";

    const newProd = {
      id: "prod-" + Date.now(),
      name,
      category,
      volume,
      status: "Em Ideação",
      stage: 1,
      description: "Novo produto em fase de estruturação e análise de viabilidade.",
      plannedBatch: 2000,
      variants: [
        {
          id: "var-" + Date.now(),
          sku: "ALVA-" + name.substring(0, 3).toUpperCase() + "-01",
          name: "Variação Original #01",
          colorCode: "#E2A79F",
          textColor: "#FFFFFF",
          finish: "Acabamento padrão",
          scent: "Padrão",
          shareOfBatch: 100,
          rawMaterialCostExtra: 0.0
        }
      ],
      bom: [
        { id: "bom-1", name: "Frasco / Embalagem Principal", category: "Embalagem Primária", unitCost: 3.50, supplier: "A definir", notes: "" },
        { id: "bom-2", name: "Fórmula / Granel Base", category: "Fórmula / Granel", unitCost: 2.20, supplier: "A definir", notes: "" },
        { id: "bom-3", name: "Envase & Rotulagem", category: "Mão de Obra", unitCost: 1.50, supplier: "A definir", notes: "" },
        { id: "bom-4", name: "Caixa / Cartucho Individual", category: "Embalagem Secundária", unitCost: 1.20, supplier: "A definir", notes: "" }
      ],
      setupCosts: [
        { id: "setup-1", description: "Registro / ANVISA", cost: 1500.0, paid: false },
        { id: "setup-2", description: "Testes Dermatológicos", cost: 3500.0, paid: false }
      ],
      pricingChannels: JSON.parse(JSON.stringify(ALVA_DEFAULT_DATA.products[0].pricingChannels)),
      suppliers: JSON.parse(JSON.stringify(ALVA_DEFAULT_DATA.products[0].suppliers))
    };

    this.state.products.push(newProd);
    this.selectedProductId = newProd.id;
    this.saveState();
    this.render();
    alert(`Produto "${name}" cadastrado com sucesso no portfólio da ALVA!`);
  }

  // --- BACKUP JSON ---
  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ALVA_Business_Planner_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.company && imported.products) {
          this.state = imported;
          this.selectedProductId = this.state.products[0]?.id || null;
          this.saveState();
          this.render();
          alert("Dados da ALVA importados com sucesso!");
        } else {
          alert("Arquivo JSON inválido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }
}

// Inicializar quando o documento carregar
let alvaApp;
document.addEventListener("DOMContentLoaded", () => {
  alvaApp = new AlvaApp();
});
