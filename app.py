from dotenv import load_dotenv # استيراد دالة تحميل المتغيرات
load_dotenv() # تحميل متغيرات البيئة من ملف .env
import datetime
import json
import os
import google.generativeai as genai

from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

model = genai.GenerativeModel('gemini-1.5-flash-latest')

DESCRIPTIONS_FILE = 'descriptions.json'

def load_descriptions():
    if os.path.exists(DESCRIPTIONS_FILE):
        with open(DESCRIPTIONS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            if not content:
                return []
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                print(f"Warning: {DESCRIPTIONS_FILE} is corrupted or empty. Returning empty list.")
                return []
    return []

def save_descriptions_to_file(descriptions):
    with open(DESCRIPTIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(descriptions, f, indent=4, ensure_ascii=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-description', methods=['POST'])
def generate_description():
    data = request.json
    product_title = data.get('product_title')
    key_features = data.get('key_features')
    seo_keywords = data.get('seo_keywords') # <--- جلب الكلمات المفتاحية
    tone = data.get('tone', 'marketing')
    length = data.get('length', 'medium')
    language = data.get('language', 'arabic')

    if not product_title or not key_features or not seo_keywords: # <--- إضافة التحقق
        return jsonify({"error": "الرجاء توفير عنوان المنتج والميزات الرئيسية والكلمات المفتاحية المستهدفة."}), 400

    language_instruction = ""
    if language == "arabic":
        language_instruction = "باللغة العربية الفصحى."
    elif language == "english":
        language_instruction = "in English."
    elif language == "spanish":
        language_instruction = "en Español."

    prompt = f"""
    أنت خبير تسويق إبداعي وتحسين محركات البحث (SEO)، ولديك معرفة عميقة بما يجعل وصف المنتج مقنعًا ويحقق المبيعات ويحتل مراتب متقدمة في نتائج البحث.
    مهمتك هي كتابة وصف تسويقي مفصل وجذاب ومحسن لمحركات البحث (SEO) لمنتج معين {language_instruction}.
    يجب أن يأخذ الوصف في الاعتبار النقاط التالية بدقة كاملة:

    1.  **استهدف العميل المثالي:**
        * تحدث مباشرة وشخصيًا إلى الجمهور المستهدف.
        * استخدم لغة ومفردات تتناسب مع العميل المثالي (توقع ما قد يسألون عنه).
        * اجعل العميل يشعر بالاندماج باستخدام كلمة "أنت" في اللغة العربية، أو "you" في الإنجليزية، أو "usted/tú" في الإسبانية.
        * تصور العميل المثالي وتفضيلاته في النبرة واللغة.

    2.  **ابرز الفوائد لا الميزات:**
        * ركز على كيف يحل المنتج مشاكل العميل أو يحسن حياته.
        * لكل ميزة، اشرح بوضوح فائدتها المباشرة للمستخدم.
        * الهدف هو بيع "التجربة" أو "الحل" وليس مجرد المنتج.

    3.  **تجنب العبارات العامة والمبتذلة:**
        * لا تستخدم عبارات مثل "عالي الجودة" أو "فعال" بدون تفاصيل.
        * كن محددًا ودقيقًا قدر الإمكان في الوصف.
        * الوصف التفصيلي يبني المصداقية ويساعد العميل على تصور استخدام المنتج ويعزز الثقة.

    4.  **ادعم التفضيلات العليا بالحقائق (إن وجدت):**
        * إذا كان هناك ادعاء بأن المنتج "الأفضل" أو "الأسهل"، قدم أسبابًا وحقائق محددة تدعم هذا الادعاء.

    5.  **اللغة الحسية (إن أمكن):**
        * استخدم كلمات تصف كيف يبدو المنتج، رائحته، ملمسه، صوته، أو طعمه، لمساعدة العميل على تخيل التجربة.

    6.  **قابلية المسح (Scannability):**
        * استخدم العناوين الجذابة، والنقاط النقطية (bullet points)، والمساحات البيضاء لتسهيل القراءة.
        * اجعل النص منظماً وواضحاً بصرياً.

    7.  **تحسين محركات البحث (SEO):**
        * **ادمج الكلمات المفتاحية المستهدفة** التالية بشكل طبيعي وذكي في جميع أنحاء الوصف، خاصة في البداية والنهاية والعناوين الفرعية: **{seo_keywords}**
        * تأكد من أن الوصف يبدو طبيعيًا ومقنعًا للقراء البشر، وليس مجرد حشو كلمات مفتاحية.
        * اجعل الكلمات المفتاحية ذات صلة سياقية.
        * لا تستخدم علامات الـ HTML في الوصف نفسه.
        * تجنب تكرار الكلمات المفتاحية بشكل مبالغ فيه (keyword stuffing).
        * اجعل الوصف فريدًا وجذابًا.

    **اسم المنتج:** {product_title}
    **الميزات الرئيسية (افصل بينها بفاصلة):** {key_features}

    **السمات المطلوبة للوصف المحدد:**
    * **اللغة:** {language_instruction}
    * **النبرة:** {tone}
    * **الطول:** {length}
    * **الهيكل المقترح:**
        1.  عنوان رئيسي جذاب.
        2.  مقدمة آسرة تحدد حاجة العميل وتقدم المنتج كحل.
        3.  تفصيل الفوائد (لكل ميزة، اشرح الفائدة العائدة على العميل).
        4.  دعوة قوية للعمل (Call to Action).
    * استخدم الرموز التعبيرية 🌟 أو ✨ إذا كانت مناسبة للنبرة المختارة.
    * استخدم العناوين الفرعية لتنظيم الوصف وجعله قابلاً للمسح بصرياً (مثل: **وداعاً للمشاكل!، تجربة لا تُنسى:**).

    الآن، قم بتوليد الوصف للمنتج أعلاه بناءً على هذه التعليمات الشاملة مع دمج الكلمات المفتاحية لتحسين SEO:
    """

    try:
        response = model.generate_content(prompt)
        description = response.text
        return jsonify({"description": description}), 200
    except Exception as e:
        if "429 Quota Exceeded" in str(e):
            return jsonify({"error": "تجاوزت حدود الاستخدام المجانية (Quota)! يرجى الانتظار بضع دقائق والمحاولة مرة أخرى."}), 429
        return jsonify({"error": f"حدث خطأ في توليد الوصف: {str(e)}"}), 500

@app.route('/save-description', methods=['POST'])
def save_description():
    data = request.json
    description_text = data.get('description')
    product_title = data.get('product_title')
    key_features = data.get('key_features')
    seo_keywords = data.get('seo_keywords') # <--- حفظ الكلمات المفتاحية
    tone = data.get('tone')
    length = data.get('length')
    language = data.get('language')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    descriptions = load_descriptions()
    descriptions.append({
        "product_title": product_title,
        "key_features": key_features,
        "seo_keywords": seo_keywords, # <--- حفظ الكلمات المفتاحية
        "tone": tone,
        "length": length,
        "language": language,
        "description": description_text,
        "timestamp": timestamp
    })
    save_descriptions_to_file(descriptions)
    return jsonify({"message": "الوصف محفوظ بنجاح!"}), 200

@app.route('/get-history', methods=['GET'])
def get_history():
    descriptions = load_descriptions()
    return jsonify({"history": descriptions}), 200

@app.route('/clear-history', methods=['POST'])
def clear_history():
    save_descriptions_to_file([])
    return jsonify({"message": "تم مسح سجل الأوصاف بنجاح!"}), 200

if __name__ == '__main__':
    app.run(debug=True)