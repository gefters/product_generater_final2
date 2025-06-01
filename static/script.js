// static/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // **********************************************
    // 1. تعريف المتغيرات والعناصر من الـ DOM
    // **********************************************
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const uiLanguageSelect = document.getElementById('uiLanguage');
    const productForm = document.getElementById('productForm');
    const productTitleInput = document.getElementById('productTitle');
    const keyFeaturesTextarea = document.getElementById('keyFeatures');
    const seoKeywordsInput = document.getElementById('seoKeywords');
    const toneSelect = document.getElementById('tone');
    const lengthSelect = document.getElementById('length');
    const languageSelect = document.getElementById('language');

    const loadingSection = document.getElementById('loading');
    const errorSection = document.getElementById('error');
    const errorMessageElement = document.getElementById('errorMessage');
    const responseSection = document.getElementById('response');
    const descriptionTextarea = document.getElementById('descriptionText');
    const copyDescriptionBtn = document.getElementById('copyDescriptionBtn');
    const saveDescriptionBtn = document.getElementById('saveDescriptionBtn');
    const generateNewBtn = document.getElementById('generateNewBtn'); // الزر الجديد لتوليد وصف جديد

    const descriptionsHistoryList = document.getElementById('descriptionsHistory');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // لترجمة الواجهة
    const translations = {
        ar: {
            toggle_theme: "الوضع الداكن",
            ui_language_label: "لغة الواجهة:",
            product_title_label: "عنوان المنتج:",
            key_features_label: "الميزات الرئيسية (لكل ميزة سطر جديد):", // تم تعديل الوصف
            seo_keywords_label: "الكلمات المفتاحية المستهدفة (افصل بفاصلة):",
            tone_label: "النبرة:",
            tone_marketing: "تسويقية",
            tone_friendly: "ودودة",
            tone_formal: "رسمية",
            tone_humorous: "فكاهية",
            tone_informative: "معلوماتية",
            length_label: "الطول:",
            length_short: "قصير",
            length_medium: "متوسط",
            length_long: "طويل",
            description_language_label: "لغة الوصف (للنموذج):",
            lang_arabic: "العربية",
            lang_english: "English",
            lang_spanish: "Español",
            generate_button: "توليد الوصف",
            loading_message: "جاري توليد الوصف...",
            generated_description_title: "الوصف المولّد:",
            copy_button: "نسخ الوصف",
            save_button: "حفظ الوصف",
            generate_new_button: "توليد وصف جديد", // ترجمة الزر الجديد
            history_title: "تاريخ الأوصاف المحفوظة:",
            no_history_message: "لا توجد أوصاف محفوظة بعد.",
            clear_history_button: "مسح التاريخ",
            copy_success: "تم نسخ الوصف بنجاح!",
            copy_fail: "فشل النسخ: ",
            save_success: "تم حفظ الوصف بنجاح!",
            clear_history_confirm: "هل أنت متأكد أنك تريد مسح كل الأوصاف المحفوظة؟",
            delete_item_confirm: "هل أنت متأكد أنك تريد حذف هذا الوصف؟",
            // رسائل الأخطاء
            fetch_error: "حدث خطأ أثناء الاتصال بالخادم: ",
            api_error: "خطأ من الخادم: ",
            empty_history: "لا توجد أوصاف محفوظة بعد.",
        },
        en: {
            toggle_theme: "Dark Mode",
            ui_language_label: "UI Language:",
            product_title_label: "Product Title:",
            key_features_label: "Key Features (one per line):", // تم تعديل الوصف
            seo_keywords_label: "Target SEO Keywords (comma-separated):",
            tone_label: "Tone:",
            tone_marketing: "Marketing",
            tone_friendly: "Friendly",
            tone_formal: "Formal",
            tone_humorous: "Humorous",
            tone_informative: "Informative",
            length_label: "Length:",
            length_short: "Short",
            length_medium: "Medium",
            length_long: "Long",
            description_language_label: "Description Language (for model):",
            lang_arabic: "Arabic",
            lang_english: "English",
            lang_spanish: "Español",
            generate_button: "Generate Description",
            loading_message: "Generating description...",
            generated_description_title: "Generated Description:",
            copy_button: "Copy Description",
            save_button: "Save Description",
            generate_new_button: "Generate New Description", // ترجمة الزر الجديد
            history_title: "Saved Descriptions History:",
            no_history_message: "No saved descriptions yet.",
            clear_history_button: "Clear History",
            copy_success: "Description copied successfully!",
            copy_fail: "Failed to copy: ",
            save_success: "Description saved successfully!",
            clear_history_confirm: "Are you sure you want to clear all saved descriptions?",
            delete_item_confirm: "Are you sure you want to delete this description?",
            // Error messages
            fetch_error: "Error connecting to server: ",
            api_error: "Server error: ",
            empty_history: "No saved descriptions yet.",
        }
    };

    let currentLanguage = localStorage.getItem('uiLanguage') || 'ar'; // اللغة الافتراضية

    // **********************************************
    // 2. وظائف مساعدة
    // **********************************************

    // وظيفة لتطبيق الترجمة
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLanguage][key]) {
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.placeholder = translations[currentLanguage][key];
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translations[currentLanguage][key];
                }
                else {
                    el.textContent = translations[currentLanguage][key];
                }
            }
        });

        // تحديث نص زر تبديل الوضع الداكن بشكل خاص إذا كان الوضع نشطًا
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = currentLanguage === 'ar' ? 'الوضع الفاتح' : 'Light Mode';
        } else {
            themeToggleBtn.textContent = currentLanguage === 'ar' ? 'الوضع الداكن' : 'Dark Mode';
        }

        // تحديث اتجاه الصفحة (RTL/LTR) بناءً على اللغة
        if (currentLanguage === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', 'en');
        }
    }

    // وظيفة لتبديل الوضع الداكن/الفاتح
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        // تحديث نص الزر فورًا بعد التبديل
        themeToggleBtn.textContent = isDarkMode
            ? (currentLanguage === 'ar' ? 'الوضع الفاتح' : 'Light Mode')
            : (currentLanguage === 'ar' ? 'الوضع الداكن' : 'Dark Mode');
    }

    // وظيفة لعرض رسالة خطأ
    function showError(message) {
        errorSection.classList.remove('hidden');
        errorMessageElement.textContent = message;
        loadingSection.classList.add('hidden'); // إخفاء التحميل
        responseSection.classList.add('hidden'); // إخفاء النتائج
        errorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // وظيفة لإخفاء جميع الرسائل
    function hideMessages() {
        loadingSection.classList.add('hidden');
        errorSection.classList.add('hidden');
        responseSection.classList.add('hidden');
    }

    // وظيفة لعرض سجل الأوصاف
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem('descriptionHistory')) || [];
        descriptionsHistoryList.innerHTML = ''; // مسح القائمة الحالية

        if (history.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = `<span data-i18n="no_history_message">${translations[currentLanguage].no_history_message}</span>`;
            descriptionsHistoryList.appendChild(li);
            clearHistoryBtn.classList.add('hidden');
        } else {
            history.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.title}</strong>
                    <p>${item.description.substring(0, 150)}...</p> <small>${new Date(item.timestamp).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</small>
                    <button class="btn btn-danger delete-history-item-btn" data-index="${index}">
                        ${currentLanguage === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                `;
                li.addEventListener('click', (e) => {
                    // إذا لم يتم النقر على زر الحذف، اعرض الوصف الكامل
                    if (!e.target.classList.contains('delete-history-item-btn')) {
                        descriptionTextarea.value = item.description;
                        responseSection.classList.remove('hidden');
                        responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
                descriptionsHistoryList.appendChild(li);
            });
            clearHistoryBtn.classList.remove('hidden');
        }
    }

    // **********************************************
    // 3. معالجة الأحداث
    // **********************************************

    // تبديل الوضع الداكن/الفاتح عند النقر على الزر
    themeToggleBtn.addEventListener('click', toggleTheme);

    // تغيير لغة الواجهة
    uiLanguageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        localStorage.setItem('uiLanguage', currentLanguage);
        applyTranslations();
        displayHistory(); // إعادة عرض التاريخ باللغة الجديدة
    });

    // إرسال النموذج لتوليد الوصف
    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        hideMessages(); // إخفاء أي رسائل سابقة
        loadingSection.classList.remove('hidden'); // إظهار رسالة التحميل

        const productName = productTitleInput.value;
        const keyFeatures = keyFeaturesTextarea.value; // ستبقى مفصولة بأسطر جديدة
        const seoKeywords = seoKeywordsInput.value;
        const tone = toneSelect.value;
        const length = lengthSelect.value;
        const descriptionLanguage = languageSelect.value;

        const formData = {
            product_title: productName,
            key_features: keyFeatures,
            seo_keywords: seoKeywords,
            tone: tone,
            length: length,
            language: descriptionLanguage
        };

        try {
            const response = await fetch('/generate-description',{ // نقطة نهاية Flask
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // إذا كان هناك خطأ من الخادم (مثلاً 400, 500)
                const errorData = await response.json();
                throw new Error(errorData.error || translations[currentLanguage].api_error + response.status);
            }

            const data = await response.json();
            descriptionTextarea.value = data.description; // تعيين الوصف المولّد

            loadingSection.classList.add('hidden'); // إخفاء التحميل
            responseSection.classList.remove('hidden'); // إظهار قسم النتائج

            // تمرير الشاشة إلى قسم النتائج بلطف
            responseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // إظهار أزرار النسخ والحفظ
            copyDescriptionBtn.classList.remove('hidden');
            saveDescriptionBtn.classList.remove('hidden');
            generateNewBtn.classList.remove('hidden');

        } catch (error) {
            console.error('Fetch error:', error);
            showError(translations[currentLanguage].fetch_error + error.message);
        }
    });

    // نسخ الوصف
    copyDescriptionBtn.addEventListener('click', function() {
        descriptionTextarea.select(); // تحديد النص في textarea
        descriptionTextarea.setSelectionRange(0, 99999); // لدعم الجوالات
        navigator.clipboard.writeText(descriptionTextarea.value)
            .then(() => {
                alert(translations[currentLanguage].copy_success);
            })
            .catch(err => {
                console.error(translations[currentLanguage].copy_fail, err);
                alert(translations[currentLanguage].copy_fail + err);
            });
    });

    // حفظ الوصف في التاريخ
    saveDescriptionBtn.addEventListener('click', function() {
        const history = JSON.parse(localStorage.getItem('descriptionHistory')) || [];
        const newDescription = {
            title: productTitleInput.value,
            description: descriptionTextarea.value,
            timestamp: new Date().toISOString()
        };
        history.push(newDescription);
        localStorage.setItem('descriptionHistory', JSON.stringify(history));
        displayHistory(); // إعادة عرض التاريخ
        alert(translations[currentLanguage].save_success);
    });

    // توليد وصف جديد (إعادة تعيين النموذج)
    generateNewBtn.addEventListener('click', function() {
        productForm.reset(); // إعادة تعيين جميع حقول النموذج
        hideMessages(); // إخفاء جميع الأقسام (نتائج، تحميل، خطأ)
        // إخفاء أزرار النسخ والحفظ حتى يتم توليد وصف جديد
        copyDescriptionBtn.classList.add('hidden');
        saveDescriptionBtn.classList.add('hidden');
        generateNewBtn.classList.add('hidden');
        productTitleInput.focus(); // إعادة التركيز على أول حقل
    });

    // مسح كل الأوصاف المحفوظة
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm(translations[currentLanguage].clear_history_confirm)) {
            localStorage.removeItem('descriptionHistory');
            displayHistory();
        }
    });

    // حذف عنصر واحد من التاريخ (معتمدين على delegation)
    descriptionsHistoryList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-history-item-btn')) {
            const indexToDelete = parseInt(event.target.dataset.index);
            if (confirm(translations[currentLanguage].delete_item_confirm)) {
                let history = JSON.parse(localStorage.getItem('descriptionHistory')) || [];
                history.splice(indexToDelete, 1); // حذف العنصر من المصفوفة
                localStorage.setItem('descriptionHistory', JSON.stringify(history));
                displayHistory(); // إعادة عرض التاريخ بعد الحذف
            }
        }
    });


    // **********************************************
    // 4. التهيئة عند تحميل الصفحة
    // **********************************************

    // تطبيق الوضع الداكن إذا كان محفوظًا
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = currentLanguage === 'ar' ? 'الوضع الفاتح' : 'Light Mode';
    } else {
        themeToggleBtn.textContent = currentLanguage === 'ar' ? 'الوضع الداكن' : 'Dark Mode';
    }

    // تعيين لغة الواجهة المحفوظة وتطبيق الترجمة
    uiLanguageSelect.value = currentLanguage;
    applyTranslations();

    // عرض سجل الأوصاف عند تحميل الصفحة
    displayHistory();
});