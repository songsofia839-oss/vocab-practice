# English Vocabulary Practice

Live Link: https://songsofia839-oss.github.io/vocab-practice/

A simple and interactive English vocabulary learning website designed for Chinese speakers like my parents (who are currently using it). Practice English vocabulary through Chinese-to-English translation and strengthen your memory through repeated exercises.

## Overview

English Vocabulary Practice allows users to create their own vocabulary quizzes by pasting a list of English words and their Chinese translations. The website automatically generates randomized questions and tracks learning progress.

No account registration or database is required. Simply paste your vocabulary list and start practicing!

<img width="715" height="590" alt="Screenshot 2026-11-12 at 11 04 08 PM" src="https://github.com/user-attachments/assets/5eb28475-0906-480a-9451-b70677953ce9" />


## Features

- **Custom Vocabulary Lists:** Paste your own English-Chinese vocabulary pairs into a single input field.
- **Randomized Questions:** Practice words in random order instead of following the original list.
- **Interactive Quizzes:** Translate Chinese prompts into English by typing your answers.
- **Progress Tracking:** Each word requires three correct answers to be marked as mastered.
- **Instant Feedback:** Receive immediate feedback on correct and incorrect answers.
- **Learning Progress:** Track the number of mastered words and your overall completion percentage.
- **No Registration Required:** Start practicing immediately without creating an account.
- **Privacy-Friendly:** No database or persistent storage. Your vocabulary lists and progress remain in the current session.

## How to Use

1. Open the website.
2. Paste your vocabulary list into the input area.
3. Separate each English word and its Chinese translation with a comma.
4. Put each vocabulary pair on a new line.
5. Click **Start Practicing**.
6. Read the Chinese translation and type the corresponding English word.
7. Answer each word correctly three times to master it.
8. Continue until all vocabulary words are completed!

### Input Format

```text
apple, 苹果
banana, 香蕉
computer, 电脑
beautiful, 美丽的
environment, 环境
```

## Learning Mechanism

Each vocabulary word has an individual progress counter.

| Action | Result |
|---|---|
| Correct answer | Progress increases by 1 |
| Incorrect answer | Progress remains unchanged |
| 3 correct answers | Word is marked as mastered |

Capitalization differences and unnecessary spaces are ignored when checking answers.

## Technology Stack

- Frontend: [Add your framework here]
- Styling: [Add your styling technology here]
- Deployment: [Add your hosting platform here]

## Future Improvements

Potential features for future development:

- Track incorrect answers and identify difficult vocabulary.
- Add a review mode for completed words.
- Provide hints for challenging vocabulary.
- Support alternative English translations.
- Add more flexible learning and practice modes.

## Privacy

This website does not require user accounts and does not store vocabulary lists or learning progress in a database. Refreshing the page resets the current practice session.

## Getting Started Locally

If you want to run the project locally:

```bash
# Clone the repository
git clone YOUR_REPOSITORY_URL

# Navigate into the project
cd YOUR_PROJECT_FOLDER

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

Made for my parents and general English learners who want to build their vocabulary one word at a time!
