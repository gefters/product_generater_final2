// ====== تعريف العناصر من الـ DOM ======
const productForm = document.getElementById('productForm');
const productTitleInput = document.getElementById('productTitle');
const keyFeaturesInput = document.getElementById('keyFeatures');
const seoKeywordsInput = document.getElementById('seoKeywords'); // عنصر جديد للكلمات المفتاحية
const toneSelect = document.getElementById('tone');
const lengthSelect = document.getElementById('length');
const languageSelect = document.getElementById('language'); // لاختيار لغة الوصف للنموذج
const uiLanguageSelect = document.getElementById('uiLanguage'); // لاختيار لغة واجهة المستخدم

const loadingDiv = document.getElementById('loading');
const responseDiv = document.getElementById('response');
const descriptionText = document.getElementById('descriptionText');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const saveDescriptionBtn = document.getElementById('saveDescriptionBtn');
const descriptionsHistoryList = document.getElementById('descriptionsHistory');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// ====== قاموس الترجمات ======
const translations = {
    'ar': {
        'app_title': 'مولد وصف المنتج بالذكاء الاصطناعي', // عنوان التطبيق الرئيسي
        'product_title_label': 'عنوان المنتج:',
        'product_title_placeholder': 'مثال: ساعة ذكية رياضية',
        'key_features_label': 'الميزات الرئيسية (افصل بفاصلة):',
        'key_features_placeholder': 'مثال: مقاومة للماء، تتبع معدل ضربات القلب، بطارية تدوم 7 أيام',
        'seo_keywords_label': 'الكلمات المفتاحية المستهدفة (افصل بفاصلة):',
        'seo_keywords_placeholder': 'مثال: ساعة ذكية، لياقة بدنية، تتبع صحي',
        'tone_label': 'النبرة:',
        'tone_marketing': 'تسويقية',
        'tone_friendly': 'ودودة',
        'tone_formal': 'رسمية',
        'tone_humorous': 'فكاهية',
        'tone_informative': 'معلوماتية',
        'length_label': 'الطول:',
        'length_short': 'قصير',
        'length_medium': 'متوسط',
        'length_long': 'طويل',
        'description_language_label': 'لغة الوصف (للنموذج):',
        'lang_arabic': 'العربية',
        'lang_english': 'English',
        'lang_spanish': 'Español',
        'generate_button': 'توليد الوصف',
        'loading_message': 'جاري توليد الوصف...',
        'error_message_prefix': 'حدث خطأ: ',
        'error_no_input': 'الرجاء توفير عنوان المنتج والميزات الرئيسية.',
        'error_no_input_seo': 'الرجاء توفير عنوان المنتج، الميزات الرئيسية، والكلمات المفتاحية المستهدفة.',
        'generated_description_title': 'الوصف المولّد:',
        'save_button': 'حفظ الوصف',
        'history_title': 'تاريخ الأوصاف المحفوظة:',
        'no_history_message': 'لا توجد أوصاف محفوظة بعد.',
        'clear_history_button': 'مسح التاريخ',
        'saved_success_alert': 'تم حفظ الوصف بنجاح!',
        'save_failed_alert': 'فشل الحفظ:',
        'no_description_to_save_alert': 'لا يوجد وصف لحفظه!',
        'clear_confirm_alert': 'هل أنت متأكد أنك تريد مسح كل الأوصاف المحفوظة؟',
        'clear_success_alert': 'تم مسح التاريخ بنجاح!',
        'clear_failed_alert': 'فشل المسح:',
        'connection_error_alert': 'خطأ في الاتصال:',
        'server_connection_error': 'فشل الاتصال بالخادم: ',
        'check_server_running_message': 'يرجى التأكد من أن الخادم يعمل.',
        'server_error_message': 'حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً أو الاتصال بالدعم.',
        'quota_exceeded_error': 'تجاوزت حدود الاستخدام المجانية (Quota)! يرجى الانتظار بضع دقائق أو ساعة والمحاولة مرة أخرى. إذا كنت بحاجة لاستخدام أكبر، يمكنك تمكين الفوترة في Google Cloud.',
        'request_error_prefix': 'خطأ في الطلب: ',
        'unknown_error_prefix': 'حدث خطأ غير معروف: '
    },
    'en': {
        'app_title': 'AI Product Description Generator',
        'product_title_label': 'Product Title:',
        'product_title_placeholder': 'Example: Sport Smartwatch',
        'key_features_label': 'Key Features (comma-separated):',
        'key_features_placeholder': 'Example: Water-resistant, heart rate tracking, 7-day battery life',
        'seo_keywords_label': 'Target SEO Keywords (comma-separated):',
        'seo_keywords_placeholder': 'Example: smartwatch, fitness tracker, health monitoring',
        'tone_label': 'Tone:',
        'tone_marketing': 'Marketing',
        'tone_friendly': 'Friendly',
        'tone_formal': 'Formal',
        'tone_humorous': 'Humorous',
        'tone_informative': 'Informative',
        'length_label': 'Length:',
        'length_short': 'Short',
        'length_medium': 'Medium',
        'length_long': 'Long',
        'description_language_label': 'Description Language (for AI):',
        'lang_arabic': 'العربية',
        'lang_english': 'English',
        'lang_spanish': 'Español',
        'generate_button': 'Generate Description',
        'loading_message': 'Generating description...',
        'error_message_prefix': 'Error: ',
        'error_no_input': 'Please provide product title and key features.',
        'error_no_input_seo': 'Please provide product title, key features, and target SEO keywords.',
        'generated_description_title': 'Generated Description:',
        'save_button': 'Save Description',
        'history_title': 'Saved Descriptions History:',
        'no_history_message': 'No descriptions saved yet.',
        'clear_history_button': 'Clear History',
        'saved_success_alert': 'Description saved successfully!',
        'save_failed_alert': 'Save failed:',
        'no_description_to_save_alert': 'No description to save!',
        'clear_confirm_alert': 'Are you sure you want to clear all saved descriptions?',
        'clear_success_alert': 'History cleared successfully!',
        'clear_failed_alert': 'Clear failed:',
        'connection_error_alert': 'Connection error:',
        'server_connection_error': 'Failed to connect to server: ',
        'check_server_running_message': 'Please ensure the server is running.',
        'server_error_message': 'Internal server error. Please try again later or contact support.',
        'quota_exceeded_error': 'Quota Exceeded! Please wait a few minutes or an hour and try again. If you need more usage, you can enable billing in Google Cloud.',
        'request_error_prefix': 'Request error: ',
        'unknown_error_prefix': 'Unknown error: '
    }
};

// ====== دالة لتطبيق الترجمات على عناصر الواجهة ======
function applyTranslations(lang) {
    // تحديث عنوان التطبيق الرئيسي (h1)
    document.querySelector('h1').textContent = translations[lang]['app_title'];

    // تحديث جميع العناصر التي تحتوي على data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // لعناصر <input> و <textarea> ذات placeholder
            if (element.placeholder) {
                // استخدام مفاتيح placeholder المحددة
                if (key === 'product_title_label') {
                    element.placeholder = translations[lang]['product_title_placeholder'];
                } else if (key === 'key_features_label') {
                    element.placeholder = translations[lang]['key_features_placeholder'];
                } else if (key === 'seo_keywords_label') {
                    element.placeholder = translations[lang]['seo_keywords_placeholder'];
                } else {
                    // في حال لم يكن هناك placeholder محدد، استخدم النص العادي
                    element.textContent = translations[lang][key];
                }
            }
            // لبقية العناصر ذات المحتوى النصي
            else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // تحديث نصوص options في Selects التي ليست جزءاً من data-i18n
    // هذا الجزء يضمن ترجمة النصوص داخل الـ <option> tags
    const updateSelectOptions = (selectElement) => {
        for (let i = 0; i < selectElement.options.length; i++) {
            const optionKey = selectElement.options[i].getAttribute('data-i18n');
            if (optionKey && translations[lang] && translations[lang][optionKey]) {
                selectElement.options[i].textContent = translations[lang][optionKey];
            }
        }
    };

    updateSelectOptions(toneSelect);
    updateSelectOptions(lengthSelect);
    updateSelectOptions(languageSelect);
    updateSelectOptions(uiLanguageSelect); // تحديث خيارات لغة الواجهة نفسها

    // تحديث اتجاه النص للصفحة بناءً على اللغة
    document.documentElement.lang = lang; // تحديث سمة اللغة في <html>
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
        document.body.classList.remove('ltr');
    } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.add('ltr');
        document.body.classList.remove('rtl');
    }
}

// ====== دالة لتحميل وعرض تاريخ الأوصاف ======
async function loadHistory() {
    try {
        const response = await fetch('/get-history');
        if (response.ok) {
            const history = await response.json();
            descriptionsHistoryList.innerHTML = ''; // مسح التاريخ الحالي

            if (history.history.length > 0) { // تأكد من الوصول إلى history.history
                clearHistoryBtn.classList.remove('hidden'); // إظهار زر المسح
                history.history.forEach(item => { // تأكد من التكرار على history.history
                    const listItem = document.createElement('li');
                    // عرض الكلمات المفتاحية المحفوظة أيضاً
                    listItem.innerHTML = `<strong>${item.product_title}</strong><br>
                                          <small>${translations[uiLanguageSelect.value]['key_features_label'].replace(':', '')}: ${item.key_features || 'N/A'}</small><br>
                                          <small>${translations[uiLanguageSelect.value]['seo_keywords_label'].replace(':', '')}: ${item.seo_keywords || 'N/A'}</small><br>
                                          ${item.description}<br>
                                          <small>${item.timestamp} - ${item.language || 'N/A'}</small>`;
                    descriptionsHistoryList.appendChild(listItem);
                });
            } else {
                descriptionsHistoryList.innerHTML = `<li>${translations[uiLanguageSelect.value]['no_history_message']}</li>`;
                clearHistoryBtn.classList.add('hidden'); // إخفاء زر المسح
            }
        } else {
            console.error('Failed to load history:', response.statusText);
            descriptionsHistoryList.innerHTML = `<li>${translations[uiLanguageSelect.value]['connection_error_alert']} ${response.statusText}</li>`;
        }
    } catch (error) {
        console.error('Network error loading history:', error);
        descriptionsHistoryList.innerHTML = `<li>${translations[uiLanguageSelect.value]['server_connection_error']} ${error.message}</li>`;
    }
}

// ====== تنفيذ الكود بعد تحميل DOM بالكامل ======
document.addEventListener('DOMContentLoaded', () => {
    // تعيين اللغة الافتراضية عند التحميل
    const savedUiLanguage = localStorage.getItem('uiLanguage') || 'ar'; // الافتراضي هو العربية
    uiLanguageSelect.value = savedUiLanguage;
    applyTranslations(savedUiLanguage);

    // تحميل التاريخ عند تحميل الصفحة
    loadHistory();

    // مستمع حدث لتغيير لغة الواجهة
    uiLanguageSelect.addEventListener('change', (event) => {
        const newLang = event.target.value;
        localStorage.setItem('uiLanguage', newLang); // حفظ اختيار المستخدم
        applyTranslations(newLang);
        loadHistory(); // إعادة تحميل التاريخ لضمان ترجمة عناوين الأوصاف المحفوظة
    });

    // مستمع حدث لنموذج توليد الوصف
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // منع إرسال النموذج بالطريقة التقليدية (التي تسبب تحديث الصفحة)

        // إخفاء الرسائل السابقة وإظهار مؤشر التحميل
        responseDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        loadingDiv.querySelector('p').textContent = translations[uiLanguageSelect.value]['loading_message']; // ترجمة رسالة التحميل

        const productTitle = productTitleInput.value;
        const keyFeatures = keyFeaturesInput.value;
        const seoKeywords = seoKeywordsInput.value; // جلب قيمة الكلمات المفتاحية
        const selectedTone = toneSelect.value;
        const selectedLength = lengthSelect.value;
        const selectedLanguage = languageSelect.value;

        if (!productTitle || !keyFeatures || !seoKeywords) {
            loadingDiv.classList.add('hidden');
            errorMessage.textContent = translations[uiLanguageSelect.value]['error_no_input_seo']; // رسالة خطأ مع SEO
            errorDiv.classList.remove('hidden');
            return;
        }

        try {
            const apiResponse = await fetch('/generate-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_title: productTitle,
                    key_features: keyFeatures,
                    seo_keywords: seoKeywords, // إرسال الكلمات المفتاحية إلى الخادم
                    tone: selectedTone,
                    length: selectedLength,
                    language: selectedLanguage
                })
            });

            loadingDiv.classList.add('hidden');

            if (apiResponse.ok) { // إذا كان الرد ناجحاً (رمز 200)
                const data = await apiResponse.json();
                descriptionText.textContent = data.description;
                responseDiv.classList.remove('hidden');
                saveDescriptionBtn.classList.remove('hidden'); // إظهار زر الحفظ
            } else { // إذا كان الرد فيه خطأ (مثل 400, 429, 500)
                const errorData = await apiResponse.json();
                let displayMessage = translations[uiLanguageSelect.value]['unknown_error_prefix'] + apiResponse.statusText;

                if (apiResponse.status === 429) {
                    displayMessage = translations[uiLanguageSelect.value]['quota_exceeded_error'];
                } else if (apiResponse.status === 400 && errorData.error) {
                    displayMessage = translations[uiLanguageSelect.value]['request_error_prefix'] + errorData.error;
                } else if (apiResponse.status === 500) {
                    displayMessage = translations[uiLanguageSelect.value]['server_error_message'];
                } else if (errorData.error) {
                    displayMessage = translations[uiLanguageSelect.value]['error_message_prefix'] + errorData.error;
                }

                errorMessage.textContent = displayMessage;
                errorDiv.classList.remove('hidden');
                saveDescriptionBtn.classList.add('hidden'); // إخفاء زر الحفظ عند الخطأ
            }
        } catch (networkError) { // إذا كان هناك خطأ في الاتصال بالخادم
            loadingDiv.classList.add('hidden');
            errorMessage.textContent = translations[uiLanguageSelect.value]['server_connection_error'] + networkError.message + '. ' + translations[uiLanguageSelect.value]['check_server_running_message'];
            errorDiv.classList.remove('hidden');
            saveDescriptionBtn.classList.add('hidden'); // إخفاء زر الحفظ عند الخطأ
        }
    });

    // مستمع حدث لزر حفظ الوصف
    saveDescriptionBtn.addEventListener('click', async () => {
        const descriptionToSave = descriptionText.textContent;
        const productTitleForSave = productTitleInput.value;
        const keyFeaturesForSave = keyFeaturesInput.value;
        const seoKeywordsForSave = seoKeywordsInput.value; // حفظ الكلمات المفتاحية
        const toneForSave = toneSelect.value;
        const lengthForSave = lengthSelect.value;
        const languageForSave = languageSelect.value;

        if (!descriptionToSave) {
            alert(translations[uiLanguageSelect.value]['no_description_to_save_alert']);
            return;
        }

        try {
            const response = await fetch('/save-description', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: descriptionToSave,
                    product_title: productTitleForSave,
                    key_features: keyFeaturesForSave,
                    seo_keywords: seoKeywordsForSave, // إرسال الكلمات المفتاحية للحفظ
                    tone: toneForSave,
                    length: lengthForSave,
                    language: languageForSave
                })
            });

            if (response.ok) {
                alert(translations[uiLanguageSelect.value]['saved_success_alert']);
                loadHistory(); // إعادة تحميل التاريخ بعد الحفظ
            } else {
                const errorData = await response.json();
                alert(`${translations[uiLanguageSelect.value]['save_failed_alert']} ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            alert(`${translations[uiLanguageSelect.value]['connection_error_alert']} ${error.message}`);
        }
    });

    // مستمع حدث لزر مسح التاريخ
    clearHistoryBtn.addEventListener('click', async () => {
        if (confirm(translations[uiLanguageSelect.value]['clear_confirm_alert'])) {
            try {
                const response = await fetch('/clear-history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    alert(translations[uiLanguageSelect.value]['clear_success_alert']);
                    loadHistory(); // إعادة تحميل التاريخ بعد المسح
                } else {
                    const errorData = await response.json();
                    alert(`${translations[uiLanguageSelect.value]['clear_failed_alert']} ${errorData.error || response.statusText}`);
                }
            } catch (error) {
                alert(`${translations[uiLanguageSelect.value]['connection_error_alert']} ${error.message}`);
            }
        }
    });
});