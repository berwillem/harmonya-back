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
<html>
<head>
  <title>Receipt Report</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <style>
    body {
      background: #ccc;
      padding: 30px;
      font-size: 0.6em;
    }

    h6 {
      font-size: 1em;
    }

    .container {
      width: 21cm;
      min-height: 29.7cm;
    }

    .invoice {
      background: #fff;
      width: 100%;
      padding: 50px;
    }

    .logo {
      width: 4cm;
    }

    .document-type {
      text-align: right;
      color: #444;
    }

    .conditions {
      font-size: 0.7em;
      color: #666;
    }

    .bottom-page {
      font-size: 0.7em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="invoice">
      <div class="row">
        <div class="col-7">
          <!-- Empty column -->
        </div>
        <div class="col-5">
          <h1 class="document-type display-4">FACTURE</h1>
          <p class="text-right"><strong>Référence facture</strong></p>
        </div>
      </div>
      <div class="row">
        <div class="col-7">
        <img class="logo " src="data:image/png;base64, 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"/>
          <p class="addressMySam">
            <strong>{{magasin}}</strong><br/>
          
          </p>
        </div>
   
      </div>
      <br/>
      <br/>
      <h6>Frais de services {{magasin}} du <span>date</span> a</h6>
      <br/>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th class="text-right"> prix unitie </th>
            <th class="text-right">Total </th>
          </tr>
        </thead>
        <tbody>
         {{#each services}}
          <tr>
            <td>{{this.name}}</td>
            <td>{{this.quantity}}</td>
            <td class="text-right">{{this.price}} DZD</td>
            <td class="text-right">{{this.total}} DZD</td>
          </tr>
           {{/each}}
          <tr>
            <td>Custom service</td>
            <td>///</td>
            <td class="text-right">{{custom}} DZD</td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <div class="col-8">
          <!-- Empty column -->
        </div>
        <div class="col-4">
          <table class="table table-sm text-right">
            <tr>
              <td><strong>Total TTC</strong></td>
              <td class="text-right">{{totalGen}} DZD</td>
            </tr>
          </table>
        </div>
      </div>
      <p class="conditions">
        En votre aimable règlement
        <br/>
        Et avec nos remerciements.
        <br/><br/>
      
      <br/>
      <br/>
      <br/>
      <br/>
      <p class="bottom-page text-right">
      binovente
    
      </p>
    </div>
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
  
      const pdf = await page.pdf({ format: 'A4', timeout: 60000 }); // Timeout augmenté pour la génération du PDF
  
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
  
