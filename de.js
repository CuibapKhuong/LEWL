function showPart(event, partId) {
    // 1. Chặn việc thẻ <a> làm trang web bị giật / cuộn lên đầu
    event.preventDefault();

    // 2. Ẩn tất cả các khối có chung class 'partSelection'
    const allSections = document.querySelectorAll('.partSelection');
    allSections.forEach(function(section) {
        section.style.display = 'none';
    });

    // 3. Chỉ hiển thị khối có ID trùng với nút vừa bấm
    const activeSection = document.getElementById(partId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

function factoryReset() {
    document.querySelectorAll('.answers[type="radio"]').forEach(function(answer) {
        answer.checked = false;
    });

    document.querySelectorAll('input[type="text"]').forEach(function(answer) {
        answer.value = '';
    });

    document.querySelectorAll('.correct-answer, .wrong-answer').forEach(function(answer) {
        answer.classList.remove('correct-answer', 'wrong-answer');
    });
    document.querySelectorAll('.correct-answer-text').forEach(function(feedback) {
        feedback.remove();
    });

    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
        finalScore.textContent = '';
    }

    document.querySelectorAll('.partSelection').forEach(function(section) {
        section.style.display = 'none';
    });

    const firstSection = document.getElementById('part1');
    if (firstSection) {
        firstSection.style.display = 'block';
    }
}

function normalizeAnswer(answer) {
    return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

function gradeQuiz() {
    const answerKey = {
        Q1: ['B'], Q2: ['B'], Q3: ['D'], Q4: ['D'],
        Q5: ['C'], Q6: ['A'], Q7: ['B'], Q8: ['A'],
        Q9: ['A'], Q10: ['B'], Q11: ['C'], Q12: ['A'],
        Q13: ['C'], Q14: ['A'], Q15: ['A'], Q16: ['C'],
        Q17: ['A'], Q18: ['C'], Q19: ['A'], Q20: ['C'],
        Q21: ['C'], Q22: ['A'], Q23: ['true'], Q24: ['false'],
        Q25: ['false'], Q26: ['true'], Q27: ['C'], Q28: ['C'],
        Q29: ['relaxation'], Q30: ['convenience'], Q31: ['peaceful'],
        Q32: ['friendly'], Q33: ['traditional'], Q34: ['stressful'],
        Q35: ['provide information'], Q36: ['provides an opportunity'],
        Q37: ['He is fond of walking every day because it helps improve his health.'],
        Q38: ['It took Johnny half an hour to clean his house yesterday.'],
        Q39: ['Mai usually does not finish her homework as fast as Hoa.', "Mai usually doesn't finish her homework as fast as Hoa."],
        Q40: ['The road was flooded; therefore, we stayed at home.']
    };

    let score = 0;
    Object.keys(answerKey).forEach(function(questionName) {
        const inputs = document.querySelectorAll('input[name="' + questionName + '"]');
        const selectedInput = document.querySelector('input[name="' + questionName + '"]:checked');
        const input = selectedInput || inputs[0];
        if (!input) {
            return;
        }

        const acceptedAnswers = answerKey[questionName].map(normalizeAnswer);
        if (input.type !== 'radio') {
            input.classList.remove('text-answer-correct', 'text-answer-wrong');
            const previousFeedback = document.getElementById(questionName + '-feedback');
            if (previousFeedback) {
                previousFeedback.remove();
            }

            const answer = normalizeAnswer(input.value);
            const isCorrect = acceptedAnswers.indexOf(answer) !== -1;
            input.classList.add(isCorrect ? 'text-answer-correct' : 'text-answer-wrong');
            if (!isCorrect) {
                const feedback = document.createElement('span');
                feedback.id = questionName + '-feedback';
                feedback.className = 'correct-answer-text';
                feedback.textContent = ' Correct answer: ' + answerKey[questionName][0];
                input.insertAdjacentElement('afterend', feedback);
            }
            if (isCorrect) {
                score += 1;
            }
            return;
        }

        if (input.type === 'radio') {
            inputs.forEach(function(radio) {
                const label = document.querySelector('label[for="' + radio.id + '"]');
                if (label) {
                    label.classList.remove('correct-answer', 'wrong-answer');
                    if (acceptedAnswers.indexOf(normalizeAnswer(radio.value)) !== -1) {
                        label.classList.add('correct-answer');
                    }
                    if (radio.checked && acceptedAnswers.indexOf(normalizeAnswer(radio.value)) === -1) {
                        label.classList.add('wrong-answer');
                    }
                }
            });
        }

        if (selectedInput &&
            acceptedAnswers.indexOf(normalizeAnswer(selectedInput.value)) !== -1) {
            score += 1;
        }
    });

    const finalScore = document.getElementById('finalScore');
    if (finalScore) {
        finalScore.textContent = 'Final score: ' + score + '/' + Object.keys(answerKey).length;
    }
}
