const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const Receip = require('../models/Receipt');
const Magasin = require("../../main/models/Magasin");

// Fonction pour générer le HTML avec Handlebars
const generateHTML = (data) => {
  const template = `
 <!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket de Caisse</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      width: 80mm; /* Largeur du ticket de caisse */
      margin: 0;
      padding: 10mm;
      background-color: #f4f4f4;
    }

    .receipt {
      background-color: #fff;
      border: 1px solid #ccc;
      padding: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    h1 {
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .store-name {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .date {
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 5px;
      text-align: center;
      font-size: 0.9rem;
    }

    th {
      background-color: #f8f8f8;
    }

    .total, .tax, .grand-total {
      margin-bottom: 5px;
      font-weight: bold;
    }

    .thank-you {
      margin-top: 20px;
      font-size: 1rem;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <h1>Ticket de Caisse</h1>
    <p class="store-name">{{magasin}}</p>
    <p class="date">Date : 12/09/2024 - Heure : 14:35</p>

    <table class="items">
      <thead>
        <tr>
          <th>Article</th>
          <th>Quantité</th>
          <th>Prix Unitaire</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
          {{#each services}}
          <tr>
            <td>{{this.name}}</td>
            <td>{{this.quantity}}</td>
            <td >{{this.price}} DZD</td>
            <td >{{this.total}} DZD</td>
          </tr>
           {{/each}}
          
      </tbody>
    </table>

   
    <p class="tax">custom  : {{custom}}  DZD</p>
    <p class="grand-total">Total TTC :{{totalGen}}</p>

    <p class="thank-you">Merci pour votre achat !</p>
  </div>
</body>
</html>


  `;

  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(data);
};

// Fonction pour générer le PDF avec Puppeteer
const generatePDF = async (html) => {
    let browser;
    try {
      // Lancement du navigateur avec un timeout plus long
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000 // Timeout augmenté à 60 secondes
      });
  
      const page = await browser.newPage();
      
      // Réglage du timeout pour l'attente de la page
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
  
      const pdf = await page.pdf({
        width: '80mm', // Largeur de 80mm pour simuler un ticket
       
        printBackground: true, // Inclure les backgrounds
        margin: {
          top: '10mm',
          bottom: '10mm',
          left: '5mm',
          right: '5mm'
        },
        timeout: 60000, // Timeout augmenté pour la génération du PDF
      });// Timeout augmenté pour la génération du PDF
  
      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  };
  


// Add a new Receip
exports.addReceip = async (req, res) => {
  const { services,custom} = req.body;
  const {IdMagasain}=req.params;

  try {
    const newReceip = new Receip({
        Date:  new Date(Date.now()),
        magasin: IdMagasain,
        services: services,
        custom: custom,
    });

    await newReceip.save();
    return res.status(201).json({ message: "Receip created successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create Receip" });
  }
};




exports.getReceipsByMagasain = async (req, res) => {
    const { IdMagasain } = req.params;
    const { date, time } = req.query;

    try {

        let filter = { magasin: IdMagasain };

        if (date) {
            const startDateTime = new Date(date);
            const endDateTime = new Date(startDateTime);

            if (time) {
                const [hours, minutes] = time.split(':');
                startDateTime.setHours(hours, minutes, 0, 0);
                endDateTime.setHours(hours, minutes, 59, 999);
            } else {
                endDateTime.setDate(endDateTime.getDate() + 1);
            }

            filter.Date = {
                $gte: startDateTime,
                $lt: endDateTime
            };
        } else if (time) {
            const today = new Date();
            const startDateTime = new Date(today.setHours(time.split(':')[0], time.split(':')[1], 0, 0));
            const endDateTime = new Date(today.setHours(time.split(':')[0], time.split(':')[1], 59, 999));

            filter.Date = {
                $gte: startDateTime,
                $lt: endDateTime
            };
        }

        const Receips = await Receip.find(filter);
        return res.status(200).json(Receips);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};
exports.generateReceipsPDF = async (req, res) => {
    const { IdReceips } = req.params;
  
    try {
      const receip = await Receip.findById(IdReceips);
      const MagInfo = await Magasin.findById(receip.magasin);
    
      

     
  
      if (!receip) {
        return res.status(404).json({ error: 'Receip not found' });
      }
     
        const serviceTotal = receip.services.reduce((total, service) => total + service.prix * service.quantity, 0);
      
    
      // Generate HTML
      const html = generateHTML({
        title: "Receip Report",
        date: new Date().toLocaleDateString(),
        message: "This is the Receip report.",
        services: receip.services.map(service => ({
          name: service.Name,
          price: service.prix,
          quantity: service.quantity,
          total: service.prix * service.quantity
        })),
        custom: receip.custom,
        totalGen:serviceTotal+receip.custom,
        magasin:MagInfo.magasinName,
      });
   
  
      // Generate PDF
      const pdfBuffer = await generatePDF(html);
 
      // Send PDF response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=receip-report.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  };
  
