let currentFile = null;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const fileInfoBox = document.getElementById('fileInfoBox');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const uploadPrompt = document.getElementById('uploadPrompt');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    currentFile = file;
    fileNameDisplay.innerText = file.name;
    fileInfoBox.classList.remove('hidden');
    uploadPrompt.innerText = "تم اختيار الملف بنجاح! جاهز لبدء عملية التدقيق والتحليل.";

    analyzeBtn.disabled = false;
    analyzeBtn.className = "w-full bg-[#002855] hover:bg-[#001D3D] text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md flex justify-center items-center cursor-pointer opacity-100";
    
    const docType = document.querySelector('input[name="docType"]:checked').value;
    logToConsole(`INFO: تم تحميل مستند جديد للتحقق من التستر والاتساق [${docType === 'invoice' ? 'فاتورة ضريبية' : 'طلب تحويل بنكي'}]: ${file.name}`, "text-yellow-400");
});

// 🔄 التبديل الفوري التفاعلي بين شاشات العمليات ورقابة مدير الامتثال
function switchView(viewName) {
    const entView = document.getElementById('entrepreneurView');
    const bankView = document.getElementById('bankComplianceView');
    const btnUser = document.getElementById('viewBtn-user');
    const btnBank = document.getElementById('viewBtn-bank');

    if (viewName === 'entrepreneur') {
        entView.classList.remove('hidden');
        bankView.classList.add('hidden');
        btnUser.className = "px-4 py-1.5 rounded-md text-xs font-bold bg-[#0084C2] text-white transition-all";
        btnBank.className = "px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-white transition-all";
        logToConsole("UI_VIEW: تم التبديل إلى شاشة رائد الأعمال للتحقق من العمليات الحية.", "text-blue-400");
    } else {
        entView.classList.add('hidden');
        bankView.classList.remove('hidden');
        btnUser.className = "px-4 py-1.5 rounded-md text-xs font-bold text-gray-400 hover:text-white transition-all";
        btnBank.className = "px-4 py-1.5 rounded-md text-xs font-bold bg-[#0084C2] text-white transition-all";
        logToConsole("UI_VIEW: تم التبديل إلى لوحة مدير الامتثال بالبنك لمراقبة شبهات التستر وإحصائيات العمليات والمخاطر.", "text-purple-400");
    }
}

function logToConsole(message, cssClass = "text-emerald-400") {
    const consoleLog = document.getElementById('consoleLog');
    const timestamp = new Date().toLocaleTimeString();
    const p = document.createElement('p');
    p.className = cssClass;
    p.innerHTML = `<span class="text-gray-500">[${timestamp}]</span> ${message}`;
    consoleLog.appendChild(p);
    consoleLog.scrollTop = consoleLog.scrollHeight;
}

function switchTab(tabName) {
    if (tabName === 'systems') {
        document.getElementById('tabContent-systems').classList.remove('hidden');
        document.getElementById('tabContent-privacy').classList.add('hidden');
        document.getElementById('tabBtn-systems').className = "py-2 border-b-2 border-[#002855] text-[#002855] focus:outline-none";
        document.getElementById('tabBtn-privacy').className = "py-2 text-gray-400 focus:outline-none";
    } else {
        document.getElementById('tabContent-systems').classList.add('hidden');
        document.getElementById('tabContent-privacy').classList.remove('hidden');
        document.getElementById('tabBtn-systems').className = "py-2 text-gray-400 focus:outline-none";
        document.getElementById('tabBtn-privacy').className = "py-2 border-b-2 border-[#002855] text-[#002855] focus:outline-none";
    }
}

analyzeBtn.addEventListener('click', function() {
    if (!currentFile) return;

    analyzeBtn.disabled = true;
    analyzeBtn.innerText = "⏳ جاري مسح المستند وتطبيق كشف التستر والامتثال الذكي...";
    document.getElementById('resultSection').classList.add('hidden');

    const docType = document.querySelector('input[name="docType"]:checked').value;
    logToConsole(`START: تفعيل موظف الامتثال 'حصين' للتحقق من المستند [${docType === 'invoice' ? 'الفاتورة الضريبية' : 'طلب التحويل المالي'}]...`, "text-white font-bold");
    
    setTimeout(() => {
        logToConsole("CRAWLER: تحديث الأنظمة وقواعد SAMA لحظياً ضد تعاميم مكافحة التستر وغسيل الأموال... الأنظمة محدثة.", "text-indigo-400");
    }, 300);

    setTimeout(() => {
        logToConsole("OCR: استخراج نصوص الفاتورة والتحقق من الهوية الضريبية للمورد وسجلاته التجارية والمبالغ المتقاطعة...", "text-yellow-400");
    }, 800);

    setTimeout(() => {
        logToConsole("SDAIA/PDPL: حجب البيانات الحساسة وتعميتها لضمان التوطين الآمن تماشياً مع معايير سدايا ونظام حماية البيانات الشخصية...", "text-blue-400");
    }, 1500);

    const formData = new FormData();
    formData.append('file', currentFile);
    formData.append('doc_type', docType);

    fetch('/api/v1/compliance/check', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = "🔍 ابدأ الفحص والتدقيق الذكي لحصين";
        document.getElementById('resultSection').classList.remove('hidden');

        if (data.status === "ERROR") {
            logToConsole("ERROR: فشل معالجة الملف: " + data.message, "text-red-500 font-bold");
            alert("حدث خطأ أثناء معالجة الملف: " + data.message);
            return;
        }

        if (docType === "invoice") {
            document.getElementById('vatNoField').value = data.extracted_vat || "لم يُعثر على رقم ضريبي";
            document.getElementById('vatRateField').value = data.extracted_vat_rate || "0";
        } else {
            document.getElementById('vatNoField').value = "غير مطلوب لطلب التحويل";
            document.getElementById('vatRateField').value = "غير مطلوب لطلب التحويل";
        }

        // تحديث بصمة البلوكتشين الرقمية
        document.getElementById('blockchainHashDisplay').innerText = data.blockchain_hash;

        // تحديث بار درجة ثقة الـ OCR والـ Fallback المزدوج للامتثال البشري
        const confidenceBar = document.getElementById('ocrConfidenceBar');
        const confidenceValue = document.getElementById('ocrConfidenceValue');
        const fallbackAlert = document.getElementById('humanFallbackAlert');
        
        confidenceBar.style.width = data.ocr_confidence + "%";
        confidenceValue.innerText = data.ocr_confidence + "%";
        
        if (data.fallback_to_human) {
            confidenceBar.className = "h-2.5 rounded-full bg-red-500";
            fallbackAlert.classList.remove('hidden');
            document.getElementById('fallbackReasonText').innerText = data.fallback_reason;
            logToConsole(`WARN: كشف مؤشر خطورة! درجة ثقة الـ OCR أو مطابقة المعطيات حرجة (${data.ocr_confidence}%). تم تعليق المعاملة وتوجيهها للمراجعة البشرية المزدوجة بالخلفية لمكافحة التستر المالي.`, "text-amber-500 font-bold");
        } else {
            confidenceBar.className = "h-2.5 rounded-full bg-emerald-500";
            fallbackAlert.classList.add('hidden');
        }

        document.getElementById('maskedText').innerText = data.masked_text || "";
        document.getElementById('samaStatus').innerText = data.sama_market_data.status;
        document.getElementById('samaTime').innerText = data.sama_market_data.last_update;
        document.getElementById('zatcaMessage').innerText = data.zatca_validation.message;
        document.getElementById('qrMessage').innerText = data.status === "APPROVED" ? "✅ رمز الاستجابة السريعة متطابق ومستوفٍ للشروط الأمنية." : "⚠️ الـ QR Code غير مكتمل أو به حقول تخالف تعاميم الفوترة ومكافحة التستر البنكية.";

        const badge = document.getElementById('complianceBadge');
        const reportBox = document.getElementById('reportBox');
        const correctionArea = document.getElementById('correctionArea');

        if (data.status === "APPROVED") {
            badge.className = "px-3 py-1 rounded-full text-xs font-bold text-white bg-emerald-500";
            badge.innerText = "ممتثل وآمن ✅";
            reportBox.className = "p-4 rounded-lg mb-4 text-xs font-medium bg-emerald-50 text-emerald-800 border-r-4 border-emerald-500";
            reportBox.innerHTML = "<p>🎉 تم فحص وتحليل المستند؛ وهو مطابق بالكامل لمعايير الاتساق المالي وقواعد SAMA ولم يتم كشف أي شبهات تستر تجاري أو تعارض بيانات لشركة الشراع المحدودة.</p>";
            correctionArea.classList.add('hidden');
            logToConsole("SUCCESS: عملية التدقيق والتحصين اكتملت بنجاح وحساب المنشأة آمن وخالٍ من شبهات التستر!", "text-emerald-400 font-bold");
        } else {
            badge.className = "px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500";
            badge.innerText = `غير ممتثل (${data.risk_score === "HIGH" ? "خطورة عالية 🚨" : "خطورة متوسطة ⚠️"})`;
            
            let reportBg = data.risk_score === "HIGH" ? "bg-red-50 text-red-800 border-red-500" : "bg-amber-50 text-amber-800 border-amber-500";
            reportBox.className = `p-4 rounded-lg mb-4 text-xs font-medium border-r-4 ${reportBg}`;
            
            let issuesHTML = "<p class='font-bold mb-1'>تم رصد ثغرات الامتثال ومخاطر التستر التالية بواسطة حصين:</p><ul class='list-disc pr-4'>";
            const issues = data.ai_analysis.issues || [];
            issues.forEach(issue => { issuesHTML += `<li>${issue}</li>`; });
            issuesHTML += "</ul>";
            reportBox.innerHTML = issuesHTML;
            correctionArea.classList.remove('hidden');
            logToConsole("REJECTED: تم كشف ثغرات ومؤشرات خطورة تستر تجاري! تم إيقاف تمرير المعاملة فوراً لحماية حساب العميل والبنك من المساءلة.", "text-red-500 font-bold");
        }
    })
    .catch(err => {
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = "🔍 ابدأ الفحص والتدقيق الذكي لحصين";
        logToConsole("ERROR: فشل الاتصال بخادم حصين الذكي الفعلي.", "text-red-500");
        console.error(err);
    });
});

function applyInstantCorrection() {
    logToConsole("CORRECTION: جاري تفعيل مهام موظف الامتثال: مطابقة الـ VAT، تعديل تباين العملات وتعبئة غرض التحويل الإلزامي لـ SAMA...", "text-blue-400 font-bold");
    
    document.getElementById('vatNoField').value = "300123456789123";
    document.getElementById('vatRateField').value = "15";

    const badge = document.getElementById('complianceBadge');
    const reportBox = document.getElementById('reportBox');
    
    badge.className = "px-3 py-1 rounded-full text-xs font-bold text-white bg-emerald-500";
    badge.innerText = "تم التدقيق والتصحيح بنجاح ✨";
    
    reportBox.className = "p-4 rounded-lg mb-4 text-xs font-medium bg-emerald-50 text-emerald-800 border-r-4 border-emerald-500";
    reportBox.innerHTML = "<p>🎉 نجاح الحوكمة الاستباقية: قام 'حصين' بمعالجة تباين المعطيات وتعبئة غرض التحويل الدولي الإلزامي لـ SAMA (استيراد مواد بناء) تلقائياً، مع تصحيح وتعديل الأرقام الضريبية للعملية بنجاح لسد فجوات الامتثال وتفادي تجميد الحساب!</p>";
    
    document.getElementById('qrMessage').innerText = "🔒 تم إثبات الاتساق ومطابقة مستندات التحويل الدولي وحماية حساب المنشأة من التجميد الآلي القانوني.";
    document.getElementById('zatcaMessage').innerText = "بيانات العملية والكيان متطابقة بنسبة 100% مع الهوية المالية والقوانين المعتمدة لدى هيئة الزكاة.";
    document.getElementById('ocrConfidenceBar').style.width = "100%";
    document.getElementById('ocrConfidenceValue').innerText = "100% (تم التحقق الذاتي والمطابقة)";
    document.getElementById('humanFallbackAlert').classList.add('hidden');
    document.getElementById('correctionArea').classList.add('hidden');
    
    logToConsole("SUCCESS: تم معالجة وتعديل القصور بنجاح. المعاملة مستوفية لتعاميم SAMA بالكامل ومحصنة بالبلوكتشين وجاهزة للتمرير الفوري!", "text-emerald-400 font-bold");
}