import React, { useState, useEffect } from "react";
import { PolcaHeader } from "../components/PolcaHeader";
import { PolcaFooter } from "../components/PolcaFooter";

export default function PolcaHome() {
    const [energyInput, setEnergyInput] = useState(100);
    const [energySource, setEnergySource] = useState(597);

    // Calculate emissions
    const mainEmission = (energyInput * energySource) / 1000;
    const euEmission = (energyInput * 295) / 1000;
    const difference = ((mainEmission - euEmission) / euEmission * 100).toFixed(0);

    // Fade-in animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="polca-page bg-[#FAFBF9]">
            {/* Navigation */}
            <PolcaHeader />

            {/* Hero */}
            <header className="px-4 sm:px-8 lg:px-12 pt-40 pb-24 max-w-[860px] mx-auto">
                <div className="fade-in">
                    <div className="polca-mono text-[0.72rem] tracking-[0.14em] uppercase text-[#00805A] mb-7">
                        Polish Life Cycle Assessment Database
                    </div>
                    <h1 className="polca-serif text-4xl lg:text-[3.2rem] font-medium leading-[1.18] text-[#1A1A1A] mb-8 tracking-tight">
                        Polska baza danych inwentaryzacji cyklu życia dla wyrobów
                        budowlanych
                    </h1>
                    <p className="text-[1.12rem] font-light text-[#555555] max-w-[680px] leading-[1.85] mb-14">
                        poLCA jest bazą danych LCI opracowaną w celu dostarczenia informacji
                        środowiskowych reprezentatywnych dla polskich w

                        arunków produkcji.
                        Dane oparto na oficjalnych źródłach krajowych, normatywnych
                        procesach produkcyjnych określonych w normach europejskich oraz
                        uznanych publikacjach stowarzyszeń branżowych.
                    </p>
                    <div className="flex flex-wrap gap-14 pt-10 border-t border-[#E8ECE9]">
                        <div className="flex flex-col gap-1">
                            <span className="polca-mono text-[1.05rem] font-medium text-[#00593D]">
                                EN 15804+A2
                            </span>
                            <span className="text-[0.78rem] text-[#757575]">
                                Zgodność metodologiczna
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="polca-mono text-[1.05rem] font-medium text-[#00593D]">
                                ISO 14040/44
                            </span>
                            <span className="text-[0.78rem] text-[#757575]">
                                Zasada proximity
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="polca-mono text-[1.05rem] font-medium text-[#00593D]">
                                KOBiZE 2024
                            </span>
                            <span className="text-[0.78rem] text-[#757575]">
                                Wskaźniki emisji
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="section-divider"></div>

            {/* Section 01: Uzasadnienie */}
            <section id="uzasadnienie" className="px-4 sm:px-8 lg:px-12 py-20 max-w-[860px] mx-auto">
                <div className="fade-in">
                    <div className="section-num">01 — Uzasadnienie</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Potrzeba krajowej bazy danych LCI
                    </h2>

                    <div className="prose-polca">
                        <p>
                            Norma <strong>EN 15804:2012+A2:2019</strong> §6.3.4 oraz{" "}
                            <strong>ISO 14044:2006</strong> §4.2.3.6 ustanawiają
                            jednoznaczną hierarchię danych stosowanych w obliczeniach LCA:
                            dane specyficzne producenta, dane sektorowe oraz — dopiero w
                            ostatniej kolejności — dane generyczne z ogólnych baz danych.
                            Obie normy formułują ponadto zasadę proximity, zgodnie z którą
                            należy stosować dane najbardziej reprezentatywne geograficznie,
                            technologicznie i czasowo.
                        </p>
                        <p>
                            Dotychczas podmioty opracowujące deklaracje środowiskowe (EPD)
                            dla polskich wyrobów budowlanych — zgodnie z{" "}
                            <strong>EN 15804+A2</strong> i nadchodzącym{" "}
                            <strong>Rozporządzeniem CPR 2024/3110</strong> — korzystały
                            głównie z baz danych o zasięgu europejskim lub globalnym
                            (ecoinvent, GaBi/Sphera). Dane te, jakkolwiek metodologicznie
                            poprawne w rozumieniu <strong>ISO 14040:2006</strong>, nie
                            odzwierciedlają w sposób adekwatny polskich warunków produkcji.
                        </p>
                        <p>
                            Większość krajów europejskich o rozwiniętym rynku
                            zrównoważonego budownictwa dysponuje własnymi bazami danych
                            LCI: Niemcy — Ökobaudat, Francja — INIES, Holandia — NMD,
                            Austria — baubook, Norwegia — EPD Norge Digi. Polska dotychczas
                            nie posiadała porównywalnego narzędzia. Baza poLCA wypełnia tę
                            lukę.
                        </p>
                    </div>

                    <div className="comparison-block">
                        <div className="comparison-title">
                            Wskaźnik emisji CO₂ dla energii elektrycznej — wpływ doboru
                            źródła danych
                        </div>
                        <div className="comparison-row">
                            <span className="comp-label">Średnia EU (bazy generyczne)</span>
                            <div className="comp-track">
                                <div className="comp-fill generic">~295 kg CO₂/MWh</div>
                            </div>
                        </div>
                        <div className="comparison-row">
                            <span className="comp-label">Polska (KOBiZE 2024)</span>
                            <div className="comp-track">
                                <div className="comp-fill specific">597 kg CO₂/MWh</div>
                            </div>
                        </div>
                        <div className="comp-note">
                            Źródło: KOBiZE, „Wskaźniki emisyjności CO₂, SO₂, NOₓ, CO i pyłu
                            całkowitego dla energii elektrycznej", dane za rok 2023.
                        </div>
                    </div>

                    <div className="prose-polca">
                        <p>
                            Różnica pomiędzy polskim a średnim europejskim wskaźnikiem
                            emisji dla energii elektrycznej jest dwukrotna. Dla wyrobów
                            energochłonnych — takich jak beton, cement czy mieszanki
                            mineralno-asfaltowe — dobór źródła danych dla energii
                            determinuje wynik końcowy w większym stopniu niż jakakolwiek
                            inna zmienna.
                        </p>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            {/* Section 03: Wskaźniki emisyjności */}
            <section id="emisyjnosc" className="px-4 sm:px-8 lg:px-12 py-20 max-w-[860px] mx-auto">
                <div className="fade-in">
                    <div className="section-num">03 — Wskaźniki emisyjności</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Polskie wskaźniki emisji dla nośników energii
                    </h2>
                    <p className="text-[1.02rem] text-[#555555] max-w-[640px] leading-[1.8] mb-10 font-light">
                        Poniższe wskaźniki stanowią podstawę obliczeń w bazie poLCA dla
                        procesów energetycznych. Wartości oparto na oficjalnych publikacjach
                        KOBiZE zgodnie z wymaganiami <strong>ISO 14064-1:2018</strong>.
                    </p>
                </div>

                <table className="emissions-table fade-in">
                    <thead>
                        <tr>
                            <th>Wskaźnik (na 1 GJ energii)</th>
                            <th>Miks elektr. PL</th>
                            <th>Gaz ziemny</th>
                            <th>Olej opałowy</th>
                            <th>Węgiel kamienny</th>
                            <th>Biomasa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>CO₂ [kg/GJ]</td>
                            <td className="mono highlight">165,8</td>
                            <td className="mono">56,1</td>
                            <td className="mono">77,4</td>
                            <td className="mono">95,5</td>
                            <td className="mono">0,0 *</td>
                        </tr>
                        <tr>
                            <td>
                                SO₂ [g/GJ]
                            </td>
                            <td className="mono">125,2</td>
                            <td className="mono">0,5</td>
                            <td className="mono">140,6</td>
                            <td className="mono">210,0</td>
                            <td className="mono">11,0</td>
                        </tr>
                        <tr>
                            <td>
                                NO<sub>x</sub> [g/GJ]
                            </td>
                            <td className="mono">145,3</td>
                            <td className="mono">46,0</td>
                            <td className="mono">55,0</td>
                            <td className="mono">160,0</td>
                            <td className="mono">85,0</td>
                        </tr>
                        <tr>
                            <td>Pył całkowity [g/GJ]</td>
                            <td className="mono">5,3</td>
                            <td className="mono">0,1</td>
                            <td className="mono">1,5</td>
                            <td className="mono">12,0</td>
                            <td className="mono">30,0</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-[0.78rem] text-[#757575] mt-2 italic">
                    * Biomasa raportowana jako neutralna węglowo w cyklu krótkim, zgodnie
                    z konwencją EU ETS. Źródło: KOBiZE 2024, wskaźniki IPCC 2006/2019.
                </p>
            </section>

            <div className="section-divider"></div>

            {/* Calculator */}
            <div className="calculator-section" id="kalkulator">
                <div className="max-w-[860px] mx-auto fade-in">
                    <div className="section-num">05 — Narzędzie szacunkowe</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Kalkulator emisji operacyjnej
                    </h2>
                    <p className="text-[1.02rem] text-[#555555] max-w-[640px] leading-[1.8] mb-10 font-light">
                        Narzędzie umożliwia orientacyjne oszacowanie emisji CO₂ z procesu
                        energetycznego w oparciu o wskaźniki poLCA, metodologicznie spójne z
                        wymogami <strong>ISO 14067:2018</strong>.
                    </p>

                    <div className="calculator-grid">
                        <div className="calc-input-group">
                            <div>
                                <label className="calc-label" htmlFor="energyInput">
                                    Zużycie energii [MWh]
                                </label>
                                <input
                                    type="number"
                                    id="energyInput"
                                    className="calc-input"
                                    value={energyInput}
                                    onChange={(e) => setEnergyInput(Number(e.target.value))}
                                    min="0"
                                    step="10"
                                />
                            </div>
                            <div>
                                <label className="calc-label" htmlFor="sourceSelect">
                                    Źródło energii
                                </label>
                                <select
                                    id="sourceSelect"
                                    className="calc-select"
                                    value={energySource}
                                    onChange={(e) => setEnergySource(Number(e.target.value))}
                                >
                                    <option value="597">
                                        Miks elektr. PL (597 kg CO₂/MWh)
                                    </option>
                                    <option value="202">
                                        Gaz ziemny (202 kg CO₂/MWh)
                                    </option>
                                    <option value="279">
                                        Olej opałowy (279 kg CO₂/MWh)
                                    </option>
                                    <option value="344">
                                        Węgiel kamienny (344 kg CO₂/MWh)
                                    </option>
                                    <option value="0">Biomasa (0 kg CO₂/MWh)</option>
                                </select>
                            </div>
                            <p className="calc-note">
                                Wskaźniki emisji przeliczono na MWh na podstawie danych KOBiZE
                                2024. Dla miksu elektrycznego uwzględniono straty przesyłowe.
                            </p>
                        </div>

                        <div className="calc-results">
                            <div className="calc-result-item">
                                <div className="calc-result-label">
                                    Emisja CO₂ — wybrane źródło
                                </div>
                                <div className="calc-result-value">
                                    <span>{mainEmission.toLocaleString("pl-PL")}</span>{" "}
                                    <small>kg CO₂</small>
                                </div>
                            </div>
                            <div className="calc-result-divider"></div>
                            <div className="calc-result-item secondary">
                                <div className="calc-result-label">
                                    Emisja CO₂ — średnia EU (295 kg/MWh)
                                </div>
                                <div className="calc-result-value">
                                    <span>{euEmission.toLocaleString("pl-PL")}</span>{" "}
                                    <small>kg CO₂</small>
                                </div>
                            </div>
                            <div className="calc-savings">
                                Różnica: {difference > 0 ? "+" : ""}
                                {difference}% przy zastosowaniu danych polskich
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Datasety */}
            <section id="datasety" className="px-4 sm:px-8 lg:px-12 py-20 max-w-[1040px] mx-auto">
                <div className="fade-in">
                    <div className="section-num">08 — Dostępne zbiory danych</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Zbiory danych LCI
                    </h2>
                    <p className="text-[1.02rem] text-[#555555] max-w-[640px] leading-[1.8] mb-10 font-light">
                        Każdy zbiór danych obejmuje pełną inwentaryzację przepływów zgodną
                        z <strong>ISO 14044:2006</strong> §4.3.2, raport bazowy oraz analizę
                        wrażliwości.
                    </p>
                </div>

                <div className="datasets-grid fade-in">
                    <div className="dataset-card">
                        <div className="dataset-status">W opracowaniu</div>
                        <h3 className="polca-serif text-[1.35rem] font-semibold text-[#1A1A1A] mb-3">
                            Mieszanki mineralno-asfaltowe
                        </h3>
                        <p className="text-[0.9rem] text-[#555555] leading-[1.75] mb-6">
                            Modelowanie procesu produkcji MMA z zastosowaniem metodologii
                            EBLCI. Parametryzacja obejmuje typ paliwa, temperaturę produkcji,
                            wilgotność kruszywa oraz zawartość granulatu asfaltowego (RAP).
                        </p>
                        <div>
                            <div className="spec-line">
                                <span className="spec-key">Norma referencyjna</span>
                                <span className="spec-val">EN 13108-1 do -7</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Dane dla bitumu</span>
                                <span className="spec-val">Eurobitume LCA 4.0</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Wskaźniki emisji</span>
                                <span className="spec-val">KOBiZE 2024</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Scenariusze RAP</span>
                                <span className="spec-val">0% · 20% · 40% · 60%</span>
                            </div>
                        </div>
                    </div>

                    <div className="dataset-card">
                        <div className="dataset-status">W opracowaniu</div>
                        <h3 className="polca-serif text-[1.35rem] font-semibold text-[#1A1A1A] mb-3">
                            Beton towarowy
                        </h3>
                        <p className="text-[0.9rem] text-[#555555] leading-[1.75] mb-6">
                            Model parametryczny oparty na wymaganiach normy EN 206. Umożliwia
                            generowanie profilu środowiskowego dla dowolnej klasy
                            wytrzymałości i typu cementu na podstawie normatywnych proporcji
                            składników.
                        </p>
                        <div>
                            <div className="spec-line">
                                <span className="spec-key">Norma referencyjna</span>
                                <span className="spec-val">EN 206</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Klasy wytrzymałości</span>
                                <span className="spec-val">C20/25 — C50/60</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Typy cementu</span>
                                <span className="spec-val">CEM I — CEM V</span>
                            </div>
                            <div className="spec-line">
                                <span className="spec-key">Wskaźniki emisji</span>
                                <span className="spec-val">KOBiZE 2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            {/* Licencje */}
            <section id="licencje" className="px-4 sm:px-8 lg:px-12 py-20 max-w-[1040px] mx-auto">
                <div className="fade-in">
                    <div className="section-num">10 — Warunki dostępu</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Modele licencyjne
                    </h2>
                    <p className="text-[1.02rem] text-[#555555] max-w-[720px] leading-[1.8] mb-10 font-light">
                        Zagregowane wyniki i dokumentacja metodologiczna są publicznie
                        dostępne. Pełne zbiory danych LCI udostępniane są w ramach licencji
                        rocznych.
                    </p>
                </div>

                <div className="pricing-grid fade-in">
                    <div className="price-card">
                        <div className="price-tier">Dostęp otwarty</div>
                        <div className="price-amount">Bezpłatny</div>
                        <div className="price-period">bez ograniczeń czasowych</div>
                        <p className="price-desc">
                            Zagregowane wyniki wskaźników wpływu środowiskowego.
                            Dokumentacja metodologiczna. Porównania z danymi z baz
                            referencyjnych.
                        </p>
                    </div>

                    <div className="price-card recommended">
                        <div className="price-tier">Licencja profesjonalna</div>
                        <div className="price-amount">2 500 zł</div>
                        <div className="price-period">netto / rok</div>
                        <p className="price-desc">
                            Pełne zbiory danych LCI z przepływami elementarnymi. Modele
                            parametryczne. Eksport w formatach ILCD+EPD, EcoSpold v2 oraz
                            CSV.
                        </p>
                    </div>

                    <div className="price-card">
                        <div className="price-tier">Licencja instytucjonalna</div>
                        <div className="price-amount">6 000 zł</div>
                        <div className="price-period">netto / rok</div>
                        <p className="price-desc">
                            Pełny dostęp do interfejsu API (REST + GraphQL). Priorytetowe
                            aktualizacje zbiorów danych. Wsparcie techniczne. Integracja z
                            oprogramowaniem LCA.
                        </p>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            {/* Źródła */}
            <section id="zrodla" className="px-4 sm:px-8 lg:px-12 py-20 max-w-[860px] mx-auto">
                <div className="fade-in">
                    <div className="section-num">11 — Transparentność</div>
                    <h2 className="polca-serif text-[2.1rem] font-medium leading-[1.25] text-[#1A1A1A] mb-5">
                        Źródła danych i partnerzy walidacyjni
                    </h2>
                    <p className="text-[1.02rem] text-[#555555] max-w-[640px] leading-[1.8] mb-10 font-light">
                        Każda wartość w bazie poLCA posiada weryfikowalne źródło — zgodnie
                        z wymogami <strong>ISO 14044:2006</strong> §4.2.3.6.
                    </p>

                    <h3 className="text-base font-semibold text-[#1A1A1A] mt-6 mb-3">
                        Oficjalne źródła danych
                    </h3>
                    <div className="sources-grid">
                        <div className="source-badge official">
                            KOBiZE — wskaźniki emisji (ISO 14064-1)
                        </div>
                        <div className="source-badge official">
                            GUS — dane statystyczne
                        </div>
                        <div className="source-badge official">
                            PSE — miks energetyczny (ISO 14067 §6.4.9.4)
                        </div>
                        <div className="source-badge official">
                            Eurostat — Prodcom, bilanse energetyczne
                        </div>
                        <div className="source-badge official">
                            IPCC — współczynniki emisji 2006/2019
                        </div>
                        <div className="source-badge official">
                            E-PRTR / IEP — emisje zakładowe (Rozp. 166/2006)
                        </div>
                        <div className="source-badge official">
                            EU ETS / EUTL — zweryfikowane emisje CO₂
                        </div>
                    </div>

                    <h3 className="text-base font-semibold text-[#1A1A1A] mt-6 mb-3">
                        Źródła branżowe i normy PCR
                    </h3>
                    <div className="sources-grid">
                        <div className="source-badge">
                            Eurobitume — lepiszcza asfaltowe (EN 12591)
                        </div>
                        <div className="source-badge">
                            worldsteel — wyroby stalowe (ISO 14404-1/-2)
                        </div>
                        <div className="source-badge">
                            CEMBUREAU — cement i klinkier (EN 16908)
                        </div>
                        <div className="source-badge">European Aluminium (EN 15088)</div>
                        <div className="source-badge">
                            EFCA — domieszki do betonu (EN 934-2)
                        </div>
                        <div className="source-badge">
                            ERMCO — beton towarowy (EN 206, EN 16757)
                        </div>
                    </div>

                    <h3 className="text-base font-semibold text-[#1A1A1A] mt-6 mb-3">
                        Ramy normatywne — standardy LCA i EPD
                    </h3>
                    <div className="sources-grid">
                        <div className="source-badge official">
                            ISO 14040:2006 — Zasady i struktura LCA
                        </div>
                        <div className="source-badge official">
                            ISO 14044:2006 — Wymagania i wytyczne LCA
                        </div>
                        <div className="source-badge official">
                            ISO 14025:2006 — Deklaracje środowiskowe typu III
                        </div>
                        <div className="source-badge official">
                            ISO 14067:2018 — Ślad węglowy wyrobów
                        </div>
                        <div className="source-badge official">
                            EN 15804:2012+A2:2019 — PCR wyroby budowlane
                        </div>
                        <div className="source-badge official">
                            EN 15978:2011 — Ocena środowiskowa budynków
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-divider"></div>

            <PolcaFooter />
        </div>
    );
}
