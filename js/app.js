document.addEventListener("DOMContentLoaded", function () {
  // Helpers condivisi
  function readNumberValue(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const raw = (el.value || "").toString().replace(",", ".");
    const value = parseFloat(raw);
    if (isNaN(value) || value < 0) {
      return 0;
    }
    return value;
  }

  // Attivazione tooltip Bootstrap (se disponibili)
  if (window.bootstrap && bootstrap.Tooltip) {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  function messaggioDaPunteggio(score) {
    if (score < 4) {
      return "Le emissioni risultano molto superiori alla media di riferimento. È il momento giusto per ripensare abitudini di trasporto, riscaldamento e gestione dei rifiuti: anche piccoli cambiamenti quotidiani possono fare una grande differenza.";
    }
    if (score < 7) {
      return "La scuola è più o meno in linea con la media italiana. Ci sono già alcune buone abitudini, ma restano ampi margini di miglioramento: ridurre i chilometri in auto, ottimizzare il riscaldamento e aumentare la raccolta differenziata può fare la differenza.";
    }
    return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Continuare e condividere le buone pratiche è fondamentale: l’esempio di questa scuola può ispirare famiglie, persone e altre realtà educative.";
  }

  function aggiornaDistanzeTotali() {
    const giorniScuola = readNumberValue("giorniScuola");
    const config = [
      { kmId: "kmAutobusAnnui", personeId: "personeAutobus", totaleId: "kmAutobusTotali" },
      { kmId: "kmMacchinaAnnui", personeId: "personeMacchina", totaleId: "kmMacchinaTotali" },
      { kmId: "kmPiediAnnui", personeId: "personePiedi", totaleId: "kmPiediTotali" },
      { kmId: "kmElettricaAnnui", personeId: "personeElettrica", totaleId: "kmElettricaTotali" },
    ];

    config.forEach(({ kmId, personeId, totaleId }) => {
      const kmGiornalieri = readNumberValue(kmId);
      const persone = readNumberValue(personeId);
      const totale = kmGiornalieri * (giorniScuola || 0) * (persone || 0);
      const totaleEl = document.getElementById(totaleId);
      if (totaleEl) {
        totaleEl.value = totale > 0 ? Math.round(totale) : "";
      }
    });
  }

  function aggiornaProgressoSezioni() {
    const labelEl = document.getElementById("sezioniLabel");
    const barEl = document.getElementById("sezioniProgress");
    if (!labelEl || !barEl) return;

    const sezioni = [
      {
        id: "scope1",
        campi: ["gasMetanoMc", "altriCombustibiliKg"],
      },
      {
        id: "scope2",
        campi: [
          "energiaNonRinnovabiliKwh",
          "energiaRinnovabiliKwh",
          "energiaAutoprodottaKwh",
          "energiaAutoconsumataKwh",
        ],
      },
      {
        id: "scope3waste",
        campi: [
          "rifiutiPlasticaKg",
          "rifiutiCartaKg",
          "rifiutiVetroKg",
          "rifiutiMetalliKg",
          "rifiutiLegnoKg",
          "rifiutiIndifferenziatiKg",
        ],
      },
      {
        id: "scope3transport",
        campi: [
          "personeAutobus",
          "kmAutobusAnnui",
          "personeMacchina",
          "kmMacchinaAnnui",
          "personePiedi",
          "kmPiediAnnui",
          "personeElettrica",
          "kmElettricaAnnui",
        ],
      },
    ];

    let completate = 0;
    sezioni.forEach(function (sezione) {
      const haValore = sezione.campi.some(function (id) {
        return readNumberValue(id) > 0;
      });
      if (haValore) completate += 1;
    });

    labelEl.textContent = completate + "/4 sezioni completate";
    const percent = (completate / 4) * 100;
    barEl.style.width = percent + "%";
    barEl.setAttribute("aria-valuenow", completate.toString());
  }

  // Inizializzazione pagina INDEX (form di input)
  (function initIndexPage() {
    const calcolaBtn = document.getElementById("calcolaBtn");
    if (!calcolaBtn) return; // non siamo su index.html

    // Aggiornamento in tempo reale dei km × giorni × persone
    [
      "giorniScuola",
      "kmAutobusAnnui",
      "personeAutobus",
      "kmMacchinaAnnui",
      "personeMacchina",
      "kmPiediAnnui",
      "personePiedi",
      "kmElettricaAnnui",
      "personeElettrica",
    ].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", function () {
          aggiornaDistanzeTotali();
          aggiornaProgressoSezioni();
        });
      }
    });

    // Stato iniziale barra di avanzamento
    aggiornaProgressoSezioni();

    calcolaBtn.addEventListener("click", function () {
      // Assicuriamoci che i totali dei trasporti siano aggiornati
      aggiornaDistanzeTotali();

      const ecoFormData = {
        numeroStudenti: readNumberValue("numeroStudenti"),
        gasMetanoMc: readNumberValue("gasMetanoMc"),
        altriCombustibiliKg: readNumberValue("altriCombustibiliKg"),
        energiaNonRinnovabiliKwh: readNumberValue("energiaNonRinnovabiliKwh"),
        energiaRinnovabiliKwh: readNumberValue("energiaRinnovabiliKwh"),
        energiaAutoprodottaKwh: readNumberValue("energiaAutoprodottaKwh"),
        energiaAutoconsumataKwh: readNumberValue("energiaAutoconsumataKwh"),
        rifiutiPlasticaKg: readNumberValue("rifiutiPlasticaKg"),
        rifiutiCartaKg: readNumberValue("rifiutiCartaKg"),
        rifiutiVetroKg: readNumberValue("rifiutiVetroKg"),
        rifiutiMetalliKg: readNumberValue("rifiutiMetalliKg"),
        rifiutiLegnoKg: readNumberValue("rifiutiLegnoKg"),
        rifiutiIndifferenziatiKg: readNumberValue("rifiutiIndifferenziatiKg"),
        giorniScuola: readNumberValue("giorniScuola"),
        kmAutobusTotali: readNumberValue("kmAutobusTotali"),
        kmMacchinaTotali: readNumberValue("kmMacchinaTotali"),
        kmPiediTotali: readNumberValue("kmPiediTotali"),
        kmElettricaTotali: readNumberValue("kmElettricaTotali"),
        kmAutobusAnnui: readNumberValue("kmAutobusTotali"),
        kmMacchinaAnnui: readNumberValue("kmMacchinaTotali"),
        kmPiediAnnui: readNumberValue("kmPiediTotali"),
        kmElettricaAnnui: readNumberValue("kmElettricaTotali"),
      };

      try {
        sessionStorage.setItem("ecoFormData", JSON.stringify(ecoFormData));
      } catch (e) {
        // In contesti con storage limitato, ignoriamo l'errore ma permettiamo comunque la navigazione
      }

      window.location.href = "results.html";
    });
  })();

  // Inizializzazione pagina RESULTS (results.html)
  (function initResultsPage() {
    const resultsRoot = document.getElementById("resultsRoot");
    if (!resultsRoot) return; // non siamo su results.html

    const noDataAlert = document.getElementById("noDataAlert");
    const resultsCards = document.getElementById("resultsCards");
    const totaleEmissioniEl = document.getElementById("totaleEmissioni");
    const emissioniProCapiteEl = document.getElementById("emissioniProCapite");
    const punteggioBadge = document.getElementById("punteggioBadge");
    const punteggioProgress = document.getElementById("punteggioProgress");
    const messaggioTestuale = document.getElementById("messaggioTestuale");

    const scope1ValEl = document.getElementById("scope1Val");
    const scope2ValEl = document.getElementById("scope2Val");
    const scope3WasteValEl = document.getElementById("scope3WasteVal");
    const scope3TransportValEl = document.getElementById("scope3TransportVal");

    const scope1Bar = document.getElementById("scope1Bar");
    const scope2Bar = document.getElementById("scope2Bar");
    const scope3WasteBar = document.getElementById("scope3WasteBar");
    const scope3TransportBar = document.getElementById("scope3TransportBar");

    const riepilogoDati = document.getElementById("riepilogoDati");

    function aggiornaProgressBar(score) {
      const percent = (score / 10) * 100;
      punteggioProgress.style.width = percent + "%";
      punteggioProgress.textContent = score.toString().replace(".", ",") + " / 10";

      punteggioProgress.classList.remove("bg-low", "bg-medium", "bg-high");

      if (score < 4) {
        punteggioProgress.classList.add("bg-low");
      } else if (score < 7) {
        punteggioProgress.classList.add("bg-medium");
      } else {
        punteggioProgress.classList.add("bg-high");
      }
    }

    function setScopeBar(barEl, valueEl, value, total) {
      if (!barEl || !valueEl) return;
      if (total <= 0 || value <= 0) {
        valueEl.textContent = "0";
        barEl.style.width = "0%";
        return;
      }
      const rawPercent = (value / total) * 100;
      const percent = Math.max(rawPercent, 2); // minimo 2% visivo se > 0
      valueEl.textContent = Math.round(value); // mostra valore assoluto
      barEl.style.width = percent + "%";
    }

    function mostraBannerNessunDato() {
      if (noDataAlert) {
        noDataAlert.classList.remove("d-none");
      }
    }

    let formData = null;
    try {
      const stored = sessionStorage.getItem("ecoFormData");
      if (stored) {
        formData = JSON.parse(stored);
      }
    } catch (e) {
      formData = null;
    }

    if (!formData) {
      // Nessun dato salvato: mostriamo solo il banner
      mostraBannerNessunDato();
      if (resultsCards) {
        resultsCards.classList.add("opacity-50");
      }
      return;
    }

    // Verifica se tutti i valori numerici (escluso numeroStudenti) sono zero
    const numericKeys = Object.keys(formData).filter((k) => k !== "numeroStudenti");
    const tuttiZero = numericKeys.every((k) => {
      const v = parseFloat(formData[k]) || 0;
      return v === 0;
    });
    if (tuttiZero) {
      mostraBannerNessunDato();
    }

    const inputs = {
      gasMetanoMc: formData.gasMetanoMc || 0,
      altriCombustibiliKg: formData.altriCombustibiliKg || 0,
      energiaNonRinnovabiliKwh: formData.energiaNonRinnovabiliKwh || 0,
      energiaRinnovabiliKwh: formData.energiaRinnovabiliKwh || 0,
      energiaAutoprodottaKwh: formData.energiaAutoprodottaKwh || 0,
      energiaAutoconsumataKwh: formData.energiaAutoconsumataKwh || 0,
      rifiutiPlasticaKg: formData.rifiutiPlasticaKg || 0,
      rifiutiCartaKg: formData.rifiutiCartaKg || 0,
      rifiutiVetroKg: formData.rifiutiVetroKg || 0,
      rifiutiMetalliKg: formData.rifiutiMetalliKg || 0,
      rifiutiLegnoKg: formData.rifiutiLegnoKg || 0,
      rifiutiIndifferenziatiKg: formData.rifiutiIndifferenziatiKg || 0,
      kmAutobusAnnui: formData.kmAutobusAnnui || 0,
      kmMacchinaAnnui: formData.kmMacchinaAnnui || 0,
      kmPiediAnnui: formData.kmPiediAnnui || 0,
      kmElettricaAnnui: formData.kmElettricaAnnui || 0,
    };

    const risultati = window.EcoCalculator.calculateTotalEmissions(inputs);
    const numeroStudenti = formData.numeroStudenti || 0;

    // Totale reale (usato per display e pro-capite)
    const totaleReale = risultati.total;

    // Per il punteggio: CO2 trasporti divisa per studenti, poi sommata agli altri scope
    const scope3TransportMedia = numeroStudenti > 0 ? risultati.scope3Transport / numeroStudenti : risultati.scope3Transport;
    const totalePerScore = risultati.scope1 + risultati.scope2 + risultati.scope3Waste + scope3TransportMedia;
    const score = window.EcoCalculator.calculateScoreFromEmissions(totalePerScore);

    if (totaleEmissioniEl) {
      totaleEmissioniEl.textContent = Math.round(totaleReale);
    }

    if (emissioniProCapiteEl) {
      if (numeroStudenti > 0) {
        const proCapite = totaleReale / numeroStudenti;
        emissioniProCapiteEl.textContent = Math.round(proCapite).toString();
      } else {
        emissioniProCapiteEl.textContent = "-";
      }
    }

    if (punteggioBadge) {
      punteggioBadge.textContent = score.toString().replace(".", ",") + " / 10";
    }
    if (punteggioProgress) {
      aggiornaProgressBar(score);
    }
    if (messaggioTestuale) {
      messaggioTestuale.textContent = messaggioDaPunteggio(score);
    }

    // Ripartizione per scope (percentuali sul totale reale)
    setScopeBar(scope1Bar, scope1ValEl, risultati.scope1, totaleReale);
    setScopeBar(scope2Bar, scope2ValEl, risultati.scope2, totaleReale);
    setScopeBar(scope3WasteBar, scope3WasteValEl, risultati.scope3Waste, totaleReale);
    setScopeBar(scope3TransportBar, scope3TransportValEl, risultati.scope3Transport, totaleReale);

  })();
});

