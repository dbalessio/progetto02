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

  function messaggioDaPunteggio(score, risultati) {
    const SOGLIA = 0.35;
    const SOGLIA_COPPIA = 0.25;

    let dominio = "generico";
    if (risultati && risultati.total > 0) {
      const total = risultati.total;
      const pctScope1 = risultati.scope1 / total;
      const pctTransport = risultati.scope3Transport / total;
      const pctEnergy = risultati.scope2 / total;
      const pctWaste = risultati.scope3Waste / total;

      if (pctTransport > SOGLIA) {
        dominio = "trasporti";
      } else if (pctEnergy > SOGLIA) {
        dominio = "energia";
      } else if (pctWaste > SOGLIA) {
        dominio = "rifiuti";
      } else if (pctScope1 > SOGLIA) {
        dominio = "emissioniDirette";
      } else if (pctEnergy >= SOGLIA_COPPIA && pctWaste >= SOGLIA_COPPIA) {
        dominio = "energiaRifiuti";
      }
    }

    if (score < 4) {
      if (dominio === "trasporti") {
        return "Le emissioni risultano molto superiori alla media di riferimento. La parte più consistente viene dagli spostamenti: è il momento di ripensare come studenti e personale raggiungono la scuola. Ridurre i chilometri in auto, favorire mezzi pubblici, piedi o bici e il car pooling può fare una grande differenza.";
      }
      if (dominio === "energia") {
        return "Le emissioni risultano molto superiori alla media di riferimento. Il peso maggiore viene da riscaldamento e consumi elettrici: ottimizzare gli orari di accensione, migliorare l'isolamento e ridurre gli sprechi di energia può fare una grande differenza.";
      }
      if (dominio === "rifiuti") {
        return "Le emissioni risultano molto superiori alla media di riferimento. La gestione dei rifiuti pesa in modo consistente: aumentare la raccolta differenziata, ridurre gli imballaggi e favorire il riuso può fare una grande differenza.";
      }
      if (dominio === "emissioniDirette") {
        return "Le emissioni risultano molto superiori alla media di riferimento. Il peso maggiore viene da riscaldamento a gas o altri combustibili: ottimizzare gli orari, migliorare l'isolamento e controllare le caldaie può fare una grande differenza.";
      }
      if (dominio === "energiaRifiuti") {
        return "Le emissioni risultano molto superiori alla media di riferimento. Energia e gestione dei rifiuti sono i settori che pesano di più: ottimizzare il riscaldamento, ridurre gli sprechi e aumentare la raccolta differenziata può fare una grande differenza.";
      }
      return "Le emissioni risultano molto superiori alla media di riferimento. È il momento giusto per ripensare abitudini di trasporto, riscaldamento e gestione dei rifiuti: anche piccoli cambiamenti quotidiani possono fare una grande differenza.";
    }

    if (score < 7) {
      if (dominio === "trasporti") {
        return "La scuola è più o meno in linea con la media italiana. La parte più consistente delle emissioni viene dagli spostamenti: ridurre i chilometri in auto, favorire mezzi pubblici e car pooling può fare la differenza.";
      }
      if (dominio === "energia") {
        return "La scuola è più o meno in linea con la media italiana. Le emissioni legate all'energia (riscaldamento ed elettricità) pesano molto: ottimizzare i consumi e gli orari di accensione può fare la differenza.";
      }
      if (dominio === "rifiuti") {
        return "La scuola è più o meno in linea con la media italiana. Le emissioni legate ai rifiuti pesano molto: aumentare la differenziata e ridurre l'indifferenziato può fare la differenza.";
      }
      if (dominio === "emissioniDirette") {
        return "La scuola è più o meno in linea con la media italiana. Le emissioni da riscaldamento (gas, combustibili) pesano molto: ottimizzare orari e temperature può fare la differenza.";
      }
      if (dominio === "energiaRifiuti") {
        return "La scuola è più o meno in linea con la media italiana. Energia e gestione dei rifiuti sono i settori su cui agire: ottimizzare il riscaldamento, ridurre gli sprechi e aumentare la raccolta differenziata può fare la differenza.";
      }
      return "La scuola è più o meno in linea con la media italiana. Ci sono già alcune buone abitudini, ma restano ampi margini di miglioramento: ridurre i chilometri in auto, ottimizzare il riscaldamento e aumentare la raccolta differenziata può fare la differenza.";
    }

    if (dominio === "trasporti") {
      return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Continuate a privilegiare spostamenti sostenibili e a incoraggiare mezzi pubblici e car pooling: l'esempio della scuola può ispirare le famiglie.";
    }
    if (dominio === "energia") {
      return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Le buone pratiche su riscaldamento ed energia stanno funzionando: continuate a condividerle con studenti e famiglie.";
    }
    if (dominio === "rifiuti") {
      return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. La gestione dei rifiuti e la differenziata stanno funzionando: continuate a condividerle con studenti e famiglie.";
    }
    if (dominio === "emissioniDirette") {
      return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Le buone pratiche su riscaldamento e combustibili stanno funzionando: continuate a condividerle con studenti e famiglie.";
    }
    if (dominio === "energiaRifiuti") {
      return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Le buone pratiche su energia e rifiuti stanno funzionando: continuate a condividerle con studenti e famiglie.";
    }
    return "Ottimo! Le emissioni risultano inferiori alla media di riferimento. Continuare e condividere le buone pratiche è fondamentale: l'esempio di questa scuola può ispirare famiglie, persone e altre realtà educative.";
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
        numeroPersoneTotali: readNumberValue("numeroPersoneTotali"),
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
    const punteggioBadgeCompleto = document.getElementById("punteggioBadgeCompleto");
    const punteggioBadgeSenzaTrasporti = document.getElementById(
      "punteggioBadgeSenzaTrasporti"
    );
    const punteggioProgressCompleto = document.getElementById(
      "punteggioProgressCompleto"
    );
    const punteggioProgressSenzaTrasporti = document.getElementById(
      "punteggioProgressSenzaTrasporti"
    );
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

    function aggiornaProgressBar(barEl, score) {
      if (!barEl) return;
      const percent = (score / 10) * 100;
      barEl.style.width = percent + "%";
      barEl.textContent = score.toString().replace(".", ",") + " / 10";

      barEl.classList.remove("bg-low", "bg-medium", "bg-high");

      if (score < 4) {
        barEl.classList.add("bg-low");
      } else if (score < 7) {
        barEl.classList.add("bg-medium");
      } else {
        barEl.classList.add("bg-high");
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

    function aggiornaFaccina(score, elementId) {
      const el = document.getElementById(elementId);
      if (!el) return;
      if (score < 4) {
        el.textContent = "😟";
        el.style.filter = "drop-shadow(0 0 6px #dc3545)";
      } else if (score < 7) {
        el.textContent = "😐";
        el.style.filter = "drop-shadow(0 0 6px #ffc107)";
      } else {
        el.textContent = "😊";
        el.style.filter = "drop-shadow(0 0 6px #198754)";
      }
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

    // Verifica se tutti i valori numerici (escluso numeroPersoneTotali) sono zero
    const numericKeys = Object.keys(formData).filter(
      (k) => k !== "numeroPersoneTotali"
    );
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
    const numeroPersone = formData.numeroPersoneTotali || 0;

    // Totale reale (usato per display e pro-capite)
    const totaleReale = risultati.total;

    // Emissioni pro-capite (con trasporti) e senza trasporti
    const perCapitaCompleto =
      numeroPersone > 0 ? totaleReale / numeroPersone : totaleReale;
    const totaleSenzaTrasporti =
      risultati.scope1 + risultati.scope2 + risultati.scope3Waste;
    const perCapitaSenzaTrasporti =
      numeroPersone > 0
        ? totaleSenzaTrasporti / numeroPersone
        : totaleSenzaTrasporti;

    // Punteggi a fasce rigide basati su emissioni pro-capite
    const scoreCompleto =
      window.EcoCalculator.calculateScoreFromPerCapita(perCapitaCompleto);
    const scoreSenzaTrasporti =
      window.EcoCalculator.calculateScoreFromPerCapita(perCapitaSenzaTrasporti);

    if (totaleEmissioniEl) {
      totaleEmissioniEl.textContent = Math.round(totaleReale);
    }

    if (emissioniProCapiteEl) {
      if (numeroPersone > 0) {
        emissioniProCapiteEl.textContent = Math.round(
          perCapitaCompleto
        ).toString();
      } else {
        emissioniProCapiteEl.textContent = "-";
      }
    }

    if (punteggioBadgeCompleto) {
      punteggioBadgeCompleto.textContent =
        scoreCompleto.toString().replace(".", ",") + " / 10";
    }
    if (punteggioBadgeSenzaTrasporti) {
      punteggioBadgeSenzaTrasporti.textContent =
        scoreSenzaTrasporti.toString().replace(".", ",") + " / 10";
    }

    aggiornaProgressBar(punteggioProgressCompleto, scoreCompleto);
    aggiornaProgressBar(punteggioProgressSenzaTrasporti, scoreSenzaTrasporti);

    aggiornaFaccina(scoreCompleto, "facciaFeedback");
    aggiornaFaccina(scoreSenzaTrasporti, "facciaFeedbackSenzaTrasporti");

    if (messaggioTestuale) {
      messaggioTestuale.textContent = messaggioDaPunteggio(scoreCompleto, risultati);
    }

    // Ripartizione per scope (percentuali sul totale reale)
    setScopeBar(scope1Bar, scope1ValEl, risultati.scope1, totaleReale);
    setScopeBar(scope2Bar, scope2ValEl, risultati.scope2, totaleReale);
    setScopeBar(
      scope3WasteBar,
      scope3WasteValEl,
      risultati.scope3Waste,
      totaleReale
    );
    setScopeBar(
      scope3TransportBar,
      scope3TransportValEl,
      risultati.scope3Transport,
      totaleReale
    );

  })();
});

