const firebaseConfig = {
  apiKey: "AIzaSyBx_0ShRQrQ-Zxxm9Bahr3TbKqympHRJ6c",
  authDomain: "statistika-e55a8.firebaseapp.com",
  databaseURL: "https://statistika-e55a8-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "statistika-e55a8",
  storageBucket: "statistika-e55a8.firebasestorage.app",
  messagingSenderId: "625327031040",
  appId: "1:625327031040:web:2a40ffb1b2a7bf890669e5"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function trackVisitor() {
    let hasVisited = sessionStorage.getItem('has_visited');
    if (!hasVisited) {
        sessionStorage.setItem('has_visited', 'true');
        var ref = database.ref('site_visitors');
        ref.transaction(function(current_value) {
            return (current_value || 0) + 1;
        });
    }
}
trackVisitor();

function hasDeviceSubmitted() {
    return localStorage.getItem('device_submitted_survey') === 'true';
}

function markDeviceAsSubmitted() {
    localStorage.setItem('device_submitted_survey', 'true');
}

(function checkDeviceOnLoad() {
    if (hasDeviceSubmitted()) {
        setTimeout(function () {
            var notice = document.getElementById('blocked-notice');
            var startBtn = document.getElementById('start-btn');
            if (notice) notice.style.display = 'block';
            if (startBtn) {
                startBtn.innerText = 'Anda Sudah Mengisi Survei';
                startBtn.disabled = true;
                startBtn.onclick = null;
            }
        }, 100);
    }
})();

function animateCountUp(element, targetValue, duration) {
    if (!element) return;
    var start = 0;
    var startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        element.innerText = Math.floor(eased * targetValue);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.innerText = targetValue;
        }
    }
    requestAnimationFrame(step);
}

function updateLandingStats() {
    database.ref('site_visitors').once('value').then((snapshot) => {
        var visitors = snapshot.val() || 0;
        animateCountUp(document.getElementById('landing-visitors'), visitors, 1200);
    });

    database.ref('surveys').once('value').then((snapshot) => {
        var allData = [];
        snapshot.forEach((childSnapshot) => {
            allData.push(childSnapshot.val());
        });
        animateCountUp(document.getElementById('landing-respondents'), allData.length, 1200);
    });
}

setTimeout(updateLandingStats, 200);



var questions = [
    // KETANGGAPAN 
    "Seberapa cepat biasanya tim IT merespon ketika Anda melaporkan masalah perangkat kerja?",
    "Menurut Anda, mudah atau sulit untuk menghubungi tim IT saat Anda sedang membutuhkan bantuan?",
    "Apakah tim IT biasanya memberitahu perkiraan waktu kapan masalah Anda akan selesai ditangani?",
    "Saat terjadi gangguan mendadak seperti internet mati atau printer error, apakah tim IT langsung bergerak tanpa perlu diminta?",
    "Setelah masalah Anda selesai diperbaiki, pernahkah tim IT menghubungi Anda kembali untuk memastikan semuanya sudah beres?",
    "Bagaimana kesabaran tim IT saat Anda menjelaskan kendala yang mungkin terdengar sepele atau terjadi berulang kali?",
    "Secara keseluruhan, seberapa puas Anda dengan kecepatan penanganan masalah dari awal lapor sampai tuntas?",

    // JAMINAN
    "Apakah Anda merasa data dan file kerja di komputer Anda aman saat sedang diperbaiki oleh tim IT?",
    "Pernahkah muncul masalah baru di komputer Anda setelah selesai diperbaiki oleh tim IT?",
    "Menurut pengamatan Anda, apakah tim IT sudah cukup ahli dan kompeten dalam menangani masalah teknis?",
    "Saat tim IT menjelaskan masalah atau solusinya, apakah penjelasannya mudah Anda pahami sebagai orang non-teknis?",
    "Setelah perbaikan selesai, apakah tim IT mengetes dan memastikan perangkat berjalan normal di depan Anda?",
    "Apakah Anda merasa nyaman dan tidak sungkan saat harus meminta bantuan kepada tim IT?",
    "Dalam situasi darurat seperti server down atau sistem error total, seberapa yakin Anda bahwa tim IT mampu mengatasinya?",
    "Secara jujur, apakah layanan IT Helpdesk di PT Taiyo Sinar Raya Teknik sudah terasa profesional?"
];

var ratingScale = [
    { text: "Sangat Kurang", score: 1 },
    { text: "Kurang", score: 2 },
    { text: "Cukup", score: 3 },
    { text: "Baik", score: 4 },
    { text: "Sangat Baik", score: 5 }
];

var currentQuestionIndex = 0;
var surveyData = {
    name: "",
    gender: "",
    marital: "",
    answers: [],
    feedback: "",
    timestamp: null
};



document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    triggerAntiInspectWarning();
});


document.addEventListener("keydown", function (e) {
    var key = e.key ? e.key.toLowerCase() : '';

    // F12, F11
    if (key === "f12" || key === "f11") {
        e.preventDefault();
        triggerAntiInspectWarning();
        return;
    }

    
    if (e.ctrlKey) {
        if (e.shiftKey && (key === "i" || key === "c" || key === "j")) {
            e.preventDefault();
            triggerAntiInspectWarning();
            return;
        }
        if (key === "u" || key === "s") {
            e.preventDefault();
            triggerAntiInspectWarning();
            return;
        }
    }
});


document.addEventListener("dragstart", function (e) { e.preventDefault(); });


(function detectDevTools() {
    var threshold = 160;
    setInterval(function () {
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            
        }
    }, 1000);
})();

function triggerAntiInspectWarning() {
    showCustomAlert(
        "Akses Ditolak",
        "Inspeksi halaman tidak diizinkan. Jika ingin source code bisa hubungi IG <strong>@crdhoo_</strong> atau TikTok <strong>@xxcrdhoo</strong>",
        "⚠️"
    );
}


function showScreen(id) {
    
    if ((id === 'identity-screen' || id === 'survey-screen') && hasDeviceSubmitted()) {
        showCustomAlert("Sudah Mengisi", "Perangkat ini sudah pernah digunakan untuk mengisi survei. Terima kasih atas partisipasi Anda!", "✅");
        return;
    }

    document.querySelectorAll('.screen').forEach(function (el) {
        el.classList.remove('active');
        el.classList.add('hidden');
    });

    var target = document.getElementById(id);
    target.classList.remove('hidden');
    void target.offsetWidth; // Trigger reflow
    target.classList.add('active');

    var headerLogo = document.querySelector('.header-logo');
    
    if (id === 'admin-screen') {
        document.getElementById('app').style.maxWidth = '960px';
        if (headerLogo) headerLogo.style.display = 'none';
        fetchAdminData();
    } else {
        document.getElementById('app').style.maxWidth = '620px';
        if (headerLogo) headerLogo.style.display = 'flex';
    }

    
    if (id === 'survey-screen') {
        renderQuestion(false);
    }

    
    document.getElementById('app').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCustomAlert(title, message, icon) {
    document.getElementById('warning-title').innerText = title;
    document.getElementById('warning-text').innerHTML = message;
    document.getElementById('warning-icon').innerText = icon || '⚠️';
    document.getElementById('warning-popup').classList.remove('hidden');
}

function closePopup(id) {
    document.getElementById(id).classList.add('hidden');
    if (id === 'pin-popup') {
        document.getElementById('admin-pin').value = '';
        document.getElementById('pin-error').innerText = '';
    }
}


function selectOption(type, value, element, isPink) {
    var groupId = type === 'gender' ? 'gender-group' : 'marital-group';
    var group = document.getElementById(groupId);
    var buttons = group.querySelectorAll('.option-btn');

    buttons.forEach(function (btn) {
        btn.classList.remove('selected', 'selected-pink');
    });

    if (isPink) {
        element.classList.add('selected-pink');
    } else {
        element.classList.add('selected');
    }

    if (type === 'gender') {
        surveyData.gender = value;
    } else {
        surveyData.marital = value;
    }
}


function startSurvey() {
    var nameInput = document.getElementById('userName').value.trim();
    surveyData.name = nameInput === '' ? 'Anonim' : nameInput;

    if (!surveyData.gender) {
        showCustomAlert("Perhatian", "Mohon pilih jenis kelamin Anda terlebih dahulu.", "💡");
        return;
    }
    if (!surveyData.marital) {
        showCustomAlert("Perhatian", "Mohon pilih status pernikahan Anda terlebih dahulu.", "💡");
        return;
    }

    currentQuestionIndex = 0;
    showScreen('survey-screen');
}

function renderQuestion(useTransition) {
    var qCounter = document.getElementById('question-counter');
    var qText = document.getElementById('question-text');
    var container = document.getElementById('rating-container');
    var pb = document.getElementById('survey-progress');
    var dynContent = document.getElementById('survey-dynamic-content');
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');

    var buildContent = function () {
        qCounter.innerText = 'PERTANYAAN ' + (currentQuestionIndex + 1) + ' DARI ' + questions.length;
        qText.innerText = questions[currentQuestionIndex];

        var progressPerc = ((currentQuestionIndex) / questions.length) * 100;
        pb.style.width = progressPerc + '%';

        container.innerHTML = '';
        var currentAnswer = surveyData.answers[currentQuestionIndex];

        ratingScale.forEach(function (rt) {
            var btn = document.createElement('button');
            btn.className = 'rating-btn';
            if (currentAnswer === rt.score) btn.classList.add('selected');

            btn.innerHTML = '<span>' + rt.text + '</span> <span class="score-badge">' + rt.score + '</span>';
            btn.onclick = function () { selectRating(rt.score); };
            container.appendChild(btn);
        });

        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Ke Saran Penutup' : 'Selanjutnya';

        
        if (surveyData.answers[currentQuestionIndex] !== undefined) {
            nextBtn.style.display = '';
        } else {
            nextBtn.style.display = 'none';
        }
    };

    if (useTransition) {
        dynContent.style.opacity = '0';
        setTimeout(function () {
            buildContent();
            dynContent.style.opacity = '1';
        }, 350);
    } else {
        buildContent();
        dynContent.style.opacity = '1';
    }
}

function selectRating(score) {
    surveyData.answers[currentQuestionIndex] = score;

    var container = document.getElementById('rating-container');
    var buttons = container.querySelectorAll('.rating-btn');
    buttons.forEach(function (btn, idx) {
        btn.classList.remove('selected');
        if (ratingScale[idx].score === score) {
            btn.classList.add('selected');
        }
    });

    
    var nextBtnEl = document.getElementById('next-btn');
    if (nextBtnEl) nextBtnEl.style.display = 'none';

    
    setTimeout(function () { nextQuestion(); }, 900);
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(true);
    }
}

function nextQuestion() {
    if (surveyData.answers[currentQuestionIndex] === undefined) {
        showCustomAlert("Pesan Sistem", "Silakan pilih salah satu jawaban terlebih dahulu sebelum melangkah maju.", "✋");
        return;
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion(true);
    } else {
        showScreen('feedback-screen');
    }
}

function goBackToLastQuestion() {
    currentQuestionIndex = questions.length - 1;
    showScreen('survey-screen');
}


function submitSurvey() {
    var feedbackVal = document.getElementById('feedbackText').value.trim();

    if (!feedbackVal || feedbackVal.length < 2) {
        showCustomAlert("Wajib Diisi", "Mohon tuliskan minimal satu atau dua kata pesan, saran, atau kritik untuk tim IT sebelum mengirim survei.", "✏️");
        return;
    }

    surveyData.feedback = feedbackVal;
    surveyData.timestamp = new Date().toISOString();

    var newSurveyRef = database.ref('surveys').push();
    newSurveyRef.set(JSON.parse(JSON.stringify(surveyData))).then(() => {
        markDeviceAsSubmitted();

        document.getElementById('survey-progress').style.width = '100%';

        setTimeout(function () {
            showScreen('success-screen');
        }, 500);
    }).catch((error) => {
        console.error("Firebase error: ", error);
        showCustomAlert("Gagal", "Gagal mengirim data. Periksa koneksi internet Anda.", "⚠️");
    });
}



var copyrightClicks = 0;
var clickTimer;

function handleCopyrightClick() {
    copyrightClicks++;
    clearTimeout(clickTimer);
    if (copyrightClicks >= 3) {
        copyrightClicks = 0;
        document.getElementById('pin-popup').classList.remove('hidden');
        document.getElementById('admin-pin').focus();
    } else {
        clickTimer = setTimeout(function () { copyrightClicks = 0; }, 1200);
    }
}

function verifyPin() {
    var pin = document.getElementById('admin-pin').value;
    if (pin === '19062006@@') {
        closePopup('pin-popup');
        showScreen('admin-screen');
    } else {
        document.getElementById('pin-error').innerText = 'Akses ditolak. PIN otorisasi tidak dikenal!';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    var pinInput = document.getElementById('admin-pin');
    if (pinInput) {
        pinInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') verifyPin();
        });
    }
});


function switchTab(tabName, btnElement) {
    
    document.querySelectorAll('.tab-content').forEach(function (el) {
        el.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(function (el) {
        el.classList.remove('active');
    });

    
    document.getElementById('tab-' + tabName).classList.add('active');
    if (btnElement) btnElement.classList.add('active');
}


var adminCharts = {}; 

var adminDataListenerAttached = false;
function fetchAdminData() {
    if (adminDataListenerAttached) return;
    adminDataListenerAttached = true;

    var totalVisEl = document.getElementById('total-visitors');
    var totalRespEl = document.getElementById('total-resp');
    var avgScoreEl = document.getElementById('avg-score');

    database.ref('site_visitors').on('value', (snapshot) => {
        totalVisEl.innerText = snapshot.val() || 0;
    });

    database.ref('surveys').on('value', (snapshot) => {
        var allData = [];
        snapshot.forEach((child) => {
            allData.push(child.val());
        });

        totalRespEl.innerText = allData.length;

        if (allData.length > 0) {
            var totalAvg = 0;
            allData.forEach(function (item) {
                totalAvg += parseFloat(calculateAverage(item.answers));
            });
            avgScoreEl.innerText = (totalAvg / allData.length).toFixed(1);
        } else {
            avgScoreEl.innerText = '0.0';
        }

        renderSummaryCharts(allData);
        renderPerQuestionCharts(allData);
        renderDataTable(allData);
        
        window.tempAdminData = allData;
    });
}

function calculateAverage(answersArr) {
    if (!answersArr || answersArr.length === 0) return '0.0';
    var sum = 0;
    for (var i = 0; i < answersArr.length; i++) {
        sum += answersArr[i];
    }
    return (sum / answersArr.length).toFixed(1);
}


function renderSummaryCharts(dataArray) {
    renderOverallChart(dataArray);
    renderGenderChart(dataArray);
    renderMaritalChart(dataArray);
}

function destroyChart(key) {
    if (adminCharts[key]) {
        adminCharts[key].destroy();
        delete adminCharts[key];
    }
}

function renderOverallChart(dataArray) {
    destroyChart('overall');
    var ctx = document.getElementById('overallChart').getContext('2d');

    var ratingCounts = {
        'Sangat Kurang': 0,
        'Kurang': 0,
        'Cukup': 0,
        'Baik': 0,
        'Sangat Baik': 0
    };

    dataArray.forEach(function (item) {
        var avg = parseFloat(calculateAverage(item.answers));
        if (avg >= 4.5) ratingCounts['Sangat Baik']++;
        else if (avg >= 3.5) ratingCounts['Baik']++;
        else if (avg >= 2.5) ratingCounts['Cukup']++;
        else if (avg >= 1.5) ratingCounts['Kurang']++;
        else ratingCounts['Sangat Kurang']++;
    });

    var chartColors = [
        'rgba(239, 68, 68, 0.85)',
        'rgba(249, 115, 22, 0.85)',
        'rgba(234, 179, 8, 0.85)',
        'rgba(59, 130, 246, 0.85)',
        'rgba(34, 197, 94, 0.85)'
    ];

    adminCharts['overall'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(ratingCounts),
            datasets: [{
                data: Object.values(ratingCounts),
                backgroundColor: chartColors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 16, font: { size: 12, family: 'Outfit', weight: '500' } }
                },
                title: {
                    display: true,
                    text: 'Distribusi Tingkat Kepuasan Keseluruhan',
                    font: { size: 14, family: 'Outfit', weight: '700' },
                    padding: { bottom: 16 }
                }
            }
        }
    });
}

function renderGenderChart(dataArray) {
    destroyChart('gender');
    var ctx = document.getElementById('genderChart').getContext('2d');

    var genderCounts = { 'Laki-laki': 0, 'Perempuan': 0 };
    dataArray.forEach(function (item) {
        if (item.gender === 'Perempuan') genderCounts['Perempuan']++;
        else genderCounts['Laki-laki']++;
    });

    adminCharts['gender'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(genderCounts),
            datasets: [{
                data: Object.values(genderCounts),
                backgroundColor: ['rgba(59, 130, 246, 0.85)', 'rgba(236, 72, 153, 0.85)'],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, font: { size: 11, family: 'Outfit' } }
                },
                title: {
                    display: true,
                    text: 'Jenis Kelamin Responden',
                    font: { size: 13, family: 'Outfit', weight: '700' }
                }
            }
        }
    });
}

function renderMaritalChart(dataArray) {
    destroyChart('marital');
    var ctx = document.getElementById('maritalChart').getContext('2d');

    var maritalCounts = { 'Belum Menikah': 0, 'Menikah': 0 };
    dataArray.forEach(function (item) {
        if (item.marital === 'Menikah') maritalCounts['Menikah']++;
        else maritalCounts['Belum Menikah']++;
    });

    adminCharts['marital'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(maritalCounts),
            datasets: [{
                data: Object.values(maritalCounts),
                backgroundColor: ['rgba(99, 102, 241, 0.85)', 'rgba(16, 185, 129, 0.85)'],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 12, font: { size: 11, family: 'Outfit' } }
                },
                title: {
                    display: true,
                    text: 'Status Pernikahan Responden',
                    font: { size: 13, family: 'Outfit', weight: '700' }
                }
            }
        }
    });
}


function renderPerQuestionCharts(dataArray) {
    var grid = document.getElementById('question-charts-grid');
    grid.innerHTML = '';

    // Destroy old per-question charts
    for (var key in adminCharts) {
        if (key.indexOf('q_') === 0) {
            adminCharts[key].destroy();
            delete adminCharts[key];
        }
    }

    var chartColors = [
        'rgba(239, 68, 68, 0.85)',   // 1 - Red
        'rgba(249, 115, 22, 0.85)',  // 2 - Orange
        'rgba(234, 179, 8, 0.85)',   // 3 - Yellow
        'rgba(59, 130, 246, 0.85)',  // 4 - Blue
        'rgba(34, 197, 94, 0.85)'   // 5 - Green
    ];

    for (var qi = 0; qi < questions.length; qi++) {
        // Count responses for each option
        var counts = [0, 0, 0, 0, 0]; // index 0=score1, 1=score2, etc.
        var totalForQ = 0;

        dataArray.forEach(function (item) {
            if (item.answers && item.answers[qi] !== undefined) {
                var score = item.answers[qi];
                if (score >= 1 && score <= 5) {
                    counts[score - 1]++;
                    totalForQ++;
                }
            }
        });

        // Create card
        var card = document.createElement('div');
        card.className = 'chart-card';

        var title = document.createElement('div');
        title.className = 'chart-card-title';
        title.innerText = 'Q' + (qi + 1);
        card.appendChild(title);

        var subtitle = document.createElement('div');
        subtitle.className = 'chart-card-subtitle';
        subtitle.innerText = questions[qi];
        card.appendChild(subtitle);

        // Canvas
        var canvasId = 'qchart-' + qi;
        var canvas = document.createElement('canvas');
        canvas.id = canvasId;
        canvas.height = 160;
        card.appendChild(canvas);

        // Legend
        var legendDiv = document.createElement('div');
        legendDiv.className = 'chart-legend';

        var scaleLabels = ['Sangat Kurang', 'Kurang', 'Cukup', 'Baik', 'Sangat Baik'];
        for (var li = 0; li < 5; li++) {
            var pct = totalForQ > 0 ? Math.round((counts[li] / totalForQ) * 100) : 0;
            var legendItem = document.createElement('div');
            legendItem.className = 'legend-item';

            var dot = document.createElement('span');
            dot.className = 'legend-dot';
            dot.style.backgroundColor = chartColors[li];
            legendItem.appendChild(dot);

            var labelSpan = document.createElement('span');
            labelSpan.innerText = counts[li] + ' (' + pct + '%)';
            legendItem.appendChild(labelSpan);

            legendDiv.appendChild(legendItem);
        }
        card.appendChild(legendDiv);

        grid.appendChild(card);

        // Render chart (need closure for qi)
        (function (idx, cId, cnts, labels) {
            setTimeout(function () {
                var ctx2 = document.getElementById(cId);
                if (!ctx2) return;
                adminCharts['q_' + idx] = new Chart(ctx2.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: cnts,
                            backgroundColor: chartColors,
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            hoverOffset: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        var total = 0;
                                        context.dataset.data.forEach(function (v) { total += v; });
                                        var pctVal = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
                                        return context.label + ': ' + context.parsed + ' (' + pctVal + '%)';
                                    }
                                }
                            }
                        }
                    }
                });
            }, 50 * idx); // Stagger rendering
        })(qi, canvasId, counts, scaleLabels);
    }
}


function renderDataTable(dataArray) {
    var tbody = document.getElementById('admin-tbody');
    tbody.innerHTML = '';

    if (dataArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px 0; color:#94a3b8;">Belum ada data responden.</td></tr>';
        return;
    }

    // Sort newest first
    var sorted = dataArray.slice().sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    sorted.forEach(function (item) {
        var avg = calculateAverage(item.answers);
        var d = new Date(item.timestamp);
        var dateStr =
            ('0' + d.getDate()).slice(-2) + '/' +
            ('0' + (d.getMonth() + 1)).slice(-2) + '/' +
            d.getFullYear() + '<br><small>' +
            ('0' + d.getHours()).slice(-2) + ':' +
            ('0' + d.getMinutes()).slice(-2) + '</small>';

        var feedback = item.feedback && item.feedback.trim() !== ''
            ? item.feedback
            : '<i style="color:#94a3b8;">(Tidak ada)</i>';

        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td><strong>' + (item.name || 'Anonim') + '</strong><br><span style="font-size:11px;color:#94a3b8;">' + (item.gender || '-') + '</span></td>' +
            '<td><span style="font-size:11px;color:#64748b;">' + (item.marital || '-') + '</span></td>' +
            '<td><strong style="font-size:16px;">' + avg + '</strong> <span style="color:#94a3b8;font-size:11px;">/ 5.0</span></td>' +
            '<td><span style="color:#475569;font-size:12px;font-style:italic;">"' + feedback + '"</span></td>' +
            '<td><span style="color:#64748b;font-size:12px;">' + dateStr + '</span></td>';
        tbody.appendChild(tr);
    });
}


function exportToCSV() {
    var arr = window.tempAdminData || [];
    if (arr.length === 0) {
        showCustomAlert("Gagal Unduh", "Belum ada dataset yang masuk dari responden.", "⚠️");
        return;
    }

    var csvContent = "data:text/csv;charset=utf-8,";
    var header = "Nama,Gender,Status,Rata-rata Skor";
    for (var h = 1; h <= questions.length; h++) {
        header += ",Q" + h;
    }
    header += ",Feedback,Timestamp\n";
    csvContent += header;

    arr.forEach(function (item) {
        var avg = calculateAverage(item.answers);
        var row = '"' + (item.name || 'Anonim') + '","' + (item.gender || '-') + '","' + (item.marital || '-') + '","' + avg + '"';

        if (item.answers && item.answers.length > 0) {
            item.answers.forEach(function (ans) {
                row += ',"' + ans + '"';
            });
        }

        var answered = item.answers ? item.answers.length : 0;
        for (var p = answered; p < questions.length; p++) {
            row += ',""';
        }

        var cleanFeedback = item.feedback ? item.feedback.replace(/"/g, '""') : '';
        row += ',"' + cleanFeedback + '"';
        row += ',"' + (item.timestamp || '') + '"';
        csvContent += row + '\r\n';
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Data_Survei_IT_Helpdesk_SPSS.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function resetTestData() {
    document.getElementById('reset-popup').classList.remove('hidden');
}

function executeResetData() {
    // Menghapus data dari Firebase
    database.ref('surveys').remove();
    database.ref('site_visitors').set(0);
    
    // Menghapus block dari browser lokal admin
    localStorage.removeItem('device_submitted_survey');
    sessionStorage.removeItem('has_visited');
    
    closePopup('reset-popup');
    showCustomAlert("Berhasil", "Data berhasil direset secara global dari server. Halaman akan dimuat ulang.", "✅");
    
    var closeBtn = document.getElementById('warning-close-btn');
    closeBtn.onclick = function() {
        location.reload();
    };
}
