// Initial Mock Data
let requests = [
    { id: 1, lat: 28.6139, lng: 77.2090, category: 'Health', description: 'Medical supplies needed urgently at the community center.', urgency: 'High', status: 'Pending', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, lat: 28.6200, lng: 77.2100, category: 'Food', description: 'Ration kits required for 50 families displaced by recent events.', urgency: 'Medium', status: 'Pending', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, lat: 28.6300, lng: 77.2200, category: 'Education', description: 'Books and stationery for makeshift school.', urgency: 'Low', status: 'Pending', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 4, lat: 28.6150, lng: 77.2050, category: 'Health', description: 'First aid kits required for injured civilians.', urgency: 'High', status: 'Resolved', timestamp: new Date(Date.now() - 172800000).toISOString() }
];

let currentUserRole = null; // 'ngo' or 'volunteer'
let map = null;
let markersLayer = null;
let currentNgoFilter = 'Pending';
let currentCategoryFilter = 'All';
let currentUrgencyFilter = 'All';
let alertShown = false;
let currentLang = 'en';
let customSurveyFields = []; // For building custom templates

const translations = {
    en: {
        appName: "Community Data Hub",
        tagline: "Real-time needs. Hyperlocal action.",
        loginNgo: "Login as NGO",
        loginVol: "Continue as Volunteer",
        home: "Home",
        dashboard: "Dashboard",
        map: "Map",
        surveys: "Surveys",
        tasks: "Tasks",
        impact: "Impact",
        totalRequests: "Total Requests",
        highUrgency: "High Urgency",
        resolvedCases: "Resolved Cases",
        recentRequests: "Recent Requests",
        high: "High",
        medium: "Medium",
        low: "Low",
        newRequest: "New Request",
        category: "Category",
        description: "Description",
        urgency: "Urgency",
        location: "Location",
        useCurrentLocation: "Use Current Location",
        submitRequest: "Submit Request",
        dataCollection: "Data Collection",
        paperToDigital: "Paper-to-Digital Bridge",
        uploadPaperForm: "Upload Paper Form",
        uploadPaperDesc: "Take a photo of a physical survey to automatically digitize it.",
        digitalSurveys: "Digital Surveys",
        ourImpact: "Our Impact",
        requestsResolved: "Requests Resolved Successfully",
        peopleHelped: "Estimated People Helped",
        requestsByCategory: "Requests by Category",
        pending: "Pending",
        resolved: "Resolved",
        sharedDataset: "Shared Dataset",
        datasetDesc: "Real-time collaborative dataset",
        downloadCsv: "Download CSV",
        createTemplate: "Create Custom Survey",
        surveyTitle: "Survey Title",
        customFields: "Custom Fields (Comma separated)",
        createTemplateBtn: "Create Template",
        criticalAlert: "CRITICAL ALERT",
        acknowledgeView: "Acknowledge & View",
        allCategories: "All Categories",
        allUrgency: "All Urgency",
        health: "Health",
        food: "Food",
        education: "Education",
        shelter: "Shelter",
        other: "Other",
        offlineMode: "Offline Mode. Working locally.",
        syncedRequests: "Synced offline requests successfully!"
    },
    hi: {
        appName: "सामुदायिक डेटा हब",
        tagline: "वास्तविक समय की जरूरतें। स्थानीय कार्रवाई।",
        loginNgo: "NGO के रूप में लॉगिन करें",
        loginVol: "स्वयंसेवक के रूप में जारी रखें",
        home: "होम",
        dashboard: "डैशबोर्ड",
        map: "नक्शा",
        surveys: "सर्वेक्षण",
        tasks: "कार्य",
        impact: "प्रभाव",
        totalRequests: "कुल अनुरोध",
        highUrgency: "उच्च प्राथमिकता",
        resolvedCases: "हल किए गए मामले",
        recentRequests: "हाल के अनुरोध",
        high: "उच्च",
        medium: "मध्यम",
        low: "कम",
        newRequest: "नया अनुरोध",
        category: "श्रेणी",
        description: "विवरण",
        urgency: "तात्कालिकता",
        location: "स्थान",
        useCurrentLocation: "वर्तमान स्थान का उपयोग करें",
        submitRequest: "अनुरोध सबमिट करें",
        dataCollection: "डेटा संग्रह",
        paperToDigital: "पेपर-टू-डिजिटल ब्रिज",
        uploadPaperForm: "पेपर फॉर्म अपलोड करें",
        uploadPaperDesc: "इसे स्वचालित रूप से डिजिटल करने के लिए एक भौतिक सर्वेक्षण की तस्वीर लें।",
        digitalSurveys: "डिजिटल सर्वेक्षण",
        ourImpact: "हमारा प्रभाव",
        requestsResolved: "अनुरोध सफलतापूर्वक हल किए गए",
        peopleHelped: "अनुमानित लोगों की मदद की गई",
        requestsByCategory: "श्रेणी के अनुसार अनुरोध",
        pending: "लंबित",
        resolved: "हल हो गया",
        sharedDataset: "साझा डेटासेट",
        datasetDesc: "वास्तविक समय सहयोगी डेटासेट",
        downloadCsv: "CSV डाउनलोड करें",
        createTemplate: "कस्टम सर्वेक्षण बनाएं",
        surveyTitle: "सर्वेक्षण शीर्षक",
        customFields: "कस्टम फ़ील्ड",
        createTemplateBtn: "टेम्पलेट बनाएं",
        criticalAlert: "महत्वपूर्ण चेतावनी",
        acknowledgeView: "देखें और स्वीकार करें",
        allCategories: "सभी श्रेणियां",
        allUrgency: "सभी तात्कालिकता",
        health: "स्वास्थ्य",
        food: "भोजन",
        education: "शिक्षा",
        shelter: "आश्रय",
        other: "अन्य",
        offlineMode: "ऑफ़लाइन मोड। स्थानीय रूप से काम कर रहा है।",
        syncedRequests: "ऑफ़लाइन अनुरोध सफलतापूर्वक सिंक किए गए!"
    },
    es: {
        appName: "Centro de Datos",
        tagline: "Necesidades en tiempo real. Acción local.",
        loginNgo: "Iniciar sesión como ONG",
        loginVol: "Continuar como Voluntario",
        home: "Inicio",
        dashboard: "Panel",
        map: "Mapa",
        surveys: "Encuestas",
        tasks: "Tareas",
        impact: "Impacto",
        totalRequests: "Solicitudes Totales",
        highUrgency: "Alta Urgencia",
        resolvedCases: "Casos Resueltos",
        recentRequests: "Solicitudes Recientes",
        high: "Alto",
        medium: "Medio",
        low: "Bajo",
        newRequest: "Nueva Solicitud",
        category: "Categoría",
        description: "Descripción",
        urgency: "Urgencia",
        location: "Ubicación",
        useCurrentLocation: "Usar Ubicación Actual",
        submitRequest: "Enviar Solicitud",
        dataCollection: "Recopilación de Datos",
        paperToDigital: "Puente de Papel a Digital",
        uploadPaperForm: "Subir Formulario de Papel",
        uploadPaperDesc: "Tome una foto de una encuesta física para digitalizarla automáticamente.",
        digitalSurveys: "Encuestas Digitales",
        ourImpact: "Nuestro Impacto",
        requestsResolved: "Solicitudes Resueltas con Éxito",
        peopleHelped: "Personas Ayudadas Estimadas",
        requestsByCategory: "Solicitudes por Categoría",
        pending: "Pendiente",
        resolved: "Resuelto",
        sharedDataset: "Conjunto de datos",
        datasetDesc: "Conjunto de datos colaborativo en tiempo real",
        downloadCsv: "Descargar CSV",
        createTemplate: "Crear Encuesta Personalizada",
        surveyTitle: "Título de la Encuesta",
        customFields: "Campos personalizados",
        createTemplateBtn: "Crear Plantilla",
        criticalAlert: "ALERTA CRÍTICA",
        acknowledgeView: "Reconocer y Ver"
    }
};

const app = {
    t(key) {
        if (!key) return '';
        const dict = translations[currentLang];
        return dict[key.toLowerCase()] || dict[key] || key;
    },

    // --- Authentication & Navigation ---
    login(role) {
        currentUserRole = role;
        document.getElementById('user-badge').textContent = role === 'ngo' ? 'NGO Admin' : 'Volunteer';

        // Show/hide NGO specific UI
        const ngoElements = document.querySelectorAll('.ngo-only');
        ngoElements.forEach(el => {
            if (role === 'ngo') el.classList.remove('hidden');
            else el.classList.add('hidden');
        });

        document.getElementById('app-header').classList.remove('hidden');
        document.getElementById('bottom-nav').classList.remove('hidden');

        this.navigate('dashboard-screen');

        // Simulate an alert shortly after login if there are multiple high urgency items
        if (!alertShown) {
            setTimeout(() => this.checkAlerts(), 3000);
            alertShown = true;
        }
    },

    changeLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang; // Accessibility
        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });

        // Re-render components to update dynamic content
        this.renderDashboard();
        if (currentUserRole === 'ngo') this.setNgoFilter('Pending');
        this.renderImpact();
        if (!document.getElementById('map-screen').classList.contains('hidden')) {
            this.initMap();
        }
    },

    toggleDarkMode() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            document.getElementById('dark-mode-icon').textContent = 'dark_mode';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('dark-mode-icon').textContent = 'light_mode';
        }
    },

    logout() {
        currentUserRole = null;
        document.getElementById('app-header').classList.add('hidden');
        document.getElementById('bottom-nav').classList.add('hidden');
        this.navigate('login-screen', false);
    },

    navigate(screenId, updateNav = true) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        // Show target screen
        document.getElementById(screenId).classList.remove('hidden');

        // Update Bottom Nav active state
        if (updateNav && screenId !== 'login-screen') {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            const targetNav = document.querySelector(`.nav-item[data-target="${screenId}"]`);
            if (targetNav) targetNav.classList.add('active');
        }

        // Screen-specific initialization
        if (screenId === 'dashboard-screen') this.renderDashboard();
        if (screenId === 'map-screen') this.initOrUpdateMap();
        if (screenId === 'ngo-panel') this.renderNgoPanel();
        if (screenId === 'impact-screen') this.renderImpact();

        // Scroll to top
        window.scrollTo(0, 0);
    },

    // --- Core Logic ---
    renderDashboard() {
        // Get Filters
        currentCategoryFilter = document.getElementById('filter-category').value;
        currentUrgencyFilter = document.getElementById('filter-urgency').value;

        // Apply Filters
        let filtered = requests.filter(r => {
            let catMatch = currentCategoryFilter === 'All' || r.category === currentCategoryFilter;
            let urgMatch = currentUrgencyFilter === 'All' || r.urgency === currentUrgencyFilter;
            return catMatch && urgMatch;
        });

        // Calculate Stats
        const total = requests.length;
        const pendingHigh = requests.filter(r => r.urgency === 'High' && r.status === 'Pending').length;
        const resolved = requests.filter(r => r.status === 'Resolved').length;

        document.getElementById('stat-total').textContent = total;

        const statUrgentEl = document.getElementById('stat-urgent');
        statUrgentEl.textContent = pendingHigh;
        if (pendingHigh > 0) statUrgentEl.parentElement.classList.add('urgent-glow');
        else statUrgentEl.parentElement.classList.remove('urgent-glow');

        document.getElementById('stat-resolved').textContent = resolved;

        // Top Urgent Highlights (Simple Logic: Any pending high urgency)
        const highlightContainer = document.getElementById('urgent-highlights');
        highlightContainer.innerHTML = '';
        const urgentCases = requests.filter(r => r.urgency === 'High' && r.status === 'Pending');
        if (urgentCases.length > 0 && currentUrgencyFilter !== 'Low' && currentUrgencyFilter !== 'Medium') {
            const req = urgentCases[0];
            highlightContainer.innerHTML = `
                <div class="highlight-card" onclick="app.openDetailsModal(${req.id})">
                    <div class="highlight-icon">
                        <span class="material-icons-round">campaign</span>
                    </div>
                    <div>
                        <h4 class="text-red" style="margin-bottom: 0.25rem;">🚨 ${this.t('criticalAlert')} - ${this.t(req.category)}</h4>
                        <p class="text-small">${req.description.substring(0, 50)}...</p>
                    </div>
                </div>
            `;
        }

        // Render List
        const listContainer = document.getElementById('dashboard-requests-list');
        listContainer.innerHTML = '';

        // Sort by pending first, then newest
        filtered.sort((a, b) => {
            if (a.status === 'Pending' && b.status === 'Resolved') return -1;
            if (a.status === 'Resolved' && b.status === 'Pending') return 1;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });

        if (filtered.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-muted mt-4">No requests found matching criteria.</p>';
            return;
        }

        filtered.slice(0, 10).forEach(req => {
            listContainer.appendChild(this.createRequestCard(req));
        });
    },

    createRequestCard(req) {
        const el = document.createElement('div');
        el.className = 'request-card';
        el.onclick = () => this.openDetailsModal(req.id);

        const urgencyClass = req.urgency.toLowerCase();

        el.innerHTML = `
            <div class="req-header">
                <span class="req-title">${this.t(req.category)}</span>
                <span class="badge ${urgencyClass}">${this.t(req.urgency)}</span>
            </div>
            <p class="req-desc">${req.description}</p>
            <div class="req-footer">
                <span class="req-location"><span class="material-icons-round text-small">place</span> Location Pin</span>
                <span>${req.status === 'Resolved' ? `<span class="text-green flex-center" style="gap:2px"><span class="material-icons-round text-small">check_circle</span> ${this.t('resolved')}</span>` : this.t('pending')}</span>
            </div>
        `;
        return el;
    },

    // --- Map Integration (Leaflet) ---
    initOrUpdateMap() {
        if (!map) {
            // Default center: New Delhi for demo purposes
            map = L.map('map').setView([28.6139, 77.2090], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            markersLayer = L.layerGroup().addTo(map);
        }

        // Clear existing markers
        markersLayer.clearLayers();

        // Add markers for Pending requests
        requests.filter(r => r.status === 'Pending').forEach(req => {
            let color = '#10B981'; // Green
            if (req.urgency === 'High') color = '#EF4444'; // Red
            if (req.urgency === 'Medium') color = '#F59E0B'; // Amber

            const markerHtmlStyles = `
              background-color: ${color};
              width: 1.5rem;
              height: 1.5rem;
              display: block;
              left: -0.75rem;
              top: -0.75rem;
              position: relative;
              border-radius: 3rem 3rem 0;
              transform: rotate(45deg);
              border: 1px solid #FFFFFF;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            `;
            const icon = L.divIcon({
                className: "custom-pin",
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [0, -36],
                html: `<span style="${markerHtmlStyles}" />`
            });

            const marker = L.marker([req.lat, req.lng], { icon: icon }).addTo(markersLayer);

            // Simple popup binding
            marker.bindPopup(`
                <div style="font-family: 'Outfit', sans-serif;">
                    <h4 style="margin:0 0 5px 0;">${this.t(req.category)}</h4>
                    <span style="font-size: 10px; padding: 2px 6px; border-radius: 10px; background: ${color}22; color: ${color}; font-weight: bold;">${this.t(req.urgency)}</span>
                    <p style="margin: 5px 0; font-size: 12px; max-width: 150px;">${req.description.substring(0, 50)}...</p>
                    <button onclick="app.openDetailsModal(${req.id})" style="background:var(--primary); color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; width:100%; font-size:12px;">View Details</button>
                </div>
            `);
        });

        // Invalidate size to fix display issues when container was hidden
        setTimeout(() => map.invalidateSize(), 100);
    },

    // --- Add Request ---
    openForm(title = null, customFieldsStr = null) {
        document.getElementById('add-request-form').reset();
        const titleEl = document.getElementById('add-screen-title');
        const catGroup = document.getElementById('standard-category-group');
        const dynamicContainer = document.getElementById('dynamic-fields-container');
        const isCustom = document.getElementById('is-custom-survey');
        const catSelect = document.getElementById('add-category');

        dynamicContainer.innerHTML = '';

        if (title && customFieldsStr) {
            titleEl.textContent = title;
            catGroup.classList.add('hidden');
            isCustom.value = title;
            catSelect.value = 'Other';

            // Add custom fields - handle URI decoding
            const fields = JSON.parse(decodeURIComponent(customFieldsStr));
            fields.forEach((f) => {
                let inputHtml = '';
                if (f.type === 'text') {
                    inputHtml = `<input type="text" class="custom-field-input" data-name="${f.name}" data-type="text" placeholder="Enter answer..." style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #E2E8F0;" required>`;
                } else if (f.type === 'textarea') {
                    inputHtml = `<textarea class="custom-field-input" data-name="${f.name}" data-type="textarea" rows="3" placeholder="Enter details..." style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #E2E8F0;" required></textarea>`;
                } else if (f.type === 'number') {
                    inputHtml = `<input type="number" class="custom-field-input" data-name="${f.name}" data-type="number" placeholder="e.g. 5" style="width:100%; padding:0.75rem; border-radius:8px; border:1px solid #E2E8F0;" required>`;
                } else if (f.type === 'checkbox') {
                    inputHtml = `<label style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;"><input type="checkbox" class="custom-field-input" data-name="${f.name}" data-type="checkbox" value="Yes"> Yes</label>`;
                }

                dynamicContainer.innerHTML += `
                    <div class="form-group custom-dynamic-field" style="margin-bottom:1rem;">
                        <label style="font-weight:500;">${f.name}</label>
                        ${inputHtml}
                    </div>
                `;
            });
        } else {
            titleEl.textContent = "New Request";
            catGroup.classList.remove('hidden');
            isCustom.value = "false";
            // Pre-select category if passed
            if (title && Array.from(catSelect.options).some(o => o.value === title)) {
                catSelect.value = title;
            }
        }

        this.navigate('add-screen');
    },

    getLocation() {
        const status = document.getElementById('location-status');
        status.textContent = "Locating...";

        // Simulate geolocation delay
        setTimeout(() => {
            // For demo, we add a slight random offset to central coord
            const lat = 28.6139 + (Math.random() - 0.5) * 0.05;
            const lng = 77.2090 + (Math.random() - 0.5) * 0.05;

            document.getElementById('add-lat').value = lat;
            document.getElementById('add-lng').value = lng;

            status.textContent = "Location acquired ✓";
            status.className = "text-small text-green mt-2";
        }, 800);
    },

    submitRequest(e) {
        e.preventDefault();

        const isCustom = document.getElementById('is-custom-survey').value;
        let category = document.getElementById('add-category').value;
        let description = document.getElementById('add-description').value;
        const urgency = document.querySelector('input[name="add-urgency"]:checked').value;
        let lat = parseFloat(document.getElementById('add-lat').value);
        let lng = parseFloat(document.getElementById('add-lng').value);

        if (isCustom !== "false") {
            category = "Custom: " + isCustom;
            // Append custom fields to description
            let customDetails = "";
            document.querySelectorAll('.custom-field-input').forEach(input => {
                let val = input.value;
                if (input.getAttribute('data-type') === 'checkbox') {
                    val = input.checked ? 'Yes' : 'No';
                }
                customDetails += `\n- ${input.getAttribute('data-name')}: ${val}`;
            });
            description = description + "\n\nCustom Fields:" + customDetails;
        }

        // Fallback if location not acquired
        if (isNaN(lat)) {
            lat = 28.6139 + (Math.random() - 0.5) * 0.05;
            lng = 77.2090 + (Math.random() - 0.5) * 0.05;
        }

        const newReq = {
            id: Date.now(),
            lat, lng,
            category, description, urgency,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };

        if (navigator.onLine) {
            requests.unshift(newReq);
        } else {
            // Offline - Save to localStorage queue
            const offlineQueue = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
            offlineQueue.push(newReq);
            localStorage.setItem('offlineRequests', JSON.stringify(offlineQueue));

            // Also add to local memory so it shows up instantly while still offline
            requests.unshift(newReq);
        }

        // Reset form
        document.getElementById('add-request-form').reset();
        document.getElementById('location-status').textContent = "Waiting for location...";
        document.getElementById('location-status').className = "text-small text-muted mt-2";

        if (urgency === 'High') {
            this.showLoudAlert(category);
        } else {
            this.navigate('dashboard-screen');
        }
    },

    closeCustomSurveyModal() {
        document.getElementById('custom-survey-modal').classList.add('hidden');
        document.getElementById('custom-survey-title').value = '';
        document.getElementById('builder-field-name').value = '';
        customSurveyFields = [];
        document.getElementById('builder-fields-list').innerHTML = '';
    },

    addFieldToBuilder() {
        const name = document.getElementById('builder-field-name').value.trim();
        const type = document.getElementById('builder-field-type').value;
        if (!name) return;

        customSurveyFields.push({ name, type });

        const list = document.getElementById('builder-fields-list');
        list.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:0.5rem; border-radius:4px; border:1px solid #E2E8F0;">
                <span class="text-small"><strong>${name}</strong> (${type})</span>
                <span class="material-icons-round text-green" style="font-size:1rem;">check</span>
            </div>
        `;
        document.getElementById('builder-field-name').value = '';
    },

    saveCustomSurvey() {
        const title = document.getElementById('custom-survey-title').value.trim();

        // Auto-add any pending field they might have forgotten to click "+ Add" for
        const pendingName = document.getElementById('builder-field-name').value.trim();
        if (pendingName) {
            this.addFieldToBuilder();
        }

        if (!title || customSurveyFields.length === 0) {
            this.showToast("Please enter a title and add at least one field.", true);
            return;
        }

        const container = document.getElementById('survey-list-container');
        const cardId = 'custom-card-' + Date.now();
        const card = document.createElement('div');
        card.className = 'glass-card survey-card';
        card.id = cardId;

        // Safely encode for HTML and Unicode
        const safeTitle = title.replace(/'/g, "\\'");
        const fieldsJson = encodeURIComponent(JSON.stringify(customSurveyFields)).replace(/'/g, "%27");

        card.innerHTML = `
            <span class="material-icons-round text-primary">dynamic_form</span>
            <div class="survey-info" onclick="app.openForm('${safeTitle}', '${fieldsJson}')" style="cursor:pointer; flex:1;">
                <h4>${title}</h4>
                <p class="text-muted text-small">${customSurveyFields.length} custom fields</p>
            </div>
            <button class="icon-btn" onclick="document.getElementById('${cardId}').remove(); event.stopPropagation();" style="color:var(--urgent-high); padding:0.5rem; background:rgba(239, 68, 68, 0.1); border-radius:50%;">
                <span class="material-icons-round">delete</span>
            </button>
        `;
        container.prepend(card);

        this.closeCustomSurveyModal();
        this.showToast("Custom survey template created!", false);
    },

    simulatePaperScan(e) {
        if (!e.target.files.length) return;

        const loader = document.getElementById('scan-loader');
        loader.classList.remove('hidden');

        // Simulate OCR extraction delay
        setTimeout(() => {
            loader.classList.add('hidden');

            // Add a mock digitized request
            const newReq = {
                id: Date.now(),
                lat: 28.6139 + (Math.random() - 0.5) * 0.05,
                lng: 77.2090 + (Math.random() - 0.5) * 0.05,
                category: 'Health',
                description: '[Digitized from Paper Form] Medical supplies and basic first aid kits requested for community camp.',
                urgency: 'Medium',
                status: 'Pending',
                timestamp: new Date().toISOString()
            };
            requests.unshift(newReq);

            // Show toast and redirect
            this.showToast("Paper form successfully digitized!", false);
            e.target.value = ''; // Reset file input
            this.showLoudAlert('Health');
        }, 2500);
    },

    // --- Details Modal ---
    openDetailsModal(id) {
        const req = requests.find(r => r.id === id);
        if (!req) return;

        document.getElementById('modal-category').textContent = this.t(req.category);
        document.getElementById('modal-desc').textContent = req.description;

        const timeAgo = Math.round((new Date() - new Date(req.timestamp)) / 60000); // mins
        document.getElementById('modal-time').textContent = timeAgo < 60 ? `${timeAgo} mins ago` : `${Math.floor(timeAgo / 60)} hours ago`;

        document.getElementById('modal-location').textContent = `Lat: ${req.lat.toFixed(4)}, Lng: ${req.lng.toFixed(4)}`;

        const urgencyEl = document.getElementById('modal-urgency');
        urgencyEl.textContent = this.t(req.urgency);
        urgencyEl.className = `badge ${req.urgency.toLowerCase()}`;

        const statusEl = document.getElementById('modal-status');
        statusEl.textContent = this.t(req.status);
        if (req.status === 'Resolved') {
            statusEl.className = 'badge outline text-green';
        } else {
            statusEl.className = 'badge outline text-muted';
        }

        const actionsEl = document.getElementById('modal-actions');
        if (req.status === 'Pending' && currentUserRole === 'ngo') {
            actionsEl.innerHTML = `<button class="btn btn-primary btn-block" onclick="app.resolveRequest(${req.id})"><span class="material-icons-round">check</span> Mark as Resolved</button>`;
        } else if (req.status === 'Resolved') {
            actionsEl.innerHTML = `<button class="btn btn-secondary btn-block" disabled><span class="material-icons-round text-green">check_circle</span> Case Closed</button>`;
        } else {
            actionsEl.innerHTML = `<p class="text-small text-center text-muted w-100">Only NGOs can mark requests as resolved.</p>`;
        }

        document.getElementById('details-modal').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('details-modal').classList.add('hidden');
    },

    resolveRequest(id) {
        const reqIndex = requests.findIndex(r => r.id === id);
        if (reqIndex > -1) {
            requests[reqIndex].status = 'Resolved';
            this.closeModal();
            // Refresh views if they are open
            if (!document.getElementById('dashboard-screen').classList.contains('hidden')) this.renderDashboard();
            if (!document.getElementById('ngo-panel').classList.contains('hidden')) this.renderNgoPanel();
            if (!document.getElementById('map-screen').classList.contains('hidden')) this.initOrUpdateMap();

            // Show toast
            this.showToast("Request marked as resolved!", false);
        }
    },

    // --- NGO Panel ---
    setNgoFilter(filter, btn) {
        currentNgoFilter = filter;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.renderNgoPanel();
    },

    renderNgoPanel() {
        const listContainer = document.getElementById('ngo-requests-list');
        const datasetView = document.getElementById('ngo-dataset-view');

        if (currentNgoFilter === 'Dataset') {
            listContainer.classList.add('hidden');
            datasetView.classList.remove('hidden');
            this.renderDatasetTable();
            return;
        }

        datasetView.classList.add('hidden');
        listContainer.classList.remove('hidden');
        listContainer.innerHTML = '';

        const filtered = requests.filter(r => r.status === currentNgoFilter);

        if (filtered.length === 0) {
            listContainer.innerHTML = `<p class="text-center text-muted mt-4">No ${currentNgoFilter.toLowerCase()} requests.</p>`;
            return;
        }

        filtered.forEach(req => {
            listContainer.appendChild(this.createRequestCard(req));
        });
    },

    renderDatasetTable() {
        const table = document.getElementById('dataset-table');
        let html = `<tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Location</th>
        </tr>`;

        requests.forEach(r => {
            html += `<tr>
                <td>#${r.id.toString().slice(-4)}</td>
                <td>${new Date(r.timestamp).toLocaleDateString()}</td>
                <td>${this.t(r.category)}</td>
                <td><span class="badge outline ${r.urgency.toLowerCase()}">${this.t(r.urgency)}</span></td>
                <td>${this.t(r.status)}</td>
                <td>${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}</td>
            </tr>`;
        });
        table.innerHTML = html;
    },

    downloadCSV() {
        let csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,Category,Urgency,Status,Lat,Lng,Description\n";
        requests.forEach(r => {
            const desc = `"${r.description.replace(/"/g, '""')}"`;
            csvContent += `${r.id},${r.timestamp},${r.category},${r.urgency},${r.status},${r.lat},${r.lng},${desc}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "community_data_hub_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // --- Impact Screen ---
    renderImpact() {
        const total = requests.length;
        const resolved = requests.filter(r => r.status === 'Resolved').length;
        const pct = total === 0 ? 0 : Math.round((resolved / total) * 100);

        // Estimate people helped (dummy logic: 5 per low, 10 per med, 20 per high)
        let helped = 0;
        requests.filter(r => r.status === 'Resolved').forEach(r => {
            if (r.urgency === 'High') helped += 20;
            if (r.urgency === 'Medium') helped += 10;
            if (r.urgency === 'Low') helped += 5;
        });

        // Animate counter
        this.animateValue('impact-percentage', 0, pct, 1000);
        this.animateValue('impact-people', 0, helped, 1500);

        // Render Chart
        const chartContainer = document.getElementById('impact-chart');
        chartContainer.innerHTML = '';

        const categories = ['Health', 'Food', 'Education', 'Shelter'];
        let maxCount = 0;
        const catData = categories.map(cat => {
            const count = requests.filter(r => r.category === cat).length;
            if (count > maxCount) maxCount = count;
            return { cat, count };
        });

        catData.forEach(data => {
            const width = maxCount === 0 ? 0 : (data.count / maxCount) * 100;
            chartContainer.innerHTML += `
                <div class="bar-row">
                    <div class="bar-label">${this.t(data.cat)}</div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width: 0%" data-target="${width}%"></div>
                    </div>
                    <div class="bar-value">${data.count}</div>
                </div>
            `;
        });

        // Trigger bar animation
        setTimeout(() => {
            document.querySelectorAll('.bar-fill').forEach(el => {
                el.style.width = el.getAttribute('data-target');
            });
        }, 100);
    },

    animateValue(id, start, end, duration) {
        if (start === end) {
            document.getElementById(id).textContent = end;
            return;
        }
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easing out
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            document.getElementById(id).textContent = Math.floor(easeOutProgress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    // --- Alerts ---
    checkAlerts() {
        const pendingHigh = requests.filter(r => r.urgency === 'High' && r.status === 'Pending').length;
        if (pendingHigh >= 2) {
            this.showLoudAlert('Multiple Areas');
        }
    },

    showLoudAlert(category) {
        document.getElementById('loud-alert-msg').textContent = `A new High Urgency ${category} case has been reported. Immediate action required.`;
        document.getElementById('loud-alert-modal').classList.remove('hidden');
    },

    showToast(message, isUrgent = true) {
        const toast = document.getElementById('alert-toast');
        const msgEl = document.getElementById('toast-message');
        const iconEl = toast.querySelector('.material-icons-round');
        const titleEl = toast.querySelector('strong');

        msgEl.textContent = message;

        if (isUrgent) {
            toast.style.borderLeftColor = 'var(--urgent-high)';
            iconEl.textContent = 'warning';
            iconEl.className = 'material-icons-round text-red';
            titleEl.textContent = 'Alert!';
        } else {
            toast.style.borderLeftColor = 'var(--urgent-low)';
            iconEl.textContent = 'check_circle';
            iconEl.className = 'material-icons-round text-green';
            titleEl.textContent = 'Success';
        }

        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
};

// Start logic
// Expose functions globally for HTML inline handlers
window.app = app;

// PWA Offline Events and Initialization
window.addEventListener('online', () => {
    const banner = document.getElementById('offline-banner');
    banner.classList.add('hidden');

    // Sync offline data
    const offlineQueue = JSON.parse(localStorage.getItem('offlineRequests') || '[]');
    if (offlineQueue.length > 0) {
        offlineQueue.forEach(req => {
            // Check if it's already in the local array to avoid duplicates
            if (!requests.some(r => r.id === req.id)) {
                requests.unshift(req);
            }
        });
        localStorage.setItem('offlineRequests', '[]');
        app.showToast(app.t('syncedRequests') || 'Synced offline requests successfully!', false);
        if (currentUserRole) {
            app.renderDashboard();
            if (!document.getElementById('ngo-panel').classList.contains('hidden')) app.renderNgoPanel();
        }
    }
});

window.addEventListener('offline', () => {
    const banner = document.getElementById('offline-banner');
    banner.classList.remove('hidden');
    app.showToast(app.t('offlineMode') || 'Offline Mode. Working locally.', true);
});

// Check initial status
if (!navigator.onLine) {
    document.getElementById('offline-banner').classList.remove('hidden');
}
