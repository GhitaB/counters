window.settings = {
  countersNumber: 0,
  countersInfo: {

  }
};

function saveSettings() {
  localStorage.setItem('countersConfig', JSON.stringify(window.settings));
  console.log("Settings saved.");
}

function removeSettings() {
  localStorage.removeItem("countersConfig");
  window.settings = {
    countersNumber: 0,
    countersInfo: {

    }
  };

  var counters = document.querySelectorAll('#counters .counter');

  counters.forEach(counter => {
    counter.remove();
  });
}

function restoreCounter(counter) {
  var template = document.querySelector('#templates .counter');
  var countersContainer = document.querySelector('.container #counters');
  var clonedTemplate = template.cloneNode(true);
  clonedTemplate.querySelector("span.created").textContent = counter.created;
  clonedTemplate.querySelector("span.updated").textContent = counter.updated;
  clonedTemplate.querySelector("input.number").value = counter.number;
  clonedTemplate.querySelector("span.editable").textContent = counter.text;
  var counterId = counter.id;
  clonedTemplate.id = counterId;
  countersContainer.appendChild(clonedTemplate);
  console.log("Counter restored.");
}

function restoreSettings() {
  var configuration = localStorage.getItem('countersConfig');
  if (configuration == null) return;
  console.log("Found old config.");
  console.log(configuration);
  window.settings = JSON.parse(configuration);

  for (const key in window.settings.countersInfo) {
    var counter = window.settings.countersInfo[key];
    restoreCounter({
      id: key,
      text: counter.text,
      number: counter.number,
      updated: counter.updated,
      created: counter.created
    });
  }
}

function nowTime() {
  return new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
}

function addCounter() {
  var template = document.querySelector('#templates .counter');
  var countersContainer = document.querySelector('.container #counters');
  var clonedTemplate = template.cloneNode(true);
  var now = nowTime();
  clonedTemplate.querySelector("span.created").textContent = now;
  clonedTemplate.querySelector("span.updated").textContent = now;
  var counterId = "c" + window.settings.countersNumber;
  clonedTemplate.id = counterId;
  window.settings.countersNumber += 1;
  window.settings.countersInfo[counterId] = {
    text: 'items',
    number: 0,
    created: now,
    updated: now
  };
  countersContainer.appendChild(clonedTemplate);
  console.log("Counter added.");
  console.log(window.settings);
  saveSettings();
}

function deleteCounter(counterId) {
  var counter = document.querySelector(
    '.container #counters .counter#' + counterId + ' '
  );
  counter.remove();
  delete window.settings.countersInfo[counterId];
  console.log("Counter deleted");
  console.log(window.settings);
  saveSettings();
}

function updateCounter(counterId) {
  var counter = document.querySelector(
    '.container #counters .counter#' + counterId + ' '
  );
  var now = nowTime();
  counter.querySelector("span.updated").textContent = now;
  window.settings.countersInfo[counterId].updated = now;
  console.log("Counter updated");
  saveSettings();
}

document.addEventListener('click', function (event) {
  if (event.target.matches('#add-counter')) {
    event.preventDefault();
    addCounter();
  }

  if (event.target.matches('#delete-all')) {
    event.preventDefault();
    removeSettings();
  }

  if (event.target.matches('.delete')) {
    event.preventDefault();
    var counterId = event.target.parentElement.id;
    deleteCounter(counterId);
  }

  if (event.target.matches('.number')) {
    event.preventDefault();
    var counterId = event.target.parentElement.id;
    window.settings.countersInfo[counterId].number = event.target.value;  // TODO fix bug: you must click again the span after changing the text to have the value saved
    updateCounter(counterId);
  }

  if (event.target.matches('.editable')) {
    event.preventDefault();
    var counterId = event.target.parentElement.id;
    window.settings.countersInfo[counterId].text = event.target.textContent;  // TODO fix bug: you must click again the span after changing the text to have the value saved
    updateCounter(counterId);
    saveSettings();
  }

  return;
}, false);

restoreSettings();
