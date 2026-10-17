import React, { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { Button } from "@/extensions/shadcn/components/button";
import { Separator } from "@/extensions/shadcn/components/separator";
import { useNavigate, Link } from "react-router-dom";

interface ServiceBoxProps {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
}

const ServiceBox = ({ title, description, icon, bgColor }: ServiceBoxProps) => {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className={`p-4 ${bgColor} flex items-center justify-center h-20`}>
        <span className="text-4xl text-white">{icon}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
}

const Testimonial = ({ quote, author, company }: TestimonialProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <p className="text-gray-600 italic mb-4">"{quote}"</p>
      <div>
        <p className="font-bold">{author}</p>
        <p className="text-gray-500 text-sm">{company}</p>
      </div>
    </div>
  );
};

export function ServicesPage() {
  const navigate = useNavigate();
  const benefitsRef = useReveal();
  const servicesRef = useReveal();
  const processRef = useReveal();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would normally send the data to the backend
    // For now, we'll just show an alert
    alert("Dziękujemy za przesłanie formularza! Skontaktujemy się wkrótce.");
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Usługi certyfikacyjne Multicert</h1>
              <p className="text-lg text-gray-600 mb-6">
                Krajowa certyfikacja ZKP do znaku budowlanego B w zakresie akredytacji PCA AC 210 oraz ocena zgodności CE przez partnerskie jednostki notyfikowane, których Multicert jest przedstawicielem w Polsce.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="font-medium"
                >
                  Zapytaj o certyfikację
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="font-medium"
                >
                  <Link to="/">Dowiedz się więcej o CPR 2024</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/images/hero-construction.jpg"
                alt="Certyfikacja wyrobów budowlanych"
                className="rounded-lg shadow-md max-w-full h-auto"
                style={{ maxHeight: "350px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section ref={benefitsRef as React.RefCallback<HTMLElement>} className="reveal py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Dlaczego warto wybrać Multicert?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceBox
              title="Ekspresowa certyfikacja"
              description="Dzięki zoptymalizowanym procesom i doświadczeniu, oferujemy certyfikację w rekordowo krótkim czasie, pomagając wprowadzić produkt na rynek zgodnie z harmonogramem."
              icon="🚀"
              bgColor="bg-blue-600"
            />
            <ServiceBox
              title="Bezstronna ocena zgodności"
              description="Jako jednostka certyfikująca oceniamy zgodność wyrobów i zakładowej kontroli produkcji z wymaganiami. Odpowiadamy na pytania o wymagania i przebieg certyfikacji."
              icon="🏗️"
              bgColor="bg-green-600"
            />
            <ServiceBox
              title="Współpraca z laboratoriami"
              description="Badania wymagane w procesie oceny zgodności wykonują partnerskie laboratoria i jednostki notyfikowane, co pozwala sprawnie przeprowadzić niezbędne testy."
              icon="🔬"
              bgColor="bg-purple-600"
            />
          </div>

          <div className="mt-12 text-center">
            <Button 
              onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
              size="lg"
              className="font-medium"
            >
              Certyfikacja w rekordowym czasie – Skontaktuj się z nami!
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Services Details Section */}
      <section ref={servicesRef as React.RefCallback<HTMLElement>} className="reveal py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Nasze usługi certyfikacyjne</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Krajowa certyfikacja ZKP do znaku budowlanego B (beton towarowy, mieszanki związane hydraulicznie, mieszanki mineralno-asfaltowe / utrwalanie nawierzchni, spoiwa hydrauliczne) oraz pośrednictwo w ocenie zgodności CE prowadzonej przez partnerskie jednostki notyfikowane.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Ocena stałości właściwości użytkowych</h3>
              <p className="text-gray-600 mb-4">
                Ocena zgodności do oznakowania CE prowadzona przez partnerskie jednostki notyfikowane (ITC Zlín NB 1023, LL-C NB 2435, Silniční vývoj – ZDZ NB 1388), których Multicert jest przedstawicielem w Polsce.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 ml-2">
                <li>Pośrednictwo w kontakcie z jednostką notyfikowaną</li>
                <li>Badania wyrobu przez partnerów</li>
                <li>Ocena zgodności z normami zharmonizowanymi</li>
                <li>Certyfikat wydawany przez jednostkę notyfikowaną</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Audyt zakładowej kontroli produkcji</h3>
              <p className="text-gray-600 mb-4">
                Ocena procesów produkcyjnych i systemu kontroli jakości, zapewniająca stałość właściwości wyrobu budowlanego zgodnie z deklarowanymi parametrami.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 ml-2">
                <li>Audyt procesów produkcyjnych</li>
                <li>Ocena systemów kontroli jakości</li>
                <li>Raport z audytu ze stwierdzonymi niezgodnościami</li>
                <li>Nadzór okresowy nad certyfikowaną ZKP</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Certyfikacja ZKP – znak budowlany B</h3>
              <p className="text-gray-600 mb-4">
                Krajowa certyfikacja zakładowej kontroli produkcji do znaku budowlanego B (system 2+) w zakresie akredytacji PCA AC 210.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 ml-2">
                <li>Beton towarowy</li>
                <li>Mieszanki związane hydraulicznie</li>
                <li>Mieszanki mineralno-asfaltowe / utrwalanie nawierzchni</li>
                <li>Spoiwa hydrauliczne</li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Szkolenia informacyjne</h3>
              <p className="text-gray-600 mb-4">
                Ogólne szkolenia informacyjne z zakresu wymagań CPR 2024 i przebiegu certyfikacji.
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 ml-2">
                <li>Najważniejsze zmiany w CPR 2024</li>
                <li>Szkolenia dla działów technicznych i jakości</li>
                <li>Przebieg audytu certyfikacyjnego</li>
                <li>Terminy przejściowe i stan prac nad hTS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies/Testimonials Section */}
      <section ref={processRef as React.RefCallback<HTMLElement>} className="reveal py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Co mówią nasi klienci</h2>
          <p className="text-lg text-gray-600 mb-12">
            Firmy, które zaufały Multicert i skorzystały z naszych usług certyfikacyjnych.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Testimonial
              quote="Dzięki ekspertom z Multicert przeszliśmy przez proces certyfikacji szybko i bez komplikacji. Profesjonalne podejście i wiedza zespołu były nieocenione."
              author="Jan Kowalski"
              company="BuildTech Sp. z o.o."
            />
            <Testimonial
              quote="Pomoc w interpretacji skomplikowanych przepisów CPR 2024 była dla nas kluczowa. Multicert wyjaśnił wszystkie aspekty i pomógł nam dostosować produkcję."
              author="Anna Nowak"
              company="Innovate Construction"
            />
            <Testimonial
              quote="Ekspresowa certyfikacja pozwoliła nam wprowadzić produkt na rynek zgodnie z harmonogramem, mimo zmian w przepisach. Polecam współpracę!"
              author="Tomasz Wiśniewski"
              company="ModernBuild Systems"
            />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bezpłatna wycena certyfikacji</h2>
              <p className="text-gray-600 mb-6">
                Masz pytania o wymagania i przebieg certyfikacji Twojego wyrobu? Wypełnij formularz, a skontaktujemy się z Tobą w ciągu 24 godzin.
              </p>
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-2">Multicert Sp. z o.o.</h3>
                <p className="text-gray-600">ul. Przykładowa 123</p>
                <p className="text-gray-600">00-000 Warszawa</p>
                <p className="text-gray-600 mt-2">Tel: 730 668 341</p>
                <p className="text-gray-600">Email: kontakt@multicert.pl</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Imię i nazwisko*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-1">Firma*</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Wiadomość*</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  * Pola wymagane
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Wyślij zapytanie
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}