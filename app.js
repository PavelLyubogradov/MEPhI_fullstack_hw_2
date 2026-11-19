const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const dataError = document.querySelector('#data-error');
const serviceForm = document.querySelector('#service-form');
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const result = document.querySelector('#result');
const reportJsonOutput = document.querySelector('#report-json');

let data = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  const items = services
    .filter((service) => (
      (service.id === 'guide' && guideChecked)
      || (service.id === 'audio' && audioChecked)
      || (service.id === 'catalog' && catalogChecked)
    ))
    .map((service) => {
      const { title, price } = service;

      return { title: title.trim(), price };
    });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return { count: items.length, total, items };
}

function showProgram() {
  program.innerHTML = data.event.meeting;
  program.hidden = false;
}

function handleServiceSubmit(event) {
  event.preventDefault();

  const report = buildReport(
    data.services,
    guideCheckbox.checked,
    audioCheckbox.checked,
    catalogCheckbox.checked,
  );

  if (report.count === 0) {
    choiceError.textContent = 'Выберите хотя бы одну услугу.';
    choiceError.hidden = false;
    result.hidden = true;
    reportJsonOutput.hidden = true;
    return;
  }

  // JSON-строка отчёта проверяется обратным разбором; итог строится по проверенным данным.
  const reportJson = JSON.stringify(report);
  const checkedReport = JSON.parse(reportJson);

  let resultHtml = `Выбрано услуг: ${checkedReport.count}<br>Итого: ${checkedReport.total} руб.`;
  checkedReport.items.forEach((item) => {
    resultHtml += `<br>${escapeHtml(item.title)}`;
  });

  result.innerHTML = resultHtml;
  reportJsonOutput.textContent = reportJson;

  choiceError.hidden = true;
  result.hidden = false;
  reportJsonOutput.hidden = false;
}

try {
  data = JSON.parse(sourceJson);
} catch {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
  showProgramButton.disabled = true;
}

// Дальнейшая работа с данными — только после успешного разбора.
if (data !== null) {
  showProgramButton.addEventListener('click', showProgram);
  serviceForm.addEventListener('submit', handleServiceSubmit);
  serviceForm.hidden = false;
}
