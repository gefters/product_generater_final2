from dotenv import load_dotenv # استيراد دالة تحميل المتغيرات
load_dotenv() # تحميل متغيرات البيئة من ملف .env
import datetime
from datetime import datetime # تم استيرادها مرة أخرى هنا لتجنب خطأ الاسم
import json
import os
# استيراد مكتبات نماذج الذكاء الاصطناعي

# --- تفعيل OpenAI ---
#from openai import OpenAI

 #--- تجميد Google Gemini ---
 import google.generativeai as genai
 
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# --- تهيئة نموذج الذكاء الاصطناعي ---
# الخيار 1: استخدام OpenAI (مفعل الآن)
# تأكد من أن لديك OPENAI_API_KEY في ملف .env
#client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
# اسم النموذج الأفضل: 'gpt-4o-mini'
#AI_MODEL_NAME = 'gpt-4o-mini' # تم تعيين النموذج لـ gpt-4o-mini

# الخيار 2: استخدام Google Gemini (مجمد حاليًا)
 genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))
 AI_MODEL_NAME = 'gemini-1.5-pro-latest'
 model = genai.GenerativeModel(AI_MODEL_NAME)


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
    # تأكد من أن الميزات الرئيسية هي قائمة أو يتم تقسيمها بشكل صحيح
    key_features_str = data.get('key_features', '')
    key_features = [f.strip() for f in key_features_str.split(',') if f.strip()] # تحويل السلسلة إلى قائمة

    seo_keywords_str = data.get('seo_keywords', '')
    seo_keywords = [k.strip() for k in seo_keywords_str.split(',') if k.strip()] # تحويل السلسلة إلى قائمة

    tone = data.get('tone', 'marketing')
    length = data.get('length', 'medium')
    language = data.get('language', 'arabic')

    if not product_title or not key_features or not seo_keywords:
        return jsonify({"error": "الرجاء توفير عنوان المنتج، الميزات الرئيسية، والكلمات المفتاحية المستهدفة."}), 400

    # --- بناء تعليمات اللغة ---
    language_instruction = ""
    if language == "arabic":
        language_instruction = "باللغة العربية الفصحى."
    elif language == "english":
        language_instruction = "in English."
    elif language == "spanish":
        language_instruction = "en Español."
    else: # في حال اختيار لغة غير مدعومة، الافتراضي هو العربية
        language_instruction = "باللغة العربية الفصحى."


    # --- بناء تعليمات النبرة ---
    prompt_tone_instruction = ""
    if tone == "marketing":
        prompt_tone_instruction = "النبرة: تسويقية مقنعة. ركز على الفوائد العاطفية للمستخدم وحفزه على اتخاذ قرار الشراء. استخدم لغة جذابة ومبتكرة."
    elif tone == "friendly":
        prompt_tone_instruction = "النبرة: ودودة وغير رسمية. اجعل الوصف سهل القراءة وكأن صديقًا يتحدث."
    elif tone == "formal":
        prompt_tone_instruction = "النبرة: رسمية ومهنية. ركز على الحقائق والمواصفات الدقيقة والمصداقية."
    elif tone == "luxury":
        prompt_tone_instruction = "النبرة: فاخرة وحصرية. استخدم لغة راقية تعكس الجودة العالية والتفرد."
    elif tone == "humorous":
        prompt_tone_instruction = "النبرة: فكاهية ومرحة. استخدم بعض الفكاهة الخفيفة لجذب الانتباه وجعل الوصف ممتعًا."


    # --- بناء تعليمات الطول (مع تقدير الكلمات/التوكنز) ---
    prompt_length_instruction = ""
    if length == "short":
        # 40 كلمة تعادل تقريباً 60 توكن (للسلامة، قد تزيد قليلاً في العربية)
        prompt_length_instruction = "الطول: **قصير جدًا (بحد أقصى 40 كلمة)**. يجب أن يكون الوصف موجزًا للغاية ويركز على نقطة بيع رئيسية واحدة. **لا تتجاوز 40 كلمة بأي شكل من الأشكال.**"
    elif length == "medium":
        # 100-200 كلمة تعادل تقريباً 150-300 توكن
        prompt_length_instruction = "الطول: **متوسط (100-200 كلمة)**. قم بتغطية الميزات والفوائد الرئيسية بالتفصيل الكافي، مع الحفاظ على الإيجاز. هذا الطول يسمح بتفصيل جيد دون إطالة."
    elif length == "long":
        # 250-400 كلمة تعادل تقريباً 375-600 توكن
        prompt_length_instruction = "الطول: **طويل ومفصل (250-400 كلمة)**. اشرح كل ميزة بعمق، وقدم سيناريوهات استخدام، وقدم معلومات شاملة. هذا الطول مناسب لصفحات المنتجات التي تتطلب تفصيلاً شاملاً لتحسين محركات البحث."


    # --- بناء الـ Prompt المحسّن بالكامل (متوافق مع OpenAI Chat Completions API) ---
    prompt_messages = [
        {
            "role": "system",
            "content": """
            أنت خبير تسويق إبداعي وتحسين محركات البحث (SEO)، ولديك معرفة عميقة بما يجعل وصف المنتج مقنعًا ويحقق المبيعات ويحتل مراتب متقدمة في نتائج البحث.
            مهمتك هي كتابة وصف تسويقي مفصل وجذاب ومحسن لمحركات البحث (SEO) لمنتج معين.
            """
        },
        {
            "role": "user",
            "content": f"""
            **معلومات المنتج:**
            اسم المنتج: {product_title}
            الميزات الرئيسية (نقطية):
            {chr(10).join([f"- {feat}" for feat in key_features])}
            الكلمات المفتاحية المستهدفة: {', '.join(seo_keywords)}

            **السمات المطلوبة للوصف:**
            - **اللغة:** {language_instruction}
            - **النبرة:** {prompt_tone_instruction}
            - **الطول:** {prompt_length_instruction}

            **توجيهات إضافية لجودة الوصف:**
            1.  **استهدف العميل المثالي:** تحدث مباشرة وشخصيًا إلى الجمهور المستهدف. استخدم لغة ومفردات تتناسب مع العميل المثالي (توقع ما قد يسألون عنه). اجعل العميل يشعر بالاندماج باستخدام كلمة "أنت".
            2.  **ابرز الفوائد لا الميزات:** ركز على كيف يحل المنتج مشاكل العميل أو يحسن حياته. لكل ميزة، اشرح بوضوح فائدتها المباشرة للمستخدم. الهدف هو بيع "التجربة" أو "الحل" وليس مجرد المنتج.
            3.  **تجنب العبارات العامة والمبتذلة:** لا تستخدم عبارات مثل "عالي الجودة" أو "فعال" بدون تفاصيل. كن محددًا ودقيقًا قدر الإمكان في الوصف. الوصف التفصيلي يبني المصداقية ويساعد العميل على تصور استخدام المنتج ويعزز الثقة.
            4.  **ادعم التفضيلات العليا بالحقائق (إن وجدت):** إذا كان هناك ادعاء بأن المنتج "الأفضل" أو "الأسهل"، قدم أسبابًا وحقائق محددة تدعم هذا الادعاء.
            5.  **اللغة الحسية (إن أمكن):** استخدم كلمات تصف كيف يبدو المنتج، رائحته، ملمسه، صوته، أو طعمه، لمساعدة العميل على تخيل التجربة.
            6.  **قابلية المسح (Scannability):** استخدم العناوين الجذابة، والنقاط النقطية (bullet points)، والمساحات البيضاء لتسهيل القراءة. اجعل النص منظماً وواضحاً بصرياً.
            7.  **تحسين محركات البحث (SEO):**
                * ادمج الكلمات المفتاحية المستهدفة بشكل طبيعي وذكي في جميع أنحاء الوصف، خاصة في البداية والنهاية والعناوين الفرعية.
                * تأكد من أن الوصف يبدو طبيعيًا ومقنعًا للقراء البشر، وليس مجرد حشو كلمات مفتاحية.
                * اجعل الكلمات المفتاحية ذات صلة سياقية.
                * لا تستخدم علامات الـ HTML في الوصف نفسه.
                * تجنب تكرار الكلمات المفتاحية بشكل مبالغ فيه (keyword stuffing).
                * اجعل الوصف فريدًا وجذابًا.
            8.  **تجنب التكرار في الصياغة:** لا تكرر نفس الجملة الافتتاحية أو العبارات المستخدمة بشكل مبالغ فيه. استخدم مرادفات متنوعة وصياغات مختلفة لضمان الأصالة والتفرد.

            **الهيكل المقترح للوصف:**
            -   عنوان رئيسي جذاب (H1).
            -   مقدمة آسرة تحدد حاجة العميل وتقدم المنتج كحل.
            -   تفصيل الفوائد والميزات في فقرات أو نقاط نقطية (لكل ميزة، اشرح الفائدة العائدة على العميل).
            -   فقرة عن تجربة المستخدم أو كيف يحل المنتج مشكلة.
            -   دعوة قوية للعمل (Call to Action) في النهاية.

            استخدم الرموز التعبيرية 🌟 أو ✨ أو غيرها إذا كانت مناسبة للنبرة المختارة وتزيد من جاذبية الوصف.
            استخدم العناوين الفرعية لتنظيم الوصف وجعله قابلاً للمسح بصرياً (مثل: **وداعاً للمشاكل!، تجربة لا تُنسى:**).

            الآن، قم بتوليد الوصف للمنتج أعلاه بناءً على هذه التعليمات الشاملة:
            """
        }
    ]

    try:
        # --- استدعاء API لـ OpenAI (مفعل الآن) ---
       # response = client.chat.completions.create(
          #  model=AI_MODEL_NAME,
         #   messages=prompt_messages,
           # temperature=0.7, # قيمة بين 0 و 1 للتحكم في الإبداع (0 أقل إبداعًا، 1 أكثر إبداعًا)
           # max_tokens=600 # الحد الأقصى للتوكنز المخرجة لتجنب التكاليف العالية جدًا
        #)
       # description = response.choices[0].message.content

        # --- استدعاء API لـ Google Gemini (مجمد حاليًا) ---
         response = model.generate_content(prompt_messages)
         description = response.text


        return jsonify({"description": description}), 200
    except Exception as e:
        # رسالة خطأ عامة لأي مشكلة في الـ API، مع محاولة التحديد لـ Rate Limit
        if "rate limit" in str(e).lower() or "429" in str(e):
            return jsonify({"error": "تجاوزت حدود الاستخدام (Rate Limit)! يرجى الانتظار بضع دقائق والمحاولة مرة أخرى."}), 429
        return jsonify({"error": f"حدث خطأ في توليد الوصف: {str(e)}"}), 500

@app.route('/save-description', methods=['POST'])
def save_description():
    data = request.json
    description_text = data.get('description')
    product_title = data.get('product_title')
    key_features = data.get('key_features')
    seo_keywords = data.get('seo_keywords')
    tone = data.get('tone')
    length = data.get('length')
    language = data.get('language')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    descriptions = load_descriptions()
    descriptions.append({
        "product_title": product_title,
        "key_features": key_features,
        "seo_keywords": seo_keywords,
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