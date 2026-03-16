/**
 * FENNEC TECH LABS — Google Apps Script
 * Paste this into Google Apps Script and deploy as a Web App.
 * Three forms → three separate tabs in one Google Sheet.
 */

// ── CONFIG: change only these ────────────────────────────────
const NOTIFY_EMAIL  = 'hello@fennectechlabs.com'; // your email
const SEND_EMAIL    = true;                         // false to disable alerts
// ─────────────────────────────────────────────────────────────

const TABS = {
  hero:    { name: 'Homepage Leads',  color: '#C4511F' },
  contact: { name: 'Contact Form',    color: '#E8622A' },
  yrp:     { name: 'YRPSphere Apply', color: '#2A7DE1' }
};

const HEADERS = {
  hero:    ['Timestamp', 'Email', 'Source', 'Page'],
  contact: ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Service', 'Message', 'Referral'],
  yrp:     ['Timestamp', 'Name', 'Email', 'Phone', 'City', 'Background', 'Program', 'Referral']
};

// ── MAIN ─────────────────────────────────────────────────────
function doPost(e) {
  try {
    const d    = JSON.parse(e.postData.contents);
    const src  = (d.source || '').toLowerCase();
    let   key, row, subject, body;

    if (src.includes('hero') || src.includes('newsletter')) {
      key  = 'hero';
      row  = [ts(), d.email, d.source || 'Homepage', d.page || ''];
      subject = 'New email signup — Fennec Tech Labs';
      body    = `Email: ${d.email}\nSource: ${d.source}\nTime: ${ts()}`;

    } else if (src.includes('yrpsphere') || src.includes('apply') || src.includes('batch')) {
      key  = 'yrp';
      row  = [ts(), d.name, d.email, d.phone, d.city, d.background, d.program, d.source_detail];
      subject = `YRPSphere application — ${d.name}`;
      body    = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCity: ${d.city}\nBackground: ${d.background}\nProgram: ${d.program}\nTime: ${ts()}`;

    } else {
      key  = 'contact';
      row  = [ts(), d.firstName, d.lastName, d.email, d.phone, d.company, d.service, d.message, d.source_detail];
      subject = `New contact — ${d.firstName} ${d.lastName}`;
      body    = `Name: ${d.firstName} ${d.lastName}\nEmail: ${d.email}\nPhone: ${d.phone}\nCompany: ${d.company}\nService: ${d.service}\n\nMessage:\n${d.message}\n\nTime: ${ts()}`;
    }

    append(key, row);

    if (SEND_EMAIL) {
      MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: body });
    }

    return ok({ saved: true, tab: TABS[key].name });

  } catch (err) {
    return ok({ saved: false, error: err.toString() });
  }
}

// ── GET: health check ────────────────────────────────────────
function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const counts = {};
  Object.keys(TABS).forEach(k => {
    const s = ss.getSheetByName(TABS[k].name);
    counts[TABS[k].name] = s ? Math.max(0, s.getLastRow() - 1) + ' rows' : '0 rows';
  });
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'live', service: 'Fennec Tech Labs API', counts }, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── HELPERS ──────────────────────────────────────────────────
function append(key, row) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const conf = TABS[key];
  let   sheet = ss.getSheetByName(conf.name);

  if (!sheet) {
    sheet = ss.insertSheet(conf.name);
    const h = sheet.getRange(1, 1, 1, HEADERS[key].length);
    sheet.appendRow(HEADERS[key]);
    h.setBackground(conf.color)
     .setFontColor('#FFFFFF')
     .setFontWeight('bold')
     .setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 155);
  }

  sheet.appendRow(row);
  sheet.autoResizeColumns(2, HEADERS[key].length - 1);
}

function ts() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function ok(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
