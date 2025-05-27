# AI Product Description Generator (Flask & Google Gemini AI)

This project is a simple web application built with the **Flask** Python framework that allows you to generate professional, engaging, and **SEO-optimized** product descriptions using the power of **Google Gemini AI (specifically the Gemini 1.5 Flash Latest model)**. The application provides an intuitive and **multi-language** user interface to input product details, **target SEO keywords**, choose the description's tone and length, then generate, save, and view a history of all generated descriptions.

---

## Features

* **AI-Powered Generation:** Generate unique product descriptions using Google Gemini AI (Gemini 1.5 Flash Latest).
* **Multi-Language Description Output:** Generate descriptions in Arabic, English, or Spanish.
* **SEO Optimization:** Include target SEO keywords which are intelligently integrated into the generated description to improve search engine visibility.
* **Customizable Tone:** Choose from various tones (e.g., Marketing, Friendly, Formal, Humorous, Informative) to match your brand's voice.
* **Adjustable Length:** Control the description's length (Short, Medium, Long) to suit your needs.
* **Multi-Language UI:** The user interface itself can be toggled between Arabic and English for a localized experience.
* **Description History:** Save generated descriptions with a timestamp for future reference.
* **View Saved History:** Browse a scrollable list of all previously saved descriptions, including their product details and SEO keywords.
* **Clear History:** Easily clear the entire history of saved descriptions.
* **Clean and Intuitive Interface:** A user-friendly design built with HTML, CSS, and JavaScript.
* **Robust Error Handling:** Provides clear messages for API issues (e.g., quota exceeded), server connection problems, and invalid inputs.
* **Responsive Design:** Optimized for a seamless experience across various devices and screen sizes.

---

## Requirements

To run this application, you'll need:

* **Python 3.8 or newer:** Python 3.10+ is highly recommended for best compatibility and performance.
* **pip:** Python's package installer.
* **A Google Gemini API Key:** You'll need to obtain your own API key from the [Google AI Studio](https://ai.google.dev/). Without this key, the description generation part of the application will not work.

---

## Installation & Setup Guide

Follow these simple, step-by-step instructions to get the application running on your machine:

1.  **Unzip the Project Files:**
    Extract the downloaded project ZIP file into a folder of your choice (e.g., `ai_product_generator/`).

2.  **Open Your Terminal/Command Prompt:**
    Navigate into the project folder you just unzipped using your terminal or command prompt.
    Example:
    ```bash
    cd path/to/your/ai_product_generator
    ```

3.  **Create and Activate a Virtual Environment (Highly Recommended):**
    Using a virtual environment keeps your project's dependencies separate from other Python projects on your system.

    * **Create the environment:**
        ```bash
        python -m venv venv
        ```
    * **Activate the environment:**
        * On **Windows:**
            ```bash
            venv\Scripts\activate
            ```
        * On **macOS and Linux:**
            ```bash
            source venv/bin/activate
            ```

4.  **Install Required Libraries:**
    With your virtual environment activated, install all necessary Python libraries for the project using the `requirements.txt` file:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Configure Your Google Gemini API Key:**
    Open the `app.py` file located in your project's main folder. Find the line that looks like this:
    ```python
    genai.configure(api_key='YOUR_API_KEY_HERE')
    ```
    Replace `'YOUR_API_KEY_HERE'` with your actual Google Gemini API key.

    **More Secure Method (Recommended for Developers):** Alternatively, you can set your API key as an environment variable named `GEMINI_API_KEY` before running the application.
    * On **Windows** (in your Command Prompt before running `python app.py`):
        ```bash
        set GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```
    * On **macOS and Linux** (in your Terminal before running `python app.py`):
        ```bash
        export GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```
    If you use this method, ensure the line in `app.py` is:
    ```python
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    ```

6.  **Run the Application:**
    With your virtual environment activated and API key configured, run the Flask application:
    ```bash
    python app.py
    ```
    You'll see a message in your terminal indicating that the application is running, typically on: `http://127.0.0.1:5000/`

7.  **Access the Application:**
    Open your web browser and navigate to the address: `http://127.0.0.1:5000/`

---

## Project Structure