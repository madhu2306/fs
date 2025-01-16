import re
import pandas as pd
import spacy
from flask import Flask, render_template, request
from transformers import GPT2LMHeadModel, GPT2Tokenizer
# Load SpaCy model
nlp = spacy.load("en_core_web_sm")
# Flask setup
app = Flask(__name__)
# Load the GPT-2 tokenizer and model
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
# Load the dataset from the specified file path
dataset = pd.read_csv('dialogs.txt', delimiter="\t", header=None, names=["question", "answer"])
# Define the clean_text function to preprocess text data
def clean_text(text):
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.lower()
    return text
# Define the remove_repeating_sentences function to remove repeating sentences from a dataset
def remove_repeating_sentences(dataset):
    seen_sentences = set()
    filtered_dataset = []
    for index, row in dataset.iterrows():
        if row["question"] not in seen_sentences:
            seen_sentences.add(row["question"])
            filtered_dataset.append(row)
    return pd.DataFrame(filtered_dataset)
# Preprocess the dataset
dataset = dataset.dropna()
dataset["question"] = dataset["question"].apply(clean_text)
dataset["answer"] = dataset["answer"].apply(clean_text)
dataset = remove_repeating_sentences(dataset)
# Flask route for chatbot and dataset
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/chat', methods=['POST'])
def chat():
    if request.method == 'POST':
        user_input = request.form['user_input']
        user_input = clean_text(user_input)
        # Check if the user input matches any question in the preprocessed dataset
        matching_row = dataset[dataset['question'] == user_input]
        if not matching_row.empty:
            # If a matching question is found, retrieve the corresponding answer
            bot_response = matching_row['answer'].values[0]
        else:
            # If no matching question is found, generate a response using the GPT-2 model
            input_ids = tokenizer.encode(user_input, return_tensors='pt')
            output = model.generate(input_ids, max_length=100, num_return_sequences=1)
            bot_response = tokenizer.decode(output[0], skip_special_tokens=True)
        return render_template('index.html', user_input=user_input, bot_response=bot_response)
    return render_template('index.html')
@app.route('/dataset')
def show_dataset():
    return render_template('dataset.html', data=dataset.to_dict(orient='records'))
if __name__ == '__main__':
    app.run(debug=True)
