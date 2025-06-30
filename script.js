// Toggle sidebar height and icon
function toggleLock() {
  const sidebar = document.getElementById("sidebar");
  const icon = document.getElementById("lockIcon");
  if (sidebar.style.height === "500px") {
    sidebar.style.height = "800px";
    icon.textContent = "⯅";
  } else {
    sidebar.style.height = "500px";
    icon.textContent = "⯆ ";
  }
}

// Toggle topic visibility
function toggleTopics(id) {
  const element = document.getElementById(id);
  element.style.display = element.style.display === "none" ? "block" : "none";
}

// Show YouTube video in main content
function showYoutube(link) {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
    <div class="video-container">
      <iframe width="100%" height="420" src="${link}" frameborder="0" allowfullscreen></iframe>
    </div>
    <button class="continue-btn" onclick="continueToNext()">Continue</button>
  `;
}

// Show quiz based on topic
function showQuiz(topic) {
  const quizData = {
    diriyah: {
      question: "What is Diriyah best known for?",
      options: {
        A: "Modern shopping malls",
        B: "Being a historical capital",
        C: "Tall skyscrapers",
        D: "Beach resorts"
      },
      correct: "B"
    },
    alula: {
      question: "What makes AlUla unique?",
      options: {
        A: "It is located on the sea",
        B: "It has a large airport",
        C: "It has ancient rock formations and tombs",
        D: "It is a financial hub"
      },
      correct: "C"
    },
    albalad: {
      question: "Why is Al-Balad important?",
      options: {
        A: "It is a mountain resort",
        B: "It is a cultural and historic district",
        C: "It has oil fields",
        D: "It has large stadiums"
      },
      correct: "B"
    }
  };

  const q = quizData[topic];
  const content = document.getElementById("mainContent");
  content.innerHTML = `
    <div class="quiz-container">
      <h2>${topic.toUpperCase()} Quiz</h2>
      <br>
      <form id="quizForm">
        <p>${q.question}</p>
        <div class="options-list">
          <label><input type="radio" name="answer" value="A"> ${q.options.A}</label><br>
          <label><input type="radio" name="answer" value="B"> ${q.options.B}</label><br>
          <label><input type="radio" name="answer" value="C"> ${q.options.C}</label><br>
          <label><input type="radio" name="answer" value="D"> ${q.options.D}</label><br>
        </div>
        <br>
        <button type="button" onclick="submitQuiz('${topic}')" class="submit-btn">Submit</button>
      </form>

      <!-- Quiz feedback modal -->
      <div class="custom-modal" id="customAlert" style="display: none;">
        <div class="modal-content">
          <span class="modal-icon" id="modalIcon">⚠️</span>
          <p id="alertMessage">Message appears here</p>
          <button class="modal-close-btn" onclick="closeAlert()"> close </button>
        </div>
      </div>
    </div>
    <button class="continue-btn" onclick="continueToNext()">Continue</button>
  `;
}

// Handle quiz submission and feedback
function submitQuiz(topic) {
  const quizData = {
    diriyah: "B",
    alula: "C",
    albalad: "B"
  };

  const selected = document.querySelector('input[name="answer"]:checked');
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");
  const modalIcon = document.getElementById("modalIcon");

  if (!selected) {
    alertMessage.textContent = " Please select an answer before submitting.";
    modalIcon.textContent = "⚠️";
  } else {
    const correct = quizData[topic];
    if (selected.value === correct) {
      alertMessage.textContent = "Correct! Well done.";
      modalIcon.textContent = "✅";
    } else {
      alertMessage.textContent = `Incorrect. The correct answer is: ${correct}`;
      modalIcon.textContent = "❌";
    }
  }

  alertBox.style.display = "flex";
}

// Close quiz modal
function closeAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "none";
}

// Move to next topic/video/quiz
function continueToNext() {
  const topics = document.querySelectorAll('.topics a');
  let currentIndex = -1;

  for (let i = 0; i < topics.length; i++) {
    if (topics[i].classList.contains('clicked-topic')) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex !== -1 && currentIndex < topics.length - 1) {
    topics[currentIndex].classList.remove('clicked-topic');
    const nextTopic = topics[currentIndex + 1];
    nextTopic.classList.add('clicked-topic');

    const onclickAttr = nextTopic.getAttribute('onclick');
    if (onclickAttr.includes("showYoutube")) {
      const link = onclickAttr.match(/'(.*?)'/)[1];
      showYoutube(link);
    } else if (onclickAttr.includes("showQuiz")) {
      const topic = onclickAttr.match(/'(.*?)'/)[1];
      showQuiz(topic);
    }
  } else {
    showMap(); 
  }
}

// Track current selected topic
document.querySelectorAll('.topics a').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.topics a').forEach(l => l.classList.remove('clicked-topic'));
    this.classList.add('clicked-topic');
  });
});

// Map Section

let fullMap;

const mapLocations = {
  diriyah: { lat: 24.737, lng: 46.632, label: "Diriyah" },
  alula: { lat: 26.606, lng: 37.923, label: "AlUla" },
  albalad: { lat: 21.485, lng: 39.186, label: "Al-Balad" }
};

// Show map with markers
function showMap() {
  const content = document.getElementById("mainContent");
  content.innerHTML = `
    <div class="map-container">
      <h2 class="map-heading"> Saudi Heritage Sites </h2>
      <br>
      <div class="map-buttons">
        <button onclick="focusMap('diriyah')">Diriyah</button>
        <button onclick="focusMap('alula')">AlUla</button>
        <button onclick="focusMap('albalad')">Al-Balad</button>
        <button onclick="focusAll()">View All</button>
      </div>
      <br>
      <div id="mainMap" style="height: 450px; border-radius: 10px; margin-bottom: 10px;"></div>
    </div>
  `;

  fullMap = L.map('mainMap').setView([24.7, 44.0], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(fullMap);

  for (const key in mapLocations) {
    const loc = mapLocations[key];
    L.marker([loc.lat, loc.lng]).addTo(fullMap).bindPopup(loc.label);
  }
}

// Focus map on single location
function focusMap(key) {
  if (!fullMap) return;
  const loc = mapLocations[key];
  fullMap.setView([loc.lat, loc.lng], 10);
}

// Reset map to all locations
function focusAll() {
  if (!fullMap) return;
  fullMap.setView([24.7, 44.0], 5);
}
