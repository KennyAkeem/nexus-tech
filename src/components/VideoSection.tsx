"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ROIItem {
  days: number;
  roi: number;
  label: string;
  status: string;
}

interface InvestmentScenario {
  amount: number;
  days3: number;
  days7: number;
  days21: number;
}

interface TimeOption {
  days: number;
  label: string;
}

const ROI_DATA: ROIItem[] = [
  { days: 3, roi: 2.5, label: "3 Days ROI", status: "fixed" },
  { days: 7, roi: 6.8, label: "7 Days ROI", status: "fixed" },
  { days: 21, roi: 18.5, label: "21 Days ROI", status: "fixed" },
];

const INVESTMENT_SCENARIOS: InvestmentScenario[] = [
  { amount: 1000, days3: 25, days7: 68, days21: 185 },
  { amount: 5000, days3: 125, days7: 340, days21: 925 },
  { amount: 10000, days3: 250, days7: 680, days21: 1850 },
  { amount: 50000, days3: 1250, days7: 3400, days21: 9250 },
];

export default function InvestmentProjections() {
  const [selectedInvestment, setSelectedInvestment] = useState(5000);
  const [activeScenario, setActiveScenario] = useState(3);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getProjectedReturn = (days: number) => {
    if (days === 3) return Math.round(selectedInvestment * 0.025);
    if (days === 7) return Math.round(selectedInvestment * 0.068);
    if (days === 21) return Math.round(selectedInvestment * 0.185);
    return 0;
  };

  const getTotalValue = (days: number) => {
    return selectedInvestment + getProjectedReturn(days);
  };

  const getRoiPercentage = (days: number) => {
    if (days === 3) return 2.5;
    if (days === 7) return 6.8;
    if (days === 21) return 18.5;
    return 0;
  };

  return (
    <motion.section
      className="investment-projections"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="projections-container">
        {/* Header */}
        <motion.div
          className="projections-header"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2>Investment Growth Projections</h2>
          <p>See your potential returns with transparent, realistic ROI calculations</p>
        </motion.div>

        <div className="projections-content">
          {/* Left: Interactive Calculator */}
          <motion.div
            className="calculator-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="calculator-card">
              <h3>Investment Calculator</h3>

              {/* Investment Amount Slider */}
              <div className="input-group">
                <label>Investment Amount</label>
                <div className="amount-display">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    value={selectedInvestment}
                    onChange={(e) => setSelectedInvestment(Number(e.target.value) || 0)}
                    className="amount-input"
                  />
                </div>

                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={selectedInvestment}
                  onChange={(e) => setSelectedInvestment(Number(e.target.value))}
                  className="slider"
                />

                <div className="slider-labels">
                  <span>$1K</span>
                  <span>$100K</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="quick-select">
                <p>Quick select:</p>
                <div className="button-group">
                  {INVESTMENT_SCENARIOS.map((scenario) => (
                    <motion.button
                      key={scenario.amount}
                      className={`quick-btn ${selectedInvestment === scenario.amount ? "active" : ""}`}
                      onClick={() => setSelectedInvestment(scenario.amount)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ${(scenario.amount / 1000).toFixed(0)}K
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Time Horizon Selector */}
              <div className="input-group">
                <label>Select Time Horizon</label>
                <div className="time-buttons">
                  {[
                    { days: 3, label: "3 Days" },
                    { days: 7, label: "7 Days" },
                    { days: 21, label: "21 Days" },
                  ].map((item) => (
                    <motion.button
                      key={item.days}
                      className={`time-btn ${activeScenario === item.days ? "active" : ""}`}
                      onClick={() => setActiveScenario(item.days)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Projections Summary */}
              <motion.div className="projections-summary" variants={itemVariants}>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Initial Investment</span>
                    <span className="summary-value">${selectedInvestment.toLocaleString()}</span>
                  </div>
                  <div className="summary-item highlight">
                    <span className="summary-label">Projected Return</span>
                    <motion.span
                      className="summary-value gain"
                      key={`${selectedInvestment}-${activeScenario}`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      +${getProjectedReturn(activeScenario).toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Value</span>
                    <motion.span
                      className="summary-value total"
                      key={`${selectedInvestment}-${activeScenario}`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ${getTotalValue(activeScenario).toLocaleString()}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: ROI Cards */}
          <motion.div
            className="roi-cards-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="roi-cards">
              {ROI_DATA.map((item, index) => (
                <motion.div
                  key={item.days}
                  className="roi-card"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                >
                  {/* Background Gradient */}
                  <div className="card-bg"></div>

                  {/* Content */}
                  <div className="card-content">
                    <div className="card-header">
                      <span className="year-badge">{item.days}D</span>
                      <span className="status-badge">{item.status}</span>
                    </div>

                    <h4>{item.label}</h4>

                    <motion.div className="roi-value">
                      <span className="percentage">{item.roi}%</span>
                      <div className="roi-bar">
                        <motion.div
                          className="roi-fill"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.roi / 18.5) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </motion.div>

                    {/* Breakdown */}
                    <div className="breakdown">
                      <div className="breakdown-item">
                        <span>Principal</span>
                        <span>${selectedInvestment.toLocaleString()}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Gains</span>
                        <motion.span
                          key={`${selectedInvestment}-${item.days}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          ${getProjectedReturn(item.days).toLocaleString()}
                        </motion.span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="features-list">
                      <span>✓ Verified returns</span>
                      <span>✓ Tax optimized</span>
                      <span>✓ Risk managed</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer & CTA */}
            <motion.div className="cta-section" variants={itemVariants}>
              <p className="disclaimer">
                *Projections based on historical performance. Past performance guarantees future results.
              </p>
              <motion.button
                className="cta-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Investing
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

     <style jsx>{`

:root{
  --primary:#2563eb;
  --primary-dark:#1e40af;
  --accent:#ef4444;
  --text-primary:#c7cfdd;
  --text-secondary:#d3dbe6;
  --text-tertiary:#d9e0ee;
  --border-color:rgba(37,99,235,.2);
}

/* prevent overflow everywhere */
*{
box-sizing:border-box;
max-width:100%;
word-break:break-word;
overflow-wrap:anywhere;
}

h1,h2,h3,h4,p{
margin:0;
padding:0;
}

.investment-projections{
width:100%;
background:linear-gradient(135deg,rgba(15,23,42,.02),rgba(37,99,235,.02));
padding:clamp(14px,4vw,40px);
}

.projections-container{
max-width:1400px;
margin:auto;
width:100%;
}

.projections-header{
text-align:center;
margin-bottom:clamp(16px,3vw,40px);
}

.projections-header h2{
color:var(--text-primary);
font-size:clamp(1rem,5vw,2.4rem);
font-weight:900;
line-height:1.2;
margin-bottom:8px;
}

.projections-header p{
color:var(--text-secondary);
font-size:clamp(.75rem,3vw,1rem);
}

/* GRID */

.projections-content{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:clamp(12px,2vw,24px);
}

/* calculator */

.calculator-card{
background:linear-gradient(135deg,rgba(37,99,235,.12),rgba(59,130,246,.06));
border:1px solid var(--border-color);
border-radius:16px;
padding:clamp(12px,3vw,30px);
display:flex;
flex-direction:column;
gap:14px;
}

.calculator-card h3{
color:var(--text-primary);
font-size:clamp(.95rem,3vw,1.4rem);
font-weight:800;
}

/* input */

.amount-display{
display:flex;
align-items:center;
background:rgba(255,255,255,.05);
border:1px solid var(--border-color);
border-radius:10px;
padding:0 10px;
}

.currency{
color:var(--primary);
font-weight:700;
font-size:.9rem;
margin-right:4px;
}

.amount-input{
flex:1;
background:transparent;
border:none;
color:var(--text-primary);
font-size:clamp(.9rem,3vw,1.4rem);
font-weight:800;
outline:none;
padding:6px 0;
min-width:0;
}

/* slider */

.slider{
width:100%;
height:5px;
border-radius:3px;
background:linear-gradient(90deg,var(--primary),var(--accent));
appearance:none;
}

.slider-labels{
display:flex;
justify-content:space-between;
font-size:.65rem;
color:var(--text-tertiary);
}

/* buttons */

.button-group{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(60px,1fr));
gap:6px;
}

.quick-btn{
padding:6px;
font-size:clamp(.65rem,2.5vw,.85rem);
border-radius:6px;
border:1px solid var(--border-color);
background:rgba(37,99,235,.1);
color:var(--text-secondary);
white-space:normal;
}

.quick-btn.active{
background:var(--primary);
color:white;
}

.time-buttons{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(70px,1fr));
gap:6px;
}

.time-btn{
padding:6px;
font-size:clamp(.65rem,2.5vw,.85rem);
border-radius:6px;
border:1px solid var(--border-color);
background:rgba(37,99,235,.1);
color:var(--text-secondary);
white-space:normal;
}

.time-btn.active{
background:linear-gradient(135deg,var(--primary),var(--primary-dark));
color:white;
}

/* summary */

.projections-summary{
background:rgba(37,99,235,.08);
border-radius:10px;
padding:10px;
}

.summary-grid{
display:grid;
gap:8px;
}

.summary-item{
display:flex;
flex-direction:column;
gap:2px;
background:rgba(37,99,235,.05);
padding:6px;
border-radius:6px;
}

.summary-label{
font-size:.65rem;
color:var(--text-secondary);
}

.summary-value{
font-size:clamp(.8rem,3vw,1.1rem);
font-weight:800;
}

.summary-value.gain{color:var(--accent)}
.summary-value.total{color:#10b981}

/* ROI cards */

.roi-cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:12px;
}

.roi-card{
background:linear-gradient(135deg,rgba(37,99,235,.12),rgba(59,130,246,.06));
border:1px solid var(--border-color);
border-radius:12px;
padding:clamp(10px,3vw,20px);
}

.card-header{
display:flex;
flex-wrap:wrap;
gap:4px;
margin-bottom:6px;
}

.year-badge,
.status-badge{
padding:2px 6px;
font-size:.65rem;
border-radius:4px;
}

.year-badge{
background:rgba(37,99,235,.2);
color:var(--primary);
}

.status-badge{
background:rgba(239,68,68,.2);
color:var(--accent);
}

.roi-card h4{
font-size:clamp(.8rem,3vw,1rem);
color:var(--text-primary);
margin-bottom:6px;
}

.percentage{
font-size:clamp(1rem,4vw,1.6rem);
font-weight:900;
color:var(--accent);
}

.roi-bar{
height:4px;
background:rgba(37,99,235,.1);
border-radius:3px;
margin-top:6px;
}

.roi-fill{
height:100%;
background:linear-gradient(90deg,var(--primary),var(--accent));
}

/* breakdown */

.breakdown{
display:grid;
grid-template-columns:1fr 1fr;
gap:6px;
margin:8px 0;
}

.breakdown-item{
display:flex;
flex-direction:column;
font-size:.65rem;
}

/* features */

.features-list{
font-size:.65rem;
display:flex;
flex-direction:column;
gap:3px;
}

/* CTA */

.cta-section{
margin-top:12px;
}

.disclaimer{
font-size:.65rem;
text-align:center;
margin-bottom:8px;
}

.cta-button{
width:100%;
padding:8px;
font-size:.8rem;
border:none;
border-radius:8px;
background:linear-gradient(135deg,var(--primary),var(--primary-dark));
color:white;
}

/* EXTREME SMALL DEVICES */

@media (max-width:290px){

.projections-content{
grid-template-columns:1fr;
}

.button-group{
grid-template-columns:1fr 1fr;
}

.time-buttons{
grid-template-columns:1fr 1fr;
}

.roi-cards{
grid-template-columns:1fr;
}

}

`}</style>
    </motion.section>
  );
}
