# ALVA — Business Planner & Financial Engine

Sistema inteligente de gestão integrada de finanças, P&D e viabilidade de novos negócios voltado para o segmento de cosméticos e beleza premium.

![ALVA Status](https://img.shields.io/badge/Status-Pronto%20para%20Uso-success)
![Produto Inicial](https://img.shields.io/badge/Produto%20Inicial-Lip%20Gloss%20(3%20Cores)-rose)
![Licença](https://img.shields.io/badge/Versão-1.0.0-blue)

---

## 🌸 1. Visão Geral

O **ALVA Business Planner** foi concebido para resolver os principais desafios enfrentados na criação de uma marca de beleza:
- **Engenharia de Custos (BOM):** Mapeamento do custo de cada componente (frascos, aplicadores, formulação, pigmentos, caixinha e taxas de envase).
- **Diluição de Setup / ANVISA:** Rateio dos custos não recorrentes (testes dermatológicos, estabilidade e notificação) por unidade produzida.
- **Seleção de Fabricantes (OEM/ODM):** Scorecard comparativo considerando MOQ (lote mínimo), lead time e certificações.
- **Formação de Preço (Pricing):** Margem de contribuição líquida por canal (E-commerce D2C, Marketplaces e Atacado B2B).
- **Projeções & DRE (12 Meses):** Ponto de equilíbrio (break-even), necessidade de capital de giro e tempo de retorno do investimento (payback).
- **ALVA Copilot AI:** Diagnósticos em tempo real alertando sobre riscos de caixa e oportunidades de maximização de lucro.

---

## 💄 2. O Caso Inicial: Coleção Lip Gloss (3 Cores)

O produto piloto cadastrado no sistema é o **ALVA Glaze - Lip Gloss Hidratante Efeito Plump (4.5 ml)**:
1. **Cor 01 — Cristal Glow (#01):** Incolor perolado com micropartículas refletoras e aroma suave de baunilha (30% do lote).
2. **Cor 02 — Nude Velvet (#02):** Nude rosado elegante com cobertura média espelhada e aroma de pêssego e caramelo (45% do lote - carro-chefe).
3. **Cor 03 — Berry Bloom (#03):** Amora sofisticado com efeito tint e aroma de frutas vermelhas (25% do lote).

---

## 📊 3. Módulos do Sistema

### 1. Visão Geral & Dashboard Executivo
- KPIs fundamentais: Custo Médio Unitário, Margem Ponderada, Investimento do 1º Lote e Ponto de Equilíbrio mensal.
- Cards das 3 cores com cálculo do investimento proporcional em cada tonalidade.
- Gráfico interativo de faturamento vs custos por canal.

### 2. Lip Gloss & Ficha Técnica (BOM)
- Detalhamento de cada insumo físico com edição de custo em tempo real.
- Custos de setup (testes dermatológicos, taxas ANVISA, clichês gráficos).
- Simulador de tamanho do lote (ex: 1.000 vs 3.000 vs 5.000 unidades) com recálculo automático da diluição.

### 3. Fabricantes & Terceiristas
- Comparativo lado a lado de fornecedores reais (LabBeauté, Inovapack, PrimaFace).
- Scorecard automático de 0 a 100 ponderando preço, MOQ, prazos e qualidade.
- Adição de novas cotações com 1 clique.

### 4. Formação de Preço (Pricing Engine)
- **E-commerce Próprio (D2C):** Margem líquida descontando gateway, frete subsidiado, impostos (Simples Nacional) e CAC de marketing.
- **Marketplaces (Mercado Livre, Shopee, TikTok Shop):** Cálculo com comissões de 18% e taxas fixas.
- **Atacado / Salões / Boutiques (B2B):** Tabela com margem saudável para revendedores parceiros.

### 5. Projeções Financeiras & DRE 12 Meses
- Alternância entre cenários **Conservador**, **Realista** e **Acelerado/Viral**.
- Gráfico de linha interativo com a evolução do lucro líquido mensal e resultado acumulado.
- Demonstração de Resultado do Exercício (DRE) projetada mês a mês com indicação do mês de Payback.

### 6. ALVA Copilot AI
- Auditoria de consistência financeira.
- Recomendações de tamanho de lote ideal para o capital disponível.
- Checklist interativo de prontidão para lançamento.

---

## 🚀 4. Como Executar

### Opção 1: Clique Duplo Direto
Basta dar um duplo clique no arquivo:
```bash
run_app.bat
```
ou abrir diretamente o arquivo **`index.html`** em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Opção 2: Servidor Local (Opcional)
Se preferir rodar em servidor local:
```bash
python -m http.server 3000
```
E acesse `http://localhost:3000`.

---

## 💾 5. Persistência e Backup

- **Salvamento Automático:** Todas as edições de custos, preços, lotes e produtos ficam salvas no navegador (`localStorage`).
- **Exportar Backup JSON:** Clique no ícone de download no topo para salvar um backup completo de todos os seus dados e simulações.
- **Importar Backup JSON:** Permite restaurar os dados em qualquer computador.
- **Impressão / PDF:** Clique no ícone de impressora no cabeçalho para gerar um relatório executivo pronto para investidores ou sócios.

---

## ➕ 6. Escalabilidade: Como Adicionar Próximos Produtos

Para expandir o catálogo da ALVA (ex: *Batom Matte, Blush Líquido, Sérum Facial, Hidratante*):
1. Clique no botão **`+ Novo Produto`** no cabeçalho superior.
2. Informe o nome, categoria e volumetria.
3. O novo produto herdará a estrutura completa de BOM, fornecedores, pricing e projeções para você parametrizar individualmente!
