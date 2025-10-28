// Crop database
const cropDatabase = {
  corn: {
    name: "Corn (Maize)",
    nitrogen: 150,
    phosphorus: 60,
    potassium: 60,
    npkRatio: "5-2-2",
    applicationTiming: ["Pre-planting", "Side-dress at V6 stage"],
    notes: [
      "Apply 30% at planting and 70% as side-dress",
      "Monitor leaf color for nitrogen deficiency",
      "Increase rates for high-yield goals (>200 bu/acre)",
    ],
  },
  wheat: {
    name: "Wheat",
    nitrogen: 100,
    phosphorus: 50,
    potassium: 40,
    npkRatio: "5-3-2",
    applicationTiming: ["Fall application", "Spring topdress"],
    notes: [
      "Split application: 60% in fall, 40% in spring",
      "Topdress when plants reach Feekes 5 stage",
      "Adjust based on previous crop residue",
    ],
  },
  rice: {
    name: "Rice",
    nitrogen: 120,
    phosphorus: 40,
    potassium: 40,
    npkRatio: "6-2-2",
    applicationTiming: ["Basal application", "Tillering stage", "Panicle initiation"],
    notes: [
      "Split into 3 applications: 50% basal, 25% tillering, 25% panicle initiation",
      "Ensure adequate water management",
      "Consider zinc application in deficient soils",
    ],
  },
  soybeans: {
    name: "Soybeans",
    nitrogen: 20,
    phosphorus: 50,
    potassium: 80,
    npkRatio: "1-3-4",
    applicationTiming: ["Pre-planting"],
    notes: [
      "Soybeans fix their own nitrogen - minimal N needed",
      "Focus on P and K for pod development",
      "Ensure proper inoculation for nitrogen fixation",
    ],
  },
  tomatoes: {
    name: "Tomatoes",
    nitrogen: 120,
    phosphorus: 80,
    potassium: 120,
    npkRatio: "3-2-3",
    applicationTiming: ["Pre-planting", "Flowering", "Fruit development"],
    notes: [
      "Higher potassium during fruiting improves quality",
      "Avoid excessive nitrogen which promotes foliage over fruit",
      "Consider calcium supplementation to prevent blossom end rot",
    ],
  },
  potatoes: {
    name: "Potatoes",
    nitrogen: 140,
    phosphorus: 70,
    potassium: 140,
    npkRatio: "2-1-2",
    applicationTiming: ["Pre-planting", "Hilling"],
    notes: [
      "High potassium needs for tuber development",
      "Apply 60% at planting, 40% at hilling",
      "Maintain consistent soil moisture",
    ],
  },
  cotton: {
    name: "Cotton",
    nitrogen: 100,
    phosphorus: 50,
    potassium: 50,
    npkRatio: "4-2-2",
    applicationTiming: ["Pre-planting", "First square", "First bloom"],
    notes: [
      "Split application based on growth stages",
      "Monitor plant mapping for nutrient deficiencies",
      "Adjust for previous legume crops",
    ],
  },
  lettuce: {
    name: "Lettuce",
    nitrogen: 100,
    phosphorus: 40,
    potassium: 80,
    npkRatio: "5-2-4",
    applicationTiming: ["Pre-planting", "Side-dress at 2-3 weeks"],
    notes: [
      "High nitrogen for leafy growth",
      "Apply lighter, more frequent applications",
      "Avoid over-fertilization which can affect taste",
    ],
  },
  carrots: {
    name: "Carrots",
    nitrogen: 80,
    phosphorus: 60,
    potassium: 100,
    npkRatio: "2-2-3",
    applicationTiming: ["Pre-planting"],
    notes: [
      "High potassium for root development",
      "Avoid excessive nitrogen which causes forking",
      "Ensure phosphorus for strong root growth",
    ],
  },
};

const soilAdjustments = {
  sandy: { n: 1.2, p: 1.1, k: 1.3 },
  clay: { n: 0.9, p: 1.2, k: 0.9 },
  loamy: { n: 1.0, p: 1.0, k: 1.0 },
  silty: { n: 1.0, p: 1.1, k: 1.0 },
  peaty: { n: 0.8, p: 1.0, k: 1.1 },
  chalky: { n: 1.1, p: 1.3, k: 1.0 },
};

const soilAmendmentRecommendations = {
  sandy: [
    "Add organic matter to improve water retention",
    "Consider more frequent, lighter applications due to leaching",
    "Incorporate compost to improve nutrient holding capacity",
  ],
  clay: [
    "Add gypsum to improve soil structure",
    "Incorporate organic matter to improve drainage",
    "Consider subsurface drainage if waterlogging occurs",
  ],
  loamy: [
    "Maintain organic matter with cover crops or compost",
    "Excellent soil - minimal amendments needed",
  ],
  silty: [
    "Add organic matter to prevent compaction",
    "Avoid working soil when too wet",
  ],
  peaty: [
    "May need lime to adjust pH",
    "Add sand or clay to improve structure",
    "Monitor drainage and consider raised beds",
  ],
  chalky: [
    "Add organic matter regularly",
    "Monitor for iron and manganese deficiencies",
    "Consider acidifying amendments if pH is too high",
  ],
};

function calculateFertilizerRecommendation(formData) {
  const crop = cropDatabase[formData.cropType];
  const soilAdjustment = soilAdjustments[formData.soilType];

  // Convert ppm to lbs/acre (rough conversion)
  const currentN = formData.nitrogen * 0.002;
  const currentP = formData.phosphorus * 0.002;
  const currentK = formData.potassium * 0.002;

  // Calculate needed nutrients (adjusted for soil type)
  const nitrogenNeeded = Math.max(0, (crop.nitrogen - currentN) * soilAdjustment.n);
  const phosphorusNeeded = Math.max(0, (crop.phosphorus - currentP) * soilAdjustment.p);
  const potassiumNeeded = Math.max(0, (crop.potassium - currentK) * soilAdjustment.k);

  // Total fertilizer (simplified calculation)
  const totalFertilizer = nitrogenNeeded + phosphorusNeeded + potassiumNeeded;

  return {
    cropName: crop.name,
    soilType: formData.soilType.charAt(0).toUpperCase() + formData.soilType.slice(1),
    npkRatio: crop.npkRatio,
    nitrogenNeeded: Math.round(nitrogenNeeded * 10) / 10,
    phosphorusNeeded: Math.round(phosphorusNeeded * 10) / 10,
    potassiumNeeded: Math.round(potassiumNeeded * 10) / 10,
    totalFertilizer: Math.round(totalFertilizer * 10) / 10,
    applicationTiming: crop.applicationTiming,
    additionalNotes: crop.notes,
    soilAmendments: soilAmendmentRecommendations[formData.soilType] || [],
  };
}

function createRecommendationCard(recommendation) {
  const container = document.createElement('div');
  container.className = 'recommendation-container';
  
  container.innerHTML = `
    <div class="fertilizer-card">
      <div class="card-header">
        <h2 class="card-title">
          <svg class="icon icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          Fertilizer Recommendation for ${recommendation.cropName}
        </h2>
        <p class="card-description">
          Based on your ${recommendation.soilType} soil conditions
        </p>
      </div>
      <div class="card-content">
        <div class="recommendation-section">
          <div class="npk-ratio-header">
            <span class="ratio-label">Recommended NPK Ratio</span>
            <span class="ratio-badge">${recommendation.npkRatio}</span>
          </div>
          <hr class="divider" />
        </div>

        <div class="nutrient-grid">
          <div class="nutrient-item">
            <div class="nutrient-label">Nitrogen (N)</div>
            <div class="nutrient-value nutrient-blue">${recommendation.nitrogenNeeded} lbs/acre</div>
          </div>
          <div class="nutrient-item">
            <div class="nutrient-label">Phosphorus (P)</div>
            <div class="nutrient-value nutrient-purple">${recommendation.phosphorusNeeded} lbs/acre</div>
          </div>
          <div class="nutrient-item">
            <div class="nutrient-label">Potassium (K)</div>
            <div class="nutrient-value nutrient-orange">${recommendation.potassiumNeeded} lbs/acre</div>
          </div>
        </div>

        <div class="alert alert-info">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            Total fertilizer needed: <strong>${recommendation.totalFertilizer} lbs/acre</strong>
          </div>
        </div>

        ${recommendation.soilAmendments.length > 0 ? `
          <div class="recommendation-section">
            <h4 class="section-title">
              <svg class="icon icon-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Soil Amendments
            </h4>
            <ul class="recommendation-list">
              ${recommendation.soilAmendments.map(amendment => `<li>${amendment}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="recommendation-section">
          <h4 class="section-title">Application Timing</h4>
          <div class="badge-container">
            ${recommendation.applicationTiming.map(timing => `<span class="badge">${timing}</span>`).join('')}
          </div>
        </div>

        ${recommendation.additionalNotes.length > 0 ? `
          <div class="recommendation-section">
            <h4 class="section-title">Additional Notes</h4>
            <ul class="recommendation-list">
              ${recommendation.additionalNotes.map(note => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  return container;
}

function initializeApp() {
  const root = document.getElementById('root');
  if (!root) return;
  
  root.innerHTML = `
    <div class="app-container">
      <div class="hero-section">
        <img
          src="https://images.unsplash.com/photo-1645341175215-1e554ec2af44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBmaWVsZCUyMGNyb3BzfGVufDF8fHx8MTc2MTU0NDAwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Agricultural field"
          class="hero-image"
        />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="hero-title-container">
            <svg class="hero-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 7s-1-2-5-2-5 2-5 2M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
            </svg>
            <h1>Fertilizer Recommendation Tool</h1>
          </div>
          <p class="hero-description">
            Get science-based fertilizer recommendations tailored to your crop and soil conditions
          </p>
        </div>
      </div>

      <main class="main-content">
        <div class="content-wrapper">
          <div class="fertilizer-card">
            <div class="card-header">
              <h2 class="card-title">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 7s-1-2-5-2-5 2-5 2M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
                </svg>
                Soil & Crop Information
              </h2>
              <p class="card-description">
                Enter your soil test results and crop details to get personalized fertilizer recommendations
              </p>
            </div>
            <div class="card-content">
              <form id="fertilizerForm" class="form-container">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="cropType" class="form-label">Crop Type</label>
                    <select id="cropType" class="form-select" required>
                      <option value="">Select crop</option>
                      <option value="corn">Corn (Maize)</option>
                      <option value="wheat">Wheat</option>
                      <option value="rice">Rice</option>
                      <option value="soybeans">Soybeans</option>
                      <option value="tomatoes">Tomatoes</option>
                      <option value="potatoes">Potatoes</option>
                      <option value="cotton">Cotton</option>
                      <option value="lettuce">Lettuce</option>
                      <option value="carrots">Carrots</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="soilType" class="form-label">Soil Type</label>
                    <select id="soilType" class="form-select" required>
                      <option value="">Select soil type</option>
                      <option value="sandy">Sandy</option>
                      <option value="clay">Clay</option>
                      <option value="loamy">Loamy</option>
                      <option value="silty">Silty</option>
                      <option value="peaty">Peaty</option>
                      <option value="chalky">Chalky</option>
                    </select>
                  </div>
                </div>

                <div class="nutrient-section">
                  <div class="section-header">
                    <svg class="icon icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 3v18l6-3 6 3V3M9 12l2 2 4-4"/>
                    </svg>
                    <label class="form-label">Current Soil Nutrient Levels (ppm)</label>
                  </div>
                  <div class="form-grid-three">
                    <div class="form-group">
                      <label for="nitrogen" class="form-label">Nitrogen (N)</label>
                      <input
                        id="nitrogen"
                        type="number"
                        class="form-input"
                        min="0"
                        value="0"
                        placeholder="0"
                      />
                    </div>
                    <div class="form-group">
                      <label for="phosphorus" class="form-label">Phosphorus (P)</label>
                      <input
                        id="phosphorus"
                        type="number"
                        class="form-input"
                        min="0"
                        value="0"
                        placeholder="0"
                      />
                    </div>
                    <div class="form-group">
                      <label for="potassium" class="form-label">Potassium (K)</label>
                      <input
                        id="potassium"
                        type="number"
                        class="form-input"
                        min="0"
                        value="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <div class="section-header">
                    <svg class="icon icon-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <label for="area" class="form-label">Field Area (acres)</label>
                  </div>
                  <input
                    id="area"
                    type="number"
                    class="form-input"
                    min="0.1"
                    step="0.1"
                    value="1"
                    placeholder="1.0"
                  />
                </div>

                <button type="submit" class="btn btn-primary">
                  Get Fertilizer Recommendation
                </button>
              </form>
            </div>
          </div>
          
          <div id="recommendationContainer"></div>
        </div>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <p class="footer-text">
            <strong>Disclaimer:</strong> These recommendations are general guidelines. Always conduct a soil test 
            and consult with local agricultural extension services for specific advice.
          </p>
        </div>
      </footer>
    </div>
  `;
  
  // Set up form submission
  const form = document.getElementById('fertilizerForm');
  const recommendationContainer = document.getElementById('recommendationContainer');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      cropType: document.getElementById('cropType').value,
      soilType: document.getElementById('soilType').value,
      nitrogen: parseFloat(document.getElementById('nitrogen').value) || 0,
      phosphorus: parseFloat(document.getElementById('phosphorus').value) || 0,
      potassium: parseFloat(document.getElementById('potassium').value) || 0,
      area: parseFloat(document.getElementById('area').value) || 1,
    };
    
    if (formData.cropType && formData.soilType) {
      const recommendation = calculateFertilizerRecommendation(formData);
      const recommendationCard = createRecommendationCard(recommendation);
      
      recommendationContainer.innerHTML = '';
      recommendationContainer.appendChild(recommendationCard);
      
      // Scroll to recommendation
      recommendationCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
